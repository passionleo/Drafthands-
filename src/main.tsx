import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (typeof window !== 'undefined') {
  (window as any).__drafthandsMounted = true;
  const preloader = document.getElementById('dh-pre-loader');
  if (preloader) preloader.remove();
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
