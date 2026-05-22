import express from 'express';
import cors from 'cors';

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
        line1: tles[i + 1].trim(),
        line2: tles[i + 2].trim(),
      };

      satellites.push(satellite);
    }

    response.updatedAt = Date.now();
    response.satellites = satellites;
    console.log(`Updated data: ${response}`);
  } catch (e) {
    console.log(e.message);
  }
};

await fetchData();

setInterval(() => {
  fetchData();
}, 7200000);

server.get('/iss', (req, res) => {
  res.status(200).json(response);
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
