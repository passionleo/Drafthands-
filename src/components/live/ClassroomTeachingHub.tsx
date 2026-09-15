import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  ClipboardList, 
  Ruler, 
  ExternalLink, 
  Minimize2, 
  Maximize2, 
  ChevronRight, 
  Search, 
  Check, 
  Layers, 
  Award, 
  Sparkles, 
  X, 
  ArrowRight, 
  Download, 
  Eye,
  GraduationCap,
  Pin,
  CheckCircle2,
  HelpCircle,
  Compass,
  Square
} from 'lucide-react';
import { CurriculumTopic, CurriculumTier } from '../../types/curriculum';
import { allCurriculumTopics, getTopicsByTier } from '../../data/curriculumData';
import { pastQuestionsArchive, PastQuestionItem } from '../../data/pastQuestionsArchive';
import { INITIAL_TEACHER_ASSIGNMENTS, INITIAL_STUDENT_SUBMISSIONS } from '../../data/assignmentsData';
import { TeacherAssignment, StudentSubmission } from '../../types/assignments';
import { ClassroomResourceTab } from '../../types/liveClass';

// Asset imports
import tangencyImg from '../../assets/images/actual_geometry_tangency_1788450636791.jpg';
import isometricImg from '../../assets/images/actual_isometric_diagram_1788450651351.jpg';
import orthographicImg from '../../assets/images/actual_orthographic_diagram_1788450620884.jpg';
import conicImg from '../../assets/images/conic_sections_curves_1788454635138.jpg';
import foundationImg from '../../assets/images/actual_building_foundation_1788450858277.jpg';
import fastenerImg from '../../assets/images/actual_fastener_drawing_1788450874057.jpg';
import scalesImg from '../../assets/images/scales_plain_diagonal_1788454587701.jpg';
import surfaceImg from '../../assets/images/surface_developments_types_1788454604164.jpg';
import sectioningImg from '../../assets/images/sectional_views_hatching_1788454620092.jpg';
import instrumentsImg from '../../assets/images/actual_drafting_instruments_1788450673135.jpg';

interface ClassroomTeachingHubProps {
  activeTab: ClassroomResourceTab;
  onSelectTab: (tab: ClassroomResourceTab) => void;
  currentTopic: CurriculumTopic;
  onSelectTopic: (topic: CurriculumTopic) => void;
  onProjectStepsToBoard: (topic: CurriculumTopic) => void;
  onLoadPastQuestionToBoard: (pq: PastQuestionItem) => void;
  onLoadStudentSubmissionToBoard: (submission: StudentSubmission) => void;
  onCloseHub: () => void;
  onMinimizeClassroom: () => void;
  onNavigateToAppPart?: (partName: string) => void;
}

