import React, { useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { WhiteboardTool } from '../../types/whiteboard';
import { DynamicDimensionValues } from './CadDynamicInputHud';

interface CadOnCanvasDynamicInputProps {
  activeTool: WhiteboardTool;
  canvasCoords: { x: number; y: number };
  startPoint: { x: number; y: number } | null;
  currentPoint: { x: number; y: number } | null;
  isDrawing: boolean;
  pan: { x: number; y: number };
  zoom: number;
  dynamicValues: DynamicDimensionValues;
  onUpdateValues: (updates: Partial<DynamicDimensionValues>) => void;
  onCommitAutoDraw: () => void;
  visible: boolean;
}

export const CadOnCanvasDynamicInput: React.FC<CadOnCanvasDynamicInputProps> = ({
  activeTool,
  canvasCoords,
  startPoint,
  currentPoint,
  isDrawing,
  pan,
  zoom,
  dynamicValues,
  onUpdateValues,
  onCommitAutoDraw,
  visible
}) => {
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  if (!visible) return null;

  const isEligibleTool = [
    'LINE', 
    'CIRCLE', 
    'RECTANGLE', 
    'POLYGON', 
    'ARC', 
    'ELLIPSE'
  ].includes(activeTool);

  if (!isEligibleTool) return null;

  // Determine screen position of the floating HUD
  const anchorPoint = currentPoint || startPoint || canvasCoords;
  const screenX = pan.x + anchorPoint.x * zoom + 25;
  const screenY = pan.y + anchorPoint.y * zoom + 20;

  // Handle Tab key to switch between inputs, Enter to commit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isPrimary: boolean) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (isPrimary && secondaryInputRef.current) {
        secondaryInputRef.current.focus();
        secondaryInputRef.current.select();
      } else if (!isPrimary && primaryInputRef.current) {
        primaryInputRef.current.focus();
        primaryInputRef.current.select();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onCommitAutoDraw();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${Math.max(10, Math.min(window.innerWidth - 260, screenX))}px`,
        top: `${Math.max(70, Math.min(window.innerHeight - 150, screenY))}px`,
        pointerEvents: 'auto'
      }}
      className="z-30 flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/95 border border-cyan-500/70 shadow-2xl backdrop-blur-md text-[11px] font-mono select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* 1. LINE TOOL FLOATING HUD */}
      {activeTool === 'LINE' && (
        <>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <input
              ref={primaryInputRef}
              type="number"
              min="1"
              value={dynamicValues.length ? Number(dynamicValues.length.toFixed(1)) : ''}
              onChange={(e) => onUpdateValues({ length: Math.max(1, parseFloat(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-14 bg-transparent text-white font-bold outline-none text-right"
              placeholder="Length"
              autoFocus
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>

          <div className="text-slate-500 text-[9px] font-sans">⇥</div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <input
              ref={secondaryInputRef}
              type="number"
              value={dynamicValues.angle !== undefined ? Number(dynamicValues.angle.toFixed(1)) : 0}
              onChange={(e) => onUpdateValues({ angle: parseFloat(e.target.value) || 0 })}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              placeholder="Angle"
            />
            <span className="text-amber-400 text-[10px]">°</span>
          </div>
        </>
      )}

      {/* 2. CIRCLE TOOL FLOATING HUD */}
      {activeTool === 'CIRCLE' && (
        <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
          <span className="text-slate-400 text-[10px]">{dynamicValues.useDiameter ? 'Ø:' : 'R:'}</span>
          <input
            ref={primaryInputRef}
            type="number"
            min="1"
            value={
              dynamicValues.useDiameter 
                ? Number((dynamicValues.diameter || dynamicValues.radius * 2).toFixed(1))
                : Number(dynamicValues.radius.toFixed(1))
            }
            onChange={(e) => {
              const val = Math.max(1, parseFloat(e.target.value) || 0);
              if (dynamicValues.useDiameter) {
                onUpdateValues({ diameter: val, radius: val / 2 });
              } else {
                onUpdateValues({ radius: val, diameter: val * 2 });
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, true)}
            className="w-14 bg-transparent text-white font-bold outline-none text-right"
            placeholder="Radius"
            autoFocus
          />
          <span className="text-cyan-400 text-[10px]">mm</span>
        </div>
      )}

      {/* 3. RECTANGLE TOOL FLOATING HUD */}
      {activeTool === 'RECTANGLE' && (
        <>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">W:</span>
            <input
              ref={primaryInputRef}
              type="number"
              min="1"
              value={dynamicValues.width ? Number(dynamicValues.width.toFixed(1)) : ''}
              onChange={(e) => onUpdateValues({ width: Math.max(1, parseFloat(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              placeholder="W"
              autoFocus
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>

          <div className="text-slate-500 text-[9px] font-sans">⇥</div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">H:</span>
            <input
              ref={secondaryInputRef}
              type="number"
              min="1"
              value={dynamicValues.height ? Number(dynamicValues.height.toFixed(1)) : ''}
              onChange={(e) => onUpdateValues({ height: Math.max(1, parseFloat(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              placeholder="H"
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>
        </>
      )}

      {/* 4. REGULAR POLYGON FLOATING HUD */}
      {activeTool === 'POLYGON' && (
        <>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">N:</span>
            <input
              ref={primaryInputRef}
              type="number"
              min="3"
              max="12"
              value={dynamicValues.sides || 6}
              onChange={(e) => onUpdateValues({ sides: Math.min(12, Math.max(3, parseInt(e.target.value) || 6)) })}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-9 bg-transparent text-white font-bold outline-none text-center"
              autoFocus
            />
          </div>

          <div className="text-slate-500 text-[9px] font-sans">⇥</div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">R:</span>
            <input
              ref={secondaryInputRef}
              type="number"
              min="5"
              value={dynamicValues.polygonRadius ? Number(dynamicValues.polygonRadius.toFixed(1)) : 50}
              onChange={(e) => onUpdateValues({ polygonRadius: Math.max(5, parseFloat(e.target.value) || 50) })}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              placeholder="Radius"
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>
        </>
      )}

      {/* 5. ARC TOOL FLOATING HUD */}
      {activeTool === 'ARC' && (
        <>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">R:</span>
            <input
              ref={primaryInputRef}
              type="number"
              min="5"
              value={dynamicValues.arcRadius ? Number(dynamicValues.arcRadius.toFixed(1)) : 60}
              onChange={(e) => onUpdateValues({ arcRadius: Math.max(5, parseFloat(e.target.value) || 60) })}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              autoFocus
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>

          <div className="text-slate-500 text-[9px] font-sans">⇥</div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">∠:</span>
            <input
              ref={secondaryInputRef}
              type="number"
              value={dynamicValues.arcEndAngle || 180}
              onChange={(e) => onUpdateValues({ arcEndAngle: parseFloat(e.target.value) || 180 })}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
            />
            <span className="text-amber-400 text-[10px]">°</span>
          </div>
        </>
      )}

      {/* 6. ELLIPSE FLOATING HUD */}
      {activeTool === 'ELLIPSE' && (
        <>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">Rx:</span>
            <input
              ref={primaryInputRef}
              type="number"
              min="5"
              value={dynamicValues.ellipseRx ? Number(dynamicValues.ellipseRx.toFixed(1)) : 80}
              onChange={(e) => onUpdateValues({ ellipseRx: Math.max(5, parseFloat(e.target.value) || 80) })}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
              autoFocus
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>

          <div className="text-slate-500 text-[9px] font-sans">⇥</div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 focus-within:border-cyan-400">
            <span className="text-slate-400 text-[10px]">Ry:</span>
            <input
              ref={secondaryInputRef}
              type="number"
              min="5"
              value={dynamicValues.ellipseRy ? Number(dynamicValues.ellipseRy.toFixed(1)) : 40}
              onChange={(e) => onUpdateValues({ ellipseRy: Math.max(5, parseFloat(e.target.value) || 40) })}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-12 bg-transparent text-white font-bold outline-none text-right"
            />
            <span className="text-cyan-400 text-[10px]">mm</span>
          </div>
        </>
      )}

      {/* Direct Enter to Commit Button */}
      <button
        type="button"
        onClick={onCommitAutoDraw}
        className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-0.5 text-[10px] shadow transition-colors cursor-pointer"
        title="Commit Dimension (Enter)"
      >
        <span>↵</span>
      </button>
    </div>
  );
};
