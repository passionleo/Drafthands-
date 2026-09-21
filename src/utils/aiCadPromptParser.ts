import { CurriculumTier } from '../types/curriculum';

export interface ExtractedCadParam {
  key: string;
  label: string;
  value: number;
  unit: string;
  symbol?: string;
}

export interface ParsedCadResult {
  matched: boolean;
  rawPrompt: string;
  geometryType: string;
  geometryTitle: string;
  topicId: string;
  tier: CurriculumTier;
  confidence: number;
  description: string;
  parameters: Record<string, number>;
  extractedParams: ExtractedCadParam[];
  matchedKeywords: string[];
  executionPlan: string;
  cadCommandEcho: string;
}

/**
 * Clean and normalize natural language prompt
 */
function normalizePrompt(prompt: string): string {
  return prompt
    .toLowerCase()
    .trim()
    .replace(/[,\t\r\n]+/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Extracts a number preceded or followed by key synonyms
 * e.g. "span 120mm", "span of 120", "span: 120", "120mm span"
 */
function extractNumberWithKeywords(text: string, keywords: string[]): number | null {
  for (const kw of keywords) {
    // Pattern 1: keyword + optional separator + number + optional unit
    // e.g., "span 120", "span: 120mm", "span of 120", "span = 120.5"
    const p1 = new RegExp(`(?:\\b${kw}\\b)[\\s:=ofis]*([0-9]+(?:\\.[0-9]+)?)\\s*(?:mm|cm|m|deg|°)?`, 'i');
    const m1 = text.match(p1);
    if (m1 && m1[1]) {
      const val = parseFloat(m1[1]);
      if (!isNaN(val)) return val;
    }

    // Pattern 2: number + optional unit + keyword
    // e.g., "120mm span", "120 span", "80mm rise"
    const p2 = new RegExp(`([0-9]+(?:\\.[0-9]+)?)\\s*(?:mm|cm|m|deg|°)?\\s*(?:\\b${kw}\\b)`, 'i');
    const m2 = text.match(p2);
    if (m2 && m2[1]) {
      const val = parseFloat(m2[1]);
      if (!isNaN(val)) return val;
    }
  }
  return null;
}

/**
 * Extracts dimension pair like "120x80", "120 x 80", "120 by 80"
 */
function extractDimensionPair(text: string): [number, number] | null {
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:mm)?\s*(?:x|by|\*|\/)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:mm)?/i);
  if (m && m[1] && m[2]) {
    const val1 = parseFloat(m[1]);
    const val2 = parseFloat(m[2]);
    if (!isNaN(val1) && !isNaN(val2)) return [val1, val2];
  }
  return null;
}

/**
 * Extracts all freestanding numbers in text
 */
function extractAllNumbers(text: string): number[] {
  const matches = text.match(/\b([0-9]+(?:\.[0-9]+)?)\b/g);
  if (!matches) return [];
  return matches.map(n => parseFloat(n)).filter(n => !isNaN(n));
}

/**
 * Main AI Prompt-to-CAD Lightweight Parser
 * Analyzes natural language instructions, extracts geometric parameters,
 * and produces ready-to-render CAD directives.
 */
