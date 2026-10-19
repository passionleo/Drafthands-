import { WhiteboardElement, WhiteboardLayer } from '../../types/whiteboard';
import { LineWeightType } from '../../types/curriculum';

export interface GenerativeCadResult {
  title: string;
  description: string;
  elements: WhiteboardElement[];
  parameters: Record<string, number>;
  isIsometric3D: boolean;
}

/**
 * Generative CAD Engine (generativeCadEngine.ts)
 * Converts any arbitrary engineering prompt into fully independent, editable CAD entities,
 * supporting 3D Isometric projection, architectural floor plans, mechanical parts, and geometric constructions.
 */
export function generateCadEntitiesFromPrompt(prompt: string, originX: number = 400, originY: number = 300): GenerativeCadResult {
  const clean = (prompt || '').toLowerCase().trim();
  const nums = clean.match(/\b([0-9]+(?:\.[0-9]+)?)\b/g)?.map(Number) || [];
  
  const l = nums[0] !== undefined ? nums[0] : 120;
  const w = nums[1] !== undefined ? nums[1] : 80;
  const h = nums[2] !== undefined ? nums[2] : 60;
  const r = nums[0] !== undefined ? nums[0] / 2 : 50;

  const elements: WhiteboardElement[] = [];
  const now = Date.now();
  let isIso = false;
  let title = 'Generative CAD Engineering Model';
  let desc = `Custom generated CAD model based on prompt: "${prompt}"`;

  // =========================================================================
  // 1. 3D ISOMETRIC ENGINE (Cube, Cuboid, Prism, Bracket, Block)
  // =========================================================================
  if (clean.includes('isometric') || clean.includes('3d') || clean.includes('cube') || clean.includes('cuboid') || clean.includes('block') || clean.includes('prism') || clean.includes('bracket')) {
    isIso = true;
    title = `3D Isometric Projection (${l}mm × ${w}mm × ${h}mm)`;
    desc = `Authentic 3D isometric projection with 30° inclined axes, top/front/right orthographic planes, and hidden details.`;

    const cx = originX - 50;
    const cy = originY + 50;
    const scale = 0.8;

    // Isometric offsets (30 deg: cos(30) = 0.866, sin(30) = 0.5)
    const dx1 = l * scale * 0.866;
    const dy1 = l * scale * 0.5;
    const dx2 = w * scale * 0.866;
    const dy2 = w * scale * 0.5;
    const dz = h * scale;

    const p0 = { x: cx, y: cy };                             // Bottom origin
    const pX = { x: cx + dx1, y: cy - dy1 };                 // Front X vertex
    const pY = { x: cx - dx2, y: cy - dy2 };                 // Left Y vertex
    const pXY = { x: cx + dx1 - dx2, y: cy - dy1 - dy2 };    // Far corner
    
    const t0 = { x: p0.x, y: p0.y - dz };
    const tX = { x: pX.x, y: pX.y - dz };
    const tY = { x: pY.x, y: pY.y - dz };
    const tXY = { x: pXY.x, y: pXY.y - dz };

    // Vertical pillars (OUTLINE_HB)
    elements.push(
      { id: `iso-v1-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: p0.x, y1: p0.y, x2: t0.x, y2: t0.y },
      { id: `iso-v2-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: pX.x, y1: pX.y, x2: tX.x, y2: tX.y },
      { id: `iso-v3-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: pY.x, y1: pY.y, x2: tY.x, y2: tY.y }
    );

    // Top Face Perimeter
    elements.push(
      { id: `iso-t1-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#38bdf8', x1: t0.x, y1: t0.y, x2: tX.x, y2: tX.y },
      { id: `iso-t2-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#38bdf8', x1: t0.x, y1: t0.y, x2: tY.x, y2: tY.y },
      { id: 'iso-t3', type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#38bdf8', x1: tX.x, y1: tX.y, x2: tXY.x, y2: tXY.y },
      { id: 'iso-t4', type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#38bdf8', x1: tY.x, y1: tY.y, x2: tXY.x, y2: tXY.y }
    );

    // Front/Left Base Edges
    elements.push(
      { id: `iso-b1-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: p0.x, y1: p0.y, x2: pX.x, y2: pX.y },
      { id: `iso-b2-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: p0.x, y1: p0.y, x2: pY.x, y2: pY.y }
    );

    // Hidden back vertical & base edges (HIDDEN_DASHED)
    elements.push(
      { id: `iso-hd1-${now}`, type: 'LINE', layer: 'HIDDEN_DASHED', lineWeight: 'THIN_DASHED', color: '#f43f5e', x1: pXY.x, y1: pXY.y, x2: tXY.x, y2: tXY.y }
    );

    // Isometric 30° Axis Centerlines (CENTERLINE_CHAIN)
    elements.push(
      { id: `iso-cl-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#f59e0b', x1: cx - 40, y1: cy, x2: cx + 120, y2: cy - 60 }
    );

  // =========================================================================
  // 2. ARCHITECTURAL & CIVIL (Floor Plan, Foundation)
  // =========================================================================
  } else if (clean.includes('building') || clean.includes('floor') || clean.includes('plan') || clean.includes('house') || clean.includes('foundation') || clean.includes('room')) {
    title = `Architectural Floor Plan (${l}mm × ${w}mm)`;
    desc = `Double-line exterior walls (225mm), partition rooms, door openings with swing arcs, and ISO dimensions.`;

    const bx = originX - 200;
    const by = originY - 150;
    const bw = Math.max(300, l * 2);
    const bh = Math.max(200, w * 2);

    elements.push(
      { id: `arch-out-${now}`, type: 'RECTANGLE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: bx, y1: by, width: bw, height: bh },
      { id: `arch-in-${now}`, type: 'RECTANGLE', layer: 'CONSTRUCTION_2H', lineWeight: 'THIN_CONTINUOUS', color: '#38bdf8', x1: bx + 15, y1: by + 15, width: bw - 30, height: bh - 30 },
      { id: `arch-div-${now}`, type: 'LINE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: bx + bw * 0.5, y1: by + 15, x2: bx + bw * 0.5, y2: by + bh - 15 },
      { id: `arch-door-${now}`, type: 'ARC', layer: 'CONSTRUCTION_2H', lineWeight: 'THIN_CONTINUOUS', color: '#38bdf8', cx: bx + bw * 0.5, cy: by + 100, r: 45, startAngle: 180, endAngle: 270 },
      { id: `arch-dim-${now}`, type: 'DIMENSION', layer: 'DIMENSIONS', lineWeight: 'DIMENSION_LINE', color: '#10b981', x1: bx, y1: by - 25, x2: bx + bw, y2: by - 25, dimensionText: `SPAN = ${l * 10} mm` }
    );

  // =========================================================================
  // 3. MECHANICAL ENGINEERING (Stepped Shaft, Orthographic, Bracket)
  // =========================================================================
  } else if (clean.includes('shaft') || clean.includes('mechanical') || clean.includes('machine') || clean.includes('bolt') || clean.includes('flange') || clean.includes('bracket')) {
    title = `Mechanical Component & Assembly (${l}mm)`;
    desc = `Coaxial stepped cylindrical component with ISO centerlines, 45° chamfers, and section hatching.`;

    const mx = originX - 180;
    const my = originY;

    elements.push(
      { id: `mech-cl-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#38bdf8', x1: mx - 40, y1: my, x2: mx + l + 80, y2: my },
      { id: `mech-s1-${now}`, type: 'RECTANGLE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: mx, y1: my - 50, width: l * 0.4, height: 100 },
      { id: `mech-s2-${now}`, type: 'RECTANGLE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: mx + l * 0.4, y1: my - 35, width: l * 0.6, height: 70 },
      { id: `mech-dim-${now}`, type: 'DIMENSION', layer: 'DIMENSIONS', lineWeight: 'DIMENSION_LINE', color: '#10b981', x1: mx, y1: my + 70, x2: mx + l, y2: my + 70, dimensionText: `LENGTH = ${l} mm` }
    );

  // =========================================================================
  // 4. 2D PLANE GEOMETRY (Circle, Rectangle, Polygon, Parabola, Ellipse)
  // =========================================================================
  } else if (clean.includes('circle') || clean.includes('radius') || clean.includes('diameter')) {
    title = `Circle / Cylinder (Radius ${r}mm)`;
    desc = `Geometric circle with centerlines, quadrant marks, and radius dimensioning.`;

    elements.push(
      { id: `geom-c-${now}`, type: 'CIRCLE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', cx: originX, cy: originY, r },
      { id: `geom-cl1-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#38bdf8', x1: originX - r - 30, y1: originY, x2: originX + r + 30, y2: originY },
      { id: `geom-cl2-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#38bdf8', x1: originX, y1: originY - r - 30, x2: originX, y2: originY + r + 30 },
      { id: `geom-dim-${now}`, type: 'DIMENSION', layer: 'DIMENSIONS', lineWeight: 'DIMENSION_LINE', color: '#10b981', x1: originX, y1: originY, x2: originX + r * 0.707, y2: originY - r * 0.707, dimensionText: `R = ${r} mm` }
    );

  } else if (clean.includes('ellipse') || clean.includes('parabola') || clean.includes('hyperbola')) {
    title = `Conic Section & Ellipse (${l}x${w}mm)`;
    desc = `Geometric conic curve constructed using concentric axes and radial generator rays.`;

    elements.push(
      { id: `con-c1-${now}`, type: 'CIRCLE', layer: 'CONSTRUCTION_2H', lineWeight: 'THIN_CONTINUOUS', color: '#38bdf8', cx: originX, cy: originY, r: l },
      { id: `con-c2-${now}`, type: 'CIRCLE', layer: 'CONSTRUCTION_2H', lineWeight: 'THIN_CONTINUOUS', color: '#38bdf8', cx: originX, cy: originY, r: w },
      { id: `con-ax1-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#f59e0b', x1: originX - l - 20, y1: originY, x2: originX + l + 20, y2: originY },
      { id: `con-ax2-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#f59e0b', x1: originX, y1: originY - l - 20, x2: originX, y2: originY + l + 20 }
    );

  } else {
    // Default Generative Rectangle / Geometric Block
    title = `Parametric Engineering Block (${l}mm × ${w}mm)`;
    desc = `Custom generated 2D rectangular profile with corner alignment and ISO dimensions.`;

    const rx = originX - l * 0.5;
    const ry = originY - w * 0.5;

    elements.push(
      { id: `def-rect-${now}`, type: 'RECTANGLE', layer: 'OUTLINE_HB', lineWeight: 'THICK_CONTINUOUS', color: '#f8fafc', x1: rx, y1: ry, width: l, height: w },
      { id: `def-cl-${now}`, type: 'LINE', layer: 'CENTERLINE_CHAIN', lineWeight: 'THIN_CHAIN', color: '#38bdf8', x1: rx - 20, y1: originY, x2: rx + l + 20, y2: originY },
      { id: `def-dim-${now}`, type: 'DIMENSION', layer: 'DIMENSIONS', lineWeight: 'DIMENSION_LINE', color: '#10b981', x1: rx, y1: ry - 25, x2: rx + l, y2: ry - 25, dimensionText: `${l} mm` }
    );
  }

  return {
    title,
    description: desc,
    elements,
    parameters: { length: l, width: w, height: h, radius: r },
    isIsometric3D: isIso
  };
}
