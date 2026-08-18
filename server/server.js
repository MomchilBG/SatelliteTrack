import express from 'express';
import cors from 'cors';
import { getData, splitTLEs, setResponse } from './util_funcs.js';
import { DEF_NORAD_IDS } from './constants.js';

const port = 5001;
const server = express();
server.use(cors());
server.use(express.json());

//Initial fetch to set the data
let tles = await getData(Object.values(DEF_NORAD_IDS));
let satellites = splitTLEs(tles);
let lastUpdated = null;
setResponse(lastUpdated, satellites);

//Update TLE data every 2 hours
setInterval(async () => {
  tles = await getData(Object.values(DEF_NORAD_IDS));
  satellites = splitTLEs(tles);
  setResponse(lastUpdated, satellites);
}, 7200000);

server.get('/iss', (req, res) => {
  res.status(200).json(satellites[0]);
});

server.get('/hubble', (req, res) => {
  res.status(200).json(satellites[1]);
});

server.get('/css', (req, res) => {
  res.status(200).json(satellites[2]);
});

server.get('/all', (req, res) => {
  res.status(200).json(satellites);
});

server.post('/add_sat', async (req, res) => {
  const noradID = req.body.noradID;
  const addedTLE = await getData([noradID]);

  if (addedTLE[0].success === false) {
    res
      .status(200)
      .json({ success: false, satellite: null, message: addedTLE[0].contents });
  } else {
    const addedSatellite = splitTLEs(addedTLE);
    setResponse(lastUpdated, addedSatellite);
    res
      .status(200)
      .json({ success: true, satellite: addedSatellite[0], message: '' });
  }
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
