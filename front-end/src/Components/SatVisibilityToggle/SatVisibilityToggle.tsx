import type { Satellite } from '../../Types/satellite';

const SatVisibilityToggle = ({
  onClick,
  satellite,
}: {
  onClick: (satellite: Satellite) => void;
  satellite: Satellite;
}) => {
  return <button onClick={() => onClick(satellite)}>toggle</button>;
};

export default SatVisibilityToggle;
