import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __drafthandsInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__drafthandsInstallPrompt) {
      return window.__drafthandsInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed or running in PWA window)
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://'));
    setIsInstalled(Boolean(isStandalone));

    // Detect iOS devices
    if (typeof window !== 'undefined' && window.navigator) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
      setIsIOS(isIOSDevice);
    }

    // Check if global prompt was already saved before this hook mounted
    if (typeof window !== 'undefined' && window.__drafthandsInstallPrompt) {
      setDeferredPrompt(window.__drafthandsInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__drafthandsInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptCapturedEvent = () => {
      if (window.__drafthandsInstallPrompt) {
        setDeferredPrompt(window.__drafthandsInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__drafthandsInstallPrompt = null;
      try {
        localStorage.setItem('drafthands_pwa_installed', 'true');
      } catch (err) {
        // ignore localStorage failure in private modes
      }
      console.log('[DraftHands PWA] Application installed to home screen successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('drafthands:pwa-prompt-captured', handlePromptCapturedEvent);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('drafthands:pwa-app-installed', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('drafthands:pwa-prompt-captured', handlePromptCapturedEvent);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('drafthands:pwa-app-installed', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    const promptToUse = deferredPrompt || (typeof window !== 'undefined' ? window.__drafthandsInstallPrompt : null);
    if (!promptToUse) return false;
    try {
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          window.__drafthandsInstallPrompt = null;
          try {
            localStorage.setItem('drafthands_pwa_installed', 'true');
          } catch {
            // ignore
          }
        }
        return true;
      }
    } catch (err) {
      console.error('[DraftHands PWA] Installation prompt failed:', err);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: Boolean(deferredPrompt || (typeof window !== 'undefined' && window.__drafthandsInstallPrompt)),
    isInstalled,
    isIOS,
    install,
    deferredPrompt,
  };
}
