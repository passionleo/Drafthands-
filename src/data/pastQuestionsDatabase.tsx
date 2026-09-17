import React from 'react';
import { PastPaperItem, MCQuestion, TheoryQuestion } from '../types/pastQuestions';

// ==========================================
// PAPER 1: AUTHENTIC MULTIPLE CHOICE QUESTIONS
// ==========================================

export const SAMPLE_MCQS_WAEC: MCQuestion[] = [
  {
    id: 'waec-p1-q1',
    questionNumber: 1,
    questionText: 'According to ISO 128-20 and BS 8888, which line type and pencil grade is required for drawing cutting planes in sectioned mechanical views?',
    options: [
      { key: 'A', text: 'Continuous thick line with 2B pencil throughout' },
      { key: 'B', text: 'Chain thin line with thick ends and change of direction (Type H / 0.5mm ends, 0.25mm body)' },
      { key: 'C', text: 'Dashed thin line with 3H pencil throughout' },
      { key: 'D', text: 'Continuous wavy freehand line with HB pencil' }
    ],
    correctKey: 'B',
    explanation: 'ISO 128-20 specifies that cutting planes must be represented by a chain thin line (long dash - short dash) with thickened ends (0.50mm / 0.70mm) and arrows indicating the direction of viewing.',
    isoStandardRef: 'ISO 128-20: Line Types & ISO 128-40: Sectional Views',
    topicCategory: 'Line Types & Sectioning',
    isFreePreview: true
  },
  {
    id: 'waec-p1-q2',
    questionNumber: 2,
    questionText: 'In First Angle Orthographic Projection (European Standard ISO 5456-2), where is the Plan (Top View) positioned relative to the Front Elevation?',
    options: [
      { key: 'A', text: 'Directly above the Front Elevation' },
      { key: 'B', text: 'Directly below the Front Elevation' },
      { key: 'C', text: 'To the right of the Front Elevation' },
      { key: 'D', text: 'Coincident on the isometric diagonal' }
    ],
    correctKey: 'B',
    explanation: 'In First Angle Projection, the object is placed in the First Quadrant between the observer and the projection plane. Hence, looking from the top casts the Plan onto the horizontal plane BELOW the Front Elevation.',
    isoStandardRef: 'ISO 5456-2: Orthographic Projections (1st Angle vs 3rd Angle)',
    topicCategory: 'Orthographic Projection',
    isFreePreview: true
  },
  {
    id: 'waec-p1-q3',
    questionNumber: 3,
    questionText: 'A drawing scale is indicated as 1:50. What actual building distance is represented by a line measuring 60 mm on the working drawing?',
    options: [
      { key: 'A', text: '3,000 mm (3.0 meters)' },
      { key: 'B', text: '1,200 mm (1.2 meters)' },
      { key: 'C', text: '5,000 mm (5.0 meters)' },
      { key: 'D', text: '833 mm (0.83 meters)' }
    ],
    correctKey: 'A',
    explanation: 'Scale = Drawing Dimension : Real Dimension. Therefore, Real Dimension = 60 mm × 50 = 3,000 mm = 3.0 meters.',
    isoStandardRef: 'ISO 5455: Scales for Technical Drawings',
    topicCategory: 'Scales & Dimensioning',
    isFreePreview: false
  },
  {
    id: 'waec-p1-q4',
    questionNumber: 4,
    questionText: 'What is the locus of a point that moves in a plane such that the ratio of its distance from a fixed point (focus) to its distance from a fixed straight line (directrix) is strictly equal to unity (e = 1)?',
    options: [
      { key: 'A', text: 'Hyperbola' },
      { key: 'B', text: 'Ellipse' },
      { key: 'C', text: 'Parabola' },
      { key: 'D', text: 'Archimedean Spiral' }
    ],
    correctKey: 'C',
    explanation: 'By definition of conic sections, eccentricity e = Distance to Focus / Distance to Directrix. When e < 1 it is an ellipse; when e = 1 it is a parabola; when e > 1 it is a hyperbola.',
    isoStandardRef: 'Conic Sections Geometry (WAEC TD Syllabus Section B)',
    topicCategory: 'Conic Sections',
    isFreePreview: false
  },
  {
    id: 'waec-p1-q5',
    questionNumber: 5,
    questionText: 'In sectional assembly drawings, which of the following standard mechanical engineering components must NOT be hatched/sectioned along their longitudinal axis according to ISO 128-40?',
    options: [
      { key: 'A', text: 'Cast iron housings and cylinder blocks' },
      { key: 'B', text: 'Solid shafts, bolts, nuts, washers, rivets, and keys' },
      { key: 'C', text: 'Split brass bush bearings' },
      { key: 'D', text: 'Pipe elbows and flanged junctions' }
    ],
    correctKey: 'B',
    explanation: 'ISO 128-40 stipulates that solid components such as shafts, bolts, nuts, keys, pins, rivets, and balls/rollers must never be sectioned when the cutting plane passes longitudinally through their axes.',
    isoStandardRef: 'ISO 128-40: Principles of Sectioning & Unsectioned Items',
    topicCategory: 'Mechanical Drawing & Assembly',
    isFreePreview: false
  },
  {
    id: 'waec-p1-q6',
    questionNumber: 6,
    questionText: 'When constructing an architectural foundation footing for a wall of thickness T (e.g. 225 mm), what is the standard empirical rule of thumb for the width (W) and depth (D) of the mass concrete strip footing?',
    options: [
      { key: 'A', text: 'Width = 2T, Depth = 0.5T' },
      { key: 'B', text: 'Width = 3T, Depth = T (e.g. 675 mm wide × 225 mm thick)' },
      { key: 'C', text: 'Width = T, Depth = 3T' },
      { key: 'D', text: 'Width = 4T, Depth = 2T' }
    ],
    correctKey: 'B',
    explanation: 'Under Nigerian Building Code & WAEC Building Drawing specifications, standard strip footings have a minimum width of 3T (3 × 225 = 675 mm) and depth equal to wall thickness T (225 mm) with concrete projection T on either side.',
    isoStandardRef: 'ISO 4157 & Nigerian Building Code (NBC) Footing Ratios',
    topicCategory: 'Building & Architectural Drawing',
    isFreePreview: false
  },
  {
    id: 'waec-p1-q7',
    questionNumber: 7,
    questionText: 'What is the true shape of the section formed when a right circular cone is cut by a plane inclined to the base at an angle greater than the generator angle?',
    options: [
      { key: 'A', text: 'Circle' },
      { key: 'B', text: 'Ellipse' },
      { key: 'C', text: 'Parabola' },
      { key: 'D', text: 'Hyperbola' }
    ],
    correctKey: 'D',
    explanation: 'When the cutting plane angle is parallel to the cone generator, the section is a parabola. When the cutting plane angle is steeper than the generator (greater inclination), it cuts both nappes or intersects the base vertically, producing a hyperbola.',
    isoStandardRef: 'ISO Conic Section Theorems',
    topicCategory: 'Conic Sections & True Shapes',
    isFreePreview: false
  },
  {
    id: 'waec-p1-q8',
    questionNumber: 8,
    questionText: 'Which method is appropriate for developing the lateral surface of a right pyramid or right cone whose generators radiate from an apex vertex?',
    options: [
      { key: 'A', text: 'Parallel line development' },
      { key: 'B', text: 'Radial line development' },
      { key: 'C', text: 'Triangulation method' },
      { key: 'D', text: 'Approximate sphere gore method' }
    ],
    correctKey: 'B',
    explanation: 'Radial line development uses true slant lengths originating from a single apex point, swinging arcs to plot the unfold. Parallel line development is used for prisms and cylinders.',
    isoStandardRef: 'ISO 5457: Surface Developments',
    topicCategory: 'Surface Developments',
    isFreePreview: false
  }
];

