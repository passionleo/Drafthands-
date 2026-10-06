// Drafthands Past Questions Archive & Tier-Gated Download Architecture
import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';

export interface PastQuestionItem {
  id: string;
  examBody: 'WAEC' | 'NECO' | 'NABTEB';
  year: number;
  paperType: 'Paper 1 (Objectives)' | 'Paper 2 (Practical Geometry)' | 'Paper 3 (Building/Mechanical Drawing)';
  title: string;
  isFreeSample: boolean;
  pdfUrl: string;
}

export const pastQuestionsArchive: PastQuestionItem[] = [
  // --- WAEC Technical Drawing (2014 - 2024) ---
  { id: "PQ-WAEC-2024-P1", examBody: "WAEC", year: 2024, paperType: "Paper 1 (Objectives)", title: "WAEC May/June 2024 - Paper 1 (Full Objective Questions & Solutions)", isFreeSample: true, pdfUrl: "/archives/waec-2024-paper1.pdf" },
  { id: "PQ-WAEC-2024-P2", examBody: "WAEC", year: 2024, paperType: "Paper 2 (Practical Geometry)", title: "WAEC May/June 2024 - Practical Geometry & Conic Sections", isFreeSample: true, pdfUrl: "/archives/waec-2024-paper2.pdf" },
  { id: "PQ-WAEC-2024-P3", examBody: "WAEC", year: 2024, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "WAEC May/June 2024 - Building Foundation & Roof Details", isFreeSample: false, pdfUrl: "/archives/waec-2024-paper3.pdf" },
  
  { id: "PQ-WAEC-2023-P1", examBody: "WAEC", year: 2023, paperType: "Paper 1 (Objectives)", title: "WAEC May/June 2023 - Paper 1 (Objectives)", isFreeSample: false, pdfUrl: "/archives/waec-2023-paper1.pdf" },
  { id: "PQ-WAEC-2023-P2", examBody: "WAEC", year: 2023, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing May/June 2023 - Section A (Conic Sections & Tangency)", isFreeSample: true, pdfUrl: "/archives/waec-2023-paper2.pdf" },
  { id: "PQ-WAEC-2023-P3", examBody: "WAEC", year: 2023, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "WAEC May/June 2023 - Mechanical Assembly Drawing", isFreeSample: false, pdfUrl: "/archives/waec-2023-paper3.pdf" },

  { id: "PQ-WAEC-2022-P1", examBody: "WAEC", year: 2022, paperType: "Paper 1 (Objectives)", title: "WAEC May/June 2022 - Paper 1 (Objectives)", isFreeSample: false, pdfUrl: "/archives/waec-2022-paper1.pdf" },
  { id: "PQ-WAEC-2022-P2", examBody: "WAEC", year: 2022, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing May/June 2022 - Isometric to Orthographic Conversion", isFreeSample: false, pdfUrl: "/archives/waec-2022-paper2.pdf" },
  { id: "PQ-WAEC-2022-P3", examBody: "WAEC", year: 2022, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "WAEC May/June 2022 - Building Floor Plan & Elevation", isFreeSample: false, pdfUrl: "/archives/waec-2022-paper3.pdf" },

  { id: "PQ-WAEC-2021-P1", examBody: "WAEC", year: 2021, paperType: "Paper 1 (Objectives)", title: "WAEC May/June 2021 - Paper 1 (Objectives)", isFreeSample: false, pdfUrl: "/archives/waec-2021-paper1.pdf" },
  { id: "PQ-WAEC-2021-P2", examBody: "WAEC", year: 2021, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing May/June 2021 - Interpenetration of Cylinders", isFreeSample: false, pdfUrl: "/archives/waec-2021-paper2.pdf" },
  { id: "PQ-WAEC-2021-P3", examBody: "WAEC", year: 2021, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "WAEC May/June 2021 - Valve Body Assembly", isFreeSample: false, pdfUrl: "/archives/waec-2021-paper3.pdf" },

  { id: "PQ-WAEC-2020-P2", examBody: "WAEC", year: 2020, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2020 - Loci of Mechanisms & Cams", isFreeSample: false, pdfUrl: "/archives/waec-2020-paper2.pdf" },
  { id: "PQ-WAEC-2019-P2", examBody: "WAEC", year: 2019, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2019 - Auxiliary Views & True Shapes", isFreeSample: false, pdfUrl: "/archives/waec-2019-paper2.pdf" },
  { id: "PQ-WAEC-2018-P2", examBody: "WAEC", year: 2018, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2018 - Ellipse & Parabola Construction", isFreeSample: false, pdfUrl: "/archives/waec-2018-paper2.pdf" },
  { id: "PQ-WAEC-2017-P2", examBody: "WAEC", year: 2017, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2017 - Third Angle Orthographic Projection", isFreeSample: false, pdfUrl: "/archives/waec-2017-paper2.pdf" },
  { id: "PQ-WAEC-2016-P2", examBody: "WAEC", year: 2016, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2016 - Isometric Projection & Sectioning", isFreeSample: false, pdfUrl: "/archives/waec-2016-paper2.pdf" },
  { id: "PQ-WAEC-2015-P2", examBody: "WAEC", year: 2015, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2015 - Development of Surfaces", isFreeSample: false, pdfUrl: "/archives/waec-2015-paper2.pdf" },
  { id: "PQ-WAEC-2014-P2", examBody: "WAEC", year: 2014, paperType: "Paper 2 (Practical Geometry)", title: "WAEC Technical Drawing 2014 - Scales & Plane Geometry", isFreeSample: false, pdfUrl: "/archives/waec-2014-paper2.pdf" },

  // --- NECO Technical Drawing (2014 - 2024) ---
  { id: "PQ-NECO-2024-P2", examBody: "NECO", year: 2024, paperType: "Paper 2 (Practical Geometry)", title: "NECO June/July 2024 - Practical Geometry & Scales", isFreeSample: true, pdfUrl: "/archives/neco-2024-paper2.pdf" },
  { id: "PQ-NECO-2023-P2", examBody: "NECO", year: 2023, paperType: "Paper 2 (Practical Geometry)", title: "NECO June/July 2023 - Orthographic Projection & Sectioning", isFreeSample: false, pdfUrl: "/archives/neco-2023-paper2.pdf" },
  { id: "PQ-NECO-2022-P2", examBody: "NECO", year: 2022, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing June/July 2022 - Orthographic Projection Block", isFreeSample: true, pdfUrl: "/archives/neco-2022-paper2.pdf" },
  { id: "PQ-NECO-2021-P2", examBody: "NECO", year: 2021, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2021 - Isometric Block & Dimensioning", isFreeSample: false, pdfUrl: "/archives/neco-2021-paper2.pdf" },
  { id: "PQ-NECO-2020-P2", examBody: "NECO", year: 2020, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2020 - Building Foundation Details", isFreeSample: false, pdfUrl: "/archives/neco-2020-paper2.pdf" },
  { id: "PQ-NECO-2019-P2", examBody: "NECO", year: 2019, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2019 - Screw Threads & Fasteners", isFreeSample: false, pdfUrl: "/archives/neco-2019-paper2.pdf" },
  { id: "PQ-NECO-2018-P2", examBody: "NECO", year: 2018, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2018 - Loci & Mechanisms", isFreeSample: false, pdfUrl: "/archives/neco-2018-paper2.pdf" },
  { id: "PQ-NECO-2017-P2", examBody: "NECO", year: 2017, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2017 - Vectors & Polygon Construction", isFreeSample: false, pdfUrl: "/archives/neco-2017-paper2.pdf" },
  { id: "PQ-NECO-2016-P2", examBody: "NECO", year: 2016, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2016 - Tangents & Normal", isFreeSample: false, pdfUrl: "/archives/neco-2016-paper2.pdf" },
  { id: "PQ-NECO-2015-P2", examBody: "NECO", year: 2015, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2015 - Interpenetration of Prisms", isFreeSample: false, pdfUrl: "/archives/neco-2015-paper2.pdf" },
  { id: "PQ-NECO-2014-P2", examBody: "NECO", year: 2014, paperType: "Paper 2 (Practical Geometry)", title: "NECO Technical Drawing 2014 - Architectural Floor Plan", isFreeSample: false, pdfUrl: "/archives/neco-2014-paper2.pdf" },

  // --- NABTEB Technical Drawing (2014 - 2024) ---
  { id: "PQ-NABTEB-2024-P3", examBody: "NABTEB", year: 2024, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2024 - Mechanical Machine Component Assembly", isFreeSample: true, pdfUrl: "/archives/nabteb-2024-paper3.pdf" },
  { id: "PQ-NABTEB-2023-P3", examBody: "NABTEB", year: 2023, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2023 - Roof Truss & Details", isFreeSample: true, pdfUrl: "/archives/nabteb-2023-paper3.pdf" },
  { id: "PQ-NABTEB-2022-P3", examBody: "NABTEB", year: 2022, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2022 - Two-Bedroom Residential Building Plan", isFreeSample: false, pdfUrl: "/archives/nabteb-2022-paper3.pdf" },
  { id: "PQ-NABTEB-2021-P3", examBody: "NABTEB", year: 2021, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2021 - Lathe Tool Post Assembly", isFreeSample: false, pdfUrl: "/archives/nabteb-2021-paper3.pdf" },
  { id: "PQ-NABTEB-2020-P3", examBody: "NABTEB", year: 2020, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2020 - Staircase Detailing & Elevation", isFreeSample: false, pdfUrl: "/archives/nabteb-2020-paper3.pdf" },
  { id: "PQ-NABTEB-2019-P3", examBody: "NABTEB", year: 2019, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2019 - Centrifugal Pump Bracket", isFreeSample: false, pdfUrl: "/archives/nabteb-2019-paper3.pdf" },
  { id: "PQ-NABTEB-2018-P3", examBody: "NABTEB", year: 2018, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2018 - Bungalow Architectural Plan", isFreeSample: false, pdfUrl: "/archives/nabteb-2018-paper3.pdf" },
  { id: "PQ-NABTEB-2017-P3", examBody: "NABTEB", year: 2017, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2017 - Connecting Rod Assembly", isFreeSample: false, pdfUrl: "/archives/nabteb-2017-paper3.pdf" },
  { id: "PQ-NABTEB-2016-P3", examBody: "NABTEB", year: 2016, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2016 - Foundation & Damp Proof Course", isFreeSample: false, pdfUrl: "/archives/nabteb-2016-paper3.pdf" },
  { id: "PQ-NABTEB-2015-P3", examBody: "NABTEB", year: 2015, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2015 - Globe Valve Component Drawing", isFreeSample: false, pdfUrl: "/archives/nabteb-2015-paper3.pdf" },
  { id: "PQ-NABTEB-2014-P3", examBody: "NABTEB", year: 2014, paperType: "Paper 3 (Building/Mechanical Drawing)", title: "NABTEB May/June 2014 - Architectural Elevations & Roof Plans", isFreeSample: false, pdfUrl: "/archives/nabteb-2014-paper3.pdf" }
];

interface PastQuestionsPortalProps {
  userTier: 'free' | 'pro';
  onUpgradeRequest?: () => void;
}

export function PastQuestionsPortal({ userTier, onUpgradeRequest }: PastQuestionsPortalProps) {
  const { isMasterAdmin, isSubscribed, userProfile } = useSubscription();
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const isOwnerEmail = userProfile?.email?.toLowerCase() === 'passion4dami@gmail.com';
  const hasFullAccess = userTier === 'pro' || isMasterAdmin || isSubscribed || isOwnerEmail;

  const handleDownloadOrView = (item: PastQuestionItem) => {
    if (item.isFreeSample || hasFullAccess) {
      const link = document.createElement('a');
      link.href = item.pdfUrl;
      link.download = `${item.id}-Drafthands-Exam.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    } else {
      if (onUpgradeRequest) {
        onUpgradeRequest();
      } else {
        try {
          alert("🔒 Pro Access Required: Upgrade your Drafthands account to unlock and download the complete 10-year WAEC, NECO, and NABTEB authenticated exam archive.");
        } catch {
          console.warn("Pro Access Required");
        }
      }
    }
  };

  const yearsList = ['ALL', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014'];

  const filteredArchive = pastQuestionsArchive.filter(item => {
    if (selectedExam !== 'ALL' && item.examBody !== selectedExam) return false;
    if (selectedYear !== 'ALL' && String(item.year) !== selectedYear) return false;
    return true;
  });

  return (
    <div className="w-full bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-100 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>📚 Authentic 10-Year Examination Archive</span>
            {hasFullAccess && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✨ Full Pro Access Unlocked
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete WAEC, NECO & NABTEB Technical Drawing past questions and marking schemes (2014 – 2024).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Exam Body Filter */}
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['ALL', 'WAEC', 'NECO', 'NABTEB'].map((body) => (
              <button
                key={body}
                onClick={() => setSelectedExam(body)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${selectedExam === body ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                {body}
              </button>
            ))}
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-900 text-cyan-300 font-mono text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          >
            {yearsList.map(y => (
              <option key={y} value={y}>{y === 'ALL' ? 'All Years (2014-2024)' : y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredArchive.map((item) => {
          const isAccessible = item.isFreeSample || hasFullAccess;
          return (
            <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/20 font-bold">
                    {item.examBody} — {item.year}
                  </span>
                  {!isAccessible ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/25 flex items-center gap-1">
                      <span>🔒 Pro Locked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/25">
                      ✓ Available
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-400 font-mono">{item.paperType}</p>
              </div>

              <button
                onClick={() => handleDownloadOrView(item)}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                  isAccessible 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/20' 
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isAccessible ? '📥 Download Verified PDF' : '⚡ Upgrade to Pro to Unlock'}
              </button>
            </div>
          );
        })}
        {filteredArchive.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs font-mono">
            No examination papers match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
