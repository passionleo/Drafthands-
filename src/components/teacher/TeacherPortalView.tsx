import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Tv, 
  PenTool, 
  BookOpen, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  LogOut, 
  Users, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Send,
  Eye,
  Edit3
} from 'lucide-react';
import { DrawingTopic, CurriculumTier } from '../../types/curriculum';
import { generateLessonPlanForTopic } from '../../data/lessonNotesGenerator';
import { TIER_CONFIG, TERM_CONFIG } from '../../data/curriculumData';
import { useSubscription } from '../../context/SubscriptionContext';
import { INITIAL_TEACHER_ASSIGNMENTS, INITIAL_STUDENT_SUBMISSIONS } from '../../data/assignmentsData';
import { TeacherAssignment, StudentSubmission, WAECGrade } from '../../types/assignments';

interface TeacherPortalViewProps {
  topics: DrawingTopic[];
  activeTopic: DrawingTopic;
  onSelectTopic: (topicId: string) => void;
  onOpenWhiteboardForTopic?: (topicId: string) => void;
  onOpenLiveClass?: () => void;
  onOpenProjectionMode?: () => void;
  onReturnToHome: () => void;
  onSwitchToStudentView: () => void;
}

type TeacherTab = 'LESSON_NOTES' | 'GRADING_DESK' | 'LIVE_CLASS' | 'SCHEME_WORK';
type LessonPlanTab = 'DOCUMENT' | 'DELIVERY_GUIDE' | 'MARKING_RUBRIC' | 'BOARD_LAYOUT';

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  topics,
  activeTopic,
  onSelectTopic,
  onOpenWhiteboardForTopic,
  onOpenLiveClass,
  onOpenProjectionMode,
  onReturnToHome,
  onSwitchToStudentView
}) => {
  const { userProfile, logout, isMasterAdmin } = useSubscription();

  const [activeTab, setActiveTab] = useState<TeacherTab>('LESSON_NOTES');
  const [lessonPlanTab, setLessonPlanTab] = useState<LessonPlanTab>('DOCUMENT');
  const [selectedTierFilter, setSelectedTierFilter] = useState<CurriculumTier | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Teacher metadata
  const [schoolName, setSchoolName] = useState<string>(userProfile?.institution || 'Test Technical Academy');
  const [teacherName, setTeacherName] = useState<string>(userProfile?.name || 'Demo Technical Instructor');
  const [term, setTerm] = useState<string>(() => 
    activeTopic.termLabel || (activeTopic.term === 'TERM_2' ? 'Second Term' : activeTopic.term === 'TERM_3' ? 'Third Term' : 'First Term')
  );
  const [week, setWeek] = useState<string>(() => 
    activeTopic.week ? `Week ${activeTopic.week}` : 'Week 1'
  );

  // Assignments State
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(INITIAL_TEACHER_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_STUDENT_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(submissions[0] || null);
  const [gradingMarks, setGradingMarks] = useState<{ accuracy: number; linework: number; lettering: number; speed: number }>({
    accuracy: 38,
    linework: 27,
    lettering: 18,
    speed: 9
  });
  const [teacherFeedbackText, setTeacherFeedbackText] = useState<string>('Good adherence to ISO 128 standards. Ensure projection lines remain faint 3H.');
  const [gradeSavedToast, setGradeSavedToast] = useState<boolean>(false);

  const lessonPlan = generateLessonPlanForTopic(activeTopic, {
    schoolName,
    teacherName,
    term,
    week
  });

  const filteredTopics = topics.filter(t => {
    const matchesTier = selectedTierFilter === 'ALL' || t.tier === selectedTierFilter;
    const matchesSearch = searchFilter.trim() === '' || 
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.moduleCode.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleCopyMarkdown = () => {
    const allObjectives = [
      ...lessonPlan.objectives.cognitive,
      ...lessonPlan.objectives.psychomotor,
      ...lessonPlan.objectives.affective
    ];
    const allMaterials = [
      ...lessonPlan.instructionalMaterials.teacherApparatus,
      ...lessonPlan.instructionalMaterials.studentMaterials,
      ...lessonPlan.instructionalMaterials.digitalAids
    ];

    const mdContent = `# LESSON PLAN: ${lessonPlan.topicTitle} (${lessonPlan.moduleCode})
**Teacher:** ${teacherName} | **Institution:** ${schoolName}
**Level:** ${activeTopic.tier} | **Term:** ${lessonPlan.term} | **Week:** ${lessonPlan.week}
**Topic:** ${lessonPlan.topicTitle}

---
## 1. GENERAL & SPECIFIC OBJECTIVES
${allObjectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

---
## 2. INSTRUCTIONAL RESOURCES & CAD TOOLS
${allMaterials.map(m => `- ${m}`).join('\n')}

---
## 3. WAEC / NERDC CURRICULUM MAPPING
- **WAEC Syllabus Reference:** ${lessonPlan.standards.waec}
- **NERDC Syllabus Reference:** ${lessonPlan.standards.nerdc}
- **Technical Drawing Standard:** ${lessonPlan.standards.iso}
`;

    navigator.clipboard.writeText(mdContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const total = gradingMarks.accuracy + gradingMarks.linework + gradingMarks.lettering + gradingMarks.speed;
    let awardedGrade: WAECGrade = 'A1';
    if (total < 40) awardedGrade = 'F9';
    else if (total < 50) awardedGrade = 'E8';
    else if (total < 60) awardedGrade = 'C4';
    else if (total < 75) awardedGrade = 'B2';

    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          status: 'GRADED',
          grade: {
            totalScore: total,
            waecGrade: awardedGrade,
            constructionScore: gradingMarks.accuracy,
            lineWeightScore: gradingMarks.linework,
            dimensioningScore: gradingMarks.lettering,
            neatnessScore: gradingMarks.speed,
            teacherFeedback: teacherFeedbackText,
            gradedBy: teacherName,
            gradedAt: new Date().toISOString()
          }
        };
      }
      return s;
    }));

    setGradeSavedToast(true);
    setTimeout(() => setGradeSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-slate-950">
      {/* 1. Dedicated Teacher Faculty Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-purple-900/40 shadow-xl px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Faculty Badge */}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Draft<span className="text-purple-400">hands</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 uppercase">
                    Teacher Portal
                  </span>
                  {isMasterAdmin && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      👑 Master Admin
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {teacherName} • {schoolName}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Portal Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('LESSON_NOTES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'LESSON_NOTES'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lesson Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('GRADING_DESK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'GRADING_DESK'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grading Desk</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 font-mono">
                {submissions.filter(s => s.status === 'PENDING').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('LIVE_CLASS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'LIVE_CLASS'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live Class & Projection</span>
            </button>
          </nav>

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
              id="btn-teacher-logout"
              onClick={() => {
                logout();
                onReturnToHome();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 hover:border-red-500 transition-all shadow-sm group cursor-pointer"
              title="Log Out of Teacher Session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Entity Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: LESSON NOTES & SYLLABUS GENERATOR */}
        {activeTab === 'LESSON_NOTES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Syllabus Topic Selector & Metadata */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Select Topic for Lesson Plan</span>
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    NERDC / WAEC
                  </span>
                </div>

                {/* Tier Filter Tabs */}
                <div className="grid grid-cols-4 gap-1">
                  {(['ALL', 'SS1', 'SS2', 'SS3'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTierFilter(tier)}
                      className={`py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        selectedTierFilter === tier
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                {/* Topic Search */}
                <input
                  type="text"
                  placeholder="Filter syllabus..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />

                {/* Topics List */}
                <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredTopics.map(topic => {
                    const isSelected = activeTopic.id === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-purple-950/80 border-purple-500/80 text-white'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="text-purple-400 font-bold">{topic.moduleCode}</span>
                          <span className="text-slate-400">{topic.tier} • {topic.standards.waecRef}</span>
                        </div>
                        <p className="text-xs font-semibold leading-tight line-clamp-1">
                          {topic.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Lesson Metadata */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Lesson Note Metadata
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">School Name:</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Instructor Name:</label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Term:</label>
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Week:</label>
                      <input
                        type="text"
                        value={week}
                        onChange={(e) => setWeek(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Generated Lesson Plan Viewer */}
            <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Document Actions Bar */}
              <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {(['DOCUMENT', 'DELIVERY_GUIDE', 'MARKING_RUBRIC', 'BOARD_LAYOUT'] as LessonPlanTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setLessonPlanTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        lessonPlanTab === tab
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab === 'DOCUMENT' && 'Lesson Plan'}
                      {tab === 'DELIVERY_GUIDE' && 'Delivery Guide'}
                      {tab === 'MARKING_RUBRIC' && 'Marking Rubric'}
                      {tab === 'BOARD_LAYOUT' && 'Board Setup'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Print</span>
                  </button>

                  {onOpenWhiteboardForTopic && (
                    <button
                      onClick={() => onOpenWhiteboardForTopic(activeTopic.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Draw on Board</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Document Content View */}
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-sm leading-relaxed custom-scrollbar">
                {lessonPlanTab === 'DOCUMENT' && (
                  <div className="space-y-6">
                    {/* Header Card */}
                    <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/40 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                            OFFICIAL NERDC TECHNICAL DRAWING LESSON PLAN
                          </span>
                          <h2 className="text-xl font-bold text-white mt-1">
                            {lessonPlan.topicTitle}
                          </h2>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-500/50">
                          {lessonPlan.moduleCode} • {activeTopic.tier}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Institution:</span>
                          <span className="font-semibold text-slate-200">{schoolName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Instructor:</span>
                          <span className="font-semibold text-slate-200">{teacherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Term & Week:</span>
                          <span className="font-semibold text-slate-200">{lessonPlan.term}, {lessonPlan.week}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">WAEC Standard:</span>
                          <span className="font-semibold text-purple-300 font-mono">{lessonPlan.standards.waec}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specific Objectives */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Behavioral Objectives (By the end of the lesson, students should be able to):</span>
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        {[
                          ...lessonPlan.objectives.cognitive,
                          ...lessonPlan.objectives.psychomotor,
                          ...lessonPlan.objectives.affective
                        ].map((obj, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {idx + 1}
                            </span>
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructional Resources */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span>Instructional Materials & Drafting Apparatus</span>
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          ...lessonPlan.instructionalMaterials.teacherApparatus,
                          ...lessonPlan.instructionalMaterials.studentMaterials,
                          ...lessonPlan.instructionalMaterials.digitalAids
                        ].map((mat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{mat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Steps Summary */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Sequential Instructional Delivery</span>
                      </h4>
                      <div className="space-y-3">
                        {lessonPlan.deliverySteps.map((step, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span>Step {step.stepNumber}: {step.title}</span>
                              <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{step.durationMins} mins</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                              <div>
                                <span className="font-bold text-slate-400 block text-[10px]">Teacher Activities:</span>
                                <p>{step.teacherActivities}</p>
                              </div>
                              <div>
                                <span className="font-bold text-slate-400 block text-[10px]">Student Activities:</span>
                                <p>{step.studentActivities}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {lessonPlanTab === 'DELIVERY_GUIDE' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white">Pedagogical Delivery & Pitfall Prevention</h3>
                    {lessonPlan.commonMisconceptions.map((mis, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-950 border border-red-900/40 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Student Pitfall: {mis.misconception}</span>
                        </div>
                        <p className="text-xs text-slate-300"><strong className="text-emerald-400">Instructor Correction:</strong> {mis.correctiveGuidance}</p>
                        <p className="text-[11px] text-amber-300 font-mono">WAEC Exam Penalty: {mis.waecPenalty}</p>
                      </div>
                    ))}
                  </div>
                )}

                {lessonPlanTab === 'MARKING_RUBRIC' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">WAEC Marking Scheme & Tolerances</h3>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        Total: {lessonPlan.evaluationAndExamScheme.totalMarks} Marks
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-950 text-slate-400 font-mono text-[11px]">
                          <tr>
                            <th className="p-3">Evaluation Component</th>
                            <th className="p-3">Marks</th>
                            <th className="p-3">WAEC Standard Tolerance & Guidelines</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {lessonPlan.evaluationAndExamScheme.criteria.map((crit, i) => (
                            <tr key={i} className="hover:bg-slate-950/50">
                              <td className="p-3 font-semibold text-white">{crit.component}</td>
                              <td className="p-3 font-mono text-purple-400 font-bold">{crit.marksAllocated}</td>
                              <td className="p-3 text-slate-400">{crit.toleranceGuide}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {lessonPlanTab === 'BOARD_LAYOUT' && (
                  <div className="space-y-4 text-xs text-slate-300">
                    <h3 className="text-base font-bold text-white">Board Setup & Whiteboard Layout Guidelines</h3>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <p>For optimal student visibility, divide the board into three zones:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-purple-300">Left Zone (Theory & Specifications):</strong> State given dimensions, radius, and WAEC reference.</li>
                        <li><strong className="text-cyan-300">Center Zone (Live Construction):</strong> Draw the active geometric construction step by step using contrasting colors (yellow for faint construction lines, white/cyan for final dark outlines).</li>
                        <li><strong className="text-emerald-300">Right Zone (Key Takeaways & WAEC Notes):</strong> Highlight pitfalls, pencil grade requirements (2H vs HB), and tolerance limits.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHER GRADING DESK & RUBRIC EVALUATION */}
        {activeTab === 'GRADING_DESK' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Submissions Queue */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Student Submissions Queue</span>
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    WAEC Rubrics
                  </span>
                </div>

                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                  {submissions.map(sub => {
                    const isSelected = selectedSubmission?.id === sub.id;
                    const totalScore = sub.grade?.totalScore;
                    const waecGrade = sub.grade?.waecGrade;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubmission(sub);
                          if (totalScore) {
                            setGradingMarks({
                              accuracy: sub.grade?.constructionScore ?? Math.round(totalScore * 0.4),
                              linework: sub.grade?.lineWeightScore ?? Math.round(totalScore * 0.3),
                              lettering: sub.grade?.dimensioningScore ?? Math.round(totalScore * 0.2),
                              speed: sub.grade?.neatnessScore ?? Math.round(totalScore * 0.1)
                            });
                          }
                          if (sub.grade?.teacherFeedback) {
                            setTeacherFeedbackText(sub.grade.teacherFeedback);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-purple-950/70 border-purple-500 text-white shadow-md shadow-purple-950'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span>{sub.studentName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            sub.status === 'GRADED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {sub.status === 'GRADED' && waecGrade ? `Grade ${waecGrade} (${totalScore}%)` : 'Pending Review'}
                          </span>
                        </div>
                        <p className="text-xs text-purple-300 font-medium line-clamp-1">Module: {sub.assignmentId}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                          <span>Class: {sub.studentClass}</span>
                          <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Grading Console & Rubric Scoring */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
              {selectedSubmission ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Evaluating: {selectedSubmission.studentName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Module: {selectedSubmission.assignmentId} • Class: {selectedSubmission.studentClass}
                      </p>
                    </div>
                    {gradeSavedToast && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" /> Grade Saved!
                      </span>
                    )}
                  </div>

                  {/* Submission Vector Preview Placeholder */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                    <div className="w-full h-40 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-800">
                      <div className="text-center space-y-1">
                        <PenTool className="w-8 h-8 text-cyan-400 mx-auto opacity-75" />
                        <span className="text-xs text-slate-400 font-mono block">Drawing Elements: {selectedSubmission.drawingElements?.length || 24} Vector Strokes</span>
                        <span className="text-[10px] text-cyan-400 font-mono block">Status: {selectedSubmission.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* WAEC 4-Part Rubric Form */}
                  <form onSubmit={handleSaveGrade} className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                      WAEC Technical Graphics Rubric Marking (Max 100 Marks)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Geometric Accuracy */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-semibold">1. Geometric Accuracy (±0.5mm)</span>
                          <span className="font-mono text-purple-400 font-bold">{gradingMarks.accuracy} / 40</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={gradingMarks.accuracy}
                          onChange={(e) => setGradingMarks(prev => ({ ...prev, accuracy: Number(e.target.value) }))}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                      </div>

                      {/* 2. Line Contrast & ISO 128 */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-semibold">2. Line Contrast & Sharpness</span>
                          <span className="font-mono text-purple-400 font-bold">{gradingMarks.linework} / 30</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={gradingMarks.linework}
                          onChange={(e) => setGradingMarks(prev => ({ ...prev, linework: Number(e.target.value) }))}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                      </div>

                      {/* 3. Lettering & Title Block */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-semibold">3. Lettering & Title Block</span>
                          <span className="font-mono text-purple-400 font-bold">{gradingMarks.lettering} / 20</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={gradingMarks.lettering}
                          onChange={(e) => setGradingMarks(prev => ({ ...prev, lettering: Number(e.target.value) }))}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                      </div>

                      {/* 4. Neatness & Speed */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-semibold">4. Neatness & Completion</span>
                          <span className="font-mono text-purple-400 font-bold">{gradingMarks.speed} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={gradingMarks.speed}
                          onChange={(e) => setGradingMarks(prev => ({ ...prev, speed: Number(e.target.value) }))}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Teacher Feedback Note */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-semibold">
                        Instructor Evaluation Remarks & Remedial Guidance:
                      </label>
                      <textarea
                        rows={3}
                        value={teacherFeedbackText}
                        onChange={(e) => setTeacherFeedbackText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                      />
                    </div>

                    {/* Submit Grade */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-bold text-white">
                        Cumulative Score: <span className="font-mono text-purple-400 text-lg">{gradingMarks.accuracy + gradingMarks.linework + gradingMarks.lettering + gradingMarks.speed}%</span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Award Grade & Notify Student</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 text-xs">
                  Select a student submission from the left queue to evaluate.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CLASSROOM HOST & SMART BOARD PROJECTION */}
        {activeTab === 'LIVE_CLASS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Virtual Classroom Launch Card */}
            <div className="p-6 bg-slate-900 border border-purple-900/40 rounded-2xl shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Host Live Virtual Classroom</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Start a 2-way live video and audio session with real-time synchronized CAD whiteboard. Students join with your unique room code.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                Teacher Host ID: <strong className="text-purple-300">TCH-{userProfile?.name?.slice(0, 4) || 'DAMI'}-772</strong>
              </div>
              {onOpenLiveClass && (
                <button
                  onClick={onOpenLiveClass}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Tv className="w-4 h-4" />
                  <span>Launch Live Virtual Classroom</span>
                </button>
              )}
            </div>

            {/* Smart Board Projection Mode Card */}
            <div className="p-6 bg-slate-900 border border-amber-900/40 rounded-2xl shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Board & Projector Mode</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-screen projection optimized for classroom HDMI projectors and interactive smart boards with laser pointer and step simulation.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                Active Topic: <strong className="text-amber-300">{activeTopic.title}</strong>
              </div>
              {onOpenProjectionMode && (
                <button
                  onClick={onOpenProjectionMode}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Tv className="w-4 h-4" />
                  <span>Open Smart Board Projection</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
