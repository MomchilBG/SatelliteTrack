import type { Satellite } from '../../Types/satellite.ts';
import './SatVisibilityToggle.css';

const SatVisibilityToggle = ({
  onClick,
  satellite,
  index,
}: {
  onClick: (
    satellite: Satellite,
    index: number,
    element: HTMLButtonElement,
  ) => void;
  satellite: Satellite;
  index: number;
}) => {
  return (
    <button
      onClick={(event) => onClick(satellite, index, event?.currentTarget)}
      className="visibility-toggle visible"
    />
  );
};

export default SatVisibilityToggle;
