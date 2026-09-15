import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Tv, 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Sparkles, 
  Zap, 
  Eye, 
  PenTool, 
  Highlighter, 
  Sun, 
  Moon, 
  Grid, 
  Volume2, 
  VolumeX, 
  Compass, 
  ChevronRight,
  ChevronLeft,
  Lock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { DrawingTopic, StepDefinition } from '../../types/curriculum';
import { InstrumentsOverlay } from '../drafting/InstrumentsOverlay';
import { useSubscription } from '../../context/SubscriptionContext';

interface LiveProjectionModeProps {
  isOpen: boolean;
  onClose: () => void;
  topic: DrawingTopic;
  currentStepIndex: number;
  onStepChange: (stepIndex: number) => void;
  parameters: Record<string, number>;
}

export type ProjectionTheme = 'BLACKBOARD' | 'CHALKBOARD_GREEN' | 'DAYLIGHT_WHITE' | 'HIGH_LUMINANCE';

export const LiveProjectionMode: React.FC<LiveProjectionModeProps> = ({
  isOpen,
  onClose,
  topic,
  currentStepIndex,
  onStepChange,
  parameters
}) => {
  const { isSubscribed, openPaywall } = useSubscription();

  // Projection display settings
  const [theme, setTheme] = useState<ProjectionTheme>('BLACKBOARD');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1x, 2x
  const [showInstruments, setShowInstruments] = useState<boolean>(true);
  const [spotlightActive, setSpotlightActive] = useState<boolean>(false);
  const [laserPointerActive, setLaserPointerActive] = useState<boolean>(true);
  const [laserColor, setLaserColor] = useState<'red' | 'green'>('red');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [annotationTool, setAnnotationTool] = useState<'none' | 'pen' | 'highlighter'>('none');

  // Laser pointer position state
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [laserTrail, setLaserTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  // Freehand annotation strokes
  const [annotations, setAnnotations] = useState<{ path: string; color: string; width: number }[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const isDrawingAnnotationRef = useRef<boolean>(false);

  // Generate steps
  const steps = useMemo<StepDefinition[]>(() => {
    return topic.generateSteps(parameters);
  }, [topic, parameters]);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex - 1] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      const delayMs = (4000 / playbackSpeed);
      interval = setInterval(() => {
        onStepChange(currentStepIndex < totalSteps ? currentStepIndex + 1 : 1);
      }, delayMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, onStepChange]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Laser Pointer & Annotation pointer tracking
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 800;
    const svgY = ((e.clientY - rect.top) / rect.height) * 600;

    if (laserPointerActive) {
      setLaserPos({ x: svgX, y: svgY });
      setLaserTrail((prev) => [
        ...prev.slice(-6),
        { x: svgX, y: svgY, id: Date.now() + Math.random() }
      ]);
    }

    if (isDrawingAnnotationRef.current && annotationTool !== 'none') {
      setCurrentStroke((prev) => [...prev, { x: svgX, y: svgY }]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (annotationTool !== 'none') {
      isDrawingAnnotationRef.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * 800;
      const svgY = ((e.clientY - rect.top) / rect.height) * 600;
      setCurrentStroke([{ x: svgX, y: svgY }]);
    }
  };

  const handlePointerUp = () => {
    if (isDrawingAnnotationRef.current && currentStroke.length > 1) {
      const d = currentStroke.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');
      setAnnotations((prev) => [
        ...prev,
        {
          path: d,
          color: annotationTool === 'highlighter' ? 'rgba(250, 204, 21, 0.45)' : 'rgba(239, 68, 68, 0.9)',
          width: annotationTool === 'highlighter' ? 14 : 3
        }
      ]);
    }
    isDrawingAnnotationRef.current = false;
    setCurrentStroke([]);
  };

  if (!isOpen) return null;

  // Theme styling configurations
  const themeConfig = {
    BLACKBOARD: {
      bgClass: 'bg-[#030712]',
      svgBg: '#030712',
      gridColor: '#1e293b',
      thickLine: '#38bdf8', // bright cyan
      thinLine: '#64748b',
      textClass: 'text-cyan-300',
      label: 'Digital Darkboard'
    },
    CHALKBOARD_GREEN: {
      bgClass: 'bg-[#064e3b]',
      svgBg: '#064e3b',
      gridColor: '#047857',
      thickLine: '#fef08a', // bright yellow chalk
      thinLine: '#6ee7b7',
      textClass: 'text-emerald-200',
      label: 'Emerald Chalkboard'
    },
    DAYLIGHT_WHITE: {
      bgClass: 'bg-slate-100',
      svgBg: '#ffffff',
      gridColor: '#e2e8f0',
      thickLine: '#0f172a', // dense black
      thinLine: '#94a3b8',
      textClass: 'text-slate-800',
      label: 'Daylight Whiteboard'
    },
    HIGH_LUMINANCE: {
      bgClass: 'bg-white',
      svgBg: '#ffffff',
      gridColor: '#cbd5e1',
      thickLine: '#000000',
      thinLine: '#64748b',
      textClass: 'text-black font-black',
      label: 'High-Lumen Projector'
    }
  }[theme];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Projector Header Bar */}
      <div className="h-16 px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/30">
            <Tv className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Teacher Live-Class Projection Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PRO SMART BOARD MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {topic.title} • Module {topic.moduleCode} ({topic.tier})
            </p>
          </div>
        </div>

        {/* Theme & Display Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['BLACKBOARD', 'CHALKBOARD_GREEN', 'DAYLIGHT_WHITE', 'HIGH_LUMINANCE'] as ProjectionTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  theme === t ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'BLACKBOARD' ? 'Dark' : t === 'CHALKBOARD_GREEN' ? 'Green' : t === 'DAYLIGHT_WHITE' ? 'Daylight' : 'High-Lumen'}
              </button>
            ))}
          </div>

          {/* Laser Pointer Switch */}
          <button
            onClick={() => setLaserPointerActive(!laserPointerActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              laserPointerActive
                ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-md shadow-red-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Laser Pointer Simulation (Red/Green glowing dot tracking)"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Laser {laserPointerActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Spotlight Mode Switch */}
          <button
            onClick={() => setSpotlightActive(!spotlightActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              spotlightActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Spotlight: Focus attention on active construction step"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Spotlight</span>
          </button>

          {/* Annotation Pen */}
          <button
            onClick={() => setAnnotationTool(annotationTool === 'pen' ? 'none' : 'pen')}
            className={`p-2 rounded-xl border transition-colors ${
              annotationTool === 'pen'
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Redline Markup Pen"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Highlighter */}
          <button
            onClick={() => setAnnotationTool(annotationTool === 'highlighter' ? 'none' : 'highlighter')}
            className={`p-2 rounded-xl border transition-colors ${
              annotationTool === 'highlighter'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Yellow Focus Highlighter"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          {/* Clear Annotations */}
          {annotations.length > 0 && (
            <button
              onClick={() => setAnnotations([])}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/40 border border-red-800 rounded-lg"
            >
              Clear Marks
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Fullscreen Smart Board View"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close projection mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Projection Stage */}
      <div className={`flex-1 relative flex items-center justify-center overflow-hidden ${themeConfig.bgClass}`}>
        
        {/* Step Banner Overlay (Top of Stage) */}
        <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-950/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/80 shadow-2xl max-w-2xl pointer-events-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-950">
                STEP {currentStep.stepIndex} OF {totalSteps}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{currentStep.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.instruction}</p>
          </div>

          {/* Standards & Instrument Badge */}
          <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 text-right pointer-events-auto hidden md:block">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">{topic.standards.nerdcRef}</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{topic.standards.isoRef}</span>
          </div>
        </div>

        {/* SVG Drawing Area */}
        <div className="w-full h-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full rounded-2xl shadow-2xl transition-all cursor-crosshair"
            style={{ backgroundColor: themeConfig.svgBg }}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <defs>
              {/* Engineering Grid */}
              <pattern id="proj-grid-10" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={themeConfig.gridColor} strokeWidth="0.5" opacity="0.4" />
              </pattern>
              <pattern id="proj-grid-50" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#proj-grid-10)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke={themeConfig.gridColor} strokeWidth="1.2" opacity="0.8" />
              </pattern>
              {/* Arrowhead marker */}
              <marker id="proj-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={themeConfig.thickLine} />
              </marker>
            </defs>

            {/* Background Grid */}
            {showGrid && <rect width="800" height="600" fill="url(#proj-grid-50)" />}

            {/* Render Accumulated Geometric Elements up to Current Step */}
            {steps.slice(0, currentStepIndex).flatMap((s, sIdx) =>
              s.elements.map((el) => {
                const isCurrent = sIdx === currentStepIndex - 1;
                const strokeColor = el.lineWeight === 'THICK_CONTINUOUS'
                  ? themeConfig.thickLine
                  : el.lineWeight === 'THIN_CHAIN'
                  ? '#38bdf8'
                  : themeConfig.thinLine;

                const strokeWidth = el.lineWeight === 'THICK_CONTINUOUS' ? 3.2 : 1.5;
                const dashArray = el.lineWeight === 'THIN_CHAIN'
                  ? '14, 3, 3, 3'
                  : el.lineWeight === 'THIN_DASHED'
                  ? '6, 3'
                  : undefined;

                if (el.type === 'SEGMENT') {
                  return (
                    <g key={el.id}>
                      <line
                        x1={el.x1}
                        y1={el.y1}
                        x2={el.x2}
                        y2={el.y2}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={dashArray}
                        strokeLinecap="round"
                      />
                    </g>
                  );
                }

                if (el.type === 'ARC') {
                  const startRad = (el.startAngle * Math.PI) / 180;
                  const endRad = (el.endAngle * Math.PI) / 180;
                  const x1 = el.cx + el.r * Math.cos(startRad);
                  const y1 = el.cy + el.r * Math.sin(startRad);
                  const x2 = el.cx + el.r * Math.cos(endRad);
                  const y2 = el.cy + el.r * Math.sin(endRad);
                  const largeArcFlag = Math.abs(el.endAngle - el.startAngle) > 180 ? 1 : 0;

                  if (Math.abs(el.endAngle - el.startAngle) >= 359.9) {
                    return (
                      <circle
                        key={el.id}
                        cx={el.cx}
                        cy={el.cy}
                        r={el.r}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={dashArray}
                      />
                    );
                  }

                  return (
                    <path
                      key={el.id}
                      d={`M ${x1} ${y1} A ${el.r} ${el.r} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArray}
                      strokeLinecap="round"
                    />
                  );
                }

                if (el.type === 'POINT') {
                  return (
                    <g key={el.id}>
                      <circle cx={el.cx} cy={el.cy} r={4.5} fill={themeConfig.thickLine} />
                      {el.label && (
                        <text
                          x={el.cx + 8}
                          y={el.cy - 8}
                          fill={themeConfig.thickLine}
                          fontSize="15"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {el.label}
                        </text>
                      )}
                    </g>
                  );
                }

                if (el.type === 'DIMENSION') {
                  return (
                    <g key={el.id}>
                      <line
                        x1={el.x1}
                        y1={el.y1}
                        x2={el.x2}
                        y2={el.y2}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        markerStart="url(#proj-arrow)"
                        markerEnd="url(#proj-arrow)"
                      />
                      <text
                        x={(el.x1 + el.x2) / 2}
                        y={(el.y1 + el.y2) / 2 - 8}
                        fill={themeConfig.thickLine}
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {el.dimensionText}
                      </text>
                    </g>
                  );
                }

                if (el.type === 'TEXT_LABEL') {
                  return (
                    <text
                      key={el.id}
                      x={el.cx}
                      y={el.cy}
                      fill={themeConfig.thickLine}
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {el.label}
                    </text>
                  );
                }

                return null;
              })
            )}

            {/* Virtual Instrument Animation Overlay */}
            {showInstruments && currentStep.activeInstrument && (
              <InstrumentsOverlay
                instrument={currentStep.activeInstrument}
                scale={1}
              />
            )}

            {/* Freehand Live Annotations */}
            {annotations.map((ann, i) => (
              <path
                key={i}
                d={ann.path}
                fill="none"
                stroke={ann.color}
                strokeWidth={ann.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Active Drawing Stroke */}
            {currentStroke.length > 1 && (
              <path
                d={currentStroke.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')}
                fill="none"
                stroke={annotationTool === 'highlighter' ? 'rgba(250, 204, 21, 0.45)' : 'rgba(239, 68, 68, 0.9)'}
                strokeWidth={annotationTool === 'highlighter' ? 14 : 3}
                strokeLinecap="round"
              />
            )}

            {/* Laser Pointer Simulation Glowing Dot & Fading Trail */}
            {laserPointerActive && laserPos && (
              <g pointerEvents="none">
                {/* Glowing Trail */}
                {laserTrail.map((pt, idx) => (
                  <circle
                    key={pt.id}
                    cx={pt.x}
                    cy={pt.y}
                    r={3 + idx * 1.5}
                    fill={laserColor === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'}
                  />
                ))}
                {/* Central Laser Glow */}
                <circle
                  cx={laserPos.x}
                  cy={laserPos.y}
                  r={16}
                  fill={laserColor === 'red' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)'}
                />
                <circle
                  cx={laserPos.x}
                  cy={laserPos.y}
                  r={6}
                  fill={laserColor === 'red' ? '#ef4444' : '#22c55e'}
                />
                <circle
                  cx={laserPos.x}
                  cy={laserPos.y}
                  r={2.5}
                  fill="#ffffff"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Large Touch/Stylus Smart Board Control Bar (Bottom) */}
      <div className="h-20 px-8 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between shrink-0 shadow-2xl">
        
        {/* Left: Step Jump & Playback Speed */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 px-2">Speed:</span>
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                  playbackSpeed === s
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => onStepChange(1)}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Oversized Touch Buttons for Classroom Presentation */}
        <div className="flex items-center gap-4">
          <button
            disabled={currentStepIndex <= 1}
            onClick={() => onStepChange(Math.max(1, currentStepIndex - 1))}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 border border-slate-700 transition-all shadow-md active:scale-95"
          >
            <SkipBack className="w-5 h-5" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-amber-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6 fill-white" />
                <span>PAUSE PLAYBACK</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-slate-950" />
                <span>AUTO-PLAY LESSON</span>
              </>
            )}
          </button>

          <button
            disabled={currentStepIndex >= totalSteps}
            onClick={() => onStepChange(Math.min(totalSteps, currentStepIndex + 1))}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 border border-slate-700 transition-all shadow-md active:scale-95"
          >
            <span>Next Step</span>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Step Indicator Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          {steps.map((s, idx) => (
            <button
              key={s.stepIndex}
              onClick={() => onStepChange(idx + 1)}
              className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                currentStepIndex === idx + 1
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                  : idx + 1 < currentStepIndex
                  ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.stepIndex}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
