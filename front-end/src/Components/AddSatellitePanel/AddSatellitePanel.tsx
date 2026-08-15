import './AddSatellitePanel.css';
import { useCallback, useState } from 'react';
import { defaultNoradIDs } from '../../constants.tsx';

const AddSatellitePanel = ({
  handlePost,
  postError,
  setPostError,
}: {
  handlePost: (noradID: string) => Promise<'failed' | 'successful'>;
  postError: string;
  setPostError: (postError: string) => void;
}) => {
  const [inputContent, setInputContent] = useState('');
  const [noradID, setNoradID] = useState('0');
  const [message, setMessage] = useState({
    success: false,
    error: false,
    content: '',
  });
  const [lastAdded, setLastAdded] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (input: HTMLInputElement) => {
      if (postError.length > 0) {
        setPostError('');
      }
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
        +content === +lastAdded ||
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
        setNoradID(content);
      }
    },
    [lastAdded, postError.length, setPostError],
  );

  const handleClick = useCallback(
    async (noradID: string) => {
      if (!message.error) {
        setLoading(true);
        setInputContent('');
        const result = await handlePost(noradID);
        setLoading(false);
        if (result === 'successful') {
          setLastAdded(noradID);
          setMessage({
            success: true,
            error: false,
            content: `Successfully added satellite with Norad ID ${noradID}`,
          });
        }
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
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            !message.error &&
            postError.length === 0 &&
            handleClick(noradID)
          }
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
      {loading && <p id="norad-id-loading">Loading...</p>}
      {(message.error || postError.length > 0) && (
        <p id="norad-id-input-error">
          {message.error ? message.content : postError}
        </p>
      )}
      {message.success && <p id="norad-id-success">{message.content}</p>}
    </div>
  );
};

export default AddSatellitePanel;
