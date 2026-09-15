import { DrawingTopic } from '../../types/curriculum';
import { ss1FoundationTopics } from './ss1Foundations';
import { ss1ExtensionTopics } from './ss1Extensions';

const ss1GeometryTopics: DrawingTopic[] = [
  {
    id: 'ss1-bisect-line',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 6,
    moduleCode: 'TD-SS1-MOD01',
    title: 'Bisection of a Given Straight Line',
    shortDescription: 'Construct a perpendicular bisector to divide line AB into two equal halves with absolute geometric precision.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 2: Geometric Constructions',
      waecRef: 'WAEC TD Paper 2 Section A Q1',
      isoRef: 'ISO 128-20: Technical Drawings - Basic Conventions'
    },
    theory: {
      overview: 'Bisection of a straight line is the fundamental geometric operation of dividing a line segment into two congruent halves by constructing its perpendicular bisector (equidistant locus of points from A and B).',
      historyAndApplication: 'Used extensively in engineering layouts, civil baseline setting, structural centerline placement, and balancing mechanical linkages.',
      waecAndNERDCNotes: 'All construction arcs (thin continuous lines, 2H pencil) MUST be clearly visible. Only line AB and the dividing line PQ should be distinct.',
      keyPrinciples: [
        {
          title: 'Compass Radius Condition',
          description: 'The compass radius r MUST be strictly greater than half the length of AB (r > AB / 2), otherwise the intersecting arcs will not meet.',
          keyRule: 'r >= 0.6 * AB'
        },
        {
          title: 'Perpendicular Locus Theorem',
          description: 'Any point equidistant from two endpoints A and B lies on the perpendicular bisector of segment AB.',
          keyRule: 'PA = PB and QA = QB'
        }
      ],
      formulas: [
        {
          latex: 'x_M = (x_A + x_B) / 2,   y_M = (y_A + y_B) / 2',
          description: 'Midpoint coordinates formula'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB/H', application: 'Given line AB and bisector midpoint marker' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H/3H', application: 'Compass intersecting construction arcs' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerline/perpendicular bisector PQ' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Line Length (AB)',
        symbol: 'L',
        defaultValue: 300,
        min: 150,
        max: 450,
        step: 10,
        unit: 'mm',
        description: 'Length of the given horizontal line AB'
      },
      {
        id: 'compassFactor',
        label: 'Compass Arc Radius Factor',
        symbol: 'k',
        defaultValue: 0.65,
        min: 0.55,
        max: 0.85,
        step: 0.05,
        unit: 'x L',
        description: 'Compass span factor (must be > 0.5)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.length || 300;
      const k = params.compassFactor || 0.65;
      const r = L * k;

      const cx = 400;
      const cy = 300;
      const ax = cx - L / 2;
      const ay = cy;
      const bx = cx + L / 2;
      const by = cy;

      const h = Math.sqrt(Math.max(0, r * r - (L / 2) * (L / 2)));
      const px = cx;
      const py = cy - h;
      const qx = cx;
      const qy = cy + h;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Given Straight Line AB',
          instruction: `Using a straight edge or T-square, draw a clean horizontal line AB of length ${L} mm with an HB pencil. Mark points A and B clearly.`,
          detailedNotes: 'Ensure the line is positioned parallel to the working edge of your drawing board. Keep ends marked with neat tick points.',
          technicalPrinciple: 'Standard given outline: Continuous Thick line (0.5mm, Grade HB/H).',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 40,
            y: ay,
            targetX: bx + 40,
            targetY: by,
            visible: true,
            actionText: `Align T-Square to horizontal datum; draw line AB = ${L}mm`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 50, x2: bx, y2: by + 50, dimensionText: `${L} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Strike Arcs from Center Point A',
          instruction: `Set your compass to a radius r = ${(r).toFixed(0)} mm (greater than half of AB). With center at point A, strike intersecting arcs above and below line AB.`,
          detailedNotes: 'Do not alter the compass radius setting once set! Use a light 2H/3H pencil to maintain clear, fine construction lines.',
          technicalPrinciple: 'Construction geometry: Continuous Thin line (0.25mm). Equidistant locus radius r > L/2.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: r,
            visible: true,
            actionText: `Compass needle at A: strike top and bottom arcs with r = ${(r).toFixed(0)}mm`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: -65, endAngle: -25, isNew: true },
            { id: 'arc-A-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: 25, endAngle: 65, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 50, x2: bx, y2: by + 50, dimensionText: `${L} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Strike Intersecting Arcs from Center Point B',
          instruction: `Without adjusting the compass radius (r = ${(r).toFixed(0)} mm), place the needle at point B. Strike arcs above and below to intersect the previous arcs at points P and Q.`,
          detailedNotes: 'The sharp intersections P (top) and Q (bottom) define two distinct points strictly equidistant from both endpoints A and B.',
          technicalPrinciple: 'Intersection of circular loci: PA = PB and QA = QB. Two equidistant points uniquely define the bisector line.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: bx,
            y: by,
            radius: r,
            visible: true,
            actionText: `Compass needle at B: intersect previous arcs at P and Q`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: -65, endAngle: -25 },
            { id: 'arc-A-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: 25, endAngle: 65 },
            { id: 'arc-B-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r, startAngle: -155, endAngle: -115, isNew: true },
            { id: 'arc-B-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r, startAngle: 115, endAngle: 155, isNew: true },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top', isNew: true },
            { id: 'pt-Q', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: qx, cy: qy, label: 'Q', labelPosition: 'bottom', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Join Points P and Q to Bisect Line AB at Midpoint M',
          instruction: `Align a straight ruler between intersection points P and Q. Draw the line PQ crossing AB at midpoint M. Line AB is now bisected into AM = MB = ${(L/2).toFixed(1)} mm at exactly 90°.`,
          detailedNotes: 'PQ is the perpendicular bisector. In engineering convention, the bisector line can be rendered as a thin centerline or continuous line.',
          technicalPrinciple: 'Complete construction verified: AM = MB = L/2, Angle(P-M-B) = 90.00° precisely.',
          activeInstrument: {
            toolType: 'RULER',
            x: px,
            y: py - 20,
            targetX: qx,
            targetY: qy + 20,
            visible: true,
            actionText: `Ruler across P and Q: Draw perpendicular bisector PQ`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: -65, endAngle: -25 },
            { id: 'arc-A-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r, startAngle: 25, endAngle: 65 },
            { id: 'arc-B-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r, startAngle: -155, endAngle: -115 },
            { id: 'arc-B-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r, startAngle: 115, endAngle: 155 },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top' },
            { id: 'pt-Q', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: qx, cy: qy, label: 'Q', labelPosition: 'bottom' },
            { id: 'line-PQ', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: px, y1: py - 25, x2: qx, y2: qy + 25, isNew: true, isFinalResult: true },
            { id: 'pt-M', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'M (Midpoint)', labelPosition: 'bottom-right', isNew: true },
            { id: 'dim-AM', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay - 35, x2: cx, y2: cy - 35, dimensionText: `${(L/2).toFixed(1)} mm` },
            { id: 'dim-MB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx, y1: cy - 35, x2: bx, y2: by - 35, dimensionText: `${(L/2).toFixed(1)} mm` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-bisect-angle',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 7,
    moduleCode: 'TD-SS1-MOD02',
    title: 'Bisection of a Given Angle',
    shortDescription: 'Construct the precise bisecting ray of any acute, right, or obtuse angle ABC using compass arcs.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 2: Angle Constructions',
      waecRef: 'WAEC TD Section A: Angle Bisection',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'Angle bisection creates a ray dividing a given angle into two equal parts. Every point on the bisector is equidistant from the arms of the angle.',
      historyAndApplication: 'Used for mitering joints in carpentry and metal fabrication, chamfering corners, and bevel gear tooth layouts.',
      waecAndNERDCNotes: 'The initial arc cutting arms BA and BC must have identical radius from vertex B. Intersection point P must be clearly established with 2H pencil arcs.',
      keyPrinciples: [
        {
          title: 'Angle Bisector Equidistance Theorem',
          description: 'Any point on the bisector ray of an angle is strictly equidistant from the two arms containing the angle.',
          keyRule: '∠ABP = ∠CBP = ½ ∠ABC'
        }
      ],
      formulas: [
        {
          latex: 'θ_half = θ_total / 2',
          description: 'Bisected half-angle relationship'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Given angle arms AB, BC and bisector ray BP' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Construction arcs cutting arms and intersecting at P' }
      ]
    },
    parameters: [
      {
        id: 'angleDeg',
        label: 'Angle Size (∠ABC)',
        symbol: 'θ',
        defaultValue: 70,
        min: 30,
        max: 140,
        step: 5,
        unit: 'deg',
        description: 'Total angle between arms BA and BC'
      },
      {
        id: 'armLength',
        label: 'Arm Length',
        symbol: 'L',
        defaultValue: 220,
        min: 150,
        max: 300,
        step: 10,
        unit: 'mm',
        description: 'Length of the angle arms'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const angle = params.angleDeg || 70;
      const L = params.armLength || 220;
      const rArc = Math.min(100, L * 0.45);
      const halfAngle = angle / 2;

      const bx = 280;
      const by = 420;

      // Base arm BC along horizontal (0 deg)
      const cx = bx + L;
      const cy = by;

      // Arm BA at -angle deg
      const radA = (-angle * Math.PI) / 180;
      const ax = bx + L * Math.cos(radA);
      const ay = by + L * Math.sin(radA);

      // Points D on BC and E on BA at distance rArc
      const dx = bx + rArc;
      const dy = by;
      const ex = bx + rArc * Math.cos(radA);
      const ey = by + rArc * Math.sin(radA);

      // Intersection P of arcs from D and E
      const radHalf = (-halfAngle * Math.PI) / 180;
      const px = bx + (L * 0.85) * Math.cos(radHalf);
      const py = by + (L * 0.85) * Math.sin(radHalf);

      return [
        {
          stepIndex: 1,
          title: 'Draw Given Angle ABC',
          instruction: `Draw horizontal arm BC = ${L}mm and inclined arm BA = ${L}mm meeting at vertex B with angle ${angle}°.`,
          detailedNotes: 'Use your protractor or set-squares to lay out angle ABC accurately.',
          technicalPrinciple: 'Base geometry: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'PROTRACTOR',
            x: bx,
            y: by,
            angleDeg: angle,
            visible: true,
            actionText: `Position protractor at B; draw angle ABC = ${angle}°`
          },
          elements: [
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-left' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'right' },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'top-right' },
            { id: 'line-BC', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'line-BA', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: ax, y2: ay }
          ]
        },
        {
          stepIndex: 2,
          title: 'Strike Arc from Vertex B Cutting Both Arms at D and E',
          instruction: `With compass needle at vertex B and convenient radius r = ${rArc}mm, draw an arc cutting arm BC at point D and arm BA at point E.`,
          detailedNotes: 'Points D and E are equidistant from vertex B: BD = BE.',
          technicalPrinciple: 'Continuous Thin line (0.25mm) for construction arcs.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: bx,
            y: by,
            radius: rArc,
            visible: true,
            actionText: `Strike arc from vertex B cutting arms at D and E`
          },
          elements: [
            { id: 'line-BC', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'line-BA', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: ax, y2: ay },
            { id: 'arc-DE', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: rArc, startAngle: -angle - 5, endAngle: 5, isNew: true },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: dx, cy: dy, label: 'D', labelPosition: 'bottom', isNew: true },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ex, cy: ey, label: 'E', labelPosition: 'top-left', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Strike Intersecting Arcs from Centers D and E to Locate Point P',
          instruction: `With center D and compass radius r > DE/2, strike an arc into the angle space. With center E and same radius, strike an intersecting arc to pinpoint P.`,
          detailedNotes: 'Point P is equidistant from arms BA and BC: PD = PE.',
          technicalPrinciple: 'Locus of angle bisector: intersection of two equal circular arcs.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ex,
            y: ey,
            radius: rArc * 1.1,
            visible: true,
            actionText: `Intersect arcs from D and E to find point P`
          },
          elements: [
            { id: 'line-BC', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'line-BA', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: ax, y2: ay },
            { id: 'arc-DE', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: rArc, startAngle: -angle - 5, endAngle: 5 },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: dx, cy: dy, label: 'D', labelPosition: 'bottom' },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ex, cy: ey, label: 'E', labelPosition: 'top-left' },
            { id: 'arc-from-D', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: dx, cy: dy, r: rArc * 1.1, startAngle: -halfAngle - 25, endAngle: -halfAngle + 15, isNew: true },
            { id: 'arc-from-E', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ex, cy: ey, r: rArc * 1.1, startAngle: -halfAngle - 15, endAngle: -halfAngle + 25, isNew: true },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top-right', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw Bisector Ray BP Dividing Angle ABC into Two Equal Halves',
          instruction: `Draw a straight line from vertex B through intersection point P. Ray BP bisects ∠ABC into two equal angles of ${(halfAngle).toFixed(1)}°.`,
          detailedNotes: '∠ABP = ∠PBC = ' + halfAngle.toFixed(1) + '°. The angle bisection is complete.',
          technicalPrinciple: 'Complete construction: 0.5mm Continuous Thick outline for ray BP.',
          activeInstrument: {
            toolType: 'RULER',
            x: bx,
            y: by,
            targetX: px + 30,
            targetY: py - 15,
            visible: true,
            actionText: `Draw bisector ray BP with straight edge`
          },
          elements: [
            { id: 'line-BC', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: cx, y2: cy },
            { id: 'line-BA', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: ax, y2: ay },
            { id: 'arc-DE', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: rArc, startAngle: -angle - 5, endAngle: 5 },
            { id: 'line-BP', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx, y1: by, x2: px + 30 * Math.cos(radHalf), y2: py + 30 * Math.sin(radHalf), isNew: true, isFinalResult: true },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-left' },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: px, cy: py, label: 'P', labelPosition: 'top-right' },
            { id: 'lbl-angle1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: bx + 70 * Math.cos(radHalf / 2), cy: by + 70 * Math.sin(radHalf / 2), label: `${halfAngle.toFixed(0)}°` },
            { id: 'lbl-angle2', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: bx + 70 * Math.cos((radHalf + radA) / 2), cy: by + 70 * Math.sin((radHalf + radA) / 2), label: `${halfAngle.toFixed(0)}°` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-divide-line-proportional',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 8,
    moduleCode: 'TD-SS1-MOD03',
    title: 'Division of a Straight Line into N Equal Parts',
    shortDescription: 'Divide any given line AB into equal proportional segments using an auxiliary inclined line and parallel projections.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 3: Division of Lines and Proportional Parts',
      waecRef: 'WAEC TD Section A: Plane Geometry',
      isoRef: 'ISO 128-22: Rules for Projection'
    },
    theory: {
      overview: 'The Thales Intercept Theorem states that if parallel lines intersect two transversals, then they cut off the transversals in equal or proportional segments.',
      historyAndApplication: 'Fundamental technique used when constructing vernier scales, stepped shafts, gear tooth spacing, and staircase treads.',
      waecAndNERDCNotes: 'The auxiliary angle is arbitrary (typically 25° to 40°). Dividers or compass arcs must be uniform in spacing along the acute ray AC.',
      keyPrinciples: [
        {
          title: 'Thales Intercept Theorem',
          description: 'Parallel projection preserves the exact ratio of division along any two non-parallel line rays.',
          keyRule: 'AB_1 / B_1 B_2 = AC_1 / C_1 C_2'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Given line AB and final division points' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Inclined ray AC, divider ticks, and parallel projection lines' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Line Length (AB)',
        symbol: 'L',
        defaultValue: 280,
        min: 150,
        max: 400,
        step: 10,
        unit: 'mm',
        description: 'Length of the line segment AB'
      },
      {
        id: 'divisions',
        label: 'Number of Equal Parts',
        symbol: 'N',
        defaultValue: 5,
        min: 3,
        max: 8,
        step: 1,
        unit: 'parts',
        description: 'Number of equal divisions required'
      },
      {
        id: 'acuteAngle',
        label: 'Auxiliary Angle',
        symbol: 'θ',
        defaultValue: 30,
        min: 20,
        max: 45,
        step: 5,
        unit: 'deg',
        description: 'Angle of the auxiliary line AC'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.length || 280;
      const N = Math.round(params.divisions || 5);
      const thetaDeg = params.acuteAngle || 30;
      const theta = (thetaDeg * Math.PI) / 180;

      const ax = 200;
      const ay = 360;
      const bx = ax + L;
      const by = ay;

      const stepDist = 45;
      const cPoints: [number, number][] = [];
      for (let i = 1; i <= N; i++) {
        cPoints.push([ax + i * stepDist * Math.cos(theta), ay - i * stepDist * Math.sin(theta)]);
      }
      const lastC = cPoints[N - 1];

      const divPoints: [number, number][] = [];
      for (let i = 1; i < N; i++) {
        divPoints.push([ax + (i * L) / N, ay]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw the Given Line Segment AB',
          instruction: `Draw the horizontal baseline AB of length ${L} mm with an HB pencil.`,
          detailedNotes: 'Mark endpoints A and B neatly.',
          technicalPrinciple: 'Base line definition: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw given line AB = ${L}mm`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `${L} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Draw Acute Auxiliary Ray AC and Step Off ${N} Equal Units`,
          instruction: `From point A, draw an auxiliary line AC inclined at ${thetaDeg}° using 2H pencil. Set dividers to ${stepDist} mm and step off points 1, 2, 3... ${N} along AC.`,
          detailedNotes: 'The divider radius can be any convenient length, as long as it is kept strictly constant across all steps.',
          technicalPrinciple: 'Continuous Thin line (0.25mm) for auxiliary constructions.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: cPoints[0][0],
            y: cPoints[0][1],
            visible: true,
            actionText: `Step off ${N} equal unit distances along ray AC`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'line-AC', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: lastC[0] + 25 * Math.cos(theta), y2: lastC[1] - 25 * Math.sin(theta), isNew: true },
            ...cPoints.map((pt, idx) => ({
              id: `pt-C-${idx + 1}`,
              type: 'POINT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `${idx + 1}`,
              labelPosition: 'top-left' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 3,
          title: `Join Last Division Point ${N} to Endpoint B`,
          instruction: `Using a straight ruler, connect division mark ${N} on the auxiliary line directly to point B on the baseline.`,
          detailedNotes: 'This line establishes the reference direction vector for all subsequent parallel projections.',
          technicalPrinciple: 'Reference direction line: Continuous Thin (0.25mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: lastC[0],
            y: lastC[1],
            targetX: bx,
            targetY: by,
            visible: true,
            actionText: `Join point ${N} to B with straight edge`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'line-AC', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: lastC[0] + 25 * Math.cos(theta), y2: lastC[1] - 25 * Math.sin(theta) },
            ...cPoints.map((pt, idx) => ({
              id: `pt-C-${idx + 1}`,
              type: 'POINT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `${idx + 1}`,
              labelPosition: 'top-left' as const
            })),
            { id: 'line-last-to-B', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: lastC[0], y1: lastC[1], x2: bx, y2: by, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Project Parallel Lines from Each Division to Divide AB',
          instruction: `Using a set-square paired with a straight ruler, slide parallel to line (${N}-B) through points 1, 2, ... ${N - 1}. Each line intersects AB to divide it into ${N} equal segments of ${(L / N).toFixed(1)} mm.`,
          detailedNotes: 'Keep the sliding set-square firmly supported against the straight edge to prevent angular distortion.',
          technicalPrinciple: 'Thales Intercept Theorem: AB is divided into exactly ' + N + ' equal parts of ' + (L / N).toFixed(1) + 'mm.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cPoints[0][0],
            y: cPoints[0][1],
            visible: true,
            actionText: `Slide set-square parallel to line (${N}-B)`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'line-AC', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ax, y1: ay, x2: lastC[0] + 25 * Math.cos(theta), y2: lastC[1] - 25 * Math.sin(theta) },
            ...cPoints.map((pt, idx) => ({
              id: `pt-C-${idx + 1}`,
              type: 'POINT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `${idx + 1}`,
              labelPosition: 'top-left' as const
            })),
            ...cPoints.map((pt, idx) => {
              const targetDivX = ax + ((idx + 1) * L) / N;
              return {
                id: `proj-line-${idx + 1}`,
                type: 'SEGMENT' as const,
                lineWeight: 'THIN_CONTINUOUS' as const,
                x1: pt[0],
                y1: pt[1],
                x2: targetDivX,
                y2: ay,
                isNew: true
              };
            }),
            ...divPoints.map((pt, idx) => ({
              id: `pt-div-${idx + 1}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `${idx + 1}'`,
              labelPosition: 'bottom' as const,
              isNew: true,
              isFinalResult: true
            }))
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-angles-construction',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 9,
    moduleCode: 'TD-SS1-MOD04',
    title: 'Construction of Standard Angles (60°, 90°, 45°, 75°, 105°)',
    shortDescription: 'Construct standard engineering angles using only a pair of compasses and straight edge without protractor.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 2: Standard Angle Constructions',
      waecRef: 'WAEC TD Section A: Geometric Constructions',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'Standard angles in engineering drawing (60°, 90°, 45°, 75°, 105°, 120°) are constructed by combining the 60° equilateral arc method and perpendicular bisection.',
      historyAndApplication: 'Used universally across mechanical drawing, building plan drafting, truss angle layout, and set-square verification.',
      waecAndNERDCNotes: 'Do NOT use a protractor to draw these angles during WAEC/NERDC exams; examiners award full marks solely based on compass construction arcs.',
      keyPrinciples: [
        {
          title: '60° Equilateral Arc Principle',
          description: 'A circle chord equal to its radius subtends an angle of exactly 60° at the center.',
          keyRule: 'Chord c = r ⟹ θ = 60°'
        },
        {
          title: 'Compound Angle Addition/Bisection',
          description: '75° = 60° + (90° - 60°)/2 = 60° + 15°. 45° = 90° / 2.',
          keyRule: '75° = 60° + 15°'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Baseline AB and constructed angle rays' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Primary semicircle and intersecting arcs' }
      ]
    },
    parameters: [
      {
        id: 'targetAngle',
        label: 'Constructed Angle',
        symbol: 'θ',
        defaultValue: 75,
        min: 45,
        max: 120,
        step: 15,
        unit: 'deg',
        description: 'Target angle (45°, 60°, 75°, 90°, 105°, 120°)'
      },
      {
        id: 'radius',
        label: 'Base Semicircle Radius',
        symbol: 'R',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Radius for construction semicircle'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const angle = params.targetAngle || 75;
      const R = params.radius || 100;
      const ox = 380;
      const oy = 400;
      const rayLen = 220;

      // Points on semicircle:
      // 0 deg: (ox + R, oy)
      // 60 deg: (ox + R * cos(60), oy - R * sin(60))
      // 120 deg: (ox + R * cos(120), oy - R * sin(120))
      // 90 deg: (ox, oy - R)
      const rad60 = (60 * Math.PI) / 180;
      const rad120 = (120 * Math.PI) / 180;
      const p60: [number, number] = [ox + R * Math.cos(rad60), oy - R * Math.sin(rad60)];
      const p120: [number, number] = [ox + R * Math.cos(rad120), oy - R * Math.sin(rad120)];
      const p90: [number, number] = [ox, oy - R];

      // Target Ray End
      const radTarget = (angle * Math.PI) / 180;
      const pTarget: [number, number] = [ox + rayLen * Math.cos(radTarget), oy - rayLen * Math.sin(radTarget)];

      return [
        {
          stepIndex: 1,
          title: 'Draw Baseline and Semicircle from Vertex O',
          instruction: `Draw horizontal line AB through vertex O. With center O and compass radius R = ${R} mm, draw a semicircle cutting the baseline at P and Q.`,
          detailedNotes: 'Point P is at 0° and point Q is at 180° on the baseline.',
          technicalPrinciple: 'Base semicircle: 0.25mm Continuous Thin line.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ox,
            y: oy,
            radius: R,
            visible: true,
            actionText: `Draw semicircle with radius R = ${R}mm centered at O`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 180, y1: oy, x2: ox + 220, y2: oy },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'O', labelPosition: 'bottom' },
            { id: 'semicircle', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: R, startAngle: -180, endAngle: 0, isNew: true },
            { id: 'pt-P', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: ox + R, cy: oy, label: 'P (0°)', labelPosition: 'bottom-right' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Step Off 60° and 120° Marks on Semicircle',
          instruction: `With compass radius maintained at R = ${R} mm, place needle at P and strike arc to cut semicircle at 60° point D. Move needle to D and cut semicircle at 120° point E.`,
          detailedNotes: 'Chord length equal to radius R subtends exactly 60° on the circumference.',
          technicalPrinciple: 'Equilateral triangle chord geometry: Arc span = 60° exactly.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: p60[0],
            y: p60[1],
            radius: R,
            visible: true,
            actionText: `Strike 60° arc at D and 120° arc at E`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 180, y1: oy, x2: ox + 220, y2: oy },
            { id: 'semicircle', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: R, startAngle: -180, endAngle: 0 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'O', labelPosition: 'bottom' },
            { id: 'pt-D-60', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p60[0], cy: p60[1], label: 'D (60°)', labelPosition: 'top-right', isNew: true },
            { id: 'pt-E-120', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p120[0], cy: p120[1], label: 'E (120°)', labelPosition: 'top-left', isNew: true },
            { id: 'ray-60', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: oy, x2: ox + 180 * Math.cos(rad60), y2: oy - 180 * Math.sin(rad60), isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Bisect 60° to 120° to Construct 90° Perpendicular',
          instruction: `From points D (60°) and E (120°), strike intersecting arcs above. Join O through this intersection to establish the 90° perpendicular ray.`,
          detailedNotes: '90° is the exact midpoint between 60° and 120°: 60° + 30° = 90°.',
          technicalPrinciple: 'Perpendicular bisection: Angle = 90°.',
          activeInstrument: {
            toolType: 'RULER',
            x: ox,
            y: oy,
            targetX: p90[0],
            targetY: p90[1] - 40,
            visible: true,
            actionText: `Draw 90° perpendicular reference ray`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 180, y1: oy, x2: ox + 220, y2: oy },
            { id: 'semicircle', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: R, startAngle: -180, endAngle: 0 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'O', labelPosition: 'bottom' },
            { id: 'pt-D-60', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: p60[0], cy: p60[1], label: '60°', labelPosition: 'top-right' },
            { id: 'pt-E-120', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: p120[0], cy: p120[1], label: '120°', labelPosition: 'top-left' },
            { id: 'ray-90', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: oy, x2: p90[0], y2: p90[1] - 30, isNew: true },
            { id: 'pt-90', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p90[0], cy: p90[1], label: '90°', labelPosition: 'top', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: `Construct Final ${angle}° Angle Ray`,
          instruction: `By bisecting the relevant angular sector (e.g. 60° to 90° for 75°, or 0° to 90° for 45°), draw the bold line from O at ${angle}° with HB pencil.`,
          detailedNotes: `Target angle of ${angle}° is constructed with pure geometric precision.`,
          technicalPrinciple: 'Complete construction: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'RULER',
            x: ox,
            y: oy,
            targetX: pTarget[0],
            targetY: pTarget[1],
            visible: true,
            actionText: `Draw finished angle ray at ${angle}°`
          },
          elements: [
            { id: 'line-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox - 180, y1: oy, x2: ox + 220, y2: oy },
            { id: 'semicircle', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy, r: R, startAngle: -180, endAngle: 0 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'O', labelPosition: 'bottom' },
            { id: 'ray-target', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: pTarget[0], y2: pTarget[1], isNew: true, isFinalResult: true },
            { id: 'arc-angle-indicator', type: 'ARC', lineWeight: 'DIMENSION_LINE', cx: ox, cy: oy, r: 60, startAngle: -angle, endAngle: 0, isNew: true },
            { id: 'lbl-angle-val', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + 80 * Math.cos(-radTarget / 2), cy: oy + 80 * Math.sin(-radTarget / 2), label: `${angle}°` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-triangle-equilateral',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 10,
    moduleCode: 'TD-SS1-TRI-01',
    title: 'Construction of an Equilateral Triangle',
    shortDescription: 'Construct an equilateral triangle with 3 equal sides and 3 equal interior angles of 60° using compass and straightedge.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 4: Plane Geometry Triangles',
      waecRef: 'WAEC TD Section A: Plane Geometry (Equilateral Triangle)',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'An equilateral triangle is a regular 3-sided polygon with equal sides (a = b = c) and equal interior angles (60° each, sum = 180°). The construction requires only one compass radius setting equal to the given base length AB.',
      historyAndApplication: 'J.N. Green Fig. 3.1 & Pickup & Parker Plate 4. Fundamental unit in isometric projections, equilateral triangular trusses, and tessellations.',
      waecAndNERDCNotes: 'Compass intersection arcs at apex C must remain sharp and visible in 2H continuous thin lines. The finished perimeter is in HB continuous thick line.',
      keyPrinciples: [
        {
          title: 'Equilateral Symmetry',
          description: 'All 3 sides are congruent (AB = BC = CA) and all 3 altitudes, medians, and angle bisectors coincide at the centroid.',
          keyRule: 'AB = BC = CA; ∠A = ∠B = ∠C = 60°'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.7mm', pencilGrade: 'HB', application: 'Finished triangle perimeter AB, BC, CA' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Compass setting arcs from A and B' }
      ]
    },
    parameters: [
      {
        id: 'base',
        label: 'Side Length (AB = BC = CA)',
        symbol: 's',
        defaultValue: 260,
        min: 160,
        max: 360,
        step: 10,
        unit: 'mm',
        description: 'Length of all three equal sides'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const s = params.base || 260;
      const ax = 270;
      const ay = 430;
      const bx = ax + s;
      const by = ay;
      const cx = ax + s / 2;
      const cy = ay - s * Math.sqrt(3) / 2;
      const midX = (ax + bx) / 2;

      return [
        {
          stepIndex: 1,
          title: 'Step 1: Draw Base AB = ' + s + 'mm',
          instruction: `PROBLEM: Construct an equilateral triangle ABC having side length ${s}mm.\nPROCEDURE: Draw horizontal baseline AB = ${s}mm using a T-square and 2H pencil. Mark endpoints A and B.`,
          detailedNotes: 'Baseline AB forms the primary reference datum.',
          technicalPrinciple: 'Base line: Continuous thick datum segment with metric dimension.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw base AB = ${s}mm`
          },
          elements: [
            { id: 'prob-eq', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an equilateral triangle of side ${s}mm.` },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `s = ${s} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Step 2: Strike Compass Arc of Radius ' + s + 'mm from Center A',
          instruction: `Set compass radius equal to distance AB (${s}mm). With compass needle planted at point A, strike an arc above the baseline.`,
          detailedNotes: `Locus of all points at distance ${s}mm from vertex A.`,
          technicalPrinciple: 'Compass construction arc: 0.25mm thin continuous line.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: s,
            visible: true,
            actionText: `Strike arc from A (R = ${s}mm)`
          },
          elements: [
            { id: 'prob-eq', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an equilateral triangle of side ${s}mm.` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: s, startAngle: -80, endAngle: -35, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `s = ${s} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Step 3: Strike Intersecting Arc from B (Radius ' + s + 'mm) to Locate Apex C',
          instruction: `With the same compass radius (${s}mm), place the needle at point B and strike an intersecting arc cutting the first arc at apex C.`,
          detailedNotes: 'Point C is equidistant from A and B at distance s, satisfying AC = BC = s.',
          technicalPrinciple: 'Intersection of two congruent radii determines unique equilateral apex.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: bx,
            y: by,
            radius: s,
            visible: true,
            actionText: `Strike arc from B (R = ${s}mm) to intersect at C`
          },
          elements: [
            { id: 'prob-eq', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an equilateral triangle of side ${s}mm.` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: s, startAngle: -80, endAngle: -35 },
            { id: 'arc-B', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: s, startAngle: -145, endAngle: -100, isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C (Apex)', labelPosition: 'top', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Step 4: Draw Outlines AC and BC to Complete Equilateral Triangle ABC',
          instruction: `Using a straightedge and HB pencil, draw firm lines AC and BC. Mark equality ticks on all 3 sides and 60° angle symbols.`,
          detailedNotes: `Equilateral triangle ABC is complete. All sides equal ${s}mm, all interior angles equal 60°.`,
          technicalPrinciple: 'Complete polygon perimeter: Continuous Thick HB line (0.70mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: ax,
            y: ay,
            targetX: cx,
            targetY: cy,
            visible: true,
            actionText: `Draw finished HB outlines AC and BC`
          },
          elements: [
            { id: 'prob-eq', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an equilateral triangle of side ${s}mm.` },
            { id: 'poly-eq', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]], isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'top' },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `s = ${s} mm` },
            { id: 'dim-AC', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax - 25, y1: ay - 10, x2: cx - 25, y2: cy - 10, dimensionText: `s = ${s} mm` },
            { id: 'dim-BC', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: bx + 25, y1: by - 10, x2: cx + 25, y2: cy - 10, dimensionText: `s = ${s} mm` },
            { id: 'eq-lbl', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: midX - 35, cy: ay - 35, label: '60° in each corner' },
            { id: 'tk-c', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: midX, y1: ay - 6, x2: midX, y2: ay + 6 },
            { id: 'tk-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (ax + cx) / 2 - 4, y1: (ay + cy) / 2 - 4, x2: (ax + cx) / 2 + 4, y2: (ay + cy) / 2 + 4 },
            { id: 'tk-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (bx + cx) / 2 - 4, y1: (by + cy) / 2 + 4, x2: (bx + cx) / 2 + 4, y2: (by + cy) / 2 - 4 }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-triangle-isosceles',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 11,
    moduleCode: 'TD-SS1-TRI-02',
    title: 'Construction of an Isosceles Triangle',
    shortDescription: 'Construct an isosceles triangle given base AB and equal sloping legs AC = BC, including the perpendicular axis of symmetry.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 4: Plane Geometry Triangles',
      waecRef: 'WAEC TD Section A: Plane Geometry (Isosceles Triangle)',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'An isosceles triangle has two equal sides (legs AC = BC) and two equal base angles (∠CAB = ∠CBA). The altitude perpendicular to base AB acts as a bilateral axis of symmetry passing through apex C.',
      historyAndApplication: 'J.N. Green Fig. 3.3. Key structural form in pitched A-frame roof trusses, gable ends, and symmetrical brackets.',
      waecAndNERDCNotes: 'The perpendicular axis of symmetry must be drawn as an ISO 128 Chain Thin centerline. Base angles must be marked equal.',
      keyPrinciples: [
        {
          title: 'Isosceles Axis Theorem',
          description: 'The perpendicular bisector of base AB passes directly through apex C and bisects the vertical apex angle.',
          keyRule: 'AC = BC; ∠A = ∠B; Altitude h = √(leg² - (base/2)²)'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.7mm', pencilGrade: 'HB', application: 'Finished triangle perimeter AB, BC, CA' },
        { lineName: 'Chain Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Axis of symmetry centerline CM' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Compass setting arcs of radius leg' }
      ]
    },
    parameters: [
      {
        id: 'base',
        label: 'Base Length (c = AB)',
        symbol: 'c',
        defaultValue: 260,
        min: 160,
        max: 360,
        step: 10,
        unit: 'mm',
        description: 'Length of baseline AB'
      },
      {
        id: 'leg',
        label: 'Equal Leg Length (AC = BC)',
        symbol: 'L',
        defaultValue: 300,
        min: 160,
        max: 380,
        step: 10,
        unit: 'mm',
        description: 'Length of the two equal sloping sides (Must be > base / 2)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const c = params.base || 260;
      const leg = Math.max(Math.round(c * 0.55), params.leg || 300);
      const ax = 270;
      const ay = 440;
      const bx = ax + c;
      const by = ay;
      const midX = (ax + bx) / 2;
      const h = Math.sqrt(Math.max(10, leg * leg - (c / 2) * (c / 2)));
      const cx = midX;
      const cy = ay - h;

      return [
        {
          stepIndex: 1,
          title: `Step 1: Draw Baseline AB = ${c}mm`,
          instruction: `PROBLEM: Construct an isosceles triangle ABC with base AB = ${c}mm and equal sloping legs AC = BC = ${leg}mm.\nPROCEDURE: Draw horizontal base AB = ${c}mm with a T-square and 2H pencil. Mark points A and B.`,
          detailedNotes: 'Base AB provides the baseline horizontal reference.',
          technicalPrinciple: 'Base segment: Continuous Thick line with dimension indicator.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw base AB = ${c}mm`
          },
          elements: [
            { id: 'prob-iso', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an isosceles triangle (Base=${c}mm, Legs=${leg}mm).` },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Step 2: Strike Compass Arc from A (Radius = ${leg}mm)`,
          instruction: `Set your compass to the leg length ${leg}mm. With compass needle planted at vertex A, strike a generous arc above midpoint of AB.`,
          detailedNotes: `Locus of points at distance ${leg}mm from A.`,
          technicalPrinciple: 'Compass guide arc: Continuous thin 2H line.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: leg,
            visible: true,
            actionText: `Strike arc from A (R = ${leg}mm)`
          },
          elements: [
            { id: 'prob-iso', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an isosceles triangle (Base=${c}mm, Legs=${leg}mm).` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: leg, startAngle: -85, endAngle: -35, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: `Step 3: Strike Intersecting Arc from B (Radius = ${leg}mm) to Locate Apex C`,
          instruction: `Keeping the same compass setting (${leg}mm), plant needle at vertex B and strike an arc intersecting the first arc at apex C.`,
          detailedNotes: `Intersection point C satisfies AC = BC = ${leg}mm simultaneously.`,
          technicalPrinciple: 'Intersection of equal distance loci establishes apex of isosceles triangle.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: bx,
            y: by,
            radius: leg,
            visible: true,
            actionText: `Strike arc from B (R = ${leg}mm) to establish apex C`
          },
          elements: [
            { id: 'prob-iso', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an isosceles triangle (Base=${c}mm, Legs=${leg}mm).` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: leg, startAngle: -85, endAngle: -35 },
            { id: 'arc-B', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: leg, startAngle: -145, endAngle: -95, isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C (Apex)', labelPosition: 'top', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Step 4: Draw Outlines AC, BC and Axis of Symmetry CM',
          instruction: `Join AC and BC using a sharp HB pencil. Draw the vertical axis of symmetry CM in ISO Chain Thin line. Mark double equality ticks on legs AC and BC.`,
          detailedNotes: `Isosceles triangle ABC is complete. Legs AC = BC = ${leg}mm, altitude CM = ${h.toFixed(1)}mm.`,
          technicalPrinciple: 'Perimeter: Continuous Thick line (HB). Centerline axis: Chain Thin line (2H).',
          activeInstrument: {
            toolType: 'RULER',
            x: ax,
            y: ay,
            targetX: cx,
            targetY: cy,
            visible: true,
            actionText: `Draw finished HB outlines and axis of symmetry`
          },
          elements: [
            { id: 'prob-iso', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct an isosceles triangle (Base=${c}mm, Legs=${leg}mm).` },
            { id: 'poly-iso', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]], isNew: true, isFinalResult: true },
            { id: 'axis-cm', type: 'LINE', lineWeight: 'CENTER_LINE', x1: midX, y1: cy - 35, x2: midX, y2: ay + 35, isNew: true },
            { id: 'axis-lbl', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: midX + 15, cy: (cy + ay) / 2, label: 'Axis of Symmetry' },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'top' },
            { id: 'pt-M', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: midX, cy: ay, label: 'M', labelPosition: 'bottom' },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` },
            { id: 'dim-AC', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax - 25, y1: ay - 10, x2: cx - 25, y2: cy - 10, dimensionText: `Leg = ${leg} mm` },
            { id: 'dim-BC', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: bx + 25, y1: by - 10, x2: cx + 25, y2: cy - 10, dimensionText: `Leg = ${leg} mm` },
            { id: 'tk2-b1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (ax + cx) / 2 - 6, y1: (ay + cy) / 2 - 2, x2: (ax + cx) / 2 + 2, y2: (ay + cy) / 2 + 6 },
            { id: 'tk2-b2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (ax + cx) / 2 - 2, y1: (ay + cy) / 2 - 6, x2: (ax + cx) / 2 + 6, y2: (ay + cy) / 2 + 2 },
            { id: 'tk2-a1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (bx + cx) / 2 - 2, y1: (by + cy) / 2 + 6, x2: (bx + cx) / 2 + 6, y2: (by + cy) / 2 - 2 },
            { id: 'tk2-a2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: (bx + cx) / 2 - 6, y1: (by + cy) / 2 + 2, x2: (bx + cx) / 2 + 2, y2: (by + cy) / 2 - 6 }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-triangle-scalene',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 12,
    moduleCode: 'TD-SS1-TRI-03',
    title: 'Construction of a Scalene Triangle',
    shortDescription: 'Construct a scalene triangle with 3 unequal sides and 3 unequal angles using the SSS compass method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 4: Plane Geometry Triangles',
      waecRef: 'WAEC TD Section A: Plane Geometry (Scalene Triangle)',
      isoRef: 'ISO 128-20: Technical Drawing Principles'
    },
    theory: {
      overview: 'A scalene triangle has three unequal side lengths (a ≠ b ≠ c) and three unequal interior angles (none equal). Construction requires satisfying the Triangle Inequality Theorem (a + b > c, a + c > b, b + c > a). Two compass radii b and a swung from baseline endpoints A and B locate apex C.',
      historyAndApplication: 'J.N. Green Fig. 3.2 & Pickup & Parker Plate 4. Used in irregular site boundaries, structural triangulation surveys, and asymmetric mechanical bracing.',
      waecAndNERDCNotes: 'All 3 sides must be dimensioned clearly and labeled with distinct lower-case side symbols (a, b, c).',
      keyPrinciples: [
        {
          title: 'Triangle Inequality Theorem',
          description: 'The sum of any two sides must be strictly greater than the third side: a + b > c.',
          keyRule: 'a + b > c; a ≠ b ≠ c'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.7mm', pencilGrade: 'HB', application: 'Finished triangle perimeter AB, BC, CA' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Compass setting arcs of radii b and a' }
      ]
    },
    parameters: [
      {
        id: 'base',
        label: 'Base Length (c = AB)',
        symbol: 'c',
        defaultValue: 260,
        min: 160,
        max: 360,
        step: 10,
        unit: 'mm',
        description: 'Length of baseline AB'
      },
      {
        id: 'sideA',
        label: 'Side BC (a)',
        symbol: 'a',
        defaultValue: 220,
        min: 140,
        max: 320,
        step: 10,
        unit: 'mm',
        description: 'Length of side BC from B'
      },
      {
        id: 'sideB',
        label: 'Side AC (b)',
        symbol: 'b',
        defaultValue: 180,
        min: 130,
        max: 300,
        step: 10,
        unit: 'mm',
        description: 'Length of side AC from A'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const c = params.base || 260;
      let a = params.sideA || 220;
      let b = params.sideB || 180;

      // Ensure triangle inequality
      if (a + b <= c) {
        a = Math.round(c * 0.65);
        b = Math.round(c * 0.55);
      }

      const ax = 260;
      const ay = 420;
      const bx = ax + c;
      const by = ay;

      // Law of cosines for apex C
      const cosA = Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)));
      const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
      const cx = ax + b * cosA;
      const cy = ay - b * sinA;

      return [
        {
          stepIndex: 1,
          title: `Step 1: Draw Baseline AB = ${c}mm`,
          instruction: `PROBLEM: Construct a scalene triangle ABC given c = ${c}mm, a = ${a}mm, and b = ${b}mm.\nPROCEDURE: Draw horizontal base AB = ${c}mm using a T-square and 2H pencil. Mark points A and B.`,
          detailedNotes: 'Base AB represents the first side c of the scalene triangle.',
          technicalPrinciple: 'Continuous Thick baseline with dimension callout.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw base AB = ${c}mm`
          },
          elements: [
            { id: 'prob-sca', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct scalene triangle (c=${c}mm, a=${a}mm, b=${b}mm).` },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Step 2: Strike Compass Arc from Vertex A (Radius b = ${b}mm)`,
          instruction: `Set compass radius to side b = ${b}mm. With compass needle planted at vertex A, strike a 2H guide arc above baseline AB.`,
          detailedNotes: `Every point on this arc is at distance b = ${b}mm from vertex A.`,
          technicalPrinciple: 'Locus of points at radius b from center A.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: b,
            visible: true,
            actionText: `Strike arc from A (R = ${b}mm)`
          },
          elements: [
            { id: 'prob-sca', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct scalene triangle (c=${c}mm, a=${a}mm, b=${b}mm).` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: b, startAngle: -80, endAngle: -25, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: `Step 3: Strike Intersecting Arc from B (Radius a = ${a}mm) to Locate Apex C`,
          instruction: `Set compass to radius a = ${a}mm. Place compass needle at vertex B and strike an intersecting arc cutting the first arc at apex C.`,
          detailedNotes: `The intersection of arcs A and B pinpoints apex C where AC = ${b}mm and BC = ${a}mm.`,
          technicalPrinciple: 'Simultaneous intersection of two distinct distance loci.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: bx,
            y: by,
            radius: a,
            visible: true,
            actionText: `Strike arc from B (R = ${a}mm) to intersect at C`
          },
          elements: [
            { id: 'prob-sca', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct scalene triangle (c=${c}mm, a=${a}mm, b=${b}mm).` },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: b, startAngle: -80, endAngle: -25 },
            { id: 'arc-B', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: a, startAngle: -155, endAngle: -100, isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C (Apex)', labelPosition: 'top', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Step 4: Draw Outlines AC and BC to Complete Scalene Triangle ABC',
          instruction: `Using a straightedge and HB pencil, join vertex A to C and vertex B to C with bold continuous lines. Dimension all three sides.`,
          detailedNotes: `Scalene triangle ABC is complete with 3 unequal sides (c=${c}mm, a=${a}mm, b=${b}mm) and 3 unequal angles.`,
          technicalPrinciple: 'Finished triangle boundary: Continuous Thick HB line (0.70mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: ax,
            y: ay,
            targetX: cx,
            targetY: cy,
            visible: true,
            actionText: `Draw finished HB outlines AC and BC`
          },
          elements: [
            { id: 'prob-sca', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 100, cy: 60, label: `PROBLEM: Construct scalene triangle (c=${c}mm, a=${a}mm, b=${b}mm).` },
            { id: 'poly-sca', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy]], isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'top' },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 45, x2: bx, y2: by + 45, dimensionText: `c = ${c} mm` },
            { id: 'dim-b', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax - 25, y1: ay - 10, x2: cx - 25, y2: cy - 10, dimensionText: `b = ${b} mm` },
            { id: 'dim-a', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: bx + 25, y1: by - 10, x2: cx + 25, y2: cy - 10, dimensionText: `a = ${a} mm` },
            { id: 'sca-note', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: (ax + bx) / 2 - 60, cy: ay - 35, label: 'All sides & angles unequal' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-regular-hexagon',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 1,
    moduleCode: 'TD-SS1-MOD06',
    title: 'Construction of a Regular Hexagon (Given Side Length)',
    shortDescription: 'Construct a regular 6-sided hexagon given side length S using the circumcircle and 60° equilateral triangle stepping method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Regular Polygons',
      waecRef: 'WAEC TD Section A: Hexagon Construction',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'A regular hexagon has six equal sides and six equal interior angles of 120°. The distance from the circumcenter to each vertex equals the side length S, enabling simple compass construction using six equilateral triangles.',
      historyAndApplication: 'Hexagonal bolt heads, nuts, allen key sockets, bee honeycomb structures, and torque transmission shafts.',
      waecAndNERDCNotes: 'The circumscribing circle (radius R = S) should be drawn with a 2H pencil. All six vertices A through F must be clearly joined with HB pencil lines.',
      keyPrinciples: [
        {
          title: 'Hexagon Circumradius Equality',
          description: 'For any regular hexagon, the circumscribed circle radius R is strictly equal to the side length S.',
          keyRule: 'R = S'
        },
        {
          title: 'Interior and Exterior Angles',
          description: 'Interior angle = 120°, Exterior angle = 60°, Distance Across Corners (A/C) = 2S, Distance Across Flats (A/F) = S * sqrt(3).',
          keyRule: 'D_{corners} = 2S, \\quad D_{flats} = S\\sqrt{3}'
        }
      ],
      formulas: [
        {
          latex: 'D_{corners} = 2S, \\quad D_{flats} = \\sqrt{3}S \\approx 1.732S',
          description: 'Hexagon width across corners and width across flats'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished hexagonal perimeter ABCDEF' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Circumcircle and vertex stepping arcs' }
      ]
    },
    parameters: [
      {
        id: 'sideLength',
        label: 'Side Length (S)',
        symbol: 'S',
        defaultValue: 110,
        min: 70,
        max: 160,
        step: 5,
        unit: 'mm',
        description: 'Length of each hexagon edge'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const S = params.sideLength || 110;
      const cx = 400;
      const cy = 300;

      // 6 vertices centered at (cx, cy) with radius S
      // Start with horizontal base AB at bottom
      const angles = [60, 0, 300, 240, 180, 120].map(deg => (deg * Math.PI) / 180);
      const vertices: [number, number][] = angles.map(rad => [
        cx + S * Math.cos(rad),
        cy + S * Math.sin(rad)
      ]);

      const [pB, pC, pD, pE, pF, pA] = vertices;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Base Edge AB',
          instruction: `Draw base side AB of length ${S} mm horizontally using your T-square and HB pencil.`,
          detailedNotes: 'Mark endpoints A and B neatly.',
          technicalPrinciple: 'Base side of hexagon: S = ' + S + 'mm.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: pA[0] - 20,
            y: pA[1],
            targetX: pB[0] + 20,
            targetY: pB[1],
            visible: true,
            actionText: `Draw base side AB = ${S}mm`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pA[0], cy: pA[1], label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pB[0], cy: pB[1], label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1], isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pA[0], y1: pA[1] + 35, x2: pB[0], y2: pB[1] + 35, dimensionText: `S = ${S} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Locate Circumcenter O Using Arcs from A and B',
          instruction: `With compass set to S = ${S} mm, strike an arc from center A and an arc from center B above AB to intersect at circumcenter O.`,
          detailedNotes: 'Triangle ABO is an equilateral triangle with sides all equal to S.',
          technicalPrinciple: 'Circumcenter O is equidistant to all vertices: OA = OB = S.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: S,
            visible: true,
            actionText: `Intersect arcs from A and B to find center O`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] },
            { id: 'arc-find-O-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pA[0], cy: pA[1], r: S, startAngle: -90, endAngle: -30, isNew: true },
            { id: 'arc-find-O-B', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pB[0], cy: pB[1], r: S, startAngle: -150, endAngle: -90, isNew: true },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'O', labelPosition: 'center', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw the Circumcircle through A and B',
          instruction: `With center at O and compass radius r = ${S} mm, draw a complete circle passing through A and B.`,
          detailedNotes: 'This is the circumscribing circle containing all 6 vertices of the regular hexagon.',
          technicalPrinciple: 'Circumcircle definition: 0.25mm Continuous Thin line.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: S,
            visible: true,
            actionText: `Draw circumcircle with center O and radius R = ${S}mm`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'O', labelPosition: 'center' },
            { id: 'circle-circum', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: S, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Step Off Vertices C, D, E, F and Join Complete Hexagon',
          instruction: `With compass radius maintained at ${S} mm, step off points C, D, E, and F around the circumference. Connect vertices A-B-C-D-E-F-A with thick continuous outline (HB pencil).`,
          detailedNotes: 'The regular hexagon ABCDEF is complete with 6 equal sides of ' + S + ' mm and interior angles of 120°.',
          technicalPrinciple: 'Complete polygon: Continuous Thick line (0.5mm) with interior angles = 120° exactly.',
          activeInstrument: {
            toolType: 'RULER',
            x: pE[0],
            y: pE[1],
            targetX: pA[0],
            targetY: pA[1],
            visible: true,
            actionText: `Connect all 6 vertices with thick continuous outlines`
          },
          elements: [
            { id: 'circle-circum', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: cx, cy: cy, r: S },
            { id: 'poly-hex', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [pA, pB, pC, pD, pE, pF], isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pA[0], cy: pA[1], label: 'A', labelPosition: 'bottom-right' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pB[0], cy: pB[1], label: 'B', labelPosition: 'top-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pC[0], cy: pC[1], label: 'C', labelPosition: 'top' },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pD[0], cy: pD[1], label: 'D', labelPosition: 'top-left' },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pE[0], cy: pE[1], label: 'E', labelPosition: 'bottom-left' },
            { id: 'pt-F', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pF[0], cy: pF[1], label: 'F', labelPosition: 'bottom' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-hexagon-across-corners',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 2,
    moduleCode: 'TD-SS1-MOD06',
    title: 'Construction of Regular Hexagon Across Corners (A/C = 2S)',
    shortDescription: 'Construct a regular hexagon given the distance across opposite corners C = 2S using the circumscribing circle and 60° compass stepping chord method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Regular Polygons (Across Corners)',
      waecRef: 'WAEC TD Section A: Hexagon Given Across Corners',
      isoRef: 'ISO 128-20: Technical Product Documentation'
    },
    theory: {
      overview: 'When constructing a regular hexagon across corners (A/C), the specified dimension is the maximum distance between two opposite vertices. In a regular hexagon, the distance across corners equals twice the side length (C = 2S), meaning the circumradius R is exactly half of C (R = S = C/2).',
      historyAndApplication: 'Used in machining, hex-head bolts, socket head cap screws, aerospace fasteners, and structural steel bolt joints where corner clearance must be verified.',
      waecAndNERDCNotes: 'Draw the circumscribing circle of diameter C with a 2H pencil. Use compass radius R = C/2 centered at the horizontal diameter ends to locate all six vertices. Join with HB lines.',
      keyPrinciples: [
        {
          title: 'Across Corners Relationship',
          description: 'The distance across opposite corners C strictly equals twice the side length: C = 2S, R = C/2.',
          keyRule: 'C = 2S \\iff R = S = \\frac{C}{2}'
        },
        {
          title: '60° Equilateral Triangle Partition',
          description: 'Each of the six radial sectors is an equilateral triangle with side length R = S.',
          keyRule: '6 \\times 60^\\circ = 360^\\circ'
        }
      ],
      formulas: [
        {
          latex: 'C = 2S, \\quad S = \\frac{C}{2}, \\quad W = S\\sqrt{3} = \\frac{C\\sqrt{3}}{2}',
          description: 'Across corners C, side length S, and across flats W'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished hexagonal perimeter' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Circumscribing circle and chord stepping arcs' },
        { lineName: 'Chain Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Symmetry centerlines' }
      ]
    },
    parameters: [
      {
        id: 'acrossCorners',
        label: 'Across Corners (C)',
        symbol: 'C',
        defaultValue: 220,
        min: 140,
        max: 280,
        step: 10,
        unit: 'mm',
        description: 'Distance across opposite vertices'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const C = params.acrossCorners || 220;
      const R = C / 2;
      const cx = 400;
      const cy = 300;

      // Vertices with A and D on horizontal centerline
      // Angles: A=180°, B=120°, C=60°, D=0°, E=300°, F=240°
      const pA: [number, number] = [cx - R, cy];
      const pB: [number, number] = [cx - R * 0.5, cy - R * (Math.sqrt(3) / 2)];
      const pC: [number, number] = [cx + R * 0.5, cy - R * (Math.sqrt(3) / 2)];
      const pD: [number, number] = [cx + R, cy];
      const pE: [number, number] = [cx + R * 0.5, cy + R * (Math.sqrt(3) / 2)];
      const pF: [number, number] = [cx - R * 0.5, cy + R * (Math.sqrt(3) / 2)];

      return [
        {
          stepIndex: 1,
          title: 'Draw Centerlines and Circumscribing Diameter AD',
          instruction: `Draw horizontal and vertical centerlines through center O. Mark points A and D on the horizontal centerline so that AD = Across Corners C = ${C}mm.`,
          detailedNotes: 'Center O bisects diameter AD into two equal radii R = ' + R.toFixed(1) + ' mm.',
          technicalPrinciple: 'Across Corners C = 2S; Circumradius R = C / 2 = ' + R.toFixed(1) + 'mm.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: cx - R - 40,
            y: cy,
            targetX: cx + R + 40,
            targetY: cy,
            visible: true,
            actionText: `Draw horizontal diameter AD = ${C}mm`
          },
          elements: [
            { id: 'cl-h', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx - R - 50, y1: cy, x2: cx + R + 50, y2: cy },
            { id: 'cl-v', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - R - 50, x2: cx, y2: cy + R + 50 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx, cy, label: 'O', labelPosition: 'bottom-right' },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pA[0], cy: pA[1], label: 'A', labelPosition: 'left' },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pD[0], cy: pD[1], label: 'D', labelPosition: 'right' },
            { id: 'dim-AC', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pA[0], y1: cy + 45, x2: pD[0], y2: cy + 45, dimensionText: `Across Corners C = ${C} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw Circumscribed Circle of Radius R = C/2',
          instruction: `Set compass point at center O and pencil at A (radius R = ${R.toFixed(1)}mm). Draw the complete circumscribing circle in thin continuous 2H line.`,
          detailedNotes: 'This circle passes through all six vertices of the hexagon.',
          technicalPrinciple: 'In a regular hexagon, circumscribed radius equals side length: R = S = ' + R.toFixed(1) + 'mm.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: R,
            visible: true,
            actionText: `Draw circumcircle Ø = ${C}mm with center O`
          },
          elements: [
            { id: 'cl-h', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx - R - 50, y1: cy, x2: cx + R + 50, y2: cy },
            { id: 'cl-v', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - R - 50, x2: cx, y2: cy + R + 50 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx, cy, label: 'O', labelPosition: 'bottom-right' },
            { id: 'circumcircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r: R, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Swing Stepping Arcs from Endpoints A and D',
          instruction: `Without altering compass radius R = ${R.toFixed(1)}mm, place compass at point A and swing arcs intersecting the circle at B and F. Place compass at D and swing arcs intersecting at C and E.`,
          detailedNotes: 'These compass arcs divide the circumference into 6 equal arcs of 60° each.',
          technicalPrinciple: 'Chord stepping theorem: chord length equal to radius subtends exactly 60° at the center.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: pA[0],
            y: pA[1],
            radius: R,
            visible: true,
            actionText: `Swing stepping arcs from A and D (R = ${R.toFixed(1)}mm)`
          },
          elements: [
            { id: 'circumcircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r: R },
            { id: 'arc-A-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pA[0], cy: pA[1], r: R, startAngle: -90, endAngle: -30, isNew: true },
            { id: 'arc-A-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pA[0], cy: pA[1], r: R, startAngle: 30, endAngle: 90, isNew: true },
            { id: 'arc-D-top', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pD[0], cy: pD[1], r: R, startAngle: -150, endAngle: -90, isNew: true },
            { id: 'arc-D-bot', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: pD[0], cy: pD[1], r: R, startAngle: 90, endAngle: 150, isNew: true },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pB[0], cy: pB[1], label: 'B', labelPosition: 'top-left' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pC[0], cy: pC[1], label: 'C', labelPosition: 'top-right' },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pE[0], cy: pE[1], label: 'E', labelPosition: 'bottom-right' },
            { id: 'pt-F', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: pF[0], cy: pF[1], label: 'F', labelPosition: 'bottom-left' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Join Vertices to Complete Hexagon Across Corners',
          instruction: `Using a straightedge and sharp HB pencil (0.5mm continuous thick line), join vertices A-B-C-D-E-F-A consecutively.`,
          detailedNotes: 'The finished regular hexagon has side length S = ' + R.toFixed(1) + 'mm and Across Corners C = ' + C + 'mm.',
          technicalPrinciple: 'Finished polygon outline: Type A continuous thick line (HB). Construction arcs preserved in 2H.',
          activeInstrument: {
            toolType: 'RULER',
            x: pF[0],
            y: pF[1],
            targetX: pA[0],
            targetY: pA[1],
            visible: true,
            actionText: `Join 6 vertices with HB pencil`
          },
          elements: [
            { id: 'circumcircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r: R },
            { id: 'poly-hex-ac', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [pA, pB, pC, pD, pE, pF], isNew: true, isFinalResult: true },
            { id: 'dim-AC-final', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pA[0], y1: cy + R + 35, x2: pD[0], y2: cy + R + 35, dimensionText: `Across Corners C = ${C} mm` },
            { id: 'dim-S-final', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pB[0], y1: pB[1] - 25, x2: pC[0], y2: pC[1] - 25, dimensionText: `S = ${R.toFixed(1)} mm` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-hexagon-across-flats',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 3,
    moduleCode: 'TD-SS1-MOD06',
    title: 'Construction of Regular Hexagon Across Flats (A/F = W)',
    shortDescription: 'Construct a regular hexagon given the distance across opposite flats W using the inscribed circle and 30°/60° set-square tangency method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Regular Polygons (Across Flats)',
      waecRef: 'WAEC TD Section A: Hexagon Given Across Flats',
      isoRef: 'ISO 272 / ISO 4014: Fasteners — Hexagon head bolts'
    },
    theory: {
      overview: 'When constructing a hexagon across flats (A/F), the given dimension W represents the perpendicular width between opposite parallel faces. In this configuration, the hexagon circumscribes an inscribed circle of diameter W (radius r = W/2), and its six sides are tangents to this circle.',
      historyAndApplication: 'Universal standard for bolt heads, nuts, spanner and socket wrench sizes (e.g., 17mm A/F, 19mm A/F), plumbing pipe fittings, and hexagonal stock bars.',
      waecAndNERDCNotes: 'Draw the inscribed circle with diameter W in 2H line. Draw top and bottom horizontal tangents with the T-square. Draw the four 60° tangents using a 30°/60° set-square resting on the T-square.',
      keyPrinciples: [
        {
          title: 'Across Flats Tangency Condition',
          description: 'The distance across flats W is the diameter of the inscribed circle: W = 2r. The sides are tangents to this incircle.',
          keyRule: 'r = \\frac{W}{2}, \\quad W = S\\sqrt{3}'
        },
        {
          title: '30°/60° Set-Square Efficiency',
          description: 'The exterior angle is 60°, so tangents can be drawn directly with a standard 30°/60° set-square without protractor measurement.',
          keyRule: '\\theta = 60^\\circ'
        }
      ],
      formulas: [
        {
          latex: 'W = S\\sqrt{3} \\approx 1.732S, \\quad S = \\frac{W}{\\sqrt{3}} \\approx 0.5774W, \\quad C = \\frac{2W}{\\sqrt{3}} \\approx 1.1547W',
          description: 'Width across flats W, side length S, and across corners C'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished hexagonal perimeter' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Inscribed circle and tangent guide lines' },
        { lineName: 'Chain Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines' }
      ]
    },
    parameters: [
      {
        id: 'acrossFlats',
        label: 'Across Flats (W)',
        symbol: 'W',
        defaultValue: 190,
        min: 120,
        max: 260,
        step: 10,
        unit: 'mm',
        description: 'Perpendicular distance between parallel flat faces'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const W = params.acrossFlats || 190;
      const r = W / 2; // incircle radius
      const S = W / Math.sqrt(3); // side length
      const R = S; // circumradius = side length
      const cx = 400;
      const cy = 300;

      // Hexagon with top and bottom horizontal flats:
      // Vertices at angles: 30°, 90°, 150°, 210°, 270°, 330°
      const v1: [number, number] = [cx + S * Math.cos(Math.PI / 6), cy - S * Math.sin(Math.PI / 6)]; // top right
      const v2: [number, number] = [cx, cy - S]; // top apex if corners, BUT for horizontal flats:
      // For horizontal top and bottom flats:
      // Vertices:
      // Top flat: from (cx - S/2, cy - r) to (cx + S/2, cy - r)
      // Bottom flat: from (cx - S/2, cy + r) to (cx + S/2, cy + r)
      // Leftmost vertex: (cx - S, cy)
      // Rightmost vertex: (cx + S, cy)
      const p1: [number, number] = [cx - S / 2, cy - r]; // top-left
      const p2: [number, number] = [cx + S / 2, cy - r]; // top-right
      const p3: [number, number] = [cx + S, cy];         // right corner
      const p4: [number, number] = [cx + S / 2, cy + r]; // bottom-right
      const p5: [number, number] = [cx - S / 2, cy + r]; // bottom-left
      const p6: [number, number] = [cx - S, cy];         // left corner

      return [
        {
          stepIndex: 1,
          title: 'Draw Centerlines and Inscribed Circle of Diameter W',
          instruction: `Draw horizontal and vertical centerlines intersecting at center O. With compass set to radius r = W / 2 = ${r.toFixed(1)}mm, draw the inscribed circle in thin continuous 2H line.`,
          detailedNotes: 'The diameter of this circle is exactly equal to the specified distance Across Flats W = ' + W + 'mm.',
          technicalPrinciple: 'Inscribed circle diameter = Distance Across Flats: D = W = ' + W + 'mm.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: r,
            visible: true,
            actionText: `Draw inscribed circle Ø = ${W}mm with center O`
          },
          elements: [
            { id: 'cl-h', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx - S - 50, y1: cy, x2: cx + S + 50, y2: cy },
            { id: 'cl-v', type: 'SEGMENT', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - r - 50, x2: cx, y2: cy + r + 50 },
            { id: 'pt-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx, cy, label: 'O', labelPosition: 'bottom-right' },
            { id: 'incircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r, isNew: true },
            { id: 'dim-W', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - r - 35, y1: cy - r, x2: cx - r - 35, y2: cy + r, dimensionText: `Across Flats W = ${W} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw Horizontal Tangents with T-Square',
          instruction: `Using the T-square, draw horizontal tangent lines touching the top and bottom of the inscribed circle at y = O ± ${r.toFixed(1)}mm.`,
          detailedNotes: 'These two lines form the top and bottom parallel flats of the hexagon.',
          technicalPrinciple: 'Horizontal tangent is perpendicular to vertical centerline: slope = 0°.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: cx - S - 30,
            y: cy - r,
            targetX: cx + S + 30,
            targetY: cy - r,
            visible: true,
            actionText: `Draw horizontal tangents touching top and bottom of circle`
          },
          elements: [
            { id: 'incircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r },
            { id: 'tan-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cx - S * 1.2, y1: cy - r, x2: cx + S * 1.2, y2: cy - r, isNew: true },
            { id: 'tan-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cx - S * 1.2, y1: cy + r, x2: cx + S * 1.2, y2: cy + r, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Four 60° Tangents Using 30°/60° Set-Square',
          instruction: `Place your 30°/60° set-square on the T-square. Draw four tangent lines inclined at 60° to the horizontal, each touching the inscribed circle at the quadrants.`,
          detailedNotes: 'The four inclined tangents intersect each other and the two horizontal tangents, forming all six vertices.',
          technicalPrinciple: 'Hexagonal exterior angle is 60°; tangents drawn at 60° to horizontal form a regular 120° interior angle.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cx + S / 2,
            y: cy - r,
            targetX: cx + S,
            targetY: cy,
            visible: true,
            actionText: `Draw four 60° tangent lines around incircle`
          },
          elements: [
            { id: 'incircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r },
            { id: 'tan-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cx - S * 1.2, y1: cy - r, x2: cx + S * 1.2, y2: cy - r },
            { id: 'tan-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cx - S * 1.2, y1: cy + r, x2: cx + S * 1.2, y2: cy + r },
            { id: 'tan-tr', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p2[0] - 20, y1: p2[1] - 12, x2: p3[0] + 20, y2: p3[1] + 35, isNew: true },
            { id: 'tan-br', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p3[0] + 20, y1: p3[1] - 35, x2: p4[0] - 20, y2: p4[1] + 12, isNew: true },
            { id: 'tan-tl', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p6[0] - 20, y1: p6[1] + 35, x2: p1[0] + 20, y2: p1[1] - 12, isNew: true },
            { id: 'tan-bl', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p6[0] - 20, y1: p6[1] - 35, x2: p5[0] + 20, y2: p5[1] + 12, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Outline Hexagon Across Flats with Firm HB Pencil',
          instruction: `Darken the perimeter of the regular hexagon with a sharp HB pencil (0.5mm continuous thick line). Leave construction lines and inscribed circle faintly visible in 2H.`,
          detailedNotes: 'The hexagon has distance Across Flats W = ' + W + 'mm, side length S = ' + S.toFixed(1) + 'mm, and Across Corners C = ' + (2 * S).toFixed(1) + 'mm.',
          technicalPrinciple: 'Finished polygon outline: Type A continuous thick line (HB). ISO bolt fastener standard.',
          activeInstrument: {
            toolType: 'RULER',
            x: p6[0],
            y: p6[1],
            targetX: p1[0],
            targetY: p1[1],
            visible: true,
            actionText: `Outline hexagon across flats in firm HB`
          },
          elements: [
            { id: 'incircle', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx, cy, r },
            { id: 'poly-hex-af', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [p1, p2, p3, p4, p5, p6], isNew: true, isFinalResult: true },
            { id: 'dim-W-final', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - r - 40, y1: cy - r, x2: cx - r - 40, y2: cy + r, dimensionText: `Across Flats W = ${W} mm` },
            { id: 'dim-S-final', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: p1[0], y1: p1[1] - 25, x2: p2[0], y2: p2[1] - 25, dimensionText: `S = ${S.toFixed(1)} mm` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-regular-pentagon',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 4,
    moduleCode: 'TD-SS1-MOD07',
    title: 'Construction of a Regular Pentagon (Given Base Length)',
    shortDescription: 'Construct a regular 5-sided pentagon with equal side length S and 108° interior angles using perpendicular bisection and golden ratio arcs.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Polygons and Geometrical Shapes',
      waecRef: 'WAEC TD Section A: Pentagon Construction',
      isoRef: 'ISO 128-20: Technical Drawing Conventions'
    },
    theory: {
      overview: 'A regular pentagon has five equal sides and five equal interior angles of 108°. The ratio of its diagonal to side length is the golden ratio phi = (1 + sqrt(5)) / 2 = 1.618033.',
      historyAndApplication: 'Architectural ornamental designs, geodesic polyhedron nodes, mechanical star-wheel indexing gears, and five-spoke automotive rims.',
      waecAndNERDCNotes: 'Construct the perpendicular at endpoint B equal to AB, bisect AB at M, and strike arc MC to locate the diagonal length.',
      keyPrinciples: [
        {
          title: 'Golden Ratio Diagonal Relation',
          description: 'The diagonal d of a regular pentagon relates to side S by d = S * (1 + sqrt(5)) / 2 = 1.618 * S.',
          keyRule: 'd = 1.618 \\times S'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished pentagonal perimeter ABCDE' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Perpendicular baseline, midpoint arcs, and diagonal loci' }
      ]
    },
    parameters: [
      {
        id: 'sideLength',
        label: 'Base Side Length (S)',
        symbol: 'S',
        defaultValue: 120,
        min: 80,
        max: 160,
        step: 5,
        unit: 'mm',
        description: 'Length of pentagon side AB'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const S = params.sideLength || 120;
      const d = S * 1.618033; // Golden ratio diagonal length

      const ax = 340;
      const ay = 440;
      const bx = ax + S;
      const by = ay;

      // Pentagon vertices coordinates:
      // A = (ax, ay), B = (bx, by)
      // C: from B at angle 72 deg: B + S*(cos(72), -sin(72))
      // E: from A at angle 108 deg: A + S*(-cos(72), -sin(72))
      // D (apex): top center
      const rad72 = (72 * Math.PI) / 180;
      const cx = bx + S * Math.cos(rad72);
      const cy = by - S * Math.sin(rad72);

      const ex = ax - S * Math.cos(rad72);
      const ey = by - S * Math.sin(rad72);

      // Apex D is at distance S from both C and E
      const dx = (ax + bx) / 2;
      const dy = cy - Math.sqrt(Math.max(0, S * S - Math.pow(dx - cx, 2)));

      return [
        {
          stepIndex: 1,
          title: 'Draw the Base Segment AB',
          instruction: `Draw base side AB = ${S} mm horizontally with an HB pencil.`,
          detailedNotes: 'Mark endpoints A and B clearly.',
          technicalPrinciple: 'Base line definition: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw base AB = ${S}mm`
          },
          elements: [
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'dim-AB', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 35, x2: bx, y2: by + 35, dimensionText: `S = ${S} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct Diagonal Length d = 1.618 * S Using Golden Arc',
          instruction: `Using midpoint M of AB and perpendicular BC = S, swing arc to find diagonal distance d = ${(d).toFixed(1)} mm.`,
          detailedNotes: 'The diagonal connects non-adjacent vertices (e.g. AC, BD, CE).',
          technicalPrinciple: 'Golden ratio construction: d = S * 1.618.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: d,
            visible: true,
            actionText: `Set compass to diagonal span d = ${(d).toFixed(1)}mm`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'arc-diag-A', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: ax, cy: ay, r: d, startAngle: -80, endAngle: -25, isNew: true },
            { id: 'arc-diag-B', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: bx, cy: by, r: d, startAngle: -155, endAngle: -100, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Locate Vertices C, D, and E by Intersecting Arcs',
          instruction: `Strike arc of radius S = ${S} mm from B to intersect diagonal arc from A at point C. Strike arc of radius S from A to intersect diagonal arc from B at point E. Intersect arcs of radius S from C and E to pinpoint apex D.`,
          detailedNotes: 'All 5 sides equal S = ' + S + ' mm.',
          technicalPrinciple: 'Simultaneous locus intersection for pentagon vertices.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cx,
            y: cy,
            radius: S,
            visible: true,
            actionText: `Intersect side arcs to locate C, D, E`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'right', isNew: true },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: dx, cy: dy, label: 'D (Apex)', labelPosition: 'top', isNew: true },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ex, cy: ey, label: 'E', labelPosition: 'left', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Join All 5 Edges to Complete Regular Pentagon',
          instruction: `Join vertices A-B-C-D-E-A with thick continuous outline (HB pencil).`,
          detailedNotes: 'Regular pentagon ABCDE is complete with 5 equal sides of ' + S + ' mm and interior angles of 108°.',
          technicalPrinciple: 'Complete polygon: Continuous Thick line (0.5mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: ex,
            y: ey,
            targetX: ax,
            targetY: ay,
            visible: true,
            actionText: `Draw complete pentagon outline`
          },
          elements: [
            { id: 'poly-pentagon', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[ax, ay], [bx, by], [cx, cy], [dx, dy], [ex, ey]], isNew: true, isFinalResult: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
            { id: 'pt-C', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy, label: 'C', labelPosition: 'right' },
            { id: 'pt-D', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: dx, cy: dy, label: 'D', labelPosition: 'top' },
            { id: 'pt-E', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ex, cy: ey, label: 'E', labelPosition: 'left' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-general-polygon',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 5,
    moduleCode: 'TD-SS1-MOD08',
    title: 'General Method for Constructing ANY Regular N-Sided Polygon',
    shortDescription: 'Construct any regular polygon (n = 5, 6, 7, 8, 9, 10) on a given base AB using the universal perpendicular bisector / semicircle method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 5: Universal Polygon Construction',
      waecRef: 'WAEC TD Section A: General Polygon Method',
      isoRef: 'ISO 128-20: Technical Drawing Guidelines'
    },
    theory: {
      overview: 'The universal polygon method provides a standardized geometric algorithm to construct any n-sided regular polygon on a given base AB by locating the circumcenter on the perpendicular bisector using a graduated scale between point 4 (square center) and point 6 (hexagon center).',
      historyAndApplication: 'Used when drafting heptagons (7-sided), nonagons (9-sided), and undecagons (11-sided) where simple compass stepping is mathematically impossible.',
      waecAndNERDCNotes: 'Construct square on AB to find point 4, construct 60° equilateral arc to find point 6, and bisect distance 4-6 to find point 5. Stepping unit 4-5 up gives points 7, 8, 9...',
      keyPrinciples: [
        {
          title: 'Points 4 and 6 Circumcenter Rule',
          description: 'Point 4 is the circumcenter of a square on AB. Point 6 is the circumcenter of a hexagon on AB. The distance 4-5 = 5-6 = 6-7 = 7-8 is constant.',
          keyRule: 'd_{4-6} / 2 = \\text{Unit Step for Any N}'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished regular polygon outline' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Perpendicular bisector, graduation scale, and circumcircle' }
      ]
    },
    parameters: [
      {
        id: 'sides',
        label: 'Number of Sides (N)',
        symbol: 'N',
        defaultValue: 7,
        min: 5,
        max: 9,
        step: 1,
        unit: 'sides',
        description: 'Number of sides for regular polygon (5=Pentagon, 7=Heptagon, 8=Octagon, 9=Nonagon)'
      },
      {
        id: 'baseLength',
        label: 'Base Side Length (AB)',
        symbol: 'S',
        defaultValue: 100,
        min: 70,
        max: 130,
        step: 5,
        unit: 'mm',
        description: 'Length of base edge AB'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const N = Math.round(params.sides || 7);
      const S = params.baseLength || 100;

      const midX = 400;
      const midY = 460;
      const ax = midX - S / 2;
      const ay = midY;
      const bx = midX + S / 2;
      const by = midY;

      // Point 4: center of square = (midX, midY - S/2)
      const y4 = midY - S / 2;
      // Point 6: center of hexagon = (midX, midY - S * sqrt(3)/2)
      const y6 = midY - (S * Math.sqrt(3)) / 2;
      const stepUnit = Math.abs(y6 - y4) / 2;

      // Center for N: yN = y4 - (N - 4) * stepUnit
      const centerYN = y4 - (N - 4) * stepUnit;
      const radiusN = Math.sqrt(Math.pow(ax - midX, 2) + Math.pow(ay - centerYN, 2));

      // Calculate N vertices around circumcircle (center: midX, centerYN, radius: radiusN)
      // Angle for A is: atan2(ay - centerYN, ax - midX)
      const angleA = Math.atan2(ay - centerYN, ax - midX);
      const stepAngle = (2 * Math.PI) / N;

      const polyPoints: [number, number][] = [];
      for (let i = 0; i < N; i++) {
        const theta = angleA + i * stepAngle;
        polyPoints.push([midX + radiusN * Math.cos(theta), centerYN + radiusN * Math.sin(theta)]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Base Line AB and Erect Perpendicular Bisector',
          instruction: `Draw base side AB = ${S} mm. Erect an extended perpendicular bisector line upward through midpoint M.`,
          detailedNotes: 'The perpendicular bisector contains the circumcenters for all regular polygons on base AB.',
          technicalPrinciple: 'Symmetry locus: All regular polygon centers lie on the perpendicular bisector.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ax - 30,
            y: ay,
            targetX: bx + 30,
            targetY: by,
            visible: true,
            actionText: `Draw base AB = ${S}mm and perpendicular bisector`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by, isNew: true },
            { id: 'pt-A', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ax, cy: ay, label: 'A', labelPosition: 'left' },
            { id: 'pt-B', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bx, cy: by, label: 'B', labelPosition: 'right' },
            { id: 'line-bisector', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: midX, y1: ay + 20, x2: midX, y2: 80, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: 'Locate Calibration Points 4 and 6 on the Bisector',
          instruction: `With center A and radius AB, swing arc to bisector to locate point 4 (square center). With center A and radius AB, swing arc from B to bisector to locate point 6 (hexagon center).`,
          detailedNotes: 'Point 4 is at height S/2 and Point 6 is at height S*sqrt(3)/2.',
          technicalPrinciple: 'Points 4 and 6 establish the universal calibration scale on the bisector.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: ax,
            y: ay,
            radius: S,
            visible: true,
            actionText: `Swing arcs to locate points 4 and 6 on bisector`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'line-bisector', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: midX, y1: ay + 20, x2: midX, y2: 80 },
            { id: 'pt-4', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: midX, cy: y4, label: '4 (Square)', labelPosition: 'right', isNew: true },
            { id: 'pt-6', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: midX, cy: y6, label: '6 (Hexagon)', labelPosition: 'right', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Graduate the Scale to Find Circumcenter Point ${N}`,
          instruction: `Bisect distance 4-6 to find point 5. Step off equal unit intervals along the bisector to locate center point ${N}. Draw the circumcircle passing through A and B with radius R = ${(radiusN).toFixed(1)} mm.`,
          detailedNotes: `Point ${N} is the exact circumcenter for a regular ${N}-sided polygon.`,
          technicalPrinciple: 'Universal polygon scaling relation.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: midX,
            y: centerYN,
            radius: radiusN,
            visible: true,
            actionText: `Draw circumcircle with center ${N} and radius R = ${(radiusN).toFixed(1)}mm`
          },
          elements: [
            { id: 'line-AB', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ax, y1: ay, x2: bx, y2: by },
            { id: 'line-bisector', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: midX, y1: ay + 20, x2: midX, y2: 80 },
            { id: 'pt-4', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: midX, cy: y4, label: '4', labelPosition: 'right' },
            { id: 'pt-6', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: midX, cy: y6, label: '6', labelPosition: 'right' },
            { id: `pt-${N}`, type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: midX, cy: centerYN, label: `${N} (Center)`, labelPosition: 'right', isNew: true },
            { id: 'circle-poly', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: midX, cy: centerYN, r: radiusN, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: `Step Off Base S = ${S}mm and Draw Complete Regular ${N}-Gon`,
          instruction: `With compass set to base S = ${S} mm, step off all ${N} vertices around the circumference. Connect all vertices with thick continuous outlines (HB pencil).`,
          detailedNotes: `Complete regular ${N}-sided polygon with equal side lengths of ${S} mm.`,
          technicalPrinciple: 'Complete polygon: Continuous Thick line (0.5mm).',
          activeInstrument: {
            toolType: 'RULER',
            x: polyPoints[0][0],
            y: polyPoints[0][1],
            targetX: polyPoints[1][0],
            targetY: polyPoints[1][1],
            visible: true,
            actionText: `Connect all ${N} vertices with straight edges`
          },
          elements: [
            { id: 'circle-poly', type: 'CIRCLE', lineWeight: 'THIN_CONTINUOUS', cx: midX, cy: centerYN, r: radiusN },
            { id: 'poly-result', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: polyPoints, isNew: true, isFinalResult: true },
            ...polyPoints.map((pt, idx) => ({
              id: `pt-v-${idx + 1}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `V${idx + 1}`,
              labelPosition: 'top' as const
            }))
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-plain-scale',
    tier: 'SS1',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 7,
    moduleCode: 'TD-SS1-MOD09',
    title: 'Construction of a Plain Scale (RF = 1:50, Reading Meters & Decimeters)',
    shortDescription: 'Construct a calibrated plain engineering scale given Representative Fraction (RF) and maximum measurable length.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS1 TD Unit 6: Scales and Proportion',
      waecRef: 'WAEC TD Section A: Plain Scale Construction',
      isoRef: 'ISO 5455: Scales in Technical Drawings'
    },
    theory: {
      overview: 'A scale is the ratio of linear dimensions on a drawing to the actual linear dimensions of the physical object. A Plain Scale represents two consecutive units (e.g. meters and decimeters, or feet and inches).',
      historyAndApplication: 'Architectural floor plans, structural steel framing, civil land surveys, and mechanical component blueprints.',
      waecAndNERDCNotes: 'Always state RF explicitly: RF = Drawing Length / Actual Length. The sub-unit zero is placed at the first major division, with minor units graduated to the left.',
      keyPrinciples: [
        {
          title: 'Length of Scale (LOS) Formula',
          description: 'Length of Scale on Drawing = RF * Maximum Length to be Measured.',
          keyRule: 'LOS = RF \\times L_{max}'
        },
        {
          title: 'Zero Placement Convention',
          description: 'The numeral 0 is placed between the primary major scale (right) and the secondary sub-scale (left).',
          keyRule: 'Sub-units left of 0, Main units right of 0'
        }
      ],
      formulas: [
        {
          latex: 'RF = (Dimension on Drawing) / (Actual Dimension),   LOS = RF × L_max',
          description: 'Scale ratio and physical length of drawing bar'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Outer scale rectangle and major division bars' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Sub-division rays, graduation ticks, and RF title text' }
      ]
    },
    parameters: [
      {
        id: 'maxMeters',
        label: 'Max Measurement Length',
        symbol: 'Lmax',
        defaultValue: 6,
        min: 4,
        max: 8,
        step: 1,
        unit: 'm',
        description: 'Maximum length to measure in meters'
      },
      {
        id: 'readingMeters',
        label: 'Show Measurement Distance',
        symbol: 'Dm',
        defaultValue: 4.6,
        min: 1.0,
        max: 6.0,
        step: 0.1,
        unit: 'm',
        description: 'Demonstration distance to indicate on scale'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const maxM = Math.round(params.maxMeters || 6);
      const targetM = params.readingMeters || 4.6;
      const rf = 1 / 50;
      // LOS = (1/50) * maxM * 1000 mm = maxM * 20 mm on real scale, normalized to canvas length:
      const scaleBarWidth = 480;
      const scaleBarHeight = 35;
      const ox = 160;
      const oy = 320;

      const majorUnitW = scaleBarWidth / maxM;
      const subUnitW = majorUnitW / 10; // 10 decimeters per meter

      // Target breakdown:
      // e.g. 4.6m = 4 meters (right of zero) + 6 decimeters (left of zero)
      const targetMain = Math.floor(targetM);
      const targetDeci = Math.round((targetM - targetMain) * 10);

      const markZeroX = ox + majorUnitW;
      const markMainX = markZeroX + targetMain * majorUnitW;
      const markDeciX = markZeroX - targetDeci * subUnitW;

      return [
        {
          stepIndex: 1,
          title: 'Calculate Length of Scale (LOS) and Draw Scale Rectangle',
          instruction: `For RF = 1:50 and Lmax = ${maxM}m: LOS = (1/50) * ${maxM}000 mm = ${maxM * 20} mm. Draw scale rectangle of width ${scaleBarWidth} mm and height ${scaleBarHeight} mm.`,
          detailedNotes: 'Draw the outer rectangle with an HB pencil and divide vertically with an alternating hatched banner.',
          technicalPrinciple: 'LOS = RF * Lmax.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ox - 30,
            y: oy,
            targetX: ox + scaleBarWidth + 30,
            targetY: oy,
            visible: true,
            actionText: `Draw outer scale rectangle (${scaleBarWidth} x ${scaleBarHeight} mm)`
          },
          elements: [
            { id: 'scale-rect', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + scaleBarWidth, y2: oy, isNew: true },
            { id: 'scale-rect-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy + scaleBarHeight, x2: ox + scaleBarWidth, y2: oy + scaleBarHeight, isNew: true },
            { id: 'scale-rect-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox, y2: oy + scaleBarHeight, isNew: true },
            { id: 'scale-rect-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox + scaleBarWidth, y1: oy, x2: ox + scaleBarWidth, y2: oy + scaleBarHeight, isNew: true },
            { id: 'lbl-rf', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: oy - 35, label: `PLAIN SCALE  RF = 1:50  (SHOWING METERS & DECIMETERS)` }
          ]
        },
        {
          stepIndex: 2,
          title: `Divide Scale into ${maxM} Major Units (1 Meter Each)`,
          instruction: `Divide the scale bar into ${maxM} equal parts. Mark the 0 graduation at the first division. Label main meters 1, 2, 3, 4, 5 to the right.`,
          detailedNotes: 'Standard ISO convention: Zero is positioned after the first primary unit.',
          technicalPrinciple: 'Major graduations: 0.5mm Continuous Thick vertical division lines.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: markZeroX,
            y: oy,
            visible: true,
            actionText: `Divide into ${maxM} equal meter divisions`
          },
          elements: [
            { id: 'scale-rect', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + scaleBarWidth, y2: oy },
            { id: 'scale-rect-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy + scaleBarHeight, x2: ox + scaleBarWidth, y2: oy + scaleBarHeight },
            ...Array.from({ length: maxM + 1 }).map((_, idx) => {
              const x = ox + idx * majorUnitW;
              const val = idx === 0 ? '10dm' : `${idx - 1}m`;
              return {
                id: `div-major-${idx}`,
                type: 'SEGMENT' as const,
                lineWeight: 'THICK_CONTINUOUS' as const,
                x1: x,
                y1: oy,
                x2: x,
                y2: oy + scaleBarHeight,
                isNew: true
              };
            }),
            ...Array.from({ length: maxM }).map((_, idx) => {
              const x = ox + (idx + 1) * majorUnitW;
              return {
                id: `lbl-m-${idx}`,
                type: 'TEXT_LABEL' as const,
                lineWeight: 'THIN_CONTINUOUS' as const,
                cx: x,
                cy: oy + scaleBarHeight + 20,
                label: `${idx}`
              };
            })
          ]
        },
        {
          stepIndex: 3,
          title: 'Sub-divide the First Unit into 10 Decimeters',
          instruction: `Divide the first unit (0 to left) into 10 equal parts using the auxiliary parallel line method. Number graduations 2, 4, 6, 8, 10 dm to the left.`,
          detailedNotes: '1 Meter = 10 Decimeters = 100 Centimeters.',
          technicalPrinciple: 'Sub-unit decimal graduation.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: ox,
            y: oy,
            visible: true,
            actionText: `Graduate first meter into 10 decimeters`
          },
          elements: [
            { id: 'scale-rect', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + scaleBarWidth, y2: oy },
            { id: 'scale-rect-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy + scaleBarHeight, x2: ox + scaleBarWidth, y2: oy + scaleBarHeight },
            ...Array.from({ length: 11 }).map((_, idx) => {
              const x = ox + idx * subUnitW;
              return {
                id: `div-sub-${idx}`,
                type: 'SEGMENT' as const,
                lineWeight: 'THIN_CONTINUOUS' as const,
                x1: x,
                y1: oy,
                x2: x,
                y2: oy + (idx % 5 === 0 ? scaleBarHeight : scaleBarHeight / 2),
                isNew: true
              };
            }),
            { id: 'lbl-deci-10', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy + scaleBarHeight + 20, label: '10' },
            { id: 'lbl-deci-unit', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + majorUnitW / 2, cy: oy - 15, label: 'DECIMETERS' },
            { id: 'lbl-meter-unit', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox + scaleBarWidth / 2 + majorUnitW / 2, cy: oy - 15, label: 'METERS' }
          ]
        },
        {
          stepIndex: 4,
          title: `Indicate Measured Distance of ${targetM.toFixed(1)} m on Scale`,
          instruction: `Locate ${targetMain} meters to the right of zero, and ${targetDeci} decimeters to the left of zero. Draw dimension line with arrowheads to indicate the exact span of ${targetM.toFixed(1)} m.`,
          detailedNotes: `${targetM.toFixed(1)} m = ${targetMain} m + ${targetDeci} dm. The plain scale is complete.`,
          technicalPrinciple: 'Dimensioned scale reading demonstration.',
          activeInstrument: {
            toolType: 'RULER',
            x: markDeciX,
            y: oy - 45,
            targetX: markMainX,
            targetY: oy - 45,
            visible: true,
            actionText: `Indicate distance = ${targetM.toFixed(1)}m`
          },
          elements: [
            { id: 'scale-rect', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy, x2: ox + scaleBarWidth, y2: oy },
            { id: 'scale-rect-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: oy + scaleBarHeight, x2: ox + scaleBarWidth, y2: oy + scaleBarHeight },
            { id: 'dim-measure', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: markDeciX, y1: oy - 45, x2: markMainX, y2: oy - 45, dimensionText: `Distance = ${targetM.toFixed(1)} m`, isNew: true, isFinalResult: true },
            { id: 'ext-l', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: markDeciX, y1: oy, x2: markDeciX, y2: oy - 55, isNew: true },
            { id: 'ext-r', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: markMainX, y1: oy, x2: markMainX, y2: oy - 55, isNew: true }
          ]
        }
      ];
    }
  }
];

export const ss1Topics: DrawingTopic[] = [
  ...ss1FoundationTopics,
  ...ss1GeometryTopics,
  ...ss1ExtensionTopics
];
