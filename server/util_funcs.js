import * as satellite from 'satellite.js';

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

export const convertTLEtoCoords = (line1, line2, time = new Date()) => {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, time);
  if (positionAndVelocity === null) {
    return 'no longer in orbit';
  }

  const positionEci = positionAndVelocity.position;
  const gst = satellite.gstime(time);

  const positionGeodetic = satellite.eciToGeodetic(positionEci, gst);
  const radiansLat = positionGeodetic.latitude;
  const radiansLong = positionGeodetic.longitude;

  const [degreesLat, degreesLong] = [
    satellite.degreesLat(radiansLat),
    satellite.degreesLong(radiansLong),
  ];

  return { positionGeodetic, degreesLat, degreesLong };
};

export const getSatellitePath = (satellite) => {
  const markersCoordinates = [];
  let coordinatesUpToTheAntimeridian = [];

  for (let markerIndex = 1; markerIndex <= 1150; markerIndex++) {
    const currentTime = new Date();
    const prevCoord =
      coordinatesUpToTheAntimeridian[
        coordinatesUpToTheAntimeridian.length - 1
      ] || null;

    const { degreesLat, degreesLong } = convertTLEtoCoords(
      satellite.line1,
      satellite.line2,
      new Date(
        currentTime.setSeconds(currentTime.getSeconds() + markerIndex * 5),
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
