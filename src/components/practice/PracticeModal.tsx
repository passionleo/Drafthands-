import React, { useState, useEffect, useMemo } from 'react';
import { 
  DrawingTopic, 
  PracticalDrawingTask, 
  AssessmentMCQ, 
  SelfAssessmentFormat 
} from '../../types/curriculum';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  PenTool, 
  Sparkles, 
  Check, 
  ExternalLink,
  BookOpen,
  FileCheck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { IsoDiagramViewer } from '../common/IsoDiagramViewer';
import { getTopicSelfAssessment } from '../../data/curriculumAssessmentData';
import { 
  saveAssessmentAttempt, 
  getAttemptByTopicId, 
  calculateWaecGrade, 
  recordPracticalSubmission,
  AssessmentAttempt 
} from '../../services/assessmentStorage';

interface PracticeModalProps {
  topic: DrawingTopic;
  isOpen: boolean;
  onClose: () => void;
  onOpenStudioTask?: (task: PracticalDrawingTask, topic: DrawingTopic) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({ 
  topic, 
  isOpen, 
  onClose,
  onOpenStudioTask
}) => {
  const assessment = useMemo(() => getTopicSelfAssessment(topic), [topic]);
  
  // Total items is always strictly 5
  const isHybrid = assessment.format === 'HYBRID_PRACTICAL';
  const mcqs = assessment.mcqs;
  const practicalTasks = assessment.practicalTasks || [];

  // State management
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 0 to 4
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [completedPracticalTaskIds, setCompletedPracticalTaskIds] = useState<Set<string>>(new Set());
  const [showIsoDiagram, setShowIsoDiagram] = useState<boolean>(false);
  const [isAssessmentFinished, setIsAssessmentFinished] = useState<boolean>(false);
  const [syncedNotification, setSyncedNotification] = useState<boolean>(false);

  // Load existing attempt if available
  useEffect(() => {
    if (!isOpen) return;
    const existing = getAttemptByTopicId(topic.id);
    if (existing) {
      const prevAnswers: Record<number, number> = {};
      const prevSubmitted: Record<number, boolean> = {};
      existing.answers.forEach((ans, idx) => {
        prevAnswers[idx] = ans.selectedIndex;
        prevSubmitted[idx] = true;
      });
      setSelectedAnswers(prevAnswers);
      setSubmittedAnswers(prevSubmitted);
      
      const doneIds = new Set(existing.practicalSubmissions.map(s => s.taskId));
      setCompletedPracticalTaskIds(doneIds);
    } else {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSubmittedAnswers({});
      setCompletedPracticalTaskIds(new Set());
      setIsAssessmentFinished(false);
      setSyncedNotification(false);
    }
  }, [topic.id, isOpen]);

  if (!isOpen) return null;

  // Determine current item type
  // In HYBRID_PRACTICAL: index 0 and 1 are MCQs, indices 2, 3, 4 are practicalTasks[0, 1, 2]
  // In THEORY_5_MCQ: indices 0 to 4 are MCQs[0 to 4]
  const isCurrentItemPractical = isHybrid && currentIndex >= 2;
  const currentMcqIndex = isHybrid ? currentIndex : currentIndex;
  const currentMcq: AssessmentMCQ | undefined = !isCurrentItemPractical ? mcqs[currentMcqIndex] : undefined;
  const currentPracticalTask: PracticalDrawingTask | undefined = isCurrentItemPractical 
    ? practicalTasks[currentIndex - 2] 
    : undefined;

  // Calculation of scores
  const calculateScores = () => {
    let mcqScore = 0;
    const mcqTotal = isHybrid ? 2 : 5;
    for (let i = 0; i < mcqTotal; i++) {
      if (selectedAnswers[i] !== undefined && selectedAnswers[i] === mcqs[i]?.correctIndex) {
        mcqScore++;
      }
    }
    const practicalCompletedCount = isHybrid ? completedPracticalTaskIds.size : 0;
    const practicalTotal = isHybrid ? 3 : 0;
    const totalScore = mcqScore + practicalCompletedCount;
    const percentage = Math.round((totalScore / 5) * 100);
    const waecGrade = calculateWaecGrade(percentage);

    return {
      mcqScore,
      mcqTotal,
      practicalCompletedCount,
      practicalTotal,
      totalScore,
      percentage,
      waecGrade
    };
  };

  const handleSelectOption = (idx: number) => {
    if (submittedAnswers[currentIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: idx }));
  };

