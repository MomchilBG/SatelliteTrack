import axios from 'axios';
import type { Satellite } from '../Types/satellite.ts';

export const fetchData = async (): Promise<Satellite> => {
  try {
    const response = await axios.get<Satellite>('http://localhost:5001/iss', {
      responseType: 'json',
    });

    return (
      response?.data ?? {
        updatedAt: new Date(),
        positionGeodetic: { longitude: 0, latitude: 0, height: 0 },
        degreesLat: 0,
        degreesLong: 0,
        name: '',
        id: '',
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      updatedAt: new Date(),
      positionGeodetic: { longitude: 0, latitude: 0, height: 0 },
      degreesLat: 0,
      degreesLong: 0,
      name: '',
      id: '',
    };
  }
};
