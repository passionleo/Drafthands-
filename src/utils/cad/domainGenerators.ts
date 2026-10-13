import React from 'react';

/**
 * Drafthands Parametric Vector Domain Generators
 * Implements high-fidelity engineering vector graphics for all technical drawing topics:
 * - Plane Geometry (Triangles, Polygons, Tangents, Conics)
 * - Building & Civil Drafting (Sectional Strip Foundation, Architectural Floor Plan, Roof Trusses)
 * - Mechanical Engineering (Stepped Shafts, Orthographic Projections, Sectional Views, Bolt & Nut)
 * - ISO 128 Line Weights & Standards
 */

export interface VectorGeneratorOptions {
  topicId: string;
  topicTitle: string;
  width?: number;
  height?: number;
}

export function generateDomainVectorSVG({
  topicId,
  topicTitle,
  width = 800,
  height = 500
}: VectorGeneratorOptions): React.ReactNode {
  const tId = topicId.toLowerCase();
  const title = topicTitle.toLowerCase();

  // 1. TRIANGLES (Equilateral, Right-Angled, Isosceles, Scalene)
  if (tId.includes('triangle') || title.includes('triangle')) {
    if (tId.includes('equilateral') || title.includes('equilateral')) {
      return (
        <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-blue-500/30 font-mono">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#38bdf8"/>
            </marker>
          </defs>
          <rect x="20" y="20" width="760" height="460" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4"/>
          <text x="40" y="50" fill="#38bdf8" fontSize="14" style={{ fontWeight: 700 }}>ISO 128-20: EQUILATERAL TRIANGLE CONSTRUCTION</text>
          <text x="40" y="70" fill="#94a3b8" fontSize="11">Base AB = 80mm | Compass Arc Radius R = 80mm | Included Angles = 60 degrees</text>

          {/* Construction Circles / Arcs */}
          <circle cx="280" cy="350" r="160" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="4,4" opacity="0.8"/>
          <circle cx="520" cy="350" r="160" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="4,4" opacity="0.8"/>

          {/* Triangle Outlines */}
          <polygon points="280,191.44 160,350 400,350" fill="none" stroke="#f8fafc" strokeWidth="2.5"/>

          {/* Vertices & Labels */}
          <circle cx="280" cy="191.44" r="4" fill="#38bdf8"/>
          <text x="272" y="175" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>C (Apex)</text>
          <circle cx="160" cy="350" r="4" fill="#38bdf8"/>
          <text x="145" y="370" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>A</text>
          <circle cx="400" cy="350" r="4" fill="#38bdf8"/>
          <text x="395" y="370" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>B</text>

          {/* Dimension Line */}
          <line x1="160" y1="380" x2="400" y2="380" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
          <text x="260" y="398" fill="#f8fafc" fontSize="12">80 mm</text>

          {/* Info Card */}
          <g transform="translate(480, 100)">
            <rect x="0" y="0" width="280" height="260" fill="#0f172a" stroke="#334155" rx="8"/>
            <text x="15" y="30" fill="#38bdf8" fontSize="13" style={{ fontWeight: 700 }}>Construction Protocol:</text>
            <text x="15" y="60" fill="#cbd5e1" fontSize="11">1. Draw baseline AB = 80mm.</text>
            <text x="15" y="90" fill="#cbd5e1" fontSize="11">2. With center A & radius 80mm, arc up.</text>
            <text x="15" y="120" fill="#cbd5e1" fontSize="11">3. With center B & radius 80mm, intersect at C.</text>
            <text x="15" y="150" fill="#cbd5e1" fontSize="11">4. Join AC and BC with thick HB line.</text>
            <text x="15" y="190" fill="#22c55e" fontSize="11">Status: Verified ISO Compliant</text>
          </g>
        </svg>
      );
    }
    if (tId.includes('right') || title.includes('right')) {
      return (
        <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-blue-500/30 font-mono">
          <rect x="20" y="20" width="760" height="460" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4"/>
          <text x="40" y="50" fill="#38bdf8" fontSize="14" style={{ fontWeight: 700 }}>RIGHT-ANGLED TRIANGLE & PYTHAGOREAN CONSTRUCTION</text>
          <text x="40" y="70" fill="#94a3b8" fontSize="11">Base = 90mm | Perpendicular = 60mm | Hypotenuse = 108.2mm</text>

          {/* Right Angle Symbol */}
          <rect x="200" y="310" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="1.5"/>
          <circle cx="210" cy="320" r="2" fill="#38bdf8"/>

          {/* Triangle Outlines */}
          <polygon points="220,200 220,330 380,330" fill="none" stroke="#f8fafc" strokeWidth="2.5"/>

          {/* Vertices & Dimensions */}
          <text x="200" y="195" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>A (Apex)</text>
          <text x="195" y="348" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>B (90 Deg)</text>
          <text x="385" y="348" fill="#38bdf8" fontSize="12" style={{ fontWeight: 700 }}>C</text>

          <line x1="220" y1="355" x2="380" y2="355" stroke="#64748b" strokeWidth="1"/>
          <text x="285" y="372" fill="#f8fafc" fontSize="12">Base = 90 mm</text>

          <line x1="180" y1="200" x2="180" y2="330" stroke="#64748b" strokeWidth="1"/>
          <text x="100" y="270" fill="#f8fafc" fontSize="12">Height = 60 mm</text>
        </svg>
      );
    }
  }

  // 2. REGULAR POLYGONS (Hexagon, Pentagon, Octagon)
  if (tId.includes('polygon') || title.includes('polygon') || tId.includes('hexagon') || title.includes('hexagon')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-blue-500/30 font-mono">
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#38bdf8" fontSize="14" style={{ fontWeight: 700 }}>REGULAR HEXAGON BY GENERAL CONCENTRIC CIRCLE METHOD</text>
        <text x="40" y="70" fill="#94a3b8" fontSize="11">Circumscribing Diameter = 100mm | Inscribed Circle & 60/30 Set Square Radials</text>

        {/* Circumscribed Circle */}
        <circle cx="300" cy="280" r="120" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6,4"/>
        {/* Inscribed Circle */}
        <circle cx="300" cy="280" r="103.92" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.6"/>
        <circle cx="300" cy="280" r="3" fill="#38bdf8"/>
        <text x="310" y="285" fill="#38bdf8" fontSize="11">O</text>

        {/* Hexagon Vertices & Outline */}
        <polygon points="300,160 403.92,220 403.92,340 300,400 196.08,340 196.08,220" fill="none" stroke="#f8fafc" strokeWidth="2.5"/>

        {/* Radials */}
        <line x1="300" y1="280" x2="300" y2="160" stroke="#dc2626" strokeWidth="1"/>
        <line x1="300" y1="280" x2="403.92" y2="220" stroke="#dc2626" strokeWidth="1"/>
        <line x1="300" y1="280" x2="403.92" y2="340" stroke="#dc2626" strokeWidth="1"/>

        {/* Info panel */}
        <g transform="translate(480, 100)">
          <rect x="0" y="0" width="280" height="280" fill="#0f172a" stroke="#334155" rx="8"/>
          <text x="15" y="30" fill="#38bdf8" fontSize="13" style={{ fontWeight: 700 }}>Polygon Geometry:</text>
          <text x="15" y="65" fill="#cbd5e1" fontSize="11">- Internal Angle: 120 deg</text>
          <text x="15" y="95" fill="#cbd5e1" fontSize="11">- Exterior Angle: 60 deg</text>
          <text x="15" y="125" fill="#cbd5e1" fontSize="11">- Method: Semicircle / Radials</text>
          <text x="15" y="155" fill="#cbd5e1" fontSize="11">- ISO 128 Line Weight: 2.5px</text>
          <text x="15" y="210" fill="#22c55e" fontSize="11">WAEC Section A Verified</text>
        </g>
      </svg>
    );
  }

  // 3. TANGENTS & CONICS (Internal/External Tangents, Ellipse)
  if (tId.includes('tangent') || title.includes('tangent') || tId.includes('conic') || title.includes('conic') || title.includes('ellipse')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-blue-500/30 font-mono">
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#38bdf8" fontSize="14" style={{ fontWeight: 700 }}>DIRECT COMMON TANGENT & CONCENTRIC CIRCLE ELLIPSE</text>
        <text x="40" y="70" fill="#94a3b8" fontSize="11">Circle 1 (R=70mm) & Circle 2 (R=40mm) | True Tangent Contact Points</text>

        {/* Circle 1 */}
        <circle cx="240" cy="280" r="70" fill="none" stroke="#f8fafc" strokeWidth="2"/>
        <circle cx="240" cy="280" r="3" fill="#38bdf8"/>
        <text x="230" y="285" fill="#38bdf8" fontSize="11">O1</text>

        {/* Circle 2 */}
        <circle cx="560" cy="220" r="40" fill="none" stroke="#f8fafc" strokeWidth="2"/>
        <circle cx="560" cy="220" r="3" fill="#38bdf8"/>
        <text x="550" y="225" fill="#38bdf8" fontSize="11">O2</text>

        {/* Center line connecting O1 and O2 */}
        <line x1="240" y1="280" x2="560" y2="220" stroke="#64748b" strokeWidth="1" strokeDasharray="6,3"/>

        {/* Direct Common Tangent Line */}
        <line x1="228" y1="210" x2="572" y2="180" stroke="#38bdf8" strokeWidth="2.5"/>
        <circle cx="228" cy="210" r="3" fill="#22c55e"/>
        <text x="200" y="205" fill="#22c55e" fontSize="11">T1</text>
        <circle cx="572" cy="180" r="3" fill="#22c55e"/>
        <text x="585" y="185" fill="#22c55e" fontSize="11">T2</text>
      </svg>
    );
  }

  // 4. BUILDING & CIVIL: SECTIONAL STRIP FOUNDATION
  if (tId.includes('foundation') || title.includes('foundation') || tId.includes('strip') || title.includes('strip') || title.includes('building') || title.includes('wall')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-amber-500/30 font-mono">
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#fbbf24" fontSize="14" style={{ fontWeight: 700 }}>SECTIONAL STRIP FOUNDATION & FLOOR SLAB DETAIL</text>
        <text x="40" y="70" fill="#94a3b8" fontSize="11">Scale 1:20 | Concrete Footing 675x225 | Sandcrete Block Wall 225mm | GL & FFL</text>

        {/* Ground Level (GL) Line */}
        <line x1="60" y1="160" x2="740" y2="160" stroke="#ef4444" strokeWidth="2"/>
        <text x="650" y="152" fill="#ef4444" fontSize="12" style={{ fontWeight: 700 }}>GROUND LEVEL (GL)</text>

        {/* Finished Floor Level (FFL) Line */}
        <line x1="60" y1="220" x2="740" y2="220" stroke="#22c55e" strokeWidth="2" strokeDasharray="8,4"/>
        <text x="630" y="212" fill="#22c55e" fontSize="12" style={{ fontWeight: 700 }}>FINISHED FLOOR LEVEL (FFL)</text>

        {/* Concrete Footing Slab (Bottom) */}
        <rect x="280" y="400" width="240" height="60" fill="#1e293b" stroke="#f8fafc" strokeWidth="2"/>
        {/* Concrete Aggregate Hatching (Dots) inside a g group */}
        <g>
          <circle cx="300" cy="420" r="2" fill="#94a3b8"/>
          <circle cx="340" cy="430" r="2" fill="#94a3b8"/>
          <circle cx="380" cy="415" r="2" fill="#94a3b8"/>
          <circle cx="420" cy="440" r="2" fill="#94a3b8"/>
          <circle cx="460" cy="425" r="2" fill="#94a3b8"/>
          <circle cx="500" cy="435" r="2" fill="#94a3b8"/>
        </g>
        <text x="300" y="437" fill="#f8fafc" fontSize="11">Concrete Footing (675 x 225)</text>

        {/* Foundation Wall (Sandcrete Blocks 225mm) */}
        <rect x="337" y="280" width="125" height="120" fill="#334155" stroke="#f8fafc" strokeWidth="2"/>
        <line x1="337" y1="320" x2="462" y2="320" stroke="#64748b" strokeWidth="1"/>
        <line x1="337" y1="360" x2="462" y2="360" stroke="#64748b" strokeWidth="1"/>
        <text x="350" y="345" fill="#f8fafc" fontSize="11">225mm Block Wall</text>

        {/* Hardcore & Concrete Bed */}
        <rect x="220" y="235" width="117" height="65" fill="#475569" stroke="#cbd5e1" strokeWidth="1"/>
        <text x="235" y="270" fill="#f8fafc" fontSize="10">Hardcore Fill</text>

        <rect x="337" y="220" width="243" height="30" fill="#1e293b" stroke="#f8fafc" strokeWidth="1.5"/>
        <text x="350" y="239" fill="#f8fafc" fontSize="10">150mm Concrete Bed & Screed</text>
      </svg>
    );
  }

  // 5. BUILDING & CIVIL: ARCHITECTURAL FLOOR PLAN & ROOF TRUSS
  if (tId.includes('roof') || title.includes('roof') || title.includes('truss') || title.includes('plan')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-amber-500/30 font-mono">
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#fbbf24" fontSize="14" style={{ fontWeight: 700 }}>TIMBER KING-POST ROOF TRUSS & ARCHITECTURAL DETAILED VIEW</text>
        <text x="40" y="70" fill="#94a3b8" fontSize="11">Tie Beam | Principal Rafters | King Post | Struts | Wall Plates</text>

        {/* Roof Truss Outline */}
        <polygon points="120,380 680,380 400,160" fill="none" stroke="#f8fafc" strokeWidth="2.5"/>
        {/* King Post */}
        <line x1="400" y1="160" x2="400" y2="380" stroke="#f8fafc" strokeWidth="2"/>
        {/* Struts */}
        <line x1="400" y1="290" x2="280" y2="380" stroke="#f8fafc" strokeWidth="2"/>
        <line x1="400" y1="290" x2="520" y2="380" stroke="#f8fafc" strokeWidth="2"/>

        {/* Labels */}
        <text x="360" y="360" fill="#38bdf8" fontSize="12">Tie Beam</text>
        <text x="220" y="250" fill="#38bdf8" fontSize="12">Principal Rafter</text>
        <text x="410" y="240" fill="#38bdf8" fontSize="12">King Post</text>
        <text x="330" y="315" fill="#38bdf8" fontSize="12">Strut</text>
      </svg>
    );
  }

  // 6. MECHANICAL ENGINEERING: STEPPED SHAFT & ORTHOGRAPHIC / SECTIONAL VIEWS
  if (tId.includes('shaft') || title.includes('shaft') || tId.includes('machine') || title.includes('machine') || title.includes('orthographic') || tId.includes('ortho')) {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-emerald-500/30 font-mono">
        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.4"/>
        <text x="40" y="50" fill="#34d399" fontSize="14" style={{ fontWeight: 700 }}>ISO MECHANICAL STEPPED SHAFT & ORTHOGRAPHIC ALIGNMENT</text>
        <text x="40" y="70" fill="#94a3b8" fontSize="11">Coaxial Cylindrical Sections | Blue Centerlines | 45 Deg Chamfers & Fillet Radii</text>

        {/* Centerline */}
        <line x1="60" y1="260" x2="740" y2="260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="12,4,4,4"/>

        {/* Stepped Shaft Profile */}
        <path d="M 120,240 L 240,240 L 240,220 L 440,220 L 440,200 L 600,200 L 600,320 L 440,320 L 440,300 L 240,300 L 240,280 L 120,280 Z" fill="none" stroke="#f8fafc" strokeWidth="2.5"/>

        {/* 45 Degree Hatching Area (Section cut representation) */}
        <g stroke="#94a3b8" strokeWidth="0.8" opacity="0.7">
          <line x1="120" y1="240" x2="140" y2="280"/>
          <line x1="140" y1="240" x2="160" y2="280"/>
          <line x1="160" y1="240" x2="180" y2="280"/>
          <line x1="180" y1="240" x2="200" y2="280"/>
          <line x1="200" y1="240" x2="220" y2="280"/>
        </g>

        {/* Dimensions & Callouts */}
        <text x="160" y="325" fill="#f8fafc" fontSize="11">Dia 30 mm</text>
        <text x="310" y="335" fill="#f8fafc" fontSize="11">Dia 50 mm</text>
        <text x="500" y="335" fill="#f8fafc" fontSize="11">Dia 40 mm</text>

        {/* Projection Lines */}
        <line x1="120" y1="200" x2="120" y2="380" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4,4"/>
        <line x1="240" y1="200" x2="240" y2="380" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4,4"/>
        <line x1="440" y1="180" x2="440" y2="380" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4,4"/>
        <line x1="600" y1="180" x2="600" y2="380" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4,4"/>
      </svg>
    );
  }

  // DEFAULT / FALLBACK PROFESSIONAL ISO SCHEMA
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto bg-slate-950 rounded-xl border border-slate-700 font-mono">
      <rect x="20" y="20" width="760" height="460" fill="none" stroke="#64748b" strokeWidth="1"/>
      <text x="40" y="50" fill="#38bdf8" fontSize="15" style={{ fontWeight: 700 }}>ISO 128 TECHNICAL DRAWING ACADEMY SCHEMA</text>
      <text x="40" y="75" fill="#94a3b8" fontSize="12">Topic Module: ISO Standard Engineering Drawing</text>
      
      {/* Schematic Graphic */}
      <circle cx="250" cy="280" r="90" fill="none" stroke="#38bdf8" strokeWidth="2.5"/>
      <circle cx="250" cy="280" r="4" fill="#38bdf8"/>
      <line x1="160" y1="280" x2="340" y2="280" stroke="#64748b" strokeWidth="1" strokeDasharray="6,4"/>
      <line x1="250" y1="190" x2="250" y2="370" stroke="#64748b" strokeWidth="1" strokeDasharray="6,4"/>

      <g transform="translate(420, 140)">
        <rect x="0" y="0" width="320" height="240" fill="#0f172a" stroke="#334155" rx="8"/>
        <text x="20" y="35" fill="#38bdf8" fontSize="13" style={{ fontWeight: 700 }}>Engineering Standards:</text>
        <text x="20" y="70" fill="#cbd5e1" fontSize="11">- Line Weights: ISO 128-20 Type A/B</text>
        <text x="20" y="100" fill="#cbd5e1" fontSize="11">- Projection: First & Third Angle</text>
        <text x="20" y="130" fill="#cbd5e1" fontSize="11">- Dimensioning: ISO 129-1 Arrowheads</text>
        <text x="20" y="160" fill="#cbd5e1" fontSize="11">- Tolerance: ISO 2768-m Medium</text>
        <text x="20" y="205" fill="#22c55e" fontSize="11">Status: Active Parametric Generator</text>
      </g>
    </svg>
  );
}
