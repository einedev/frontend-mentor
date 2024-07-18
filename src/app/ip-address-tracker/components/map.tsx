
import styles from '../styles/styles.module.scss';

import { MapContainer } from 'react-leaflet/MapContainer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { TileLayer } from 'react-leaflet/TileLayer';
import L from 'leaflet';

export default function Map({pos} : {pos: number[]}) {
  // console.log(pos); // still trigerred when the input gets changed, but no component rerender with useMemo
  // https://stackoverflow.com/questions/76958201/how-to-pass-props-to-child-component-in-next-js-13

  let myIcon = L.icon({ iconUrl: `/ip-address-tracker/icon-location.svg` });

  return (
    <MapContainer style={{ height: '65%' }} center={[pos[0], pos[1]]} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[pos[0], pos[1]]} icon={myIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}