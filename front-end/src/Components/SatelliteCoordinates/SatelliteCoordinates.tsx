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
import {
  defaultNoradIDs,
  failedFetchPlaceholder,
  limitOfSatellites,
} from '../../constants.tsx';

const [getSavedSats, setSavedSats] = [
  () => window.localStorage.getItem('ids'),
  (ids: number[]) => window.localStorage.setItem('ids', ids.join(',')),
];

const initialFetch: APIResponse = await (async () => {
  try {
    const getFetchPath = () => {
      if (getSavedSats() !== null) {
        const ids = getSavedSats()?.split(',');
        return `getbyids?${ids?.map((id) => `ids=${id}`).join('&')}`;
      }
      return 'defaults';
    };
    const response = fetchData(getFetchPath());
    return response;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      satellites: null,
      message: '',
    };
  }
})();

const GetData = () => {
  const [unusedColors, setUnusedColors] = useState(
    Array.from(
      {
        length:
          limitOfSatellites -
          (initialFetch.satellites?.length ||
            Object.values(defaultNoradIDs).length),
      },
      (_, i) =>
        `addedSat_${initialFetch.satellites && initialFetch.satellites.length > 3 ? initialFetch.satellites.length - 3 + i : i}`,
    ),
  );
  const [TLEs, setTLEs] = useState<Satellite[]>(
    initialFetch.satellites
      ? initialFetch.satellites.map((TLE, i) => ({
          ...TLE,
          key:
            i > 2 ? `addedSat_${i - 3}` : TLE.name.split(' ')[0].toLowerCase(),
          loaded: true,
          visible: true,
        }))
      : failedFetchPlaceholder,
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
          if (response.satellites) {
            setTLEs(
              response.satellites.map((TLE, i) => ({
                name: TLE.name,
                id: TLE.id,
                line1: TLE.line1,
                line2: TLE.line2,
                lastUpdated: TLE.lastUpdated,
                key: TLEs[i].key,
                loaded: true,
                visible: TLEs[i].visible,
              })),
            );
          }
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
        ...TLEs.slice(index + 1, TLEs.length),
      ];
      setUnusedColors([...unusedColors, TLEs[index].key]);
      setTLEs(TLEsCopy);
      setSavedSats(TLEsCopy.map((tle) => +tle.id));
    },
    [TLEs, unusedColors],
  );

  const handlePost = useCallback(
    async (noradID: string) => {
      try {
        const response = await postSatellite(noradID);
        if (response.success === false) {
          setPostError(`${response.message} for Norad ID ${noradID}`);
          return 'failed';
        } else {
          if (response.satellites) {
            setPostError('');
            const fetchedSatellite: Satellite = {
              ...response.satellites[0],
              key: unusedColors[0],
              loaded: true,
              visible: true,
            };
            setSavedSats([...TLEs.map((tle) => +tle.id), +fetchedSatellite.id]);
            setTLEs([...TLEs, fetchedSatellite]);
            setUnusedColors(unusedColors.slice(1));
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
        }
        return 'failed';
      } catch (e) {
        console.log(`Error handling post: ${e}`);
        return 'failed';
      }
    },
    [locations, TLEs, unusedColors],
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
            numOfSats={TLEs.length}
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
                {i >= Object.values(defaultNoradIDs).length && (
                  <Button
                    //@ts-expect-error uwu
                    onClick={removeSatellite}
                    onClickArgs={[i]}
                    className="custom-button remove"
                  />
                )}
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
