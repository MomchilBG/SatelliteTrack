import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import { colors } from '../../constants.ts';

const LeafletMap = ({
  satellites,
}: {
  satellites: {
    marker_coords: [number, number];
    path: number[][][];
  }[];
}) => {
  const icon = new Icon({
    iconUrl: '../../../img/iss.png',
    iconSize: [40, 40],
  });

  const mapContainerProps: MapContainerProps = {
    zoom: 7,
    center: satellites[0]?.marker_coords || [0, 0],
    scrollWheelZoom: true,
    worldCopyJump: true,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
    minZoom: 2,
  };

  const tileLayerProps: TileLayerProps = {
    url: 'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=hHud8GDOi5a4Brzsy6hsVNp5CRyQRBREBCuYoVepy0hZRow9gORVtK5bw9Fb21jV',
    attribution:
      '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };

  return (
    <MapContainer {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      {satellites.map((satellite, id: number) => (
        <>
          <Marker
            key={`marker-${id}`}
            position={satellite.marker_coords}
            icon={icon}
          />
          <Polyline
            key={`polyline-${id}`}
            positions={satellite.path}
            color={`rgb(${colors[id % colors.length]})`}
            weight={2}
          />
        </>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
