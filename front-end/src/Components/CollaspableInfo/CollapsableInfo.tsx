import type { SatelliteInfo } from '../../Types/satellite.ts';
import { colors } from '../../constants.tsx';
import './CollapsableInfo.css';
import React from 'react';

const CollapsableInfo = ({
  colorsKey,
  title,
  props,
  id,
  Comp,
  onClick,
  display,
}: {
  colorsKey: string;
  title: string;
  props: { satellite: SatelliteInfo };
  id: number;
  Comp: React.ComponentType<{
    satellite: SatelliteInfo;
    colorsKey: string;
    display: string;
  }>;
  onClick: (id: number) => void;
  display: string;
}) => {
  return (
    <>
      <button
        onClick={() => onClick(id)}
        className="collapsable-info"
        key={`collapsable-info-${id}`}
        style={{
          backgroundColor: `rgba(${colors[colorsKey as keyof typeof colors]}, 0.45)`,
        }}
      >
        {title}
      </button>
      <Comp {...{ ...props, colorsKey: colorsKey, display: display }} />
    </>
  );
};

export default CollapsableInfo;