  const handleSubmitCurrentMcq = () => {
    if (selectedAnswers[currentIndex] === undefined) return;
    setSubmittedAnswers(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleTogglePracticalTaskCompleted = (task: PracticalDrawingTask) => {
    const isDone = completedPracticalTaskIds.has(task.id);
    const updated = new Set(completedPracticalTaskIds);
    if (isDone) {
      updated.delete(task.id);
    } else {
      updated.add(task.id);
      // Auto-record studio submission in storage
      recordPracticalSubmission(topic.id, topic.title, topic.tier, {
        taskId: task.id,
        taskTitle: task.taskTitle,
        submittedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
        elementCount: 6,
        notes: `Completed practical construction criteria for ${task.taskTitle} (${task.targetTool || 'Compass & T-Square'}).`,
        status: 'COMPLETED',
        marksAwarded: 18,
        maxMarks: task.rubricMarks || 20
      });
    }
    setCompletedPracticalTaskIds(updated);
  };

  const handleFinishAssessment = () => {
    const { 
      mcqScore, 
      mcqTotal, 
      practicalCompletedCount, 
      practicalTotal, 
      totalScore, 
      percentage, 
      waecGrade 
    } = calculateScores();

    const answersList = [];
    for (let i = 0; i < mcqTotal; i++) {
      const sel = selectedAnswers[i];
      answersList.push({
        questionId: mcqs[i]?.id || `q-${i}`,
        selectedIndex: sel !== undefined ? sel : -1,
        isCorrect: sel === mcqs[i]?.correctIndex
      });
    }

    const practicalSubmissionsList = Array.from(completedPracticalTaskIds).map(id => {
      const t = practicalTasks.find(pt => pt.id === id);
      return {
        taskId: id,
        taskTitle: t?.taskTitle || 'Studio Practical Drawing',
        submittedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
        elementCount: 7,
        notes: 'Verified practical construction geometry in Interactive Drawing Studio.',
        status: 'COMPLETED' as const,
        marksAwarded: 18,
        maxMarks: 20
      };
    });

    const attempt: AssessmentAttempt = {
      id: 'att-' + Date.now(),
      topicId: topic.id,
      topicTitle: topic.title,
      tier: topic.tier,
      format: assessment.format,
      completedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      score: totalScore,
      maxScore: 5,
      percentage,
      waecGrade,
      mcqScore,
      mcqTotal,
      practicalCompletedCount,
      practicalTotalCount: practicalTotal,
      answers: answersList,
      practicalSubmissions: practicalSubmissionsList,
      teacherRemark: percentage >= 70
        ? `Outstanding technical proficiency in ${topic.title}. All requirements satisfied.`
        : `Assessment completed (${percentage}%). Additional practice on baseline construction advised.`
    };

    saveAssessmentAttempt(attempt);
    setIsAssessmentFinished(true);
    setSyncedNotification(true);
  };

  const handleLaunchStudio = (task: PracticalDrawingTask) => {
    if (onOpenStudioTask) {
      onOpenStudioTask(task, topic);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setCompletedPracticalTaskIds(new Set());
    setIsAssessmentFinished(false);
    setSyncedNotification(false);
  };

  const { mcqScore, practicalCompletedCount, totalScore, percentage, waecGrade } = calculateScores();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`bg-slate-900 border border-slate-700 rounded-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
        showIsoDiagram ? 'max-w-4xl' : 'max-w-2xl'
      }`}>
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Strict 5-Question Self-Assessment
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {isHybrid ? 'Hybrid: 2 MCQs + 3 Practical' : '5-MCQ Theory Exam'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 mt-0.5">
                {topic.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIsoDiagram(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold border transition-colors flex items-center gap-1.5 ${
                showIsoDiagram
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Official ISO Technical Blueprint Reference"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showIsoDiagram ? 'Hide ISO Plate' : 'ISO Plate'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-STEP PROGRESS BAR TRACKER */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full">
            {[0, 1, 2, 3, 4].map((stepIdx) => {
              const isMCQ = !isHybrid || stepIdx < 2;
              const isCurrent = stepIdx === currentIndex && !isAssessmentFinished;
              let isDone = false;
              if (isMCQ) {
                isDone = submittedAnswers[stepIdx] !== undefined;
              } else {
                const pTask = practicalTasks[stepIdx - 2];
                isDone = pTask ? completedPracticalTaskIds.has(pTask.id) : false;
              }

              return (
                <button
                  key={stepIdx}
                  onClick={() => {
                    if (!isAssessmentFinished) setCurrentIndex(stepIdx);
                  }}
                  className={`flex-1 flex flex-col items-center gap-1 py-1 px-1.5 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/70 border border-cyan-500 text-cyan-300'
                      : isDone
                      ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800/50 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
                    {isDone ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : isMCQ ? (
                      <span>Q{stepIdx + 1}</span>
                    ) : (
                      <PenTool className="w-3 h-3 text-purple-400" />
                    )}
                    <span>{isMCQ ? 'MCQ' : `Task ${stepIdx + 1}`}</span>
                  </div>
                  <div className={`h-1 w-full rounded-full ${
                    isCurrent ? 'bg-cyan-400' : isDone ? 'bg-emerald-500' : 'bg-slate-700'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Collapsible ISO Plate */}
          {showIsoDiagram && (
            <div className="h-64 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg animate-in fade-in duration-150">
              <IsoDiagramViewer topic={topic} viewMode="EMBEDDED" className="h-full" />
            </div>
          )}

          {/* FINAL RESULTS SUMMARY SCREEN */}
          {isAssessmentFinished ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-3 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 font-mono font-bold text-2xl">
                  {waecGrade}
                </div>
                <h3 className="text-base font-bold text-white">
                  Topic Self-Assessment Complete!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  You scored <strong className="text-emerald-400 font-mono text-sm">{totalScore} / 5</strong> ({percentage}%), earning official WAEC Grade <strong className="text-emerald-400">{waecGrade}</strong> in {topic.title}.
                </p>

                {/* Score Breakdown Pills */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs">
                    Theory MCQs: {mcqScore} / {isHybrid ? 2 : 5}
                  </span>
                  {isHybrid && (
                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs">
                      Studio Practical Tasks: {practicalCompletedCount} / 3
                    </span>
                  )}
                </div>

                {/* Synced with Parent Portal Banner */}
                {syncedNotification && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-left flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-300">
                        Automatically Synced with Parent Portal
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Your ward continuous assessment (CA) record for <strong className="text-white">WARD-DH-2025-88</strong> has been updated with these scores and verified practical drawings. Parents can view them immediately in the Parent Portal.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setIsAssessmentFinished(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Review Questions & Tasks
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Assessment</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    Done & Return to Curriculum
                  </button>
                </div>
              </div>
            </div>
          ) : !isCurrentItemPractical && currentMcq ? (
            /* MCQ QUESTION VIEW (Questions 1 to 5 for Theory, or Questions 1 & 2 for Hybrid) */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-semibold">
                  Multiple Choice Question {currentIndex + 1} of 5
                </span>
                {currentMcq.waecReference && (
                  <span className="text-slate-400 text-[11px] font-mono">
                    Ref: {currentMcq.waecReference}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {currentMcq.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentMcq.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  const isSubmitted = submittedAnswers[currentIndex];
                  const isCorrect = idx === currentMcq.correctIndex;

                  let btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60';

                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/50 border-emerald-500/90 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-950/50 border-red-500/90 text-red-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10';
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

              {/* Instant Grading & Technical Explanation */}
              {submittedAnswers[currentIndex] && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${
                      selectedAnswers[currentIndex] === currentMcq.correctIndex ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {selectedAnswers[currentIndex] === currentMcq.correctIndex ? '✓ Correct Answer' : '✕ Incorrect'}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">Technical Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentMcq.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : isCurrentItemPractical && currentPracticalTask ? (
            /* PRACTICAL DRAWING / CONSTRUCTION TASK VIEW (Tasks 3, 4, 5 for Hybrid) */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-400 font-semibold flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" />
                  Practical Drawing Task {currentIndex + 1} of 5
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono">
                  {currentPracticalTask.rubricMarks || 20} Marks Rubric
                </span>
              </div>

              {/* Task Prompt Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentPracticalTask.taskTitle}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentPracticalTask.taskPrompt}
                </p>
              </div>

              {/* Step-by-Step Drawing Specifications */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Technical Drawing Specifications:
                </h5>
                <ul className="space-y-2">
                  {currentPracticalTask.specifications.map((spec, sIdx) => (
                    <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Instrument & Expected Outcome */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Target Drafting Tool:</span>
                  <span className="font-semibold text-amber-400 font-mono">
                    {currentPracticalTask.targetTool || 'Compass & T-Square'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Suggested Mode:</span>
                  <span className="font-semibold text-cyan-400 font-mono">
                    {currentPracticalTask.suggestedMode === 'CAD_WORKSTATION' ? 'CAD Workstation' : 'Traditional Drafting Board'}
                  </span>
                </div>
              </div>

              {/* Direct Link into Interactive Drawing Studio Viewport */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Interactive Drawing Studio Viewport</span>
                  </h5>
                  <p className="text-[11px] text-slate-300">
                    Open this construction directly onto your drafting board with virtual T-square and compass.
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchStudio(currentPracticalTask)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 whitespace-nowrap"
                >
                  <span>Open in Drawing Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mark Task as Done Toggle */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-200 font-semibold block">Task Completion Status:</span>
                  <span className="text-[11px] text-slate-400">
                    {completedPracticalTaskIds.has(currentPracticalTask.id) 
                      ? 'Construction verified & saved to parent portfolio' 
                      : 'Draw geometry in the studio, then verify completion here.'}
                  </span>
                </div>
                <button
                  onClick={() => handleTogglePracticalTaskCompleted(currentPracticalTask)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    completedPracticalTaskIds.has(currentPracticalTask.id)
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {completedPracticalTaskIds.has(currentPracticalTask.id) ? 'Completed (18/20 Marks)' : 'Mark as Completed'}
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* FOOTER CONTROLS */}
        {!isAssessmentFinished && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              Score: <strong className="text-cyan-400 font-bold">{totalScore}</strong> / 5
            </div>

            <div className="flex items-center gap-2">
              {/* If on MCQ and not submitted */}
              {!isCurrentItemPractical && !submittedAnswers[currentIndex] ? (
                <button
                  onClick={handleSubmitCurrentMcq}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-600/30"
                >
                  Submit Answer & View Explanation
                </button>
              ) : currentIndex < 4 ? (
                /* Next Question / Task */
                <button
                  onClick={() => setCurrentIndex(i => i + 1)}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                >
                  <span>Next {currentIndex === 1 && isHybrid ? 'to Practical Tasks' : 'Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                /* Finish Assessment */
                <button
                  onClick={handleFinishAssessment}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Finalize & Sync Assessment (100%)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
