import { DrawingTopic, CurriculumTier, CurriculumTerm, ConstructionElement, LineWeightType } from '../types/curriculum';
import { ss1Topics } from './topics/ss1';
import { ss2Topics } from './topics/ss2';
import { ss3Topics } from './topics/ss3';
import { higherTopics } from './topics/higher';
import { buildingTopics } from './topics/building';
import { machineTopics } from './topics/machine';
import { cadTopics } from './topics/cad';
import { digitalGraphicsTopics } from './topics/digitalGraphics';

export const allCurriculumTopics: DrawingTopic[] = [
  ...ss1Topics,
  ...ss2Topics,
  ...ss3Topics,
  ...higherTopics,
  ...buildingTopics,
  ...machineTopics,
  ...cadTopics,
  ...digitalGraphicsTopics
];

export const TERM_CONFIG: Record<CurriculumTerm, {
  id: CurriculumTerm;
  label: string;
  shortLabel: string;
  badge: string;
  colorClass: string;
  description: string;
}> = {
  TERM_1: {
    id: 'TERM_1',
    label: 'First Term (Weeks 1 - 12)',
    shortLabel: 'Term 1',
    badge: '1st Term',
    colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    description: 'Foundational theory, instrument mastery, core geometric constructions and projections.'
  },
  TERM_2: {
    id: 'TERM_2',
    label: 'Second Term (Weeks 1 - 12)',
    shortLabel: 'Term 2',
    badge: '2nd Term',
    colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: 'Intermediate constructions, scales, conic sections, architectural plans, and mechanical fasteners.'
  },
  TERM_3: {
    id: 'TERM_3',
    label: 'Third Term (Weeks 1 - 12)',
    shortLabel: 'Term 3',
    badge: '3rd Term',
    colorClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: 'Advanced surface developments, auxiliary projections, interpenetration of solids, and CAD applications.'
  }
};

export const TIER_CONFIG: Record<CurriculumTier, {
  label: string;
  badge: string;
  colorClass: string;
  description: string;
}> = {
  SS1: {
    label: 'Senior Secondary 1 (SS1)',
    badge: 'SS1 Foundation',
    colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    description: 'Foundations of Technical Drawing: Lines, Angles, Bisection, Triangles, Polygons, Tangents, and Introductory Orthographic.'
  },
  SS2: {
    label: 'Senior Secondary 2 (SS2)',
    badge: 'SS2 Intermediate',
    colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: 'Tangency & Belt Drives, Inscribed Circles, Plain/Diagonal Scales, Conics (Ellipse, Parabola), Loci of Linkages, and Auxiliary Views.'
  },
  SS3: {
    label: 'Senior Secondary 3 (SS3)',
    badge: 'SS3 Advanced / WAEC',
    colorClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    description: '1st & 3rd Angle Orthographic, Isometric & Oblique, Building Plans & Roof Trusses, Surface Developments, Interpenetration, and CAD.'
  },
  HIGHER_INSTITUTION: {
    label: 'Higher Institution (Polytechnic & University)',
    badge: 'Higher Institution Eng CAD',
    colorClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: 'Advanced Engineering Graphics: Kinematic Cam Profiles, Interpenetration of Solids, Screw Threads, Machine & Architectural Detailing.'
  }
};

export function getTopicsByTier(tier: CurriculumTier): DrawingTopic[] {
  return allCurriculumTopics.filter(topic => topic.tier === tier);
}

export function getTopicsByTierAndTerm(tier: CurriculumTier, term?: CurriculumTerm): DrawingTopic[] {
  const topics = getTopicsByTier(tier);
  if (!term) return topics;
  return topics.filter(topic => topic.term === term);
}

export function getTopicById(id: string): DrawingTopic | undefined {
  return allCurriculumTopics.find(topic => topic.id === id) || allCurriculumTopics[0];
}

// ---------------------------------------------------------------------------
// ISO Technical Drawing Standards & Diagram Specifications
// ---------------------------------------------------------------------------

export type IsoProjectionMethod = 
  | 'FIRST_ANGLE' 
  | 'THIRD_ANGLE' 
  | 'ISOMETRIC' 
  | 'OBLIQUE' 
  | 'AXONOMETRIC' 
  | 'GEOMETRIC_CONSTRUCTION';

export interface IsoDimension {
  label: string;
  value: string;
  nominalMm?: number;
  tolerance?: string;
  type?: 'linear' | 'diameter' | 'radius' | 'angle';
}

