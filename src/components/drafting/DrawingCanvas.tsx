import React, { useRef, useState, useEffect } from 'react';
import { ConstructionElement, DrawingTopic, InstrumentState, LineWeightType } from '../../types/curriculum';
import { InstrumentsOverlay } from './InstrumentsOverlay';
import { SheetTitleBlock } from './SheetTitleBlock';
import { GridMode, ToolDock } from './ToolDock';

interface DrawingCanvasProps {
  topic: DrawingTopic;
  elements: ConstructionElement[];
  instrument: InstrumentState;
  activeStep: number;
  totalSteps: number;
  gridMode: GridMode;
  onSelectGridMode: (mode: GridMode) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onOpenProjection?: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  topic,
  elements,
  instrument,
  activeStep,
  totalSteps,
  gridMode,
  onSelectGridMode,
  svgRef,
  onOpenProjection
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [showInstruments, setShowInstruments] = useState<boolean>(true);
  const [showTitleBlock, setShowTitleBlock] = useState<boolean>(true);
  const [showGuideLines, setShowGuideLines] = useState<boolean>(true);

  const viewBoxW = topic.defaultViewBox.width || 800;
  const viewBoxH = topic.defaultViewBox.height || 600;

  // Handle Zoom
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.15));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(z => Math.min(2.5, z + 0.08));
    } else {
      setZoom(z => Math.max(0.4, z - 0.08));
    }
  };

  // Touch / Pinch zoom state ref
  const touchStateRef = useRef<{ initialDistance: number; initialZoom: number; isMultiTouch: boolean }>({
    initialDistance: 0,
    initialZoom: 1,
    isMultiTouch: false
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchStateRef.current.isMultiTouch = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStateRef.current.initialDistance = Math.hypot(dx, dy);
      touchStateRef.current.initialZoom = zoom;
    } else if (e.touches.length === 1) {
      touchStateRef.current.isMultiTouch = false;
      setIsPanning(true);
      setStartPan({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStateRef.current.isMultiTouch) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      if (touchStateRef.current.initialDistance > 0) {
        const factor = currentDist / touchStateRef.current.initialDistance;
        const targetZoom = Math.max(0.4, Math.min(2.5, touchStateRef.current.initialZoom * factor));
        setZoom(targetZoom);
      }
    } else if (e.touches.length === 1 && isPanning) {
      setPan({
        x: e.touches[0].clientX - startPan.x,
        y: e.touches[0].clientY - startPan.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    touchStateRef.current.isMultiTouch = false;
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) { // Left or middle click
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left - pan.x) / (rect.width * zoom)) * viewBoxW;
      const rawY = ((e.clientY - rect.top - pan.y) / (rect.height * zoom)) * viewBoxH;
      const finalX = snapEnabled ? Math.round(rawX / 5) * 5 : rawX;
      const finalY = snapEnabled ? Math.round(rawY / 5) * 5 : rawY;
      setMouseCoords({ x: Math.max(0, Math.min(viewBoxW, finalX)), y: Math.max(0, Math.min(viewBoxH, finalY)) });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Line weight class mapper (ISO 128 standards)
  const getLineStyle = (weight: LineWeightType, isNew?: boolean, isFinal?: boolean) => {
    switch (weight) {
      case 'THICK_CONTINUOUS':
        return {
          stroke: isFinal ? '#38bdf8' : '#f8fafc',
          strokeWidth: isFinal ? 3 : 2.5,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
          filter: isNew ? 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.6))' : undefined
        };
      case 'THIN_CONTINUOUS':
        return {
          stroke: isNew 
            ? '#38bdf8' 
            : (showGuideLines ? '#06b6d4' : '#475569'),
          strokeWidth: showGuideLines ? 1.3 : 0.9,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
          filter: (showGuideLines && !isNew) ? 'drop-shadow(0 0 2px rgba(6, 182, 212, 0.3))' : undefined
        };
      case 'THIN_DASHED':
        return {
          stroke: showGuideLines ? '#94a3b8' : '#64748b',
          strokeWidth: 1.2,
          strokeDasharray: '6, 4',
          strokeLinecap: 'butt' as const
        };
      case 'THIN_CHAIN':
        return {
          stroke: showGuideLines ? '#38bdf8' : '#64748b',
          strokeWidth: 1.1,
          strokeDasharray: '18, 4, 4, 4',
          strokeLinecap: 'butt' as const
        };
      case 'DIMENSION_LINE':
        return {
          stroke: '#38bdf8',
          strokeWidth: 1.2,
          strokeLinecap: 'round' as const
        };
      case 'LOCUS_TRACE':
        return {
          stroke: '#f59e0b',
          strokeWidth: 2,
          strokeDasharray: '3, 3'
        };
      default:
        return {
          stroke: '#cbd5e1',
          strokeWidth: 1.5
        };
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center cursor-crosshair select-none touch-none"
    >
      {/* Top Floating Drafting Toolbar */}
      <ToolDock
        gridMode={gridMode}
        onSelectGridMode={onSelectGridMode}
        snapEnabled={snapEnabled}
        onToggleSnap={() => setSnapEnabled(s => !s)}
        showInstruments={showInstruments}
        onToggleInstruments={() => setShowInstruments(i => !i)}
        showTitleBlock={showTitleBlock}
        onToggleTitleBlock={() => setShowTitleBlock(t => !t)}
        showGuideLines={showGuideLines}
        onToggleGuideLines={() => setShowGuideLines(g => !g)}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        mouseCoords={mouseCoords}
        onOpenProjection={onOpenProjection}
      />

      {/* Main SVG Vector Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          className="w-[96%] h-[92%] max-w-[1200px] max-h-[850px] shadow-2xl rounded-lg bg-[#070d18] border border-slate-800"
        >
          <defs>
            {/* Standard Dimension Arrow Markers */}
            <marker
              id="dim-arrow-start"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 5 L 10 1 L 7 5 L 10 9 z" fill="#38bdf8" />
            </marker>
            <marker
              id="dim-arrow-end"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 10 5 L 0 1 L 3 5 L 0 9 z" fill="#38bdf8" />
            </marker>

            {/* Millimeter Grid Pattern */}
            <pattern id="grid-10mm" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.6" />
            </pattern>
            <pattern id="grid-50mm" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#grid-10mm)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#334155" strokeWidth="1.2" />
            </pattern>

            {/* Isometric Grid Pattern */}
            <pattern id="grid-iso" width="60" height="103.92" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 60 51.96 L 30 103.92 L 0 51.96 Z" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              <line x1="30" y1="0" x2="30" y2="103.92" stroke="#334155" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* BACKGROUND GRID LAYER */}
          {gridMode === 'MILLIMETER' && (
            <rect width={viewBoxW} height={viewBoxH} fill="url(#grid-50mm)" />
          )}
          {gridMode === 'ISOMETRIC' && (
            <rect width={viewBoxW} height={viewBoxH} fill="url(#grid-iso)" />
          )}
          {gridMode === 'POLAR' && (
            <g className="polar-grid-lines stroke-slate-800/80 stroke-[0.8] fill-none">
              {[50, 100, 150, 200, 250, 300].map(r => (
                <circle key={r} cx={viewBoxW / 2} cy={viewBoxH / 2} r={r} />
              ))}
              {Array.from({ length: 12 }).map((_, i) => {
                const rad = (i * 30 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={viewBoxW / 2}
                    y1={viewBoxH / 2}
                    x2={viewBoxW / 2 + 350 * Math.cos(rad)}
                    y2={viewBoxH / 2 + 350 * Math.sin(rad)}
                  />
                );
              })}
            </g>
          )}

          {/* GEOMETRIC CONSTRUCTION ELEMENTS */}
          <g className="construction-elements">
            {elements.map((el) => {
              const style = getLineStyle(el.lineWeight, el.isNew, el.isFinalResult);
              const animClass = el.isNew ? 'vector-animated-element' : undefined;

              switch (el.type) {
                case 'SEGMENT':
                  return (
                    <line
                      key={el.id}
                      x1={el.x1}
                      y1={el.y1}
                      x2={el.x2}
                      y2={el.y2}
                      style={style}
                      className={animClass}
                    />
                  );

                case 'CIRCLE':
                  return (
                    <circle
                      key={el.id}
                      cx={el.cx}
                      cy={el.cy}
                      r={el.r}
                      fill="none"
                      style={style}
                      className={animClass}
                    />
                  );

                case 'ARC': {
                  const cx = el.cx || 0;
                  const cy = el.cy || 0;
                  const r = el.r || 50;
                  const startRad = ((el.startAngle || 0) * Math.PI) / 180;
                  const endRad = ((el.endAngle || 90) * Math.PI) / 180;

                  const x1 = cx + r * Math.cos(startRad);
                  const y1 = cy + r * Math.sin(startRad);
                  const x2 = cx + r * Math.cos(endRad);
                  const y2 = cy + r * Math.sin(endRad);

                  const delta = (el.endAngle || 90) - (el.startAngle || 0);
                  const largeArcFlag = Math.abs(delta) > 180 ? 1 : 0;
                  const sweepFlag = delta > 0 ? 1 : 0;

                  const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

                  return (
                    <path
                      key={el.id}
                      d={d}
                      fill="none"
                      style={style}
                      className={animClass}
                    />
                  );
                }

                case 'POLYGON':
                  if (!el.points || el.points.length < 2) return null;
                  const ptsStr = el.points.map(p => `${p[0]},${p[1]}`).join(' ');
                  return (
                    <polygon
                      key={el.id}
                      points={ptsStr}
                      fill={el.isFinalResult ? 'rgba(56, 189, 248, 0.04)' : 'none'}
                      style={style}
                      className={animClass}
                    />
                  );

                case 'RECTANGLE':
                  return (
                    <rect
                      key={el.id}
                      x={el.x ?? el.x1 ?? 0}
                      y={el.y ?? el.y1 ?? 0}
                      width={el.width ?? Math.abs((el.x2 ?? 0) - (el.x1 ?? 0))}
                      height={el.height ?? Math.abs((el.y2 ?? 0) - (el.y1 ?? 0))}
                      fill={el.isFinalResult ? 'rgba(56, 189, 248, 0.04)' : 'none'}
                      style={style}
                      className={animClass}
                    />
                  );

                case 'POINT':
                  return (
                    <g key={el.id} className="point-node">
                      <circle
                        cx={el.cx}
                        cy={el.cy}
                        r={el.lineWeight === 'THICK_CONTINUOUS' ? 3.5 : 2.5}
                        className={el.isNew ? 'fill-cyan-400 stroke-white stroke-[1] animate-pulse' : 'fill-slate-100 stroke-slate-900 stroke-[1]'}
                      />
                      {el.label && (
                        <text
                          x={(el.cx || 0) + (el.labelPosition === 'left' ? -12 : el.labelPosition === 'right' ? 12 : el.labelPosition === 'top' ? 0 : 0)}
                          y={(el.cy || 0) + (el.labelPosition === 'top' ? -10 : el.labelPosition === 'bottom' ? 16 : 4)}
                          textAnchor={el.labelPosition === 'left' ? 'end' : el.labelPosition === 'right' ? 'start' : 'middle'}
                          className="fill-slate-200 text-[11px] font-mono font-bold select-none drop-shadow-sm"
                        >
                          {el.label}
                        </text>
                      )}
                    </g>
                  );

                case 'DIMENSION':
                  return (
                    <g key={el.id} className="dimension-group">
                      {/* Leader Extension Lines */}
                      <line
                        x1={el.x1}
                        y1={(el.y1 || 0) - 6}
                        x2={el.x1}
                        y2={(el.y1 || 0) + 6}
                        className="stroke-cyan-500/70 stroke-[0.8]"
                      />
                      <line
                        x1={el.x2}
                        y1={(el.y2 || 0) - 6}
                        x2={el.x2}
                        y2={(el.y2 || 0) + 6}
                        className="stroke-cyan-500/70 stroke-[0.8]"
                      />
                      {/* Main Dimension Line with Arrows */}
                      <line
                        x1={el.x1}
                        y1={el.y1}
                        x2={el.x2}
                        y2={el.y2}
                        markerStart="url(#dim-arrow-start)"
                        markerEnd="url(#dim-arrow-end)"
                        className="stroke-cyan-400 stroke-[1.2]"
                      />
                      {/* Dimension Text centered on line */}
                      <rect
                        x={((el.x1 || 0) + (el.x2 || 0)) / 2 - 28}
                        y={((el.y1 || 0) + (el.y2 || 0)) / 2 - 12}
                        width={56}
                        height={16}
                        rx={3}
                        className="fill-slate-950 stroke-cyan-500/40 stroke-[0.8]"
                      />
                      <text
                        x={((el.x1 || 0) + (el.x2 || 0)) / 2}
                        y={((el.y1 || 0) + (el.y2 || 0)) / 2 + 1}
                        textAnchor="middle"
                        className="fill-cyan-300 text-[10px] font-mono font-bold"
                      >
                        {el.dimensionText}
                      </text>
                    </g>
                  );

                case 'TEXT_LABEL':
                  return (
                    <text
                      key={el.id}
                      x={el.cx}
                      y={el.cy}
                      textAnchor="middle"
                      className="fill-slate-300 text-[11px] font-mono font-bold tracking-wider"
                    >
                      {el.label}
                    </text>
                  );

                default:
                  return null;
              }
            })}
          </g>

          {/* STANDARD LETTERING GUIDELINES LAYER (when topic is Lettering & Numbering) */}
          {showGuideLines && (topic.id.includes('lettering') || topic.title.toLowerCase().includes('lettering')) && (
            <g className="lettering-guidelines opacity-70 pointer-events-none">
              {/* Horizontal Guidelines: Cap (200), Waist (235), Base (270), Drop (305) */}
              <line x1={80} y1={200} x2={720} y2={200} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="5,3" />
              <text x={85} y={195} className="fill-cyan-400 text-[9px] font-mono">CAP LINE (Uppercase Height = 7mm)</text>
              
              <line x1={80} y1={235} x2={720} y2={235} stroke="#0ea5e9" strokeWidth={0.6} strokeDasharray="3,3" />
              <text x={85} y={230} className="fill-cyan-300 text-[9px] font-mono">WAIST LINE (Lowercase Ascender = 5mm)</text>

              <line x1={80} y1={270} x2={720} y2={270} stroke="#38bdf8" strokeWidth={1} />
              <text x={85} y={265} className="fill-cyan-400 text-[9px] font-mono font-bold">BASE LINE (Datum Alignment)</text>

              <line x1={80} y1={305} x2={720} y2={305} stroke="#0ea5e9" strokeWidth={0.6} strokeDasharray="3,3" />
              <text x={85} y={318} className="fill-cyan-300 text-[9px] font-mono">DROP LINE (Descender Depth)</text>

              {/* 75° Slanted Single-Stroke Gothic Guideline Rays */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={i}
                  x1={150 + i * 60}
                  y1={190}
                  x2={120 + i * 60}
                  y2={315}
                  stroke="#0284c7"
                  strokeWidth={0.6}
                  strokeDasharray="4,4"
                />
              ))}
              <text x={650} y={195} className="fill-cyan-400 text-[9px] font-mono">75° Slope Guides</text>
            </g>
          )}

          {/* VIRTUAL INSTRUMENTS OVERLAY LAYER */}
          {showInstruments && (
            <InstrumentsOverlay instrument={instrument} scale={zoom} showGuideLines={showGuideLines} />
          )}

          {/* STANDARD SHEET BORDER & TITLE BLOCK */}
          {showTitleBlock && (
            <SheetTitleBlock
              topic={topic}
              width={viewBoxW}
              height={viewBoxH}
              activeStep={activeStep}
              totalSteps={totalSteps}
            />
          )}
        </svg>
      </div>

      {/* Bottom Floating Drawing Guide Lines & Standards Legend */}
      {showGuideLines && (
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-xl backdrop-blur-md text-[10px] font-mono text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
            <span className="text-cyan-300">4H/2H Guide Lines (0.25mm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-300 rounded-full" />
            <span className="text-white font-bold">HB Finished Outlines (0.70mm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 rounded-full border-b border-dashed" />
            <span>Centerline (ISO Type G)</span>
          </div>
        </div>
      )}
    </div>
  );
};
