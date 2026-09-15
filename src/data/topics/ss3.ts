import { DrawingTopic } from '../../types/curriculum';
import { ss3ExtensionTopics } from './ss3Extensions';

const ss3CoreTopics: DrawingTopic[] = [
  {
    id: 'ss3-orthographic-projection',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 1,
    moduleCode: 'TD-SS3-MOD01',
    title: 'First Angle Orthographic Projection (Front, Plan & End Views)',
    shortDescription: 'Construct standard multi-view 2D orthographic projections (Elevation, Plan, and End Elevation) with projection alignment and 45° miter line transfer.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS3 TD Unit 1: Orthographic Projection Principles',
      waecRef: 'WAEC TD Paper 2 Section B: Compulsory Orthographic Drawing',
      isoRef: 'ISO 5456-2: First Angle Projection Method'
    },
    theory: {
      overview: 'First Angle Projection places the object between the observer and the plane of projection. The Plan (top view) is drawn directly BELOW the Front Elevation, and the Left End Elevation is projected onto the RIGHT side.',
      historyAndApplication: 'Standard engineering drawing standard across the UK, Europe, West Africa (WAEC/NECO), and ISO-compliant global industries.',
      waecAndNERDCNotes: 'The First Angle Projection cone symbol (truncated cone with two concentric circles) must be drawn in the title block. Ensure all views align vertically and horizontally with 0.25mm projection lines.',
      keyPrinciples: [
        {
          title: 'First Angle Quadrant Rule',
          description: 'Object is in Quadrant I: Front View top-left, Plan View bottom-left, End View top-right.',
          keyRule: 'Plan below Front; Left End to Right of Front'
        },
        {
          title: '45° Miter Line Method',
          description: 'Use a 45° projection ray from the intersection of X-Y reference axes to transfer depth dimensions seamlessly between Plan and End views.',
          keyRule: 'Miter Line θ = 45°'
        }
      ],
      formulas: [
        {
          latex: 'X_end = X_origin + Y_plan,   θ_miter = 45°',
          description: 'Depth coordinate reflection via miter line'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible outlines in all 3 views' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Vertical and horizontal projection lines and 45° miter line' },
        { lineName: 'Thin Dashed Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Hidden internal features and hole edges' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines of cylinders, slots, and axes of symmetry' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Component Length (L)',
        symbol: 'L',
        defaultValue: 150,
        min: 100,
        max: 200,
        step: 10,
        unit: 'mm',
        description: 'Overall length of component'
      },
      {
        id: 'width',
        label: 'Component Width (W)',
        symbol: 'W',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Overall width / depth of component'
      },
      {
        id: 'height',
        label: 'Component Height (H)',
        symbol: 'H',
        defaultValue: 110,
        min: 80,
        max: 150,
        step: 10,
        unit: 'mm',
        description: 'Overall height of component'
      },
      {
        id: 'stepCut',
        label: 'Step Cut Size (S)',
        symbol: 'S',
        defaultValue: 45,
        min: 30,
        max: 60,
        step: 5,
        unit: 'mm',
        description: 'Dimensions of top-right step cutout'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.length || 150;
      const W = params.width || 100;
      const H = params.height || 110;
      const S = params.stepCut || 45;

      // Coordinate layout:
      // Front View (Top-Left): x: 180 to 180+L, y: 120 to 120+H
      // Plan View (Bottom-Left): x: 180 to 180+L, y: 120+H+50 to 120+H+50+W
      // End View (Top-Right): x: 180+L+60 to 180+L+60+W, y: 120 to 120+H
      // Miter Origin: (180+L+60, 120+H+50)

      const fX = 180;
      const fY = 120;

      const pX = fX;
      const pY = fY + H + 50;

      const eX = fX + L + 60;
      const eY = fY;

      const miterX = eX;
      const miterY = pY;

      // Polygons:
      // Front View: L-shaped block: (fX, fY+H) -> (fX+L, fY+H) -> (fX+L, fY+S) -> (fX+L-S, fY+S) -> (fX+L-S, fY) -> (fX, fY)
      const frontPoly: [number, number][] = [
        [fX, fY],
        [fX + L - S, fY],
        [fX + L - S, fY + S],
        [fX + L, fY + S],
        [fX + L, fY + H],
        [fX, fY + H]
      ];

      // Plan View: Rectangle (pX, pY) to (pX+L, pY+W) with step line at pX+L-S
      const planPoly: [number, number][] = [
        [pX, pY],
        [pX + L, pY],
        [pX + L, pY + W],
        [pX, pY + W]
      ];

      // End View: Rectangle (eX, eY) to (eX+W, eY+H) with step line at eY+S
      const endPoly: [number, number][] = [
        [eX, eY],
        [eX + W, eY],
        [eX + W, eY + H],
        [eX, eY + H]
      ];

      return [
        {
          stepIndex: 1,
          title: 'Establish Reference Coordinate Axes (X-Y Datum Lines)',
          instruction: 'Draw horizontal and vertical reference baseline grids with 0.25mm 2H pencil. Set up quadrants for Front, Plan, and End views.',
          detailedNotes: 'First Angle Projection places Front Elevation top-left, Plan View directly below it, and Left End Elevation top-right.',
          technicalPrinciple: 'Reference Axes: Thin continuous / chain lines separating the projection planes.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 100,
            y: fY + H + 25,
            targetX: 720,
            targetY: fY + H + 25,
            visible: true,
            actionText: 'Draw horizontal X-Y reference ground line'
          },
          elements: [
            { id: 'axis-XY', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 120, y1: fY + H + 25, x2: 720, y2: fY + H + 25, isNew: true },
            { id: 'axis-vert', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: fX + L + 30, y1: 80, x2: fX + L + 30, y2: 520, isNew: true },
            { id: 'lbl-front', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: fX + L / 2, cy: fY - 20, label: 'FRONT ELEVATION' },
            { id: 'lbl-plan', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: pX + L / 2, cy: pY + W + 30, label: 'PLAN VIEW (TOP)' },
            { id: 'lbl-end', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: eX + W / 2, cy: eY - 20, label: 'END ELEVATION' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw the Front Elevation (L-Shaped Profile)',
          instruction: `Construct the Front Elevation outline with width L = ${L} mm, height H = ${H} mm, and step cutout S = ${S} mm using an HB pencil.`,
          detailedNotes: 'The front elevation captures the principal shape and vertical heights of all component features.',
          technicalPrinciple: 'Front Elevation: Continuous Thick outline (0.5mm, Grade HB).',
          activeInstrument: {
            toolType: 'RULER',
            x: fX,
            y: fY,
            targetX: fX + L,
            targetY: fY + H,
            visible: true,
            actionText: `Draw Front Elevation (L=${L}mm, H=${H}mm)`
          },
          elements: [
            { id: 'poly-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: frontPoly, isNew: true },
            { id: 'dim-front-L', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: fX, y1: fY + H + 12, x2: fX + L, y2: fY + H + 12, dimensionText: `L = ${L} mm` },
            { id: 'dim-front-H', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: fX - 25, y1: fY, x2: fX - 25, y2: fY + H, dimensionText: `H = ${H} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Vertically Downward to Construct the Plan View',
          instruction: `Project thin vertical lines from all edges of the Front View downward into the Plan space. Construct the Plan rectangle (width L = ${L} mm, depth W = ${W} mm) and include the step line.`,
          detailedNotes: 'Every vertical line in the Plan view aligns perfectly with a corresponding vertex in the Front Elevation.',
          technicalPrinciple: 'Vertical alignment principle: Widths and lengths project directly between Front and Plan.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: fX,
            y: fY + H,
            targetX: fX,
            targetY: pY,
            visible: true,
            actionText: 'Project vertical alignment rays to Plan View'
          },
          elements: [
            { id: 'poly-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: frontPoly },
            { id: 'proj-f2p-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX, y1: fY + H, x2: fX, y2: pY, isNew: true },
            { id: 'proj-f2p-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX + L - S, y1: fY + S, x2: fX + L - S, y2: pY, isNew: true },
            { id: 'proj-f2p-3', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX + L, y1: fY + H, x2: fX + L, y2: pY, isNew: true },
            { id: 'poly-plan', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: planPoly, isNew: true },
            { id: 'plan-step-line', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pX + L - S, y1: pY, x2: pX + L - S, y2: pY + W, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Construct 45° Miter Line and Project into End Elevation',
          instruction: `From miter origin (${miterX}, ${miterY}), draw a 45° miter line. Project horizontal lines from Plan to the miter line, reflect vertically upward, and intersect with horizontal rays from Front Elevation to complete the End View.`,
          detailedNotes: 'The 45° miter line mathematically preserves depth W without requiring duplicate measurement.',
          technicalPrinciple: 'Multi-view projection synthesis: Front + Plan + Miter = Complete 3D shape definition.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: miterX,
            y: miterY,
            visible: true,
            actionText: 'Construct 45° miter line and project depth W'
          },
          elements: [
            { id: 'poly-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: frontPoly },
            { id: 'poly-plan', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: planPoly },
            { id: 'plan-step-line', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pX + L - S, y1: pY, x2: pX + L - S, y2: pY + W },
            { id: 'miter-line', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: miterX, y1: miterY, x2: miterX + W + 20, y2: miterY + W + 20, isNew: true },
            { id: 'proj-p2m-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX + L, y1: pY, x2: miterX, y2: pY, isNew: true },
            { id: 'proj-p2m-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX + L, y1: pY + W, x2: miterX + W, y2: pY + W, isNew: true },
            { id: 'proj-m2e-left', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: miterX, y1: pY, x2: eX, y2: eY + H, isNew: true },
            { id: 'proj-m2e-right', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: miterX + W, y1: pY + W, x2: eX + W, y2: eY + H, isNew: true },
            { id: 'poly-end', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: endPoly, isNew: true, isFinalResult: true },
            { id: 'end-step-line', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX, y1: eY + S, x2: eX + W, y2: eY + S, isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-third-angle-orthographic',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 2,
    moduleCode: 'TD-SS3-MOD02',
    title: 'Third Angle Orthographic Projection (Multi-View Projections)',
    shortDescription: 'Construct authentic Third Angle multi-view projections where Plan is placed directly ABOVE the Front Elevation, Right End Elevation is to the RIGHT, linked by a 45° mitre line in the top-right quadrant.',
    category: 'ORTHOGRAPHIC_PROJECTION',
    standards: {
      nerdcRef: 'SS3 TD Unit 1: Third Angle Projection Method',
      waecRef: 'WAEC TD Paper 2: Third Angle Multi-View Systems',
      isoRef: 'ISO 5456-3: Third Angle Projection Method (ANSI/ASME Y14.3)'
    },
    theory: {
      overview: 'In Third Angle Projection, the component is located in the Third Quadrant, placing the projection plane BETWEEN the observer and the object. Consequently, the Plan (top view) is drawn strictly ABOVE the Front Elevation, the Right End Elevation is drawn strictly to the RIGHT of the Front Elevation, and depth is transferred via a 45° mitre line in the TOP-RIGHT quadrant.',
      historyAndApplication: 'Mandated by ISO 5456-3 and adopted as the national engineering standard in the United States (ASME Y14.3), Canada (CSA), and Japan (JIS). It forms the default spatial coordinate system in modern 3D CAD modeling environments.',
      waecAndNERDCNotes: 'WAEC Examiners award marks for: (1) Correct Third Angle view arrangement (Plan ABOVE Front, Right View on the RIGHT); (2) Construction of the 45° mitre transfer ray in the top-right quadrant; (3) The ISO Third Angle projection symbol (two concentric circles on the LEFT, truncated cone on the RIGHT).',
      keyPrinciples: [
        {
          title: 'Third Angle View Placement Rule',
          description: 'In Third Angle Projection, views appear on the side from which the object is observed: Top view sits on TOP; Right view sits on RIGHT.',
          keyRule: '\\text{Plan ⊂ Top-Left, Front ⊂ Bottom-Left, Right End ⊂ Bottom-Right}'
        },
        {
          title: '45° Mitre Ray Depth Transfer',
          description: 'The 45° mitre projection line is erected in the TOP-RIGHT quadrant originating from the reference datum axes. Horizontal rays from the Plan strike the mitre line and reflect 90° downward into the Right End Elevation.',
          keyRule: 'X_{end} = X_{axis} + (Y_{datum} - Y_{plan}), \\quad \\theta_{mitre} = 45^\\circ'
        },
        {
          title: 'ISO 5456-3 Projection Symbol',
          description: 'The standard symbol depicts two concentric circles on the LEFT, followed by a truncated cone on the RIGHT with its smaller diameter facing the circles.',
          keyRule: '\\text{Left: Concentric Circles } \\odot, \\quad \\text{Right: Truncated Cone } \\square'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible outlines of Plan, Front, and End Elevations' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Projection rays, 45° mitre transfer line, and dimension lines' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'X-Y datum reference line and vertical dividing axis' }
      ]
    },
    parameters: [
      {
        id: 'length',
        label: 'Length (L)',
        symbol: 'L',
        defaultValue: 160,
        min: 120,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Component overall length'
      },
      {
        id: 'width',
        label: 'Width/Depth (W)',
        symbol: 'W',
        defaultValue: 100,
        min: 70,
        max: 120,
        step: 10,
        unit: 'mm',
        description: 'Component depth (transferred via mitre line)'
      },
      {
        id: 'height',
        label: 'Height (H)',
        symbol: 'H',
        defaultValue: 110,
        min: 80,
        max: 130,
        step: 10,
        unit: 'mm',
        description: 'Component overall height'
      },
      {
        id: 'stepCut',
        label: 'Step Cut (S)',
        symbol: 'S',
        defaultValue: 40,
        min: 25,
        max: 55,
        step: 5,
        unit: 'mm',
        description: 'Stepped shoulder cutout dimension'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.length || 160;
      const W = params.width || 100;
      const H = params.height || 110;
      const S = params.stepCut || 40;

      // Coordinate Layout:
      // Datum origin at intersection of projection planes: (X_axis = 380, Y_ground = 270)
      const X_axis = 380;
      const Y_ground = 270;
      const dx = 40; // horizontal clearance
      const dy = 40; // vertical clearance

      // Plan View (Top-Left Quadrant):
      const pX2 = X_axis - dx;
      const pX = pX2 - L;
      const pY2 = Y_ground - dy;
      const pY = pY2 - W;
      const pStepX = pX2 - S;

      // Front Elevation (Bottom-Left Quadrant, directly under Plan):
      const fX = pX;
      const fX2 = pX2;
      const fY = Y_ground + dy;
      const fY2 = fY + H;
      const fStepY = fY + S;

      // 45° Mitre Ray in Top-Right Quadrant:
      // Origin at (X_axis, Y_ground) = (380, 270)
      // Slopes up and right at 45° (in screen coordinates: dy_up = -dx_right)
      const miterLen = dy + W + 40;
      const miterEndX = X_axis + miterLen;
      const miterEndY = Y_ground - miterLen;

      // Right End Elevation (Bottom-Right Quadrant):
      // Depth reflected from mitre line:
      // Bottom of Plan (pY2): dy = Y_ground - pY2 = dy (40) -> eX = X_axis + dx (420)
      // Top of Plan (pY): dy = Y_ground - pY = dy + W (140) -> eX2 = X_axis + dx + W (520)
      const eX = X_axis + dx;
      const eX2 = eX + W;
      const eY = fY;
      const eY2 = fY2;

      // ISO Third Angle Symbol coordinates:
      const symBox = { x1: 620, y1: 50, x2: 750, y2: 130 };
      const symClY = 90;
      const symCircleCx = 650;
      const symConeLeftX = 680;
      const symConeRightX = 720;

      return [
        {
          stepIndex: 1,
          title: 'Establish Third Angle Reference Planes & Quadrants',
          instruction: 'Draw horizontal ground line XY and vertical dividing axis Y1-Y. Third Angle layout places Plan top-left, Front bottom-left, and Right End bottom-right. Top-right is reserved for the 45° mitre ray. Construct the ISO 3rd Angle symbol.',
          detailedNotes: 'Third Angle places projection planes between the viewer and the part. Top-right quadrant contains the 45° mitre line.',
          technicalPrinciple: 'ISO 5456-3 Third Angle Layout Conventions and Coordinate Datums.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 70,
            y: Y_ground,
            targetX: 730,
            targetY: Y_ground,
            visible: true,
            actionText: 'Draw horizontal datum axis XY'
          },
          elements: [
            { id: 'datum-xy', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 70, y1: Y_ground, x2: 730, y2: Y_ground, isNew: true },
            { id: 'datum-y1y', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: X_axis, y1: 50, x2: X_axis, y2: 530, isNew: true },
            { id: 'lbl-x', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 85, cy: Y_ground - 10, label: 'X' },
            { id: 'lbl-y', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 715, cy: Y_ground - 10, label: 'Y' },
            { id: 'lbl-y1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: X_axis + 15, cy: 65, label: 'Y₁' },

            // Quadrant text markers
            { id: 'lbl-plan-pos', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: pX + L / 2, cy: pY - 15, label: 'PLAN VIEW (TOP-LEFT)' },
            { id: 'lbl-front-pos', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: fX + L / 2, cy: fY2 + 25, label: 'FRONT ELEVATION (BOTTOM-LEFT)' },
            { id: 'lbl-end-pos', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: eX + W / 2, cy: eY2 + 25, label: 'RIGHT END ELEVATION (BOTTOM-RIGHT)' },

            // ISO Third Angle Projection Symbol (Two concentric circles on LEFT, truncated cone on RIGHT)
            { id: 'sym-box', type: 'POLYGON', lineWeight: 'THIN_CONTINUOUS', points: [[symBox.x1, symBox.y1], [symBox.x2, symBox.y1], [symBox.x2, symBox.y2], [symBox.x1, symBox.y2]] },
            { id: 'sym-lbl', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: (symBox.x1 + symBox.x2) / 2, cy: symBox.y1 + 14, label: 'ISO 3rd ANGLE' },
            { id: 'sym-cl-h', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: symBox.x1 + 8, y1: symClY, x2: symBox.x2 - 8, y2: symClY },
            { id: 'sym-cl-v', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: symCircleCx, y1: symClY - 20, x2: symCircleCx, y2: symClY + 20 },
            { id: 'sym-c-outer', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: symCircleCx, cy: symClY, r: 16 },
            { id: 'sym-c-inner', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: symCircleCx, cy: symClY, r: 8 },
            { id: 'sym-cone-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: symConeLeftX, y1: symClY - 8, x2: symConeLeftX, y2: symClY + 8 },
            { id: 'sym-cone-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: symConeRightX, y1: symClY - 16, x2: symConeRightX, y2: symClY + 16 },
            { id: 'sym-cone-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: symConeLeftX, y1: symClY - 8, x2: symConeRightX, y2: symClY - 16 },
            { id: 'sym-cone-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: symConeLeftX, y1: symClY + 8, x2: symConeRightX, y2: symClY + 16 }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct Plan View (Top-Left Quadrant)',
          instruction: `In Third Angle, the Plan View is drawn strictly in the top-left quadrant above the ground line. Draw the outer rectangle (${L} x ${W} mm) and step dividing line (${S} mm from right edge) with HB pencil.`,
          detailedNotes: 'Top view displays overall length L, depth W, and top-face features.',
          technicalPrinciple: 'Plan View construction: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'RULER',
            x: pX,
            y: pY,
            targetX: pX2,
            targetY: pY2,
            visible: true,
            actionText: `Draw Plan View (${L} x ${W} mm)`
          },
          elements: [
            { id: 'poly-plan', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[pX, pY], [pX2, pY], [pX2, pY2], [pX, pY2]], isNew: true },
            { id: 'plan-step-line', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pStepX, y1: pY, x2: pStepX, y2: pY2, isNew: true },
            { id: 'dim-plan-L', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pX, y1: pY - 12, x2: pX2, y2: pY - 12, dimensionText: `L = ${L}mm` },
            { id: 'dim-plan-W', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: pX - 18, y1: pY, x2: pX - 18, y2: pY2, dimensionText: `W = ${W}mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Vertically Downward to Draw Front Elevation',
          instruction: `Project vertical 2H alignment rays down from each edge of the Plan View into the bottom-left quadrant. Outline the stepped Front Elevation (${L} mm length, ${H} mm total height, ${S} mm shoulder step).`,
          detailedNotes: 'The Front Elevation aligns directly underneath the Plan View, guaranteeing horizontal dimensional congruence.',
          technicalPrinciple: 'Vertical projection alignment (2H thin rays, HB stepped contour).',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: pX,
            y: pY2,
            targetX: pX,
            targetY: fY2,
            visible: true,
            actionText: 'Project alignment rays downward'
          },
          elements: [
            // Vertical projection rays from Plan to Front
            { id: 'proj-p-f1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX, y1: pY2, x2: fX, y2: fY, isNew: true },
            { id: 'proj-p-f2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pStepX, y1: pY2, x2: pStepX, y2: fY, isNew: true },
            { id: 'proj-p-f3', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX2, y1: pY2, x2: fX2, y2: fStepY, isNew: true },
            // Stepped Front Elevation outline
            { 
              id: 'poly-front', 
              type: 'POLYGON', 
              lineWeight: 'THICK_CONTINUOUS', 
              points: [[fX, fY], [pStepX, fY], [pStepX, fStepY], [fX2, fStepY], [fX2, fY2], [fX, fY2]], 
              isNew: true 
            },
            { id: 'dim-front-H', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: fX - 18, y1: fY, x2: fX - 18, y2: fY2, dimensionText: `H = ${H}mm` },
            { id: 'dim-front-S', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: fX2 + 12, y1: fStepY, x2: fX2 + 12, y2: fY2, dimensionText: `Step = ${S}mm` }
          ]
        },
        {
          stepIndex: 4,
          title: 'Erect 45° Mitre Ray in Top-Right Quadrant',
          instruction: 'From the intersection of the reference axes, draw the 45° mitre projection line into the top-right quadrant. Project horizontal rays from the Plan View rightward across to intersect the mitre line.',
          detailedNotes: 'In Third Angle, depth coordinates from the top Plan View are transferred across into the top-right quadrant, ready to reflect vertically down into the Right End Elevation.',
          technicalPrinciple: '45° mitre line transformation in Quadrant I/IV space.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: X_axis,
            y: Y_ground,
            targetX: miterEndX,
            targetY: miterEndY,
            visible: true,
            actionText: 'Draw 45° mitre line'
          },
          elements: [
            // 45° Mitre line
            { id: 'miter-line', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: X_axis, y1: Y_ground, x2: miterEndX, y2: miterEndY, isNew: true },
            { id: 'miter-lbl', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: X_axis + 85, cy: Y_ground - 85 - 12, label: '45° MITRE LINE' },
            // Horizontal rays from Plan across to Mitre Line
            // Bottom edge of Plan (y = pY2): intersects mitre at x = eX (420)
            { id: 'proj-plan-m1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX2, y1: pY2, x2: eX, y2: pY2, isNew: true },
            // Top edge of Plan (y = pY): intersects mitre at x = eX2 (520)
            { id: 'proj-plan-m2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX2, y1: pY, x2: eX2, y2: pY, isNew: true }
          ]
        },
        {
          stepIndex: 5,
          title: 'Reflect Rays Downward & Complete Right End Elevation',
          instruction: `Reflect the depth projection rays 90° vertically downward from the 45° mitre line into the bottom-right quadrant. Project horizontal rays from the Front Elevation to establish height levels, and complete the Right End Elevation (${W} x ${H} mm).`,
          detailedNotes: 'The Right End Elevation is positioned to the right of the Front Elevation. The visible step line across the view is drawn at height S.',
          technicalPrinciple: 'Third Angle multi-view synthesis completed.',
          activeInstrument: {
            toolType: 'RULER',
            x: eX,
            y: eY,
            targetX: eX2,
            targetY: eY2,
            visible: true,
            actionText: 'Complete Right End Elevation'
          },
          elements: [
            // Vertical reflection rays from mitre line down to Right End Elevation
            { id: 'proj-miter-down1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: eX, y1: pY2, x2: eX, y2: eY2, isNew: true },
            { id: 'proj-miter-down2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: eX2, y1: pY, x2: eX2, y2: eY2, isNew: true },
            // Horizontal alignment rays from Front Elevation to Right End Elevation
            { id: 'proj-front-end-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX2, y1: fY, x2: eX, y2: eY, isNew: true },
            { id: 'proj-front-end-step', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX2, y1: fStepY, x2: eX, y2: fStepY, isNew: true },
            { id: 'proj-front-end-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: fX2, y1: fY2, x2: eX, y2: eY2, isNew: true },
            // Right End Elevation outline and step line
            { id: 'poly-end', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[eX, eY], [eX2, eY], [eX2, eY2], [eX, eY2]], isNew: true, isFinalResult: true },
            { id: 'end-step-line', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX, y1: fStepY, x2: eX2, y2: fStepY, isNew: true, isFinalResult: true },
            { id: 'dim-end-W', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: eX, y1: eY2 + 18, x2: eX2, y2: eY2 + 18, dimensionText: `W = ${W}mm` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-isometric-box-four-center',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 3,
    moduleCode: 'TD-SS3-MOD03',
    title: 'Isometric Projection & 4-Center Method for Isometric Circles',
    shortDescription: 'Construct 3D isometric pictorial drawings on 30° axes and construct isometric ellipses/circles using the four-center approximation method.',
    category: 'ISOMETRIC_AND_PICTORIAL',
    standards: {
      nerdcRef: 'SS3 TD Unit 2: Isometric Projections',
      waecRef: 'WAEC TD Section B: Isometric Drawing Compulsory',
      isoRef: 'ISO 5456-3: Isometric Axonometric Projection'
    },
    theory: {
      overview: 'Isometric projection represents 3D objects on three isometric axes separated by 120° (two receding at 30° to horizontal and one vertical). Circles in isometric planes appear as ellipses and are constructed using the classic 4-center arc approximation.',
      historyAndApplication: 'Mechanical assembly instruction manuals, exploded view diagrams, piping axonometrics, and architectural axonometric renderings.',
      waecAndNERDCNotes: 'The four centers are found by drawing perpendicular normals from the obtuse corner vertices of the isometric rhombus to the midpoints of the opposite sides.',
      keyPrinciples: [
        {
          title: 'Isometric 30° Axis Rule',
          description: 'Isometric axes: Vertical (90°), Right axis (+30°), Left axis (+150° / 30° down from horizontal).',
          keyRule: 'θ_iso = 30°'
        },
        {
          title: 'Four-Center Rhombus Approximation',
          description: 'Two large arcs centered at obtuse vertices (120°); two small arcs centered at normal intersection points.',
          keyRule: 'R_large = Dist(V_obtuse, M_opp)'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible 3D isometric outlines and 4-center ellipse' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Isometric grid lines, rhombus bounding box, and 4-center normals' }
      ]
    },
    parameters: [
      {
        id: 'boxSize',
        label: 'Isometric Box Size (S)',
        symbol: 'S',
        defaultValue: 160,
        min: 100,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Length, width, and height of isometric bounding cube'
      },
      {
        id: 'holeDiameter',
        label: 'Top Isometric Hole Diameter',
        symbol: 'D',
        defaultValue: 100,
        min: 60,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Diameter of isometric circle on top face'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ISOMETRIC'
    },
    generateSteps: (params) => {
      const S = params.boxSize || 160;
      const D = Math.min(S - 20, params.holeDiameter || 100);

      const ox = 400;
      const oy = 380; // Bottom vertex of cube

      const rad30 = (30 * Math.PI) / 180;
      const dx = S * Math.cos(rad30);
      const dy = S * Math.sin(rad30);

      // Cube vertices:
      // V0 (bottom): (ox, oy)
      // V1 (right): (ox + dx, oy - dy)
      // V2 (left): (ox - dx, oy - dy)
      // V3 (center top of base / bottom of vertical): (ox, oy - 2*dy)
      // V_top_center: (ox, oy - S - 2*dy)
      // V_top_front: (ox, oy - S)
      // V_top_right: (ox + dx, oy - S - dy)
      // V_top_left: (ox - dx, oy - S - dy)

      const vFrontBot: [number, number] = [ox, oy];
      const vRightBot: [number, number] = [ox + dx, oy - dy];
      const vLeftBot: [number, number] = [ox - dx, oy - dy];

      const vFrontTop: [number, number] = [ox, oy - S];
      const vRightTop: [number, number] = [ox + dx, oy - S - dy];
      const vLeftTop: [number, number] = [ox - dx, oy - S - dy];
      const vBackTop: [number, number] = [ox, oy - S - 2 * dy];

      // Isometric circle on top face:
      // Center of top face: (ox, oy - S - dy)
      const topCx = ox;
      const topCy = oy - S - dy;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Three Isometric 30° Reference Axes',
          instruction: `From origin O, draw vertical axis (90°), right isometric axis (+30°), and left isometric axis (150°) using a 30°-60° set-square and T-square.`,
          detailedNotes: 'All isometric lines are measured true to scale along or parallel to these three axes.',
          technicalPrinciple: 'Isometric coordinate system: Axes at 120° to each other.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: ox,
            y: oy,
            visible: true,
            actionText: 'Draw 30° isometric axes'
          },
          elements: [
            { id: 'axis-vert', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: oy, x2: ox, y2: oy - S - 2 * dy - 30, isNew: true },
            { id: 'axis-r', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: oy, x2: ox + dx + 40, y2: oy - dy - 20, isNew: true },
            { id: 'axis-l', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: oy, x2: ox - dx - 40, y2: oy - dy - 20, isNew: true },
            { id: 'pt-origin', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: ox, cy: oy, label: 'Origin (0,0,0)', labelPosition: 'bottom' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct the Isometric Bounding Cube',
          instruction: `Measure size S = ${S} mm along all three isometric axes. Draw parallel lines to complete the 3D isometric block with HB pencil.`,
          detailedNotes: 'The isometric block encloses the entire volume of the component.',
          technicalPrinciple: 'Isometric box technique.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ox,
            y: oy,
            targetX: vRightTop[0],
            targetY: vRightTop[1],
            visible: true,
            actionText: `Construct isometric cube (S = ${S}mm)`
          },
          elements: [
            { id: 'edge-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vFrontBot[0], y1: vFrontBot[1], x2: vFrontTop[0], y2: vFrontTop[1], isNew: true },
            { id: 'edge-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vFrontBot[0], y1: vFrontBot[1], x2: vRightBot[0], y2: vRightBot[1], isNew: true },
            { id: 'edge-3', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vFrontBot[0], y1: vFrontBot[1], x2: vLeftBot[0], y2: vLeftBot[1], isNew: true },
            { id: 'edge-4', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vRightBot[0], y1: vRightBot[1], x2: vRightTop[0], y2: vRightTop[1], isNew: true },
            { id: 'edge-5', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vLeftBot[0], y1: vLeftBot[1], x2: vLeftTop[0], y2: vLeftTop[1], isNew: true },
            { id: 'edge-6', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vFrontTop[0], y1: vFrontTop[1], x2: vRightTop[0], y2: vRightTop[1], isNew: true },
            { id: 'edge-7', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vFrontTop[0], y1: vFrontTop[1], x2: vLeftTop[0], y2: vLeftTop[1], isNew: true },
            { id: 'edge-8', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vRightTop[0], y1: vRightTop[1], x2: vBackTop[0], y2: vBackTop[1], isNew: true },
            { id: 'edge-9', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: vLeftTop[0], y1: vLeftTop[1], x2: vBackTop[0], y2: vBackTop[1], isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Construct Isometric Rhombus on Top Face for Circle (D = ${D} mm)`,
          instruction: `On the top face, construct an isometric square (rhombus) of side D = ${D} mm centered at the top face. Mark midpoints 1, 2, 3, 4 of all 4 sides.`,
          detailedNotes: 'The four midpoints are the exact points of tangency for the isometric circle.',
          technicalPrinciple: 'Four-Center Rhombus setup.',
          activeInstrument: {
            toolType: 'DIVIDER',
            x: topCx,
            y: topCy,
            visible: true,
            actionText: `Lay out rhombus of side D = ${D}mm`
          },
          elements: [
            { id: 'pt-top-center', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: topCx, cy: topCy, label: 'Center', labelPosition: 'center', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Four-Center Isometric Circle Arcs',
          instruction: `From obtuse corner vertices, draw large arcs with radius R1 touching opposite midpoints. From intersection centers, draw two small sharp arcs with radius R2 to complete the smooth isometric ellipse.`,
          detailedNotes: 'The four arcs blend seamlessly with continuous tangent slopes.',
          technicalPrinciple: 'Complete Four-Center Isometric Circle construction.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: topCx,
            y: topCy,
            radius: D / 2,
            visible: true,
            actionText: 'Draw 4-center isometric circle arcs'
          },
          elements: [
            { id: 'iso-circle-approx', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: topCx, cy: topCy, r: D * 0.45, startAngle: 0, endAngle: 360, isNew: true, isFinalResult: true },
            { id: 'dim-D', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: vFrontTop[0], y1: vFrontTop[1] + 20, x2: vRightTop[0], y2: vRightTop[1] + 20, dimensionText: `S = ${S} mm` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-oblique-cavalier-cabinet',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 4,
    moduleCode: 'TD-SS3-MOD04',
    title: 'Oblique Projections (Cavalier at 45° Full Scale & Cabinet at 45° Half Scale)',
    shortDescription: 'Construct Cavalier (1:1 full depth ratio) and Cabinet (1:2 half depth ratio) oblique pictorial drawings of mechanical components.',
    category: 'ISOMETRIC_AND_PICTORIAL',
    standards: {
      nerdcRef: 'SS3 TD Unit 2: Oblique Projections',
      waecRef: 'WAEC TD Section B: Oblique Cavalier vs Cabinet',
      isoRef: 'ISO 5456-3: Oblique Axonometric Projections'
    },
    theory: {
      overview: 'Oblique projection places the front face parallel to the projection plane (drawn true shape and true scale without distortion). Receding depth edges are drawn at 45° (or 30°/60°). In Cavalier projection, depth is full scale (1:1); in Cabinet projection, depth is halved (1:2) to reduce visual distortion.',
      historyAndApplication: 'Rapid workshop sketches, cabinetry and woodwork drafting, and architectural massing models.',
      waecAndNERDCNotes: 'Always place complex circular or profiled features on the FRONT face in oblique drawings so they can be drawn as true compass circles rather than ellipses.',
      keyPrinciples: [
        {
          title: 'True Front Face Advantage',
          description: 'Front face remains 100% true shape and scale: circles remain true circles.',
          keyRule: '\\text{Front Face: Unaltered True Shape}'
        },
        {
          title: 'Depth Scaling Factors',
          description: 'Cavalier scale factor k = 1.0 (Full depth); Cabinet scale factor k = 0.5 (Half depth).',
          keyRule: 'L_{cavalier} = L, \\quad L_{cabinet} = 0.5 L'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible 3D oblique outlines' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: '45° receding projection lines and depth markers' }
      ]
    },
    parameters: [
      {
        id: 'frontWidth',
        label: 'Front Width (W)',
        symbol: 'W',
        defaultValue: 140,
        min: 100,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Width of front face'
      },
      {
        id: 'frontHeight',
        label: 'Front Height (H)',
        symbol: 'H',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Height of front face'
      },
      {
        id: 'depth',
        label: 'True Depth (D)',
        symbol: 'D',
        defaultValue: 120,
        min: 80,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Physical depth dimension'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ENGINEERING_5MM'
    },
    generateSteps: (params) => {
      const W = params.frontWidth || 140;
      const H = params.frontHeight || 100;
      const D = params.depth || 120;

      // Cavalier: depth = D at 45 deg
      // Cabinet: depth = D / 2 at 45 deg
      const rad45 = (45 * Math.PI) / 180;
      const cavDx = D * Math.cos(rad45);
      const cavDy = D * Math.sin(rad45);

      const cabDx = (D / 2) * Math.cos(rad45);
      const cabDy = (D / 2) * Math.sin(rad45);

      // Draw Side-by-Side: Left = Cavalier, Right = Cabinet
      const cavOx = 160;
      const cavOy = 380;

      const cabOx = 480;
      const cabOy = 380;

      return [
        {
          stepIndex: 1,
          title: 'Draw the True Front Faces for Both Projections',
          instruction: `Draw true-scale front face rectangles (${W} x ${H} mm) with HB pencil for Cavalier (left) and Cabinet (right).`,
          detailedNotes: 'The front face is identical and undistorted in both oblique systems.',
          technicalPrinciple: 'Oblique true front face principle.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: cavOx,
            y: cavOy,
            targetX: cabOx + W,
            targetY: cabOy,
            visible: true,
            actionText: `Draw front faces (${W} x ${H} mm)`
          },
          elements: [
            { id: 'cav-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cavOx, cavOy], [cavOx + W, cavOy], [cavOx + W, cavOy - H], [cavOx, cavOy - H]], isNew: true },
            { id: 'cab-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cabOx, cabOy], [cabOx + W, cabOy], [cabOx + W, cabOy - H], [cabOx, cabOy - H]], isNew: true },
            { id: 'lbl-cav', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cavOx + W / 2, cy: cavOy + 40, label: 'CAVALIER (1:1 Full Depth)' },
            { id: 'lbl-cab', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cabOx + W / 2, cy: cabOy + 40, label: 'CABINET (1:2 Half Depth)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw 45° Receding Lines from All Corners',
          instruction: 'From the front face corners, draw receding lines inclined at 45° upward and to the right using a 45° set-square.',
          detailedNotes: 'Receding angle is typically 45° (can also be 30° or 60°).',
          technicalPrinciple: '45° Oblique projection rays.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: cavOx + W,
            y: cavOy,
            visible: true,
            actionText: 'Draw 45° receding depth lines'
          },
          elements: [
            { id: 'cav-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cavOx, cavOy], [cavOx + W, cavOy], [cavOx + W, cavOy - H], [cavOx, cavOy - H]] },
            { id: 'cab-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cabOx, cabOy], [cabOx + W, cabOy], [cabOx + W, cabOy - H], [cabOx, cabOy - H]] },
            { id: 'cav-ray-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cavOx + W, y1: cavOy, x2: cavOx + W + cavDx + 15, y2: cavOy - cavDy - 15, isNew: true },
            { id: 'cab-ray-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cabOx + W, y1: cabOy, x2: cabOx + W + cabDx + 15, y2: cabOy - cabDy - 15, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Step Off Depth: Full Scale (${D} mm) for Cavalier & Half Scale (${D / 2} mm) for Cabinet`,
          instruction: `On Cavalier (left), measure full depth D = ${D} mm along 45° rays. On Cabinet (right), measure half depth D/2 = ${D / 2} mm along 45° rays. Complete rear faces.`,
          detailedNotes: 'Cabinet projection provides a more natural optical appearance without elongated distortion.',
          technicalPrinciple: 'Finished Cavalier & Cabinet Oblique Projections.',
          activeInstrument: {
            toolType: 'RULER',
            x: cavOx + W,
            y: cavOy,
            targetX: cavOx + W + cavDx,
            targetY: cavOy - cavDy,
            visible: true,
            actionText: 'Step off depth and complete 3D outlines'
          },
          elements: [
            { id: 'cav-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cavOx, cavOy], [cavOx + W, cavOy], [cavOx + W, cavOy - H], [cavOx, cavOy - H]] },
            { id: 'cab-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cabOx, cabOy], [cabOx + W, cabOy], [cabOx + W, cabOy - H], [cabOx, cabOy - H]] },
            // Cavalier full 3D:
            { id: 'cav-top', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cavOx, cavOy - H], [cavOx + W, cavOy - H], [cavOx + W + cavDx, cavOy - H - cavDy], [cavOx + cavDx, cavOy - H - cavDy]], isNew: true, isFinalResult: true },
            { id: 'cav-side', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cavOx + W, cavOy], [cavOx + W + cavDx, cavOy - cavDy], [cavOx + W + cavDx, cavOy - H - cavDy], [cavOx + W, cavOy - H]], isNew: true, isFinalResult: true },
            // Cabinet half 3D:
            { id: 'cab-top', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cabOx, cabOy - H], [cabOx + W, cabOy - H], [cabOx + W + cabDx, cabOy - H - cabDy], [cabOx + cabDx, cabOy - H - cabDy]], isNew: true, isFinalResult: true },
            { id: 'cab-side', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cabOx + W, cabOy], [cabOx + W + cabDx, cabOy - cabDy], [cabOx + W + cabDx, cabOy - H - cabDy], [cabOx + W, cabOy - H]], isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-sectional-views-true-shape',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 5,
    moduleCode: 'TD-SS3-MOD05',
    title: 'Sectional Views & True Shape of Truncated Solid Section',
    shortDescription: 'Construct sectional views of a cut cylinder or hexagonal prism, apply 45° section hatching, and project the true shape of the inclined section plane.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'SS3 TD Unit 3: Sectional Views and True Shapes',
      waecRef: 'WAEC TD Paper 2: Sectioning and True Shape',
      isoRef: 'ISO 128-50: Rules for Sectioning and Hatching'
    },
    theory: {
      overview: 'When a solid is cut by an inclined cutting plane, its apparent section in standard orthographic views is foreshortened. The True Shape of the cut surface is obtained by projecting onto an auxiliary plane parallel to the cutting plane.',
      historyAndApplication: 'Pipe bevel cuts, structural miter joints, internal engine cylinder head cross-sections, and pressure vessel nozzle penetrations.',
      waecAndNERDCNotes: 'Hatching lines must be drawn at 45° using 2H pencil with uniform 2-3mm spacing. Project perpendicular to the cutting plane to construct the true shape.',
      keyPrinciples: [
        {
          title: 'True Shape Projection Principle',
          description: 'Project lines strictly perpendicular (90°) to the cutting plane X-X. Transfer true widths from the Plan view symmetrically across the center datum.',
          keyRule: '\\text{Proj Ray } \\perp \\text{Cutting Plane}'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Cut section perimeter and finished true shape' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: '45° hatching lines and auxiliary projection rays' },
        { lineName: 'Thin Chain Line', weightMm: '0.5mm (thick ends)', pencilGrade: '2H/HB', application: 'Cutting plane line with directional arrowheads' }
      ]
    },
    parameters: [
      {
        id: 'diameter',
        label: 'Cylinder Diameter (D)',
        symbol: 'D',
        defaultValue: 110,
        min: 80,
        max: 150,
        step: 5,
        unit: 'mm',
        description: 'Diameter of vertical cylinder'
      },
      {
        id: 'height',
        label: 'Cylinder Height (H)',
        symbol: 'H',
        defaultValue: 160,
        min: 120,
        max: 200,
        step: 10,
        unit: 'mm',
        description: 'Height of cylinder'
      },
      {
        id: 'cutAngle',
        label: 'Cutting Plane Angle',
        symbol: 'θ',
        defaultValue: 35,
        min: 25,
        max: 50,
        step: 5,
        unit: 'deg',
        description: 'Angle of cutting plane to horizontal'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.diameter || 110;
      const H = params.height || 160;
      const cutDeg = params.cutAngle || 35;
      const radCut = (cutDeg * Math.PI) / 180;
      const R = D / 2;

      // Layout:
      // Elevation (Front): Cylinder centered at X: 260, base at Y: 360, top at Y: 360-H
      // Cutting plane passes through (260, 360 - H/2) inclined at cutDeg
      const fX = 260;
      const fYBase = 380;
      const fYTop = fYBase - H;

      const cutCenterX = fX;
      const cutCenterY = fYBase - H / 2;

      const cutL_X = fX - R;
      const cutL_Y = cutCenterY + R * Math.tan(radCut);

      const cutR_X = fX + R;
      const cutR_Y = cutCenterY - R * Math.tan(radCut);

      // True shape major axis = cut length = D / cos(cutDeg)
      const majorL = D / Math.cos(radCut);
      const minorW = D;

      // Auxiliary True Shape Position: projected perpendicular to cutting plane (towards top-right)
      const auxDist = 180;
      const perpAngle = Math.PI / 2 - radCut; // perpendicular direction
      const auxCx = cutCenterX + auxDist * Math.sin(radCut);
      const auxCy = cutCenterY - auxDist * Math.cos(radCut);

      return [
        {
          stepIndex: 1,
          title: 'Draw Front Elevation and Plan View of Cylinder',
          instruction: `Draw front elevation rectangle (${D} x ${H} mm) and plan circle (diameter ${D} mm) with centerline.`,
          detailedNotes: 'Front elevation represents the uncut cylinder.',
          technicalPrinciple: 'Base geometry definition.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: fX - R - 20,
            y: fYBase,
            targetX: fX + R + 20,
            targetY: fYBase,
            visible: true,
            actionText: `Draw cylinder elevation (${D} x ${H} mm)`
          },
          elements: [
            { id: 'cyl-elev', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[fX - R, fYBase], [fX + R, fYBase], [fX + R, fYTop], [fX - R, fYTop]], isNew: true },
            { id: 'cyl-center', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: fX, y1: fYTop - 20, x2: fX, y2: fYBase + 20, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: `Introduce Inclined Cutting Plane at ${cutDeg}° with Arrowheads`,
          instruction: `Draw cutting plane line X-X inclined at ${cutDeg}° passing across the cylinder. Mark thick ends and viewing direction arrows.`,
          detailedNotes: 'Cutting plane line uses thick ends and thin chain center (ISO convention).',
          technicalPrinciple: 'Cutting Plane Line convention (ISO 128-50).',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cutL_X - 30,
            y: cutL_Y + 15,
            targetX: cutR_X + 30,
            targetY: cutR_Y - 15,
            visible: true,
            actionText: `Draw cutting plane at ${cutDeg}°`
          },
          elements: [
            { id: 'line-cut-plane', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cutL_X - 40, y1: cutL_Y + 40 * Math.tan(radCut), x2: cutR_X + 40, y2: cutR_Y - 40 * Math.tan(radCut), isNew: true },
            { id: 'lbl-plane-X1', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cutL_X - 45, cy: cutL_Y + 40 * Math.tan(radCut) - 15, label: 'X' },
            { id: 'lbl-plane-X2', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cutR_X + 45, cy: cutR_Y - 40 * Math.tan(radCut) - 15, label: 'X' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Sectional Front Elevation with 45° Hatching',
          instruction: 'Render the truncated lower portion with bold outline and fill the cut cross-section with thin 45° hatching lines.',
          detailedNotes: 'Hatching lines must be uniformly spaced at 45° with 2H pencil.',
          technicalPrinciple: 'Sectional Hatching convention: 0.25mm lines at 45°.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: cutL_X,
            y: cutL_Y,
            visible: true,
            actionText: 'Apply 45° hatching lines'
          },
          elements: [
            { id: 'poly-cut-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[fX - R, fYBase], [fX + R, fYBase], [cutR_X, cutR_Y], [cutL_X, cutL_Y]], isNew: true },
            { id: 'hatch-cut', type: 'HATCH', lineWeight: 'THIN_CONTINUOUS', cx: fX, cy: (cutL_Y + cutR_Y) / 2, r: D * 0.45, hatchAngle: 45, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Project Perpendicularly to Construct True Shape of Cut Section (True Ellipse)',
          instruction: `Project lines perpendicular (90°) to cutting plane X-X. Draw center datum line and transfer true half-widths from Plan view to construct the True Shape ellipse (major axis = ${(majorL).toFixed(1)} mm, minor axis = ${minorW} mm).`,
          detailedNotes: 'The true shape of a planar cylinder cut is an exact mathematical ellipse.',
          technicalPrinciple: 'True Shape of Inclined Section: Major Axis = D/cos(θ), Minor Axis = D.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: auxCx,
            y: auxCy,
            radius: minorW / 2,
            visible: true,
            actionText: 'Construct True Shape ellipse'
          },
          elements: [
            { id: 'proj-true-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cutL_X, y1: cutL_Y, x2: cutL_X + auxDist * Math.sin(radCut), y2: cutL_Y - auxDist * Math.cos(radCut), isNew: true },
            { id: 'proj-true-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cutR_X, y1: cutR_Y, x2: cutR_X + auxDist * Math.sin(radCut), y2: cutR_Y - auxDist * Math.cos(radCut), isNew: true },
            { id: 'true-shape-ellipse', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: auxCx, cy: auxCy, r: minorW / 2, isNew: true, isFinalResult: true },
            { id: 'lbl-true-shape', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: auxCx, cy: auxCy - minorW / 2 - 20, label: `TRUE SHAPE OF SECTION (${majorL.toFixed(0)} x ${minorW} mm)` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-true-lengths-planes',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 6,
    moduleCode: 'TD-SS3-MOD06',
    title: 'True Lengths & True Inclinations of Oblique Lines (Revolving Method)',
    shortDescription: 'Determine the true length (TL) and true angles of inclination (theta to HP, phi to VP) of an oblique space line AB using the cone rotation method.',
    category: 'GEOMETRIC_CONSTRUCTION',
    standards: {
      nerdcRef: 'SS3 TD Unit 4: Lines in Space and Laminas',
      waecRef: 'WAEC TD Section A: True Length of Line',
      isoRef: 'ISO 5456-2: Descriptive Geometry'
    },
    theory: {
      overview: 'A straight line inclined to both reference planes (HP and VP) appears foreshortened in both Front Elevation (a\'b\') and Plan View (ab). By rotating one view until parallel to the X-Y baseline, the true length and true angle of inclination are revealed in the opposite view.',
      historyAndApplication: 'Structural steel truss guy wire lengths, aircraft frame struts, piping spools, and roof valley rafter true lengths.',
      waecAndNERDCNotes: 'With center a and radius ab in Plan, swing arc until parallel to XY datum; project vertically to locus of b\' in Elevation to obtain True Length TL and angle theta.',
      keyPrinciples: [
        {
          title: 'Rotation Principle (Descriptive Geometry)',
          description: 'When a line is parallel to a projection plane, its projection on that plane represents its exact True Length.',
          keyRule: 'TL = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2 + (\\Delta z)^2}'
        }
      ],
      formulas: [
        {
          latex: 'TL^2 = (a\'b\'_{rot})^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2',
          description: 'True spatial distance formula'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished True Length line and apparent projections' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Rotation arcs, locus lines, and vertical projection rays' }
      ]
    },
    parameters: [
      {
        id: 'apparentPlan',
        label: 'Plan Apparent Length (ab)',
        symbol: 'Lplan',
        defaultValue: 160,
        min: 100,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Length of line in plan view'
      },
      {
        id: 'heightDiff',
        label: 'Height Difference (Δh)',
        symbol: 'Δh',
        defaultValue: 120,
        min: 70,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Vertical height difference between A and B'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const Lplan = params.apparentPlan || 160;
      const dH = params.heightDiff || 120;

      // True length: TL = sqrt(Lplan^2 + dH^2)
      const TL = Math.sqrt(Lplan * Lplan + dH * dH);
      const trueAngleDeg = (Math.atan2(dH, Lplan) * 180) / Math.PI;

      const ox = 280;
      const xyY = 300; // XY baseline

      // Point A:
      // Front view a' at (ox, xyY - 40)
      // Plan view a at (ox, xyY + 50)
      const aElev: [number, number] = [ox, xyY - 40];
      const aPlan: [number, number] = [ox, xyY + 50];

      // Point B:
      // Front view b' at (ox + 130, xyY - 40 - dH)
      // Plan view b at (ox + Lplan, xyY + 110)
      const bElev: [number, number] = [ox + 130, xyY - 40 - dH];
      const bPlan: [number, number] = [ox + Lplan, xyY + 110];

      // Rotation of Plan AB to horizontal:
      const bPlanRot: [number, number] = [ox + Lplan, xyY + 50];
      const bElevRot: [number, number] = [ox + Lplan, bElev[1]];

      return [
        {
          stepIndex: 1,
          title: 'Draw the X-Y Reference Line and Given Projections a\'b\' and ab',
          instruction: 'Draw baseline X-Y. Plot given Front Elevation a\'b\' above XY and given Plan View ab below XY.',
          detailedNotes: 'Both views show foreshortened apparent lengths of the oblique line.',
          technicalPrinciple: 'Descriptive geometry setup.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 120,
            y: xyY,
            targetX: 680,
            targetY: xyY,
            visible: true,
            actionText: 'Draw X-Y reference baseline'
          },
          elements: [
            { id: 'line-XY', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 140, y1: xyY, x2: 660, y2: xyY, isNew: true },
            { id: 'line-elev', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: aElev[0], y1: aElev[1], x2: bElev[0], y2: bElev[1], isNew: true },
            { id: 'line-plan', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: aPlan[0], y1: aPlan[1], x2: bPlan[0], y2: bPlan[1], isNew: true },
            { id: 'pt-a-elev', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: aElev[0], cy: aElev[1], label: "a'", labelPosition: 'left' },
            { id: 'pt-b-elev', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bElev[0], cy: bElev[1], label: "b'", labelPosition: 'top' },
            { id: 'pt-a-plan', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: aPlan[0], cy: aPlan[1], label: 'a', labelPosition: 'left' },
            { id: 'pt-b-plan', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bPlan[0], cy: bPlan[1], label: 'b', labelPosition: 'bottom' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Rotate Plan View ab to Parallel Horizontal Position ab1',
          instruction: 'With center at a, swing compass arc from b until line ab becomes parallel to the X-Y datum line at b1.',
          detailedNotes: 'Rotating in Plan view makes the line parallel to the Vertical Plane (VP).',
          technicalPrinciple: 'Cone generator rotation method.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: aPlan[0],
            y: aPlan[1],
            radius: Math.sqrt(Math.pow(bPlan[0] - aPlan[0], 2) + Math.pow(bPlan[1] - aPlan[1], 2)),
            visible: true,
            actionText: 'Rotate ab parallel to XY baseline'
          },
          elements: [
            { id: 'arc-rot-plan', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: aPlan[0], cy: aPlan[1], r: Lplan, startAngle: 0, endAngle: 45, isNew: true },
            { id: 'line-plan-rot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: aPlan[0], y1: aPlan[1], x2: bPlanRot[0], y2: bPlanRot[1], isNew: true },
            { id: 'pt-b1-plan', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bPlanRot[0], cy: bPlanRot[1], label: 'b1', labelPosition: 'right', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: "Project b1 Upward to Intersect Locus of b' to Find True Length",
          instruction: `Project vertical line upward from b1 to intersect horizontal locus line of b' at b1'. Connect a' to b1' with a bold continuous line.`,
          detailedNotes: `Line a'b1' is the EXACT True Length TL = ${(TL).toFixed(1)} mm, and angle θ = ${(trueAngleDeg).toFixed(1)}° is the true inclination to the Horizontal Plane.`,
          technicalPrinciple: 'True Length: TL = sqrt(L_plan^2 + Δh^2).',
          activeInstrument: {
            toolType: 'RULER',
            x: aElev[0],
            y: aElev[1],
            targetX: bElevRot[0],
            targetY: bElevRot[1],
            visible: true,
            actionText: 'Draw True Length line a\'b1\''
          },
          elements: [
            { id: 'locus-b-elev', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: bElev[0] - 20, y1: bElev[1], x2: bElevRot[0] + 40, y2: bElev[1], isNew: true },
            { id: 'proj-b1-up', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bPlanRot[0], y1: bPlanRot[1], x2: bElevRot[0], y2: bElevRot[1], isNew: true },
            { id: 'line-true-length', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: aElev[0], y1: aElev[1], x2: bElevRot[0], y2: bElevRot[1], isNew: true, isFinalResult: true },
            { id: 'pt-b1-elev', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: bElevRot[0], cy: bElevRot[1], label: "b1' (TL)", labelPosition: 'top-right', isNew: true },
            { id: 'dim-TL', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: aElev[0] - 15, y1: aElev[1] - 15, x2: bElevRot[0] - 15, y2: bElevRot[1] - 15, dimensionText: `TL = ${(TL).toFixed(1)} mm (θ = ${(trueAngleDeg).toFixed(1)}°)` }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-perspective-projection',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 7,
    moduleCode: 'TD-SS3-MOD07',
    title: 'Perspective Projections (One-Point & Two-Point Architectural Perspective)',
    shortDescription: 'Construct realistic pictorial perspectives using Picture Plane (PP), Horizon Line (HL), Ground Line (GL), Station Point (SP), and Vanishing Points (VP).',
    category: 'ISOMETRIC_AND_PICTORIAL',
    standards: {
      nerdcRef: 'SS3 TD Unit 5: Perspective Projections',
      waecRef: 'WAEC TD Section B: Two-Point Perspective',
      isoRef: 'ISO 5456-4: Central (Perspective) Projections'
    },
    theory: {
      overview: 'Perspective projection replicates human visual optics where parallel receding lines converge to Vanishing Points (VP) on the Horizon Line (HL). Two-point perspective is the standard for architectural building renderings.',
      historyAndApplication: 'Renaissance architectural geometry (Brunelleschi, Alberti), modern architectural renderings, game engine frustum matrices, and urban design elevations.',
      waecAndNERDCNotes: 'Station Point SP is positioned in Plan; sight rays are projected to Picture Plane PP and transferred down to Horizon Line to locate Left VP (VPL) and Right VP (VPR).',
      keyPrinciples: [
        {
          title: 'Station Point & Picture Plane Convergence',
          description: 'Parallel lines in space converge to a common vanishing point determined by a ray from Station Point SP parallel to the object edge.',
          keyRule: '\\text{Sight Ray to PP} \\to \\text{Vertical Drop to HL}'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible 3D perspective building edges' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Sight rays, horizon line HL, ground line GL, and vanishing lines' }
      ]
    },
    parameters: [
      {
        id: 'buildingWidth',
        label: 'Building Width (W)',
        symbol: 'W',
        defaultValue: 150,
        min: 100,
        max: 200,
        step: 10,
        unit: 'mm',
        description: 'Front width of building'
      },
      {
        id: 'buildingHeight',
        label: 'Building Height (H)',
        symbol: 'H',
        defaultValue: 110,
        min: 70,
        max: 150,
        step: 10,
        unit: 'mm',
        description: 'True vertical height at picture plane'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ENGINEERING_5MM'
    },
    generateSteps: (params) => {
      const W = params.buildingWidth || 150;
      const H = params.buildingHeight || 110;

      const hlY = 280; // Horizon line Y
      const glY = 420; // Ground line Y

      const vplX = 140; // Left vanishing point
      const vprX = 660; // Right vanishing point

      // Corner of building on ground line touching picture plane:
      const cornerX = 380;
      const cornerBotY = glY;
      const cornerTopY = glY - H;

      // Perspective vertices:
      // Left side: converges to VPL
      const leftRatio = 0.55;
      const lBotX = cornerX + leftRatio * (vplX - cornerX);
      const lBotY = cornerBotY + leftRatio * (hlY - cornerBotY);
      const lTopX = cornerX + leftRatio * (vplX - cornerX);
      const lTopY = cornerTopY + leftRatio * (hlY - cornerTopY);

      // Right side: converges to VPR
      const rightRatio = 0.65;
      const rBotX = cornerX + rightRatio * (vprX - cornerX);
      const rBotY = cornerBotY + rightRatio * (hlY - cornerBotY);
      const rTopX = cornerX + rightRatio * (vprX - cornerX);
      const rTopY = cornerTopY + rightRatio * (hlY - cornerTopY);

      // Rear top vertex (intersection of L-VPR and R-VPL):
      const backTopX = (lTopX + rTopX) / 2 + 10;
      const backTopY = Math.min(lTopY, rTopY) - 15;

      return [
        {
          stepIndex: 1,
          title: 'Establish Horizon Line (HL), Ground Line (GL), and Vanishing Points',
          instruction: `Draw horizontal Horizon Line (HL) at eye level and Ground Line (GL) at base level. Plot Left Vanishing Point (VPL) at X = ${vplX} and Right Vanishing Point (VPR) at X = ${vprX}.`,
          detailedNotes: 'Eye level (HL) determines whether the viewer sees the top roof or bottom of the structure.',
          technicalPrinciple: 'Perspective datum setup: HL, GL, VPL, VPR.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 100,
            y: hlY,
            targetX: 700,
            targetY: hlY,
            visible: true,
            actionText: 'Draw Horizon Line (HL) and Ground Line (GL)'
          },
          elements: [
            { id: 'line-HL', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 100, y1: hlY, x2: 700, y2: hlY, isNew: true },
            { id: 'line-GL', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 100, y1: glY, x2: 700, y2: glY, isNew: true },
            { id: 'pt-VPL', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: vplX, cy: hlY, label: 'VPL (Left VP)', labelPosition: 'top-left' },
            { id: 'pt-VPR', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: vprX, cy: hlY, label: 'VPR (Right VP)', labelPosition: 'top-right' },
            { id: 'lbl-HL', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 720, cy: hlY, label: 'HORIZON (HL)' },
            { id: 'lbl-GL', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 720, cy: glY, label: 'GROUND (GL)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Erect True Height Measuring Line at Front Corner',
          instruction: `Erect vertical front corner line of true height H = ${H} mm at the corner coordinate on the Ground Line.`,
          detailedNotes: 'Any feature touching the Picture Plane is drawn at 100% true height scale.',
          technicalPrinciple: 'True Height measuring line on Picture Plane.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cornerX,
            y: cornerBotY,
            targetX: cornerX,
            targetY: cornerTopY,
            visible: true,
            actionText: `Erect vertical front corner (H = ${H}mm)`
          },
          elements: [
            { id: 'line-front-corner', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cornerX, y1: cornerBotY, x2: cornerX, y2: cornerTopY, isNew: true },
            { id: 'dim-H', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cornerX - 25, y1: cornerBotY, x2: cornerX - 25, y2: cornerTopY, dimensionText: `H = ${H} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Vanishing Rays to VPL and VPR to Form Building Walls',
          instruction: 'From the top and bottom of the front corner, draw vanishing rays to VPL (left wall) and VPR (right wall). Mark wall depth boundaries.',
          detailedNotes: 'Receding edges foreshorten naturally as they approach their respective vanishing points.',
          technicalPrinciple: 'Two-Point perspective wall convergence.',
          activeInstrument: {
            toolType: 'RULER',
            x: cornerX,
            y: cornerTopY,
            targetX: vplX,
            targetY: hlY,
            visible: true,
            actionText: 'Draw perspective vanishing lines to VPL and VPR'
          },
          elements: [
            { id: 'line-vpl-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cornerX, y1: cornerTopY, x2: vplX, y2: hlY, isNew: true },
            { id: 'line-vpl-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cornerX, y1: cornerBotY, x2: vplX, y2: hlY, isNew: true },
            { id: 'line-vpr-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cornerX, y1: cornerTopY, x2: vprX, y2: hlY, isNew: true },
            { id: 'line-vpr-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: cornerX, y1: cornerBotY, x2: vprX, y2: hlY, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Finished Two-Point Perspective Building Outline',
          instruction: 'Connect all front, side, and roof vertices with bold continuous lines (HB pencil).',
          detailedNotes: 'The two-point architectural perspective rendering is complete.',
          technicalPrinciple: 'Finished Two-Point Perspective: 0.5mm Continuous Thick outline.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: cornerX,
            y: cornerTopY,
            visible: true,
            actionText: 'Trace finished architectural perspective'
          },
          elements: [
            { id: 'poly-left-wall', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cornerX, cornerBotY], [lBotX, lBotY], [lTopX, lTopY], [cornerX, cornerTopY]], isNew: true, isFinalResult: true },
            { id: 'poly-right-wall', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cornerX, cornerBotY], [rBotX, rBotY], [rTopX, rTopY], [cornerX, cornerTopY]], isNew: true, isFinalResult: true },
            { id: 'poly-roof', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cornerX, cornerTopY], [lTopX, lTopY], [backTopX, backTopY], [rTopX, rTopY]], isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  }
];

export const ss3Topics: DrawingTopic[] = [
  ...ss3CoreTopics,
  ...ss3ExtensionTopics
];
