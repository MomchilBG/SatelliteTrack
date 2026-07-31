import * as satellite from 'satellite.js';

export const convertTLEtoCoords = (
  line1: string,
  line2: string,
  time = new Date(),
) => {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, time);
  if (positionAndVelocity === null) {
    return { height: -1, degreesLat: 0, degreesLong: 0, velocity: 0 };
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

export const getSatellitePath = (
  line1: string,
  line2: string,
  orbit_points: number,
  period: number,
) => {
  const markersCoordinates = [];
  let coordinatesUpToTheAntimeridian = [];

  for (let markerIndex = 0; markerIndex <= orbit_points; markerIndex++) {
    const currentTime = new Date();
    const prevCoord =
      coordinatesUpToTheAntimeridian[
        coordinatesUpToTheAntimeridian.length - 1
      ] || null;

    const {
      degreesLat,
      degreesLong,
    }: { degreesLat: number; degreesLong: number } = convertTLEtoCoords(
      line1,
      line2,
      new Date(
        currentTime.setSeconds(currentTime.getSeconds() + markerIndex * period),
      ),
    );

    if (
      prevCoord !== null &&
      prevCoord[1] * degreesLong < 0 &&
      Math.abs(prevCoord[1]) > 90
    ) {
      markersCoordinates.push(coordinatesUpToTheAntimeridian);
      coordinatesUpToTheAntimeridian = [];
    } else {
      coordinatesUpToTheAntimeridian.push([degreesLat, degreesLong]);
    }
  }

  markersCoordinates.push(coordinatesUpToTheAntimeridian);

  return markersCoordinates;
};
