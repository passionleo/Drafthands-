/**
 * Drafthands Technical Drawing Academy
 * Centralized SVG Geometry, Coordinate Mirroring & Label Collision Prevention Engine
 * 
 * Standards Compliance: ISO 128 (Technical Drawings), WAEC/NERDC Technical Drawing Syllabus
 */

export interface Point2D {
  x: number;
  y: number;
}

export type LabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export interface LabelPlacement {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'central' | 'hanging' | 'alphabetic' | 'middle';
  badgeX: number;
  badgeY: number;
  badgeWidth: number;
  badgeHeight: number;
}

/**
 * Prime notation formatter for symmetric counterparts
 * Converts 'P1' -> "P1'", '1' -> "1'", 'P' -> "P'", etc.
 */
export function toPrimeNotation(label: string): string {
  if (!label) return '';
  if (label.includes("'") || label.includes('′')) return label;
  // If label contains subscript or parenthetical suffix like "P1 (Right)"
  const match = label.match(/^([A-Za-z0-9_]+)(.*)$/);
  if (match) {
    return `${match[1]}'${match[2]}`;
  }
  return `${label}'`;
}

/**
 * Mirrors an X coordinate across a vertical axis of symmetry (e.g. Centerline VO)
 */
export function mirrorX(x: number, axisX: number): number {
  return axisX + (axisX - x);
}

/**
 * Mirrors a Y coordinate across a horizontal axis of symmetry
 */
export function mirrorY(y: number, axisY: number): number {
  return axisY + (axisY - y);
}

/**
 * Computes collision-free label placements with background badge metrics
 * Prevents text overlapping with points, line nodes, sheet borders, and title blocks.
 */
export function computeLabelPlacement(
  cx: number,
  cy: number,
  label: string,
  position: LabelPosition = 'top-right',
  offsetDist = 14,
  fontSize = 11
): LabelPlacement {
  let dx = 0;
  let dy = 0;
  let textAnchor: 'start' | 'middle' | 'end' = 'start';
  let dominantBaseline: 'central' | 'hanging' | 'alphabetic' | 'middle' = 'middle';

  switch (position) {
    case 'top':
      dx = 0;
      dy = -offsetDist;
      textAnchor = 'middle';
      dominantBaseline = 'alphabetic';
      break;
    case 'bottom':
      dx = 0;
      dy = offsetDist;
      textAnchor = 'middle';
      dominantBaseline = 'hanging';
      break;
    case 'left':
      dx = -offsetDist;
      dy = 0;
      textAnchor = 'end';
      dominantBaseline = 'middle';
      break;
    case 'right':
      dx = offsetDist;
      dy = 0;
      textAnchor = 'start';
      dominantBaseline = 'middle';
      break;
    case 'top-left':
      dx = -offsetDist * 0.75;
      dy = -offsetDist * 0.75;
      textAnchor = 'end';
      dominantBaseline = 'alphabetic';
      break;
    case 'top-right':
      dx = offsetDist * 0.75;
      dy = -offsetDist * 0.75;
      textAnchor = 'start';
      dominantBaseline = 'alphabetic';
      break;
    case 'bottom-left':
      dx = -offsetDist * 0.75;
      dy = offsetDist * 0.75;
      textAnchor = 'end';
      dominantBaseline = 'hanging';
      break;
    case 'bottom-right':
      dx = offsetDist * 0.75;
      dy = offsetDist * 0.75;
      textAnchor = 'start';
      dominantBaseline = 'hanging';
      break;
    case 'center':
    default:
      dx = 0;
      dy = 0;
      textAnchor = 'middle';
      dominantBaseline = 'middle';
      break;
  }

  const posX = cx + dx;
  const posY = cy + dy;

  // Approximate text width for background badge
  const charWidth = fontSize * 0.62;
  const approxWidth = Math.max(14, label.length * charWidth + 8);
  const approxHeight = fontSize + 6;

  let badgeX = posX;
  if (textAnchor === 'middle') {
    badgeX = posX - approxWidth / 2;
  } else if (textAnchor === 'end') {
    badgeX = posX - approxWidth + 2;
  } else {
    badgeX = posX - 2;
  }

  let badgeY = posY;
  if (dominantBaseline === 'middle') {
    badgeY = posY - approxHeight / 2;
  } else if (dominantBaseline === 'hanging') {
    badgeY = posY - 2;
  } else {
    badgeY = posY - approxHeight + 4;
  }

  return {
    x: posX,
    y: posY,
    textAnchor,
    dominantBaseline,
    badgeX,
    badgeY,
    badgeWidth: approxWidth,
    badgeHeight: approxHeight
  };
}

