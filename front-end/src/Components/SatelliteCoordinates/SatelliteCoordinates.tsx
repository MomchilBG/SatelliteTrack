import { useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchISS.ts';
import type { Satellite } from '../../Types/satellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';

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
    <div id="map-info">
      <LeafletMap
        marker_coords={[
          +position.positionGeodetic.latitude,
          +position.positionGeodetic.longitude,
        ]}
      />
      <div id="data">
        <div className="data-item">
          <p className="data-title">{position.name}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Latitude: </p>
          <p className="data-value">{position.positionGeodetic.latitude}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Longitude:</p>
          <p className="data-value"> {position.positionGeodetic.longitude}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Altitude: </p>
          <p className="data-value">{position.positionGeodetic.altitude}</p>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
