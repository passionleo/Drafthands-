import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  PenTool, 
  Award,
  Layers,
  FileText,
  Sliders
} from 'lucide-react';
import { TheoryQuestion } from '../../types/pastQuestions';
import { useSubscription } from '../../context/SubscriptionContext';
import { payWithPaystack, formatNaira } from '../../utils/paystack';
import { SUBSCRIPTION_PLANS } from '../../types/subscription';

interface Paper23DrawingEngineProps {
  questions: TheoryQuestion[];
  paperTitle: string;
  examBody: string;
  year: number;
  paperType: 'PAPER_2' | 'PAPER_3';
  onOpenPaywall?: () => void;
}

export const Paper23DrawingEngine: React.FC<Paper23DrawingEngineProps> = ({
  questions,
  paperTitle,
  examBody,
  year,
  paperType,
  onOpenPaywall
}) => {
  const { isSubscribed, subscription, subscribeToPlan } = useSubscription();
  const isFullAccess = isSubscribed || subscription.plan !== 'FREE' || subscription.userRole === 'TEACHER' || subscription.userRole === 'ADMIN';

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isBlueprintTheme, setIsBlueprintTheme] = useState<boolean>(true);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const activeQuestion = questions[activeQuestionIndex] || questions[0];
  const totalSteps = activeQuestion.steps.length;
  const currentStep = activeQuestion.steps[currentStepIndex] || activeQuestion.steps[0];
  const isLocked = !isFullAccess && !activeQuestion.isFreePreview;

  // Auto-play steps simulation
  useEffect(() => {
    if (!isPlaying || isLocked) return;
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, isLocked]);

  // Reset step when switching question
  const handleSelectQuestion = (idx: number) => {
    setActiveQuestionIndex(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
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
      planName: `${examBody} ${paperType === 'PAPER_2' ? 'Paper 2' : 'Paper 3'} 10-Year Vector Archive`,
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

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById(`theory-svg-${activeQuestion.id}`);
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examBody}-${year}-${paperType}-Q${activeQuestion.questionNumber}-Step${currentStepIndex + 1}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Bar: Paper Info & Question Switcher */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            {examBody} {year} • {paperType === 'PAPER_2' ? 'Paper 2 (Theory)' : 'Paper 3 (Practical)'}
          </span>
          <div>
            <h2 className="text-sm font-bold text-white truncate max-w-md">
              {activeQuestion.title}
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Total Marks: {activeQuestion.totalMarks} | Category: {activeQuestion.category}
            </p>
          </div>
        </div>

        {/* Question Selector Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Questions:</span>
          {questions.map((q, idx) => {
            const isCurr = idx === activeQuestionIndex;
            const isLockedQ = !isFullAccess && !q.isFreePreview;

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isCurr
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : isLockedQ
                    ? 'bg-slate-900 text-slate-500 hover:text-amber-300 border border-slate-800'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>Q{q.questionNumber}</span>
                {isLockedQ ? (
                  <Lock className="w-3 h-3 text-amber-400" />
                ) : (
                  <span className="text-[10px] opacity-70">({q.totalMarks}m)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {isLocked ? (
        /* PRO SUBSCRIPTION PAYWALL GATING CARD */
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/60">
          <div className="max-w-2xl w-full p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/40 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Full 10-Year Vector Construction Blueprint
              </div>
              <h3 className="text-xl font-bold text-white">
                Unlock Question {activeQuestion.questionNumber} Step-by-Step Drawing Solution
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                You have reached questions beyond the 2 free sample previews. Unlock all 10 years of {examBody} Paper 2 and Paper 3 authentic marking schemes, high-resolution SVG step sliders, and WAEC examiner notes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Blank board to finished thick outline steps</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exact compass radius & set-square angles</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISO 128 / BS 8888 Line Types & Pencil Grades</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Downloadable Vector Blueprints (SVG)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-unlock-theory-past-questions"
                onClick={handlePaystackUnlock}
                disabled={isCheckingOut}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCheckingOut ? 'Connecting to Paystack...' : `Unlock 10-Year Archive (${formatNaira(SUBSCRIPTION_PLANS.STUDENT_SESSION.priceNGN)})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP-BY-STEP CONSTRUCTION VIEWPORT & CONTROLS */
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Question Details, Given Data & Marking Notes */}
          <div className="w-full lg:w-80 p-4 bg-slate-950/80 border-r border-slate-800 flex flex-col gap-4 overflow-y-auto shrink-0">
            {/* Description Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Problem Statement</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeQuestion.description}
              </p>
            </div>

            {/* Given Parameters */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Given Dimensions & Criteria</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {activeQuestion.givenData.map((data, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{data}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marking Scheme Mark Allocation */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                <span>WAEC Examiner Marking Rubric</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {activeQuestion.markingSchemeNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center Column: High-Res SVG Vector Canvas Viewport */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden">
            {/* Canvas Toolbar */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
              <button
                onClick={() => setIsBlueprintTheme(!isBlueprintTheme)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono"
                title="Toggle Drawing Board Theme"
              >
                {isBlueprintTheme ? 'CAD Grid' : 'Drawing Paper'}
              </button>
              <button
                onClick={handleDownloadSvg}
                className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                title="Download Vector Solution (SVG)"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* SVG Drawing Canvas */}
            <div className={`flex-1 flex items-center justify-center p-4 overflow-auto ${
              isBlueprintTheme 
                ? 'bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]' 
                : 'bg-slate-900'
            }`}>
              <div 
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
                className="w-full max-w-[500px] aspect-[5/4] rounded-xl border border-slate-800/80 bg-slate-950/90 shadow-2xl p-2 relative overflow-hidden flex items-center justify-center"
              >
                {/* Standard ISO Drafting Board Border & Title Block */}
                <svg
                  id={`theory-svg-${activeQuestion.id}`}
                  viewBox="0 0 500 400"
                  className="w-full h-full select-none"
                >
                  {/* Drawing Sheet Inner Frame (ISO 20mm margin) */}
                  <rect x="15" y="15" width="470" height="370" fill="none" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Watermark / Grid Reference */}
                  <line x1="250" y1="15" x2="250" y2="25" stroke="#475569" strokeWidth="1" />
                  <line x1="15" y1="200" x2="25" y2="200" stroke="#475569" strokeWidth="1" />

                  {/* Render Accumulated Step Elements (Shows exact construction progression) */}
                  {activeQuestion.steps.slice(0, currentStepIndex + 1).map((step, idx) => (
                    <g key={step.stepNumber} opacity={idx === currentStepIndex ? 1 : 0.85}>
                      {step.svgElements}
                    </g>
                  ))}

                  {/* Title Block on Bottom Right */}
                  <g transform="translate(320, 345)">
                    <rect x="0" y="0" width="160" height="35" fill="#090d16" stroke="#475569" strokeWidth="1" />
                    <text x="8" y="14" fill="#94a3b8" fontSize="8" fontFamily="monospace">DRAFTHANDS CAD & TD</text>
                    <text x="8" y="27" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {examBody} {year} Q{activeQuestion.questionNumber} • Step {currentStepIndex + 1}/{totalSteps}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom Step Instruction Bar & Slider Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              {/* Step Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      Step {currentStep.stepNumber} of {totalSteps}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {currentStep.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentStep.instruction}
                  </p>
                </div>

                {/* Drafting Instrument & ISO Line Badges */}
                <div className="flex flex-wrap sm:flex-col items-end gap-1 text-[11px] font-mono shrink-0">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ✏️ {currentStep.pencilGrade}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    📏 {currentStep.lineTypeISO}
                  </span>
                  {currentStep.markAllocation && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      {currentStep.markAllocation}
                    </span>
                  )}
                </div>
              </div>

              {/* Slider & Playback Controls */}
              <div className="flex items-center gap-4">
                {/* Play / Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isPlaying 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isPlaying ? 'Pause Step Playback' : 'Auto Play Construction Steps'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>

                {/* Interactive Slider */}
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={totalSteps - 1}
                    value={currentStepIndex}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentStepIndex(Number(e.target.value));
                    }}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={currentStepIndex === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1));
                    }}
                    disabled={currentStepIndex === totalSteps - 1}
                    className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition-colors"
                    title="Next Step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
