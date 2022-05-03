// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
// bootstrap js
import $ from 'jquery'
import Popper from 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'
// React stuff
import React from 'react';
import ReactDOM from 'react-dom/client';
// Core styles
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
