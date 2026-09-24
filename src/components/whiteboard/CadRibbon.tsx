import React, { useState } from 'react';
import { 
  Slash, 
  Square, 
  Circle, 
  Hexagon, 
  Spline as SplineIcon, 
  Scissors, 
  Copy, 
  Layers, 
  Type, 
  Sliders, 
  Grid3X3, 
  Crosshair, 
  Compass, 
  Maximize2,
  Minimize2,
  Trash2,
  RotateCcw,
  Sparkles,
  MousePointer,
  Move,
  RotateCw,
  Scale as ScaleIcon,
  Shield,
  Ruler
} from 'lucide-react';
import { WhiteboardTool, WhiteboardLayer } from '../../types/whiteboard';

interface CadRibbonProps {
  activeTool: WhiteboardTool;
  onSelectTool: (tool: WhiteboardTool) => void;
  activeLayer: WhiteboardLayer;
  onSelectLayer: (layer: WhiteboardLayer) => void;
  gridMode: 'MILLIMETER' | 'ISOMETRIC' | 'POLAR' | 'NONE';
  onCycleGridMode: () => void;
  snapGrid: boolean;
  onToggleSnapGrid: () => void;
  orthoLock: boolean;
  onToggleOrthoLock: () => void;
  dynamicInputEnabled: boolean;
  onToggleDynamicInput: () => void;
  onClearCanvas: () => void;
  onOpenVoiceAssistant?: () => void;
}

type RibbonTab = 'HOME' | 'DRAW' | 'MODIFY' | 'ANNOTATE' | 'PARAMETRIC';

