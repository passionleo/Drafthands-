import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Send, 
  CornerDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Play, 
  Sliders, 
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { 
  parseNaturalLanguageCadPrompt, 
  ParsedCadResult, 
  ExtractedCadParam 
} from '../../utils/aiCadPromptParser';
import { DrawingTopic } from '../../types/curriculum';

interface AiPromptToCadBarProps {
  onExecuteCadCommand: (result: ParsedCadResult, mode: 'RENDER_FINAL' | 'SIMULATE_STEPS') => void;
  activeTopic?: DrawingTopic;
  currentParameters?: Record<string, number>;
  placeholder?: string;
  compact?: boolean;
}

const PRESET_CAD_PROMPTS = [
  {
    label: 'Parabola 120x80mm (WAEC Q1)',
    prompt: 'Construct a parabola with span 120mm and rise 80mm',
    type: 'PARABOLA'
  },
  {
    label: 'Ellipse 180x110mm',
    prompt: 'Construct an ellipse with major axis 180mm and minor axis 110mm',
    type: 'ELLIPSE'
  },
  {
    label: 'Line Bisector 120mm',
    prompt: 'Bisect a line of length 120mm',
    type: 'LINE'
  },
  {
    label: 'Angle 60° (Compass)',
    prompt: 'Construct an angle of 60 degrees with arm length 120mm',
    type: 'ANGLE'
  },
  {
    label: 'Hexagon Side 50mm',
    prompt: 'Draw a regular hexagon with side 50mm',
    type: 'HEXAGON'
  },
  {
    label: 'Equilateral Triangle 90mm',
    prompt: 'Construct an equilateral triangle with base 90mm',
    type: 'TRIANGLE'
  },
  {
    label: 'Belt Drive Tangency',
    prompt: 'Construct external tangency between two circles of radii 35mm and 20mm with distance 90mm',
    type: 'TANGENCY'
  },
  {
    label: 'Involute Curve 50mm',
    prompt: 'Construct an involute of a circle diameter 50mm',
    type: 'INVOLUTE'
  }
];

