import { useEffect, useState } from 'react';
import { fetchData } from '../Requests/fetchISS.ts';
import type { Satellite } from '../Types/satellite.ts';

const GetData = () => {
  const [data, setData] = useState<Satellite>({
    updatedAt: new Date(),
    positionGeodetic: { longitude: 0, latitude: 0, height: 0 },
    degreesLat: 0,
    degreesLong: 0,
    name: '',
    id: '',
  });
  const [fetched, setFetched] = useState(fetchData());
  const [position, setPosition] = useState(<></>);

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() => fetchData());
      fetched
        .then((response) => {
          setData(() => response);
          return response;
        })
        .then((response) => {
          const positionGeodeticString =
            typeof response === 'string' ? (
              response
            ) : (
              <>
                <p>Latitude: {response.degreesLat.toFixed(6)}</p>
                <p>Longitude: {response.degreesLong.toFixed(6)}</p>
                <p>
                  Altitude: {response.positionGeodetic.height.toFixed(2)} km
                </p>
              </>
            );

          setPosition(
            <>
              <div key={response.id}>
                <h3>Name: {response.name}</h3>
                <h3>Catalog number: {response.id}</h3>
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
  }, [fetched, data]);

  return position.props.children ? <>{position}</> : <p>Loading...</p>;
};

export default GetData;
