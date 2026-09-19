import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  Layers, 
  Award, 
  GraduationCap, 
  FileText,
  ChevronRight,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import { CurriculumTier, DrawingTopic } from '../../types/curriculum';
import { allCurriculumTopics, getTopicsByTier, TIER_CONFIG } from '../../data/curriculumData';
import { getTopicSpecificSVG } from '../../utils/vectorBlueprint';

interface CurriculumPreviewSectionProps {
  onSelectTopicToLaunch: (topicId: string) => void;
}

export const CurriculumPreviewSection: React.FC<CurriculumPreviewSectionProps> = ({
  onSelectTopicToLaunch
}) => {
  const [activeTier, setActiveTier] = useState<CurriculumTier>('SS1');
  const [previewTopic, setPreviewTopic] = useState<DrawingTopic | null>(null);

  const tiers: { id: CurriculumTier; label: string; badge: string; desc: string }[] = [
    { id: 'SS1', label: 'Senior Secondary 1', badge: 'Plane Geometry', desc: 'Lines, angles, bisections, polygons, scale ratio and tangency loci.' },
    { id: 'SS2', label: 'Senior Secondary 2', badge: 'Solid Geometry', desc: '1st & 3rd angle orthographic projections, isometric cubes & circles.' },
    { id: 'SS3', label: 'Senior Secondary 3', badge: 'WAEC Exam Prep', desc: 'Sectional views, interpenetration, developments & building plans.' },
    { id: 'HIGHER_INSTITUTION', label: 'Higher Institution & Tech College', badge: 'Polytechnic & B.Eng', desc: 'Computer-Aided Design (CAD), mechanical assemblies, fasteners & tolerances.' }
  ];

  const currentTopics = getTopicsByTier(activeTier);

  return (
    <section id="curriculum-preview" className="py-16 sm:py-24 bg-slate-900/60 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Syllabus Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Topics Mapped Directly to NERDC Standards
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Click any educational tier to preview modules, geometric parameters, and step-by-step vector constructions.
          </p>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar">
          {tiers.map(t => {
            const isSelected = activeTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-cyan-950 border-cyan-500/70 text-cyan-300 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isSelected ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-900 text-slate-500'}`}>
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Overview Description */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {tiers.find(t => t.id === activeTier)?.label} Overview
              </div>
              <p className="text-xs text-slate-400">
                {tiers.find(t => t.id === activeTier)?.desc}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/20 shrink-0">
            {currentTopics.length} Core Modules Available
          </span>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {currentTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="rounded-2xl bg-slate-950/90 border border-slate-800/90 p-5 flex flex-col justify-between hover:border-cyan-500/50 transition-all group shadow-md"
            >
              <div className="space-y-3">
                {/* Topic Index & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    Week {index + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {topic.category}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {topic.shortDescription}
                  </p>
                </div>

                {/* Parameters Badge Preview */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {(topic.parameters || []).slice(0, 3).map(p => (
                    <span
                      key={p.id}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {p.label}: {p.defaultValue}{p.unit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewTopic(topic)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="Preview Context-Aware Vector Blueprint"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Blueprint</span>
                </button>
                <button
                  onClick={() => onSelectTopicToLaunch(topic.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Context-Aware Vector Blueprint Preview Modal */}
        {previewTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Context-Aware Vector Blueprint
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {previewTopic.title} • {previewTopic.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const topicId = previewTopic.id;
                      setPreviewTopic(null);
                      onSelectTopicToLaunch(topicId);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewTopic(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Blueprint Vector Rendering Canvas */}
              <div className="w-full flex items-center justify-center bg-slate-950 rounded-xl p-2 sm:p-4 border border-slate-800 overflow-hidden shadow-inner">
                {getTopicSpecificSVG(previewTopic.id, previewTopic.title)}
              </div>

              {/* Technical Specifications Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Standard</span>
                  <span className="text-slate-200 font-semibold">ISO 128 / ISO 129 Line Weights</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Marking Scheme</span>
                  <span className="text-cyan-400 font-semibold">WAEC Technical Drawing Paper 2</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Format</span>
                  <span className="text-slate-200 font-semibold">100% Scalable Vector Schematic</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
