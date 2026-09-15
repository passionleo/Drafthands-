import { DrawingTopic } from '../../types/curriculum';

export const cadTopics: DrawingTopic[] = [
  {
    id: 'ss2-cad-autocad-coordinates',
    tier: 'SS2',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 3,
    moduleCode: 'CAD-BAS-01',
    title: 'AutoCAD 2D Fundamentals & Precision Coordinate Entry Modes',
    shortDescription: 'Construct precision mechanical component boundaries in AutoCAD using Absolute (X,Y), Relative Cartesian (@dX,dY), and Polar (@dist<angle) coordinate entry methods.',
    category: 'COMPUTER_AIDED_DESIGN',
    standards: {
      nerdcRef: 'Senior Secondary Technical Drawing SS2 Unit 6: Introduction to CAD Systems',
      waecRef: 'WAEC Technical Drawing: CAD Applications & Coordinate Systems',
      isoRef: 'ISO 13567: CAD Layer Organization & Precision Coordinate Documentation'
    },
    theory: {
      overview: 'Computer-Aided Design (CAD) replaces manual drafting tables with computerized vector graphics software (such as Autodesk AutoCAD). All geometry is calculated mathematically with 64-bit floating-point precision based on the User Coordinate System (UCS) World Origin (0,0,0).',
      historyAndApplication: 'Aerospace engineering, architectural BIM models, automotive tool and die manufacturing, CNC plasma cutting, and PCB electronic design automation.',
      waecAndNERDCNotes: 'Three core 2D coordinate input formats: 1. Absolute Cartesian (X,Y from origin 0,0), 2. Relative Cartesian (@dX,dY from previous point), 3. Polar Coordinates (@distance<angle measured counter-clockwise from positive X-axis 0°).',
      keyPrinciples: [
        {
          title: 'Polar Coordinate Angle Direction',
          description: 'In CAD, angle 0° points horizontally East (positive X-axis). Positive angles sweep counter-clockwise (+CCW), while negative angles sweep clockwise (-CW).',
          keyRule: '@Distance < θ°'
        },
        {
          title: 'Relative Cartesian Offset Vector',
          description: 'The @ prefix instructs the CAD command line interpreter to measure displacements relative to the last active cursor coordinate rather than the origin.',
          keyRule: 'P2 = P1 + (Δx, Δy) ⟹ @Δx, Δy'
        }
      ],
      formulas: [
        {
          latex: 'x = r · cos(θ),   y = r · sin(θ)',
          description: 'CAD Polar to Cartesian mathematical conversion formula'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished geometry outline drawn on Layer "0" or "OUTLINE"' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Coordinate rubber-band vectors and dynamic input HUD tooltips' }
      ]
    },
    parameters: [
      {
        id: 'baseLength',
        label: 'Base Vector Length',
        symbol: 'L_1',
        defaultValue: 200,
        min: 140,
        max: 260,
        step: 10,
        unit: 'mm',
        description: 'Length of base horizontal segment'
      },
      {
        id: 'polarAngle',
        label: 'Polar Inclination Angle',
        symbol: 'θ',
        defaultValue: 45,
        min: 30,
        max: 60,
        step: 5,
        unit: 'deg',
        description: 'Angle of inclined segment in Polar mode'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L1 = params.baseLength || 200;
      const deg = params.polarAngle || 45;
      const rad = (deg * Math.PI) / 180;
      const L2 = 140;

      const oX = 180;
      const oY = 400; // Origin (0,0) in visual space

      const p1 = [oX, oY];
      const p2 = [oX + L1, oY];
      const p3 = [oX + L1 + L2 * Math.cos(-rad), oY + L2 * Math.sin(-rad)];
      const p4 = [oX + L1 + L2 * Math.cos(-rad), oY - 180];
      const p5 = [oX, oY - 180];

      return [
        {
          stepIndex: 1,
          title: 'Initialize AutoCAD UCS Origin and Command: LINE at (100, 100)',
          instruction: 'Type LINE in CAD command line. Specify start point as Absolute Coordinate (100, 100). The red-green UCS icon establishes X and Y axis directions.',
          detailedNotes: 'Command: LINE -> Specify first point: 100,100.',
          technicalPrinciple: 'Absolute Coordinate System (X,Y from UCS World Origin).',
          activeInstrument: {
            toolType: 'NONE',
            x: oX,
            y: oY,
            visible: false,
            actionText: 'Specify point: 100,100 [ENTER]'
          },
          elements: [
            // UCS Icon (X-axis red, Y-axis green)
            { id: 'ucs-x', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: oX, y1: oY, x2: oX + 60, y2: oY, isNew: true },
            { id: 'ucs-y', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: oX, y1: oY, x2: oX, y2: oY - 60, isNew: true },
            { id: 'lbl-ucs-x', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: oX + 70, cy: oY + 5, label: 'X (0°)' },
            { id: 'lbl-ucs-y', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: oX, cy: oY - 70, label: 'Y (90°)' },
            { id: 'pt-origin', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: oX, cy: oY, label: '(100,100)', labelPosition: 'bottom-left' }
          ]
        },
        {
          stepIndex: 2,
          title: `Input Relative Cartesian Vector: @${L1},0`,
          instruction: `Enter next point as Relative Cartesian Coordinate @${L1},0. The @ symbol offsets ${L1} mm horizontally along X with 0 mm change in Y.`,
          detailedNotes: 'Command Line: Specify next point: @200,0.',
          technicalPrinciple: 'Relative Cartesian displacement: @dX,dY.',
          activeInstrument: {
            toolType: 'RULER',
            x: oX,
            y: oY,
            targetX: p2[0],
            targetY: p2[1],
            visible: true,
            actionText: `Input: @${L1},0 [ENTER]`
          },
          elements: [
            { id: 'cad-seg-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], isNew: true },
            { id: 'pt-p2', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p2[0], cy: p2[1], label: `@${L1},0`, labelPosition: 'bottom-right' },
            { id: 'dim-l1', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: p1[0], y1: p1[1] + 30, x2: p2[0], y2: p2[1] + 30, dimensionText: `dX = ${L1}` }
          ]
        },
        {
          stepIndex: 3,
          title: `Input Polar Vector: @${L2}<${deg}°`,
          instruction: `Enter next point using Polar coordinate notation: @${L2}<${deg}. This projects a segment of exact distance ${L2} mm at angle ${deg}° to the horizontal.`,
          detailedNotes: 'Command Line: Specify next point: @140<45.',
          technicalPrinciple: 'Polar coordinate vector: @distance<angle.',
          activeInstrument: {
            toolType: 'PROTRACTOR',
            x: p2[0],
            y: p2[1],
            visible: true,
            actionText: `Input: @${L2}<${deg} [ENTER]`
          },
          elements: [
            { id: 'cad-seg-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: p2[0], y1: p2[1], x2: p3[0], y2: p3[1], isNew: true },
            { id: 'pt-p3', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p3[0], cy: p3[1], label: `@${L2}<${deg}°`, labelPosition: 'top-right' },
            { id: 'polar-ray', type: 'SEGMENT', lineWeight: 'THIN_DASHED', x1: p2[0], y1: p2[1], x2: p2[0] + 80, y2: p2[1] }
          ]
        },
        {
          stepIndex: 4,
          title: 'Complete Profile Using Ortho Mode and Close [C] Command',
          instruction: 'Enable Ortho Mode [F8] to draw vertical segment @0,120, then type C [ENTER] to automatically close the polygon back to the initial start point.',
          detailedNotes: 'The closed profile is converted into a 2D Region or Polyline (PLINE) for CNC toolpath generation.',
          technicalPrinciple: 'Complete CAD Geometry Profile.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: p5[0],
            y: p5[1],
            visible: true,
            actionText: 'Type: CLOSE [ENTER]'
          },
          elements: [
            { id: 'cad-poly', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [p1, p2, p3, p4, p5] as [number, number][], isNew: true, isFinalResult: true },
            { id: 'lbl-cad-hud', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 120, label: 'AUTOCAD 2D PRECISION COORDINATE PROFILE' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-cad-precision-modification',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 6,
    moduleCode: 'CAD-MOD-02',
    title: 'CAD Precision Modification Suite (OFFSET, FILLET, TRIM, & ARRAY)',
    shortDescription: 'Construct complex mechanical machine brackets using professional CAD modification commands including OFFSET wall clearances, tangent FILLET corner blend arcs, TRIM boundaries, and circular polar ARRAY bolt circles.',
    category: 'COMPUTER_AIDED_DESIGN',
    standards: {
      nerdcRef: 'Senior Secondary Technical Drawing SS3 Unit 6: Advanced CAD Geometry',
      waecRef: 'WAEC Technical Drawing: CAD Tool Operations & Geometry Modification',
      isoRef: 'ISO 13567 / ASME Y14.41: Digital Technical Product Definition'
    },
    theory: {
      overview: 'Industrial CAD drafting relies on rapid geometric transformation commands. Rather than re-drawing geometry, engineers utilize OFFSET (parallel curves at fixed distance), FILLET (tangent blend arcs of specified radius), TRIM (cutting entities at cutting edges), and ARRAY (duplicating features linearly or circularly).',
      historyAndApplication: 'Aerospace structural ribs, automotive gearbox casing web reinforcement, robotic end-effector arms, and injection molded plastic housings.',
      waecAndNERDCNotes: 'FILLET command: Sets radius R; automatically trims sharp intersecting corners and replaces them with exact tangent circular arcs. POLAR ARRAY: Rotates selected object around a specified center point with N items across 360° fill.',
      keyPrinciples: [
        {
          title: 'Tangent Fillet Arc Continuity',
          description: 'A CAD fillet creates G1 geometric tangency between two non-parallel lines with zero discontinuity in slope.',
          keyRule: 'R_fillet = 15mm ⟹ Smooth Tangent Blend'
        },
        {
          title: 'Polar Array Angular Spacing',
          description: 'Items are distributed around center (Xc, Yc) with uniform angular pitch delta = 360° / N.',
          keyRule: 'Δθ = 360° / N'
        }
      ],
      formulas: [
        {
          latex: 'θ_k = (360° × k) / N,   x_k = X_c + R_pcd · cos(θ_k),   y_k = Y_c + R_pcd · sin(θ_k)',
          description: 'Mathematical formula for Polar Array bolt coordinate distribution'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished boundary of filleted machine bracket' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Polar array pitch circle diameter and bolt centers' }
      ]
    },
    parameters: [
      {
        id: 'filletRadius',
        label: 'Corner Fillet Radius (R)',
        symbol: 'R_f',
        defaultValue: 25,
        min: 15,
        max: 40,
        step: 5,
        unit: 'mm',
        description: 'Radius for CAD FILLET command'
      },
      {
        id: 'holeCount',
        label: 'Array Bolt Hole Count',
        symbol: 'N',
        defaultValue: 6,
        min: 4,
        max: 8,
        step: 1,
        unit: '',
        description: 'Number of items in Polar Array'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const Rf = params.filletRadius || 25;
      const N = params.holeCount || 6;
      const pcdR = 90;
      const holeR = 12;

      const cX = 400;
      const cY = 300;
      const boxW = 280;
      const boxH = 280;

      // Polar Array Hole positions
      const arrayHoles: [number, number][] = [];
      for (let i = 0; i < N; i++) {
        const rad = (i * 2 * Math.PI) / N;
        arrayHoles.push([cX + pcdR * Math.cos(rad), cY + pcdR * Math.sin(rad)]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Base Rectangular Machine Bracket Boundary with Command: RECTANG',
          instruction: `Type RECTANG. Construct a 280 x 280 mm square centered at (X: ${cX}, Y: ${cY}) with sharp 90° corners.`,
          detailedNotes: 'Command: RECTANG -> Center at 400,300.',
          technicalPrinciple: 'Base geometric boundary.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: cX - boxW / 2,
            y: cY - boxH / 2,
            targetX: cX + boxW / 2,
            targetY: cY + boxH / 2,
            visible: true,
            actionText: 'Draw 280x280mm square boundary'
          },
          elements: [
            { id: 'box-raw', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX - boxW / 2, cY - boxH / 2], [cX + boxW / 2, cY - boxH / 2], [cX + boxW / 2, cY + boxH / 2], [cX - boxW / 2, cY + boxH / 2]], isNew: true },
            { id: 'axis-cx', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cX - boxW / 2 - 30, y1: cY, x2: cX + boxW / 2 + 30, y2: cY, isNew: true },
            { id: 'axis-cy', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cX, y1: cY - boxH / 2 - 30, x2: cX, y2: cY + boxH / 2 + 30, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: `Apply FILLET Command (Radius R = ${Rf} mm) to All 4 Corners`,
          instruction: `Type FILLET -> Radius = ${Rf} -> Polyline. Blend all 4 square corners into smooth tangent arcs with radius ${Rf} mm.`,
          detailedNotes: 'Command: FILLET -> R -> 25 -> P [Select Polyline]. Eliminates sharp stress concentration corners.',
          technicalPrinciple: 'CAD Fillet Tangency Theorem.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cX - boxW / 2 + Rf,
            y: cY - boxH / 2 + Rf,
            radius: Rf,
            visible: true,
            actionText: `FILLET corners with radius R = ${Rf}mm`
          },
          elements: [
            // Center circular bore
            { id: 'bore-center', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY, r: 45, isNew: true },
            { id: 'lbl-fillet', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cX + boxW / 2 - 20, cy: cY - boxH / 2 - 10, label: `4 x FILLET R${Rf}` }
          ]
        },
        {
          stepIndex: 3,
          title: `Execute Command: ARRAYPOLAR (${N} Items on PCD Ø${pcdR * 2} mm)`,
          instruction: `Draw source bolt hole (radius ${holeR} mm) at (X: ${cX + pcdR}, Y: ${cY}). Execute ARRAYPOLAR around center (400,300) with Items = ${N}.`,
          detailedNotes: 'Command: ARRAYPOLAR -> Select Object -> Center Point: 400,300 -> Items: 6 -> Fill: 360.',
          technicalPrinciple: 'CAD Polar Array feature duplication.',
          activeInstrument: {
            toolType: 'NONE',
            x: cX,
            y: cY,
            visible: false,
            actionText: `ARRAYPOLAR: ${N} Items on PCD Ø${pcdR * 2}mm`
          },
          elements: [
            { id: 'pcd-circle', type: 'CIRCLE', lineWeight: 'THIN_CHAIN', cx: cX, cy: cY, r: pcdR, isNew: true },
            ...arrayHoles.map((pt, idx) => ({
              id: `array-hole-${idx}`,
              type: 'CIRCLE' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              r: holeR,
              isNew: true,
              isFinalResult: true
            })),
            { id: 'dim-pcd', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cX - pcdR, y1: cY, x2: cX + pcdR, y2: cY, dimensionText: `PCD Ø${pcdR * 2} mm` }
          ]
        }
      ];
    }
  }
];
