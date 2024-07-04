import React from 'react';
import { createRoot } from 'react-dom/client'; // Importez createRoot depuis react-dom/client

import App from './App';
import reducer, { initialState } from './store/reducer';
import { StateProvider } from './store/StateProvider';

// Utilisez createRoot à la place de ReactDOM.render
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>
);