export interface IsoDiagramData {
  id: string;
  topicId: string;
  title: string;
  moduleCode: string;
  tier: CurriculumTier;
  standard: string;          // e.g. "ISO 128-20:2001 / ISO 5456-2:1996"
  standardTitle: string;     // e.g. "Technical drawings — Projection methods — Orthographic representations"
  projectionMethod: IsoProjectionMethod;
  scale: string;             // e.g. "1:1", "1:2", "2:1"
  tolerance: string;         // e.g. "ISO 2768-m (±0.2mm)"
  material?: string;
  sheetFormat: 'A4' | 'A3' | 'A2';
  overview: string;
  isoGuidelines: string[];
  dimensions: IsoDimension[];
  elements: ConstructionElement[];
  viewBox: { width: number; height: number };
  waecExamRelevance: string;
  mathematicalProof?: string;
  keyPrinciples?: string[];
}

export const ISO_STANDARDS_REFERENCE = [
  {
    code: 'ISO 128-20:2001',
    title: 'General Principles of Presentation — Basic Conventions for Lines',
    description: 'Defines line types (Type A continuous thick 0.5-0.7mm, Type B continuous thin 0.25mm, Type E dashed thin, Type G chain thin) and pencil grades (HB, 2H, 4H).',
    relevance: 'Mandatory across all WAEC and NERDC technical drafting examinations.'
  },
  {
    code: 'ISO 5456-2:1996',
    title: 'Technical Drawings — Projection Methods — Part 2: Orthographic Representations',
    description: 'Establishes the international convention for First Angle (European/African WAEC standard) and Third Angle (North American) orthographic projection.',
    relevance: 'Tested annually in WAEC Paper 2 Section A (Compulsory Mechanical / Building drawing).'
  },
  {
    code: 'ISO 5456-3:1996',
    title: 'Technical Drawings — Projection Methods — Part 3: Axonometric & Isometric Representations',
    description: 'Specifies 30° isometric projection axes, foreshortening factors, and four-center ellipse construction rules for circular features in pictorial views.',
    relevance: 'Primary method for converting 2D orthographic multi-views into 3D isometric pictorials.'
  },
  {
    code: 'ISO 129-1:2018',
    title: 'Technical Product Documentation — Presentation of Dimensions and Tolerances',
    description: 'Rules for dimension lines, extension lines, leaders, arrowhead geometry (3:1 length-to-width ratio), and numerical text placement.',
    relevance: 'Core standard for engineering tolerance verification and architectural dimensioning.'
  },
  {
    code: 'ISO 5455:1979',
    title: 'Technical Drawings — Scales',
    description: 'Standard enlargement (50:1, 20:1, 10:1, 5:1, 2:1) and reduction (1:2, 1:5, 1:10, 1:20, 1:50, 1:100) scales and plain/diagonal scale construction.',
    relevance: 'Fundamental to civil building drawings and machine component detailing.'
  },
  {
    code: 'ISO 3098-2:2000',
    title: 'Technical Product Documentation — Lettering — Part 2: Latin Alphabet',
    description: 'Type B vertical and inclined (75°) standard lettering heights (2.5mm, 3.5mm, 5mm, 7mm) ensuring legibility on reduced copies and microfilms.',
    relevance: 'Enforced strictly on title blocks, dimension annotations, and sectional designations.'
  },
  {
    code: 'ISO 7200:2004',
    title: 'Technical Product Documentation — Data Fields in Title Blocks and Document Headers',
    description: 'Defines mandatory title block data fields: legal owner, identification number, date of issue, title, sheet number, projection symbol, and scale.',
    relevance: 'Official WAEC title block layout required on every examination sheet.'
  },
  {
    code: 'ISO 6410-1:1993',
    title: 'Technical Drawings — Screw Threads and Threaded Parts',
    description: 'Conventional representation of external and internal screw threads, root diameter thin lines, crest outlines, and fasteners in section.',
    relevance: 'Mechanical assembly drawing questions in WAEC & Higher Technical diplomas.'
  }
];

