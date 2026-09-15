// Drafthands Advanced Textbook & Interactive 3D/Vector Blueprint Engine
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bookmark, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  Compass, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { dynamicTopicRegistry, TopicContentPayload, getDynamicTopicContent } from './dynamicTopicRegistry';
import { GeminiTopicIllustrationLoader } from './GeminiTopicIllustrationLoader';
import { TextbookFigurePlate } from './TextbookFigurePlate';
import { TextbookFigure, WorkedExample, TextbookReference } from '../../types/textbook';
import { textbookCurriculumDatabase } from '../../data/curriculumReferenceTextbook';
import { resolveCurriculumDomainKey } from '../../data/textbookData';

export interface DetailedDiagram {
  figureNumber: string;
  title: string;
  description: string;
  dimensions: string[];
  labels: { text: string; x: number; y: number }[];
  svgType: 'tangent' | 'bisection' | 'orthographic' | 'isometric' | 'section' | 'building' | 'fastener' | 'scales' | 'cad' | string;
  imageUrl?: string;
  textbookSource?: string;
}

export const defaultDetailedDiagrams: DetailedDiagram[] = [
  {
    figureNumber: "Fig. 3.1",
    title: "Tangency & Precision Centerline Datum",
    description: "Axial center distance layout with internal contact radii and dimension tolerance margins.",
    dimensions: ["Ø 75.0 [±0.1]", "R 35.0", "L = 230.0mm"],
    labels: [
      { text: "Datum Point O₁", x: 250, y: 130 },
      { text: "Tangent Point T₁", x: 190, y: 130 },
      { text: "Offset Arc R₂", x: 310, y: 130 }
    ],
    svgType: "tangent",
    imageUrl: "/assets/actual_geometry_tangency.jpg",
    textbookSource: "J.N. Green Chap. 4 & Pickup & Parker Vol. 1"
  },
  {
    figureNumber: "Fig. 3.2",
    title: "Perpendicular Bisector & Angular Projection",
    description: "True geometric bisection establishing equidistant focal arcs and normal bisecting plane.",
    dimensions: ["90° [±0.05°]", "AB = 300.0mm", "½ AB = 150.0mm"],
    labels: [
      { text: "Midpoint M", x: 250, y: 130 },
      { text: "Arc Node C", x: 250, y: 60 },
      { text: "Arc Node D", x: 250, y: 200 }
    ],
    svgType: "bisection",
    imageUrl: "/assets/bisection_plate.jpg",
    textbookSource: "J.N. Green Fig. 2.8 & Pickup & Parker Ex. 2"
  }
];

