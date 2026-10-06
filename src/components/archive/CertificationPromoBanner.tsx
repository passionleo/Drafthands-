import React from 'react';
import { Award, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CertificationPromoBannerProps {
  onUnlockPro: () => void;
  isPro: boolean;
}

export const CertificationPromoBanner: React.FC<CertificationPromoBannerProps> = ({
  onUnlockPro,
  isPro
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl space-y-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-15 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Official Professional Certification Program</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Get Certified in Technical Drawing & CAD — Endorsed by Engr. Kolawole O. Kayode (ISL)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Designed for secondary students, technical college apprentices, and engineering undergraduates. Pass our authenticated WAEC, NECO & NABTEB CBT examinations to earn a verifiable Certificate of Proficiency signed by the Technical Drawing Department, International School, University of Lagos.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-300 pt-1">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO 128 Standards</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> NERDC Syllabus Mapped</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Secure Digital Credential</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-3 w-full lg:w-auto">
          {isPro ? (
            <div className="px-6 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs text-center flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pro Certification Access Active</span>
            </div>
          ) : (
            <button
              onClick={onUnlockPro}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unlock Certification via Pro Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-400">Available for Individual Scholars & School Groups</span>
        </div>
      </div>
    </div>
  );
};
