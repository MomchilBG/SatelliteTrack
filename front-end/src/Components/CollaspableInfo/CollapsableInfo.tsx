import type { SatelliteInfo } from '../../Types/satellite.ts';
import { colors } from '../../constants.tsx';
import './CollapsableInfo.css';
import TrackingInfoPanel from '../TrackingInfoPanel/TrackingInfoPanel.tsx';
import { useState } from 'react';

const CollapsableInfo = ({
  colorsKey,
  title,
  satellite,
}: {
  colorsKey: string;
  title: string;
  satellite: SatelliteInfo;
}) => {
  const [display, setDisplay] = useState<'none' | 'block'>('none');

  return (
    <>
      <button
        onClick={() => setDisplay(display === 'none' ? 'block' : 'none')}
        className="collapsable-info-toggle"
        key={`collapsable-info-${title}`}
        style={{
          backgroundColor: `rgba(${colors[colorsKey as keyof typeof colors]}, 0.45)`,
        }}
      >
        {title}
      </button>
      <TrackingInfoPanel
        {...{ satellite, colorsKey: colorsKey, display: display }}
      />
    </>
  );
};

export default CollapsableInfo;
