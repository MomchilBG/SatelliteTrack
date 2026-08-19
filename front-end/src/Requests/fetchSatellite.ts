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
        satellites: [
          {
            name: '',
            id: '',
            line1: '',
            line2: '',
            lastUpdated: new Date(),
          },
        ],
        message: '',
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      success: false,
      satellites: [
        {
          name: '',
          id: '',
          line1: '',
          line2: '',
          lastUpdated: new Date(),
        },
      ],
      message: '',
    };
  }
};