export const ISO_DIAGRAM_REGISTRY: Record<string, IsoDiagramData> = {
  'ss1-bisect-line': {
    id: 'iso-ss1-bisect',
    topicId: 'ss1-bisect-line',
    title: 'Perpendicular Bisection of a Straight Line',
    moduleCode: 'SS1-GEO-01',
    tier: 'SS1',
    standard: 'ISO 128-20:2001 / ISO 129-1',
    standardTitle: 'Geometric Construction Standards — Line Types & Tolerances',
    projectionMethod: 'GEOMETRIC_CONSTRUCTION',
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.2mm / ±0.1°)',
    sheetFormat: 'A4',
    overview: 'True perpendicular bisection of line AB using compass arcs of equal radius R > ½ AB striking from centres A and B to establish intersecting vertices C and D.',
    isoGuidelines: [
      'Line AB drawn in ISO 128 Type A Continuous Thick (0.50mm, HB pencil).',
      'Construction arcs intersecting at C and D drawn in ISO 128 Type B Continuous Thin (0.25mm, 2H pencil).',
      'Perpendicular bisector CD verified at 90.0° with midpoint AM = MB = 60.0mm.'
    ],
    dimensions: [
      { label: 'Line AB', value: '120.0mm', nominalMm: 120, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Segment AM = MB', value: '60.0mm', nominalMm: 60, tolerance: '±0.1mm', type: 'linear' },
      { label: 'Compass Radius R', value: '75.0mm (R > ½ AB)', nominalMm: 75, type: 'radius' },
      { label: 'Bisection Angle', value: '90.0°', nominalMm: 90, tolerance: '±0.05°', type: 'angle' }
    ],
    waecExamRelevance: 'Compulsory SS1 foundational construction. Appears in WAEC practical drafting Section A.',
    mathematicalProof: 'AM = MB = ½ AB; CD ⊥ AB, ∠AMC = ∠BMC = 90.0° (Euclidean theorem on chord bisectors)',
    keyPrinciples: [
      'Compass radius must strictly exceed half line length (R > 60mm).',
      'Midpoint M is located without measuring by ruler, preserving geometric purity.',
      'Intersection of arcs creates a perpendicular axis of symmetry.'
    ],
    viewBox: { width: 800, height: 550 },
    elements: [
      // Baseline AB
      { id: 'ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 300, x2: 600, y2: 300, isFinalResult: true },
      // Intersecting arcs from A (R=250)
      { id: 'arc-a1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 300, r: 250, startAngle: -45, endAngle: -20 },
      { id: 'arc-a2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 300, r: 250, startAngle: 20, endAngle: 45 },
      // Intersecting arcs from B (R=250)
      { id: 'arc-b1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 300, r: 250, startAngle: -160, endAngle: -135 },
      { id: 'arc-b2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 300, r: 250, startAngle: 135, endAngle: 160 },
      // Perpendicular Bisector CD
      { id: 'cd', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 110, x2: 400, y2: 490, isFinalResult: true },
      // Right-angle symbol at M
      { id: 'sq1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 275, x2: 425, y2: 275 },
      { id: 'sq2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 425, y1: 275, x2: 425, y2: 300 },
      // Key points
      { id: 'pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 300, label: 'A', labelPosition: 'bottom-left' },
      { id: 'pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 300, label: 'B', labelPosition: 'bottom-right' },
      { id: 'pt-m', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'M (Midpoint)', labelPosition: 'bottom-right' },
      { id: 'pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 150, label: 'C', labelPosition: 'top' },
      { id: 'pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 450, label: 'D', labelPosition: 'bottom' },
      // Dimension lines
      { id: 'dim-ab', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 200, y1: 370, x2: 600, y2: 370, dimensionText: 'AB = 120.0mm' },
      { id: 'dim-am', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 200, y1: 420, x2: 400, y2: 420, dimensionText: 'AM = 60.0mm' },
      { id: 'dim-mb', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 400, y1: 420, x2: 600, y2: 420, dimensionText: 'MB = 60.0mm' }
    ]
  },
  'ss1-divide-line': {
    id: 'iso-ss1-divide',
    topicId: 'ss1-divide-line',
    title: 'Proportional Division of a Straight Line into Equal Segments',
    moduleCode: 'SS1-GEO-02',
    tier: 'SS1',
    standard: 'ISO 128-20:2001 / ISO 5455',
    standardTitle: 'Geometric Construction — Auxiliary Projection Ray Theorem',
    projectionMethod: 'GEOMETRIC_CONSTRUCTION',
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.2mm)',
    sheetFormat: 'A4',
    overview: 'Division of line AB into 5 equal parts using an acute auxiliary ray inclined at θ ≈ 25° with equal divider steps projected parallel to 5-B onto AB.',
    isoGuidelines: [
      'Original line AB and divided segment endpoints marked in Type A thick line.',
      'Auxiliary ray AC and divider arcs drawn in Type B thin line (2H).',
      'Projection lines 1-1\', 2-2\', 3-3\', 4-4\', 5-B must be strictly parallel.'
    ],
    dimensions: [
      { label: 'Line AB', value: '135.0mm', nominalMm: 135, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Segments (5)', value: '27.0mm each', nominalMm: 27, tolerance: '±0.15mm', type: 'linear' },
      { label: 'Auxiliary Ray Angle', value: '25.0°', nominalMm: 25, type: 'angle' }
    ],
    waecExamRelevance: 'Essential for plain scale construction and graphical ratio divisions in WAEC.',
    mathematicalProof: 'Thales Intercept Theorem: Parallel projection preserves proportionality of segments.',
    viewBox: { width: 800, height: 500 },
    elements: [
      { id: 'd-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 150, y1: 340, x2: 650, y2: 340, isFinalResult: true },
      { id: 'd-ac', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 150, y1: 340, x2: 600, y2: 130 },
      // 5 divider marks on ray
      { id: 'd-p1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 240, cy: 298, label: '1', labelPosition: 'top-left' },
      { id: 'd-p2', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 330, cy: 256, label: '2', labelPosition: 'top-left' },
      { id: 'd-p3', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 420, cy: 214, label: '3', labelPosition: 'top-left' },
      { id: 'd-p4', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 510, cy: 172, label: '4', labelPosition: 'top-left' },
      { id: 'd-p5', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 600, cy: 130, label: '5', labelPosition: 'top-left' },
      // Parallel projections
      { id: 'd-proj-5', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 600, y1: 130, x2: 650, y2: 340 },
      { id: 'd-proj-4', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 510, y1: 172, x2: 550, y2: 340 },
      { id: 'd-proj-3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 420, y1: 214, x2: 450, y2: 340 },
      { id: 'd-proj-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 330, y1: 256, x2: 350, y2: 340 },
      { id: 'd-proj-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 240, y1: 298, x2: 250, y2: 340 },
      // Divided points on AB
      { id: 'd-div-1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 250, cy: 340, label: '1\'', labelPosition: 'bottom' },
      { id: 'd-div-2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 350, cy: 340, label: '2\'', labelPosition: 'bottom' },
      { id: 'd-div-3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 450, cy: 340, label: '3\'', labelPosition: 'bottom' },
      { id: 'd-div-4', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 550, cy: 340, label: '4\'', labelPosition: 'bottom' },
      { id: 'p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 340, label: 'A', labelPosition: 'bottom-left' },
      { id: 'p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 650, cy: 340, label: 'B', labelPosition: 'bottom-right' },
      { id: 'dim-tot', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 150, y1: 400, x2: 650, y2: 400, dimensionText: 'AB = 135.0mm (5 equal divisions @ 27.0mm)' }
    ]
  },
  'ss2-tangency-external': {
    id: 'iso-ss2-tangent',
    topicId: 'ss2-tangency-external',
    title: 'External Common Tangent to Two Unequal Circles (Open Belt Drive)',
    moduleCode: 'SS2-TAN-01',
    tier: 'SS2',
    standard: 'ISO 128-20:2001 / ISO 2203',
    standardTitle: 'Geometric Construction & Power Transmission Conventions',
    projectionMethod: 'GEOMETRIC_CONSTRUCTION',
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.15mm)',
    sheetFormat: 'A4',
    overview: 'Drawing a common external tangent to two circles of radii R1 = 50mm and R2 = 25mm with centers O1 and O2 separated by distance D = 140mm using the auxiliary difference circle (R1 - R2).',
    isoGuidelines: [
      'Normal radii O1-T1 and O2-T2 must be strictly perpendicular to common tangent T1-T2.',
      'Difference circle radius (R1 - R2 = 25mm) drawn in 2H construction line.',
      'Tangent point contact T1 and T2 must be clearly annotated and tangent line drawn in HB.'
    ],
    dimensions: [
      { label: 'Center Distance D', value: '140.0mm', nominalMm: 140, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Major Circle R1', value: '50.0mm', nominalMm: 50, tolerance: '±0.1mm', type: 'radius' },
      { label: 'Minor Circle R2', value: '25.0mm', nominalMm: 25, tolerance: '±0.1mm', type: 'radius' },
      { label: 'Auxiliary Circle R', value: '25.0mm (R1 - R2)', nominalMm: 25, type: 'radius' },
      { label: 'Tangent Angle', value: '90.0° to radii', nominalMm: 90, type: 'angle' }
    ],
    waecExamRelevance: 'Annual WAEC SS2 Practical exam topic (Open belt drive pulley profiles).',
    mathematicalProof: 'R_diff = R1 - R2; cos θ = (R1 - R2) / D; Tangent length L = sqrt(D² - (R1 - R2)²)',
    viewBox: { width: 850, height: 500 },
    elements: [
      // Center line
      { id: 'cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 150, y1: 260, x2: 700, y2: 260 },
      // Center points
      { id: 'o1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 300, cy: 260, label: 'O1 (R=50)', labelPosition: 'bottom' },
      { id: 'o2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 580, cy: 260, label: 'O2 (R=25)', labelPosition: 'bottom' },
      // Circles
      { id: 'c1', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 300, cy: 260, r: 100, isFinalResult: true },
      { id: 'c2', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 580, cy: 260, r: 50, isFinalResult: true },
      // Difference circle (R1 - R2 = 50)
      { id: 'c-diff', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 300, cy: 260, r: 50 },
      // Semi-circle on center distance
      { id: 'semi', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 440, cy: 260, r: 140, startAngle: 180, endAngle: 360 },
      // Normal radius O1-T1
      { id: 'rad-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 300, y1: 260, x2: 264, y2: 167 },
      // Normal radius O2-T2
      { id: 'rad-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 580, y1: 260, x2: 562, y2: 213 },
      // Common Tangent line T1-T2
      { id: 'tangent', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 230, y1: 158, x2: 660, y2: 270, isFinalResult: true },
      // Tangent points
      { id: 't1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 264, cy: 167, label: 'T1 (Contact Point)', labelPosition: 'top' },
      { id: 't2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 562, cy: 213, label: 'T2 (Contact Point)', labelPosition: 'top-right' },
      // Dimensions
      { id: 'dim-d', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 300, y1: 390, x2: 580, y2: 390, dimensionText: 'Center Distance D = 140.0mm' }
    ]
  },
  'ss3-ortho-first-angle': {
    id: 'iso-ss3-ortho-1st',
    topicId: 'ss3-ortho-first-angle',
    title: 'First Angle Orthographic Projection — Stepped Bracket',
    moduleCode: 'SS3-PROJ-01',
    tier: 'SS3',
    standard: 'ISO 5456-2:1996 / ISO 128-30',
    standardTitle: 'Technical Drawings — Projection Methods — Orthographic Representations',
    projectionMethod: 'FIRST_ANGLE',
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.2mm)',
    sheetFormat: 'A3',
    overview: 'First angle orthographic projection of an engineering stepped bracket displaying Front Elevation, Plan directly below the elevation, and End Elevation on the side opposite the viewing direction.',
    isoGuidelines: [
      'First Angle rule: The object lies between the observer and the plane of projection.',
      'Plan view is positioned strictly vertically below the Front Elevation.',
      'Hidden outlines rendered in ISO 128 Type E dashed thin line (0.25mm, 3mm dashes, 1mm gaps).',
      'Projection transfer lines drawn in continuous thin 2H/4H using 45° mitre line or arc transfer.'
    ],
    dimensions: [
      { label: 'Overall Length', value: '100.0mm', nominalMm: 100, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Overall Width', value: '60.0mm', nominalMm: 60, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Overall Height', value: '70.0mm', nominalMm: 70, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Step Height', value: '30.0mm', nominalMm: 30, tolerance: '±0.2mm', type: 'linear' },
      { label: 'Through Hole ∅', value: '25.0mm', nominalMm: 25, tolerance: '±0.1mm', type: 'diameter' }
    ],
    waecExamRelevance: 'Compulsory Section A question in WAEC Technical Drawing Paper 2 (Building & Mechanical options).',
    mathematicalProof: 'Multi-view orthographic correspondence: Front Width = Plan Width; Front Height = End Height; Plan Depth = End Width.',
    viewBox: { width: 900, height: 600 },
    elements: [
      // Mitre line (45°)
      { id: 'mitre', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 520, y1: 340, x2: 740, y2: 560 },
      // Reference folding planes XY and X1Y1
      { id: 'xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 80, y1: 340, x2: 820, y2: 340 },
      { id: 'x1y1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 520, y1: 60, x2: 520, y2: 560 },
      // FRONT ELEVATION (Top Left)
      { id: 'f-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 160, y1: 300, x2: 440, y2: 300, isFinalResult: true },
      { id: 'f-left', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 160, y1: 300, x2: 160, y2: 120, isFinalResult: true },
      { id: 'f-top', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 160, y1: 120, x2: 280, y2: 120, isFinalResult: true },
      { id: 'f-step-v', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 120, x2: 280, y2: 200, isFinalResult: true },
      { id: 'f-step-h', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 200, x2: 440, y2: 200, isFinalResult: true },
      { id: 'f-right', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 440, y1: 200, x2: 440, y2: 300, isFinalResult: true },
      // Hole centerline in Front Elevation
      { id: 'f-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 220, y1: 90, x2: 220, y2: 320 },
      // Hole hidden lines in Front
      { id: 'f-hd1', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: 195, y1: 120, x2: 195, y2: 300 },
      { id: 'f-hd2', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: 245, y1: 120, x2: 245, y2: 300 },
      // PLAN VIEW (Directly Below Front Elevation)
      { id: 'p-box', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 160, y: 380, width: 280, height: 160, isFinalResult: true },
      { id: 'p-div', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 380, x2: 280, y2: 540, isFinalResult: true },
      { id: 'p-hole', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 220, cy: 460, r: 25, isFinalResult: true },
      { id: 'p-cl1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 180, y1: 460, x2: 260, y2: 460 },
      { id: 'p-cl2', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 220, y1: 420, x2: 220, y2: 500 },
      // END ELEVATION (Right of Folding line)
      { id: 'e-box', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 300, x2: 740, y2: 300, isFinalResult: true },
      { id: 'e-left', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 300, x2: 580, y2: 120, isFinalResult: true },
      { id: 'e-top', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 120, x2: 740, y2: 120, isFinalResult: true },
      { id: 'e-right', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 740, y1: 120, x2: 740, y2: 300, isFinalResult: true },
      { id: 'e-step', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 200, x2: 740, y2: 200, isFinalResult: true },
      // Projection guide lines
      { id: 'pr-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 440, y1: 120, x2: 580, y2: 120 },
      { id: 'pr-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 440, y1: 200, x2: 580, y2: 200 },
      { id: 'pr-3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 440, y1: 300, x2: 580, y2: 300 },
      // Labels (ISO 3098 Type B)
      { id: 'lbl-front', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 300, cy: 95, label: 'FRONT ELEVATION', labelPosition: 'top' },
      { id: 'lbl-plan', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 300, cy: 570, label: 'PLAN VIEW (FIRST ANGLE)', labelPosition: 'bottom' },
      { id: 'lbl-end', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 660, cy: 95, label: 'END ELEVATION', labelPosition: 'top' }
    ]
  },
  'ss3-isometric-circles': {
    id: 'iso-ss3-iso-circles',
    topicId: 'ss3-isometric-circles',
    title: 'Isometric Projection & Four-Center Ellipse Method',
    moduleCode: 'SS3-PICT-01',
    tier: 'SS3',
    standard: 'ISO 5456-3:1996',
    standardTitle: 'Axonometric Representations — Isometric Drawing Rules',
    projectionMethod: 'ISOMETRIC',
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.2mm)',
    sheetFormat: 'A4',
    overview: 'Isometric representation of circular holes on the three principal isometric planes (Top, Left, Right) using the standard British/ISO four-centre ellipse approximation method.',
    isoGuidelines: [
      'Isometric axes inclined at 30° to horizontal baseline with vertical Z axis.',
      'Isometric rhombus drawn with sides equal to circle diameter D = 80mm.',
      'Arcs struck from obtuse angle vertices with radii R_major and R_minor.'
    ],
    dimensions: [
      { label: 'Circle Diameter ∅', value: '80.0mm', nominalMm: 80, tolerance: '±0.15mm', type: 'diameter' },
      { label: 'Axis Inclination', value: '30.0°', nominalMm: 30, tolerance: '±0.05°', type: 'angle' },
      { label: 'Rhombus Sides', value: '80.0mm', nominalMm: 80, type: 'linear' }
    ],
    waecExamRelevance: 'Primary method for converting 2D cylindrical components into pictorials in WAEC examinations.',
    viewBox: { width: 800, height: 550 },
    elements: [
      // 30 degree axes
      { id: 'axis-h', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 150, y1: 420, x2: 650, y2: 420 },
      { id: 'axis-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 80, x2: 400, y2: 480 },
      { id: 'axis-l', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 300, x2: 150, y2: 444 },
      { id: 'axis-r', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 300, x2: 650, y2: 444 },
      // Isometric Top Rhombus
      { id: 'rh-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 160, x2: 520, y2: 230 },
      { id: 'rh-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 520, y1: 230, x2: 400, y2: 300 },
      { id: 'rh-3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 300, x2: 280, y2: 230 },
      { id: 'rh-4', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 280, y1: 230, x2: 400, y2: 160 },
      // Four-center construction bisectors
      { id: 'fc-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 160, x2: 460, y2: 265 },
      { id: 'fc-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 160, x2: 340, y2: 265 },
      { id: 'fc-3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 460, y2: 195 },
      { id: 'fc-4', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 340, y2: 195 },
      // Finished Isometric Ellipse (Four Arcs)
      { id: 'el-1', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, r: 120, startAngle: 60, endAngle: 120, isFinalResult: true },
      { id: 'el-2', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, r: 120, startAngle: 240, endAngle: 300, isFinalResult: true },
      { id: 'el-3', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 340, cy: 230, r: 40, startAngle: 120, endAngle: 240, isFinalResult: true },
      { id: 'el-4', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 460, cy: 230, r: 40, startAngle: -60, endAngle: 60, isFinalResult: true },
      // Labels
      { id: 'lbl-top', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 400, cy: 125, label: 'ISOMETRIC CIRCLE (TOP FACE)', labelPosition: 'top' },
      { id: 'dim-dia', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 280, y1: 350, x2: 520, y2: 350, dimensionText: 'Diameter ∅ = 80.0mm' }
    ]
  },
  'ss3-building-floor-plan': {
    id: 'iso-ss3-arch-plan',
    topicId: 'ss3-building-floor-plan',
    title: 'Architectural Working Floor Plan & Wall Schedule',
    moduleCode: 'SS3-BLD-01',
    tier: 'SS3',
    standard: 'ISO 128 / ISO 4157 / NERDC Building',
    standardTitle: 'Construction Drawings — Designation of Rooms and Spaces',
    projectionMethod: 'FIRST_ANGLE',
    scale: '1:50',
    tolerance: 'NERDC Standard (±5mm on-site)',
    sheetFormat: 'A2',
    overview: 'Detailed residential architectural floor plan showing 225mm sandcrete blockwalls, room spaces (Living, Bed 1, Bed 2, Kitchen, Bath), door swing radii, and casement windows.',
    isoGuidelines: [
      'Load-bearing blockwalls drawn in Type A thick lines with double-line 225mm wall cavity.',
      'Door swings depicted as 90° arcs in Type B thin line.',
      'Dimensions given in millimeters: wall thickness, room clear spans, and opening centers.'
    ],
    dimensions: [
      { label: 'Overall Length', value: '11,250mm', nominalMm: 11250, type: 'linear' },
      { label: 'Overall Width', value: '8,400mm', nominalMm: 8400, type: 'linear' },
      { label: 'Wall Thickness', value: '225mm Blockwall', nominalMm: 225, type: 'linear' },
      { label: 'Internal Doors', value: '900mm × 2100mm', nominalMm: 900, type: 'linear' },
      { label: 'Windows', value: '1200mm × 1200mm', nominalMm: 1200, type: 'linear' }
    ],
    waecExamRelevance: 'Compulsory WAEC Building Drawing Paper 2 Section B (40% total examination marks).',
    viewBox: { width: 900, height: 650 },
    elements: [
      // Outer perimeter wall (225mm thick represented)
      { id: 'w-out', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 120, y: 80, width: 660, height: 480, isFinalResult: true },
      { id: 'w-in', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 140, y: 100, width: 620, height: 440, isFinalResult: true },
      // Internal partition walls
      { id: 'p-wall1', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 440, y: 100, width: 20, height: 260, isFinalResult: true },
      { id: 'p-wall2', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 140, y: 340, width: 320, height: 20, isFinalResult: true },
      { id: 'p-wall3', type: 'RECTANGLE', lineWeight: 'OUTLINE_HB', x: 440, y: 340, width: 320, height: 20, isFinalResult: true },
      // Room labels
      { id: 'lbl-living', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 280, cy: 220, label: 'LIVING ROOM (4200 × 4800)', labelPosition: 'center' },
      { id: 'lbl-bed1', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 600, cy: 220, label: 'MASTER BEDROOM (3600 × 4200)', labelPosition: 'center' },
      { id: 'lbl-bed2', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 280, cy: 450, label: 'BEDROOM 2 (3600 × 3300)', labelPosition: 'center' },
      { id: 'lbl-kitchen', type: 'TEXT_LABEL', lineWeight: 'OUTLINE_HB', cx: 600, cy: 450, label: 'KITCHEN / STORE (3000 × 3300)', labelPosition: 'center' },
      // Door swing arc
      { id: 'd-arc1', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 440, cy: 300, r: 60, startAngle: 180, endAngle: 270 },
      { id: 'd-leaf1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 440, y1: 300, x2: 440, y2: 240 },
      // Dimensions
      { id: 'dim-arch1', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 120, y1: 50, x2: 780, y2: 50, dimensionText: 'TOTAL SPAN = 11,250mm' },
      { id: 'dim-arch2', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 800, y1: 80, x2: 800, y2: 560, dimensionText: 'TOTAL WIDTH = 8,400mm' }
    ]
  }
};

/**
 * Retrieves the comprehensive ISO technical diagram for any curriculum topic.
 * Falls back to computing real procedural geometry from topic parameters if not pre-registered.
 */
export function getIsoDiagramForTopic(topicOrId: DrawingTopic | string): IsoDiagramData {
  const topicId = typeof topicOrId === 'string' ? topicOrId : topicOrId.id;
  
  // 1. Direct registry lookup
  if (ISO_DIAGRAM_REGISTRY[topicId]) {
    return ISO_DIAGRAM_REGISTRY[topicId];
  }

  // 2. Lookup topic entity
  const topic = typeof topicOrId === 'string' 
    ? (allCurriculumTopics.find(t => t.id === topicId) || allCurriculumTopics[0])
    : topicOrId;

  // 3. Procedurally build ISO diagram representation from topic's own generator
  const params = topic.parameters?.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {}) || {};
  let generatedElements: ConstructionElement[] = [];
  
  try {
    const steps = topic.generateSteps ? topic.generateSteps(params) : [];
    if (steps && steps.length > 0) {
      const finalStep = steps[steps.length - 1];
      generatedElements = finalStep.elements || steps.flatMap(s => s.elements);
    }
  } catch (e) {
    console.warn('Error generating ISO elements for topic:', topicId, e);
  }

  // Fallback elements if none generated
  if (!generatedElements || generatedElements.length === 0) {
    generatedElements = [
      { id: 'base-1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 150, y1: 300, x2: 650, y2: 300, isFinalResult: true },
      { id: 'cl-1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 100, x2: 400, y2: 500 },
      { id: 'pt-center', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'O (Origin)', labelPosition: 'bottom' }
    ];
  }

  // Determine projection method from topic characteristics
  let projMethod: IsoProjectionMethod = 'GEOMETRIC_CONSTRUCTION';
  if (topic.id.includes('third-angle') || topic.title.toLowerCase().includes('third angle')) {
    projMethod = 'THIRD_ANGLE';
  } else if (topic.id.includes('first-angle') || topic.id.includes('ortho') || topic.title.toLowerCase().includes('orthographic')) {
    projMethod = 'FIRST_ANGLE';
  } else if (topic.id.includes('isometric') || topic.title.toLowerCase().includes('isometric')) {
    projMethod = 'ISOMETRIC';
  } else if (topic.id.includes('oblique') || topic.title.toLowerCase().includes('oblique')) {
    projMethod = 'OBLIQUE';
  }

  return {
    id: `iso-${topic.id}`,
    topicId: topic.id,
    title: topic.title,
    moduleCode: topic.moduleCode,
    tier: topic.tier,
    standard: topic.standards?.isoRef || 'ISO 128-20:2001 / ISO 5456',
    standardTitle: `${topic.title} — International Technical Drawing Standard Specification`,
    projectionMethod: projMethod,
    scale: '1:1',
    tolerance: 'ISO 2768-m (±0.2mm)',
    sheetFormat: 'A4',
    overview: topic.shortDescription || topic.theory?.overview || 'Standard geometric and technical engineering plate conforming to ISO 128 line conventions.',
    isoGuidelines: [
      'Visible outlines rendered in ISO 128 Type A continuous thick line (0.50-0.70mm).',
      'Construction arcs and projection guides in ISO 128 Type B continuous thin line (0.25mm).',
      'Center lines rendered in ISO 128 Type G chain thin line (long-short dashes).',
      `Full conformity with ${topic.standards?.waecRef || 'WAEC Technical Drawing Syllabus'} and NERDC standards.`
    ],
    dimensions: topic.parameters?.map(p => ({
      label: p.label,
      value: `${p.defaultValue}${p.unit}`,
      nominalMm: p.defaultValue,
      tolerance: '±0.2mm',
      type: 'linear'
    })) || [
      { label: 'Nominal Scale', value: '1:1', tolerance: 'Exact' },
      { label: 'Tolerance Grade', value: 'ISO 2768-m', tolerance: '±0.2mm' }
    ],
    elements: generatedElements,
    viewBox: { 
      width: topic.defaultViewBox?.width || 800, 
      height: topic.defaultViewBox?.height || 550 
    },
    waecExamRelevance: `${topic.standards?.waecRef || 'WAEC Section A'} practical examination requirement.`,
    mathematicalProof: topic.theory?.formulas?.[0]?.description || 'Euclidean geometric proof verified by parametric compass loci.',
    keyPrinciples: topic.theory?.keyPrinciples?.map(p => p.title) || [
      'Maintain correct line weight hierarchy across all elements.',
      'Ensure clear distinction between construction arcs and final HB outlines.'
    ]
  };
}

export function getAllIsoDiagrams(): IsoDiagramData[] {
  return allCurriculumTopics.map(topic => getIsoDiagramForTopic(topic));
}

export function getIsoDiagramsByTier(tier: CurriculumTier): IsoDiagramData[] {
  return allCurriculumTopics
    .filter(topic => topic.tier === tier)
    .map(topic => getIsoDiagramForTopic(topic));
}
