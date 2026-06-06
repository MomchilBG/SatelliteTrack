import express from 'express';
import cors from 'cors';
import * as satellite from 'satellite.js';

const port = 5001;
const server = express();
server.use(cors());

const response = {
  updatedAt: null,
  satellites: [],
};

const fetchData = async () => {
  try {
    const tles = await fetch(
      'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',
    )
      .then((res) => res.text())
      .then((res) => res.split(/\r?\n/));

    const satellites = [];
    for (let i = 0; i < tles.length - 1; i += 3) {
      const satellite = {
        name: tles[i].trim(),
        id: tles[i + 1].substring(2, 7).trim(),
        line1: tles[i + 1].trim(),
        line2: tles[i + 2].trim(),
      };

      satellites.push(satellite);
    }

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
  } catch (e) {
    console.log(e.message);
  }
};

await fetchData();

setInterval(() => {
  fetchData();
}, 7200000);

const convertTLEtoCoords = (line1, line2, time = new Date()) => {
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

server.get('/iss', (req, res) => {
  const ISScoords = convertTLEtoCoords(
    response.satellites[0].line1,
    response.satellites[0].line2,
  );

  res.status(200).json({
    ...ISScoords,
    name: response.satellites[0].name,
    id: response.satellites[0].id,
    updatedAt: response.updatedAt,
  });
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
