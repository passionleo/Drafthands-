import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  PenTool, 
  Tv, 
  Sliders, 
  FileText,
  AlertTriangle,
  ChevronRight,
  Send
} from 'lucide-react';
import { DrawingTopic } from '../../types/curriculum';
import { TeacherAssignment, StudentSubmission } from '../../types/assignments';
import { INITIAL_TEACHER_ASSIGNMENTS, INITIAL_STUDENT_SUBMISSIONS } from '../../data/assignmentsData';

interface StudentAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: DrawingTopic[];
  onOpenWhiteboardForAssignment: (assignment: TeacherAssignment, mode: 'TRADITIONAL_BOARD' | 'CAD_WORKSTATION') => void;
}

export const StudentAssignmentsModal: React.FC<StudentAssignmentsModalProps> = ({
  isOpen,
  onClose,
  topics,
  onOpenWhiteboardForAssignment
}) => {
  if (!isOpen) return null;

  const [assignments] = useState<TeacherAssignment[]>(INITIAL_TEACHER_ASSIGNMENTS);
  const [submissions] = useState<StudentSubmission[]>(INITIAL_STUDENT_SUBMISSIONS);
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(assignments[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                My Drawing Practical Assignments
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  STUDENT PORTAL
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete practical drawing tasks, submit vector solutions, and check WAEC rubric grades.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-900">
          {/* Assignment List (5 Cols) */}
          <div className="md:col-span-5 border-r border-slate-800 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-slate-950/60">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Assigned Tasks ({assignments.length})
            </h3>

            {assignments.map((asg) => {
              const sub = submissions.find((s) => s.assignmentId === asg.id);
              const isSelected = selectedAssignment?.id === asg.id;

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAssignment(asg)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {asg.moduleCode}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      Due: {asg.dueDate}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug mb-2">
                    {asg.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{asg.targetClass}</span>
                    {sub?.status === 'GRADED' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {sub.grade?.totalScore}% ({sub.grade?.waecGrade})
                      </span>
                    ) : sub?.status === 'SUBMITTED' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Submitted
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Assignment Details & Actions (7 Cols) */}
          <div className="md:col-span-7 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
            {selectedAssignment ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {selectedAssignment.tier}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Class: {selectedAssignment.targetClass}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedAssignment.title}
                  </h3>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                  <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Practical Task Requirements & Instructions:
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedAssignment.instructions}
                  </p>
                </div>

                {/* Rubric Breakdown */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                  <h4 className="font-bold text-slate-300">ISO 128 / WAEC Marking Rubric:</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>• Accuracy of Construction: <strong className="text-cyan-400">{selectedAssignment.rubric?.constructionAccuracy ?? 40}%</strong></div>
                    <div>• Linework (2H vs HB): <strong className="text-cyan-400">{selectedAssignment.rubric?.lineWeightDifferentiation ?? 25}%</strong></div>
                    <div>• Dimensions & Lettering: <strong className="text-cyan-400">{selectedAssignment.rubric?.dimensioningAndLettering ?? 20}%</strong></div>
                    <div>• Layout & Title Block: <strong className="text-cyan-400">{selectedAssignment.rubric?.neatnessAndLayout ?? 15}%</strong></div>
                  </div>
                </div>

                {/* If Graded, Show Teacher Feedback */}
                {(() => {
                  const sub = submissions.find((s) => s.assignmentId === selectedAssignment.id);
                  if (sub?.grade) {
                    return (
                      <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-emerald-400" />
                            Official Grade: {sub.grade.totalScore}/100 (WAEC {sub.grade.waecGrade})
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Graded: {sub.grade.gradedAt}
                          </span>
                        </div>
                        <p className="text-slate-300 italic">
                          "{sub.grade.teacherFeedback}"
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Action Launchers */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Launch Workspace & Complete Drawing:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => onOpenWhiteboardForAssignment(selectedAssignment, 'TRADITIONAL_BOARD')}
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-600/30 to-amber-700/30 hover:from-amber-600/40 hover:to-amber-700/40 border border-amber-500/50 text-amber-200 rounded-xl text-xs font-semibold shadow-lg transition-all"
                    >
                      <PenTool className="w-4 h-4 text-amber-400" />
                      Open Traditional Board
                    </button>

                    <button
                      onClick={() => onOpenWhiteboardForAssignment(selectedAssignment, 'CAD_WORKSTATION')}
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-cyan-600/30 to-blue-700/30 hover:from-cyan-600/40 hover:to-blue-700/40 border border-cyan-500/50 text-cyan-200 rounded-xl text-xs font-semibold shadow-lg transition-all"
                    >
                      <Tv className="w-4 h-4 text-cyan-400" />
                      Open CAD Workstation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select an assignment from the left to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
