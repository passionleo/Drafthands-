import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download, 
  Compass, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2,
  Layers,
  FileText,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { TextbookFigure } from '../../types/textbook';
import { ConstructionElement, LineWeightType } from '../../types/curriculum';
import { getAuthenticTextbookDiagram, AuthenticDiagramPayload } from '../../data/authenticTextbookDiagrams';
import { formatMathSymbols } from '../../utils/formatMath';

export interface TextbookFigurePlateProps {
  figure: TextbookFigure;
  plateNumber?: string;
  topicTitle?: string;
  topicId?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Backward compatibility export
 */
export function getActualDiagramImage(
  topicTitle?: string, 
  figureTitle?: string, 
  svgType?: string, 
  topicId?: string
): string {
  return '';
}

export const TextbookFigurePlate: React.FC<TextbookFigurePlateProps> = ({
  figure,
  plateNumber,
  topicTitle,
  topicId,
  className = '',
  compact = false
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Resolve authentic J.N. Green or Pickup & Parker diagram data
  const authenticData: AuthenticDiagramPayload = getAuthenticTextbookDiagram({
    topicId,
    topicTitle,
    figureTitle: figure.title,
    svgType: figure.svgType,
    figureNumber: figure.figureNumber || plateNumber
  });

  // Elements to render: prefer figure.elements if provided, else authentic procedural geometry
  const elementsToRender: ConstructionElement[] = (figure.elements && figure.elements.length > 0)
    ? figure.elements
    : authenticData.elements;

  // Authentic citation text
  const textbookCitation = figure.textbookSource || authenticData.textbookSource;
  
  // Mathematical proof text with formatted Unicode symbols
  const mathProof = formatMathSymbols(figure.caption && figure.caption.includes('=') ? figure.caption : authenticData.mathematicalProof);

  // States
  const [highlightGuideLines, setHighlightGuideLines] = useState<boolean>(true);
  const [isLightMode, setIsLightMode] = useState<boolean>(false); // False = Blueprint, True = Drafting Paper
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setZoom(z => Math.min(2.5, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(0.6, Number((z - 0.25).toFixed(2))));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Export crisp vector SVG diagram
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgRef.current);
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeNum = (figure.figureNumber || plateNumber || 'diagram').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const safeTitle = (figure.title || 'plate').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `${safeNum}-${safeTitle}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting diagram SVG:', err);
    }
  };

  // Helper for rendering drawing guide lines styling according to ISO 128 / J.N. Green
  const getVectorLineStyle = (weight: LineWeightType, isFinal?: boolean): React.CSSProperties => {
    if (isFinal || weight === 'THICK_CONTINUOUS' || weight === 'OUTLINE_HB') {
      return {
        stroke: isLightMode ? '#0f172a' : '#38bdf8',
        strokeWidth: isLightMode ? 2.8 : 3.0,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        filter: !isLightMode ? 'drop-shadow(0 0 3px rgba(56, 189, 248, 0.4))' : undefined
      };
    }

    if (weight === 'THIN_CHAIN' || weight === 'CENTER_LINE') {
      return {
        stroke: isLightMode ? '#475569' : '#38bdf8',
        strokeWidth: 1.2,
        strokeDasharray: '18, 4, 3, 4',
        strokeLinecap: 'butt'
      };
    }

    if (weight === 'THIN_DASHED' || weight === 'HIDDEN_DETAIL') {
      return {
        stroke: isLightMode ? '#64748b' : '#94a3b8',
        strokeWidth: 1.3,
        strokeDasharray: '6, 4',
        strokeLinecap: 'butt'
      };
    }

    if (weight === 'DIMENSION_LINE') {
      return {
        stroke: isLightMode ? '#0284c7' : '#06b6d4',
        strokeWidth: 1.2,
        strokeLinecap: 'round'
      };
    }

    if (weight === 'CONSTRUCTION_4H') {
      // 4H Faint Guide Lines and Compass Swing Arcs
      return {
        stroke: highlightGuideLines 
          ? (isLightMode ? '#0284c7' : '#06b6d4') 
          : (isLightMode ? '#cbd5e1' : '#334155'),
        strokeWidth: highlightGuideLines ? 1.5 : 0.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        filter: (highlightGuideLines && !isLightMode) ? 'drop-shadow(0 0 2px rgba(6, 182, 212, 0.4))' : undefined
      };
    }

    // Default: 2H Construction Lines (0.25mm)
    return {
      stroke: highlightGuideLines 
        ? (isLightMode ? '#0284c7' : '#38bdf8') 
        : (isLightMode ? '#94a3b8' : '#475569'),
      strokeWidth: highlightGuideLines ? 1.6 : 1.1,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    };
  };

  const containerContent = (
    <div className={`rounded-xl border transition-all duration-200 shadow-xl overflow-hidden flex flex-col ${
      isLightMode ? 'bg-[#fdfcf9] border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
    } ${className}`}>
      
      {/* 1. TOP FIGURE HEADER BAR */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs select-none ${
        isLightMode ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded font-mono font-bold text-xs uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {figure.figureNumber || plateNumber || authenticData.figureNumber}
          </span>
          <span className="font-semibold text-xs truncate max-w-[200px] sm:max-w-[340px] text-slate-200">
            {figure.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Toggle Drawing Guide Lines */}
          <button
            onClick={() => setHighlightGuideLines(!highlightGuideLines)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
              highlightGuideLines 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-semibold' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle 4H / 2H Construction & Drawing Guide Lines"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Guide Lines:</span>
            <span>{highlightGuideLines ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Drafting Paper Surface vs Blueprint Canvas */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
              isLightMode 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-700 font-semibold' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300'
            }`}
            title={isLightMode ? "Switch to Midnight Blueprint Canvas" : "Switch to Authentic White/Cream Drafting Sheet"}
          >
            {isLightMode ? (
              <>
                <Sun className="w-3 h-3 text-amber-600" />
                <span className="hidden sm:inline">Drafting Sheet</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Blueprint</span>
              </>
            )}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/80 rounded border border-slate-700">
            <button
              onClick={handleZoomIn}
              title="Zoom In (+)"
              className="p-1 hover:bg-slate-700 rounded-l text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-300 select-none">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={handleZoomOut}
              title="Zoom Out (-)"
              className="p-1 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1 hover:bg-slate-700 rounded-r text-slate-400 hover:text-cyan-400 transition-colors border-l border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download Vector SVG */}
          <button
            onClick={handleDownloadSvg}
            title="Download High-Resolution Technical Vector SVG"
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition-colors border border-transparent hover:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Inspect Diagram in Fullscreen"}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition-colors border border-transparent hover:border-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. PRIMARY STAGE: AUTHENTIC J.N. GREEN / PICKUP & PARKER VECTOR TECHNICAL DIAGRAM */}
      <div 
        className={`relative w-full overflow-hidden flex items-center justify-center p-3 select-none transition-colors duration-200 ${
          compact ? 'h-64 sm:h-72' : (isFullscreen ? 'h-[72vh]' : 'h-72 sm:h-96')
        } ${isLightMode ? 'bg-[#f8f7f4]' : 'bg-[#050b14]'}`}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className={`w-full h-full max-h-full rounded-lg border shadow-xl ${
                isLightMode 
                  ? 'bg-[#ffffff] border-slate-300' 
                  : 'bg-[#060e1d] border-cyan-500/30 shadow-[0_0_25px_rgba(0,0,0,0.8)]'
              }`}
            >
              <defs>
                <pattern id="guideline-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 25 0 L 0 0 0 25" 
                    fill="none" 
                    stroke={isLightMode ? '#f1f5f9' : '#0f172a'} 
                    strokeWidth="0.6" 
                  />
                </pattern>
                {/* Marker for Dimension Lines */}
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    fill={isLightMode ? '#0284c7' : '#06b6d4'}
                  />
                </marker>
                <marker
                  id="arrowhead-rev"
                  markerWidth="8"
                  markerHeight="6"
                  refX="1"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="8 0, 0 3, 8 6"
                    fill={isLightMode ? '#0284c7' : '#06b6d4'}
                  />
                </marker>
              </defs>

              {/* Background Drafting Grid */}
              <rect width="800" height="600" fill="url(#guideline-grid)" />

              {/* Reference Center Lines (ISO Type G) */}
              {highlightGuideLines && (
                <g className="opacity-30">
                  <line 
                    x1="20" y1="300" x2="780" y2="300" 
                    stroke={isLightMode ? '#0284c7' : '#06b6d4'} 
                    strokeWidth="0.8" 
                    strokeDasharray="24, 4, 4, 4" 
                  />
                  <line 
                    x1="400" y1="20" x2="400" y2="580" 
                    stroke={isLightMode ? '#0284c7' : '#06b6d4'} 
                    strokeWidth="0.8" 
                    strokeDasharray="24, 4, 4, 4" 
                  />
                </g>
              )}

              {/* Construction Elements with Proper Line Weights */}
              <g className="vector-elements">
                {elementsToRender.map((el, elIdx) => {
                  const style = getVectorLineStyle(el.lineWeight, el.isFinalResult);

                  switch (el.type) {
                    case 'LINE':
                    case 'SEGMENT':
                      return (
                        <line
                          key={el.id || elIdx}
                          x1={el.x1}
                          y1={el.y1}
                          x2={el.x2}
                          y2={el.y2}
                          style={style}
                        />
                      );

                    case 'CIRCLE':
                      return (
                        <circle
                          key={el.id || elIdx}
                          cx={el.cx}
                          cy={el.cy}
                          r={el.r}
                          fill="none"
                          style={style}
                        />
                      );

                    case 'ARC': {
                      const cx = el.cx || 400;
                      const cy = el.cy || 300;
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
                          key={el.id || elIdx}
                          d={d}
                          fill="none"
                          style={style}
                        />
                      );
                    }

                    case 'POLYGON':
                      if (!el.points || el.points.length < 2) return null;
                      return (
                        <polygon
                          key={el.id || elIdx}
                          points={el.points.map(p => `${p[0]},${p[1]}`).join(' ')}
                          fill={el.isFinalResult 
                            ? (isLightMode ? 'rgba(2, 132, 199, 0.05)' : 'rgba(56, 189, 248, 0.06)') 
                            : 'none'
                          }
                          style={style}
                        />
                      );

                    case 'POINT': {
                      const pos = el.labelPosition;
                      let dx = 10;
                      let dy = -10;
                      let anchor: 'start' | 'middle' | 'end' = 'start';

                      if (pos === 'top') {
                        dx = 0; dy = -12; anchor = 'middle';
                      } else if (pos === 'bottom') {
                        dx = 0; dy = 18; anchor = 'middle';
                      } else if (pos === 'left') {
                        dx = -12; dy = 4; anchor = 'end';
                      } else if (pos === 'right') {
                        dx = 12; dy = 4; anchor = 'start';
                      } else if (pos === 'top-left') {
                        dx = -10; dy = -10; anchor = 'end';
                      } else if (pos === 'top-right') {
                        dx = 10; dy = -10; anchor = 'start';
                      } else if (pos === 'bottom-left') {
                        dx = -10; dy = 18; anchor = 'end';
                      } else if (pos === 'bottom-right') {
                        dx = 10; dy = 18; anchor = 'start';
                      }

                      return (
                        <g key={el.id || elIdx}>
                          <circle
                            cx={el.cx}
                            cy={el.cy}
                            r={el.isFinalResult ? 3.5 : 2.5}
                            className={isLightMode ? 'fill-slate-900 stroke-white stroke-1' : 'fill-cyan-300 stroke-slate-950 stroke-1'}
                          />
                          {/* Tiny compass puncture crosshair */}
                          {highlightGuideLines && (
                            <g className={isLightMode ? 'stroke-slate-400' : 'stroke-cyan-500/60'} strokeWidth="0.8">
                              <line x1={(el.cx || 0) - 4} y1={el.cy} x2={(el.cx || 0) + 4} y2={el.cy} />
                              <line x1={el.cx} y1={(el.cy || 0) - 4} x2={el.cx} y2={(el.cy || 0) + 4} />
                            </g>
                          )}
                          {el.label && (
                            <text
                              x={(el.cx || 0) + dx}
                              y={(el.cy || 0) + dy}
                              textAnchor={anchor}
                              style={{
                                paintOrder: 'stroke fill',
                                stroke: isLightMode ? '#f8fafc' : '#020617',
                                strokeWidth: '3px',
                                strokeLinejoin: 'round'
                              }}
                              className={`text-[12px] font-mono font-bold select-none ${
                                isLightMode ? 'fill-slate-900' : 'fill-cyan-200'
                              }`}
                            >
                              {formatMathSymbols(el.label)}
                            </text>
                          )}
                        </g>
                      );
                    }

                    case 'TEXT':
                    case 'TEXT_LABEL':
                      return (
                        <text
                          key={el.id || elIdx}
                          x={el.cx}
                          y={el.cy}
                          textAnchor="middle"
                          style={{
                            paintOrder: 'stroke fill',
                            stroke: isLightMode ? '#f8fafc' : '#020617',
                            strokeWidth: '3px',
                            strokeLinejoin: 'round'
                          }}
                          className={`text-[11px] font-mono font-bold select-none ${
                            isLightMode ? 'fill-slate-800' : 'fill-cyan-300'
                          }`}
                        >
                          {formatMathSymbols(el.label || '')}
                        </text>
                      );

                    case 'DIMENSION': {
                      const x1 = el.x1 || 0;
                      const y1 = el.y1 || 0;
                      const x2 = el.x2 || 0;
                      const y2 = el.y2 || 0;
                      const midX = (x1 + x2) / 2;
                      const midY = (y1 + y2) / 2;
                      const isVertical = Math.abs(x2 - x1) < 18;
                      const textX = isVertical ? midX - 10 : midX;
                      const textY = isVertical ? midY + 4 : midY - 8;
                      const textAnchor = isVertical ? 'end' : 'middle';

                      return (
                        <g key={el.id || elIdx} className="dimension-group">
                          {/* Dimension Line */}
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={isLightMode ? '#0284c7' : '#06b6d4'}
                            strokeWidth="1.2"
                            markerStart="url(#arrowhead-rev)"
                            markerEnd="url(#arrowhead)"
                          />
                          {/* Dimension Text with anti-collision halo */}
                          {el.dimensionText && (
                            <text
                              x={textX}
                              y={textY}
                              textAnchor={textAnchor}
                              style={{
                                paintOrder: 'stroke fill',
                                stroke: isLightMode ? '#f8fafc' : '#020617',
                                strokeWidth: '3px',
                                strokeLinejoin: 'round'
                              }}
                              className={`text-[10px] font-mono font-bold ${
                                isLightMode ? 'fill-sky-800' : 'fill-cyan-300'
                              }`}
                            >
                              {formatMathSymbols(el.dimensionText)}
                            </text>
                          )}
                        </g>
                      );
                    }

                    default:
                      return null;
                  }
                })}
              </g>
            </svg>

