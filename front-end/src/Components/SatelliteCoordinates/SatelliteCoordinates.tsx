import { useCallback, useEffect, useState } from 'react';
import { fetchData } from '../../Requests/fetchSatellite.ts';
import { postSatellite } from '../../Requests/postSatellite.ts';
import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import './SatelliteCoordinates.css';
import {
  convertTLEtoCoords,
  getSatellitePath,
} from '../../util_funcs/util_funcs.ts';
import CollapsableInfo from '../CollaspableInfo/CollapsableInfo.tsx';
import TrackingInfoPanel from '../TrackingInfoPanel/TrackingInfoPanel.tsx';
import type { fetchedTLEs, Satellite } from '../../Types/satellite.ts';
import SatVisibilityToggle from '../SatVisibilityToggle/SatVisibilityToggle.tsx';
import AddSatellitePanel from '../AddSatellitePanel/AddSatellitePanel.tsx';

const initialFetch: fetchedTLEs[] = await fetchData('all')
  .then((response) => (Array.isArray(response) ? response : [response]))
  .catch((error) => {
    console.log(error);
    return [
      {
        name: '',
        id: '',
        line1: '',
        line2: '',
        ORBIT_POINTS: 0,
        PERIOD_BETWEEN_POINTS: 0,
      },
    ];
  });

const GetData = () => {
  const [TLEs, setTLEs] = useState<Satellite[]>(
    initialFetch.map((TLE) => ({
      name: TLE.name,
      id: TLE.id,
      line1: TLE.line1,
      line2: TLE.line2,
      key: TLE.name.split(' ')[0].toLowerCase(),
      loaded: TLE.line1 === '' ? false : true,
      visible: true,
    })),
  );
  const [addedSatellite, setAddedSatellite] = useState<Satellite[]>([]);
  const [postError, setPostError] = useState('');
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
  const [menu, setMenu] = useState<'info' | 'addSat'>('info');

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData('all')
        .then((response) => {
          const fetchedTLEs = Array.isArray(response) ? response : [response];
          setTLEs(
            fetchedTLEs.map((TLE, i) => ({
              name: TLE.name,
              id: TLE.id,
              line1: TLE.line1,
              line2: TLE.line2,
              key: i < TLEs.length ? TLEs[i].key : '',
              loaded: true,
              visible: i < TLEs.length ? TLEs[i].visible : true,
            })),
          );
        })
        .catch((error) => {
          console.log('Error getting data:', error);
        });
    }, 20000);

    return () => clearInterval(interval);
  }, [TLEs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (TLEs[0].loaded) {
        setLocations(
          [...TLEs, ...addedSatellite].map((TLE) => ({
            location: convertTLEtoCoords(TLE.line1, TLE.line2),
            loaded: true,
          })),
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [TLEs, addedSatellite]);

  const expandInfo = useCallback(
    (id: number) => {
      const copy = { ...display };
      copy[id as keyof typeof copy] =
        copy[id as keyof typeof copy] === 'none' ? 'block' : 'none';
      setDisplay({ ...copy });
    },
    [display],
  );

  const toggleVisibility = useCallback(
    (satellite: Satellite, element: HTMLButtonElement) => {
      if (satellite.visible === true) {
        satellite.visible = false;
        element.classList.remove('visible');
        element.classList.add('not-visible');
      } else if (satellite.visible === false) {
        satellite.visible = true;
        element.classList.remove('not-visible');
        element.classList.add('visible');
      }
    },
    [],
  );

  const handlePost = async (noradID: string) => {
    try {
      const addedTLE = (await postSatellite(noradID)).satellite;
      if (addedTLE === null) {
        setPostError('Invalid Norad ID or satellite is no longer in orbit!');
        return 'failed';
      } else {
        setPostError('');
        const addedSatellite: Satellite = {
          ...addedTLE,
          key: addedTLE.name.split(' ')[0].toLowerCase(),
          loaded: true,
          visible: true,
        };
        setAddedSatellite([addedSatellite]);
        setLocations([
          ...locations,
          {
            location: convertTLEtoCoords(
              addedSatellite.line1,
              addedSatellite.line2,
            ),
            loaded: true,
          },
        ]);
        return 'successful';
      }
    } catch (e) {
      console.log(`Error handling post: ${e}`);
      return 'failed';
    }
  };

  return TLEs[0].loaded && locations[0].loaded ? (
    <div id="app">
      <div id="menu">
        <div id="menu-nav">
          <button className="menu-nav-button" onClick={() => setMenu('addSat')}>
            Add Satellite
          </button>
          <button className="menu-nav-button" onClick={() => setMenu('info')}>
            View Info
          </button>
        </div>
        {menu === 'addSat' && (
          <AddSatellitePanel
            handlePost={handlePost}
            postError={postError}
            setPostError={setPostError}
          />
        )}
        {menu === 'info' && (
          <div id="data">
            {[...TLEs, ...addedSatellite].map((satellite, i) => (
              <div className="satellite-data-panel-item" key={i}>
                <SatVisibilityToggle
                  onClick={toggleVisibility}
                  satellite={satellite}
                />
                <CollapsableInfo
                  colorsKey={satellite.name.split(' ')[0].toLowerCase()}
                  title={satellite.name}
                  props={{ satellite: { ...satellite, ...locations[i] } }}
                  Comp={TrackingInfoPanel}
                  id={i}
                  onClick={expandInfo}
                  display={display[i as keyof typeof display]}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="map-info">
        <LeafletMap
          satellites={[...TLEs, ...addedSatellite].reduce(
            (
              prev: {
                key: string;
                marker_coords: [number, number];
                path: number[][][];
              }[],
              current,
              i,
            ) => {
              if (current.visible === true) {
                prev.push({
                  key: current.key,
                  marker_coords: [
                    locations[i].location.degreesLat,
                    locations[i].location.degreesLong,
                  ],
                  path: getSatellitePath(current.line1, current.line2),
                });
              }
              return prev;
            },
            [],
          )}
        />
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GetData;
