import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Presentation, 
  Sliders, 
  Search,
  Sparkles,
  Layers,
  LayoutTemplate,
  Calendar
} from 'lucide-react';
import { DrawingTopic, CurriculumTier, CurriculumTerm } from '../../types/curriculum';
import { generateLessonPlanForTopic } from '../../data/lessonNotesGenerator';
import { TIER_CONFIG, TERM_CONFIG } from '../../data/curriculumData';

interface TeacherPortalModalProps {
  topics: DrawingTopic[];
  activeTopic: DrawingTopic;
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
  onOpenWhiteboardForTopic?: (topicId: string) => void;
}

type TabType = 'DOCUMENT' | 'DELIVERY_GUIDE' | 'MARKING_RUBRIC' | 'BOARD_LAYOUT';

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  topics,
  activeTopic,
  isOpen,
  onClose,
  onSelectTopic,
  onOpenWhiteboardForTopic
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('DOCUMENT');
  const [selectedTierFilter, setSelectedTierFilter] = useState<CurriculumTier | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Editable Teacher Metadata
  const [schoolName, setSchoolName] = useState<string>('Federal Science and Technical College (FSTC)');
  const [teacherName, setTeacherName] = useState<string>('Engr. Drafthands Faculty Lead');
  const [term, setTerm] = useState<string>(() => 
    activeTopic.termLabel || (activeTopic.term === 'TERM_2' ? 'Second Term' : activeTopic.term === 'TERM_3' ? 'Third Term' : 'First Term')
  );
  const [week, setWeek] = useState<string>(() => 
    activeTopic.week ? `Week ${activeTopic.week}` : 'Week 1'
  );

  useEffect(() => {
    if (activeTopic) {
      setTerm(activeTopic.termLabel || (activeTopic.term === 'TERM_2' ? 'Second Term' : activeTopic.term === 'TERM_3' ? 'Third Term' : 'First Term'));
      setWeek(activeTopic.week ? `Week ${activeTopic.week}` : 'Week 1');
    }
  }, [activeTopic.id, activeTopic.term, activeTopic.termLabel, activeTopic.week]);

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
    const mdContent = `# LESSON NOTE: ${lessonPlan.topicTitle}
**Subject:** ${lessonPlan.subject}
**Module Code:** ${lessonPlan.moduleCode}
**Class / Tier:** ${lessonPlan.tier} (${TIER_CONFIG[activeTopic.tier]?.label || activeTopic.tier})
**School:** ${schoolName}
**Teacher:** ${teacherName}
**Term/Week:** ${term} - ${week} | **Duration:** ${lessonPlan.periodDuration}
**Accreditation Standards:** 
- WAEC: ${lessonPlan.standards.waec}
- NERDC: ${lessonPlan.standards.nerdc}
- ISO: ${lessonPlan.standards.iso}

---

## 1. PERFORMANCE OBJECTIVES
### Cognitive Domain:
${lessonPlan.objectives.cognitive.map(o => `- ${o}`).join('\n')}

### Psychomotor (Drafting) Domain:
${lessonPlan.objectives.psychomotor.map(o => `- ${o}`).join('\n')}

### Affective Domain:
${lessonPlan.objectives.affective.map(o => `- ${o}`).join('\n')}

---

## 2. INSTRUCTIONAL MATERIALS & APPARATUS
- **Teacher:** ${lessonPlan.instructionalMaterials.teacherApparatus.join(', ')}
- **Students:** ${lessonPlan.instructionalMaterials.studentMaterials.join(', ')}
- **Digital Aids:** ${lessonPlan.instructionalMaterials.digitalAids.join(', ')}

---

## 3. ENTRY BEHAVIOR & SET INDUCTION
- **Entry Behavior:** ${lessonPlan.entryBehavior}
- **Set Induction (${lessonPlan.setInduction.durationMins} mins):** ${lessonPlan.setInduction.activity}
- **Trigger Question:** "${lessonPlan.setInduction.triggerQuestion}"

---

## 4. STEP-BY-STEP WHITEBOARD DELIVERY
${lessonPlan.deliverySteps.map(s => `### Step ${s.stepNumber}: ${s.title} (${s.durationMins} Mins)
**Method:** ${s.instructionalMethod}
**Teacher Activities:**
${s.teacherActivities}

