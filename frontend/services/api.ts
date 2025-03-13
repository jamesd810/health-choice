import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchHealthCondition = async (condition: string) => {
  try {
    const response = await axios.get(`${API_URL}/health/${condition}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health data:', error);
    return null;
  }
};
