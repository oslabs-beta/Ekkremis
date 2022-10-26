import './styles/App.css';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import QueryBar from './components/QueryBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Greetings from Ekkremis.
        </p>
        <QueryBar />
      </header>
    </div>
  );
}

export default App;
