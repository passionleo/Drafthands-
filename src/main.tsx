import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (typeof window !== 'undefined') {
  (window as any).__drafthandsMounted = true;
  const preloader = document.getElementById('dh-pre-loader');
  if (preloader) preloader.remove();
}

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} catch (e: any) {
  console.error("Critical mounting error:", e);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height:100vh;background:#020617;color:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:sans-serif;">
        <div style="max-width:440px;background:#0f172a;border:1px solid rgba(14,165,233,0.3);border-radius:16px;padding:28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <h2 style="font-size:18px;font-weight:bold;margin:0 0 8px 0;color:#38bdf8;">DraftHands Academy Notice</h2>
          <p style="font-size:12px;color:#94a3b8;margin:0 0 20px 0;line-height:1.5;">Session initialization encountered an interruption. Click below to reload.</p>
          <button onclick="window.location.reload()" style="background:#0284c7;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;">Reload Session</button>
        </div>
      </div>
    `;
  }
}
