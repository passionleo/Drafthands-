import React, { useState } from 'react';
import { DrawingTopic } from '../../types/curriculum';
import { 
  X, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  PencilRuler, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Download, 
  AlertTriangle, 
  HelpCircle,
  Clock,
  Compass,
  FileCode,
  Check,
  Box,
  GraduationCap,
  Bookmark,
  Lightbulb
} from 'lucide-react';
import { getTextbookChapterForTopic } from '../../data/textbookData';
import { DetailedTextbookModule } from '../textbook/DetailedTextbookModule';
import { TextbookFigurePlate } from '../textbook/TextbookFigurePlate';
import { IsoDiagramViewer } from '../common/IsoDiagramViewer';

interface TheoryModalProps {
  topic: DrawingTopic;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabType;
}

export type TabType = 'TEXTBOOK' | 'PROCEDURE' | 'STANDARDS' | 'ISO_DIAGRAM' | '3D_BLUEPRINT' | 'EXAM_PRACTICE';

export const TheoryModal: React.FC<TheoryModalProps> = ({ 
  topic, 
  isOpen, 
  onClose,
  initialTab = 'TEXTBOOK'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const chapter = getTextbookChapterForTopic(topic);
  const { theory, standards } = topic;

  const handlePrintLesson = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className={`bg-slate-900 border border-slate-700 rounded-2xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-5xl max-h-[92vh]'
        }`}
      >
        {/* 1. MASTER HEADER & CURRICULUM BANNER */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {topic.moduleCode}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {topic.tier} • Textbook-Grade Curriculum Module
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {standards.waecRef}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5 tracking-tight">
                {topic.title}
              </h2>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrintLesson}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Print Lesson Notes (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-rose-900/40 hover:text-rose-300 transition-colors ml-1"
              title="Close Reference"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. SECTION NAVIGATION TABS */}
        <div className="px-4 bg-slate-950 border-b border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('TEXTBOOK')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'TEXTBOOK'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Textbook Chapter & Principles</span>
          </button>

          <button
            onClick={() => setActiveTab('PROCEDURE')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'PROCEDURE'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. Procedural Drafting Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('STANDARDS')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'STANDARDS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. ISO / NERDC Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('ISO_DIAGRAM')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ISO_DIAGRAM'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>4. ISO Technical Blueprint</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300">
              Interactive CAD
            </span>
          </button>

          <button
            onClick={() => setActiveTab('3D_BLUEPRINT')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === '3D_BLUEPRINT'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>5. 3D & Axonometric Models</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300">
              3D Orbit
            </span>
          </button>

          <button
            onClick={() => setActiveTab('EXAM_PRACTICE')}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'EXAM_PRACTICE'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>6. WAEC / NECO Exam Practice</span>
          </button>
        </div>

        {/* 3. SCROLLABLE TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-slate-300 custom-scrollbar bg-slate-900">
          
          {/* ========================================================================= */}
          {/* TAB 1: TEXTBOOK CHAPTER & PRINCIPLES                                     */}
          {/* ========================================================================= */}
          {activeTab === 'TEXTBOOK' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Authoritative Textbook References & Curriculum Standards */}
              {chapter.textbookReferences && chapter.textbookReferences.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                          Approved Curriculum Standards & Standard Textbooks
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Primary pedagogical authorities prescribed by NERDC & WAEC Technical Drawing Syllabi
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0 self-start sm:self-auto">
                      J.N. Green & Pickup/Parker Citations
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {chapter.textbookReferences.map((ref, rIdx) => (
                      <div 
                        key={rIdx}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-2 hover:border-amber-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block font-semibold">
                              {ref.author}
                            </span>
                            <h4 className="text-xs font-bold text-slate-100 leading-snug pt-1">
                              {ref.bookTitle}
                            </h4>
                          </div>
                          <Bookmark className="w-4 h-4 text-amber-400/70 shrink-0 mt-0.5" />
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                          <div><span className="text-slate-500">Edition:</span> {ref.edition}</div>
                          <div><span className="text-slate-500">Chapter:</span> {ref.chapter}</div>
                          <div><span className="text-slate-500">Coverage:</span> {ref.pages}</div>
                        </div>
                        <div className="pt-1 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>WAEC/NERDC: {ref.syllabusRelevance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Context & Theoretical Origins */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Historical Genesis & Evolution of the Geometric Theorem</span>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3">
                  {chapter.historicalContext.split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Theoretical Principles Multi-Paragraph Breakdown with Linked Figures */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Theoretical Principles, Axioms & Linked Textbook Figures
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Every theoretical concept is directly linked to an ISO-compliant technical drawing plate.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                      {chapter.figures?.length || 3} Figures Linked
                    </span>
                  </div>
                </div>

                {/* Quick Figure Index Strip */}
                {chapter.figures && chapter.figures.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Plate Index:</span>
                    {chapter.figures.map((fig, fIdx) => (
                      <span 
                        key={fIdx}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 shrink-0 flex items-center gap-1.5 cursor-default"
                        title={fig.caption}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <strong>{fig.figureNumber}</strong>: {fig.title.length > 32 ? fig.title.slice(0, 32) + '...' : fig.title}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {chapter.theoreticalPrinciples.map((principle, idx) => {
                    const linkedFigure = principle.figure || chapter.figures?.[idx] || chapter.figures?.[0];

                    return (
                      <div 
                        key={idx} 
                        className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/25 space-y-4 shadow-xl hover:border-cyan-500/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span>{principle.title}</span>
                          </h4>

                          {linkedFigure && (
                            <span className="self-start px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shrink-0">
                              <Compass className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{principle.figureRef || linkedFigure.figureNumber} Reference</span>
                            </span>
                          )}
                        </div>

                        {/* Multi-paragraph explanatory text */}
                        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed sm:pl-8">
                          {principle.paragraphs.map((para, pIdx) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                        </div>

                        {/* Mathematical formulation */}
                        {principle.mathematicalFormulation && (
                          <div className="sm:ml-8 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between gap-4">
                            <code className="text-xs font-mono text-cyan-300 font-bold">
                              {principle.mathematicalFormulation}
                            </code>
                            <span className="text-[11px] font-mono text-cyan-400/80">Mathematical Proof</span>
                          </div>
                        )}

                        {/* LINKED TEXTBOOK FIGURE PLATE: Embedded right with the principle */}
                        {linkedFigure && (
                          <div className="sm:ml-8 pt-2 pb-1">
                            <TextbookFigurePlate 
                              figure={linkedFigure}
                              plateNumber={principle.figureRef || linkedFigure.figureNumber}
                              topicTitle={topic.title}
                              topicId={topic.id}
                            />
                          </div>
                        )}

                        {/* Engineering Importance Callout */}
                        <div className="sm:ml-8 pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Engineering Importance:</strong> {principle.engineeringImportance}</span>
                        </div>

                        {/* Real world applications */}
                        {principle.realWorldApplications && (
                          <div className="sm:ml-8 pt-1 flex flex-wrap gap-1.5">
                            {principle.realWorldApplications.map((app, aIdx) => (
                              <span 
                                key={aIdx}
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60"
                              >
                                • {app}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Worked Examples (Ref: Pickup & Parker / J.N. Green) */}
              {chapter.workedExamples && chapter.workedExamples.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-amber-300 tracking-wider flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Standard Worked Examples (Pickup & Parker / J.N. Green Method)
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Classic examination problems with detailed geometrical solutions and examiner marking keys
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                      {chapter.workedExamples.length} Worked Solution{chapter.workedExamples.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {chapter.workedExamples.map((example, eIdx) => (
                      <div 
                        key={eIdx}
                        className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/25 space-y-4 shadow-xl"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block font-semibold">
                              {example.exampleNumber || `Example ${eIdx + 1}`}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100 mt-1">
                              {example.title}
                            </h4>
                          </div>
                          {(example.source || example.exampleNumber) && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 self-start">
                              Ref: {example.source || example.exampleNumber}
                            </span>
                          )}
                        </div>

                        {/* Problem Statement */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Problem Statement:</span>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                            "{example.problemStatement || example.title}"
                          </p>
                        </div>

                        {/* Given Data */}
                        {example.givenData && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Given Parameters & Boundary Conditions:</span>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(example.givenData) ? (
                                example.givenData.map((data, dIdx) => (
                                  <span 
                                    key={dIdx}
                                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/50"
                                  >
                                    {data}
                                  </span>
                                ))
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/50">
                                  {example.givenData}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step-by-Step Construction Procedure */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" />
                            Construction Procedure (Pickup & Parker Method):
                          </span>
                          <ol className="space-y-2 pl-2">
                            {example.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Key Examiner Tip & Solution Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                          {(example.keyExaminerTip || example.waecExaminerTip) && (
                            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Examiner Marking Tip:
                              </span>
                              <p className="leading-snug">{example.keyExaminerTip || example.waecExaminerTip}</p>
                            </div>
                          )}
                          {(example.solutionNotes || example.constructionTheorem) && (
                            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200/90 space-y-1">
                              <span className="font-mono text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verification & Theorem:
                              </span>
                              <p className="leading-snug">{example.solutionNotes || example.constructionTheorem}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Jump to Procedural Drafting Guide */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Interactive Step-by-Step Procedural Drafting Guide</h4>
                    <p className="text-[11px] text-slate-400">Review required drawing instruments, pencil grades (4H/2H/HB), and WAEC examiner traps.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('PROCEDURE')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-cyan-600/30"
                >
                  View Drafting Guide →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PROCEDURAL DRAFTING METHODOLOGY                                   */}
          {/* ========================================================================= */}
          {activeTab === 'PROCEDURE' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Instrument Setup & Prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Required Drafting Instruments
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {chapter.proceduralMethodology.instrumentSetup.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Draftsman Prerequisites
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {chapter.proceduralMethodology.prerequisites.map((pre, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{pre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Sequentially Numbered Methodology */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  Sequentially Numbered Procedural Sequence
                </h3>

                <div className="space-y-3">
                  {chapter.proceduralMethodology.numberedMethod.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                            {step.stepNumber}
                          </span>
                          <h4 className="text-xs font-bold text-white">{step.heading}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pencil: {step.pencilGrade}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {step.lineSpecification}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-8">
                        {step.detailedDescription}
                      </p>

                      {/* Linked Step Figure Plate (if available) */}
                      {step.figure && (
                        <div className="pl-0 sm:pl-8 pt-2">
                          <TextbookFigurePlate 
                            figure={step.figure}
                            plateNumber={step.figureRef || `Step ${step.stepNumber} Fig.`}
                            topicTitle={`${topic.title} - Step ${step.stepNumber}`}
                            topicId={topic.id}
                            compact={true}
                          />
                        </div>
                      )}

                      <div className="pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <span className="text-cyan-400 font-mono">
                          🔧 <strong>Instrument Action:</strong> {step.instrumentAction}
                        </span>
                        <span className="text-slate-400">
                          🎯 <strong>Quality Benchmark:</strong> {step.qualityCheck}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawing Guide Lines & Standards Specification Card */}
              <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Standard Drawing Guide Lines & Line Weight Rules (ISO 128 / BS 8888)
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
                    WAEC / Cambridge Marking Criteria
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-mono font-bold text-cyan-400 text-[11px] block">
                      1. Faint Guide Lines (4H)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Thickness: <strong>0.18mm - 0.25mm</strong>. Used for initial layout, projection rays, lettering waistlines, and construction rays. Must remain faint and unindented.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-mono font-bold text-amber-400 text-[11px] block">
                      2. Geometric Arcs & Bisectors (2H)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Thickness: <strong>0.25mm</strong> (Type B). Needle point pressed firmly at center. Intersecting arc feathers must be left intact for examiner verification.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-mono font-bold text-white text-[11px] block">
                      3. Finished Outlines (HB)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Thickness: <strong>0.70mm</strong> (Type A). Uniform, sharp, solid black outlines. Sharp contrast against 4H/2H guide lines is mandatory for full marks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Examiner Traps & Deduction Warnings */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>WAEC / NECO Examiner Deduction Traps to Avoid</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapter.proceduralMethodology.examinerTraps.map((trap, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-1 text-xs">
                      <h5 className="font-bold text-rose-300">{trap.trap}</h5>
                      <p className="text-rose-200/80 font-mono text-[11px]">{trap.penalty}</p>
                      <p className="text-slate-400 text-[11px] pt-1">
                        <strong>Correction:</strong> {trap.avoidance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ISO / NERDC STANDARDS & CONVENTIONS                                */}
          {/* ========================================================================= */}
          {activeTab === 'STANDARDS' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* ISO 128 Line Weight Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  ISO 128 Engineering Line Thickness & Pencil Specifications
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Line Classification</th>
                        <th className="p-3">ISO Standard Code</th>
                        <th className="p-3">Thickness (mm)</th>
                        <th className="p-3">Pencil Grade</th>
                        <th className="p-3">Strict Application Rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {chapter.standardConventions.lineWeightTable.map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-cyan-300">{line.type}</td>
                          <td className="p-3 text-slate-400">{line.isoCode}</td>
                          <td className="p-3 text-emerald-400 font-bold">{line.thickness}</td>
                          <td className="p-3 text-amber-300 font-semibold">{line.pencilGrade}</td>
                          <td className="p-3 text-slate-300">{line.ruleDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ISO 129 Dimensioning & Sheet Layout Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-400">
                    ISO 129 Dimensioning Rules
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {chapter.standardConventions.dimensioningRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-400">
                    ISO 5457 Sheet Layout & Margin Rules
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {chapter.standardConventions.sheetLayoutRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WAEC Marking Scheme Reference */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs leading-relaxed space-y-1">
                <h4 className="font-bold text-amber-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  WAEC / NERDC Official Mark Allocation Key ({standards.waecRef})
                </h4>
                <p className="text-amber-200/90">{chapter.standardConventions.waecMarkingKey}</p>
                <p className="text-slate-400 pt-1">
                  Candidates are evaluated on: Baseline Accuracy (20%), Geometric Construction Loci (40%), Line Weight Hierarchy & Finish (25%), Dimensional Accuracy & Lettering (15%).
                </p>
              </div>

              {/* Quick Launch Button to Interactive ISO Blueprint */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-blue-950/70 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      Interactive ISO Vector Blueprint & Inspector
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Explore this topic in millimeter CAD precision with live coordinate measuring and ISO 128 layer toggles.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ISO_DIAGRAM')}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition-colors shrink-0 flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <span>Open Blueprint View</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ISO 128 / ISO 5456 INTERACTIVE VECTOR BLUEPRINT VIEWER              */}
          {/* ========================================================================= */}
          {activeTab === 'ISO_DIAGRAM' && (
            <div className="animate-in fade-in duration-150 h-[680px]">
              <IsoDiagramViewer 
                topic={topic}
                viewMode="EMBEDDED"
                className="h-full"
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: 3D AXONOMETRIC & DIMENSIONED BLUEPRINT ENGINE                      */}
          {/* ========================================================================= */}
          {activeTab === '3D_BLUEPRINT' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <DetailedTextbookModule 
                topicTitle={topic.title} 
                topicId={topic.moduleCode || topic.id}
                topicCategory={topic.category}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: EXAM PRACTICE PROBLEMS & ASSIGNMENTS                               */}
          {/* ========================================================================= */}
          {activeTab === 'EXAM_PRACTICE' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  WAEC / NERDC Examination Style Questions
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Total Assessment: 45 Marks
                </span>
              </div>

              <div className="space-y-4">
                {chapter.practiceProblems.map((prob, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-lg hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                          Q{prob.questionNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Question {prob.questionNumber}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        [{prob.marks} Marks]
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-9">
                      {prob.problemText}
                    </p>

                    <div className="ml-9 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                      <div className="font-mono text-cyan-400 font-semibold">Engineering Specifications:</div>
                      <div>{prob.specifications}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 4. MODAL FOOTER */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Drafthands Master Curriculum Engine</span>
            <span>•</span>
            <span className="text-cyan-400">ISO 128 / NERDC Standard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ISO_DIAGRAM')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <PencilRuler className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vector Blueprint</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-600/30"
            >
              Close Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
