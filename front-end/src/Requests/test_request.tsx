import { useEffect, useState } from 'react';
import axios from 'axios';
import * as satellite from 'satellite.js';

type Satellite = {
  updatedAt: Date;
  satellites: { name: string; line1: string; line2: string }[];
};

const fetchData = async (): Promise<Satellite> => {
  try {
    const response = await axios.get<Satellite>('http://localhost:5001/iss', {
      responseType: 'json',
    });

    return (
      response?.data ?? {
        updatedAt: new Date(),
        satellites: [],
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      updatedAt: new Date(),
      satellites: [],
    };
  }
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
  const [data, setData] = useState<Satellite>({
    updatedAt: new Date(),
    satellites: [],
  });
  const [fetched] = useState(fetchData());
  const [geodeticData, setGeodeticData] = useState(
    getGeodeticPosition('', '', new Date()),
  );
  const [position, setPosition] = useState(<></>);

  useEffect(() => {
    const interval = setInterval(() => {
      fetched
        .then((response) => {
          setData(() => response);
        })
        .then(() => {
          const { name, line1, line2 } = data.satellites[0];
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
            </>,
          );
        })
        .catch((error) => {
          console.log('Error getting data:', data, error);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetched, data, geodeticData]);

  return position.props.children ? <>{position}</> : <p>Loading...</p>;
};

export default GetData;
