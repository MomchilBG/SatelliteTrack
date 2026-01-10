import './App.css';
import GetData from './Requests/test_request';

function App() {
  return (
    <>
      <h2>Hello, world!</h2>
      <GetData time={new Date()} />{' '}
    </>
  );
}

export default App;
