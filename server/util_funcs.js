import { NORAD_IDS } from './constants.js';
import { fetchSatelliteTLE } from './requests.js';

const splitTLEs = (tles) => {
  const splitTLEs = tles.split(/\r?\n/);
  const satellites = [];

  for (let i = 0; i < splitTLEs.length - 1; i += 3) {
    const satellite = {
      name: splitTLEs[i].trim(),
      id: splitTLEs[i + 1].substring(2, 7).trim(),
      line1: splitTLEs[i + 1].trim(),
      line2: splitTLEs[i + 2].trim(),
    };

    satellites.push(satellite);
  }

  return satellites;
};

const setResponse = (response, satellites) => {
  response.updatedAt = new Date();
  response.satellites = satellites;
  console.log(
    `Updated data:\n${response.satellites
      .map((e) =>
        Object.entries(e)
          .map((line) => line.join(': '))
          .join('\n'),
      )
      .join('\n\n')}\n\nTLE updated at: ${response.updatedAt}`,
  );
};

export const getData = async (tles, satellites, response) => {
  try {
    const requests = Object.values(NORAD_IDS).map((id) =>
      fetchSatelliteTLE(id),
    );
    tles = await Promise.all(requests);
    satellites = splitTLEs(tles.join(''));
    setResponse(response, satellites);
  } catch (e) {
    console.log('Error fetching data:', e.message);
  }
};
