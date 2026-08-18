import { fetchSatelliteTLE } from './requests.js';

export const splitTLEs = (tles) => {
  const satellites = tles.map((tle) => {
    if (tle.success === true) {
      const splitTLE = tle.contents.split(/\r?\n/);
      return {
        name: splitTLE[0].trim(),
        id: splitTLE[1].substring(2, 7).trim(),
        line1: splitTLE[1].trim(),
        line2: splitTLE[2].trim(),
      };
    } else {
      return null;
    }
  });

  return satellites;
};

export const setResponse = (lastUpdated, satellites) => {
  lastUpdated = new Date();
  console.log(
    `Updated data:\n${satellites
      .map((sat) => {
        if (sat !== null) {
          return Object.entries(sat)
            .map((line) => line.join(': '))
            .join('\n');
        } else {
          return 'No GP data found';
        }
      })
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
    return [];
  }
};
