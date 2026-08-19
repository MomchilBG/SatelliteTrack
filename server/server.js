import express from 'express';
import cors from 'cors';
import { updateTLE } from './util_funcs.js';
import { DEF_NORAD_IDS } from './constants.js';

const port = 5001;
const server = express();
server.use(cors());
server.use(express.json());

let satellites = {};
(async () => {
  try {
    const [initSats, initTLEs] = await updateTLE(
      Object.values(DEF_NORAD_IDS),
      satellites,
    );
    satellites = initSats;
  } catch (e) {
    console.log(`Error occured during init: ${e.message}`);
  }
})();

server.get('/iss', async (req, res) => {
  try {
    const [sats, ISSTLE] = await updateTLE([DEF_NORAD_IDS.ISS], satellites);
    satellites = sats;
    if (ISSTLE !== null && ISSTLE[0].success === false) {
      res.status(200).json({
        success: false,
        satellites: null,
        message: ISSTLE[0].contents,
      });
    }
    res.status(200).json({
      success: true,
      satellites: [satellites[DEF_NORAD_IDS.ISS]],
      message: '',
    });
  } catch (e) {
    console.log(`Error occuring during iss fetch: ${e.message}`);
    res.status(200).json({
      success: false,
      satellites: null,
      message: 'TLE fetching for the ISS failed',
    });
  }
});

server.get('/hubble', async (req, res) => {
  try {
    const [sats, HubbleTLE] = await updateTLE(
      [DEF_NORAD_IDS.HUBBLE],
      satellites,
    );
    satellites = sats;
    if (HubbleTLE !== null && HubbleTLE[0].success === false) {
      res.status(200).json({
        success: false,
        satellites: null,
        message: HubbleTLE[0].contents,
      });
    }
    res.status(200).json({
      success: true,
      satellites: [satellites[DEF_NORAD_IDS.HUBBLE]],
      message: '',
    });
  } catch (e) {
    console.log(`Error occuring during Hubble fetch: ${e.message}`);
    res.status(200).json({
      success: false,
      satellites: null,
      message: 'TLE fetching for the Hubble failed',
    });
  }
});

server.get('/css', async (req, res) => {
  try {
    const [sats, CSSTLE] = await updateTLE([DEF_NORAD_IDS.CSS], satellites);
    satellites = sats;
    if (CSSTLE !== null && CSSTLE[0].success === false) {
      res.status(200).json({
        success: false,
        satellites: null,
        message: CSSTLE[0].contents,
      });
    }
    res.status(200).json({
      success: true,
      satellites: [satellites[DEF_NORAD_IDS.CSS]],
      message: '',
    });
  } catch (e) {
    console.log(`Error occuring during CSS fetch: ${e.message}`);
    res.status(200).json({
      success: false,
      satellites: null,
      message: 'TLE fetching for the CSS failed',
    });
  }
});

server.get('/defaults', async (req, res) => {
  try {
    const [sats, defTLEs] = await updateTLE(
      Object.values(DEF_NORAD_IDS),
      satellites,
    );
    satellites = sats;
    res.status(200).json({
      success: true,
      satellites: Object.values(DEF_NORAD_IDS).map((id) => satellites[id]),
      message: '',
    });
  } catch (e) {
    console.log(`Error occured during defaults fetch for ${id}: ${e.message}`);
    res.status(200).json({
      success: false,
      satellites: null,
      message: 'Default TLE fetching failed',
    });
  }
});

server.get('/noradIDs', (req, res) => {
  req.query.map((noradID) => {});
});

server.post('/add_sat', async (req, res) => {
  try {
    const noradID = +req.body.noradID;
    const [updatedSats, updatedTLE] = await updateTLE([noradID], satellites);
    satellites = updatedSats;
    if (updatedTLE !== null && updatedTLE[0].success === false) {
      res.status(200).json({
        success: false,
        satellites: null,
        message: updatedTLE[0].contents,
      });
    } else {
      res.status(200).json({
        success: true,
        satellites: [satellites[noradID]],
        message: '',
      });
    }
  } catch (e) {
    console.log(`Post request failed: ${e.message}`);
    res.status(200).json({
      success: false,
      satellites: null,
      message: 'Post request failed',
    });
  }
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
