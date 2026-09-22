import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  VideoOff, 
  MicOff, 
  RefreshCw, 
  Camera, 
  ShieldAlert, 
  Compass, 
  UserX,
  Radio
} from 'lucide-react';

interface LiveMediaErrorBoundaryProps {
  children: ReactNode;
  mode?: 'tile' | 'grid' | 'overlay';
  participantName?: string;
  onRetry?: () => void;
  className?: string;
}

interface LiveMediaErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
}

/**
 * LiveMediaErrorBoundary
 * Specifically isolates WebRTC media stream, camera track, and participant tile failures.
 * Prevents any white screen or blank canvas crash in the live technical drawing classroom.
 */
export class LiveMediaErrorBoundary extends Component<
  LiveMediaErrorBoundaryProps,
  LiveMediaErrorBoundaryState
> {
  constructor(props: LiveMediaErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<LiveMediaErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[LiveMediaErrorBoundary Caught Media Failure]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRecover = () => {
    this.setState({ isRetrying: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, errorInfo: null, isRetrying: false });
      if (this.props.onRetry) {
        try {
          this.props.onRetry();
        } catch (e) {
          console.warn('[LiveMediaErrorBoundary] Retry callback threw:', e);
        }
      }
    }, 250);
  };

  render() {
    if (this.state.hasError) {
      const { mode = 'tile', participantName = 'Participant', className = '' } = this.props;
      const { error, isRetrying } = this.state;

      // 1. TILE MODE FALLBACK (Single participant video tile)
      if (mode === 'tile') {
        return (
          <div 
            className={`w-full h-full min-h-[120px] bg-slate-950/95 border border-amber-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center select-none relative overflow-hidden ${className}`}
          >
            {/* Subtle blueprint grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                backgroundSize: '16px 16px'
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/40">
                <VideoOff className="w-4 h-4 text-amber-400" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                  {participantName}
                </p>
                <p className="text-[10px] text-amber-400/90 font-mono flex items-center justify-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Stream Paused</span>
                </p>
              </div>

              <button
                type="button"
                onClick={this.handleRecover}
                disabled={isRetrying}
                className="mt-1 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-cyan-300 text-[10px] font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <RotateCcw className={`w-2.5 h-2.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Reconnecting...' : 'Reconnect Stream'}</span>
              </button>
            </div>
          </div>
        );
      }

      // 2. GRID / FULL STAGE MODE FALLBACK (Entire video panel recovery)
      return (
        <div 
          className={`flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 select-none ${className}`}
        >
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-wide">
                Video Subsystem Recovered
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A WebRTC stream or rendering exception was caught safely. Your technical drawing whiteboard and audio channel remain protected.
              </p>
            </div>

            {error?.message && (
              <div className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 text-left truncate">
                {error.message}
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={this.handleRecover}
                disabled={isRetrying}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Re-initializing...' : 'Restart Media Stream'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
