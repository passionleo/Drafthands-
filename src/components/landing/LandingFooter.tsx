import React from 'react';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  FileCheck2, 
  Video, 
  ShieldCheck, 
  Award, 
  Mail, 
  ArrowRight,
  Heart,
  Globe
} from 'lucide-react';
import { CurriculumTier } from '../../types/curriculum';

interface LandingFooterProps {
  onLaunchStudio: (tier?: CurriculumTier) => void;
  onOpenAuth: (mode?: 'SIGN_IN' | 'REGISTER') => void;
  onOpenVideoTour: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onLaunchStudio,
  onOpenAuth,
  onOpenVideoTour
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Pre-Footer Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900 border border-cyan-500/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
          
          <div className="relative max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Your Drafting Journey Today</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Master Technical Drawing with Confidence?
            </h3>
            <p className="text-sm text-slate-300">
              Join thousands of secondary students, technical apprentices, and polytechnic undergraduates across West Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onOpenAuth('REGISTER')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Create Free Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLaunchStudio('SS1')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all"
              >
                <span>Try Demo in Browser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Draft<span className="text-cyan-400">hands</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier digital academy for Technical Drawing and Engineering Graphics, engineered specifically for NERDC secondary curricula, WAEC/NECO examination boards, and African polytechnic faculties.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISO 128 / ISO 129 Engineering Standards Certified</span>
            </div>
          </div>

          {/* Col 2: Curriculum Tiers */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Curriculum Tiers
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onLaunchStudio('SS1')} className="hover:text-cyan-300 transition-colors">
                  SS1: Plane Geometry
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchStudio('SS2')} className="hover:text-cyan-300 transition-colors">
                  SS2: Solid & Orthographics
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchStudio('SS3')} className="hover:text-cyan-300 transition-colors">
                  SS3: Exam Revision & Plans
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchStudio('HIGHER_INSTITUTION')} className="hover:text-cyan-300 transition-colors">
                  Higher Inst & Technical CAD
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Features */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Features
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onLaunchStudio('SS1')} className="hover:text-cyan-300 transition-colors">
                  Traditional Drawing Board
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchStudio('SS2')} className="hover:text-cyan-300 transition-colors">
                  Vector CAD Workstation
                </button>
              </li>
              <li>
                <button onClick={onOpenVideoTour} className="hover:text-cyan-300 transition-colors">
                  Interactive Video Tour
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchStudio('SS3')} className="hover:text-cyan-300 transition-colors">
                  10-Yr WAEC Past Papers
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('SIGN_IN')} className="hover:text-cyan-300 transition-colors">
                  Teacher Lesson Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Portals */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Portals & Access
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onOpenAuth('SIGN_IN')} className="hover:text-cyan-300 transition-colors">
                  Student Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('SIGN_IN')} className="hover:text-cyan-300 transition-colors">
                  Technical Teacher Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('SIGN_IN')} className="hover:text-cyan-300 transition-colors">
                  Parent Monitoring Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('SIGN_IN')} className="hover:text-cyan-300 transition-colors">
                  School Admin Licensing
                </button>
              </li>
              <li>
                <span className="text-slate-500">Paystack / Flutterwave</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Drafthands Academy. Aligned with NERDC, WAEC, NECO & NBTE standards.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>ISO 128 Engineering Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
