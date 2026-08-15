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
  const [message, setMessage] = useState({
    success: false,
    error: false,
    content: '',
  });
  const [lastAdded, setLastAdded] = useState(0);

  const handleChange = useCallback(
    (input: HTMLInputElement) => {
      setInputContent(input.value);
      const content = input.value;

      if (content.length === 0) {
        setMessage({ success: false, error: false, content: '' });
      } else if (
        typeof +content !== 'number' ||
        Number.isNaN(+content) ||
        +content <= 0
      ) {
        setMessage({
          success: false,
          error: true,
          content: 'Please type a valid NoradID!',
        });
      } else if (
        +content === lastAdded ||
        Object.values(defaultNoradIDs).some((id) => +content === id)
      ) {
        setMessage({
          success: false,
          error: true,
          content: 'This satellite is already being tracked!',
        });
      } else {
        setMessage({
          success: false,
          error: false,
          content: '',
        });
        setNoradID(+content);
      }
    },
    [lastAdded],
  );

  const handleClick = useCallback(
    (noradID: number) => {
      if (!message.error) {
        setLastAdded(noradID);
        setInputContent('');
        handlePost(noradID);
        setMessage({
          success: true,
          error: false,
          content: `Successfully added satellite with Norad ID ${noradID}`,
        });
      }
    },
    [message, handlePost],
  );

  return (
    <div id="add-satellite-panel">
      <div>
        <input
          type="text"
          id="norad-id-input"
          onChange={(event) => handleChange(event.currentTarget)}
          value={inputContent}
          placeholder="Norad ID..."
        />
        <button
          id="add-satellite-button"
          onClick={() => handleClick(noradID)}
          disabled={message.error || inputContent.length === 0}
        >
          Add
        </button>
      </div>
      {message.error && <p id="norad-id-input-error">{message.content}</p>}
      {message.success && <p id="norad-id-success">{message.content}</p>}
    </div>
  );
};

export default AddSatellitePanel;
