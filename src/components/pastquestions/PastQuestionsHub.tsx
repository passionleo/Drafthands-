import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  Search, 
  Filter, 
  Sparkles, 
  Lock, 
  Unlock, 
  ChevronRight, 
  ArrowLeft, 
  Home, 
  Compass, 
  Layers, 
  Cpu, 
  Building, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { ExamBody, PaperType, PastPaperItem } from '../../types/pastQuestions';
import { ALL_YEARS, PAST_PAPERS_DATABASE } from '../../data/pastQuestionsData';
import { Paper1QuizEngine } from './Paper1QuizEngine';
import { Paper23DrawingEngine } from './Paper23DrawingEngine';
import { useSubscription } from '../../context/SubscriptionContext';
import { payWithPaystack, formatNaira } from '../../utils/paystack';
import { SUBSCRIPTION_PLANS } from '../../types/subscription';

interface PastQuestionsHubProps {
  onBackToStudio?: () => void;
  onReturnToLanding?: () => void;
}

export const PastQuestionsHub: React.FC<PastQuestionsHubProps> = ({
  onBackToStudio,
  onReturnToLanding
}) => {
  const { isSubscribed, subscription, openPaywall, subscribeToPlan } = useSubscription();
  const isFullAccess = isSubscribed || subscription.plan !== 'FREE' || subscription.userRole === 'TEACHER' || subscription.userRole === 'ADMIN';

  // Filters State
  const [selectedExamBody, setSelectedExamBody] = useState<ExamBody>('WAEC');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType>('PAPER_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  // Filter papers based on selections
  const currentPaper = useMemo(() => {
    // 1. Try exact match
    let match = PAST_PAPERS_DATABASE.find(
      p => p.examBody === selectedExamBody && p.year === selectedYear && p.paperType === selectedPaperType
    );

    // 2. If exact match not found for year/exam combo, fall back to closest matching paper
    if (!match) {
      match = PAST_PAPERS_DATABASE.find(
        p => p.examBody === selectedExamBody && p.paperType === selectedPaperType
      );
    }

    // 3. Fallback to any paper matching the type
    if (!match) {
      match = PAST_PAPERS_DATABASE.find(p => p.paperType === selectedPaperType) || PAST_PAPERS_DATABASE[0];
    }

    return match;
  }, [selectedExamBody, selectedYear, selectedPaperType]);

  const handlePaystackQuickUpgrade = () => {
    setIsUpgrading(true);
    const plan = SUBSCRIPTION_PLANS['STUDENT_SESSION'];
    payWithPaystack({
      email: 'student@drafthands.edu.ng',
      amount: plan.priceNGN,
      planType: 'STUDENT_SESSION',
      planName: 'WASSCE & NECO 10-Year Full Archive Pass',
      userRole: 'STUDENT',
      customerName: 'Drafthands Scholar',
      onSuccess: (res) => {
        setIsUpgrading(false);
        subscribeToPlan('STUDENT_SESSION', res.reference);
      },
      onClose: () => setIsUpgrading(false),
      onError: () => setIsUpgrading(false)
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToStudio && (
            <button
              onClick={onBackToStudio}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
              title="Return to CAD & Technical Drawing Studio"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Back to Studio</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Past Questions & Solutions Hub
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  2016–2026 Archive
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Authentic WAEC, NECO & NABTEB Marking Schemes with Interactive Vector Blueprints
              </p>
            </div>
          </div>
        </div>

        {/* User License / Subscription Pill */}
        <div className="flex items-center gap-2">
          {isFullAccess ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>10-Year Archive Unlocked</span>
            </div>
          ) : (
            <button
              onClick={handlePaystackQuickUpgrade}
              disabled={isUpgrading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{isUpgrading ? 'Loading Paystack...' : 'Unlock 10 Years via Paystack'}</span>
            </button>
          )}

          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Return to Home Page"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. FILTERS & NAVIGATION CONTROL BAR */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex flex-col gap-3 shrink-0">
        {/* Row A: Exam Body & Paper Type Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Exam Body Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['WAEC', 'NECO', 'NABTEB'] as ExamBody[]).map(body => {
              const isActive = selectedExamBody === body;
              return (
                <button
                  key={body}
                  id={`btn-filter-exam-${body.toLowerCase()}`}
                  onClick={() => setSelectedExamBody(body)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {body === 'WAEC' ? 'WAEC (WASSCE)' : body}
                </button>
              );
            })}
          </div>

          {/* Paper Type Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="btn-paper-1"
              onClick={() => setSelectedPaperType('PAPER_1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedPaperType === 'PAPER_1'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Paper 1 (MCQ Objectives)</span>
            </button>

            <button
              id="btn-paper-2"
              onClick={() => setSelectedPaperType('PAPER_2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedPaperType === 'PAPER_2'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Paper 2 (Theory Construction)</span>
            </button>

            <button
              id="btn-paper-3"
              onClick={() => setSelectedPaperType('PAPER_3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedPaperType === 'PAPER_3'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Paper 3 (Practical Drawing)</span>
            </button>
          </div>
        </div>

        {/* Row B: 2016-2026 Year Range Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-mono text-slate-400 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Year:
          </span>
          {ALL_YEARS.map(year => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                id={`btn-year-${year}`}
                onClick={() => setSelectedYear(year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE ENGINE VIEWPORT */}
      <main className="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col min-h-0 bg-slate-950">
        {selectedPaperType === 'PAPER_1' ? (
          <Paper1QuizEngine
            questions={currentPaper.mcqs || []}
            paperTitle={currentPaper.title}
            examBody={currentPaper.examBody}
            year={currentPaper.year}
            durationMinutes={currentPaper.durationMinutes}
            onOpenPaywall={openPaywall}
          />
        ) : (
          <Paper23DrawingEngine
            questions={currentPaper.theoryQuestions || []}
            paperTitle={currentPaper.title}
            examBody={currentPaper.examBody}
            year={currentPaper.year}
            paperType={selectedPaperType}
            onOpenPaywall={openPaywall}
          />
        )}
      </main>
    </div>
  );
};
