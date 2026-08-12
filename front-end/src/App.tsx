import './App.css';
import {
  aboutCSS,
  aboutHST,
  aboutISS,
  aboutProject,
  aboutMe,
} from './constants.tsx';
import GetData from './Components/SatelliteCoordinates/SatelliteCoordinates.tsx';
import { useCallback, useState } from 'react';
import { colors } from './constants.tsx';
import type { AboutInfo } from './Types/about_info.ts';

const satsGenInfo = [aboutISS, aboutHST, aboutCSS];
const genInfo = [aboutProject, aboutMe];

function App() {
  const [openedPanel, setOpenedPanel] = useState({
    info: { ...aboutISS },
  });

  const navBarOnClick = useCallback((info: AboutInfo) => {
    // Set the info container to be in its most scrolled-up position
    const infoContainer = document.querySelector('#info-container');
    if (infoContainer) infoContainer.scrollTop = 0;

    setOpenedPanel({ info: info });
  }, []);

  return (
    <>
      <GetData />
      <div
        id="panels-container"
        style={{
          backgroundColor: `rgba(${colors[openedPanel.info.key as keyof typeof colors]}, 0.35)`,
        }}
      >
        <div id="info-panel-nav-bar">
          <div id="sats-gen-info">
            {satsGenInfo.map((info) => (
              <button
                key={`${info.name}-btn`}
                className="nav-bar-section"
                onClick={() => navBarOnClick(info)}
                style={{
                  backgroundColor: `rgba(${colors[info.key as keyof typeof colors]}, 0.45)`,
                }}
              >
                {info.name}
              </button>
            ))}
          </div>
          <div id="other-gen-info">
            {genInfo.map((info) => (
              <button
                key={`${info.name}-btn`}
                className="nav-bar-section"
                onClick={() => navBarOnClick(info)}
                style={{
                  backgroundColor: `rgb(27, 46, 46)`,
                }}
              >
                {info.name}
              </button>
            ))}
          </div>
        </div>
        <p id="info-container">{openedPanel.info.about}</p>
      </div>
    </>
  );
}

export default App;
