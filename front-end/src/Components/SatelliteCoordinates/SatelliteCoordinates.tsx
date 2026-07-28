import { useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchSatellite.ts';
import type { Satellite } from '../../Types/satellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';
import {
  convertTLEtoCoords,
  getSatellitePath,
} from '../../util_funcs/util_funcs.ts';
import SatStats from '../SatStats/SatStats.tsx';

const GetData = () => {
  const [fetched, setFetched] = useState<Promise<
    Satellite | Satellite[]
  > | null>(null);
  const [satelliteInfo, setSatelliteInfo] = useState([
    {
      line1: '',
      line2: '',
      name: '0',
      id: '0',
      ORBIT_POINTS: 0,
      PERIOD_BETWEEN_POINTS: 0,
      location: {
        height: -1,
        degreesLat: 0,
        degreesLong: 0,
        velocity: 0,
      },
      loaded: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFetched(() => fetchData('all'));
      if (fetched) {
        fetched
          .then((response) => {
            const satellites = Array.isArray(response) ? response : [response];
            setSatelliteInfo(
              satellites.map((satellite) => ({
                line1: satellite.line1,
                line2: satellite.line2,
                name: satellite.name,
                id: satellite.id,
                ORBIT_POINTS: satellite.ORBIT_POINTS,
                PERIOD_BETWEEN_POINTS: satellite.PERIOD_BETWEEN_POINTS,
                location: convertTLEtoCoords(satellite.line1, satellite.line2),
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
            +satellite.location.degreesLat,
            +satellite.location.degreesLong,
          ],
          path: getSatellitePath(
            satellite.line1,
            satellite.line2,
            satellite.ORBIT_POINTS,
            satellite.PERIOD_BETWEEN_POINTS,
          ),
        }))}
      />
      <div id="data">
        <SatStats satelliteInfo={satelliteInfo} />
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
