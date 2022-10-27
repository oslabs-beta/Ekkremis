import './styles/App.css';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Dashboard />
        {/* <FrontPage/> */}
    </div>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<FrontPage />}>
    //       {/* <Route index element={<Home />} /> */}
    //       <Route path="dashboard" element={<Dashboard />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
