import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.get('/api/health/:condition', async (req: Request, res: Response) => {
  const { condition } = req.params;

  try {
    // Example API call (Replace with actual health API)
    const healthResponse = await axios.get(
      `https://api.example.com/health?query=${condition}`,
    );
    const healthData = healthResponse.data;

    if (!healthData) {
      res.status(404).json({ error: 'Condition not found' });
    }

    // Example YouTube API call for recipe videos (Replace with actual API)
    const videoResponse = await axios.get(
      `https://api.example.com/videos?query=${condition} treatment`,
    );
    const videos = videoResponse.data.items.map((video: any) => ({
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));

    // Example Google Places API call for nearby restaurants (Replace with actual API)
    const restaurantResponse = await axios.get(
      `https://api.example.com/nearby-restaurants?query=${condition}`,
    );
    const restaurants = restaurantResponse.data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      url: `https://maps.google.com/?q=${place.name}`,
    }));

    res.json({
      condition: healthData.name,
      description: healthData.description,
      treatment: healthData.treatment,
      videos,
      restaurants,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
