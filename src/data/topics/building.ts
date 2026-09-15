import { DrawingTopic } from '../../types/curriculum';

export const buildingTopics: DrawingTopic[] = [
  {
    id: 'ss3-building-floor-plan',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 1,
    moduleCode: 'TD-BLD-01',
    title: 'Building Floor Plan (2-Bedroom Bungalow & Wall Thickness)',
    shortDescription: 'Construct a complete architectural residential floor plan showing 225mm external sandcrete walls, 150mm partitions, door swings, window openings, and room dimensioning.',
    category: 'BUILDING_AND_ARCHITECTURAL',
    standards: {
      nerdcRef: 'Senior Secondary Technical Drawing SS3 Unit 1: Building Drawing & Floor Plans',
      waecRef: 'WAEC Technical Drawing Paper 2 Section B: Building Construction & Architectural Drafting',
      isoRef: 'ISO 128-23 / BS 1192: Architectural & Building Working Drawings'
    },
    theory: {
      overview: 'An architectural floor plan is a horizontal sectional view taken approximately 1.0m to 1.5m above finished floor level (FFL), looking downwards. It displays the arrangement of rooms, wall thicknesses, door swings, window openings, and horizontal circulation.',
      historyAndApplication: 'Residential architecture, municipal building permits, structural foundation alignment, plumbing & electrical services routing, and quantity surveying bill of quantities (BOQ).',
      waecAndNERDCNotes: 'External sandcrete load-bearing block walls are drawn at 225mm thickness; internal partition walls are drawn at 150mm thickness. Door swings must open at 90° with a thin compass arc indicating direction of clearance. Window openings use double thin parallel lines representing glazed sashes.',
      keyPrinciples: [
        {
          title: 'Sectional Cut Plane Height Principle',
          description: 'The horizontal cutting plane is positioned at 1.2m above floor level so it passes directly through all standard door and window openings.',
          keyRule: 'H_{cut} = 1200\\,\\text{mm to } 1500\\,\\text{mm above FFL}'
        },
        {
          title: 'Standard Architectural Wall Thicknesses',
          description: 'In West African building construction (NERDC/WAEC), standard hollow sandcrete blocks are 225mm (9-inch) for external load-bearing walls and 150mm (6-inch) for internal non-loadbearing partitions.',
          keyRule: 'W_{ext} = 225\\,\\text{mm}, \\quad W_{int} = 150\\,\\text{mm}'
        }
      ],
      formulas: [
        {
          latex: 'L_{overall} = \\sum W_{rooms} + \\sum T_{walls}',
          description: 'Overall building footprint calculation from clear room spans and wall thicknesses'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Cut masonry wall outlines and structural columns' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Door swing arcs, window sashes, dimension lines, and tiling grids' },
        { lineName: 'Thin Dashed', weightMm: '0.25mm', pencilGrade: '2H', application: 'Roof eaves overhang projection lines and high-level beams' }
      ]
    },
    parameters: [
      {
        id: 'livingWidth',
        label: 'Living Room Width',
        symbol: 'W_L',
        defaultValue: 220,
        min: 180,
        max: 260,
        step: 10,
        unit: 'mm',
        description: 'Scaled width of main living lounge'
      },
      {
        id: 'bedWidth',
        label: 'Master Bedroom Width',
        symbol: 'W_B',
        defaultValue: 180,
        min: 140,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Scaled width of master bedroom'
      },
      {
        id: 'wallThick',
        label: 'External Wall Thickness',
        symbol: 'T_w',
        defaultValue: 16,
        min: 12,
        max: 22,
        step: 2,
        unit: 'mm',
        description: 'Scaled masonry wall thickness (represents 225mm block)'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const W_L = params.livingWidth || 220;
      const W_B = params.bedWidth || 180;
      const Tw = params.wallThick || 16;
      const totalW = W_L + W_B + Tw * 3;
      const totalH = 320;

      const oX = 140;
      const oY = 140;

      const livingX = oX + Tw;
      const livingY = oY + Tw;
      const bedX = oX + W_L + Tw * 2;
      const bedY = oY + Tw;

      return [
        {
          stepIndex: 1,
          title: 'Establish Building Grid Lines and Centerline Layout',
          instruction: `Draw primary structural grid centerlines with 2H pencil. Mark total building envelope (${totalW} x ${totalH} mm) including Living Room (${W_L} mm) and Master Bedroom (${W_B} mm).`,
          detailedNotes: 'Grid lines serve as the reference datum for all structural measurements.',
          technicalPrinciple: 'Architectural modular grid planning.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: oX - 20,
            y: oY,
            targetX: oX + totalW + 20,
            targetY: oY,
            visible: true,
            actionText: 'Draw baseline centerlines and grid axes'
          },
          elements: [
            { id: 'grid-c-x1', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: oX - 20, y1: oY + totalH / 2, x2: oX + totalW + 20, y2: oY + totalH / 2, isNew: true },
            { id: 'grid-c-y1', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: oX + W_L / 2, y1: oY - 20, x2: oX + W_L / 2, y2: oY + totalH + 20, isNew: true },
            { id: 'grid-c-y2', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: bedX + W_B / 2, y1: oY - 20, x2: bedX + W_B / 2, y2: oY + totalH + 20, isNew: true },
            { id: 'lbl-grid-A', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: oX - 30, cy: oY + totalH / 2, label: 'GRID 1' },
            { id: 'lbl-grid-B', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: oX + W_L / 2, cy: oY - 30, label: 'GRID A' },
            { id: 'lbl-grid-C', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: bedX + W_B / 2, cy: oY - 30, label: 'GRID B' }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct External Masonry Walls (Thickness T = ${Tw} mm representing 225mm block)`,
          instruction: `Draw outer and inner wall boundary perimeters with continuous thick lines (HB pencil, 0.6mm). Offset internal wall face by ${Tw} mm.`,
          detailedNotes: 'WAEC criteria: Wall intersections must show clear unbroken masonry joins without stray crossing lines.',
          technicalPrinciple: 'Standard 225mm sandcrete external wall drafting.',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: oX,
            y: oY,
            targetX: oX + totalW,
            targetY: oY + totalH,
            visible: true,
            actionText: `Draw external wall boundaries (T = ${Tw}mm)`
          },
          elements: [
            // Outer envelope
            { id: 'wall-ext-out', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[oX, oY], [oX + totalW, oY], [oX + totalW, oY + totalH], [oX, oY + totalH]], isNew: true },
            // Living room inner
            { id: 'wall-living-in', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[livingX, livingY], [livingX + W_L, livingY], [livingX + W_L, livingY + totalH - Tw * 2], [livingX, livingY + totalH - Tw * 2]], isNew: true },
            // Bedroom inner
            { id: 'wall-bed-in', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[bedX, bedY], [bedX + W_B, bedY], [bedX + W_B, bedY + totalH - Tw * 2], [bedX, bedY + totalH - Tw * 2]], isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Insert Door Openings, 90° Door Swings, and Glazed Window Openings',
          instruction: 'Cut 900mm door openings in walls. Draw door leaves at 90° open with thin 2H quadrant swing arcs. Insert 1200mm window openings with double thin lines representing glazing.',
          detailedNotes: 'Door arc indicates the swing path and ensures doors do not clash with furniture.',
          technicalPrinciple: 'Architectural fenestration conventions (BS 1192).',
          activeInstrument: {
            toolType: 'COMPASS',
            x: livingX,
            y: livingY + 80,
            radius: 40,
            visible: true,
            actionText: 'Draw door swing arc and window glazing'
          },
          elements: [
            // Door D1 (Living room entrance)
            { id: 'door-leaf-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: livingX + 30, y1: livingY, x2: livingX + 30, y2: livingY + 40, isNew: true },
            { id: 'door-arc-1', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: livingX + 30, cy: livingY, r: 40, startAngle: 0, endAngle: 90, isNew: true },
            // Window W1 (Living room front)
            { id: 'win-w1-a', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: livingX + 80, y1: oY, x2: livingX + 160, y2: oY, isNew: true },
            { id: 'win-w1-b', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: livingX + 80, y1: oY + Tw, x2: livingX + 160, y2: oY + Tw, isNew: true },
            // Window W2 (Bedroom)
            { id: 'win-w2-a', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bedX + 40, y1: oY, x2: bedX + 120, y2: oY, isNew: true },
            { id: 'win-w2-b', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: bedX + 40, y1: oY + Tw, x2: bedX + 120, y2: oY + Tw, isNew: true },
            // Room Labels
            { id: 'lbl-living', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: livingX + W_L / 2, cy: livingY + 120, label: 'LIVING ROOM (4.8m x 3.6m)' },
            { id: 'lbl-bed', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: bedX + W_B / 2, cy: bedY + 120, label: 'BEDROOM 1 (3.6m x 3.6m)' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Apply Standard Architectural Dimensioning and Title Annotations',
          instruction: 'Dimension clear room internal spans, wall thicknesses, and overall building perimeter. Add North Arrow and Drawing Title.',
          detailedNotes: 'Three tiers of dimensioning: 1. Openings & wall segments, 2. Centerlines, 3. Overall building dimensions.',
          technicalPrinciple: 'Finished Building Floor Plan Working Drawing.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: oX,
            y: oY + totalH + 40,
            visible: true,
            actionText: 'Apply architectural dimensions and annotations'
          },
          elements: [
            { id: 'dim-total-w', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: oX, y1: oY + totalH + 35, x2: oX + totalW, y2: oY + totalH + 35, dimensionText: `${(totalW * 25).toFixed(0)} mm` },
            { id: 'dim-total-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: oX - 35, y1: oY, x2: oX - 35, y2: oY + totalH, dimensionText: `${(totalH * 25).toFixed(0)} mm` },
            { id: 'lbl-title-plan', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: oX + totalW / 2, cy: oY - 45, label: 'GROUND FLOOR PLAN - SCALE 1:50', isFinalResult: true },
            { id: 'lbl-north', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: oX + totalW + 40, cy: oY + 40, label: '▲ NORTH' }
          ]
        }
      ];
    }
  },
  {
    id: 'ss3-building-roof-truss',
    tier: 'SS3',
    term: 'TERM_2',
    termLabel: 'Second Term',
    week: 2,
    moduleCode: 'TD-BLD-02',
    title: 'Timber Roof Truss Details (King Post & Queen Post)',
    shortDescription: 'Construct an engineering detail of a standard King Post timber roof truss showing tie beam, principal rafters, struts, king post, wall plates, and joint gusset plates.',
    category: 'BUILDING_AND_ARCHITECTURAL',
    standards: {
      nerdcRef: 'Senior Secondary Technical Drawing SS3 Unit 2: Roof Structures & Trusses',
      waecRef: 'WAEC Technical Drawing Paper 2: Timber Roof Truss Construction & Jointing',
      isoRef: 'ISO 128 / BS 5268: Structural Timber Design & Working Details'
    },
    theory: {
      overview: 'A roof truss is a triangulated structural framework designed to bridge spans over buildings and support roof coverings (corrugated iron, aluminium, or tiles). The King Post truss is ideal for spans of 5.0m to 8.0m, utilizing a central vertical tensile member (King Post) to prevent tie-beam sagging.',
      historyAndApplication: 'Residential bungalow roofs, school assembly halls, warehouse canopies, and industrial sheds across Nigeria and West Africa.',
      waecAndNERDCNotes: 'Key timber members: Tie Beam (150x50mm), Principal Rafters (100x50mm), King Post (100x50mm), Struts (75x50mm), Purlins (75x50mm at 900mm centers), Wall Plate (100x75mm bedded on mortar).',
      keyPrinciples: [
        {
          title: 'Triangulation Structural Stability',
          description: 'Triangles are inherently rigid geometric shapes that cannot deform without breaking the member joints.',
          keyRule: 'Degrees of Freedom = 2j - m = 3 ⟹ Statically Determinant'
        },
        {
          title: 'Pitch Angle & Rain Drainage',
          description: 'Tropical roof pitch angles range from 25° to 35° to ensure rapid stormwater runoff during tropical downpours.',
          keyRule: 'θ_pitch = 30° ⟹ Height H = (Span / 2) · tan 30°'
        }
      ],
      formulas: [
        {
          latex: 'H_apex = (L_span / 2) × tan(θ_pitch)',
          description: 'Apex height of symmetrical pitched roof truss'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.6mm', pencilGrade: 'HB', application: 'Finished structural timber member profiles and tie beam' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Truss node centerlines, bolt circles, and dimensioning' }
      ]
    },
    parameters: [
      {
        id: 'spanLength',
        label: 'Clear Span (L)',
        symbol: 'L',
        defaultValue: 480,
        min: 360,
        max: 560,
        step: 20,
        unit: 'mm',
        description: 'Clear span between supporting load-bearing wall plates'
      },
      {
        id: 'pitchAngle',
        label: 'Roof Pitch Angle',
        symbol: 'θ',
        defaultValue: 30,
        min: 20,
        max: 40,
        step: 5,
        unit: 'deg',
        description: 'Pitch angle of principal rafters'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const L = params.spanLength || 480;
      const deg = params.pitchAngle || 30;
      const rad = (deg * Math.PI) / 180;
      const halfSpan = L / 2;
      const apexH = halfSpan * Math.tan(rad);

      const oX = (800 - L) / 2;
      const oY = 380; // Baseline of Tie Beam

      const leftX = oX;
      const rightX = oX + L;
      const apexX = oX + halfSpan;
      const apexY = oY - apexH;

      const beamThick = 18;
      const rafterThick = 14;

      // Midpoints for struts
      const leftMidX = (leftX + apexX) / 2;
      const leftMidY = (oY + apexY) / 2;
      const rightMidX = (rightX + apexX) / 2;
      const rightMidY = (oY + apexY) / 2;

      return [
        {
          stepIndex: 1,
          title: `Draw Supporting Sandcrete Walls, Wall Plates, and Main Tie Beam (Span = ${L} mm)`,
          instruction: `Draw supporting wall piers (225mm thick), 100x75mm wall plates, and horizontal Tie Beam of span ${L} mm with 2H pencil.`,
          detailedNotes: 'The tie beam carries the tensile load and ties the foot of the principal rafters together.',
          technicalPrinciple: 'Structural base tie beam layout.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: leftX - 40,
            y: oY,
            targetX: rightX + 40,
            targetY: oY,
            visible: true,
            actionText: `Draw tie beam of span ${L}mm`
          },
          elements: [
            // Supporting walls
            { id: 'wall-left', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[leftX - 30, oY + beamThick], [leftX, oY + beamThick], [leftX, oY + 120], [leftX - 30, oY + 120]], isNew: true },
            { id: 'wall-right', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[rightX, oY + beamThick], [rightX + 30, oY + beamThick], [rightX + 30, oY + 120], [rightX, oY + 120]], isNew: true },
            // Wall plates
            { id: 'plate-left', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[leftX - 25, oY], [leftX, oY], [leftX, oY + beamThick], [leftX - 25, oY + beamThick]], isNew: true },
            { id: 'plate-right', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[rightX, oY], [rightX + 25, oY], [rightX + 25, oY + beamThick], [rightX, oY + beamThick]], isNew: true },
            // Tie beam
            { id: 'tie-beam', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[leftX - 40, oY], [rightX + 40, oY], [rightX + 40, oY + beamThick], [leftX - 40, oY + beamThick]], isNew: true },
            { id: 'lbl-tie-beam', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: apexX, cy: oY + beamThick + 20, label: 'TIE BEAM (150 x 50mm)' }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct Principal Rafters at ${deg}° Pitch Angle to Apex O`,
          instruction: `From wall plates, construct Principal Rafters inclined at ${deg}° meeting at apex O (height H = ${(apexH).toFixed(1)} mm). Extend overhang for eaves.`,
          detailedNotes: 'Principal rafters carry the compressive load from the roof covering to the walls.',
          technicalPrinciple: 'Truss rafter geometry: H = (Span/2) * tan(θ).',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: leftX,
            y: oY,
            targetX: apexX,
            targetY: apexY,
            visible: true,
            actionText: `Set principal rafters at ${deg}° pitch`
          },
          elements: [
            { id: 'rafter-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: leftX - 45, y1: oY + 25, x2: apexX, y2: apexY, isNew: true },
            { id: 'rafter-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: rightX + 45, y1: oY + 25, x2: apexX, y2: apexY, isNew: true },
            { id: 'rafter-left-in', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: leftX, y1: oY, x2: apexX, y2: apexY + rafterThick, isNew: true },
            { id: 'rafter-right-in', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: rightX, y1: oY, x2: apexX, y2: apexY + rafterThick, isNew: true },
            { id: 'pt-apex', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: apexX, cy: apexY, label: 'APEX (Ridge)', labelPosition: 'top' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Insert Central King Post and Diagonal Struts',
          instruction: 'Construct vertical King Post (100x50mm) connecting apex to center of tie beam. Draw diagonal struts (75x50mm) bracing the rafters against buckling.',
          detailedNotes: 'Struts form sub-triangles that prevent long principal rafters from sagging under heavy wind or roofing tile loads.',
          technicalPrinciple: 'Internal triangulation web members.',
          activeInstrument: {
            toolType: 'SET_SQUARE_45',
            x: apexX,
            y: oY,
            targetX: leftMidX,
            targetY: leftMidY,
            visible: true,
            actionText: 'Draw King Post and diagonal bracing struts'
          },
          elements: [
            // King Post
            { id: 'king-post-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: apexX - 6, y1: apexY + rafterThick, x2: apexX - 6, y2: oY, isNew: true },
            { id: 'king-post-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: apexX + 6, y1: apexY + rafterThick, x2: apexX + 6, y2: oY, isNew: true },
            // Left Strut
            { id: 'strut-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: apexX - 6, y1: oY - 20, x2: leftMidX, y2: leftMidY + 10, isNew: true },
            // Right Strut
            { id: 'strut-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: apexX + 6, y1: oY - 20, x2: rightMidX, y2: rightMidY + 10, isNew: true },
            // Labels
            { id: 'lbl-kp', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: apexX + 50, cy: (apexY + oY) / 2, label: 'KING POST (100 x 50mm)' },
            { id: 'lbl-strut', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: leftMidX - 40, cy: leftMidY + 30, label: 'STRUT (75 x 50mm)' }
          ]
        },
        {
          stepIndex: 4,
          title: 'Complete Roof Truss Assembly with Purlins, Fascia Board, and Ridge Details',
          instruction: 'Add 75x50mm purlins at rafter nodes, 25mm fascia board at eaves, ridge cap, and full dimensional annotations.',
          detailedNotes: 'Accredited WAEC Drawing Sheet standard for technical college and senior secondary students.',
          technicalPrinciple: 'Complete King Post Timber Roof Truss Detail.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: apexX,
            y: apexY,
            visible: true,
            actionText: 'Add purlins, fascia, and structural callouts'
          },
          elements: [
            // Purlins (small rectangles along rafters)
            { id: 'purlin-1', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[leftMidX - 8, leftMidY - 14], [leftMidX + 8, leftMidY - 14], [leftMidX + 8, leftMidY], [leftMidX - 8, leftMidY]], isNew: true },
            { id: 'purlin-2', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[rightMidX - 8, rightMidY - 14], [rightMidX + 8, rightMidY - 14], [rightMidX + 8, rightMidY], [rightMidX - 8, rightMidY]], isNew: true },
            // Ridge board
            { id: 'purlin-ridge', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[apexX - 8, apexY - 18], [apexX + 8, apexY - 18], [apexX + 8, apexY], [apexX - 8, apexY]], isNew: true },
            // Dimension span
            { id: 'dim-span', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: leftX, y1: oY + 70, x2: rightX, y2: oY + 70, dimensionText: `CLEAR SPAN = ${(L * 15).toFixed(0)} mm` },
            { id: 'lbl-title-truss', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: apexX, cy: apexY - 40, label: 'KING POST TIMBER ROOF TRUSS - SCALE 1:25', isFinalResult: true }
          ]
        }
      ];
    }
  }
];
