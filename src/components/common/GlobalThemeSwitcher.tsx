import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useAppTheme, APP_THEMES, AppThemeMode } from '../../context/AppThemeContext';

export const GlobalThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useAppTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col gap-1.5 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" /> App Background Theme
            </span>
            <span className="text-[10px] font-mono text-slate-400">Customizable</span>
          </div>
          {(Object.keys(APP_THEMES) as AppThemeMode[]).map((mode) => {
            const t = APP_THEMES[mode];
            const isSelected = theme === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setTheme(mode);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-600 text-white shadow' 
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-2xl shadow-cyan-600/40 flex items-center gap-2 border border-cyan-400/40 transition-all cursor-pointer group"
        title="Customize Application Background Color Theme"
      >
        <Palette className="w-4 h-4 text-cyan-200 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Theme: {APP_THEMES[theme]?.label.split(' ')[0]}</span>
      </button>
    </div>
  );
};
