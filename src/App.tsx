import { useState } from 'react';
import './styles/App.css';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import NoPage from './components/smallComps/NoPage';
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, RouteComponentProps } from "react-router-dom"; //
import { HashRouter as Router, Route, Routes } from "react-router-dom"; //

type TParams =  { id: string };

function App() {
  return (

    <Router>
      <Routes>
        <Route index element={<FrontPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
