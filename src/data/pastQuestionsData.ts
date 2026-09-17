// Drafthands Past Questions & Structured Datasets (2016-2026)
// Compliant with WAEC (WASSCE), NECO, and NABTEB Technical Drawing Syllabi & ISO 128 Standards

import { MCQuestion, TheoryQuestion, PastPaperItem, ExamBody, PaperType } from '../types/pastQuestions';

// ============================================================================
// 1. WAEC PAPER 1 (OBJECTIVES / MCQS)
// Covering Scale Reading, Projection Symbols, Ellipse Methods, Section Hatching
// ============================================================================

export const WAEC_PAPER_1_MCQS: MCQuestion[] = [
  {
    id: 'waec-mcq-scale-1',
    questionNumber: 1,
    questionText: 'A drawing scale is marked as 1:50. What actual on-site distance is represented by a dimension of 42 mm measured on the floor plan drawing?',
    options: [
      { key: 'A', text: '2,100 mm (2.1 meters)' },
      { key: 'B', text: '840 mm (0.84 meters)' },
      { key: 'C', text: '4,200 mm (4.2 meters)' },
      { key: 'D', text: '210 mm (0.21 meters)' }
    ],
    correctKey: 'A',
    explanation: 'Scale ratio = Drawing Length : Real Length = 1 : 50. Therefore, Real Distance = 42 mm × 50 = 2,100 mm = 2.10 meters according to ISO 5455 (Scales for Technical Drawings).',
    isoStandardRef: 'ISO 5455: Scales for Technical Drawings & WAEC Section A Syllabus',
    topicCategory: 'Scale Reading & Dimensioning',
    isFreePreview: true
  },
  {
    id: 'waec-mcq-scale-2',
    questionNumber: 2,
    questionText: 'Which type of drafting scale is specifically constructed to read three consecutive units of measurement or to read dimensions accurate to two decimal places (e.g., meters, decimeters, and centimeters)?',
    options: [
      { key: 'A', text: 'Plain Scale' },
      { key: 'B', text: 'Diagonal Scale' },
      { key: 'C', text: 'Scale of Chords' },
      { key: 'D', text: 'Comparative Scale' }
    ],
    correctKey: 'B',
    explanation: 'A Diagonal Scale utilizes the geometric principle of similar triangles across perpendicular verticals to divide small units into tenths, enabling readings in three units (e.g. m, dm, cm) or two decimal places.',
    isoStandardRef: 'ISO 5455 & BS 8888 Plane and Solid Geometry',
    topicCategory: 'Scale Reading & Dimensioning',
    isFreePreview: true
  },
  {
    id: 'waec-mcq-projection-1',
    questionNumber: 3,
    questionText: 'The official ISO standard symbol for First-Angle Orthographic Projection consists of a truncated right circular cone placed relative to its two projection views such that:',
    options: [
      { key: 'A', text: 'The concentric circle end view is located to the right of the trapezoidal elevation, with the small circle visible.' },
      { key: 'B', text: 'The concentric circle end view is located on the right of the trapezoidal elevation, showing what is viewed from the left (opposite side).' },
      { key: 'C', text: 'The concentric circle end view is placed on the left side of the elevation, representing direct view without flipping.' },
      { key: 'D', text: 'Two overlapping squares with an included 45° diagonal axis.' }
    ],
    correctKey: 'B',
    explanation: 'Under ISO 5456-2, in First-Angle Projection the viewer looks from the left and projects the view onto the plane on the RIGHT of the front elevation (frustum trapezoid). In Third-Angle, the concentric circles view is placed on the LEFT (same side as the observer).',
    isoStandardRef: 'ISO 5456-2: Orthographic Projection Symbols',
    topicCategory: 'Projection Symbols & Conventions',
    isFreePreview: false
  },
  {
    id: 'waec-mcq-projection-2',
    questionNumber: 4,
    questionText: 'In First-Angle Orthographic Projection, if a draftsman observes an engineering workpiece from above (bird\'s-eye view), where MUST the Plan view be drawn?',
    options: [
      { key: 'A', text: 'Directly above the Front Elevation' },
      { key: 'B', text: 'Directly below the Front Elevation' },
      { key: 'C', text: 'Aligned horizontally to the right of the End Elevation' },
      { key: 'D', text: 'In any quadrant provided it is labeled' }
    ],
    correctKey: 'B',
    explanation: 'In First Angle Projection, the object lies in the First Quadrant between the observer and the horizontal projection plane. Looking from the top projects the Plan onto the horizontal plane BELOW the Front Elevation.',
    isoStandardRef: 'ISO 5456-2 / BS 8888: First Angle Layout',
    topicCategory: 'Projection Symbols & Conventions',
    isFreePreview: false
  },
  {
    id: 'waec-mcq-ellipse-1',
    questionNumber: 5,
    questionText: 'In the Concentric Circles method of constructing an ellipse, what geometric operations are performed from the 12 radial generator divisions?',
    options: [
      { key: 'A', text: 'Project horizontal lines from major circle and vertical lines from minor circle' },
      { key: 'B', text: 'Project vertical lines from major circle and horizontal lines from minor circle toward each other' },
      { key: 'C', text: 'Swing tangent arcs equal to half the minor axis from the perimeter' },
      { key: 'D', text: 'Bisect radial chords using a 45° set-square' }
    ],
    correctKey: 'B',
    explanation: 'In the Concentric Circles method (parametric coordinates x = a cos θ, y = b sin θ), vertical ordinates are projected from the major auxiliary circle (radius a) and horizontal ordinates from the minor circle (radius b); their intersection defines points on the ellipse perimeter.',
    isoStandardRef: 'WAEC Geometric Drawing Syllabus Section B (Conic Sections)',
    topicCategory: 'Ellipse Construction Methods',
    isFreePreview: false
  },
  {
    id: 'waec-mcq-ellipse-2',
    questionNumber: 6,
    questionText: 'For an ellipse with major axis 2a and minor axis 2b, how are the two focal points (F1 and F2) located geometrically using compasses?',
    options: [
      { key: 'A', text: 'Center at major axis endpoint and swing radius b' },
      { key: 'B', text: 'Center at an endpoint of the minor axis and swing radius equal to the semi-major axis (a) to intersect the major axis' },
      { key: 'C', text: 'Center at datum origin O and swing radius (a - b)' },
      { key: 'D', text: 'Bisect the distance between major and minor circle perimeters' }
    ],
    correctKey: 'B',
    explanation: 'In any ellipse, the distance from any point on the curve to the foci sums to 2a (PF1 + PF2 = 2a). At the minor axis vertex C, CF1 = CF2 = a. Therefore, swinging radius equal to the semi-major axis (a) from C cuts the major axis at focal points F1 and F2.',
    isoStandardRef: 'Conic Section Loci & WAEC Practical Marking Key',
    topicCategory: 'Ellipse Construction Methods',
    isFreePreview: false
  },
  {
    id: 'waec-mcq-hatch-1',
    questionNumber: 7,
    questionText: 'According to ISO 128-40 and BS 8888, section hatching lines representing cut solid material must be drawn with which pencil grade, line style, and orientation?',
    options: [
      { key: 'A', text: 'Continuous thick (HB, 0.50mm) lines inclined at 90° to the datum' },
      { key: 'B', text: 'Continuous thin (2H/3H, 0.25mm) lines inclined at 45° to the principal axes, uniformly spaced 1.5 mm to 3 mm apart' },
      { key: 'C', text: 'Dashed thin lines inclined at 30° with variable pitch' },
      { key: 'D', text: 'Double chain lines with thickened endpoints' }
    ],
    correctKey: 'B',
    explanation: 'ISO 128-40 mandates that section hatching must be continuous thin lines (ISO Type B / 0.25 mm, drawn with 2H or 3H pencil) at a preferred inclination of 45° to the main outline or centerline, spaced uniformly (typically 1.5–3 mm).',
    isoStandardRef: 'ISO 128-40: Principles of Sectioning & BS 8888',
    topicCategory: 'Section Hatching Rules & Standards',
    isFreePreview: false
  },
  {
    id: 'waec-mcq-hatch-2',
    questionNumber: 8,
    questionText: 'When a cutting plane passes longitudinally along the axis of an assembled machine part, which of the following standard components must NOT be hatched/sectioned?',
    options: [
      { key: 'A', text: 'Cast iron bracket body and cylinder crankcase' },
      { key: 'B', text: 'Solid shafts, bolts, nuts, washers, cotters, keys, and rivets' },
      { key: 'C', text: 'Bearing housing covers and gland sleeves' },
      { key: 'D', text: 'Stepped pipe flanges and manifold junctions' }
    ],
    correctKey: 'B',
    explanation: 'Under ISO 128-40 and WAEC technical marking keys, solid cylindrical/standard fasteners cut longitudinally (shafts, bolts, nuts, pins, rivets, keys, ball bearings, and thin web stiffeners) are left unsectioned to preserve component clarity and prevent drawing distortion.',
    isoStandardRef: 'ISO 128-40: Unsectioned Items in Assembly Drawings',
    topicCategory: 'Section Hatching Rules & Standards',
    isFreePreview: false
  }
];

