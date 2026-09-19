import React, { useState, useEffect } from 'react';
import { DrawingTopic } from '../../types/curriculum';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  Sparkles, 
  Check, 
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface PracticeModalProps {
  topic: DrawingTopic;
  isOpen: boolean;
  onClose: () => void;
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  waecTip: string;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({ 
  topic, 
  isOpen, 
  onClose 
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Generate safe, topic-specific practice questions
  const questions: PracticeQuestion[] = React.useMemo(() => {
    const title = topic?.title || 'Technical Drawing';
    const code = topic?.moduleCode || 'TD';
    const waecRef = topic?.standards?.waecRef || 'WAEC TD Section A';

    return [
      {
        id: 'q1',
        question: `In accordance with ${waecRef}, what is the primary standard instrument used when working on ${title}?`,
        options: [
          'Pair of compasses with properly sharpened 2H chisel lead',
          'Freehand pencil without any alignment guide',
          'Soft carbon grading sticks',
          'Flexible tailor curve without baseline support'
        ],
        correctIndex: 0,
        explanation: 'Accurate technical drawing demands standardized drafting instruments. For compasses, a 2H lead sharpened with a slight bevel gives consistent arc weights and precise intersections.',
        waecTip: 'Examiners award distinct marks for instrument accuracy and line weight consistency.'
      },
      {
        id: 'q2',
        question: `When executing the procedural steps for ${title}, which pencil grade must be used for initial construction and reference lines?`,
        options: [
          '4B (very soft & dark)',
          '2H or 3H (hard, faint, and sharp continuous line)',
          'HB (medium soft for finished outlines)',
          'Charcoal grading pencil'
        ],
        correctIndex: 1,
        explanation: 'ISO 128 and NERDC prescribe 2H/3H pencils (0.25mm thin continuous line) for construction, projection, and center lines, ensuring they can be clearly distinguished from finished HB outlines.',
        waecTip: 'Do NOT erase construction lines in WAEC examinations; examiners require them as evidence of mathematical construction.'
      },
      {
        id: 'q3',
        question: `Which fundamental geometric or drafting principle governs the construction of ${title}?`,
        options: [
          'Bisection and equidistant locus principles',
          'Random visual approximation',
          'Color shading and artistic chiaroscuro',
          'Arbitrary dimension scaling'
        ],
        correctIndex: 0,
        explanation: 'All engineering drawing constructions rest upon exact Euclidean geometry—such as perpendicular bisection, tangency points, or precise projection angles.',
        waecTip: 'Mark all intersection points clearly with fine needle marks or locus tags.'
      },
      {
        id: 'q4',
        question: `What is the correct standard procedure after establishing all construction points for ${title}?`,
        options: [
          'Firm in the final outline using a crisp HB or 0.5mm line while retaining faint construction lines',
          'Erase all construction lines completely with an abrasive eraser',
          'Trace over every line in thick red marker',
          'Double the dimensions arbitrarily for visibility'
        ],
        correctIndex: 0,
        explanation: 'Once construction points are established and verified, the final required outline is "firmed in" using an HB pencil (0.5mm–0.7mm thick continuous line). Faint construction lines must remain intact.',
        waecTip: 'Line contrast between construction lines and outlines accounts for up to 25% of grading marks.'
      }
    ];
  }, [topic]);

  // Reset state when opening or topic changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setIsQuizComplete(false);
    }
  }, [isOpen, topic?.id]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {topic?.moduleCode || 'TD'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {topic?.tier || 'SS1'} Practice Challenge
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                {topic?.title || 'Technical Drawing Practice'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isQuizComplete ? (
            <>
              {/* Progress and Scrubber */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
                <span className="text-emerald-400 font-bold">Score: {score}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  let optStyle = 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40';

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (idx === selectedOption) {
                      optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    } else {
                      optStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-500 opacity-60';
                    }
                  } else if (selectedOption === idx) {
                    optStyle = 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${optStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isAnswerSubmitted && idx === currentQ.correctIndex
                          ? 'bg-emerald-500 text-slate-950'
                          : isAnswerSubmitted && idx === selectedOption
                          ? 'bg-rose-500 text-white'
                          : selectedOption === idx
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1 mt-0.5 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation / WAEC Exam Tip */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 animate-fade-in ${
                  selectedOption === currentQ.correctIndex 
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' 
                    : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Correct Answer!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Review Technical Note</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed font-normal">
                    {currentQ.explanation}
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong className="text-cyan-300">WAEC Tip:</strong> {currentQ.waecTip}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed Results */
            <div className="text-center py-6 sm:py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Practice Session Complete</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                You scored <span className="font-bold text-emerald-400">{score}</span> out of <span className="font-bold text-white">{questions.length}</span> questions on {topic?.title}.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-w-sm mx-auto text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-mono font-bold text-cyan-400">{Math.round((score / questions.length) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>WAEC Grade Benchmark:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {score === 4 ? 'A1 (Distinction)' : score === 3 ? 'B2 (Very Good)' : score === 2 ? 'C4 (Credit)' : 'Pass (Review Lesson)'}
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Continue Learning</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isQuizComplete && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