export function DetailedTextbookModule({ 
  topicTitle, 
  topicId,
  topicCategory,
  diagrams
}: { 
  topicTitle: string; 
  topicId?: string;
  topicCategory?: string;
  diagrams?: DetailedDiagram[]; 
}) {
  // 3D Model Viewport Transform States
  const [rotationX, setRotationX] = useState<number>(25);
  const [rotationY, setRotationY] = useState<number>(45);
  const [zoom, setZoom] = useState<number>(1);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resolve curriculum reference database using full master curriculum resolver
  const domainKey = resolveCurriculumDomainKey({ id: topicId || '', title: topicTitle || '', category: topicCategory || '' } as any);
  const curriculumChapter = textbookCurriculumDatabase[domainKey] || textbookCurriculumDatabase['bisection'];

  // Content resolution
  const resolvedContent: TopicContentPayload = getDynamicTopicContent(topicId, topicTitle, topicCategory);
  const resolvedTitle = resolvedContent.title || topicTitle;
  const resolvedCategory = topicCategory || resolvedContent.category || "Technical Drawing";

  // Figures resolution: prefer curriculum chapter figures if available
  const activeFigures: TextbookFigure[] = curriculumChapter.figures && curriculumChapter.figures.length > 0
    ? curriculumChapter.figures
    : (diagrams && diagrams.length > 0 
        ? diagrams.map((d, i) => ({
            figureNumber: d.figureNumber || `Fig. ${i + 1}.1`,
            title: d.title,
            caption: d.description,
            dimensions: d.dimensions,
            imageUrl: d.imageUrl,
            svgType: d.svgType,
            technicalNotes: ['ISO 128 Compliant', 'WAEC / NERDC Standard'],
            textbookSource: d.textbookSource || 'J.N. Green & Pickup & Parker'
          }))
        : defaultDetailedDiagrams.map((d, i) => ({
            figureNumber: d.figureNumber || `Fig. ${i + 1}.1`,
            title: d.title,
            caption: d.description,
            dimensions: d.dimensions,
            imageUrl: d.imageUrl,
            svgType: d.svgType,
            technicalNotes: ['ISO 128 Compliant', 'WAEC / NERDC Standard'],
            textbookSource: d.textbookSource || 'J.N. Green & Pickup & Parker'
          }))
      );

  const textbookRefs: TextbookReference[] = curriculumChapter.textbookReferences || [
    {
      bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
      author: 'J.N. Green',
      edition: '3rd Metric Edition, Evans Brothers Ltd',
      chapter: 'Core Geometric Constructions',
      pages: 'Standard Curriculum Reference',
      syllabusRelevance: 'WAEC / NERDC Syllabus'
    },
    {
      bookTitle: 'Engineering Drawing with Worked Examples',
      author: 'F. Pickup & M.A. Parker',
      edition: '3rd Edition, Nelson Thornes',
      chapter: 'Plane and Solid Geometry',
      pages: 'Standard Engineering Practice',
      syllabusRelevance: 'G.C.E. / WAEC Technical Drawing'
    }
  ];

  const workedExamples: WorkedExample[] = curriculumChapter.workedExamples || [];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsInteracting(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationY(prev => prev + dx * 0.5);
    setRotationX(prev => Math.max(-80, Math.min(80, prev - dy * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
  };

  return (
    <div className="w-full bg-slate-950 p-6 text-slate-100 space-y-8 rounded-xl border border-slate-800 shadow-2xl">
      {/* Textbook Header & Metadata */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
              ISO 128 / NERDC Standard Module
            </span>
            <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
              {resolvedCategory}
            </span>
            {topicId && (
              <span className="text-xs font-mono text-slate-400">
                {topicId}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-2 text-white">{resolvedTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative curriculum chapter referencing J.N. Green and F. Pickup & M.A. Parker with step-by-step worked examples.
          </p>
        </div>
      </div>

      {/* Authoritative Textbook References & Curriculum Standards */}
      {textbookRefs.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Approved Standard Textbooks & Reference Standards
                </h3>
                <p className="text-[11px] text-slate-400">
                  Prescribed authorities by NERDC, WAEC, and Cambridge Technical Drawing Syllabi
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0 self-start sm:self-auto">
              J.N. Green & Pickup/Parker Citations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {textbookRefs.map((ref, rIdx) => (
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
                  {ref.pages && <div><span className="text-slate-500">Coverage:</span> {ref.pages}</div>}
                </div>
                <div className="pt-1 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Syllabus: {ref.syllabusRelevance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive 3D Model Control Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>🌐</span> Interactive 3D Axonometric / Isometric Sandbox
            </h3>
            <p className="text-xs text-slate-400">Drag to rotate the model axially in 3D coordinate space.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setRotationX(25); setRotationY(45); setZoom(1); }} 
              className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset View
            </button>
            <button onClick={() => setZoom(prev => Math.min(2, prev + 0.2))} className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">+</button>
            <button onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))} className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">-</button>
          </div>
        </div>

        {/* 3D Render Canvas Container */}
        <div 
          className="w-full h-80 bg-slate-950 rounded-lg border border-slate-800 relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div 
            className="transition-transform duration-75 ease-out select-none"
            style={{ 
              transform: `perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Simulated 3D Engineering Block Wireframe */}
            <div className="relative w-48 h-48 border-2 border-cyan-400 bg-cyan-950/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)]">
              <span className="text-xs font-mono text-cyan-300 text-center">3D Projection Space<br/>({rotationX.toFixed(0)}°, {rotationY.toFixed(0)}°)</span>
              <div className="absolute -top-12 -left-12 w-48 h-48 border border-blue-500/40 pointer-events-none transform translate-z-10"></div>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
            Axis X: {rotationX.toFixed(1)}° | Axis Y: {rotationY.toFixed(1)}° | Zoom: {zoom.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* ISO 128 Standard Technical Drawing Figure Plates */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              ISO 128 Standard Technical Drawing Figure Plates
            </h3>
            <p className="text-xs text-slate-400">
              High-resolution textbook plates directly referenced from J.N. Green and Pickup & Parker.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60 shrink-0 self-start sm:self-auto">
            {activeFigures.length} Dimensioned Plates
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeFigures.map((fig, index) => (
            <TextbookFigurePlate 
              key={index}
              figure={fig}
              plateNumber={fig.figureNumber}
              topicTitle={resolvedTitle}
              topicId={topicId}
            />
          ))}
        </div>
      </div>

      {/* Step-by-Step Worked Examples (Ref: Pickup & Parker / J.N. Green) */}
      {workedExamples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Standard Worked Examples (Pickup & Parker / J.N. Green Method)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full geometric derivation and examiner marking tips
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
              {workedExamples.length} Solution{workedExamples.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {workedExamples.map((example, eIdx) => (
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

      {/* Dynamic Gemini Technical Blueprint Generator Studio */}
      <GeminiTopicIllustrationLoader 
        topicId={topicId || "TD-GEN-01"} 
        topicTitle={resolvedTitle} 
      />
    </div>
  );
}
