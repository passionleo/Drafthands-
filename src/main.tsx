import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Drafthands Error Boundary Caught]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('drafthands_subscription_v1');
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-white">Drafthands Academy Notice</h1>
            <p className="text-sm text-slate-400">
              An unexpected display issue occurred while loading this session. You can reload the application or restore the default workspace state.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
              >
                Reload Session
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Reset & Launch
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global window unhandled error and rejection safety net for mobile browsers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[Drafthands Uncaught Error]', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Drafthands Unhandled Rejection]', event.reason);
  });

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[DraftHands PWA] Service Worker active with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[DraftHands PWA] Service Worker registration failed:', err);
        });
    });
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <RootErrorBoundary>
          <App />
        </RootErrorBoundary>
      </StrictMode>,
    );
  } catch (err: any) {
    console.error('[Drafthands Root Mount Error]', err);
    rootElement.innerHTML = `
      <div style="min-height:100vh;background-color:#020617;color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;text-align:center;">
        <div style="max-width:420px;background-color:#0f172a;border:1px solid #334155;border-radius:16px;padding:24px;">
          <h2 style="font-size:18px;font-weight:bold;margin-bottom:8px;color:#38bdf8;">Drafthands Academy</h2>
          <p style="font-size:13px;color:#94a3b8;margin-bottom:16px;">Starting your engineering workspace...</p>
          <button onclick="window.location.reload()" style="background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;">
            Tap to Reload
          </button>
        </div>
      </div>
    `;
  }
}
