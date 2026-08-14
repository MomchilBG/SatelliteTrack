import axios from 'axios';
import type { PostSatelliteResponse } from '../Types/satellite';

export const postSatellite = (
  noradID: number,
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
      };
    });
