import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import { colors } from '../../constants.tsx';
import { Fragment, useMemo } from 'react';
import satelliteIcon from '../../../img/iss.png';

const LeafletMap = ({
  satellites,
}: {
  satellites: {
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
      zoom: 2,
      center: [0, 0],
      scrollWheelZoom: true,
      worldCopyJump: true,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      minZoom: 2,
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
    <MapContainer {...mapContainerProps}>
      <TileLayer key="tileLayer" {...tileLayerProps} />
      {satellites.map((satellite, id: number) => (
        <Fragment key={`frag-${id}`}>
          <Marker
            key={`marker-${id}`}
            position={satellite.marker_coords}
            icon={icon}
          />
          <Polyline
            key={`polyline-${id}`}
            // @ts-expect-error uwu
            positions={satellite.path}
            color={`rgb(${colors[id % colors.length]})`}
            weight={2}
          />
        </Fragment>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
