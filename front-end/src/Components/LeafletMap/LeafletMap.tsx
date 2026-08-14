import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import type { Map } from 'leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import { colors } from '../../constants.tsx';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import satelliteIcon from '../../../img/iss.png';
import useResizeObserver from '@react-hook/resize-observer';

const MapController = () => {
  const setMinimumZoom = useCallback((map: Map) => {
    const mapSize = map.getSize();
    const largerSide = mapSize.x > mapSize.y ? mapSize.x : mapSize.y;
    const widthAtZoom0 = 256;
    const ratio = largerSide / widthAtZoom0;
    const minZoom =
      largerSide > widthAtZoom0 ? Math.log(ratio) / Math.log(2) : 0;
    if (map.getZoom() < minZoom) {
      map.setZoom(minZoom);
    }
    map.setMinZoom(minZoom);
  }, []);

  const map = useMap();
  useEffect(() => {
    setMinimumZoom(map);
  }, [map, setMinimumZoom]);

  useResizeObserver(map.getContainer(), () => {
    setMinimumZoom(map);
  });

  return <></>;
};

const LeafletMap = ({
  satellites,
}: {
  satellites: {
    key: string;
    marker_coords: [number, number];
    path: number[][][];
  }[];
}) => {
  const icon = useMemo(
    () =>
      new Icon({
        iconUrl: satelliteIcon,
        iconSize: [40, 40],
      }),
    [],
  );

  const mapContainerProps: MapContainerProps = useMemo(
    () => ({
      zoom: 1,
      zoomSnap: 0.01,
      center: [0, 0],
      scrollWheelZoom: true,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 1,
      preferCanvas: true,
    }),
    [],
  );

  const tileLayerProps: TileLayerProps = useMemo(
    () => ({
      url: 'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=hHud8GDOi5a4Brzsy6hsVNp5CRyQRBREBCuYoVepy0hZRow9gORVtK5bw9Fb21jV',
      attribution:
        '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
    [],
  );

  return (
    <MapContainer
      {...{
        ...mapContainerProps,
      }}
    >
      <TileLayer key="tileLayer" {...tileLayerProps} />
      {satellites.map((satellite, id: number) => (
        <Fragment key={`frag-${id}`}>
          <Marker
            key={`marker-${satellite.key}`}
            position={satellite.marker_coords}
            icon={icon}
          />
          <Polyline
            key={`path-${satellite.key}`}
            // @ts-expect-error uwu
            positions={satellite.path}
            color={`rgb(${colors[satellite.key as keyof typeof colors] || colors.otherSat})`}
            weight={2}
          />
        </Fragment>
      ))}
      <MapController />
    </MapContainer>
  );
};

export default LeafletMap;
