
import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import GlobalErrorBoundary from './components/GlobalErrorBoundary';

import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
