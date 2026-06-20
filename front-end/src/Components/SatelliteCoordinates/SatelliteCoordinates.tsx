import { useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchISS.ts';
import type { Satellite } from '../../Types/satellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';

const GetData = () => {
  const [fetched, setFetched] = useState<Promise<Satellite> | null>(null);
  const [satelliteInfo, setSatelliteInfo] = useState({
    location: { latitude: '0', longitude: '0', altitude: '0' },
    name: '0',
    id: '0',
    path: [[[0, 0]]],
    loaded: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() => fetchData());
      if (fetched) {
        fetched
          .then((response) => {
            setSatelliteInfo({
              name: response.name,
              id: response.id,
              location: {
                latitude: response.location?.degreesLat.toFixed(6) || '0',
                longitude: response.location?.degreesLong.toFixed(6) || '0',
                altitude: response.location?.height.toFixed(2) || '0',
              },
              path: response.path,
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
  return satelliteInfo.loaded ? (
    <div id="map-info">
      <LeafletMap
        marker_coords={[
          +satelliteInfo.location?.latitude,
          +satelliteInfo.location?.longitude,
        ]}
        path={satelliteInfo.path}
      />
      <div id="data">
        <div className="data-item">
          <p className="data-title">{satelliteInfo.name}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Latitude: </p>
          <p className="data-value">{satelliteInfo.location?.latitude}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Longitude:</p>
          <p className="data-value"> {satelliteInfo.location?.longitude}</p>
        </div>
        <div className="data-item">
          <p className="data-title">Altitude: </p>
          <p className="data-value">{satelliteInfo.location?.altitude} km</p>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
