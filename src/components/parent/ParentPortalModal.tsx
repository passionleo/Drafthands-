import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Search, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Printer, 
  Send, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  MessageSquare
} from 'lucide-react';
import { SAMPLE_WARD_PROFILES, getWardProfile } from '../../data/parentData';
import { StudentWardProfile } from '../../types/parent';

interface ParentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (topicId: string) => void;
}

export const ParentPortalModal: React.FC<ParentPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic
}) => {
  const [wardCodeInput, setWardCodeInput] = useState<string>('WARD-DH-2025-88');
  const [activeProfile, setActiveProfile] = useState<StudentWardProfile>(
    SAMPLE_WARD_PROFILES['WARD-DH-2025-88']
  );
  const [activeTab, setActiveTab] = useState<'analytics' | 'weakAreas' | 'assessments' | 'teacherNotes' | 'reportCard'>('analytics');
  const [parentFeedbackMsg, setParentFeedbackMsg] = useState<string>('');
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSearchWard = (codeToSearch?: string) => {
    const code = codeToSearch || wardCodeInput;
    const profile = getWardProfile(code);
    setActiveProfile(profile);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentFeedbackMsg.trim()) return;
    setIsFeedbackSent(true);
    setTimeout(() => {
      setParentFeedbackMsg('');
      setIsFeedbackSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Parent Monitoring & Feedback Portal</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track your ward's Technical Drawing curriculum mastery, drawing canvas practice, and teacher evaluation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Ward Code Selector / Login Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="text-xs text-slate-400 font-mono">Ward Access Code:</span>
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={wardCodeInput}
                onChange={(e) => setWardCodeInput(e.target.value)}
                placeholder="e.g. WARD-DH-2025-88"
                className="w-full bg-slate-900 text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 uppercase tracking-wider"
              />
            </div>
            <button
              onClick={() => handleSearchWard()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Verify Ward
            </button>
          </div>

          {/* Quick Demo Ward Selector Switches */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Demo Wards:</span>
            <button
              onClick={() => {
                setWardCodeInput('WARD-DH-2025-88');
                handleSearchWard('WARD-DH-2025-88');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                activeProfile.wardCode === 'WARD-DH-2025-88'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Emeka (SS1)
            </button>
            <button
              onClick={() => {
                setWardCodeInput('WARD-DH-2025-42');
                handleSearchWard('WARD-DH-2025-42');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                activeProfile.wardCode === 'WARD-DH-2025-42'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Amina (SS2)
            </button>
          </div>
        </div>

        {/* Modal Body & Navigation Tabs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Student Info Header Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold font-mono shadow-lg border border-blue-400/30">
                {activeProfile.studentName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{activeProfile.studentName}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    {activeProfile.classTier}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">#{activeProfile.admissionNo}</span>
                </div>
                <p className="text-xs text-slate-400">{activeProfile.schoolName}</p>
                <p className="text-[11px] text-slate-500">{activeProfile.term} • Academic Session {activeProfile.academicYear}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right pr-3 border-r border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Overall Score</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{activeProfile.overallScore}%</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Status</span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block mt-0.5">
                  Distinction Track (WAEC A1)
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Performance Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('weakAreas')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'weakAreas'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Weak Areas & Remedies ({activeProfile.weakAreas.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'assessments'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Weekly Test Scores</span>
            </button>
            <button
              onClick={() => setActiveTab('teacherNotes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'teacherNotes'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Teacher Remarks & Feedback</span>
            </button>
            <button
              onClick={() => setActiveTab('reportCard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reportCard'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Report Card (PDF)</span>
            </button>
          </div>

          {/* TAB 1: ANALYTICS & MASTERY */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* 4 Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Syllabus Coverage</span>
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{activeProfile.syllabusCompletion}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeProfile.syllabusCompletion}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Ministry NERDC Accredited</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Canvas Practice Time</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{activeProfile.canvasPracticeHours} hrs</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono">+3.2 hrs above class average</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Quizzes Completed</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{activeProfile.quizzesCompleted} / {activeProfile.totalQuizzes}</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(activeProfile.quizzesCompleted / activeProfile.totalQuizzes) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">75% assessment completion</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>WAEC Projected Grade</span>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 font-mono">A1 Distinction</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Top 5% in school cohort</p>
                </div>
              </div>

              {/* Curriculum Mastery Breakdown Table */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Curriculum Module Mastery Breakdown</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">Evaluated on ISO 128 Standards</span>
                </div>

                <div className="space-y-3">
                  {activeProfile.masteryBreakdown.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-200">{item.category}</span>
                          <span className="text-xs font-mono font-bold text-slate-300">{item.masteryScore}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.masteryScore >= 85
                                ? 'bg-emerald-500'
                                : item.masteryScore >= 70
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.masteryScore}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border font-mono ${
                        item.level === 'Excellent'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.level === 'Good'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEAK AREAS & REMEDIES */}
          {activeTab === 'weakAreas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-3 text-amber-300 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-sm">Actionable Weak Areas Identified by AI & Teacher Grading</p>
                  <p className="text-slate-400 text-xs">Encourage your ward to practice these specific topics on the digital drafting board to eliminate exam penalties.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProfile.weakAreas.map((area, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Accuracy: {area.accuracyScore}%
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Priority Area #{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{area.skill}</h4>
                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <strong className="text-amber-400 block mb-1">Recommended Action:</strong>
                      {area.recommendedAction}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">{area.topicTitle}</span>
                      {onSelectTopic && (
                        <button
                          onClick={() => {
                            onSelectTopic(area.topicId);
                            onClose();
                          }}
                          className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Open Lesson</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ASSESSMENTS & SCORES */}
          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Recent Technical Drawing Tests & Submissions</h4>
                <span className="text-xs text-slate-400 font-mono">Official Continuous Assessment (CA) Record</span>
              </div>

              <div className="space-y-3">
                {activeProfile.recentAssessments.map((ass) => (
                  <div key={ass.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400">
                        {ass.waecGrade}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{ass.topicTitle}</h5>
                        <p className="text-[11px] text-slate-400">{ass.date} • Score: <strong className="text-emerald-400">{ass.score} / {ass.maxScore}</strong> ({Math.round((ass.score / ass.maxScore) * 100)}%)</p>
                        <p className="text-xs text-slate-300 italic mt-1">"{ass.teacherComment}"</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Verified CA Score
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEACHER REMARKS & PARENT FEEDBACK */}
          {activeTab === 'teacherNotes' && (
            <div className="space-y-6">
              {/* Teacher Remarks Card */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeProfile.teacherRemarks.teacherName}</h4>
                    <span className="text-xs text-slate-400 font-mono">Official Weekly Assessment • {activeProfile.teacherRemarks.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                    Approved by HOD
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  "{activeProfile.teacherRemarks.comment}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Observed Strengths</span>
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {activeProfile.teacherRemarks.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Target for Next Week</span>
                    </h5>
                    <p className="text-xs text-slate-300">{activeProfile.teacherRemarks.focusForNextWeek}</p>
                  </div>
                </div>
              </div>

              {/* Direct Parent Feedback Form */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Send Direct Feedback / Inquiry to Subject Teacher</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Your feedback and monitoring acknowledgments are logged directly in the teacher's lesson record.
                </p>

                {isFeedbackSent ? (
                  <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Your message has been securely submitted to {activeProfile.teacherRemarks.teacherName}. Thank you!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendFeedback} className="space-y-3">
                    <textarea
                      rows={3}
                      value={parentFeedbackMsg}
                      onChange={(e) => setParentFeedbackMsg(e.target.value)}
                      placeholder="e.g. Thank you for the detailed feedback. We have ensured Emeka spends 30 minutes every evening on the Drafthands digital canvas practicing ISO lines..."
                      className="w-full bg-slate-900 text-white text-xs p-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={!parentFeedbackMsg.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Message to Teacher</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PRINTABLE REPORT CARD */}
          {activeTab === 'reportCard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Official Termly Technical Graphics Performance Document</span>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF Report</span>
                </button>
              </div>

              {/* Printable Card Layout */}
              <div className="p-8 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 font-sans space-y-6">
                {/* Header with Seal */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">{activeProfile.schoolName}</h2>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Department of Technical Education & Applied Sciences</p>
                    <p className="text-xs text-slate-500">Official Continuous Assessment & WAEC Readiness Report</p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p className="font-bold text-slate-900">ACCREDITATION: NERDC/WAEC</p>
                    <p className="text-slate-600">SESSION: {activeProfile.academicYear}</p>
                    <p className="text-slate-600">TERM: {activeProfile.term}</p>
                  </div>
                </div>

                {/* Student Metadata Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Student Name</span>
                    <strong className="text-slate-900 text-sm">{activeProfile.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Admission No</span>
                    <strong className="text-slate-900 text-sm">{activeProfile.admissionNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Class / Tier</span>
                    <strong className="text-slate-900 text-sm">{activeProfile.classTier} Technical</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Overall Term Score</span>
                    <strong className="text-emerald-700 text-base font-mono">{activeProfile.overallScore}% (A1)</strong>
                  </div>
                </div>

                {/* Evaluation Table */}
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                      <th className="p-2.5 border-r border-slate-300">Assessment Module / Examination</th>
                      <th className="p-2.5 border-r border-slate-300 text-center">Score</th>
                      <th className="p-2.5 border-r border-slate-300 text-center">WAEC Grade</th>
                      <th className="p-2.5">Teacher Evaluation Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProfile.recentAssessments.map((ass, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="p-2.5 font-medium border-r border-slate-200">{ass.topicTitle}</td>
                        <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200">{ass.score}/{ass.maxScore}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">{ass.waecGrade}</td>
                        <td className="p-2.5 text-slate-600 italic">{ass.teacherComment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Final Remarks & Signature Stamp */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Head of Department Signature:</span>
                    <p className="font-bold text-xs text-slate-900 font-serif mt-1">Engr. D. K. Adeleke, MNSE, Reg. Engr.</p>
                    <p className="text-[10px] text-slate-500">Verified via Drafthands EdTech Learning Management System</p>
                  </div>
                  <div className="border-2 border-emerald-600 rounded-lg p-2 text-center text-emerald-800 font-mono text-[10px] font-bold uppercase tracking-wider rotate-[-2deg]">
                    ★ OFFICIAL WAEC ACCREDITED ★<br />ACADEMIC RECORD VERIFIED
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
