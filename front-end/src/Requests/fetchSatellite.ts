import axios from 'axios';
import type { Satellite } from '../Types/satellite.ts';

export const fetchData = async (satellite: string): Promise<Satellite> => {
  try {
    const response = await axios.get<Satellite>(
      `http://localhost:5001/${satellite}`,
      {
        responseType: 'json',
      },
    );

    return (
      response?.data ?? {
        location: { degreesLong: 0, degreesLat: 0, height: 0, velocity: 0 },
        name: '',
        id: '',
        path: [[[0, 0]]],
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      location: { degreesLong: 0, degreesLat: 0, height: 0, velocity: 0 },
      name: '',
      id: '',
      path: [[[0, 0]]],
    };
  }
};
