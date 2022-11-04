import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// const React = require('react');
// const ReactDOM = require('react-dom/client');
// require('./styles/index.css');
// const App = require('./App');



const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
