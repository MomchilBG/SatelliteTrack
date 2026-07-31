import { useEffect, useMemo, useState } from 'react';
import { fetchData } from '../../Requests/fetchSatellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';
import {
  convertTLEtoCoords,
  getSatellitePath,
} from '../../util_funcs/util_funcs.ts';
import CollapsableInfo from '../CollaspableInfo/CollapsableInfo.tsx';
import TrackingInfoPanel from '../TrackingInfoPanel/TrackingInfoPanel.tsx';

const GetData = () => {
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
  const [display, setDisplay] = useState({ 0: 'none', 1: 'none', 2: 'none' });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData('all')
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const expandInfo = useMemo(
    () => (id: number) => {
      const copy = { ...display };
      copy[id as keyof typeof copy] =
        copy[id as keyof typeof copy] === 'none' ? 'block' : 'none';
      setDisplay({ ...copy });
    },
    [display],
  );

  return satelliteInfo[0]?.loaded ? (
    <div id="app">
      <div id="data">
        {satelliteInfo.map((satellite, i) => (
          <CollapsableInfo
            key={i}
            title={satellite.name}
            props={{ satellite: satellite }}
            // @ts-expect-error uwu
            Comp={TrackingInfoPanel}
            id={i}
            onClick={expandInfo}
            display={display[i as keyof typeof display]}
          />
        ))}
      </div>
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
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
