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

const initialFetch = await fetchData('all').catch((error) => {
  console.log(error);
  return [
    {
      line1: '',
      line2: '',
      name: '',
      id: '',
      ORBIT_POINTS: 0,
      PERIOD_BETWEEN_POINTS: 0,
      loaded: false,
    },
  ];
});
const initialTLEs = Array.isArray(initialFetch) ? initialFetch : [initialFetch];

const GetData = () => {
  const [TLEs, setTLEs] = useState(
    initialTLEs.map((TLE) => ({
      line1: TLE.line1,
      line2: TLE.line2,
      name: TLE.name,
      id: TLE.id,
      ORBIT_POINTS: TLE.ORBIT_POINTS,
      PERIOD_BETWEEN_POINTS: TLE.PERIOD_BETWEEN_POINTS,
      loaded: true,
    })),
  );
  const [locations, setLocations] = useState(
    TLEs[0].loaded
      ? TLEs.map((TLE) => ({
          location: convertTLEtoCoords(TLE.line1, TLE.line2),
          loaded: true,
        }))
      : [
          {
            location: {
              height: -1,
              degreesLat: 0,
              degreesLong: 0,
              velocity: 0,
            },
            loaded: false,
          },
        ],
  );
  const [display, setDisplay] = useState({ 0: 'none', 1: 'none', 2: 'none' });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData('all')
        .then((response) => {
          const fetchedTLEs = Array.isArray(response) ? response : [response];
          setTLEs(
            fetchedTLEs.map((TLE) => ({
              line1: TLE.line1,
              line2: TLE.line2,
              name: TLE.name,
              id: TLE.id,
              ORBIT_POINTS: TLE.ORBIT_POINTS,
              PERIOD_BETWEEN_POINTS: TLE.PERIOD_BETWEEN_POINTS,
              loaded: true,
            })),
          );
        })
        .catch((error) => {
          console.log('Error getting data:', error);
        });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (TLEs[0].loaded) {
        setLocations(
          TLEs.map((TLE) => ({
            location: convertTLEtoCoords(TLE.line1, TLE.line2),
            loaded: true,
          })),
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [TLEs]);

  const expandInfo = useMemo(
    () => (id: number) => {
      const copy = { ...display };
      copy[id as keyof typeof copy] =
        copy[id as keyof typeof copy] === 'none' ? 'block' : 'none';
      setDisplay({ ...copy });
    },
    [display],
  );

  return TLEs[0].loaded && locations[0].loaded ? (
    <div id="app">
      <div id="data">
        {TLEs.map((satellite, i) => (
          <CollapsableInfo
            key={i}
            title={satellite.name}
            props={{ satellite: { ...satellite, ...locations[i] } }}
            Comp={TrackingInfoPanel}
            id={i}
            onClick={expandInfo}
            display={display[i as keyof typeof display]}
          />
        ))}
      </div>
      <div id="map-info">
        <LeafletMap
          satellites={TLEs.map((satellite, i) => ({
            marker_coords: [
              locations[i].location.degreesLat,
              locations[i].location.degreesLong,
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