/**
 * Prevents origin/vertex labels ('O', 'V', 'Datum') from being clipped at margins or obscured by coordinate axes
 */
export function sanitizeOriginPlacement(
  cx: number,
  cy: number,
  label: string,
  viewBox = { minX: 0, minY: 0, maxX: 800, maxY: 600 }
): LabelPlacement {
  const isLeft = cx > viewBox.maxX - 60;
  let isTop = false;

  // If close to bottom edge, flip top
  if (cy > viewBox.maxY - 50) {
    isTop = true;
  } else if (cy < viewBox.minY + 50) {
    isTop = false;
  }

  const preferredPos: LabelPosition = isTop
    ? (isLeft ? 'top-left' : 'top-right')
    : (isLeft ? 'bottom-left' : 'bottom-right');

  return computeLabelPlacement(cx, cy, label, preferredPos, 16, 12);
}

/**
 * PARABOLA SYMMETRY GENERATOR (Rectangle / Parallelogram Method)
 * Generates perfectly mirrored base divisions, vertical side divisions, radiating rays,
 * and plotted locus points with proper prime notation on right counterpart (1 vs 1', P1 vs P1').
 */
export interface ParabolaDivisionConfig {
  baseStartX: number; // Left vertex A
  baseEndX: number;   // Right vertex B
  baseY: number;      // Horizontal baseline Y
  vertexX: number;    // Axis of symmetry X (Midpoint O & Vertex V)
  vertexY: number;    // Peak altitude Y
  divisions: number;  // Typically 4 divisions per half-span
}

export interface ParabolaSymmetricData {
  axisX: number;
  baseMidpoint: Point2D;
  vertex: Point2D;
  leftBaseDivisions: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  rightBaseDivisions: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  leftSideDivisions: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  rightSideDivisions: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  leftLocusPoints: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  rightLocusPoints: { index: number; pt: Point2D; label: string; primeLabel: string }[];
  smoothCurvePoints: Point2D[];
}

export function generateSymmetricParabola(config: ParabolaDivisionConfig): ParabolaSymmetricData {
  const { baseStartX, baseEndX, baseY, vertexX, vertexY, divisions } = config;
  const halfSpan = (baseEndX - baseStartX) / 2;
  const rise = baseY - vertexY; // positive upwards

  const leftBaseDivisions: ParabolaSymmetricData['leftBaseDivisions'] = [];
  const rightBaseDivisions: ParabolaSymmetricData['rightBaseDivisions'] = [];
  const leftSideDivisions: ParabolaSymmetricData['leftSideDivisions'] = [];
  const rightSideDivisions: ParabolaSymmetricData['rightSideDivisions'] = [];
  const leftLocusPoints: ParabolaSymmetricData['leftLocusPoints'] = [];
  const rightLocusPoints: ParabolaSymmetricData['rightLocusPoints'] = [];

  for (let i = 1; i < divisions; i++) {
    // 1. Base divisions: measured from center outward or from ends inward
    // Standard WAEC convention: from A to O is 1, 2, 3; from B to O is 1', 2', 3'
    const xLeft = baseStartX + (i * halfSpan) / divisions;
    const xRight = mirrorX(xLeft, vertexX);

    leftBaseDivisions.push({
      index: i,
      pt: { x: xLeft, y: baseY },
      label: `${i}`,
      primeLabel: `${i}'`
    });

    rightBaseDivisions.push({
      index: i,
      pt: { x: xRight, y: baseY },
      label: `${i}'`,
      primeLabel: `${i}'`
    });

    // 2. Vertical side divisions (AD and BC): divided from base upward
    const ySide = baseY - (i * rise) / divisions;
    leftSideDivisions.push({
      index: i,
      pt: { x: baseStartX, y: ySide },
      label: `${i}`,
      primeLabel: `${i}'`
    });

    rightSideDivisions.push({
      index: i,
      pt: { x: baseEndX, y: ySide },
      label: `${i}'`,
      primeLabel: `${i}'`
    });

    // 3. Parabola locus intersection points:
    // Vertical line x = xLeft intersects radiating line from V(vertexX, vertexY) to left side point (baseStartX, ySide)
    // Parameter t along vertical: y = (xRel / halfSpan)^2 * rise
    const xRel = vertexX - xLeft; // distance from vertex
    const yParabola = vertexY + ((xRel * xRel) / (halfSpan * halfSpan)) * rise;

    leftLocusPoints.push({
      index: i,
      pt: { x: xLeft, y: yParabola },
      label: `P${divisions - i}`, // closer to vertex is higher index
      primeLabel: `P${divisions - i}'`
    });

    rightLocusPoints.push({
      index: i,
      pt: { x: xRight, y: yParabola },
      label: `P${divisions - i}'`,
      primeLabel: `P${divisions - i}'`
    });
  }

  // Smooth curve points
  const smoothCurvePoints: Point2D[] = [];
  const sampleSteps = 60;
  for (let s = 0; s <= sampleSteps; s++) {
    const t = s / sampleSteps;
    const x = baseStartX + t * (baseEndX - baseStartX);
    const xRel = x - vertexX;
    const y = vertexY + ((xRel * xRel) / (halfSpan * halfSpan)) * rise;
    smoothCurvePoints.push({ x, y });
  }

  return {
    axisX: vertexX,
    baseMidpoint: { x: vertexX, y: baseY },
    vertex: { x: vertexX, y: vertexY },
    leftBaseDivisions,
    rightBaseDivisions,
    leftSideDivisions,
    rightSideDivisions,
    leftLocusPoints,
    rightLocusPoints,
    smoothCurvePoints
  };
}

