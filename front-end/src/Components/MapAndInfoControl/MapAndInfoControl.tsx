import { useCallback, useEffect, useState } from 'react';

import { fetchData } from '../../Requests/fetchSatellite.ts';
import { postSatellite } from '../../Requests/postSatellite.ts';
import {
  convertTLEtoCoords,
  getSatellitePath,
} from '../../util_funcs/util_funcs.ts';
import type { Satellite, Location } from '../../Types/satellite.ts';
import { defaultNoradIDs, limitOfSatellites } from '../../constants.tsx';

import LeafletMap from '../LeafletMap/LeafletMap.tsx';
import CollapsableInfo from '../CollaspableInfo/CollapsableInfo.tsx';
import Button from '../Button/Button.tsx';
import AddSatellitePanel from '../AddSatellitePanel/AddSatellitePanel.tsx';

import './MapAndInfoControl.css';

const [getSavedIDs, setSavedIDs] = [
  () => window.localStorage.getItem('ids'),
  (ids: number[]) => window.localStorage.setItem('ids', ids.join(',')),
];

const MapAndInfoControl = () => {
  const [unusedColors, setUnusedColors] = useState<string[]>([]);
  const [TLEs, setTLEs] = useState<Satellite[]>([]);
  const [postError, setPostError] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [menu, setMenu] = useState<'info' | 'addSat'>('info');

  useEffect(() => {
    if (TLEs.length === 0) {
      const getFetchPath =
        getSavedIDs() !== null
          ? `getbyids?${getSavedIDs()
              ?.split(',')
              ?.map((id) => `ids=${id}`)
              .join('&')}`
          : 'defaults';

      fetchData(getFetchPath)
        .then((response) => {
          if (response.satellites) {
            setTLEs(
              response.satellites.map((TLE, i) => ({
                ...TLE,
                key:
                  i > 2
                    ? `addedSat_${i - 3}`
                    : TLE.name.split(' ')[0].toLowerCase(),
                loaded: true,
                visible: true,
              })),
            );
            setUnusedColors(
              Array.from(
                {
                  length: limitOfSatellites - response.satellites.length,
                },
                (_, i) =>
                  `addedSat_${response.satellites && response.satellites.length > 3 ? response.satellites.length - 3 + i : i}`,
              ),
            );
            setLocations(
              TLEs.map((TLE) => ({
                location: convertTLEtoCoords(TLE.line1, TLE.line2),
                loaded: true,
              })),
            );
          }
        })
        .catch((error) => {
          console.log('Error with initial fetch: ', error);
        });
    }
    const interval = setInterval(() => {
      fetchData(`getbyids?${TLEs.map((tle) => `ids=${tle.id}`).join('&')}`)
        .then((response) => {
          if (response.satellites) {
            setTLEs(
              response.satellites.map((TLE, i) => ({
                ...TLE,
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
      setSavedIDs(TLEsCopy.map((tle) => +tle.id));
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
            setSavedIDs([...TLEs.map((tle) => +tle.id), +fetchedSatellite.id]);
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

  return TLEs[0]?.loaded && locations[0]?.loaded ? (
    <div id="app">
      <div id="menu">
        <div id="menu-nav">
          <Button
            onClickArgs={[]}
            content="Add Satellite"
            onClick={() => setMenu('addSat')}
            className="menu-nav-button"
            style={{}}
            disabled={false}
            id=""
          />
          <Button
            onClickArgs={[]}
            content="View Info"
            onClick={() => setMenu('info')}
            className="menu-nav-button"
            style={{}}
            disabled={false}
            id=""
          />
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
                  className={`custom-button ${satellite.visible ? 'visible' : 'not-visible'}`}
                />
                <CollapsableInfo
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

export default MapAndInfoControl;