export const CadRibbon: React.FC<CadRibbonProps> = ({
  activeTool,
  onSelectTool,
  activeLayer,
  onSelectLayer,
  gridMode,
  onCycleGridMode,
  snapGrid,
  onToggleSnapGrid,
  orthoLock,
  onToggleOrthoLock,
  dynamicInputEnabled,
  onToggleDynamicInput,
  onClearCanvas,
  onOpenVoiceAssistant
}) => {
  const [activeTab, setActiveTab] = useState<RibbonTab>('HOME');

  const layerOptions: { id: WhiteboardLayer; label: string; color: string; weight: string }[] = [
    { id: 'CONSTRUCTION_2H', label: '2H Construction', color: '#22d3ee', weight: '0.25mm' },
    { id: 'OUTLINE_HB', label: 'HB Finished Outline', color: '#f8fafc', weight: '0.60mm' },
    { id: 'BORDER_2B', label: '2B Border / Margin', color: '#38bdf8', weight: '0.80mm' },
    { id: 'HIDDEN_DASHED', label: 'Hidden Detail', color: '#94a3b8', weight: '0.35mm' },
    { id: 'CENTERLINE_CHAIN', label: 'Centerline Chain', color: '#f59e0b', weight: '0.25mm' },
    { id: 'DIMENSIONS', label: 'ISO Dimension', color: '#10b981', weight: '0.25mm' }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 flex flex-col shrink-0 select-none shadow-md">
      {/* Top Ribbon Tabs */}
      <div className="flex items-center gap-1 px-3 pt-1.5 border-b border-slate-800/80 bg-slate-950 text-xs">
        {(['HOME', 'DRAW', 'MODIFY', 'ANNOTATE', 'PARAMETRIC'] as RibbonTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-semibold rounded-t-md transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {tab}
          </button>
        ))}

        {/* CAD Model Space Precision Status Indicators */}
        <div className="ml-auto flex items-center gap-2 pb-1 text-[11px] font-mono">
          <button
            onClick={onCycleGridMode}
            className={`px-2 py-0.5 rounded border transition-colors ${
              gridMode !== 'NONE'
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="GRID [F7]: Cycle Grid Matrix"
          >
            GRID: {gridMode}
          </button>

          <button
            onClick={onToggleSnapGrid}
            className={`px-2 py-0.5 rounded border transition-colors ${
              snapGrid
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="SNAP [F9]: Snap to 10mm increments"
          >
            SNAP: {snapGrid ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleOrthoLock}
            className={`px-2 py-0.5 rounded border transition-colors ${
              orthoLock
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="ORTHO [F8]: Restrict lines to 90°"
          >
            ORTHO: {orthoLock ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleDynamicInput}
            className={`px-2 py-0.5 rounded border transition-colors ${
              dynamicInputEnabled
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="DYN [F12]: Dynamic Input - Enter dimensions directly to draw automatically"
          >
            ⚡ DYN: {dynamicInputEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Ribbon Command Tools Bar */}
      <div className="flex items-center gap-3 px-3 py-2 overflow-x-auto custom-scrollbar">
        {/* Draw Tools Cluster */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Draw
          </span>
          <button
            onClick={() => onSelectTool('LINE')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'LINE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="LINE [L]: Draw 2-Point Line"
          >
            <Slash className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Line</span>
          </button>

          <button
            onClick={() => onSelectTool('CIRCLE')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'CIRCLE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="CIRCLE [C]: Center Radius Circle"
          >
            <Circle className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Circle</span>
          </button>

          <button
            onClick={() => onSelectTool('ARC')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'ARC'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="ARC [A]: 3-Point Tangent Arc"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Arc</span>
          </button>

          <button
            onClick={() => onSelectTool('RECTANGLE')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'RECTANGLE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="RECTANG [REC]: Corner to Corner Rectangle"
          >
            <Square className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Rect</span>
          </button>

          <button
            onClick={() => onSelectTool('POLYGON')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'POLYGON'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="POLYGON [POL]: Inscribed Regular Polygon (Hexagon, Pentagon, Octagon)"
          >
            <Hexagon className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Poly</span>
          </button>

          <button
            onClick={() => onSelectTool('ELLIPSE')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'ELLIPSE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="ELLIPSE [EL]: Conic Ellipse by Major/Minor Radii"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Ellipse</span>
          </button>

          <button
            onClick={() => onSelectTool('SPLINE')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'SPLINE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="SPLINE [SPL]: French Curve Smooth Bezier Spline"
          >
            <SplineIcon className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Spline</span>
          </button>
        </div>

        {/* Modify Tools Cluster */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Modify
          </span>
          <button
            onClick={() => onSelectTool('CAD_TRIM')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'CAD_TRIM'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="TRIM [TR]: Trim object to cutting edges"
          >
            <Scissors className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Trim</span>
          </button>

          <button
            onClick={() => onSelectTool('CAD_OFFSET')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'CAD_OFFSET'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="OFFSET [O]: Construct parallel / concentric geometry"
          >
            <Copy className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Offset</span>
          </button>

          <button
            onClick={() => onSelectTool('CAD_MIRROR')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'CAD_MIRROR'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="MIRROR [MI]: Mirror geometry across axis"
          >
            <Move className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Mirror</span>
          </button>

          <button
            onClick={() => onSelectTool('ERASER')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'ERASER'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title="ERASE [E]: Remove selected element"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Erase</span>
          </button>
        </div>

        {/* Annotations & Dimensions Cluster */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Annotate
          </span>
          <button
            onClick={() => onSelectTool('DIMENSION_LINEAR')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'DIMENSION_LINEAR'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="DIMLINEAR [DIM]: ISO 128 Dimensioning"
          >
            <Ruler className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Dim</span>
          </button>

          <button
            onClick={() => onSelectTool('TEXT')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-12 h-12 transition-all ${
              activeTool === 'TEXT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="TEXT [DT]: Single-line engineering title & note text"
          >
            <Type className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-mono">Text</span>
          </button>
        </div>

        {/* Layer Manager Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Layer:
          </span>
          <select
            value={activeLayer}
            onChange={(e) => onSelectLayer(e.target.value as WhiteboardLayer)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400 font-mono"
          >
            {layerOptions.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label} ({l.weight})
              </option>
            ))}
          </select>
        </div>

        {/* AI Voice Transcription & Search Grounding Button */}
        {onOpenVoiceAssistant && (
          <button
            onClick={onOpenVoiceAssistant}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer shrink-0 animate-pulse"
            title="Transcribe Audio / Voice CAD Construction (gemini-3.5-transcribe)"
          >
            <Sparkles className="w-4 h-4" />
            <span>Voice AI</span>
          </button>
        )}
      </div>
    </div>
  );
};
