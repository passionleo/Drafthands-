import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Award, 
  Send, 
  FileText, 
  Eye, 
  Layers, 
  Sparkles, 
  Edit3, 
  Trash2, 
  AlertCircle,
  ChevronRight,
  Sliders,
  Check,
  Download,
  GraduationCap
} from 'lucide-react';
import { DrawingTopic, CurriculumTier } from '../../types/curriculum';
import { TeacherAssignment, StudentSubmission, WAECGrade } from '../../types/assignments';
import { INITIAL_TEACHER_ASSIGNMENTS, INITIAL_STUDENT_SUBMISSIONS } from '../../data/assignmentsData';
import { TIER_CONFIG } from '../../data/curriculumData';

interface AssignmentManagementModalProps {
  topics: DrawingTopic[];
  isOpen: boolean;
  onClose: () => void;
  onOpenWhiteboardWithTask?: (topic: DrawingTopic, starterElements?: any[]) => void;
}

type ActiveView = 'ASSIGNMENT_LIST' | 'CREATE_ASSIGNMENT' | 'SUBMISSION_REVIEW';

export const AssignmentManagementModal: React.FC<AssignmentManagementModalProps> = ({
  topics,
  isOpen,
  onClose,
  onOpenWhiteboardWithTask
}) => {
  if (!isOpen) return null;

  const [activeView, setActiveView] = useState<ActiveView>('ASSIGNMENT_LIST');
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(INITIAL_TEACHER_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_STUDENT_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  // Form State for creating new assignment
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [targetClass, setTargetClass] = useState<string>('SS2 Technical A');
  const [dueDate, setDueDate] = useState<string>('2025-10-05');
  const [instructions, setInstructions] = useState<string>('');
  
  // Rubric weights
  const [rubricAccuracy, setRubricAccuracy] = useState<number>(40);
  const [rubricLinework, setRubricLinework] = useState<number>(25);
  const [rubricDimension, setRubricDimension] = useState<number>(20);
  const [rubricNeatness, setRubricNeatness] = useState<number>(15);

  // Grading form state
  const [scoreAccuracy, setScoreAccuracy] = useState<number>(35);
  const [scoreLinework, setScoreLinework] = useState<number>(22);
  const [scoreDimension, setScoreDimension] = useState<number>(18);
  const [scoreNeatness, setScoreNeatness] = useState<number>(13);
  const [feedbackText, setFeedbackText] = useState<string>('Good adherence to tangent intersection rules. Refine dimension text alignment.');

  const totalCalculatedScore = scoreAccuracy + scoreLinework + scoreDimension + scoreNeatness;

  const calculateWaecGrade = (score: number): WAECGrade => {
    if (score >= 75) return 'A1';
    if (score >= 70) return 'B2';
    if (score >= 65) return 'B3';
    if (score >= 60) return 'C4';
    if (score >= 55) return 'C5';
    if (score >= 50) return 'C6';
    if (score >= 45) return 'D7';
    if (score >= 40) return 'E8';
    return 'F9';
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = topics.find(t => t.id === selectedTopicId) || topics[0];
    const newAsg: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      topicId: topic.id,
      moduleCode: topic.moduleCode,
      title: assignmentTitle || `Practical Drawing: ${topic.title}`,
      tier: topic.tier,
      targetClass,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      instructions: instructions || `Execute standard geometric construction for ${topic.title} following ISO 128 guidelines.`,
      maxScore: 100,
      rubric: {
        constructionAccuracy: rubricAccuracy,
        lineWeightDifferentiation: rubricLinework,
        dimensioningAndLettering: rubricDimension,
        neatnessAndLayout: rubricNeatness
      }
    };

    setAssignments(prev => [newAsg, ...prev]);
    setActiveView('ASSIGNMENT_LIST');
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;

    const waecGrade = calculateWaecGrade(totalCalculatedScore);
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          status: 'GRADED' as const,
          grade: {
            totalScore: totalCalculatedScore,
            waecGrade,
            constructionScore: scoreAccuracy,
            lineWeightScore: scoreLinework,
            dimensioningScore: scoreDimension,
            neatnessScore: scoreNeatness,
            teacherFeedback: feedbackText,
            gradedBy: 'Engr. Faculty Lead',
            gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    setActiveView('ASSIGNMENT_LIST');
    setSelectedSubmission(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Teacher Assignment & Evaluation Console
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                  PRO FACULTY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Dispatch practical drawing tasks, review student vector drawings, and assign WAEC standard rubric grades.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView !== 'ASSIGNMENT_LIST' && (
              <button
                onClick={() => setActiveView('ASSIGNMENT_LIST')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                Back to List
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900">
          {/* VIEW 1: ASSIGNMENTS & SUBMISSION LIST */}
          {activeView === 'ASSIGNMENT_LIST' && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Active Drawing Tasks ({assignments.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage practical drawing tasks assigned to secondary and tertiary classes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('CREATE_ASSIGNMENT')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Dispatch New Task
                </button>
              </div>

              {/* Assignment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((asg) => {
                  const relatedSubmissions = submissions.filter(s => s.assignmentId === asg.id);
                  const pendingCount = relatedSubmissions.filter(s => s.status === 'SUBMITTED').length;
                  const gradedCount = relatedSubmissions.filter(s => s.status === 'GRADED').length;

                  return (
                    <div
                      key={asg.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                            {asg.moduleCode}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Due: {asg.dueDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                          {asg.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {asg.instructions}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            Class: <strong className="text-slate-200">{asg.targetClass}</strong>
                          </span>
                          {pendingCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                              {pendingCount} Pending Review
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500">
                          {relatedSubmissions.length} Submissions
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Student Submissions Table */}
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Recent Student Drawing Submissions ({submissions.length})
                </h3>

                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Assignment</th>
                        <th className="p-3">Submitted</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {submissions.map((sub) => {
                        const asg = assignments.find(a => a.id === sub.assignmentId);
                        return (
                          <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3">
                              <div className="font-semibold text-white">{sub.studentName}</div>
                              <div className="text-[10px] font-mono text-slate-500">{sub.studentId}</div>
                            </td>
                            <td className="p-3 text-slate-300">{sub.studentClass}</td>
                            <td className="p-3 text-slate-300 max-w-[200px] truncate">
                              {asg?.title || sub.assignmentId}
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[11px]">{sub.submittedAt}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  sub.status === 'GRADED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold">
                              {sub.grade ? (
                                <span className="text-emerald-400">
                                  {sub.grade.totalScore}% ({sub.grade.waecGrade})
                                </span>
                              ) : (
                                <span className="text-slate-600">--</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setActiveView('SUBMISSION_REVIEW');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                              >
                                {sub.status === 'GRADED' ? 'View Review' : 'Grade Drawing'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: CREATE & DISPATCH ASSIGNMENT FORM */}
          {activeView === 'CREATE_ASSIGNMENT' && (
            <form onSubmit={handleCreateAssignment} className="max-w-2xl mx-auto space-y-5 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Dispatch Practical Drawing Assignment</h3>
                <p className="text-xs text-slate-400">
                  Select curriculum topic, target student cohort, and configure ISO 128 rubric breakdown.
                </p>
              </div>

              {/* Topic Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Curriculum Topic & Standard</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    const t = topics.find(top => top.id === e.target.value);
                    if (t) setAssignmentTitle(`Practical: ${t.title}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.tier}] {t.moduleCode}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Task Title</label>
                <input
                  type="text"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="e.g. Tangency Construction Test: Internal/External Arcs"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Class</label>
                  <input
                    type="text"
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    placeholder="e.g. SS2 Technical A"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Submission Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Practical Instructions & Parameters</label>
                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Specify radii, center distances, construction line conventions (2H), and required dimensions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-400 resize-none"
                  required
                />
              </div>

              {/* ISO 128 / WAEC Marking Rubric Weights */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Marking Rubric Allocations (Total: 100 Marks)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Construction Accuracy: <strong className="text-cyan-400">{rubricAccuracy}%</strong></label>
                    <input
                      type="range"
                      min={20}
                      max={60}
                      value={rubricAccuracy}
                      onChange={(e) => setRubricAccuracy(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Linework Differentiation (2H/HB): <strong className="text-cyan-400">{rubricLinework}%</strong></label>
                    <input
                      type="range"
                      min={10}
                      max={40}
                      value={rubricLinework}
                      onChange={(e) => setRubricLinework(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Dimensioning & Lettering: <strong className="text-cyan-400">{rubricDimension}%</strong></label>
                    <input
                      type="range"
                      min={10}
                      max={30}
                      value={rubricDimension}
                      onChange={(e) => setRubricDimension(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Neatness & Title Block: <strong className="text-cyan-400">{rubricNeatness}%</strong></label>
                    <input
                      type="range"
                      min={5}
                      max={20}
                      value={rubricNeatness}
                      onChange={(e) => setRubricNeatness(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveView('ASSIGNMENT_LIST')}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Assignment to Students
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: SPLIT-VIEW SUBMISSION REVIEW & GRADING DESK */}
          {activeView === 'SUBMISSION_REVIEW' && selectedSubmission && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Column: Student Drawing Canvas Viewport (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white">{selectedSubmission.studentName}</span>
                    <span className="text-slate-500 font-mono ml-2">({selectedSubmission.studentClass})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Submitted: {selectedSubmission.submittedAt}
                  </span>
                </div>

                {/* SVG Render of Student's Vector Geometry */}
                <div className="flex-1 min-h-[360px] bg-slate-900/80 rounded-xl border border-slate-800 mt-3 flex items-center justify-center overflow-hidden relative">
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Millimeter Grid */}
                    <defs>
                      <pattern id="review-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="800" height="600" fill="url(#review-grid)" />

                    {/* Student Elements */}
                    {selectedSubmission.drawingElements.map((el) => {
                      if (el.type === 'CIRCLE') {
                        return (
                          <circle
                            key={el.id}
                            cx={el.cx}
                            cy={el.cy}
                            r={el.r}
                            fill="none"
                            stroke={el.color}
                            strokeWidth={el.layer === 'OUTLINE_HB' ? 2.5 : 1}
                          />
                        );
                      }
                      if (el.type === 'LINE') {
                        return (
                          <line
                            key={el.id}
                            x1={el.x1}
                            y1={el.y1}
                            x2={el.x2}
                            y2={el.y2}
                            stroke={el.color}
                            strokeWidth={el.layer === 'OUTLINE_HB' ? 2.5 : 1}
                            strokeDasharray={el.layer === 'CENTERLINE_CHAIN' ? '8 4 2 4' : undefined}
                          />
                        );
                      }
                      if (el.type === 'ARC') {
                        return (
                          <circle
                            key={el.id}
                            cx={el.cx}
                            cy={el.cy}
                            r={el.r}
                            fill="none"
                            stroke={el.color}
                            strokeWidth={el.layer === 'OUTLINE_HB' ? 2.5 : 1}
                            strokeDasharray="4 4"
                          />
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>

                {/* Student's Accompanying Technical Note */}
                {selectedSubmission.studentNotes && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">Student Construction Note:</span>
                    <p className="text-slate-400 mt-1 italic">
                      "{selectedSubmission.studentNotes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Teacher Evaluation & WAEC Rubric Form (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-white">ISO 128 Evaluation Rubric</h4>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-cyan-400">
                        {totalCalculatedScore}/100
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">
                        WAEC {calculateWaecGrade(totalCalculatedScore)}
                      </span>
                    </div>
                  </div>

                  {/* Rubric Sliders */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>1. Construction Accuracy</span>
                        <strong className="text-cyan-400">{scoreAccuracy} / 40</strong>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={40}
                        value={scoreAccuracy}
                        onChange={(e) => setScoreAccuracy(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>2. Linework Differentiation (2H vs HB)</span>
                        <strong className="text-cyan-400">{scoreLinework} / 25</strong>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={25}
                        value={scoreLinework}
                        onChange={(e) => setScoreLinework(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>3. Dimensioning & Lettering</span>
                        <strong className="text-cyan-400">{scoreDimension} / 20</strong>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={scoreDimension}
                        onChange={(e) => setScoreDimension(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>4. Neatness & Layout</span>
                        <strong className="text-cyan-400">{scoreNeatness} / 15</strong>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={15}
                        value={scoreNeatness}
                        onChange={(e) => setScoreNeatness(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Feedback Text Area */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-slate-300">Teacher Constructive Feedback</label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write guidance for student remediation..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveView('ASSIGNMENT_LIST')}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Grade & Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