export const NECO_PAPER_1_MCQS: MCQuestion[] = [
  {
    id: 'neco-mcq-1',
    questionNumber: 1,
    questionText: 'In standard Isometric projection, what is the inclination angle between each pair of the three principal coordinate axes (X, Y, Z)?',
    options: [
      { key: 'A', text: '90° each' },
      { key: 'B', text: '120° each (two 30° receding axes and one vertical axis)' },
      { key: 'C', text: '45° each' },
      { key: 'D', text: '135° each' }
    ],
    correctKey: 'B',
    explanation: 'Isometric means "equal measure". The three axes are mutually separated by 120°, meaning the two receding ground axes are inclined at 30° to the horizontal baseline.',
    isoStandardRef: 'ISO 5456-3: Axonometric Projections',
    topicCategory: 'Pictorial & Isometric Projection',
    isFreePreview: true
  },
  {
    id: 'neco-mcq-2',
    questionNumber: 2,
    questionText: 'What is the true ratio of isometric length to true natural scale length when drawing an accurate isometric projection rather than an isometric drawing?',
    options: [
      { key: 'A', text: '1 : 1' },
      { key: 'B', text: '√(2/3) ≈ 0.816 (approx 82%)' },
      { key: 'C', text: 'cos(30°) ≈ 0.866' },
      { key: 'D', text: 'tan(45°) = 1.000' }
    ],
    correctKey: 'B',
    explanation: 'Due to rotation into isometric orientation, all lines are foreshortened by factor cos(45°)/cos(30°) = √(2/3) ≈ 0.8165.',
    isoStandardRef: 'ISO 5456-3 & NERDC Curriculum Specifications',
    topicCategory: 'Isometric Scale Derivation',
    isFreePreview: true
  }
];

export const NABTEB_PAPER_1_MCQS: MCQuestion[] = [
  {
    id: 'nabteb-mcq-1',
    questionNumber: 1,
    questionText: 'Which screw thread profile has an included angle of 60°, flat crest, and rounded root according to ISO General Purpose Metric Standards?',
    options: [
      { key: 'A', text: 'British Standard Whitworth (55°)' },
      { key: 'B', text: 'ISO Metric Thread (60°)' },
      { key: 'C', text: 'Acme Thread (29°)' },
      { key: 'D', text: 'Square Thread (90°)' }
    ],
    correctKey: 'B',
    explanation: 'ISO metric threads (M-series) have an equilateral triangular form with a 60° included flank angle, truncated flat crests, and rounded root radii.',
    isoStandardRef: 'ISO 68-1 & NABTEB Mechanical Engineering Syllabus',
    topicCategory: 'Fasteners & Thread Geometry',
    isFreePreview: true
  },
  {
    id: 'nabteb-mcq-2',
    questionNumber: 2,
    questionText: 'When dividing a line of length 85 mm into 5 equal parts geometrically without arithmetic division, what geometric principle is used?',
    options: [
      { key: 'A', text: 'Intercept theorem on transversal lines intersecting parallel rays' },
      { key: 'B', text: 'Pythagoras theorem on right-angled triangles' },
      { key: 'C', text: 'Tangent-secant circle theorem' },
      { key: 'D', text: 'Angle bisection of obtuse vertices' }
    ],
    correctKey: 'A',
    explanation: 'An auxiliary line is drawn at an acute angle (e.g. 30°), 5 equal divisions are stepped with compasses, and parallel projection lines are drawn to the original segment AB.',
    isoStandardRef: 'Plane Geometry Principles & WAEC/NABTEB TD Syllabus',
    topicCategory: 'Plane Geometry Construction',
    isFreePreview: true
  }
];

// ============================================================================
// 2. WAEC PAPER 2 & PAPER 3: THEORY & PRACTICAL CONSTRUCTION DATASETS
// ============================================================================

