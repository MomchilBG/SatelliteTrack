import type { SatelliteInfo } from '../../Types/satellite.ts';
import { colors } from '../../constants.ts';
import './CollapsableInfo.css';
import React from 'react';

const CollapsableInfo = ({
  title,
  props,
  id,
  Comp,
  onClick,
  display,
}: {
  title: string;
  props:
    | { satellite: SatelliteInfo }
    | { info: { name: string; about: string } };
  id: number;
  Comp: React.ComponentType<
    | { satellite: SatelliteInfo; id: number; display: string }
    | { info: { name: string; about: string }; id: number; display: string }
  >;
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
          backgroundColor: `rgba(${colors[id % colors.length]}, 0.45)`,
        }}
      >
        {title}
      </button>
      <Comp {...{ ...props, id: id, display: display }} />
    </>
  );
};

export default CollapsableInfo;
