import './App.css';
import { aboutCSS, aboutHST, aboutISS } from './constants.ts';
import GetData from './Components/SatelliteCoordinates/SatelliteCoordinates.tsx';
import { useMemo, useState } from 'react';
import { colors } from './constants.ts';

const satsGenInfo = [aboutISS, aboutHST, aboutCSS];

function App() {
  const [openedPanel, setOpenedPanel] = useState({ info: aboutISS, id: 0 });

  const navBarOnClick = useMemo(
    () => (info: { name: string; about: string }, id: number) => {
      setOpenedPanel({ info: info, id: id });
    },
    [],
  );

  return (
    <>
      <GetData />
      <div
        id="panels-container"
        style={{
          backgroundColor: `rgba(${colors[openedPanel.id % colors.length]}, 0.35)`,
        }}
      >
        <div id="info-panel-nav-bar">
          {satsGenInfo.map((info, i) => (
            <button
              className="nav-bar-section"
              onClick={() => navBarOnClick(info, i)}
              style={{
                backgroundColor: `rgba(${colors[i % colors.length]}, 0.45)`,
              }}
            >
              {info.name}
            </button>
          ))}
        </div>
        <p className="info-container">{openedPanel.info.about}</p>
      </div>
    </>
  );
}

export default App;