// ----------------------------------------------------------------------------
// Question 1: Parabola Construction (Rectangle / Parallelogram Method)
// ----------------------------------------------------------------------------
export const PARABOLA_THEORY_QUESTION: TheoryQuestion = {
  id: 'waec-theory-parabola',
  questionNumber: 1,
  title: 'WAEC WASSCE: Construction of a Parabola (Rectangle Method, Span 120 mm, Rise 80 mm)',
  description: 'Construct a true parabola having a span (base) of 120 mm and a rise (altitude) of 80 mm using the Rectangle / Parallelogram Method. Label the vertex V, axis of symmetry VO, and show all construction lines clearly.',
  category: 'GEOMETRIC',
  totalMarks: 20,
  givenData: [
    'Span (Base Width AB) = 120 mm (Semi-span AO = OB = 60 mm)',
    'Rise (Altitude VO) = 80 mm',
    'Method: Rectangle / Parallelogram Method with 4 equal subdivisions per half',
    'Pencil Grades: 3H for bounding grid and rays (0.20mm); HB for finished parabola locus curve (0.50mm)',
    'Mark Breakdown: Bounding rectangle & axis VO (4 mks), Base & side equal divisions (4 mks), Corresponding ray intersection points (6 mks), Smooth symmetric curve & linework (6 mks)'
  ],
  markingSchemeNotes: [
    'Base AB = 120 mm must be horizontal and bisected at midpoint O to erect perpendicular vertical centerline VO = 80 mm.',
    'Construct bounding rectangle ABCD of dimensions 120 mm × 80 mm.',
    'Divide each half-base (AO and OB) into 4 equal spaces (15 mm each), numbered 1, 2, 3.',
    'Divide vertical sides AD and BC into the same number of equal parts (4 spaces of 20 mm each), numbered 1\', 2\', 3\'.',
    'From base points 1, 2, 3, draw vertical lines parallel to axis VO.',
    'From vertex V, draw radiating lines to side division points 1\', 2\', 3\'.',
    'The intersection of vertical 1 with ray V-1\', vertical 2 with ray V-2\', and vertical 3 with ray V-3\' defines points on the parabola.',
    'Join plotted points with French Curve using continuous thick line (HB pencil).'
  ],
  isFreePreview: true,
  steps: [
    {
      stepNumber: 1,
      title: 'Draw Bounding Rectangle ABCD & Centerline VO',
      label: 'Draw Bounding Rectangle ABCD & Centerline VO',
      instruction: 'Using T-square and set-square with 3H pencil, draw base line AB = 120 mm. Bisect at midpoint O, erect perpendicular axis VO = 80 mm, and complete rectangle ABCD of 120 mm width × 80 mm height.',
      pencilGrade: '3H (Continuous Thin 0.25mm)',
      lineTypeISO: 'ISO 128 Type B & Type G Centerline',
      compassSetting: 'T-Square & Set Square alignment',
      markAllocation: '4 Marks',
      svgData: `
        <rect x="70" y="80" width="360" height="240" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4" />
        <line x1="250" y1="60" x2="250" y2="340" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="14 3 3 3" />
        <line x1="70" y1="320" x2="430" y2="320" stroke="#94a3b8" stroke-width="2" />
        <circle cx="250" cy="80" r="4" fill="#38bdf8" />
        <circle cx="250" cy="320" r="3.5" fill="#38bdf8" />
        <text x="50" y="325" fill="#38bdf8" font-size="12" font-weight="bold">A</text>
        <text x="438" y="325" fill="#38bdf8" font-size="12" font-weight="bold">B</text>
        <text x="50" y="85" fill="#94a3b8" font-size="12">D</text>
        <text x="438" y="85" fill="#94a3b8" font-size="12">C</text>
        <text x="256" y="78" fill="#38bdf8" font-size="13" font-weight="bold">V (Vertex)</text>
        <text x="256" y="338" fill="#94a3b8" font-size="11" font-family="monospace">O (Midpoint)</text>
        <text x="220" y="35" fill="#94a3b8" font-size="10" font-family="monospace">Span: 120mm | Rise: 80mm</text>
      `
    },
    {
      stepNumber: 2,
      title: 'Divide Half-Bases and Vertical Sides into 4 Equal Parts',
      label: 'Divide Half-Bases and Vertical Sides into 4 Equal Parts',
      instruction: 'Divide left half-base AO and right half-base OB into 4 equal divisions (points 1, 2, 3). Divide vertical side AD and side BC into the same number of equal divisions (points 1\', 2\', 3\').',
      pencilGrade: '3H (Construction Thin 0.20mm)',
      lineTypeISO: 'ISO 128 Type B (Thin)',
      compassSetting: 'Dividers set to 45px (15mm) and 60px (20mm)',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Base Division Points -->
        <circle cx="115" cy="320" r="3" fill="#f59e0b" /><text x="111" y="338" fill="#f59e0b" font-size="10">1</text>
        <circle cx="160" cy="320" r="3" fill="#f59e0b" /><text x="156" y="338" fill="#f59e0b" font-size="10">2</text>
        <circle cx="205" cy="320" r="3" fill="#f59e0b" /><text x="201" y="338" fill="#f59e0b" font-size="10">3</text>
        <circle cx="295" cy="320" r="3" fill="#f59e0b" /><text x="291" y="338" fill="#f59e0b" font-size="10">3</text>
        <circle cx="340" cy="320" r="3" fill="#f59e0b" /><text x="336" y="338" fill="#f59e0b" font-size="10">2</text>
        <circle cx="385" cy="320" r="3" fill="#f59e0b" /><text x="381" y="338" fill="#f59e0b" font-size="10">1</text>

        <!-- Vertical Side Division Points (AD & BC) -->
        <circle cx="70" cy="260" r="3" fill="#f59e0b" /><text x="52" y="264" fill="#f59e0b" font-size="10">1'</text>
        <circle cx="70" cy="200" r="3" fill="#f59e0b" /><text x="52" y="204" fill="#f59e0b" font-size="10">2'</text>
        <circle cx="70" cy="140" r="3" fill="#f59e0b" /><text x="52" y="144" fill="#f59e0b" font-size="10">3'</text>
        <circle cx="430" cy="260" r="3" fill="#f59e0b" /><text x="436" y="264" fill="#f59e0b" font-size="10">1'</text>
        <circle cx="430" cy="200" r="3" fill="#f59e0b" /><text x="436" y="204" fill="#f59e0b" font-size="10">2'</text>
        <circle cx="430" cy="140" r="3" fill="#f59e0b" /><text x="436" y="144" fill="#f59e0b" font-size="10">3'</text>
      `
    },
    {
      stepNumber: 3,
      title: 'Project Vertical Parallel Rays & Radiate Rays from Vertex V',
      label: 'Project Vertical Parallel Rays & Radiate Rays from Vertex V',
      instruction: 'From base divisions 1, 2, 3, draw vertical lines parallel to axis VO toward the top edge. From vertex V, draw radiating inclined rays connecting to side divisions 1\', 2\', 3\' on both sides.',
      pencilGrade: '3H / 4H (Construction Thin 0.20mm)',
      lineTypeISO: 'ISO 128 Type B',
      compassSetting: 'Set-square sliding on T-square',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Vertical parallel lines from base -->
        <line x1="115" y1="320" x2="115" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="160" y1="320" x2="160" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="205" y1="320" x2="205" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="295" y1="320" x2="295" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="340" y1="320" x2="340" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="385" y1="320" x2="385" y2="80" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />

        <!-- Rays radiating from Vertex V -->
        <line x1="250" y1="80" x2="70" y2="260" stroke="#a78bfa" stroke-width="1" />
        <line x1="250" y1="80" x2="70" y2="200" stroke="#a78bfa" stroke-width="1" />
        <line x1="250" y1="80" x2="70" y2="140" stroke="#a78bfa" stroke-width="1" />
        <line x1="250" y1="80" x2="430" y2="260" stroke="#a78bfa" stroke-width="1" />
        <line x1="250" y1="80" x2="430" y2="200" stroke="#a78bfa" stroke-width="1" />
        <line x1="250" y1="80" x2="430" y2="140" stroke="#a78bfa" stroke-width="1" />
      `
    },
    {
      stepNumber: 4,
      title: 'Plot Locus Intersection Points on the Parabola',
      label: 'Plot Locus Intersection Points on the Parabola',
      instruction: 'Mark the intersection of vertical line 1 with ray V-1\', vertical line 2 with ray V-2\', and vertical line 3 with ray V-3\' on both left and right sides. Highlight each intersection point clearly.',
      pencilGrade: '2H (Plotting Points 0.25mm)',
      lineTypeISO: 'ISO 128 Type B (Point Markers)',
      compassSetting: 'Lead point alignment',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Intersection Locus Points -->
        <!-- Left half: (x, y) = (115, 275), (160, 215), (205, 140) -->
        <circle cx="115" cy="275" r="4" fill="#10b981" />
        <text x="122" y="278" fill="#10b981" font-size="9" font-family="monospace">P1</text>
        <circle cx="160" cy="215" r="4" fill="#10b981" />
        <text x="167" y="218" fill="#10b981" font-size="9" font-family="monospace">P2</text>
        <circle cx="205" cy="140" r="4" fill="#10b981" />
        <text x="212" y="143" fill="#10b981" font-size="9" font-family="monospace">P3</text>

        <!-- Right half: (295, 140), (340, 215), (385, 275) -->
        <circle cx="295" cy="140" r="4" fill="#10b981" />
        <text x="277" y="143" fill="#10b981" font-size="9" font-family="monospace">P3'</text>
        <circle cx="340" cy="215" r="4" fill="#10b981" />
        <text x="347" y="218" fill="#10b981" font-size="9" font-family="monospace">P2'</text>
        <circle cx="385" cy="275" r="4" fill="#10b981" />
        <text x="392" y="278" fill="#10b981" font-size="9" font-family="monospace">P1'</text>
      `
    },
    {
      stepNumber: 5,
      title: 'Draw Finished Continuous Thick Parabola Outline',
      label: 'Draw Finished Continuous Thick Parabola Outline',
      instruction: 'Using a French Curve or spline, draw a clean, symmetrical continuous thick line (HB pencil, 0.50mm) starting at base vertex A, passing smoothly through P1, P2, P3, reaching vertex V, and descending through P3\', P2\', P1\' to endpoint B.',
      pencilGrade: 'HB / H (Continuous Thick 0.50mm)',
      lineTypeISO: 'ISO 128 Type A (Finished Outline)',
      compassSetting: 'French Curve positioning',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Finished Parabola Outline -->
        <path d="M 70,320 Q 250,-20 430,320" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
        <!-- Base line AB -->
        <line x1="70" y1="320" x2="430" y2="320" stroke="#38bdf8" stroke-width="2.5" />
        <text x="210" y="230" fill="#38bdf8" font-size="12" font-weight="bold">PARABOLA</text>
        <text x="215" y="246" fill="#94a3b8" font-size="9" font-family="monospace">e = 1.0 (Unity)</text>
      `
    }
  ]
};

