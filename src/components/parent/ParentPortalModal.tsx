import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  CreditCard,
  Check,
  Compass,
  PenTool,
  CheckCircle,
  Eye
} from 'lucide-react';
import { SAMPLE_WARD_PROFILES, getWardProfile } from '../../data/parentData';
import { StudentWardProfile } from '../../types/parent';
import { useSubscription } from '../../context/SubscriptionContext';
import { payForParentWardSponsorship, formatNaira } from '../../utils/paystack';

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
  const { isSubscribed, subscription, subscribeToPlan } = useSubscription();

  const [wardCodeInput, setWardCodeInput] = useState<string>('WARD-DH-2025-88');
  const [activeProfile, setActiveProfile] = useState<StudentWardProfile>(
    SAMPLE_WARD_PROFILES['WARD-DH-2025-88']
  );
  const [activeTab, setActiveTab] = useState<'analytics' | 'weakAreas' | 'assessments' | 'practicalSubmissions' | 'teacherNotes' | 'reportCard' | 'sponsorship'>('analytics');
  const [parentFeedbackMsg, setParentFeedbackMsg] = useState<string>('');
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);

  // Paystack Ward Sponsorship State
  const [parentEmail, setParentEmail] = useState<string>('folashade.b@parent.drafthands.edu');
  const [sponsorshipPlan, setSponsorshipPlan] = useState<'STUDENT_TERMLY' | 'STUDENT_SESSION'>('STUDENT_SESSION');
  const [isPayingSponsorship, setIsPayingSponsorship] = useState<boolean>(false);
  const [sponsorshipReceiptRef, setSponsorshipReceiptRef] = useState<string | null>(null);

  // Load ward profile when opened or ward code changes
  useEffect(() => {
    setActiveProfile(getWardProfile(wardCodeInput));
  }, [wardCodeInput, isOpen]);

  if (!isOpen) return null;

  const handleSearchWard = (codeToSearch?: string) => {
    const code = codeToSearch || wardCodeInput;
    const profile = getWardProfile(code);
    setActiveProfile(profile);
  };

  const handleOfficialParentPaystackCheckout = () => {
    setIsPayingSponsorship(true);
    payForParentWardSponsorship({
      parentEmail,
      parentName: 'Parent of ' + activeProfile.studentName,
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
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
                  Distinction Track (WAEC A1)
                </span>
                {isSubscribed ? (
                  <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Curriculum Pass Active
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveTab('sponsorship')}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow transition-colors"
                  >
                    <CreditCard className="w-3 h-3" />
                    Sponsor with Paystack
                  </button>
                )}
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
              <span>Test Scores & Self-Assessments ({activeProfile.recentAssessments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('practicalSubmissions')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'practicalSubmissions'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Studio Practical Submissions ({activeProfile.practicalSubmissions?.length || 0})</span>
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
            <button
              onClick={() => setActiveTab('sponsorship')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sponsorship'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sponsor Ward Pass (Paystack)</span>
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
                  {(activeProfile?.masteryBreakdown || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-200">{item?.category || 'Module Category'}</span>
                          <span className="text-xs font-mono font-bold text-slate-300">{item?.masteryScore || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (item?.masteryScore || 0) >= 85
                                ? 'bg-emerald-500'
                                : (item?.masteryScore || 0) >= 70
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item?.masteryScore || 0}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border font-mono ${
                        item?.level === 'Excellent'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item?.level === 'Good'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {item?.level || 'Active'}
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
                {(activeProfile?.weakAreas || []).map((area, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Accuracy: {area?.accuracyScore || 0}%
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Priority Area #{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{area?.skill || 'Technical Drawing Competency'}</h4>
                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <strong className="text-amber-400 block mb-1">Recommended Action:</strong>
                      {area?.recommendedAction || 'Practice exercises in the interactive studio.'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">{area?.topicTitle || 'General Topic'}</span>
                      {onSelectTopic && area?.topicId && (
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
                <div>
                  <h4 className="text-sm font-bold text-white">Curriculum Topic Self-Assessments & Test Scores</h4>
                  <p className="text-xs text-slate-400">Strict 5-question system (Theory 5-MCQs or Hybrid 2 MCQs + 3 Practical Tasks)</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  Live Synced CA Record
                </span>
              </div>

              <div className="space-y-3">
                {(activeProfile?.recentAssessments || []).map((ass) => (
                  <div key={ass?.id || Math.random()} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 transition-all hover:border-slate-700">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center font-mono font-bold text-emerald-400 shrink-0">
                        <span className="text-sm leading-none">{ass?.waecGrade || 'C4'}</span>
                        <span className="text-[9px] text-emerald-500/70 font-normal">WAEC</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-bold text-white">{ass?.topicTitle || 'Technical Drawing Assessment'}</h5>
                          {ass?.assessmentFormat === 'THEORY_5_MCQ' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              5-MCQ Theory Exam
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Hybrid: 2 MCQs + 3 Practical Tasks
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {ass?.date || 'Recent'} • Continuous Assessment Score: <strong className="text-emerald-400 font-mono">{ass?.score ?? 0} / {ass?.maxScore ?? 20}</strong> ({Math.round(((ass?.score || 0) / Math.max(1, ass?.maxScore || 20)) * 100)}%)
                        </p>
                        {ass?.teacherComment && (
                          <p className="text-xs text-slate-300 italic mt-1.5 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            "{ass.teacherComment}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ass?.topicId && onSelectTopic && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectTopic(ass.topicId!);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View Topic</span>
                        </button>
                      )}
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STUDIO PRACTICAL SUBMISSIONS */}
          {activeTab === 'practicalSubmissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Drawing Studio Practical Submissions</h4>
                  <p className="text-xs text-slate-400">Geometry and construction tasks drawn by your child in the Interactive Viewport</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{(activeProfile?.practicalSubmissions || []).length} Submissions Synced</span>
                </span>
              </div>

              {(!activeProfile?.practicalSubmissions || activeProfile.practicalSubmissions.length === 0) ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-white">No Practical Submissions Yet</h5>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When your child starts a practical/construction self-assessment and draws in the Interactive Drawing Studio, their submitted geometric constructions will automatically sync and display here with rubric marks.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeProfile?.practicalSubmissions || []).map((sub, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {sub?.topicTitle || 'Practical Task'}
                          </span>
                          <h5 className="text-xs font-bold text-white mt-1.5">{sub?.taskTitle || 'Studio Construction'}</h5>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {sub?.submittedAt || 'Recently'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {sub?.marksAwarded || 18} / {sub?.maxMarks || 20} Marks
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Studio Elements Drawn:</span>
                          <span className="font-mono text-cyan-400 font-bold">{sub?.elementCount || 0} Geometry Entities</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Marking Rubric:</span>
                          <span className="text-emerald-400 font-semibold">WAEC Technical Drawing Scheme</span>
                        </div>
                        {sub?.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-1 border-t border-slate-800/80 pt-1">
                            "{sub.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Verified Studio Construction
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ID: {sub?.taskId || idx}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEACHER REMARKS & PARENT FEEDBACK */}
          {activeTab === 'teacherNotes' && (
            <div className="space-y-6">
              {/* Teacher Remarks Card */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeProfile?.teacherRemarks?.teacherName || 'Technical Drawing Department'}</h4>
                    <span className="text-xs text-slate-400 font-mono">Official Assessment • {activeProfile?.teacherRemarks?.date || 'Current Term'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                    Approved by HOD
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  "{activeProfile?.teacherRemarks?.comment || 'Student is making steady progress in curriculum drawing tasks.'}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Observed Strengths</span>
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {(activeProfile?.teacherRemarks?.strengths || []).map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Target for Next Week</span>
                    </h5>
                    <p className="text-xs text-slate-300">{activeProfile?.teacherRemarks?.focusForNextWeek || 'Complete practice exercises and revise geometric constructions.'}</p>
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
                    {(activeProfile?.recentAssessments || []).map((ass, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="p-2.5 font-medium border-r border-slate-200">{ass?.topicTitle || 'Technical Drawing Assessment'}</td>
                        <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200">{ass?.score ?? 0}/{ass?.maxScore ?? 20}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">{ass?.waecGrade || 'C4'}</td>
                        <td className="p-2.5 text-slate-600 italic">{ass?.teacherComment || 'Satisfactory attempt.'}</td>
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

          {/* TAB 6: PAYSTACK WARD SPONSORSHIP */}
          {activeTab === 'sponsorship' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-700/50 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                      Official Paystack Checkout
                    </span>
                    <span className="text-xs text-slate-400">Card • Bank Transfer • USSD • QR</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Sponsor Curriculum & WAEC Pass for {activeProfile.studentName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Unlock all 2nd & 3rd term Technical Drawing topics, interactive CAD canvas drills, and WAEC/NERDC marking schemes.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Recipient Ward</span>
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      {activeProfile.studentName} (#{activeProfile.admissionNo})
                    </span>
                  </div>
                </div>
              </div>

              {sponsorshipReceiptRef ? (
                /* Payment Success View */
                <div className="p-6 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Payment Verified via Paystack!</h4>
                    <p className="text-xs text-emerald-300 mt-1">
                      Academic Pass for <span className="font-bold text-white">{activeProfile.studentName}</span> is now active.
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-2">
                      Paystack Reference: <span className="text-emerald-400 font-bold">{sponsorshipReceiptRef}</span>
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      View Student Dashboard
                    </button>
                    <button
                      onClick={() => setSponsorshipReceiptRef(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                    >
                      Make Another Payment
                    </button>
                  </div>
                </div>
              ) : (
                /* Plan Selection & Checkout Form */
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Termly Option */}
                    <div
                      onClick={() => setSponsorshipPlan('STUDENT_TERMLY')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        sponsorshipPlan === 'STUDENT_TERMLY'
                          ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold font-mono uppercase text-slate-400">Termly Pass</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            3 Months Access
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white font-mono">{formatNaira(2500)}</span>
                          <span className="text-xs text-slate-400">/ term</span>
                        </div>
                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Complete SS1, SS2, or SS3 term syllabus</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>All 2nd & 3rd term geometric diagrams</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Interactive construction canvases</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Session Pass Option (Recommended) */}
                    <div
                      onClick={() => setSponsorshipPlan('STUDENT_SESSION')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                        sponsorshipPlan === 'STUDENT_SESSION'
                          ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                        Recommended • Save 40%
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold font-mono uppercase text-emerald-400">Full Academic Session</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            12 Months Access
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white font-mono">{formatNaira(6000)}</span>
                          <span className="text-xs text-slate-400">/ full session</span>
                        </div>
                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>1st, 2nd & 3rd term full curriculum</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>WAEC & NECO 10-year past question archive</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Parent monthly continuous assessment reports</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Action Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-xs text-slate-400 font-mono">Parent Email:</span>
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <button
                      onClick={handleOfficialParentPaystackCheckout}
                      disabled={isPayingSponsorship}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      {isPayingSponsorship ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Opening Paystack...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay with Paystack ({formatNaira(sponsorshipPlan === 'STUDENT_TERMLY' ? 2500 : 6000)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
