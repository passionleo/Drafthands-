import React, { useState } from 'react';
import { 
  Compass, 
  Play, 
  Sparkles, 
  LogIn, 
  ArrowRight, 
  Menu, 
  X, 
  BookOpen, 
  PenTool, 
  FileCheck2, 
  Video, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { CurriculumTier } from '../../types/curriculum';

interface LandingHeaderProps {
  onOpenAuth: (mode?: 'SIGN_IN' | 'REGISTER') => void;
  onOpenVideoTour: () => void;
  onLaunchStudio: (tier?: CurriculumTier) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onOpenAuth,
  onOpenVideoTour,
  onLaunchStudio,
  onNavigateSection
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCurriculumDropdownOpen, setIsCurriculumDropdownOpen] = useState<boolean>(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setIsMobileMenuOpen(false);
    setIsCurriculumDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans">
                Draft<span className="text-cyan-400">hands</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                NERDC Mapped
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
              Technical & Engineering Drawing Academy
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Curriculum dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCurriculumDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>NERDC Syllabus</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCurriculumDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurriculumDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Senior Secondary & Tertiary Tiers
                </div>
                {[
                  { tier: 'SS1' as CurriculumTier, label: 'SS1: Plane Geometry Foundations', desc: 'Bisections, Polygons, Tangents' },
                  { tier: 'SS2' as CurriculumTier, label: 'SS2: Solid Geometry & Projections', desc: '1st/3rd Angle Orthographic & Isometrics' },
                  { tier: 'SS3' as CurriculumTier, label: 'SS3: Exam Revision & Architecture', desc: 'Sectional Views, Building Plans & WAEC' },
                  { tier: 'HIGHER_INSTITUTION' as CurriculumTier, label: 'Higher Inst & Engineering CAD', desc: 'B.Eng/HND/ND 2D/3D CAD Assemblies' }
                ].map(item => (
                  <button
                    key={item.tier}
                    onClick={() => {
                      setIsCurriculumDropdownOpen(false);
                      onLaunchStudio(item.tier);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition-colors flex flex-col group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('value-props')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-blue-400" />
            <span>Digital Whiteboard CAD</span>
          </button>

          <button
            onClick={() => handleNavClick('past-questions')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>10-Yr WAEC Archive</span>
          </button>

          <button
            onClick={() => handleNavClick('live-class')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Virtual Classroom</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Watch Video Tour Button */}
          <button
            onClick={onOpenVideoTour}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-sm group"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
            </div>
            <span>Platform Tour</span>
          </button>

          {/* Sign In / Register */}
          <button
            onClick={() => onOpenAuth('SIGN_IN')}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign In</span>
          </button>

          {/* Launch Studio CTA */}
          <button
            onClick={() => onLaunchStudio()}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Enter Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleNavClick('curriculum-preview')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 flex items-center gap-2.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>NERDC Curriculum Syllabus (SS1 to Uni)</span>
            </button>

            <button
              onClick={() => handleNavClick('value-props')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 flex items-center gap-2.5"
            >
              <PenTool className="w-4 h-4 text-blue-400" />
              <span>Digital Whiteboard & CAD Instruments</span>
            </button>

            <button
              onClick={() => handleNavClick('past-questions')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 flex items-center gap-2.5"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>WAEC, NECO & NABTEB 10-Yr Past Questions</span>
            </button>

            <button
              onClick={() => handleNavClick('live-class')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 flex items-center gap-2.5"
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>Live Virtual Classroom & Projection</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenVideoTour();
              }}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Platform Tour</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('REGISTER');
              }}
              className="py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
