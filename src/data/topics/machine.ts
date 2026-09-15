import { DrawingTopic } from '../../types/curriculum';

export const machineTopics: DrawingTopic[] = [
  {
    id: 'higher-machine-plummer-block',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-MCH-01',
    title: 'Plummer Block (Pedestal Bearing) Assembly & Sectional Elevation',
    shortDescription: 'Construct the complete orthographic front half-sectional elevation of a Cast Iron Plummer Block (pedestal split bearing) with gunmetal split bushes, cap, studs, and locking nuts.',
    category: 'MACHINE_DRAWING_AND_ASSEMBLY',
    standards: {
      nerdcRef: 'Higher Education Mechanical Engineering Graphics Unit 5: Machine Assemblies',
      waecRef: 'Advanced Technical Drawing / City & Guilds: Plummer Block Bearing Assemblies',
      isoRef: 'ISO 128-40 / ISO 6410: Engineering Drawings - Sectional Views of Bearings'
    },
    theory: {
      overview: 'A Plummer Block (or Pedestal Bearing) supports a rotating horizontal transmission shaft subjected to heavy radial loads. It consists of a Cast Iron body base, a split Gunmetal / Brass bush (to minimize friction and allow replacement upon wear), a Cast Iron Cap, two mild steel square-headed holding studs, and lock nuts with split pins.',
      historyAndApplication: 'Heavy industrial power transmission lineshafts, agricultural milling machines, marine propeller shaft intermediate supports, and conveyor roller pillow blocks.',
      waecAndNERDCNotes: 'Sectioning Rule: Shafts, bolts, studs, nuts, and pins are NEVER sectioned longitudinally even when the cutting plane passes through their axes. Brass bushes receive 45° hatching in opposite directions to distinguish the top and bottom split halves.',
      keyPrinciples: [
        {
          title: 'Split Bush Replacement & Wear Compensation',
          description: 'The brass split bush consists of two semicircular halves. A small clearance gap (snug) is provided at the joint to allow tightening as the bearing wears.',
          keyRule: 'D_shaft = 50mm,   T_bush = 6mm'
        },
        {
          title: 'Sectional Elevation Hatching Direction',
          description: 'Adjacent mating components (Body vs Cap vs Bush) must be hatched at 45° in alternating directions (left vs right) and differing spacing.',
          keyRule: 'Angle = 45°,   Δ_hatch = 2mm to 4mm'
        }
      ],
      formulas: [
        {
          latex: 'L_base = 4D + 40,   H_center = 1.5D + 10,   W_cap = 2D',
          description: 'Standard empirical proportion formulas for Plummer Block casting'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished outer profiles of cast iron bearing body and cap' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: '45° sectional hatching lines and thread root indicators' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Horizontal shaft centerline and vertical stud axes' }
      ]
    },
    parameters: [
      {
        id: 'shaftDia',
        label: 'Shaft Diameter (D)',
        symbol: 'D',
        defaultValue: 50,
        min: 35,
        max: 75,
        step: 5,
        unit: 'mm',
        description: 'Nominal diameter of rotating shaft'
      },
      {
        id: 'baseLength',
        label: 'Base Flange Length (L)',
        symbol: 'L',
        defaultValue: 240,
        min: 180,
        max: 300,
        step: 10,
        unit: 'mm',
        description: 'Length of cast iron mounting base'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.shaftDia || 50;
      const R = D / 2;
      const L = params.baseLength || 240;
      const bushT = 8;
      const capH = 45;
      const bodyH = 80;

      const cX = 400;
      const cY = 320; // Shaft Center

      const baseBotY = cY + bodyH;
      const baseTopY = baseBotY - 25;
      const capTopY = cY - R - bushT - capH;

      return [
        {
          stepIndex: 1,
          title: 'Establish Shaft and Bearing Centerlines',
          instruction: `Draw the horizontal shaft axis and vertical centerline through (X: ${cX}, Y: ${cY}) using 2H thin chain lines.`,
          detailedNotes: 'All circular and symmetrical components align relative to these primary datum axes.',
          technicalPrinciple: 'Primary assembly datum alignment.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: cX - L / 2 - 30,
            y: cY,
            targetX: cX + L / 2 + 30,
            targetY: cY,
            visible: true,
            actionText: 'Draw horizontal and vertical centerlines'
          },
          elements: [
            { id: 'axis-h', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cX - L / 2 - 40, y1: cY, x2: cX + L / 2 + 40, y2: cY, isNew: true },
            { id: 'axis-v', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cX, y1: capTopY - 30, x2: cX, y2: baseBotY + 30, isNew: true },
            { id: 'pt-center', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY, label: 'O (Shaft Axis)', labelPosition: 'top-left' }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct the Cast Iron Base Body (Base Length L = ${L} mm)`,
          instruction: `Draw the stepped cast iron base of length ${L} mm and height ${bodyH} mm with foundation bolt slots.`,
          detailedNotes: 'The base includes side lugs with elongated slots for adjusting alignment on machine soleplates.',
          technicalPrinciple: 'Cast Iron pedestal base geometry.',
          activeInstrument: {
            toolType: 'RULER',
            x: cX - L / 2,
            y: baseBotY,
            targetX: cX + L / 2,
            targetY: baseBotY,
            visible: true,
            actionText: `Draw cast iron base of length ${L}mm`
          },
          elements: [
            // Base soleplate
            { id: 'base-poly', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX - L / 2, baseBotY], [cX + L / 2, baseBotY], [cX + L / 2, baseTopY], [cX + 70, baseTopY], [cX + 55, cY], [cX - 55, cY], [cX - 70, baseTopY], [cX - L / 2, baseTopY]], isNew: true },
            // Left bolt slot
            { id: 'slot-l', type: 'POLYGON', lineWeight: 'THIN_DASHED', points: [[cX - L / 2 + 25, baseBotY], [cX - L / 2 + 45, baseBotY], [cX - L / 2 + 45, baseTopY], [cX - L / 2 + 25, baseTopY]], isNew: true },
            // Right bolt slot
            { id: 'slot-r', type: 'POLYGON', lineWeight: 'THIN_DASHED', points: [[cX + L / 2 - 45, baseBotY], [cX + L / 2 - 25, baseBotY], [cX + L / 2 - 25, baseTopY], [cX + L / 2 - 45, baseTopY]], isNew: true },
            { id: 'lbl-base', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cX, cy: baseBotY + 20, label: 'CAST IRON BASE' }
          ]
        },
        {
          stepIndex: 3,
          title: `Insert Gunmetal Split Bush (Bore D = ${D} mm) and Shaft`,
          instruction: `Draw circular split brass bush (inner radius ${R} mm, outer radius ${R + bushT} mm). Draw shaft circle of diameter ${D} mm.`,
          detailedNotes: 'Top half and bottom half split bushes are seated with a snug step to prevent rotation.',
          technicalPrinciple: 'Bushing assembly with anti-rotation snug.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: cX,
            y: cY,
            radius: R + bushT,
            visible: true,
            actionText: `Draw split bush (D = ${D}mm, T = ${bushT}mm)`
          },
          elements: [
            { id: 'shaft-circle', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY, r: R, isNew: true },
            { id: 'bush-outer-top', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY, r: R + bushT, startAngle: 180, endAngle: 360, isNew: true },
            { id: 'bush-outer-bot', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY, r: R + bushT, startAngle: 0, endAngle: 180, isNew: true },
            { id: 'lbl-bush', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: cX + R + 25, cy: cY - 10, label: 'GUNMETAL BUSH' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Add Cast Iron Cap, Square-Headed Studs, Lock Nuts, and Section Hatching',
          instruction: 'Draw Cap contour over the top bush. Draw M16 vertical holding studs with hexagonal nuts. Apply standard 45° sectional hatching to the right half.',
          detailedNotes: 'Shaft and studs remain unsectioned in accordance with ISO 128 standards.',
          technicalPrinciple: 'Complete Plummer Block Sectional Assembly.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: cX,
            y: capTopY,
            visible: true,
            actionText: 'Draw bearing cap, studs, and ISO section hatching'
          },
          elements: [
            // Cap outline
            { id: 'cap-poly', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX - 60, cY], [cX - 60, cY - 20], [cX - 45, capTopY], [cX + 45, capTopY], [cX + 60, cY - 20], [cX + 60, cY]], isNew: true, isFinalResult: true },
            // Left Stud & Nut
            { id: 'stud-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX - 45, y1: cY + 40, x2: cX - 45, y2: capTopY - 25, isNew: true },
            { id: 'nut-l', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX - 55, capTopY - 5], [cX - 35, capTopY - 5], [cX - 35, capTopY - 22], [cX - 55, capTopY - 22]], isNew: true },
            // Right Stud & Nut
            { id: 'stud-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX + 45, y1: cY + 40, x2: cX + 45, y2: capTopY - 25, isNew: true },
            { id: 'nut-r', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX + 35, capTopY - 5], [cX + 55, capTopY - 5], [cX + 55, capTopY - 22], [cX + 35, capTopY - 22]], isNew: true },
            // Dimension
            { id: 'dim-shaft', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cX - R, y1: cY + R + 25, x2: cX + R, y2: cY + R + 25, dimensionText: `Ø${D} mm` },
            { id: 'lbl-title-pb', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: capTopY - 45, label: 'PLUMMER BLOCK ASSEMBLY (HALF SECTIONAL ELEVATION)' }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-machine-flanged-coupling',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-MCH-02',
    title: 'Protected Flanged Shaft Coupling with Gib-Head Key Assembly',
    shortDescription: 'Construct the orthographic sectional elevation of a Protected Flanged Shaft Coupling joining two rotating shafts with rectangular sunk keys and pitch-circle diameter bolts.',
    category: 'MACHINE_DRAWING_AND_ASSEMBLY',
    standards: {
      nerdcRef: 'Higher Education Mechanical Engineering Graphics Unit 5: Shaft Couplings',
      waecRef: 'Advanced Technical Drawing: Rigid Flanged Couplings',
      isoRef: 'ISO 128 / ISO 286: Mechanical Couplings & Keyways'
    },
    theory: {
      overview: 'A Flanged Coupling connects two collinear rotating power transmission shafts. It comprises two Cast Iron keyed flange hubs connected by circumferential bolts on a Pitch Circle Diameter (PCD). A protective circumferential shroud shields the bolt heads to prevent snagging clothing.',
      historyAndApplication: 'Electric motor to centrifugal pump drives, marine inboard engine gearboxes, industrial rolling mill drives, and diesel generator sets.',
      waecAndNERDCNotes: 'A spigot and recess centering step (D_spigot = 1.5 D) ensures perfect coaxial shaft alignment. Rectangular tapered gib-head keys (W = D/4, T = D/6) transmit torque without slipping.',
      keyPrinciples: [
        {
          title: 'Spigot and Recess Coaxial Alignment',
          description: 'One flange features an annular protruding spigot while the mating flange features a matching recess to ensure perfect concentricity.',
          keyRule: 'D_{\\text{spigot}} = 1.5 D, \\quad \\text{Depth} = 5\\,\\text{mm}'
        },
        {
          title: 'Protective Shroud Safety Requirement',
          description: 'The outer flange circumference has a raised circumferential rim of thickness 0.25 D that encloses all bolt heads and nuts.',
          keyRule: 'T_{\\text{shroud}} = 0.25 D'
        }
      ],
      formulas: [
        {
          latex: 'D_{\\text{hub}} = 2D, \\quad D_{\\text{PCD}} = 3D, \\quad D_{\\text{flange}} = 4D + 2T_{\\text{shroud}}',
          description: 'Standard proportional formulas for protected flanged coupling'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished outer flange boundaries and shaft outlines' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Section hatching and bolt pitch circle' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Shaft rotational centerline and bolt axes' }
      ]
    },
    parameters: [
      {
        id: 'shaftDia',
        label: 'Shaft Diameter (D)',
        symbol: 'D',
        defaultValue: 40,
        min: 30,
        max: 60,
        step: 5,
        unit: 'mm',
        description: 'Diameter of transmission shaft'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.shaftDia || 40;
      const R = D / 2;
      const hubD = 2 * D;
      const pcdD = 3 * D;
      const flangeD = 4.5 * D;

      const cX = 400; // Flange mating plane
      const cY = 300; // Centerline

      const hubW = 1.5 * D;
      const flangeT = 0.5 * D;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Shaft Centerline and Flange Mating Interface',
          instruction: `Draw main horizontal shaft axis and vertical mating plane at (X: ${cX}, Y: ${cY}) with 2H thin chain lines.`,
          detailedNotes: 'Establish symmetry plane between Left Flange and Right Flange.',
          technicalPrinciple: 'Coaxial shaft datum.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: 200,
            y: cY,
            targetX: 600,
            targetY: cY,
            visible: true,
            actionText: 'Draw shaft axis and vertical mating line'
          },
          elements: [
            { id: 'axis-shaft', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: 180, y1: cY, x2: 620, y2: cY, isNew: true },
            { id: 'axis-mate', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: cX, y1: cY - flangeD / 2 - 25, x2: cX, y2: cY + flangeD / 2 + 25, isNew: true },
            { id: 'dim-pcd', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: cX + 80, y1: cY - pcdD / 2, x2: cX + 80, y2: cY + pcdD / 2, dimensionText: `PCD Ø${pcdD} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct Left and Right Flange Hubs (Hub Diameter = ${hubD} mm)`,
          instruction: `Draw stepped left flange hub (width ${hubW} mm) and right flange hub with spigot and recess centering step.`,
          detailedNotes: 'Spigot depth is 5mm to register concentricity.',
          technicalPrinciple: 'Flange hub geometry.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: cX - hubW,
            y: cY,
            targetX: cX + hubW,
            targetY: cY,
            visible: true,
            actionText: 'Draw left and right flange hub stepped outlines'
          },
          elements: [
            // Left Flange
            { id: 'flange-l', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX - hubW, cY - hubD / 2], [cX - flangeT, cY - hubD / 2], [cX - flangeT, cY - flangeD / 2], [cX, cY - flangeD / 2], [cX, cY + flangeD / 2], [cX - flangeT, cY + flangeD / 2], [cX - flangeT, cY + hubD / 2], [cX - hubW, cY + hubD / 2]], isNew: true },
            // Right Flange
            { id: 'flange-r', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[cX + hubW, cY - hubD / 2], [cX + flangeT, cY - hubD / 2], [cX + flangeT, cY - flangeD / 2], [cX, cY - flangeD / 2], [cX, cY + flangeD / 2], [cX + flangeT, cY + flangeD / 2], [cX + flangeT, cY + hubD / 2], [cX + hubW, cY + hubD / 2]], isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: `Insert Shafts (Ø${D} mm), Sunk Keys, and Fitted Coupling Bolts`,
          instruction: `Draw shafts penetrating both hubs. Draw rectangular keys in keyways and insert hex coupling bolts on PCD Ø${pcdD} mm.`,
          detailedNotes: 'Bolt heads sit securely inside the protective shroud rim.',
          technicalPrinciple: 'Complete Flanged Coupling Assembly.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: cX,
            y: cY,
            visible: true,
            actionText: 'Draw shafts, keys, and bolts with protective shroud'
          },
          elements: [
            // Shafts
            { id: 'shaft-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 200, y1: cY - R, x2: cX, y2: cY - R, isNew: true },
            { id: 'shaft-l-b', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: 200, y1: cY + R, x2: cX, y2: cY + R, isNew: true },
            { id: 'shaft-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX, y1: cY - R, x2: 600, y2: cY - R, isNew: true },
            { id: 'shaft-r-b', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX, y1: cY + R, x2: 600, y2: cY + R, isNew: true },
            // Top Bolt
            { id: 'bolt-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX - flangeT - 8, y1: cY - pcdD / 2, x2: cX + flangeT + 8, y2: cY - pcdD / 2, isNew: true, isFinalResult: true },
            // Bottom Bolt
            { id: 'bolt-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: cX - flangeT - 8, y1: cY + pcdD / 2, x2: cX + flangeT + 8, y2: cY + pcdD / 2, isNew: true, isFinalResult: true },
            { id: 'lbl-title-fc', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: cX, cy: cY - flangeD / 2 - 35, label: 'PROTECTED FLANGED COUPLING ASSEMBLY - HALF SECTION' }
          ]
        }
      ];
    }
  }
];