// ----------------------------------------------------------------------------
// Question 2: Converting Isometric Bracket into First-Angle Orthographic Views
// ----------------------------------------------------------------------------
export const ORTHOGRAPHIC_BRACKET_QUESTION: TheoryQuestion = {
  id: 'waec-theory-orthographic-bracket',
  questionNumber: 2,
  title: 'WAEC WASSCE: First-Angle Orthographic Projection of Stepped Bracket with Hole & Rib',
  description: 'An isometric drawing of a cast steel bearing bracket is given. Draw in First-Angle Orthographic Projection: (a) Front Elevation looking in direction of arrow F; (b) Plan view directly below Front Elevation; (c) End View looking from the left, projected to the right. Include hidden details, centerlines, and the ISO First-Angle symbol.',
  category: 'ORTHOGRAPHIC',
  totalMarks: 25,
  givenData: [
    'Overall Base: 100 mm long × 50 mm wide × 15 mm thick',
    'Vertical Upright: 50 mm wide × 60 mm high × 15 mm thick',
    'Triangular Stiffener Web (Rib): 12 mm thick connecting upright to base',
    'Hole: Ø20 mm drilled through upright, centered 35 mm above base',
    'Projection Standard: First-Angle Projection (ISO 5456-2)',
    'Scale: 1:1 Full Size'
  ],
  markingSchemeNotes: [
    'Correct relative positioning of the 3 views: Front Elevation (Top-Left), Plan (Directly Below Front Elevation), End View (To the Right of Front Elevation).',
    'Use 45° miter line or compass arcs from datum intersection to project depth from Plan to End View.',
    'Cylindrical hole must be shown with chain thin centerline (Type G) and dashed hidden lines (Type F) in elevation and end views.',
    'Stiffener web must be represented accurately without hatching in unsectioned exterior views.',
    'Draw ISO First-Angle projection symbol (frustum of cone with circle on the right).'
  ],
  isFreePreview: true,
  steps: [
    {
      stepNumber: 1,
      title: 'Layout Datum Reference Axes, 45° Miter Line & Bounding Boxes',
      label: 'Layout Datum Reference Axes, 45° Miter Line & Bounding Boxes',
      instruction: 'Draw horizontal ground line GL and vertical projection datum line. Draw a 45° miter line in the lower right quadrant to transfer depths from Plan to End View. Lay out faint bounding boxes for Front Elevation, Plan, and End View.',
      pencilGrade: '3H (Construction Lines 0.20mm)',
      lineTypeISO: 'ISO 128 Type B (Thin)',
      compassSetting: '45° Set-Square alignment',
      markAllocation: '5 Marks',
      svgData: `
        <!-- Reference Grid & Center Axes -->
        <line x1="30" y1="180" x2="470" y2="180" stroke="#475569" stroke-width="1.5" stroke-dasharray="8 4" />
        <line x1="260" y1="30" x2="260" y2="370" stroke="#475569" stroke-width="1.5" stroke-dasharray="8 4" />
        <!-- 45 Degree Miter Line in Bottom Right Quadrant -->
        <line x1="260" y1="180" x2="450" y2="370" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" />
        <text x="360" y="270" fill="#f59e0b" font-size="11" font-family="monospace">45° Miter Line</text>
        <!-- Bounding Boxes -->
        <rect x="60" y="50" width="160" height="110" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <rect x="60" y="210" width="160" height="120" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <rect x="290" y="50" width="120" height="110" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
        <text x="65" y="44" fill="#94a3b8" font-size="11" font-weight="bold">FRONT ELEVATION</text>
        <text x="65" y="204" fill="#94a3b8" font-size="11" font-weight="bold">PLAN (TOP VIEW)</text>
        <text x="295" y="44" fill="#94a3b8" font-size="11" font-weight="bold">END VIEW (FROM LEFT)</text>
      `
    },
    {
      stepNumber: 2,
      title: 'Construct Front Elevation with Upright, Base & Hole Centerlines',
      label: 'Construct Front Elevation with Upright, Base & Hole Centerlines',
      instruction: 'In the top-left space, draw the front profile: horizontal base 100 mm × 15 mm, vertical upright 15 mm thick × 60 mm total height, and web slope. Draw centerline and hidden dashed lines (Type F) for the Ø20 mm hole.',
      pencilGrade: '2H (Thin Outline 0.25mm)',
      lineTypeISO: 'ISO 128 Type B (Thin) & Type F (Dashed)',
      compassSetting: 'T-square horizontal steps',
      markAllocation: '5 Marks',
      svgData: `
        <!-- Front Elevation Profile -->
        <polygon points="60,160 220,160 220,135 110,135 110,50 60,50" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <!-- Web slope in Front Elevation -->
        <line x1="110" y1="75" x2="185" y2="135" stroke="#60a5fa" stroke-width="1.5" />
        <!-- Hole Centerline and Hidden Lines -->
        <line x1="45" y1="95" x2="125" y2="95" stroke="#38bdf8" stroke-width="1" stroke-dasharray="10 2 2 2" />
        <line x1="60" y1="83" x2="110" y2="83" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 2" />
        <line x1="60" y1="107" x2="110" y2="107" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 2" />
        <text x="125" y="90" fill="#f43f5e" font-size="9" font-family="monospace">Ø20 Hidden</text>
      `
    },
    {
      stepNumber: 3,
      title: 'Project Widths Downward & Construct Plan View',
      label: 'Project Widths Downward & Construct Plan View',
      instruction: 'Project vertical projection lines downward from all corners of the Front Elevation into the lower quadrant. Draw the plan rectangle (100 mm × 50 mm), show the vertical upright flange, the centered 12 mm triangular web rib, and the circular hole with crossed centerlines.',
      pencilGrade: '2H (Continuous Thin & Arcs)',
      lineTypeISO: 'ISO 128 Type B',
      compassSetting: 'Compass set to Ø20 (R10) mm',
      markAllocation: '5 Marks',
      svgData: `
        <!-- Projection rays downward -->
        <line x1="60" y1="160" x2="60" y2="210" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="110" y1="160" x2="110" y2="210" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="220" y1="160" x2="220" y2="210" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
        <!-- Plan Outer Perimeter -->
        <rect x="60" y="210" width="160" height="100" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <!-- Flange Upright in Plan -->
        <line x1="110" y1="210" x2="110" y2="310" stroke="#60a5fa" stroke-width="1.5" />
        <!-- Center Web Rib (12mm thick) -->
        <rect x="110" y="252" width="75" height="16" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5" />
        <!-- Hole Circle & Centerlines -->
        <circle cx="85" cy="260" r="14" fill="none" stroke="#60a5fa" stroke-width="2" />
        <line x1="65" y1="260" x2="105" y2="260" stroke="#38bdf8" stroke-width="1" stroke-dasharray="8 2 2 2" />
        <line x1="85" y1="240" x2="85" y2="280" stroke="#38bdf8" stroke-width="1" stroke-dasharray="8 2 2 2" />
      `
    },
    {
      stepNumber: 4,
      title: 'Project Depths via 45° Miter Line & Construct End View',
      label: 'Project Depths via 45° Miter Line & Construct End View',
      instruction: 'Project horizontal depths from Plan to the 45° miter line, then vertically upward into the top-right quadrant. Project heights horizontally from the Front Elevation to intersect the vertical depth rays. Construct the End View outline showing the stepped upright, base thickness, web rib, and the circular hole seen on end.',
      pencilGrade: '2H / 3H (Projection Rays 0.20mm)',
      lineTypeISO: 'ISO 128 Type B (Miter Transfer)',
      compassSetting: 'Set square vertical projection',
      markAllocation: '5 Marks',
      svgData: `
        <!-- Horizontal transfer to 45 line -->
        <line x1="220" y1="210" x2="290" y2="210" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="220" y1="310" x2="390" y2="310" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 2" />
        <!-- Vertical transfer from 45 line upward to End View -->
        <line x1="290" y1="210" x2="290" y2="160" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="390" y1="310" x2="390" y2="160" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 2" />
        <!-- End View Profile -->
        <polygon points="290,160 390,160 390,135 346,135 346,50 334,50 334,135 290,135" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <circle cx="340" cy="95" r="14" fill="none" stroke="#60a5fa" stroke-width="2" />
        <line x1="320" y1="95" x2="360" y2="95" stroke="#38bdf8" stroke-width="1" stroke-dasharray="8 2 2 2" />
        <line x1="340" y1="75" x2="340" y2="115" stroke="#38bdf8" stroke-width="1" stroke-dasharray="8 2 2 2" />
      `
    },
    {
      stepNumber: 5,
      title: 'Finalize Thick Outlines (HB), Add First-Angle Symbol & Dimensions',
      label: 'Finalize Thick Outlines (HB), Add First-Angle Symbol & Dimensions',
      instruction: 'Darken all visible edges with continuous thick lines (HB pencil, 0.50mm). Ensure centerlines extend 3 mm beyond features. Draw the official ISO First-Angle Projection symbol (frustum cone and concentric circles) and add primary overall dimensions.',
      pencilGrade: 'HB (Continuous Thick 0.50mm)',
      lineTypeISO: 'ISO 128 Type A (Thick Visible Outlines)',
      compassSetting: 'Set-square & French curve touch-up',
      markAllocation: '5 Marks',
      svgData: `
        <!-- High-contrast Thick Outlines on all 3 views -->
        <rect x="60" y="160" width="160" height="0" stroke="#38bdf8" stroke-width="2.5" />
        <!-- First Angle Projection Symbol on Bottom Right -->
        <g transform="translate(300, 320)">
          <polygon points="10,12 35,5 35,25 10,18" fill="none" stroke="#38bdf8" stroke-width="1.5" />
          <circle cx="55" cy="15" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" />
          <circle cx="55" cy="15" r="4" fill="none" stroke="#38bdf8" stroke-width="1.5" />
          <line x1="0" y1="15" x2="70" y2="15" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6 2 2 2" />
          <text x="0" y="32" fill="#94a3b8" font-size="8" font-family="monospace">1ST ANGLE PROJECTION (ISO 5456-2)</text>
        </g>
        <!-- Dimension Line Example -->
        <line x1="60" y1="172" x2="220" y2="172" stroke="#94a3b8" stroke-width="1" />
        <polygon points="60,172 66,170 66,174" fill="#94a3b8" />
        <polygon points="220,172 214,170 214,174" fill="#94a3b8" />
        <text x="130" y="182" fill="#38bdf8" font-size="10" font-family="monospace">100 mm</text>
      `
    }
  ]
};

