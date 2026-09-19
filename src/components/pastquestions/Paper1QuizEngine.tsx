import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  Award, 
  BookOpen,
  Info,
  Pause,
  Play
} from 'lucide-react';
import { MCQuestion } from '../../types/pastQuestions';
import { useSubscription } from '../../context/SubscriptionContext';
import { payWithPaystack, formatNaira } from '../../utils/paystack';
import { SUBSCRIPTION_PLANS } from '../../types/subscription';

interface Paper1QuizEngineProps {
  questions: MCQuestion[];
  paperTitle: string;
  examBody: string;
  year: number;
  durationMinutes?: number;
  onOpenPaywall?: () => void;
}

export const Paper1QuizEngine: React.FC<Paper1QuizEngineProps> = ({
  questions,
  paperTitle,
  examBody,
  year,
  durationMinutes = 60,
  onOpenPaywall
}) => {
  const { isSubscribed, subscription, subscribeToPlan } = useSubscription();
  const isFullAccess = isSubscribed || subscription.plan !== 'FREE' || subscription.userRole === 'TEACHER' || subscription.userRole === 'ADMIN';

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const currentQ = questions[currentIndex] || questions[0];
  const isLocked = !isFullAccess && Boolean(currentQ && !currentQ.isFreePreview);

  // Early guard if no questions exist
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <BookOpen className="w-10 h-10 text-slate-600" />
        <h3 className="text-base font-bold text-white">No Objective Questions Found</h3>
        <p className="text-xs text-slate-400 max-w-md">
          Please select another examination year or exam body from the navigation controls above.
        </p>
      </div>
    );
  }

  // Calculate score statistics
  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  let incorrectCount = 0;

  questions.forEach((q, idx) => {
    const ans = selectedAnswers[idx];
    if (ans) {
      if (ans === q.correctKey) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  });

  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // WAEC Grade Equivalence
  const getGrade = (pct: number) => {
    if (pct >= 75) return { grade: 'A1', label: 'Distinction (Excellent)', color: 'text-emerald-400' };
    if (pct >= 70) return { grade: 'B2', label: 'Very Good', color: 'text-emerald-300' };
    if (pct >= 65) return { grade: 'B3', label: 'Good', color: 'text-cyan-400' };
    if (pct >= 60) return { grade: 'C4', label: 'Credit (Upper)', color: 'text-cyan-300' };
    if (pct >= 55) return { grade: 'C5', label: 'Credit', color: 'text-blue-400' };
    if (pct >= 50) return { grade: 'C6', label: 'Credit (Pass)', color: 'text-amber-400' };
    if (pct >= 45) return { grade: 'D7', label: 'Pass', color: 'text-orange-400' };
    if (pct >= 40) return { grade: 'E8', label: 'Weak Pass', color: 'text-orange-500' };
    return { grade: 'F9', label: 'Fail / Needs Review', color: 'text-rose-400' };
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isLocked) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: key
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeftSeconds(durationMinutes * 60);
    setIsTimerRunning(true);
    setIsCompleted(false);
  };

  const handlePaystackUnlock = () => {
    if (onOpenPaywall) {
      onOpenPaywall();
      return;
    }
    setIsCheckingOut(true);
    const plan = SUBSCRIPTION_PLANS['STUDENT_SESSION'];
    payWithPaystack({
      email: 'student@drafthands.edu.ng',
      amount: plan.priceNGN,
      planType: 'STUDENT_SESSION',
      planName: `${examBody} 10-Year Archive Full Access`,
      userRole: 'STUDENT',
      customerName: 'Drafthands Scholar',
      onSuccess: (res) => {
        setIsCheckingOut(false);
        subscribeToPlan('STUDENT_SESSION', res.reference);
      },
      onClose: () => setIsCheckingOut(false),
      onError: () => setIsCheckingOut(false)
    });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedAnswer = selectedAnswers[currentIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQ.correctKey;

  return (
    <div className="w-full flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Engine Header: Timer, Score Tally & Controls */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
            {examBody} {year}
          </span>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{paperTitle}</span>
              <span className="text-[11px] font-mono text-slate-400">
                (Q{currentIndex + 1} of {questions.length})
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              ISO 128 & BS 8888 Interactive Marking Scheme
            </p>
          </div>
        </div>

        {/* Live Score Tally & Timer */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">{formatTimer(timeLeftSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:text-white transition-colors"
              title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {correctCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {incorrectCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-semibold">{accuracyPct}%</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetQuiz}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Reset Quiz & Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body: Question Display or Locked Paywall Card */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {isLocked ? (
          /* PAYWALL GATING CARD FOR QUESTIONS 3+ */
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/40 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Pro Technical Drawing Past Questions Archive
              </div>
              <h3 className="text-xl font-bold text-white">
                Unlock Full 10-Year {examBody} Solutions (2016–2026)
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                You have previewed the 2 free sample questions for this paper. Active subscription unlocks all 50 questions per paper, detailed ISO line references, and Paper 2/3 step-by-step vector constructions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete WAEC, NECO & NABTEB Papers (2016–2026)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-resolution SVG Step-by-Step Sliders</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NERDC & WAEC Marking Scheme Mark Breakdowns</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paystack Instant NGN Activation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-unlock-past-questions"
                onClick={handlePaystackUnlock}
                disabled={isCheckingOut}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCheckingOut ? 'Opening Paystack...' : `Unlock Full Archive (${formatNaira(SUBSCRIPTION_PLANS.STUDENT_SESSION.priceNGN)})`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE INTERACTIVE MCQ QUESTION */
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                  {currentQ.topicCategory}
                </span>
                <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {currentQ.isoStandardRef}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                <span className="text-cyan-400 font-mono mr-2">{currentIndex + 1}.</span>
                {currentQ.questionText}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map(opt => {
                const isSelected = selectedAnswer === opt.key;
                const isThisCorrect = opt.key === currentQ.correctKey;
                const showValidation = isAnswered && instantFeedback;

                let btnStyles = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60';
                if (showValidation) {
                  if (isThisCorrect) {
                    btnStyles = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40';
                  } else if (isSelected) {
                    btnStyles = 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40';
                  }
                } else if (isSelected) {
                  btnStyles = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/40';
                }

                return (
                  <button
                    key={opt.key}
                    id={`opt-q${currentIndex + 1}-${opt.key}`}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full p-4 rounded-xl border text-left text-sm flex items-center justify-between gap-4 transition-all duration-150 ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        showValidation && isThisCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : showValidation && isSelected
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>

                    {showValidation && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {showValidation && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed ISO Standard & WAEC Line Explanation */}
            {isAnswered && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-wide">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {isCorrect ? 'Correct! ISO Reference Note' : 'Incorrect — Official WAEC / ISO Marking Scheme'}
                  </span>
                </div>
                <p className="text-slate-200 font-sans text-xs sm:text-sm pl-6">
                  {currentQ.explanation}
                </p>
                <div className="pt-2 pl-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Standard: {currentQ.isoStandardRef}</span>
                  <span className="text-cyan-400">WAEC Objective Code TD-P1</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation & Question Palette */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Question Selector Palette Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {questions.map((q, idx) => {
            const isAns = selectedAnswers[idx] !== undefined;
            const isCurr = idx === currentIndex;
            const isLockedQuestion = !isFullAccess && !q.isFreePreview;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  isCurr
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                    : isLockedQuestion
                    ? 'bg-slate-900 text-slate-500 hover:text-amber-400 border border-slate-800'
                    : isAns
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
                title={`Question ${idx + 1} ${isLockedQuestion ? '(Pro Gated)' : ''}`}
              >
                {isLockedQuestion ? <Lock className="w-3 h-3" /> : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white flex items-center gap-1.5 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
