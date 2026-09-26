import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  LogOut, 
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
  ExternalLink, 
  Lock, 
  MessageSquare, 
  CreditCard, 
  Check, 
  PenTool,
  CheckCircle,
  Eye
} from 'lucide-react';
import { SAMPLE_WARD_PROFILES, getWardProfile } from '../../data/parentData';
import { StudentWardProfile } from '../../types/parent';
import { useSubscription } from '../../context/SubscriptionContext';
import { payForParentWardSponsorship, formatNaira } from '../../utils/paystack';

interface ParentPortalViewProps {
  onReturnToHome: () => void;
  onSwitchToStudentView: () => void;
  onSelectTopic?: (topicId: string) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  onReturnToHome,
  onSwitchToStudentView,
  onSelectTopic
}) => {
  const { isSubscribed, subscription, subscribeToPlan, logout, wardCode, sponsorWard, userProfile } = useSubscription();
  const isAuthenticatedUser = !!userProfile?.isAuthenticated || !!subscription?.isAuthenticated;
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(!isAuthenticatedUser);

  const [wardCodeInput, setWardCodeInput] = useState<string>(() => isSandboxMode ? (wardCode || 'DH-742K') : '');
  const [activeProfile, setActiveProfile] = useState<StudentWardProfile | null>(() => isSandboxMode ? SAMPLE_WARD_PROFILES['WARD-DH-2025-88'] : null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'weakAreas' | 'assessments' | 'practicalSubmissions' | 'reportCard' | 'sponsorship' | 'feedback'>('analytics');
  const [parentFeedbackMsg, setParentFeedbackMsg] = useState<string>('');
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);

  // Paystack Ward Sponsorship State
  const [parentEmail, setParentEmail] = useState<string>('guardian@drafthands.edu.ng');
  const [sponsorshipPlan, setSponsorshipPlan] = useState<'STUDENT_TERMLY' | 'STUDENT_SESSION'>('STUDENT_SESSION');
  const [isPayingSponsorship, setIsPayingSponsorship] = useState<boolean>(false);
  const [sponsorshipReceiptRef, setSponsorshipReceiptRef] = useState<string | null>(null);

  const handleSearchWard = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = wardCodeInput.trim().toUpperCase();
    const profile = getWardProfile(clean);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  const handlePaystackSponsorship = () => {
    if (!activeProfile) return;
    setIsPayingSponsorship(true);
    sponsorWard(wardCodeInput);
    payForParentWardSponsorship({
      parentEmail,
      wardName: activeProfile.studentName,
      wardCode: activeProfile.wardCode,
      planType: sponsorshipPlan,
      onSuccess: (res) => {
        setIsPayingSponsorship(false);
        subscribeToPlan(sponsorshipPlan, res.reference);
        setSponsorshipReceiptRef(res.reference);
      },
      onClose: () => {
        setIsPayingSponsorship(false);
      },
      onError: () => {
        setIsPayingSponsorship(false);
      }
    });
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

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-slate-950">
      {/* 1. Dedicated Parent Portal Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-blue-900/40 shadow-xl px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Guardian Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToHome}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Public Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-600 p-0.5 shadow-lg shadow-blue-600/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Draft<span className="text-blue-400">hands</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-500/40 uppercase">
                    Parent Portal
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    LIVE REAL-TIME TELEMETRY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Guardian of: <strong className="text-white">{activeProfile?.studentName || 'No Ward Linked'}</strong> {activeProfile?.classTier ? `(${activeProfile.classTier})` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Only rendered when ward is linked) */}
          {activeProfile && (
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ward Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('practicalSubmissions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'practicalSubmissions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Practical Drawings</span>
            </button>

            <button
              onClick={() => setActiveTab('reportCard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'reportCard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report Card</span>
            </button>

            <button
              onClick={() => setActiveTab('sponsorship')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'sponsorship'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Sponsor Term</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Teacher Chat</span>
            </button>
          </nav>
          )}

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToStudentView}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 transition-colors"
              title="Open Student Drawing Workspace"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Workspace</span>
            </button>

            {/* Prominent Log Out Icon Button */}
            <button
              id="btn-parent-logout"
              onClick={() => {
                logout();
                onReturnToHome();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 hover:border-red-500 transition-all shadow-sm group cursor-pointer"
              title="Log Out of Parent Session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Ward Code Switcher Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchWard} className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 font-mono">Ward Access Code:</span>
            <div className="relative">
              <input
                type="text"
                value={wardCodeInput}
                onChange={(e) => setWardCodeInput(e.target.value)}
                placeholder="e.g. WARD-DH-2025-88"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white uppercase font-mono w-44 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            >
              Load Ward
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>School: <strong className="text-slate-200">{activeProfile?.schoolName || 'DraftHands Academy'}</strong></span>
            <span>•</span>
            <span>Admission: <strong className="text-blue-400 font-mono">{activeProfile?.admissionNo || 'PENDING'}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Parent Portal Body */}
      {!activeProfile ? (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-4 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto shadow-xl">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Ward Linked to Your Account</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your student's DraftHands Student ID or invite code above (e.g. <code className="text-cyan-400 font-mono">WARD-DH-2025-88</code>) to monitor their curriculum progress, practical drafting submissions, and WAEC/NECO exam readiness.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setWardCodeInput('WARD-DH-2025-88');
                setActiveProfile(SAMPLE_WARD_PROFILES['WARD-DH-2025-88']);
                setIsSandboxMode(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
            >
              Preview Demo Ward Data
            </button>
          </div>
        </main>
      ) : (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* TAB 1: WARD ANALYTICS & CA SCORES */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stat Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-medium">Cumulative CA Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-blue-400 font-mono">{activeProfile.overallScore}%</span>
                  <span className="text-xs font-bold text-emerald-400">WAEC Grade A1</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${activeProfile.overallScore}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-medium">Syllabus Completion</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">{activeProfile.syllabusCompletion}%</span>
                  <span className="text-xs text-slate-400">of NERDC Term 1</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeProfile.syllabusCompletion}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-medium">Digital CAD Practice</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">{activeProfile.canvasPracticeHours}</span>
                  <span className="text-xs text-slate-400">Hours Logged</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 font-mono">Whiteboard & Set-Square Drills</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-medium">Quizzes & Self-Checks</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-purple-400 font-mono">{activeProfile.quizzesCompleted}</span>
                  <span className="text-xs text-slate-400">/ {activeProfile.totalQuizzes} Tests Passed</span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-3 font-mono">75% Passing Threshold</p>
              </div>
            </div>

            {/* Category Mastery Breakdown & Weak Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mastery Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Topic Mastery & Skill Benchmark</span>
                </h3>
                <div className="space-y-3">
                  {activeProfile.masteryBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.category}</span>
                        <span className="font-mono font-bold text-blue-300">{item.masteryScore}% ({item.level})</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full ${
                            item.masteryScore >= 80 ? 'bg-emerald-500' : item.masteryScore >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                          }`} 
                          style={{ width: `${item.masteryScore}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Areas & Targeted Interventions */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Areas Needing Guardian Encouragement</span>
                </h3>
                <div className="space-y-3">
                  {activeProfile.weakAreas.map((area, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{area.skill}</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">{area.accuracyScore}% Accuracy</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {area.recommendedAction}
                      </p>
                      {onSelectTopic && (
                        <button
                          onClick={() => onSelectTopic(area.topicId)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 pt-1"
                        >
                          <span>Review topic lesson ({area.topicTitle})</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRACTICAL DRAWINGS INSPECTION */}
        {activeTab === 'practicalSubmissions' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-400" />
                  <span>Ward's Technical Drawing Portfolio</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect your ward's submitted CAD plates, step-by-step vector drawings, and instructor rubric markings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeProfile.practicalSubmissions || []).map((draw, idx) => (
                <div key={draw.taskId || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{draw.taskTitle || draw.topicTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {draw.marksAwarded ? `Score: ${draw.marksAwarded}/${draw.maxMarks || 100}` : draw.status}
                    </span>
                  </div>

                  <div className="w-full h-44 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden group">
                    <div className="text-center space-y-1">
                      <PenTool className="w-8 h-8 text-blue-400 mx-auto opacity-75 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-slate-400 block font-mono">ISO 128 Drawing Plate</span>
                      <span className="text-[10px] text-blue-400 font-mono block">Submitted: {new Date(draw.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-blue-300 text-[11px] block">Student Submission Notes:</span>
                    <p className="text-slate-400 leading-relaxed">{draw.notes || 'Completed according to standard geometrical procedure.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL TERMINAL REPORT CARD */}
        {activeTab === 'reportCard' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Official Terminal Continuous Assessment Report</span>
                </h3>
                <p className="text-xs text-slate-400">
                  WAEC / NERDC Technical & Engineering Drawing Performance Card.
                </p>
              </div>

              <button
                onClick={handlePrintReport}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Card</span>
              </button>
            </div>

            {/* Official Report Card Printable Table */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
              <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">{activeProfile.schoolName}</h2>
                <p className="text-xs text-slate-400">DEPARTMENT OF TECHNICAL & ENGINEERING GRAPHICS</p>
                <p className="text-xs font-mono text-blue-400 font-semibold">STUDENT CONTINUOUS ASSESSMENT REPORT — {activeProfile.term} {activeProfile.academicYear}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div><span className="text-slate-500 block">Student:</span> <strong className="text-white">{activeProfile.studentName}</strong></div>
                <div><span className="text-slate-500 block">Class:</span> <strong className="text-white">{activeProfile.classTier} Technical</strong></div>
                <div><span className="text-slate-500 block">Admission No:</span> <strong className="text-white font-mono">{activeProfile.admissionNo}</strong></div>
                <div><span className="text-slate-500 block">Overall Score:</span> <strong className="text-blue-400 text-sm font-mono">{activeProfile.overallScore}% (A1)</strong></div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">S/N</th>
                      <th className="p-3">Assessment Subject / Module</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">WAEC Grade</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {activeProfile.recentAssessments.map((ass, i) => (
                      <tr key={ass.id}>
                        <td className="p-3 font-mono">{i + 1}</td>
                        <td className="p-3 font-semibold text-white">{ass.topicTitle}</td>
                        <td className="p-3 font-mono font-bold text-blue-400">{ass.score}%</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{ass.waecGrade}</td>
                        <td className="p-3 text-slate-400">{ass.teacherComment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-300">Instructor General Remark:</span>
                  <span className="text-slate-400 font-mono">Date: 2026-03-24</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  An exceptionally diligent technical graphics student. Mastered plane geometry and orthographic line weighting with distinction. Recommended for SS2 Advanced Solid Geometry and Higher Institution CAD modules.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACADEMIC SPONSORSHIP */}
        {activeTab === 'sponsorship' && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/40">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sponsor Your Ward's Termly CAD Pass</h3>
              <p className="text-xs text-slate-400">
                Unlock full access to all 32 SS1–SS3 NERDC syllabus topics, step simulations, and 10-year WAEC archive for {activeProfile.studentName}.
              </p>
            </div>

            {sponsorshipReceiptRef && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Sponsorship Payment Successful!
                </span>
                <p>Transaction Reference: <strong className="font-mono">{sponsorshipReceiptRef}</strong></p>
                <p>Ward access has been permanently activated for the current academic session.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSponsorshipPlan('STUDENT_TERMLY')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  sponsorshipPlan === 'STUDENT_TERMLY'
                    ? 'bg-blue-950 border-blue-500 text-white shadow-md shadow-blue-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">1 Academic Term Pass</span>
                <span className="text-lg font-extrabold text-blue-400 font-mono mt-1 block">₦3,500</span>
                <span className="text-[10px] text-slate-500">Billed per term (3 months)</span>
              </button>

              <button
                type="button"
                onClick={() => setSponsorshipPlan('STUDENT_SESSION')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  sponsorshipPlan === 'STUDENT_SESSION'
                    ? 'bg-blue-950 border-blue-500 text-white shadow-md shadow-blue-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">Full Session Pass (Save 20%)</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono mt-1 block">₦8,500</span>
                <span className="text-[10px] text-slate-500">Billed annually (3 terms full)</span>
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Parent / Sponsor Email Address:</label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handlePaystackSponsorship}
              disabled={isPayingSponsorship}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isPayingSponsorship ? 'Processing Paystack...' : `Pay ${sponsorshipPlan === 'STUDENT_TERMLY' ? '₦3,500' : '₦8,500'} via Paystack`}</span>
            </button>
          </div>
        )}

        {/* TAB 5: TEACHER FEEDBACK CHANNEL */}
        {activeTab === 'feedback' && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Message Technical Drawing Instructor</span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct guardian communication with {activeProfile.schoolName} Technical Drawing faculty.
              </p>
            </div>

            {isFeedbackSent && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Feedback sent directly to the instructor. You will receive an SMS/email update.</span>
              </div>
            )}

            <form onSubmit={handleSendFeedback} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject / Question:</label>
                <input
                  type="text"
                  placeholder="e.g., Requesting extra help on orthographic projection"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Message:</label>
                <textarea
                  rows={4}
                  value={parentFeedbackMsg}
                  onChange={(e) => setParentFeedbackMsg(e.target.value)}
                  placeholder="Write your note to the technical drawing teacher..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Teacher</span>
              </button>
            </form>
          </div>
        )}
      </main>
      )}
    </div>
  );
};
