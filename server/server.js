import express from 'express';
import cors from 'cors';
import { getData } from './util_funcs.js';
import { ISS, CSS, HUBBLE, BGS, ACS } from './constants.js';

const allSats = [ISS, HUBBLE, CSS, BGS, ACS];

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
setInterval(() => getData(tles, satellites, response), 7200000);

server.get('/iss', (req, res) => {
  res.status(200).json({
    ...response.satellites[0],
    ...ISS,
  });
});

server.get('/hubble', (req, res) => {
  res.status(200).json({
    ...response.satellites[1],
    ...HUBBLE,
  });
});

server.get('/css', (req, res) => {
  res.status(200).json({
    ...response.satellites[2],
    ...CSS,
  });
});

server.get('/bgs', (req, res) => {
  res.status(200).json({
    ...response.satellites[3],
    ...BGS,
  });
});

server.get('/all', (req, res) => {
  res.status(200).json(
    response.satellites.map((satellite, i) => ({
      ...satellite,
      ...allSats[i],
    })),
  );
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
