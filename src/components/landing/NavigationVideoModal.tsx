import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  FastForward, 
  BookOpen, 
  PenTool, 
  FileCheck2, 
  Video, 
  Sparkles, 
  ArrowRight,
  Layers,
  Compass,
  CheckCircle2,
  Tv,
  HelpCircle,
  Subtitles,
  Award,
  Film
} from 'lucide-react';
import { LandingVideoPlayer } from './LandingVideoPlayer';

interface VideoChapter {
  id: string;
  title: string;
  durationLabel: string;
  startSeconds: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge: string;
  previewColor: string;
  simulationElements: {
    heading: string;
    subheading: string;
    features: string[];
    instrumentVisual: 'SYLLABUS' | 'WHITEBOARD' | 'PAST_QUESTIONS' | 'LIVE_CLASS';
  };
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'ch1',
    title: '1. NERDC Syllabus & Multi-Tier Curriculum',
    durationLabel: '00:00 - 01:30',
    startSeconds: 0,
    icon: BookOpen,
    description: 'Explore the complete syllabus mapped strictly to Nigerian Educational Research and Development Council (NERDC) and NBTE standards from SS1 foundation to Higher Institution CAD engineering.',
    badge: 'NERDC Mapped',
    previewColor: 'from-cyan-600 to-blue-700',
    simulationElements: {
      heading: 'Senior Secondary & Higher Inst Technical Syllabus',
      subheading: 'Structured 3-Term Academic Breakdown with ISO 128 Drawing Standards',
      features: [
        'SS1 Plane Geometry (Bisection, Polygons, Tangency, Scales)',
        'SS2 Solid Geometry & Orthographic Projections (1st & 3rd Angle)',
        'SS3 Sectional Views, Interpenetration & Architectural Plans',
        'Higher Institution 2D/3D CAD & Mechanical Assemblies'
      ],
      instrumentVisual: 'SYLLABUS'
    }
  },
  {
    id: 'ch2',
    title: '2. Interactive Digital Whiteboard & CAD Tools',
    durationLabel: '01:30 - 03:15',
    startSeconds: 90,
    icon: PenTool,
    description: 'Master practical drawing using realistic sliding T-Squares, 30°/60° and 45° Set Squares, dial-micrometer Compass, French Curves, and precision ISO line-weight layers.',
    badge: 'Interactive Tools',
    previewColor: 'from-blue-600 to-indigo-700',
    simulationElements: {
      heading: 'Precision Drafting & Virtual Instrument Simulation',
      subheading: 'Authentic Traditional Drawing Board with 0.25mm to 0.7mm Line Weights',
      features: [
        'Sliding Wooden T-Square with Locking Datum Edge',
        'Acrylic 30°/60° and 45° Set Squares for Isometric Construction',
        'Dial-Micrometer Compass for Precision Tangent Arcs & Loci',
        'ISO 128 Layer Engine: 2H Construction vs HB Finish Lines'
      ],
      instrumentVisual: 'WHITEBOARD'
    }
  },
  {
    id: 'ch3',
    title: '3. WAEC, NECO & NABTEB 10-Year Past Qs Archive',
    durationLabel: '03:15 - 04:45',
    startSeconds: 195,
    icon: FileCheck2,
    description: 'Solve real past national exam questions with interactive step-by-step vector animations, examiner deduction traps, and official mark allocation rubrics.',
    badge: '10-Yr Past Papers',
    previewColor: 'from-emerald-600 to-teal-700',
    simulationElements: {
      heading: 'Official Marking Schemes & Step-by-Step Solutions',
      subheading: 'Detailed Marking Keys: Centerlines, Construction Arcs & Final Outlines',
      features: [
        'WAEC Paper 2 Theory & Practical Questions (2014 - 2024)',
        'NECO Senior Secondary Certificate Examination (SSCE) Archive',
        'NABTEB National Technical Certificate (NTC) Modular Papers',
        'Chief Examiner Traps: Avoiding Common 5-Mark Deductions'
      ],
      instrumentVisual: 'PAST_QUESTIONS'
    }
  },
  {
    id: 'ch4',
    title: '4. Real-Time Virtual Classrooms & Smart Projection',
    durationLabel: '04:45 - 06:00',
    startSeconds: 285,
    icon: Video,
    description: 'Connect technical teachers and students in live synchronized 2-way drawing sessions with ultra-low latency WebRTC, Smart Board projection, and auto-marking rubrics.',
    badge: 'Live Collaborative',
    previewColor: 'from-violet-600 to-purple-700',
    simulationElements: {
      heading: 'Synchronized Collaborative Technical Studio',
      subheading: 'Smart Board Fullscreen Projection & Instant Assignment Dispatch',
      features: [
        '2-Way Synchronized Real-Time Vector Drawing Canvas',
        'Smart Board High-Contrast Mode for School Classroom Projectors',
        'Teacher Laser Pointer, Spotlight & Step-by-Step Broadcast',
        'Student Assignment Dispatch with Auto-Marking Rubrics'
      ],
      instrumentVisual: 'LIVE_CLASS'
    }
  }
];

