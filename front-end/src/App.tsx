import './App.css';
import { aboutCSS, aboutHST, aboutISS } from './constants.ts';
import GetData from './Components/SatelliteCoordinates/SatelliteCoordinates.tsx';
import { useMemo, useState } from 'react';
import { colors } from './constants.ts';
import type { AboutInfo } from './Types/about_info.ts';

const satsGenInfo = [aboutISS, aboutHST, aboutCSS];

function App() {
  const [openedPanel, setOpenedPanel] = useState({
    info: { ...aboutISS },
    id: 0,
  });

  const navBarOnClick = useMemo(
    () => (info: AboutInfo, id: number) => {
      // Set the info container to be in its most scrolled-up position
      const infoContainer = document.querySelector('#info-container');
      if (infoContainer) infoContainer.scrollTop = 0;

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
        <p id="info-container">{openedPanel.info.about}</p>
      </div>
    </>
  );
}

export default App;
