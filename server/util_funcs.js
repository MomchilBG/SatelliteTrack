import { ISS, NORAD_IDS } from './constants.js';
import * as satellite from 'satellite.js';
import { fetchSatelliteTLE } from './requests.js';

export const splitTLEs = (tles) => {
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

export const setResponse = (response, satellites) => {
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

export const convertTLEtoCoords = (line1, line2, time = new Date()) => {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, time);
  if (positionAndVelocity === null) {
    return null;
  }

  const { position, velocity } = positionAndVelocity;
  const gst = satellite.gstime(time);

  const { latitude, longitude, height } = satellite.eciToGeodetic(
    position,
    gst,
  );

  const [degreesLat, degreesLong] = [
    satellite.degreesLat(latitude),
    satellite.degreesLong(longitude),
  ];

  return {
    height,
    degreesLat,
    degreesLong,
    velocity: Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2),
  };
};

export const getSatellitePath = (satellite, orbit_points, period) => {
  const markersCoordinates = [];
  let coordinatesUpToTheAntimeridian = [];

  for (let markerIndex = 1; markerIndex <= orbit_points; markerIndex++) {
    const currentTime = new Date();
    const prevCoord =
      coordinatesUpToTheAntimeridian[
        coordinatesUpToTheAntimeridian.length - 1
      ] || null;

    const { degreesLat, degreesLong } = convertTLEtoCoords(
      satellite.line1,
      satellite.line2,
      new Date(
        currentTime.setSeconds(currentTime.getSeconds() + markerIndex * period),
      ),
    );

    if (prevCoord !== null && prevCoord[1] > degreesLong) {
      markersCoordinates.push(coordinatesUpToTheAntimeridian);
      coordinatesUpToTheAntimeridian = [];
    } else {
      coordinatesUpToTheAntimeridian.push([degreesLat, degreesLong]);
    }
  }

  markersCoordinates.push(coordinatesUpToTheAntimeridian);

  return markersCoordinates;
};
