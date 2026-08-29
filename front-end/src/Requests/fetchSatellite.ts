import axios from 'axios';
import type { APIResponse } from '../Types/satellite.ts';

export const fetchData = async (path: string): Promise<APIResponse> => {
  if (typeof path !== 'string') {
    throw new Error('path argument must be a string');
  }

  return await axios
    .get<APIResponse>(`http://localhost:5001/${path}`, {
      responseType: 'json',
    })
    .then((response) =>
      response.data
        ? response.data
        : { success: false, satellites: null, message: '' },
    )
    .catch((e) => {
      console.log('Error fetching data:', e);
      return {
        success: false,
        satellites: null,
        message: 'Failed to fetch TLEs',
      };
    });
};
