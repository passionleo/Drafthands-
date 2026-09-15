import React from 'react';
import { InstrumentState } from '../../types/curriculum';

interface InstrumentsOverlayProps {
  instrument: InstrumentState;
  scale: number;
  showGuideLines?: boolean;
}

export const InstrumentsOverlay: React.FC<InstrumentsOverlayProps> = ({ instrument, showGuideLines = true }) => {
  if (!instrument.visible || instrument.toolType === 'NONE') {
    return null;
  }

  const { toolType, x, y, targetX = x + 100, targetY = y, radius = 60, actionText } = instrument;

  return (
    <g className="instruments-layer pointer-events-none transition-all duration-300">
      {/* Dynamic Action Callout Badge */}
      {actionText && (
        <g transform={`translate(${x}, ${y - 45})`}>
          <rect
            x={-130}
            y={-14}
            width={260}
            height={28}
            rx={6}
            className="fill-slate-900/90 stroke-cyan-400 stroke-[1.5] filter drop-shadow-md"
          />
          <circle cx={-112} cy={0} r={4} className="fill-cyan-400 animate-pulse" />
          <text
            x={-100}
            y={4}
            className="fill-cyan-100 text-[11px] font-mono font-medium tracking-tight"
          >
            {actionText.length > 34 ? `${actionText.slice(0, 32)}...` : actionText}
          </text>
        </g>
      )}

      {/* COMPASS RENDERING */}
      {toolType === 'COMPASS' && (
        <g transform={`translate(${x}, ${y})`}>
          {/* Compass Needle Datum Guide Crosshairs */}
          {showGuideLines && (
            <g className="opacity-70">
              <line x1={-30} y1={0} x2={30} y2={0} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="3,3" />
              <line x1={0} y1={-30} x2={0} y2={30} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="3,3" />
              <line x1={0} y1={0} x2={radius} y2={0} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="3,2" />
              <text x={-6} y={-8} className="fill-cyan-400 text-[8px] font-mono font-bold">O</text>
            </g>
          )}

          {/* Compass Needle Leg at (0,0) */}
          <circle cx={0} cy={0} r={3.5} className="fill-red-500 stroke-white stroke-[1]" />
          <line x1={0} y1={0} x2={0} y2={-50} className="stroke-slate-300 stroke-[3] stroke-linecap-round" />
          
          {/* Compass Top Hinge & Knob */}
          <circle cx={radius / 2} cy={-85} r={8} className="fill-amber-500 stroke-amber-300 stroke-[1.5]" />
          <rect x={radius / 2 - 3} y={-102} width={6} height={16} rx={2} className="fill-amber-600" />
          
          {/* Left Leg from hinge to needle */}
          <line x1={radius / 2} y1={-85} x2={0} y2={-50} className="stroke-slate-400 stroke-[3.5] stroke-linecap-round" />
          
          {/* Right Pencil Leg from hinge to pencil tip at (radius, 0) */}
          <line x1={radius / 2} y1={-85} x2={radius} y2={-45} className="stroke-slate-400 stroke-[3.5] stroke-linecap-round" />
          <line x1={radius} y1={-45} x2={radius} y2={0} className="stroke-amber-600 stroke-[3] stroke-linecap-round" />
          
          {/* Pencil Graphite Lead at (radius, 0) */}
          <polygon points={`${radius},0 ${radius - 2.5},-8 ${radius + 2.5},-8`} className="fill-slate-900" />
          <circle cx={radius} cy={0} r={2.5} className="fill-cyan-400 stroke-white stroke-[0.8]" />

          {/* Compass Span Guide Arc */}
          <path
            d={`M 0,-40 A 40,40 0 0,1 ${radius * 0.7},-40`}
            className="fill-none stroke-cyan-400/50 stroke-[1] stroke-dasharray-2-2"
          />
          <text x={radius / 2} y={-25} textAnchor="middle" className="fill-cyan-300 text-[10px] font-mono">
            r = {radius.toFixed(0)}mm
          </text>
        </g>
      )}

      {/* 30°-60° SET SQUARE */}
      {toolType === 'SET_SQUARE_30_60' && (
        <g transform={`translate(${x}, ${y}) rotate(${instrument.angleDeg || 0})`}>
          {/* Drawing Guide Rays */}
          {showGuideLines && (
            <g className="opacity-60">
              <line x1={0} y1={0} x2={0} y2={-550} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="6,4" />
              <line x1={0} y1={0} x2={280} y2={-485} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="6,4" />
              <text x={10} y={-360} className="fill-cyan-400 text-[8px] font-mono">4H 90° Guide</text>
            </g>
          )}

          {/* Acrylic translucent body */}
          <polygon
            points="0,0 200,0 0,-346"
            className="fill-cyan-500/15 stroke-cyan-300/80 stroke-[1.5] backdrop-blur-xs"
          />
          {/* Inner cutout */}
          <polygon
            points="25,-25 145,-25 25,-230"
            className="fill-slate-900/30 stroke-cyan-400/40 stroke-[1]"
          />
          {/* Center finger hole */}
          <circle cx={50} cy={-75} r={12} className="fill-slate-900/40 stroke-cyan-400/50 stroke-[1]" />
          
          {/* Edge Millimeter Ticks along base */}
          {Array.from({ length: 21 }).map((_, i) => (
            <line
              key={i}
              x1={i * 10}
              y1={0}
              x2={i * 10}
              y2={i % 5 === 0 ? -8 : -4}
              className="stroke-cyan-200 stroke-[0.8]"
            />
          ))}
          <text x={100} y={-10} textAnchor="middle" className="fill-cyan-200 text-[9px] font-mono">
            30° - 60° Set Square
          </text>
        </g>
      )}

      {/* 45° SET SQUARE */}
      {toolType === 'SET_SQUARE_45' && (
        <g transform={`translate(${x}, ${y}) rotate(${instrument.angleDeg || 0})`}>
          {/* Drawing Guide Rays */}
          {showGuideLines && (
            <g className="opacity-60">
              <line x1={0} y1={0} x2={380} y2={-380} stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="6,4" />
              <text x={240} y={-248} className="fill-amber-400 text-[8px] font-mono">4H 45° Guide</text>
            </g>
          )}

          <polygon
            points="0,0 220,0 0,-220"
            className="fill-amber-500/15 stroke-amber-300/80 stroke-[1.5]"
          />
          <polygon
            points="30,-30 150,-30 30,-150"
            className="fill-slate-900/30 stroke-amber-400/40 stroke-[1]"
          />
          <circle cx={55} cy={-55} r={12} className="fill-slate-900/40 stroke-amber-400/50 stroke-[1]" />
          <text x={90} y={-12} textAnchor="middle" className="fill-amber-200 text-[9px] font-mono">
            45° Set Square
          </text>
        </g>
      )}

      {/* TEE SQUARE */}
      {toolType === 'TEE_SQUARE' && (
        <g transform={`translate(0, ${y})`}>
          {/* 4H Horizontal Datum Guide Line */}
          {showGuideLines && (
            <g className="opacity-70">
              <line x1={0} y1={-16} x2={950} y2={-16} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="6,4" />
              <text x={840} y={-22} textAnchor="end" className="fill-cyan-300 text-[9px] font-mono font-semibold">
                4H Horizontal Datum Guide Line
              </text>
            </g>
          )}

          {/* Stock Head (Left Edge of Board) */}
          <rect x={10} y={-45} width={30} height={90} rx={4} className="fill-amber-800 stroke-amber-950 stroke-[2] shadow-xl" />
          {/* Acrylic Transparent Blade */}
          <rect x={40} y={-16} width={740} height={32} rx={2} className="fill-cyan-600/15 stroke-cyan-400/80 stroke-[1.2]" />
          {/* Beveled Top Drawing Edge */}
          <line x1={40} y1={-16} x2={780} y2={-16} className="stroke-cyan-300 stroke-[1.5]" />
          {/* Metric Graduations */}
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={i}
              x1={40 + i * 20}
              y1={-16}
              x2={40 + i * 20}
              y2={-10}
              className="stroke-cyan-200 stroke-[0.8]"
            />
          ))}
          <text x={80} y={4} className="fill-cyan-300 text-[10px] font-mono font-bold tracking-wider">
            T-SQUARE DATUM BLADE
          </text>
        </g>
      )}

      {/* STRAIGHT RULER */}
      {toolType === 'RULER' && (
        <g transform={`translate(${x}, ${y})`}>
          {(() => {
            const dx = targetX - x;
            const dy = targetY - y;
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const len = Math.max(180, Math.sqrt(dx * dx + dy * dy) + 40);
            return (
              <g transform={`rotate(${angle})`}>
                {/* 4H Alignment Guide Line extending beyond edges */}
                {showGuideLines && (
                  <g className="opacity-70">
                    <line x1={-80} y1={-14} x2={len + 80} y2={-14} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="6,4" />
                    <text x={len / 2} y={-22} textAnchor="middle" className="fill-cyan-300 text-[9px] font-mono">
                      4H Alignment Guide Line
                    </text>
                  </g>
                )}

                <rect x={-20} y={-14} width={len} height={28} rx={3} className="fill-slate-800/80 stroke-slate-400 stroke-[1.2]" />
                <line x1={-20} y1={-14} x2={len - 20} y2={-14} className="stroke-cyan-300 stroke-[1.5]" />
                {Array.from({ length: Math.floor(len / 10) }).map((_, i) => (
                  <line
                    key={i}
                    x1={-15 + i * 10}
                    y1={-14}
                    x2={-15 + i * 10}
                    y2={i % 5 === 0 ? -6 : -10}
                    className="stroke-cyan-200 stroke-[0.8]"
                  />
                ))}
              </g>
            );
          })()}
        </g>
      )}

      {/* PROTRACTOR */}
      {toolType === 'PROTRACTOR' && (
        <g transform={`translate(${x}, ${y})`}>
          <path
            d="M -120,0 A 120,120 0 0,1 120,0 Z"
            className="fill-cyan-500/15 stroke-cyan-300 stroke-[1.5]"
          />
          <circle cx={0} cy={0} r={4} className="fill-red-500" />
          <line x1={-120} y1={0} x2={120} y2={0} className="stroke-cyan-300 stroke-[1]" />
          <line x1={0} y1={0} x2={0} y2={-120} className="stroke-cyan-300 stroke-[1]" />
        </g>
      )}

      {/* DRAFTING PENCIL (HB / 2H) */}
      {(toolType === 'PENCIL_HB' || toolType === 'PENCIL_2H') && (
        <g transform={`translate(${x}, ${y}) rotate(-35)`}>
          {/* Graphite Lead Tip */}
          <polygon points="0,0 -3,-10 3,-10" className="fill-slate-950" />
          {/* Wood Collar */}
          <polygon points="-3,-10 -6,-24 6,-24 3,-10" className="fill-amber-200 stroke-amber-400 stroke-[0.5]" />
          {/* Hexagonal Pencil Barrel */}
          <rect x={-6} y={-140} width={12} height={116} className={toolType === 'PENCIL_HB' ? 'fill-emerald-800' : 'fill-slate-700'} />
          <rect x={-6} y={-140} width={12} height={12} className="fill-amber-500" />
          <text x={0} y={-70} textAnchor="middle" transform="rotate(90, 0, -70)" className="fill-white text-[8px] font-mono font-bold">
            {toolType === 'PENCIL_HB' ? 'HB (0.5mm)' : '2H (0.25mm)'}
          </text>
        </g>
      )}

      {/* DIVIDERS */}
      {toolType === 'DIVIDER' && (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx={0} cy={0} r={3} className="fill-red-400 stroke-white stroke-[0.8]" />
          <line x1={0} y1={0} x2={25} y2={-65} className="stroke-slate-300 stroke-[3] stroke-linecap-round" />
          <line x1={50} y1={0} x2={25} y2={-65} className="stroke-slate-300 stroke-[3] stroke-linecap-round" />
          <circle cx={50} cy={0} r={3} className="fill-red-400 stroke-white stroke-[0.8]" />
          <circle cx={25} cy={-65} r={6} className="fill-amber-500" />
        </g>
      )}

      {/* FRENCH CURVE */}
      {toolType === 'FRENCH_CURVE' && (
        <g transform={`translate(${x}, ${y})`}>
          <path
            d="M 0,0 C 25,-40 70,-45 105,-20 C 135,5 140,55 100,80 C 65,100 20,75 5,35 Z"
            className="fill-cyan-500/20 stroke-cyan-400 stroke-[1.5] filter drop-shadow-md"
          />
          <circle cx={0} cy={0} r={3} className="fill-cyan-400 animate-ping" />
          <text x={35} y={30} className="fill-cyan-200 text-[9px] font-mono font-bold">
            French Curve
          </text>
        </g>
      )}
    </g>
  );
};
