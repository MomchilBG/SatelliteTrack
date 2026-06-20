import { useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchSatellite.ts';
import type { Satellite } from '../../Types/satellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';
import { colors } from '../../constants.ts';

const GetData = () => {
  const [fetched, setFetched] = useState<Promise<Satellite[]> | null>(null);
  const [satelliteInfo, setSatelliteInfo] = useState([
    {
      location: { latitude: '0', longitude: '0', altitude: '0', velocity: '0' },
      name: '0',
      id: '0',
      path: [[[0, 0]]],
      loaded: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() =>
        Promise.all([fetchData('iss'), fetchData('hubble'), fetchData('css')]),
      );
      if (fetched) {
        fetched
          .then((response) => {
            setSatelliteInfo(
              response.map((response) => ({
                name: response.name,
                id: response.id,
                location: {
                  latitude: response.location?.degreesLat.toFixed(6) || '0',
                  longitude: response.location?.degreesLong.toFixed(6) || '0',
                  altitude: response.location?.height.toFixed(2) || '0',
                  velocity: response.location?.velocity.toFixed(2) || '0',
                },
                path: response.path,
                loaded: true,
              })),
            );
          })
          .catch((error) => {
            console.log('Error getting data:', error);
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetched]);
  return satelliteInfo[0]?.loaded ? (
    <div id="map-info">
      <LeafletMap
        satellites={satelliteInfo.map((satellite) => ({
          marker_coords: [
            +satellite.location.latitude,
            +satellite.location.longitude,
          ],
          path: satellite.path,
        }))}
      />
      <div id="data">
        {satelliteInfo.map((satellite, id) => (
          <div
            key={`satellite-info-${id}`}
            className="satellite-info "
            style={{
              backgroundColor: `rgba(${colors[id % colors.length]}, 0.35)`,
            }}
          >
            <div className="data-item">
              <p className="data-title">{satellite.name}</p>
            </div>
            <div className="data-item">
              <p className="data-title">Latitude: </p>
              <p className="data-value">{satellite.location?.latitude}</p>
            </div>
            <div className="data-item">
              <p className="data-title">Longitude:</p>
              <p className="data-value"> {satellite.location?.longitude}</p>
            </div>
            <div className="data-item">
              <p className="data-title">Altitude: </p>
              <p className="data-value">{satellite.location?.altitude}km</p>
            </div>
            <div className="data-item">
              <p className="data-title">Velocity: </p>
              <p className="data-value">{satellite.location?.velocity}km/s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
