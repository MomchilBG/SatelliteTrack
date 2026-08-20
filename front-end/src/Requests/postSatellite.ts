import axios from 'axios';
import type { APIResponse } from '../Types/satellite.ts';

export const postSatellite = (noradID: string): Promise<APIResponse> =>
  axios
    .post(`http://localhost:5001/add_sat`, { noradID: noradID })
    .then((response) => response.data)
    .catch((error) => {
      console.log(`Error posting satellite: ${error}`);
      return {
        success: false,
        satellites: null,
        message: 'Post request failed',
      };
    });
