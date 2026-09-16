import React, { useState } from 'react';
import { DrawingTopic } from '../../types/curriculum';
import { X, Award, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, RotateCcw, Compass } from 'lucide-react';
import { IsoDiagramViewer } from '../common/IsoDiagramViewer';

interface PracticeModalProps {
  topic: DrawingTopic;
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TOPIC_QUESTIONS: Record<string, Question[]> = {
  'ss1-bisect-line': [
    {
      question: 'What is the mandatory condition for the compass radius (r) when striking arcs to bisect line AB?',
      options: [
        'Radius r must be equal to AB / 4',
        'Radius r must be strictly greater than half the length of AB (r > AB / 2)',
        'Radius r must be exactly equal to AB * 2',
        'Radius r must be smaller than AB / 3'
      ],
      correctIndex: 1,
      explanation: 'If the compass radius is less than half the line length, the circular loci will never intersect, making bisection impossible.'
    },
    {
      question: 'Which ISO line weight and pencil grade is recommended for the construction arcs?',
      options: [
        'Continuous Thick (0.5mm, HB Pencil)',
        'Continuous Thin (0.25mm, 2H/3H Pencil)',
        'Thin Dashed (0.25mm, 4B Pencil)',
        'Thick Chain (0.7mm, Marker)'
      ],
      correctIndex: 1,
      explanation: 'All construction arcs must be drawn with a hard 2H/3H pencil in Continuous Thin line (0.25mm) so they do not overpower finished outlines.'
    }
  ],
  'ss2-tangency-external': [
    {
      question: 'In the construction of an external common tangent to two circles of radii R1 and R2, what radius is used for the auxiliary circle?',
      options: [
        'R1 + R2 (Sum circle)',
        'R1 - R2 (Difference circle)',
        'sqrt(R1 * R2)',
        '(R1 + R2) / 2'
      ],
      correctIndex: 1,
      explanation: 'For external tangents, the auxiliary circle radius is the difference (R1 - R2), reducing the problem to drawing a tangent from center O2 to this smaller circle.'
    },
    {
      question: 'What is the geometric relationship between the normal radius line at point of contact T1 and the common tangent line?',
      options: [
        'They are inclined at 45°',
        'They are parallel to each other',
        'They are strictly perpendicular (90°)',
        'They are coincident'
      ],
      correctIndex: 2,
      explanation: 'A tangent to any circle is always strictly perpendicular to the normal radial vector at the point of tangency.'
    }
  ]
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    question: 'What is the standard angle for the receding axes in an Isometric Drawing projection?',
    options: ['45° to the horizontal', '30° to the horizontal', '60° to the horizontal', '15° to the horizontal'],
    correctIndex: 1,
    explanation: 'Isometric axes are inclined at 30° to the horizontal baseline on either side and 90° vertically, yielding 120° between all three coordinate axes.'
  },
  {
    question: 'In First Angle Orthographic Projection, where is the Plan (Top) View positioned relative to the Front Elevation?',
    options: [
      'Directly ABOVE the Front Elevation',
      'Directly BELOW the Front Elevation',
      'To the far right of the page',
      'In isometric perspective'
    ],
    correctIndex: 1,
    explanation: 'In First Angle projection, the observer looks from above and projects onto the plane below, placing the Plan directly underneath the Front Elevation.'
  }
];

export const PracticeModal: React.FC<PracticeModalProps> = ({ topic, isOpen, onClose }) => {
  if (!isOpen) return null;

  const questions = TOPIC_QUESTIONS[topic.id] || DEFAULT_QUESTIONS;
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showIsoDiagram, setShowIsoDiagram] = useState<boolean>(false);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (!isSubmitted) setSelectedAnswer(idx);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      // Finished all
      setIsSubmitted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`bg-slate-900 border border-slate-700 rounded-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
        showIsoDiagram ? 'max-w-4xl' : 'max-w-xl'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                WAEC / NERDC Examination Check
              </span>
              <h2 className="text-sm font-bold text-slate-100">
                {topic.title} - Question {currentQIndex + 1} of {questions.length}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIsoDiagram(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-colors flex items-center gap-1.5 ${
                showIsoDiagram
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Official ISO Technical Diagram Reference"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showIsoDiagram ? 'Hide Diagram' : 'ISO Diagram'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Collapsible ISO Technical Blueprint Reference Plate */}
          {showIsoDiagram && (
            <div className="h-72 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg animate-in fade-in duration-150">
              <IsoDiagramViewer 
                topic={topic}
                viewMode="EMBEDDED"
                className="h-full"
              />
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60';

              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-950/40 border-red-500/80 text-red-300';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-slate-300 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isSubmitted && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 animate-in fade-in">
              <strong className="text-xs font-mono font-bold text-cyan-400 block">
                Technical Explanation:
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Score: <strong className="text-cyan-400">{score}</strong> / {questions.length}
          </div>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-600/30"
              >
                Submit Answer
              </button>
            ) : currentQIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Exam Check</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
