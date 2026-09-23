import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Subtitles, 
  Compass, 
  PenTool, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Sparkles,
  MousePointer,
  Box,
  Layers,
  Check
} from 'lucide-react';

interface AppWalkthroughVideoProps {
  autoPlay?: boolean;
  compact?: boolean;
  onLaunchTopic?: (topicId: string) => void;
  className?: string;
}

interface VideoScene {
  id: string;
  startSec: number;
  endSec: number;
  title: string;
  badge: string;
  subtitle: string;
  narratorText: string;
}

const TOTAL_DURATION = 35; // 35-second fast-paced, high-engagement walkthrough

const SCENES: VideoScene[] = [
  {
    id: 'curriculum',
    startSec: 0,
    endSec: 7,
    title: '1. Select Module',
    badge: 'NERDC Syllabus',
    subtitle: 'Choose from SS1 Foundation, SS2 Intermediate, SS3 WAEC prep, or Higher Inst. CAD',
    narratorText: 'Step 1: Browse official NERDC modules and select your lesson, from basic bisection to advanced CAD.'
  },
  {
    id: 'instruments',
    startSec: 7,
    endSec: 14,
    title: '2. Tools & Board',
    badge: 'Virtual Board',
    subtitle: 'Use virtual sliding T-Square, 30°/60° set squares, dial compass, and ISO pencils',
    narratorText: 'Step 2: Position paper on the board. The wooden T-Square and set-square snap automatically to datum edges.'
  },
  {
    id: 'construction',
    startSec: 14,
    endSec: 22,
    title: '3. Precision Drafting',
    badge: 'ISO 128 Construction',
    subtitle: 'Strike faint 2H construction arcs and rule crisp HB outlines with millimeter accuracy',
    narratorText: 'Step 3: Strike 2H compass arcs to locate intersection nodes, then rule the bold 90° perpendicular bisector.'
  },
  {
    id: 'projections',
    startSec: 22,
    endSec: 29,
    title: '4. Orthographic & 3D',
    badge: 'Multi-View CAD',
    subtitle: 'Simultaneously view 1st/3rd angle orthographic projections and rotating 3D isometric models',
    narratorText: 'Step 4: Switch effortlessly between 2D orthographic projections and 3D axonometric rotating models.'
  },
  {
    id: 'grading',
    startSec: 29,
    endSec: 35,
    title: '5. AI WAEC Grading',
    badge: 'Exam Mark Scheme',
    subtitle: 'Instant examiner rubric analysis: construction arcs, perpendicularity, and line weights',
    narratorText: 'Step 5: Get instant scoring against real WAEC & NECO marking schemes with step-by-step mark breakdown.'
  }
];

