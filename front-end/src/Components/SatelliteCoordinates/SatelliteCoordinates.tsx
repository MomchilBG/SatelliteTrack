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
import type { fetchedTLEs, Satellite } from '../../Types/satellite.ts';
import SatVisibilityToggle from '../SatVisibilityToggle/SatVisibilityToggle.tsx';
import AddSatellitePanel from '../AddSatellitePanel/AddSatellitePanel.tsx';

const initialFetch: fetchedTLEs[] = await (async () => {
  try {
    const response = fetchData('all');
    return response;
  } catch (e) {
    console.log(e);
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
  }
})();

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
  const [addedSatellites, setAddedSatellites] = useState<Satellite[]>([]);
  const [postError, setPostError] = useState('');
  const [locations, setLocations] = useState(
    TLEs[0].loaded
      ? [...TLEs, ...addedSatellites].map((TLE) => ({
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
  const [menu, setMenu] = useState<'info' | 'addSat'>('info');

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData('all')
        .then((response) => {
          setTLEs(
            response.map((TLE, i) => ({
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
          [...TLEs, ...addedSatellites].map((TLE) => ({
            location: convertTLEtoCoords(TLE.line1, TLE.line2),
            loaded: true,
          })),
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [TLEs, addedSatellites]);

  const toggleVisibility = useCallback(
    (satellite: Satellite, index: number, element: HTMLButtonElement) => {
      let TLEsModCopy;
      let modIndex;
      if (index > TLEs.length - 1) {
        TLEsModCopy = [...addedSatellites];
        modIndex = index - TLEs.length;
      } else {
        TLEsModCopy = [...TLEs];
        modIndex = index;
      }
      if (satellite.visible === true) {
        TLEsModCopy[modIndex].visible = false;
        element.classList.remove('visible');
        element.classList.add('not-visible');
      } else if (satellite.visible === false) {
        TLEsModCopy[modIndex].visible = true;
        element.classList.remove('not-visible');
        element.classList.add('visible');
      }

      if (index > TLEs.length - 1) {
        setAddedSatellites(TLEsModCopy);
      } else {
        setTLEs(TLEsModCopy);
      }
    },
    [TLEs, addedSatellites],
  );

  const handlePost = useCallback(
    async (noradID: string) => {
      try {
        const response = await postSatellite(noradID);
        if (response.success === false) {
          setPostError(`${response.message} for Norad ID ${noradID}`);
          return 'failed';
        } else {
          setPostError('');
          const fetchedSatellite: Satellite = {
            ...response.satellite[0],
            key: `addedSat_${addedSatellites.length}`,
            loaded: true,
            visible: true,
          };
          setAddedSatellites([...addedSatellites, fetchedSatellite]);
          setLocations([
            ...locations,
            {
              location: convertTLEtoCoords(
                fetchedSatellite.line1,
                fetchedSatellite.line2,
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
    },
    [locations, addedSatellites],
  );

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
            numOfAddedSats={addedSatellites.length}
          />
        )}
        {menu === 'info' && (
          <div id="data">
            {[...TLEs, ...addedSatellites].map((satellite, i) => (
              <div className="satellite-data-panel-item" key={i}>
                <SatVisibilityToggle
                  onClick={toggleVisibility}
                  index={i}
                  satellite={satellite}
                />
                <CollapsableInfo
                  colorsKey={satellite.key}
                  title={satellite.name}
                  satellite={{ ...satellite, ...locations[i] }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="map-info">
        <LeafletMap
          satellites={[...TLEs, ...addedSatellites].reduce(
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