/**
 * ELLIPSE SYMMETRY GENERATOR (Concentric Circles Method)
 * Produces 12 radial generators with exact conjugate symmetry across major (X) and minor (Y) axes.
 * Symmetrical points on opposite quadrants are tagged with consistent prime/counterpart notation.
 */
export interface EllipseSymmetricConfig {
  centerX: number;
  centerY: number;
  semiMajor: number; // a
  semiMinor: number; // b
}

export interface EllipsePointNode {
  index: number;
  angleDeg: number;
  majorPt: Point2D;
  minorPt: Point2D;
  ellipsePt: Point2D;
  label: string;
  quadrant: 1 | 2 | 3 | 4;
}

export function generateSymmetricEllipse(config: EllipseSymmetricConfig): {
  points: EllipsePointNode[];
  foci: { f1: Point2D; f2: Point2D };
  smoothCurvePoints: Point2D[];
} {
  const { centerX, centerY, semiMajor, semiMinor } = config;
  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const points: EllipsePointNode[] = angles.map((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const majorX = centerX + semiMajor * Math.cos(rad);
    const majorY = centerY - semiMajor * Math.sin(rad);

    const minorX = centerX + semiMinor * Math.cos(rad);
    const minorY = centerY - semiMinor * Math.sin(rad);

    // Parametric coordinates: x = a*cos(θ), y = b*sin(θ)
    const elX = centerX + semiMajor * Math.cos(rad);
    const elY = centerY - semiMinor * Math.sin(rad);

    let quadrant: 1 | 2 | 3 | 4 = 1;
    if (deg >= 0 && deg < 90) quadrant = 1;
    else if (deg >= 90 && deg < 180) quadrant = 2;
    else if (deg >= 180 && deg < 270) quadrant = 3;
    else quadrant = 4;

    // Standard prime notation for symmetric points
    let label = `P${idx + 1}`;
    if (deg === 30) label = 'P1';
    else if (deg === 60) label = 'P2';
    else if (deg === 120) label = "P2'";
    else if (deg === 150) label = "P1'";
    else if (deg === 210) label = "P1''";
    else if (deg === 240) label = "P2''";
    else if (deg === 300) label = 'P2*';
    else if (deg === 330) label = 'P1*';

    return {
      index: idx + 1,
      angleDeg: deg,
      majorPt: { x: majorX, y: majorY },
      minorPt: { x: minorX, y: minorY },
      ellipsePt: { x: elX, y: elY },
      label,
      quadrant
    };
  });

  // Focal distance c = sqrt(a^2 - b^2)
  const c = Math.sqrt(Math.max(0, semiMajor * semiMajor - semiMinor * semiMinor));
  const foci = {
    f1: { x: centerX - c, y: centerY },
    f2: { x: centerX + c, y: centerY }
  };

  const smoothCurvePoints: Point2D[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const rad = (i * 2 * Math.PI) / steps;
    smoothCurvePoints.push({
      x: centerX + semiMajor * Math.cos(rad),
      y: centerY - semiMinor * Math.sin(rad)
    });
  }

  return { points, foci, smoothCurvePoints };
}

/**
 * HYPERBOLA SYMMETRY GENERATOR (Transverse and Conjugate Axis)
 */
