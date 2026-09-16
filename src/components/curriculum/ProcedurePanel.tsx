import React from 'react';
import { 
  DrawingTopic, 
  ProceduralStep 
} from '../../types/curriculum';
import { 
  Sliders, 
  Compass, 
  CheckCircle, 
  Info, 
  PenTool, 
  Sparkles, 
  Cpu, 
  BookOpen,
  ArrowRight,
  PencilRuler,
  Terminal,
  Tv,
  Radio,
  Box,
  Layers
} from 'lucide-react';

interface ProcedurePanelProps {
  topic: DrawingTopic;
  step: ProceduralStep;
  currentStepIndex: number;
  totalSteps: number;
  parameters: Record<string, number>;
  onParamChange: (paramId: string, value: number) => void;
  onOpenTheory: () => void;
  onOpenTraditionalBoard?: () => void;
  onOpenCadWorkstation?: () => void;
  onOpenLiveClass?: () => void;
  onOpenIsoDiagram?: () => void;
  onOpenOrthographicViewport?: () => void;
  onOpenSurfaceDevelopment?: () => void;
}

export const ProcedurePanel: React.FC<ProcedurePanelProps> = ({
  topic,
  step,
  currentStepIndex,
  totalSteps,
  parameters,
  onParamChange,
  onOpenTheory,
  onOpenTraditionalBoard,
  onOpenCadWorkstation,
  onOpenLiveClass,
  onOpenIsoDiagram,
  onOpenOrthographicViewport,
  onOpenSurfaceDevelopment
}) => {
  return (
    <div className="w-full lg:w-[420px] bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Topic Title Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {topic.moduleCode}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {topic.tier} • {topic.standards.waecRef}
          </span>
        </div>
        <h2 className="text-sm font-bold text-slate-100 leading-snug">
          {topic.title}
        </h2>
      </div>

      {/* Scrollable Instruction Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* CURRENT STEP CARD */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              STEP {currentStepIndex} OF {totalSteps}
            </span>
            {step.activeInstrument.toolType !== 'NONE' && (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                <Compass className="w-3 h-3" />
                {step.activeInstrument.toolType.replace('_', ' ')}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-100 mb-2 leading-tight">
            {step.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {step.instruction}
          </p>

          {/* Detailed Notes */}
          {step.detailedNotes && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{step.detailedNotes}</span>
            </div>
          )}

          {/* Technical Principle */}
          {step.technicalPrinciple && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 font-semibold block text-[10px] uppercase tracking-wider">Engineering Principle:</strong>
                <span>{step.technicalPrinciple}</span>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE PARAMETERS TUNER */}
        {topic.parameters.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Geometric Parameters
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Real-Time Recalculation
              </span>
            </div>

            <div className="space-y-3">
              {topic.parameters.map((param) => {
                const val = parameters[param.id] ?? param.defaultValue;
                return (
                  <div key={param.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">{param.label}</span>
                      <span className="text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-slate-850 border border-slate-700/60">
                        {val} {param.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={val}
                      onChange={(e) => onParamChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500">{param.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LINE CONVENTIONS & PENCIL GRADES */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5 mb-2 text-slate-300 font-semibold">
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            <span>ISO Standard Line Recommendations</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-slate-200 inline-block" />
                Continuous Thick (0.5mm)
              </span>
              <span className="font-mono text-cyan-400">HB / H Pencil</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-[1px] bg-slate-400 inline-block" />
                Continuous Thin (0.25mm)
              </span>
              <span className="font-mono text-cyan-400">2H / 3H Pencil</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-[1px] border-b border-dashed border-cyan-400 inline-block" />
                Chain Centerline (0.25mm)
              </span>
              <span className="font-mono text-cyan-400">2H Pencil</span>
            </div>
          </div>
        </div>

        {/* DUAL-MODE PRACTICE LAUNCHERS */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Practice Studio
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Universal Whiteboard</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenTraditionalBoard}
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] mb-0.5">
                <PencilRuler className="w-3.5 h-3.5" />
                <span>Manual Board</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Virtual T-Square, Set Square & Compass</p>
            </button>

            <button
              onClick={onOpenCadWorkstation}
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] mb-0.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>CAD Station</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">CLI Terminal, Ribbon & Modify Tools</p>
            </button>
          </div>

          {onOpenLiveClass && (
            <button
              onClick={onOpenLiveClass}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/40 text-red-300 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="font-bold text-xs">Join / Host Live Class on this Topic</span>
              </div>
              <span className="text-[10px] font-mono bg-red-500/30 px-1.5 py-0.5 rounded text-red-200">2-Way Video</span>
            </button>
          )}
        </div>

        {/* ISO 128 DIAGRAM VIEWER TRIGGER */}
        {onOpenIsoDiagram && (
          <button
            onClick={onOpenIsoDiagram}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-950/80 via-blue-950/60 to-slate-900 hover:from-sky-900/90 hover:to-blue-900/80 border border-sky-500/40 text-xs font-bold text-sky-200 flex items-center justify-between transition-all shadow-md group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-white font-bold text-xs">ISO Diagram Viewer</span>
                <span className="block text-[10px] text-sky-400/90 font-mono">ISO 128 / ISO 5456 Technical Blueprint</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* ORTHOGRAPHIC VIEWPORT TRIGGER (ISO 5456 1st & 3rd Angle) */}
        {onOpenOrthographicViewport && (
          <button
            id="open-orthographic-viewport-btn"
            onClick={onOpenOrthographicViewport}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-950/90 via-sky-950/70 to-slate-900 hover:from-cyan-900/90 hover:to-sky-900/80 border border-cyan-500/50 text-xs font-bold text-cyan-200 flex items-center justify-between transition-all shadow-md group relative overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Box className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block text-white font-bold text-xs">Orthographic Viewport</span>
                  <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1 rounded">1st & 3rd Angle</span>
                </div>
                <span className="block text-[10px] text-cyan-400/90 font-mono">3D Isometric ⇄ Dynamic 2D Multi-View</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* SURFACE DEVELOPMENT & INTERPENETRATION VIEWER BUTTON */}
        {onOpenSurfaceDevelopment && (
          <button
            id="open-surface-development-btn"
            onClick={onOpenSurfaceDevelopment}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-emerald-950/70 to-slate-900 hover:from-amber-900/80 hover:to-emerald-900/70 border border-emerald-500/50 text-xs font-bold text-emerald-200 flex items-center justify-between transition-all shadow-md group relative overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block text-white font-bold text-xs">Surface Development 3D</span>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1 rounded">ISO 128 Unfolding</span>
                </div>
                <span className="block text-[10px] text-emerald-400/90 font-mono">Cylinder • Cone Frustum • T-Junction Pipe</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* TEXTBOOK & SVG VECTOR BLUEPRINT BUTTON */}
        <button
          onClick={onOpenTheory}
          className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-slate-900 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center justify-between transition-all shadow-md shadow-cyan-950/40 group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block text-white font-bold">Textbook & Vector Blueprint</span>
              <span className="block text-[10px] text-cyan-400/80 font-normal">ISO 128 Theory, SVG Schematics & WAEC Rubric</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