export const ClassroomTeachingHub: React.FC<ClassroomTeachingHubProps> = ({
  activeTab,
  onSelectTab,
  currentTopic,
  onSelectTopic,
  onProjectStepsToBoard,
  onLoadPastQuestionToBoard,
  onLoadStudentSubmissionToBoard,
  onCloseHub,
  onMinimizeClassroom,
  onNavigateToAppPart
}) => {
  // Curriculum tab filters
  const [selectedTier, setSelectedTier] = useState<CurriculumTier>('SS2');
  const [searchTopic, setSearchTopic] = useState<string>('');

  // Past questions tab filters
  const [selectedExamBody, setSelectedExamBody] = useState<'ALL' | 'WAEC' | 'NECO' | 'NABTEB'>('ALL');

  // Selected plate image for viewer
  const [selectedPlate, setSelectedPlate] = useState<{
    title: string;
    description: string;
    img: string;
    standards: string;
  } | null>(null);

  // Filtered topics
  const tierTopics = getTopicsByTier(selectedTier);
  const filteredTopics = tierTopics.filter(t => 
    t.title.toLowerCase().includes(searchTopic.toLowerCase()) ||
    (t.standards?.waecRef || '').toLowerCase().includes(searchTopic.toLowerCase()) ||
    (t.shortDescription || '').toLowerCase().includes(searchTopic.toLowerCase())
  );

  // Filtered past questions
  const filteredPQs = pastQuestionsArchive.filter(pq => 
    selectedExamBody === 'ALL' || pq.examBody === selectedExamBody
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border-l border-slate-800 animate-in slide-in-from-right duration-200 shadow-2xl z-30">
      {/* 1. Hub Header Bar */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">Teaching Resources & App Hub</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Minimize / Float Classroom */}
          <button
            onClick={onMinimizeClassroom}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
            title="Minimize classroom to floating bar & browse other app areas"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Browse App</span>
          </button>

          {/* Close Panel */}
          <button
            onClick={onCloseHub}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Resources Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Resource Sub-Tabs Bar */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs shrink-0 scrollbar-none">
        <button
          onClick={() => onSelectTab('CURRICULUM')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'CURRICULUM'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Topics</span>
        </button>

        <button
          onClick={() => onSelectTab('PAST_QUESTIONS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'PAST_QUESTIONS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Past Exam Bank</span>
        </button>

        <button
          onClick={() => onSelectTab('TEXTBOOK_PLATES')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'TEXTBOOK_PLATES'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Textbook Plates</span>
        </button>

        <button
          onClick={() => onSelectTab('ASSIGNMENTS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'ASSIGNMENTS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Student Submissions</span>
        </button>

        <button
          onClick={() => onSelectTab('ISO_STANDARDS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'ISO_STANDARDS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>ISO 128 Standards</span>
        </button>
      </div>

      {/* 3. Tab Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {/* ================= TAB 1: CURRICULUM & LESSON TOPICS ================= */}
        {activeTab === 'CURRICULUM' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              {/* Tier Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['SS1', 'SS2', 'SS3', 'HIGHER_INSTITUTION'] as CurriculumTier[]).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      selectedTier === tier
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier === 'HIGHER_INSTITUTION' ? 'Higher Inst.' : tier}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter topics..."
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 bg-slate-950 text-xs text-white rounded-lg border border-slate-800 outline-none focus:border-cyan-500 font-sans"
                />
              </div>
            </div>

            {/* Current Active Topic Banner */}
            <div className="p-3 bg-gradient-to-r from-cyan-950/40 to-slate-900 rounded-xl border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Currently Teaching</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{currentTopic.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{currentTopic.standards?.waecRef || currentTopic.standards?.nerdcRef || currentTopic.moduleCode}</p>
              </div>
              <button
                onClick={() => onProjectStepsToBoard(currentTopic)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition-all"
                title="Project construction steps onto the class whiteboard"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Project Steps</span>
              </button>
            </div>

            {/* Topics List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Modules ({filteredTopics.length})</span>
              <div className="grid grid-cols-1 gap-2">
                {filteredTopics.map(top => {
                  const isCurrent = top.id === currentTopic.id;
                  return (
                    <div
                      key={top.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-slate-800/80 border-cyan-500/50 ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {top.tier}
                          </span>
                          <span className="text-xs font-semibold text-white truncate">{top.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{top.shortDescription}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={() => onSelectTopic(top)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            Switch Class
                          </button>
                        )}
                        <button
                          onClick={() => onProjectStepsToBoard(top)}
                          className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
                          title="Project topic step procedure onto whiteboard"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PAST QUESTIONS ARCHIVE ================= */}
        {activeTab === 'PAST_QUESTIONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Exam Body Filters */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['ALL', 'WAEC', 'NECO', 'NABTEB'] as const).map(body => (
                  <button
                    key={body}
                    onClick={() => setSelectedExamBody(body)}
                    className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                      selectedExamBody === body
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {body}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">{filteredPQs.length} Practical Questions</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {filteredPQs.map(pq => (
                <div
                  key={pq.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {pq.examBody} {pq.year}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{pq.paperType}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5">{pq.title}</h4>
                    </div>

                    {pq.isFreeSample ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                        Open Sample
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                        Pro Exam
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {pq.id}</span>
                    <button
                      onClick={() => onLoadPastQuestionToBoard(pq)}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load to Class Board</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: TEXTBOOK PLATES & FIGURES ================= */}
        {activeTab === 'TEXTBOOK_PLATES' && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Technical Drawing Master Plates & Standards
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: 'Tangency & Precision Centerline Datum',
                  fig: 'Figure 4.12',
                  standards: 'ISO 128 / BS 8888 Geometric Standards',
                  img: tangencyImg,
                  desc: 'Construction of internal and external tangential arcs between unequal diameter circles.'
                },
                {
                  title: 'Isometric Projection & 30° Axis Grid',
                  fig: 'Figure 8.4',
                  standards: 'Standard Axonometric Pictorial Projection',
                  img: isometricImg,
                  desc: 'Isometric representation with true length scaling and isometric circle ellipses.'
                },
                {
                  title: '1st & 3rd Angle Orthographic Views',
                  fig: 'Figure 9.1',
                  standards: 'ISO Metric Multi-view Standard',
                  img: orthographicImg,
                  desc: 'Front elevation, end elevation, and plan alignment with projection symbols.'
                },
                {
                  title: 'Conic Sections: Ellipse, Parabola & Hyperbola',
                  fig: 'Figure 6.2',
                  standards: 'WAEC Syllabus Section A Construction',
                  img: conicImg,
                  desc: 'Concentric circles method and directrix-focus eccentricities.'
                },
                {
                  title: 'Building Drawing: Strip Foundation & Hardcore',
                  fig: 'Figure 14.3',
                  standards: 'Nigerian Building Code & Architecture Standards',
                  img: foundationImg,
                  desc: 'Concrete footings, foundation wall, damp-proof course (DPC), and earth floor screed.'
                },
                {
                  title: 'Mechanical Fasteners & ISO Metric Threads',
                  fig: 'Figure 12.1',
                  standards: 'ISO Metric Fastener Specifications',
                  img: fastenerImg,
                  desc: 'Hexagonal bolt head, nut geometry, pitch, and nominal thread diameter.'
                },
                {
                  title: 'Plain, Diagonal & Vernier Scales',
                  fig: 'Figure 2.5',
                  standards: 'WAEC / NERDC Engineering Scales Standard',
                  img: scalesImg,
                  desc: 'RF representative fractions, diagonal similar triangle subdivision, and least count measurement.'
                },
                {
                  title: 'Surface Developments of Prisms & Cones',
                  fig: 'Figure 10.3',
                  standards: 'ISO 128 Sheet Metal Pattern Drafting',
                  img: surfaceImg,
                  desc: 'Parallel-line and radial-line unfoldings for truncated cylinders, prisms, pyramids, and transition ducts.'
                },
                {
                  title: 'Sectional Views & ISO 128 Hatching Conventions',
                  fig: 'Figure 11.2',
                  standards: 'ISO 128-50 Sectioning Standards',
                  img: sectioningImg,
                  desc: '45° continuous thin hatching, cutting plane lines, stepped sections, and revolved section conventions.'
                },
                {
                  title: 'Professional Drafting Instruments & Equipment',
                  fig: 'Figure 1.1',
                  standards: 'BS 8888 Technical Equipment Protocol',
                  img: instrumentsImg,
                  desc: 'Standard drawing board, tee-square, 45°/60° set squares, compasses, dividers, and French curves.'
                }
              ].map((plate, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedPlate(plate)}>
                    <img
                      src={plate.img}
                      alt={plate.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/40">
                      {plate.fig}
                    </div>
                  </div>

                  <div className="p-3">
                    <h5 className="text-xs font-bold text-white">{plate.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{plate.desc}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-mono">{plate.standards}</span>
                      <button
                        onClick={() => setSelectedPlate(plate)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Inspect Plate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for Plate Inspection */}
            {selectedPlate && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedPlate.title}</h4>
                      <p className="text-xs text-slate-400">{selectedPlate.standards}</p>
                    </div>
                    <button onClick={() => setSelectedPlate(null)} className="p-1 rounded text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950">
                    <img
                      src={selectedPlate.img}
                      alt={selectedPlate.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[60vh] object-contain rounded-lg border border-slate-800 shadow-xl"
                    />
                  </div>
                  <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-300">{selectedPlate.description}</p>
                    <button
                      onClick={() => setSelectedPlate(null)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                    >
                      Close Viewer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: ASSIGNMENTS & SUBMISSIONS ================= */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Live Student Drawing Submissions</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Load any student's drawing work directly onto the board for live class correction and evaluation.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {INITIAL_STUDENT_SUBMISSIONS.map(sub => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sub.studentName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                        {sub.studentClass}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Submitted: <span className="text-slate-300 font-mono">{sub.submittedAt}</span>
                    </p>
                    {sub.studentNotes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5 truncate">
                        "{sub.studentNotes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onLoadStudentSubmissionToBoard(sub)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review on Board</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: ISO 128 TECHNICAL STANDARDS ================= */}
        {activeTab === 'ISO_STANDARDS' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-cyan-400" />
                ISO 128 Engineering Line Conventions
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Official technical standards for pencil grades, line weights, and multi-view representation required by WAEC & Cambridge.
              </p>
            </div>

            {/* Line Types Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Line Type</th>
                    <th className="p-2.5">Pencil Grade</th>
                    <th className="p-2.5">Weight (mm)</th>
                    <th className="p-2.5">Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Continuous Thick</td>
                    <td className="p-2.5 font-mono text-cyan-400">HB</td>
                    <td className="p-2.5 font-mono">0.70 mm</td>
                    <td className="p-2.5">Visible outlines & edges</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Continuous Thin</td>
                    <td className="p-2.5 font-mono text-cyan-400">2H / 3H</td>
                    <td className="p-2.5 font-mono">0.30 mm</td>
                    <td className="p-2.5">Construction lines, extension, dimensions</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Dashed Thin</td>
                    <td className="p-2.5 font-mono text-cyan-400">H</td>
                    <td className="p-2.5 font-mono">0.35 mm</td>
                    <td className="p-2.5">Hidden outlines and edges</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Chain Thin (Long-Short)</td>
                    <td className="p-2.5 font-mono text-cyan-400">2H</td>
                    <td className="p-2.5 font-mono">0.25 mm</td>
                    <td className="p-2.5">Center lines, axes of symmetry</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Continuous Freehand</td>
                    <td className="p-2.5 font-mono text-cyan-400">HB</td>
                    <td className="p-2.5 font-mono">0.35 mm</td>
                    <td className="p-2.5">Break lines, short break limits</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Standard Scales */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white">Recommended Drawing Scales</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Full Size</span>
                  <strong className="text-cyan-400 font-mono">1 : 1</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Reduction</span>
                  <strong className="text-cyan-400 font-mono">1:2, 1:5, 1:10</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Enlargement</span>
                  <strong className="text-cyan-400 font-mono">2:1, 5:1, 10:1</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
