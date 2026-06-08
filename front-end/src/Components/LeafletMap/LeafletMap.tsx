import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import type {
  MarkerProps,
  MapContainerProps,
  TileLayerProps,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

const LeafletMap = ({ marker_coords }: { marker_coords: [number, number] }) => {
  const icon = new Icon({
    iconUrl: '../../../img/iss.png',
    iconSize: [40, 40],
  });

  const markerProps: MarkerProps = {
    position: marker_coords,
    icon: icon,
  };

  const mapContainerProps: MapContainerProps = {
    zoom: 7,
    center: marker_coords,
    scrollWheelZoom: true,
  };

  const tileLayerProps: TileLayerProps = {
    url: 'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=hHud8GDOi5a4Brzsy6hsVNp5CRyQRBREBCuYoVepy0hZRow9gORVtK5bw9Fb21jV',
    attribution:
      '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };

  return (
    <MapContainer {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      {marker_coords && <Marker {...markerProps}></Marker>}
    </MapContainer>
  );
};

export default LeafletMap;
