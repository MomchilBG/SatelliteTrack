import './App.css';
import { aboutCSS, aboutHST, aboutISS } from './constants.ts';
import GetData from './Components/SatelliteCoordinates/SatelliteCoordinates.tsx';
import GeneralInfoPanel from './Components/GeneralInfoPanel/GeneralInfoPanel.tsx';
import CollapsableInfo from './Components/CollaspableInfo/CollapsableInfo.tsx';
import { useMemo, useState } from 'react';

const satsGenInfo = [aboutISS, aboutHST, aboutCSS];

function App() {
  const [openedPanels, setOpenedPanels] = useState({
    0: 'block',
    1: 'none',
    2: 'none',
  });

  const toggleInfo = useMemo(
    () => (id: number) => {
      const copy = { ...openedPanels };

      for (const panel in openedPanels) {
        // @ts-expect-error uwu
        copy[panel as keyof typeof copy] = 'none';
      }
      copy[id as keyof typeof copy] = 'block';

      setOpenedPanels({
        ...copy,
      });
    },
    [openedPanels],
  );

  return (
    <>
      <GetData />
      <div id="panels-container">
        {satsGenInfo.map((info, i) => (
          <CollapsableInfo
            key={`genInfo${i}`}
            title={info.name}
            props={{ info: info }}
            id={i}
            // @ts-expect-error uwu
            Comp={GeneralInfoPanel}
            onClick={toggleInfo}
            display={openedPanels[i as keyof typeof openedPanels]}
          />
        ))}
      </div>
    </>
  );
}

export default App;
