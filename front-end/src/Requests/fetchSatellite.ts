import axios from 'axios';
import type { fetchedTLEs } from '../Types/satellite.ts';

export const fetchData = async (
  satellite: string,
): Promise<fetchedTLEs | fetchedTLEs[]> => {
  try {
    const response = await axios.get<fetchedTLEs | fetchedTLEs[]>(
      `http://localhost:5001/${satellite}`,
      {
        responseType: 'json',
      },
    );

    return (
      response?.data ?? {
        line1: '',
        line2: '',
        name: '',
        id: '',
        ORBIT_POINTS: 0,
        PERIOD_BETWEEN_POINTS: 0,
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      line1: '',
      line2: '',
      name: '',
      id: '',
      ORBIT_POINTS: 0,
      PERIOD_BETWEEN_POINTS: 0,
    };
  }
};
