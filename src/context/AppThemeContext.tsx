import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppThemeMode = 'MIDNIGHT_NAVY' | 'PURE_WHITE' | 'EMERALD_DARK' | 'WARM_OBSIDIAN' | 'CYBER_CYAN';

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
  MIDNIGHT_NAVY: {
    id: 'MIDNIGHT_NAVY',
    label: 'Midnight Navy (Default)',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBgClass: 'bg-slate-900',
    textClass: 'text-slate-100',
    borderClass: 'border-slate-800',
    accentColor: '#06b6d4',
    bgColorHex: '#020617',
    textColorHex: '#f8fafc'
  },
  PURE_WHITE: {
    id: 'PURE_WHITE',
    label: 'Pure Light / White',
    bgClass: 'bg-slate-100 text-slate-900',
    cardBgClass: 'bg-white',
    textClass: 'text-slate-900',
    borderClass: 'border-slate-200',
    accentColor: '#0284c7',
    bgColorHex: '#f1f5f9',
    textColorHex: '#0f172a'
  },
  EMERALD_DARK: {
    id: 'EMERALD_DARK',
    label: 'Emerald Technical Dark',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBgClass: 'bg-zinc-900',
    textClass: 'text-zinc-100',
    borderClass: 'border-zinc-800',
    accentColor: '#10b981',
    bgColorHex: '#09090b',
    textColorHex: '#f4f4f5'
  },
  WARM_OBSIDIAN: {
    id: 'WARM_OBSIDIAN',
    label: 'Warm Obsidian',
    bgClass: 'bg-neutral-950 text-neutral-100',
    cardBgClass: 'bg-neutral-900',
    textClass: 'text-neutral-100',
    borderClass: 'border-neutral-800',
    accentColor: '#f59e0b',
    bgColorHex: '#0a0a0a',
    textColorHex: '#f5f5f5'
  },
  CYBER_CYAN: {
    id: 'CYBER_CYAN',
    label: 'Cyber Cyan Dark',
    bgClass: 'bg-sky-950 text-sky-100',
    cardBgClass: 'bg-sky-900/60',
    textClass: 'text-sky-100',
    borderClass: 'border-sky-800',
    accentColor: '#38bdf8',
    bgColorHex: '#082f49',
    textColorHex: '#e0f2fe'
  }
};

interface AppThemeContextType {
  theme: AppThemeMode;
  setTheme: (theme: AppThemeMode) => void;
  config: AppThemeConfig;
}

const AppThemeContext = createContext<AppThemeContextType>({
  theme: 'MIDNIGHT_NAVY',
  setTheme: () => {},
  config: APP_THEMES.MIDNIGHT_NAVY
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('drafthands_global_app_theme') as AppThemeMode;
        if (saved && APP_THEMES[saved]) return saved;
      } catch {}
    }
    return 'MIDNIGHT_NAVY';
  });

  const setTheme = (newTheme: AppThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('drafthands_global_app_theme', newTheme);
      } catch {}
    }
  };

  const config = APP_THEMES[theme] || APP_THEMES.MIDNIGHT_NAVY;

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
