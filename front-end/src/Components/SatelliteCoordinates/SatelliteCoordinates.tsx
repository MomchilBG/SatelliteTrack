import { useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchISS.ts';
import type { Satellite } from '../../Types/satellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';

const GetData = () => {
  const [fetched, setFetched] = useState<Promise<Satellite> | null>(null);
  const [position, setPosition] = useState({
    name: '0',
    id: '0',
    positionGeodetic: { latitude: '0', longitude: '0', altitude: '0' },
    loaded: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() => fetchData());
      if (fetched) {
        fetched
          .then((response) => {
            setPosition({
              name: response.name,
              id: response.id,
              positionGeodetic: {
                latitude: response.degreesLat.toFixed(6),
                longitude: response.degreesLong.toFixed(6),
                altitude: response.positionGeodetic.height.toFixed(2),
              },
              loaded: true,
            });
          })
          .catch((error) => {
            console.log('Error getting data:', error);
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetched]);
  return position.loaded ? (
    <LeafletMap
      marker_coords={[
        +position.positionGeodetic.latitude,
        +position.positionGeodetic.longitude,
      ]}
    />
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
