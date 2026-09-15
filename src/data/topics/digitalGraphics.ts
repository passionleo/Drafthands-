import { DrawingTopic } from '../../types/curriculum';

export const digitalGraphicsTopics: DrawingTopic[] = [
  {
    id: 'ss2-digital-coreldraw-bezier',
    tier: 'SS2',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 4,
    moduleCode: 'DIG-ILL-01',
    title: 'CorelDRAW Vector Graphics & Bezier Curve Technical Modeling',
    shortDescription: 'Construct precision vector curves, manipulate Bézier control handle tangents, join nodes, and apply technical vector shading using professional 2D digital illustration tools.',
    category: 'DIGITAL_GRAPHICS_ILLUSTRATION',
    standards: {
      nerdcRef: 'Senior Secondary Technical Drawing SS2 Unit 7: Digital Illustration & Vector Graphics',
      waecRef: 'WAEC Technical Graphics: Vector Illustration Tools & Bezier Curves',
      isoRef: 'ISO 128 / W3C Scalable Vector Graphics (SVG) Standards'
    },
    theory: {
      overview: 'Vector graphic software (like CorelDRAW or Adobe Illustrator) represents technical lines, arcs, and surfaces mathematically as parametric Bézier polynomials rather than pixel rasters. A cubic Bézier curve is defined by two endpoints (nodes) and two directional control handles.',
      historyAndApplication: 'Technical user manuals, automotive styling body contours, aerodynamic airfoil profiles, packaging design die-lines, and patent application drawings.',
      waecAndNERDCNotes: 'Node types in CorelDRAW: 1. Cusp Node (independent handle directions creating sharp corners), 2. Smooth Node (collinear handles with unequal lengths), 3. Symmetrical Node (collinear handles with equal lengths yielding C2 continuous curvature).',
      keyPrinciples: [
        {
          title: 'Cubic Bézier Tangent Handle Theorem',
          description: 'The vector from Node P0 to Control Handle P1 defines the instantaneous tangent velocity vector of the curve at t=0.',
          keyRule: '\\mathbf{B}(t) = (1-t)^3 \\mathbf{P}_0 + 3(1-t)^2 t \\mathbf{P}_1 + 3(1-t) t^2 \\mathbf{P}_2 + t^3 \\mathbf{P}_3'
        },
        {
          title: 'Smooth vs Symmetrical Node Tangency',
          description: 'A smooth node ensures slope continuity across sub-paths, preventing unintended flat spots or sharp creases.',
          keyRule: '\\mathbf{P}_1 - \\mathbf{P}_0 = -k (\\mathbf{P}_2 - \\mathbf{P}_0)'
        }
      ],
      formulas: [
        {
          latex: '\\mathbf{B}(t) = \\sum_{i=0}^{n} \\binom{n}{i} (1-t)^{n-i} t^i \\mathbf{P}_i',
          description: 'General Bernstein polynomial formulation for degree-n Bézier curves'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished vector contour outline' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Bézier tangent control handle guide arms' }
      ]
    },
    parameters: [
      {
        id: 'curveHeight',
        label: 'Handle Amplitude (H)',
        symbol: 'H',
        defaultValue: 110,
        min: 60,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Height offset of Bézier control handle'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const H = params.curveHeight || 110;
      const oX = 180;
      const oY = 320;
      const span = 440;

      const p0 = [oX, oY];
      const p1 = [oX + 120, oY - H];
      const p2 = [oX + span - 120, oY + H];
      const p3 = [oX + span, oY];

      return [
        {
          stepIndex: 1,
          title: 'Plot End Nodes P0 and P3 and Tangent Handle Arms',
          instruction: `Plot start anchor node P0 (${p0[0]}, ${p0[1]}) and end node P3 (${p3[0]}, ${p3[1]}). Extend control handle arms to P1 and P2 (amplitude H = ${H} mm).`,
          detailedNotes: 'CorelDRAW Pen Tool / 3-Point Curve mode.',
          technicalPrinciple: 'Bézier polygon control frame.',
          activeInstrument: {
            toolType: 'NONE',
            x: oX,
            y: oY,
            visible: false,
            actionText: 'Plot Bézier anchor nodes and handle arms'
          },
          elements: [
            // Handle arms (thin lines)
            { id: 'arm-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], isNew: true },
            { id: 'arm-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: p3[0], y1: p3[1], x2: p2[0], y2: p2[1], isNew: true },
            // Nodes
            { id: 'node-p0', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p0[0], cy: p0[1], label: 'Node P0', labelPosition: 'bottom-left' },
            { id: 'node-p1', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: p1[0], cy: p1[1], label: 'Handle P1', labelPosition: 'top-left' },
            { id: 'node-p2', type: 'POINT', lineWeight: 'THIN_CONTINUOUS', cx: p2[0], cy: p2[1], label: 'Handle P2', labelPosition: 'bottom-right' },
            { id: 'node-p3', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: p3[0], cy: p3[1], label: 'Node P3', labelPosition: 'top-right' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Generate Cubic S-Curve Contour and Vector Gradient Shading',
          instruction: 'Compute parametric Bézier polynomial path connecting P0 through P3. Apply smooth node tangency at inflection point.',
          detailedNotes: 'Smooth S-curve contour used for industrial product surface transitions.',
          technicalPrinciple: 'Continuous C1/C2 Vector Bézier Curve.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: p0[0],
            y: p0[1],
            visible: true,
            actionText: 'Draw finished Bézier vector curve'
          },
          elements: [
            // S-curve representation using multi-segment interpolation
            {
              id: 'bezier-curve',
              type: 'POLYGON',
              lineWeight: 'THICK_CONTINUOUS',
              points: [
                [p0[0], p0[1]],
                [oX + 60, oY - H * 0.45],
                [oX + 140, oY - H * 0.85],
                [oX + 220, oY],
                [oX + 300, oY + H * 0.85],
                [oX + 380, oY + H * 0.45],
                [p3[0], p3[1]]
              ],
              isNew: true,
              isFinalResult: true
            },
            { id: 'lbl-title-bez', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 140, label: 'CORELDRAW CUBIC BÉZIER VECTOR MODELING' }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-digital-isometric-illustration',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'DIG-ILL-02',
    title: 'Digital Isometric Technical Illustration & Exploded Assembly Layout',
    shortDescription: 'Construct professional 30° digital isometric technical illustrations featuring part callout balloons, leader lines, bill of materials (BOM), and surface tonal rendering.',
    category: 'DIGITAL_GRAPHICS_ILLUSTRATION',
    standards: {
      nerdcRef: 'Higher Education Technical Graphics Unit 8: Technical Illustration & Manuals',
      waecRef: 'WAEC / City & Guilds: Pictorial Exploded Technical Illustrations',
      isoRef: 'ISO 7573: Technical Drawings - Item Lists & Callout Balloons'
    },
    theory: {
      overview: 'Technical illustrations translate engineering orthographic blueprints into intuitive 3D isometric pictorial diagrams for user manuals, maintenance catalogs, and assembly guides. Exploded isometric illustrations showcase how internal components separate along 30° alignment axes.',
      historyAndApplication: 'Aviation maintenance manuals, automotive spare parts catalogs, consumer electronic disassembly guides, and patent office pictorial disclosures.',
      waecAndNERDCNotes: 'Callout balloons are drawn as 10-12mm circles connected to components by straight leader lines with arrows or terminal dots. Leader lines should be drawn at 30°, 45°, or 60° angles and never cross each other.',
      keyPrinciples: [
        {
          title: '30° Isometric Axis Alignment',
          description: 'All exploded parts displace along a common 30° or vertical axis so the assembly relationship remains immediately obvious.',
          keyRule: 'Explosion Path = Vector_30°'
        },
        {
          title: 'Callout Balloon Sequential Clockwise Numbering',
          description: 'Item callout numbers (1, 2, 3, 4) should be arranged sequentially in clockwise order around the illustration perimeter.',
          keyRule: 'Item Numbers Correlate to BOM Table'
        }
      ],
      formulas: [
        {
          latex: 'x_iso = (x - y) · cos(30°),   y_iso = (x + y) · sin(30°) - z',
          description: '3D Cartesian to 2D Isometric projection transformation equation'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished component isometric profiles' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Explosion axis trajectory alignment centerlines' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Leader lines and callout balloon circles' }
      ]
    },
    parameters: [
      {
        id: 'explodeDist',
        label: 'Exploded Separation Distance (D)',
        symbol: 'D_{exp}',
        defaultValue: 120,
        min: 80,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Separation distance along 30° explosion vector'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'ISOMETRIC'
    },
    generateSteps: (params) => {
      const D = params.explodeDist || 120;
      const cos30 = Math.cos((30 * Math.PI) / 180);
      const sin30 = Math.sin((30 * Math.PI) / 180);

      const cX = 360;
      const cY = 320;

      // Base component
      const bX = cX - D * 0.5 * cos30;
      const bY = cY + D * 0.5 * sin30;

      // Exploded pin/shaft component
      const pX = cX + D * 0.8 * cos30;
      const pY = cY - D * 0.8 * sin30;

      return [
        {
          stepIndex: 1,
          title: 'Establish 30° Isometric Axis and Exploded Centerline Trajectory',
          instruction: `Draw 30° explosion centerline passing through base housing (X: ${bX.toFixed(0)}, Y: ${bY.toFixed(0)}) and exploded pin (X: ${pX.toFixed(0)}, Y: ${pY.toFixed(0)}).`,
          detailedNotes: 'Components displace along this 30° axis to show assembly direction.',
          technicalPrinciple: 'Isometric trajectory line.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: bX,
            y: bY,
            targetX: pX,
            targetY: pY,
            visible: true,
            actionText: 'Draw 30° explosion trajectory centerline'
          },
          elements: [
            { id: 'iso-axis', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: bX - 80 * cos30, y1: bY + 80 * sin30, x2: pX + 80 * cos30, y2: pY - 80 * sin30, isNew: true },
            { id: 'lbl-axis-30', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: pX + 50, cy: pY - 20, label: '30° AXIS' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct Isometric Base Block Housing and Cylindrical Bore',
          instruction: 'Draw 30° isometric prism block for base housing with central circular bore represented by 30° isometric ellipse.',
          detailedNotes: 'Isometric circle drawn as four-center ellipse.',
          technicalPrinciple: 'Isometric 3D block geometry.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: bX,
            y: bY,
            visible: true,
            actionText: 'Draw isometric base housing'
          },
          elements: [
            // Top face
            { id: 'iso-base-top', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[bX, bY], [bX + 70 * cos30, bY - 70 * sin30], [bX + 70 * cos30 - 60 * cos30, bY - 70 * sin30 - 60 * sin30], [bX - 60 * cos30, bY - 60 * sin30]], isNew: true },
            // Front face
            { id: 'iso-base-front', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[bX, bY], [bX + 70 * cos30, bY - 70 * sin30], [bX + 70 * cos30, bY - 70 * sin30 + 60], [bX, bY + 60]], isNew: true },
            // Side face
            { id: 'iso-base-side', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[bX, bY], [bX - 60 * cos30, bY - 60 * sin30], [bX - 60 * cos30, bY - 60 * sin30 + 60], [bX, bY + 60]], isNew: true },
            // Bore circle
            { id: 'iso-bore', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: bX + 5, cy: bY - 35, r: 18, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Construct Exploded Stepped Shaft Pin Along Trajectory',
          instruction: 'Draw exploded stepped pin displaced along the 30° axis with chamfered head and retaining ring groove.',
          detailedNotes: 'Exploded pin is aligned perfectly on the trajectory axis.',
          technicalPrinciple: 'Exploded assembly component placement.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: pX,
            y: pY,
            visible: true,
            actionText: 'Draw exploded shaft pin'
          },
          elements: [
            // Pin head
            { id: 'pin-head', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: pX - 25 * cos30, cy: pY + 25 * sin30, r: 24, isNew: true },
            // Pin shank
            { id: 'pin-shank-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pX - 25 * cos30, y1: pY + 25 * sin30 - 16, x2: pX + 45 * cos30, y2: pY - 45 * sin30 - 16, isNew: true },
            { id: 'pin-shank-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: pX - 25 * cos30, y1: pY + 25 * sin30 + 16, x2: pX + 45 * cos30, y2: pY - 45 * sin30 + 16, isNew: true },
            { id: 'pin-tip', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: pX + 45 * cos30, cy: pY - 45 * sin30, r: 16, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Add Numbered Item Callout Balloons and Bill of Materials (BOM)',
          instruction: 'Draw 12mm circular callout balloons [1] Housing and [2] Stepped Pin with straight leader lines at 45°. Add Bill of Materials table.',
          detailedNotes: 'ISO 7573 compliant technical manual illustration.',
          technicalPrinciple: 'Finished Technical Manual Illustration.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: 600,
            y: 120,
            visible: true,
            actionText: 'Add callout balloons and BOM table'
          },
          elements: [
            // Balloon 1 (Housing)
            { id: 'leader-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bX, y1: bY + 30, x2: bX - 80, y2: bY + 90, isNew: true },
            { id: 'balloon-1', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: bX - 90, cy: bY + 95, r: 12, isNew: true, isFinalResult: true },
            { id: 'lbl-bal-1', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: bX - 90, cy: bY + 98, label: '1' },
            // Balloon 2 (Pin)
            { id: 'leader-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: pX, y1: pY - 16, x2: pX - 40, y2: pY - 80, isNew: true },
            { id: 'balloon-2', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: pX - 45, cy: pY - 90, r: 12, isNew: true, isFinalResult: true },
            { id: 'lbl-bal-2', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: pX - 45, cy: pY - 87, label: '2' },
            // Title
            { id: 'lbl-title-iso', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 90, label: 'EXPLODED ISOMETRIC ASSEMBLY - TECHNICAL MANUAL ILLUSTRATION', isFinalResult: true }
          ]
        }
      ];
    }
  }
];
