import React from 'react';
import { 
  Grid3X3, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Compass, 
  Eye, 
  EyeOff, 
  Layers, 
  Crosshair,
  FileSpreadsheet,
  Tv
} from 'lucide-react';

export type GridMode = 'MILLIMETER' | 'ISOMETRIC' | 'POLAR' | 'NONE';

interface ToolDockProps {
  gridMode: GridMode;
  onSelectGridMode: (mode: GridMode) => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  showInstruments: boolean;
  onToggleInstruments: () => void;
  showTitleBlock: boolean;
  onToggleTitleBlock: () => void;
  showGuideLines?: boolean;
  onToggleGuideLines?: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  mouseCoords: { x: number; y: number };
  onOpenProjection?: () => void;
}

export const ToolDock: React.FC<ToolDockProps> = ({
  gridMode,
  onSelectGridMode,
  snapEnabled,
  onToggleSnap,
  showInstruments,
  onToggleInstruments,
  showTitleBlock,
  onToggleTitleBlock,
  showGuideLines = true,
  onToggleGuideLines,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  mouseCoords,
  onOpenProjection
}) => {
  const nextGridMode = () => {
    if (gridMode === 'MILLIMETER') onSelectGridMode('ISOMETRIC');
    else if (gridMode === 'ISOMETRIC') onSelectGridMode('POLAR');
    else if (gridMode === 'POLAR') onSelectGridMode('NONE');
    else onSelectGridMode('MILLIMETER');
  };

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md select-none">
      {/* Grid Mode Cycler */}
      <button
        id="btn-toggle-grid"
        onClick={nextGridMode}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
          gridMode !== 'NONE'
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Cycle Grid: Millimeter, Isometric, Polar, Off"
      >
        <Grid3X3 className="w-3.5 h-3.5" />
        <span className="capitalize">{gridMode.toLowerCase()}</span>
      </button>

      {/* Snap to Grid */}
      <button
        id="btn-toggle-snap"
        onClick={onToggleSnap}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
          snapEnabled
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title={snapEnabled ? 'Grid Snap: Active (5mm)' : 'Grid Snap: Disabled'}
      >
        <Crosshair className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

      {/* Instruments Visibility */}
      <button
        id="btn-toggle-instruments"
        onClick={onToggleInstruments}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono transition-colors ${
          showInstruments
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Toggle Virtual Compass, Set-Squares, & Pencils"
      >
        <Compass className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tools</span>
      </button>

      {/* Title Block Visibility */}
      <button
        id="btn-toggle-titleblock"
        onClick={onToggleTitleBlock}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
          showTitleBlock
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Toggle Drawing Sheet Border & Title Block"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
      </button>

      {/* Drawing Guide Lines Visibility */}
      {onToggleGuideLines && (
        <button
          id="btn-toggle-guidelines"
          onClick={onToggleGuideLines}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            showGuideLines
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle Drawing Guide Lines (4H Faint Construction Lines, Lettering Cap/Base Guides)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guide Lines</span>
        </button>
      )}

      {/* Smart-Board Presentation Mode Button */}
      {onOpenProjection && (
        <button
          id="btn-open-smartboard-mode"
          onClick={onOpenProjection}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm"
          title="Launch Fullscreen Smart-Board / Projector Presentation Mode"
        >
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Smart Board</span>
        </button>
      )}

      <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

      {/* Zoom Controls */}
      <button
        id="btn-zoom-out"
        onClick={onZoomOut}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Zoom Out (Ctrl -)"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <span className="text-[11px] font-mono text-slate-300 px-1 min-w-[38px] text-center">
        {Math.round(zoom * 100)}%
      </span>

      <button
        id="btn-zoom-in"
        onClick={onZoomIn}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Zoom In (Ctrl +)"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <button
        id="btn-reset-zoom"
        onClick={onResetZoom}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Fit Drawing to Viewport"
      >
        <Maximize className="w-3.5 h-3.5" />
      </button>

      {/* Dynamic Cursor Coordinate Display */}
      <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-700 text-[10px] font-mono text-slate-400">
        <span>X: <strong className="text-cyan-300 font-semibold">{mouseCoords.x.toFixed(0)}</strong> mm</span>
        <span>Y: <strong className="text-cyan-300 font-semibold">{mouseCoords.y.toFixed(0)}</strong> mm</span>
      </div>
    </div>
  );
};
