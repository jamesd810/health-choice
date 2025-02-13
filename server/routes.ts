// Install dependencies first:
// npm init -y
// npm install express cors dotenv aws-sdk fs csv-parser
// npm install --save-dev typescript ts-node nodemon @types/node @types/express

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import fs from "fs";
import csv from "csv-parser";

dotenv.config();
const app = express();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

app.use(cors());
app.use(express.json());

// Get all diseases
app.get("/diseases", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };
  try {
    const data = await dynamoDb.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single disease by ID
app.get("/diseases/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  try {
    const data = await dynamoDb.get(params).promise();
    if (!data.Item)
      return res.status(404).json({ message: "Disease not found" });
    res.json(data.Item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new disease
app.post("/diseases", async (req, res) => {
  const { id, name, description, mitigation } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Item: { id, name, description, mitigation },
  };
  try {
    await dynamoDb.put(params).promise();
    res.status(201).json({ message: "Disease added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk insert diseases
app.post("/diseases/bulk", async (req, res) => {
  const diseases = req.body;
  const putRequests = diseases.map((disease) => ({
    PutRequest: { Item: disease },
  }));

  const params = {
    RequestItems: {
      [TABLE_NAME]: putRequests,
    },
  };

  try {
    await dynamoDb.batchWrite(params).promise();
    res.status(201).json({ message: "Diseases added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load CDC data from JSON file into DynamoDB
app.post("/diseases/load-cdc", async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("cdc_data.json", "utf8"));
    const putRequests = data.map((disease) => ({
      PutRequest: { Item: disease },
    }));

    const params = {
      RequestItems: { [TABLE_NAME]: putRequests },
    };

    await dynamoDb.batchWrite(params).promise();
    res.status(201).json({ message: "CDC data loaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a disease
app.put("/diseases/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, mitigation } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set name = :name, description = :description, mitigation = :mitigation",
    ExpressionAttributeValues: {
      ":name": name,
      ":description": description,
      ":mitigation": mitigation,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    await dynamoDb.update(params).promise();
    res.json({ message: "Disease updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a disease
app.delete("/diseases/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  try {
    await dynamoDb.delete(params).promise();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
