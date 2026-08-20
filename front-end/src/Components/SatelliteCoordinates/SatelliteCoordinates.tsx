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
import type { APIResponse, Satellite } from '../../Types/satellite.ts';
import Button from '../Button/Button.tsx';
import AddSatellitePanel from '../AddSatellitePanel/AddSatellitePanel.tsx';
import { defaultNoradIDs } from '../../constants.tsx';

const initialFetch: APIResponse = await (async () => {
  try {
    const response = fetchData('defaults');
    return response;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      satellites: [
        {
          name: '',
          id: '',
          line1: '',
          line2: '',
          lastUpdated: new Date(),
        },
      ],
      message: '',
    };
  }
})();

const GetData = () => {
  const [TLEs, setTLEs] = useState<Satellite[]>(
    initialFetch.satellites.map((TLE) => ({
      name: TLE.name,
      id: TLE.id,
      line1: TLE.line1,
      line2: TLE.line2,
      lastUpdated: TLE.lastUpdated,
      key: TLE.name.split(' ')[0].toLowerCase(),
      loaded: TLE.line1 === '' ? false : true,
      visible: true,
    })),
  );
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
  const [menu, setMenu] = useState<'info' | 'addSat'>('info');

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(`getbyids?${TLEs.map((tle) => `ids=${tle.id}`).join('&')}`)
        .then((response) => {
          setTLEs(
            response.satellites.map((TLE, i) => ({
              name: TLE.name,
              id: TLE.id,
              line1: TLE.line1,
              line2: TLE.line2,
              lastUpdated: TLE.lastUpdated,
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
          TLEs.map((TLE) => ({
            location: convertTLEtoCoords(TLE.line1, TLE.line2),
            loaded: true,
          })),
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [TLEs]);

  const toggleVisibility = useCallback(
    (satellite: Satellite, index: number, element: HTMLButtonElement) => {
      const TLEsModCopy = [...TLEs];
      if (satellite.visible === true) {
        TLEsModCopy[index].visible = false;
        element.classList.remove('visible');
        element.classList.add('not-visible');
      } else if (satellite.visible === false) {
        TLEsModCopy[index].visible = true;
        element.classList.remove('not-visible');
        element.classList.add('visible');
      }
      setTLEs(TLEsModCopy);
    },
    [TLEs],
  );

  const removeSatellite = useCallback(
    (index: number) => {
      const TLEsCopy = [
        ...TLEs.slice(0, index),
        ...TLEs.slice(index + 1, TLEs.length - 1),
      ];
      setTLEs(TLEsCopy);
    },
    [TLEs],
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
            ...response.satellites[0],
            key: `addedSat_${TLEs.length - Object.values(defaultNoradIDs).length}`,
            loaded: true,
            visible: true,
          };
          setTLEs([...TLEs, fetchedSatellite]);
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
    [locations, TLEs],
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
            numOfAddedSats={TLEs.length - Object.values(defaultNoradIDs).length}
            trackedIDs={TLEs.map((tle) => +tle.id)}
          />
        )}
        {menu === 'info' && (
          <div id="data">
            {TLEs.map((satellite, i) => (
              <div className="satellite-data-panel-item" key={i}>
                <Button
                  //@ts-expect-error uwu
                  onClick={toggleVisibility}
                  onClickArgs={[satellite, i]}
                  className="custom-button visible"
                />
                <CollapsableInfo
                  colorsKey={satellite.key}
                  title={satellite.name}
                  satellite={{ ...satellite, ...locations[i] }}
                />
                <Button
                  //@ts-expect-error uwu
                  onClick={removeSatellite}
                  onClickArgs={[i]}
                  className="custom-button remove"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="map-info">
        <LeafletMap
          satellites={TLEs.reduce(
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
                    locations[i < locations.length ? i : 0].location.degreesLat,
                    locations[i < locations.length ? i : 0].location
                      .degreesLong,
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
