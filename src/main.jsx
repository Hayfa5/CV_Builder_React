import React, { createContext, useContext, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Create a context
const StateContext = createContext();

// Create a provider component
const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Create a custom hook to use the state context
const useStateValue = () => useContext(StateContext);

// Initial state and reducer definition
const initialState = {
  // Your initial state goes here
};

const reducer = (state, action) => {
  switch (action.type) {
    // Handle different action types here
    default:
      return state;
  }
};

// Ensure there is an element with id 'root' in your HTML
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </React.StrictMode>
  );
} else {
  console.error("No root element found. Ensure there is an element with id 'root' in your HTML.");
}

export { useStateValue };
