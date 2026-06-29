/*
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root
root.render(<App />); // Render your app*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
