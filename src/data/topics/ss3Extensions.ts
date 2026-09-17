import { DrawingTopic } from '../../types/curriculum';

export const ss3ExtensionTopics: DrawingTopic[] = [
  // SS3 Term 2 Week 3: Building Wall & Foundation Section
  {
    id: 'ss3-building-wall-foundation',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 3,
    moduleCode: 'TD-SS3-T2-W03',
    title: 'Detailed Section through Strip Foundation, Floor Slab & External Wall to Eaves',
    shortDescription: 'Construct a vertical architectural cross-section showing concrete strip foundation footing, sandcrete wall, hardcore, DPC, floor slab, and wall plate to eaves.',
    category: 'BUILDING_AND_ARCHITECTURAL',
    standards: {
      nerdcRef: 'SS3 TD Unit 2: Building Construction Details & Sectioning (Term 2)',
      waecRef: 'WAEC TD Paper 2 Section B (Building Option): Foundation to Eaves Section',
      isoRef: 'ISO 128-23: Architectural Working Drawings'
    },
    theory: {
      overview: 'A vertical section through an external building wall illustrates the sub-structure and super-structure elements: 1:3:6 mass concrete strip foundation footing (typically 675x225mm), 225mm sandcrete foundation wall, well-compacted hardcore bed (150-300mm), damp-proof membrane (DPM), 100-150mm concrete oversite floor slab, 25mm cement-sand screed, damp-proof course (DPC) at 150mm above ground level (GL), 225mm external sandcrete wall, reinforced concrete lintel over window openings, timber wall plate (100x75mm), and roof eaves overhang with fascia board.',
      historyAndApplication: 'J.N. Green Chapter 14, pp. 210–225 & Pickup & Parker Plate 30. Standard technical detail required on all municipal building approval submissions across West Africa.',
      waecAndNERDCNotes: 'A compulsory 25-mark WAEC question. Label standard materials clearly: Hardcore (irregular polygonal stone hatch), Concrete (dots and small triangles), Screed (fine stipple), Timber (end-grain rings or diagonal hatching). Ground line GL and Finished Floor Level FFL must be prominently dimensioned.',
      keyPrinciples: [
        {
          title: 'Strip Footing Proportion Rule',
          description: 'Width of concrete foundation footing is 3 times wall thickness (T); thickness is equal to wall thickness (T).',
          keyRule: 'Footing Width = 3T = 675mm; Depth = T = 225mm'
        },
        {
          title: 'DPC Elevation Rule',
          description: 'The Damp Proof Course (DPC) must be installed at minimum 150mm above finished ground level to prevent capillary water rise.',
          keyRule: 'DPC Height ≥ 150mm above Ground Line'
        }
      ],
      formulas: [
        { latex: 'W_{footing} = 3 \\cdot W_{wall}', description: 'Standard strip footing width' },
        { latex: 'D_{footing} = W_{wall}', description: 'Footing depth formula' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.6mm)', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Cut profile of walls, slab, footing, and lintel' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Material hatching, dimension lines, and leader pointers' }
      ]
    },
    parameters: [
      {
        id: 'wallThickness',
        label: 'Sandcrete Wall Thickness (T)',
        symbol: 'T',
        defaultValue: 225,
        min: 150,
        max: 300,
        step: 25,
        unit: 'mm',
        description: 'Nominal thickness of load-bearing masonry wall'
      },
      {
        id: 'slabThickness',
        label: 'Concrete Floor Slab Depth',
        symbol: 'D_s',
        defaultValue: 150,
        min: 100,
        max: 200,
        step: 25,
        unit: 'mm',
        description: 'Thickness of reinforced concrete oversite slab'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const T = params.wallThickness || 225;
      const Ds = params.slabThickness || 150;
      const ox = 300;
      const oy = 520;

      // Scaled drawing coordinates (1:10 representation)
      const scale = 0.25;
      const wFooting = 3 * T * scale; // ~168px
      const hFooting = T * scale; // ~56px
      const wWall = T * scale; // ~56px
      const hSlab = Ds * scale; // ~37px

      const footLeft = ox - wFooting / 2;
      const footRight = ox + wFooting / 2;
      const footTop = oy - hFooting;

      const wallLeft = ox - wWall / 2;
      const wallRight = ox + wWall / 2;
      const glY = footTop - 120;
      const fflY = glY - 40;
      const eavesY = 120;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Concrete Strip Foundation Footing (675 × 225mm)',
          instruction: `Construct concrete footing of width ${(3 * T)}mm and depth ${T}mm resting in the foundation trench.`,
          detailedNotes: 'Draw the footing outline in thick HB lines and fill with standard concrete symbol (small triangles and speckles).',
          technicalPrinciple: 'Footing structure: Continuous Thick outline (HB) with concrete hatching.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: ox, y: oy, visible: true },
          elements: [
            { id: 'footing-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: footLeft, y: footTop, width: wFooting, height: hFooting, isFinalResult: true },
            { id: 'lbl-footing', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: ox, cy: oy - hFooting / 2, label: '1:3:6 CONCRETE FOOTING' },
            { id: 'cl-wall', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox, y1: 80, x2: ox, y2: oy + 30 }
          ]
        },
        {
          stepIndex: 2,
          title: 'Erect Foundation Wall and Establish Ground Line (GL)',
          instruction: `Construct the ${T}mm sandcrete block wall upward from the center of the footing. Mark Ground Level (GL) 150mm below Finished Floor Level.`,
          detailedNotes: 'Draw horizontal GL datum line with thin chain lines and earth hatch marks below.',
          technicalPrinciple: 'Substructure masonry: Continuous Thick (0.6mm HB).',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: wallLeft, y: glY, visible: true },
          elements: [
            { id: 'footing-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: footLeft, y: footTop, width: wFooting, height: hFooting },
            { id: 'wall-sub-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft, y1: footTop, x2: wallLeft, y2: fflY },
            { id: 'wall-sub-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallRight, y1: footTop, x2: wallRight, y2: fflY },
            { id: 'line-gl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: footLeft - 80, y1: glY, x2: wallLeft, y2: glY },
            { id: 'lbl-gl', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: footLeft - 50, cy: glY - 10, label: 'GL (GROUND LEVEL)' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Draw Hardcore Bed, DPC, and Concrete Oversite Floor Slab',
          instruction: `Draw 200mm hardcore bed, DPM polythene sheet, ${Ds}mm concrete slab at FFL, and DPC across the wall.`,
          detailedNotes: 'DPC is drawn as a bold black line extending across the full thickness of the wall at slab level.',
          technicalPrinciple: 'Damp protection and flooring: Continuous Thick slab with solid DPC bar.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: wallRight, y: fflY, visible: true },
          elements: [
            { id: 'footing-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: footLeft, y: footTop, width: wFooting, height: hFooting },
            { id: 'wall-sub-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft, y1: footTop, x2: wallLeft, y2: fflY },
            { id: 'wall-sub-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallRight, y1: footTop, x2: wallRight, y2: fflY },
            { id: 'slab-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: wallRight, y: fflY - hSlab, width: 220, height: hSlab, isFinalResult: true },
            { id: 'hardcore-rect', type: 'RECTANGLE', lineWeight: 'THIN_CONTINUOUS', x: wallRight, y: fflY, width: 220, height: 50 },
            { id: 'dpc-bar', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft, y1: fflY - hSlab, x2: wallRight, y2: fflY - hSlab, isFinalResult: true },
            { id: 'lbl-ffl', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: wallRight + 110, cy: fflY - hSlab - 10, label: 'FFL (FINISHED FLOOR LEVEL)' },
            { id: 'lbl-dpc', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: wallLeft - 40, cy: fflY - hSlab - 5, label: 'DPC' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Extend External Wall to Wall Plate and Eaves Fascia Detail',
          instruction: `Extend ${T}mm wall up to eaves height (${eavesY}mm). Show timber wall plate (100x75mm), rafter projection, fascia board, and ceiling joist.`,
          detailedNotes: 'Draw diagonal hatching (45° lines spaced 4mm) on the wall plate to indicate timber member cross-section.',
          technicalPrinciple: 'Superstructure wall to eaves: Complete Continuous Thick section.',
          activeInstrument: { toolType: 'PENCIL_HB', x: wallLeft, y: eavesY, visible: true },
          elements: [
            { id: 'wall-sup-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft, y1: fflY - hSlab, x2: wallLeft, y2: eavesY, isFinalResult: true },
            { id: 'wall-sup-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallRight, y1: fflY - hSlab, x2: wallRight, y2: eavesY, isFinalResult: true },
            { id: 'wall-plate', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: wallLeft + 5, y: eavesY - 20, width: wWall - 10, height: 20, isFinalResult: true },
            { id: 'rafter-eaves', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft - 60, y1: eavesY - 50, x2: wallRight + 80, y2: eavesY - 10, isFinalResult: true },
            { id: 'fascia-board', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: wallLeft - 60, y1: eavesY - 50, x2: wallLeft - 60, y2: eavesY - 10, isFinalResult: true },
            { id: 'lbl-plate', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: wallRight + 50, cy: eavesY - 15, label: 'WALL PLATE (100x75mm)' },
            { id: 'lbl-fascia', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: wallLeft - 100, cy: eavesY - 30, label: 'FASCIA BOARD' }
          ]
        }
      ];
    }
  },

  // SS3 Term 2 Week 4: Machine Bolts & Fasteners
  {
    id: 'ss3-machine-bolts-fasteners',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 4,
    moduleCode: 'TD-SS3-T2-W04',
    title: 'ISO Metric Screw Threads, Hexagonal Bolts, Nuts & Washers',
    shortDescription: 'Construct standard engineering views of an M24 hexagonal bolt, nut, and washer assembly using standard proportional formulas.',
    category: 'FASTENERS_AND_ASSEMBLY',
    standards: {
      nerdcRef: 'SS3 TD Unit 3: Mechanical Fasteners & Screw Threads (Term 2)',
      waecRef: 'WAEC TD Paper 2 Section B (Mechanical Option): Fasteners & Assembly',
      isoRef: 'ISO 4014 / ISO 4032 / ISO 7089: Fasteners - Hexagon head bolts and nuts'
    },
    theory: {
      overview: 'Threaded fasteners are demountable mechanical joints used in virtually every machine. An ISO metric hexagonal bolt and nut assembly is drawn according to standard nominal diameter proportions (D): Hexagon across flats W = 1.5D + 3mm (or ~1.73D across corners C = 2D), Bolt head height H = 0.7D, Nut thickness T = 0.8D, Washer diameter Dw = 2D + 3mm, Washer thickness Tw = 0.15D, Chamfer angle = 30° with spherical radius R = 1.5D.',
      historyAndApplication: 'J.N. Green Chapter 13, pp. 195–208 & Pickup & Parker Plate 26. Essential in engine cylinder head bolts, structural steel trusses, pipe flanges, and gearbox split casings.',
      waecAndNERDCNotes: 'Never guess bolt dimensions in WAEC! Express all dimensions in terms of nominal diameter D. For an M24 bolt: D=24, Head height=17mm, Nut height=19mm, Across corners=48mm. Show standard 30° chamfer arcs.',
      keyPrinciples: [
        {
          title: 'Standard Proportional Dimensions',
          description: 'Across corners C = 2D, Head thickness = 0.7D, Nut thickness = 0.8D, Chamfer radius R = 1.5D.',
          keyRule: 'C = 2D, \\quad H_{head} = 0.7D, \\quad T_{nut} = 0.8D'
        },
        {
          title: 'Thread Representation Convention',
          description: 'Crest of thread is Continuous Thick (0.5mm); root of thread is Continuous Thin (0.25mm) at diameter d_core = 0.85D.',
          keyRule: 'Root line = 0.85D Thin Continuous'
        }
      ],
      formulas: [
        { latex: 'C = 2 D', description: 'Hexagon width across corners' },
        { latex: 'R_{chamfer} = 1.5 D', description: 'Bolt head and nut chamfer radius' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished bolt shank, head, nut, and washer profiles' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Thread root diameter lines and 30° chamfer construction arcs' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Bolt axis centerline' }
      ]
    },
    parameters: [
      {
        id: 'boltDiameter',
        label: 'Nominal Bolt Diameter (D)',
        symbol: 'D',
        defaultValue: 24,
        min: 16,
        max: 36,
        step: 4,
        unit: 'mm',
        description: 'Nominal thread diameter of metric bolt'
      },
      {
        id: 'boltLength',
        label: 'Shank Length (L)',
        symbol: 'L',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Total length of bolt shank below head'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.boltDiameter || 24;
      const L = params.boltLength || 100;
      const ox = 400;
      const oy = 160;

      const scale = 2.5; // enlarge for clear drafting display
      const d = D * scale;
      const len = L * scale;
      const hHead = 0.7 * d;
      const tNut = 0.8 * d;
      const wCorners = 2 * d;
      const tWasher = 0.15 * d;
      const wWasher = (2 * D + 3) * scale;
      const threadLen = 0.6 * len;

      return [
        {
          stepIndex: 1,
          title: 'Establish Bolt Centerline and Draw Cylindrical Shank',
          instruction: `Draw vertical axis centerline through O. Construct bolt shank cylinder of diameter D = ${D}mm and length L = ${L}mm.`,
          detailedNotes: 'Draw the shank boundaries symmetrical about the central axis line with HB pencil.',
          technicalPrinciple: 'Shank cylinder: Continuous Thick outline (HB) with Thin Chain centerline.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: ox, y: oy, visible: true },
          elements: [
            { id: 'cl-bolt', type: 'LINE', lineWeight: 'CENTER_LINE', x1: ox, y1: oy - hHead - 30, x2: ox, y2: oy + len + 40 },
            { id: 'shank-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - d / 2, y1: oy, x2: ox - d / 2, y2: oy + len },
            { id: 'shank-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + d / 2, y1: oy, x2: ox + d / 2, y2: oy + len },
            { id: 'shank-tip', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - d / 2, y1: oy + len, x2: ox + d / 2, y2: oy + len }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct Hexagonal Bolt Head (Width 2D = ${(2 * D)}mm, Height 0.7D = ${(0.7 * D).toFixed(1)}mm)`,
          instruction: `Draw bolt head rectangle across corners of width ${(2 * D)}mm and height ${(0.7 * D).toFixed(1)}mm. Divide into three visible faces (D/2, D, D/2).`,
          detailedNotes: 'The front elevation shows three faces of the hexagon. Strike the 30° spherical chamfer arc of radius R = 1.5D at the top.',
          technicalPrinciple: 'Bolt head proportions: 2D across corners, 0.7D head thickness.',
          activeInstrument: { toolType: 'COMPASS', x: ox, y: oy - hHead, radius: 1.5 * d, visible: true },
          elements: [
            { id: 'head-t', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - wCorners / 2, y1: oy - hHead, x2: ox + wCorners / 2, y2: oy - hHead, isFinalResult: true },
            { id: 'head-b', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - wCorners / 2, y1: oy, x2: ox + wCorners / 2, y2: oy, isFinalResult: true },
            { id: 'head-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - wCorners / 2, y1: oy - hHead, x2: ox - wCorners / 2, y2: oy, isFinalResult: true },
            { id: 'head-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + wCorners / 2, y1: oy - hHead, x2: ox + wCorners / 2, y2: oy, isFinalResult: true },
            // Face division lines
            { id: 'face-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - d / 2, y1: oy - hHead, x2: ox - d / 2, y2: oy },
            { id: 'face-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + d / 2, y1: oy - hHead, x2: ox + d / 2, y2: oy }
          ]
        },
        {
          stepIndex: 3,
          title: `Assemble Plain Washer and Hexagonal Nut (Thickness 0.8D = ${(0.8 * D).toFixed(1)}mm)`,
          instruction: `Draw plain washer of thickness ${(0.15 * D).toFixed(1)}mm and hexagonal nut of thickness ${(0.8 * D).toFixed(1)}mm assembled on shank.`,
          detailedNotes: 'Draw thread root lines (0.85D) with thin continuous 2H lines terminating in 45° runout dashes.',
          technicalPrinciple: 'Threaded joint assembly: Continuous Thick nut and washer outlines.',
          activeInstrument: { toolType: 'PENCIL_HB', x: ox, y: oy + len - tNut, visible: true },
          elements: [
            // Washer
            { id: 'washer-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: ox - wWasher / 2, y: oy + len - tNut - tWasher - 20, width: wWasher, height: tWasher, isFinalResult: true },
            // Nut
            { id: 'nut-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: ox - wCorners / 2, y: oy + len - tNut - 20, width: wCorners, height: tNut, isFinalResult: true },
            { id: 'nut-face-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox - d / 2, y1: oy + len - tNut - 20, x2: ox - d / 2, y2: oy + len - 20 },
            { id: 'nut-face-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: ox + d / 2, y1: oy + len - tNut - 20, x2: ox + d / 2, y2: oy + len - 20 },
            // Thread root lines
            { id: 'thread-root-l', type: 'LINE', lineWeight: 'THIN_CONTINUOUS', x1: ox - d * 0.42, y1: oy + len - threadLen, x2: ox - d * 0.42, y2: oy + len },
            { id: 'thread-root-r', type: 'LINE', lineWeight: 'THIN_CONTINUOUS', x1: ox + d * 0.42, y1: oy + len - threadLen, x2: ox + d * 0.42, y2: oy + len },
            { id: 'dim-d', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ox - d / 2, y1: oy + len + 25, x2: ox + d / 2, y2: oy + len + 25, dimensionText: `M${D}` }
          ]
        }
      ];
    }
  },

  // SS3 Term 1 Week 6: Surface Development - Parallel Line Method (Truncated Prism & Cylinder)
  {
    id: 'ss3-surface-development-prisms',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 6,
    moduleCode: 'TD-SS3-T1-W06',
    title: 'Parallel Line Surface Development (Truncated Hexagonal Prism & Cylinder)',
    shortDescription: 'Construct the full stretch-out pattern development of a truncated prism or cylinder using the parallel line projection method.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'SS3 TD Unit 4: Surface Development of Prisms and Cylinders (Term 3)',
      waecRef: 'WAEC TD Section A: Parallel Line Development Compulsory',
      isoRef: 'ISO 128 / BS 8888: Technical Product Specification'
    },
    theory: {
      overview: 'Surface development (pattern drafting) is the process of unrolling or unfolding the complete sheet metal boundary of a 3D hollow solid onto a flat 2D plane. In the Parallel Line Method, all lateral fold edges or generating elements are parallel to one another. For a cylinder, the stretch-out length equals the circular circumference perimeter P = πD. For a regular hexagonal prism, P = 6S. True heights from the elevation are projected horizontally onto the development grid.',
      historyAndApplication: 'J.N. Green Chapter 15, pp. 226–238 & Pickup & Parker Plate 32. Vital in sheet metal ductwork, HVAC ventilation trunking, packaging carton die-cutting, chimney cowls, and boiler pipe bends.',
      waecAndNERDCNotes: 'A classic 15-mark WAEC question. Divide the cylinder perimeter into 12 equal parts (πD / 12). Project heights horizontally with 2H thin continuous lines. Join plotted points on the development with a smooth French curve. Label seam 1-1 clearly.',
      keyPrinciples: [
        {
          title: 'Perimeter Stretch-out Formula',
          description: 'Total stretch-out baseline length equals the exact perimeter of the right section.',
          keyRule: 'L_{stretch} = \\pi D \\quad \\text{(Cylinder)} \\quad \\text{or} \\quad n \\cdot S \\quad \\text{(Prism)}'
        },
        {
          title: 'Parallel Height Projection',
          description: 'Because generators are parallel to the vertical projection plane, vertical heights in Front Elevation are true lengths.',
          keyRule: 'Heights in development = Heights in elevation (True Length)'
        }
      ],
      formulas: [
        { latex: 'L_{stretch} = \\pi D', description: 'Cylinder unfolded circumference' },
        { latex: 'L_{prism} = n \\times S', description: 'Regular polygon prism perimeter' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished developed flat pattern boundary and base outline' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Horizontal height projection rays and 12 equal division lines' }
      ]
    },
    parameters: [
      {
        id: 'diameter',
        label: 'Cylinder Diameter (D)',
        symbol: 'D',
        defaultValue: 60,
        min: 40,
        max: 80,
        step: 5,
        unit: 'mm',
        description: 'Diameter of given truncated cylinder'
      },
      {
        id: 'height',
        label: 'Cylinder Base Height (H)',
        symbol: 'H',
        defaultValue: 140,
        min: 100,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Total vertical height to highest cut point'
      },
      {
        id: 'cutAngle',
        label: 'Truncation Cut Angle',
        symbol: 'θ',
        defaultValue: 30,
        min: 20,
        max: 45,
        step: 5,
        unit: 'deg',
        description: 'Angle of oblique cutting plane to the horizontal'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.diameter || 60;
      const H = params.height || 140;
      const angle = params.cutAngle || 30;

      const elevX = 140;
      const elevY = 380;
      const r = D / 2;
      const radCut = (angle * Math.PI) / 180;

      // Stretchout length = pi * D
      const stretchL = Math.PI * D * 1.8; // scaled for canvas
      const devX = 260;
      const devY = elevY;

      // 12 division points along development
      const devPoints: [number, number][] = [];
      const numDivs = 12;
      const divWidth = stretchL / numDivs;

      for (let i = 0; i <= numDivs; i++) {
        const theta = (i * (360 / numDivs) * Math.PI) / 180;
        // height variation due to cutting plane: h(theta) = H - r * (1 - cos(theta)) * tan(radCut)
        const cutH = H - (r * (1 + Math.cos(theta)) * Math.tan(radCut)) * 1.4;
        const px = devX + i * divWidth;
        const py = devY - cutH;
        devPoints.push([px, py]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Front Elevation and Plan of Truncated Cylinder',
          instruction: `Draw circular Plan of diameter ${D}mm and Front Elevation of height ${H}mm with an oblique cutting plane inclined at ${angle}° to the horizontal.`,
          detailedNotes: 'Divide the circular Plan into 12 equal 30° sectors and project element lines up to the inclined cutting plane.',
          technicalPrinciple: 'Given solid elevation: Continuous Thick (HB) with cutting plane.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: elevX, y: elevY, visible: true },
          elements: [
            { id: 'elev-base', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r, y1: elevY, x2: elevX + r, y2: elevY },
            { id: 'elev-left', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r, y1: elevY, x2: elevX - r, y2: elevY - H },
            { id: 'elev-right', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX + r, y1: elevY, x2: elevX + r, y2: elevY - (H - 2 * r * Math.tan(radCut) * 1.4) },
            { id: 'cut-plane', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r - 15, y1: elevY - H, x2: elevX + r + 15, y2: elevY - (H - 2 * r * Math.tan(radCut) * 1.4) },
            { id: 'cl-elev', type: 'LINE', lineWeight: 'CENTER_LINE', x1: elevX, y1: elevY - H - 20, x2: elevX, y2: elevY + 20 }
          ]
        },
        {
          stepIndex: 2,
          title: `Step out Circumference Stretch-out Baseline (L = πD = ${(Math.PI * D).toFixed(1)}mm)`,
          instruction: `Extend base line horizontally. Measure total stretch-out length L = πD and divide into 12 equal divisions numbered 1 to 12 and back to 1.`,
          detailedNotes: 'Erect vertical generator lines at each of the 12 division stations using your 90° set-square.',
          technicalPrinciple: 'Stretch-out division: Continuous Thin lines (0.25mm 2H).',
          activeInstrument: { toolType: 'RULER', x: devX, y: devY, visible: true },
          elements: [
            { id: 'dev-baseline', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX, y1: devY, x2: devX + stretchL, y2: devY },
            ...Array.from({ length: 13 }).map((_, i) => ({
              id: `div-line-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: devX + i * divWidth,
              y1: devY,
              x2: devX + i * divWidth,
              y2: devY - H - 20
            })),
            { id: 'dim-stretch', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: devX, y1: devY + 30, x2: devX + stretchL, y2: devY + 30, dimensionText: `L = πD = ${(Math.PI * D).toFixed(1)}mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Heights Horizontally and Draw Finished Development Curve',
          instruction: 'From the intersection of each generator with the cutting plane in the elevation, project horizontal lines to intersect the corresponding division lines in the development.',
          detailedNotes: 'Join the plotted points with a smooth, continuous sinusoidal curve using a French curve to complete the stretch-out development.',
          technicalPrinciple: 'Finished development pattern: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'FRENCH_CURVE', x: devPoints[3][0], y: devPoints[3][1], visible: true },
          elements: [
            { id: 'dev-baseline', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX, y1: devY, x2: devX + stretchL, y2: devY, isFinalResult: true },
            { id: 'dev-seam-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX, y1: devY, x2: devX, y2: devPoints[0][1], isFinalResult: true },
            { id: 'dev-seam-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX + stretchL, y1: devY, x2: devX + stretchL, y2: devPoints[12][1], isFinalResult: true },
            { id: 'dev-curve', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[devX, devY], ...devPoints, [devX + stretchL, devY]], isFinalResult: true },
            { id: 'lbl-dev-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: devX + stretchL / 2, cy: devY - H - 35, label: 'FULL SURFACE DEVELOPMENT (CYLINDER)' }
          ]
        }
      ];
    }
  },

  // SS3 Term 1 Week 7: Radial Line Surface Development (Truncated Right Cone & Pyramid)
  {
    id: 'ss3-surface-development-radial',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 7,
    moduleCode: 'TD-SS3-T1-W07',
    title: 'Radial Line Surface Development (Truncated Right Cone & Pyramids)',
    shortDescription: 'Construct the sector development pattern of a truncated cone or pyramid using true slant height (R = L) as the radiating compass radius.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'SS3 TD Unit 4: Surface Development of Cones and Pyramids (Term 3)',
      waecRef: 'WAEC TD Section A: Radial Line Development Compulsory',
      isoRef: 'ISO 128 / BS 8888: Technical Product Documentation'
    },
    theory: {
      overview: 'Cones and pyramids converge to a single focal apex (vertex). Consequently, all surface elements radiate from this common apex. In the Radial Line Method, the development is a sector of a circle whose radius R equals the true slant height (slant generator L = sqrt(h² + r²)) of the cone. The subtended sector angle θ is given by θ = (r / L) × 360°. Any oblique truncation cutting plane is projected radially onto the true length generator before swinging development arcs.',
      historyAndApplication: 'J.N. Green Chapter 15, pp. 240–252 & Pickup & Parker Plate 34. Essential for fabricating sheet metal funnels, cyclone dust separators, grain hopper chutes, conical transition reducers, and church spires.',
      waecAndNERDCNotes: 'A frequent WAEC trap: Students measure heights directly from the axis instead of swinging them onto the extreme generator (True Length). ALWAYS project cut points horizontally to the outer slant edge before transferring to the development!',
      keyPrinciples: [
        {
          title: 'Sector Development Angle Formula',
          description: 'Subtended angle θ of the developed sector is proportional to the ratio of base radius r to true slant height L.',
          keyRule: '\\theta = \\left(\\frac{r}{L}\\right) \\times 360^\\circ'
        },
        {
          title: 'True Slant Length Requirement',
          description: 'All radial compass arcs must be struck from apex O using the true slant generator length L measured along the outer boundary.',
          keyRule: 'R_{dev} = L = \\sqrt{h^2 + r^2}'
        }
      ],
      formulas: [
        { latex: '\\theta = \\frac{r}{L} \\times 360^\\circ', description: 'Developed sector angle' },
        { latex: 'L = \\sqrt{h^2 + r^2}', description: 'True slant height' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished developed sector boundary and curved cut edge' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Radial generator rays from apex O and transfer arcs' }
      ]
    },
    parameters: [
      {
        id: 'baseRadius',
        label: 'Base Radius (r)',
        symbol: 'r',
        defaultValue: 40,
        min: 30,
        max: 60,
        step: 5,
        unit: 'mm',
        description: 'Radius of the cone circular base'
      },
      {
        id: 'verticalHeight',
        label: 'Cone Altitude (h)',
        symbol: 'h',
        defaultValue: 120,
        min: 90,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Vertical height from base to apex'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const r = params.baseRadius || 40;
      const h = params.verticalHeight || 120;
      const L = Math.sqrt(h * h + r * r);
      const sectorDeg = (r / L) * 360;

      const elevX = 180;
      const elevY = 360;
      const apexX = elevX;
      const apexY = elevY - h;

      // Development apex O
      const devApexX = 520;
      const devApexY = 160;
      const devR = L * 1.5; // scaled

      return [
        {
          stepIndex: 1,
          title: 'Draw Front Elevation of Cone and Oblique Cutting Plane',
          instruction: `Construct isosceles triangle elevation with base 2r = ${(2 * r)}mm and altitude h = ${h}mm. Draw inclined cutting plane across the cone.`,
          detailedNotes: 'The outer slant generator represents the true length L = sqrt(h² + r²).',
          technicalPrinciple: 'Cone elevation: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'TEE_SQUARE', x: elevX, y: elevY, visible: true },
          elements: [
            { id: 'cone-base', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r * 1.5, y1: elevY, x2: elevX + r * 1.5, y2: elevY },
            { id: 'cone-left', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r * 1.5, y1: elevY, x2: apexX, y2: apexY },
            { id: 'cone-right', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX + r * 1.5, y1: elevY, x2: apexX, y2: apexY },
            { id: 'cone-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: apexX, y1: apexY - 20, x2: apexX, y2: elevY + 20 },
            { id: 'cut-cone', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: elevX - r * 1.2, y1: elevY - h * 0.4, x2: elevX + r * 1.2, y2: elevY - h * 0.75 }
          ]
        },
        {
          stepIndex: 2,
          title: `Strike Sector Arc of True Slant Radius L and Calculate Angle θ = ${sectorDeg.toFixed(1)}°`,
          instruction: `With compass centered at apex O, swing large arc of radius L = ${(L).toFixed(1)}mm. Measure subtended sector angle θ = (r / L) × 360° = ${sectorDeg.toFixed(1)}°.`,
          detailedNotes: 'Divide the sector arc into 12 equal divisions corresponding to the 12 circular sectors of the base.',
          technicalPrinciple: 'Radial sector layout: Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: devApexX, y: devApexY, radius: devR, visible: true },
          elements: [
            { id: 'dev-apex-pt', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: devApexX, cy: devApexY, label: 'O (Apex)', labelPosition: 'top' },
            { id: 'dev-arc-outer', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: devApexX, cy: devApexY, r: devR, startAngle: 60, endAngle: 60 + sectorDeg },
            { id: 'dev-ray-start', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: devApexX + devR * Math.cos((60 * Math.PI) / 180), y2: devApexY + devR * Math.sin((60 * Math.PI) / 180) },
            { id: 'dev-ray-end', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: devApexX + devR * Math.cos(((60 + sectorDeg) * Math.PI) / 180), y2: devApexY + devR * Math.sin(((60 + sectorDeg) * Math.PI) / 180) }
          ]
        },
        {
          stepIndex: 3,
          title: 'Transfer Truncation Radii from Slant Edge to Complete Development',
          instruction: 'From the elevation, project cutting plane heights horizontally onto the outer slant generator, swing arcs centered at O to intersect corresponding rays, and join with HB pencil.',
          detailedNotes: 'The resulting curved boundary represents the exact flat pattern needed to roll into the truncated cone.',
          technicalPrinciple: 'Finished radial development: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'FRENCH_CURVE', x: devApexX + devR * 0.5, y: devApexY + devR * 0.5, visible: true },
          elements: [
            { id: 'dev-ray-start', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: devApexX + devR * Math.cos((60 * Math.PI) / 180), y2: devApexY + devR * Math.sin((60 * Math.PI) / 180), isFinalResult: true },
            { id: 'dev-ray-end', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: devApexX + devR * Math.cos(((60 + sectorDeg) * Math.PI) / 180), y2: devApexY + devR * Math.sin(((60 + sectorDeg) * Math.PI) / 180), isFinalResult: true },
            { id: 'dev-arc-outer', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: devApexX, cy: devApexY, r: devR, startAngle: 60, endAngle: 60 + sectorDeg, isFinalResult: true },
            { id: 'dev-arc-cut', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: devApexX, cy: devApexY, r: devR * 0.45, startAngle: 60, endAngle: 60 + sectorDeg, isFinalResult: true },
            { id: 'lbl-radial-dev', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: devApexX + devR * 0.5, cy: devApexY + devR + 30, label: 'RADIAL LINE PATTERN DEVELOPMENT' }
          ]
        }
      ];
    }
  },

  // SS3 Term 1 Week 8: Triangulation Development for Transition Pieces (Square-to-Round)
  {
    id: 'ss3-surface-development-triangulation',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 8,
    moduleCode: 'TD-SS3-T1-W08',
    title: 'Triangulation Surface Development: Transition Pieces (Square-to-Round Duct)',
    shortDescription: 'Construct true lengths and the flat surface pattern development of a sheet metal transition piece converting a square base into a circular duct opening.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'SS3 TD Unit 5: Triangulation Development of Transition Pieces (Term 3)',
      waecRef: 'WAEC TD Section A & B: Square-to-Round Transition Development',
      isoRef: 'ISO 128 / BS 8888: Sheet Metal Development Standards'
    },
    theory: {
      overview: 'Transition pieces connect ducts of different cross-sectional geometries (e.g. square base to round opening, or rectangular to circular). Because the surface is non-developable by simple parallel or radial methods, it is divided into a series of small planar triangles (triangulation). Each triangle has its true lengths found using right-angled true-length auxiliary diagrams (Pythagorean altitude theorem: TL = sqrt(Plan_length² + Vertical_height²)). The triangles are then laid down consecutively side-by-side.',
      historyAndApplication: 'J.N. Green Chapter 15, pp. 255–268 & Pickup & Parker Plate 36. Ubiquitous in air-conditioning HVAC duct transitions, industrial exhaust hood hoppers, and chimney flues.',
      waecAndNERDCNotes: 'A prime 20-mark WAEC Section A question. Always construct a clear True Length Diagram (TLD) with horizontal base and vertical altitude H. Label vertices alphabetically (A, B, C, D) for the square base and numerically (1, 2, 3...) for the circular opening.',
      keyPrinciples: [
        {
          title: 'True Length Pythagorean Theorem',
          description: 'The true length of any triangulation element is the hypotenuse of a right-angled triangle with base = Plan length and altitude = vertical height H.',
          keyRule: 'TL = \\sqrt{(\\text{Plan Length})^2 + H^2}'
        },
        {
          title: 'Consecutive Triangles Assembly',
          description: 'Construct the pattern triangle by triangle using intersecting compass arcs of known true lengths.',
          keyRule: 'Triangulate corner triangles with chord increments'
        }
      ],
      formulas: [
        { latex: 'TL_i = \\sqrt{P_i^2 + H^2}', description: 'True length of triangulation seam ray' },
        { latex: 'C_{chord} \\approx \\frac{\\pi D}{12}', description: 'Incremental round duct chord length' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished transition piece pattern outline and fold lines' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'True Length Diagram (TLD) and plan triangulation lines' }
      ]
    },
    parameters: [
      {
        id: 'baseSide',
        label: 'Square Base Side (S)',
        symbol: 'S',
        defaultValue: 100,
        min: 80,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Side width of bottom square opening'
      },
      {
        id: 'topDiameter',
        label: 'Round Top Diameter (D)',
        symbol: 'D',
        defaultValue: 60,
        min: 40,
        max: 90,
        step: 5,
        unit: 'mm',
        description: 'Diameter of circular top opening'
      },
      {
        id: 'verticalHeight',
        label: 'Transition Height (H)',
        symbol: 'H',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 10,
        unit: 'mm',
        description: 'Vertical distance between square base and round top'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const S = params.baseSide || 100;
      const D = params.topDiameter || 60;
      const H = params.verticalHeight || 100;

      const planX = 180;
      const planY = 380;
      const tldX = 360;
      const tldY = 380;
      const devX = 580;
      const devY = 400;

      return [
        {
          stepIndex: 1,
          title: 'Draw Plan View Showing Square Base and Inscribed Circle',
          instruction: `Draw square of side S = ${S}mm and concentric circle of diameter D = ${D}mm. Divide circle into 12 equal 30° sectors and connect corners to division points.`,
          detailedNotes: 'Corner A connects to points 1, 2, 3; corner B connects to 3, 4, 5. These lines represent the foreshortened plan lengths.',
          technicalPrinciple: 'Plan triangulation layout: Continuous Thick (HB) with 2H triangulation lines.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: planX, y: planY, visible: true },
          elements: [
            { id: 'plan-sq', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: planX - S / 2, y: planY - S / 2, width: S, height: S, isFinalResult: true },
            { id: 'plan-circ', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: planX, cy: planY, r: D / 2, isFinalResult: true },
            { id: 'tri-ray1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: planX - S / 2, y1: planY + S / 2, x2: planX - (D / 2) * 0.866, y2: planY + (D / 2) * 0.5 },
            { id: 'tri-ray2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: planX - S / 2, y1: planY + S / 2, x2: planX, y2: planY + D / 2 },
            { id: 'lbl-a', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: planX - S / 2 - 15, cy: planY + S / 2 + 15, label: 'A' },
            { id: 'lbl-b', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: planX + S / 2 + 15, cy: planY + S / 2 + 15, label: 'B' }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct True Length Diagram (TLD) with Vertical Altitude H = ${H}mm`,
          instruction: `Draw perpendicular axes at TLD origin. Erect vertical height H = ${H}mm. Step off plan lengths along the horizontal base to find True Lengths (TL).`,
          detailedNotes: 'The hypotenuses of these right triangles give the exact true lengths required to draft the development pattern.',
          technicalPrinciple: 'True Length Diagram (TLD): Continuous Thin (0.25mm 2H).',
          activeInstrument: { toolType: 'COMPASS', x: tldX, y: tldY, radius: H, visible: true },
          elements: [
            { id: 'tld-vert', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: tldX, y1: tldY, x2: tldX, y2: tldY - H },
            { id: 'tld-horiz', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: tldX, y1: tldY, x2: tldX + 100, y2: tldY },
            { id: 'tld-hyp1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: tldX, y1: tldY - H, x2: tldX + 60, y2: tldY },
            { id: 'tld-hyp2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: tldX, y1: tldY - H, x2: tldX + 85, y2: tldY },
            { id: 'lbl-tld-h', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tldX - 25, cy: tldY - H / 2, label: `H=${H}` },
            { id: 'lbl-tld-tl', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tldX + 40, cy: tldY - H / 2, label: 'TRUE LENGTHS' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Assemble Half-Pattern Development Using True Length Compass Arcs',
          instruction: 'Commence on baseline AB. Swing true length arcs from corners A and B intersecting with incremental chord arcs to build the transition pattern.',
          detailedNotes: 'Connect the developed points along the top circular rim with a smooth French curve, and draw straight lines for the square base.',
          technicalPrinciple: 'Finished transition piece development: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'PENCIL_HB', x: devX, y: devY - 60, visible: true },
          elements: [
            { id: 'dev-ab', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX - S / 2, y1: devY, x2: devX + S / 2, y2: devY, isFinalResult: true },
            { id: 'dev-side-l', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX - S / 2, y1: devY, x2: devX - S * 0.8, y2: devY - H - 30, isFinalResult: true },
            { id: 'dev-side-r', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: devX + S / 2, y1: devY, x2: devX + S * 0.8, y2: devY - H - 30, isFinalResult: true },
            { id: 'dev-rim-arc', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: devX, cy: devY - H * 0.4, r: S * 0.9, startAngle: 210, endAngle: 330, isFinalResult: true },
            { id: 'lbl-dev-trans', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: devX, cy: devY + 25, label: 'SQUARE-TO-ROUND DEVELOPMENT (HALF-PATTERN)' }
          ]
        }
      ];
    }
  },

  // SS3 Term 1 Week 9: Interpenetration of Dissimilar Cylinders (Intersecting at 90°)
  {
    id: 'ss3-interpenetration-solids',
    tier: 'SS3',
    term: 'TERM_1',
    termLabel: 'First Term',
    week: 9,
    moduleCode: 'TD-SS3-T1-W09',
    title: 'Interpenetration of Dissimilar Cylinders (Perpendicular T-Junction at 90°)',
    shortDescription: 'Construct the line of intersection (interpenetration curve) between two unequal cylinders meeting at right angles using horizontal cutting plane slices.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'SS3 TD Unit 6: Interpenetration of Solids (Term 3)',
      waecRef: 'WAEC TD Section A: Curves of Interpenetration Compulsory',
      isoRef: 'ISO 128 / BS 8888: Intersecting Surfaces & Technical Documentation'
    },
    theory: {
      overview: 'When two geometric solids penetrate one another (e.g. pipe branches, boiler tees, or air manifold junctions), a common curve of intersection (interpenetration line) is formed. For two cylinders of unequal diameters (d < D) intersecting at 90°, the line of intersection is a smooth saddle-shaped 3D curve that curves towards the center of the smaller branch pipe. It is plotted using a series of horizontal slicing planes passing through both cylinders simultaneously.',
      historyAndApplication: 'J.N. Green Chapter 16, pp. 270–285 & Pickup & Parker Plate 38. Universal standard in piping engineering, refinery pipe spools, hydraulic manifolds, and plumbing drainage tees.',
      waecAndNERDCNotes: 'A major WAEC examination error is drawing the curve of interpenetration as a straight line! When cylinders are unequal (d < D), the curve MUST BE ARCUATE (curved). Only when cylinders have identical diameters (d = D) does the intersection appear as straight 45° intersecting lines.',
      keyPrinciples: [
        {
          title: 'Horizontal Cutting Planes Method',
          description: 'A series of horizontal planes slice both cylinders. Each plane cuts a circle in the vertical cylinder and straight lines in the horizontal branch.',
          keyRule: 'Intersection of slice lines yields exact points on curve'
        },
        {
          title: 'Curvature Direction Rule',
          description: 'For dissimilar cylinders (d < D), the curve of interpenetration bows toward the axis of the larger cylinder.',
          keyRule: 'Curved profile concave to smaller penetrating cylinder'
        }
      ],
      formulas: [
        { latex: 'x^2 + y^2 = R_{main}^2, \\quad y^2 + z^2 = r_{branch}^2', description: 'Simultaneous cylindrical surface equations' },
        { latex: 'x = \\pm \\sqrt{R^2 - (r^2 - z^2)}', description: 'Intersection curve coordinate solution' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished visible curve of intersection and cylinder boundaries' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Generator projection lines and horizontal cutting plane slices' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Cylinder axial centerlines' }
      ]
    },
    parameters: [
      {
        id: 'mainDiameter',
        label: 'Main Cylinder Diameter (D)',
        symbol: 'D',
        defaultValue: 90,
        min: 70,
        max: 120,
        step: 10,
        unit: 'mm',
        description: 'Diameter of the larger vertical main cylinder'
      },
      {
        id: 'branchDiameter',
        label: 'Branch Cylinder Diameter (d)',
        symbol: 'd',
        defaultValue: 50,
        min: 35,
        max: 70,
        step: 5,
        unit: 'mm',
        description: 'Diameter of the smaller horizontal penetrating branch'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.mainDiameter || 90;
      const d = params.branchDiameter || 50;
      const R = D / 2;
      const r = d / 2;

      const cx = 400;
      const cy = 300;
      const hMain = 240;
      const lBranch = 160;

      // Curve of interpenetration points
      // In Front Elevation: x = R - sqrt(R^2 - y^2) depth into cylinder
      const curvePoints: [number, number][] = [];
      const numPts = 9;
      for (let i = 0; i <= numPts; i++) {
        const theta = -Math.PI / 2 + (i * Math.PI) / numPts;
        const dy = r * Math.sin(theta);
        // depth displacement along x from the cylinder left wall: x_penetrate = R - sqrt(R^2 - dy^2)
        const dx = R - Math.sqrt(Math.max(0, R * R - dy * dy));
        curvePoints.push([cx - R + dx * 1.5, cy + dy]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw Vertical Main Cylinder Elevation and Plan',
          instruction: `Draw vertical main cylinder of diameter D = ${D}mm and height ${hMain}mm. Draw its circular Plan directly below.`,
          detailedNotes: 'Draw centerlines extending 15mm beyond the cylinder borders with 2H thin chain lines.',
          technicalPrinciple: 'Main cylinder geometry: Continuous Thick (HB) with Thin Chain centerlines.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: cx, y: cy, visible: true },
          elements: [
            { id: 'main-left', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R, y1: cy - hMain / 2, x2: cx - R, y2: cy + hMain / 2, isFinalResult: true },
            { id: 'main-right', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx + R, y1: cy - hMain / 2, x2: cx + R, y2: cy + hMain / 2, isFinalResult: true },
            { id: 'main-top', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R, y1: cy - hMain / 2, x2: cx + R, y2: cy - hMain / 2, isFinalResult: true },
            { id: 'main-bot', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R, y1: cy + hMain / 2, x2: cx + R, y2: cy + hMain / 2, isFinalResult: true },
            { id: 'cl-main-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - hMain / 2 - 30, x2: cx, y2: cy + hMain / 2 + 30 }
          ]
        },
        {
          stepIndex: 2,
          title: `Project Horizontal Penetrating Branch Cylinder (Diameter d = ${d}mm)`,
          instruction: `Draw horizontal branch cylinder of diameter d = ${d}mm penetrating from the left into the main cylinder at right angles (90°).`,
          detailedNotes: 'Draw semicircular end profile on the branch pipe and divide into 6 equal generator slices.',
          technicalPrinciple: 'Branch cylinder layout: Continuous Thick (HB) with horizontal slicing lines.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: cx - R - lBranch, y: cy, visible: true },
          elements: [
            { id: 'branch-top', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R - lBranch, y1: cy - r, x2: cx - R, y2: cy - r, isFinalResult: true },
            { id: 'branch-bot', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R - lBranch, y1: cy + r, x2: cx - R, y2: cy + r, isFinalResult: true },
            { id: 'branch-end', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - R - lBranch, y1: cy - r, x2: cx - R - lBranch, y2: cy + r, isFinalResult: true },
            { id: 'cl-branch-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx - R - lBranch - 25, y1: cy, x2: cx + R + 25, y2: cy },
            // Horizontal slicing lines
            { id: 'slice-mid', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: cx - R - lBranch, y1: cy, x2: cx, y2: cy }
          ]
        },
        {
          stepIndex: 3,
          title: 'Plot Points of Intersection and Draw Finished Curve of Interpenetration',
          instruction: 'From the Plan View circle, project vertical lines from slice intersections up to meet corresponding horizontal generators in the Elevation. Join with French curve.',
          detailedNotes: 'Notice that the resulting curve is smoothly arcuate and concave towards the penetrating branch pipe.',
          technicalPrinciple: 'Finished interpenetration curve: Continuous Thick (0.5mm HB).',
          activeInstrument: { toolType: 'FRENCH_CURVE', x: curvePoints[4][0], y: curvePoints[4][1], visible: true },
          elements: [
            { id: 'curve-interpen', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: curvePoints, isFinalResult: true },
            { id: 'lbl-curve-title', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx - R + 20, cy: cy - r - 20, label: 'CURVE OF INTERPENETRATION' },
            { id: 'dim-main-d', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - R, y1: cy - hMain / 2 - 15, x2: cx + R, y2: cy - hMain / 2 - 15, dimensionText: `D = ${D}mm` },
            { id: 'dim-branch-d', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - R - lBranch - 15, y1: cy - r, x2: cx - R - lBranch - 15, y2: cy + r, dimensionText: `d = ${d}mm` }
          ]
        }
      ];
    }
  },

  // SS3 Term 2 Week 6: Mechanical Sectional Views & Assembly Drafting
  {
    id: 'ss3-sectional-assembly-mechanical',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 6,
    moduleCode: 'TD-SS3-T2-W06',
    title: 'Mechanical Sectional Views & Assembly Drafting (Full & Half Sections per ISO 128-40)',
    shortDescription: 'Construct full, half, and unsectioned views of standard mechanical assemblies (Nut & Bolt joint, Flanged Coupling, Plummer Block) enforcing ISO 128-40 sectioning conventions.',
    category: 'FASTENERS_AND_ASSEMBLY',
    standards: {
      nerdcRef: 'SS3 TD Unit 3: Mechanical Assembly & Sectional Elevations (Term 2)',
      waecRef: 'WAEC TD Paper 2 Section B (Mechanical Option): Compulsory 50-Mark Assembly Question',
      isoRef: 'ISO 128-40: Basic conventions for cutting planes and sections / BS 8888'
    },
    theory: {
      overview: 'Sectional views reveal internal assembly details by hypothetically slicing through components with an imaginary cutting plane (A-A). A Full Section cuts completely through the axis of symmetry. A Half Section cuts only halfway, displaying one half in section and the other in outside elevation, divided by a thin chain centerline. Key ISO 128-40 sectioning rules must be strictly observed: section lines are drawn as Continuous Thin lines (0.25mm) at 45° spaced 2–3mm apart; adjacent parts in contact must have their hatching directions reversed (+45° vs -45°); solid shafts, bolts, studs, nuts, washers, pins, and keys are NEVER sectioned longitudinally along their axis.',
      historyAndApplication: 'J.N. Green Chapter 15 & Pickup & Parker Plate 32. Universal mechanical engineering convention across automotive powertrains, marine propulsion, aerospace turbines, and manufacturing machinery.',
      waecAndNERDCNotes: 'A major source of lost marks in WAEC: Candidates who cross-hatch solid shafts, bolts, or keys lose up to 10 marks instantly. Adjacent components must clearly alternate hatching direction. Centerlines must extend 10mm beyond part boundaries.',
      keyPrinciples: [
        {
          title: 'Unsectioned Parts Rule (ISO 128-40)',
          description: 'Solid cylindrical shafts, bolts, studs, nuts, washers, keys, pins, gear teeth, and thin webs/ribs cut along their longitudinal axis are drawn in full solid elevation without section hatching.',
          keyRule: 'Shafts, bolts, nuts & keys = NEVER hatched longitudinally'
        },
        {
          title: 'Reversed Hatching Rule',
          description: 'Adjacent components in contact must reverse hatching angle (typically +45° for one part and -45°/135° for mating part). Bronze/brass uses 60° fine pitch.',
          keyRule: 'Adjacent parts = Opposite 45° angles'
        },
        {
          title: 'Half Section Symmetrical Boundary',
          description: 'In a half section, the boundary separating the sectioned half from the exterior unsectioned half is always a Thin Chain centerline (0.25mm), never a solid continuous line.',
          keyRule: 'Centerline divides half section from outside elevation'
        }
      ],
      formulas: [
        { latex: '\\text{Hatch Spacing} = 2\\text{ to }3\\text{ mm}', description: 'Continuous Thin lines (0.25mm) at 45°' },
        { latex: 'C_{corners} = 2D, \\quad H_{head} = 0.7D, \\quad T_{nut} = 0.8D', description: 'ISO Metric Hex Bolt & Nut proportions' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.5mm)', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Cut part profiles and visible external contours' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: '45° Section hatching and dimension lines' },
        { lineName: 'Thin Chain (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Axes of symmetry, centerlines, and cutting plane center' }
      ]
    },
    parameters: [
      {
        id: 'boltDiameter',
        label: 'Nominal Bolt Diameter (D)',
        symbol: 'D',
        defaultValue: 24,
        min: 16,
        max: 36,
        step: 4,
        unit: 'mm',
        description: 'Nominal diameter of metric assembly bolt'
      },
      {
        id: 'plateThickness',
        label: 'Joint Plate Thickness (T)',
        symbol: 'T',
        defaultValue: 20,
        min: 15,
        max: 30,
        step: 5,
        unit: 'mm',
        description: 'Thickness of upper and lower joint plates'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.boltDiameter || 24;
      const T = params.plateThickness || 20;
      const cx = 400;
      const cy = 280;

      const scale = 2.4;
      const d = D * scale;
      const t = T * scale;
      const wPlates = 340;
      const hHead = 0.7 * d;
      const tNut = 0.8 * d;
      const wCorners = 2 * d;

      return [
        {
          stepIndex: 1,
          title: 'Draw Axis Centerline and Upper/Lower Joint Plates (20mm) in Section',
          instruction: `Construct vertical centerline through O. Draw Upper Plate (thickness ${T}mm) hatched at +45° and Lower Plate (thickness ${T}mm) hatched in reverse direction at -45°.`,
          detailedNotes: 'Adjacent plates must have opposite hatching directions per ISO 128-40 to distinguish the interface line.',
          technicalPrinciple: 'Continuous Thick (HB) plate boundaries with Continuous Thin (2H) reversed hatching.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: cx - 120, y: cy, visible: true },
          elements: [
            { id: 'cl-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - hHead - 50, x2: cx, y2: cy + t * 2 + tNut + 60 },
            // Upper plate left & right
            { id: 'p1-rect-l', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - wPlates / 2, y: cy - t, width: wPlates / 2 - d / 2 - 2, height: t, isFinalResult: true },
            { id: 'p1-rect-r', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx + d / 2 + 2, y: cy - t, width: wPlates / 2 - d / 2 - 2, height: t, isFinalResult: true },
            // Lower plate left & right
            { id: 'p2-rect-l', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - wPlates / 2, y: cy, width: wPlates / 2 - d / 2 - 2, height: t, isFinalResult: true },
            { id: 'p2-rect-r', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx + d / 2 + 2, y: cy, width: wPlates / 2 - d / 2 - 2, height: t, isFinalResult: true },
            { id: 'lbl-p1', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx - 110, cy: cy - t / 2, label: 'PLATE 1 (+45° HATCH)' },
            { id: 'lbl-p2', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cx - 110, cy: cy + t / 2, label: 'PLATE 2 (-45° HATCH)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Insert Solid Hexagonal Bolt (M24) - Strictly UNSECTIONED per ISO 128',
          instruction: 'Insert M24 bolt shank through the clearance hole. Draw the bolt head (across corners = 2D = 48mm) and shank in solid elevation. Do NOT hatch the bolt.',
          detailedNotes: 'Solid shafts and bolts are left unsectioned in longitudinal elevation according to ISO 128-40 standards.',
          technicalPrinciple: 'Bolt shank and head: Continuous Thick (0.5mm HB) exterior elevation.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: cx, y: cy - t - hHead, visible: true },
          elements: [
            // Bolt head
            { id: 'bolt-head-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - wCorners / 2, y: cy - t - hHead, width: wCorners, height: hHead, isFinalResult: true },
            // Solid plain shank
            { id: 'bolt-shank', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - d / 2, y: cy - t, width: d, height: t * 2 + 60, isFinalResult: true },
            { id: 'lbl-unsectioned', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx + d / 2 + 25, cy: cy - t / 2, label: 'SOLID BOLT: UNSECTIONED' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Assemble Plain Washer, Spring Washer, and Hex Nut (0.8D = 19mm)',
          instruction: 'Draw washer and hex nut screwed onto the threaded shank below the lower plate. Mark thread root lines with thin continuous lines (0.85D).',
          detailedNotes: 'Show 30° chamfer arcs on the nut faces with R = 1.5D compass radii.',
          technicalPrinciple: 'Complete assembly: Continuous Thick outlines with ISO 128 compliance.',
          activeInstrument: { toolType: 'PENCIL_HB', x: cx, y: cy + t + tNut, visible: true },
          elements: [
            // Washer
            { id: 'washer-el', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - (wCorners * 1.1) / 2, y: cy + t, width: wCorners * 1.1, height: 0.15 * d, isFinalResult: true },
            // Hex nut
            { id: 'nut-el', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - wCorners / 2, y: cy + t + 0.15 * d, width: wCorners, height: tNut, isFinalResult: true },
            { id: 'dim-total', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - wPlates / 2 - 20, y1: cy - t, x2: cx - wPlates / 2 - 20, y2: cy + t, dimensionText: `2T = ${2 * T}mm` },
            { id: 'lbl-title-sec', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy - t - hHead - 30, label: 'M24 BOLT & NUT JOINT (FULL SECTIONAL ELEVATION)' }
          ]
        }
      ];
    }
  },

  // SS3 Term 3 Week 2: Architectural Working Drawings & Residential Floor Plans
  {
    id: 'ss3-architectural-working-drawings',
    tier: 'SS3',
    term: 'TERM_3',
    termLabel: 'Third Term',
    week: 2,
    moduleCode: 'TD-SS3-T3-W02',
    title: 'Architectural Working Drawings & Residential Floor Plans (ISO 4157 Layers & Wall Section)',
    shortDescription: 'Construct a complete residential floor plan with multi-service layers (dimensions, walls, electrical symbols, plumbing fixtures) and detailed foundation-to-eaves wall section.',
    category: 'BUILDING_AND_ARCHITECTURAL',
    standards: {
      nerdcRef: 'SS3 TD Unit 2: Building Construction Details & Working Drawings (Term 3)',
      waecRef: 'WAEC TD Paper 2 Section B (Building Option): Compulsory 50-Mark Working Drawing Question',
      isoRef: 'ISO 4157: Building drawings - Construction documentation / ISO 128-23'
    },
    theory: {
      overview: 'Architectural working drawings provide contractor-ready documentation for building construction. The Ground Floor Plan (Scale 1:50) shows room dimensions, wall thicknesses (225mm external sandcrete, 150mm internal partitions), door swings (90° arcs), window schedules, and multi-service layers: electrical symbols (ceiling points, switches, 13A sockets, distribution board per ISO 60617) and plumbing fixtures (WC with cistern, wash hand basin, kitchen sink, inspection chamber). The Detailed Wall Section X-X (Scale 1:20) illustrates sub-structure and super-structure: 675x225mm concrete strip footing (3T x T), 225mm foundation wall, 200mm compacted hardcore, sand blinding, 1000g polythene DPM, 150mm concrete floor slab, 25mm screed, DPC minimum 150mm above Ground Level, precast weathered cill with drip groove, reinforced concrete lintel (225x150mm), ring beam (225x225mm), timber wall plate (100x75mm with ragbolt), and roof truss with 600mm eaves overhang.',
      historyAndApplication: 'J.N. Green Chapter 14, pp. 210–235 & BS 1192 / ISO 4157. Standard building drawing submission format required by Town Planning Authorities across West Africa.',
      waecAndNERDCNotes: 'Compulsory 25–50 mark question in WAEC Technical Drawing Paper 2 (Building Option). Candidates are awarded marks for: DPC positioned ≥150mm above GL (4 marks), Strip footing proportion 3T x T (5 marks), Material hatching symbols (5 marks), Ring beam and wall plate anchoring (4 marks), and Line weight hierarchy (4 marks).',
      keyPrinciples: [
        {
          title: 'Footing 3T Proportional Rule',
          description: 'The mass concrete strip foundation footing width must be 3 times the wall thickness (3T = 675mm for a 225mm wall) and footing depth equals wall thickness (T = 225mm).',
          keyRule: 'Footing Width = 3T = 675mm; Footing Depth = T = 225mm'
        },
        {
          title: 'DPC Elevation Standard',
          description: 'The Damp Proof Course (DPC) must be installed at minimum 150mm above the Finished Ground Level (GL) to prevent rising damp into masonry.',
          keyRule: 'DPC Height ≥ 150mm above Ground Line'
        },
        {
          title: 'ISO 4157 Layer Management',
          description: 'Architectural drawings maintain separate coordinated layers: structural walls, architectural openings, electrical installations, and sanitary plumbing.',
          keyRule: 'Coordinated structural, electrical, and plumbing layers'
        }
      ],
      formulas: [
        { latex: 'W_{footing} = 3 \\cdot W_{wall} = 3 \\cdot 225 = 675\\text{ mm}', description: 'Standard strip footing width' },
        { latex: 'D_{footing} = W_{wall} = 225\\text{ mm}', description: 'Standard strip footing depth' },
        { latex: 'h_{DPC} \\ge 150\\text{ mm}', description: 'Minimum height of DPC above finished ground level' }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick (0.6mm)', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Cut masonry walls, floor slab, footing, and lintel profiles' },
        { lineName: 'Continuous Thin (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Material hatching, dimension lines, and grid axes' },
        { lineName: 'Thin Dashed (0.25mm)', weightMm: '0.25mm', pencilGrade: '2H', application: 'Door swing arcs, electrical switch lines, and DPM membrane' }
      ]
    },
    parameters: [
      {
        id: 'wallThickness',
        label: 'External Wall Thickness (T)',
        symbol: 'T',
        defaultValue: 225,
        min: 150,
        max: 300,
        step: 25,
        unit: 'mm',
        description: 'Nominal thickness of load-bearing masonry wall'
      },
      {
        id: 'eavesOverhang',
        label: 'Roof Eaves Overhang',
        symbol: 'E',
        defaultValue: 600,
        min: 450,
        max: 750,
        step: 50,
        unit: 'mm',
        description: 'Horizontal projection of roof rafters beyond wall face'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const T = params.wallThickness || 225;
      const eaves = params.eavesOverhang || 600;
      const cx = 360;
      const cy = 280;

      return [
        {
          stepIndex: 1,
          title: 'Establish Grid Lines and Draw Mass Concrete Strip Footing (675 x 225mm)',
          instruction: `Draw foundation centerline. Construct mass concrete strip footing of width 3T = ${3 * T}mm and depth T = ${T}mm.`,
          detailedNotes: 'Footing rests on undisturbed natural earth. Render with concrete triangular aggregates and sand stipple.',
          technicalPrinciple: 'Footing geometry: Continuous Thick (0.6mm HB) with concrete mix hatching.',
          activeInstrument: { toolType: 'TEE_SQUARE', x: cx, y: cy + 180, visible: true },
          elements: [
            { id: 'cl-fnd', type: 'LINE', lineWeight: 'CENTER_LINE', x1: cx, y1: cy - 200, x2: cx, y2: cy + 260 },
            { id: 'footing-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - (3 * T) / 4, y: cy + 160, width: (3 * T) / 2, height: T / 2, isFinalResult: true },
            { id: 'dim-f-w', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - (3 * T) / 4, y1: cy + 240, x2: cx + (3 * T) / 4, y2: cy + 240, dimensionText: `3T = ${3 * T}mm` },
            { id: 'lbl-footing', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy + 195, label: 'CONCRETE STRIP FOOTING (1:3:6)' }
          ]
        },
        {
          stepIndex: 2,
          title: 'Erect Foundation Wall, Compacted Hardcore, DPM, Floor Slab & DPC',
          instruction: `Erect 225mm sandcrete foundation wall, 200mm hardcore bed, sand blinding, 1000g DPM, 150mm concrete floor slab, and DPC at ≥150mm above GL.`,
          detailedNotes: 'The DPC is a solid impervious asphaltic line preventing rising damp. Ground Level GL is marked with an inverted triangle.',
          technicalPrinciple: 'Substructure & DPC detail: Continuous Thick outlines with hardcore and concrete hatching.',
          activeInstrument: { toolType: 'SET_SQUARE_45', x: cx, y: cy + 60, visible: true },
          elements: [
            { id: 'fnd-wall', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - T / 4, y: cy + 40, width: T / 2, height: 120, isFinalResult: true },
            { id: 'slab-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx + T / 4, y: cy + 40, width: 180, height: 35, isFinalResult: true },
            { id: 'hardcore-rect', type: 'RECTANGLE', lineWeight: 'THIN_CONTINUOUS', x: cx + T / 4, y: cy + 85, width: 180, height: 75 },
            // DPC solid bar
            { id: 'dpc-bar', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - T / 4 - 2, y: cy + 38, width: T / 2 + 4, height: 5, isFinalResult: true },
            { id: 'gl-line', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - 180, y1: cy + 70, x2: cx - T / 4, y2: cy + 70 },
            { id: 'lbl-gl', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx - 120, cy: cy + 65, label: 'GL ±0.000' },
            { id: 'lbl-dpc', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx + T / 4 + 30, cy: cy + 30, label: 'DPC (≥150mm ABOVE GL)' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Add Superstructure Wall, Window Cill, Lintel, Ring Beam, Wall Plate & Roof Eaves',
          instruction: `Draw 225mm superstructure wall with weathered cill, reinforced concrete lintel, ring beam at eaves, 100x75mm wall plate with ragbolt, and roof truss with ${eaves}mm eaves.`,
          detailedNotes: 'Timber wall plate is anchored securely into the ring beam. Fascia board (250x25mm) finishes the eaves overhang.',
          technicalPrinciple: 'Superstructure & roof connection: Continuous Thick and Medium line weights.',
          activeInstrument: { toolType: 'PENCIL_HB', x: cx, y: cy - 140, visible: true },
          elements: [
            { id: 'super-wall', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - T / 4, y: cy - 140, width: T / 2, height: 178, isFinalResult: true },
            { id: 'ring-beam-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - T / 4, y: cy - 185, width: T / 2, height: 45, isFinalResult: true },
            { id: 'wall-plate-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x: cx - 12, y: cy - 200, width: 24, height: 15, isFinalResult: true },
            { id: 'rafter-line', type: 'LINE', lineWeight: 'THICK_CONTINUOUS', x1: cx - 140, y1: cy - 160, x2: cx + 180, y2: cy - 250, isFinalResult: true },
            { id: 'fascia-rect', type: 'RECTANGLE', lineWeight: 'THICK_CONTINUOUS', x1: cx - 142, y: cy - 170, width: 5, height: 35, isFinalResult: true },
            { id: 'dim-eaves', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cx - 140, y1: cy - 130, x2: cx - T / 4, y2: cy - 130, dimensionText: `Eaves ${eaves}mm` },
            { id: 'lbl-title-arch', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cx, cy: cy - 220, label: 'SECTION THROUGH EXTERNAL WALL TO EAVES (SCALE 1:20)' }
          ]
        }
      ];
    }
  }
];
