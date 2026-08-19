import { fetchSatelliteTLE } from './requests.js';

const splitTLEs = (tles) => {
  const now = new Date();
  const satellites = tles.reduce((prev, tle) => {
    if (tle.success === true) {
      const splitTLE = tle.contents.split(/\r?\n/);
      const orderedTLE = {
        name: splitTLE[0].trim(),
        id: splitTLE[1].substring(2, 7).trim(),
        line1: splitTLE[1].trim(),
        line2: splitTLE[2].trim(),
        lastUpdated: now,
      };
      return { ...prev, [+orderedTLE.id]: orderedTLE };
    } else {
      return { ...prev };
    }
  }, {});

  return satellites;
};

const setResponse = (satellites) => {
  console.log(
    `Updated data:\n${Object.values(satellites)
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
      )}\n\n----------------------------------------------------------------------------\n\n`,
  );
};

const getData = async (noradIDs) => {
  try {
    const requests = noradIDs.map((id) => fetchSatelliteTLE(id));
    return Promise.all(requests);
  } catch (e) {
    console.log('Error fetching data:', e.message);
    return [];
  }
};

export const updateTLE = async (noradIDs, TLEs = {}) => {
  try {
    const nowInMs = new Date().valueOf();
    const TLEsCopy = { ...TLEs };
    const noradIDsCopy = noradIDs.map(Number);
    const outdatedIDs = noradIDsCopy.filter((id) => {
      if (
        TLEsCopy[id] === undefined ||
        nowInMs - TLEsCopy[id].lastUpdated.valueOf() > 7200000
      ) {
        return id;
      }
    });

    if (outdatedIDs.length === 0) {
      return [TLEsCopy, null];
    }
    const freshTLEs = await getData(outdatedIDs);

    outdatedIDs.map((id, index) => {
      if (freshTLEs[index].success === true) {
        const freshSat = splitTLEs([freshTLEs[index]]);
        setResponse(freshSat);
        TLEsCopy[id] = freshSat[id];
      } else {
        console.log(`Update for satellite with Norad ID ${id} has failed.`);
      }
    });

    return [TLEsCopy, freshTLEs];
  } catch (e) {
    console.log(`Error occured while updating TLE: ${e.message}`);
    return [TLEs, null];
  }
};
