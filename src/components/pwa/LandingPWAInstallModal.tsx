import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Smartphone, WifiOff, Layers, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

interface LandingPWAInstallModalProps {
  /** Optional delay in ms before showing prompt after landing page loads (default: 1500) */
  autoPromptDelay?: number;
}

const DISMISS_STORAGE_KEY = 'drafthands_pwa_prompt_dismissed';

export const LandingPWAInstallModal: React.FC<LandingPWAInstallModalProps> = ({
  autoPromptDelay = 1500
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed or if user previously dismissed
    if (isInstalled) {
      return;
    }

    try {
      const isDismissed = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (isDismissed === 'true') {
        return;
      }
    } catch {
      // ignore localStorage errors
    }

    // Delay showing to avoid jarring popup on initial load
    const timer = setTimeout(() => {
      // Show if installable OR on iOS Safari OR ambient browser
      setIsVisible(true);
    }, autoPromptDelay);

    return () => clearTimeout(timer);
  }, [isInstalled, autoPromptDelay]);

  // If already installed or dismissed, do not render
  if (isInstalled || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    } catch (err) {
      console.warn('[DraftHands PWA] Could not save dismiss state to localStorage', err);
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        const accepted = await install();
        if (accepted) {
          setIsVisible(false);
          try {
            localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
          } catch {
            // ignore
          }
        }
      } finally {
        setIsInstalling(false);
      }
    } else {
      // If the browser hasn't fired the event yet or doesn't support automatic prompt, show gentle guide
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* Non-intrusive Floating Promotional Popup / Banner */}
      <div
        id="pwa-install-promo-modal"
        role="dialog"
        aria-labelledby="pwa-promo-title"
        aria-describedby="pwa-promo-desc"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-md rounded-2xl bg-slate-900/95 border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300 text-slate-100"
      >
        {/* Top Header with Icon & Dismiss Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
              <Smartphone className="h-6 w-6 text-slate-950" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border border-cyan-400">
                <WifiOff className="h-2.5 w-2.5 text-cyan-400" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/40">
                  Fast & Lightweight PWA
                </span>
              </div>
              <h3 id="pwa-promo-title" className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                Install DraftHands App for Offline Access
              </h3>
            </div>
          </div>

          <button
            id="btn-pwa-dismiss-x"
            onClick={handleDismiss}
            aria-label="Dismiss promotional prompt"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Value Proposition Body */}
        <p id="pwa-promo-desc" className="text-xs text-slate-300 mt-2.5 leading-relaxed">
          Get the standalone technical drawing studio directly on your device. Practice WAEC, NECO & NABTEB geometric drafting anytime—even without an active internet connection.
        </p>

        {/* Feature Highlights */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span>Full offline syllabus</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
            <Layers className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
            <span>Zero browser toolbars</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2.5 pt-1">
          <button
            id="btn-pwa-later"
            type="button"
            onClick={handleDismiss}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            Later
          </button>

          <button
            id="btn-pwa-install-now"
            type="button"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-950" />
            <span>{isInstalling ? 'Installing...' : 'Install Now'}</span>
          </button>
        </div>
      </div>

      {/* iOS Safari & Desktop Guide Modal */}
      {showIOSGuide && (
        <div
          id="pwa-install-ios-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install DraftHands</h3>
                <p className="text-xs text-slate-400">Add to your Home Screen</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Install DraftHands on your iPhone or iPad for offline access and full-screen drafting:
                </p>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[11px]">
                      1
                    </span>
                    <span>
                      Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-cyan-400 mx-0.5" /> in the Safari toolbar.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[11px]">
                      2
                    </span>
                    <span>
                      Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-cyan-400 mx-0.5" />.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[11px]">
                      3
                    </span>
                    <span>
                      Tap <strong>Add</strong> in the top-right corner to finish.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  To install DraftHands on your browser or Android device:
                </p>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                      On Chrome or Edge, click the <strong>Install icon</strong> in the URL address bar or browser menu.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                      On Android mobile, tap the browser menu (⋮) and select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowIOSGuide(false);
                handleDismiss();
              }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-cyan-900/30"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