export const SAMPLE_MCQS_NECO: MCQuestion[] = [
  {
    id: 'neco-p1-q1',
    questionNumber: 1,
    questionText: 'What angle is formed between the receding axes and the horizontal ground baseline in standard Isometric Projection?',
    options: [
      { key: 'A', text: '45° on both sides' },
      { key: 'B', text: '30° on both sides (axes 120° apart)' },
      { key: 'C', text: '60° and 30°' },
      { key: 'D', text: '90° and 45°' }
    ],
    correctKey: 'B',
    explanation: 'In isometric projection, all three principal axes make equal angles of 120° with each other, meaning the two receding ground axes are inclined at 30° to the horizontal baseline.',
    isoStandardRef: 'ISO 5456-3: Axonometric & Isometric Projections',
    topicCategory: 'Isometric Drawing',
    isFreePreview: true
  },
  {
    id: 'neco-p1-q2',
    questionNumber: 2,
    questionText: 'Which pencil grade is recommended by NERDC technical drawing standards for drawing dark, crisp finished outlines (ISO Type A continuous thick)?',
    options: [
      { key: 'A', text: '4H pencil' },
      { key: 'B', text: 'HB or H pencil' },
      { key: 'C', text: '6B charcoal pencil' },
      { key: 'D', text: '2H pencil' }
    ],
    correctKey: 'B',
    explanation: 'Finished outlines require continuous thick lines (0.50mm) drawn with medium-soft HB or H pencils, whereas 2H or 3H pencils are used for thin construction lines (0.25mm).',
    isoStandardRef: 'BS 8888 & NERDC Drawing Instrument Standards',
    topicCategory: 'Drawing Equipment & Line Weight',
    isFreePreview: true
  },
  {
    id: 'neco-p1-q3',
    questionNumber: 3,
    questionText: 'In architectural drafting, what does the symbol DPC stand for, and at what minimum height above finished ground level must it be installed?',
    options: [
      { key: 'A', text: 'Direct Pipe Connection, 50 mm' },
      { key: 'B', text: 'Damp Proof Course, minimum 150 mm above ground level' },
      { key: 'C', text: 'Door Post Concrete, 300 mm' },
      { key: 'D', text: 'Double Panel Column, 75 mm' }
    ],
    correctKey: 'B',
    explanation: 'DPC stands for Damp Proof Course (impermeable bituminous felt or polythene membrane) laid across walls at least 150 mm above ground level to prevent capillary rising damp.',
    isoStandardRef: 'ISO 4157: Building Construction Drawings',
    topicCategory: 'Building Drawing',
    isFreePreview: false
  },
  {
    id: 'neco-p1-q4',
    questionNumber: 4,
    questionText: 'What is the ratio of the isometric scale length to the true scale length?',
    options: [
      { key: 'A', text: 'cos(30°) ≈ 0.866' },
      { key: 'B', text: 'sqrt(2/3) ≈ 0.816 (approximately 82%)' },
      { key: 'C', text: 'tan(30°) ≈ 0.577' },
      { key: 'D', text: '1.414' }
    ],
    correctKey: 'B',
    explanation: 'The true isometric scale foreshortening factor is cos(45°)/cos(30°) = (1/√2)/(√3/2) = √(2/3) ≈ 0.8165.',
    isoStandardRef: 'ISO 5456-3: Isometric Scale Derivation',
    topicCategory: 'Isometric Scale',
    isFreePreview: false
  }
];

export const SAMPLE_MCQS_NABTEB: MCQuestion[] = [
  {
    id: 'nabteb-p1-q1',
    questionNumber: 1,
    questionText: 'Which thread profile is characterized by a 60° included angle, flat crests, and rounded roots according to ISO metric standards?',
    options: [
      { key: 'A', text: 'Whitworth Thread (55°)' },
      { key: 'B', text: 'ISO Metric V-Thread (60°)' },
      { key: 'C', text: 'Acme Thread (29°)' },
      { key: 'D', text: 'Square Thread (90°)' }
    ],
    correctKey: 'B',
    explanation: 'ISO metric screw threads (e.g. M16, M24) feature a 60° symmetrical V-profile with specified crest truncations and rounded root radii.',
    isoStandardRef: 'ISO 68-1: ISO General Purpose Metric Screw Threads',
    topicCategory: 'Fasteners & Thread Geometry',
    isFreePreview: true
  },
  {
    id: 'nabteb-p1-q2',
    questionNumber: 2,
    questionText: 'When dividing a straight line of length 95 mm into 7 equal segments without using arithmetic calculation, which geometric property is utilized?',
    options: [
      { key: 'A', text: 'Intercept Theorem on parallel transversal lines' },
      { key: 'B', text: 'Pythagorean hypotenuse theorem' },
      { key: 'C', text: 'Circumscribed circle theorem' },
      { key: 'D', text: 'Golden ratio proportions' }
    ],
    correctKey: 'A',
    explanation: 'By drawing an auxiliary ray at an acute angle (e.g. 30°), stepping off 7 equal compass ticks, and projecting parallel lines back to the line AB, the Intercept Theorem guarantees 7 equal divisions.',
    isoStandardRef: 'Plane Geometry Principles',
    topicCategory: 'Geometric Construction',
    isFreePreview: true
  },
  {
    id: 'nabteb-p1-q3',
    questionNumber: 3,
    questionText: 'What is the purpose of an exploded pictorial assembly view in engineering production drawings?',
    options: [
      { key: 'A', text: 'To show chemical composition of castings' },
      { key: 'B', text: 'To show mating relationships, disassembly order, and bill of materials references' },
      { key: 'C', text: 'To replace orthographic working dimensions' },
      { key: 'D', text: 'To reduce manufacturing tolerances' }
    ],
    correctKey: 'B',
    explanation: 'Exploded assembly drawings display all constituent components aligned along common assembly centerlines to communicate how individual parts fit together.',
    isoStandardRef: 'ISO 128-40 & BS 8888 Assembly Standards',
    topicCategory: 'Machine Drawing',
    isFreePreview: false
  }
];

// =======================================================
// PAPER 2: AUTHENTIC THEORY & PRACTICAL GEOMETRY DRAWINGS
// =======================================================

