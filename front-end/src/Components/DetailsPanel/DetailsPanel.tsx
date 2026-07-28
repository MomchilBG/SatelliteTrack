import type { SatelliteInfo } from '../../Types/satellite.ts';
import SatStats from '../SatStats/SatStats.tsx';

const DetailsPanel = ({
  satelliteInfo,
}: {
  satelliteInfo: SatelliteInfo[];
}) => {
  return (
    <>
      {satelliteInfo.map((satellite, id) => (
        <SatStats key={id} satellite={satellite} id={id} />
      ))}
    </>
  );
};

export default DetailsPanel;