export const AiPromptToCadBar: React.FC<AiPromptToCadBarProps> = ({
  onExecuteCadCommand,
  activeTopic,
  currentParameters = {},
  placeholder = "Enter CAD prompt (e.g. 'Construct a parabola with span 120mm and rise 80mm')... [Press / to focus]",
  compact = false
}) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [lastExecution, setLastExecution] = useState<{
    result: ParsedCadResult;
    timestamp: number;
    durationMs: number;
  } | null>(null);
  const [recentHistory, setRecentHistory] = useState<string[]>([
    'Construct a parabola with span 120mm and rise 80mm',
    'Construct an ellipse with major axis 180mm and minor axis 110mm',
    'Bisect a line of length 120mm'
  ]);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut to focus command bar: '/' or 'Ctrl+K'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Live lightweight parser preview as user types (wrapped in useMemo with safe try-catch)
  const liveParseResult: ParsedCadResult | null = useMemo(() => {
    try {
      if (!promptInput || typeof promptInput !== 'string') return null;
      const clean = promptInput.trim();
      if (clean.length < 3) return null;
      return parseNaturalLanguageCadPrompt(clean);
    } catch (parseErr) {
      console.warn('[AI CAD Live Parse Handled Safely]', parseErr);
      return null;
    }
  }, [promptInput]);

  const handleExecute = (mode: 'RENDER_FINAL' | 'SIMULATE_STEPS' = 'RENDER_FINAL') => {
    try {
      const query = (typeof promptInput === 'string' ? promptInput : '').trim();
      if (!query) return;

      const startTime = performance.now();
      const result = parseNaturalLanguageCadPrompt(query);
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      if (result && result.matched) {
        setLastExecution({
          result,
          timestamp: Date.now(),
          durationMs
        });
        // Add to recent history (avoid duplicates)
        setRecentHistory(prev => [query, ...(Array.isArray(prev) ? prev : []).filter(p => p && p.toLowerCase() !== query.toLowerCase())].slice(0, 8));
        if (typeof onExecuteCadCommand === 'function') {
          try {
            onExecuteCadCommand(result, mode);
          } catch (cmdErr) {
            console.error('[AI CAD Execution Callback Failed]', cmdErr);
          }
        }
      } else if (result) {
        setLastExecution({
          result,
          timestamp: Date.now(),
          durationMs
        });
      }
    } catch (err) {
      console.warn('Execution error in CAD Prompt bar:', err);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    try {
      if (!presetText || typeof presetText !== 'string') return;
      setPromptInput(presetText);
      const startTime = performance.now();
      const result = parseNaturalLanguageCadPrompt(presetText);
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      if (result && result.matched) {
        setLastExecution({
          result,
          timestamp: Date.now(),
          durationMs
        });
        setRecentHistory(prev => [presetText, ...(Array.isArray(prev) ? prev : []).filter(p => p && p.toLowerCase() !== presetText.toLowerCase())].slice(0, 8));
        if (typeof onExecuteCadCommand === 'function') {
          try {
            onExecuteCadCommand(result, 'RENDER_FINAL');
          } catch (cmdErr) {
            console.error('[AI CAD Preset Callback Failed]', cmdErr);
          }
        }
      }
      inputRef.current?.focus();
    } catch (err) {
      console.warn('Preset selection error in CAD Prompt bar:', err);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-cyan-500/30 backdrop-blur-md z-30 transition-all">
      {/* Top Main Command Bar Row */}
      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* AI / CAD Brand Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shrink-0 select-none shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider hidden sm:inline text-cyan-200">
              PROMPT→CAD
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-1 rounded border border-cyan-500/30">
              AI
            </span>
          </div>

          {/* Main Natural Language Command Input Field */}
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              id="ai-cad-prompt-input"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecute('RENDER_FINAL');
                } else if (e.key === 'Escape') {
                  setPromptInput('');
                  inputRef.current?.blur();
                }
              }}
              placeholder={placeholder}
              className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-500 text-xs font-mono pl-3 pr-20 py-2 rounded-lg border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all shadow-inner"
            />

            {/* Quick Clear or Keyboard Hint */}
            <div className="absolute right-2 flex items-center gap-1.5 pointer-events-none">
              {promptInput ? (
                <button
                  type="button"
                  onClick={() => setPromptInput('')}
                  className="pointer-events-auto p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-900 hidden md:inline">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Action Button: Instant Render */}
          <button
            type="button"
            id="btn-ai-cad-render"
            onClick={() => handleExecute('RENDER_FINAL')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-mono text-xs font-semibold shadow-md shadow-cyan-900/40 transition-all shrink-0 cursor-pointer"
            title="Extract geometric parameters and generate finished CAD drawing immediately"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate CAD</span>
            <CornerDownLeft className="w-3 h-3 text-cyan-200 hidden lg:inline" />
          </button>

          {/* Secondary Action: Step-by-Step Simulation */}
          <button
            type="button"
            id="btn-ai-cad-simulate"
            onClick={() => handleExecute('SIMULATE_STEPS')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 font-mono text-xs border border-slate-700 transition-all shrink-0 cursor-pointer"
            title="Synthesize CAD parameters and play step-by-step drafting sequence"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Steps</span>
          </button>

          {/* Expand / Collapse Preset Triggers */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700/60 transition-colors shrink-0"
            title={isExpanded ? 'Collapse prompt drawer' : 'View example prompts & parser history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Parameter Extraction Pill Banner (Real-time reactive feedback) */}
        {liveParseResult && liveParseResult.matched && (
          <div className="flex flex-wrap items-center gap-2 py-1 px-2.5 rounded bg-slate-950/80 border border-cyan-500/20 text-xs font-mono animate-fadeIn">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Parsed Intent:</span>
            </span>
            <span className="text-cyan-300 font-semibold bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
              {liveParseResult.geometryTitle}
            </span>
            
            <div className="flex items-center gap-1.5">
              {Array.isArray(liveParseResult.extractedParams) && liveParseResult.extractedParams.map((param) => (
                <span
                  key={param.key || param.label}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold"
                >
                  <span className="text-cyan-400 mr-1">{param.label}:</span>
                  <span className="text-white font-mono">{param.value} {param.unit}</span>
                </span>
              ))}
            </div>

            <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">
              Instant Vector Directive ready
            </span>
          </div>
        )}

        {/* Last Execution Notification Banner */}
        {lastExecution && lastExecution.result && (
          <div 
            className={`flex items-center justify-between text-xs font-mono py-1.5 px-3 rounded border transition-all ${
              lastExecution.result.matched 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {lastExecution.result.matched ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>
                {lastExecution.result.matched ? (
                  <>
                    <strong className="text-emerald-200">{lastExecution.result.geometryTitle || 'Geometry'}</strong> synthesized instantly.
                    <span className="text-emerald-400/80 ml-1.5 hidden md:inline">
                      ({(Array.isArray(lastExecution.result.extractedParams) ? lastExecution.result.extractedParams : []).filter(Boolean).map(p => `${p.label || 'Param'}: ${p.value ?? ''}${p.unit || ''}`).join(', ')})
                    </span>
                  </>
                ) : (
                  <span>{lastExecution.result.description || 'Instruction processed.'}</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
              <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                ⚡ {lastExecution.durationMs || 1}ms
              </span>
              <button
                type="button"
                onClick={() => setLastExecution(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Clickable Example Prompt Chips (Always visible row) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-mono select-none">
          <span className="text-slate-500 shrink-0 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Quick CAD Prompts:
          </span>
          {Array.isArray(PRESET_CAD_PROMPTS) && PRESET_CAD_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelectPreset(item.prompt)}
              className="shrink-0 px-2 py-1 rounded bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
              title={item.prompt}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Expanded Drawer: History, Technical Parser Details, and CAD Syntax Reference */}
        {isExpanded && (
          <div className="mt-1 pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
            {/* Left: Recent Command History */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  Recent Prompt History
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Click to reload</span>
              </div>
              <div className="space-y-1">
                {Array.isArray(recentHistory) && recentHistory.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(cmd)}
                    className="w-full text-left font-mono text-[11px] text-slate-300 hover:text-cyan-300 hover:bg-slate-900 px-2 py-1 rounded truncate transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{cmd}</span>
                    <CornerDownLeft className="w-3 h-3 text-slate-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Supported Technical CAD Patterns */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Supported Natural Language Patterns
                </span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  WAEC / ISO Standards
                </span>
              </div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Parabolas:</strong> "Construct a parabola with span 120mm and rise 80mm"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Ellipses:</strong> "Construct an ellipse with major axis 180mm and minor axis 110mm"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Lines & Angles:</strong> "Bisect a line of length 120mm", "Construct 60 degree angle"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Polygons & Tangents:</strong> "Draw a regular hexagon with side 50mm", "Belt drive tangency"</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