// ----------------------------------------------------------------------------
// Question 3: Development of a Truncated Right Circular Cone Pattern
// ----------------------------------------------------------------------------
export const CONE_DEVELOPMENT_QUESTION: TheoryQuestion = {
  id: 'waec-theory-cone-development',
  questionNumber: 3,
  title: 'WAEC WASSCE: Radial Line Surface Development of a Truncated Right Circular Cone',
  description: 'A right circular cone of base diameter 60 mm and vertical height 75 mm rests vertically on the horizontal plane. It is cut by a cutting plane inclined at 45° to the base, intersecting the vertical axis at a height of 35 mm above the base. Construct: (a) Front Elevation and Plan; (b) Complete radial surface development of the truncated cone lateral surface.',
  category: 'DEVELOPMENTS',
  totalMarks: 20,
  givenData: [
    'Base Diameter Ø = 60 mm (Radius R = 30 mm)',
    'Vertical Height H = 75 mm',
    'True Slant Generator Length L = √(75² + 30²) = √(5625 + 900) = √6525 ≈ 80.78 mm',
    'Included Sector Angle θ = (R / L) × 360° = (30 / 80.78) × 360° = 133.7°',
    'Cutting Plane: Inclined at 45°, passing through axis at height = 35 mm'
  ],
  markingSchemeNotes: [
    'Construct Elevation (triangle base 60mm, height 75mm) and Plan (circle Ø60mm divided into 12 equal sectors).',
    'Project 12 radial generators from plan to elevation base and radiate to apex V.',
    'Draw cutting plane at 45° through height 35 mm on centerline.',
    'CRITICAL: Project each intersection point on the cutting plane HORIZONTALLY to the outermost slant generator to obtain the TRUE length from apex V.',
    'Swing master development arc from apex V\' with radius equal to true slant height L = 81 mm.',
    'Step off 12 arc divisions equal to base perimeter chord spacing.',
    'Transfer true cut lengths along respective radial generators and join with French Curve in continuous thick line.'
  ],
  isFreePreview: false,
  steps: [
    {
      stepNumber: 1,
      title: 'Draw Front Elevation Triangle & 12-Sector Base Plan',
      label: 'Draw Front Elevation Triangle & 12-Sector Base Plan',
      instruction: 'Draw elevation base line 60 mm and altitude 75 mm to apex V. Directly below, draw plan circle Ø60 mm. Using 30°/60° set-squares, divide plan into 12 equal sectors and number points 1 through 12.',
      pencilGrade: '2H (Thin Construction 0.25mm)',
      lineTypeISO: 'ISO 128 Type B & G',
      compassSetting: 'Plan circle radius 30 mm',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Elevation Triangle -->
        <polygon points="70,180 130,50 190,180" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5" />
        <line x1="130" y1="35" x2="130" y2="195" stroke="#38bdf8" stroke-width="1" stroke-dasharray="10 3 3 3" />
        <text x="126" y="45" fill="#38bdf8" font-size="11" font-weight="bold">V</text>
        <text x="60" y="185" fill="#94a3b8" font-size="10">A</text>
        <text x="195" y="185" fill="#94a3b8" font-size="10">B</text>
        <!-- Plan Circle (12 divisions) -->
        <circle cx="130" cy="270" r="45" fill="none" stroke="#a78bfa" stroke-width="1.5" />
        <line x1="85" y1="270" x2="175" y2="270" stroke="#64748b" stroke-width="1" />
        <line x1="130" y1="225" x2="130" y2="315" stroke="#64748b" stroke-width="1" />
        <line x1="98" y1="238" x2="162" y2="302" stroke="#64748b" stroke-width="1" />
        <line x1="98" y1="302" x2="162" y2="238" stroke="#64748b" stroke-width="1" />
        <text x="178" y="274" fill="#a78bfa" font-size="9" font-family="monospace">1 (Seam)</text>
      `
    },
    {
      stepNumber: 2,
      title: 'Draw 45° Cutting Plane & Project Horizontal True-Length Rays',
      label: 'Draw 45° Cutting Plane & Project Horizontal True-Length Rays',
      instruction: 'Mark height 35 mm on the centerline and draw cutting plane inclined at 45°. Project generators from plan divisions up to elevation apex V. From each cutting point on the generators, project horizontally to the outermost slant edge to find true lengths.',
      pencilGrade: '3H (Continuous Thin 0.20mm)',
      lineTypeISO: 'ISO 128 Type B (Horizontal True Lengths)',
      compassSetting: 'T-Square horizontal slide',
      markAllocation: '5 Marks',
      svgData: `
        <!-- Cutting Plane 45 deg -->
        <line x1="85" y1="165" x2="175" y2="95" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 2" />
        <text x="180" y="98" fill="#f43f5e" font-size="10" font-weight="bold">Cutting Plane 45°</text>
        <!-- Horizontal true-length transfer lines from cut points to outer generator (190,180) -->
        <line x1="105" y1="150" x2="175" y2="150" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2" />
        <line x1="120" y1="138" x2="170" y2="138" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2" />
        <line x1="130" y1="130" x2="165" y2="130" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2" />
        <line x1="145" y1="118" x2="160" y2="118" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2" />
        <text x="180" y="135" fill="#f59e0b" font-size="9" font-family="monospace">True Slant Lengths</text>
      `
    },
    {
      stepNumber: 3,
      title: 'Swing Master Development Sector Arc (Radius L = 81 mm)',
      label: 'Swing Master Development Sector Arc (Radius L = 81 mm)',
      instruction: 'From a new apex center V\', swing an arc of radius equal to true slant generator length L (81 mm). Calculate sector angle θ = 134° or step off 12 chord lengths equal to the plan perimeter divisions (15.7 mm each).',
      pencilGrade: '2H (Thin Construction Arc)',
      lineTypeISO: 'ISO 128 Type B',
      compassSetting: 'Radius = 81 mm (true slant)',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Development Apex V' -->
        <circle cx="340" cy="50" r="3.5" fill="#38bdf8" />
        <text x="345" y="48" fill="#38bdf8" font-size="12" font-weight="bold">V' (Apex)</text>
        <!-- Sector Boundary Rays -->
        <line x1="340" y1="50" x2="230" y2="210" stroke="#60a5fa" stroke-width="1.5" />
        <line x1="340" y1="50" x2="450" y2="210" stroke="#60a5fa" stroke-width="1.5" />
        <!-- Base Arc -->
        <path d="M 230,210 A 190,190 0 0,0 450,210" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 3" />
        <text x="310" y="240" fill="#94a3b8" font-size="10" font-family="monospace">Base Arc (θ = 134°)</text>
      `
    },
    {
      stepNumber: 4,
      title: 'Draw Radial Rays and Transfer True Cut Lengths',
      label: 'Draw Radial Rays and Transfer True Cut Lengths',
      instruction: 'Divide the development arc into 12 equal spaces numbered 1 to 12 and back to 1. Draw radiating generator lines to apex V\'. Using compass centered at V\', swing true cut lengths obtained on the outer elevation generator across each corresponding ray.',
      pencilGrade: '3H / 2H (Locus Arcs 0.20mm)',
      lineTypeISO: 'ISO 128 Type B',
      compassSetting: 'Compass set to true cut lengths from V',
      markAllocation: '4 Marks',
      svgData: `
        <!-- Radial generators in development -->
        <line x1="340" y1="50" x2="265" y2="225" stroke="#475569" stroke-width="1" />
        <line x1="340" y1="50" x2="300" y2="235" stroke="#475569" stroke-width="1" />
        <line x1="340" y1="50" x2="340" y2="240" stroke="#475569" stroke-width="1" />
        <line x1="340" y1="50" x2="380" y2="235" stroke="#475569" stroke-width="1" />
        <line x1="340" y1="50" x2="415" y2="225" stroke="#475569" stroke-width="1" />
        <!-- Locus points plotted along generators -->
        <circle cx="270" cy="155" r="3.5" fill="#10b981" />
        <circle cx="295" cy="140" r="3.5" fill="#10b981" />
        <circle cx="340" cy="125" r="3.5" fill="#10b981" />
        <circle cx="385" cy="140" r="3.5" fill="#10b981" />
        <circle cx="410" cy="155" r="3.5" fill="#10b981" />
        <text x="350" y="115" fill="#10b981" font-size="9" font-family="monospace">Cut Locus</text>
      `
    },
    {
      stepNumber: 5,
      title: 'Draw Finished Surface Development Outline with French Curve',
      label: 'Draw Finished Surface Development Outline with French Curve',
      instruction: 'Connect the plotted cut locus points with a smooth curve using a French Curve in continuous thick line (HB pencil). Darken the boundary generator seams and the base arc to complete the full pattern development.',
      pencilGrade: 'HB (Continuous Thick 0.50mm)',
      lineTypeISO: 'ISO 128 Type A (Pattern Boundary)',
      compassSetting: 'French Curve & Compass for base arc',
      markAllocation: '3 Marks',
      svgData: `
        <!-- Completed Pattern Development -->
        <!-- Truncated top curve -->
        <path d="M 245,175 Q 340,95 435,175" fill="none" stroke="#38bdf8" stroke-width="3" />
        <!-- Straight Seams -->
        <line x1="245" y1="175" x2="230" y2="210" stroke="#38bdf8" stroke-width="3" />
        <line x1="435" y1="175" x2="450" y2="210" stroke="#38bdf8" stroke-width="3" />
        <!-- Base Arc -->
        <path d="M 230,210 A 190,190 0 0,0 450,210" fill="none" stroke="#38bdf8" stroke-width="3" />
        <text x="295" y="195" fill="#38bdf8" font-size="11" font-weight="bold">PATTERN DEVELOPMENT</text>
        <text x="315" y="210" fill="#94a3b8" font-size="9" font-family="monospace">Radial Line Method</text>
      `
    }
  ]
};

