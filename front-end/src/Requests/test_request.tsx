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
  //     console('Error fetching data:', error);
  //   });

  const response = `ISS (ZARYA)             
1 25544U 98067A   26013.40249039  .00009179  00000+0  17283-3 0  9992
2 25544  51.6332 345.7221 0007762  13.3130 346.8062 15.49273572547762`;

  return response;
};

const getGeodeticPosition = (line1: string, line2: string, time: Date) => {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, time);

  if (positionAndVelocity === null) {
    return 'no longer in orbit';
  }

  const positionEci = positionAndVelocity.position;
  const gst = satellite.gstime(time);

  const positionGeodetic = satellite.eciToGeodetic(positionEci!, gst);
  const radiansLat = positionGeodetic!.latitude;
  const radiansLong = positionGeodetic!.longitude;

  const [degreesLat, degreesLong] = [
    satellite.degreesLat(radiansLat),
    satellite.degreesLong(radiansLong),
  ];

  return { positionGeodetic, degreesLat, degreesLong };
};

const GetData = () => {
  type Satellite = string;

  const [data, setData] = useState<Satellite>('');
  const [fetched, setFetched] = useState(fetchData());
  const [geodeticData, setGeodeticData] = useState(
    getGeodeticPosition('', '', new Date())
  );
  const [position, setPosition] = useState(<></>);

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() => fetchData());
    }, 7200000); // Refresh data every 2 hours

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetched
        .then((response) => {
          setData(() => response);
        })
        .then(() => {
          const [name, line1, line2] = data.split('\n');
          const id = line1.substring(2, 7).trim();

          setGeodeticData(getGeodeticPosition(line1, line2, new Date()));

          const positionGeodeticString =
            typeof geodeticData === 'string' ? (
              geodeticData
            ) : (
              <>
                <p>Latitude: {geodeticData.degreesLat.toFixed(6)}</p>
                <p>Longitude: {geodeticData.degreesLong.toFixed(6)}</p>
                <p>
                  Altitude: {geodeticData.positionGeodetic.height.toFixed(2)} km
                </p>
              </>
            );

          setPosition(
            <>
              <div key={id}>
                <h3>Name: {name}</h3>
                <h3>Catalog number: {id}</h3>
                <h3>Position: {positionGeodeticString}</h3>
              </div>
            </>
          );
        })
        .catch((error) => {
          console.log('Error getting data:', error);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetched, data, geodeticData]);

  return position.props.children ? <>{position}</> : <p>Loading...</p>;
};

export default GetData;
