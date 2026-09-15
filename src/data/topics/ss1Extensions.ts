import { DrawingTopic } from '../../types/curriculum';

export const ss1ExtensionTopics: DrawingTopic[] = [
  // SS1 Term 2 Week 6: Quadrilaterals
  {
    id: 'ss1-quadrilaterals-construction',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 6,
    moduleCode: 'TD-SS1-T2-W06',
    title: 'Construction of Quadrilaterals (Square, Rectangle, Rhombus & Trapezium)',
    shortDescription: 'Construct geometric 4-sided figures using compass and 45°/60° set-squares according to given diagonal, base, and side constraints.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Quadrilaterals & Special Parallelograms (Term 2)',
      waecRef: 'WAEC Syllabus Section A: Plane Geometry - Quadrilaterals',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'A quadrilateral is a 4-sided closed plane polygon with interior angles summing to 360°. In engineering drafting, precise construction of rectangles, squares, rhombuses, and trapeziums forms the basis of structural plates, machine flanges, and sheet metal panels.',
      historyAndApplication: 'J.N. Green Chapter 4, pp. 45–52. Essential in setting building foundation corner baselines using the 3:4:5 right-angle rule and drafting trapezoidal roof gutters.',
      waecAndNERDCNotes: 'Always state whether diagonals bisect at right angles (square, rhombus) or are equal in length (square, rectangle). Show all arc intersections with 2H pencil.',
      keyPrinciples: [
        {
          title: 'Perpendicular Diagonals',
          description: 'In a square and rhombus, the diagonals are mutually perpendicular bisectors.',
          keyRule: 'd_1 ⊥ d_2 at central midpoint O'
        },
        {
          title: 'Trapezium Parallelism',
          description: 'A trapezium has one pair of opposite parallel sides (bases a and b) separated by perpendicular altitude h.',
          keyRule: 'Area = (a + b) * h / 2'
        }
      ],
      formulas: [
        { latex: 'A = L \\times W', description: 'Rectangle area' },
        { latex: 'd = \\sqrt{a^2 + b^2}', description: 'Diagonal length (Pythagoras)' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished quadrilateral perimeter outline' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Diagonal rays and compass construction arcs' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Base Length (AB)',
        symbol: 'L',
        defaultValue: 260,
        min: 160,
        max: 360,
        step: 10,
        unit: 'mm',
        description: 'Base width of the quadrilateral'
      },
      {
        id: 'height',
        label: 'Perpendicular Height (AD)',
        symbol: 'H',
        defaultValue: 160,
        min: 100,
        max: 240,
        step: 10,
        unit: 'mm',
        description: 'Vertical height of the quadrilateral'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.length || 260;
      const H = params.height || 160;
      const ox = 400 - L / 2;
      const oy = 300 + H / 2;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Baseline AB with T-Square',
          instruction: `Rule a horizontal baseline AB of length ${L}mm using an HB pencil on your drawing board.`,
          detailedNotes: 'Align the baseline perfectly with the top edge of your T-square. Mark endpoints A and B neatly with 2H prick points.',
          technicalPrinciple: 'Datum baseline: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: ox, y: oy, visible: true },
          elements: [
            { id: 'quad-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + L, y2: oy, isFinalResult: true },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 15, cy: oy + 20, label: 'A' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + L + 15, cy: oy + 20, label: 'B' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Erect Perpendiculars at Endpoints A and B',
          instruction: 'Using a compass or 90° set-square resting on the T-square, construct vertical perpendicular rays from A and B.',
          detailedNotes: 'Draw faint 2H construction lines upwards of height greater than H.',
          technicalPrinciple: 'Erecting 90° normal: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: ox, y: oy, visible: true },
          elements: [
            { id: 'quad-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + L, y2: oy },
            { id: 'ray-ad', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: ox, y2: oy - H - 30 },
            { id: 'ray-bc', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox + L, y1: oy, x2: ox + L, y2: oy - H - 30 }
          ]
        },
        {
          stepIndex: 3,
          title: `Measure Height H = ${H}mm to Locate Corners C and D`,
          instruction: `Set your compass or divider to radius H = ${H}mm. Swing arcs centered at A and B to intersect the vertical rays at D and C.`,
          detailedNotes: 'Intersection point D marks the top-left vertex, and C marks the top-right vertex.',
          technicalPrinciple: 'Compass radius transfer: arc intersection with 2H line.',
          activeInstrument: { toolType: 'COMPASS', x: ox, y: oy - H, radius: H, visible: true },
          elements: [
            { id: 'quad-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + L, y2: oy },
            { id: 'ray-ad', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: ox, y2: oy - H - 30 },
            { id: 'ray-bc', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox + L, y1: oy, x2: ox + L, y2: oy - H - 30 },
            { id: 'arc-d', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: ox, cy: oy, r: H, startAngle: 250, endAngle: 290 },
            { id: 'arc-c', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: ox + L, cy: oy, r: H, startAngle: 250, endAngle: 290 },
            { id: 'lbl-d', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 15, cy: oy - H - 10, label: 'D' },
            { id: 'lbl-c', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + L + 15, cy: oy - H - 10, label: 'C' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Join DC and Outline Finished Rectangle ABCD',
          instruction: 'Use the T-square to draw top horizontal edge DC with an HB pencil, and darken vertical edges AD and BC.',
          detailedNotes: 'Draw diagonals AC and BD with thin continuous 2H lines to verify that both diagonals are strictly equal in length.',
          technicalPrinciple: 'Finished geometric outline: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: ox + L / 2, y: oy - H, visible: true },
          elements: [
            { id: 'quad-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + L, y2: oy, isFinalResult: true },
            { id: 'quad-bc', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + L, y1: oy, x2: ox + L, y2: oy - H, isFinalResult: true },
            { id: 'quad-cd', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + L, y1: oy - H, x2: ox, y2: oy - H, isFinalResult: true },
            { id: 'quad-da', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy - H, x2: ox, y2: oy, isFinalResult: true },
            { id: 'diag-ac', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: ox + L, y2: oy - H },
            { id: 'diag-bd', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox + L, y1: oy, x2: ox, y2: oy - H },
            { id: 'dim-l', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: oy + 35, x2: ox + L, y2: oy + 35, dimensionText: `L = ${L}mm` },
            { id: 'dim-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox - 35, y1: oy, x2: ox - 35, y2: oy - H, dimensionText: `H = ${H}mm` }
          ]
        }
      ];
    }
  },

  // SS1 Term 2 Week 8: Circle Properties & Tangents
  {
    id: 'ss1-circles-tangents-properties',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 8,
    moduleCode: 'TD-SS1-T2-W08',
    title: 'Circles & Circle Properties: Chords, Tangents from an External Point',
    shortDescription: 'Construct circle components (diameter, chord, segment, sector) and construct exact tangents from an external point P to circle O.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 6: Circle Theorems & Tangency Basics (Term 2)',
      waecRef: 'WAEC Syllabus Section A: Circle Geometry & Tangent from External Point',
      isoRef: 'ISO 128-20: Technical Drawing Conventions'
    },
    theory: {
      overview: 'A circle is the planar locus of points equidistant from a fixed center O. A tangent is a straight line that touches the circumference at exactly one point, always perpendicular to the normal radius at the point of contact (r ⊥ t).',
      historyAndApplication: 'J.N. Green Chapter 5, pp. 58–64. Essential for pitch-circle diameters in spur gears, pulley belt alignments, pipe flanges, and cylindrical roundings.',
      waecAndNERDCNotes: 'The point of tangency T MUST be established by constructing the semicircle on diameter OP. Marking tangent contact without showing the semicircle results in an immediate 3-mark penalty.',
      keyPrinciples: [
        {
          title: 'Thales Semicircle Tangent Theorem',
          description: 'Any angle inscribed in a semicircle is a right angle (90°). Thus, the semicircle on diameter OP intersects circle O at the exact 90° tangent point T.',
          keyRule: '∠OTP = 90°'
        },
        {
          title: 'Two Tangent Symmetry',
          description: 'From any point P external to a circle, exactly two tangents can be drawn, and PT_1 = PT_2.',
          keyRule: 'PT_1 = PT_2 = \\sqrt{OP^2 - r^2}'
        }
      ],
      formulas: [
        { latex: 'PT = \\sqrt{OP^2 - r^2}', description: 'Tangent length from external point' },
        { latex: 'C = 2\\pi r', description: 'Circumference formula' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished circle outline and tangent lines PT_1, PT_2' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Bisection of OP and Thales auxiliary semicircle' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Circle centerlines through O' }
      ]
    },
    parameters: [
      {
        id: 'radius',
        label: 'Circle Radius (r)',
        symbol: 'r',
        defaultValue: 60,
        min: 40,
        max: 90,
        step: 5,
        unit: 'mm',
        description: 'Radius of given circle O'
      },
      {
        id: 'distance',
        label: 'Center to Point P (OP)',
        symbol: 'd',
        defaultValue: 160,
        min: 110,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Distance from center O to external point P'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const r = params.radius || 60;
      const d = params.distance || 160;
      const ox = 300;
      const oy = 300;
      const px = ox + d;
      const py = oy;
      const mx = (ox + px) / 2;
      const my = oy;
      const R_semi = d / 2;

      // Tangent angle: cos(theta) = r / d
      const cosTheta = Math.min(1, Math.max(-1, r / d));
      const theta = Math.acos(cosTheta);
      const t1x = ox + r * Math.cos(theta);
      const t1y = oy - r * Math.sin(theta);
      const t2x = ox + r * Math.cos(-theta);
      const t2y = oy - r * Math.sin(-theta);

      return [
        {
          stepIndex: 1,
          title: 'Draw Given Circle O and Mark External Point P',
          instruction: `Draw circle of center O and radius r = ${r}mm with an HB pencil. Rule horizontal centerline and mark point P at distance ${d}mm from O.`,
          detailedNotes: 'Draw centerlines extending 10mm past the circle circumference using 2H thin chain lines.',
          technicalPrinciple: 'Circle and datum point: Continuous Thick outline (HB) and Thin Chain centerline.',
          activeInstrument: { toolType: 'COMPASS', x: ox, y: oy, radius: r, visible: true },
          elements: [
            { id: 'circ-o', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, r: r, isFinalResult: true },
            { id: 'cl-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox - r - 25, y1: oy, x2: px + 30, y2: oy },
            { id: 'cl-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox, y1: oy - r - 25, x2: ox, y2: oy + r + 25 },
            { id: 'lbl-o', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 15, cy: oy - 15, label: 'O' },
            { id: 'lbl-p', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: px + 15, cy: oy + 5, label: 'P' },
            { id: 'line-op', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: px, y2: py }
          ]
        },
        {
          stepIndex: 2,
          title: 'Bisect Distance OP to Locate Midpoint M',
          instruction: 'Using a compass radius greater than half OP, swing intersecting arcs above and below line OP to locate its perpendicular bisector and midpoint M.',
          detailedNotes: 'Midpoint M is the center of the Thales auxiliary semicircle.',
          technicalPrinciple: 'Perpendicular bisection: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: mx, y: my, radius: R_semi * 0.7, visible: true },
          elements: [
            { id: 'circ-o', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, r: r },
            { id: 'line-op', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: px, y2: py },
            { id: 'bisector-m', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: mx, y1: oy - 50, x2: mx, y2: oy + 50 },
            { id: 'lbl-m', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: mx, cy: oy + 20, label: 'M' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Semicircle on OP to Establish Tangency Points T1 and T2',
          instruction: `Set compass at M with radius MO = MP = ${(d / 2).toFixed(1)}mm. Draw semicircle intersecting circle O at exact tangent points T1 and T2.`,
          detailedNotes: 'By Thales theorem, ∠OT1P = 90°, proving that line PT1 is exactly normal to radius OT1.',
          technicalPrinciple: 'Auxiliary Thales circle: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: mx, y: my, radius: R_semi, visible: true },
          elements: [
            { id: 'circ-o', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, r: r },
            { id: 'semi-op', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: mx, cy: my, r: R_semi, startAngle: 180, endAngle: 360 },
            { id: 'semi-bot', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: mx, cy: my, r: R_semi, startAngle: 0, endAngle: 180 },
            { id: 'rad-ot1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: t1x, y2: t1y },
            { id: 'rad-ot2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: t2x, y2: t2y },
            { id: 'lbl-t1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: t1x - 10, cy: t1y - 15, label: 'T1' },
            { id: 'lbl-t2', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: t2x - 10, cy: t2y + 20, label: 'T2' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Finished Tangent Lines PT1 and PT2',
          instruction: 'Use a straight edge and HB pencil to draw bold lines from P through points of tangency T1 and T2.',
          detailedNotes: 'Draw radius lines OT1 and OT2 with thin continuous lines to show the 90° right angle markers.',
          technicalPrinciple: 'Finished tangents: Continuous Thick line (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: (px + t1x) / 2, y: (py + t1y) / 2, visible: true },
          elements: [
            { id: 'circ-o', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, r: r, isFinalResult: true },
            { id: 'line-pt1', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px, y1: py, x2: t1x, y2: t1y, isFinalResult: true },
            { id: 'line-pt2', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px, y1: py, x2: t2x, y2: t2y, isFinalResult: true },
            { id: 'rad-ot1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: t1x, y2: t1y },
            { id: 'rad-ot2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: t2x, y2: t2y },
            { id: 'dim-r', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: oy, x2: ox - r, y2: oy, dimensionText: `r = ${r}mm` },
            { id: 'dim-op', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: oy + r + 35, x2: px, y2: oy + r + 35, dimensionText: `OP = ${d}mm` }
          ]
        }
      ];
    }
  },

  // SS1 Term 3 Week 1: Equal Areas Transformation
  {
    id: 'ss1-equal-areas-transformation',
    tier: 'SS1',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 1,
    moduleCode: 'TD-SS1-T3-W01',
    title: 'Equal Areas: Converting a Triangle into an Equivalent Rectangle',
    shortDescription: 'Construct a rectangle having equal area to a given triangle ABC on the same base or equal altitude (Euclidean shears theorem).',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 7: Transformation of Plane Figures - Equal Areas (Term 3)',
      waecRef: 'WAEC Syllabus Section A: Reduction, Enlargement and Equal Areas',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'Transformation of plane figures involves converting one geometric shape into another of identical surface area without calculating mathematical areas. A triangle of base b and altitude h has area A = (1/2) * b * h. A rectangle on the same base b must have height h_rect = h / 2 to possess identical area.',
      historyAndApplication: 'J.N. Green Chapter 7, pp. 84–92 & Pickup & Parker Plate 12. Essential in land surveying property swaps, material optimization in sheet metal cutting, and civil earthwork volumetric balancing.',
      waecAndNERDCNotes: 'Bisecting the altitude of the triangle to find h/2 is the critical geometric step. The rectangle top edge must coincide with the midpoint of triangle height.',
      keyPrinciples: [
        {
          title: 'Half-Altitude Theorem',
          description: 'Area of triangle = 1/2 * b * h. Area of rectangle = b * H_rect. For equal areas, H_rect = h / 2.',
          keyRule: 'Area(Triangle) = Area(Rectangle) = b * (h / 2)'
        },
        {
          title: 'Parallel Shear Conservation',
          description: 'Triangles between the same parallels on the same base are equal in area.',
          keyRule: 'Shear along line parallel to base preserves area'
        }
      ],
      formulas: [
        { latex: 'A_{\\triangle} = \\frac{1}{2} b h', description: 'Triangle area' },
        { latex: 'H_{rect} = \\frac{h}{2}', description: 'Equivalent rectangle height' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Given triangle ABC and finished rectangle ABDE outline' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Altitude dropped from C and bisection arcs' }
      ]
    },
    parameters: [
      {
        id: 'base',
        label: 'Base Length (AB)',
        symbol: 'b',
        defaultValue: 240,
        min: 160,
        max: 320,
        step: 10,
        unit: 'mm',
        description: 'Base of the given triangle'
      },
      {
        id: 'altitude',
        label: 'Triangle Altitude (h)',
        symbol: 'h',
        defaultValue: 180,
        min: 120,
        max: 240,
        step: 10,
        unit: 'mm',
        description: 'Perpendicular height of apex C above base AB'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const b = params.base || 240;
      const h = params.altitude || 180;
      const ox = 400 - b / 2;
      const oy = 350;
      const ax = ox;
      const ay = oy;
      const bx = ox + b;
      const by = oy;
      const cx = ox + b * 0.4;
      const cy = oy - h;
      const halfH = h / 2;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Given Triangle ABC',
          instruction: `Draw baseline AB = ${b}mm and locate apex C at height ${h}mm above AB. Join AC and BC with HB lines.`,
          detailedNotes: 'Apex C can be located at any desired offset along the parallel line at height h.',
          technicalPrinciple: 'Given geometric figure: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: ox, y: oy, visible: true },
          elements: [
            { id: 'tri-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isFinalResult: true },
            { id: 'tri-ac', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: cx, y2: cy, isFinalResult: true },
            { id: 'tri-bc', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy, isFinalResult: true },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ax - 15, cy: ay + 20, label: 'A' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: bx + 15, cy: ay + 20, label: 'B' },
            { id: 'lbl-c', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy - 15, label: 'C' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Drop Perpendicular Altitude and Bisect it to Find h/2',
          instruction: `Drop perpendicular from apex C to base AB (height = ${h}mm). Bisect this altitude using compass arcs to find midpoint M at height ${(halfH).toFixed(1)}mm.`,
          detailedNotes: 'Midpoint M defines the top baseline of the required equivalent rectangle.',
          technicalPrinciple: 'Perpendicular bisection: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: cx, y: cy + halfH, radius: 40, visible: true },
          elements: [
            { id: 'tri-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'tri-ac', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: cx, y2: cy },
            { id: 'tri-bc', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'alt-c', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: cx, y1: cy, x2: cx, y2: oy },
            { id: 'par-half', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ax - 30, y1: oy - halfH, x2: bx + 30, y2: oy - halfH },
            { id: 'lbl-m', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx + 15, cy: oy - halfH - 5, label: 'M (h/2)' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Erect Perpendiculars at A and B to Intersect the Half-Height Line',
          instruction: 'Construct vertical lines from A and B using your 90° set-square to intersect the horizontal line through M at D and E.',
          detailedNotes: 'Point D lies directly above A at height h/2; point E lies directly above B at height h/2.',
          technicalPrinciple: 'Perpendicular projection: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: ax, y: oy - halfH, visible: true },
          elements: [
            { id: 'tri-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'tri-ac', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: cx, y2: cy },
            { id: 'tri-bc', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'line-ad', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: ax, y2: oy - halfH, isFinalResult: true },
            { id: 'line-be', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: bx, y2: oy - halfH, isFinalResult: true },
            { id: 'line-de', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: oy - halfH, x2: bx, y2: oy - halfH, isFinalResult: true },
            { id: 'lbl-d', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ax - 15, cy: oy - halfH - 10, label: 'D' },
            { id: 'lbl-e', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: bx + 15, cy: oy - halfH - 10, label: 'E' },
            { id: 'dim-halfh', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax - 40, y1: oy, x2: ax - 40, y2: oy - halfH, dimensionText: `h/2 = ${halfH}mm` }
          ]
        }
      ];
    }
  },

  // SS1 Term 3 Week 2: Enlargement & Reduction
  {
    id: 'ss1-enlargement-reduction',
    tier: 'SS1',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 2,
    moduleCode: 'TD-SS1-T3-W02',
    title: 'Proportional Enlargement & Reduction of Plane Figures (Radial Line Method)',
    shortDescription: 'Enlarge or reduce an irregular polygon in a given ratio (e.g. 5:3 or 2:3) using a pole/focal point and proportional ray division.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 7: Enlargement and Reduction of Figures (Term 3)',
      waecRef: 'WAEC Syllabus Section A: Proportional Enlargement/Reduction',
      isoRef: 'ISO 5455: Scales in Technical Drawings'
    },
    theory: {
      overview: 'Enlargement and reduction produces geometrically similar plane figures where corresponding angles remain invariant and corresponding linear dimensions scale in a strict constant ratio (k = new_length / original_length).',
      historyAndApplication: 'J.N. Green Chapter 7, pp. 95–102. Fundamental for optical pantographs, scaling site survey boundaries, photographic drafting enlargements, and architectural floor plan scaling.',
      waecAndNERDCNotes: 'A corner vertex (e.g. vertex A) or an external pole P is selected. Radiating lines are drawn through all other vertices. A baseline is divided into the specified ratio parts using parallel lines.',
      keyPrinciples: [
        {
          title: 'Homothetic Center (Pole Method)',
          description: 'From pole O, radiating lines connect to all vertices A, B, C, D. Corresponding vertices A\', B\', C\', D\' satisfy OA\'/OA = OB\'/OB = ratio k.',
          keyRule: 'Side lengths scale as k; Area scales as k²'
        }
      ],
      formulas: [
        { latex: 'L_{new} = k \\cdot L_{orig}', description: 'Linear scaling formula' },
        { latex: 'A_{new} = k^2 \\cdot A_{orig}', description: 'Area scaling formula' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Original polygon and enlarged/reduced polygon outlines' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Radial projection rays from pole O' }
      ]
    },
    parameters: [
      {
        id: 'scaleRatio',
        label: 'Enlargement Ratio Factor (k)',
        symbol: 'k',
        defaultValue: 1.5,
        min: 1.2,
        max: 2.0,
        step: 0.1,
        unit: 'x',
        description: 'Linear scale enlargement factor'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const k = params.scaleRatio || 1.5;
      const ox = 150;
      const oy = 450;
      // Original polygon relative to pole O
      const p1 = [ox + 120, oy];
      const p2 = [ox + 200, oy - 60];
      const p3 = [ox + 160, oy - 160];
      const p4 = [ox + 80, oy - 120];

      // Scaled polygon
      const s1 = [ox + (p1[0] - ox) * k, oy + (p1[1] - oy) * k];
      const s2 = [ox + (p2[0] - ox) * k, oy + (p2[1] - oy) * k];
      const s3 = [ox + (p3[0] - ox) * k, oy + (p3[1] - oy) * k];
      const s4 = [ox + (p4[0] - ox) * k, oy + (p4[1] - oy) * k];

      return [
        {
          stepIndex: 1,
          title: 'Draw the Original Given Polygon ABCD',
          instruction: 'Plot the given irregular polygon with vertices A, B, C, D using an HB pencil.',
          detailedNotes: 'Choose vertex A as the origin pole O or establish a dedicated external focal pole.',
          technicalPrinciple: 'Given figure outline: Continuous Thick line (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: p1[0], y: p1[1], visible: true },
          elements: [
            { id: 'poly-orig', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [p1 as [number, number], p2 as [number, number], p3 as [number, number], p4 as [number, number]], isFinalResult: true },
            { id: 'lbl-o', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 15, cy: oy + 10, label: 'O (Pole)' },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: p1[0], cy: p1[1] + 20, label: 'A' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: p2[0] + 15, cy: p2[1], label: 'B' },
            { id: 'lbl-c', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: p3[0], cy: p3[1] - 15, label: 'C' },
            { id: 'lbl-d', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: p4[0] - 15, cy: p4[1], label: 'D' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Radiate Projection Rays from Pole O through All Vertices',
          instruction: 'From pole O, draw long, faint 2H construction lines extending through vertices A, B, C, and D.',
          detailedNotes: 'These lines serve as the radial paths along which the enlarged vertices will lie.',
          technicalPrinciple: 'Radial projection lines: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'RULER', x: ox, y: oy, visible: true },
          elements: [
            { id: 'ray-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: s1[0] + 30, y2: s1[1] },
            { id: 'ray-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: s2[0] + 30, y2: s2[1] - 15 },
            { id: 'ray-c', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: s3[0] + 20, y2: s3[1] - 25 },
            { id: 'ray-d', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: s4[0] - 10, y2: s4[1] - 30 },
            { id: 'poly-orig', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [p1 as [number, number], p2 as [number, number], p3 as [number, number], p4 as [number, number]] }
          ]
        },
        {
          stepIndex: 3,
          title: `Locate Scaled Vertices A'B'C'D' Using Ratio k = ${k.toFixed(1)}`,
          instruction: `Along ray OA, measure OA' = ${k.toFixed(1)} × OA. From A', draw parallel lines to AB, BC, CD to locate B', C', D' on their respective rays.`,
          detailedNotes: 'Draw the finished enlarged polygon A\'B\'C\'D\' in thick HB lines.',
          technicalPrinciple: 'Enlarged similar polygon: Continuous Thick (0.5mm HB) parallel to original sides.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: s2[0], y: s2[1], visible: true },
          elements: [
            { id: 'poly-orig', type: 'POLYGON', lineWeight: 'THIN_CONTINUOUS', points: [p1 as [number, number], p2 as [number, number], p3 as [number, number], p4 as [number, number]] },
            { id: 'poly-enlarged', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [s1 as [number, number], s2 as [number, number], s3 as [number, number], s4 as [number, number]], isFinalResult: true },
            { id: 'lbl-s1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: s1[0], cy: s1[1] + 20, label: "A'" },
            { id: 'lbl-s2', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: s2[0] + 15, cy: s2[1], label: "B'" },
            { id: 'lbl-s3', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: s3[0], cy: s3[1] - 15, label: "C'" },
            { id: 'lbl-s4', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: s4[0] - 15, cy: s4[1], label: "D'" }
          ]
        }
      ];
    }
  },

  // SS1 Term 3 Week 4: Introduction to Pictorial Drawing (Isometric)
  {
    id: 'ss1-intro-pictorial-isometric',
    tier: 'SS1',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 4,
    moduleCode: 'TD-SS1-T3-W04',
    title: 'Introduction to Pictorial Drawing: 30° Isometric Axes & Stepped Block',
    shortDescription: 'Construct standard 30° isometric axes and draft a 3D stepped block inside an isometric bounding box using 30°/60° set-square.',
    category: 'ISOMETRIC_AND_PICTORIAL',
    standards: {
      nerdcRef: 'SS1 TD Unit 8: Introduction to Pictorial Drawing (Term 3)',
      waecRef: 'WAEC Syllabus Section B: Pictorial Drawing Fundamentals',
      isoRef: 'ISO 5456-3: Axonometric Projections'
    },
    theory: {
      overview: 'Pictorial drawing represents a three-dimensional object on a two-dimensional sheet in a single visual image. Isometric projection uses three axes: one vertical and two receding at 30° to the horizontal. All parallel edges remain parallel, and true lengths can be measured directly along the three isometric axes.',
      historyAndApplication: 'J.N. Green Chapter 11, pp. 165–172 & Pickup & Parker Plate 20. The standard visualization tool used by architects and mechanical draftsmen to convey 3D form clearly to clients and machinists.',
      waecAndNERDCNotes: 'Always use the 30°/60° set-square resting on the T-square to draw isometric receding lines. Non-isometric lines (sloping edges) cannot be measured directly—they must be plotted from isometric coordinate box points.',
      keyPrinciples: [
        {
          title: 'The Three Isometric Axes',
          description: 'One axis is vertical (90°); the other two axes are inclined at 30° to the horizontal on either side (120° apart mutually).',
          keyRule: 'Angles between isometric axes = 120°'
        },
        {
          title: 'Isometric Bounding Box Method',
          description: 'First enclose the total Length (L), Width (W), and Height (H) in a faint 2H isometric rectangular prism box, then carve out the stepped details.',
          keyRule: 'Carve internal steps from the outer bounding crate'
        }
      ],
      formulas: [
        { latex: '\\theta_{iso} = 30^\\circ', description: 'Receding axis angle to horizontal' },
        { latex: '\\angle(X, Y) = \\angle(Y, Z) = \\angle(Z, X) = 120^\\circ', description: 'Mutual axis separation' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible 3D stepped block outlines' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Isometric crate bounding lines and 30° projection rays' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Block Length (L)',
        symbol: 'L',
        defaultValue: 160,
        min: 100,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Length along right 30° isometric axis'
      },
      {
        id: 'width',
        label: 'Block Width (W)',
        symbol: 'W',
        defaultValue: 100,
        min: 60,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Width along left 30° isometric axis'
      },
      {
        id: 'height',
        label: 'Block Total Height (H)',
        symbol: 'H',
        defaultValue: 120,
        min: 80,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Height along vertical isometric axis'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ISOMETRIC'
    },
    generateSteps: (params) => {
      const L = params.length || 160;
      const W = params.width || 100;
      const H = params.height || 120;
      const ox = 400;
      const oy = 420;

      // 30 degree trigonometry: cos(30°) = 0.866, sin(30°) = 0.5
      const cos30 = 0.866;
      const sin30 = 0.5;

      const rightX = ox + L * cos30;
      const rightY = oy - L * sin30;
      const leftX = ox - W * cos30;
      const leftY = oy - W * sin30;

      const topCenterX = ox;
      const topCenterY = oy - H;
      const topRightX = rightX;
      const topRightY = rightY - H;
      const topLeftX = leftX;
      const topLeftY = leftY - H;
      const topBackX = ox + (L - W) * cos30;
      const topBackY = oy - (L + W) * sin30 - H;

      // Step cutout dimensions (half height, half length)
      const stepL = L / 2;
      const stepH = H / 2;
      const stepRx = ox + stepL * cos30;
      const stepRy = oy - stepL * sin30 - stepH;

      return [
        {
          stepIndex: 1,
          title: 'Set up the Three Isometric Axes at 30°/90°/30°',
          instruction: 'From origin point O, draw a vertical line (90°) and two receding lines at 30° to the horizontal using your 30°/60° set-square.',
          detailedNotes: 'Place the T-square firmly against the drawing board. Use the 30° angle of the set-square to draw receding axes to the left and right.',
          technicalPrinciple: 'Isometric axes setup: Continuous Thin lines (0.25mm 2H).',
          activeInstrument: { toolType: 'SET_SQUARE_30_60', x: ox, y: oy, angleDeg: 30, visible: true },
          elements: [
            { id: 'axis-v', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: ox, y2: oy - H - 30 },
            { id: 'axis-r', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: rightX + 40 * cos30, y2: rightY - 40 * sin30 },
            { id: 'axis-l', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: leftX - 40 * cos30, y2: leftY - 40 * sin30 },
            { id: 'horiz-ref', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: ox - 80, y1: oy, x2: ox + 80, y2: oy },
            { id: 'lbl-o', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy + 20, label: 'O (Origin)' }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct the Overall Isometric Crate Box (${L}×${W}×${H}mm)`,
          instruction: `Measure L = ${L}mm along right axis, W = ${W}mm along left axis, and H = ${H}mm vertically. Complete the isometric bounding crate box with faint 2H lines.`,
          detailedNotes: 'Every edge of the crate box is drawn parallel to one of the three isometric axes.',
          technicalPrinciple: 'Bounding crate box: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: ox, y: topCenterY, visible: true },
          elements: [
            { id: 'box-v1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: topCenterX, y2: topCenterY },
            { id: 'box-v2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: rightX, y1: rightY, x2: topRightX, y2: topRightY },
            { id: 'box-v3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: leftX, y1: leftY, x2: topLeftX, y2: topLeftY },
            { id: 'box-b1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: rightX, y2: rightY },
            { id: 'box-b2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: ox, y1: oy, x2: leftX, y2: leftY },
            { id: 'box-t1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: topCenterX, y1: topCenterY, x2: topRightX, y2: topRightY },
            { id: 'box-t2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: topCenterX, y1: topCenterY, x2: topLeftX, y2: topLeftY },
            { id: 'box-t3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: topRightX, y1: topRightY, x2: topBackX, y2: topBackY },
            { id: 'box-t4', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: topLeftX, y1: topLeftY, x2: topBackX, y2: topBackY }
          ]
        },
        {
          stepIndex: 3,
          title: 'Carve out the Stepped Recess and Darken Visible Outlines',
          instruction: 'Plot the internal step edges and darken all visible outlines with a sharp HB pencil.',
          detailedNotes: 'Ensure strict line contrast: finished visible lines must be bold 0.5mm HB, while construction crate lines remain faint 2H.',
          technicalPrinciple: 'Finished 3D pictorial: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: stepRx, y: stepRy, visible: true },
          elements: [
            { id: 'iso-b1', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: rightX, y2: rightY, isFinalResult: true },
            { id: 'iso-b2', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: leftX, y2: leftY, isFinalResult: true },
            { id: 'iso-v1', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox, y2: oy - stepH, isFinalResult: true },
            { id: 'iso-v2', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: rightX, y1: rightY, x2: rightX, y2: rightY - stepH, isFinalResult: true },
            { id: 'iso-v3', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: leftX, y1: leftY, x2: topLeftX, y2: topLeftY, isFinalResult: true },
            { id: 'iso-step-top', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy - stepH, x2: ox + stepL * cos30, y2: oy - stepH - stepL * sin30, isFinalResult: true },
            { id: 'iso-step-rise', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + stepL * cos30, y2: oy - H - stepL * sin30, x2: ox + stepL * cos30, y1: oy - stepH - stepL * sin30, isFinalResult: true },
            { id: 'iso-top-edge', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + stepL * cos30, y1: oy - H - stepL * sin30, x2: topRightX, y2: topRightY, isFinalResult: true },
            { id: 'iso-top-left', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy - H, x2: topLeftX, y2: topLeftY, isFinalResult: true }
          ]
        }
      ];
    }
  },

  // SS1 Term 3 Week 5: Introduction to First Angle Orthographic Projection
  {
    id: 'ss1-intro-orthographic-projection',
    tier: 'SS1',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 5,
    moduleCode: 'TD-SS1-T3-W05',
    title: 'Introduction to Orthographic Projection: First Angle Principle & Shaped Block',
    shortDescription: 'Master the planes of projection (Vertical & Horizontal planes), 45° mitre projection line, and layout Front, Plan, and End views.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 9: Fundamentals of Orthographic Projection (Term 3)',
      waecRef: 'WAEC Syllabus Section A & B: Orthographic Multi-View Basics',
      isoRef: 'ISO 5456-2: Orthographic Projections (First Angle Symbol)'
    },
    theory: {
      overview: 'Orthographic projection is the foundation of all engineering drawings. It projects mutually perpendicular 2D views from infinite sight lines onto reference planes: the Vertical Plane (VP) for Front Elevation, the Horizontal Plane (HP) for Plan View, and the Profile Plane (PP) for End Elevation. In First Angle projection, the object lies in the first quadrant: the Plan is placed BELOW the Front Elevation, and the Left End view is placed on the RIGHT.',
      historyAndApplication: 'Formulated by Gaspard Monge in 1795. J.N. Green Chapter 10, pp. 140–158. Universal standard in European, British, Nigerian (NERDC/WAEC), and ISO engineering practice.',
      waecAndNERDCNotes: 'A major WAEC trap is inverting the views (placing Plan on top). In First Angle, Plan is ALWAYS below the Front Elevation! Always draw the 45° mitre projection line in the bottom-right quadrant.',
      keyPrinciples: [
        {
          title: 'First Angle View Arrangement',
          description: 'Front Elevation is in top-left; Plan is projected directly below it; Left End Elevation is projected to the right of the Front.',
          keyRule: 'Look from top → Draw at bottom; Look from left → Draw at right'
        },
        {
          title: 'The 45° Mitre Projection Line',
          description: 'Draw a 45° line from the intersection of X-Y and X1-Y1 datum lines to project depths from Plan into End Elevation with zero measurement error.',
          keyRule: 'Depth in Plan = Width in End Elevation'
        }
      ],
      formulas: [
        { latex: '\\text{Plan Position} = \\text{Directly BELOW Front Elevation}', description: 'First angle layout rule' },
        { latex: 'W_{end} = D_{plan}', description: 'Conservation of depth' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished outlines of Front, Plan, and End views' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Projection lines between views and 45° mitre line' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines and Ground Line (X-Y datum)' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Block Length (Front)',
        symbol: 'L',
        defaultValue: 140,
        min: 100,
        max: 200,
        step: 10,
        unit: 'mm',
        description: 'Length of the block in Front View'
      },
      {
        id: 'height',
        label: 'Block Height (Front)',
        symbol: 'H',
        defaultValue: 100,
        min: 70,
        max: 150,
        step: 10,
        unit: 'mm',
        description: 'Height of the block in Front View'
      },
      {
        id: 'width',
        label: 'Block Width (Plan Depth)',
        symbol: 'W',
        defaultValue: 80,
        min: 50,
        max: 120,
        step: 10,
        unit: 'mm',
        description: 'Width of the block seen in Plan'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ENGINEERING_5MM'
    },
    generateSteps: (params) => {
      const L = params.length || 140;
      const H = params.height || 100;
      const W = params.width || 80;

      const datumX = 380;
      const datumY = 300;
      const gap = 40;

      // Front View top-left
      const fx = datumX - gap - L;
      const fy = datumY - gap - H;

      // Plan View bottom-left
      const px = fx;
      const py = datumY + gap;

      // End View top-right
      const ex = datumX + gap;
      const ey = fy;

      return [
        {
          stepIndex: 1,
          title: 'Establish X-Y and X1-Y1 Reference Datum Axes',
          instruction: 'Rule horizontal Ground Line (X-Y) and perpendicular vertical line (X1-Y1) intersecting at O using T-square and set-square.',
          detailedNotes: 'Maintain 40mm clearance between each view and the datum axes for clean dimensioning space.',
          technicalPrinciple: 'Reference datum lines: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: datumX, y: datumY, visible: true },
          elements: [
            { id: 'datum-xy', type: 'LINE', lineWeight: 'THIN_CONTINUOUS', x1: 60, y1: datumY, x2: 740, y2: datumY },
            { id: 'datum-x1y1', type: 'LINE', lineWeight: 'THIN_CONTINUOUS', x1: datumX, y1: 50, x2: datumX, y2: 550 },
            { id: 'lbl-x', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 80, cy: datumY - 10, label: 'X' },
            { id: 'lbl-y', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 720, cy: datumY - 10, label: 'Y' },
            { id: 'lbl-x1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: datumX + 15, cy: 70, label: 'X1' },
            { id: 'lbl-y1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: datumX + 15, cy: 530, label: 'Y1' }
          ]
        },
        {
          stepIndex: 2,
          title: `Project Front Elevation (${L}×${H}mm) in Top-Left Quadrant`,
          instruction: `Draw Front Elevation rectangle of length ${L}mm and height ${H}mm with an HB pencil in the top-left quadrant.`,
          detailedNotes: 'Project vertical lines downward from Front Elevation into the Plan View area with 2H pencil.',
          technicalPrinciple: 'Front Elevation: Continuous Thick outline (HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: fx + L / 2, y: fy + H / 2, visible: true },
          elements: [
            { id: 'front-rect', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: fx, y1: fy, x2: fx + L, y2: fy, isFinalResult: true },
            { id: 'front-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: fx + L, y1: fy, x2: fx + L, y2: fy + H, isFinalResult: true },
            { id: 'front-b', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: fx + L, y1: fy + H, x2: fx, y2: fy + H, isFinalResult: true },
            { id: 'front-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: fx, y1: fy + H, x2: fx, y2: fy, isFinalResult: true },
            { id: 'proj-down1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: fx, y1: fy + H, x2: fx, y2: py + W + 20 },
            { id: 'proj-down2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: fx + L, y1: fy + H, x2: fx + L, y2: py + W + 20 },
            { id: 'lbl-front', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: fx + L / 2, cy: fy - 15, label: 'FRONT ELEVATION' }
          ]
        },
        {
          stepIndex: 3,
          title: `Draw Plan View (${L}×${W}mm) Directly Below Front Elevation`,
          instruction: `Using the downward projection lines, construct the Plan View with width ${W}mm in the lower-left quadrant.`,
          detailedNotes: 'The width of the Plan corresponds to looking directly down from above the Front Elevation.',
          technicalPrinciple: 'Plan View alignment: strictly matches Front Elevation x-coordinates.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: px, y: py, visible: true },
          elements: [
            { id: 'plan-rect', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px, y1: py, x2: px + L, y2: py, isFinalResult: true },
            { id: 'plan-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px + L, y1: py, x2: px + L, y2: py + W, isFinalResult: true },
            { id: 'plan-b', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px + L, y1: py + W, x2: px, y2: py + W, isFinalResult: true },
            { id: 'plan-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: px, y1: py + W, x2: px, y2: py, isFinalResult: true },
            { id: 'lbl-plan', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: px + L / 2, cy: py + W + 25, label: 'PLAN VIEW' },
            { id: 'mitre-line', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: datumX, y1: datumY, x2: datumX + 220, y2: datumY + 220 },
            { id: 'proj-to-mitre1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: px + L, y1: py, x2: datumX + gap, y2: py },
            { id: 'proj-to-mitre2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: px + L, y1: py + W, x2: datumX + gap + W, y2: py + W }
          ]
        },
        {
          stepIndex: 4,
          title: `Draw 45° Mitre Line and Project Left End Elevation (${W}×${H}mm)`,
          instruction: `Draw 45° mitre line from datum intersection O. Project horizontal depths from Plan to the mitre line, then vertically upward into the End Elevation.`,
          detailedNotes: 'Complete the End Elevation outline. Notice that its width exactly equals the Plan depth W without taking a ruler measurement.',
          technicalPrinciple: 'Mitre line projection: depth transferred automatically at 45° angle.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: datumX, y: datumY, visible: true },
          elements: [
            { id: 'end-t', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ex, y1: ey, x2: ex + W, y2: ey, isFinalResult: true },
            { id: 'end-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ex + W, y1: ey, x2: ex + W, y2: ey + H, isFinalResult: true },
            { id: 'end-b', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ex + W, y1: ey + H, x2: ex, y2: ey + H, isFinalResult: true },
            { id: 'end-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ex, y1: ey + H, x2: ex, y2: ey, isFinalResult: true },
            { id: 'lbl-end', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ex + W / 2, cy: ey - 15, label: 'END ELEVATION' },
            { id: 'proj-h1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: fx + L, y1: fy, x2: ex + W + 20, y2: fy },
            { id: 'proj-h2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: fx + L, y1: fy + H, x2: ex + W + 20, y2: fy + H }
          ]
        }
      ];
    }
  }
];
