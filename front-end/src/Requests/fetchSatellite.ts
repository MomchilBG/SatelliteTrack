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
        name: '',
        id: '',
        line1: '',
        line2: '',
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      name: '',
      id: '',
      line1: '',
      line2: '',
    };
  }
};
