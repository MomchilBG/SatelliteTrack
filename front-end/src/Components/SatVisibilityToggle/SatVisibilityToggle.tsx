import type { Satellite } from '../../Types/satellite.ts';
import './SatVisibilityToggle.css';

const SatVisibilityToggle = ({
  onClick,
  satellite,
}: {
  onClick: (satellite: Satellite, element: HTMLButtonElement) => void;
  satellite: Satellite;
}) => {
  return (
    <button
      onClick={(event) => onClick(satellite, event?.currentTarget)}
      className="visibility-toggle visible"
    />
  );
};

export default SatVisibilityToggle;