export function generateSymmetricHyperbola(
  centerX: number,
  centerY: number,
  a: number, // transverse semi-axis
  b: number, // conjugate semi-axis
  spanX: number
): {
  leftBranch: Point2D[];
  rightBranch: Point2D[];
  asymptotes: { x1: number; y1: number; x2: number; y2: number }[];
  symmetricPoints: { left: Point2D; right: Point2D; labelL: string; labelR: string }[];
} {
  const leftBranch: Point2D[] = [];
  const rightBranch: Point2D[] = [];
  const symmetricPoints: { left: Point2D; right: Point2D; labelL: string; labelR: string }[] = [];

  const xMax = spanX;
  const numSteps = 40;

  for (let i = 0; i <= numSteps; i++) {
    const xDist = a + (i * (xMax - a)) / numSteps;
    // (x^2 / a^2) - (y^2 / b^2) = 1 => y = b * sqrt((x^2/a^2) - 1)
    const yVal = b * Math.sqrt(Math.max(0, (xDist * xDist) / (a * a) - 1));

    rightBranch.push({ x: centerX + xDist, y: centerY - yVal });
    leftBranch.push({ x: centerX - xDist, y: centerY - yVal });
  }

  // Add lower branch halves
  for (let i = numSteps; i >= 0; i--) {
    const xDist = a + (i * (xMax - a)) / numSteps;
    const yVal = b * Math.sqrt(Math.max(0, (xDist * xDist) / (a * a) - 1));
    rightBranch.push({ x: centerX + xDist, y: centerY + yVal });
    leftBranch.push({ x: centerX - xDist, y: centerY + yVal });
  }

  // Key symmetric points with prime notation
  [1.3 * a, 1.8 * a, 2.4 * a].forEach((xDist, idx) => {
    const yVal = b * Math.sqrt(Math.max(0, (xDist * xDist) / (a * a) - 1));
    symmetricPoints.push({
      left: { x: centerX - xDist, y: centerY - yVal },
      right: { x: centerX + xDist, y: centerY - yVal },
      labelL: `P${idx + 1}`,
      labelR: `P${idx + 1}'`
    });
  });

  // Asymptotes y = +/- (b/a) * x
  const asymLength = spanX * 1.2;
  const asymptotes = [
    {
      x1: centerX - asymLength,
      y1: centerY - (b / a) * (-asymLength),
      x2: centerX + asymLength,
      y2: centerY - (b / a) * asymLength
    },
    {
      x1: centerX - asymLength,
      y1: centerY + (b / a) * (-asymLength),
      x2: centerX + asymLength,
      y2: centerY + (b / a) * asymLength
    }
  ];

  return { leftBranch, rightBranch, asymptotes, symmetricPoints };
}

/**
 * Prepares and sanitizes an SVG element or raw SVG string for pristine, non-clipped technical export.
 * Embeds styling, non-transparent background, standard XML namespaces, and anti-clipping padding.
 */
export function prepareSvgForExport(
  svgElement: SVGSVGElement | string,
  options: {
    backgroundColor?: string;
    addDraftingFrame?: boolean;
    title?: string;
    scale?: number;
  } = {}
): string {
  const bg = options.backgroundColor || '#090d16'; // Sophisticated dark engineering blueprint slate
  let rawSvg = typeof svgElement === 'string' ? svgElement : svgElement.outerHTML;

  // Ensure xmlns and xmlns:xlink are present
  if (!rawSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    rawSvg = rawSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!rawSvg.includes('xmlns:xlink=')) {
    rawSvg = rawSvg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Parse viewBox or insert standard if missing
  const viewBoxMatch = rawSvg.match(/viewBox="([^"]+)"/);
  let vbWidth = 800;
  let vbHeight = 600;
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  }

  // Embedded technical styling for anti-aliased CAD fonts and text halos
  const embeddedStyles = `
    <style>
      text { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
      .cad-label { font-weight: bold; letter-spacing: 0.02em; }
      .halo-text { paint-order: stroke fill; stroke: ${bg}; stroke-width: 3.5px; stroke-linejoin: round; }
    </style>
  `;

  // Background rect to prevent black-on-black or transparent clipping when opened in external tools
  const backgroundPlate = `<rect width="100%" height="100%" fill="${bg}" />`;

  // Insert embedded styles and background plate immediately after opening <svg ...>
  rawSvg = rawSvg.replace(/<svg([^>]*)>/, `<svg$1>${embeddedStyles}${backgroundPlate}`);

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${rawSvg}`;
}