export const SAMPLE_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'waec-p2-q1-ellipse',
    questionNumber: 1,
    title: 'WAEC WASSCE: Construction of an Ellipse (Major Axis 120 mm, Minor Axis 80 mm)',
    description: 'Construct an ellipse having a major axis of 120 mm and a minor axis of 80 mm using the Concentric Circles Method. Determine the focal points F1 and F2, and draw a tangent and normal at point P on the curve located 35 mm from the minor axis.',
    category: 'GEOMETRIC',
    totalMarks: 20,
    givenData: [
      'Major Axis AB = 120 mm (Radius R1 = 60 mm)',
      'Minor Axis CD = 80 mm (Radius R2 = 40 mm)',
      'Point P: Horizontal distance from center O = 35 mm',
      'Mark allocation: Major/Minor axes layout (3 mks), Concentric circles & radial rays (5 mks), Locus curve plotting (6 mks), Tangent & Normal construction (4 mks), Neatness & Linework (2 mks)'
    ],
    markingSchemeNotes: [
      'Axes must intersect perpendicularly at exact midpoint O (Type G chain line, 0.25 mm).',
      'Circles must be concentric: Major circle Ø120 mm, Minor circle Ø80 mm.',
      'Divide circles into 12 equal sectors (30° intervals) using 30°-60° set-square.',
      'From outer intersections, project vertical ordinates; from inner intersections, project horizontal ordinates.',
      'Focal points: Swing radius equal to semi-major axis (60 mm) from top of minor axis C to cut major axis at F1 and F2.',
      'Tangent bisects the angle between the focal radii PF1 and PF2.'
    ],
    isFreePreview: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Major & Minor Centerlines',
        instruction: 'Draw horizontal centerline AB = 120 mm and perpendicular vertical centerline CD = 80 mm intersecting at datum center O. Use thin chain lines (ISO Type G, 0.25mm) with a 3H pencil.',
        pencilGrade: '3H / 4H (Continuous & Chain Thin 0.25mm)',
        lineTypeISO: 'ISO 128 Type G (Long Dash - Dot)',
        compassSetting: 'T-Square & Set Square alignment',
        markAllocation: '3 Marks',
        svgElements: (
          <g>
            <line x1="50" y1="200" x2="450" y2="200" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 4 4 4" />
            <line x1="250" y1="50" x2="250" y2="350" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 4 4 4" />
            <circle cx="250" cy="200" r="4" fill="#38bdf8" />
            <text x="258" y="194" fill="#94a3b8" fontSize="12" fontFamily="monospace">O (Datum)</text>
            <text x="455" y="204" fill="#38bdf8" fontSize="13" fontWeight="bold">A</text>
            <text x="35" y="204" fill="#38bdf8" fontSize="13" fontWeight="bold">B</text>
            <text x="245" y="40" fill="#38bdf8" fontSize="13" fontWeight="bold">C</text>
            <text x="245" y="370" fill="#38bdf8" fontSize="13" fontWeight="bold">D</text>
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Draw Major and Minor Concentric Circles',
        instruction: 'With compass needle at center O, draw the major auxiliary circle of radius R1 = 60 mm (Ø120 mm) and minor auxiliary circle of radius R2 = 40 mm (Ø80 mm). Use thin continuous lines (0.25mm).',
        pencilGrade: '2H (Continuous Thin 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Radius 60 mm and Radius 40 mm',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            <line x1="50" y1="200" x2="450" y2="200" stroke="#38bdf8" strokeWidth="1" strokeDasharray="16 4 4 4" opacity="0.6" />
            <line x1="250" y1="50" x2="250" y2="350" stroke="#38bdf8" strokeWidth="1" strokeDasharray="16 4 4 4" opacity="0.6" />
            <circle cx="250" cy="200" r="140" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="250" cy="200" r="95" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="395" y="185" fill="#60a5fa" fontSize="11" fontFamily="monospace">Major Circle Ø120</text>
            <text x="350" y="225" fill="#a78bfa" fontSize="11" fontFamily="monospace">Minor Circle Ø80</text>
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Divide Circles into 12 Radial Sectors (30° Intervals)',
        instruction: 'Using a 30°/60° set-square seated firmly on the T-square, draw radial generator lines passing through center O at angles 30°, 60°, 120°, 150°, 210°, 240°, 300°, and 330°.',
        pencilGrade: '3H (Construction Thin 0.20mm)',
        lineTypeISO: 'ISO 128 Type B (Thin)',
        compassSetting: '30°-60° Set-square alignment',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            <circle cx="250" cy="200" r="140" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
            <circle cx="250" cy="200" r="95" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
            {/* 30 degree rays */}
            <line x1="128" y1="130" x2="371" y2="270" stroke="#64748b" strokeWidth="1" />
            <line x1="128" y1="270" x2="371" y2="130" stroke="#64748b" strokeWidth="1" />
            {/* 60 degree rays */}
            <line x1="180" y1="78" x2="320" y2="321" stroke="#64748b" strokeWidth="1" />
            <line x1="180" y1="321" x2="320" y2="78" stroke="#64748b" strokeWidth="1" />
            <text x="380" y="130" fill="#94a3b8" fontSize="10">30° Generator</text>
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Project Orthogonal Intersections to Find Locus Points',
        instruction: 'From each point where a radial ray intersects the outer major circle, project a vertical line toward the major axis. From where the ray intersects the inner minor circle, project a horizontal line. The intersection of each pair yields a point on the ellipse.',
        pencilGrade: '2H (Construction Lines 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'T-Square and Set Square projection',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            <circle cx="250" cy="200" r="140" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
            <circle cx="250" cy="200" r="95" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
            {/* Example projection grid */}
            <line x1="371" y1="130" x2="371" y2="152" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="332" y1="152" x2="371" y2="152" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="371" cy="152" r="3.5" fill="#f59e0b" />
            <line x1="320" y1="78" x2="320" y2="117" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="297" y1="117" x2="320" y2="117" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="320" cy="117" r="3.5" fill="#f59e0b" />
            <text x="380" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace">Locus Intersection P</text>
          </g>
        )
      },
      {
        stepNumber: 5,
        title: 'Draw Smooth Finished Ellipse Outline & Tangent/Normal',
        instruction: 'Using a French Curve or flexible curve, draw a smooth, symmetrical continuous thick line (0.50mm, HB pencil) through all 12 locus points. Locate focal points F1 and F2 by swinging radius OA from apex C. Draw tangent TT and normal NN.',
        pencilGrade: 'HB / H (Continuous Thick 0.50mm)',
        lineTypeISO: 'ISO 128 Type A (Thick Outline)',
        compassSetting: 'French Curve & Focal Arc',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            {/* Ellipse Outline */}
            <ellipse cx="250" cy="200" rx="140" ry="95" fill="none" stroke="#38bdf8" strokeWidth="3" />
            {/* Foci */}
            <circle cx="147" cy="200" r="4" fill="#f43f5e" />
            <text x="140" y="222" fill="#f43f5e" fontSize="11" fontWeight="bold">F1</text>
            <circle cx="353" cy="200" r="4" fill="#f43f5e" />
            <text x="348" y="222" fill="#f43f5e" fontSize="11" fontWeight="bold">F2</text>
            {/* Tangent Line */}
            <line x1="290" y1="80" x2="420" y2="205" stroke="#10b981" strokeWidth="2" />
            <text x="425" y="210" fill="#10b981" fontSize="11" fontWeight="bold">T-T (Tangent)</text>
            {/* Normal Line */}
            <line x1="320" y1="180" x2="390" y2="90" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="395" y="90" fill="#ec4899" fontSize="11" fontWeight="bold">N-N (Normal)</text>
          </g>
        )
      }
    ]
  },
  {
    id: 'waec-p2-q2-tangency',
    questionNumber: 2,
    title: 'WAEC WASSCE: Common External Tangent to Two Unequal Circles',
    description: 'Two circular pulleys with centers O1 and O2 are spaced 110 mm apart horizontally. Pulley 1 has radius R1 = 45 mm, and Pulley 2 has radius R2 = 25 mm. Construct the common external tangent line connecting both circles with high geometric precision.',
    category: 'GEOMETRIC',
    totalMarks: 20,
    givenData: [
      'Center Distance O1-O2 = 110 mm',
      'Larger Circle Radius R1 = 45 mm',
      'Smaller Circle Radius R2 = 25 mm',
      'Auxiliary Circle Radius = R1 - R2 = 45 - 25 = 20 mm'
    ],
    markingSchemeNotes: [
      'Connect centers O1 and O2 with line segment and bisect it to find midpoint M.',
      'Draw semi-circle on diameter O1-O2 with radius equal to M-O1 (55 mm).',
      'Draw auxiliary circle inside larger circle with radius (R1 - R2) = 20 mm.',
      'Intersection of semi-circle and auxiliary circle locates point X.',
      'Extend ray O1-X to the perimeter of the larger circle to establish exact tangent point T1.',
      'Draw parallel normal O2-T2 from center O2 to establish point T2 on the smaller circle.',
      'Connect T1 to T2 with continuous thick line (0.50mm).'
    ],
    isFreePreview: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Center Distance and Both Circles',
        instruction: 'Draw horizontal line joining centers O1 and O2 = 110 mm. With O1 as center, draw circle of radius R1 = 45 mm. With O2 as center, draw circle of radius R2 = 25 mm.',
        pencilGrade: '2H (Thin Continuous 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Radius 45 mm and Radius 25 mm',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            <line x1="140" y1="200" x2="360" y2="200" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 4 4 4" />
            <circle cx="140" cy="200" r="75" fill="none" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="360" cy="200" r="42" fill="none" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="140" cy="200" r="3" fill="#38bdf8" />
            <circle cx="360" cy="200" r="3" fill="#38bdf8" />
            <text x="130" y="225" fill="#38bdf8" fontSize="12" fontWeight="bold">O1 (R45)</text>
            <text x="350" y="225" fill="#38bdf8" fontSize="12" fontWeight="bold">O2 (R25)</text>
            <text x="220" y="190" fill="#94a3b8" fontSize="11" fontFamily="monospace">110 mm</text>
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Bisect Line O1-O2 to Find Midpoint M',
        instruction: 'Using compass set to radius greater than 55 mm, strike arcs from O1 and O2 to bisect the center-to-center line segment. Mark midpoint M.',
        pencilGrade: '3H (Construction Lines 0.20mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Radius ~70 mm for bisection arcs',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            <line x1="140" y1="200" x2="360" y2="200" stroke="#38bdf8" strokeWidth="1" strokeDasharray="16 4 4 4" />
            <circle cx="250" cy="200" r="3.5" fill="#f59e0b" />
            <text x="245" y="222" fill="#f59e0b" fontSize="12" fontWeight="bold">M</text>
            {/* Bisection Arcs */}
            <path d="M 230,140 Q 250,150 270,160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <path d="M 230,260 Q 250,250 270,240" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <line x1="250" y1="130" x2="250" y2="270" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Draw Semi-Circle on Diameter O1-O2 & Auxiliary Circle',
        instruction: 'Center compass at M with radius M-O1 (55 mm) and swing a semi-circle over the top. Then center compass at O1 and draw the auxiliary circle of radius (R1 - R2) = 20 mm.',
        pencilGrade: '2H (Continuous Thin 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Radius 55 mm from M; Radius 20 mm from O1',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            {/* Semi-circle on M */}
            <path d="M 140,200 A 110,110 0 0,1 360,200" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
            {/* Auxiliary circle R = R1 - R2 = 33px */}
            <circle cx="140" cy="200" r="33" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            <text x="80" y="165" fill="#f43f5e" fontSize="10" fontFamily="monospace">Aux Circle (R1 - R2)</text>
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Locate Tangency Points T1 and T2',
        instruction: 'The intersection between the semi-circle and the auxiliary circle locates intersection point X. Draw ray from O1 through X extending to the outer circle to give T1. From O2, draw line parallel to O1-T1 to cut small circle at T2.',
        pencilGrade: '2H / 3H (Construction Thin 0.20mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Parallel Set-Square projection',
        markAllocation: '4 Marks',
        svgElements: (
          <g>
            <circle cx="140" cy="200" r="75" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="360" cy="200" r="42" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Radial normal O1-T1 */}
            <line x1="140" y1="200" x2="160" y2="128" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="160" cy="128" r="4" fill="#10b981" />
            <text x="145" y="120" fill="#10b981" fontSize="12" fontWeight="bold">T1</text>
            {/* Radial normal O2-T2 */}
            <line x1="360" y1="200" x2="372" y2="159" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="372" cy="159" r="4" fill="#10b981" />
            <text x="375" y="155" fill="#10b981" fontSize="12" fontWeight="bold">T2</text>
          </g>
        )
      },
      {
        stepNumber: 5,
        title: 'Draw Finished Common External Tangent Line',
        instruction: 'Join point T1 to point T2 with a continuous thick line (0.50mm, HB pencil). The line is strictly tangential to both circles.',
        pencilGrade: 'HB (Continuous Thick 0.50mm)',
        lineTypeISO: 'ISO 128 Type A',
        compassSetting: 'Straightedge alignment',
        markAllocation: '3 Marks',
        svgElements: (
          <g>
            <circle cx="140" cy="200" r="75" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="360" cy="200" r="42" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Finished Tangent Line */}
            <line x1="100" y1="107" x2="420" y2="175" stroke="#10b981" strokeWidth="3" />
            <text x="230" y="130" fill="#10b981" fontSize="12" fontWeight="bold">Common External Tangent</text>
          </g>
        )
      }
    ]
  },
  {
    id: 'waec-p2-q3-surface-development',
    questionNumber: 3,
    title: 'WAEC WASSCE: Radial Line Development of a Truncated Right Cone',
    description: 'A right circular cone of base diameter 60 mm and altitude 75 mm is truncated by a cutting plane inclined at 45° to the horizontal, intersecting the axis at a height of 35 mm above the base. Draw the full development of the truncated cone lateral surface.',
    category: 'DEVELOPMENTS',
    totalMarks: 20,
    givenData: [
      'Base Diameter Ø = 60 mm (Radius R = 30 mm)',
      'Altitude H = 75 mm',
      'True Slant Generator Length L = sqrt(75^2 + 30^2) = 80.78 mm',
      'Subtended Sector Angle θ = (R / L) × 360° = (30 / 80.78) × 360° = 133.7°'
    ],
    markingSchemeNotes: [
      'Construct elevation and plan views of the cone.',
      'Divide base plan into 12 equal sectors and project generators to elevation.',
      'Mark cutting plane at 45° through height 35 mm on centerline.',
      'Project cutting points horizontally to the outermost true-length slant generator.',
      'Swing sector arc with radius equal to true slant height L = 81 mm.',
      'Step off 12 arc chords equal to base division spacing.',
      'Transfer true truncated distances along respective generators and draw smooth boundary curve.'
    ],
    isFreePreview: false,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Front Elevation and Plan of the Cone',
        instruction: 'Draw the base diameter 60 mm and apex height 75 mm to form the elevation triangle. Below it, draw the plan circle of Ø60 mm and divide into 12 equal sectors.',
        pencilGrade: '2H (Thin Continuous 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Set-square and compass Ø60mm',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            {/* Elevation */}
            <polygon points="120,220 200,70 280,220" fill="none" stroke="#60a5fa" strokeWidth="2" />
            <line x1="200" y1="50" x2="200" y2="240" stroke="#38bdf8" strokeWidth="1" strokeDasharray="12 3 3 3" />
            {/* Cutting plane */}
            <line x1="140" y1="190" x2="250" y2="120" stroke="#f43f5e" strokeWidth="2" strokeDasharray="8 2" />
            <text x="255" y="125" fill="#f43f5e" fontSize="10">Cutting Plane 45°</text>
            {/* Plan */}
            <circle cx="200" cy="310" r="50" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
            <circle cx="200" cy="310" r="2" fill="#a78bfa" />
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Project Radial Generators to Apex and Find True Slant Lengths',
        instruction: 'Project each division point from the plan to the elevation base line and up to apex V. Project the cutting plane intersection points horizontally to the true-length slant edge.',
        pencilGrade: '3H (Construction Thin 0.20mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'T-Square horizontal projection',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            <polygon points="120,220 200,70 280,220" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
            <line x1="160" y1="220" x2="200" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="240" y1="220" x2="200" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
            {/* Horizontal transfer lines */}
            <line x1="180" y1="160" x2="280" y2="160" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="220" y1="140" x2="280" y2="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <text x="285" y="150" fill="#f59e0b" fontSize="10">True Lengths on Slant</text>
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Swing Lateral Sector Arc and Step off 12 Divisions',
        instruction: 'From a new apex center V, swing the master development arc of radius equal to true slant height L = 81 mm. Step off 12 equal distances along the arc matching the plan perimeter chord spacing.',
        pencilGrade: '2H (Thin Continuous 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Compass set to True Slant L = 81 mm',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            <circle cx="360" cy="70" r="3" fill="#38bdf8" />
            <text x="365" y="65" fill="#38bdf8" fontSize="12" fontWeight="bold">V (Apex)</text>
            <path d="M 280,230 A 180,180 0 0,1 460,210" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
            <line x1="360" y1="70" x2="280" y2="230" stroke="#64748b" strokeWidth="1" />
            <line x1="360" y1="70" x2="460" y2="210" stroke="#64748b" strokeWidth="1" />
            <text x="380" y="240" fill="#94a3b8" fontSize="11">Subtended Sector θ = 133.7°</text>
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Transfer True Radii and Trace Truncation Cut Line',
        instruction: 'With compass at V, swing concentric arcs of radii corresponding to each true cut distance to intersect the respective radial generator lines 0 through 12.',
        pencilGrade: '2H (Construction 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'Compass swung from apex V',
        markAllocation: '3 Marks',
        svgElements: (
          <g>
            {/* Sector Boundary */}
            <path d="M 280,230 A 180,180 0 0,1 460,210" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
            {/* Cut profile curve */}
            <path d="M 310,175 Q 360,110 425,160" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            <text x="330" y="130" fill="#f43f5e" fontSize="10">Cut Intersections</text>
          </g>
        )
      },
      {
        stepNumber: 5,
        title: 'Ink in Finished Outline of Flat Pattern Development',
        instruction: 'Using French curve, join the points of truncation in a smooth continuous thick curve (0.50mm). Line in the outer circular base arc and the boundary seam lines.',
        pencilGrade: 'HB (Continuous Thick 0.50mm)',
        lineTypeISO: 'ISO 128 Type A',
        compassSetting: 'French Curve & HB Pencil',
        markAllocation: '2 Marks',
        svgElements: (
          <g>
            {/* Fully Developed Surface */}
            <path d="M 280,230 A 180,180 0 0,1 460,210 L 425,160 Q 360,110 310,175 Z" fill="#0284c7" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="280" y1="230" x2="310" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="460" y1="210" x2="425" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="320" y="200" fill="#38bdf8" fontSize="12" fontWeight="bold">FULL SURFACE DEVELOPMENT</text>
          </g>
        )
      }
    ]
  },
  {
    id: 'waec-p2-q4-orthographic',
    questionNumber: 4,
    title: 'WAEC WASSCE: 1st Angle Orthographic Projection of Stepped Pivot Bracket',
    description: 'An isometric pictorial drawing of a cast steel bracket with a stepped cylindrical boss and slotted base is given. Draw in First Angle Orthographic Projection: (a) Front Elevation looking in direction of arrow A; (b) End Elevation looking in direction of arrow B; (c) Plan (Top View). Show all hidden details and centerline conventions.',
    category: 'ORTHOGRAPHIC',
    totalMarks: 25,
    givenData: [
      'Base: 100 mm long × 60 mm wide × 15 mm thick with 20 mm central slot',
      'Boss: Outer diameter Ø40 mm, Bore Ø20 mm, Height 50 mm from base',
      'Web rib: 10 mm thick supporting boss to rear flange',
      'Projection: First Angle (ISO 5456-2 symbol required)'
    ],
    markingSchemeNotes: [
      'Projection layout: Plan must be placed directly beneath Front Elevation; Left End view drawn on the right.',
      'Hidden details: Thin dashed line (ISO Type E, 0.25 mm) with uniform 3 mm dashes and 1 mm gaps.',
      'Centerlines: Thin long chain (ISO Type G) extending 3-5 mm beyond component outlines.',
      'Include official ISO First Angle Projection truncated cone symbol.'
    ],
    isFreePreview: false,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Reference 45° Projection Grid and Datum Lines',
        instruction: 'Establish horizontal ground line (GL) and vertical reference planes spaced with adequate clearance for dimensions. Draw the 45° reflection mitre line for transferring depths to the Plan.',
        pencilGrade: '3H (Construction Thin 0.20mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'T-Square and 45° Set-square',
        markAllocation: '5 Marks',
        svgElements: (
          <g>
            <line x1="50" y1="200" x2="450" y2="200" stroke="#64748b" strokeWidth="1" />
            <line x1="250" y1="50" x2="250" y2="350" stroke="#64748b" strokeWidth="1" />
            <line x1="250" y1="200" x2="390" y2="340" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="395" y="340" fill="#f59e0b" fontSize="10">45° Mitre Line</text>
            <text x="130" y="100" fill="#94a3b8" fontSize="12" fontWeight="bold">FRONT ELEVATION</text>
            <text x="320" y="100" fill="#94a3b8" fontSize="12" fontWeight="bold">END ELEVATION</text>
            <text x="130" y="230" fill="#94a3b8" fontSize="12" fontWeight="bold">PLAN (TOP VIEW)</text>
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Draft Front Elevation (Looking from Arrow A)',
        instruction: 'Draw the base outline (100 × 15 mm), vertical upright flange, and cylindrical boss (Ø40 mm). Draw hidden bore Ø20 mm in thin dashed lines (Type E).',
        pencilGrade: '2H (Thin) & HB (Thick Outlines)',
        lineTypeISO: 'ISO 128 Type A & Type E',
        compassSetting: 'T-Square & Set Square',
        markAllocation: '7 Marks',
        svgElements: (
          <g>
            {/* Base */}
            <rect x="70" y="150" width="150" height="25" fill="none" stroke="#38bdf8" strokeWidth="2" />
            {/* Boss */}
            <rect x="115" y="80" width="60" height="70" fill="none" stroke="#38bdf8" strokeWidth="2" />
            {/* Hidden Bore */}
            <line x1="130" y1="80" x2="130" y2="175" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="160" y1="80" x2="160" y2="175" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Centerline */}
            <line x1="145" y1="65" x2="145" y2="185" stroke="#38bdf8" strokeWidth="1" strokeDasharray="12 3 3 3" />
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Project Downwards and Draw Plan View',
        instruction: 'Project vertical alignment lines down from the Front Elevation. Draw the Plan View directly underneath showing the 100 × 60 mm base, concentric circles of boss (Ø40 and Ø20 mm), and 10 mm web rib.',
        pencilGrade: 'HB (Outlines) & 2H (Projection)',
        lineTypeISO: 'ISO 128 Type A',
        compassSetting: 'Compass set to R20 and R10',
        markAllocation: '7 Marks',
        svgElements: (
          <g>
            <rect x="70" y="240" width="150" height="90" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="145" cy="285" r="30" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="145" cy="285" r="15" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="140" y="240" width="10" height="45" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Project Horizontally Across to Draw End Elevation',
        instruction: 'Project height levels from Front Elevation and depth dimensions reflected off the 45° mitre line from the Plan into the End Elevation quadrant.',
        pencilGrade: 'HB (Outlines)',
        lineTypeISO: 'ISO 128 Type A',
        compassSetting: 'Set-square horizontal projection',
        markAllocation: '6 Marks',
        svgElements: (
          <g>
            <rect x="290" y="150" width="90" height="25" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <rect x="320" y="80" width="30" height="70" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <line x1="335" y1="80" x2="335" y2="150" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Rib triangular support */}
            <polygon points="320,150 290,150 320,105" fill="none" stroke="#38bdf8" strokeWidth="2" />
          </g>
        )
      }
    ]
  }
];

