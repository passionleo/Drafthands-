import React, { useState, useEffect, useRef } from 'react';
import { 
  CornerDownLeft, 
  Slash, 
  Circle, 
  Square, 
  Hexagon, 
  Compass, 
  Maximize2, 
  Check, 
  Ruler, 
  Zap, 
  Keyboard, 
  ArrowRight,
  Info
} from 'lucide-react';
import { WhiteboardTool } from '../../types/whiteboard';

export interface DynamicDimensionValues {
  // For Line
  length: number;
  angle: number;
  // For Circle
  radius: number;
  diameter: number;
  useDiameter: boolean;
  // For Rectangle
  width: number;
  height: number;
  // For Polygon
  sides: number;
  polygonRadius: number;
  // For Arc
  arcRadius: number;
  arcStartAngle: number;
  arcEndAngle: number;
  // For Ellipse
  ellipseRx: number;
  ellipseRy: number;
  // For Offset
  offsetDistance: number;
  // Option: Auto-generate ISO 128 dimensions alongside drawing
  autoAnnotateDimension: boolean;
}

interface CadDynamicInputHudProps {
  activeTool: WhiteboardTool;
  cursorCoords: { x: number; y: number };
  startPoint: { x: number; y: number } | null;
  isDrawing: boolean;
  orthoLock: boolean;
  dynamicValues: DynamicDimensionValues;
  onUpdateValues: (updates: Partial<DynamicDimensionValues>) => void;
  onCommitAutoDraw: () => void;
  visible: boolean;
}

