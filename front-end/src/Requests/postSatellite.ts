import axios from 'axios';
import type { PostSatelliteResponse } from '../Types/satellite.ts';

export const postSatellite = (
  noradID: string,
): Promise<PostSatelliteResponse> =>
  axios
    .post(`http://localhost:5001/add_sat`, { noradID: noradID })
    .then((response) => response.data)
    .catch((error) => {
      console.log(`Error posting satellite: ${error}`);
      return {
        success: false,
        satellite: {
          name: '',
          id: '',
          line1: '',
          line2: '',
        },
        message: '',
      };
    });