// =========================================================
// PAPER 3: PRACTICAL BUILDING & MECHANICAL WORKING DRAWINGS
// =========================================================

export const SAMPLE_PRACTICAL_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'waec-p3-q1-wall-section',
    questionNumber: 1,
    title: 'WAEC WASSCE: Detailed Sectional Elevation of an External Wall (Scale 1:20)',
    description: 'A single-storey residential bungalow is constructed with 225 mm sandcrete hollow block walls. Draw to Scale 1:20 a detailed vertical section through the external wall from the foundation trench to the roof eaves showing: (a) Strip foundation footing (3T × T); (b) Hardcore bed, blinding, and 150 mm floor slab; (c) DPC, 225 mm wall with timber window cill and reinforced concrete lintel; (d) Timber roof truss with 100 × 75 mm wall plate and 600 mm eaves overhang.',
    category: 'BUILDING',
    totalMarks: 35,
    givenData: [
      'Scale: 1:20 (50 mm on drawing = 1,000 mm real)',
      'Foundation: Mass concrete (1:3:6), 675 mm wide × 225 mm deep, 900 mm below ground level',
      'Hardcore: 250 mm compacted hardcore with 50 mm sand blinding',
      'Floor Slab: 150 mm thick reinforced concrete with 25 mm sand-cement screed',
      'DPC: Bituminous felt laid at 150 mm above Finished Ground Level (GL)',
      'Wall: 225 mm loadbearing sandcrete hollow blocks rendered on both sides',
      'Ceiling Height: 2,700 mm from finished floor level (FFL) to ceiling joists',
      'Roof: 30° timber truss with 100 × 50 mm rafters, 50 × 50 mm purlins, corrugated aluminum sheets'
    ],
    markingSchemeNotes: [
      'Accurate scale rendering (1:20) with standard ISO line weights.',
      'Foundation footing: mass concrete stipple symbol (dots and triangles).',
      'Hardcore bed: large irregular hexagonal stones with sand blinding.',
      'DPC clearly indicated by thick continuous line at least 150 mm above GL.',
      'Section hatching for sandcrete blockwork (pairs of 45° thin lines).',
      'Reinforced concrete lintel with tension bars and stirrups indicated.',
      'Timber hatching: wood grain and end-grain diagonals for wall plate (100 × 75 mm).'
    ],
    isFreePreview: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Ground Level Datum and Foundation Trench Excavation',
        instruction: 'Establish Finished Ground Level (GL) and excavate foundation trench to depth 900 mm. Draw the concrete strip footing 675 mm wide (3T) and 225 mm thick (T) centered beneath the wall line.',
        pencilGrade: '2H (Continuous Thin 0.25mm)',
        lineTypeISO: 'ISO 128 Type B',
        compassSetting: 'T-Square horizontal datum',
        markAllocation: '7 Marks',
        svgElements: (
          <g>
            <line x1="50" y1="200" x2="450" y2="200" stroke="#854d0e" strokeWidth="2.5" />
            <text x="60" y="190" fill="#ca8a04" fontSize="11" fontWeight="bold">Finished Ground Level (GL)</text>
            {/* Footing trench */}
            <rect x="180" y="300" width="135" height="45" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <text x="195" y="328" fill="#e2e8f0" fontSize="10" fontFamily="monospace">1:3:6 Footing 675×225</text>
            <line x1="247" y1="200" x2="247" y2="300" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 2" />
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Draw Substructure Wall, Hardcore, Sand Blinding & Floor Slab',
        instruction: 'Build 225 mm substructure block wall from footing up to slab level. Infill with 250 mm compacted hardcore bed, 50 mm sand blinding, 1000-gauge polythene DPM, and 150 mm concrete floor slab with 25 mm screed.',
        pencilGrade: 'HB (Structural Concrete & Walls)',
        lineTypeISO: 'ISO 128 Type A & Concrete Stipple',
        compassSetting: 'T-Square & Set Square',
        markAllocation: '9 Marks',
        svgElements: (
          <g>
            {/* Substructure wall */}
            <rect x="225" y="170" width="45" height="130" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            {/* Hardcore & Bed */}
            <rect x="90" y="210" width="135" height="50" fill="#3f3f46" stroke="#71717a" strokeWidth="1" />
            <text x="100" y="238" fill="#d4d4d8" fontSize="9">Hardcore 250mm</text>
            {/* Floor Slab */}
            <rect x="90" y="180" width="135" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="100" y="200" fill="#f1f5f9" fontSize="10" fontWeight="bold">150mm Conc Slab</text>
            {/* DPC */}
            <line x1="225" y1="170" x2="270" y2="170" stroke="#f43f5e" strokeWidth="4" />
            <text x="280" y="174" fill="#f43f5e" fontSize="10" fontWeight="bold">D.P.C.</text>
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Draw Superstructure Wall, Window Opening, and RC Lintel',
        instruction: 'Erect 225 mm superstructure wall. Cut window opening at cill height 900 mm with precast weathered concrete cill. Top the window with a 225 × 225 mm reinforced concrete lintel with tension bars.',
        pencilGrade: 'HB (Outlines) & 3H (Block Hatching)',
        lineTypeISO: 'ISO 128 Type A & Hatching 45°',
        compassSetting: 'Vertical rule at 225mm wall width',
        markAllocation: '10 Marks',
        svgElements: (
          <g>
            {/* Superstructure wall below window */}
            <rect x="225" y="100" width="45" height="70" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            {/* Window Opening */}
            <rect x="225" y="40" width="45" height="60" fill="#0f172a" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="232" y="75" fill="#38bdf8" fontSize="10">Window</text>
            {/* Precast cill */}
            <polygon points="215,100 275,100 270,110 215,110" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            {/* RC Lintel */}
            <rect x="225" y="15" width="45" height="25" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="235" cy="32" r="2.5" fill="#f43f5e" />
            <circle cx="260" cy="32" r="2.5" fill="#f43f5e" />
            <text x="278" y="30" fill="#f59e0b" fontSize="10" fontWeight="bold">R.C. Lintel</text>
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Draw Wall Plate, Timber Rafter, Fascia, and Eaves Overhang',
        instruction: 'Seat 100 × 75 mm timber wall plate anchored with ragbolts. Draw 100 × 50 mm timber rafter pitched at 30° projecting 600 mm past the wall to form the eaves, with 25 × 200 mm timber fascia board and ceiling joist.',
        pencilGrade: 'HB (Timber Elements & Roof Sheeting)',
        lineTypeISO: 'ISO 128 Type A & Wood Hatching',
        compassSetting: '30° Set-square for roof pitch',
        markAllocation: '9 Marks',
        svgElements: (
          <g>
            {/* Wall Plate */}
            <rect x="235" y="0" width="25" height="15" fill="#b45309" stroke="#fcd34d" strokeWidth="1.5" />
            {/* 30 degree timber rafter */}
            <line x1="320" y1="-40" x2="160" y2="45" stroke="#d97706" strokeWidth="4" />
            {/* Fascia board */}
            <line x1="160" y1="40" x2="160" y2="70" stroke="#f59e0b" strokeWidth="3" />
            <text x="90" y="65" fill="#f59e0b" fontSize="10">25×200 Fascia</text>
            {/* Ceiling joist */}
            <line x1="160" y1="70" x2="235" y2="15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
            <text x="170" y="25" fill="#38bdf8" fontSize="10">Rafter 30° Pitch</text>
          </g>
        )
      }
    ]
  },
  {
    id: 'waec-p3-q2-flanged-coupling',
    questionNumber: 2,
    title: 'WAEC WASSCE: Mechanical Sectional Assembly of Protected Flanged Coupling',
    description: 'Details of a cast iron protected flanged coupling connecting two co-axial shafts of diameter Ø40 mm are provided. Draw full size (Scale 1:1) the sectional front elevation showing the upper half in section and the lower half in outside elevation, including shafts, tapered keys, cast flanges, and M16 clamping bolts.',
    category: 'MECHANICAL',
    totalMarks: 35,
    givenData: [
      'Shaft Diameter: d = 40 mm',
      'Hub Diameter: 2d = 80 mm; Hub Length: 1.5d = 60 mm',
      'Flange Diameter: D = 4d = 160 mm; Flange Thickness: 0.5d = 20 mm',
      'Protective Circumferential Rim: 0.25d = 10 mm thick, projection = 0.5d = 20 mm',
      'Fasteners: 4 Nos. M16 Hexagonal Bolts on Pitch Circle Diameter PCD = 3d = 120 mm',
      'Standard: Upper half sectioned; solid shaft and bolts unsectioned per ISO 128-40'
    ],
    markingSchemeNotes: [
      'Co-axial horizontal centerline (ISO Type G, 0.25mm) through entire length.',
      'Upper half hatched at 45° with reversed hatching (-45°) on the opposing mating flange.',
      'Solid shaft, keys, and M16 bolts MUST NOT be hatched in the sectioned upper half.',
      'Bolt pitch circle diameter clearly marked (PCD Ø120 mm).',
      'Standard ISO title block, projection symbol, and bill of materials (BOM).'
    ],
    isFreePreview: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Draw Main Axial Centerline and Shaft Axes',
        instruction: 'Draw the central horizontal centerline (Type G) extending 200 mm. Draw the two Ø40 mm shafts abutting at the central vertical mating plane.',
        pencilGrade: '3H (Centerlines) & 2H (Shaft outlines)',
        lineTypeISO: 'ISO 128 Type G & Type B',
        compassSetting: 'T-Square horizontal alignment',
        markAllocation: '6 Marks',
        svgElements: (
          <g>
            <line x1="50" y1="200" x2="450" y2="200" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 4 4 4" />
            {/* Shaft left and right */}
            <rect x="70" y="175" width="180" height="50" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <rect x="250" y="175" width="180" height="50" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <line x1="250" y1="80" x2="250" y2="320" stroke="#60a5fa" strokeWidth="1" strokeDasharray="8 2" />
            <text x="80" y="165" fill="#38bdf8" fontSize="11">Shaft 1 Ø40</text>
            <text x="360" y="165" fill="#38bdf8" fontSize="11">Shaft 2 Ø40</text>
          </g>
        )
      },
      {
        stepNumber: 2,
        title: 'Draw Hubs and Flanges with Protective Outer Shrouds',
        instruction: 'Draw the hubs Ø80 mm and outer flanges Ø160 mm. Include the 10 mm thick outer protective rim that shields the protruding bolt heads and nuts.',
        pencilGrade: 'HB (Outlines)',
        lineTypeISO: 'ISO 128 Type A',
        compassSetting: 'Set-square and compass',
        markAllocation: '10 Marks',
        svgElements: (
          <g>
            {/* Left Flange & Hub */}
            <polygon points="170,140 220,140 220,90 250,90 250,310 220,310 220,260 170,260" fill="none" stroke="#60a5fa" strokeWidth="2" />
            {/* Right Flange & Hub */}
            <polygon points="330,140 280,140 280,90 250,90 250,310 280,310 280,260 330,260" fill="none" stroke="#60a5fa" strokeWidth="2" />
            {/* Protective Shroud rims */}
            <rect x="200" y="80" width="50" height="15" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="250" y="80" width="50" height="15" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="140" y="115" fill="#60a5fa" fontSize="10">Protective Rim</text>
          </g>
        )
      },
      {
        stepNumber: 3,
        title: 'Apply ISO 128-40 Section Hatching on Upper Half',
        instruction: 'Hatch the upper half of the left flange at +45° with 2.5 mm spacing. Hatch the mating right flange at -45°. Leave the solid shaft and key unsectioned.',
        pencilGrade: '2H (Continuous Thin Hatching 0.25mm)',
        lineTypeISO: 'ISO 128 Type B (Hatching 45°)',
        compassSetting: '45° Set-square sliding on T-square',
        markAllocation: '10 Marks',
        svgElements: (
          <g>
            {/* Left Hatching pattern */}
            <line x1="225" y1="95" x2="245" y2="115" stroke="#38bdf8" strokeWidth="1" />
            <line x1="225" y1="110" x2="245" y2="130" stroke="#38bdf8" strokeWidth="1" />
            <line x1="225" y1="125" x2="245" y2="145" stroke="#38bdf8" strokeWidth="1" />
            {/* Right Hatching pattern (opposing) */}
            <line x1="275" y1="95" x2="255" y2="115" stroke="#f59e0b" strokeWidth="1" />
            <line x1="275" y1="110" x2="255" y2="130" stroke="#f59e0b" strokeWidth="1" />
            <line x1="275" y1="125" x2="255" y2="145" stroke="#f59e0b" strokeWidth="1" />
            <text x="175" y="70" fill="#38bdf8" fontSize="10">+45° Cast Iron</text>
            <text x="270" y="70" fill="#f59e0b" fontSize="10">-45° Mating Flange</text>
          </g>
        )
      },
      {
        stepNumber: 4,
        title: 'Insert M16 Hexagonal Clamping Bolts and Washers',
        instruction: 'On the PCD of Ø120 mm, draw the M16 hexagonal bolts with threaded ends, standard washers, and hexagonal nuts recessed safely inside the protective shroud.',
        pencilGrade: 'HB (Bolt Heads & Nuts)',
        lineTypeISO: 'ISO 128 Type A & Metric Threads',
        compassSetting: 'Standard M16 proportions (Head: 0.7d, Nut: 0.8d)',
        markAllocation: '9 Marks',
        svgElements: (
          <g>
            {/* Upper Bolt in Section (Uncut) */}
            <rect x="220" y="112" width="60" height="16" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            {/* Hex Bolt Head */}
            <rect x="205" y="108" width="15" height="24" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
            {/* Hex Nut */}
            <rect x="280" y="108" width="16" height="24" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
            <text x="210" y="145" fill="#10b981" fontSize="10" fontWeight="bold">M16 Bolt (Uncut)</text>
          </g>
        )
      }
    ]
  }
];

