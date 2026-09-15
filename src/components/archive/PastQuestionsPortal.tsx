// Drafthands Past Questions Archive & Tier-Gated Download Architecture
import React, { useState } from 'react';

export interface PastQuestionItem {
  id: string;
  examBody: 'WAEC' | 'NECO' | 'NABTEB';
  year: number;
  paperType: 'Paper 1 (Objectives)' | 'Paper 2 (Practical Geometry)' | 'Paper 3 (Building/Mechanical Drawing)';
  title: string;
  isFreeSample: boolean; // First 3 are true, rest are false (Pro gated)
  pdfUrl: string;
  svgBlueprintData?: string;
}

export const pastQuestionsArchive: PastQuestionItem[] = [
  // Free Tier - First 3 Samples
  {
    id: "PQ-WAEC-2023-P2",
    examBody: "WAEC",
    year: 2023,
    paperType: "Paper 2 (Practical Geometry)",
    title: "WAEC Technical Drawing May/June 2023 - Section A (Conic Sections & Tangency)",
    isFreeSample: true,
    pdfUrl: "/archives/waec-2023-paper2.pdf"
  },
  {
    id: "PQ-NECO-2022-P2",
    examBody: "NECO",
    year: 2022,
    paperType: "Paper 2 (Practical Geometry)",
    title: "NECO Technical Drawing June/July 2022 - Orthographic Projection Block",
    isFreeSample: true,
    pdfUrl: "/archives/neco-2022-paper2.pdf"
  },
  {
    id: "PQ-NABTEB-2023-P3",
    examBody: "NABTEB",
    year: 2023,
    paperType: "Paper 3 (Building/Mechanical Drawing)",
    title: "NABTEB May/June 2023 - Roof Truss & Details",
    isFreeSample: true,
    pdfUrl: "/archives/nabteb-2023-paper3.pdf"
  },
  
  // Pro Tier Gated Past Questions (4th onwards)
  {
    id: "PQ-WAEC-2022-P2",
    examBody: "WAEC",
    year: 2022,
    paperType: "Paper 2 (Practical Geometry)",
    title: "WAEC Technical Drawing May/June 2022 - Isometric to Orthographic Conversion",
    isFreeSample: false,
    pdfUrl: "/archives/waec-2022-paper2.pdf"
  },
  {
    id: "PQ-WAEC-2021-P2",
    examBody: "WAEC",
    year: 2021,
    paperType: "Paper 2 (Practical Geometry)",
    title: "WAEC Technical Drawing May/June 2021 - Interpenetration of Cylinders",
    isFreeSample: false,
    pdfUrl: "/archives/waec-2021-paper2.pdf"
  }
];

interface PastQuestionsPortalProps {
  userTier: 'free' | 'pro';
  onUpgradeRequest?: () => void;
}

export function PastQuestionsPortal({ userTier, onUpgradeRequest }: PastQuestionsPortalProps) {
  const [selectedExam, setSelectedExam] = useState<string>('ALL');

  const handleDownloadOrView = (item: PastQuestionItem) => {
    if (item.isFreeSample || userTier === 'pro') {
      // Trigger secure download or open viewer
      const link = document.createElement('a');
      link.href = item.pdfUrl;
      link.download = `${item.id}-Drafthands.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Prompt upgrade modal / notification
      if (onUpgradeRequest) {
        onUpgradeRequest();
      } else {
        try {
          alert("🔒 Pro Access Required: Upgrade your Drafthands account to access and download the full 10-year WAEC, NECO, and NABTEB authenticated archive.");
        } catch {
          console.warn("Pro Access Required for this paper");
        }
      }
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-100 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Authentic Examination Archive</h2>
          <p className="text-xs text-slate-400">Verified WAEC, NECO & NABTEB Technical Drawing past questions (SS1 to Higher Institution).</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'WAEC', 'NECO', 'NABTEB'].map((body) => (
            <button
              key={body}
              onClick={() => setSelectedExam(body)}
              className={`px-3 py-1.5 text-xs font-mono rounded ${selectedExam === body ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
            >
              {body}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastQuestionsArchive
          .filter(item => selectedExam === 'ALL' || item.examBody === selectedExam)
          .map((item) => {
            const isAccessible = item.isFreeSample || userTier === 'pro';
            return (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                      {item.examBody} — {item.year}
                    </span>
                    {!isAccessible && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                        🔒 Pro Only
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.paperType}</p>
                </div>

                <button
                  onClick={() => handleDownloadOrView(item)}
                  className={`w-full py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 ${
                    isAccessible 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isAccessible ? '📥 Download Verified PDF' : '⚡ Upgrade to Pro for Access'}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
