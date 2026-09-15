import React, { useState } from 'react';
import { OnScreenInstrument, FreehandPoint } from '../../types/whiteboard';

export interface DraftingInstrumentsOverlayProps {
  instruments: OnScreenInstrument[];
  zoom?: number;
  activeInstrumentId?: string;
  onSelectInstrument?: (id: string) => void;
  onUpdateInstrument: (id: string, updates: Partial<OnScreenInstrument>) => void;
  onRemoveInstrument: (id: string) => void;
  onStrikeArc?: (cx: number, cy: number, r: number, startAngle: number, endAngle: number, label?: string) => void;
  onDrawStraightEdge?: (x1: number, y1: number, x2: number, y2: number, label?: string) => void;
  onDrawCurvePath?: (svgPath: string, points?: FreehandPoint[], label?: string) => void;
}

export const DraftingInstrumentsOverlay: React.FC<DraftingInstrumentsOverlayProps> = ({
  instruments,
  zoom = 1,
  activeInstrumentId,
  onSelectInstrument,
  onUpdateInstrument,
  onRemoveInstrument,
  onStrikeArc,
  onDrawStraightEdge,
  onDrawCurvePath
}) => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);

  // Transform local instrument coordinate (lx, ly) to world canvas coordinate
  const transformPoint = (lx: number, ly: number, inst: OnScreenInstrument): { x: number; y: number } => {
    const rad = ((inst.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: Math.round((inst.x + lx * cos - ly * sin) * 10) / 10,
      y: Math.round((inst.y + lx * sin + ly * cos) * 10) / 10
    };
  };

  // Sample cubic Bezier curve points into dense point array for spline compatibility
  const sampleCubicBezier = (
    p0: { x: number; y: number },
    cp1: { x: number; y: number },
    cp2: { x: number; y: number },
    p1: { x: number; y: number },
    steps = 30
  ): FreehandPoint[] => {
    const pts: FreehandPoint[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const mt = 1 - t;
      const x = mt * mt * mt * p0.x + 3 * mt * mt * t * cp1.x + 3 * mt * t * t * cp2.x + t * t * t * p1.x;
      const y = mt * mt * mt * p0.y + 3 * mt * mt * t * cp1.y + 3 * mt * t * t * cp2.y + t * t * t * p1.y;
      pts.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, pressure: 1, time: Date.now() });
    }
    return pts;
  };

  // Drag handler supporting Pointer, Mouse, and Touch events across the board
  const handleDragStart = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
    inst: OnScreenInstrument
  ) => {
    e.stopPropagation();
    onSelectInstrument?.(inst.id);
    setDraggingId(inst.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const initialX = inst.x;
    const initialY = inst.y;
    const currentZoom = zoom > 0 ? zoom : 1;

    const handleMove = (moveEv: PointerEvent | MouseEvent | TouchEvent) => {
      const curX = 'touches' in moveEv ? moveEv.touches[0].clientX : moveEv.clientX;
      const curY = 'touches' in moveEv ? moveEv.touches[0].clientY : moveEv.clientY;
      const dx = (curX - clientX) / currentZoom;
      const dy = (curY - clientY) / currentZoom;

      if (inst.type === 'TEE_SQUARE') {
        // T-Square remains strictly horizontal and slides smoothly up and down the board
        onUpdateInstrument(inst.id, {
          x: Math.round(initialX + Math.max(-50, Math.min(200, dx * 0.2))), // Headstock guided along board working edge
          y: Math.max(10, Math.min(1400, Math.round(initialY + dy))),
          rotation: 0 // Strict horizontal lock
        });
      } else {
        // All other instruments move freely anywhere across the board
        onUpdateInstrument(inst.id, {
          x: Math.round(initialX + dx),
          y: Math.round(initialY + dy)
        });
      }
    };

    const handleEnd = () => {
      setDraggingId(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  };

  // 360° Continuous Drag-to-Rotate Handler
  const handleRotateStart = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
    inst: OnScreenInstrument,
    pivotLocalX = 0,
    pivotLocalY = 0
  ) => {
    e.stopPropagation();
    onSelectInstrument?.(inst.id);
    setRotatingId(inst.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const targetEl = e.currentTarget as SVGGraphicsElement;
    let screenPivotX = clientX;
    let screenPivotY = clientY;

    try {
      const ctm = targetEl.getScreenCTM();
      if (ctm) {
        screenPivotX = ctm.a * pivotLocalX + ctm.c * pivotLocalY + ctm.e;
        screenPivotY = ctm.b * pivotLocalX + ctm.d * pivotLocalY + ctm.f;
      } else {
        const bbox = targetEl.getBoundingClientRect();
        screenPivotX = bbox.left + bbox.width / 2;
        screenPivotY = bbox.top + bbox.height / 2;
      }
    } catch {
      const bbox = targetEl.getBoundingClientRect();
      screenPivotX = bbox.left + bbox.width / 2;
      screenPivotY = bbox.top + bbox.height / 2;
    }

    const startAngleRad = Math.atan2(clientY - screenPivotY, clientX - screenPivotX);
    const initialRot = inst.rotation || 0;

    const handleMove = (moveEv: PointerEvent | MouseEvent | TouchEvent) => {
      const curX = 'touches' in moveEv ? moveEv.touches[0].clientX : moveEv.clientX;
      const curY = 'touches' in moveEv ? moveEv.touches[0].clientY : moveEv.clientY;
      const curAngleRad = Math.atan2(curY - screenPivotY, curX - screenPivotX);
      const deltaDeg = ((curAngleRad - startAngleRad) * 180) / Math.PI;
      let targetRot = Math.round((initialRot + deltaDeg + 3600) % 360);

      // Snap to 15-degree steps if shift is held
      if ('shiftKey' in moveEv && moveEv.shiftKey) {
        targetRot = Math.round(targetRot / 15) * 15 % 360;
      }

      onUpdateInstrument(inst.id, { rotation: targetRot });
    };

    const handleEnd = () => {
      setRotatingId(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  };

  // Nudge instrument up/down/left/right by step amount
  const handleNudge = (inst: OnScreenInstrument, dx: number, dy: number) => {
    onSelectInstrument?.(inst.id);
    if (inst.type === 'TEE_SQUARE') {
      // T-Square strictly slides vertically
      onUpdateInstrument(inst.id, {
        y: Math.max(10, Math.min(1400, Math.round(inst.y + dy))),
        rotation: 0
      });
    } else {
      onUpdateInstrument(inst.id, {
        x: Math.round(inst.x + dx),
        y: Math.round(inst.y + dy)
      });
    }
  };

  const handleRotate = (inst: OnScreenInstrument, deltaDeg: number) => {
    if (inst.type === 'TEE_SQUARE') return; // Locked horizontal
    onSelectInstrument?.(inst.id);
    const newRot = (inst.rotation + deltaDeg + 360) % 360;
    onUpdateInstrument(inst.id, { rotation: newRot });
  };

  const handleSetRotation = (inst: OnScreenInstrument, targetDeg: number) => {
    if (inst.type === 'TEE_SQUARE') return; // Locked horizontal
    onSelectInstrument?.(inst.id);
    onUpdateInstrument(inst.id, { rotation: ((targetDeg % 360) + 360) % 360 });
  };

  // Directional Nudge Pad (Up, Down, Left, Right)
  const renderMovePad = (inst: OnScreenInstrument, localX: number, localY: number, step = 25) => (
    <g transform={`translate(${localX}, ${localY})`} className="cursor-pointer select-none">
      {/* Background container */}
      <rect x="-38" y="-38" width="76" height="76" rx="10" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" fillOpacity="0.95" />
      <text x="0" y="-24" fill="#94a3b8" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">MOVE</text>

      {/* Up Button */}
      <g onClick={(e) => { e.stopPropagation(); handleNudge(inst, 0, -step); }} className="hover:opacity-80">
        <rect x="-11" y="-22" width="22" height="15" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
        <path d="M 0 -18 L -5 -11 L 5 -11 Z" fill="#38bdf8" />
      </g>

      {/* Down Button */}
      <g onClick={(e) => { e.stopPropagation(); handleNudge(inst, 0, step); }} className="hover:opacity-80">
        <rect x="-11" y="7" width="22" height="15" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
        <path d="M 0 18 L -5 11 L 5 11 Z" fill="#38bdf8" />
      </g>

      {/* Left Button */}
      <g onClick={(e) => { e.stopPropagation(); handleNudge(inst, -step, 0); }} className="hover:opacity-80">
        <rect x="-31" y="-7" width="15" height="22" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
        <path d="M -28 4 L -20 -1 L -20 9 Z" fill="#38bdf8" />
      </g>

      {/* Right Button */}
      <g onClick={(e) => { e.stopPropagation(); handleNudge(inst, step, 0); }} className="hover:opacity-80">
        <rect x="16" y="-7" width="15" height="22" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
        <path d="M 28 4 L 20 -1 L 20 9 Z" fill="#38bdf8" />
      </g>

      {/* Center Drag Anchor */}
      <circle
        cx="0"
        cy="4"
        r="6"
        fill="#0284c7"
        className="cursor-grab"
        onPointerDown={(e) => handleDragStart(e, inst)}
      />
    </g>
  );

  // 360° Circular Rotation Dial & Quick Angle Controls
  const render360RotationDial = (
    inst: OnScreenInstrument,
    localX: number,
    localY: number,
    presets: number[] = [0, 30, 45, 60, 90, 180, 270],
    accentColor = '#38bdf8'
  ) => {
    const isRotating = rotatingId === inst.id;
    const currentRot = Math.round(inst.rotation || 0);

    return (
      <g transform={`translate(${localX}, ${localY})`} className="select-none">
        {/* Outer Control HUD Background */}
        <rect
          x="-95"
          y="-88"
          width="190"
          height="124"
          rx="12"
          fill="#090d16"
          fillOpacity="0.95"
          stroke={accentColor}
          strokeWidth="1.5"
          filter="drop-shadow(0 4px 14px rgba(0,0,0,0.65))"
        />

        {/* Title & 360° Angle Readout Badge */}
        <text x="0" y="-70" fill={accentColor} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          360° ROTATION DIAL
        </text>
        <g transform="translate(0, -53)">
          <rect x="-42" y="-10" width="84" height="19" rx="4" fill="#0f172a" stroke={accentColor} strokeWidth="1" />
          <text x="0" y="3" fill="#f8fafc" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ⟳ {currentRot}° / 360°
          </text>
        </g>

        {/* 360° Interactive Circular Rotating Ring Handle */}
        <g
          transform="translate(0, 0)"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handleRotateStart(e, inst, localX, localY)}
        >
          {/* Dial ring background */}
          <circle cx="0" cy="0" r="30" fill="#0b1329" stroke={accentColor} strokeWidth={isRotating ? '2.5' : '1.5'} strokeDasharray="3 3" />
          
          {/* Radial Angle Indicator Hand */}
          <line
            x1="0"
            y1="0"
            x2={28 * Math.cos(((currentRot - 90) * Math.PI) / 180)}
            y2={28 * Math.sin(((currentRot - 90) * Math.PI) / 180)}
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx={26 * Math.cos(((currentRot - 90) * Math.PI) / 180)}
            cy={26 * Math.sin(((currentRot - 90) * Math.PI) / 180)}
            r="4.5"
            fill={accentColor}
            stroke="#fff"
            strokeWidth="1"
          />

          {/* Center Grab Knob */}
          <circle cx="0" cy="0" r="12" fill={isRotating ? '#0284c7' : '#1e293b'} stroke={accentColor} strokeWidth="1.5" />
          <text x="0" y="3" fill="#ffffff" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            SPIN
          </text>

          {/* Dial degree tick marks (0, 90, 180, 270) */}
          <circle cx="0" cy="-26" r="1.8" fill={accentColor} />
          <circle cx="26" cy="0" r="1.8" fill={accentColor} />
          <circle cx="0" cy="26" r="1.8" fill={accentColor} />
          <circle cx="-26" cy="0" r="1.8" fill={accentColor} />
        </g>

        {/* Incremental Steppers (-15°, +15°) */}
        <g transform="translate(-70, 0)" className="cursor-pointer">
          <g onClick={(e) => { e.stopPropagation(); handleRotate(inst, -15); }}>
            <rect x="-16" y="-12" width="32" height="22" rx="4" fill="#1e293b" stroke={accentColor} strokeWidth="0.8" />
            <text x="0" y="3" fill={accentColor} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">-15°</text>
          </g>
        </g>
        <g transform="translate(70, 0)" className="cursor-pointer">
          <g onClick={(e) => { e.stopPropagation(); handleRotate(inst, 15); }}>
            <rect x="-16" y="-12" width="32" height="22" rx="4" fill="#1e293b" stroke={accentColor} strokeWidth="0.8" />
            <text x="0" y="3" fill={accentColor} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">+15°</text>
          </g>
        </g>

        {/* Quick Angle Presets Bar */}
        <g transform="translate(0, 22)">
          {presets.slice(0, 6).map((deg, idx) => {
            const count = Math.min(6, presets.length);
            const totalWidth = count * 28;
            const startX = -totalWidth / 2 + 14;
            const offsetX = startX + idx * 28;
            const isMatch = (currentRot % 360) === (deg % 360);
            return (
              <g
                key={deg}
                transform={`translate(${offsetX - 12}, -4)`}
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleSetRotation(inst, deg); }}
              >
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="16"
                  rx="3"
                  fill={isMatch ? accentColor : '#0f172a'}
                  stroke={accentColor}
                  strokeWidth="0.8"
                />
                <text
                  x="12"
                  y="11"
                  fill={isMatch ? '#090d16' : '#cbd5e1'}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {deg}°
                </text>
              </g>
            );
          })}
        </g>

        {/* Close Button Top-Right */}
        <g
          transform="translate(80, -74)"
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onRemoveInstrument(inst.id); }}
        >
          <circle cx="0" cy="0" r="8" fill="#1e293b" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="3" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">✕</text>
        </g>
      </g>
    );
  };

  return (
    <g className="drafting-instruments-overlay select-none" data-instrument-layer="true">
      {instruments.map((inst) => {
        if (!inst.visible) return null;
        const isSelected = activeInstrumentId === inst.id;
        const isDragging = draggingId === inst.id;

        // -------------------------------------------------------------
        // 1. TEE SQUARE (Drawing Board Horizontal Edge Guide)
        // -------------------------------------------------------------
        if (inst.type === 'TEE_SQUARE') {
          const ruleTopEdge = (length = 600) => {
            const p1 = transformPoint(0, -20, inst);
            const p2 = transformPoint(length, -20, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, `T-Square Blade Edge (${length}mm)`);
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Head Stock (Left drawing board edge guide) - Vertical Slide Rail */}
              <rect
                x="-55"
                y="-150"
                width="55"
                height="300"
                rx="6"
                fill="#1e293b"
                stroke={isSelected ? '#38bdf8' : '#64748b'}
                strokeWidth={isSelected ? '2.5' : '1.8'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle cx="-28" cy="0" r="8" fill="#38bdf8" />
              <text x="-40" y="55" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 -28 55)">
                VERTICAL SLIDE GUIDE
              </text>

              {/* Headstock Quick Slide to Top / Bottom & Steppers */}
              <g transform="translate(-28, -120)" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onUpdateInstrument(inst.id, { y: 25, rotation: 0 }); }}>
                <rect x="-20" y="-12" width="40" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="2" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">⤊ TOP</text>
              </g>
              <g transform="translate(-28, -80)" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNudge(inst, 0, -40); }}>
                <rect x="-20" y="-12" width="40" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="2" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">▲ UP</text>
              </g>
              <g transform="translate(-28, 80)" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNudge(inst, 0, 40); }}>
                <rect x="-20" y="-12" width="40" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="2" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">▼ DOWN</text>
              </g>
              <g transform="translate(-28, 120)" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onUpdateInstrument(inst.id, { y: 780, rotation: 0 }); }}>
                <rect x="-20" y="-12" width="40" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="2" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">⤋ BOT</text>
              </g>

              {/* Acrylic Blade with Polymer Core - Strictly Horizontal, Drag anywhere to slide up/down */}
              <rect
                x="0"
                y="-20"
                width="640"
                height="40"
                rx="3"
                fill="#0f172a"
                fillOpacity="0.92"
                stroke={isSelected ? '#38bdf8' : '#0ea5e9'}
                strokeWidth={isSelected ? '2.2' : '1.5'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Clickable & Hoverable Ruling Edge along top of blade */}
              <line
                x1="0"
                y1="-20"
                x2="600"
                y2="-20"
                stroke={hoveredEdge === `${inst.id}-top` ? '#38bdf8' : 'transparent'}
                strokeWidth="14"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-top`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  ruleTopEdge(600);
                }}
              />

              {/* Active edge highlight cue */}
              <line x1="0" y1="-20" x2="640" y2="-20" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Millimeter Ticks along ruling top edge */}
              {Array.from({ length: 31 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={i * 20}
                    y1="-20"
                    x2={i * 20}
                    y2={i % 5 === 0 ? '-8' : '-14'}
                    stroke="#38bdf8"
                    strokeWidth={i % 5 === 0 ? '1.4' : '0.8'}
                  />
                  {i % 5 === 0 && (
                    <text x={i * 20 + 2} y="-9" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
                      {i * 20}
                    </text>
                  )}
                </g>
              ))}

              <text x="12" y="5" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ISO 128 T-SQUARE (600mm)
              </text>
              <text x="12" y="15" fill="#64748b" fontSize="8" fontFamily="sans-serif">
                🔒 Strictly Horizontal (0°) • Drag blade or headstock to slide Top-to-Bottom
              </text>

              {/* Direct "Rule Blade Edge" Actions */}
              <g transform="translate(370, 4)" className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); ruleTopEdge(600); }}>
                  <rect x="0" y="-14" width="115" height="22" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <text x="57" y="1" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Edge (600mm)
                  </text>
                </g>
                <g transform="translate(122, 0)" onClick={(e) => { e.stopPropagation(); ruleTopEdge(300); }}>
                  <rect x="0" y="-14" width="70" height="22" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                  <text x="35" y="1" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ 300mm
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for T-Square */}
              {renderMovePad(inst, 300, 60, 35)}

              {/* Horizontal Lock Status & Close Control */}
              <g transform="translate(480, -50)">
                <rect x="-10" y="-10" width="190" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text
                  x="5"
                  y="7"
                  fill="#38bdf8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  🔒 HORIZONTAL (0°) • Y: {inst.y}
                </text>
                <text
                  x="165"
                  y="7"
                  fill="#ef4444"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); onRemoveInstrument(inst.id); }}
                >
                  ✕
                </text>
              </g>
            </g>
          );
        }

        // -------------------------------------------------------------
        // 2. 30°/60° SET SQUARE (360° Rotatable across the board)
        // -------------------------------------------------------------
        if (inst.type === 'SETSQUARE_30_60') {
          const ruleHypotenuse = () => {
            const p1 = transformPoint(0, -161.6, inst);
            const p2 = transformPoint(280, 0, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '30°/60° Set Square Hypotenuse');
          };

          const ruleVertical = () => {
            const p1 = transformPoint(0, 0, inst);
            const p2 = transformPoint(0, -161.6, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '30°/60° Set Square 90° Vertical');
          };

          const ruleBase = () => {
            const p1 = transformPoint(0, 0, inst);
            const p2 = transformPoint(280, 0, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '30°/60° Set Square Base');
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y}) rotate(${inst.rotation})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Outer 30-60-90 Triangle - Draggable body anywhere across the board */}
              <polygon
                points="0,0 280,0 0,-161.6"
                fill="#0284c7"
                fillOpacity="0.25"
                stroke={isSelected ? '#38bdf8' : '#0284c7'}
                strokeWidth={isSelected ? '3' : '2'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Inner Cutout with Beveled Edge */}
              <polygon
                points="35,-18 200,-18 35,-115"
                fill="#0b1120"
                fillOpacity="0.85"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="4 3"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Clickable Edge Strips with Glow */}
              <line
                x1="0"
                y1="-161.6"
                x2="280"
                y2="0"
                stroke={hoveredEdge === `${inst.id}-hyp` ? '#38bdf8' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-hyp`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleHypotenuse(); }}
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-161.6"
                stroke={hoveredEdge === `${inst.id}-vert` ? '#38bdf8' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-vert`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleVertical(); }}
              />
              <line
                x1="0"
                y1="0"
                x2="280"
                y2="0"
                stroke={hoveredEdge === `${inst.id}-base` ? '#38bdf8' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-base`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleBase(); }}
              />

              {/* Millimeter Ticks on horizontal leg */}
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={i} x1={i * 20} y1="0" x2={i * 20} y2={i % 5 === 0 ? '-11' : '-6'} stroke="#7dd3fc" strokeWidth="1" />
              ))}

              <text x="45" y="-28" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                30° / 60° SET SQUARE
              </text>
              <text x="210" y="-8" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">30°</text>
              <text x="8" y="-120" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">60°</text>

              {/* Direct Rule Edge Action Buttons */}
              <g transform="translate(42, -90)" className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); ruleHypotenuse(); }}>
                  <rect x="0" y="0" width="130" height="20" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <text x="65" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Hypotenuse (30°)
                  </text>
                </g>
                <g transform="translate(0, 24)" onClick={(e) => { e.stopPropagation(); ruleVertical(); }}>
                  <rect x="0" y="0" width="130" height="20" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                  <text x="65" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Vertical (90°)
                  </text>
                </g>
                <g transform="translate(0, 48)" onClick={(e) => { e.stopPropagation(); ruleBase(); }}>
                  <rect x="0" y="0" width="130" height="20" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" />
                  <text x="65" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Base Edge
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for 30°/60° Set Square */}
              {renderMovePad(inst, 195, -60, 25)}

              {/* 360° Circular Rotation Dial & Quick Angles HUD */}
              {render360RotationDial(inst, 235, -115, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270], '#38bdf8')}
            </g>
          );
        }

        // -------------------------------------------------------------
        // 3. 45° SET SQUARE (360° Rotatable across the board)
        // -------------------------------------------------------------
        if (inst.type === 'SETSQUARE_45') {
          const ruleHypotenuse = () => {
            const p1 = transformPoint(0, -220, inst);
            const p2 = transformPoint(220, 0, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '45° Set Square Hypotenuse');
          };

          const ruleVertical = () => {
            const p1 = transformPoint(0, 0, inst);
            const p2 = transformPoint(0, -220, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '45° Set Square 90° Vertical');
          };

          const ruleBase = () => {
            const p1 = transformPoint(0, 0, inst);
            const p2 = transformPoint(220, 0, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, '45° Set Square Base');
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y}) rotate(${inst.rotation})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Outer 45-45-90 Triangle - Draggable body anywhere across the board */}
              <polygon
                points="0,0 220,0 0,-220"
                fill="#10b981"
                fillOpacity="0.25"
                stroke={isSelected ? '#34d399' : '#059669'}
                strokeWidth={isSelected ? '3' : '2'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Inner Cutout with Center Protractor Circle */}
              <polygon
                points="35,-18 140,-18 35,-125"
                fill="#0b1120"
                fillOpacity="0.85"
                stroke="#34d399"
                strokeWidth="1"
                strokeDasharray="4 3"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle cx="65" cy="-65" r="22" fill="none" stroke="#34d399" strokeWidth="1" />

              {/* Clickable Edge Strips */}
              <line
                x1="0"
                y1="-220"
                x2="220"
                y2="0"
                stroke={hoveredEdge === `${inst.id}-hyp` ? '#34d399' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-hyp`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleHypotenuse(); }}
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-220"
                stroke={hoveredEdge === `${inst.id}-vert` ? '#34d399' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-vert`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleVertical(); }}
              />
              <line
                x1="0"
                y1="0"
                x2="220"
                y2="0"
                stroke={hoveredEdge === `${inst.id}-base` ? '#34d399' : 'transparent'}
                strokeWidth="16"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-base`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleBase(); }}
              />

              {/* Millimeter Ticks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1={i * 20} y1="0" x2={i * 20} y2={i % 5 === 0 ? '-11' : '-6'} stroke="#6ee7b7" strokeWidth="1" />
              ))}

              <text x="35" y="-28" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                45° SET SQUARE
              </text>
              <text x="165" y="-8" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">45°</text>
              <text x="8" y="-170" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">45°</text>

              {/* Direct Rule Edge Action Buttons */}
              <g transform="translate(42, -115)" className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); ruleHypotenuse(); }}>
                  <rect x="0" y="0" width="125" height="20" rx="4" fill="#059669" stroke="#34d399" strokeWidth="1" />
                  <text x="62" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule 45° Hypotenuse
                  </text>
                </g>
                <g transform="translate(0, 24)" onClick={(e) => { e.stopPropagation(); ruleVertical(); }}>
                  <rect x="0" y="0" width="125" height="20" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1" />
                  <text x="62" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Vertical (90°)
                  </text>
                </g>
                <g transform="translate(0, 48)" onClick={(e) => { e.stopPropagation(); ruleBase(); }}>
                  <rect x="0" y="0" width="125" height="20" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1" />
                  <text x="62" y="13" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Base Edge
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for 45° Set Square */}
              {renderMovePad(inst, 150, -145, 25)}

              {/* 360° Circular Rotation Dial & Quick Angles HUD */}
              {render360RotationDial(inst, 185, -85, [0, 45, 90, 135, 180, 225, 270, 315], '#34d399')}
            </g>
          );
        }

        // -------------------------------------------------------------
        // 4. PRECISION SCALE RULE (DIN 1872 Metric Triangular Scale)
        // -------------------------------------------------------------
        if (inst.type === 'SCALE_RULE') {
          const ratio = inst.scaleRatio || '1:1';
          const ruleScale = (len = 400) => {
            const p1 = transformPoint(0, -18, inst);
            const p2 = transformPoint(len, -18, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, `Scale Rule (${len}mm @ ${ratio})`);
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y}) rotate(${inst.rotation})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Scale Rule Body - Draggable */}
              <rect
                x="0"
                y="-18"
                width="400"
                height="36"
                rx="3"
                fill="#f8fafc"
                fillOpacity="0.95"
                stroke={isSelected ? '#dc2626' : '#475569'}
                strokeWidth={isSelected ? '2.5' : '1.8'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              {/* Center Colored Ratio Stripe */}
              <rect x="0" y="-3" width="400" height="6" fill="#dc2626" />

              {/* Clickable Top Scale Edge */}
              <line
                x1="0"
                y1="-18"
                x2="400"
                y2="-18"
                stroke={hoveredEdge === `${inst.id}-scale` ? '#dc2626' : 'transparent'}
                strokeWidth="14"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-scale`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleScale(400); }}
              />

              {/* Millimeter & Scaled Division Markings */}
              {Array.from({ length: 41 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={i * 10}
                    y1="-18"
                    x2={i * 10}
                    y2={i % 10 === 0 ? '-7' : i % 5 === 0 ? '-12' : '-15'}
                    stroke="#0f172a"
                    strokeWidth={i % 10 === 0 ? '1.4' : '0.7'}
                  />
                  {i % 10 === 0 && (
                    <text x={i * 10 - 4} y="-6" fill="#0f172a" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      {i}
                    </text>
                  )}
                </g>
              ))}

              <text x="30" y="12" fill="#0f172a" fontSize="9" fontFamily="monospace" fontWeight="bold">
                SCALE {ratio} METRIC RULE (DIN 1872)
              </text>

              {/* Direct Rule Action */}
              <g transform="translate(190, 0)" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); ruleScale(400); }}>
                <rect x="0" y="-14" width="80" height="22" rx="4" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
                <text x="40" y="1" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                  ✏️ Rule Edge
                </text>
              </g>

              {/* Integrated Move D-Pad for Scale Rule */}
              {renderMovePad(inst, 330, 48, 25)}

              {/* 360° Circular Rotation Dial & Quick Angles HUD */}
              {render360RotationDial(inst, 200, -85, [0, 15, 30, 45, 60, 90, 180, 270], '#dc2626')}
            </g>
          );
        }

        // -------------------------------------------------------------
        // 5. FRENCH CURVE (Burmester No. 1 - Smooth Conics & Cam Contours)
        // -------------------------------------------------------------
        if (inst.type === 'FRENCH_CURVE') {
          const tp0 = transformPoint(0, 0, inst);
          const tcp1 = transformPoint(80, -120, inst);
          const tcp2 = transformPoint(220, -150, inst);
          const tp1 = transformPoint(280, -60, inst);
          const tcp3 = transformPoint(320, 20, inst);
          const tcp4 = transformPoint(260, 120, inst);
          const tp2 = transformPoint(180, 140, inst);
          const tcp5 = transformPoint(100, 160, inst);
          const tcp6 = transformPoint(-40, 100, inst);
          const tp3 = transformPoint(-80, 40, inst);
          const tcp7 = transformPoint(-110, -10, inst);
          const tcp8 = transformPoint(-60, -60, inst);

          // Action: Rule Upper Arch Curve
          const ruleUpperArch = () => {
            const d = `M ${tp0.x} ${tp0.y} C ${tcp1.x} ${tcp1.y}, ${tcp2.x} ${tcp2.y}, ${tp1.x} ${tp1.y}`;
            const pts = sampleCubicBezier(tp0, tcp1, tcp2, tp1, 35);
            onDrawCurvePath?.(d, pts, 'French Curve (Upper Arch)');
          };

          // Action: Rule Outer Flank Curve
          const ruleOuterFlank = () => {
            const d = `M ${tp1.x} ${tp1.y} C ${tcp3.x} ${tcp3.y}, ${tcp4.x} ${tcp4.y}, ${tp2.x} ${tp2.y}`;
            const pts = sampleCubicBezier(tp1, tcp3, tcp4, tp2, 35);
            onDrawCurvePath?.(d, pts, 'French Curve (Outer Flank)');
          };

          // Action: Rule Full Continuous Burmester Profile
          const ruleFullProfile = () => {
            const d = `M ${tp0.x} ${tp0.y} C ${tcp1.x} ${tcp1.y}, ${tcp2.x} ${tcp2.y}, ${tp1.x} ${tp1.y} C ${tcp3.x} ${tcp3.y}, ${tcp4.x} ${tcp4.y}, ${tp2.x} ${tp2.y} C ${tcp5.x} ${tcp5.y}, ${tcp6.x} ${tcp6.y}, ${tp3.x} ${tp3.y} C ${tcp7.x} ${tcp7.y}, ${tcp8.x} ${tcp8.y}, ${tp0.x} ${tp0.y}`;
            const pts = [
              ...sampleCubicBezier(tp0, tcp1, tcp2, tp1, 25),
              ...sampleCubicBezier(tp1, tcp3, tcp4, tp2, 25),
              ...sampleCubicBezier(tp2, tcp5, tcp6, tp3, 25),
              ...sampleCubicBezier(tp3, tcp7, tcp8, tp0, 25)
            ];
            onDrawCurvePath?.(d, pts, 'Burmester French Curve Full Profile');
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y}) rotate(${inst.rotation})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Burmester Acrylic Profile - Entire body draggable */}
              <path
                d="M 0 0 C 80 -120, 220 -150, 280 -60 C 320 20, 260 120, 180 140 C 100 160, -40 100, -80 40 C -110 -10, -60 -60, 0 0 Z"
                fill="#f59e0b"
                fillOpacity="0.30"
                stroke={isSelected ? '#fbbf24' : '#d97706'}
                strokeWidth={isSelected ? '3.2' : '2.5'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Clickable Outer Curved Edge Strip */}
              <path
                d="M 0 0 C 80 -120, 220 -150, 280 -60 C 320 20, 260 120, 180 140"
                fill="none"
                stroke={hoveredEdge === `${inst.id}-curve` ? '#fbbf24' : 'transparent'}
                strokeWidth="18"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(`${inst.id}-curve`)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => { e.stopPropagation(); ruleUpperArch(); }}
              />

              {/* Inner Finger Grips */}
              <ellipse
                cx="140"
                cy="-20"
                rx="45"
                ry="25"
                fill="#0b1120"
                fillOpacity="0.85"
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="3 3"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle
                cx="-10"
                cy="50"
                r="18"
                fill="#0b1120"
                fillOpacity="0.85"
                stroke="#fbbf24"
                strokeWidth="1"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              <text x="80" y="-22" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                BURMESTER FRENCH CURVE
              </text>
              <text x="80" y="-5" fill="#fde68a" fontSize="8" fontFamily="sans-serif">
                Drag anywhere or use Move Pad
              </text>

              {/* Direct "Draw Curve at Edge" Action Buttons */}
              <g transform="translate(65, 15)" className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); ruleUpperArch(); }}>
                  <rect x="0" y="0" width="145" height="22" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                  <text x="72" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Upper Arch Curve
                  </text>
                </g>
                <g transform="translate(0, 26)" onClick={(e) => { e.stopPropagation(); ruleOuterFlank(); }}>
                  <rect x="0" y="0" width="145" height="22" rx="4" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                  <text x="72" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Outer Flank Curve
                  </text>
                </g>
                <g transform="translate(0, 52)" onClick={(e) => { e.stopPropagation(); ruleFullProfile(); }}>
                  <rect x="0" y="0" width="145" height="22" rx="4" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
                  <text x="72" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Full Contour
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for French Curve */}
              {renderMovePad(inst, 250, 45, 25)}

              {/* 360° Circular Rotation Dial & Quick Angles HUD */}
              {render360RotationDial(inst, 240, 110, [0, 15, 30, 45, 60, 90, 180, 270], '#fbbf24')}
            </g>
          );
        }

        // -------------------------------------------------------------
        // 6. PRECISION COMPASS
        // -------------------------------------------------------------
        if (inst.type === 'COMPASS') {
          const r = inst.radius || 60;

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Pivot Center Pin (Needle Point) - Draggable */}
              <circle
                cx="0"
                cy="0"
                r="7"
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="2"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle cx="0" cy="0" r="15" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />

              {/* Radius Lead Arm - Draggable */}
              <line
                x1="0"
                y1="0"
                x2={r}
                y2="0"
                stroke="#38bdf8"
                strokeWidth="4"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />

              {/* Compass Bow Joint */}
              <path
                d="M 0 0 L -18 -45 L 0 -60 L 18 -45 Z"
                fill="#334155"
                stroke="#94a3b8"
                strokeWidth="1.8"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle cx="0" cy="-60" r="6" fill="#38bdf8" onPointerDown={(e) => handleDragStart(e, inst)} />

              {/* Pencil Lead Point at Tip */}
              <circle cx={r} cy="0" r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
              <line x1={r} y1="-12" x2={r} y2="12" stroke="#22d3ee" strokeWidth="2" />

              {/* Radius Readout Pill */}
              <g transform={`translate(${r / 2 - 28}, -30)`}>
                <rect x="0" y="0" width="56" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="28" y="14" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  R={r}mm
                </text>
              </g>

              {/* Arc Strike Buttons Suite */}
              <g transform={`translate(${r + 15}, -32)`} className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); onStrikeArc?.(inst.x, inst.y, r, 0, 360, 'Full 360° Circle'); }}>
                  <rect x="0" y="0" width="105" height="22" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <text x="52" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Strike 360° Circle
                  </text>
                </g>
                <g transform="translate(0, 26)" onClick={(e) => { e.stopPropagation(); onStrikeArc?.(inst.x, inst.y, r, 0, 180, '180° Semicircle'); }}>
                  <rect x="0" y="0" width="105" height="22" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                  <text x="52" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Strike 180° Arc
                  </text>
                </g>
                <g transform="translate(0, 52)" onClick={(e) => { e.stopPropagation(); onStrikeArc?.(inst.x, inst.y, r, -30, 30, '60° Construction Arc'); }}>
                  <rect x="0" y="0" width="105" height="22" rx="5" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" />
                  <text x="52" y="14" fill="#fff" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ 60° Construction
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for Compass */}
              {renderMovePad(inst, -60, -30, 25)}

              {/* Radius Adjustment Steppers & Close */}
              <g transform="translate(-45, 25)">
                <rect x="0" y="0" width="95" height="26" rx="5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <text
                  x="12"
                  y="17"
                  fill="#38bdf8"
                  fontSize="13"
                  fontWeight="bold"
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); onUpdateInstrument(inst.id, { radius: Math.max(15, r - 10) }); }}
                >
                  -10
                </text>
                <text
                  x="42"
                  y="17"
                  fill="#38bdf8"
                  fontSize="13"
                  fontWeight="bold"
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); onUpdateInstrument(inst.id, { radius: Math.min(250, r + 10) }); }}
                >
                  +10
                </text>
                <text
                  x="75"
                  y="17"
                  fill="#ef4444"
                  fontSize="12"
                  fontWeight="bold"
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); onRemoveInstrument(inst.id); }}
                >
                  ✕
                </text>
              </g>
            </g>
          );
        }

        // -------------------------------------------------------------
        // 7. 360° PROTRACTOR
        // -------------------------------------------------------------
        if (inst.type === 'PROTRACTOR') {
          const ruleBaseline = () => {
            const p1 = transformPoint(-110, 0, inst);
            const p2 = transformPoint(110, 0, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, 'Protractor 180° Baseline');
          };

          const ruleNormal = () => {
            const p1 = transformPoint(0, 0, inst);
            const p2 = transformPoint(0, -110, inst);
            onDrawStraightEdge?.(p1.x, p1.y, p2.x, p2.y, 'Protractor 90° Normal');
          };

          return (
            <g
              key={inst.id}
              transform={`translate(${inst.x}, ${inst.y}) rotate(${inst.rotation})`}
              className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              onClick={() => onSelectInstrument?.(inst.id)}
            >
              {/* Outer Circular Protractor Disk - Draggable */}
              <circle
                cx="0"
                cy="0"
                r="110"
                fill="#f59e0b"
                fillOpacity="0.25"
                stroke={isSelected ? '#fbbf24' : '#d97706'}
                strokeWidth={isSelected ? '2.8' : '2'}
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <circle
                cx="0"
                cy="0"
                r="45"
                fill="#0b1120"
                fillOpacity="0.85"
                stroke="#fbbf24"
                strokeWidth="1"
                onPointerDown={(e) => handleDragStart(e, inst)}
              />
              <line x1="-110" y1="0" x2="110" y2="0" stroke="#fbbf24" strokeWidth="1.4" />
              <line x1="0" y1="-110" x2="0" y2="110" stroke="#fbbf24" strokeWidth="1.4" />

              {/* Radial Degree Ticks */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angleRad = (i * 10 * Math.PI) / 180;
                const x1 = Math.cos(angleRad) * 110;
                const y1 = Math.sin(angleRad) * 110;
                const x2 = Math.cos(angleRad) * (i % 3 === 0 ? 94 : 102);
                const y2 = Math.sin(angleRad) * (i % 3 === 0 ? 94 : 102);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth={i % 3 === 0 ? '1.4' : '0.7'} />;
              })}

              <text x="0" y="-18" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                360° PROTRACTOR
              </text>

              {/* Rule Ray Actions */}
              <g transform="translate(-50, 8)" className="cursor-pointer">
                <g onClick={(e) => { e.stopPropagation(); ruleBaseline(); }}>
                  <rect x="0" y="0" width="100" height="18" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                  <text x="50" y="12" fill="#fff" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule Baseline (180°)
                  </text>
                </g>
                <g transform="translate(0, 22)" onClick={(e) => { e.stopPropagation(); ruleNormal(); }}>
                  <rect x="0" y="0" width="100" height="18" rx="4" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                  <text x="50" y="12" fill="#fff" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                    ✏️ Rule 90° Normal
                  </text>
                </g>
              </g>

              {/* Integrated Move D-Pad for Protractor */}
              {renderMovePad(inst, -120, -50, 25)}

              {/* 360° Circular Rotation Dial & Quick Angles HUD */}
              {render360RotationDial(inst, 120, -95, [0, 30, 45, 60, 90, 180, 270], '#f59e0b')}
            </g>
          );
        }

        return null;
      })}
    </g>
  );
};
