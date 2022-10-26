import { useState } from 'react';
import './styles/App.css';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import QueryBar from './components/QueryBar';
import errorModal from './components/ErrorModal';

function App() {
  const[openModal, setOpenModal] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Greetings from Ekkremis.
        </p>
        <QueryBar />
        <button className ='errorModalbtn' onClick={() => {
          setOpenModal(true);
        }}>Error Log</button>
          {openModal && <errorModal closeModal ={setOpenModal}/>}
      </header>
    </div>
  );
}

export default App;
