import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppThemeMode = 'DARK_STUDIO' | 'PAPER_BOARD' | 'BLUEPRINT';

interface AppThemeConfig {
  id: AppThemeMode;
  label: string;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  borderClass: string;
  accentColor: string;
  bgColorHex: string;
  textColorHex: string;
}

export const APP_THEMES: Record<AppThemeMode, AppThemeConfig> = {
  DARK_STUDIO: {
    id: 'DARK_STUDIO',
    label: 'Dark Studio (Deep Navy)',
    bgClass: 'bg-[#0B1120] text-slate-100',
    cardBgClass: 'bg-slate-900',
    textClass: 'text-slate-100',
    borderClass: 'border-slate-800',
    accentColor: '#06b6d4',
    bgColorHex: '#0B1120',
    textColorHex: '#f8fafc'
  },
  PAPER_BOARD: {
    id: 'PAPER_BOARD',
    label: 'Paper Board (Clean White)',
    bgClass: 'bg-white text-slate-900',
    cardBgClass: 'bg-slate-50',
    textClass: 'text-slate-900',
    borderClass: 'border-slate-300',
    accentColor: '#0284c7',
    bgColorHex: '#ffffff',
    textColorHex: '#0f172a'
  },
  BLUEPRINT: {
    id: 'BLUEPRINT',
    label: 'Blueprint (Classic Engineering)',
    bgClass: 'bg-[#0F3460] text-sky-100',
    cardBgClass: 'bg-sky-900/60',
    textClass: 'text-sky-100',
    borderClass: 'border-sky-800',
    accentColor: '#38bdf8',
    bgColorHex: '#0F3460',
    textColorHex: '#e0f2fe'
  }
};

interface AppThemeContextType {
  theme: AppThemeMode;
  setTheme: (theme: AppThemeMode) => void;
  config: AppThemeConfig;
}

const AppThemeContext = createContext<AppThemeContextType>({
  theme: 'DARK_STUDIO',
  setTheme: () => {},
  config: APP_THEMES.DARK_STUDIO
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('drafthands_global_app_theme') as AppThemeMode;
        if (saved && APP_THEMES[saved]) return saved;
      } catch {}
    }
    return 'DARK_STUDIO';
  });

  const setTheme = (newTheme: AppThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('drafthands_global_app_theme', newTheme);
      } catch {}
    }
  };

  const config = APP_THEMES[theme] || APP_THEMES.DARK_STUDIO;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = config.bgColorHex;
      document.body.style.color = config.textColorHex;
    }
  }, [theme, config]);

  return (
    <AppThemeContext.Provider value={{ theme, setTheme, config }}>
      <div className={`min-h-screen w-full transition-colors duration-300 ${config.bgClass}`} style={{ backgroundColor: config.bgColorHex, color: config.textColorHex }}>
        {children}
      </div>
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(AppThemeContext);
