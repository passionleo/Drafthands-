import { DrawingTopic } from '../../types/curriculum';

export const ss1FoundationTopics: DrawingTopic[] = [
  {
    id: 'ss1-intro-technical-drawing',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 1,
    moduleCode: 'TD-SS1-WK01',
    title: 'Introduction to Technical Drawing & Branches',
    shortDescription: 'Definition, historical importance, and primary branches: Architectural, Mechanical/Engineering, Electrical, Topographical, and Structural drawing.',
    category: 'TECHNICAL_FOUNDATIONS',
    standards: {
      nerdcRef: 'SS1 TD Unit 1: Introduction to Technical Drawing (Week 1)',
      waecRef: 'WAEC Syllabus Section A: Fundamentals & Career Pathways',
      isoRef: 'ISO 128: Technical Product Documentation (TPD) General Principles'
    },
    theory: {
      overview: 'Technical Drawing is the universal graphic language used by engineers, architects, and designers to communicate the exact shape, size, construction details, and material specifications of physical objects with mathematical precision.',
      historyAndApplication: 'From ancient Egyptian architectural papyri to Da Vinci and modern ISO standards, technical drawing underpins all civil infrastructure, aerospace, manufacturing, and electronic systems.',
      waecAndNERDCNotes: 'Candidates must distinguish clearly between artistic drawing (expressive, perspective-based) and technical drawing (exact scale, standard orthographic conventions, unambiguous dimensions).',
      keyPrinciples: [
        {
          title: 'The Universal Graphic Language',
          description: 'Technical drawing conveys exact engineering intent without language barriers, using standardized symbols, lines, and dimensions.',
          keyRule: 'Accuracy + Neatness + Speed + Adherence to ISO Standards'
        },
        {
          title: 'Primary Branches of Technical Drawing',
          description: '1. Architectural/Building: Floor plans, elevations, section details. 2. Mechanical/Engineering: Machine parts, gears, assemblies. 3. Electrical/Electronic: Circuit schematics, wiring diagrams. 4. Civil/Topographical: Roads, bridges, contour surveys. 5. Structural: Reinforced concrete and steel framing.',
          keyRule: 'Each branch utilizes specialized ISO line weights and symbology'
        }
      ],
      formulas: [
        {
          latex: '\\text{Precision} = \\text{Standard Lines} + \\text{True Projections} + \\text{Unambiguous Dimensions}',
          description: 'The three pillars of engineering communication'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB/H', application: 'Visible outlines and major branch framing' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H/3H', application: 'Construction lines, grid references, annotations' },
        { lineName: 'Lettering Standard', weightMm: '0.35mm', pencilGrade: 'H', application: 'Standard ISO 3098 single-stroke uppercase titles' }
      ]
    },
    parameters: [
      {
        id: 'branchFocus',
        label: 'Discipline Branch Focus',
        symbol: 'B',
        defaultValue: 1,
        min: 1,
        max: 4,
        step: 1,
        unit: 'branch',
        description: '1: Architectural, 2: Mechanical, 3: Electrical, 4: Civil/Topographical'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const branch = Math.round(params.branchFocus || 1);
      return [
        {
          stepIndex: 1,
          title: 'Establish the Drawing Space & Title Block Datum',
          instruction: 'Lay out the standard A3 border margins (15mm top/bottom/right, 25mm left filing margin) and construct the discipline classification grid.',
          detailedNotes: 'Clean, crisp borderlines establish the working area and protect the drawing edges.',
          technicalPrinciple: 'Standard ISO 5457 drawing sheet layout: 25mm binding margin on left edge.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 50,
            y: 40,
            targetX: 750,
            targetY: 40,
            visible: true,
            actionText: 'Align T-Square with board edge to draw 15mm top border margin'
          },
          elements: [
            { id: 'border-outer', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 60, y1: 40, x2: 740, y2: 40, isNew: true },
            { id: 'border-b', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 60, y1: 560, x2: 740, y2: 560, isNew: true },
            { id: 'border-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 60, y1: 40, x2: 60, y2: 560, isNew: true },
            { id: 'border-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 740, y1: 40, x2: 740, y2: 560, isNew: true },
            { id: 'lbl-title', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 75, label: 'TECHNICAL DRAWING - BRANCHES & TAXONOMY' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct the Four Core Discipline Quadrants',
          instruction: 'Subdivide the drawing area into four equal engineering study quadrants: Architectural, Mechanical, Electrical, and Civil.',
          detailedNotes: 'Use thin continuous construction lines (Grade 2H) for quadrant dividing axes.',
          technicalPrinciple: 'ISO 128 multi-view quadrant layout for comparative technical studies.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: 400,
            y: 90,
            targetX: 400,
            targetY: 530,
            visible: true,
            actionText: 'Position set square against T-square to draw vertical quadrant axis'
          },
          elements: [
            { id: 'axis-v', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: 400, y1: 90, x2: 400, y2: 530, isNew: true },
            { id: 'axis-h', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: 75, y1: 310, x2: 725, y2: 310, isNew: true },
            { id: 'q1-lbl', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 235, cy: 115, label: '1. ARCHITECTURAL / BUILDING' },
            { id: 'q2-lbl', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 565, cy: 115, label: '2. MECHANICAL / MACHINE' },
            { id: 'q3-lbl', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 235, cy: 335, label: '3. ELECTRICAL / SCHEMATIC' },
            { id: 'q4-lbl', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 565, cy: 335, label: '4. CIVIL / TOPOGRAPHICAL' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Primary Architectural & Mechanical Symbols',
          instruction: 'In Quadrant 1, construct the architectural floor plan wall and window symbol. In Quadrant 2, draw the mechanical shaft coupling section.',
          detailedNotes: 'Architectural drawings emphasize external structure; mechanical drawings emphasize internal fits, tolerances, and sections.',
          technicalPrinciple: 'Application of discipline-specific ISO standard hatching and line conventions.',
          activeInstrument: {
            toolType: 'RULER',
            x: 100,
            y: 160,
            targetX: 370,
            targetY: 260,
            visible: true,
            actionText: 'Draw residential wall lines and mechanical machine boss outline'
          },
          elements: [
            // Architectural quadrant
            { id: 'arch-wall-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 100, y1: 150, x2: 370, y2: 150, isNew: true },
            { id: 'arch-wall-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 100, y1: 270, x2: 370, y2: 270, isNew: true },
            { id: 'arch-wall-3', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 100, y1: 150, x2: 100, y2: 270, isNew: true },
            { id: 'arch-wall-4', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 370, y1: 150, x2: 370, y2: 270, isNew: true },
            { id: 'arch-win', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: 190, y1: 150, x2: 280, y2: 150, isNew: true },
            { id: 'arch-desc', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 235, cy: 210, label: 'RESIDENTIAL LIVING ROOM' },
            // Mechanical quadrant
            { id: 'mech-shaft-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 450, y1: 170, x2: 680, y2: 170, isNew: true },
            { id: 'mech-shaft-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 450, y1: 250, x2: 680, y2: 250, isNew: true },
            { id: 'mech-center', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 430, y1: 210, x2: 700, y2: 210, isNew: true },
            { id: 'mech-flange-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 540, y1: 140, x2: 540, y2: 280, isNew: true },
            { id: 'mech-flange-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 590, y1: 140, x2: 590, y2: 280, isNew: true },
            { id: 'mech-desc', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 565, cy: 295, label: 'FLANGED SHAFT COUPLING' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Complete Electrical Schematic & Civil Contour Symbols',
          instruction: 'In Quadrant 3, draw standard electrical resistor, lamp, and switch schematics. In Quadrant 4, draw civil road centerline with topographical contour gradients.',
          detailedNotes: 'Review the complete four-branch comparison chart to understand why precision drafting is universal across all engineering disciplines.',
          technicalPrinciple: 'Complete technical taxonomy map: ISO 128 compliant presentation.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: 235,
            y: 430,
            radius: 20,
            visible: true,
            actionText: 'Draw electrical lamp symbol and civil contour arcs'
          },
          elements: [
            // Electrical quadrant
            { id: 'elec-wire-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 100, y1: 430, x2: 180, y2: 430, isNew: true },
            { id: 'elec-lamp', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: 205, cy: 430, r: 25, startAngle: 0, endAngle: 360, isNew: true },
            { id: 'elec-wire-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 230, y1: 430, x2: 370, y2: 430, isNew: true },
            { id: 'elec-switch', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 300, y1: 430, x2: 340, y2: 405, isNew: true },
            { id: 'elec-desc', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 235, cy: 490, label: 'LIGHTING CIRCUIT SCHEMATIC' },
            // Civil quadrant
            { id: 'civil-road-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 440, y1: 410, x2: 690, y2: 410, isNew: true },
            { id: 'civil-road-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 440, y1: 470, x2: 690, y2: 470, isNew: true },
            { id: 'civil-center', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 430, y1: 440, x2: 700, y2: 440, isNew: true },
            { id: 'civil-desc', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 565, cy: 505, label: 'HIGHWAY DUAL-CARRIAGEWAY DATUM', isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-safety-instruments',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 2,
    moduleCode: 'TD-SS1-WK02',
    title: 'Drawing Room Safety & Care of Equipment',
    shortDescription: 'Proper care, manipulation, and maintenance of T-squares, drawing boards, set-squares, compasses, dividers, and scale rulers.',
    category: 'TECHNICAL_FOUNDATIONS',
    standards: {
      nerdcRef: 'SS1 TD Unit 1: Drawing Equipment & Studio Safety (Week 2)',
      waecRef: 'WAEC Section A: Drawing Instruments, Care & Safe Studio Practices',
      isoRef: 'ISO 9958: Technical Drawing Instruments - Specifications & Tests'
    },
    theory: {
      overview: 'Precision engineering drawings require flawless instruments maintained in pristine condition. Even minute nicks on a T-square blade or blunt compass leads introduce cumulative geometric errors that cause structural misalignments.',
      historyAndApplication: 'Drawing studio safety protocols protect delicate mahogany/ebony drawing boards, acrylic set-squares, and high-precision steel compass pivots from damage and dust.',
      waecAndNERDCNotes: 'Never use the lower edge of a T-square blade to draw lines. Never cut paper using a set-square or scale ruler as a straightedge cutter.',
      keyPrinciples: [
        {
          title: 'Care of the T-Square & Working Edge',
          description: 'The T-square stock must always be held firmly against the left working edge of the drawing board (for right-handed drafters). Clean acrylic blades with soapy water; never use chemical solvents.',
          keyRule: 'Blade working edge must be checked regularly for true straightness'
        },
        {
          title: 'Compass & Divider Lead Dressing',
          description: 'Compass pencil leads must be sharpened to a chisel edge (wedge shape) bevelled on the outside, set 1mm shorter than the steel needle point.',
          keyRule: 'Chisel edge faces tangent to the arc of rotation'
        }
      ],
      formulas: [
        {
          latex: '\\Delta_{\\text{error}} \\propto \\text{instrument wear} + \\text{blunt lead radius}',
          description: 'Instrument accuracy maintenance relation'
        }
      ],
      standardConventions: [
        { lineName: 'Equipment Alignment Guide', weightMm: '0.25mm', pencilGrade: '3H/4H', application: 'Setting datum line on board working edge' },
        { lineName: 'Inspection Checkline', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Testing straightness of T-square blade' }
      ]
    },
    parameters: [
      {
        id: 'boardSize',
        label: 'Drawing Board Standard',
        symbol: 'S',
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        unit: 'std',
        description: '1: Half-Imperial (A2), 2: Imperial (A1), 3: Double-Imperial (A0)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: () => {
      return [
        {
          stepIndex: 1,
          title: 'Inspect Drawing Board & Verify Ebony Working Edge',
          instruction: 'Ensure the drawing board surface is free from compass holes, oil, and dust. Verify that the left ebony edge is perfectly true and smooth.',
          detailedNotes: 'Position the board on the drawing desk with a 15° to 20° ergonomic incline to prevent eye strain and back fatigue.',
          technicalPrinciple: 'Drawing board flatness tolerance: max deviation < 0.2mm across entire surface.',
          activeInstrument: {
            toolType: 'RULER',
            x: 120,
            y: 80,
            targetX: 120,
            targetY: 520,
            visible: true,
            actionText: 'Verify ebony working edge straightness'
          },
          elements: [
            { id: 'board-outline-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 120, y1: 80, x2: 700, y2: 80, isNew: true },
            { id: 'board-outline-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 120, y1: 520, x2: 700, y2: 520, isNew: true },
            { id: 'board-ebony-edge', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 120, y1: 80, x2: 120, y2: 520, isNew: true },
            { id: 'board-right-edge', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 700, y1: 80, x2: 700, y2: 520, isNew: true },
            { id: 'lbl-board-edge', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 210, cy: 110, label: 'EBONY WORKING EDGE (LEFT DATUM)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Mount and Align the T-Square Blade',
          instruction: 'Slide the T-square stock smoothly along the left ebony edge. Firmly press the stock with the left hand while ruling horizontal lines with the right hand.',
          detailedNotes: 'Always draw horizontal lines strictly along the upper bevelled edge of the T-square from left to right.',
          technicalPrinciple: 'Rule of manipulation: Left-to-right stroke with pencil rotated continuously for uniform lead wear.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 80,
            y: 280,
            targetX: 680,
            targetY: 280,
            visible: true,
            actionText: 'Hold T-square stock flush against board edge'
          },
          elements: [
            { id: 'board-ebony-edge', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 120, y1: 80, x2: 120, y2: 520 },
            { id: 'tsquare-stock', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 95, y1: 220, x2: 95, y2: 340, isNew: true },
            { id: 'tsquare-blade-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 95, y1: 270, x2: 670, y2: 270, isNew: true },
            { id: 'tsquare-blade-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 95, y1: 290, x2: 670, y2: 290, isNew: true },
            { id: 'lbl-stroke-dir', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 380, cy: 250, label: 'STROKE DIRECTION: LEFT TO RIGHT (PENCIL AT 60° ANGLE)' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Pair Set-Squares on T-Square for 30°, 45°, 60°, and 90° Angles',
          instruction: 'Rest the 45° or 30°/60° set-square directly on the top edge of the T-square. Draw vertical and angular lines from bottom to top.',
          detailedNotes: 'Combine both set-squares together on the T-square to generate all standard increments of 15° (15°, 75°, 105°, 120°, 135°, 150°, 165°).',
          technicalPrinciple: 'Geometric combination: 45° + 30° = 75°; 45° - 30° = 15°.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: 280,
            y: 270,
            visible: true,
            actionText: 'Rest set-square on T-square blade; draw 90° vertical'
          },
          elements: [
            { id: 'tsquare-blade-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 95, y1: 270, x2: 670, y2: 270 },
            { id: 'ss-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 240, y1: 270, x2: 440, y2: 270, isNew: true },
            { id: 'ss-vert', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 240, y1: 270, x2: 240, y2: 120, isNew: true },
            { id: 'ss-hypo', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 240, y1: 120, x2: 440, y2: 270, isNew: true },
            { id: 'lbl-vert-stroke', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 200, cy: 190, label: 'VERTICAL 90° (BOTTOM TO TOP)' },
            { id: 'lbl-angle-30', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 255, label: '30°' },
            { id: 'lbl-angle-60', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 270, cy: 145, label: '60°' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Prepare Compass Lead (Chisel Edge) & Divider Settings',
          instruction: 'Dress the compass lead using a sandpaper block into a clean chisel point. Ensure the lead length is 1mm shorter than the needle point to allow stable pivot penetration.',
          detailedNotes: 'Never use dividers for scribing deep cuts into paper. Use light fingertip twirls at the top knurled handle.',
          technicalPrinciple: 'Complete equipment maintenance verified: Clean tools ensure 100% WAEC practical examination compliance.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: 550,
            y: 380,
            radius: 80,
            visible: true,
            actionText: 'Test compass chisel lead rotation on scrap paper'
          },
          elements: [
            { id: 'comp-circle', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: 550, cy: 380, r: 80, startAngle: 0, endAngle: 360, isNew: true, isFinalResult: true },
            { id: 'comp-center', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: 550, cy: 380, label: 'Needle Pivot O', labelPosition: 'center', isNew: true },
            { id: 'lbl-rule-summary', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 380, cy: 490, label: 'EQUIPMENT CARE COMPLETE: CLEAN WITH LINT-FREE CLOTH AFTER EVERY CLASS', isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-board-practice',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 3,
    moduleCode: 'TD-SS1-WK03',
    title: 'Board Practice: Paper Fixing, Borderlines & Title Block',
    shortDescription: 'Step-by-step procedure for squaring drawing paper on board using T-square, applying masking tape, ruling borderlines, and constructing standard WAEC title block.',
    category: 'TECHNICAL_FOUNDATIONS',
    standards: {
      nerdcRef: 'SS1 TD Unit 1: Board Practice & Sheet Layout (Week 3)',
      waecRef: 'WAEC TD Paper 2: Title Block & Layout Rubrics (10 Marks allocation)',
      isoRef: 'ISO 5457 / ISO 7200: Technical Product Documentation - Title Blocks'
    },
    theory: {
      overview: 'Board practice is the indispensable initial discipline of fixing drawing paper aligned with the T-square, ruling standard border margins, and constructing a professional title block.',
      historyAndApplication: 'A misaligned drawing sheet causes every subsequent horizontal and vertical projection to be skewed. The title block serves as the legal engineering contract identifying author, institution, scale, and approval signatures.',
      waecAndNERDCNotes: 'Masking tape or drafting clips must be applied to all four corners without encroaching inside the borderlines. Drawing pins are obsolete as they damage the drawing board surface.',
      keyPrinciples: [
        {
          title: 'Paper Squaring Protocol',
          description: 'Position the paper near the top-left of the board (approx 50mm from top and left edges). Rest the T-square against the top edge of the sheet, align the sheet parallel to the blade, and tape the top corners first.',
          keyRule: 'Smooth paper diagonally downwards before taping bottom corners'
        },
        {
          title: 'Title Block Dimensions & Layout',
          description: 'Standard WAEC / NERDC title block size: 120mm to 160mm width by 40mm to 50mm height in bottom right corner.',
          keyRule: 'Contains: Name, School, Title, Class, Scale, Date, and Score/Grade'
        }
      ],
      formulas: [
        {
          latex: '\\text{A3 Sheet} = 420\\text{mm} \\times 297\\text{mm}, \\quad \\text{Margin} = 10\\text{mm (or 25mm filing edge)}',
          description: 'ISO 5457 A3 trimmed dimensions'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB/H', application: 'Sheet borderlines and outer title block boundary' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Title block internal partition grid & lettering guidelines' },
        { lineName: 'Guidelines (0.18mm)', weightMm: '0.18mm', pencilGrade: '3H/4H', application: 'Lettering height boundaries (5mm and 7mm)' }
      ]
    },
    parameters: [
      {
        id: 'marginMm',
        label: 'Borderline Margin Width',
        symbol: 'M',
        defaultValue: 15,
        min: 10,
        max: 25,
        step: 5,
        unit: 'mm',
        description: 'Standard border margin width in mm'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: () => {
      const px1 = 80;
      const py1 = 50;
      const px2 = 720;
      const py2 = 550;
      const m = 15;

      const bx1 = px1 + m;
      const by1 = py1 + m;
      const bx2 = px2 - m;
      const by2 = py2 - m;

      // Title block bottom-right
      const tW = 240;
      const tH = 80;
      const tx1 = bx2 - tW;
      const ty1 = by2 - tH;

      return [
        {
          stepIndex: 1,
          title: 'Position Paper and Fix Corners with Drafting Tape',
          instruction: 'Place the A3 drawing sheet on the board. Align the top edge of the paper perfectly parallel to the T-square blade. Tape top-left and top-right corners with masking tape, smooth diagonally, then tape bottom corners.',
          detailedNotes: 'Keep masking tape flat across corners at 45° angles. Never use thumb tacks or sellotape which tear the paper.',
          technicalPrinciple: 'Proper paper fixation prevents sheet movement and ensures repeatable datum references.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 50,
            y: py1,
            targetX: 750,
            targetY: py1,
            visible: true,
            actionText: 'Align T-square blade flush with paper top edge; tape corners'
          },
          elements: [
            { id: 'sheet-paper', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px1, y1: py1, x2: px2, y2: py1, isNew: true },
            { id: 'sheet-b', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px1, y1: py2, x2: px2, y2: py2, isNew: true },
            { id: 'sheet-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px1, y1: py1, x2: px1, y2: py2, isNew: true },
            { id: 'sheet-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px2, y1: py1, x2: px2, y2: py2, isNew: true },
            // Corner tapes
            { id: 'tape-tl', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px1 - 10, y1: py1 + 25, x2: px1 + 25, y2: py1 - 10, isNew: true },
            { id: 'tape-tr', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px2 - 25, y1: py1 - 10, x2: px2 + 10, y2: py1 + 25, isNew: true },
            { id: 'tape-bl', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px1 - 10, y1: py2 - 25, x2: px1 + 25, y2: py2 + 10, isNew: true },
            { id: 'tape-br', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: px2 - 25, y1: py2 + 10, x2: px2 + 10, y2: py2 - 25, isNew: true },
            { id: 'lbl-paper-size', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 300, label: 'ISO A3 DRAWING SHEET (420 x 297 mm)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Rule Standard 15mm Continuous Thick Borderlines',
          instruction: 'Measure 15mm inward from all four edges using your scale ruler. Draw the horizontal borderlines with the T-square, and vertical borderlines with set-square rested on T-square.',
          detailedNotes: 'Borderlines define the official drafting boundary. Use Grade HB pencil for dense, uniform 0.5mm black lines.',
          technicalPrinciple: 'ISO 5457 standard border frame: Continuous Thick outline (0.5mm).',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: bx1 - 30,
            y: by1,
            targetX: bx2 + 30,
            targetY: by1,
            visible: true,
            actionText: 'Draw top horizontal borderline with HB pencil'
          },
          elements: [
            { id: 'border-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by1, x2: bx2, y2: by1, isNew: true },
            { id: 'border-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by2, x2: bx2, y2: by2, isNew: true },
            { id: 'border-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by1, x2: bx1, y2: by2, isNew: true },
            { id: 'border-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx2, y1: by1, x2: bx2, y2: by2, isNew: true },
            { id: 'dim-margin-l', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: px1, y1: py1 + 40, x2: bx1, y2: py1 + 40, dimensionText: '15mm' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Construct the Standard WAEC Title Block Frame',
          instruction: 'In the bottom right-hand corner, construct a title box measuring 240mm wide by 80mm high. Subdivide into horizontal rows of 20mm height.',
          detailedNotes: 'The title block is the standard signature panel on every engineering sheet.',
          technicalPrinciple: 'ISO 7200 Title Block layout specifications.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: tx1,
            y: ty1,
            targetX: tx1,
            targetY: by2,
            visible: true,
            actionText: 'Rule title block vertical boundary (240mm from right border)'
          },
          elements: [
            { id: 'border-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by1, x2: bx2, y2: by1 },
            { id: 'border-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by2, x2: bx2, y2: by2 },
            { id: 'border-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx1, y1: by1, x2: bx1, y2: by2 },
            { id: 'border-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: bx2, y1: by1, x2: bx2, y2: by2 },
            // Title block frame
            { id: 'tb-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: tx1, y1: ty1, x2: bx2, y2: ty1, isNew: true },
            { id: 'tb-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: tx1, y1: ty1, x2: tx1, y2: by2, isNew: true },
            { id: 'tb-row-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tx1, y1: ty1 + 20, x2: bx2, y2: ty1 + 20, isNew: true },
            { id: 'tb-row-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tx1, y1: ty1 + 40, x2: bx2, y2: ty1 + 40, isNew: true },
            { id: 'tb-row-3', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tx1, y1: ty1 + 60, x2: bx2, y2: ty1 + 60, isNew: true },
            { id: 'tb-col-mid', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tx1 + 120, y1: ty1 + 20, x2: tx1 + 120, y2: by2, isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: 'Lettering & Metadata Entries in Title Block',
          instruction: 'Rule 5mm light guidelines with 3H pencil inside each title cell. Using single-stroke uppercase lettering (Grade H/HB pencil), complete the metadata: School, Name, Title, Date, Scale, and Class.',
          detailedNotes: 'All lettering must touch top and bottom guidelines evenly without extending beyond.',
          technicalPrinciple: 'Complete standard title block: 100% compliant with WAEC / NERDC technical inspection standards.',
          activeInstrument: {
            toolType: 'RULER',
            x: tx1,
            y: ty1,
            visible: true,
            actionText: 'Inspect completed title block metadata and borderline squareness'
          },
          elements: [
            { id: 'tb-txt-school', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: tx1 + 120, cy: ty1 + 14, label: 'GOVERNMENT TECHNICAL COLLEGE / ACADEMY' },
            { id: 'tb-txt-name', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 60, cy: ty1 + 32, label: 'NAME: CANDIDATE' },
            { id: 'tb-txt-title', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 180, cy: ty1 + 32, label: 'TITLE: BOARD PRACTICE' },
            { id: 'tb-txt-class', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 60, cy: ty1 + 52, label: 'CLASS: SS 1 TECHNICAL' },
            { id: 'tb-txt-scale', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 180, cy: ty1 + 52, label: 'SCALE: 1:1 (FULL SIZE)' },
            { id: 'tb-txt-date', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 60, cy: ty1 + 72, label: 'DATE: TERM 1 WK 3' },
            { id: 'tb-txt-proj', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tx1 + 180, cy: ty1 + 72, label: 'PROJECTION: 1ST ANGLE ISO' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-lines-conventions',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 4,
    moduleCode: 'TD-SS1-WK04',
    title: 'Types of Lines & Line Conventions (ISO Standards)',
    shortDescription: 'Comprehensive study of ISO 128 standard line types: Continuous Thick/Thin, Hidden detail dashes, Thin Chain centerlines, Cutting planes, and Dimension/Leader lines.',
    category: 'TECHNICAL_FOUNDATIONS',
    standards: {
      nerdcRef: 'SS1 TD Unit 1: Types of Lines & Conventions (Week 4)',
      waecRef: 'WAEC TD Section A: Line Weights, Styles & Application Standards',
      isoRef: 'ISO 128-20: Technical Drawings - Line Types, Weights & Identification'
    },
    theory: {
      overview: 'Lines are the vocabulary of technical drawing. Every line style (solid, dashed, chain, zigzag) and weight (thick 0.5mm, medium 0.35mm, thin 0.25mm) communicates a distinct physical property of the component.',
      historyAndApplication: 'ISO 128 standardized line weights in a geometric ratio of 1:√2 (0.18, 0.25, 0.35, 0.50, 0.70mm) so line weight hierarchy remains consistent when drawings are enlarged or reduced (e.g., A4 to A3 or A3 to A2).',
      waecAndNERDCNotes: 'A major cause of mark loss in WAEC is poor line contrast—using the same blunt pencil for both visible outlines and construction lines. Always maintain sharp contrast between 2H (thin) and HB (thick).',
      keyPrinciples: [
        {
          title: 'Line Weight Hierarchy (2:1 Ratio Rule)',
          description: 'Thick lines (0.5mm or 0.7mm) MUST be exactly twice as wide as Thin lines (0.25mm or 0.35mm) to ensure clear optical hierarchy.',
          keyRule: 'Line Thickness Ratio = 2:1'
        },
        {
          title: 'Hidden & Centerline Conventions',
          description: 'Hidden lines consist of uniform 3mm dashes with 1mm gaps. Centerlines consist of long dashes (15-20mm) and short dashes (2-3mm) separated by 1mm gaps, crossing at line centers.',
          keyRule: 'Hidden lines MUST touch solid lines at start/end corners'
        }
      ],
      formulas: [
        {
          latex: 'w_{\\text{thick}} = 2 \\times w_{\\text{thin}}, \\quad d_{\\text{hidden}} = 3\\text{mm (dash)} + 1\\text{mm (gap)}',
          description: 'ISO 128 geometric line proportion rules'
        }
      ],
      standardConventions: [
        { lineName: 'Type A - Continuous Thick (0.50mm)', weightMm: '0.50mm', pencilGrade: 'HB/H', application: 'Visible outlines, edges of parts, surface boundaries' },
        { lineName: 'Type B - Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H/3H', application: 'Dimension lines, extension lines, hatching, leaders' },
        { lineName: 'Type C - Continuous Thin Freehand', weightMm: '0.25mm', pencilGrade: '2H', application: 'Limits of partial or interrupted views and sections' },
        { lineName: 'Type F - Dashed Line Hidden Detail', weightMm: '0.25mm', pencilGrade: 'H/2H', application: 'Hidden outlines and non-visible edges' },
        { lineName: 'Type G - Thin Long Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerlines, lines of symmetry, pitch circles' },
        { lineName: 'Type H - Chain Thick at Ends (0.5mm/0.25mm)', weightMm: '0.50mm/0.25mm', pencilGrade: 'HB + 2H', application: 'Cutting planes for sectional views' }
      ]
    },
    parameters: [
      {
        id: 'demoLength',
        label: 'Line Sample Length',
        symbol: 'L',
        defaultValue: 450,
        min: 300,
        max: 550,
        step: 50,
        unit: 'mm',
        description: 'Length of reference line samples'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.demoLength || 450;
      const ox = 240;
      const x2 = ox + L;

      return [
        {
          stepIndex: 1,
          title: 'Draw Continuous Thick & Continuous Thin Standard Lines',
          instruction: `Rule Type A Continuous Thick line (0.5mm, Grade HB) and Type B Continuous Thin line (0.25mm, Grade 2H) of length ${L}mm.`,
          detailedNotes: 'Continuous thick is used for visible object outlines; continuous thin is used for dimension lines and hatching.',
          technicalPrinciple: 'ISO 128 Type A vs Type B line contrast.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ox - 30,
            y: 120,
            targetX: x2 + 30,
            targetY: 120,
            visible: true,
            actionText: 'Draw Type A Continuous Thick (0.5mm) with HB pencil'
          },
          elements: [
            { id: 'lbl-h', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 60, label: 'ISO 128 TECHNICAL LINE CONVENTIONS & SPECIFICATIONS' },
            { id: 'lbl-t1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 125, label: 'A: Continuous Thick (0.5mm)' },
            { id: 'line-a', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: 120, x2: x2, y2: 120, isNew: true },
            { id: 'lbl-t2', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 185, label: 'B: Continuous Thin (0.25mm)' },
            { id: 'line-b', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 180, x2: x2, y2: 180, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: 'Construct Hidden Detail Dashed & Centerline Thin Chain Lines',
          instruction: 'Rule Type F Dashed line (3mm dashes, 1mm gaps) for hidden features and Type G Long Chain line (15mm long dash, 1mm gap, 2mm dot) for symmetry centerlines.',
          detailedNotes: 'Always start and end hidden lines on solid boundaries. Centerlines must extend 3mm to 5mm beyond the object feature.',
          technicalPrinciple: 'Type F (Hidden) and Type G (Centerline) conventions.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: ox - 30,
            y: 240,
            targetX: x2 + 30,
            targetY: 240,
            visible: true,
            actionText: 'Draw Type F Hidden Dashed and Type G Centerline'
          },
          elements: [
            { id: 'line-a', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: 120, x2: x2, y2: 120 },
            { id: 'line-b', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 180, x2: x2, y2: 180 },
            { id: 'lbl-t3', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 245, label: 'F: Hidden Dashed (0.25mm)' },
            { id: 'line-f', type: 'SEGMENT', lineWeight: 'THIN_DASHED', x1: ox, y1: 240, x2: x2, y2: 240, isNew: true },
            { id: 'lbl-t4', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 305, label: 'G: Thin Chain Centerline' },
            { id: 'line-g', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: 300, x2: x2, y2: 300, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Cutting Plane Line & Break Lines',
          instruction: 'Construct Type H Cutting Plane line (Thin chain, thick ends with directional arrows) and Type C Freehand wavy break line.',
          detailedNotes: 'Cutting planes indicate the path of an imaginary saw cut for sectional views. Arrows indicate the viewing direction.',
          technicalPrinciple: 'ISO Cutting plane representation.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: ox,
            y: 360,
            visible: true,
            actionText: 'Draw Type H Cutting Plane thick ends and arrows'
          },
          elements: [
            { id: 'line-a', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: 120, x2: x2, y2: 120 },
            { id: 'line-b', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 180, x2: x2, y2: 180 },
            { id: 'line-f', type: 'SEGMENT', lineWeight: 'THIN_DASHED', x1: ox, y1: 240, x2: x2, y2: 240 },
            { id: 'line-g', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox, y1: 300, x2: x2, y2: 300 },
            { id: 'lbl-t5', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 365, label: 'H: Cutting Plane (A-A)' },
            { id: 'line-h-mid', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: ox + 40, y1: 360, x2: x2 - 40, y2: 360, isNew: true },
            { id: 'line-h-end1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: ox, y1: 360, x2: ox + 40, y2: 360, isNew: true },
            { id: 'line-h-end2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: x2 - 40, y1: 360, x2: x2, y2: 360, isNew: true },
            { id: 'lbl-arrow-a1', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: ox + 15, cy: 340, label: '▲ A' },
            { id: 'lbl-arrow-a2', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: x2 - 15, cy: 340, label: '▲ A' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Dimension & Extension Line Demonstration',
          instruction: 'Construct an engineering dimension line with 3:1 closed filled arrowheads, extension projection lines with 2mm gaps, and centered dimension numeral.',
          detailedNotes: 'Dimension numerals sit 1mm above the dimension line, readable from bottom or right.',
          technicalPrinciple: 'Complete ISO 128 / ISO 129 Line System mastery achieved.',
          activeInstrument: {
            toolType: 'RULER',
            x: ox,
            y: 440,
            targetX: x2,
            targetY: 440,
            visible: true,
            actionText: 'Dimension line application with closed arrowheads'
          },
          elements: [
            { id: 'lbl-t6', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 140, cy: 445, label: 'Dimensioning System' },
            { id: 'dim-demo', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox, y1: 440, x2: x2, y2: 440, dimensionText: `${L}.0 mm (ISO 129 Aligned Method)`, isNew: true, isFinalResult: true },
            { id: 'ext-demo-l', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 460, x2: ox, y2: 420, isNew: true },
            { id: 'ext-demo-r', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: x2, y1: 460, x2: x2, y2: 420, isNew: true },
            { id: 'lbl-summary-note', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 530, label: 'ISO 128 LINE CONVENTIONS: STRICT CONTRAST BETWEEN 2H (THIN) AND HB (THICK) MANDATORY FOR WAEC', isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'ss1-lettering-numbering',
    tier: 'SS1',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 5,
    moduleCode: 'TD-SS1-WK05',
    title: 'Single-Stroke Lettering & Engineering Numbering',
    shortDescription: 'Rules of single-stroke vertical (90°) and inclined (75°) engineering lettering, standardized heights (3.5mm, 5mm, 7mm), spacing, and fractions.',
    category: 'TECHNICAL_FOUNDATIONS',
    standards: {
      nerdcRef: 'SS1 TD Unit 1: Lettering and Numbering Techniques (Week 5)',
      waecRef: 'WAEC TD Paper 2: Freehand Lettering & Title Conventions (5 Marks)',
      isoRef: 'ISO 3098: Technical Product Documentation - Lettering'
    },
    theory: {
      overview: 'Engineering lettering provides clear textual annotations, dimensions, notes, and specifications on drawings. Unlike artistic calligraphy, engineering lettering must be uniform, legible, and capable of microfilming/scanning without degradation.',
      historyAndApplication: 'ISO 3098 defines Lettering Type A (narrow) and Type B (standard). All characters are constructed with single strokes of uniform pencil pressure without serifs (sans-serif).',
      waecAndNERDCNotes: 'Always use faint guidelines (Grade 3H/4H). Never letter freehand without guidelines. Letters must touch the top and bottom guidelines precisely.',
      keyPrinciples: [
        {
          title: 'Standard Lettering Heights (h)',
          description: 'Standard nominal heights: 2.5mm (subscripts), 3.5mm (dimensions/notes), 5mm (sub-headings), 7mm (major titles/drawings numbers), 10mm (main sheet headers).',
          keyRule: 'Line thickness d = h / 10 (Type B)'
        },
        {
          title: 'Single-Stroke Vertical & Inclined (75°)',
          description: 'Vertical lettering is standard. When inclined lettering is used, the slant must be consistently 75° to the horizontal across the entire drawing.',
          keyRule: 'Uniform letter spacing based on optical area, not mechanical spacing'
        }
      ],
      formulas: [
        {
          latex: 'h = 7\\text{mm (Title)}, \\quad c = 0.7h = 5\\text{mm (Lowercase)}, \\quad a = 0.14h = 1\\text{mm (Spacing)}',
          description: 'ISO 3098 Type B proportion ratios'
        }
      ],
      standardConventions: [
        { lineName: 'Guideline Boundaries (0.18mm)', weightMm: '0.18mm', pencilGrade: '3H/4H', application: 'Top, waist, and baseline guide limits' },
        { lineName: 'Lettering Stroke (0.35mm/0.50mm)', weightMm: '0.35mm', pencilGrade: 'H/HB', application: 'Single-stroke uppercase letters & numerals' }
      ]
    },
    parameters: [
      {
        id: 'letterHeight',
        label: 'Nominal Height (h)',
        symbol: 'h',
        defaultValue: 7,
        min: 5,
        max: 10,
        step: 2,
        unit: 'mm',
        description: 'Lettering height: 5mm (Sub-heading), 7mm (Title), 10mm (Main Header)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const h = params.letterHeight || 7;
      const ox = 100;
      const x2 = 700;

      return [
        {
          stepIndex: 1,
          title: 'Rule Standard 7mm Lettering Guidelines',
          instruction: `Using a 3H pencil and sharp scale ruler, draw parallel horizontal guidelines spaced ${h}mm apart with 4mm spacing between lines.`,
          detailedNotes: 'Guidelines must be extremely faint so they do not show on final prints.',
          technicalPrinciple: 'ISO 3098 Guideline grid construction.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 80,
            y: 120,
            targetX: 720,
            targetY: 120,
            visible: true,
            actionText: `Rule ${h}mm parallel guidelines with 3H pencil`
          },
          elements: [
            { id: 'gl-top-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 120, x2: x2, y2: 120, isNew: true },
            { id: 'gl-bot-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 120 + 35, x2: x2, y2: 120 + 35, isNew: true },
            { id: 'gl-top-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 185, x2: x2, y2: 185, isNew: true },
            { id: 'gl-bot-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 185 + 35, x2: x2, y2: 185 + 35, isNew: true },
            { id: 'lbl-h-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox - 30, y1: 120, x2: ox - 30, y2: 120 + 35, dimensionText: `${h}mm` }
          ]
        },
        {
          stepIndex: 2,
          title: 'Single-Stroke Vertical Uppercase Alphabet (A - M)',
          instruction: 'Execute letters A through M with steady, single-stroke downward and rightward pencil movements (Grade H pencil).',
          detailedNotes: 'Maintain uniform line weight and strict 90° verticality.',
          technicalPrinciple: 'Single-stroke sans-serif stroke order.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: ox,
            y: 120,
            visible: true,
            actionText: 'Maintain 90° vertical strokes for letters A to M'
          },
          elements: [
            { id: 'gl-top-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 120, x2: x2, y2: 120 },
            { id: 'gl-bot-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 155, x2: x2, y2: 155 },
            { id: 'letters-am', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 142, label: 'A  B  C  D  E  F  G  H  I  J  K  L  M', isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Single-Stroke Vertical Alphabet (N - Z) & Numerals (0 - 9)',
          instruction: 'Complete letters N through Z on row 2, and engineering numerals 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 on row 3.',
          detailedNotes: 'Numerals 6, 8, 9, 0 must have clear circular loops; numerals 4 and 7 must have distinct open vertices.',
          technicalPrinciple: 'ISO standard numeral legibility.',
          activeInstrument: {
            toolType: 'RULER',
            x: ox,
            y: 185,
            visible: true,
            actionText: 'Execute letters N to Z and numerals 0 to 9'
          },
          elements: [
            { id: 'letters-am', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 142, label: 'A  B  C  D  E  F  G  H  I  J  K  L  M' },
            { id: 'letters-nz', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 207, label: 'N  O  P  Q  R  S  T  U  V  W  X  Y  Z', isNew: true },
            { id: 'gl-top-3', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 250, x2: x2, y2: 250, isNew: true },
            { id: 'gl-bot-3', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 285, x2: x2, y2: 285, isNew: true },
            { id: 'numerals-09', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 272, label: '0  1  2  3  4  5  6  7  8  9  (FRACTIONS:  1/2,  3/4)', isNew: true }
          ]
        },
        {
          stepIndex: 4,
          title: '75° Inclined Lettering & Engineering Title Sentence',
          instruction: 'Rule 75° slant guidelines using your combined set-squares (45° + 30°). Letter the classic WAEC engineering test phrase: "TECHNICAL DRAWING REQUIRES NEATNESS, ACCURACY AND SPEED."',
          detailedNotes: 'Notice that all characters slant at exactly 75° consistently.',
          technicalPrinciple: 'Complete ISO 3098 Lettering mastery achieved.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: ox,
            y: 350,
            visible: true,
            actionText: 'Verify 75° inclination with set-square guide'
          },
          elements: [
            { id: 'gl-top-4', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 340, x2: x2, y2: 340, isNew: true },
            { id: 'gl-bot-4', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: ox, y1: 380, x2: x2, y2: 380, isNew: true },
            { id: 'txt-sentence', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 365, label: 'TECHNICAL DRAWING REQUIRES NEATNESS, ACCURACY AND SPEED', isNew: true, isFinalResult: true },
            { id: 'lbl-rule-final', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: 400, cy: 460, label: 'FOUNDATIONS COMPLETE: READY FOR PLANE GEOMETRY, ANGLES & TRIANGLES', isFinalResult: true }
          ]
        }
      ];
    }
  }
];