export const AppWalkthroughVideo: React.FC<AppWalkthroughVideoProps> = ({
  autoPlay = true,
  compact = false,
  onLaunchTopic,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound generator
  const playSoundEffect = (type: 'click' | 'pencil' | 'chime') => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'pencil') {
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.04;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2400;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.4);
        });
      }
    } catch {
      // Audio graceful fallback
    }
  };

  // Main video animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            return 0; // seamless loop
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, playbackSpeed]);

  // Current Scene and sub-progress calculations
  const currentScene = SCENES.find(s => currentTime >= s.startSec && currentTime < s.endSec) || SCENES[0];
  const sceneProgress = Math.min(1, Math.max(0, (currentTime - currentScene.startSec) / (currentScene.endSec - currentScene.startSec)));

  // Sound triggers on scene milestones
  const lastSecRef = useRef<number>(0);
  useEffect(() => {
    const curSecFloor = Math.floor(currentTime);
    if (curSecFloor !== lastSecRef.current) {
      lastSecRef.current = curSecFloor;
      if (curSecFloor === 3 || curSecFloor === 10 || curSecFloor === 18) {
        playSoundEffect('pencil');
      } else if (curSecFloor === 0 || curSecFloor === 7 || curSecFloor === 14 || curSecFloor === 22) {
        playSoundEffect('click');
      } else if (curSecFloor === 32) {
        playSoundEffect('chime');
      }
    }
  }, [currentTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(pos * TOTAL_DURATION);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    playSoundEffect('click');
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Simulated virtual cursor position based on scene and progress
  const getCursorCoord = () => {
    if (currentScene.id === 'curriculum') {
      if (sceneProgress < 0.4) {
        return { x: 25 + sceneProgress * 50, y: 35, clicking: sceneProgress > 0.35 };
      } else {
        return { x: 50, y: 65, clicking: sceneProgress > 0.8 };
      }
    } else if (currentScene.id === 'instruments') {
      if (sceneProgress < 0.5) {
        return { x: 15, y: 30 + Math.sin(sceneProgress * Math.PI * 2) * 30, clicking: true };
      } else {
        return { x: 60 + sceneProgress * 15, y: 55, clicking: false };
      }
    } else if (currentScene.id === 'construction') {
      if (sceneProgress < 0.35) {
        return { x: 22 + Math.cos(sceneProgress * 15) * 6, y: 38 + Math.sin(sceneProgress * 15) * 6, clicking: true };
      } else if (sceneProgress < 0.7) {
        return { x: 78 + Math.cos(sceneProgress * 15) * 6, y: 38 + Math.sin(sceneProgress * 15) * 6, clicking: true };
      } else {
        return { x: 50, y: 20 + (sceneProgress - 0.7) * 200, clicking: true };
      }
    } else if (currentScene.id === 'projections') {
      return { x: 65 + Math.sin(sceneProgress * Math.PI * 2) * 12, y: 50 + Math.cos(sceneProgress * Math.PI * 2) * 12, clicking: false };
    } else {
      return { x: 80, y: 82, clicking: sceneProgress > 0.4 };
    }
  };

  const cursor = getCursorCoord();

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-cyan-500/40 select-none group flex flex-col justify-between ${className}`}
    >
      {/* 1. TOP VIDEO HEADER HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 p-2.5 sm:p-3.5 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/85 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold shadow-md">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPlaying ? 'WALKTHROUGH • 1080P' : 'PAUSED'}</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-xs">
            {currentScene.title}: {currentScene.badge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onLaunchTopic && onLaunchTopic('TD-SS1-MOD01')}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Launch App Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC LIVE SIMULATION CANVAS */}
      <div 
        onClick={handleTogglePlay}
        className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 cursor-pointer"
      >
        {/* Animated Background Technical Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#09182d_1px,transparent_1px),linear-gradient(to_bottom,#09182d_1px,transparent_1px)] bg-[size:20px_20px] opacity-70" />

        {/* Center Pause Playback Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1 text-cyan-300" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 1: CURRICULUM SELECTION & SYLLABUS                                  */}
        {/* ========================================================================= */}
        {currentScene.id === 'curriculum' && (
          <div className="relative z-10 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Technical Drawing Syllabus</h4>
                    <p className="text-[10px] text-cyan-400 font-mono">120+ NERDC Accredited Topics</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Step 1: Pick Lesson
                </span>
              </div>

              {/* Tiers row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className={`p-2 rounded-xl border transition-all ${sceneProgress < 0.6 ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-md shadow-cyan-500/20 scale-102' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span className="text-[10px] text-cyan-400 block font-bold">TIER 1</span>
                  <span className="font-bold">SS1 Foundation</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                  <span className="text-[10px] block">TIER 2</span>
                  <span>SS2 Solid Geom</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                  <span className="text-[10px] block">TIER 3</span>
                  <span>SS3 WAEC Prep</span>
                </div>
              </div>

              {/* Active topic card being selected */}
              <div className={`p-3.5 rounded-xl border transition-all ${sceneProgress > 0.5 ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg' : 'bg-slate-950/90 border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Bisection of Lines & Angles</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">TD-SS1-MOD01</span>
                      </div>
                      <p className="text-[11px] text-slate-400">2H compass arcs & perpendicular bisector</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${sceneProgress > 0.6 ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'}`}>
                    {sceneProgress > 0.6 ? 'SELECTED ✓' : 'SELECT →'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 2: DRAFTING BOARD & VIRTUAL INSTRUMENTS                             */}
        {/* ========================================================================= */}
        {currentScene.id === 'instruments' && (
          <div className="relative z-10 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Interactive Drafting Board</h4>
                    <p className="text-[10px] text-blue-400 font-mono">T-Square, 30°/60° Set-Squares & Dial Compass</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Step 2: Setup Tools
                </span>
              </div>

              {/* Drawing Board View with moving T-square & set-square */}
              <div className="relative h-44 sm:h-48 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-3">
                {/* Paper sheet */}
                <div className="absolute inset-4 rounded bg-slate-900/80 border border-slate-700/80 shadow-inner flex flex-col justify-between p-2">
                  {/* Title block */}
                  <div className="self-end border border-slate-700 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-400 bg-slate-950">
                    TITLE BLOCK: ISO 128 | SCALE 1:1
                  </div>
                </div>

                {/* Sliding Wooden T-Square */}
                <div 
                  className="absolute left-0 right-0 h-4 bg-amber-800/90 border-y border-amber-600 shadow-lg flex items-center justify-between px-3 transition-all duration-75"
                  style={{ top: `${25 + Math.sin(sceneProgress * Math.PI * 2) * 35}%` }}
                >
                  <span className="text-[9px] font-mono font-bold text-amber-200">WOODEN T-SQUARE BLADE</span>
                  <span className="text-[8px] font-mono text-amber-300/80">DATUM LOCKED (0.0° HORIZONTAL)</span>
                </div>

                {/* Sliding Transparent Set-Square sitting on T-square */}
                <div 
                  className="absolute w-20 h-20 border-2 border-cyan-400/80 bg-cyan-400/15 backdrop-blur-xs transition-all duration-75 flex items-center justify-center"
                  style={{ 
                    left: `${30 + sceneProgress * 30}%`, 
                    top: `${15 + Math.sin(sceneProgress * Math.PI * 2) * 35}%`,
                    clipPath: 'polygon(0% 100%, 100% 100%, 0% 0%)'
                  }}
                >
                  <span className="text-[8px] font-mono font-bold text-cyan-200 -rotate-45 ml-2 mt-4">30°/60°</span>
                </div>

                {/* Dynamic dial compass indicator */}
                <div className="absolute bottom-2 left-2 z-20 px-2.5 py-1 rounded-lg bg-slate-900/95 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-md">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Compass Radius: {(45 + sceneProgress * 20).toFixed(1)}mm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 3: PRECISION 2H CONSTRUCTION & HB FINAL OUTLINE                     */}
        {/* ========================================================================= */}
        {currentScene.id === 'construction' && (
          <div className="relative z-10 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ISO
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Live Geometric Construction</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">Bisection with 2H Arcs & HB Bisector</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Step 3: Draw Line & Arcs
                </span>
              </div>

              {/* Vector blueprint with real-time progressive drawing */}
              <div className="relative h-44 sm:h-48 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                <svg viewBox="0 0 500 240" className="w-full h-full">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="demo-walkthrough-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f233f" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="500" height="240" fill="url(#demo-walkthrough-grid)" />

                  {/* Horizontal Baseline AB */}
                  <line x1="80" y1="120" x2="420" y2="120" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="80" cy="120" r="4.5" fill="#38bdf8" />
                  <circle cx="420" cy="120" r="4.5" fill="#38bdf8" />
                  <text x="65" y="125" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">A</text>
                  <text x="430" y="125" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">B</text>

                  {/* Arcs from A (Sweeps in when sceneProgress > 0.15) */}
                  {sceneProgress > 0.15 && (
                    <g>
                      <path d="M 220 50 A 180 180 0 0 1 280 85" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="5 3" />
                      <path d="M 220 190 A 180 180 0 0 0 280 155" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="5 3" />
                    </g>
                  )}

                  {/* Arcs from B (Sweeps in when sceneProgress > 0.45) */}
                  {sceneProgress > 0.45 && (
                    <g>
                      <path d="M 280 50 A 180 180 0 0 0 220 85" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeDasharray="5 3" />
                      <path d="M 280 190 A 180 180 0 0 1 220 155" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeDasharray="5 3" />
                      
                      {/* Intersection Nodes C and D */}
                      <circle cx="250" cy="67" r="4" fill="#22c55e" />
                      <circle cx="250" cy="173" r="4" fill="#22c55e" />
                      <text x="260" y="65" fill="#22c55e" fontFamily="monospace" fontSize="11" fontWeight="bold">C</text>
                      <text x="260" y="180" fill="#22c55e" fontFamily="monospace" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}

                  {/* Perpendicular Bisector line (Appears when sceneProgress > 0.7) */}
                  {sceneProgress > 0.7 && (
                    <g>
                      <line 
                        x1="250" 
                        y1="35" 
                        x2="250" 
                        y2={35 + Math.min(1, (sceneProgress - 0.7) / 0.25) * 170} 
                        stroke="#a855f7" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      <circle cx="250" cy="120" r="5" fill="#a855f7" />
                      <text x="260" y="115" fill="#a855f7" fontFamily="monospace" fontSize="12" fontWeight="bold">M (90.0°)</text>

                      {/* Right-angle marker */}
                      <polyline points="250,105 265,105 265,120" fill="none" stroke="#22d3ee" strokeWidth="1.5" />

                      {/* Dimension labels */}
                      <line x1="80" y1="210" x2="250" y2="210" stroke="#38bdf8" strokeWidth="1" />
                      <line x1="250" y1="210" x2="420" y2="210" stroke="#38bdf8" strokeWidth="1" />
                      <text x="165" y="225" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">50 mm</text>
                      <text x="335" y="225" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">50 mm</text>
                    </g>
                  )}
                </svg>

                {/* Status indicator pill */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                  {sceneProgress < 0.4 ? 'Striking 2H Arc from A...' : sceneProgress < 0.7 ? 'Intersecting at Nodes C & D...' : 'Bisected at 90° (Tolerance ±0.1mm)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 4: MULTI-VIEW ORTHOGRAPHIC & 3D ISOMETRIC                           */}
        {/* ========================================================================= */}
        {currentScene.id === 'projections' && (
          <div className="relative z-10 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">ISO 1st Angle & 3D Isometric</h4>
                    <p className="text-[10px] text-purple-400 font-mono">Front Elevation, Plan & Orbiting 3D Model</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Step 4: 2D/3D Multi-View
                </span>
              </div>

              {/* Split-View: 2D Orthographic vs Live 3D Orbit */}
              <div className="grid grid-cols-2 gap-2.5 h-44 sm:h-48">
                {/* Left: Orthographic Views */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-mono font-bold text-cyan-300">1ST ANGLE VIEWS</span>
                  <div className="grid grid-cols-2 gap-1 my-auto">
                    <div className="border border-cyan-400/60 bg-cyan-500/10 p-2 rounded text-[9px] font-mono text-cyan-200 font-bold">
                      FRONT ELEV
                    </div>
                    <div className="border border-blue-400/60 bg-blue-500/10 p-2 rounded text-[9px] font-mono text-blue-200 font-bold">
                      END ELEV
                    </div>
                    <div className="border border-emerald-400/60 bg-emerald-500/10 p-2 rounded text-[9px] font-mono text-emerald-200 font-bold col-span-2">
                      PLAN (TOP VIEW)
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-slate-400">45° Mitre Ray Projected</span>
                </div>

                {/* Right: Live 3D Rotating Axonometric */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 flex flex-col justify-between items-center text-center overflow-hidden">
                  <span className="text-[10px] font-mono font-bold text-purple-300">3D AXONOMETRIC ORBIT</span>
                  
                  {/* Rotating 3D wireframe box */}
                  <div className="my-auto w-16 h-16 relative perspective-500 flex items-center justify-center">
                    <div 
                      className="w-14 h-14 border-2 border-purple-400 bg-purple-600/20 rounded shadow-lg shadow-purple-500/30 flex items-center justify-center font-mono text-[10px] text-white font-bold transition-transform"
                      style={{
                        transform: `rotateX(25deg) rotateY(${sceneProgress * 360}deg) rotateZ(10deg)`
                      }}
                    >
                      30° AXIS
                    </div>
                  </div>

                  <span className="text-[8px] font-mono text-purple-400 animate-pulse">Rotates 360° Real-time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 5: AI WAEC EXAMINER GRADING & RUBRICS                               */}
        {/* ========================================================================= */}
        {currentScene.id === 'grading' && (
          <div className="relative z-10 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">WAEC & NECO AI Examiner</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">Official WAEC Marking Scheme Evaluated</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  15 / 15 Marks (A1)
                </span>
              </div>

              {/* Marking scheme scorecard */}
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">Datum Line AB Span & Alignment</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">3 / 3 Marks ✓</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">2H Compass Arcs & Intersecting Loci (C, D)</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">6 / 6 Marks ✓</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">Perpendicular Bisector at Midpoint M (90°)</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">6 / 6 Marks ✓</span>
                </div>
              </div>

              {/* Call-to-action */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-cyan-300 font-mono">Distinction A1 Achieved!</span>
                <button
                  onClick={() => onLaunchTopic && onLaunchTopic('TD-SS1-MOD01')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Drawing Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animated Virtual Cursor Overlay showing where the user interacts */}
        <div 
          className="absolute z-30 pointer-events-none transition-all duration-150 ease-out"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        >
          <div className="relative">
            <MousePointer className="w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md -rotate-12" />
            {cursor.clicking && (
              <span className="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
            )}
          </div>
        </div>

      </div>

      {/* 3. SUBTITLES & NARRATOR STRIP */}
      {showCaptions && (
        <div className="absolute bottom-14 sm:bottom-16 left-4 right-4 z-20 pointer-events-none flex justify-center">
          <div className="max-w-2xl px-3.5 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-md shadow-xl text-center">
            <span className="text-xs sm:text-sm text-cyan-200 font-medium tracking-wide">
              {currentScene.narratorText}
            </span>
          </div>
        </div>
      )}

      {/* 4. BOTTOM VIDEO TIMELINE & CONTROLS */}
      <div className={`relative z-30 p-2 sm:p-3 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent border-t border-slate-800/80 space-y-2 transition-opacity duration-200 ${
        isHovered || !isPlaying ? 'opacity-100' : 'opacity-95'
      }`}>
        
        {/* Timeline Progress Bar (Interactive Click to Seek) */}
        <div 
          onClick={handleSeek}
          className="relative w-full h-2 rounded-full bg-slate-800 cursor-pointer overflow-hidden group/bar"
          title="Click to seek"
        >
          {/* Chapter segments divider hints */}
          {SCENES.map((scene, i) => (
            <div 
              key={i} 
              className="absolute top-0 bottom-0 border-r border-slate-950/80 pointer-events-none"
              style={{ left: `${(scene.endSec / TOTAL_DURATION) * 100}%` }}
            />
          ))}

          {/* Active progress fill */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-75"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />

          {/* Thumb marker on hover */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-all pointer-events-none opacity-0 group-hover/bar:opacity-100"
            style={{ left: `calc(${(currentTime / TOTAL_DURATION) * 100}% - 6px)` }}
          />
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between text-slate-300 text-xs select-none">
          
          {/* Left Controls: Play/Pause, Replay, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 sm:p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md shadow-cyan-600/30 flex items-center justify-center"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
                playSoundEffect('click');
              }}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="font-mono text-[11px] sm:text-xs text-slate-300">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-slate-400">{formatTime(TOTAL_DURATION)}</span>
            </div>
          </div>

          {/* Center: Quick Chapter Selection Pills */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentTime(scene.startSec);
                  setIsPlaying(true);
                  playSoundEffect('click');
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                  currentScene.id === scene.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {scene.title}
              </button>
            ))}
          </div>

          {/* Right Controls: Speed, Captions, Mute, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Selector */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 2];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-cyan-300 font-bold transition-colors"
              title="Change Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1.5 rounded-lg transition-colors ${
                showCaptions ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Captions"
            >
              <Subtitles className="w-3.5 h-3.5" />
            </button>

            {/* Mute / Audio Effects Toggle */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (!nextMute) {
                  playSoundEffect('chime');
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                !isMuted ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title={isMuted ? "Unmute Audio (Drafting SFX)" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
