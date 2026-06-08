import express from 'express';
import cors from 'cors';
import {
  getSatellitePath,
  convertTLEtoCoords,
  splitTLEs,
  setResponse,
} from './util_funcs.js';
import { fetchData } from './requests.js';

const port = 5001;
const server = express();
server.use(cors());

let [tles, satellites, response] = [
  '',
  [],
  {
    updatedAt: null,
    satellites: [],
  },
];

//Initial fetch to set the data
(async () => {
  try {
    tles = await fetchData();
    satellites = splitTLEs(tles);
    setResponse(response, satellites);
  } catch (e) {
    console.log(e.message);
  }
})();

//Update TLE data every 2 hours
setInterval(() => {
  try {
    tles = fetchData();
    satellites = splitTLEs(tles);
    setResponse(response, satellites);
  } catch (e) {
    console.log(e.message);
  }
}, 7200000);

server.get('/iss', (req, res) => {
  const ISScoords = convertTLEtoCoords(
    response.satellites[0].line1,
    response.satellites[0].line2,
  );

  const ISSpath = getSatellitePath(response.satellites[0]);

  res.status(200).json({
    ...ISScoords,
    ISSpath,
    name: response.satellites[0].name,
    id: response.satellites[0].id,
    updatedAt: response.updatedAt,
  });
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
