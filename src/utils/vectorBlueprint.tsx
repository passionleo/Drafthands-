import React from 'react';

// Drafthands Context-Aware Vector Blueprint Generator Patch
export function getTopicSpecificSVG(topicId: string, topicTitle: string) {
  // Map exact topic IDs to precise vector rendering instructions
  if (topicId.includes('tangent') || topicTitle.toLowerCase().includes('tangent')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-blue-500/30">
        <defs>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4"><circle cx="5" cy="5" r="3" fill="#38bdf8"/></marker>
        </defs>
        {/* Title block & border */}
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">TECHNICAL DRAWING ACADEMY - GEOMETRIC CONSTRUCTION</text>
        <text x="40" y="70" fill="#94a3b8" fontFamily="monospace" fontSize="12">TOPIC: {topicTitle.toUpperCase()}</text>
        
        {/* Circle 1 (Left Center) */}
        <circle cx="250" cy="280" r="70" fill="none" stroke="#f8fafc" strokeWidth="2"/>
        <circle cx="250" cy="280" r="3" fill="#f8fafc"/>
        <text x="240" y="285" fill="#f8fafc" fontFamily="monospace" fontSize="12">O₁</text>
        
        {/* Circle 2 (Right Center) */}
        <circle cx="550" cy="220" r="40" fill="none" stroke="#f8fafc" strokeWidth="2"/>
        <circle cx="550" cy="220" r="3" fill="#f8fafc"/>
        <text x="540" y="225" fill="#f8fafc" fontFamily="monospace" fontSize="12">O₂</text>

        {/* Tangent Construction Lines */}
        <line x1="184" y1="230" x2="583" y2="175" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4"/>
        <text x="360" y="190" fill="#38bdf8" fontFamily="monospace" fontSize="12">Internal Tangent AB</text>
        
        {/* Dimension and center lines */}
        <line x1="250" y1="280" x2="550" y2="220" stroke="#64748b" strokeWidth="1" strokeDasharray="4,4"/>
      </svg>
    );
  }

  // Fallback for general architectural / line types if requested
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-slate-700">
      <rect x="20" y="20" width="760" height="460" fill="none" stroke="#64748b" strokeWidth="1"/>
      <text x="40" y="60" fill="#f8fafc" fontFamily="monospace" fontSize="16">ISO STANDARD TECHNICAL DRAWING SCHEMATIC</text>
      <text x="40" y="90" fill="#94a3b8" fontFamily="monospace" fontSize="14">Subject Module: {topicTitle}</text>
      <line x1="40" y1="150" x2="400" y2="150" stroke="#38bdf8" strokeWidth="3"/>
      <text x="420" y="155" fill="#f8fafc" fontFamily="monospace" fontSize="12">Visible Outlines (Continuous Thick)</text>
    </svg>
  );
}
