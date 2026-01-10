import { useEffect, useState } from 'react';
// import axios from 'axios';
import * as satellite from 'satellite.js';

const fetchData = async (): Promise<string> => {
  // const response = await axios
  //   .get<string>(
  //     'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',
  //     {
  //       responseType: 'text',
  //     }
  //   )
  //   .catch((error) => {
  //     console.error('Error fetching data:', error);
  //     throw error;
  //   });

  const response = `ISS (ZARYA)             
1 25544U 98067A   98324.28472222 -.00003657  11563-4  00000+0 0    10
2 25544  51.5908 168.3788 0125362  86.4185 359.7454 16.05064833    05`;

  return response;
};

let fetchedData = fetchData();

setInterval(() => {
  fetchedData = fetchData();
}, 7200000); // Refresh data every 2 hours

const getGeodeticPosition = (
  line1: string,
  line2: string,
  props: { time: Date }
) => {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, props.time);

  if (positionAndVelocity === null) {
    return 'no longer in orbit';
  }

  const positionEci = positionAndVelocity.position;
  console.log(satrec);
  console.log(props.time);
  const gst = satellite.gstime(props.time);
  const positionEcf = satellite.eciToEcf(positionEci!, gst);
  const positionGeodetic = satellite.eciToGeodetic(positionEcf!, gst);
  const radiansLat = satellite.radiansLat(positionGeodetic!.latitude);
  const radiansLong = satellite.radiansLong(positionGeodetic!.longitude);

  const [degreesLat, degreesLong] = [
    radiansLat * (180 / Math.PI),
    radiansLong * (180 / Math.PI),
  ];

  return { positionGeodetic, degreesLat, degreesLong };
};

const GetData = (props: { time: Date }) => {
  type Satellite = string;

  const [data, setData] = useState<Satellite>('');

  useEffect(() => {
    fetchedData
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error('Error getting data:', error);
      });
  }, []);

  return data.length > 0 ? (
    <ul key="satellite-list">
      {(data.match(/([^\r\n]*\r?\n[^\r\n]*\r?\n[^\r\n]*\r?\n?)/gim) || []).map(
        (item: Satellite) => {
          const [name, line1, line2] = item.split('\n');
          const id = line1.substring(2, 7).trim();

          const geodeticData = getGeodeticPosition(line1, line2, props);

          if (typeof geodeticData === 'string') {
            return (
              <div key={id}>
                <h3>Name: {name}</h3>
                <h3>Catalog number: {id}</h3>
                <h3>Position: {geodeticData}</h3>
              </div>
            );
          }

          const { positionGeodetic, degreesLat, degreesLong } = geodeticData;

          const positionGeodeticString = positionGeodetic ? (
            <>
              <p>Latitude: {satellite.degreesLat(degreesLat).toFixed(6)}</p>
              <p>Longitude: {satellite.degreesLong(degreesLong).toFixed(6)}</p>
              <p>Altitude: {positionGeodetic.height.toFixed(2)} km</p>
            </>
          ) : (
            'Position data not available'
          );

          return (
            <div key={id}>
              <h3>Name: {name}</h3>
              <h3>Catalog number: {id}</h3>
              <h3>Position: {positionGeodeticString}</h3>
            </div>
          );
        }
      )}
    </ul>
  ) : (
    <p key="loading-text">Loading...</p>
  );
};

export default GetData;