export function parseNaturalLanguageCadPrompt(rawPrompt: string): ParsedCadResult {
  const clean = normalizePrompt(rawPrompt);
  const matchedKeywords: string[] = [];

  // ==========================================
  // 1. PARABOLA (Rectangular / Tangent Method)
  // e.g. "Construct a parabola with span 120mm and rise 80mm"
  // ==========================================
  if (clean.includes('parabola') || clean.includes('parabolic')) {
    matchedKeywords.push('parabola');
    
    let span = extractNumberWithKeywords(clean, ['span', 'base', 'width', 'length', 'l', 'ab']);
    let rise = extractNumberWithKeywords(clean, ['rise', 'height', 'altitude', 'h', 'vo', 'altitude/height']);

    // Check for dimension pair if one or both are missing (e.g., "parabola 120x80")
    if (span === null || rise === null) {
      const pair = extractDimensionPair(clean);
      if (pair) {
        if (span === null) span = pair[0];
        if (rise === null) rise = pair[1];
      }
    }

    // Check consecutive numbers if still missing
    if (span === null || rise === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length >= 2) {
        if (span === null) span = nums[0];
        if (rise === null) rise = nums[1];
      } else if (nums.length === 1) {
        if (span === null) span = nums[0];
      }
    }

    // Sensible CAD defaults if not specified
    const finalSpan = span !== null ? span : 320;
    const finalRise = rise !== null ? rise : 180;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'PARABOLA',
      geometryTitle: 'Parabola (Rectangle / Parallelogram Method)',
      topicId: 'ss2-parabola-construction',
      tier: 'SS2',
      confidence: 0.98,
      description: `Constructing true parabolic conic locus with base span L = ${finalSpan}mm and altitude H = ${finalRise}mm.`,
      parameters: {
        baseSpan: finalSpan,
        altitude: finalRise
      },
      extractedParams: [
        { key: 'baseSpan', label: 'Base Span (L)', value: finalSpan, unit: 'mm', symbol: 'L' },
        { key: 'altitude', label: 'Altitude / Rise (H)', value: finalRise, unit: 'mm', symbol: 'H' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS2 Parabola Construction. Injected parameters: baseSpan=${finalSpan}mm, altitude=${finalRise}mm. Generating vector curve...`,
      cadCommandEcho: `PARABOLA [SPAN=${finalSpan}mm, RISE=${finalRise}mm, METHOD=RECTANGLE]`
    };
  }

  // ==========================================
  // 2. ELLIPSE (Concentric Circles or Trammel)
  // e.g. "Construct an ellipse with major axis 180mm and minor axis 110mm"
  // ==========================================
  if (clean.includes('ellipse') || clean.includes('elliptical') || clean.includes('concentric circle')) {
    matchedKeywords.push('ellipse');

    let major = extractNumberWithKeywords(clean, ['major axis', 'major', '2a', 'length', 'span', 'width']);
    let minor = extractNumberWithKeywords(clean, ['minor axis', 'minor', '2b', 'height', 'altitude']);

    if (major === null || minor === null) {
      const pair = extractDimensionPair(clean);
      if (pair) {
        if (major === null) major = Math.max(pair[0], pair[1]);
        if (minor === null) minor = Math.min(pair[0], pair[1]);
      }
    }

    if (major === null || minor === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length >= 2) {
        major = Math.max(nums[0], nums[1]);
        minor = Math.min(nums[0], nums[1]);
      }
    }

    const finalMajor = major !== null ? major : 320;
    const finalMinor = minor !== null ? minor : 200;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'ELLIPSE',
      geometryTitle: 'Conic Sections: Ellipse by Concentric Circles',
      topicId: 'ss2-ellipse-concentric',
      tier: 'SS2',
      confidence: 0.97,
      description: `Constructing ellipse with major axis 2a = ${finalMajor}mm and minor axis 2b = ${finalMinor}mm.`,
      parameters: {
        majorAxis: finalMajor,
        minorAxis: finalMinor
      },
      extractedParams: [
        { key: 'majorAxis', label: 'Major Axis (2a)', value: finalMajor, unit: 'mm', symbol: '2a' },
        { key: 'minorAxis', label: 'Minor Axis (2b)', value: finalMinor, unit: 'mm', symbol: '2b' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS2 Ellipse Construction. Injected parameters: majorAxis=${finalMajor}mm, minorAxis=${finalMinor}mm. Generating 12-sector projection...`,
      cadCommandEcho: `ELLIPSE [MAJOR=${finalMajor}mm, MINOR=${finalMinor}mm, METHOD=CONCENTRIC_CIRCLES]`
    };
  }

  // ==========================================
  // 3. BISECT A LINE
  // e.g. "Bisect a line of length 120mm", "Bisect line AB 100mm"
  // ==========================================
  if (
    (clean.includes('bisect') || clean.includes('bisection') || clean.includes('perpendicular bisector') || clean.includes('divide line')) &&
    (clean.includes('line') || clean.includes('segment') || clean.includes('ab'))
  ) {
    matchedKeywords.push('bisect', 'line');

    let len = extractNumberWithKeywords(clean, ['length', 'len', 'line', 'ab', 'span', 'l']);
    if (len === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) len = nums[0];
    }

    const finalLen = len !== null ? len : 300;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'LINE_BISECTION',
      geometryTitle: 'Bisection of a Given Straight Line',
      topicId: 'ss1-bisect-line',
      tier: 'SS1',
      confidence: 0.96,
      description: `Constructing perpendicular bisector for straight line AB of length ${finalLen}mm with intersecting compass arcs.`,
      parameters: {
        length: finalLen,
        compassFactor: 0.65
      },
      extractedParams: [
        { key: 'length', label: 'Line Length (AB)', value: finalLen, unit: 'mm', symbol: 'L' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS1 Line Bisection. Injected parameters: length=${finalLen}mm. Synthesizing dual compass arcs & normal vector...`,
      cadCommandEcho: `BISECT_LINE [LENGTH=${finalLen}mm, NORMAL=90°]`
    };
  }

  // ==========================================
  // 4. ANGLE CONSTRUCTION & BISECTION
  // e.g. "Construct an angle of 60 degrees with arm length 120mm", "Construct 45 degree angle"
  // ==========================================
  if (clean.includes('angle') || clean.includes('deg') || clean.includes('degree') || clean.includes('°')) {
    matchedKeywords.push('angle');

    const isBisect = clean.includes('bisect');
    let deg = extractNumberWithKeywords(clean, ['angle', 'deg', 'degree', 'degrees', 'targetangle', 'val']);
    let arm = extractNumberWithKeywords(clean, ['arm', 'length', 'arm length', 'radius', 'len', 'side']);

    if (deg === null) {
      // Find numbers associated with degrees
      const degMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:deg|degree|degrees|°)/i);
      if (degMatch && degMatch[1]) deg = parseFloat(degMatch[1]);
    }

    if (deg === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) deg = nums[0];
    }

    const finalDeg = deg !== null ? deg : 60;
    const finalArm = arm !== null ? arm : 240;

    const topicId = isBisect ? 'ss1-bisect-angle' : 'ss1-angles-construction';
    const title = isBisect ? 'Bisection of a Given Angle' : `Construction of ${finalDeg}° Angle`;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'ANGLE',
      geometryTitle: title,
      topicId,
      tier: 'SS1',
      confidence: 0.95,
      description: `${isBisect ? 'Bisecting' : 'Constructing'} angle of ${finalDeg}° with arm length ${finalArm}mm using geometric compass rays.`,
      parameters: {
        angleDeg: finalDeg,
        targetAngle: finalDeg,
        armLength: finalArm
      },
      extractedParams: [
        { key: 'targetAngle', label: 'Angle', value: finalDeg, unit: '°', symbol: 'θ' },
        { key: 'armLength', label: 'Arm Length', value: finalArm, unit: 'mm', symbol: 'L' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS1 Angle Construction. Injected parameters: angle=${finalDeg}°, arm=${finalArm}mm. Generating compass construction arcs...`,
      cadCommandEcho: `ANGLE [THETA=${finalDeg}°, ARM=${finalArm}mm]`
    };
  }

  // ==========================================
  // 5. REGULAR HEXAGON & POLYGONS
  // e.g. "Draw a regular hexagon with side 50mm", "Hexagon across flats 80mm"
  // ==========================================
  if (clean.includes('hexagon') || clean.includes('hexagonal')) {
    matchedKeywords.push('hexagon');

    const acrossFlats = clean.includes('flat') || clean.includes('across flat') || clean.includes('flats');
    const acrossCorners = clean.includes('corner') || clean.includes('across corner') || clean.includes('corners');

    let side = extractNumberWithKeywords(clean, ['side', 'side length', 'radius', 'r', 'flats', 'corners', 'diameter', 'd']);
    if (side === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) side = nums[0];
    }

    const finalSide = side !== null ? side : (acrossFlats ? 160 : 120);
    const topicId = acrossFlats 
      ? 'ss1-hexagon-across-flats' 
      : acrossCorners 
        ? 'ss1-hexagon-across-corners' 
        : 'ss1-regular-hexagon';

    return {
      matched: true,
      rawPrompt,
      geometryType: 'HEXAGON',
      geometryTitle: `Regular Hexagon (${acrossFlats ? 'Across Flats' : acrossCorners ? 'Across Corners' : 'Circle Inscription'})`,
      topicId,
      tier: 'SS1',
      confidence: 0.96,
      description: `Constructing regular 6-sided hexagon with dimension ${finalSide}mm using stepping compass dividers.`,
      parameters: {
        sideLength: finalSide,
        dimension: finalSide,
        distanceAcrossFlats: finalSide
      },
      extractedParams: [
        { key: 'sideLength', label: acrossFlats ? 'Across Flats' : 'Side Length (S)', value: finalSide, unit: 'mm', symbol: 'S' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS1 Hexagon Construction. Injected dimension: ${finalSide}mm. Computing 60° nodal coordinates...`,
      cadCommandEcho: `HEXAGON [DIM=${finalSide}mm, MODE=${acrossFlats ? 'FLATS' : 'CORNERS'}]`
    };
  }

  // ==========================================
  // 6. REGULAR PENTAGON
  // e.g. "Construct a regular pentagon with side 60mm"
  // ==========================================
  if (clean.includes('pentagon') || clean.includes('pentagonal')) {
    matchedKeywords.push('pentagon');

    let side = extractNumberWithKeywords(clean, ['side', 'side length', 'length', 'base', 's']);
    if (side === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) side = nums[0];
    }

    const finalSide = side !== null ? side : 120;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'PENTAGON',
      geometryTitle: 'Construction of a Regular Pentagon',
      topicId: 'ss1-regular-pentagon',
      tier: 'SS1',
      confidence: 0.95,
      description: `Constructing 5-sided equilateral and equiangular polygon with base side S = ${finalSide}mm using internal angle 108°.`,
      parameters: {
        sideLength: finalSide
      },
      extractedParams: [
        { key: 'sideLength', label: 'Side Length (S)', value: finalSide, unit: 'mm', symbol: 'S' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS1 Pentagon Construction. Injected side=${finalSide}mm. Computing Golden Ratio chord geometry...`,
      cadCommandEcho: `PENTAGON [SIDE=${finalSide}mm, INT_ANGLE=108°]`
    };
  }

  // ==========================================
  // 7. TRIANGLES (Equilateral, Isosceles, Scalene)
  // e.g. "Construct an equilateral triangle with base 90mm"
  // ==========================================
  if (clean.includes('triangle') || clean.includes('triangular') || clean.includes('equilateral')) {
    matchedKeywords.push('triangle');

    const isEquilateral = clean.includes('equilateral');
    const isIsosceles = clean.includes('isosceles');
    let side = extractNumberWithKeywords(clean, ['base', 'side', 'length', 'span']);
    if (side === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) side = nums[0];
    }

    const finalSide = side !== null ? side : 160;
    const topicId = isIsosceles 
      ? 'ss1-triangle-isosceles' 
      : isEquilateral 
        ? 'ss1-triangle-equilateral' 
        : 'ss1-triangle-scalene';

    return {
      matched: true,
      rawPrompt,
      geometryType: 'TRIANGLE',
      geometryTitle: isEquilateral ? 'Construction of an Equilateral Triangle' : 'Construction of Triangle',
      topicId,
      tier: 'SS1',
      confidence: 0.94,
      description: `Constructing triangle with base AB = ${finalSide}mm and intersecting 60° arc radii.`,
      parameters: {
        sideLength: finalSide,
        base: finalSide
      },
      extractedParams: [
        { key: 'sideLength', label: 'Base / Side Length', value: finalSide, unit: 'mm', symbol: 'AB' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS1 Triangle Construction. Injected parameter: side=${finalSide}mm. Drawing base and apex intersecting arcs...`,
      cadCommandEcho: `TRIANGLE [BASE=${finalSide}mm, APEX_R=${finalSide}mm]`
    };
  }

  // ==========================================
  // 8. TANGENCY & BELT DRIVES
  // e.g. "Construct external tangency between radii 35mm and 20mm with distance 90mm"
  // ==========================================
  if (clean.includes('tangent') || clean.includes('tangency') || clean.includes('belt') || clean.includes('pulley')) {
    matchedKeywords.push('tangency');

    const isInternal = clean.includes('internal') || clean.includes('crossed');
    let r1 = extractNumberWithKeywords(clean, ['r1', 'radius 1', 'radius1', 'large radius', 'first radius']);
    let r2 = extractNumberWithKeywords(clean, ['r2', 'radius 2', 'radius2', 'small radius', 'second radius']);
    let dist = extractNumberWithKeywords(clean, ['distance', 'center distance', 'centres', 'dist', 'span']);

    if (r1 === null || r2 === null || dist === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length >= 3) {
        r1 = nums[0];
        r2 = nums[1];
        dist = nums[2];
      } else if (nums.length === 2) {
        r1 = nums[0];
        r2 = nums[1];
      }
    }

    const finalR1 = r1 !== null ? r1 : 70;
    const finalR2 = r2 !== null ? r2 : 40;
    const finalDist = dist !== null ? dist : 260;
    const topicId = isInternal ? 'ss2-tangency-internal' : 'ss2-tangency-external';

    return {
      matched: true,
      rawPrompt,
      geometryType: 'TANGENCY',
      geometryTitle: isInternal ? 'Internal Tangents to Two Unequal Circles' : 'External Tangents (Open Belt Drive)',
      topicId,
      tier: 'SS2',
      confidence: 0.95,
      description: `Constructing common ${isInternal ? 'internal' : 'external'} tangents to circles R1 = ${finalR1}mm, R2 = ${finalR2}mm with center distance D = ${finalDist}mm.`,
      parameters: {
        r1: finalR1,
        r2: finalR2,
        centerDistance: finalDist
      },
      extractedParams: [
        { key: 'r1', label: 'Radius 1 (R1)', value: finalR1, unit: 'mm', symbol: 'R1' },
        { key: 'r2', label: 'Radius 2 (R2)', value: finalR2, unit: 'mm', symbol: 'R2' },
        { key: 'centerDistance', label: 'Center Distance (C)', value: finalDist, unit: 'mm', symbol: 'C' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS2 Tangency Construction. Injected parameters: R1=${finalR1}mm, R2=${finalR2}mm, Dist=${finalDist}mm. Auxiliary circle bisection initiated...`,
      cadCommandEcho: `TANGENT_${isInternal ? 'INT' : 'EXT'} [R1=${finalR1}mm, R2=${finalR2}mm, DIST=${finalDist}mm]`
    };
  }

  // ==========================================
  // 9. LOCI OF CURVES (Involute, Cycloid)
  // e.g. "Construct an involute of a circle diameter 50mm"
  // ==========================================
  if (clean.includes('involute') || clean.includes('spiral')) {
    matchedKeywords.push('involute');

    let dia = extractNumberWithKeywords(clean, ['diameter', 'dia', 'd', 'radius', 'r']);
    if (dia === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) dia = nums[0];
    }
    const finalDia = dia !== null ? dia : 70;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'INVOLUTE',
      geometryTitle: 'Involute of a Circle & Archimedean Spiral',
      topicId: 'ss2-involute-spiral',
      tier: 'SS2',
      confidence: 0.95,
      description: `Constructing involute curve unwinding from base cylinder diameter D = ${finalDia}mm with perimeter πD unfolding.`,
      parameters: {
        diameter: finalDia
      },
      extractedParams: [
        { key: 'diameter', label: 'Circle Diameter (D)', value: finalDia, unit: 'mm', symbol: 'D' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS2 Involute Curve. Injected diameter: ${finalDia}mm. Unwinding 12 perimeter tangent rays...`,
      cadCommandEcho: `INVOLUTE [DIAMETER=${finalDia}mm]`
    };
  }

  if (clean.includes('cycloid') || clean.includes('epicycloid')) {
    matchedKeywords.push('cycloid');

    let dia = extractNumberWithKeywords(clean, ['diameter', 'dia', 'd', 'radius', 'r']);
    if (dia === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) dia = nums[0];
    }
    const finalDia = dia !== null ? dia : 60;

    return {
      matched: true,
      rawPrompt,
      geometryType: 'CYCLOID',
      geometryTitle: 'Loci: Cycloid Curve by Pure Rolling Circle',
      topicId: 'ss2-cycloid-curve',
      tier: 'SS2',
      confidence: 0.95,
      description: `Constructing locus traced by a point on rim of generating circle diameter D = ${finalDia}mm rolling without slip along flat datum line.`,
      parameters: {
        diameter: finalDia
      },
      extractedParams: [
        { key: 'diameter', label: 'Rolling Circle Diameter (D)', value: finalDia, unit: 'mm', symbol: 'D' }
      ],
      matchedKeywords,
      executionPlan: `Switching to SS2 Cycloid Construction. Injected diameter: ${finalDia}mm. Rolling circle linear loci calculated...`,
      cadCommandEcho: `CYCLOID [DIAMETER=${finalDia}mm, BASE_LINE=πD]`
    };
  }

  // ==========================================
  // 10. SCALES (Plain Scale & Diagonal Scale)
  // e.g. "Construct a plain scale 1:50 to read up to 5m", "Diagonal scale to read 300mm"
  // ==========================================
  if (clean.includes('scale')) {
    matchedKeywords.push('scale');

    const isDiagonal = clean.includes('diagonal');
    let maxVal = extractNumberWithKeywords(clean, ['max', 'read up to', 'length', 'maximum', 'span']);
    if (maxVal === null) {
      const nums = extractAllNumbers(clean);
      if (nums.length > 0) maxVal = nums[0];
    }

    const finalMax = maxVal !== null ? maxVal : 5;
    const topicId = isDiagonal ? 'ss2-diagonal-scale' : 'ss1-plain-scale';

    return {
      matched: true,
      rawPrompt,
      geometryType: 'SCALE',
      geometryTitle: isDiagonal ? 'Construction of a Diagonal Scale' : 'Construction of a Plain Scale',
      topicId,
      tier: isDiagonal ? 'SS2' : 'SS1',
      confidence: 0.92,
      description: `Constructing ISO engineering scale to read up to ${finalMax} units with proportional sub-divisions.`,
      parameters: {
        maxReading: finalMax
      },
      extractedParams: [
        { key: 'maxReading', label: 'Maximum Reading', value: finalMax, unit: 'units', symbol: 'Max' }
      ],
      matchedKeywords,
      executionPlan: `Switching to ${isDiagonal ? 'SS2 Diagonal' : 'SS1 Plain'} Scale Construction. Initializing primary and vernier grids...`,
      cadCommandEcho: `SCALE [TYPE=${isDiagonal ? 'DIAGONAL' : 'PLAIN'}, MAX=${finalMax}]`
    };
  }

  // ==========================================
  // 11. GENERAL FALLBACK / AUTODETECT
  // If prompt contains generic CAD keywords
  // ==========================================
  const allNums = extractAllNumbers(clean);
  if (allNums.length >= 2) {
    // Default to parabola if 2 numbers (like 120, 80)
    return {
      matched: true,
      rawPrompt,
      geometryType: 'PARABOLA',
      geometryTitle: 'Parabola (Rectangle / Parallelogram Method)',
      topicId: 'ss2-parabola-construction',
      tier: 'SS2',
      confidence: 0.75,
      description: `Inferred parabolic curve with span ${allNums[0]}mm and altitude ${allNums[1]}mm from numerical dimensions.`,
      parameters: {
        baseSpan: allNums[0],
        altitude: allNums[1]
      },
      extractedParams: [
        { key: 'baseSpan', label: 'Base Span', value: allNums[0], unit: 'mm' },
        { key: 'altitude', label: 'Altitude', value: allNums[1], unit: 'mm' }
      ],
      matchedKeywords: ['numeric_dimensions'],
      executionPlan: `Generated CAD directive from numerical coordinates: Span=${allNums[0]}mm, Altitude=${allNums[1]}mm.`,
      cadCommandEcho: `CAD_CONSTRUCT [VAL1=${allNums[0]}, VAL2=${allNums[1]}]`
    };
  }

  // Could not match known geometric pattern
  return {
    matched: false,
    rawPrompt,
    geometryType: 'UNKNOWN',
    geometryTitle: 'Unrecognized CAD Instruction',
    topicId: 'ss2-parabola-construction',
    tier: 'SS2',
    confidence: 0,
    description: 'Could not identify specific geometric parameters. Please try e.g. "Construct a parabola with span 120mm and rise 80mm".',
    parameters: {},
    extractedParams: [],
    matchedKeywords: [],
    executionPlan: 'Command unrecognized. Please review supported CAD examples.',
    cadCommandEcho: `ERROR: UNRECOGNIZED_COMMAND "${rawPrompt}"`
  };
}
