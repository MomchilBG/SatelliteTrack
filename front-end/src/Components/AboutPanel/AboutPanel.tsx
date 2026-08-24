import { useState, useCallback } from 'react';

import type { AboutInfo } from '../../Types/about_info.ts';
import {
  colors,
  aboutISS,
  aboutHST,
  aboutCSS,
  aboutProject,
  aboutMe,
} from '../../constants.tsx';

import Button from '../Button/Button.tsx';

import './AboutPanel.css';

const satsGenInfo = [aboutISS, aboutHST, aboutCSS];
const genInfo = [aboutProject, aboutMe];

const AboutPanel = () => {
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
    <div
      id="panels-container"
      style={{
        backgroundColor: `rgba(${colors[openedPanel.info.key as keyof typeof colors]}, 0.35)`,
      }}
    >
      <div id="info-panel-nav-bar">
        <div id="sats-gen-info">
          {satsGenInfo.map((info) => (
            <Button
              key={`${info.name}-btn`}
              className={'nav-bar-section'}
              onClick={() => navBarOnClick(info)}
              onClickArgs={[]}
              content={info.name}
              style={{
                backgroundColor: `rgba(${colors[info.key as keyof typeof colors]}, 0.45)`,
              }}
              disabled={false}
              id=""
            />
          ))}
        </div>
        <div id="other-gen-info">
          {genInfo.map((info) => (
            <Button
              key={`${info.name}-btn`}
              className="nav-bar-section"
              onClick={() => navBarOnClick(info)}
              onClickArgs={[]}
              content={info.name}
              style={{ backgroundColor: `rgb(27, 46, 46)` }}
              disabled={false}
              id=""
            />
          ))}
        </div>
      </div>
      <p id="info-container">{openedPanel.info.about}</p>
    </div>
  );
};

export default AboutPanel;
