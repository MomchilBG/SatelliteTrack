import type { SatelliteInfo } from '../../Types/satellite.ts';
import { colors } from '../../constants.ts';
import './SatStats.css';
import { useState } from 'react';

const SatStats = ({
  satellite,
  id,
}: {
  satellite: SatelliteInfo;
  id: number;
}) => {
  const [display, setDisplay] = useState('none');

  const expandSatelliteInfo = () => {
    setDisplay(display === 'none' ? 'block' : 'none');
  };

  return (
    <>
      <button
        onClick={() => expandSatelliteInfo()}
        className="satellite-name"
        key={`satellite-name-${id}`}
        style={{
          backgroundColor: `rgba(${colors[id % colors.length]}, 0.45)`,
        }}
      >
        {satellite.name}
      </button>

      <div
        key={`satellite-info-${id}`}
        className="satellite-info"
        style={{
          backgroundColor: `rgba(${colors[id % colors.length]}, 0.35)`,
          display: display,
        }}
      >
        <div className="data-item">
          <p className="data-title">Latitude: </p>
          <p className="data-value">
            {satellite.location?.degreesLat.toFixed(2)}
          </p>
        </div>
        <div className="data-item">
          <p className="data-title">Longitude:</p>
          <p className="data-value">
            {satellite.location?.degreesLong.toFixed(2)}
          </p>
        </div>
        <div className="data-item">
          <p className="data-title">Altitude: </p>
          <p className="data-value">
            {satellite.location?.height.toFixed(2)}km
          </p>
        </div>
        <div className="data-item">
          <p className="data-title">Velocity: </p>
          <p className="data-value">
            {satellite.location?.velocity.toFixed(2)}km/s
          </p>
        </div>
      </div>
    </>
  );
};

export default SatStats;
