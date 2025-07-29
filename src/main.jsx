// Polyfills for Node.js modules
import { Buffer } from 'buffer';
import process from 'process';

// Make them globally available
window.Buffer = Buffer;
window.process = process;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './styles/global.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
)