**Student Activities:**
${s.studentActivities}

**Whiteboard Notes:** ${s.whiteboardNotes}
**Pitfall Warning:** ${s.pitfallsToHighlight}
`).join('\n')}

---

## 5. COMMON MISCONCEPTIONS & WAEC MARKING PITFALLS
${lessonPlan.commonMisconceptions.map(m => `- **Misconception:** ${m.misconception}
  - **Correction:** ${m.correctiveGuidance}
  - **WAEC Penalty:** ${m.waecPenalty}`).join('\n\n')}

---

## 6. IN-CLASS PRACTICE & ASSIGNMENT
**In-Class Exercise (${lessonPlan.classExercise.expectedTimeMins} mins):**
${lessonPlan.classExercise.taskDescription}

**Take-Home Assignment:**
${lessonPlan.assignment.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---

## 7. WAEC EXAMINATION MARKING SCHEME (TOTAL: ${lessonPlan.evaluationAndExamScheme.totalMarks} MARKS)
${lessonPlan.evaluationAndExamScheme.criteria.map(c => `- **${c.component} (${c.marksAllocated} Marks):** ${c.toleranceGuide}`).join('\n')}
`;

    navigator.clipboard.writeText(mdContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(lessonPlan, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `Lesson_Note_${lessonPlan.moduleCode}_${lessonPlan.topicTitle.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Teacher Portal & Lesson Generator
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  WAEC / NERDC / ISO 128 Accredited
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                Technical Drawing Lesson Plan Generator
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              title="Copy Complete Lesson Plan as Formatted Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Note' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              title="Download Lesson Plan JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-600/30"
              title="Print Official Lesson Plan Document (PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>

            {onOpenWhiteboardForTopic && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWhiteboardForTopic(activeTopic.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-600/30"
                title="Launch Interactive Whiteboard for this Lesson"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Teach Live</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Control Bar: Topic Selector & Meta Customizer */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Topic Selector Modal Dropdown */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <span className="text-slate-400 font-medium">Selected Module:</span>
            <select
              value={activeTopic.id}
              onChange={(e) => onSelectTopic(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-cyan-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-cyan-500 focus:outline-none max-w-md truncate"
            >
              {topics.map(t => {
                const termStr = t.term === 'TERM_1' ? '1st Term' : t.term === 'TERM_2' ? '2nd Term' : t.term === 'TERM_3' ? '3rd Term' : '';
                const weekStr = t.week ? `W${t.week}` : '';
                const labelTag = [t.tier, termStr, weekStr].filter(Boolean).join(' • ');
                return (
                  <option key={t.id} value={t.id}>
                    [{labelTag}] {t.moduleCode}: {t.title}
                  </option>
                );
              })}
            </select>

            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              {activeTopic.standards.waecRef}
            </span>
          </div>

          {/* Teacher Metadata Inputs */}
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400">School:</span>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-36 focus:outline-none focus:border-cyan-500"
                placeholder="School Name"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400">Teacher:</span>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-28 focus:outline-none focus:border-cyan-500"
                placeholder="Teacher Name"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400">Term/Wk:</span>
              <input
                type="text"
                value={`${term} / ${week}`}
                onChange={(e) => {
                  const parts = e.target.value.split('/');
                  if (parts[0]) setTerm(parts[0].trim());
                  if (parts[1]) setWeek(parts[1].trim());
                }}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-24 focus:outline-none focus:border-cyan-500"
                placeholder="Term / Wk"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 bg-slate-950 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('DOCUMENT')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'DOCUMENT'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Lesson Plan Document</span>
          </button>

          <button
            onClick={() => setActiveTab('DELIVERY_GUIDE')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'DELIVERY_GUIDE'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Whiteboard Delivery Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKING_RUBRIC')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'MARKING_RUBRIC'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>WAEC / Exam Marking Scheme</span>
          </button>

          <button
            onClick={() => setActiveTab('BOARD_LAYOUT')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'BOARD_LAYOUT'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Chalkboard / Screen Layout</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900 custom-scrollbar text-slate-200">
          {activeTab === 'DOCUMENT' && (
            <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:text-black print:border-none print:shadow-none">
              {/* Document Official Header */}
              <div className="border-b-2 border-slate-700 pb-4 text-center space-y-1">
                <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-100 print:text-black">
                  {schoolName}
                </h1>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider print:text-gray-700">
                  Department of Vocational, Technical & Engineering Education
                </p>
                <h2 className="text-sm font-bold text-slate-300 uppercase print:text-gray-900 pt-1">
                  OFFICIAL TECHNICAL DRAWING LESSON PLAN NOTE
                </h2>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">SUBJECT:</span>
                  <strong className="text-slate-200">Technical Drawing</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CLASS / TIER:</span>
                  <strong className="text-cyan-300">{lessonPlan.tier}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TERM / WEEK:</span>
                  <strong className="text-slate-200">{term} / {week}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DURATION:</span>
                  <strong className="text-slate-200">{lessonPlan.periodDuration}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">TOPIC & MODULE:</span>
                  <strong className="text-amber-300">[{lessonPlan.moduleCode}] {lessonPlan.topicTitle}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">INSTRUCTOR:</span>
                  <strong className="text-slate-200">{teacherName}</strong>
                </div>
              </div>

              {/* Accreditation References */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">Curriculum Alignment:</span>
                </div>
                <span className="text-slate-300">{lessonPlan.standards.waec}</span>
                <span className="text-slate-400">| {lessonPlan.standards.iso}</span>
              </div>

              {/* Section 1: Rationale & Entry Behavior */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>1.0</span> <span>Rationale & Entry Behavior</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <strong className="text-slate-300 font-semibold block">Entry Behavior (Prior Knowledge):</strong>
                    <p className="text-slate-400 leading-relaxed">{lessonPlan.entryBehavior}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <strong className="text-slate-300 font-semibold block">Instructional Rationale:</strong>
                    <p className="text-slate-400 leading-relaxed">{lessonPlan.rationale}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Behavioral Performance Objectives */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>2.0</span> <span>Behavioral Performance Objectives</span>
                </h3>
                <p className="text-xs text-slate-400">
                  By the end of this 80-minute double period, students should be able to:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  {/* Cognitive */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase font-mono block">
                      Cognitive Domain:
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {lessonPlan.objectives.cognitive.map((obj, i) => (
                        <li key={i} className="leading-relaxed">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Psychomotor */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase font-mono block">
                      Psychomotor (Drafting):
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {lessonPlan.objectives.psychomotor.map((obj, i) => (
                        <li key={i} className="leading-relaxed">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Affective */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-purple-400 uppercase font-mono block">
                      Affective Domain:
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {lessonPlan.objectives.affective.map((obj, i) => (
                        <li key={i} className="leading-relaxed">{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3: Instructional Materials & Set Induction */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>3.0</span> <span>Instructional Materials & Set Induction</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs">
                  <div>
                    <strong className="text-slate-300">Teacher Apparatus:</strong>{' '}
                    <span className="text-slate-400">{lessonPlan.instructionalMaterials.teacherApparatus.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-slate-300">Student Materials:</strong>{' '}
                    <span className="text-slate-400">{lessonPlan.instructionalMaterials.studentMaterials.join(', ')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <strong className="text-cyan-300 block mb-1">
                      Set Induction & Trigger Question ({lessonPlan.setInduction.durationMins} Mins):
                    </strong>
                    <p className="text-slate-300 leading-relaxed mb-1.5">{lessonPlan.setInduction.activity}</p>
                    <p className="text-amber-300 italic">Trigger Question: &quot;{lessonPlan.setInduction.triggerQuestion}&quot;</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Whiteboard Procedural Teaching Delivery */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>4.0</span> <span>Step-by-Step Whiteboard Teaching Delivery</span>
                </h3>
                <div className="space-y-3">
                  {lessonPlan.deliverySteps.map((step) => (
                    <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                        <strong className="text-slate-200 text-sm">
                          Step {step.stepNumber}: {step.title}
                        </strong>
                        <span className="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-slate-800">
                          {step.durationMins} Mins
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-cyan-400 font-semibold block text-[11px]">Teacher Activities:</span>
                          <p className="text-slate-300 whitespace-pre-line leading-relaxed">{step.teacherActivities}</p>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-semibold block text-[11px]">Student Activities:</span>
                          <p className="text-slate-300 whitespace-pre-line leading-relaxed">{step.studentActivities}</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90">
                        <strong>Pitfall Alert:</strong> {step.pitfallsToHighlight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Common Misconceptions & WAEC Penalties */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>5.0</span> <span>Common Student Misconceptions & WAEC Penalties</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-300 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Identified Misconception</th>
                        <th className="p-3">Corrective Teacher Intervention</th>
                        <th className="p-3">WAEC Marking Penalty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-300">
                      {lessonPlan.commonMisconceptions.map((m, i) => (
                        <tr key={i}>
                          <td className="p-3 font-medium text-amber-300">{m.misconception}</td>
                          <td className="p-3 text-slate-400">{m.correctiveGuidance}</td>
                          <td className="p-3 font-mono text-red-400">{m.waecPenalty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 6: Evaluation & Assignment */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase text-cyan-400">Class Evaluation Task:</h4>
                  <p className="text-slate-300">{lessonPlan.classExercise.taskDescription}</p>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Allocated Time: {lessonPlan.classExercise.expectedTimeMins} Minutes
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase text-cyan-400">Take-Home Worksheet:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {lessonPlan.assignment.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    Submission: {lessonPlan.assignment.submissionDate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DELIVERY_GUIDE' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Live Whiteboard Delivery Breakdown</h3>
                  <p className="text-xs text-slate-400">Chronological instructional timeline for 80-minute double period</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Total: 80 Mins
                </span>
              </div>

              <div className="space-y-3">
                {lessonPlan.deliverySteps.map((step) => (
                  <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono text-xs font-bold">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {step.durationMins} Mins
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <strong className="text-cyan-400 block">Teacher Demonstration:</strong>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                          {step.teacherActivities}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <strong className="text-emerald-400 block">Student Execution:</strong>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                          {step.studentActivities}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90">
                      <strong>Whiteboard Note / Guideline:</strong> {step.whiteboardNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'MARKING_RUBRIC' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">WAEC Standard Marking Scheme</span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  Examination Assessment Rubrics (Total: {lessonPlan.evaluationAndExamScheme.totalMarks} Marks)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Official grading criteria based on WAEC Technical Drawing Paper 2 & ISO 128 Standards.
                </p>
              </div>

              <div className="space-y-3">
                {lessonPlan.evaluationAndExamScheme.criteria.map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <strong className="text-slate-200 text-sm">{crit.component}</strong>
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                        {crit.marksAllocated} Marks
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Assessment Standard:</span>
                      <p className="text-slate-300 leading-relaxed font-medium">{crit.toleranceGuide}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-red-400 font-semibold block mb-1">Common WAEC Deduction Penalties:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                        {crit.commonDeductionErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'BOARD_LAYOUT' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-100">Standard Whiteboard / Blackboard Layout Plan</h3>
                <p className="text-xs text-slate-400">Recommended 3-column physical chalkboard layout for maximum classroom visibility</p>
              </div>

              {/* 3-Column Chalkboard Mockup */}
              <div className="grid md:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-950/40 border-4 border-amber-900/60 shadow-2xl text-emerald-100 font-mono text-xs">
                {/* Left Panel */}
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/40 space-y-2">
                  <div className="text-center font-bold border-b border-emerald-800/60 pb-1 text-amber-300">
                    LEFT BOARD (METADATA)
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    {lessonPlan.boardSummaryLayout.leftPanel.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>

                {/* Center Panel */}
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/40 space-y-2 md:col-span-1">
                  <div className="text-center font-bold border-b border-emerald-800/60 pb-1 text-cyan-300">
                    CENTER BOARD (DRAWING)
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    {lessonPlan.boardSummaryLayout.centerCanvas.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    <div className="mt-4 p-3 rounded border border-dashed border-emerald-700/60 text-center text-emerald-400/80 text-[10px]">
                      [Live Compass & Set-Square Demonstration Area]
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/40 space-y-2">
                  <div className="text-center font-bold border-b border-emerald-800/60 pb-1 text-amber-300">
                    RIGHT BOARD (SUMMARY)
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    {lessonPlan.boardSummaryLayout.rightPanel.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
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
