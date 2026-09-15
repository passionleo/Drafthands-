import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, HelpCircle, CornerDownLeft, Sparkles } from 'lucide-react';
import { CadCommandHistoryEntry, WhiteboardTool } from '../../types/whiteboard';

interface CadCommandLineProps {
  onExecuteCommand: (cmdString: string) => void;
  history: CadCommandHistoryEntry[];
  currentPrompt?: string;
  onSelectTool: (tool: WhiteboardTool) => void;
}

const CAD_COMMAND_SUGGESTIONS = [
  { cmd: 'LINE', alias: 'L', desc: 'Draw vector line [L length or L len<ang]' },
  { cmd: 'CIRCLE', alias: 'C', desc: 'Draw circle [C rad or C D dia]' },
  { cmd: 'ARC', alias: 'A', desc: 'Draw arc [A rad startAngle endAngle]' },
  { cmd: 'RECTANG', alias: 'REC', desc: 'Draw rectangle [REC width height]' },
  { cmd: 'POLYGON', alias: 'POL', desc: 'Draw regular polygon [POL sides radius]' },
  { cmd: 'ELLIPSE', alias: 'EL', desc: 'Draw conic ellipse [EL rx ry]' },
  { cmd: 'SPLINE', alias: 'SPL', desc: 'Draw smooth curve / French curve' },
  { cmd: 'TRIM', alias: 'TR', desc: 'Trim geometry to cutting edge' },
  { cmd: 'EXTEND', alias: 'EX', desc: 'Extend line to boundary' },
  { cmd: 'OFFSET', alias: 'O', desc: 'Construct parallel concentric geometry [O dist]' },
  { cmd: 'MIRROR', alias: 'MI', desc: 'Mirror geometry across symmetry axis' },
  { cmd: 'FILLET', alias: 'F', desc: 'Round corner with tangential arc' },
  { cmd: 'DIMLINEAR', alias: 'DIM', desc: 'Linear ISO 128 dimensioning' },
  { cmd: 'DYN', alias: 'F12', desc: 'Toggle AutoCAD dynamic dimension input HUD' },
  { cmd: 'ORTHO', alias: 'F8', desc: 'Toggle 90° orthogonal constraint lock' },
  { cmd: 'GRID', alias: 'F7', desc: 'Cycle Millimeter / Isometric / Polar grid' },
  { cmd: 'SNAP', alias: 'F9', desc: 'Toggle 5mm / 10mm precision grid snap' },
  { cmd: 'CLEAR', alias: 'CLS', desc: 'Clear active workspace drawing canvas' },
  { cmd: 'HELP', alias: '?', desc: 'Show all supported Drafthands CAD commands' }
];

export const CadCommandLine: React.FC<CadCommandLineProps> = ({
  onExecuteCommand,
  history,
  currentPrompt = 'Type CAD command or dimensions (e.g. L 120, C 50, REC 100 60, POL 6 50, O 15, DYN)...',
  onSelectTool
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const filteredSuggestions = inputVal.trim()
    ? CAD_COMMAND_SUGGESTIONS.filter(
        (s) =>
          s.cmd.toLowerCase().startsWith(inputVal.toLowerCase()) ||
          s.alias.toLowerCase().startsWith(inputVal.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputVal.trim()) {
        onExecuteCommand(inputVal.trim());
        setInputVal('');
        setShowSuggestions(false);
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]?.command || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]?.command || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputVal('');
    }
  };

  const handleSelectSuggestion = (cmd: string) => {
    onExecuteCommand(cmd);
    setInputVal('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-slate-950 border-t border-slate-800 flex flex-col font-mono text-xs shadow-2xl relative z-20">
      {/* Dynamic Command History Output Area */}
      <div className="max-h-20 overflow-y-auto px-3 py-1.5 space-y-0.5 custom-scrollbar border-b border-slate-900/80 bg-slate-950/90 text-slate-400 select-text">
        {history.slice(-4).map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px] leading-tight">
            <span className="text-cyan-400 font-bold">Command:</span>
            <span className="text-white">{entry.command}</span>
            <span
              className={`text-[10px] ml-auto font-sans px-1.5 py-0.2 rounded ${
                entry.status === 'SUCCESS'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : entry.status === 'ERROR'
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-amber-400 bg-amber-500/10'
              }`}
            >
              {entry.message}
            </span>
          </div>
        ))}
        <div ref={historyBottomRef} />
      </div>

      {/* Interactive Command Input Field with Prompt */}
      <div className="flex items-center px-3 py-2 gap-2 bg-slate-900/90">
        <div className="flex items-center gap-1.5 text-cyan-400 shrink-0 font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Command:</span>
        </div>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={currentPrompt}
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded px-2.5 py-1 text-slate-100 placeholder-slate-500 outline-none text-xs"
          />

          {/* Autocomplete Suggestion Dropup */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute bottom-full mb-1 left-0 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden py-1 z-30">
              <div className="px-2 py-1 text-[10px] text-slate-400 font-sans font-semibold border-b border-slate-800 flex items-center justify-between">
                <span>CAD Autocomplete</span>
                <span className="text-cyan-400">Enter to run</span>
              </div>
              {filteredSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSuggestion(s.cmd)}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-bold">{s.cmd}</span>
                    <span className="text-slate-500 text-[10px]">[{s.alias}]</span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-sans truncate max-w-[140px]">{s.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (inputVal.trim()) {
              onExecuteCommand(inputVal.trim());
              setInputVal('');
              setShowSuggestions(false);
            }
          }}
          className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
          title="Execute Command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
