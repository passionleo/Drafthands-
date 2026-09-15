import React, { useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  FileCheck2, 
  Video, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Tv, 
  Award, 
  ShieldCheck, 
  GraduationCap, 
  Sliders, 
  Cpu, 
  Maximize, 
  Users, 
  Download,
  Check,
  ChevronRight,
  X,
  Play
} from 'lucide-react';
import { CurriculumTier } from '../../types/curriculum';
import { InteractiveDraftingBoard } from '../drafting/InteractiveDraftingBoard';

interface ValuePropositionGridProps {
  onLaunchStudio: (tier?: CurriculumTier) => void;
  onOpenVideoTour: () => void;
  onOpenAuth: (mode?: 'SIGN_IN' | 'REGISTER') => void;
}

export const ValuePropositionGrid: React.FC<ValuePropositionGridProps> = ({
  onLaunchStudio,
  onOpenVideoTour,
  onOpenAuth
}) => {
  const [activePillarTab, setActivePillarTab] = useState<number>(0);
  const [showBoardSandbox, setShowBoardSandbox] = useState<boolean>(false);

  const pillars = [
    {
      id: 'nerdc-curriculum',
      title: 'NERDC-Compliant Curriculum',
      subtitle: 'From SS1 Secondary Foundations to Higher Institution CAD',
      badge: 'Senior Secondary & Tertiary',
      icon: BookOpen,
      gradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      borderColor: 'border-cyan-500/40',
      iconColor: 'text-cyan-400',
      description: 'Strictly aligned with the Nigerian Educational Research and Development Council (NERDC), WAEC, NECO, and NBTE National Diploma specifications.',
      highlights: [
        'SS1 Plane Geometry: Bisections, Inscribed & Circumscribed Polygons, Tangency Loci',
        'SS2 Solid Geometry: 1st & 3rd Angle Orthographic Projections, Isometric & Oblique Views',
        'SS3 Advanced Projections: Sectional Cutting Planes, Surface Developments & Building Plans',
        'Higher Institution: Mechanical CAD Assemblies, Fasteners & Engineering Schematics'
      ],
      stats: '120+ Structured Topics',
      ctaLabel: 'Explore Syllabus',
      action: () => onLaunchStudio('SS1')
    },
    {
      id: 'whiteboard-cad',
      title: 'Interactive Digital Whiteboard & CAD Tools',
      subtitle: 'Authentic Traditional Drafting Board & Modern Vector CAD',
      badge: 'Dual Drawing Modes',
      icon: PenTool,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-blue-500/40',
      iconColor: 'text-blue-400',
      description: 'Seamlessly switch between realistic traditional drawing instruments (T-Square, Set Squares, Dial Compass) and precision vector CAD coordinate tools.',
      highlights: [
        'Sliding Wooden T-Square with locked datum edge alignment',
        '30°/60° and 45° Acrylic Set Squares with automatic snap angles',
        'Dial-Micrometer Compass for exact radius measurement & loci arcs',
        'ISO 128 Layer Engine: 0.25mm 2H construction vs 0.7mm HB outline lines'
      ],
      stats: '0.1mm Vector Accuracy',
      ctaLabel: 'Test Drive Instruments',
      action: () => setShowBoardSandbox(true)
    },
    {
      id: 'past-questions',
      title: 'WAEC, NECO & NABTEB 10-Yr Past Qs Archive',
      subtitle: 'Verified Step-by-Step Solutions & Examiner Marking Rubrics',
      badge: '10-Year Solved Papers',
      icon: FileCheck2,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      description: 'Master practical exam questions from 2014 to 2024 with animated step-by-step vector guides, chief examiner notes, and official mark allocation schemes.',
      highlights: [
        'WAEC Paper 2 Practical: Plane & Solid Geometry step-by-step marking keys',
        'NECO SSCE & NABTEB Modular Exam past questions with full mark schemes',
        'Examiner Pitfall Warnings: Avoid common 5-mark deductions on line thickness & lettering',
        'Printable & exportable SVG worksheets with ISO corner title blocks'
      ],
      stats: '100% Exam Pass Strategy',
      ctaLabel: 'View Exam Archive',
      action: () => onLaunchStudio('SS3')
    },
    {
      id: 'live-classrooms',
      title: 'Real-Time Virtual Classrooms & Projection',
      subtitle: 'Synchronized Collaborative Teaching for Schools & Academies',
      badge: 'Live 2-Way Drawing',
      icon: Video,
      gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
      borderColor: 'border-purple-500/40',
      iconColor: 'text-purple-400',
      description: 'Connect technical instructors and classrooms with low-bandwidth WebRTC video/audio, real-time shared vector canvas, and 1-touch Smart Board projection.',
      highlights: [
        '2-Way Synchronized Vector Canvas: Watch students draw live and annotate in real time',
        'Teacher Smart Board Projection Mode: High-contrast fullscreen for classroom beamers',
        'Instant Assignment Dispatch: Send practical exercises with automated mark rubrics',
        'Low-Bandwidth Optimized: Ultra-smooth performance even on 3G rural mobile networks'
      ],
      stats: '< 40ms Sync Latency',
      ctaLabel: 'Join Virtual Class',
      action: () => onOpenVideoTour()
    }
  ];

  return (
    <section id="value-props" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Four Core Architectural Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for African Technical Education Excellence
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Drafthands bridges the gap between traditional manual drafting instruments and modern computer-aided engineering design.
          </p>
        </div>

        {/* 4 Core Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`relative rounded-2xl bg-slate-900/90 border ${pillar.borderColor} p-6 sm:p-8 flex flex-col justify-between shadow-xl backdrop-blur-sm group hover:border-cyan-400/70 transition-all duration-300`}
              >
                {/* Subtle Card Header Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.gradient} opacity-50 pointer-events-none`} />

                <div className="relative space-y-5">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${pillar.iconColor} shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-950/80 text-slate-300 border border-slate-800">
                        {pillar.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {pillar.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 ${pillar.iconColor} shrink-0 mt-0.5`} />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="relative pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      {pillar.stats}
                    </span>
                  </div>
                  <button
                    onClick={pillar.action}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all group-hover:border-cyan-500/50"
                  >
                    <span>{pillar.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Interactive Banner */}
        <div className="mt-12 sm:mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Full-Fidelity Browser Sandbox
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Ready to test your drawing skills on our digital drafting board?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              No software installation or CAD license required. Runs natively in any web browser on desktop, tablet, or classroom projector.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setShowBoardSandbox(true)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Test Virtual Instruments</span>
            </button>
            <button
              onClick={() => onLaunchStudio('SS1')}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>Launch Drawing Studio Now</span>
            </button>
            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all"
            >
              <span>Create School Account</span>
            </button>
          </div>
        </div>

        {/* Interactive Drafting Instruments Sandbox Modal */}
        {showBoardSandbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Interactive Drafting Instruments Sandbox</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">Live Sandbox</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Drag the T-Square stock, slide the 45° Set-Square along the blade, rotate angles, and draw technical lines.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowBoardSandbox(false);
                      onLaunchStudio('SS1');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Full Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowBoardSandbox(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Embedded Interactive Instrument Board */}
              <div className="w-full">
                <InteractiveDraftingBoard />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
