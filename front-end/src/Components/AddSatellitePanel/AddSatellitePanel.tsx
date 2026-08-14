import './AddSatellitePanel.css';
import { useCallback, useState } from 'react';
import { defaultNoradIDs } from '../../constants';

const AddSatellitePanel = ({
  handlePost,
}: {
  handlePost: (noradID: number) => void;
}) => {
  const [inputContent, setInputContent] = useState('');
  const [noradID, setNoradID] = useState(0);
  const [error, setError] = useState({
    state: false,
    content: '',
  });
  const [lastAdded, setLastAdded] = useState(0);

  const handleChange = useCallback(
    (input: HTMLInputElement) => {
      setInputContent(input.value);
      const content = input.value;

      if (content.length === 0) {
        setError({ state: false, content: '' });
      } else if (
        typeof +content !== 'number' ||
        Number.isNaN(+content) ||
        +content <= 0
      ) {
        setError({ state: true, content: 'Please type a valid NoradID!' });
      } else if (
        +content === lastAdded ||
        Object.values(defaultNoradIDs).some((id) => +content === id)
      ) {
        setError({
          state: true,
          content: 'This satellite is already being tracked!',
        });
      } else {
        setError({ state: false, content: '' });
        setNoradID(+content);
      }
    },
    [lastAdded],
  );

  const handleClick = useCallback(
    (noradID: number) => {
      if (!error.state && noradID !== lastAdded) {
        setLastAdded(noradID);
        setInputContent('');
        handlePost(noradID);
      }
    },
    [error, lastAdded, handlePost],
  );

  return (
    <div id="add-satellite-panel">
      <div>
        <input
          type="text"
          id="norad-id-input"
          onChange={(event) => handleChange(event.currentTarget)}
          value={inputContent}
          placeholder=""
        />
        <button
          onClick={() => handleClick(noradID)}
          disabled={error.state || inputContent.length === 0}
        >
          Add Satellite
        </button>
      </div>
      {error.state && <p id="norad-id-input-error">{error.content}</p>}
    </div>
  );
};

export default AddSatellitePanel;
