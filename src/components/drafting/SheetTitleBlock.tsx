import React from 'react';
import { DrawingTopic } from '../../types/curriculum';

interface SheetTitleBlockProps {
  topic: DrawingTopic;
  width: number;
  height: number;
  activeStep: number;
  totalSteps: number;
}

export const SheetTitleBlock: React.FC<SheetTitleBlockProps> = ({
  topic,
  width,
  height,
  activeStep,
  totalSteps
}) => {
  const margin = 20; // 20mm border margin
  const blockW = 280;
  const blockH = 85;
  const bx = width - margin - blockW;
  const by = height - margin - blockH;

  return (
    <g className="sheet-border-and-title-block select-none pointer-events-none">
      {/* Outer Sheet Trim Line */}
      <rect
        x={5}
        y={5}
        width={width - 10}
        height={height - 10}
        className="fill-none stroke-slate-800 stroke-[1]"
      />

      {/* Standard 20mm Engineering Border (Thick Line 0.7mm) */}
      <rect
        x={margin}
        y={margin}
        width={width - 2 * margin}
        height={height - 2 * margin}
        className="fill-none stroke-slate-700 stroke-[1.8]"
      />

      {/* Grid Centering Marks / Tick Marks */}
      <line x1={width / 2} y1={5} x2={width / 2} y2={margin} className="stroke-cyan-500/60 stroke-[1]" />
      <line x1={width / 2} y1={height - margin} x2={width / 2} y2={height - 5} className="stroke-cyan-500/60 stroke-[1]" />
      <line x1={5} y1={height / 2} x2={margin} y2={height / 2} className="stroke-cyan-500/60 stroke-[1]" />
      <line x1={width - margin} y1={height / 2} x2={width - 5} y2={height / 2} className="stroke-cyan-500/60 stroke-[1]" />

      {/* Standard ISO / WAEC Title Block (Bottom Right) */}
      <g transform={`translate(${bx}, ${by})`}>
        {/* Title Block Bounding Box */}
        <rect
          x={0}
          y={0}
          width={blockW}
          height={blockH}
          className="fill-slate-950/85 stroke-cyan-500/70 stroke-[1.5] backdrop-blur-xs"
        />

        {/* Row 1: Academy & Level */}
        <rect x={0} y={0} width={blockW} height={24} className="fill-cyan-950/40 stroke-cyan-500/40 stroke-[0.8]" />
        <text x={10} y={16} className="fill-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          DRAFTHANDS ACADEMY • {topic.tier}
        </text>
        <text x={blockW - 10} y={16} textAnchor="end" className="fill-slate-400 text-[9px] font-mono">
          {topic.standards.waecRef.slice(0, 18)}
        </text>

        {/* Row 2: Drawing Title */}
        <rect x={0} y={24} width={blockW} height={30} className="fill-transparent stroke-cyan-500/40 stroke-[0.8]" />
        <text x={10} y={38} className="fill-slate-400 text-[8px] uppercase tracking-wider font-mono">
          DRAWING TITLE
        </text>
        <text x={10} y={50} className="fill-slate-100 text-[11px] font-semibold tracking-tight truncate max-w-[260px]">
          {topic.title.length > 36 ? `${topic.title.slice(0, 34)}...` : topic.title}
        </text>

        {/* Row 3: Metadata Details (Scale, Projection Symbol, Step, Module) */}
        <line x1={0} y1={54} x2={blockW} y2={54} className="stroke-cyan-500/40 stroke-[0.8]" />
        <line x1={70} y1={54} x2={70} y2={blockH} className="stroke-cyan-500/40 stroke-[0.8]" />
        <line x1={150} y1={54} x2={150} y2={blockH} className="stroke-cyan-500/40 stroke-[0.8]" />
        <line x1={220} y1={54} x2={220} y2={blockH} className="stroke-cyan-500/40 stroke-[0.8]" />

        {/* Cell 1: Scale */}
        <text x={8} y={64} className="fill-slate-500 text-[7px] font-mono uppercase">SCALE</text>
        <text x={8} y={76} className="fill-cyan-300 text-[10px] font-mono font-bold">1:1 (FULL)</text>

        {/* Cell 2: Module Code */}
        <text x={78} y={64} className="fill-slate-500 text-[7px] font-mono uppercase">MODULE</text>
        <text x={78} y={76} className="fill-cyan-300 text-[9px] font-mono font-bold">{topic.moduleCode}</text>

        {/* Cell 3: Projection Symbol */}
        <text x={156} y={64} className="fill-slate-500 text-[7px] font-mono uppercase">PROJECTION</text>
        {/* First Angle Symbol */}
        <g transform="translate(182, 72) scale(0.65)">
          <polygon points="-12,-8 12,-4 12,4 -12,8" className="fill-none stroke-cyan-300 stroke-[1]" />
          <circle cx={22} cy={0} r={4} className="fill-none stroke-cyan-300 stroke-[1]" />
          <circle cx={22} cy={0} r={8} className="fill-none stroke-cyan-300 stroke-[1]" />
        </g>

        {/* Cell 4: Step Progress */}
        <text x={226} y={64} className="fill-slate-500 text-[7px] font-mono uppercase">PHASE</text>
        <text x={226} y={76} className="fill-amber-400 text-[10px] font-mono font-bold">
          {activeStep}/{totalSteps}
        </text>
      </g>
    </g>
  );
};
