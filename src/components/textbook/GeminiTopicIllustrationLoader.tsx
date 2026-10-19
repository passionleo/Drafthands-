// Drafthands Live Interactive Vector Blueprint & ISO 128 Studio Component
import React from 'react';
import { IsoDiagramViewer } from '../common/IsoDiagramViewer';
import { getTopicById } from '../../data/curriculumData';
import { Sparkles, Compass } from 'lucide-react';

export function GeminiTopicIllustrationLoader({ topicId, topicTitle }: { topicId: string; topicTitle: string }) {
  const topicObj = getTopicById(topicId);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>✨</span> Live Interactive ISO Vector Blueprint & Dynamic Studio
          </h3>
          <p className="text-xs text-slate-400">Authentic dimensioned vector schematic and interactive workspace for "{topicTitle}".</p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-full text-[10px] font-mono flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          ISO 128 Vector Standard
        </span>
      </div>

      {/* Live Interactive Vector Diagram Viewer (Replaces static raster schematic images) */}
      <div className="w-full h-[480px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-2xl">
        <IsoDiagramViewer topicId={topicId} topic={topicObj} viewMode="EMBEDDED" />
      </div>
    </div>
  );
}
