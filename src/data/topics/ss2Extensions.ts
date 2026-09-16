import { DrawingTopic } from '../../types/curriculum';

export const ss2ExtensionTopics: DrawingTopic[] = [
  // SS2 Term 1 Week 7: Link Mechanisms Loci
  {
    id: 'ss2-link-mechanisms-loci',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 7,
    moduleCode: 'TD-SS2-T1-W07',
    title: 'Loci of Linkages: Slider-Crank Mechanism & Connecting Rod Point',
    shortDescription: 'Plot the egg-shaped or elliptical path traced by a point P on the connecting rod of an engine reciprocating slider-crank linkage.',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 5: Loci of Points on Mechanisms (Term 1)',
      waecRef: 'WAEC Syllabus Section A: Loci of Link Mechanisms',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'A slider-crank mechanism converts rotary motion into reciprocating linear motion (and vice-versa in internal combustion engines). As the crank pin rotates uniformly through 360°, the slider cross-head moves back and forth along the cylinder centerline. Any point P fixed on the connecting rod traces a distinctive closed continuous oval/egg-shaped locus curve.',
      historyAndApplication: 'J.N. Green Chapter 9, pp. 120–132 & Pickup & Parker Plate 17. Fundamental in automotive piston engines, reciprocating steam locomotives, compressor pumps, and shaper machine quick-return mechanisms.',
      waecAndNERDCNotes: 'Divide the circular crank pin path into 12 equal 30° sectors. For each crank position, strike an arc of connecting rod length to locate the slider on the centerline. Join plotted points P with a smooth French curve.',
      keyPrinciples: [
        {
          title: 'Kinematic Constraint of Slider',
          description: 'The slider endpoint B is strictly constrained to slide horizontally along the cylinder axis line.',
          keyRule: 'y_B = 0 at all crank angles theta'
        },
        {
          title: 'Point P Proportional Division',
          description: 'Point P divides connecting rod AB in a constant ratio AP : PB.',
          keyRule: 'P = A + (AP / AB) * (B - A)'
        }
      ],
      formulas: [
        { latex: 'x_A = r \\cos\\theta, \\quad y_A = r \\sin\\theta', description: 'Crank pin coordinates' },
        { latex: 'x_B = x_A + \\sqrt{L^2 - y_A^2}, \\quad y_B = 0', description: 'Slider displacement formula' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished closed locus path of point P' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Crank circle, 30° radial sectors, and connecting rod positions' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Stroke centerline through crank shaft and cross-head' }
      ]
    },
    parameters: [
      {
        id: 'crankRadius',
        label: 'Crank Radius (r)',
        symbol: 'r',
        defaultValue: 60,
        min: 40,
        max: 80,
        step: 5,
        unit: 'mm',
        description: 'Length of rotating crank arm OA'
      },
      {
        id: 'rodLength',
        label: 'Connecting Rod Length (L)',
        symbol: 'L',
        defaultValue: 180,
        min: 140,
        max: 240,
        step: 10,
        unit: 'mm',
        description: 'Length of connecting rod AB'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const r = params.crankRadius || 60;
      const L = params.rodLength || 180;
      const ox = 260;
      const oy = 300;

      // 12 crank stations
      const pointsP: [number, number][] = [];
      const crankPositions: { ax: number; ay: number; bx: number; by: number; px: number; py: number }[] = [];

      for (let i = 0; i < 12; i++) {
        const rad = (i * 30 * Math.PI) / 180;
        const ax = ox + r * Math.cos(rad);
        const ay = oy - r * Math.sin(rad); // canvas y downwards

        // Slider position along horizontal axis y = oy
        const dy = ay - oy;
        const dx = Math.sqrt(Math.max(0, L * L - dy * dy));
        const bx = ax + dx;
        const by = oy;

        // Point P at 40% from A to B
        const px = ax + 0.4 * (bx - ax);
        const py = ay + 0.4 * (by - ay);

        pointsP.push([px, py]);
        crankPositions.push({ ax, ay, bx, by, px, py });
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Crank Shaft Centerline and Crank Circle',
          instruction: `Draw horizontal stroke centerline through O. Strike crank circle of radius r = ${r}mm and divide into 12 equal 30° sectors using set-squares.`,
          detailedNotes: 'Label crank stations 0 through 11. Point 0 represents the Inner Dead Center (IDC) and point 6 represents Outer Dead Center (ODC).',
          technicalPrinciple: 'Datum geometry: Thin Chain centerline and Continuous Thin (0.25mm 2H) circle.',
          activeInstrument: { toolType: 'COMPASS', x: ox, y: oy, radius: r, visible: true },
          elements: [
            { id: 'stroke-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox - r - 40, y1: oy, x2: ox + r + L + 60, y2: oy },
            { id: 'crank-circ', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: r },
            { id: 'lbl-o', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 20, cy: oy + 20, label: 'O' },
            ...crankPositions.map((pos, idx) => ({
              id: `rad-${idx}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: ox,
              y1: oy,
              x2: pos.ax,
              y2: pos.ay
            }))
          ]
        },
        {
          stepIndex: 2,
          title: `Plot Connecting Rod Length L = ${L}mm for All 12 Positions`,
          instruction: `From each crank pin position A_i, swing compass arc of radius L = ${L}mm to intersect the centerline at slider crosshead B_i.`,
          detailedNotes: 'For each line A_i B_i, measure distance AP = 0.4 × L to locate point P_i.',
          technicalPrinciple: 'Position determination: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: crankPositions[1].ax, y: crankPositions[1].ay, radius: L, visible: true },
          elements: [
            { id: 'stroke-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox - r - 40, y1: oy, x2: ox + r + L + 60, y2: oy },
            { id: 'crank-circ', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: r },
            ...crankPositions.map((pos, idx) => ({
              id: `rod-${idx}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_2H' as const,
              x1: pos.ax,
              y1: pos.ay,
              x2: pos.bx,
              y2: pos.by
            })),
            ...crankPositions.map((pos, idx) => ({
              id: `pt-${idx}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pos.px,
              cy: pos.py,
              label: `P${idx}`,
              labelPosition: 'top' as const
            }))
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw the Smooth Continuous Locus of Point P',
          instruction: 'Connect all plotted points P0 through P11 using a French curve or flexible curve to form a smooth, unbroken locus loop.',
          detailedNotes: 'The resulting locus curve is an elongated closed profile characteristic of connecting rod motion.',
          technicalPrinciple: 'Finished locus curve: Continuous Thick line (0.5mm HB).',
          activeInstrument: { toolType: 'FRENCH_CURVE', x: pointsP[2][0], y: pointsP[2][1], visible: true },
          elements: [
            { id: 'stroke-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox - r - 40, y1: oy, x2: ox + r + L + 60, y2: oy },
            { id: 'crank-circ', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: r },
            { id: 'locus-p', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: pointsP, isFinalResult: true },
            { id: 'dim-r', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: oy, x2: ox + r, y2: oy, dimensionText: `r = ${r}mm` },
            { id: 'dim-l', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: crankPositions[3].ax, y1: crankPositions[3].ay, x2: crankPositions[3].bx, y2: crankPositions[3].by, dimensionText: `L = ${L}mm` }
          ]
        }
      ];
    }
  },

  // SS2 Term 2 Week 2: Scale of Chords
  {
    id: 'ss2-scale-of-chords',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 2,
    moduleCode: 'TD-SS2-T2-W02',
    title: 'Construction of a Scale of Chords (Angle Setting without Protractor)',
    shortDescription: 'Construct a calibrated Scale of Chords based on a 90° quadrant arc to measure and set any given angle using compass alone.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 6: Scales - Scale of Chords (Term 2)',
      waecRef: 'WAEC Syllabus Section A: Scale of Chords Compulsory',
      isoRef: 'ISO 5455: Scales in Technical Drawings'
    },
    theory: {
      overview: 'The Scale of Chords is a special geometric scale used to set out or measure angles of any magnitude without using a protractor. It is based on the mathematical principle that the chord length subtending an angle θ in a circle of radius R is directly given by Chord(θ) = 2R · sin(θ / 2). A quadrant of radius R (subtending 90°) is stepped off in 5° or 10° intervals and transferred to a straight datum line.',
      historyAndApplication: 'J.N. Green Chapter 6, pp. 78–83. Used historically by navigators, military gunners, structural fabricators, and stone masons to lay out precise angles in field conditions.',
      waecAndNERDCNotes: 'A major WAEC examination rule: when constructing an angle using a Scale of Chords, the radius used to strike the baseline arc MUST EQUAL the chord of 60° (since Chord 60° = 2R sin 30° = R).',
      keyPrinciples: [
        {
          title: 'Chord of 60° Identity',
          description: 'Chord 60° = 2 · R · sin(30°) = R. Therefore, the chord of 60° on the scale equals the exact generating radius R.',
          keyRule: 'Chord(60°) = R'
        },
        {
          title: 'Quadrant Division',
          description: 'A 90° quadrant arc is divided into 9 equal 10° divisions, and compass arcs centered at vertex A transfer chords to the horizontal scale bar.',
          keyRule: 'Transfer chord from quadrant arc to straight baseline'
        }
      ],
      formulas: [
        { latex: '\\text{Chord}(\\theta) = 2 R \\sin\\left(\\frac{\\theta}{2}\\right)', description: 'Chord formula' },
        { latex: '\\text{Chord}(60^\\circ) = R', description: 'Radius calibration identity' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished Scale of Chords rectangle and angle arms' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Quadrant arc, 10° division rays, and transfer swing arcs' }
      ]
    },
    parameters: [
      {
        id: 'radius',
        label: 'Quadrant Radius (R)',
        symbol: 'R',
        defaultValue: 180,
        min: 140,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Generating radius of the 90° quadrant'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const R = params.radius || 180;
      const ox = 150;
      const oy = 400;

      // 10 degree stations up to 90 degrees
      const angles = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
      const chordPoints = angles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const chordLen = 2 * R * Math.sin(rad / 2);
        return { deg, chordLen, x: ox + chordLen, y: oy };
      });

      return [
        {
          stepIndex: 1,
          title: 'Construct Right-Angle Quadrant OAB',
          instruction: `Draw perpendicular lines OA and OB of length R = ${R}mm. With center O and radius R, draw quadrant arc AB.`,
          detailedNotes: 'OA is horizontal along the baseline; OB is vertical at 90°. Arc AB covers exactly one quadrant.',
          technicalPrinciple: 'Reference quadrant: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: ox, y: oy, radius: R, visible: true },
          elements: [
            { id: 'line-oa', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + R, y2: oy },
            { id: 'line-ob', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox, y2: oy - R },
            { id: 'arc-ab', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: ox, cy: oy, r: R, startAngle: 270, endAngle: 360 },
            { id: 'lbl-o', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 15, cy: oy + 20, label: 'O' },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + R + 15, cy: oy + 20, label: 'A (0°)' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy - R - 15, label: 'B (90°)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Divide Quadrant Arc AB into Nine 10° Segments',
          instruction: 'Using compass bisection and 30°/60° set-squares, divide arc AB into 9 equal 10° intervals numbered 10° through 90°.',
          detailedNotes: 'Step arcs along the perimeter to locate stations 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°.',
          technicalPrinciple: 'Arc stepping: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'DIVIDER', x: ox + R, y: oy, visible: true },
          elements: [
            { id: 'line-oa', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + R, y2: oy },
            { id: 'line-ob', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox, y2: oy - R },
            { id: 'arc-ab', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: ox, cy: oy, r: R, startAngle: 270, endAngle: 360 },
            ...angles.slice(1).map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const px = ox + R * Math.cos(rad);
              const py = oy - R * Math.sin(rad);
              return {
                id: `div-${deg}`,
                type: 'POINT' as const,
                lineWeight: 'CONSTRUCTION_2H' as const,
                cx: px,
                cy: py,
                label: `${deg}°`,
                labelPosition: 'top' as const
              };
            })
          ]
        },
        {
          stepIndex: 3,
          title: 'Transfer Chords to the Scale Bar Centered at Vertex A',
          instruction: 'With compass center fixed at vertex A (0°), swing arcs from each point on arc AB down to the extended baseline to construct the graduated Scale of Chords.',
          detailedNotes: 'Draw the scale rectangle (height 12mm) and label graduations: 0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°.',
          technicalPrinciple: 'Scale calibration: Continuous Thick outline (HB) and graduated ticks.',
          activeInstrument: { toolType: 'COMPASS', x: ox + R, y: oy, radius: chordPoints[6].chordLen, visible: true },
          elements: [
            { id: 'scale-box', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: ox, y: oy + 40, width: chordPoints[9].chordLen, height: 16, isFinalResult: true },
            ...chordPoints.map((cp) => ({
              id: `tick-${cp.deg}`,
              type: 'LINE' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              x1: ox + cp.chordLen,
              y1: oy + 40,
              x2: ox + cp.chordLen,
              y2: oy + (cp.deg % 30 === 0 ? 56 : 48)
            })),
            ...chordPoints.map((cp) => ({
              id: `lbl-ch-${cp.deg}`,
              type: 'TEXT_LABEL' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: ox + cp.chordLen,
              cy: oy + 75,
              label: `${cp.deg}°`
            })),
            { id: 'title-scale', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: ox + chordPoints[9].chordLen / 2, cy: oy + 105, label: 'SCALE OF CHORDS' }
          ]
        }
      ];
    }
  },

  // SS2 Term 2 Week 4: Ellipse by Paper Trammel Method
  {
    id: 'ss2-ellipse-trammel',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 4,
    moduleCode: 'TD-SS2-T2-W04',
    title: 'Construction of an Ellipse by the Paper Trammel Method',
    shortDescription: 'Construct a precise mathematical ellipse using a calibrated paper trammel strip marked with semi-major (a) and semi-minor (b) axes.',
    category: 'CONIC_SECTIONS',
    standards: {
      nerdcRef: 'SS2 TD Unit 4: Conic Sections - Ellipse by Trammel (Term 2)',
      waecRef: 'WAEC Syllabus Section A: Ellipse by Trammel Method',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'The trammel method is a kinematically exact method for generating points on an ellipse. A straight strip of stiff paper or card (trammel) has three points marked along one edge: P (plotting trace point), Q (at distance b = semi-minor axis), and R (at distance a = semi-major axis from P). When point Q is constrained to slide along the major axis and point R along the minor axis, point P strictly traces a true ellipse.',
      historyAndApplication: 'J.N. Green Chapter 8, pp. 108–114. Widely used in carpentry for drawing elliptical arch centering, boat hull framing, pipe flange templates, and sheet metal fabrication where large compasses are impractical.',
      waecAndNERDCNotes: 'The paper trammel strip must be clearly illustrated beside the drawing showing markings P, Q, R with dimensions a and b labeled. Plot at least 16 points around the four quadrants.',
      keyPrinciples: [
        {
          title: 'Trammel Marking Rule',
          description: 'On a straight edge: PQ = semi-minor axis b, PR = semi-major axis a. Q lies on major axis AB; R lies on minor axis CD.',
          keyRule: 'PQ = b, PR = a, QR = a - b'
        },
        {
          title: 'Trigonometric Equivalence',
          description: 'When R has coordinates (0, a sin θ) and Q has coordinates (b cos θ, 0), point P is located at (a cos θ, b sin θ), satisfying x²/a² + y²/b² = 1.',
          keyRule: 'x = a cos(\\theta), y = b sin(\\theta)'
        }
      ],
      formulas: [
        { latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1', description: 'Cartesian equation of ellipse' },
        { latex: 'PR = a, \\quad PQ = b', description: 'Trammel segment lengths' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished smooth elliptical curve through plotted points' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Major and minor axes AB and CD' }
      ]
    },
    parameters: [
      {
        id: 'majorAxis',
        label: 'Major Axis Length (2a)',
        symbol: '2a',
        defaultValue: 280,
        min: 200,
        max: 360,
        step: 20,
        unit: 'mm',
        description: 'Total length of major axis AB'
      },
      {
        id: 'minorAxis',
        label: 'Minor Axis Length (2b)',
        symbol: '2b',
        defaultValue: 160,
        min: 100,
        max: 220,
        step: 20,
        unit: 'mm',
        description: 'Total length of minor axis CD'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const major = params.majorAxis || 280;
      const minor = params.minorAxis || 160;
      const a = major / 2;
      const b = minor / 2;
      const cx = 400;
      const cy = 300;

      // Generate 16 trammel points
      const trammelPoints: [number, number][] = [];
      for (let i = 0; i < 16; i++) {
        const rad = (i * 22.5 * Math.PI) / 180;
        trammelPoints.push([cx + a * Math.cos(rad), cy - b * Math.sin(rad)]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Major and Minor Axes AB and CD Perpendicularly',
          instruction: `Rule horizontal major axis AB = ${major}mm and vertical minor axis CD = ${minor}mm intersecting at center O using T-square and set-square.`,
          detailedNotes: 'Ensure both axes bisect each other at exact 90° right angles with 2H thin chain lines.',
          technicalPrinciple: 'Perpendicular axes setup: Thin Chain centerline (0.25mm 2H).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: cx, y: cy, visible: true },
          elements: [
            { id: 'axis-maj', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx - a - 30, y1: cy, x2: cx + a + 30, y2: cy },
            { id: 'axis-min', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - b - 30, x2: cx, y2: cy + b + 30 },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx - a - 15, cy: cy + 5, label: 'A' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx + a + 15, cy: cy + 5, label: 'B' },
            { id: 'lbl-c', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy - b - 15, label: 'C' },
            { id: 'lbl-d', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy + b + 20, label: 'D' }
          ]
        },
        {
          stepIndex: 2,
          title: `Prepare and Calibrate Paper Trammel Strip (PQ = ${b}mm, PR = ${a}mm)`,
          instruction: `Cut a clean straight paper strip. Mark trace point P at one end, mark point Q at distance ${b}mm from P, and point R at distance ${a}mm from P.`,
          detailedNotes: 'Illustrate the paper trammel strip alongside the axes to show the examiner how the tool is constructed.',
          technicalPrinciple: 'Trammel instrument calibration: clear dimension markings.',
          activeInstrument: { toolType: 'RULER', x: 100, y: 500, visible: true },
          elements: [
            { id: 'axis-maj', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx - a - 30, y1: cy, x2: cx + a + 30, y2: cy },
            { id: 'axis-min', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - b - 30, x2: cx, y2: cy + b + 30 },
            // Illustrated Trammel Strip at bottom
            { id: 'trammel-strip', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: 100, y: 510, width: a + 40, height: 25 },
            { id: 'lbl-p-strip', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 105, cy: 528, label: 'P' },
            { id: 'lbl-q-strip', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 100 + b, cy: 528, label: 'Q' },
            { id: 'lbl-r-strip', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 100 + a, cy: 528, label: 'R' },
            { id: 'dim-b-strip', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 100, y1: 545, x2: 100 + b, y2: 545, dimensionText: `b=${b}` },
            { id: 'dim-a-strip', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 100, y1: 565, x2: 100 + a, y2: 565, dimensionText: `a=${a}` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Plot Ellipse Points and Draw Finished Profile with French Curve',
          instruction: 'Slide point Q along the vertical axis and point R along the horizontal axis, marking point P at each position. Join points with a smooth HB curve.',
          detailedNotes: 'Connect all 16 plotted points around the four quadrants using a French curve to form an authentic, fair ellipse.',
          technicalPrinciple: 'Finished ellipse curve: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'FRENCH_CURVE', x: trammelPoints[2][0], y: trammelPoints[2][1], visible: true },
          elements: [
            { id: 'axis-maj', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx - a - 30, y1: cy, x2: cx + a + 30, y2: cy },
            { id: 'axis-min', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - b - 30, x2: cx, y2: cy + b + 30 },
            { id: 'ellipse-trammel', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: trammelPoints, isFinalResult: true },
            ...trammelPoints.map((pt, idx) => ({
              id: `pt-tr-${idx}`,
              type: 'POINT' as const,
              lineWeight: 'CONSTRUCTION_2H' as const,
              cx: pt[0],
              cy: pt[1]
            }))
          ]
        }
      ];
    }
  },

  // SS2 Term 2 Week 6: First-Angle Orthographic Projection (ISO 5456-2 / NERDC)
  {
    id: 'ss2-orthographic-first-angle',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 6,
    moduleCode: 'TD-SS2-T2-W06',
    title: 'First-Angle Orthographic Projection (ISO 5456-2 / NERDC)',
    shortDescription: 'Project Front Elevation, Plan (below Front), and Left End Elevation (on Right) of a mechanical component using ISO 5456-2 and ISO 128 standards.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 6: Orthographic Projections (First-Angle ISO Standard)',
      waecRef: 'WAEC Syllabus Section B: Compulsory Orthographic Drawing Question',
      isoRef: 'ISO 5456-2 & ISO 128: Technical Product Documentation'
    },
    theory: {
      overview: 'In First-Angle Projection (ISO 5456-2 / British & NERDC standard), the object is positioned between the observer and the plane of projection. The views are projected THROUGH the object onto the plane behind it. Consequently: the Front Elevation is drawn in the upper left; the Plan (viewed from ABOVE) is projected BELOW the Front Elevation; and the End Elevation viewed from the LEFT is projected onto the profile plane to the RIGHT of the Front Elevation.',
      historyAndApplication: 'Adopted throughout Commonwealth nations, Europe, and Nigeria (NERDC/WAEC). Fundamental across structural, aerospace, and mechanical engineering drawings.',
      waecAndNERDCNotes: 'WAEC Section B strictly penalizes incorrect view arrangement. The Plan must NEVER be placed above the Front Elevation in First-Angle questions. Centerlines (Chain Thin) and hidden detail (Dashed Thin) must be precisely shown, and the truncated cone projection symbol must be drawn in the title block.',
      keyPrinciples: [
        {
          title: 'Spatial Principle of First Angle',
          description: 'The object lies between the eye of the observer and the plane of projection. What you see from the top is drawn on the bottom.',
          keyRule: 'Observer → Object → Projection Plane (Plan below Front)'
        },
        {
          title: '45° Mitre Line Depth Transfer',
          description: 'Depths from the Plan view are accurately transferred to the End Elevation via horizontal projection rays reflected off a 45° mitre line.',
          keyRule: 'Plan Depth = End Elevation Depth (via 45° line)'
        },
        {
          title: 'ISO 128 Line Hierarchy',
          description: 'Continuous Thick (0.5mm HB) for visible edges; Dashed Thin (0.25mm 2H) for hidden internal details; Chain Thin (0.25mm 2H) for axes of symmetry.',
          keyRule: 'Outlines (0.5mm) > Hidden (0.25mm dashed) > Centerlines (chain)'
        }
      ],
      formulas: [
        { latex: 'X_{end} = X_{origin} + Y_{plan} \\quad (\\text{via } 45^\\circ \\text{ mitre})', description: 'Coordinate transfer relationship between orthogonal planes' },
        { latex: 'H_{front} = H_{end}, \\quad W_{front} = W_{plan}', description: 'Dimensional conservation across adjacent elevations' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.50mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible outlines of all orthographic views' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Projection rays, 45° mitre transfer lines, and dimension lines' },
        { lineName: 'Dashed Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Hidden internal holes, keyways, and stepped shoulders' },
        { lineName: 'Chain Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines of circular bores and symmetric axes' }
      ]
    },
    parameters: [
      {
        id: 'compW',
        label: 'Component Width (W)',
        symbol: 'W',
        defaultValue: 90,
        min: 70,
        max: 120,
        step: 5,
        unit: 'mm',
        description: 'Overall horizontal width of the component'
      },
      {
        id: 'compH',
        label: 'Component Height (H)',
        symbol: 'H',
        defaultValue: 80,
        min: 60,
        max: 100,
        step: 5,
        unit: 'mm',
        description: 'Overall vertical height of the upright step'
      },
      {
        id: 'compD',
        label: 'Component Depth (D)',
        symbol: 'D',
        defaultValue: 60,
        min: 45,
        max: 80,
        step: 5,
        unit: 'mm',
        description: 'Overall depth from front to rear'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const W = params.compW || 90;
      const H = params.compH || 80;
      const D = params.compD || 60;
      const scale = 2.0;

      const sW = W * scale;
      const sH = H * scale;
      const sD = D * scale;
      const baseH = 20 * scale;
      const upW = 25 * scale;
      const holeR = 12 * scale;
      const holeCX = sW - 35 * scale;

      // Layout origin points
      const originX = 180;
      const originY = 240;
      const planTopY = originY + 40;
      const endLeftX = originX + sW + 50;

      return [
        {
          stepIndex: 1,
          title: 'Establish Reference Datum Axes (X-Y and X1-Y1) and 45° Mitre Ray',
          instruction: 'Draw horizontal reference line X-Y and vertical ground line X1-Y1 intersecting at the origin. Draw the 45° mitre line through the origin into the lower right quadrant.',
          detailedNotes: 'The 45° mitre line ensures exact geometrical depth transfer between the Plan and the End Elevation without manual measurement.',
          technicalPrinciple: 'Datum lines: Chain Thin (0.25mm); 45° Mitre ray: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: endLeftX, y: planTopY, visible: true },
          elements: [
            // Principal horizontal datum line X-Y
            { id: 'datum-xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 60, y1: originY, x2: 740, y2: originY },
            { id: 'lbl-x', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 70, cy: originY - 10, label: 'X' },
            { id: 'lbl-y', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 730, cy: originY - 10, label: 'Y' },
            // Principal vertical datum line X1-Y1
            { id: 'datum-x1y1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: endLeftX - 25, y1: 40, x2: endLeftX - 25, y2: 560 },
            { id: 'lbl-x1', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: endLeftX - 25, cy: 50, label: 'X1' },
            { id: 'lbl-y1', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: endLeftX - 25, cy: 550, label: 'Y1' },
            // 45 degree mitre line in bottom-right quadrant
            { id: 'mitre-line', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: endLeftX - 25, y1: planTopY, x2: endLeftX - 25 + sD + 40, y2: planTopY + sD + 40 },
            { id: 'lbl-mitre', type: 'TEXT_LABEL', lineWeight: 'CONSTRUCTION_2H', cx: endLeftX + 30, cy: planTopY + 50, label: '45° MITRE LINE' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Project Front Elevation in Top-Left Quadrant',
          instruction: 'Draw the stepped L-profile of the front elevation resting on the horizontal datum. Insert hidden lines and centerline for the Ø24mm cylindrical hole.',
          detailedNotes: 'Front Elevation shows full width W and full height H. The vertical upright has thickness 25mm, base step has thickness 20mm.',
          technicalPrinciple: 'Visible outlines: Continuous Thick (0.50mm HB); Hidden hole edges: Dashed Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: originX, y: originY, visible: true },
          elements: [
            { id: 'datum-xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 60, y1: originY, x2: 740, y2: originY },
            // Front Elevation Outlines
            {
              id: 'front-outline',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [originX, originY],
                [originX + sW, originY],
                [originX + sW, originY - baseH],
                [originX + upW, originY - baseH],
                [originX + upW, originY - sH],
                [originX, originY - sH]
              ]
            },
            // Hidden lines for through-hole in base
            { id: 'front-hole-hid1', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: originX + holeCX - holeR, y1: originY - baseH, x2: originX + holeCX - holeR, y2: originY },
            { id: 'front-hole-hid2', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: originX + holeCX + holeR, y1: originY - baseH, x2: originX + holeCX + holeR, y2: originY },
            // Hole Centerline
            { id: 'front-hole-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX, y1: originY - baseH - 10, x2: originX + holeCX, y2: originY + 10 },
            { id: 'lbl-front-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: originX + sW / 2, cy: originY - sH - 15, label: 'FRONT ELEVATION' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Plan View Directly Below Front Elevation',
          instruction: 'Drop vertical thin projection rays down from every edge of the Front Elevation. Construct the rectangular Plan with through-hole circle and centerlines.',
          detailedNotes: 'In First-Angle projection, the Plan MUST lie directly below the Front Elevation. The circular hole appears true shape in the Plan.',
          technicalPrinciple: 'Vertical projectors: Continuous Thin (0.25mm); Circle: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'COMPASS', x: originX + holeCX, y: planTopY + sD / 2, visible: true },
          elements: [
            // Vertical Projectors from Front to Plan
            { id: 'proj-v1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX, y1: originY, x2: originX, y2: planTopY + sD },
            { id: 'proj-v2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + upW, y1: originY - baseH, x2: originX + upW, y2: planTopY + sD },
            { id: 'proj-v3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + sW, y1: originY, x2: originX + sW, y2: planTopY + sD },
            // Plan Outlines
            { id: 'plan-box', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: originX, y: planTopY, width: sW, height: sD },
            { id: 'plan-step-line', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: originX + upW, y1: planTopY, x2: originX + upW, y2: planTopY + sD },
            // Circular hole in plan
            { id: 'plan-hole', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: originX + holeCX, cy: planTopY + sD / 2, r: holeR },
            // Centerlines for hole
            { id: 'plan-cl-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX - holeR - 15, y1: planTopY + sD / 2, x2: originX + holeCX + holeR + 15, y2: planTopY + sD / 2 },
            { id: 'plan-cl-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX, y1: planTopY + sD / 2 - holeR - 15, x2: originX + holeCX, y2: planTopY + sD / 2 + holeR + 15 },
            { id: 'lbl-plan-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: originX + sW / 2, cy: planTopY + sD + 25, label: 'PLAN (TOP VIEW)' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Transfer Depths via 45° Mitre Ray and Construct Left End Elevation',
          instruction: 'Project horizontal rays from the Plan to the 45° mitre line, reflect them vertically into the profile plane, and combine with horizontal rays from the Front Elevation.',
          detailedNotes: 'Viewed from the left, the End Elevation shows the profile with upright at rear, step at front, and hidden hole lines.',
          technicalPrinciple: 'Mitre reflection: exact 45° ray direction reversal; Outlines: 0.50mm HB.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: endLeftX, y: originY, visible: true },
          elements: [
            // Horizontal rays from Plan to Mitre
            { id: 'ray-m1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + sW, y1: planTopY, x2: endLeftX - 25, y2: planTopY },
            { id: 'ray-m2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + sW, y1: planTopY + sD, x2: endLeftX - 25 + sD, y2: planTopY + sD },
            // Vertical rays up from Mitre to End Elevation
            { id: 'ray-up1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: endLeftX, y1: planTopY, x2: endLeftX, y2: originY - sH },
            { id: 'ray-up2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: endLeftX + sD, y1: planTopY + sD, x2: endLeftX + sD, y2: originY - sH },
            // End Elevation Outlines
            {
              id: 'end-outline',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [endLeftX, originY],
                [endLeftX + sD, originY],
                [endLeftX + sD, originY - sH],
                [endLeftX + sD - upW, originY - sH],
                [endLeftX + sD - upW, originY - baseH],
                [endLeftX, originY - baseH]
              ],
              isFinalResult: true
            },
            // Hidden detail lines in End Elevation for hole
            { id: 'end-hole-hid1', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: endLeftX + sD / 2 - holeR, y1: originY - baseH, x2: endLeftX + sD / 2 - holeR, y2: originY },
            { id: 'end-hole-hid2', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: endLeftX + sD / 2 + holeR, y1: originY - baseH, x2: endLeftX + sD / 2 + holeR, y2: originY },
            { id: 'end-hole-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: endLeftX + sD / 2, y1: originY - baseH - 10, x2: endLeftX + sD / 2, y2: originY + 10 },
            { id: 'lbl-end-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: endLeftX + sD / 2, cy: originY - sH - 15, label: 'LEFT END ELEVATION' }
          ]
        },
        {
          stepIndex: 5,
          title: 'Render ISO 5456 Truncated Cone Projection Symbol in Standard Title Block',
          instruction: 'Draw the standard First-Angle projection symbol: the frustum of a cone with small face on the left, followed by concentric circles on the right.',
          detailedNotes: 'WAEC criteria award critical marks for the correct orientation of this symbol in the bottom right corner of technical drawing sheets.',
          technicalPrinciple: 'Cone frustum left, circles right: First-Angle ISO 5456-2 symbol.',
          activeInstrument: { toolType: 'PENCIL_HB', x: 650, y: 530, visible: true },
          elements: [
            // Title block box in bottom right
            { id: 'tb-box', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: 520, y: 480, width: 220, height: 80 },
            { id: 'tb-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 630, cy: 498, label: 'ISO 5456-2 PROJECTION SYMBOL' },
            // Centerline through symbol
            { id: 'sym-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 540, y1: 535, x2: 720, y2: 535 },
            // Frustum on Left
            {
              id: 'sym-frustum',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [555, 545],
                [585, 553],
                [585, 517],
                [555, 525]
              ]
            },
            { id: 'sym-frust-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: 555, y1: 525, x2: 555, y2: 545 },
            { id: 'sym-frust-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: 585, y1: 517, x2: 585, y2: 553 },
            // Concentric Circles on Right
            { id: 'sym-c-outer', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: 645, cy: 535, r: 18 },
            { id: 'sym-c-inner', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: 645, cy: 535, r: 10 },
            { id: 'sym-c-vcl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 645, y1: 510, x2: 645, y2: 560 },
            { id: 'lbl-1st-ang', type: 'TEXT_LABEL', lineWeight: 'CONSTRUCTION_2H', cx: 630, cy: 570, label: 'FIRST ANGLE (NERDC / WAEC)' }
          ]
        }
      ];
    }
  },

  // SS2 Term 2 Week 8: Third-Angle Orthographic Projection (ANSI / ISO 5456-3)
  {
    id: 'ss2-orthographic-third-angle',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 8,
    moduleCode: 'TD-SS2-T2-W08',
    title: 'Third-Angle Orthographic Projection & Conversion (ANSI / ISO 5456-3)',
    shortDescription: 'Construct the Plan (above Front), Front Elevation, and Right End Elevation with ANSI/ISO 5456-3 layout rules and truncated cone symbol.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 6.2: Third-Angle Projection Principles',
      waecRef: 'WAEC Section B: Alternative Projection Systems & International Standards',
      isoRef: 'ISO 5456-3 & ANSI Y14.3: Multi-View Projections'
    },
    theory: {
      overview: 'In Third-Angle Projection (ANSI Y14.3 / ISO 5456-3), the projection plane lies between the observer and the object. The projection plane is imagined as a transparent glass box. The observer looks at the top of the object THROUGH the top glass plane, so the Plan is drawn ABOVE the Front Elevation. The Right End Elevation is projected onto the right glass plane, drawn to the RIGHT of the Front Elevation.',
      historyAndApplication: 'Standard engineering convention in the United States, Canada, Japan, and internationally across automotive and heavy machinery manufacturing.',
      waecAndNERDCNotes: 'A frequent exam question asks candidates to convert a given First-Angle drawing into Third-Angle or identify the projection angle from the symbol. Note the inverted layout: Plan is at TOP; Front is below Plan.',
      keyPrinciples: [
        {
          title: 'Glass Box Analogy',
          description: 'The plane of projection is between the observer and the object. Looking from the top draws on the top.',
          keyRule: 'Observer → Plane → Object (Plan ABOVE Front)'
        },
        {
          title: 'Direct View Placement',
          description: 'Right view is on the right; left view is on the left; top view is on the top.',
          keyRule: 'Natural alignment of line of sight and drawing sheet'
        },
        {
          title: 'Symbol Reversal',
          description: 'In the Third-Angle symbol, the concentric circles are on the LEFT, and the truncated cone frustum is on the RIGHT.',
          keyRule: 'Circles Left, Frustum Right = Third-Angle'
        }
      ],
      formulas: [
        { latex: 'Y_{plan} < Y_{front} \\quad (\\text{Invert vertical axis for Plan above Front})', description: 'Third-Angle vertical sheet allocation rule' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.50mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible outlines of all orthographic views' },
        { lineName: 'Dashed Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Hidden internal details' },
        { lineName: 'Chain Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines' }
      ]
    },
    parameters: [
      {
        id: 'compW',
        label: 'Component Width (W)',
        symbol: 'W',
        defaultValue: 90,
        min: 70,
        max: 120,
        step: 5,
        unit: 'mm',
        description: 'Overall width'
      },
      {
        id: 'compH',
        label: 'Component Height (H)',
        symbol: 'H',
        defaultValue: 80,
        min: 60,
        max: 100,
        step: 5,
        unit: 'mm',
        description: 'Overall height'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const W = params.compW || 90;
      const H = params.compH || 80;
      const scale = 2.0;

      const sW = W * scale;
      const sH = H * scale;
      const sD = 60 * scale;
      const baseH = 20 * scale;
      const upW = 25 * scale;
      const holeR = 12 * scale;
      const holeCX = sW - 35 * scale;

      const originX = 180;
      const planTopY = 80;
      const frontTopY = planTopY + sD + 40;
      const endLeftX = originX + sW + 50;

      return [
        {
          stepIndex: 1,
          title: 'Establish Layout Planes with Plan ABOVE Front Elevation',
          instruction: 'Allocate the upper region of the drawing sheet for the Plan View and the lower region for the Front Elevation. Draw reference projection guides.',
          detailedNotes: 'Third-Angle places the Plan View on the top sheet zone because the observer looks down through the top glass pane.',
          technicalPrinciple: 'Third-Angle datum positioning: Plan above Front.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: originX, y: frontTopY, visible: true },
          elements: [
            { id: 'plan-box-guide', type: 'RECTANGLE', lineWeight: 'CONSTRUCTION_2H', x: originX, y: planTopY, width: sW, height: sD },
            { id: 'front-box-guide', type: 'RECTANGLE', lineWeight: 'CONSTRUCTION_2H', x: originX, y: frontTopY, width: sW, height: sH },
            { id: 'lbl-guide-p', type: 'TEXT_LABEL', lineWeight: 'CONSTRUCTION_2H', cx: originX + sW / 2, cy: planTopY - 10, label: 'PLAN VIEW ZONE (TOP)' },
            { id: 'lbl-guide-f', type: 'TEXT_LABEL', lineWeight: 'CONSTRUCTION_2H', cx: originX + sW / 2, cy: frontTopY - 10, label: 'FRONT ELEVATION ZONE (BELOW)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct the Plan View in the Top Zone',
          instruction: 'Draw the finished outlines of the Plan View in the top zone with upright crest, base step, and Ø24mm circular bore.',
          detailedNotes: 'Outlines drawn in Continuous Thick (0.5mm HB). The bore is centered at 35mm from the right edge.',
          technicalPrinciple: 'Plan features projected onto top horizontal plane.',
          activeInstrument: { toolType: 'COMPASS', x: originX + holeCX, y: planTopY + sD / 2, visible: true },
          elements: [
            { id: 'plan-box', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: originX, y: planTopY, width: sW, height: sD },
            { id: 'plan-step-line', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: originX + upW, y1: planTopY, x2: originX + upW, y2: planTopY + sD },
            { id: 'plan-hole', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: originX + holeCX, cy: planTopY + sD / 2, r: holeR },
            { id: 'plan-cl-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX - holeR - 15, y1: planTopY + sD / 2, x2: originX + holeCX + holeR + 15, y2: planTopY + sD / 2 },
            { id: 'plan-cl-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX, y1: planTopY + sD / 2 - holeR - 15, x2: originX + holeCX, y2: planTopY + sD / 2 + holeR + 15 },
            { id: 'lbl-plan', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: originX + sW / 2, cy: planTopY + sD + 20, label: 'PLAN (TOP VIEW)' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Front Elevation Directly Below Plan View',
          instruction: 'Drop projection rays down from the Plan View to construct the Front Elevation below it, showing the L-profile and hidden hole lines.',
          detailedNotes: 'Projectors maintain perfect 1:1 alignment between Plan and Front Elevation.',
          technicalPrinciple: 'Front Elevation placed directly under Plan view.',
          activeInstrument: { toolType: 'SET_SQUARE_30_60', x: originX + holeCX, y: frontTopY, visible: true },
          elements: [
            // Vertical projection rays
            { id: 'proj-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX, y1: planTopY + sD, x2: originX, y2: frontTopY + sH },
            { id: 'proj-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + upW, y1: planTopY + sD, x2: originX + upW, y2: frontTopY + sH },
            { id: 'proj-3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: originX + sW, y1: planTopY + sD, x2: originX + sW, y2: frontTopY + sH },
            // Front Outlines
            {
              id: 'front-outline',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [originX, frontTopY + sH],
                [originX + sW, frontTopY + sH],
                [originX + sW, frontTopY + sH - baseH],
                [originX + upW, frontTopY + sH - baseH],
                [originX + upW, frontTopY],
                [originX, frontTopY]
              ]
            },
            // Hidden hole details
            { id: 'front-hid-1', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: originX + holeCX - holeR, y1: frontTopY + sH - baseH, x2: originX + holeCX - holeR, y2: frontTopY + sH },
            { id: 'front-hid-2', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: originX + holeCX + holeR, y1: frontTopY + sH - baseH, x2: originX + holeCX + holeR, y2: frontTopY + sH },
            { id: 'front-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: originX + holeCX, y1: frontTopY + sH - baseH - 10, x2: originX + holeCX, y2: frontTopY + sH + 10 },
            { id: 'lbl-front', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: originX + sW / 2, cy: frontTopY + sH + 25, label: 'FRONT ELEVATION' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Construct Right End Elevation on the Right Side of Front Elevation',
          instruction: 'Viewed from the right, project horizontal rays across from the Front Elevation and transfer depths to complete the Right End Elevation.',
          detailedNotes: 'In Third-Angle, the view from the right is placed to the right of the front elevation.',
          technicalPrinciple: 'Right view on Right side of Front view.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: endLeftX, y: frontTopY + sH, visible: true },
          elements: [
            // End Elevation Outlines
            {
              id: 'end-outline',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [endLeftX, frontTopY + sH],
                [endLeftX + sD, frontTopY + sH],
                [endLeftX + sD, frontTopY],
                [endLeftX + sD - upW, frontTopY],
                [endLeftX + sD - upW, frontTopY + sH - baseH],
                [endLeftX, frontTopY + sH - baseH]
              ],
              isFinalResult: true
            },
            { id: 'end-hid-1', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: endLeftX + sD / 2 - holeR, y1: frontTopY + sH - baseH, x2: endLeftX + sD / 2 - holeR, y2: frontTopY + sH },
            { id: 'end-hid-2', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: endLeftX + sD / 2 + holeR, y1: frontTopY + sH - baseH, x2: endLeftX + sD / 2 + holeR, y2: frontTopY + sH },
            { id: 'end-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: endLeftX + sD / 2, y1: frontTopY - 10, x2: endLeftX + sD / 2, y2: frontTopY + sH + 10 },
            { id: 'lbl-end', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: endLeftX + sD / 2, cy: frontTopY + sH + 25, label: 'RIGHT END ELEVATION' }
          ]
        },
        {
          stepIndex: 5,
          title: 'Render ANSI / ISO 5456-3 Third-Angle Projection Symbol in Title Box',
          instruction: 'Draw the standard Third-Angle projection symbol: concentric circles on the left and truncated cone frustum on the right.',
          detailedNotes: 'The Third-Angle symbol is the exact horizontal mirror-concept of First-Angle.',
          technicalPrinciple: 'Concentric circles left, frustum right: ANSI / ISO 5456-3 symbol.',
          activeInstrument: { toolType: 'PENCIL_HB', x: 650, y: 530, visible: true },
          elements: [
            { id: 'tb-box-3', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: 520, y: 480, width: 220, height: 80 },
            { id: 'tb-title-3', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 630, cy: 498, label: 'ISO 5456-3 / ANSI SYMBOL' },
            { id: 'sym-cl-3', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 540, y1: 535, x2: 720, y2: 535 },
            // Concentric Circles on Left
            { id: 'sym-c-outer-3', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: 580, cy: 535, r: 18 },
            { id: 'sym-c-inner-3', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: 580, cy: 535, r: 10 },
            { id: 'sym-c-vcl-3', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 580, y1: 510, x2: 580, y2: 560 },
            // Frustum on Right
            {
              id: 'sym-frustum-3',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [640, 553],
                [670, 545],
                [670, 525],
                [640, 517]
              ]
            },
            { id: 'sym-frust-l-3', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: 640, y1: 517, x2: 640, y2: 553 },
            { id: 'sym-frust-r-3', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: 670, y1: 525, x2: 670, y2: 545 },
            { id: 'lbl-3rd-ang', type: 'TEXT_LABEL', lineWeight: 'CONSTRUCTION_2H', cx: 630, cy: 570, label: 'THIRD ANGLE (ANSI / NORTH AMERICAN)' }
          ]
        }
      ];
    }
  },

  // SS2 Term 3 Week 1: Auxiliary Projections
  {
    id: 'ss2-auxiliary-projections',
    tier: 'SS2',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 1,
    moduleCode: 'TD-SS2-T3-W01',
    title: 'Auxiliary Elevations & Plans of Inclined Solids (Prism & Pyramid)',
    shortDescription: 'Project the true shape and auxiliary views of an inclined hexagonal prism or truncated pyramid onto an auxiliary datum line X1-Y1.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 7: Auxiliary Views and Projections (Term 3)',
      waecRef: 'WAEC Syllabus Section A: Auxiliary Elevations Compulsory',
      isoRef: 'ISO 5456-2: Orthographic Projections'
    },
    theory: {
      overview: 'When a solid has inclined surfaces that are not parallel to either the Principal Vertical Plane (VP) or Horizontal Plane (HP), those surfaces appear foreshortened in standard Front and Plan views. An Auxiliary View is projected onto a new reference plane (X1-Y1) set parallel or perpendicular to the inclined feature to reveal its true shape, true length, or unobstructed profile.',
      historyAndApplication: 'J.N. Green Chapter 12, pp. 180–192 & Pickup & Parker Plate 24. Crucial for designing bevel brackets, hopper chutes, roof hips and valleys, and aircraft wing skin ribs.',
      waecAndNERDCNotes: 'The auxiliary datum line X1-Y1 is drawn at the specified angle (e.g. 45° or 30°). Projection rays from the Plan view MUST be drawn strictly perpendicular (90°) to X1-Y1 using set-squares. Transfer heights directly from the Front Elevation above the X-Y line.',
      keyPrinciples: [
        {
          title: 'Projectors Perpendicular to Auxiliary Datum',
          description: 'All projection rays from the Plan view must be drawn strictly at 90° to the auxiliary datum line X1-Y1.',
          keyRule: 'Projectors ⊥ X1-Y1'
        },
        {
          title: 'Conservation of Height',
          description: 'Distances of points above X1-Y1 in the Auxiliary Elevation equal the exact distances of corresponding points above X-Y in the Front Elevation.',
          keyRule: 'Height above X1-Y1 = Height above X-Y'
        }
      ],
      formulas: [
        { latex: 'z_{aux} = z_{front}', description: 'Height invariance across elevation planes' },
        { latex: '\\theta_{proj} = \\theta_{datum} + 90^\\circ', description: 'Perpendicular projection angle' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible outlines of the Auxiliary Elevation' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Perpendicular projection rays to X1-Y1' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Principal datum X-Y and auxiliary datum X1-Y1' }
      ]
    },
    parameters: [
      {
        id: 'auxAngle',
        label: 'Auxiliary Plane Inclination Angle',
        symbol: 'θ',
        defaultValue: 45,
        min: 30,
        max: 60,
        step: 5,
        unit: 'deg',
        description: 'Angle of auxiliary datum line X1-Y1 to the horizontal'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const angle = params.auxAngle || 45;
      const xyY = 280;
      const planX = 220;
      const planY = 380;
      const frontX = 220;
      const frontY = 240;
      const width = 120;
      const height = 100;

      // Auxiliary datum line setup at angle theta
      const rad = (angle * Math.PI) / 180;
      const auxX = 460;
      const auxY = 220;
      const auxLen = 300;

      const x1 = auxX - (auxLen / 2) * Math.cos(rad);
      const y1 = auxY + (auxLen / 2) * Math.sin(rad);
      const x2 = auxX + (auxLen / 2) * Math.cos(rad);
      const y2 = auxY - (auxLen / 2) * Math.sin(rad);

      // Normal direction for auxiliary projectors: (sin(rad), cos(rad))
      const nx = Math.sin(rad);
      const ny = Math.cos(rad);

      return [
        {
          stepIndex: 1,
          title: 'Draw Given Front Elevation and Plan Views',
          instruction: 'Draw the horizontal Ground Line X-Y, the Front Elevation of the inclined block above X-Y, and its Plan View below X-Y.',
          detailedNotes: 'Notice how the inclined top face appears foreshortened in both standard views.',
          technicalPrinciple: 'Standard orthographic views: Continuous Thick (HB) with Thin Chain X-Y datum.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: 200, y: xyY, visible: true },
          elements: [
            { id: 'datum-xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 60, y1: xyY, x2: 440, y2: xyY },
            { id: 'lbl-x', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 80, cy: xyY - 10, label: 'X' },
            { id: 'lbl-y', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 420, cy: xyY - 10, label: 'Y' },
            // Front Elevation
            { id: 'front-base', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: frontX - width / 2, y1: xyY, x2: frontX + width / 2, y2: xyY },
            { id: 'front-left', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: frontX - width / 2, y1: xyY, x2: frontX - width / 2, y2: xyY - height },
            { id: 'front-right', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: frontX + width / 2, y1: xyY, x2: frontX + width / 2, y2: xyY - height * 0.4 },
            { id: 'front-slope', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: frontX - width / 2, y1: xyY - height, x2: frontX + width / 2, y2: xyY - height * 0.4 },
            // Plan View
            { id: 'plan-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: planX - width / 2, y: planY, width: width, height: 80 }
          ]
        },
        {
          stepIndex: 2,
          title: `Set up Auxiliary Datum X1-Y1 at ${angle}° and Project Rays at 90°`,
          instruction: `Draw auxiliary datum line X1-Y1 inclined at ${angle}° to X-Y. From each vertex in the Plan View, project rays perpendicular to X1-Y1.`,
          detailedNotes: 'Use a set-square resting against an angled rule to project parallel rays strictly normal to X1-Y1.',
          technicalPrinciple: 'Auxiliary projection: Continuous Thin (0.25mm 2H) perpendicular to X1-Y1.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: auxX, y: auxY, visible: true },
          elements: [
            { id: 'datum-xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 60, y1: xyY, x2: 440, y2: xyY },
            { id: 'datum-x1y1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: x1, y1: y1, x2: x2, y2: y2 },
            { id: 'lbl-x1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: x1 - 15, cy: y1 + 10, label: 'X1' },
            { id: 'lbl-y1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: x2 + 15, cy: y2 - 10, label: 'Y1' },
            // Projection rays perpendicular to X1-Y1
            { id: 'proj-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: planX - width / 2, y1: planY, x2: auxX - 40 * nx, y2: auxY - 40 * ny },
            { id: 'proj-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: planX + width / 2, y1: planY, x2: auxX + 60 * nx, y2: auxY + 60 * ny }
          ]
        },
        {
          stepIndex: 3,
          title: 'Transfer Heights from Front Elevation to Draw Finished Auxiliary Elevation',
          instruction: 'Measure heights from Ground Line X-Y in Front Elevation and step them off above X1-Y1 along the corresponding projection rays.',
          detailedNotes: 'Connect the transferred points with thick HB pencil lines to produce the true shape auxiliary elevation view.',
          technicalPrinciple: 'Finished auxiliary elevation: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: auxX, y: auxY - 60, visible: true },
          elements: [
            { id: 'datum-xy', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 60, y1: xyY, x2: 440, y2: xyY },
            { id: 'datum-x1y1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: x1, y1: y1, x2: x2, y2: y2 },
            // Auxiliary View Finished polygon
            {
              id: 'aux-view',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [auxX - 50, auxY - 30],
                [auxX + 50, auxY - 30],
                [auxX + 50, auxY - 110],
                [auxX - 50, auxY - 150]
              ],
              isFinalResult: true
            },
            { id: 'lbl-aux-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: auxX, cy: auxY - 170, label: 'AUXILIARY ELEVATION' }
          ]
        }
      ];
    }
  }
];
