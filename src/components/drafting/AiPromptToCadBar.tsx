import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  Cpu,
  RotateCcw
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
    label: 'Isometric 3D Block 600x400',
    prompt: 'Construct an isometric 3D block measuring 600mm x 400mm x 300mm',
    type: 'ISOMETRIC_BLOCK'
  },
  {
    label: 'Architectural Floor Plan 12m x 8m',
    prompt: 'Generate an architectural floor plan measuring 12000mm by 8000mm with bedrooms and living room',
    type: 'ARCHITECTURAL_PLAN'
  },
  {
    label: 'Mechanical Stepped Shaft Ø150',
    prompt: 'Construct a mechanical stepped shaft component with diameter 150mm and centerlines',
    type: 'MECHANICAL_PART'
  },
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
  }
];

export const AiPromptToCadBar: React.FC<AiPromptToCadBarProps> = ({
  onExecuteCadCommand,
  activeTopic,
  currentParameters = {},
  placeholder = "Enter CAD prompt (e.g. 'Construct a parabola with span 120mm and rise 80mm' or 'Architectural floor plan')... [Press / to focus]",
  compact = false
}) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showAdjustmentPanel, setShowAdjustmentPanel] = useState<boolean>(true);
  const [adjustedParams, setAdjustedParams] = useState<Record<string, number>>({});
  
  const [lastExecution, setLastExecution] = useState<{
    result: ParsedCadResult;
    timestamp: number;
    durationMs: number;
  } | null>(null);

  const [recentHistory, setRecentHistory] = useState<string[]>([
    'Construct an isometric 3D block measuring 600mm x 400mm x 300mm',
    'Generate an architectural floor plan measuring 12000mm by 8000mm',
    'Construct a parabola with span 120mm and rise 80mm',
    'Construct an ellipse with major axis 180mm and minor axis 110mm'
  ]);

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

  // Live lightweight parser preview as user types
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

  const handleExecute = async (mode: 'RENDER_FINAL' | 'SIMULATE_STEPS' = 'RENDER_FINAL', overrideQuery?: string) => {
    try {
      const query = (overrideQuery !== undefined ? overrideQuery : (typeof promptInput === 'string' ? promptInput : '')).trim();
      if (!query) return;

      const startTime = performance.now();
      let result = parseNaturalLanguageCadPrompt(query);

      // If user has adjusted parameters, apply them to result
      if (Object.keys(adjustedParams).length > 0 && result.parameters) {
        result.parameters = { ...result.parameters, ...adjustedParams };
        if (result.extractedParams) {
          result.extractedParams = result.extractedParams.map(p => ({
            ...p,
            value: adjustedParams[p.key] !== undefined ? adjustedParams[p.key] : p.value
          }));
        }
      } else if (result.parameters) {
        // Initialize adjusted params from result
        const initParams: Record<string, number> = {};
        Object.entries(result.parameters).forEach(([k, v]) => {
          if (typeof v === 'number' && Number.isFinite(v)) initParams[k] = v;
        });
        setAdjustedParams(initParams);
      }

      // Try server-side Gemini AI generation if needed
      try {
        const res = await fetch('/api/gemini/prompt-to-cad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: query, parameters: result.parameters })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.result) {
            result = {
              ...result,
              geometryTitle: data.result.title || result.geometryTitle,
              description: data.result.description || result.description,
              geometryType: 'AI_GENERATED_VECTOR_MODEL',
              aiElements: data.result.elements || []
            };
          }
        }
      } catch (aiErr) {
        console.warn('Gemini AI prompt fallback to parser:', aiErr);
      }

      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      if (result) {
        setLastExecution({
          result,
          timestamp: Date.now(),
          durationMs
        });
        setShowAdjustmentPanel(true);
        setRecentHistory(prev => [query, ...(Array.isArray(prev) ? prev : []).filter(p => p && p.toLowerCase() !== query.toLowerCase())].slice(0, 8));
        if (typeof onExecuteCadCommand === 'function') {
          try {
            onExecuteCadCommand(result, mode);
          } catch (cmdErr) {
            console.error('[AI CAD Execution Callback Failed]', cmdErr);
          }
        }
      }
    } catch (err) {
      console.warn('Execution error in CAD Prompt bar:', err);
    }
  };

  const handleParamAdjustmentChange = (key: string, val: number) => {
    const updated = { ...adjustedParams, [key]: val };
    setAdjustedParams(updated);

    if (lastExecution && lastExecution.result) {
      const updatedResult = {
        ...lastExecution.result,
        parameters: { ...lastExecution.result.parameters, ...updated },
        extractedParams: (lastExecution.result.extractedParams || []).map(p => 
          p.key === key ? { ...p, value: val } : p
        )
      };
      setLastExecution({
        ...lastExecution,
        result: updatedResult
      });
      if (typeof onExecuteCadCommand === 'function') {
        try {
          onExecuteCadCommand(updatedResult, 'RENDER_FINAL');
        } catch (e) {
          console.warn('Param adjustment callback error:', e);
        }
      }
    }
  };

  const handleSelectPreset = (presetText: string) => {
    try {
      if (!presetText || typeof presetText !== 'string') return;
      setPromptInput(presetText);
      handleExecute('RENDER_FINAL', presetText);
      inputRef.current?.focus();
    } catch (err) {
      console.warn('Preset selection error in CAD Prompt bar:', err);
    }
  };

  return (
    <div className="w-full bg-slate-900/95 border-b border-cyan-500/40 backdrop-blur-md z-30 transition-all shadow-xl">
      {/* Top Main Command Bar Row */}
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* AI / CAD Brand Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shrink-0 select-none shadow-sm">
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
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs font-mono pl-3 pr-20 py-2.5 rounded-lg border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all shadow-inner"
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
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-mono text-xs font-semibold shadow-md shadow-cyan-900/40 transition-all shrink-0 cursor-pointer"
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
            className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 font-mono text-xs border border-slate-700 transition-all shrink-0 cursor-pointer"
            title="Synthesize CAD parameters and play step-by-step drafting sequence"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Steps</span>
          </button>

          {/* Expand / Collapse Preset Triggers */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700/60 transition-colors shrink-0"
            title={isExpanded ? 'Collapse prompt drawer' : 'View example prompts & parser history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Parameter Extraction Pill Banner */}
        {liveParseResult && liveParseResult.matched && (
          <div className="flex flex-wrap items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-xs font-mono animate-fadeIn">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Parsed Intent:</span>
            </span>
            <span className="text-cyan-300 font-semibold bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-500/30">
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

            <span className="text-[10px] text-cyan-400 ml-auto hidden sm:inline bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Ready to Generate & Adjust
            </span>
          </div>
        )}

        {/* Last Execution & Interactive Parameter Adjustment Panel */}
        {lastExecution && lastExecution.result && lastExecution.result.matched && (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-mono shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <strong className="text-emerald-200">{lastExecution.result.geometryTitle}</strong>
                <span className="text-slate-400 text-[10px]">({lastExecution.durationMs}ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentPanel(!showAdjustmentPanel)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showAdjustmentPanel ? 'Hide Adjustments' : 'Adjust Parameters'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLastExecution(null)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Parameter Sliders & Number Inputs */}
            {showAdjustmentPanel && Array.isArray(lastExecution.result.extractedParams) && lastExecution.result.extractedParams.length > 0 && (
              <div className="mt-1 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-lg">
                {lastExecution.result.extractedParams.map((param) => {
                  const currentVal = adjustedParams[param.key] !== undefined ? adjustedParams[param.key] : param.value;
                  const minVal = 10;
                  const maxVal = Math.max(1000, param.value * 2.5);
                  return (
                    <div key={param.key} className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-semibold">{param.label}</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={currentVal}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (!isNaN(v)) handleParamAdjustmentChange(param.key, v);
                            }}
                            className="w-16 bg-slate-900 text-cyan-300 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-700 text-right outline-none focus:border-cyan-400"
                          />
                          <span className="text-slate-400 text-[10px]">{param.unit || 'mm'}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        step={param.key.includes('angle') ? 1 : 5}
                        value={currentVal}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v)) handleParamAdjustmentChange(param.key, v);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Clickable Example Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-mono select-none">
          <span className="text-slate-400 shrink-0 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Quick CAD Prompts:
          </span>
          {Array.isArray(PRESET_CAD_PROMPTS) && PRESET_CAD_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelectPreset(item.prompt)}
              className="shrink-0 px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
              title={item.prompt}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Expanded Drawer: History & Technical Reference */}
        {isExpanded && (
          <div className="mt-1 pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
            {/* Left: Recent Command History */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
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
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono">
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
                  <span><strong>Isometric Blocks:</strong> "Construct an isometric 3D block 600mm x 400mm x 300mm"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Architectural Plans:</strong> "Generate floor plan measuring 12000mm by 8000mm"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Mechanical Parts:</strong> "Construct mechanical stepped shaft diameter 150mm"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">▪</span>
                  <span><strong>Curves & Geometry:</strong> "Parabola with span 120mm and rise 80mm", "Ellipse"</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
