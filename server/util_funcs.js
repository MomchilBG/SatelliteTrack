import { fetchSatelliteTLE } from './requests.js';

const splitTLEs = (tles) => {
  if (!(tles instanceof Array)) {
    throw new Error('tles argument must be an array');
  }

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
  if (!(satellites instanceof Object)) {
    throw new Error('satellites argument must be an object');
  }

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
  if (!(noradIDs instanceof Array)) {
    throw new Error('noradIDs argument must be an array');
  }

  try {
    const requests = noradIDs.map((id) => fetchSatelliteTLE(id));
    return Promise.all(requests);
  } catch (e) {
    console.log('Error fetching data:', e.message);
    return [];
  }
};

export const updateTLE = async (
  noradIDs,
  TLEs = {},
  fetchData = getData,
  splitData = splitTLEs,
  logData = setResponse,
) => {
  if (!(noradIDs instanceof Array)) {
    throw new Error('noradIDs argument must be an array');
  }

  if (!(TLEs instanceof Object)) {
    throw new Error('TLEs argument must be an object');
  }

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
      return [TLEs, null];
    }
    const freshTLEs = await fetchData(outdatedIDs);

    outdatedIDs.map((id, index) => {
      if (freshTLEs[index].success === true) {
        const freshSat = splitData([freshTLEs[index]]);
        logData(freshSat);
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