// ----------------------------------------------------------------------------
// Question 4: Building Construction Wall Section Detail
// Foundation Footing, DPC, Lintel, and Roof Truss
// ----------------------------------------------------------------------------
export const WALL_SECTION_QUESTION: TheoryQuestion = {
  id: 'waec-practical-wall-section',
  questionNumber: 4,
  title: 'WAEC WASSCE: Detailed Vertical Section of an External Wall (Foundation to Roof Truss)',
  description: 'Draw to a scale of 1:20 a detailed vertical section through an external 225 mm sandcrete block wall of a residential bungalow from foundation to roof truss. Show clearly: (a) Mass concrete strip footing and trench excavation; (b) Hardcore, sand blinding, DPM, and concrete floor slab with screed; (c) Damp proof course (DPC); (d) Reinforced concrete lintel over window opening; (e) Wall plate and timber roof truss connection with corrugated roofing sheet.',
  category: 'BUILDING',
  totalMarks: 30,
  givenData: [
    'Foundation: Strip concrete footing 675 mm wide × 225 mm deep, founded 900 mm below ground level (GL)',
    'Walls: 225 mm thick hollow sandcrete blocks rendered on both sides',
    'Floor: 150 mm compacted hardcore bed, 25 mm sand blinding, 500-gauge polythene DPM, 100 mm mass concrete slab (1:2:4), and 25 mm cement-sand screed',
    'DPC: Bituminous damp proof course placed full wall width, minimum 150 mm above GL',
    'Window Lintel: 225 mm wide × 150 mm deep in-situ reinforced concrete (2x Ø12 mm rebars)',
    'Roof Framing: 100 mm × 75 mm hardwood wall plate bolted to wall; 50 mm × 100 mm ceiling joist; 50 mm × 100 mm tie beam and principal rafter pitched at 30°; 25 mm × 250 mm timber fascia board with aluminum corrugated roof covering',
    'Scale: 1:20'
  ],
  markingSchemeNotes: [
    'Draw strip footing to scale (675 mm = 33.75 mm, 225 mm = 11.25 mm) with standard concrete symbol (triangles and stippling).',
    'Earth excavation trench showing undisturbed soil hatching on either side of footing.',
    'Floor slab detail showing correct succession: Hardcore (crushed stones) -> Blinding -> DPM line -> Concrete slab -> Screed.',
    'DPC line drawn with thick line (minimum 150 mm above ground level).',
    'Reinforced concrete lintel showing diagonal cross hatching and rebar dots.',
    'Roof truss members properly labeled with correct standard timber dimensions.',
    'All building material hatching symbols drawn according to BS 1192 / Nigerian Building Code.'
  ],
  isFreePreview: false,
  steps: [
    {
      stepNumber: 1,
      title: 'Draw Ground Level GL & Mass Concrete Strip Footing',
      label: 'Draw Ground Level GL & Mass Concrete Strip Footing',
      instruction: 'Draw horizontal Ground Level (GL) line. At 900 mm depth, draw the excavation trench and mass concrete strip foundation footing measuring 675 mm wide × 225 mm thick. Fill with standard concrete hatching symbols (small triangles and stipples).',
      pencilGrade: '2H (Construction & Footing 0.25mm)',
      lineTypeISO: 'ISO 128 & BS 1192 Architectural Hatching',
      compassSetting: 'Scale 1:20 metric rule',
      markAllocation: '6 Marks',
      svgData: `
        <!-- Ground Level GL -->
        <line x1="30" y1="280" x2="470" y2="280" stroke="#a16207" stroke-width="2" />
        <text x="35" y="275" fill="#a16207" font-size="10" font-weight="bold">GL (Ground Level)</text>
        <line x1="40" y1="285" x2="35" y2="295" stroke="#a16207" stroke-width="1" />
        <line x1="50" y1="285" x2="45" y2="295" stroke="#a16207" stroke-width="1" />
        <!-- Strip Footing (675 mm wide x 225 mm deep) centered on wall -->
        <rect x="180" y="325" width="140" height="45" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
        <!-- Concrete hatching (triangles and dots) -->
        <polygon points="195,340 200,335 205,340" fill="#38bdf8" />
        <polygon points="235,355 240,350 245,355" fill="#38bdf8" />
        <polygon points="280,340 285,335 290,340" fill="#38bdf8" />
        <circle cx="215" cy="350" r="1.5" fill="#94a3b8" />
        <circle cx="260" cy="340" r="1.5" fill="#94a3b8" />
        <text x="185" y="385" fill="#38bdf8" font-size="10" font-weight="bold">Strip Footing 675 x 225 mm</text>
      `
    },
    {
      stepNumber: 2,
      title: 'Construct Foundation Wall, Hardcore, DPM & Floor Slab',
      label: 'Construct Foundation Wall, Hardcore, DPM & Floor Slab',
      instruction: 'Draw 225 mm foundation wall up from footing to floor level. Inside the building, draw 150 mm compacted hardcore bed (crushed stone symbols), 25 mm sand blinding, thick continuous line for 500-gauge polythene DPM, 100 mm concrete slab, and 25 mm floor screed.',
      pencilGrade: '2H / HB (Floor Assembly 0.35mm)',
      lineTypeISO: 'ISO 128 Material Symbols',
      compassSetting: 'Set-square offset',
      markAllocation: '6 Marks',
      svgData: `
        <!-- Foundation Wall 225mm -->
        <rect x="225" y="240" width="50" height="85" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <!-- Interior Hardcore Bed (150 mm) -->
        <rect x="275" y="270" width="180" height="35" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
        <text x="320" y="292" fill="#94a3b8" font-size="9" font-family="monospace">150mm Hardcore</text>
        <!-- Sand Blinding & DPM Line -->
        <line x1="275" y1="270" x2="455" y2="270" stroke="#f59e0b" stroke-width="2.5" />
        <text x="400" y="266" fill="#f59e0b" font-size="9" font-weight="bold">DPM Membrane</text>
        <!-- Concrete Floor Slab 100mm -->
        <rect x="275" y="248" width="180" height="22" fill="#334155" stroke="#38bdf8" stroke-width="1.5" />
        <text x="320" y="262" fill="#e2e8f0" font-size="9" font-family="monospace">100mm Conc. Slab</text>
        <!-- Screed 25mm -->
        <line x1="275" y1="243" x2="455" y2="243" stroke="#94a3b8" stroke-width="2" />
      `
    },
    {
      stepNumber: 3,
      title: 'Draw Superstructure Wall, DPC & Window Lintel Detail',
      label: 'Draw Superstructure Wall, DPC & Window Lintel Detail',
      instruction: 'Draw the 225 mm sandcrete block wall upward from floor level. Show the DPC (thick black line across full wall width at 150 mm above GL). Above the window opening, draw the in-situ reinforced concrete lintel (225 mm wide × 150 mm deep) with 2 rebar dots.',
      pencilGrade: '2H / HB (Masonry & Lintel 0.35mm)',
      lineTypeISO: 'ISO 128 Type A & Concrete Hatch',
      compassSetting: 'Parallel rule',
      markAllocation: '6 Marks',
      svgData: `
        <!-- Superstructure Wall (225mm) -->
        <rect x="225" y="140" width="50" height="100" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <!-- DPC Line (Thick black line 150mm above GL) -->
        <line x1="225" y1="240" x2="275" y2="240" stroke="#f43f5e" stroke-width="4" />
        <text x="165" y="244" fill="#f43f5e" font-size="10" font-weight="bold">DPC (150mm > GL)</text>
        <!-- Window Opening Void -->
        <rect x="225" y="105" width="50" height="35" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 3" />
        <text x="180" y="125" fill="#64748b" font-size="9">Window</text>
        <!-- Reinforced Concrete Lintel (225 x 150 mm) -->
        <rect x="225" y="80" width="50" height="25" fill="#334155" stroke="#38bdf8" stroke-width="2" />
        <circle cx="237" cy="95" r="2.5" fill="#f43f5e" />
        <circle cx="263" cy="95" r="2.5" fill="#f43f5e" />
        <text x="145" y="94" fill="#38bdf8" font-size="10" font-weight="bold">R.C. Lintel</text>
      `
    },
    {
      stepNumber: 4,
      title: 'Construct Wall Plate, Timber Roof Truss & Fascia Board',
      label: 'Construct Wall Plate, Timber Roof Truss & Fascia Board',
      instruction: 'At the top of the wall, draw 100 mm × 75 mm timber wall plate with anchor bolt. Draw 50 mm × 100 mm tie beam, ceiling joist, principal rafter inclined at 30° pitch, 25 mm × 250 mm fascia board, and corrugated roofing sheets.',
      pencilGrade: '2H (Timber Framing 0.25mm)',
      lineTypeISO: 'ISO 128 Timber Cross-Hatch',
      compassSetting: '30° Set-square rafter pitch',
      markAllocation: '6 Marks',
      svgData: `
        <!-- Top of Wall -->
        <rect x="225" y="55" width="50" height="25" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
        <!-- Wall Plate 100 x 75 mm -->
        <rect x="235" y="45" width="30" height="12" fill="#78350f" stroke="#d97706" stroke-width="1.5" />
        <text x="170" y="52" fill="#d97706" font-size="9" font-family="monospace">Wall Plate</text>
        <!-- Tie Beam / Ceiling Joist (Horizontal 50x100mm) -->
        <rect x="220" y="38" width="220" height="8" fill="#78350f" stroke="#d97706" stroke-width="1.5" />
        <text x="360" y="34" fill="#d97706" font-size="9" font-family="monospace">Tie Beam</text>
        <!-- Principal Rafter (30 deg pitch) -->
        <line x1="190" y1="52" x2="420" y2="-10" stroke="#d97706" stroke-width="6" stroke-linecap="round" />
        <!-- Fascia Board (25 x 250mm) -->
        <rect x="185" y="30" width="8" height="40" fill="#451a03" stroke="#d97706" stroke-width="1.5" />
        <text x="110" y="65" fill="#d97706" font-size="9" font-family="monospace">Fascia 25x250</text>
        <!-- Corrugated Roofing Sheet Overhang -->
        <line x1="175" y1="26" x2="430" y2="-15" stroke="#38bdf8" stroke-width="3" />
        <text x="240" y="15" fill="#38bdf8" font-size="9" font-family="monospace">Alum. Roofing Sheet (30°)</text>
      `
    },
    {
      stepNumber: 5,
      title: 'Apply Standard Architectural Hatching, Dimensions & Annotations',
      label: 'Apply Standard Architectural Hatching, Dimensions & Annotations',
      instruction: 'Apply official material hatching (blockwork 45° double lines, concrete stipple, earth hatching below GL, timber diagonal crosses). Add callout leaders for Foundation Footing, DPC, Hardcore, Lintel, Wall Plate, and Roof Truss with primary height dimensions.',
      pencilGrade: 'HB / H (Finished Hatching & Text 0.35mm)',
      lineTypeISO: 'BS 1192 & ISO 128 Architectural Standard',
      compassSetting: 'Lettering guide',
      markAllocation: '6 Marks',
      svgData: `
        <!-- Callout Leader Labels & Finished Accents -->
        <g stroke="#38bdf8" stroke-width="1">
          <line x1="180" y1="350" x2="130" y2="350" />
          <line x1="225" y1="240" x2="150" y2="240" />
          <line x1="225" y1="90" x2="140" y2="90" />
          <line x1="235" y1="48" x2="160" y2="48" />
        </g>
        <rect x="15" y="325" width="110" height="40" fill="#090d16" stroke="#38bdf8" stroke-width="1" />
        <text x="20" y="340" fill="#38bdf8" font-size="9" font-weight="bold">FOUNDATION FOOTING</text>
        <text x="20" y="354" fill="#94a3b8" font-size="8" font-family="monospace">675 x 225mm Conc.</text>
        <text x="290" y="180" fill="#10b981" font-size="11" font-weight="bold">SCALE 1:20 VERTICAL SECTION</text>
      `
    }
  ]
};

