import './GeneralInfoPanel.css';
import { colors } from '../../constants';

const GeneralInfoPanel = ({
  info,
  id,
  display,
}: {
  info: { name: string; about: string };
  id: number;
  display: string;
}) => {
  return (
    <div
      className="info-panel"
      style={{
        backgroundColor: `rgba(${colors[id]}, 0.35)`,
        display: display,
      }}
    >
      <p className="info-container">{info.about}</p>
    </div>
  );
};

export default GeneralInfoPanel;