const TOTAL_VIDEO_DURATION = 360; // 6 minutes total (360s)

interface NavigationVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTopic?: (topicId: string) => void;
}

export const NavigationVideoModal: React.FC<NavigationVideoModalProps> = ({
  isOpen,
  onClose,
  onLaunchTopic
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [captionLanguage, setCaptionLanguage] = useState<'EN' | 'FR' | 'NG_PIDGIN'>('EN');
  const [viewMode, setViewMode] = useState<'VIDEO' | 'INTERACTIVE'>('VIDEO');

  // Sync active chapter index based on currentSeconds
  useEffect(() => {
    let matchedIndex = 0;
    for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (currentSeconds >= VIDEO_CHAPTERS[i].startSeconds) {
        matchedIndex = i;
        break;
      }
    }
    setActiveChapterIndex(matchedIndex);
  }, [currentSeconds]);

  // Simulated video playback timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSeconds(prev => {
        if (prev >= TOTAL_VIDEO_DURATION) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  const currentChapter = VIDEO_CHAPTERS[activeChapterIndex] || VIDEO_CHAPTERS[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJumpToChapter = (index: number) => {
    setViewMode('INTERACTIVE');
    const chap = VIDEO_CHAPTERS[index];
    if (chap) {
      setCurrentSeconds(chap.startSeconds);
      setActiveChapterIndex(index);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentSeconds(val);
  };

  // Caption generator based on seconds and chapter
  const getActiveCaption = () => {
    if (captionLanguage === 'FR') {
      return `[Français] Chapitre ${activeChapterIndex + 1}: ${currentChapter.title} - Normes d'ingénierie ISO 128 et dessin technique interactif.`;
    }
    if (captionLanguage === 'NG_PIDGIN') {
      return `[Pidgin] Step ${activeChapterIndex + 1}: How to use T-Square, Set Square and solve WAEC past question easily on Drafthands.`;
    }
    return `Narrator: "Welcome to Drafthands. In this section, we examine how ${currentChapter.simulationElements.subheading.toLowerCase()} empowers both students and educators."`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Drafthands Platform Interactive Tour
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  HD 1080p Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Mastering Syllabus Navigation, Digital Instruments, WAEC Archives & Live Rooms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('VIDEO')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                  viewMode === 'VIDEO'
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Walkthrough Video</span>
                <span className="sm:hidden">Video</span>
              </button>
              <button
                onClick={() => setViewMode('INTERACTIVE')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                  viewMode === 'INTERACTIVE'
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Blueprint Chapters</span>
                <span className="sm:hidden">Chapters</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Stage & Simulation Window */}
        {viewMode === 'VIDEO' ? (
          <div className="w-full bg-slate-950 p-2 sm:p-4 flex items-center justify-center">
            <LandingVideoPlayer 
              autoPlay={true}
              onLaunchTopic={(id) => {
                onClose();
                if (onLaunchTopic) onLaunchTopic(id);
              }}
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group flex flex-col justify-between">
          {/* Main Visual Animation Canvas for current chapter */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
            
            {/* Animated Technical Geometry Visual Backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
              <svg className="w-full h-full max-w-2xl text-cyan-500" viewBox="0 0 600 400" fill="none">
                <circle cx="300" cy="200" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '40s' }} />
                <circle cx="300" cy="200" r="90" stroke="currentColor" strokeWidth="1.5" />
                <line x1="80" y1="200" x2="520" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
                <line x1="300" y1="40" x2="300" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
                <polygon points="300,110 380,250 220,250" stroke="#38bdf8" strokeWidth="2" fill="#0284c7" fillOpacity="0.1" />
                <path d="M 220 200 A 80 80 0 0 1 380 200" stroke="#34d399" strokeWidth="2" strokeDasharray="6 3" />
              </svg>
            </div>

            {/* Dynamic Interactive Stage Card */}
            <div className="relative z-10 max-w-xl w-full mx-4 p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {currentChapter.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Time: {formatTime(currentSeconds)} / {formatTime(TOTAL_VIDEO_DURATION)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Feature Showcase</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {currentChapter.simulationElements.heading}
                </h4>
                <p className="text-xs sm:text-sm text-cyan-300/90 font-medium mt-1">
                  {currentChapter.simulationElements.subheading}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {currentChapter.simulationElements.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Visual simulated instrument cursor */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Simulating real-time vector rendering & CAD snapping</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchTopic) onLaunchTopic('ss1-intro-technical-drawing');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all"
                >
                  <span>Launch Live Tool</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Subtitles Overlay */}
          {showCaptions && (
            <div className="relative z-20 mx-auto mb-16 px-4 py-1.5 rounded-lg bg-black/85 border border-white/10 text-white text-xs sm:text-sm font-medium text-center max-w-2xl shadow-lg backdrop-blur-sm">
              {getActiveCaption()}
            </div>
          )}

          {/* Bottom Player Controls Bar */}
          <div className="relative z-30 p-3 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-2">
            {/* Progress Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                {formatTime(currentSeconds)}
              </span>
              <input
                type="range"
                min={0}
                max={TOTAL_VIDEO_DURATION}
                value={currentSeconds}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
              />
              <span className="text-[11px] font-mono text-slate-400 w-10">
                {formatTime(TOTAL_VIDEO_DURATION)}
              </span>
            </div>

            {/* Controls buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => setCurrentSeconds(0)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(m => !m)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={isMuted ? 'Unmute narration' : 'Mute narration'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px]">
                  {[1, 1.25, 1.5].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        playbackSpeed === spd
                          ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Right utility buttons */}
              <div className="flex items-center gap-2">
                {/* Caption Toggle */}
                <button
                  onClick={() => setShowCaptions(c => !c)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    showCaptions
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CC</span>
                </button>

                {/* Caption dialect switch */}
                {showCaptions && (
                  <select
                    value={captionLanguage}
                    onChange={e => setCaptionLanguage(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="EN">English</option>
                    <option value="NG_PIDGIN">Pidgin</option>
                    <option value="FR">Français</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Chapter Selection Grid */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Interactive Chapters & Walkthrough Modules
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">Click any chapter to jump</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {VIDEO_CHAPTERS.map((chap, idx) => {
              const Icon = chap.icon;
              const isActive = activeChapterIndex === idx;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleJumpToChapter(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                    isActive
                      ? 'bg-slate-850 border-cyan-500/70 shadow-lg shadow-cyan-950/40 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{chap.durationLabel}</span>
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {chap.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                      {chap.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
