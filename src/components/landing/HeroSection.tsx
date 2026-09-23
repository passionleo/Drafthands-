import React, { useState } from 'react';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Award, 
  FileCheck2, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  PenTool, 
  MousePointerClick,
  ChevronRight,
  Film,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { CurriculumTier } from '../../types/curriculum';
import { AppWalkthroughVideo } from './AppWalkthroughVideo';

interface HeroSectionProps {
  onOpenAuth: (mode?: 'SIGN_IN' | 'REGISTER') => void;
  onOpenVideoTour: () => void;
  onLaunchStudio: (tier?: CurriculumTier) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAuth,
  onOpenVideoTour,
  onLaunchStudio
}) => {
  const [heroMediaMode, setHeroMediaMode] = useState<'VIDEO' | 'STUDENTS' | 'PLATE'>('VIDEO');

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Decorative Grid and Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & Dual CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-inner shadow-cyan-950">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono uppercase tracking-wider text-[11px]">NERDC & NBTE Accredited</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">SS1 to Higher Institution</span>
            </div>

            {/* High-Impact Headline as requested */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Master Technical Drawing & Engineering Design — <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Digitally.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The definitive interactive drafting academy for West African secondary schools, technical colleges, and polytechnics. Learn plane and solid geometry, 1st & 3rd angle orthographics, isometric projections, and CAD with live virtual instruments and 10-year WAEC past questions.
              </p>
            </div>

            {/* Dual CTAs & Video Tour Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {/* CTA 1: Get Started Free */}
              <button
                onClick={() => onOpenAuth('REGISTER')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* CTA 2: Sign In / Register */}
              <button
                onClick={() => onOpenAuth('SIGN_IN')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/90 text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In / Register</span>
              </button>

              {/* Video Tour Preview Button */}
              <button
                onClick={onOpenVideoTour}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Play className="w-3 h-3 ml-0.5 fill-current" />
                </div>
                <span>Watch Tour (3 min)</span>
              </button>
            </div>

            {/* Quick Feature Checklist */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Free SS1 Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>ISO 128 Line Weights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WAEC Marking Rubrics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Playing App Video Walkthrough & Studio Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl shadow-cyan-950/50 group flex flex-col">
              
              {/* Media Switcher Tab Header */}
              <div className="p-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-1 select-none">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHeroMediaMode('VIDEO')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      heroMediaMode === 'VIDEO'
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5 text-cyan-200" />
                    <span>▶ App Walkthrough</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5" />
                  </button>

                  <button
                    onClick={() => setHeroMediaMode('PLATE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      heroMediaMode === 'PLATE'
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Actual Diagram</span>
                  </button>

                  <button
                    onClick={() => setHeroMediaMode('STUDENTS')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      heroMediaMode === 'STUDENTS'
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Studio</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-cyan-400 hidden sm:inline-block">
                  {heroMediaMode === 'VIDEO' ? '0:35 Platform Overview' : 'ISO Standards'}
                </span>
              </div>

              {/* Dynamic Media Stage */}
              <div className="relative">
                {heroMediaMode === 'VIDEO' ? (
                  <div className="w-full">
                    <AppWalkthroughVideo
                      autoPlay={true}
                      compact={true}
                      onLaunchTopic={(topicId) => onLaunchStudio('SS1')}
                    />
                  </div>
                ) : heroMediaMode === 'PLATE' ? (
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src="/assets/actual_orthographic_diagram.jpg"
                      alt="Actual engineering technical drawing textbook plate in first angle orthographic projection with ISO 128 dimension lines and title block"
                      className="w-full h-full object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                      ISO 128 Actual Engineering Plate
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                    <img
                      src="/assets/african_students_technical_drawing.jpg"
                      alt="African secondary school and engineering students practicing technical drawing on wooden drafting boards and digital CAD workstations"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
                      <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                      <span>ISO 128 • 1st & 3rd Angle</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Interactive Trigger Bar */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Explore SS1 Week 1 Starter Topic</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bisection of Straight Lines & Precision Compass Arcs
                  </p>
                </div>
                <button
                  onClick={() => onLaunchStudio('SS1')}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all shrink-0"
                >
                  <span>Launch Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Platform Stats Pill Strip below image */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-base sm:text-lg font-black text-cyan-400 font-mono">50K+</div>
                <div className="text-[10px] text-slate-400 font-medium">Students Enrolled</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-base sm:text-lg font-black text-blue-400 font-mono">120+</div>
                <div className="text-[10px] text-slate-400 font-medium">NERDC Modules</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">10-Yr</div>
                <div className="text-[10px] text-slate-400 font-medium">Past Qs Solved</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
