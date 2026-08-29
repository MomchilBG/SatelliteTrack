import { useState } from 'react';

import type { SatelliteInfo } from '../../Types/satellite.ts';
import { colors } from '../../constants.tsx';

import TrackingInfoPanel from '../TrackingInfoPanel/TrackingInfoPanel.tsx';
import Button from '../Button/Button.tsx';

import './CollapsableInfo.css';

const CollapsableInfo = ({ satellite }: { satellite: SatelliteInfo }) => {
  const [display, setDisplay] = useState<'none' | 'block'>('none');

  return (
    <>
      <Button
        key={`collapsable-info-${satellite.name}`}
        onClick={() => setDisplay(display === 'none' ? 'block' : 'none')}
        onClickArgs={[]}
        id=""
        disabled={false}
        className="collapsable-info-toggle"
        style={{
          backgroundColor: `rgba(${colors[satellite.key as keyof typeof colors]}, 0.45)`,
        }}
        content={satellite.name}
      />
      <TrackingInfoPanel {...{ satellite, display: display }} />
    </>
  );
};

export default CollapsableInfo;
