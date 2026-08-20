import axios from 'axios';
import type { APIResponse } from '../Types/satellite.ts';

export const fetchData = async (satellite: string): Promise<APIResponse> => {
  try {
    const response = await axios.get<APIResponse>(
      `http://localhost:5001/${satellite}`,
      {
        responseType: 'json',
      },
    );

    return (
      response?.data ?? {
        success: false,
        satellites: null,
        message: '',
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      success: false,
      satellites: null,
      message: 'Failed to fetch TLEs',
    };
  }
};
