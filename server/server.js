import express from 'express';
import cors from 'cors';
import {
  getSatellitePath,
  convertTLEtoCoords,
  splitTLEs,
  setResponse,
  getData,
} from './util_funcs.js';
import { ISS, CSS, HUBBLE, BGS } from './constants.js';

const allSats = [ISS, HUBBLE, CSS, BGS];

const port = 5001;
const server = express();
server.use(cors());

let [tles, satellites, response] = [
  [],
  [],
  {
    updatedAt: null,
    satellites: [],
  },
];

//Initial fetch to set the data
getData(tles, satellites, response);

//Update TLE data every 2 hours
setInterval(getData, 7200000);

server.get('/iss', (req, res) => {
  const ISScoords = convertTLEtoCoords(
    response.satellites[0].line1,
    response.satellites[0].line2,
  );

  const ISSpath = getSatellitePath(
    response.satellites[0],
    ISS.ORBIT_POINTS,
    ISS.PERIOD_BETWEEN_POINTS,
  );

  res.status(200).json({
    location: ISScoords,
    name: response.satellites[0].name,
    id: response.satellites[0].id,
    path: ISSpath,
  });
});

server.get('/hubble', (req, res) => {
  const HSTcoords = convertTLEtoCoords(
    response.satellites[1].line1,
    response.satellites[1].line2,
  );

  const HSTpath = getSatellitePath(
    response.satellites[1],
    HUBBLE.ORBIT_POINTS,
    HUBBLE.PERIOD_BETWEEN_POINTS,
  );

  res.status(200).json({
    location: HSTcoords,
    name: response.satellites[1].name,
    id: response.satellites[1].id,
    path: HSTpath,
  });
});

server.get('/css', (req, res) => {
  const CSScoords = convertTLEtoCoords(
    response.satellites[2].line1,
    response.satellites[2].line2,
  );

  const CSSpath = getSatellitePath(
    response.satellites[2],
    CSS.ORBIT_POINTS,
    CSS.PERIOD_BETWEEN_POINTS,
  );

  res.status(200).json({
    location: CSScoords,
    name: response.satellites[2].name,
    id: response.satellites[2].id,
    path: CSSpath,
  });
});

server.get('/bgs', (req, res) => {
  const BGScoords = convertTLEtoCoords(
    response.satellites[3].line1,
    response.satellites[3].line2,
  );

  const BGSpath = getSatellitePath(
    response.satellites[3],
    BGS.ORBIT_POINTS,
    BGS.PERIOD_BETWEEN_POINTS,
  );

  res.status(200).json({
    location: BGScoords,
    name: response.satellites[3].name,
    id: response.satellites[3].id,
    path: BGSpath,
  });
});

server.get('/all', (req, res) => {
  const all = response.satellites.map((sat, id) => ({
    location: convertTLEtoCoords(sat.line1, sat.line2),
    name: sat.name,
    id: sat.id,
    path: getSatellitePath(
      sat,
      allSats[id].ORBIT_POINTS,
      allSats[id].PERIOD_BETWEEN_POINTS,
    ),
  }));

  res.status(200).json(all);
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
