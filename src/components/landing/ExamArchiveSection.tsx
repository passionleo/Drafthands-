import React from 'react';
import { 
  FileCheck2, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Download, 
  BookOpen, 
  HelpCircle,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { PastQuestionsPortal } from '../archive/PastQuestionsPortal';

interface ExamArchiveSectionProps {
  onLaunchTopic: (topicId: string) => void;
  onOpenAuth: (mode?: 'SIGN_IN' | 'REGISTER') => void;
  onOpenPastQuestionsHub?: () => void;
}

export const ExamArchiveSection: React.FC<ExamArchiveSectionProps> = ({
  onLaunchTopic,
  onOpenAuth,
  onOpenPastQuestionsHub
}) => {
  const { isSubscribed, openPaywall } = useSubscription();
  const userTier: 'free' | 'pro' = isSubscribed ? 'pro' : 'free';
  const examCategories = [
    {
      title: 'WAEC WASSCE (May/June & Nov/Dec)',
      badge: 'Paper 2 Practical & Theory',
      years: '2014 – 2024 (10 Years)',
      successRate: '98% Distinction Rate',
      color: 'border-cyan-500/40 text-cyan-300',
      description: 'Comprehensive solutions covering Building & Mechanical Drawing options, isometric exploded views, and locus of cycloids.',
      keyQuestions: [
        'Tangency: Internal & External Curves to unequal circles',
        'Orthographic: 1st Angle conversions from isometric stepped blocks',
        'Sectional Views: Offset cutting planes and 45° cross hatching',
        'Roof Trusses: King-post and Queen-post timber joints'
      ]
    },
    {
      title: 'NECO SSCE Technical Drawing',
      badge: 'Senior Secondary Certificate',
      years: '2015 – 2024 Archive',
      successRate: '96% Pass Guarantee',
      color: 'border-emerald-500/40 text-emerald-300',
      description: 'Verified solutions for plane geometry, ellipse concentric circles construction, and true shape of inclined surfaces.',
      keyQuestions: [
        'Conic Sections: Ellipse by rectangular and focal point methods',
        'Developments: Frustum of hexagonal pyramid and right cone',
        'Interpenetration: Cylinder intersecting cylinder at 90°',
        'Lettering & Title Blocks: 5mm uppercase standard fonts'
      ]
    },
    {
      title: 'NABTEB Modular Trade Exams',
      badge: 'National Technical Certificate',
      years: 'NTC & ANTC Past Papers',
      successRate: '100% Practical Proficiency',
      color: 'border-purple-500/40 text-purple-300',
      description: 'Vocational workshop drafting for mechanical engineering craft practice, vehicle body building, and electrical installations.',
      keyQuestions: [
        'Fasteners: Square and Hexagonal nuts, bolts and washers',
        'Piping Schematics: Single-line hydraulic & pneumatic flow',
        'Weldment Symbols: Fillet, butt and spot weld ISO notations',
        'Foundation Footings: 150mm & 225mm masonry block walls'
      ]
    }
  ];

  return (
    <section id="past-questions" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Background Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>10-Year National Exam Mastery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            WAEC, NECO & NABTEB Past Questions with Step-by-Step Marking Keys
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Never lose marks to faint construction arcs, wrong line weights, or forgotten centerlines.
          </p>
        </div>

        {/* Highlighted Launch Banner for the Interactive Hub */}
        {onOpenPastQuestionsHub && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-900 border border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl shadow-emerald-950/30">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Interactive Past Questions & Vector Solutions Hub
                  </h3>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    2016–2026 Archive
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Interactive Paper 1 MCQ Quiz Engine with real-time score tally & timer, plus Paper 2 & Paper 3 Step-by-Step SVG Construction Sliders from blank drawing board to finished thick outlines.
                </p>
              </div>
            </div>

            <button
              id="btn-landing-open-past-questions"
              onClick={onOpenPastQuestionsHub}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 group"
            >
              <span>Launch Interactive Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* 3 Exam Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {examCategories.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    {cat.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {cat.years}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Marking Breakdown Rubric Table */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Mark Allocation Key</span>
                    <span className="text-emerald-400">Total: 25 Marks</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span>Baseline & Datum:</span>
                      <span className="text-slate-200 font-mono">5 marks</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span>2H Construction Loci:</span>
                      <span className="text-slate-200 font-mono">10 marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HB Outline Finish:</span>
                      <span className="text-slate-200 font-mono">6 marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimensions & Titles:</span>
                      <span className="text-slate-200 font-mono">4 marks</span>
                    </div>
                  </div>
                </div>

                {/* Sample Key Questions */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-slate-300">
                    Frequently Repeated Practical Problems:
                  </div>
                  {cat.keyQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {cat.successRate}
                </span>
                <button
                  onClick={() => onLaunchTopic('ss3-waec-past-question')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
                >
                  <span>Practice Questions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Examiner Trap Warning Alert Box */}
        <div className="mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-amber-200">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-300 block mb-0.5">
              WAEC Chief Examiner Critical Notice (Rule on Construction Arcs):
            </span>
            <span className="text-amber-200/90 leading-relaxed">
              "Candidates are strictly penalized for erasing compass construction lines. All bisection arcs, tangent loci, and projection rays must remain clearly visible using light 2H lead lines (0.25mm) while finished outlines are highlighted in crisp 0.7mm HB."
            </span>
          </div>
          <button
            onClick={() => onLaunchTopic('ss1-bisection-line')}
            className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
          >
            Learn Line Rules
          </button>
        </div>

        {/* Tier-Gated Verified Examination Archive Portal */}
        <div className="mt-12 sm:mt-16">
          <PastQuestionsPortal 
            userTier={userTier} 
            onUpgradeRequest={() => openPaywall()}
          />
        </div>

      </div>
    </section>
  );
};
