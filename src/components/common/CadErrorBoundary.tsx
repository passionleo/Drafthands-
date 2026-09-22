import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Wrench, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface CadErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  compact?: boolean;
  className?: string;
}

interface CadErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

/**
 * CadErrorBoundary
 * Catches rendering, parsing, and geometry errors within CAD interfaces,
 * preventing white screen crashes and providing a single-click recovery action.
 */
export class CadErrorBoundary extends Component<CadErrorBoundaryProps, CadErrorBoundaryState> {
  state: CadErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  static getDerivedStateFromError(error: Error): Partial<CadErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CAD Error Boundary Caught Exception]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRecover = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (e) {
        console.warn('Error boundary onReset handler failed:', e);
      }
    }
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { title, fallbackMessage, compact, className = '' } = this.props;
      const { error, showDetails } = this.state;

      // Compact layout for toolbars / prompt bars
      if (compact) {
        return (
          <div className={`w-full bg-slate-900 border-b border-amber-500/40 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${className}`}>
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">{title || 'CAD Interface Recovered'}:</strong>{' '}
                {fallbackMessage || 'A parsing or state evaluation error occurred.'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {error?.message && (
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <span>Details</span>
                  {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}

              <button
                type="button"
                onClick={this.handleRecover}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recover Interface</span>
              </button>
            </div>

            {showDetails && error?.message && (
              <div className="w-full mt-2 p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-rose-300/90 font-mono break-all">
                {error.message}
              </div>
            )}
          </div>
        );
      }

      // Full container layout for CAD viewport / workspace
      return (
        <div className={`flex flex-col items-center justify-center p-8 w-full h-full min-h-[360px] bg-slate-950 text-slate-100 ${className}`}>
          <div className="max-w-md w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-5 text-center backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/60">
              <Wrench className="w-7 h-7 text-cyan-300" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white flex items-center justify-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{title || 'CAD Workspace Recovery'}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {fallbackMessage ||
                  'An unexpected state or rendering exception occurred in the technical drawing engine. You can safely restore the viewport to standard ISO coordinates.'}
              </p>
            </div>

            {error?.message && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="text-[11px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-1"
                >
                  <span>Diagnostic Info</span>
                  {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showDetails && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300/90 overflow-x-auto max-h-32">
                    {error.message}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                id="btn-recover-cad-workspace"
                onClick={this.handleRecover}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore CAD Workspace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
