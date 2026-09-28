import React, { useState } from 'react';
import { History, Eye, Play, CheckCircle2, X, Sparkles, Cpu, Layers, ArrowRight } from 'lucide-react';
import { ParsedCadResult, parseNaturalLanguageCadPrompt } from '../../utils/aiCadPromptParser';

interface PromptHistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  result: ParsedCadResult;
}

interface PromptHistoryPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptHistoryItem[];
  currentLivePrompt?: string;
  onApplyPrompt: (result: ParsedCadResult, mode: 'RENDER_FINAL' | 'SIMULATE_STEPS') => void;
}

export const PromptHistoryPreviewOverlay: React.FC<PromptHistoryPreviewOverlayProps> = ({
  isOpen,
  onClose,
  history,
  currentLivePrompt = '',
  onApplyPrompt
}) => {
  const [selectedItem, setSelectedItem] = useState<PromptHistoryItem | null>(history[0] || null);

  if (!isOpen) return null;

  const activeResult = selectedItem ? selectedItem.result : (currentLivePrompt ? parseNaturalLanguageCadPrompt(currentLivePrompt) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Prompt History & Wireframe Preview
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                  AI-CAD Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Review parsed intents and inspect real-time wireframe thumbnails before committing to workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left = History List, Right = Parsed Intent & Wireframe Thumbnail Preview */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: History List */}
          <div className="w-80 bg-slate-950/60 border-r border-slate-800 flex flex-col p-4 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recent Prompt History ({history.length})
            </h3>
            
            {history.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                No recent prompt history recorded yet. Enter a CAD instruction in the command bar.
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                        <span className="truncate max-w-[160px]">{item.result.geometryType}</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2 text-slate-200">
                        "{item.prompt}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Main Panel: Parsed Intent & Live Wireframe Thumbnail Preview */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
            {activeResult ? (
              <>
                {/* Parsed Intent Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      PARSED INTENT: {activeResult.geometryType}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Confidence: {Math.round(activeResult.confidence * 100)}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {activeResult.geometryTitle}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeResult.description}
                  </p>

                  {/* Extracted Parameters Grid */}
                  {activeResult.extractedParams && activeResult.extractedParams.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                      {activeResult.extractedParams.map((param, pIdx) => (
                        <div key={pIdx} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{param.label}</span>
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            {param.value} {param.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real-time Wireframe Thumbnail Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Real-time Wireframe Thumbnail Preview
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      SVG Vector Projected
                    </span>
                  </div>

                  <div className="relative w-full h-56 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                    <svg className="w-full h-full" viewBox="0 0 400 250">
                      {/* Grid crosshairs */}
                      <line x1="200" y1="0" x2="200" y2="250" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" />
                      <line x1="0" y1="125" x2="400" y2="125" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" />
                      
                      {/* Wireframe preview geometry based on type */}
                      {activeResult.geometryType === 'PARABOLA' ? (
                        <g>
                          <path d="M 120 200 Q 200 50 280 200" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                          <line x1="120" y1="200" x2="280" y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="200" y1="200" x2="200" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                          <circle cx="200" cy="70" r="3" fill="#ef4444" />
                          <text x="205" y="68" fill="#f87171" fontSize="9" fontFamily="monospace">Focus</text>
                        </g>
                      ) : activeResult.geometryType === 'ELLIPSE' ? (
                        <g>
                          <ellipse cx="200" cy="125" rx="90" ry="50" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                          <line x1="110" y1="125" x2="290" y2="125" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="200" y1="75" x2="200" y2="175" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                        </g>
                      ) : activeResult.geometryType === 'ISOMETRIC_BLOCK' ? (
                        <g transform="translate(130, 60)">
                          <polygon points="0,60 80,20 160,60 80,100" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="2" />
                          <polygon points="0,60 0,140 80,180 80,100" fill="rgba(56,189,248,0.04)" stroke="#38bdf8" strokeWidth="2" />
                          <polygon points="160,60 160,140 80,180 80,100" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="2" />
                        </g>
                      ) : (
                        <g>
                          <rect x="130" y="75" width="140" height="100" fill="rgba(56,189,248,0.05)" stroke="#38bdf8" strokeWidth="2" rx="4" />
                          <circle cx="200" cy="125" r="30" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
                        </g>
                      )}

                      {/* Dimension tags */}
                      <text x="200" y="235" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                        {activeResult.cadCommandEcho}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      onApplyPrompt(activeResult, 'SIMULATE_STEPS');
                      onClose();
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    Simulate Steps
                  </button>
                  <button
                    onClick={() => {
                      onApplyPrompt(activeResult, 'RENDER_FINAL');
                      onClose();
                    }}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Commit to Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Sparkles className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm">Select a prompt from history or enter a CAD command to inspect its parsed intent and wireframe thumbnail preview.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
