import axios from 'axios';
import type { APIResponse } from '../Types/satellite.ts';

export const postSatellite = async (noradID: string): Promise<APIResponse> => {
  if (typeof noradID !== 'string') {
    throw new Error('noradID argument must be a string');
  }

  return await axios
    .post<APIResponse>(`http://localhost:5001/add_sat`, { noradID: noradID })
    .then((response) => response.data)
    .catch((error) => {
      console.log(`Error posting satellite: ${error}`);
      return {
        success: false,
        satellites: null,
        message: 'Post request failed',
      };
    });
};
