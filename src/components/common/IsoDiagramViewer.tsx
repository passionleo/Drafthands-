import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  DrawingTopic, 
  ConstructionElement, 
  LineWeightType 
} from '../../types/curriculum';
import { 
  IsoDiagramData, 
  getIsoDiagramForTopic, 
  ISO_STANDARDS_REFERENCE 
} from '../../data/curriculumData';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Eye, 
  EyeOff, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Compass, 
  Ruler, 
  Grid, 
  FileText, 
  ShieldCheck, 
  Info, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Sliders, 
  Settings,
  Crosshair,
  Share2
} from 'lucide-react';

export type IsoTheme = 'BLUEPRINT' | 'LIGHT_DRAFTING' | 'DARK_CAD';
export type IsoGridType = 'MILLIMETER' | 'ISOMETRIC' | 'NONE';

export interface IsoDiagramViewerProps {
  topic?: DrawingTopic;
  diagram?: IsoDiagramData;
  topicId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  viewMode?: 'MODAL' | 'EMBEDDED' | 'STANDALONE_PANEL';
  initialTheme?: IsoTheme;
}

export const IsoDiagramViewer: React.FC<IsoDiagramViewerProps> = ({
  topic,
  diagram: directDiagram,
  topicId,
  isOpen = true,
  onClose,
  className = '',
  viewMode = 'MODAL',
  initialTheme = 'BLUEPRINT'
}) => {
  // Resolve active ISO diagram
  const activeDiagram = useMemo<IsoDiagramData>(() => {
    if (directDiagram) return directDiagram;
    if (topic) return getIsoDiagramForTopic(topic);
    if (topicId) return getIsoDiagramForTopic(topicId);
    return getIsoDiagramForTopic('ss1-bisect-line');
  }, [directDiagram, topic, topicId]);

  // Viewport & Pan-Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Visual & Display state
  const [theme, setTheme] = useState<IsoTheme>(initialTheme);
  const [gridType, setGridType] = useState<IsoGridType>('MILLIMETER');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'STANDARDS' | 'DIMENSIONS' | 'PROOF' | 'LAYERS'>('STANDARDS');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Measurement & Coordinate Tool
  const [isMeasureActive, setIsMeasureActive] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [cursorCoord, setCursorCoord] = useState<{ x: number; y: number } | null>(null);

  // Layer Visibility Toggles (ISO 128 conventions)
  const [layers, setLayers] = useState({
    outlines: true,       // Type A (0.50 - 0.70mm HB)
    construction: true,   // Type B (0.25mm 2H/4H)
    centerlines: true,    // Type G (Chain thin)
    hiddenDetail: true,   // Type E (Dashed thin)
    dimensions: true,     // ISO 129
    labels: true,         // ISO 3098
    titleBlock: true      // ISO 7200
  });

  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Keyboard shortcut handlers (Escape to close, +/- to zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'MODAL' && e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoom(1.15);
      } else if (e.key === '-' || e.key === '_') {
        handleZoom(0.85);
      } else if (e.key === '0') {
        handleResetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, onClose]);

  // Coordinate tracking from mouse
  const handleSvgMouseMove = (e: React.MouseEvent<HTMLElement | SVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const viewBox = activeDiagram.viewBox || { width: 800, height: 550 };
    
    // Convert client mouse pos to SVG coordinate space taking zoom and pan into account
    const scaleX = viewBox.width / (rect.width * zoom);
    const scaleY = viewBox.height / (rect.height * zoom);
    const mouseX = (e.clientX - rect.left - pan.x) * scaleX;
    const mouseY = (e.clientY - rect.top - pan.y) * scaleY;

    setCursorCoord({
      x: Math.round(mouseX * 10) / 10,
      y: Math.round(mouseY * 10) / 10
    });

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isMeasureActive) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    } else if (isMeasureActive && cursorCoord) {
      if (measurePoints.length >= 2) {
        setMeasurePoints([[cursorCoord.x, cursorCoord.y]]);
      } else {
        setMeasurePoints(prev => [...prev, [cursorCoord.x, cursorCoord.y]]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    handleZoom(factor);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => {
      const next = Math.min(Math.max(prev * factor, 0.4), 4.5);
      return Math.round(next * 100) / 100;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setMeasurePoints([]);
  };

  const handleFitView = () => {
    setZoom(1.05);
    setPan({ x: 0, y: 0 });
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(message);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgSource = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDiagram.moduleCode}_${activeDiagram.title.replace(/\s+/g, '_')}_ISO_Blueprint.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    copyToClipboard('', 'SVG Downloaded Successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  // Measured distance and angle calculation
  const measurementResult = useMemo(() => {
    if (measurePoints.length < 2) return null;
    const [p1, p2] = measurePoints;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angle = (Math.atan2(-dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return {
      distance: Math.round(distance * 10) / 10,
      angle: Math.round(angle * 10) / 10,
      dx: Math.round(dx * 10) / 10,
      dy: Math.round(dy * 10) / 10
    };
  }, [measurePoints]);

  // Color schemes for blueprint, drafting paper, and CAD
  const themeStyles = {
    BLUEPRINT: {
      bg: 'bg-[#09182d]',
      svgBg: '#0b1e36',
      gridColor: 'rgba(56, 189, 248, 0.12)',
      majorGridColor: 'rgba(56, 189, 248, 0.25)',
      text: 'text-sky-100',
      outline: '#ffffff',
      construction: 'rgba(56, 189, 248, 0.55)',
      centerline: '#38bdf8',
      hidden: '#f43f5e',
      dimension: '#38bdf8',
      point: '#38bdf8',
      titleBlockBg: '#071526',
      titleBlockBorder: '#1e3a5f'
    },
    LIGHT_DRAFTING: {
      bg: 'bg-[#f8fafc]',
      svgBg: '#ffffff',
      gridColor: 'rgba(148, 163, 184, 0.18)',
      majorGridColor: 'rgba(100, 116, 139, 0.35)',
      text: 'text-slate-900',
      outline: '#0f172a',
      construction: 'rgba(100, 116, 139, 0.75)',
      centerline: '#0284c7',
      hidden: '#e11d48',
      dimension: '#0369a1',
      point: '#0f172a',
      titleBlockBg: '#f1f5f9',
      titleBlockBorder: '#cbd5e1'
    },
    DARK_CAD: {
      bg: 'bg-[#090d16]',
      svgBg: '#0d131f',
      gridColor: 'rgba(16, 185, 129, 0.12)',
      majorGridColor: 'rgba(16, 185, 129, 0.28)',
      text: 'text-emerald-50',
      outline: '#10b981',
      construction: 'rgba(52, 211, 153, 0.45)',
      centerline: '#06b6d4',
      hidden: '#f59e0b',
      dimension: '#34d399',
      point: '#10b981',
      titleBlockBg: '#080b12',
      titleBlockBorder: '#064e3b'
    }
  }[theme];

  if (viewMode === 'MODAL' && !isOpen) return null;

  const viewBox = activeDiagram.viewBox || { width: 800, height: 550 };

  return (
    <div 
      className={`flex flex-col select-none overflow-hidden ${
        viewMode === 'MODAL'
          ? 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md'
          : 'w-full h-full rounded-2xl border border-slate-800'
      } ${className}`}
    >
      <div 
        className={`w-full flex flex-col shadow-2xl transition-all duration-200 border border-slate-800 ${
          themeStyles.bg
        } ${
          viewMode === 'MODAL' 
            ? isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-7xl max-h-[94vh] rounded-2xl'
            : 'h-full rounded-2xl'
        }`}
      >
        {/* ================================================================= */}
        {/* 1. TOP TECHNICAL CONTROL BAR                                      */}
        {/* ================================================================= */}
        <div className="p-3 sm:px-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeDiagram.moduleCode}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {activeDiagram.standard}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                  Scale {activeDiagram.scale}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                {activeDiagram.title}
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setTheme('BLUEPRINT')}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                  theme === 'BLUEPRINT' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="ISO Blue Drawing Sheet"
              >
                Blueprint
              </button>
              <button
                onClick={() => setTheme('LIGHT_DRAFTING')}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                  theme === 'LIGHT_DRAFTING' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="White Technical Drafting Linen"
              >
                Paper
              </button>
              <button
                onClick={() => setTheme('DARK_CAD')}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                  theme === 'DARK_CAD' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="CAD Engineering Terminal"
              >
                CAD
              </button>
            </div>

            {/* Grid Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setGridType(g => g === 'MILLIMETER' ? 'ISOMETRIC' : g === 'ISOMETRIC' ? 'NONE' : 'MILLIMETER')}
                className="px-2 py-1 flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-white"
                title="Toggle ISO Engineering Grid"
              >
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{gridType === 'NONE' ? 'No Grid' : gridType}</span>
              </button>
            </div>

            {/* Measurement Tool Toggle */}
            <button
              onClick={() => {
                setIsMeasureActive(prev => !prev);
                setMeasurePoints([]);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                isMeasureActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Measure Distance & Angle Tool"
            >
              <Ruler className="w-4 h-4" />
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => handleZoom(0.85)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono px-1.5 text-cyan-300 min-w-[42px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(1.15)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1 text-slate-400 hover:text-white transition-colors border-l border-slate-800 ml-0.5"
                title="Reset View (0)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export & Print */}
            <button
              onClick={handleExportSvg}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
              title="Download Vector SVG"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
              title="Print Engineering Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Inspector Drawer Toggle */}
            <button
              onClick={() => setIsInspectorOpen(prev => !prev)}
              className={`p-1.5 rounded-lg border transition-all ${
                isInspectorOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Standards & Dimensions Inspector"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            {viewMode === 'MODAL' && (
              <button
                onClick={() => setIsFullscreen(prev => !prev)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            {/* Close Modal */}
            {viewMode === 'MODAL' && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                title="Close Viewer (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MAIN WORKING CANVAS + INSPECTOR SIDEBAR                        */}
        {/* ================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Main SVG Vector Canvas Viewport */}
          <div 
            ref={svgContainerRef}
            className={`flex-1 relative overflow-hidden flex items-center justify-center ${
              isDragging ? 'cursor-grabbing' : isMeasureActive ? 'cursor-crosshair' : 'cursor-grab'
            }`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Real-time Coordinate & Measurement HUD */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
              <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  X: {cursorCoord ? cursorCoord.x.toFixed(1) : '0.0'}mm | Y: {cursorCoord ? cursorCoord.y.toFixed(1) : '0.0'}mm
                </span>
              </div>

              {isMeasureActive && (
                <div className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 backdrop-blur border border-amber-500/60 text-[11px] font-mono text-amber-200 shadow-xl">
                  <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>PRECISION MEASUREMENT</span>
                  </div>
                  {measurePoints.length === 0 && <span>Click first point on diagram...</span>}
                  {measurePoints.length === 1 && <span>Click second point to measure span...</span>}
                  {measurementResult && (
                    <div className="space-y-0.5 text-xs text-amber-100">
                      <div>Distance: <strong className="text-white">{measurementResult.distance} mm</strong></div>
                      <div>Angle: <strong className="text-white">{measurementResult.angle}°</strong> (ΔX: {measurementResult.dx}, ΔY: {measurementResult.dy})</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Layer Visibility Chips (Top Right overlay) */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/85 backdrop-blur px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 shadow-lg">
              <button
                onClick={() => setLayers(l => ({ ...l, outlines: !l.outlines }))}
                className={`px-1.5 py-0.5 rounded transition-colors ${layers.outlines ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-500'}`}
                title="Toggle HB Outlines (ISO 128 Type A)"
              >
                Outline
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, construction: !l.construction }))}
                className={`px-1.5 py-0.5 rounded transition-colors ${layers.construction ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-500'}`}
                title="Toggle 2H/4H Construction Arcs (ISO 128 Type B)"
              >
                Arcs
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, centerlines: !l.centerlines }))}
                className={`px-1.5 py-0.5 rounded transition-colors ${layers.centerlines ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-500'}`}
                title="Toggle Center Lines (ISO 128 Type G)"
              >
                Center
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, dimensions: !l.dimensions }))}
                className={`px-1.5 py-0.5 rounded transition-colors ${layers.dimensions ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-500'}`}
                title="Toggle Dimensions (ISO 129)"
              >
                Dim
              </button>
            </div>

            {/* SVG Engineering Plate Canvas */}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
              className="w-full h-full max-h-[80vh] transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                backgroundColor: themeStyles.svgBg
              }}
            >
              <defs>
                {/* Millimeter Grid Pattern */}
                <pattern id="iso-grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke={themeStyles.gridColor} strokeWidth="0.5" />
                </pattern>
                <pattern id="iso-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#iso-grid-fine)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke={themeStyles.majorGridColor} strokeWidth="1.2" />
                </pattern>

                {/* Isometric Grid Pattern */}
                <pattern id="iso-grid-isometric" width="60" height="103.923" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 60 103.923 M 60 0 L 0 103.923 M 0 51.961 L 60 51.961" fill="none" stroke={themeStyles.gridColor} strokeWidth="0.6" />
                </pattern>

                {/* ISO 129 Arrowheads */}
                <marker id="iso-arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 10 2 L 0 5 L 10 8 z" fill={themeStyles.dimension} />
                </marker>
                <marker id="iso-arrow-end" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 2 L 10 5 L 0 8 z" fill={themeStyles.dimension} />
                </marker>
                <marker id="measure-point-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
                  <circle cx="5" cy="5" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Grid Background */}
              {gridType === 'MILLIMETER' && (
                <rect width={viewBox.width} height={viewBox.height} fill="url(#iso-grid-major)" />
              )}
              {gridType === 'ISOMETRIC' && (
                <rect width={viewBox.width} height={viewBox.height} fill="url(#iso-grid-isometric)" />
              )}

              {/* Drawing Border (ISO A4 / A3 standard margin) */}
              <rect 
                x="15" 
                y="15" 
                width={viewBox.width - 30} 
                height={viewBox.height - 30} 
                fill="none" 
                stroke={themeStyles.outline} 
                strokeWidth="1.5" 
              />
              <rect 
                x="20" 
                y="20" 
                width={viewBox.width - 40} 
                height={viewBox.height - 40} 
                fill="none" 
                stroke={themeStyles.construction} 
                strokeWidth="0.6" 
              />

              {/* ------------------------------------------------------------- */}
              {/* RENDER DYNAMIC ISO GEOMETRIC ELEMENTS                         */}
              {/* ------------------------------------------------------------- */}
              <g id="iso-drawing-geometry">
                {activeDiagram.elements.map((elem, idx) => {
                  // Check layer visibility
                  const isOutline = elem.lineWeight === 'OUTLINE_HB' || elem.lineWeight === 'THICK_CONTINUOUS';
                  const isConstruction = elem.lineWeight === 'CONSTRUCTION_2H' || elem.lineWeight === 'CONSTRUCTION_4H' || elem.lineWeight === 'THIN_CONTINUOUS';
                  const isCenter = elem.lineWeight === 'CENTER_LINE' || elem.lineWeight === 'THIN_CHAIN';
                  const isHidden = elem.lineWeight === 'HIDDEN_DETAIL' || elem.lineWeight === 'THIN_DASHED';
                  const isDim = elem.type === 'DIMENSION' || elem.lineWeight === 'DIMENSION_LINE';
                  const isLabel = elem.type === 'TEXT_LABEL' || elem.type === 'TEXT';

                  if (isOutline && !layers.outlines) return null;
                  if (isConstruction && !layers.construction) return null;
                  if (isCenter && !layers.centerlines) return null;
                  if (isHidden && !layers.hiddenDetail) return null;
                  if (isDim && !layers.dimensions) return null;
                  if (isLabel && !layers.labels) return null;

                  // Determine stroke styles according to ISO 128
                  let stroke = themeStyles.construction;
                  let strokeWidth = 1.0;
                  let strokeDasharray = 'none';

                  if (isOutline) {
                    stroke = themeStyles.outline;
                    strokeWidth = 2.4; // 0.70mm HB
                  } else if (isCenter) {
                    stroke = themeStyles.centerline;
                    strokeWidth = 1.2; // 0.25mm Chain thin
                    strokeDasharray = '18, 4, 3, 4';
                  } else if (isHidden) {
                    stroke = themeStyles.hidden;
                    strokeWidth = 1.2; // 0.25mm Dashed thin
                    strokeDasharray = '6, 4';
                  } else if (isDim) {
                    stroke = themeStyles.dimension;
                    strokeWidth = 1.0;
                  }

                  switch (elem.type) {
                    case 'LINE':
                    case 'SEGMENT':
                      return (
                        <line
                          key={elem.id || idx}
                          x1={elem.x1 ?? 0}
                          y1={elem.y1 ?? 0}
                          x2={elem.x2 ?? 0}
                          y2={elem.y2 ?? 0}
                          stroke={elem.color || stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                        />
                      );

                    case 'CIRCLE':
                      return (
                        <circle
                          key={elem.id || idx}
                          cx={elem.cx ?? 0}
                          cy={elem.cy ?? 0}
                          r={elem.r ?? 10}
                          fill="none"
                          stroke={elem.color || stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                        />
                      );

                    case 'ARC': {
                      const cx = elem.cx ?? 0;
                      const cy = elem.cy ?? 0;
                      const r = elem.r ?? 10;
                      const startAngle = (elem.startAngle ?? 0) * (Math.PI / 180);
                      const endAngle = (elem.endAngle ?? 180) * (Math.PI / 180);
                      const x1 = cx + r * Math.cos(startAngle);
                      const y1 = cy + r * Math.sin(startAngle);
                      const x2 = cx + r * Math.cos(endAngle);
                      const y2 = cy + r * Math.sin(endAngle);
                      const angleDiff = ((elem.endAngle ?? 180) - (elem.startAngle ?? 0) + 360) % 360;
                      const largeArc = angleDiff > 180 ? 1 : 0;
                      const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
                      return (
                        <path
                          key={elem.id || idx}
                          d={d}
                          fill="none"
                          stroke={elem.color || stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                        />
                      );
                    }

                    case 'RECTANGLE':
                      return (
                        <rect
                          key={elem.id || idx}
                          x={elem.x ?? 0}
                          y={elem.y ?? 0}
                          width={elem.width ?? 0}
                          height={elem.height ?? 0}
                          fill="none"
                          stroke={elem.color || stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                        />
                      );

                    case 'POINT':
                      return (
                        <g key={elem.id || idx}>
                          <circle
                            cx={elem.cx ?? 0}
                            cy={elem.cy ?? 0}
                            r={3}
                            fill={elem.color || themeStyles.point}
                          />
                          {elem.label && layers.labels && (
                            <text
                              x={(elem.cx ?? 0) + (elem.labelPosition === 'bottom' ? 0 : elem.labelPosition === 'top' ? 0 : 8)}
                              y={(elem.cy ?? 0) + (elem.labelPosition === 'bottom' ? 14 : elem.labelPosition === 'top' ? -8 : 4)}
                              textAnchor={elem.labelPosition === 'bottom' || elem.labelPosition === 'top' ? 'middle' : 'start'}
                              fill={themeStyles.outline}
                              fontSize="11"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {elem.label}
                            </text>
                          )}
                        </g>
                      );

                    case 'DIMENSION':
                      return (
                        <g key={elem.id || idx}>
                          <line
                            x1={elem.x1 ?? 0}
                            y1={elem.y1 ?? 0}
                            x2={elem.x2 ?? 0}
                            y2={elem.y2 ?? 0}
                            stroke={themeStyles.dimension}
                            strokeWidth="1.2"
                            markerStart="url(#iso-arrow-start)"
                            markerEnd="url(#iso-arrow-end)"
                          />
                          {elem.dimensionText && (
                            <text
                              x={((elem.x1 ?? 0) + (elem.x2 ?? 0)) / 2}
                              y={((elem.y1 ?? 0) + (elem.y2 ?? 0)) / 2 - 6}
                              textAnchor="middle"
                              fill={themeStyles.dimension}
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                              className="bg-slate-950/80 px-1"
                            >
                              {elem.dimensionText}
                            </text>
                          )}
                        </g>
                      );

                    case 'TEXT_LABEL':
                    case 'TEXT':
                      return (
                        <text
                          key={elem.id || idx}
                          x={elem.cx ?? elem.x ?? 0}
                          y={elem.cy ?? elem.y ?? 0}
                          fill={elem.color || themeStyles.outline}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor={elem.labelPosition === 'center' ? 'middle' : 'start'}
                        >
                          {elem.label || elem.dimensionText}
                        </text>
                      );

                    default:
                      return null;
                  }
                })}
              </g>

              {/* Measurement Tool Rendered Overlays */}
              {measurePoints.map((pt, i) => (
                <circle
                  key={`m-pt-${i}`}
                  cx={pt[0]}
                  cy={pt[1]}
                  r={5}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}

              {measurePoints.length === 2 && (
                <g id="measurement-overlay">
                  <line
                    x1={measurePoints[0][0]}
                    y1={measurePoints[0][1]}
                    x2={measurePoints[1][0]}
                    y2={measurePoints[1][1]}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4, 4"
                  />
                  <text
                    x={(measurePoints[0][0] + measurePoints[1][0]) / 2}
                    y={(measurePoints[0][1] + measurePoints[1][1]) / 2 - 8}
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {measurementResult?.distance}mm ({measurementResult?.angle}°)
                  </text>
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* OFFICIAL ISO 7200 TITLE BLOCK (Bottom Right)                 */}
              {/* ------------------------------------------------------------- */}
              {layers.titleBlock && (
                <g 
                  id="iso-7200-title-block" 
                  transform={`translate(${viewBox.width - 320}, ${viewBox.height - 110})`}
                >
                  <rect 
                    width="300" 
                    height="90" 
                    fill={themeStyles.titleBlockBg} 
                    stroke={themeStyles.titleBlockBorder} 
                    strokeWidth="1.5" 
                  />
                  {/* Grid Lines in Title Block */}
                  <line x1="0" y1="28" x2="300" y2="28" stroke={themeStyles.titleBlockBorder} strokeWidth="1" />
                  <line x1="0" y1="58" x2="300" y2="58" stroke={themeStyles.titleBlockBorder} strokeWidth="1" />
                  <line x1="190" y1="28" x2="190" y2="90" stroke={themeStyles.titleBlockBorder} strokeWidth="1" />
                  
                  {/* Academy / Legal Owner */}
                  <text x="10" y="18" fill={themeStyles.outline} fontSize="10" fontFamily="monospace" fontWeight="bold">
                    DRAFTHANDS ACADEMY • TECHNICAL GRAPHICS
                  </text>

                  {/* Title & Module Code */}
                  <text x="10" y="42" fill={themeStyles.outline} fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {activeDiagram.moduleCode}
                  </text>
                  <text x="10" y="52" fill={themeStyles.construction} fontSize="8.5" fontFamily="monospace">
                    {activeDiagram.title.slice(0, 32)}
                  </text>

                  {/* ISO Standard Reference */}
                  <text x="10" y="72" fill={themeStyles.construction} fontSize="8.5" fontFamily="monospace">
                    STANDARD: {activeDiagram.standard}
                  </text>
                  <text x="10" y="83" fill={themeStyles.construction} fontSize="8" fontFamily="monospace">
                    TOLERANCE: {activeDiagram.tolerance}
                  </text>

                  {/* Projection Symbol & Scale */}
                  <text x="200" y="42" fill={themeStyles.outline} fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                    SCALE {activeDiagram.scale}
                  </text>
                  <text x="200" y="52" fill={themeStyles.construction} fontSize="8" fontFamily="monospace">
                    FORMAT: {activeDiagram.sheetFormat}
                  </text>

                  {/* First Angle or Third Angle Graphic Icon */}
                  <g transform="translate(205, 62)">
                    {activeDiagram.projectionMethod === 'THIRD_ANGLE' ? (
                      // Third Angle Graphic Projection Symbol
                      <g>
                        <circle cx="10" cy="12" r="5" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <circle cx="10" cy="12" r="9" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <polygon points="28,3 48,7 48,17 28,21" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <text x="56" y="15" fill={themeStyles.construction} fontSize="7" fontFamily="monospace">3rd Angle</text>
                      </g>
                    ) : (
                      // First Angle Graphic Projection Symbol (Default African/European ISO)
                      <g>
                        <polygon points="0,7 20,3 20,21 0,17" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <circle cx="34" cy="12" r="5" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <circle cx="34" cy="12" r="9" fill="none" stroke={themeStyles.outline} strokeWidth="0.8" />
                        <text x="50" y="15" fill={themeStyles.construction} fontSize="7" fontFamily="monospace">1st Angle</text>
                      </g>
                    )}
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* =============================================================== */}
          {/* 3. COLLAPSIBLE TECHNICAL INSPECTOR DRAWER                       */}
          {/* =============================================================== */}
          {isInspectorOpen && (
            <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col shrink-0 text-slate-200 overflow-hidden">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-slate-950/70 p-1 text-xs">
                <button
                  onClick={() => setActiveTab('STANDARDS')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] transition-colors ${
                    activeTab === 'STANDARDS' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ISO Rules
                </button>
                <button
                  onClick={() => setActiveTab('DIMENSIONS')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] transition-colors ${
                    activeTab === 'DIMENSIONS' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dimensions
                </button>
                <button
                  onClick={() => setActiveTab('PROOF')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] transition-colors ${
                    activeTab === 'PROOF' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Proof
                </button>
                <button
                  onClick={() => setActiveTab('LAYERS')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] transition-colors ${
                    activeTab === 'LAYERS' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Layers
                </button>
              </div>

              {/* Tab Content Panel */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
                
                {/* TAB 1: ISO RULES & STANDARDS */}
                {activeTab === 'STANDARDS' && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                        Specification & Standard
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight">
                        {activeDiagram.standardTitle}
                      </h4>
                      <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                        {activeDiagram.overview}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">
                        ISO 128 Line Weight Recommendations
                      </span>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Continuous Thick (Type A)</span>
                          <span className="text-cyan-400 font-bold">0.50mm / HB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Continuous Thin (Type B)</span>
                          <span className="text-cyan-400 font-bold">0.25mm / 2H</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Chain Thin (Type G)</span>
                          <span className="text-cyan-400 font-bold">0.25mm / 2H</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Dashed Thin (Type E)</span>
                          <span className="text-cyan-400 font-bold">0.25mm / 2H</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        Mandatory Compliance Guidelines
                      </span>
                      <ul className="space-y-2 text-[11px] text-slate-300">
                        {activeDiagram.isoGuidelines.map((g, i) => (
                          <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200">
                      <strong className="block text-[10px] uppercase font-mono text-cyan-300 font-bold mb-1">
                        WAEC Exam Application
                      </strong>
                      <span>{activeDiagram.waecExamRelevance}</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: DIMENSION SCHEDULE */}
                {activeTab === 'DIMENSIONS' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                        Geometric Tolerances & Spans
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Units: mm
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeDiagram.dimensions.map((dim, idx) => (
                        <div 
                          key={idx} 
                          className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[11px] font-medium text-slate-200 block">
                              {dim.label}
                            </span>
                            {dim.tolerance && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Tolerance: {dim.tolerance}
                              </span>
                            )}
                          </div>
                          <span className="px-2 py-1 rounded bg-slate-850 border border-cyan-500/30 font-mono font-bold text-cyan-300 text-xs">
                            {dim.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      <Info className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
                      All dimension annotations follow <strong>ISO 129-1:2018</strong> standards. Numerical values are aligned parallel to dimension lines or placed readable from the bottom edge of the sheet.
                    </div>
                  </div>
                )}

                {/* TAB 3: MATHEMATICAL PROOF */}
                {activeTab === 'PROOF' && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                        Theoretical Verification
                      </span>
                      <h4 className="font-bold text-white text-sm">
                        Euclidean Geometric Derivation
                      </h4>
                    </div>

                    {activeDiagram.mathematicalProof && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-xs text-cyan-200">
                        <span className="block text-[9px] uppercase tracking-wider text-cyan-400 mb-1">Formula & Condition:</span>
                        {activeDiagram.mathematicalProof}
                      </div>
                    )}

                    {activeDiagram.keyPrinciples && activeDiagram.keyPrinciples.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                          Core Principles
                        </span>
                        <div className="space-y-1.5">
                          {activeDiagram.keyPrinciples.map((p, i) => (
                            <div key={i} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-300">
                              • {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: LAYERS */}
                {activeTab === 'LAYERS' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                      ISO 128 CAD Layer Filters
                    </span>
                    <div className="space-y-2 font-mono text-xs">
                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-white" />
                          <span>Outlines (0.7mm HB)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.outlines}
                          onChange={e => setLayers(l => ({ ...l, outlines: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-sky-400/60" />
                          <span>Construction (0.25mm 2H)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.construction}
                          onChange={e => setLayers(l => ({ ...l, construction: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-cyan-400" />
                          <span>Centerlines (Chain Thin)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.centerlines}
                          onChange={e => setLayers(l => ({ ...l, centerlines: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-rose-400" />
                          <span>Hidden Detail (Dashed)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.hiddenDetail}
                          onChange={e => setLayers(l => ({ ...l, hiddenDetail: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-sky-300" />
                          <span>Dimensions (ISO 129)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.dimensions}
                          onChange={e => setLayers(l => ({ ...l, dimensions: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-amber-400" />
                          <span>ISO 7200 Title Block</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={layers.titleBlock}
                          onChange={e => setLayers(l => ({ ...l, titleBlock: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Reference Stamp */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ISO 128 / WAEC Verified
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(activeDiagram.dimensions, null, 2), 'Dimensions copied!')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Spec</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {copiedToast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-xl bg-cyan-600 text-white font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-150">
            <Check className="w-4 h-4" />
            <span>{copiedToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