            {/* Drawing Guide Lines Legend Overlay */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono shadow-lg flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                <span className="text-cyan-300">4H / 2H Guide Lines (0.18–0.25mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-sky-300 rounded-full" />
                <span className="text-white">HB Finished Outline (0.70mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 rounded-full border-b border-dashed" />
                <span className="text-slate-300">Centerline (ISO Type G)</span>
              </div>
            </div>
          </div>
          
          {/* Top Plate Specification Tag */}
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold shadow-lg pointer-events-none flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>
              {figure.figureNumber || plateNumber || authenticData.figureNumber} • {textbookCitation}
            </span>
          </div>

          {/* Bottom Plate Seal */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-700 text-slate-300 text-[10px] font-mono shadow-lg pointer-events-none hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>WAEC / NERDC & ISO 128 Standard</span>
          </div>
        </div>
      </div>

      {/* 3. MATHEMATICAL PROOF & GEOMETRIC FORMULATION BANNER */}
      {mathProof && (
        <div className={`px-4 py-2.5 border-t border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLightMode ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              MATHEMATICAL PROOF:
            </span>
            <code className="font-mono text-xs font-bold text-cyan-300 tracking-wide">
              {mathProof}
            </code>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono opacity-80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standard Geometry Proved</span>
          </div>
        </div>
      )}

      {/* 4. FIGURE CAPTION & TEXTBOOK METADATA BAR */}
      <div className={`p-4 border-t space-y-2.5 ${
        isLightMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink-0">
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-bold text-slate-100">
              <span className="text-cyan-400 font-mono mr-1.5">
                {figure.figureNumber || plateNumber || authenticData.figureNumber}:
              </span>
              {figure.title}
            </h5>
            <p className="text-xs leading-relaxed mt-1 text-slate-300">
              {formatMathSymbols(figure.caption || authenticData.caption)}
            </p>
          </div>
        </div>

        {/* Drawing Guide Lines & Standards Callout */}
        <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">📐 Guide Line Specs:</span>
            <span className="text-slate-300">4H Faint (0.18mm) / 2H Construction (0.25mm)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Finished Outline:</span>
            <span className="text-slate-300">HB Continuous Thick (0.70mm, ISO 128 Type A)</span>
          </div>
        </div>

        {/* Dimensions & Specifications Pills */}
        {(figure.dimensions || authenticData.dimensions) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 mr-1">
              Specifications:
            </span>
            {(figure.dimensions || authenticData.dimensions)?.map((dim, dIdx) => (
              <span
                key={dIdx}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-cyan-300 border border-slate-700"
              >
                {formatMathSymbols(dim)}
              </span>
            ))}
          </div>
        )}

        {/* Textbook Reference Citation Stamp */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Textbook Source: <strong className="text-slate-200">{textbookCitation}</strong></span>
          </div>
          <div className="text-slate-500 text-[10px]">
            WAEC / NERDC Technical Drawing Standard Syllabus
          </div>
        </div>
      </div>
    </div>
  );

  // If fullscreen is active, render in a backdrop modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-5xl">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
};