// =========================================================
// PAST PAPERS CATALOG (Covering 2016-2026 across Bodies)
// =========================================================

export const ALL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

export const PAST_PAPERS_DATABASE: PastPaperItem[] = [
  // 2026 WAEC
  {
    id: 'waec-2026-p1',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2026',
    subTitle: 'Paper 1: Multiple Choice Objectives (50 Questions)',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2026-p2',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2026',
    subTitle: 'Paper 2: Theory & Practical Geometry Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2026-p3',
    examBody: 'WAEC',
    year: 2026,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2026',
    subTitle: 'Paper 3: Building & Mechanical Practical Working Drawings',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2025 WAEC
  {
    id: 'waec-2025-p1',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2025',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2025-p2',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2025',
    subTitle: 'Paper 2: Theory & Geometry Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2025-p3',
    examBody: 'WAEC',
    year: 2025,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2025',
    subTitle: 'Paper 3: Building & Mechanical Practical Drafting',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2024 WAEC
  {
    id: 'waec-2024-p1',
    examBody: 'WAEC',
    year: 2024,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2024',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2024-p2',
    examBody: 'WAEC',
    year: 2024,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2024',
    subTitle: 'Paper 2: Theory & Geometry Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2024-p3',
    examBody: 'WAEC',
    year: 2024,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2024',
    subTitle: 'Paper 3: Building & Mechanical Practical Drawing',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2023 WAEC
  {
    id: 'waec-2023-p1',
    examBody: 'WAEC',
    year: 2023,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2023',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2023-p2',
    examBody: 'WAEC',
    year: 2023,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2023',
    subTitle: 'Paper 2: Theory & Practical Geometry',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2023-p3',
    examBody: 'WAEC',
    year: 2023,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2023',
    subTitle: 'Paper 3: Building & Mechanical Drafting',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2022 WAEC
  {
    id: 'waec-2022-p1',
    examBody: 'WAEC',
    year: 2022,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2022',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2022-p2',
    examBody: 'WAEC',
    year: 2022,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2022',
    subTitle: 'Paper 2: Geometry Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2022-p3',
    examBody: 'WAEC',
    year: 2022,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2022',
    subTitle: 'Paper 3: Practical Drawings',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2021 WAEC
  {
    id: 'waec-2021-p1',
    examBody: 'WAEC',
    year: 2021,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2021',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2021-p2',
    examBody: 'WAEC',
    year: 2021,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2021',
    subTitle: 'Paper 2: Geometry & Orthographic',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2021-p3',
    examBody: 'WAEC',
    year: 2021,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2021',
    subTitle: 'Paper 3: Building Section & Assembly',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2020 WAEC
  {
    id: 'waec-2020-p1',
    examBody: 'WAEC',
    year: 2020,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2020',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2020-p2',
    examBody: 'WAEC',
    year: 2020,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2020',
    subTitle: 'Paper 2: Theory & Practical Geometry',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2020-p3',
    examBody: 'WAEC',
    year: 2020,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2020',
    subTitle: 'Paper 3: Practical Drawings',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },

  // 2019-2016 Archive items
  {
    id: 'waec-2019-p1',
    examBody: 'WAEC',
    year: 2019,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2019',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2019-p2',
    examBody: 'WAEC',
    year: 2019,
    paperType: 'PAPER_2',
    title: 'WAEC Technical Drawing May/June 2019',
    subTitle: 'Paper 2: Theory Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'waec-2019-p3',
    examBody: 'WAEC',
    year: 2019,
    paperType: 'PAPER_3',
    title: 'WAEC Technical Drawing May/June 2019',
    subTitle: 'Paper 3: Practical Working Drawings',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },
  {
    id: 'waec-2018-p1',
    examBody: 'WAEC',
    year: 2018,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2018',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2017-p1',
    examBody: 'WAEC',
    year: 2017,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2017',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },
  {
    id: 'waec-2016-p1',
    examBody: 'WAEC',
    year: 2016,
    paperType: 'PAPER_1',
    title: 'WAEC Technical Drawing May/June 2016',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_WAEC
  },

  // NECO PAPERS (2016-2026)
  {
    id: 'neco-2025-p1',
    examBody: 'NECO',
    year: 2025,
    paperType: 'PAPER_1',
    title: 'NECO Technical Drawing June/July 2025',
    subTitle: 'Paper 1: Multiple Choice Objectives (60 Questions)',
    durationMinutes: 60,
    totalQuestions: 60,
    mcqs: SAMPLE_MCQS_NECO
  },
  {
    id: 'neco-2025-p2',
    examBody: 'NECO',
    year: 2025,
    paperType: 'PAPER_2',
    title: 'NECO Technical Drawing June/July 2025',
    subTitle: 'Paper 2: Practical Plane & Solid Geometry',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'neco-2025-p3',
    examBody: 'NECO',
    year: 2025,
    paperType: 'PAPER_3',
    title: 'NECO Technical Drawing June/July 2025',
    subTitle: 'Paper 3: Building & Mechanical Practical Drawing',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },
  {
    id: 'neco-2024-p1',
    examBody: 'NECO',
    year: 2024,
    paperType: 'PAPER_1',
    title: 'NECO Technical Drawing June/July 2024',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 60,
    mcqs: SAMPLE_MCQS_NECO
  },
  {
    id: 'neco-2024-p2',
    examBody: 'NECO',
    year: 2024,
    paperType: 'PAPER_2',
    title: 'NECO Technical Drawing June/July 2024',
    subTitle: 'Paper 2: Practical Plane & Solid Geometry',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'neco-2023-p1',
    examBody: 'NECO',
    year: 2023,
    paperType: 'PAPER_1',
    title: 'NECO Technical Drawing June/July 2023',
    subTitle: 'Paper 1: Multiple Choice Objectives',
    durationMinutes: 60,
    totalQuestions: 60,
    mcqs: SAMPLE_MCQS_NECO
  },
  {
    id: 'neco-2022-p2',
    examBody: 'NECO',
    year: 2022,
    paperType: 'PAPER_2',
    title: 'NECO Technical Drawing June/July 2022',
    subTitle: 'Paper 2: Orthographic & Tangency Construction',
    durationMinutes: 120,
    totalQuestions: 6,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },

  // NABTEB PAPERS (2016-2026)
  {
    id: 'nabteb-2025-p1',
    examBody: 'NABTEB',
    year: 2025,
    paperType: 'PAPER_1',
    title: 'NABTEB Technical Drawing NBC/NTC May/June 2025',
    subTitle: 'Paper 1: Engineering Science & Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_NABTEB
  },
  {
    id: 'nabteb-2025-p2',
    examBody: 'NABTEB',
    year: 2025,
    paperType: 'PAPER_2',
    title: 'NABTEB Technical Drawing NBC/NTC May/June 2025',
    subTitle: 'Paper 2: Mechanical & Engineering Drawing',
    durationMinutes: 150,
    totalQuestions: 5,
    theoryQuestions: SAMPLE_THEORY_QUESTIONS
  },
  {
    id: 'nabteb-2025-p3',
    examBody: 'NABTEB',
    year: 2025,
    paperType: 'PAPER_3',
    title: 'NABTEB Technical Drawing NBC/NTC May/June 2025',
    subTitle: 'Paper 3: Building Construction & Fabrication Drafting',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  },
  {
    id: 'nabteb-2024-p1',
    examBody: 'NABTEB',
    year: 2024,
    paperType: 'PAPER_1',
    title: 'NABTEB Technical Drawing May/June 2024',
    subTitle: 'Paper 1: Objectives',
    durationMinutes: 60,
    totalQuestions: 50,
    mcqs: SAMPLE_MCQS_NABTEB
  },
  {
    id: 'nabteb-2023-p3',
    examBody: 'NABTEB',
    year: 2023,
    paperType: 'PAPER_3',
    title: 'NABTEB Technical Drawing May/June 2023',
    subTitle: 'Paper 3: Roof Truss & Timber Framing Details',
    durationMinutes: 150,
    totalQuestions: 4,
    theoryQuestions: SAMPLE_PRACTICAL_QUESTIONS
  }
];
