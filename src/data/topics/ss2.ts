import { DrawingTopic } from '../../types/curriculum';
import { ss2ExtensionTopics } from './ss2Extensions';

const ss2CoreTopics: DrawingTopic[] = [
  {
    id: 'ss2-tangency-external',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 1,
    moduleCode: 'TD-SS2-MOD01',
    title: 'External Common Tangent to Two Unequal Circles',
    shortDescription: 'Construct direct external tangent lines touching two circles of radii R1 and R2 using the auxiliary difference circle method.',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 3: Principles of Tangency',
      waecRef: 'WAEC TD Section A: Tangents and Blending',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'An external common tangent (open belt drive) touches two circles without crossing the line of centers. The construction reduces the problem to drawing a tangent from center O2 to an auxiliary circle of radius (R1 - R2) centered at O1.',
      historyAndApplication: 'Open belt pulley transmission systems, conveyor drive designs, machine gear guards, and automotive timing belts.',
      waecAndNERDCNotes: 'Normal radial lines O1-T1 and O2-T2 must be drawn perpendicular to the tangent at points of contact. Tangency contact points T1 and T2 must be clearly labeled.',
      keyPrinciples: [
        {
          title: 'Auxiliary Difference Circle Principle',
          description: 'Draw a circle centered at O1 with reduced radius R_diff = R1 - R2.',
          keyRule: 'R_{diff} = R_1 - R_2'
        },
        {
          title: 'Perpendicularity to Radius at Tangency',
          description: 'The tangent line is strictly perpendicular to the normal radii at both contact points T1 and T2.',
          keyRule: 'O1 T1 ⊥ T1 T2   and   O2 T2 ∥ O1 T1'
        }
      ],
      formulas: [
        {
          latex: 'R_diff = R1 - R2,   sin(θ) = (R1 - R2) / C',
          description: 'Angle of incline for common external tangent where C is center distance'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Given circles C1, C2 and final tangent lines T1-T2' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Auxiliary difference circle, semicircle bisector, and normal radii' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Line of centers O1-O2' }
      ]
    },
    parameters: [
      {
        id: 'r1',
        label: 'Radius Circle 1 (R1)',
        symbol: 'R1',
        defaultValue: 90,
        min: 60,
        max: 130,
        step: 5,
        unit: 'mm',
        description: 'Radius of larger circle centered at O1'
      },
      {
        id: 'r2',
        label: 'Radius Circle 2 (R2)',
        symbol: 'R2',
        defaultValue: 45,
        min: 30,
        max: 70,
        step: 5,
        unit: 'mm',
        description: 'Radius of smaller circle centered at O2'
      },
      {
        id: 'centerDist',
        label: 'Center Distance (C)',
        symbol: 'C',
        defaultValue: 300,
        min: 220,
        max: 380,
        step: 10,
        unit: 'mm',
        description: 'Distance between centers O1 and O2'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const R1 = params.r1 || 90;
      const R2 = params.r2 || 45;
      const C = params.centerDist || 300;

      const o1x = 260;
      const o1y = 300;
      const o2x = o1x + C;
      const o2y = 300;
      const mx = (o1x + o2x) / 2;
      const my = 300;

      const rDiff = Math.max(5, R1 - R2);
      const sinTheta = rDiff / C;
      const cosTheta = Math.sqrt(Math.max(0, 1 - sinTheta * sinTheta));

      // Tangent angle theta:
      const theta = Math.asin(sinTheta);

      // Tangency points on C1 and C2 (top external tangent):
      // Angle perpendicular to tangent is (90 - theta)
      const t1x = o1x + R1 * Math.sin(theta);
      const t1y = o1y - R1 * Math.cos(theta);

      const t2x = o2x + R2 * Math.sin(theta);
      const t2y = o2y - R2 * Math.cos(theta);

      // Auxiliary point P on diff circle:
      const px = o1x + rDiff * Math.sin(theta);
      const py = o1y - rDiff * Math.cos(theta);

      return [
        {
          stepIndex: 1,
          title: 'Draw the Line of Centers O1-O2 and the Given Circles',
          instruction: `Draw centerline O1-O2 = ${C} mm. Draw circle C1 (radius R1 = ${R1} mm) at O1 and circle C2 (radius R2 = ${R2} mm) at O2.`,
          detailedNotes: 'Use HB pencil for the given circles and 2H chain line for the line of centers.',
          technicalPrinciple: 'Given geometry: 0.5mm Continuous Thick circles; 0.25mm Thin Chain centerline.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: o1x,
            y: o1y,
            radius: R1,
            visible: true,
            actionText: `Draw circle C1 (R=${R1}mm) and circle C2 (R=${R2}mm)`
          },
          elements: [
            { id: 'line-centers', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: o1x - R1 - 30, y1: o1y, x2: o2x + R2 + 30, y2: o2y, isNew: true },
            { id: 'pt-O1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, label: 'O1', labelPosition: 'bottom' },
            { id: 'pt-O2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, label: 'O2', labelPosition: 'bottom' },
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1, isNew: true },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2, isNew: true },
            { id: 'dim-C', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: o1x, y1: o1y + R1 + 35, x2: o2x, y2: o2y + R1 + 35, dimensionText: `C = ${C} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Bisect O1-O2 and Draw Semicircle on Center Distance',
          instruction: `Bisect distance O1-O2 at midpoint M. With center M and radius C/2 = ${(C/2).toFixed(0)} mm, draw a semicircle spanning O1 to O2.`,
          detailedNotes: 'According to Thales theorem, any triangle inscribed in a semicircle is a right-angled triangle.',
          technicalPrinciple: 'Thales Semicircle: Right-angle locus on diameter O1-O2.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: mx,
            y: my,
            radius: C / 2,
            visible: true,
            actionText: `Draw semicircle with radius = ${(C/2).toFixed(0)}mm on O1-O2`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'pt-M', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: mx, cy: my, label: 'M', labelPosition: 'bottom', isNew: true },
            { id: 'semicircle-O1O2', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: mx, cy: my, r: C / 2, startAngle: -180, endAngle: 0, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Draw Auxiliary Difference Circle (R_diff = R1 - R2 = ${rDiff} mm)`,
          instruction: `With center O1, draw the auxiliary circle of radius R_diff = ${(rDiff)} mm. The intersection of this circle with the semicircle locates tangent point P.`,
          detailedNotes: 'Triangle O1-P-O2 has a 90° angle at vertex P because it is subtended by the diameter O1-O2.',
          technicalPrinciple: 'Angle in semicircle = 90°: O1-P is strictly perpendicular to P-O2.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: o1x,
            y: o1y,
            radius: rDiff,
            visible: true,
            actionText: `Draw difference circle R_diff = ${rDiff}mm to intersect at P`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'semicircle-O1O2', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: mx, cy: my, r: C / 2, startAngle: -180, endAngle: 0 },
            { id: 'circle-diff', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: o1x, cy: o1y, r: rDiff, isNew: true },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top-left', isNew: true },
            { id: 'line-O2-P', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o2x, y1: o2y, x2: px, y2: py, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Project Parallel Normal Radii to Find Contact Points T1 and T2',
          instruction: `Extend radial line O1-P to cut Circle 1 at contact point T1. Draw parallel radius O2-T2 from center O2 to cut Circle 2 at contact point T2.`,
          detailedNotes: 'Radius O1-T1 is strictly parallel to O2-T2, ensuring exact perpendicular tangency.',
          technicalPrinciple: 'Normal rays O1-T1 // O2-T2. Tangency points: T1 and T2.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: o2x,
            y: o2y,
            visible: true,
            actionText: `Draw parallel radius O2-T2 parallel to O1-T1`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'line-O1-T1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o1x, y1: o1y, x2: t1x, y2: t1y, isNew: true },
            { id: 'line-O2-T2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o2x, y1: o2y, x2: t2x, y2: t2y, isNew: true },
            { id: 'pt-T1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t1x, cy: t1y, label: 'T1', labelPosition: 'top-left', isNew: true },
            { id: 'pt-T2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t2x, cy: t2y, label: 'T2', labelPosition: 'top-right', isNew: true }
          ]
        },
        {
          stepIndex: 5,
          title: 'Draw the Final External Common Tangent Line T1-T2',
          instruction: `Join tangency points T1 and T2 with a continuous thick line (HB pencil).`,
          detailedNotes: 'The line T1-T2 is the exact external common tangent touching both circles simultaneously.',
          technicalPrinciple: 'Finished common tangent: 0.5mm Continuous Thick line.',
          activeInstrument: {
            toolType: 'RULER',
            x: t1x - 30,
            y: t1y,
            targetX: t2x + 30,
            targetY: t2y,
            visible: true,
            actionText: `Draw common external tangent line T1-T2`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'line-O1-T1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o1x, y1: o1y, x2: t1x, y2: t1y },
            { id: 'line-O2-T2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o2x, y1: o2y, x2: t2x, y2: t2y },
            { id: 'pt-T1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t1x, cy: t1y, label: 'T1', labelPosition: 'top-left' },
            { id: 'pt-T2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t2x, cy: t2y, label: 'T2', labelPosition: 'top-right' },
            { id: 'line-tangent', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: t1x - 35 * cosTheta, y1: t1y - 35 * sinTheta, x2: t2x + 35 * cosTheta, y2: t2y + 35 * sinTheta, isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-tangency-internal',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 2,
    moduleCode: 'TD-SS2-MOD02',
    title: 'Internal Common Tangent to Two Unequal Circles (Cross Belt)',
    shortDescription: 'Construct transverse internal tangent lines crossing the centerline using the auxiliary sum circle (R1 + R2) method.',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 3: Advanced Tangents and Belt Drives',
      waecRef: 'WAEC TD Section A: Internal Tangency',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'An internal common tangent (crossed belt drive) crosses the line of centers between two circles. The geometric construction utilizes an auxiliary sum circle of radius (R1 + R2) centered at O1.',
      historyAndApplication: 'Crossed belt mechanical drives for reversing shaft rotation direction, tension pulley systems, and machine linkage guards.',
      waecAndNERDCNotes: 'The normal radius O1-T1 points in the opposite angular direction to O2-T2. Tangency points T1 and T2 must be clearly shown with perpendicular ticks.',
      keyPrinciples: [
        {
          title: 'Auxiliary Sum Circle Principle',
          description: 'Draw a circle centered at O1 with enlarged radius R_sum = R1 + R2.',
          keyRule: 'R_{sum} = R_1 + R_2'
        },
        {
          title: 'Opposite Normal Radii',
          description: 'The normal radius O2-T2 must be drawn parallel but in the opposite direction to O1-T1.',
          keyRule: 'Vector(O2 T2) = -(R2 / R1) · Vector(O1 T1)'
        }
      ],
      formulas: [
        {
          latex: 'R_sum = R1 + R2,   sin(θ) = (R1 + R2) / C',
          description: 'Angle of incline for internal tangent crossing centers'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished crossed tangent line and given circles' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Auxiliary sum circle and normal radial lines' }
      ]
    },
    parameters: [
      {
        id: 'r1',
        label: 'Radius Circle 1 (R1)',
        symbol: 'R1',
        defaultValue: 80,
        min: 50,
        max: 110,
        step: 5,
        unit: 'mm',
        description: 'Radius of circle at O1'
      },
      {
        id: 'r2',
        label: 'Radius Circle 2 (R2)',
        symbol: 'R2',
        defaultValue: 40,
        min: 25,
        max: 60,
        step: 5,
        unit: 'mm',
        description: 'Radius of circle at O2'
      },
      {
        id: 'centerDist',
        label: 'Center Distance (C)',
        symbol: 'C',
        defaultValue: 300,
        min: 220,
        max: 380,
        step: 10,
        unit: 'mm',
        description: 'Distance between O1 and O2'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const R1 = params.r1 || 80;
      const R2 = params.r2 || 40;
      const C = params.centerDist || 300;

      const o1x = 260;
      const o1y = 300;
      const o2x = o1x + C;
      const o2y = 300;
      const mx = (o1x + o2x) / 2;
      const my = 300;

      const rSum = R1 + R2;
      const sinTheta = rSum / C;
      const theta = Math.asin(Math.min(0.99, sinTheta));

      // Tangency points:
      const t1x = o1x + R1 * Math.sin(theta);
      const t1y = o1y - R1 * Math.cos(theta);

      const t2x = o2x - R2 * Math.sin(theta);
      const t2y = o2y + R2 * Math.cos(theta);

      const px = o1x + rSum * Math.sin(theta);
      const py = o1y - rSum * Math.cos(theta);

      return [
        {
          stepIndex: 1,
          title: 'Draw the Line of Centers O1-O2 and the Given Circles',
          instruction: `Draw centerline O1-O2 = ${C} mm. Draw circle C1 (radius ${R1} mm) at O1 and circle C2 (radius ${R2} mm) at O2.`,
          detailedNotes: 'Draw given circles with HB pencil and centerline with 2H chain line.',
          technicalPrinciple: 'Base geometry: 0.5mm Continuous Thick.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: o1x,
            y: o1y,
            radius: R1,
            visible: true,
            actionText: `Draw circles C1 and C2`
          },
          elements: [
            { id: 'line-centers', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: o1x - R1 - 30, y1: o1y, x2: o2x + R2 + 30, y2: o2y, isNew: true },
            { id: 'pt-O1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, label: 'O1', labelPosition: 'bottom' },
            { id: 'pt-O2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, label: 'O2', labelPosition: 'bottom' },
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1, isNew: true },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: `Draw Semicircle on O1-O2 and Auxiliary Sum Circle (R_sum = R1 + R2 = ${rSum} mm)`,
          instruction: `Bisect O1-O2 at M and draw a semicircle. With center O1, draw the auxiliary sum circle of radius R_sum = ${rSum} mm. The intersection with the semicircle locates point P.`,
          detailedNotes: 'Triangle O1-P-O2 has a right angle at P.',
          technicalPrinciple: 'Sum circle radius R_sum = R1 + R2.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: o1x,
            y: o1y,
            radius: rSum,
            visible: true,
            actionText: `Draw sum circle R_sum = ${rSum}mm to intersect semicircle at P`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'semicircle-O1O2', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: mx, cy: my, r: C / 2, startAngle: -180, endAngle: 0, isNew: true },
            { id: 'circle-sum', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: o1x, cy: o1y, r: rSum, isNew: true },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top-left', isNew: true },
            { id: 'line-O2-P', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o2x, y1: o2y, x2: px, y2: py, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Establish Contact Points T1 and T2 with Opposite Parallel Radii',
          instruction: `Line O1-P cuts Circle 1 at T1. Draw radius O2-T2 from O2 parallel to O1-P but directed downwards to locate T2 on Circle 2.`,
          detailedNotes: 'For internal tangents, the radii point in opposite directions across the centerline.',
          technicalPrinciple: 'Opposite parallel normal radii.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: o2x,
            y: o2y,
            visible: true,
            actionText: `Draw radius O2-T2 opposite to O1-T1`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'line-O1-T1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o1x, y1: o1y, x2: t1x, y2: t1y, isNew: true },
            { id: 'line-O2-T2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: o2x, y1: o2y, x2: t2x, y2: t2y, isNew: true },
            { id: 'pt-T1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t1x, cy: t1y, label: 'T1', labelPosition: 'top-left', isNew: true },
            { id: 'pt-T2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t2x, cy: t2y, label: 'T2', labelPosition: 'bottom-right', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Internal Common Tangent Line T1-T2',
          instruction: `Connect tangency points T1 and T2 with a thick continuous line (HB pencil).`,
          detailedNotes: 'The internal tangent crosses the centerline between O1 and O2.',
          technicalPrinciple: 'Finished internal tangent: 0.5mm Continuous Thick line.',
          activeInstrument: {
            toolType: 'RULER',
            x: t1x - 20,
            y: t1y,
            targetX: t2x + 20,
            targetY: t2y,
            visible: true,
            actionText: `Draw internal tangent line T1-T2`
          },
          elements: [
            { id: 'circle-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R1 },
            { id: 'circle-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R2 },
            { id: 'pt-T1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t1x, cy: t1y, label: 'T1', labelPosition: 'top-left' },
            { id: 'pt-T2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: t2x, cy: t2y, label: 'T2', labelPosition: 'bottom-right' },
            { id: 'line-tangent', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: t1x - 30, y1: t1y - 20, x2: t2x + 30, y2: t2y + 20, isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-tangent-blend-ogee',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 3,
    moduleCode: 'TD-SS2-MOD03',
    title: 'Tangent Arcs & Reverse (Ogee / Swan-Neck) Curves',
    shortDescription: 'Construct smooth blending tangent arcs connecting two non-parallel or parallel lines (Ogee / Cyma Recta curve).',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 3: Curves and Blends',
      waecRef: 'WAEC TD Section A: Reverse Curves',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'An Ogee (or Swan-Neck / Reverse) curve consists of two tangent arcs of equal or unequal radii curving in opposite directions with a common point of tangency (inflection point).',
      historyAndApplication: 'Architectural moldings (Cyma Recta and Cyma Reversa), civil highway transition curves, railway track crossovers, and pipeline offsets.',
      waecAndNERDCNotes: 'Connect the two endpoints A and B, choose point of inflection P, and erect perpendicular bisectors on AP and PB to locate arc centers O1 and O2.',
      keyPrinciples: [
        {
          title: 'Inflection Point Continuity',
          description: 'At the point of inflection P, centers O1, P, and O2 must be strictly collinear.',
          keyRule: 'O_1 - P - O_2 \\text{ is a straight line}'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished smooth ogee curve APB' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Perpendicular bisectors and chord lines AP, PB' }
      ]
    },
    parameters: [
      {
        id: 'horizontalSpan',
        label: 'Horizontal Offset (X)',
        symbol: 'X',
        defaultValue: 320,
        min: 200,
        max: 450,
        step: 10,
        unit: 'mm',
        description: 'Horizontal distance between parallel lines'
      },
      {
        id: 'verticalOffset',
        label: 'Vertical Offset (Y)',
        symbol: 'Y',
        defaultValue: 160,
        min: 100,
        max: 240,
        step: 10,
        unit: 'mm',
        description: 'Vertical distance between parallel lines'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const X = params.horizontalSpan || 320;
      const Y = params.verticalOffset || 160;

      const ax = 220;
      const ay = 220;
      const bx = ax + X;
      const by = ay + Y;

      // Midpoint inflection point P:
      const px = (ax + bx) / 2;
      const py = (ay + by) / 2;

      // Radius for each half arc: R = ( (X/2)^2 + (Y/2)^2 ) / (2 * (Y/2)) = (X^2/4 + Y^2/4) / Y = (X^2 + Y^2) / (4Y)
      const R = (X * X + Y * Y) / (4 * Y);

      // Centers O1 (for arc AP) and O2 (for arc PB):
      // Perpendicular to horizontal line at A: O1 is vertically below A: (ax, ay + R)
      const o1x = ax;
      const o1y = ay + R;

      // Perpendicular to horizontal line at B: O2 is vertically above B: (bx, by - R)
      const o2x = bx;
      const o2y = by - R;

      // Angles:
      // Arc AP from O1: starts at -90 deg (point A), ends at angle of P from O1
      const angleP_from_O1 = (Math.atan2(py - o1y, px - o1x) * 180) / Math.PI;
      const angleP_from_O2 = (Math.atan2(py - o2y, px - o2x) * 180) / Math.PI;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Given Parallel Lines and Join Endpoints A and B',
          instruction: `Draw top horizontal line from A and bottom horizontal line from B offset by X = ${X} mm and Y = ${Y} mm. Join A to B with a thin straight line.`,
          detailedNotes: 'Line AB represents the chord for the complete reverse curve.',
          technicalPrinciple: 'Datum geometry: 0.5mm given lines; 0.25mm thin construction line AB.',
          activeInstrument: {
            toolType: 'RULER',
            x: ax - 50,
            y: ay,
            targetX: bx + 50,
            targetY: by,
            visible: true,
            actionText: `Draw parallel lines and chord line AB`
          },
          elements: [
            { id: 'line-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax - 80, y1: ay, x2: ax, y2: ay },
            { id: 'line-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: bx + 80, y2: by },
            { id: 'chord-AB', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'top-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Locate Point of Inflection P at Midpoint of AB',
          instruction: `Bisect chord AB to find the point of inflection P at ${(px).toFixed(0)}, ${(py).toFixed(0)}.`,
          detailedNotes: 'At point P, the curvature reverses direction seamlessly.',
          technicalPrinciple: 'Inflection point P bisects chord AB.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: px,
            y: py,
            visible: true,
            actionText: `Locate inflection point P`
          },
          elements: [
            { id: 'line-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax - 80, y1: ay, x2: ax, y2: ay },
            { id: 'line-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: bx + 80, y2: by },
            { id: 'chord-AB', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P (Inflection)', labelPosition: 'top-right', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Erect Perpendicular Bisectors on AP and PB to Find Centers O1 and O2',
          instruction: `Erect perpendicular bisector on AP to intersect the vertical line from A at center O1. Erect perpendicular bisector on PB to intersect the vertical line from B at center O2.`,
          detailedNotes: 'Centers O1, P, and O2 form a single straight line.',
          technicalPrinciple: 'Collinear center rule for tangency.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: o1x,
            y: o1y,
            visible: true,
            actionText: `Find centers O1 and O2 on perpendicular normals`
          },
          elements: [
            { id: 'line-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax - 80, y1: ay, x2: ax, y2: ay },
            { id: 'line-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: bx + 80, y2: by },
            { id: 'pt-O1', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, label: 'O1', labelPosition: 'left', isNew: true },
            { id: 'pt-O2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, label: 'O2', labelPosition: 'right', isNew: true },
            { id: 'line-O1-O2', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: o1x, y1: o1y, x2: o2x, y2: o2y, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Smooth Reverse Arcs AP and PB',
          instruction: `With center O1 and radius R = ${(R).toFixed(1)} mm, draw arc from A to P. With center O2 and same radius R, draw arc from P to B.`,
          detailedNotes: 'The Ogee curve connects the two parallel lines with second-order geometric smoothness.',
          technicalPrinciple: 'Complete reverse curve: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: o1x,
            y: o1y,
            radius: R,
            visible: true,
            actionText: `Draw arcs AP and PB with radius R = ${(R).toFixed(1)}mm`
          },
          elements: [
            { id: 'line-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax - 80, y1: ay, x2: ax, y2: ay },
            { id: 'line-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: bx + 80, y2: by },
            { id: 'arc-AP', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: o1x, cy: o1y, r: R, startAngle: -90, endAngle: angleP_from_O1, isNew: true, isFinalResult: true },
            { id: 'arc-PB', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: o2x, cy: o2y, r: R, startAngle: angleP_from_O2, endAngle: 90, isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'top-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top-right' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-inscribed-circumscribed-circles',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 4,
    moduleCode: 'TD-SS2-MOD04',
    title: 'Inscribed and Circumscribed Circles to a Given Triangle',
    shortDescription: 'Construct the incircle (using angle bisectors) and circumcircle (using perpendicular bisectors) for any given triangle.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 2: Incircle and Circumcircle',
      waecRef: 'WAEC TD Section A: Triangle Inscription',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'The incenter I is the intersection of internal angle bisectors and is equidistant from all three sides. The circumcenter O is the intersection of perpendicular bisectors of the sides and is equidistant from all three vertices.',
      historyAndApplication: 'Machine bearing housings, gear pitch circles, triangular structural nodal plates, and tripod mounting plates.',
      waecAndNERDCNotes: 'For the incircle, drop a true perpendicular from incenter I to base AB to establish the exact contact radius r.',
      keyPrinciples: [
        {
          title: 'Incenter vs Circumcenter',
          description: 'Incircle center I = Angle Bisector Intersection (equidistant to sides). Circumcircle center O = Perpendicular Bisector Intersection (equidistant to vertices).',
          keyRule: 'r_{in} = \\text{Dist}(I, \\text{side}), \\quad R_{circum} = IA = IB = IC'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Given triangle ABC and finished incircle / circumcircle' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Angle bisectors, perpendicular bisectors, and radial drop' }
      ]
    },
    parameters: [
      {
        id: 'base',
        label: 'Base Side (AB)',
        symbol: 'c',
        defaultValue: 260,
        min: 180,
        max: 340,
        step: 10,
        unit: 'mm',
        description: 'Base length AB'
      },
      {
        id: 'sideA',
        label: 'Side BC (a)',
        symbol: 'a',
        defaultValue: 220,
        min: 150,
        max: 280,
        step: 10,
        unit: 'mm',
        description: 'Side BC'
      },
      {
        id: 'sideB',
        label: 'Side AC (b)',
        symbol: 'b',
        defaultValue: 200,
        min: 140,
        max: 260,
        step: 10,
        unit: 'mm',
        description: 'Side AC'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const c = params.base || 260;
      const a = params.sideA || 220;
      const b = params.sideB || 200;

      const ax = 270;
      const ay = 420;
      const bx = ax + c;
      const by = ay;

      // Law of cosines for apex C:
      const cosA = (b * b + c * c - a * a) / (2 * b * c);
      const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
      const cx = ax + b * cosA;
      const cy = ay - b * sinA;

      // Incenter I formula: Ix = (a*ax + b*bx + c*cx)/(a+b+c), Iy = (a*ay + b*by + c*cy)/(a+b+c)
      const perim = a + b + c;
      const ix = (a * ax + b * bx + c * cx) / perim;
      const iy = (a * ay + b * by + c * cy) / perim;

      // Inradius r_in = Area / semiperimeter
      const s = perim / 2;
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
      const rIn = area / s;

      // Circumcenter O:
      // d = 2*(ax*(by-cy) + bx*(cy-ay) + cx*(ay-by))
      const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      const ox = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
      const oy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
      const rCircum = Math.sqrt(Math.pow(ax - ox, 2) + Math.pow(ay - oy, 2));

      return [
        {
          stepIndex: 1,
          title: 'Draw the Given Triangle ABC',
          instruction: `Draw baseline AB = ${c} mm, strike arc AC = ${b} mm from A, and strike arc BC = ${a} mm from B to form triangle ABC.`,
          detailedNotes: 'Use HB pencil for triangle outlines.',
          technicalPrinciple: 'Given triangle: Continuous Thick line (0.5mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: ax,
            y: ay,
            targetX: cx,
            targetY: cy,
            visible: true,
            actionText: `Draw triangle ABC`
          },
          elements: [
            { id: 'poly-tri', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]], isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'top' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Bisect Angles A and B to Locate Incenter I',
          instruction: `Bisect interior angle CAB and interior angle CBA. The intersection of these two bisecting rays locates the incenter I.`,
          detailedNotes: 'Incenter I is strictly equidistant from all three sides AB, BC, and CA.',
          technicalPrinciple: 'Incenter locus: Intersection of angle bisectors.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ix,
            y: iy,
            visible: true,
            actionText: `Bisect angles A and B to locate incenter I`
          },
          elements: [
            { id: 'poly-tri', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]] },
            { id: 'bisector-A', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: ix + 40 * (ix - ax) / b, y2: iy + 40 * (iy - ay) / b, isNew: true },
            { id: 'bisector-B', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bx, y1: by, x2: ix + 40 * (ix - bx) / a, y2: iy + 40 * (iy - by) / a, isNew: true },
            { id: 'pt-I', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ix, cy: iy, label: 'I (Incenter)', labelPosition: 'right', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Drop Perpendicular from I to Base AB and Draw Incircle (r = ${(rIn).toFixed(1)} mm)`,
          instruction: `Drop perpendicular from I to base AB to find exact inradius r = ${(rIn).toFixed(1)} mm. With center I and radius r, draw the inscribed circle touching all 3 sides.`,
          detailedNotes: 'The incircle is tangent to AB, BC, and CA without crossing any boundary.',
          technicalPrinciple: 'Incircle definition: 0.5mm Continuous Thick circle.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ix,
            y: iy,
            radius: rIn,
            visible: true,
            actionText: `Draw incircle with radius r = ${(rIn).toFixed(1)}mm`
          },
          elements: [
            { id: 'poly-tri', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]] },
            { id: 'pt-I', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ix, cy: iy, label: 'I', labelPosition: 'right' },
            { id: 'circle-in', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ix, cy: iy, r: rIn, isNew: true, isFinalResult: true },
            { id: 'line-rIn', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ix, y1: iy, x2: ix, y2: ay, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: `Erect Perpendicular Bisectors on AB & AC and Draw Circumcircle (R = ${(rCircum).toFixed(1)} mm)`,
          instruction: `Erect perpendicular bisectors on sides AB and AC to intersect at circumcenter O. With center O and radius R = ${(rCircum).toFixed(1)} mm, draw the circumscribed circle passing through vertices A, B, and C.`,
          detailedNotes: 'The circumcircle encloses triangle ABC passing exactly through all 3 corner points.',
          technicalPrinciple: 'Circumcircle definition: 0.5mm Continuous Thick circle.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ox,
            y: oy,
            radius: rCircum,
            visible: true,
            actionText: `Draw circumcircle passing through A, B, C`
          },
          elements: [
            { id: 'poly-tri', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]] },
            { id: 'circle-in', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ix, cy: iy, r: rIn },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'O (Circumcenter)', labelPosition: 'left', isNew: true },
            { id: 'circle-circum', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, r: rCircum, isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-diagonal-scale',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 1,
    moduleCode: 'TD-SS2-MOD05',
    title: 'Construction of a Diagonal Scale (Reading 3 Units: m, dm, cm)',
    shortDescription: 'Construct a precision diagonal scale reading three consecutive units (e.g., meters, decimeters, centimeters) using similar triangle vertical divisions.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS2 TD Unit 6: Diagonal Scales and Precision',
      waecRef: 'WAEC TD Section A: Diagonal Scale Compulsory',
      isoRef: 'ISO 5455: Scales in Technical Drawings'
    },
    theory: {
      overview: 'A Diagonal Scale allows measuring distances down to three successive units (e.g., meters, tenths of a meter, and hundredths of a meter) by using the principle of similar triangles across inclined diagonal lines.',
      historyAndApplication: 'Surveying leveling rods, precision vernier calipers, micrometers, and maritime navigational charts.',
      waecAndNERDCNotes: 'Construct a rectangle of length LOS, divide horizontally into primary and secondary units, divide vertically into 10 equal parts, and connect diagonals from (n) to (n-1).',
      keyPrinciples: [
        {
          title: 'Similar Triangles Diagonal Principle',
          description: 'On a vertical division of 10 parts, the horizontal intercept of a diagonal at level k is (k/10) of the sub-unit.',
          keyRule: 'Δx = (k / 10) × (sub-unit)'
        }
      ],
      formulas: [
        {
          latex: 'LOS = RF × L_max,   x = M + (D / 10) + (C / 100)',
          description: 'Three-unit measurement calculation'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Outer scale rectangle and major unit borders' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Diagonal inclined lines, horizontal level lines, and dimension indicator' }
      ]
    },
    parameters: [
      {
        id: 'maxMeters',
        label: 'Max Measurement Length',
        symbol: 'Lmax',
        defaultValue: 5,
        min: 4,
        max: 7,
        step: 1,
        unit: 'm',
        description: 'Maximum scale capacity'
      },
      {
        id: 'demoReading',
        label: 'Demonstration Reading',
        symbol: 'Reading',
        defaultValue: 3.67,
        min: 1.0,
        max: 5.0,
        step: 0.01,
        unit: 'm',
        description: 'Exact reading to show (e.g. 3.67 m = 3m 6dm 7cm)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const maxM = Math.round(params.maxMeters || 5);
      const reading = params.demoReading || 3.67;

      const scaleW = 450;
      const scaleH = 120;
      const ox = 180;
      const oy = 260;

      const majorW = scaleW / maxM;
      const subW = majorW / 10;
      const vertH = scaleH / 10;

      // Breakdown reading:
      // e.g. 3.67m -> main = 3m, deci = 6dm, centi = 7cm
      const mainVal = Math.floor(reading);
      const remainder = reading - mainVal;
      const deciVal = Math.floor(remainder * 10);
      const centiVal = Math.round((remainder * 10 - deciVal) * 10);

      const zeroX = ox + majorW;
      const mainX = zeroX + mainVal * majorW;
      const targetY = oy + scaleH - centiVal * vertH;
      // On level targetY, diagonal for deciVal starts at bottom (zeroX - deciVal*subW) and leans to top (zeroX - (deciVal+1)*subW)
      const startX = zeroX - deciVal * subW;
      const deciX = startX - (centiVal / 10) * subW;

      return [
        {
          stepIndex: 1,
          title: 'Construct the Scale Rectangle with 10 Horizontal Level Lines',
          instruction: `Draw outer scale rectangle (${scaleW} mm x ${scaleH} mm). Divide height into 10 equal horizontal levels of ${(vertH).toFixed(1)} mm each.`,
          detailedNotes: 'The 10 horizontal divisions represent hundredths of a meter (centimeters).',
          technicalPrinciple: 'Base grid: 0.5mm outer border; 0.25mm thin horizontal divisions.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ox - 20,
            y: oy,
            targetX: ox + scaleW + 20,
            targetY: oy,
            visible: true,
            actionText: `Draw 10 horizontal division levels`
          },
          elements: [
            { id: 'rect-outer', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + scaleW, y2: oy, isNew: true },
            { id: 'rect-outer-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy + scaleH, x2: ox + scaleW, y2: oy + scaleH, isNew: true },
            { id: 'rect-outer-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox, y2: oy + scaleH, isNew: true },
            { id: 'rect-outer-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox + scaleW, y1: oy, x2: ox + scaleW, y2: oy + scaleH, isNew: true },
            ...Array.from({ length: 9 }).map((_, idx) => ({
              id: `horiz-level-${idx + 1}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              x1: ox,
              y1: oy + (idx + 1) * vertH,
              x2: ox + scaleW,
              y2: oy + (idx + 1) * vertH,
              isNew: true
            })),
            { id: 'lbl-centi-10', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 25, cy: oy + 5, label: '10 cm' },
            { id: 'lbl-centi-0', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox - 25, cy: oy + scaleH, label: '0 cm' }
          ]
        },
        {
          stepIndex: 2,
          title: `Divide Horizontally into ${maxM} Primary Meters and Sub-divide First Meter`,
          instruction: `Divide scale into ${maxM} major units. Set zero at 1st unit. Subdivide first unit into 10 decimeters along top and bottom edges.`,
          detailedNotes: 'Primary units represent meters; secondary sub-units represent decimeters.',
          technicalPrinciple: 'Primary and secondary graduations.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: zeroX,
            y: oy,
            visible: true,
            actionText: `Divide into ${maxM} meters and 10 decimeters`
          },
          elements: [
            ...Array.from({ length: maxM + 1 }).map((_, idx) => ({
              id: `vert-major-${idx}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              x1: ox + idx * majorW,
              y1: oy,
              x2: ox + idx * majorW,
              y2: oy + scaleH,
              isNew: true
            })),
            ...Array.from({ length: maxM }).map((_, idx) => ({
              id: `lbl-main-${idx}`,
              type: 'TEXT_LABEL' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: ox + (idx + 1) * majorW,
              cy: oy + scaleH + 20,
              label: `${idx}m`
            }))
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw the 10 Inclined Diagonal Lines in the First Unit',
          instruction: `Join 0 at bottom to 1 at top, 1 at bottom to 2 at top, ... 9 at bottom to 10 at top to create the diagonal lines.`,
          detailedNotes: 'Each diagonal line advances horizontally by exactly 1/10 of a decimeter per vertical step.',
          technicalPrinciple: 'Diagonal principle: Linear proportional intercept.',
          activeInstrument: {
            toolType: 'RULER',
            x: zeroX,
            y: oy + scaleH,
            targetX: zeroX - subW,
            targetY: oy,
            visible: true,
            actionText: `Draw inclined diagonal lines`
          },
          elements: [
            ...Array.from({ length: 10 }).map((_, idx) => ({
              id: `diag-line-${idx}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              x1: zeroX - idx * subW,
              y1: oy + scaleH,
              x2: zeroX - (idx + 1) * subW,
              y2: oy,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: `Indicate Measured Distance = ${reading.toFixed(2)} m (${mainVal}m ${deciVal}dm ${centiVal}cm)`,
          instruction: `Trace level line for ${centiVal} cm upwards, locate diagonal for ${deciVal} dm to the left, and follow to ${mainVal} m to the right. Draw dimension line with arrowheads.`,
          detailedNotes: `Measurement: ${reading.toFixed(2)} m. The diagonal scale construction is complete.`,
          technicalPrinciple: 'Complete 3-unit diagonal scale measurement.',
          activeInstrument: {
            toolType: 'RULER',
            x: deciX,
            y: targetY,
            targetX: mainX,
            targetY: targetY,
            visible: true,
            actionText: `Indicate span = ${reading.toFixed(2)}m`
          },
          elements: [
            { id: 'dim-diag-reading', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: deciX, y1: targetY, x2: mainX, y2: targetY, dimensionText: `Reading = ${reading.toFixed(2)} m`, isNew: true, isFinalResult: true },
            { id: 'pt-read-l', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: deciX, cy: targetY, label: `(${deciVal}dm, ${centiVal}cm)`, labelPosition: 'left', isNew: true },
            { id: 'pt-read-r', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: mainX, cy: targetY, label: `(${mainVal}m)`, labelPosition: 'right', isNew: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-ellipse-concentric',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 3,
    moduleCode: 'TD-SS2-MOD06',
    title: 'Construction of an Ellipse by the Concentric Circles Method',
    shortDescription: 'Construct a true mathematical ellipse given major axis 2a and minor axis 2b using major/minor auxiliary concentric circles and angular projection rays.',
    category: 'CONIC_SECTIONS',
    standards: {
      nerdcRef: 'SS2 TD Unit 4: Conic Sections (Ellipse)',
      waecRef: 'WAEC TD Section A: Conic Sections Compulsory',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'An ellipse is the locus of a point moving such that the sum of its distances from two fixed foci is constant and equal to the major axis (2a). In the concentric circles method, points on the ellipse are generated by projecting horizontally from the minor circle and vertically from the major circle.',
      historyAndApplication: 'Planetary orbits (Keplerian motion), elliptical arch bridges, manhole covers, cam profiles, and oblique isometric circle projections.',
      waecAndNERDCNotes: 'Divide the 360° circle into 12 equal 30° sectors using 30°-60° set-squares. Project vertical lines from major circle and horizontal lines from minor circle.',
      keyPrinciples: [
        {
          title: 'Parametric Equations of Ellipse',
          description: 'x = a * cos(theta), y = b * sin(theta). Major circle radius = a, Minor circle radius = b.',
          keyRule: 'x = a · cos(θ),   y = b · sin(θ)'
        }
      ],
      formulas: [
        {
          latex: '(x² / a²) + (y² / b²) = 1,   e = √(a² - b²) / a',
          description: 'Cartesian equation and eccentricity of ellipse'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished smooth elliptical curve and axes AB, CD' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Major and minor circles, 30° radial rays, and coordinate intersection lines' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Major and minor axes centerlines' }
      ]
    },
    parameters: [
      {
        id: 'majorAxis',
        label: 'Major Axis (2a)',
        symbol: '2a',
        defaultValue: 320,
        min: 220,
        max: 420,
        step: 10,
        unit: 'mm',
        description: 'Total width across major axis'
      },
      {
        id: 'minorAxis',
        label: 'Minor Axis (2b)',
        symbol: '2b',
        defaultValue: 200,
        min: 120,
        max: 280,
        step: 10,
        unit: 'mm',
        description: 'Total height across minor axis'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const twoA = params.majorAxis || 320;
      const twoB = params.minorAxis || 200;
      const a = twoA / 2;
      const b = twoB / 2;

      const cx = 400;
      const cy = 300;

      // 12 division angles: 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
      const angles = Array.from({ length: 12 }).map((_, i) => (i * 30 * Math.PI) / 180);

      const majorPts: [number, number][] = angles.map(rad => [cx + a * Math.cos(rad), cy - a * Math.sin(rad)]);
      const minorPts: [number, number][] = angles.map(rad => [cx + b * Math.cos(rad), cy - b * Math.sin(rad)]);
      const ellipsePts: [number, number][] = angles.map(rad => [cx + a * Math.cos(rad), cy - b * Math.sin(rad)]);

      return [
        {
          stepIndex: 1,
          title: 'Draw the Major Axis AB and Minor Axis CD',
          instruction: `Draw major axis AB = ${twoA} mm horizontally and minor axis CD = ${twoB} mm vertically intersecting perpendicularly at center O.`,
          detailedNotes: 'Mark endpoints A, B, C, D clearly.',
          technicalPrinciple: 'Principal axes of ellipse: 0.25mm Thin Chain centerline.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: cx - a - 30,
            y: cy,
            targetX: cx + a + 30,
            targetY: cy,
            visible: true,
            actionText: `Draw major axis AB = ${twoA}mm and minor axis CD = ${twoB}mm`
          },
          elements: [
            { id: 'axis-major', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cx - a - 40, y1: cy, x2: cx + a + 40, y2: cy, isNew: true },
            { id: 'axis-minor', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cx, y1: cy - b - 40, x2: cx, y2: cy + b + 40, isNew: true },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'O', labelPosition: 'bottom-right' },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx - a, cy: cy, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx + a, cy: cy, label: 'B', labelPosition: 'right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy - b, label: 'C', labelPosition: 'top' },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy + b, label: 'D', labelPosition: 'bottom' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw the Concentric Major and Minor Auxiliary Circles',
          instruction: `With center O, draw major circle (radius a = ${a} mm) and minor circle (radius b = ${b} mm).`,
          detailedNotes: 'The major circle bounds the horizontal span; the minor circle bounds the vertical span.',
          technicalPrinciple: 'Concentric auxiliary circles: Continuous Thin line (0.25mm).',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: a,
            visible: true,
            actionText: `Draw major circle (R=${a}mm) and minor circle (r=${b}mm)`
          },
          elements: [
            { id: 'circle-major', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: a, isNew: true },
            { id: 'circle-minor', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: b, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Divide Circles into 12 Sectors at 30° Angles',
          instruction: `Using your 30°-60° set-square and T-square, draw radial lines through center O at 30°, 60°, 120°, 150°, 210°, 240°, 300°, and 330°.`,
          detailedNotes: 'Each radial line cuts the major circle at a outer point and the minor circle at an inner point.',
          technicalPrinciple: 'Radial angular sectors: 12 equal 30° intervals.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cx,
            y: cy,
            visible: true,
            actionText: `Draw 30° and 60° radial division rays`
          },
          elements: [
            { id: 'circle-major', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: a },
            { id: 'circle-minor', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: b },
            ...angles.map((rad, idx) => ({
              id: `rad-ray-${idx}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              x1: cx,
              y1: cy,
              x2: cx + a * Math.cos(rad),
              y2: cy - a * Math.sin(rad),
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: 'Project Vertical Lines from Major Circle and Horizontal Lines from Minor Circle',
          instruction: `From each intersection on the major circle, draw a vertical line towards the major axis. From the corresponding intersection on the minor circle, draw a horizontal line outward to intersect at points P1 through P12.`,
          detailedNotes: 'The intersections P1 to P12 are exact points on the perimeter of the ellipse.',
          technicalPrinciple: 'Parametric intersection theorem: x = a*cos(theta), y = b*sin(theta).',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: majorPts[1][0],
            y: majorPts[1][1],
            visible: true,
            actionText: `Project coordinates to locate points on ellipse`
          },
          elements: [
            { id: 'circle-major', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: a },
            { id: 'circle-minor', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: b },
            ...ellipsePts.map((pt, idx) => ({
              id: `pt-ellipse-${idx}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${idx + 1}`,
              labelPosition: 'top-right' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 5,
          title: 'Draw the Smooth Elliptical Curve through All Points',
          instruction: `Using a French curve or flexible curve, join points P1 through P12 with a bold, smooth continuous line (HB pencil).`,
          detailedNotes: 'The ellipse is complete with major axis ' + twoA + ' mm and minor axis ' + twoB + ' mm.',
          technicalPrinciple: 'Finished ellipse: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: ellipsePts[0][0],
            y: ellipsePts[0][1],
            visible: true,
            actionText: `Trace smooth ellipse curve through all 12 points`
          },
          elements: [
            { id: 'poly-ellipse', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: ellipsePts, isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx - a, cy: cy, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx + a, cy: cy, label: 'B', labelPosition: 'right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy - b, label: 'C', labelPosition: 'top' },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy + b, label: 'D', labelPosition: 'bottom' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-parabola-construction',
    tier: 'SS2',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 5,
    moduleCode: 'TD-SS2-MOD07',
    title: 'Construction of a Parabola (Rectangular Method)',
    shortDescription: 'Construct a parabolic curve given base span L and central altitude H using the rectangular grid division method.',
    category: 'CONIC_SECTIONS',
    standards: {
      nerdcRef: 'SS2 TD Unit 4: Conic Sections (Parabola)',
      waecRef: 'WAEC TD Section A: Parabola Construction',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'A parabola is the locus of a point moving such that its distance from a fixed focus is equal to its distance from a fixed directrix line (eccentricity e = 1). In the rectangular method, the enclosing rectangle is divided into equal proportional grids.',
      historyAndApplication: 'Suspension bridge main cables, parabolic solar reflectors, satellite radar dishes, projectile trajectories, and automobile headlight reflectors.',
      waecAndNERDCNotes: 'Construct enclosing rectangle L x H. Divide the base and vertical sides into an equal number of parts N. Rays radiating from apex V intersect vertical parallel lines.',
      keyPrinciples: [
        {
          title: 'Quadratic Proportionality Theorem',
          description: 'For a parabola with vertex at origin: y = k * x^2. Equal horizontal divisions correspond to quadratic vertical increments.',
          keyRule: 'y = [H / (L/2)²] · x²'
        }
      ],
      formulas: [
        {
          latex: 'y = (4H / L²) · x²,   e = 1',
          description: 'Standard parabola equation and unit eccentricity'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished parabolic curve outline and base span' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Enclosing rectangle, vertical grids, and apex radiating rays' }
      ]
    },
    parameters: [
      {
        id: 'baseSpan',
        label: 'Base Span (L)',
        symbol: 'L',
        defaultValue: 320,
        min: 200,
        max: 440,
        step: 10,
        unit: 'mm',
        description: 'Base width of the parabola'
      },
      {
        id: 'altitude',
        label: 'Altitude / Height (H)',
        symbol: 'H',
        defaultValue: 180,
        min: 120,
        max: 260,
        step: 10,
        unit: 'mm',
        description: 'Height of parabola vertex above base'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.baseSpan || 320;
      const H = params.altitude || 180;
      const N = 4; // 4 divisions per half

      const cx = 400;
      const cyBase = 440;
      const cyVertex = cyBase - H;

      const ax = cx - L / 2;
      const bx = cx + L / 2;

      // Parabola points:
      // Left side: i from -N to 0; Right side: i from 0 to N
      const pts: [number, number][] = [];
      for (let i = -N; i <= N; i++) {
        const x = cx + (i * (L / 2)) / N;
        const y = cyVertex + (Math.pow(i / N, 2)) * H;
        pts.push([x, y]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw the Enclosing Rectangle of Span L and Height H',
          instruction: `Draw base AB = ${L} mm. Draw vertical sides AD and BC equal to height H = ${H} mm. Connect top line CD with vertex V at center top.`,
          detailedNotes: 'Vertex V is the highest point of the parabola.',
          technicalPrinciple: 'Enclosing rectangle: 0.25mm Continuous Thin line.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 20,
            y: cyBase,
            targetX: bx + 20,
            targetY: cyBase,
            visible: true,
            actionText: `Draw enclosing rectangle (${L} x ${H} mm)`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: cyBase, x2: bx, y2: cyBase, isNew: true },
            { id: 'rect-l', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: cyBase, x2: ax, y2: cyVertex, isNew: true },
            { id: 'rect-r', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bx, y1: cyBase, x2: bx, y2: cyVertex, isNew: true },
            { id: 'rect-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: cyVertex, x2: bx, y2: cyVertex, isNew: true },
            { id: 'pt-V', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cyVertex, label: 'V (Vertex)', labelPosition: 'top', isNew: true },
            { id: 'axis-center', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cx, y1: cyVertex - 20, x2: cx, y2: cyBase + 20, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: `Divide Base Halves and Vertical Sides into ${N} Equal Parts`,
          instruction: `Divide half-base AV into ${N} equal parts (1, 2, 3) and vertical side AD into ${N} equal parts (1', 2', 3'). Repeat symmetrically for the right side.`,
          detailedNotes: 'The number of divisions on the base must equal the number of divisions on the vertical sides.',
          technicalPrinciple: 'Proportional grid division.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: ax,
            y: cyBase,
            visible: true,
            actionText: `Divide sides into ${N} equal parts`
          },
          elements: [
            ...Array.from({ length: N - 1 }).map((_, idx) => {
              const xL = ax + ((idx + 1) * (L / 2)) / N;
              const xR = cx + ((idx + 1) * (L / 2)) / N;
              return {
                id: `div-base-${idx + 1}`,
                type: 'POINT' as const,
                lineWeight: 'THIN_CONTINUOUS' as const,
                cx: xL,
                cy: cyBase,
                label: `${idx + 1}`,
                labelPosition: 'bottom' as const,
                isNew: true
              };
            })
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Vertical Grid Lines and Radiating Rays from Vertex V',
          instruction: `Erect vertical lines upward from base division points. Draw radiating rays from vertex V to vertical side divisions. The corresponding intersections give points on the parabola.`,
          detailedNotes: 'Line 1 intersects ray V-1\', Line 2 intersects ray V-2\', etc.',
          technicalPrinciple: 'Parametric intersection for parabola.',
          activeInstrument: {
            toolType: 'RULER',
            x: cx,
            y: cyVertex,
            targetX: ax,
            targetY: cyBase,
            visible: true,
            actionText: `Draw rays from vertex V to side divisions`
          },
          elements: [
            ...pts.map((pt, idx) => ({
              id: `pt-parabola-${idx}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${idx}`,
              labelPosition: 'top' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Smooth Parabolic Curve',
          instruction: `Join all intersection points through vertex V with a smooth continuous thick line using a French curve and HB pencil.`,
          detailedNotes: 'The parabolic curve is complete.',
          technicalPrinciple: 'Finished parabola: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: pts[0][0],
            y: pts[0][1],
            visible: true,
            actionText: `Draw smooth parabolic curve`
          },
          elements: [
            { id: 'poly-parabola', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: pts, isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: cyBase, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: cyBase, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-V', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cyVertex, label: 'V', labelPosition: 'top' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-involute-spiral',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 5,
    moduleCode: 'TD-SS2-MOD08',
    title: 'Loci: Involute of a Circle & Archimedean Spiral',
    shortDescription: 'Construct the true involute curve traced by an unwinding taut cord from a cylinder or circle of diameter D.',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 5: Loci and Special Curves',
      waecRef: 'WAEC TD Section A: Involute of a Circle',
      isoRef: 'ISO 2162: Documentation of Springs and Gear Teeth'
    },
    theory: {
      overview: 'An Involute of a circle is the curve traced by a point on a perfectly flexible taut string as it unwinds from the circumference of a stationary base circle. In mechanical engineering, all modern spur, helical, and bevel gear teeth profiles are based on involute curves to ensure constant velocity ratio.',
      historyAndApplication: 'Involute gear tooth profiles (Euler-Savary equation), scroll compressor vanes, centrifugal pump impellers, and spiral springs.',
      waecAndNERDCNotes: 'Divide circle into 12 equal sectors. Draw tangent lines at each division point with lengths equal to the unwound arc length: L_k = (k/12) * pi * D.',
      keyPrinciples: [
        {
          title: 'Gear Conjugate Action Principle',
          description: 'The normal to an involute curve at any point is always strictly tangent to the base circle, guaranteeing smooth, frictionless rolling contact between meshing gear teeth.',
          keyRule: 'Normal is Tangent to Base Circle'
        }
      ],
      formulas: [
        {
          latex: 'L_k = (k / 12) · π · D,   x = R(cos θ + θ sin θ),   y = R(sin θ - θ cos θ)',
          description: 'Involute arc stepping length and parametric equations'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished smooth involute curve trace' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Base circle, 30° radial lines, and tangent extension lines' }
      ]
    },
    parameters: [
      {
        id: 'diameter',
        label: 'Base Circle Diameter (D)',
        symbol: 'D',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 5,
        unit: 'mm',
        description: 'Diameter of base circle'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.diameter || 100;
      const R = D / 2;
      const circum = Math.PI * D;

      const cx = 320;
      const cy = 340;

      // 8 active unwinding steps (0 to 8 divisions, 45 deg increments)
      const N = 8;
      const pts: [number, number][] = [];

      for (let k = 0; k <= N; k++) {
        const theta = (k * 2 * Math.PI) / N; // in radians
        // Tangent point on circle:
        // Involute point:
        const x = cx + R * (Math.cos(theta) + theta * Math.sin(theta));
        const y = cy - R * (Math.sin(theta) - theta * Math.cos(theta));
        pts.push([x, y]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw the Base Circle and Baseline',
          instruction: `Draw base circle of diameter D = ${D} mm (radius R = ${R} mm) centered at O. Draw horizontal tangent baseline of length equal to circumference C = ${(circum).toFixed(1)} mm.`,
          detailedNotes: 'Circumference C = pi * D.',
          technicalPrinciple: 'Base circle definition: 0.25mm Continuous Thin.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: R,
            visible: true,
            actionText: `Draw base circle (D = ${D}mm)`
          },
          elements: [
            { id: 'circle-base', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, r: R, isNew: true },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'O', labelPosition: 'center' },
            { id: 'line-circum', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cx, y1: cy + R, x2: cx + circum, y2: cy + R, isNew: true },
            { id: 'dim-circum', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx, y1: cy + R + 35, x2: cx + circum, y2: cy + R + 35, dimensionText: `C = πD = ${(circum).toFixed(1)} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Divide Circle and Circumference Line into ${N} Equal Parts`,
          instruction: `Divide base circle into ${N} equal angular parts (1, 2, 3... ${N}). Divide the circumference baseline into ${N} equal parts.`,
          detailedNotes: 'Each unit step length along the tangent = C / ' + N + ' mm.',
          technicalPrinciple: 'Equal arc unwinding division.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: cx,
            y: cy,
            visible: true,
            actionText: `Divide into ${N} equal angular sectors`
          },
          elements: [
            { id: 'circle-base', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, r: R },
            ...Array.from({ length: N }).map((_, k) => {
              const theta = (k * 2 * Math.PI) / N;
              return {
                id: `rad-line-${k}`,
                type: 'SEGMENT' as const,
                lineWeight: 'THIN_CONTINUOUS' as const,
                x1: cx,
                y1: cy,
                x2: cx + R * Math.cos(theta),
                y2: cy - R * Math.sin(theta),
                isNew: true
              };
            })
          ]
        },
        {
          stepIndex: 3,
          title: 'Erect Perpendicular Tangents and Step Off Unwound Lengths',
          instruction: `At each division point on the circle, draw a tangent line perpendicular to the radius. Step off tangent lengths L1 = C/8, L2 = 2C/8, L3 = 3C/8, etc.`,
          detailedNotes: 'The end of each tangent line is a locus point on the involute.',
          technicalPrinciple: 'Locus of unwound cord endpoint.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cx,
            y: cy,
            visible: true,
            actionText: `Draw tangents perpendicular to radii`
          },
          elements: [
            { id: 'circle-base', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, r: R },
            ...pts.map((pt, k) => ({
              id: `pt-involute-${k}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${k}`,
              labelPosition: 'top-right' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Smooth Involute Curve',
          instruction: `Using a French curve, join points P0, P1, P2... P${N} with a smooth continuous outline (HB pencil).`,
          detailedNotes: 'The involute curve is complete.',
          technicalPrinciple: 'Complete Involute curve: Continuous Thick line (0.5mm).',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: pts[0][0],
            y: pts[0][1],
            visible: true,
            actionText: `Trace smooth involute curve`
          },
          elements: [
            { id: 'circle-base', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, r: R },
            { id: 'poly-involute', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: pts, isNew: true, isFinalResult: true },
            ...pts.map((pt, k) => ({
              id: `pt-involute-${k}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${k}`,
              labelPosition: 'top-right' as const
            }))
          ]
        }
      ];
    }
  },
  {
    id: 'ss2-cycloid-curve',
    tier: 'SS2',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 6,
    moduleCode: 'TD-SS2-MOD09',
    title: 'Loci: Cycloid Curve Generated by a Rolling Circle',
    shortDescription: 'Construct the cycloid curve traced by a point on the circumference of a generating circle rolling without slip along a straight directing line.',
    category: 'TANGENCY_AND_CURVES',
    standards: {
      nerdcRef: 'SS2 TD Unit 5: Cycloidal Curves',
      waecRef: 'WAEC TD Section A: Cycloid Construction',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'A Cycloid is the locus traced by a point on the rim of a circle rolling without slipping along a straight line (directing line). It is famous in physics as both the brachistochrone (curve of fastest descent) and tautochrone (curve of equal time).',
      historyAndApplication: 'Cycloidal gear teeth (used in luxury mechanical wristwatches for minimal friction), pendulum clocks (Huygens cycloidal cheeks), and roller coaster drop transitions.',
      waecAndNERDCNotes: 'Divide generating circle into 12 parts. Draw center line locus parallel to baseline at height R. Project horizontal level lines from circle divisions.',
      keyPrinciples: [
        {
          title: 'Pure Rolling Kinematics',
          description: 'No slip condition: Distance rolled along directing line equals arc length on circumference: s = R * theta.',
          keyRule: 'x = R(\\theta - \\sin\\theta), \\quad y = R(1 - \\cos\\theta)'
        }
      ],
      formulas: [
        {
          latex: 'L_{base} = \\pi D, \\quad x(\\theta) = R(\\theta - \\sin\\theta), \\quad y(\\theta) = R(1 - \\cos\\theta)',
          description: 'Baseline span and parametric equations of cycloid'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished cycloid curve and directing baseline' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Generating circle, center line locus, and horizontal projection rays' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Center line of circle path' }
      ]
    },
    parameters: [
      {
        id: 'diameter',
        label: 'Generating Circle Diameter (D)',
        symbol: 'D',
        defaultValue: 90,
        min: 60,
        max: 120,
        step: 5,
        unit: 'mm',
        description: 'Diameter of the rolling circle'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.diameter || 90;
      const R = D / 2;
      const circum = Math.PI * D;

      const ox = 180;
      const oy = 420; // Directing line Y
      const N = 8; // 8 division stations

      const pts: [number, number][] = [];
      for (let k = 0; k <= N; k++) {
        const theta = (k * 2 * Math.PI) / N; // 0 to 2*PI
        const x = ox + R * (theta - Math.sin(theta));
        const y = oy - R * (1 - Math.cos(theta));
        pts.push([x, y]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw the Directing Baseline and Initial Generating Circle',
          instruction: `Draw directing baseline AB = ${(circum).toFixed(1)} mm (pi * D). Draw generating circle of diameter ${D} mm tangent to baseline at starting point P0.`,
          detailedNotes: 'Baseline span equals the complete circumference of the rolling circle.',
          technicalPrinciple: 'Base line definition: L = pi * D.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ox,
            y: oy - R,
            radius: R,
            visible: true,
            actionText: `Draw generating circle (D = ${D}mm) and baseline`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 40, y1: oy, x2: ox + circum + 40, y2: oy, isNew: true },
            { id: 'circle-gen', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy - R, r: R, isNew: true },
            { id: 'line-centers-path', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: oy - R, x2: ox + circum, y2: oy - R, isNew: true },
            { id: 'dim-L', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: oy + 35, x2: ox + circum, y2: oy + 35, dimensionText: `L = πD = ${(circum).toFixed(1)} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Divide Generating Circle and Centerline into ${N} Equal Parts`,
          instruction: `Divide generating circle into ${N} parts (1 to ${N}). Divide centerline path into ${N} center stations C1, C2... C${N}.`,
          detailedNotes: 'Center positions: C_k = ox + k * (pi * D / ' + N + ').',
          technicalPrinciple: 'Centerline locus division.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: ox,
            y: oy - R,
            visible: true,
            actionText: `Divide into ${N} equal parts`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 40, y1: oy, x2: ox + circum + 40, y2: oy },
            { id: 'circle-gen', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy - R, r: R },
            { id: 'line-centers-path', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: oy - R, x2: ox + circum, y2: oy - R },
            ...Array.from({ length: N + 1 }).map((_, k) => ({
              id: `pt-center-${k}`,
              type: 'POINT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: ox + (k * circum) / N,
              cy: oy - R,
              label: `C${k}`,
              labelPosition: 'top' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Horizontal Height Levels and Locate Cycloid Points P0 to P8',
          instruction: `From circle divisions 1, 2, 3..., draw horizontal lines. With compass radius R = ${R} mm centered at each center station C_k, strike arcs to cut corresponding level lines at P_k.`,
          detailedNotes: 'Each point P_k represents the instantaneous position of point P after rolling through angle theta_k.',
          technicalPrinciple: 'Point locus generation for cycloid.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ox + circum / 2,
            y: oy - R,
            radius: R,
            visible: true,
            actionText: `Strike arcs of radius R from center stations`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 40, y1: oy, x2: ox + circum + 40, y2: oy },
            ...pts.map((pt, k) => ({
              id: `pt-cycloid-${k}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${k}`,
              labelPosition: 'top' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Smooth Cycloid Curve',
          instruction: `Join points P0 through P${N} with a bold, smooth continuous line using a French curve (HB pencil).`,
          detailedNotes: 'The cycloid curve is complete with span ' + circum.toFixed(1) + ' mm and height ' + D + ' mm.',
          technicalPrinciple: 'Finished cycloid curve: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: pts[0][0],
            y: pts[0][1],
            visible: true,
            actionText: `Trace smooth cycloid curve`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 40, y1: oy, x2: ox + circum + 40, y2: oy },
            { id: 'poly-cycloid', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: pts, isNew: true, isFinalResult: true },
            ...pts.map((pt, k) => ({
              id: `pt-cycloid-${k}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${k}`,
              labelPosition: 'top' as const
            }))
          ]
        }
      ];
    }
  }
];

export const ss2Topics: DrawingTopic[] = [
  ...ss2CoreTopics,
  ...ss2ExtensionTopics
];