export const ALL_THEORY_PRACTICAL_QUESTIONS: TheoryQuestion[] = [
  PARABOLA_THEORY_QUESTION,
  ORTHOGRAPHIC_BRACKET_QUESTION,
  CONE_DEVELOPMENT_QUESTION,
  WALL_SECTION_QUESTION
];

// ============================================================================
// 3. COMPLETE 10-YEAR EXAM ARCHIVE DATABASE (2016 - 2026)
// ============================================================================

export const ALL_YEARS: number[] = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016
];

export const PAST_PAPERS_DATABASE: PastPaperItem[] = [
  // WAEC 2026
  {
    id: 'waec-2026-p1',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_1',
    title: 'WAEC WASSCE Technical Drawing May/June 2026',
    subTitle: 'Paper 1: Objectives & Multiple Choice (50 Questions)',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: WAEC_PAPER_1_MCQS
  },
  {
    id: 'waec-2026-p2',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_2',
    title: 'WAEC WASSCE Technical Drawing May/June 2026',
    subTitle: 'Paper 2: Geometrical & Mechanical Drawing',
    durationMinutes: 120,
    totalQuestions: 5,
    theoryQuestions: [PARABOLA_THEORY_QUESTION, ORTHOGRAPHIC_BRACKET_QUESTION]
  },
  {
    id: 'waec-2026-p3',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_3',
    title: 'WAEC WASSCE Technical Drawing May/June 2026',
    subTitle: 'Paper 3: Building Construction & Surface Developments',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: [CONE_DEVELOPMENT_QUESTION, WALL_SECTION_QUESTION]
  },

  // WAEC 2025
  {
    id: 'waec-2025-p1',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_1',
    title: 'WAEC WASSCE Technical Drawing May/June 2025',
    subTitle: 'Paper 1: Objectives & Multiple Choice',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: WAEC_PAPER_1_MCQS
  },
  {
    id: 'waec-2025-p2',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_2',
    title: 'WAEC WASSCE Technical Drawing May/June 2025',
    subTitle: 'Paper 2: Geometric & Orthographic Projections',
    durationMinutes: 120,
    totalQuestions: 5,
    theoryQuestions: [ORTHOGRAPHIC_BRACKET_QUESTION, PARABOLA_THEORY_QUESTION]
  },
  {
    id: 'waec-2025-p3',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_3',
    title: 'WAEC WASSCE Technical Drawing May/June 2025',
    subTitle: 'Paper 3: Practical Surface Developments & Building Sections',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: [WALL_SECTION_QUESTION, CONE_DEVELOPMENT_QUESTION]
  },

  // NECO 2026 & 2025
  {
    id: 'neco-2026-p1',
    examBody: 'NECO',
    year: 2026,
    paperType: 'PAPER_1',
    title: 'NECO SSCE Technical Drawing June/July 2026',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 60,
    mcqs: NECO_PAPER_1_MCQS
  },
  {
    id: 'neco-2026-p2',
    examBody: 'NECO',
    year: 2026,
    paperType: 'PAPER_2',
    title: 'NECO SSCE Technical Drawing June/July 2026',
    subTitle: 'Paper 2: Plane & Solid Geometry',
    durationMinutes: 120,
    totalQuestions: 5,
    theoryQuestions: [PARABOLA_THEORY_QUESTION, CONE_DEVELOPMENT_QUESTION]
  },
  {
    id: 'neco-2026-p3',
    examBody: 'NECO',
    year: 2026,
    paperType: 'PAPER_3',
    title: 'NECO SSCE Technical Drawing June/July 2026',
    subTitle: 'Paper 3: Architectural & Mechanical Working Drawings',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: [ORTHOGRAPHIC_BRACKET_QUESTION, WALL_SECTION_QUESTION]
  },

  // NABTEB 2026 & 2025
  {
    id: 'nabteb-2026-p1',
    examBody: 'NABTEB',
    year: 2026,
    paperType: 'PAPER_1',
    title: 'NABTEB NBC/NTC Technical Drawing May/June 2026',
    subTitle: 'Paper 1: Engineering Science & TD Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: NABTEB_PAPER_1_MCQS
  },
  {
    id: 'nabteb-2026-p2',
    examBody: 'NABTEB',
    year: 2026,
    paperType: 'PAPER_2',
    title: 'NABTEB Technical Drawing NBC/NTC May/June 2026',
    subTitle: 'Paper 2: Mechanical Machine Drawing',
    durationMinutes: 150,
    totalQuestions: 5,
    theoryQuestions: [ORTHOGRAPHIC_BRACKET_QUESTION, PARABOLA_THEORY_QUESTION]
  },
  {
    id: 'nabteb-2026-p3',
    examBody: 'NABTEB',
    year: 2026,
    paperType: 'PAPER_3',
    title: 'NABTEB Technical Drawing NBC/NTC May/June 2026',
    subTitle: 'Paper 3: Building Construction & Fabrication Drafting',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: [WALL_SECTION_QUESTION, CONE_DEVELOPMENT_QUESTION]
  }
];
