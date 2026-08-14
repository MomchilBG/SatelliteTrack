import { fetchSatelliteTLE } from './requests.js';

export const splitTLEs = (tles) => {
  const splitTLEs = tles.join('').split(/\r?\n/);
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

export const setResponse = (lastUpdated, satellites) => {
  lastUpdated = new Date();
  console.log(
    `Updated data:\n${satellites
      .map((e) =>
        Object.entries(e)
          .map((line) => line.join(': '))
          .join('\n'),
      )
      .join(
        '\n\n',
      )}\n\nTLE updated at: ${lastUpdated}\n----------------------------------------------------------------------------\n\n`,
  );
};

export const getData = async (noradIDs) => {
  try {
    const requests = noradIDs.map((id) => fetchSatelliteTLE(id));
    return Promise.all(requests);
  } catch (e) {
    console.log('Error fetching data:', e.message);
  }
};