export const CadDynamicInputHud: React.FC<CadDynamicInputHudProps> = ({
  activeTool,
  cursorCoords,
  startPoint,
  isDrawing,
  orthoLock,
  dynamicValues,
  onUpdateValues,
  onCommitAutoDraw,
  visible
}) => {
  const [activeField, setActiveField] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // Focus primary input when tool changes or drawing begins
  useEffect(() => {
    if (visible) {
      primaryInputRef.current?.select();
    }
  }, [activeTool, isDrawing, visible]);

  if (!visible) return null;

  const isEligibleTool = [
    'LINE', 
    'CIRCLE', 
    'RECTANGLE', 
    'POLYGON', 
    'ARC', 
    'ELLIPSE', 
    'CAD_OFFSET'
  ].includes(activeTool);

  if (!isEligibleTool) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (activeField === 'PRIMARY') {
        setActiveField('SECONDARY');
        secondaryInputRef.current?.focus();
        secondaryInputRef.current?.select();
      } else {
        setActiveField('PRIMARY');
        primaryInputRef.current?.focus();
        primaryInputRef.current?.select();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onCommitAutoDraw();
    }
  };

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl">
      {/* AutoCAD Precision Dynamic Input Control Bar */}
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-xl px-4 py-2 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Active Tool Indicator & Mode */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AUTOCAD DYN</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300 font-semibold">
            {activeTool === 'LINE' && <Slash className="w-3.5 h-3.5 text-cyan-400" />}
            {activeTool === 'CIRCLE' && <Circle className="w-3.5 h-3.5 text-cyan-400" />}
            {activeTool === 'RECTANGLE' && <Square className="w-3.5 h-3.5 text-cyan-400" />}
            {activeTool === 'POLYGON' && <Hexagon className="w-3.5 h-3.5 text-cyan-400" />}
            {activeTool === 'ARC' && <Compass className="w-3.5 h-3.5 text-cyan-400" />}
            {activeTool === 'ELLIPSE' && <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="text-white uppercase tracking-wider">{activeTool}</span>
          </div>

          {startPoint && (
            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
              Origin: ({startPoint.x.toFixed(0)}, {startPoint.y.toFixed(0)})
            </span>
          )}
        </div>

        {/* Center: Dynamic Input Numerical Fields */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 1. LINE TOOL DIMENSIONS */}
          {activeTool === 'LINE' && (
            <>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Length:</span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="1"
                  min="1"
                  value={dynamicValues.length || ''}
                  onChange={(e) => onUpdateValues({ length: Math.max(1, parseFloat(e.target.value) || 0) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="100"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Angle:</span>
                <input
                  ref={secondaryInputRef}
                  type="number"
                  step="5"
                  value={dynamicValues.angle || 0}
                  onChange={(e) => onUpdateValues({ angle: parseFloat(e.target.value) || 0 })}
                  onKeyDown={handleKeyDown}
                  className="w-14 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="0"
                />
                <span className="text-amber-400 text-[10px]">°</span>
              </div>
            </>
          )}

          {/* 2. CIRCLE TOOL DIMENSIONS */}
          {activeTool === 'CIRCLE' && (
            <>
              <div className="flex items-center bg-slate-950 rounded-lg border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateValues({ useDiameter: false })}
                  className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                    !dynamicValues.useDiameter ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Radius (R)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateValues({ useDiameter: true })}
                  className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                    dynamicValues.useDiameter ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Diameter (Ø)
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">
                  {dynamicValues.useDiameter ? 'Ø Dim:' : 'R Dim:'}
                </span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="1"
                  min="1"
                  value={
                    dynamicValues.useDiameter 
                      ? (dynamicValues.diameter || dynamicValues.radius * 2 || '') 
                      : (dynamicValues.radius || '')
                  }
                  onChange={(e) => {
                    const val = Math.max(1, parseFloat(e.target.value) || 0);
                    if (dynamicValues.useDiameter) {
                      onUpdateValues({ diameter: val, radius: val / 2 });
                    } else {
                      onUpdateValues({ radius: val, diameter: val * 2 });
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="50"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>
            </>
          )}

          {/* 3. RECTANGLE TOOL DIMENSIONS */}
          {activeTool === 'RECTANGLE' && (
            <>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Width (X):</span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="5"
                  min="1"
                  value={dynamicValues.width || ''}
                  onChange={(e) => onUpdateValues({ width: Math.max(1, parseFloat(e.target.value) || 0) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="100"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Height (Y):</span>
                <input
                  ref={secondaryInputRef}
                  type="number"
                  step="5"
                  min="1"
                  value={dynamicValues.height || ''}
                  onChange={(e) => onUpdateValues({ height: Math.max(1, parseFloat(e.target.value) || 0) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="60"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>
            </>
          )}

          {/* 4. REGULAR POLYGON TOOL DIMENSIONS */}
          {activeTool === 'POLYGON' && (
            <>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Sides (N):</span>
                <select
                  value={dynamicValues.sides || 6}
                  onChange={(e) => onUpdateValues({ sides: parseInt(e.target.value) || 6 })}
                  className="bg-transparent text-white font-bold outline-none"
                >
                  <option value={3} className="bg-slate-900 text-white">3 (Equilateral)</option>
                  <option value={4} className="bg-slate-900 text-white">4 (Square)</option>
                  <option value={5} className="bg-slate-900 text-white">5 (Pentagon)</option>
                  <option value={6} className="bg-slate-900 text-white">6 (Hexagon)</option>
                  <option value={7} className="bg-slate-900 text-white">7 (Heptagon)</option>
                  <option value={8} className="bg-slate-900 text-white">8 (Octagon)</option>
                  <option value={10} className="bg-slate-900 text-white">10 (Decagon)</option>
                  <option value={12} className="bg-slate-900 text-white">12 (Dodecagon)</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Radius:</span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="5"
                  min="5"
                  value={dynamicValues.polygonRadius || 50}
                  onChange={(e) => onUpdateValues({ polygonRadius: Math.max(5, parseFloat(e.target.value) || 50) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="50"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>
            </>
          )}

          {/* 5. ARC TOOL DIMENSIONS */}
          {activeTool === 'ARC' && (
            <>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Radius:</span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="5"
                  min="5"
                  value={dynamicValues.arcRadius || 60}
                  onChange={(e) => onUpdateValues({ arcRadius: Math.max(5, parseFloat(e.target.value) || 60) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="60"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Sweep:</span>
                <input
                  ref={secondaryInputRef}
                  type="number"
                  step="15"
                  value={dynamicValues.arcEndAngle || 180}
                  onChange={(e) => onUpdateValues({ arcEndAngle: parseFloat(e.target.value) || 180 })}
                  onKeyDown={handleKeyDown}
                  className="w-14 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="180"
                />
                <span className="text-amber-400 text-[10px]">°</span>
              </div>
            </>
          )}

          {/* 6. ELLIPSE TOOL DIMENSIONS */}
          {activeTool === 'ELLIPSE' && (
            <>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Major Rx:</span>
                <input
                  ref={primaryInputRef}
                  type="number"
                  step="5"
                  min="5"
                  value={dynamicValues.ellipseRx || 80}
                  onChange={(e) => onUpdateValues({ ellipseRx: Math.max(5, parseFloat(e.target.value) || 80) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="80"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
                <span className="text-slate-400 text-[11px]">Minor Ry:</span>
                <input
                  ref={secondaryInputRef}
                  type="number"
                  step="5"
                  min="5"
                  value={dynamicValues.ellipseRy || 40}
                  onChange={(e) => onUpdateValues({ ellipseRy: Math.max(5, parseFloat(e.target.value) || 40) })}
                  onKeyDown={handleKeyDown}
                  className="w-16 bg-transparent text-white font-bold outline-none text-right"
                  placeholder="40"
                />
                <span className="text-cyan-400 text-[10px]">mm</span>
              </div>
            </>
          )}

          {/* 7. CAD OFFSET DIMENSION */}
          {activeTool === 'CAD_OFFSET' && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700 focus-within:border-cyan-400">
              <span className="text-slate-400 text-[11px]">Offset Dist:</span>
              <input
                ref={primaryInputRef}
                type="number"
                step="1"
                min="1"
                value={dynamicValues.offsetDistance || 15}
                onChange={(e) => onUpdateValues({ offsetDistance: Math.max(1, parseFloat(e.target.value) || 15) })}
                onKeyDown={handleKeyDown}
                className="w-16 bg-transparent text-white font-bold outline-none text-right"
                placeholder="15"
              />
              <span className="text-cyan-400 text-[10px]">mm</span>
            </div>
          )}

          {/* Auto-Annotate ISO Dimensions Checkbox */}
          <label className="flex items-center gap-1.5 px-2 py-1 bg-slate-950/70 border border-slate-700 rounded-lg text-[10px] text-slate-300 hover:text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dynamicValues.autoAnnotateDimension}
              onChange={(e) => onUpdateValues({ autoAnnotateDimension: e.target.checked })}
              className="accent-cyan-500 rounded"
            />
            <span>Auto ISO Dim</span>
          </label>
        </div>

        {/* Right: Execute Automatic Drawing Action Button & Keyboard Hint */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 font-sans">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Tab</kbd>
            <span>switch field</span>
            <span className="mx-0.5">•</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Enter</kbd>
            <span>draw</span>
          </div>

          <button
            type="button"
            onClick={onCommitAutoDraw}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <span>Auto-Draw</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
