import axios from 'axios';
import type { APIResponse } from '../Types/satellite.ts';

export const fetchData = (satellite: string): Promise<APIResponse> =>
  axios
    .get<APIResponse>(`http://localhost:5001/${satellite}`, {
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
