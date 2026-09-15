import { DrawingTopic } from '../../types/curriculum';

export const higherTopics: DrawingTopic[] = [
  {
    id: 'higher-surface-dev-parallel',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-HE-MOD01',
    title: 'Parallel Line Surface Development (Truncated Hexagonal Prism & Cylinder)',
    shortDescription: 'Construct the complete flat pattern sheet-metal stretch-out development of a truncated vertical hexagonal prism using parallel-line projection.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'Higher Education Engineering Graphics Unit 1: Surface Development',
      waecRef: 'Advanced Technical Drawing: Parallel Line Development',
      isoRef: 'ISO 128: Technical Drawings - Sheet Metal Pattern Unfolding'
    },
    theory: {
      overview: 'Surface development involves unrolling or unfolding all outer faces of a 3D hollow object onto a single flat 2D plane. In parallel line development (used for prisms and cylinders), all lateral fold lines / generators are parallel to one another and perpendicular to the base stretch-out line.',
      historyAndApplication: 'HVAC ductwork manufacturing, sheet metal fabrication, automotive exhaust shrouds, aircraft fuselage skin panels, and structural steel column cladding.',
      waecAndNERDCNotes: 'The total stretch-out baseline length equals the exact perimeter of the base: L = 6 * S (for hexagon) or L = pi * D (for cylinder). Project horizontal heights directly from the elevation onto the corresponding generator lines.',
      keyPrinciples: [
        {
          title: 'Stretch-Out Line Perimeter Principle',
          description: 'The baseline of the development equals the true unrolled perimeter of the base polygon or circle.',
          keyRule: 'L_{stretch} = \\sum_{i=1}^n S_i = n \\times S'
        },
        {
          title: 'Parallel Generator Height Projection',
          description: 'Because generators are parallel to the vertical axis, their true lengths appear directly in the Front Elevation and project horizontally to the development.',
          keyRule: 'y_{dev}(k) = y_{elevation}(k)'
        }
      ],
      formulas: [
        {
          latex: 'L_{stretch} = 6S, \\quad h_k = H - k \\cdot \\Delta h',
          description: 'Perimeter stretch-out and generator height truncation formula'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished outer cut boundary of sheet metal development' },
        { lineName: 'Thin Dashed Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Internal bend/fold lines' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Horizontal generator projection lines and baseline divisions' }
      ]
    },
    parameters: [
      {
        id: 'sideLength',
        label: 'Hexagon Side (S)',
        symbol: 'S',
        defaultValue: 45,
        min: 30,
        max: 65,
        step: 5,
        unit: 'mm',
        description: 'Length of each hexagonal side'
      },
      {
        id: 'height',
        label: 'Prism Height (H)',
        symbol: 'H',
        defaultValue: 160,
        min: 120,
        max: 200,
        step: 10,
        unit: 'mm',
        description: 'Total vertical height of uncut prism'
      },
      {
        id: 'truncAngle',
        label: 'Truncation Angle',
        symbol: 'θ',
        defaultValue: 30,
        min: 20,
        max: 45,
        step: 5,
        unit: 'deg',
        description: 'Angle of top truncation cut to horizontal'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const S = params.sideLength || 45;
      const H = params.height || 160;
      const deg = params.truncAngle || 30;
      const rad = (deg * Math.PI) / 180;

      const stretchL = 6 * S;

      // Front Elevation Position (Left):
      const eX = 140;
      const eBaseY = 400;
      const eTopY = eBaseY - H;
      const widthElev = 2 * S;

      // Heights at generator stations 1 to 6 across prism front elevation:
      // station 1: leftmost edge, station 4: rightmost edge
      const h1 = H - widthElev * Math.tan(rad);
      const h4 = H;

      // Development Stretch-out Position (Right):
      const devX0 = 340;
      const devYBase = eBaseY;

      // Points on development top contour:
      const devTopPts: [number, number][] = [];
      const stationHeights: number[] = [
        H - widthElev * Math.tan(rad), // 1
        H - 1.5 * S * Math.tan(rad),   // 2
        H - 0.5 * S * Math.tan(rad),   // 3
        H,                             // 4
        H - 0.5 * S * Math.tan(rad),   // 5
        H - 1.5 * S * Math.tan(rad),   // 6
        H - widthElev * Math.tan(rad)  // 1 (closing seam)
      ];

      for (let i = 0; i <= 6; i++) {
        devTopPts.push([devX0 + i * S, devYBase - stationHeights[i]]);
      }

      const devPoly: [number, number][] = [
        [devX0, devYBase],
        [devX0 + stretchL, devYBase],
        ...[...devTopPts].reverse()
      ];

      return [
        {
          stepIndex: 1,
          title: 'Draw the Front Elevation and Plan of Truncated Hexagonal Prism',
          instruction: `Draw Plan regular hexagon (side S = ${S} mm). Draw Front Elevation of height H = ${H} mm with inclined truncation cutting plane at ${deg}°.`,
          detailedNotes: 'Number the vertical generator edges 1, 2, 3, 4, 5, 6.',
          technicalPrinciple: 'Given orthographic views with numbered generator edges.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: eX - 20,
            y: eBaseY,
            targetX: eX + widthElev + 20,
            targetY: eBaseY,
            visible: true,
            actionText: 'Draw Front Elevation with inclined cut'
          },
          elements: [
            { id: 'elev-base', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX, y1: eBaseY, x2: eX + widthElev, y2: eBaseY, isNew: true },
            { id: 'elev-left', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX, y1: eBaseY, x2: eX, y2: eBaseY - stationHeights[0], isNew: true },
            { id: 'elev-right', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX + widthElev, y1: eBaseY, x2: eX + widthElev, y2: eBaseY - stationHeights[3], isNew: true },
            { id: 'elev-cut-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: eX, y1: eBaseY - stationHeights[0], x2: eX + widthElev, y2: eBaseY - stationHeights[3], isNew: true },
            { id: 'lbl-elev', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: eX + S, cy: eBaseY + 25, label: 'FRONT ELEVATION' }
          ]
        },
        {
          stepIndex: 2,
          title: `Draw the Stretch-Out Baseline (Length L = 6 x ${S} = ${stretchL} mm)`,
          instruction: `Extend the base line horizontally to the right. Measure total stretch-out perimeter length L = ${stretchL} mm and divide into 6 equal panels of side ${S} mm (labeled 1, 2, 3, 4, 5, 6, 1).`,
          detailedNotes: 'Each panel represents one planar face of the hexagonal prism.',
          technicalPrinciple: 'Stretch-out baseline calculation: L = 6 * S.',
          activeInstrument: {
            toolType: 'RULER',
            x: devX0,
            y: devYBase,
            targetX: devX0 + stretchL,
            targetY: devYBase,
            visible: true,
            actionText: `Measure stretch-out baseline = ${stretchL}mm`
          },
          elements: [
            { id: 'dev-baseline', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: devX0, y1: devYBase, x2: devX0 + stretchL, y2: devYBase, isNew: true },
            ...Array.from({ length: 7 }).map((_, i) => ({
              id: `pt-panel-${i}`,
              type: 'POINT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              cx: devX0 + i * S,
              cy: devYBase,
              label: i === 6 ? '1' : `${i + 1}`,
              labelPosition: 'bottom' as const,
              isNew: true
            })),
            { id: 'dim-stretch', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: devX0, y1: devYBase + 35, x2: devX0 + stretchL, y2: devYBase + 35, dimensionText: `L = 6 x ${S} = ${stretchL} mm` }
          ]
        },
        {
          stepIndex: 3,
          title: 'Project Horizontal Generator Heights from Elevation to Development',
          instruction: 'From each generator intersection point on the cut surface of the Front Elevation, project horizontal lines across to the corresponding numbered generator lines on the development.',
          detailedNotes: 'Line 1 projects to generators 1 (left) and 1 (closing seam on right).',
          technicalPrinciple: 'Parallel horizontal projection theorem.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: eX + widthElev,
            y: eBaseY - stationHeights[3],
            targetX: devX0 + stretchL,
            targetY: eBaseY - stationHeights[3],
            visible: true,
            actionText: 'Project horizontal generator height rays'
          },
          elements: [
            { id: 'dev-baseline', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: devX0, y1: devYBase, x2: devX0 + stretchL, y2: devYBase },
            ...stationHeights.map((h, i) => ({
              id: `proj-gen-${i}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THIN_CONTINUOUS' as const,
              x1: eX + widthElev,
              y1: eBaseY - h,
              x2: devX0 + i * S,
              y2: devYBase - h,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 4,
          title: 'Draw the Complete Unfolded Sheet Metal Pattern Outline',
          instruction: 'Join all top profile points with thick continuous lines for the outer perimeter and thin dashed lines for the internal bend/fold lines.',
          detailedNotes: 'The development pattern is ready for sheet metal cutting and press-brake bending.',
          technicalPrinciple: 'Finished Parallel Line Surface Development.',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: devX0,
            y: devYBase,
            visible: true,
            actionText: 'Trace finished pattern perimeter and fold lines'
          },
          elements: [
            { id: 'poly-dev', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: devPoly, isNew: true, isFinalResult: true },
            ...Array.from({ length: 5 }).map((_, i) => ({
              id: `fold-line-${i + 1}`,
              type: 'SEGMENT' as const,
              lineWeight: 'THIN_DASHED' as const,
              x1: devX0 + (i + 1) * S,
              y1: devYBase,
              x2: devX0 + (i + 1) * S,
              y2: devYBase - stationHeights[i + 1],
              isNew: true
            })),
            { id: 'lbl-dev-title', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: devX0 + stretchL / 2, cy: eTopY - 20, label: 'COMPLETE SURFACE DEVELOPMENT (STRETCH-OUT)' }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-surface-dev-radial',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-HE-MOD02',
    title: 'Radial Line Surface Development (Truncated Right Cone & Pyramid)',
    shortDescription: 'Construct the radial sector development of a truncated right circular cone using true slant height (generator R) and true angle theta = (r / R) * 360°.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'Higher Education Engineering Graphics Unit 1: Radial Developments',
      waecRef: 'Advanced Technical Drawing: Conical Developments',
      isoRef: 'ISO 128-50: Sheet Metal Cone Fabrication'
    },
    theory: {
      overview: 'Radial line development is employed for solids having a single apex vertex (pyramids and cones). All generator lines radiate from apex O. The developed pattern forms a circular sector of radius equal to the True Slant Height (R) and included sector angle theta = (r / R) * 360°.',
      historyAndApplication: 'Conical hoppers, cyclone dust collectors, chimney reducer transitions, rocket motor nozzles, and industrial funnels.',
      waecAndNERDCNotes: 'All truncated cut points must be rotated horizontally to the true slant edge in the elevation before stepping off along the radial rays in the development pattern.',
      keyPrinciples: [
        {
          title: 'Radial Sector Angle Equation',
          description: 'The included angle theta of the developed sector depends strictly on the ratio of base radius r to true slant height R.',
          keyRule: 'θ = (r / R) × 360°'
        },
        {
          title: 'True Slant Length Rotation',
          description: 'Cut distances from apex O must be measured along the extreme true contour generator.',
          keyRule: 'R_true = √(H² + r²)'
        }
      ],
      formulas: [
        {
          latex: 'R = √(H² + r²),   θ = (r / R) × 360° = (D / 2R) × 360°',
          description: 'True slant height and sector angle formula'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished outer boundary curves of conical sheet metal pattern' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Radial generator rays and sector angle subtension' }
      ]
    },
    parameters: [
      {
        id: 'baseDia',
        label: 'Base Diameter (D)',
        symbol: 'D',
        defaultValue: 100,
        min: 70,
        max: 140,
        step: 5,
        unit: 'mm',
        description: 'Base diameter of right cone'
      },
      {
        id: 'coneHeight',
        label: 'Cone Height (H)',
        symbol: 'H',
        defaultValue: 150,
        min: 100,
        max: 200,
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
      const D = params.baseDia || 100;
      const r = D / 2;
      const H = params.coneHeight || 150;

      // True slant height R:
      const R = Math.sqrt(H * H + r * r);
      // Sector angle theta in degrees:
      const thetaDeg = (r / R) * 360;
      const thetaRad = (thetaDeg * Math.PI) / 180;

      // Elevation Position (Left):
      const eApexX = 200;
      const eApexY = 180;
      const eBaseY = eApexY + H;

      // Development Apex Position (Right):
      const devApexX = 520;
      const devApexY = 180;

      // Angles for sector arc in SVG space (start from 90 deg down, sweeping clockwise by thetaDeg):
      const startAngle = 90 - thetaDeg / 2;
      const endAngle = 90 + thetaDeg / 2;

      const p1x = devApexX + R * Math.cos((startAngle * Math.PI) / 180);
      const p1y = devApexY + R * Math.sin((startAngle * Math.PI) / 180);

      const p2x = devApexX + R * Math.cos((endAngle * Math.PI) / 180);
      const p2y = devApexY + R * Math.sin((endAngle * Math.PI) / 180);

      return [
        {
          stepIndex: 1,
          title: 'Draw the Front Elevation and Plan of the Right Cone',
          instruction: `Draw Plan circle (diameter D = ${D} mm) and Front Elevation triangle with apex O and base diameter ${D} mm. Measure True Slant Height R = ${(R).toFixed(1)} mm.`,
          detailedNotes: 'The extreme outer generator lines O-A and O-B in elevation represent True Slant Height R.',
          technicalPrinciple: 'Right cone geometry: R = sqrt(H^2 + r^2).',
          activeInstrument: {
            toolType: 'RULER',
            x: eApexX,
            y: eApexY,
            targetX: eApexX - r,
            targetY: eBaseY,
            visible: true,
            actionText: `Draw cone elevation (Slant R = ${(R).toFixed(1)}mm)`
          },
          elements: [
            { id: 'cone-elev', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[eApexX, eApexY], [eApexX + r, eBaseY], [eApexX - r, eBaseY]], isNew: true },
            { id: 'cone-axis', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: eApexX, y1: eApexY - 15, x2: eApexX, y2: eBaseY + 25, isNew: true },
            { id: 'pt-apex-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: eApexX, cy: eApexY, label: 'O (Apex)', labelPosition: 'top' },
            { id: 'dim-R', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: eApexX + 15, y1: eApexY, x2: eApexX + r + 15, y2: eBaseY, dimensionText: `R = ${(R).toFixed(1)} mm` }
          ]
        },
        {
          stepIndex: 2,
          title: `Calculate Sector Included Angle θ = (r / R) x 360° = ${(thetaDeg).toFixed(1)}°`,
          instruction: `Calculate included angle θ = (${r} / ${(R).toFixed(1)}) x 360° = ${(thetaDeg).toFixed(1)}°. Set apex O for development pattern.`,
          detailedNotes: 'The unrolled arc length equals the complete circumference of the base circle: C = pi * D.',
          technicalPrinciple: 'Sector angle equation: θ = (r/R) * 360°.',
          activeInstrument: {
            toolType: 'PROTRACTOR',
            x: devApexX,
            y: devApexY,
            visible: true,
            actionText: `Measure sector angle θ = ${(thetaDeg).toFixed(1)}°`
          },
          elements: [
            { id: 'pt-dev-O', type: 'POINT', lineWeight: 'THICK_CONTINUOUS', cx: devApexX, cy: devApexY, label: "O' (Development Apex)", labelPosition: 'top', isNew: true },
            { id: 'lbl-calc-theta', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: devApexX, cy: devApexY - 25, label: `θ = (r/R) x 360° = ${(thetaDeg).toFixed(1)}°` }
          ]
        },
        {
          stepIndex: 3,
          title: `Draw the Outer Sector Arc with Radius R = ${(R).toFixed(1)} mm`,
          instruction: `With center O' and compass radius R = ${(R).toFixed(1)} mm, swing the main sector arc subtending angle θ = ${(thetaDeg).toFixed(1)}°.`,
          detailedNotes: 'Divide the sector into 12 equal sub-generator rays corresponding to the 12 divisions of the plan circle.',
          technicalPrinciple: 'Radial generator subdivision.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: devApexX,
            y: devApexY,
            radius: R,
            visible: true,
            actionText: `Draw sector arc of radius R = ${(R).toFixed(1)}mm`
          },
          elements: [
            { id: 'ray-dev-1', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: p1x, y2: p1y, isNew: true },
            { id: 'ray-dev-2', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: devApexX, y1: devApexY, x2: p2x, y2: p2y, isNew: true },
            { id: 'arc-sector-bot', type: 'ARC', lineWeight: 'THICK_CONTINUOUS', cx: devApexX, cy: devApexY, r: R, startAngle: startAngle, endAngle: endAngle, isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-surface-dev-triangulation',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-HE-MOD03',
    title: 'Triangulation Development for Transition Pieces (Square-to-Round Duct)',
    shortDescription: 'Construct the flat sheet metal development of a square-to-round HVAC transition duct hopper using true length right-triangle diagrams.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'Higher Education Engineering Graphics Unit 2: Transition Pieces',
      waecRef: 'Advanced Technical Drawing: Triangulation Methods',
      isoRef: 'ISO 128: Heavy Ductwork Transition Developments'
    },
    theory: {
      overview: 'Transition pieces connect air ducts or pipes of differing cross-sectional shapes (such as square duct to round fan outlet). Because the surface is non-cylindrical and non-conical, it is divided into a series of small planar triangles whose true lengths are determined using true length elevation triangles.',
      historyAndApplication: 'Industrial ventilation ducting, grain elevator discharge hoppers, cement chutes, and boiler breeching connections.',
      waecAndNERDCNotes: 'Construct a True Length (TL) diagram using vertical height H as the perpendicular leg and plan distances as the base leg: TL = sqrt(H^2 + L_plan^2).',
      keyPrinciples: [
        {
          title: 'Triangulation True Length Right Triangle',
          description: 'Every seam length in space forms the hypotenuse of a right triangle with vertical height H.',
          keyRule: 'TL = \\sqrt{H^2 + (\\Delta x)^2 + (\\Delta y)^2}'
        }
      ],
      formulas: [
        {
          latex: 'TL_{1A} = \\sqrt{H^2 + (x_1 - x_A)^2 + (y_1 - y_A)^2}',
          description: 'True length of transition seam generator'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished outer transition development outline' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Internal triangulation construction lines and TL diagram' }
      ]
    },
    parameters: [
      {
        id: 'squareSide',
        label: 'Square Base Side (S)',
        symbol: 'S',
        defaultValue: 140,
        min: 100,
        max: 180,
        step: 10,
        unit: 'mm',
        description: 'Bottom square duct side'
      },
      {
        id: 'topDia',
        label: 'Top Round Diameter (D)',
        symbol: 'D',
        defaultValue: 90,
        min: 60,
        max: 120,
        step: 5,
        unit: 'mm',
        description: 'Top round duct diameter'
      },
      {
        id: 'height',
        label: 'Transition Height (H)',
        symbol: 'H',
        defaultValue: 120,
        min: 80,
        max: 160,
        step: 10,
        unit: 'mm',
        description: 'Vertical height between square base and round top'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const S = params.squareSide || 140;
      const D = params.topDia || 90;
      const H = params.height || 120;

      // Plan View layout (Centered at X: 220, Y: 360)
      const pX = 220;
      const pY = 360;

      // Square corners:
      const sqPts: [number, number][] = [
        [pX - S / 2, pY + S / 2], // A (bottom-left)
        [pX + S / 2, pY + S / 2], // B (bottom-right)
        [pX + S / 2, pY - S / 2], // C (top-right)
        [pX - S / 2, pY - S / 2]  // D (top-left)
      ];

      // True Length Diagram layout (Right side X: 480, Y: 360)
      const tlX = 480;
      const tlY = 360;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Plan View of Square Base and Concentric Top Circle',
          instruction: `Draw square base (${S} x ${S} mm) labeled A, B, C, D and concentric top circle (diameter D = ${D} mm). Divide circle into 12 equal parts (1 to 12).`,
          detailedNotes: 'Connect square corner A to circle points 1, 2, 3, 4; corner B to 4, 5, 6, 7, etc.',
          technicalPrinciple: 'Plan layout of transition surface triangulation grid.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: pX,
            y: pY,
            radius: D / 2,
            visible: true,
            actionText: `Draw concentric top circle (D = ${D}mm)`
          },
          elements: [
            { id: 'plan-square', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: sqPts, isNew: true },
            { id: 'plan-circle', type: 'CIRCLE', lineWeight: 'THICK_CONTINUOUS', cx: pX, cy: pY, r: D / 2, isNew: true },
            { id: 'line-tri-A1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: sqPts[0][0], y1: sqPts[0][1], x2: pX, y2: pY + D / 2, isNew: true },
            { id: 'line-tri-A2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: sqPts[0][0], y1: sqPts[0][1], x2: pX - D / 2, y2: pY, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: `Construct the True Length (TL) Right-Triangle Diagram (Height H = ${H} mm)`,
          instruction: `Draw vertical line equal to height H = ${H} mm. Step off plan distances along the base horizontal line to establish the true spatial lengths of all seam lines.`,
          detailedNotes: 'Hypotenuse of each triangle gives the exact True Length (TL) for sheet metal layout.',
          technicalPrinciple: 'True Length Diagram: TL = sqrt(H^2 + d_plan^2).',
          activeInstrument: {
            toolType: 'SET_SQUARE_30_60',
            x: tlX,
            y: tlY,
            visible: true,
            actionText: `Construct True Length diagram (H = ${H}mm)`
          },
          elements: [
            { id: 'tl-vert', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: tlX, y1: tlY, x2: tlX, y2: tlY - H, isNew: true },
            { id: 'tl-horiz', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: tlX, y1: tlY, x2: tlX + 160, y2: tlY, isNew: true },
            { id: 'tl-hypot-1', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tlX, y1: tlY - H, x2: tlX + 90, y2: tlY, isNew: true },
            { id: 'tl-hypot-2', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: tlX, y1: tlY - H, x2: tlX + 140, y2: tlY, isNew: true },
            { id: 'lbl-TL', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: tlX + 70, cy: tlY - H / 2, label: 'TRUE LENGTHS' }
          ]
        },
        {
          stepIndex: 3,
          title: 'Lay Out Successive Triangles to Form the Unfolded Half-Pattern',
          instruction: 'Using compass radii from the TL diagram, strike intersecting arcs to construct adjacent triangles A-1-2, A-2-3, A-B-4 to complete the flat development.',
          detailedNotes: 'The smooth curve along the top connects all circle generator points seamlessly.',
          technicalPrinciple: 'Complete Triangulation Surface Development.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: tlX + 100,
            y: tlY,
            radius: 100,
            visible: true,
            actionText: 'Lay out triangulated development pattern'
          },
          elements: [
            { id: 'lbl-dev-complete', type: 'TEXT_LABEL', lineWeight: 'THICK_CONTINUOUS', cx: 400, cy: 140, label: 'SQUARE-TO-ROUND TRANSITION PATTERN (TRIANGULATION)', isNew: true, isFinalResult: true }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-interpenetration-solids',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-HE-MOD04',
    title: 'Interpenetration of Two Dissimilar Cylinders (Perpendicular Axes)',
    shortDescription: 'Construct the exact mathematical curve of intersection between two intersecting hollow cylinders of unequal diameters using generator and cutting plane methods.',
    category: 'DEVELOPMENTS_AND_INTERPENETRATION',
    standards: {
      nerdcRef: 'Higher Education Engineering Graphics Unit 3: Interpenetration of Solids',
      waecRef: 'Advanced Technical Drawing: Curves of Intersection',
      isoRef: 'ISO 128-50: Intersection Curves in Pressure Piping'
    },
    theory: {
      overview: 'When two cylinders penetrate each other, their line of intersection forms a 3D space curve. In standard orthographic views, this curve is plotted point-by-point using auxiliary cutting planes or 12 generator lines.',
      historyAndApplication: 'Tee pipe junctions in oil & gas pipelines, hydraulic manifold ports, boiler shell nozzles, and motorcycle exhaust header collector pipes.',
      waecAndNERDCNotes: 'Divide small penetrating cylinder in Plan into 12 parts; project horizontal generators into Front Elevation to cut corresponding generator lines of the main vertical cylinder.',
      keyPrinciples: [
        {
          title: 'Cutting Plane Locus Theorem',
          description: 'A horizontal cutting plane through both cylinders cuts straight parallel generators from both bodies whose intersections establish points on the intersection curve.',
          keyRule: 'P_{intersect} = G_{vert} \\cap G_{horiz}'
        }
      ],
      formulas: [
        {
          latex: 'x^2 + y^2 = R_1^2, \\quad y^2 + z^2 = R_2^2 \\implies z(x) = \\pm \\sqrt{R_2^2 - (R_1^2 - x^2)}',
          description: 'Equation of intersection curve between perpendicular cylinders'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Finished curve of intersection and visible cylinder outlines' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Generator projection lines and auxiliary semicircles' }
      ]
    },
    parameters: [
      {
        id: 'mainDia',
        label: 'Main Vertical Cylinder (D1)',
        symbol: 'D1',
        defaultValue: 130,
        min: 90,
        max: 170,
        step: 5,
        unit: 'mm',
        description: 'Diameter of main vertical cylinder'
      },
      {
        id: 'branchDia',
        label: 'Branch Horizontal Cylinder (D2)',
        symbol: 'D2',
        defaultValue: 80,
        min: 50,
        max: 110,
        step: 5,
        unit: 'mm',
        description: 'Diameter of intersecting branch cylinder'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D1 = params.mainDia || 130;
      const D2 = Math.min(D1 - 10, params.branchDia || 80);
      const R1 = D1 / 2;
      const R2 = D2 / 2;

      const fX = 300; // Centerline of vertical cylinder
      const fY = 320; // Centerline of branch cylinder

      // Intersection points along horizontal penetration:
      // Angles for 6 generator stations from -R2 to +R2:
      const N = 8;
      const interPts: [number, number][] = [];

      for (let i = 0; i <= N; i++) {
        const phi = (i * Math.PI) / N; // 0 to PI
        const dy = R2 * Math.cos(phi);
        // Distance from centerline to vertical cylinder surface at height dy:
        // x_surface = sqrt(R1^2 - dy^2)
        const dx = Math.sqrt(Math.max(0, R1 * R1 - dy * dy));
        interPts.push([fX + dx, fY - dy]);
      }

      return [
        {
          stepIndex: 1,
          title: 'Draw the Outlines of Main Vertical Cylinder and Branch Cylinder',
          instruction: `Draw main vertical cylinder (diameter D1 = ${D1} mm) and penetrating horizontal branch cylinder (diameter D2 = ${D2} mm) intersecting at centerlines.`,
          detailedNotes: 'Draw centerlines with 2H chain lines.',
          technicalPrinciple: 'Base intersecting cylinder geometry.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: fX - R1 - 20,
            y: fY - R2,
            targetX: fX + R1 + 140,
            targetY: fY - R2,
            visible: true,
            actionText: 'Draw cylinder outlines'
          },
          elements: [
            { id: 'cyl-vert-l', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: fX - R1, y1: fY - 140, x2: fX - R1, y2: fY + 140, isNew: true },
            { id: 'cyl-vert-r', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: fX + R1, y1: fY - 140, x2: fX + R1, y2: fY - R2, isNew: true },
            { id: 'cyl-vert-r-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: fX + R1, y1: fY + R2, x2: fX + R1, y2: fY + 140, isNew: true },
            { id: 'cyl-horiz-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: fX + R1 + 120, y1: fY - R2, x2: fX + R1, y2: fY - R2, isNew: true },
            { id: 'cyl-horiz-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: fX + R1 + 120, y1: fY + R2, x2: fX + R1, y2: fY + R2, isNew: true },
            { id: 'axis-vert', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: fX, y1: fY - 160, x2: fX, y2: fY + 160, isNew: true },
            { id: 'axis-horiz', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: fX - R1 - 30, y1: fY, x2: fX + R1 + 140, y2: fY, isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: 'Project Generators from Auxiliary End View of Branch Cylinder',
          instruction: `Draw auxiliary semicircle of diameter D2 = ${D2} mm on the end of the branch cylinder. Divide into equal parts to generate horizontal generator rays.`,
          detailedNotes: 'Each generator line represents a specific height level across the cylinder.',
          technicalPrinciple: 'Auxiliary generator projection.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: fX + R1 + 120,
            y: fY,
            radius: R2,
            visible: true,
            actionText: `Draw auxiliary semicircle (D2 = ${D2}mm)`
          },
          elements: [
            { id: 'aux-semicircle', type: 'ARC', lineWeight: 'THIN_CONTINUOUS', cx: fX + R1 + 120, cy: fY, r: R2, startAngle: -90, endAngle: 90, isNew: true },
            ...interPts.map((pt, idx) => ({
              id: `pt-inter-${idx}`,
              type: 'POINT' as const,
              lineWeight: 'THICK_CONTINUOUS' as const,
              cx: pt[0],
              cy: pt[1],
              label: `P${idx}`,
              labelPosition: 'right' as const,
              isNew: true
            }))
          ]
        },
        {
          stepIndex: 3,
          title: 'Plot and Draw the True Curve of Intersection',
          instruction: 'Connect intersection points P0 through P8 with a smooth continuous thick line using a French curve (HB pencil).',
          detailedNotes: 'The resulting curve is an exact mathematical intersection profile.',
          technicalPrinciple: 'Finished Curve of Intersection (ISO 128-50).',
          activeInstrument: {
            toolType: 'PENCIL_HB',
            x: interPts[0][0],
            y: interPts[0][1],
            visible: true,
            actionText: 'Trace finished curve of intersection'
          },
          elements: [
            { id: 'poly-inter-curve', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: interPts, isNew: true, isFinalResult: true },
            { id: 'lbl-curve-title', type: 'TEXT_LABEL', lineWeight: 'THIN_CONTINUOUS', cx: fX + R1 + 20, cy: fY - R2 - 20, label: 'CURVE OF INTERPENETRATION' }
          ]
        }
      ];
    }
  },
  {
    id: 'higher-machine-threads-fasteners',
    tier: 'HIGHER_INSTITUTION',
    moduleCode: 'TD-HE-MOD05',
    title: 'ISO Metric Screw Threads, Hexagonal Bolts & Nuts Assembly',
    shortDescription: 'Construct standard ISO metric hexagonal bolt and nut assembly with true 30° chamfer arcs, root and crest diameters, and standard thread representations.',
    category: 'FASTENERS_AND_ASSEMBLY',
    standards: {
      nerdcRef: 'Higher Education Mechanical Engineering Graphics Unit 4: Fasteners',
      waecRef: 'Advanced Technical Drawing: Engineering Fasteners',
      isoRef: 'ISO 6410-1: Technical Product Documentation - Screw Threads'
    },
    theory: {
      overview: 'Threaded fasteners are fundamental standardized mechanical machine elements. ISO conventions represent external threads with a continuous thick crest line (nominal diameter D) and a continuous thin root line (0.85 D). Hexagonal bolt heads and nuts feature 30° chamfer arcs.',
      historyAndApplication: 'Universal mechanical assemblies, engine block head bolts, structural steel flange connections, and aerospace airframe fasteners.',
      waecAndNERDCNotes: 'Nut thickness T = 0.8 D, Bolt head height H = 0.7 D, Width across flats W = 1.732 D (approx 1.5 D + 3mm). Chamfer arcs drawn with radius R = 1.5 D on the central face.',
      keyPrinciples: [
        {
          title: 'ISO Standard Thread Representation',
          description: 'Crest line = Continuous Thick (0.5mm); Root line = Continuous Thin (0.25mm) separated by distance approx 0.1 * D.',
          keyRule: 'D_{root} \\approx 0.85 D_{nominal}'
        },
        {
          title: 'Hexagonal Nut Proportions',
          description: 'Across corners = 2D; Thickness T = 0.8D; Main chamfer radius R = 1.5D.',
          keyRule: 'R_{chamfer} = 1.5 D'
        }
      ],
      formulas: [
        {
          latex: 'W_{corners} = 2D, \\quad T_{nut} = 0.8D, \\quad H_{head} = 0.7D, \\quad R_{arc} = 1.5D',
          description: 'Standard proportional formulas for metric hexagonal fasteners'
        }
      ],
      standardConventions: [
        { lineName: 'Continuous Thick', weightMm: '0.5mm', pencilGrade: 'HB', application: 'Bolt shank, head outline, nut outline, and thread crest' },
        { lineName: 'Continuous Thin', weightMm: '0.25mm', pencilGrade: '2H', application: 'Thread root lines and 30° chamfer construction arcs' },
        { lineName: 'Thin Chain Line', weightMm: '0.25mm', pencilGrade: '2H', application: 'Centerline of bolt shaft' }
      ]
    },
    parameters: [
      {
        id: 'nominalDia',
        label: 'Nominal Thread Diameter (D)',
        symbol: 'D',
        defaultValue: 30,
        min: 20,
        max: 45,
        step: 2,
        unit: 'mm',
        description: 'ISO Metric nominal diameter (e.g., M30)'
      },
      {
        id: 'boltLength',
        label: 'Bolt Shank Length (L)',
        symbol: 'L',
        defaultValue: 150,
        min: 100,
        max: 220,
        step: 10,
        unit: 'mm',
        description: 'Total length of bolt shank'
      }
    ],
    defaultViewBox: {
      width: 800,
      height: 600,
      defaultGrid: 'MILLIMETER'
    },
    generateSteps: (params) => {
      const D = params.nominalDia || 30;
      const L = params.boltLength || 150;

      const headH = 0.7 * D;
      const nutT = 0.8 * D;
      const W = 2 * D; // Across corners
      const rootD = 0.85 * D;

      const ox = 220;
      const oy = 300; // Centerline Y

      // Bolt Head:
      const headL = ox;
      const headR = ox + headH;

      // Shank:
      const shankL = headR;
      const shankR = shankL + L;

      // Nut placed at shankR - nutT - 20:
      const nutL = shankR - nutT - 20;
      const nutR = nutL + nutT;

      return [
        {
          stepIndex: 1,
          title: 'Draw the Bolt Centerline and Head Outline',
          instruction: `Draw centerline. Construct hexagonal bolt head of height H = ${(headH).toFixed(1)} mm and width across corners 2D = ${(W).toFixed(1)} mm with HB pencil.`,
          detailedNotes: 'Bolt head uses standard empirical proportions: H = 0.7D.',
          technicalPrinciple: 'Standard bolt head proportions.',
          activeInstrument: {
            toolType: 'TEE_SQUARE',
            x: headL - 20,
            y: oy,
            targetX: shankR + 30,
            targetY: oy,
            visible: true,
            actionText: `Draw bolt head (${headH.toFixed(0)} x ${W.toFixed(0)} mm)`
          },
          elements: [
            { id: 'bolt-center', type: 'SEGMENT', lineWeight: 'THIN_CHAIN', x1: headL - 30, y1: oy, x2: shankR + 40, y2: oy, isNew: true },
            { id: 'bolt-head-poly', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[headL, oy - W / 2], [headR, oy - W / 2], [headR, oy + W / 2], [headL, oy + W / 2]], isNew: true }
          ]
        },
        {
          stepIndex: 2,
          title: 'Draw the Bolt Shank and Standard ISO Thread Representation',
          instruction: `Draw bolt shank of nominal diameter D = ${D} mm and length L = ${L} mm. Draw continuous thin root lines at root diameter = ${(rootD).toFixed(1)} mm (0.85 D).`,
          detailedNotes: 'ISO 6410: Crest is Continuous Thick (0.5mm); Root is Continuous Thin (0.25mm).',
          technicalPrinciple: 'ISO Metric Thread convention.',
          activeInstrument: {
            toolType: 'RULER',
            x: shankL,
            y: oy - D / 2,
            targetX: shankR,
            targetY: oy - D / 2,
            visible: true,
            actionText: `Draw shank and thread root lines`
          },
          elements: [
            { id: 'shank-top', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: shankL, y1: oy - D / 2, x2: shankR, y2: oy - D / 2, isNew: true },
            { id: 'shank-bot', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: shankL, y1: oy + D / 2, x2: shankR, y2: oy + D / 2, isNew: true },
            { id: 'shank-end', type: 'SEGMENT', lineWeight: 'THICK_CONTINUOUS', x1: shankR, y1: oy - D / 2, x2: shankR, y2: oy + D / 2, isNew: true },
            { id: 'thread-root-top', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: shankL + 30, y1: oy - rootD / 2, x2: shankR, y2: oy - rootD / 2, isNew: true },
            { id: 'thread-root-bot', type: 'SEGMENT', lineWeight: 'THIN_CONTINUOUS', x1: shankL + 30, y1: oy + rootD / 2, x2: shankR, y2: oy + rootD / 2, isNew: true }
          ]
        },
        {
          stepIndex: 3,
          title: 'Construct the Hexagonal Nut with 30° Chamfer Arcs',
          instruction: `Draw hexagonal nut of thickness T = ${(nutT).toFixed(1)} mm (0.8 D) and width 2D = ${(W).toFixed(1)} mm. Construct central chamfer arc (R = 1.5 D = ${(1.5 * D).toFixed(1)} mm) and corner chamfer arcs.`,
          detailedNotes: 'The fastener assembly is complete conforming to ISO metric standards.',
          technicalPrinciple: 'Complete ISO Hexagonal Fastener Assembly.',
          activeInstrument: {
            toolType: 'COMPASS',
            x: nutL + nutT / 2,
            y: oy,
            radius: 1.5 * D,
            visible: true,
            actionText: 'Draw nut chamfer arcs'
          },
          elements: [
            { id: 'nut-poly', type: 'POLYGON', lineWeight: 'THICK_CONTINUOUS', points: [[nutL, oy - W / 2], [nutR, oy - W / 2], [nutR, oy + W / 2], [nutL, oy + W / 2]], isNew: true, isFinalResult: true },
            { id: 'dim-nominal-D', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: shankR + 15, y1: oy - D / 2, x2: shankR + 15, y2: oy + D / 2, dimensionText: `M${D}` }
          ]
        }
      ];
    }
  }
];
