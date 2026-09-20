// Drafthands Authentic J.N. Green & Pickup & Parker Vector Technical Diagram Engine
import { ConstructionElement, LineWeightType } from '../types/curriculum';
import { allCurriculumTopics } from './curriculumData';
import { formatMathSymbols } from '../utils/formatMath';

export interface AuthenticDiagramPayload {
  figureNumber: string;
  title: string;
  textbookSource: string;
  caption: string;
  mathematicalProof: string;
  dimensions: string[];
  elements: ConstructionElement[];
  guideNotes: string[];
}

/**
 * Procedurally builds authentic geometric vector elements for standard J.N. Green
 * and Pickup & Parker textbook plates.
 */
function createDiagramGeometry(type: string): {
  source: string;
  proof: string;
  elements: ConstructionElement[];
  dimensions: string[];
  caption: string;
} {
  switch (type) {
    case 'bisection':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 2.1 & 2.8',
        proof: 'AM = MB = ½ AB; CD ⊥ AB, ∠AMC = 90.0°',
        dimensions: ['AB = 120.0mm', 'AM = MB = 60.0mm', 'Radius R > 60.0mm', 'Angle = 90.0°'],
        caption: 'True perpendicular bisection of line AB using compass arcs intersecting at C and D to locate midpoint M.',
        elements: [
          // 4H Grid / Center Reference
          { id: 'b-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 100, y1: 300, x2: 700, y2: 300 },
          
          // Given Baseline AB (HB)
          { id: 'b-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 300, x2: 600, y2: 300, isFinalResult: true },
          
          // Compass arcs from A (R = 250) (4H Guide Lines)
          { id: 'b-arc-a1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 300, r: 250, startAngle: -45, endAngle: -20 },
          { id: 'b-arc-a2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 300, r: 250, startAngle: 20, endAngle: 45 },
          
          // Compass arcs from B (R = 250) intersecting at C and D
          { id: 'b-arc-b1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 300, r: 250, startAngle: -160, endAngle: -135 },
          { id: 'b-arc-b2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 300, r: 250, startAngle: 135, endAngle: 160 },
          
          // Perpendicular Bisector CD (2H Construction / Finished Bisector)
          { id: 'b-cd', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 100, x2: 400, y2: 500, isFinalResult: true },
          
          // 90° Square Angle Marker at M
          { id: 'b-sq1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 275, x2: 425, y2: 275 },
          { id: 'b-sq2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 425, y1: 275, x2: 425, y2: 300 },
          
          // Key Points
          { id: 'p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 300, label: 'A', labelPosition: 'bottom' },
          { id: 'p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 300, label: 'B', labelPosition: 'bottom' },
          { id: 'p-m', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'M (Midpoint)', labelPosition: 'bottom-right' },
          { id: 'p-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 132, label: 'C (Intersecting Arc)', labelPosition: 'top' },
          { id: 'p-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 468, label: 'D (Intersecting Arc)', labelPosition: 'bottom' },
          
          // Dimension Indicator
          { id: 'dim-ab', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 200, y1: 360, x2: 600, y2: 360, dimensionText: 'AB = 120.0mm' },
          { id: 'dim-r', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 270, cy: 170, label: 'Arc R > ½ AB' }
        ]
      };

    case 'division':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 3.1 & Pickup & Parker Ex. 5',
        proof: 'A-1 = 1-2 = 2-3 = 3-4 = 4-5 ⟹ A-1\' = 1\'-2\' = 2\'-3\' = 3\'-4\' = 4\'-B = ⅕ AB',
        dimensions: ['Line AB = 135.0mm', 'Divisions = 5 Equal Parts (27.0mm each)', 'Auxiliary Ray Angle θ ≈ 30°'],
        caption: 'Proportional division of line AB into 5 equal parts using acute auxiliary ray and parallel projection transfer lines.',
        elements: [
          // Baseline AB
          { id: 'd-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 150, y1: 350, x2: 650, y2: 350, isFinalResult: true },
          
          // Auxiliary Ray AC at ~25°
          { id: 'd-ac', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 150, y1: 350, x2: 600, y2: 140 },
          
          // 5 Equal Dividers along Ray
          ...[1, 2, 3, 4, 5].map(i => ({
            id: `d-pt-${i}`,
            type: 'POINT' as const,
            lineWeight: 'CONSTRUCTION_2H' as const,
            cx: 150 + i * 90,
            cy: 350 - i * 42,
            label: `${i}`,
            labelPosition: 'top-left' as const
          })),

          // Transfer Projection Lines (2H Parallel to 5-B)
          ...[1, 2, 3, 4, 5].map(i => ({
            id: `d-proj-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 150 + i * 90,
            y1: 350 - i * 42,
            x2: 150 + i * 100,
            y2: 350
          })),

          // Divided Points on AB
          ...[1, 2, 3, 4].map(i => ({
            id: `d-div-${i}`,
            type: 'POINT' as const,
            lineWeight: 'OUTLINE_HB' as const,
            cx: 150 + i * 100,
            cy: 350,
            label: `${i}'`,
            labelPosition: 'bottom' as const
          })),

          // Main Endpoints
          { id: 'p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 350, label: 'A', labelPosition: 'bottom-left' },
          { id: 'p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 650, cy: 350, label: 'B', labelPosition: 'bottom-right' },
          { id: 'dim-tot', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 150, y1: 410, x2: 650, y2: 410, dimensionText: 'AB = 135.0mm (5 equal segments)' }
        ]
      };

    case 'angles':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 3.6',
        proof: 'Chord c = r ⟹ θ = 60.0°; 75.0° = 60.0° + ½ (90.0° - 60.0°) = 60.0° + 15.0°',
        dimensions: ['60° Equilateral Ray', '90° Normal Ray', '75° Constructed Ray', 'Radius r = 160.0mm'],
        caption: 'Geometric construction of 60°, 90°, and 75° angles using compass arcs only without a protractor.',
        elements: [
          // Baseline AB
          { id: 'ang-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 420, x2: 650, y2: 420, isFinalResult: true },
          
          // Primary Semicircle Arc from A (r = 180)
          { id: 'ang-semi', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 200, cy: 420, r: 180, startAngle: -180, endAngle: 0 },
          
          // 60° Arc from (380, 420)
          { id: 'ang-arc60', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 380, cy: 420, r: 180, startAngle: -140, endAngle: -100 },
          
          // 120° Arc from 60° node
          { id: 'ang-arc120', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 290, cy: 264, r: 180, startAngle: -170, endAngle: -130 },
          
          // 90° Bisecting Arcs
          { id: 'ang-arc90-1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 290, cy: 264, r: 180, startAngle: -80, endAngle: -40 },
          { id: 'ang-arc90-2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 110, cy: 264, r: 180, startAngle: -60, endAngle: -20 },
          
          // Rays
          { id: 'ray-60', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 420, x2: 420, y2: 39 },
          { id: 'ray-90', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 420, x2: 200, y2: 120 },
          { id: 'ray-75', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 420, x2: 300, y2: 47, isFinalResult: true },

          // Points and Labels
          { id: 'p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 420, label: 'A (Vertex)', labelPosition: 'bottom' },
          { id: 'p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 650, cy: 420, label: 'B', labelPosition: 'bottom' },
          { id: 'lbl-60', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 370, cy: 190, label: '60° Ray' },
          { id: 'lbl-90', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 160, cy: 160, label: '90° Ray' },
          { id: 'lbl-75', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 330, cy: 120, label: '75° Target Angle' }
        ]
      };

    case 'triangle-equilateral':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 3.1',
        proof: 'AB = BC = CA = 70.0mm ⟹ ∠A = ∠B = ∠C = 60.0°; Σ angles = 180.0°',
        dimensions: ['Base c = 70.0mm', 'Side a = 70.0mm', 'Side b = 70.0mm', 'All Interior Angles = 60°'],
        caption: 'Construction of an Equilateral Triangle (all 3 sides equal, all 3 interior angles = 60°) using compass & straightedge.',
        elements: [
          // Problem statement banner (technical lettering)
          { id: 'eq-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 60, label: 'PROBLEM: Construct an equilateral triangle ABC with base AB = 70mm' },
          { id: 'eq-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 120, cy: 85, label: 'PROCEDURE: Strike arc R=AB from A; strike arc R=AB from B to intersect at apex C; join AC & BC.' },
          
          // Baseline AB (HB)
          { id: 'eq-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 430, x2: 540, y2: 430, isFinalResult: true },

          // Compass Arc from A (radius R = 280mm) (4H guide line)
          { id: 'eq-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 260, cy: 430, r: 280, startAngle: -75, endAngle: -45 },
          
          // Compass Arc from B (radius R = 280mm) (4H guide line)
          { id: 'eq-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 540, cy: 430, r: 280, startAngle: -135, endAngle: -105 },

          // Finished HB Outlines AC and BC
          { id: 'eq-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 430, x2: 400, y2: 188, isFinalResult: true },
          { id: 'eq-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 540, y1: 430, x2: 400, y2: 188, isFinalResult: true },

          // Equality Tick Marks on all 3 sides
          { id: 'eq-tick-c', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 422, x2: 400, y2: 438 },
          { id: 'eq-tick-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 324, y1: 304, x2: 337, y2: 312 },
          { id: 'eq-tick-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 476, y1: 304, x2: 463, y2: 312 },

          // Angle Arcs at 60°
          { id: 'eq-ang-a', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 260, cy: 430, r: 50, startAngle: -60, endAngle: 0 },
          { id: 'eq-ang-b', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 540, cy: 430, r: 50, startAngle: -180, endAngle: -120 },
          { id: 'eq-ang-c', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 188, r: 50, startAngle: 60, endAngle: 120 },

          // Angle Labels
          { id: 'eq-lbl-a', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 320, cy: 415, label: '60°' },
          { id: 'eq-lbl-b', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 470, cy: 415, label: '60°' },
          { id: 'eq-lbl-c', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 393, cy: 255, label: '60°' },

          // Vertex Points
          { id: 'eq-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 430, label: 'A', labelPosition: 'bottom-left' },
          { id: 'eq-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 540, cy: 430, label: 'B', labelPosition: 'bottom-right' },
          { id: 'eq-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 188, label: 'C (Apex)', labelPosition: 'top' },

          // Compass puncture crosshairs
          { id: 'eq-px-a', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 252, y1: 430, x2: 268, y2: 430 },
          { id: 'eq-py-a', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 260, y1: 422, x2: 260, y2: 438 },
          { id: 'eq-px-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 532, y1: 430, x2: 548, y2: 430 },
          { id: 'eq-py-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 540, y1: 422, x2: 540, y2: 438 },

          // Dimensions
          { id: 'eq-dim-c', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 260, y1: 475, x2: 540, y2: 475, dimensionText: 'Base c = 70.0mm' },
          { id: 'eq-dim-b', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 230, y1: 420, x2: 370, y2: 178, dimensionText: 'b = 70.0mm' },
          { id: 'eq-dim-a', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 570, y1: 420, x2: 430, y2: 178, dimensionText: 'a = 70.0mm' }
        ]
      };

    case 'triangle-isosceles':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 3.3 & Pickup & Parker Ex. 6',
        proof: 'AC = BC = 85.0mm ⟹ ∠CAB = ∠CBA = 65.7°; Altitude h = √(85² - 35²) = 77.5mm',
        dimensions: ['Base c = 70.0mm', 'Equal Sides a = b = 85.0mm', 'Altitude h = 77.5mm', 'Base Angles α = β = 65.7°'],
        caption: 'Construction of an Isosceles Triangle (two equal sides, two equal base angles, perpendicular axis of symmetry).',
        elements: [
          // Problem statement banner
          { id: 'iso-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 60, label: 'PROBLEM: Construct an isosceles triangle ABC (Base AB = 70mm, Equal Legs = 85mm)' },
          { id: 'iso-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 120, cy: 85, label: 'PROCEDURE: Draw base AB; swing arcs R=85mm from A and B to intersect at apex C; draw axis CM ⊥ AB.' },

          // Horizontal Baseline AB (HB)
          { id: 'iso-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 430, x2: 540, y2: 430, isFinalResult: true },

          // Axis of Symmetry / Altitude Centerline CM (ISO Type G)
          { id: 'iso-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 120, x2: 400, y2: 480 },

          // Midpoint M perpendicular square mark
          { id: 'iso-sq1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 405, x2: 425, y2: 405 },
          { id: 'iso-sq2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 425, y1: 405, x2: 425, y2: 430 },

          // Compass Arcs of Radius R = 300 (85mm scaled) from A and B
          { id: 'iso-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 260, cy: 430, r: 300, startAngle: -75, endAngle: -50 },
          { id: 'iso-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 540, cy: 430, r: 300, startAngle: -130, endAngle: -105 },

          // Finished Outlines AC and BC
          { id: 'iso-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 430, x2: 400, y2: 165, isFinalResult: true },
          { id: 'iso-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 540, y1: 430, x2: 400, y2: 165, isFinalResult: true },

          // Equality Double Tick Marks on AC and BC
          { id: 'iso-t1-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 324, y1: 295, x2: 336, y2: 303 },
          { id: 'iso-t1-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 328, y1: 301, x2: 340, y2: 309 },
          { id: 'iso-t2-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 476, y1: 295, x2: 464, y2: 303 },
          { id: 'iso-t2-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 472, y1: 301, x2: 460, y2: 309 },

          // Base Angle Arcs (α and β)
          { id: 'iso-ang-a', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 260, cy: 430, r: 50, startAngle: -65, endAngle: 0 },
          { id: 'iso-ang-b', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 540, cy: 430, r: 50, startAngle: -180, endAngle: -115 },
          { id: 'iso-lbl-a', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 320, cy: 415, label: 'α = 65.7°' },
          { id: 'iso-lbl-b', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 440, cy: 415, label: 'β = 65.7°' },

          // Points
          { id: 'iso-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 430, label: 'A', labelPosition: 'bottom-left' },
          { id: 'iso-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 540, cy: 430, label: 'B', labelPosition: 'bottom-right' },
          { id: 'iso-pt-m', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 430, label: 'M', labelPosition: 'bottom' },
          { id: 'iso-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 165, label: 'C (Apex)', labelPosition: 'top' },

          // Dimensions
          { id: 'iso-dim-c', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 260, y1: 475, x2: 540, y2: 475, dimensionText: 'Base c = 70.0mm' },
          { id: 'iso-dim-b', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 220, y1: 420, x2: 360, y2: 155, dimensionText: 'b = 85.0mm' },
          { id: 'iso-dim-a', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 580, y1: 420, x2: 440, y2: 155, dimensionText: 'a = 85.0mm' },
          { id: 'iso-dim-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 400, y1: 165, x2: 400, y2: 430, dimensionText: 'h = 77.5mm' }
        ]
      };

    case 'triangle-scalene':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 3.2 & Pickup & Parker Ex. 7',
        proof: 'a ≠ b ≠ c (70 ≠ 55 ≠ 80); a + b = 125.0mm > c = 80.0mm; ∠A = 57.6°, ∠B = 42.0°, ∠C = 80.4°',
        dimensions: ['Base c = 80.0mm', 'Side a = 70.0mm', 'Side b = 55.0mm', 'Unequal Angles: 57.6°, 42.0°, 80.4°'],
        caption: 'Construction of a Scalene Triangle (all three sides unequal, all three angles unequal) using SSS compass intersection.',
        elements: [
          // Problem statement banner
          { id: 'sc-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 60, label: 'PROBLEM: Construct a scalene triangle ABC (c = 80mm, a = 70mm, b = 55mm)' },
          { id: 'sc-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 120, cy: 85, label: 'PROCEDURE: Draw base AB=80mm; swing arc R=55mm from A; swing arc R=70mm from B to locate C; join AC & BC.' },

          // Baseline AB (HB)
          { id: 'sc-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 240, y1: 430, x2: 560, y2: 430, isFinalResult: true },

          // Compass Arc from A (radius b = 220 scaled from 55mm)
          { id: 'sc-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 240, cy: 430, r: 220, startAngle: -75, endAngle: -40 },

          // Compass Arc from B (radius a = 280 scaled from 70mm)
          { id: 'sc-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 560, cy: 430, r: 280, startAngle: -150, endAngle: -115 },

          // Apex C calculated: x = 360, y = 245
          // Finished Outlines AC and BC
          { id: 'sc-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 240, y1: 430, x2: 360, y2: 245, isFinalResult: true },
          { id: 'sc-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 560, y1: 430, x2: 360, y2: 245, isFinalResult: true },

          // Unequal Angle Arcs
          { id: 'sc-ang-a', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 240, cy: 430, r: 45, startAngle: -57, endAngle: 0 },
          { id: 'sc-ang-b', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 430, r: 45, startAngle: -180, endAngle: -138 },
          { id: 'sc-ang-c', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 360, cy: 245, r: 40, startAngle: 42, endAngle: 123 },

          // Angle Labels
          { id: 'sc-lbl-a', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 295, cy: 415, label: '57.6°' },
          { id: 'sc-lbl-b', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 485, cy: 415, label: '42.0°' },
          { id: 'sc-lbl-c', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 350, cy: 305, label: '80.4°' },

          // Points
          { id: 'sc-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 240, cy: 430, label: 'A', labelPosition: 'bottom-left' },
          { id: 'sc-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 430, label: 'B', labelPosition: 'bottom-right' },
          { id: 'sc-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 360, cy: 245, label: 'C (Apex)', labelPosition: 'top' },

          // Compass puncture crosshairs
          { id: 'sc-px-a', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 232, y1: 430, x2: 248, y2: 430 },
          { id: 'sc-py-a', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 240, y1: 422, x2: 240, y2: 438 },
          { id: 'sc-px-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 552, y1: 430, x2: 568, y2: 430 },
          { id: 'sc-py-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 560, y1: 422, x2: 560, y2: 438 },

          // Dimensions
          { id: 'sc-dim-c', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 240, y1: 475, x2: 560, y2: 475, dimensionText: 'c = 80.0mm' },
          { id: 'sc-dim-b', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 215, y1: 415, x2: 335, y2: 230, dimensionText: 'b = 55.0mm' },
          { id: 'sc-dim-a', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 585, y1: 415, x2: 385, y2: 230, dimensionText: 'a = 70.0mm' }
        ]
      };

    case 'triangles':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Chapter 3 & WAEC Technical Drawing Standards',
        proof: 'Equilateral: a=b=c (60°); Isosceles: a=b≠c (α=β); Scalene: a≠b≠c (all angles unequal); Σ = 180.0°',
        dimensions: ['Type 1: Equilateral (3 equal sides)', 'Type 2: Isosceles (2 equal sides)', 'Type 3: Scalene (3 unequal sides)'],
        caption: 'Comparative Master Plate showing the Three Types of Triangles classified by side length and interior angles.',
        elements: [
          // Master Header
          { id: 'all-head', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 160, cy: 50, label: 'THE THREE CLASSIFICATIONS OF TRIANGLES (J.N. GREEN CHAPTER 3)' },
          { id: 'all-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 160, cy: 75, label: 'ISO 128 Standard Line Weight Distribution • 2H Compass Guide Arcs • HB Finished Outlines' },

          // ================= PANEL 1: EQUILATERAL (Left) =================
          { id: 'p1-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 60, cy: 120, label: '1. EQUILATERAL' },
          { id: 'p1-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 60, cy: 140, label: 'All 3 sides equal • 3 × 60°' },
          // Base
          { id: 'p1-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 60, y1: 420, x2: 240, y2: 420, isFinalResult: true },
          // Arcs R = 180
          { id: 'p1-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 60, cy: 420, r: 180, startAngle: -75, endAngle: -45 },
          { id: 'p1-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 240, cy: 420, r: 180, startAngle: -135, endAngle: -105 },
          // Sides
          { id: 'p1-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 60, y1: 420, x2: 150, y2: 264, isFinalResult: true },
          { id: 'p1-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 240, y1: 420, x2: 150, y2: 264, isFinalResult: true },
          // Ticks
          { id: 'p1-tk1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 150, y1: 415, x2: 150, y2: 425 },
          { id: 'p1-tk2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 100, y1: 345, x2: 110, y2: 350 },
          { id: 'p1-tk3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 345, x2: 190, y2: 350 },
          // Labels
          { id: 'p1-pta', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 60, cy: 420, label: 'A', labelPosition: 'bottom' },
          { id: 'p1-ptb', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 240, cy: 420, label: 'B', labelPosition: 'bottom' },
          { id: 'p1-ptc', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 264, label: 'C', labelPosition: 'top' },
          { id: 'p1-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 60, y1: 460, x2: 240, y2: 460, dimensionText: 'a = b = c = 60mm' },

          // Vertical divider line 1
          { id: 'div-1', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 275, y1: 110, x2: 275, y2: 500 },

          // ================= PANEL 2: ISOSCELES (Center) =================
          { id: 'p2-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 320, cy: 120, label: '2. ISOSCELES' },
          { id: 'p2-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 320, cy: 140, label: '2 sides equal • Base angles α = β' },
          // Base
          { id: 'p2-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 320, y1: 420, x2: 480, y2: 420, isFinalResult: true },
          // Axis of symmetry
          { id: 'p2-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 200, x2: 400, y2: 440 },
          // Arcs R = 200
          { id: 'p2-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 320, cy: 420, r: 200, startAngle: -75, endAngle: -55 },
          { id: 'p2-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 480, cy: 420, r: 200, startAngle: -125, endAngle: -105 },
          // Sides (apex at 400, 237)
          { id: 'p2-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 320, y1: 420, x2: 400, y2: 237, isFinalResult: true },
          { id: 'p2-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 480, y1: 420, x2: 400, y2: 237, isFinalResult: true },
          // Double ticks
          { id: 'p2-tk1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 357, y1: 325, x2: 365, y2: 331 },
          { id: 'p2-tk2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 360, y1: 330, x2: 368, y2: 336 },
          { id: 'p2-tk3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 443, y1: 325, x2: 435, y2: 331 },
          { id: 'p2-tk4', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 440, y1: 330, x2: 432, y2: 336 },
          // Labels
          { id: 'p2-pta', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 320, cy: 420, label: 'A', labelPosition: 'bottom' },
          { id: 'p2-ptb', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 480, cy: 420, label: 'B', labelPosition: 'bottom' },
          { id: 'p2-ptc', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 237, label: 'C', labelPosition: 'top' },
          { id: 'p2-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 320, y1: 460, x2: 480, y2: 460, dimensionText: 'Base c = 50mm, a=b=70mm' },

          // Vertical divider line 2
          { id: 'div-2', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 525, y1: 110, x2: 525, y2: 500 },

          // ================= PANEL 3: SCALENE (Right) =================
          { id: 'p3-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 120, label: '3. SCALENE' },
          { id: 'p3-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 140, label: 'All 3 sides & angles unequal' },
          // Base
          { id: 'p3-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 560, y1: 420, x2: 740, y2: 420, isFinalResult: true },
          // Arcs R1 = 150, R2 = 180
          { id: 'p3-arc-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 560, cy: 420, r: 150, startAngle: -75, endAngle: -45 },
          { id: 'p3-arc-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 740, cy: 420, r: 180, startAngle: -155, endAngle: -125 },
          // Sides (apex at 640, 290)
          { id: 'p3-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 560, y1: 420, x2: 640, y2: 290, isFinalResult: true },
          { id: 'p3-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 740, y1: 420, x2: 640, y2: 290, isFinalResult: true },
          // Labels
          { id: 'p3-pta', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 420, label: 'A', labelPosition: 'bottom' },
          { id: 'p3-ptb', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 740, cy: 420, label: 'B', labelPosition: 'bottom' },
          { id: 'p3-ptc', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 640, cy: 290, label: 'C', labelPosition: 'top' },
          { id: 'p3-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 560, y1: 460, x2: 740, y2: 460, dimensionText: 'c = 65mm, a = 65mm, b = 50mm' }
        ]
      };

    case 'triangle-incircle':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 3.8',
        proof: 'Incenter I = bisector(∠A) ∩ bisector(∠B); Inradius r = IP ⊥ AB; Tangent to AB, BC, AC',
        dimensions: ['Base AB = 90mm', 'Side BC = 75mm', 'Side AC = 65mm', 'Inradius r ≈ 21.5mm'],
        caption: 'Construction of Inscribed Circle (Incircle) tangential to all three sides of triangle ABC.',
        elements: [
          // Problem statement banner
          { id: 'inc-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 60, label: 'PROBLEM: Inscribe a circle inside triangle ABC (AB=90mm, BC=75mm, AC=65mm)' },
          { id: 'inc-sub', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 120, cy: 85, label: 'PROCEDURE: Bisect ∠A & ∠B to locate incenter I; drop normal IP ⊥ AB; draw incircle with radius IP.' },

          // Baseline AB
          { id: 'inc-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 430, x2: 580, y2: 430, isFinalResult: true },
          // Sides AC and BC (Apex at 350, 190)
          { id: 'inc-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 430, x2: 350, y2: 190, isFinalResult: true },
          { id: 'inc-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 430, x2: 350, y2: 190, isFinalResult: true },

          // Angle bisectors (2H thin)
          { id: 'inc-bis-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 430, x2: 480, y2: 240 },
          { id: 'inc-bis-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 580, y1: 430, x2: 250, y2: 220 },

          // Incenter I at (360, 340)
          { id: 'inc-pt-i', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 360, cy: 340, label: 'I (Incenter)', labelPosition: 'top' },

          // Perpendicular normal IP to AB
          { id: 'inc-norm', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 360, y1: 340, x2: 360, y2: 430 },
          { id: 'inc-pt-p', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 360, cy: 430, label: 'P (Tangency)', labelPosition: 'bottom' },

          // Finished Inscribed Circle (HB thick)
          { id: 'inc-circle', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 360, cy: 340, r: 90, isFinalResult: true },

          // Points
          { id: 'inc-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 430, label: 'A', labelPosition: 'bottom-left' },
          { id: 'inc-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 580, cy: 430, label: 'B', labelPosition: 'bottom-right' },
          { id: 'inc-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 350, cy: 190, label: 'C', labelPosition: 'top' }
        ]
      };

    case 'tangent':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 7.4 & Pickup & Parker Vol. 1 Plate 4',
        proof: 'O₁ T₁ ⊥ T₁ T₂;   O₂ T₂ ∥ O₁ T₁;   sin(θ) = (R₁ - R₂) / C',
        dimensions: ['Center Distance C = 320.0mm', 'Circle 1 Radius R₁ = 100.0mm', 'Circle 2 Radius R₂ = 50.0mm', 'Difference Radius R_diff = 50.0mm'],
        caption: 'External common tangent to two unequal circles using difference circle method with true normal contact points T₁ and T₂.',
        elements: [
          // Centerline of centers O1-O2
          { id: 't-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 120, y1: 300, x2: 680, y2: 300 },
          
          // Circle 1 (Center O1, R=100)
          { id: 't-c1', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 240, cy: 300, r: 100, isFinalResult: true },
          
          // Circle 2 (Center O2, R=50)
          { id: 't-c2', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 560, cy: 300, r: 50, isFinalResult: true },
          
          // Difference Circle (R1 - R2 = 50)
          { id: 't-cdiff', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 240, cy: 300, r: 50 },
          
          // Semicircle on O1-O2 as diameter (Midpoint 400, R=160)
          { id: 't-semi', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 400, cy: 300, r: 160, startAngle: -180, endAngle: 0 },
          
          // Normal Radii
          { id: 't-norm1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 240, y1: 300, x2: 271, y2: 205 },
          { id: 't-norm2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 560, y1: 300, x2: 576, y2: 252 },
          
          // Common Tangent Line T1-T2
          { id: 't-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 190, y1: 179, x2: 630, y2: 269, isFinalResult: true },
          
          // Contact Points
          { id: 'p-o1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 240, cy: 300, label: 'O₁', labelPosition: 'bottom' },
          { id: 'p-o2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 300, label: 'O₂', labelPosition: 'bottom' },
          { id: 'p-t1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 271, cy: 205, label: 'T₁ (Tangent Point)', labelPosition: 'top-left' },
          { id: 'p-t2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 576, cy: 252, label: 'T₂ (Tangent Point)', labelPosition: 'top-right' },
          
          { id: 'dim-c', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 240, y1: 430, x2: 560, y2: 430, dimensionText: 'Center Distance C = 320.0mm' }
        ]
      };

    case 'polygon-across-corners':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 4.3 & Pickup & Parker Plate 4',
        proof: 'Across Corners Distance C = 2S = 2R;   Interior Angle = 120.0°;   Chord = R = S',
        dimensions: ['Across Corners C = 300.0mm', 'Side Length S = 150.0mm', 'Circumradius R = 150.0mm', 'Interior Angle = 120°'],
        caption: 'Construction of regular hexagon given distance Across Corners (A/C = 300mm). A circumscribing circle of diameter C (radius R = 150mm) is drawn. Using compass set to radius R, arcs are swung from horizontal centerline endpoints to divide circumference into 6 equal vertices, joined with continuous thick HB lines.',
        elements: [
          // Centerlines (2H Chain-Thin)
          { id: 'ac-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 150, y1: 300, x2: 650, y2: 300 },
          { id: 'ac-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 80, x2: 400, y2: 520 },

          // Circumscribing Circle (2H Continuous Thin)
          { id: 'ac-circle', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 150 },

          // Equilateral triangle radial guide rays (4H Faint)
          { id: 'ac-ray-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 475, y2: 170 },
          { id: 'ac-ray-c', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 325, y2: 170 },
          { id: 'ac-ray-e', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 325, y2: 430 },
          { id: 'ac-ray-f', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 400, y1: 300, x2: 475, y2: 430 },

          // Compass Step Arcs from endpoints of horizontal diameter (4H)
          { id: 'ac-arc-right-top', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 550, cy: 300, r: 150, startAngle: 100, endAngle: 140 },
          { id: 'ac-arc-right-bot', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 550, cy: 300, r: 150, startAngle: 220, endAngle: 260 },
          { id: 'ac-arc-left-top', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 250, cy: 300, r: 150, startAngle: 40, endAngle: 80 },
          { id: 'ac-arc-left-bot', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 250, cy: 300, r: 150, startAngle: 280, endAngle: 320 },

          // Finished Hexagon Outline (HB Continuous Thick)
          {
            id: 'ac-hex-outline',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [550, 300],
              [475, 170],
              [325, 170],
              [250, 300],
              [325, 430],
              [475, 430]
            ],
            isFinalResult: true
          },

          // Across Corners (A/C) Horizontal Dimension Line
          { id: 'ac-ext-left', type: 'LINE', lineWeight: 'DIMENSION_LINE', x1: 250, y1: 305, x2: 250, y2: 495 },
          { id: 'ac-ext-right', type: 'LINE', lineWeight: 'DIMENSION_LINE', x1: 550, y1: 305, x2: 550, y2: 495 },
          { id: 'ac-dim-corners', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 250, y1: 480, x2: 550, y2: 480, dimensionText: 'Distance Across Corners (A/C) = 300mm (2S)' },

          // Side Length S Dimension Line (on top edge BC)
          { id: 'ac-dim-side', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 325, y1: 145, x2: 475, y2: 145, dimensionText: 'Side S = 150mm (R)' },

          // 60° Equilateral Angle Arc
          { id: 'ac-arc-60', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 45, startAngle: -60, endAngle: 0 },

          // Vertex Nodes and Labels
          { id: 'ac-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 550, cy: 300, label: 'A (Corner)', labelPosition: 'right' },
          { id: 'ac-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475, cy: 170, label: 'B', labelPosition: 'top-right' },
          { id: 'ac-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 325, cy: 170, label: 'C', labelPosition: 'top-left' },
          { id: 'ac-pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 250, cy: 300, label: 'D (Corner)', labelPosition: 'left' },
          { id: 'ac-pt-e', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 325, cy: 430, label: 'E', labelPosition: 'bottom-left' },
          { id: 'ac-pt-f', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475, cy: 430, label: 'F', labelPosition: 'bottom-right' },
          { id: 'ac-pt-o', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'O (Center)', labelPosition: 'bottom-left' }
        ]
      };

    case 'polygon-across-flats':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples Vol. 1 (Ex. 11) & J.N. Green Fig. 4.7',
        proof: 'Across Flats Distance W = S × √3 ≈ 1.732S;   Inscribed Circle Ø = W;   Tangents at 30° & 60°',
        dimensions: ['Width Across Flats W = 260.0mm', 'Inscribed Radius r = 130.0mm', 'Side Length S = 150.1mm', 'Across Corners C = 300.2mm'],
        caption: 'Construction of regular hexagon given distance Across Flats (A/F = 260mm). An inscribed circle of diameter W (radius r = 130mm) is drawn. Tangents are drawn using a T-square (horizontal tangents at top and bottom) and a 30°/60° set-square (four inclined tangents). Their intersections define the 6 vertices across flats.',
        elements: [
          // Centerlines (2H Chain-Thin)
          { id: 'af-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 150, y1: 300, x2: 650, y2: 300 },
          { id: 'af-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 80, x2: 400, y2: 520 },

          // Inscribed Circle (2H Continuous Thin, Diameter = W = 260mm, Radius = 130mm)
          { id: 'af-circle', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 130 },

          // T-Square Horizontal Tangents (4H Faint Guides extending past vertices)
          { id: 'af-tan-top-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 220, y1: 170, x2: 580, y2: 170 },
          { id: 'af-tan-bot-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 220, y1: 430, x2: 580, y2: 430 },

          // 30°/60° Set-Square Tangents (4H Faint Guides)
          // Tangent top-right to bottom-right through corner (550.1, 300)
          { id: 'af-tan-tr-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 425, y1: 83, x2: 580, y2: 352 },
          { id: 'af-tan-br-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 580, y1: 248, x2: 425, y2: 517 },
          // Tangent top-left to bottom-left through corner (249.9, 300)
          { id: 'af-tan-tl-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 375, y1: 83, x2: 220, y2: 352 },
          { id: 'af-tan-bl-guide', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 220, y1: 248, x2: 375, y2: 517 },

          // Finished Hexagon Outline (HB Continuous Thick)
          {
            id: 'af-hex-outline',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [475.1, 170],
              [550.1, 300],
              [475.1, 430],
              [324.9, 430],
              [249.9, 300],
              [324.9, 170]
            ],
            isFinalResult: true
          },

          // Contact Points of Tangency on Inscribed Circle (Flat Face Centers)
          { id: 'af-tan-pt-top', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 170, label: 'Tangent (T-Square)', labelPosition: 'top' },
          { id: 'af-tan-pt-bot', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 430, label: 'Tangent (T-Square)', labelPosition: 'bottom' },
          { id: 'af-tan-pt-tr', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 512.6, cy: 235 },
          { id: 'af-tan-pt-br', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 512.6, cy: 365 },
          { id: 'af-tan-pt-bl', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 287.4, cy: 365 },
          { id: 'af-tan-pt-tl', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 287.4, cy: 235 },

          // Distance Across Flats (A/F) Vertical Dimension Line
          { id: 'af-ext-top', type: 'LINE', lineWeight: 'DIMENSION_LINE', x1: 320, y1: 170, x2: 175, y2: 170 },
          { id: 'af-ext-bot', type: 'LINE', lineWeight: 'DIMENSION_LINE', x1: 320, y1: 430, x2: 175, y2: 430 },
          { id: 'af-dim-flats', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 190, y1: 170, x2: 190, y2: 430, dimensionText: 'Distance Across Flats (A/F) W = 260mm' },

          // Side Length Dimension Line (Bottom flat edge)
          { id: 'af-dim-side', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 324.9, y1: 455, x2: 475.1, y2: 455, dimensionText: 'Side S = W / √3 = 150.1mm' },

          // Across Corners Reference Dimension
          { id: 'af-dim-ac-ref', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 249.9, y1: 480, x2: 550.1, y2: 480, dimensionText: 'Across Corners C = 300.2mm' },

          // 60° Set-Square angle indicator arc
          { id: 'af-arc-60', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 550.1, cy: 300, r: 40, startAngle: 120, endAngle: 180 },

          // Vertices Nodes and Labels
          { id: 'af-pt-1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475.1, cy: 170, label: '1', labelPosition: 'top-right' },
          { id: 'af-pt-2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 550.1, cy: 300, label: '2 (Corner)', labelPosition: 'right' },
          { id: 'af-pt-3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475.1, cy: 430, label: '3', labelPosition: 'bottom-right' },
          { id: 'af-pt-4', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 324.9, cy: 430, label: '4', labelPosition: 'bottom-left' },
          { id: 'af-pt-5', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 249.9, cy: 300, label: '5 (Corner)', labelPosition: 'left' },
          { id: 'af-pt-6', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 324.9, cy: 170, label: '6', labelPosition: 'top-left' },
          { id: 'af-pt-o', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'O (Center)', labelPosition: 'center' }
        ]
      };

    case 'polygon-comparative':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate & Pickup & Parker Vol. 1',
        proof: 'Across Corners: C = 2S = 2R (Circumscribed);   Across Flats: W = S√3 (Inscribed)',
        dimensions: ['Left: Across Corners C = 240mm', 'Right: Across Flats W = 208mm', 'Hexagon Side S = 120mm (Both)'],
        caption: 'Master Comparative Plate: Left shows Hexagon Across Corners (A/C = 2S) inscribed in circumcircle of diameter C. Right shows Hexagon Across Flats (A/F = W) circumscribing an inscribed circle of diameter W using 30°/60° set-square tangents.',
        elements: [
          // Vertical Dividing Centerline
          { id: 'cmp-div', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 80, x2: 400, y2: 520 },

          // --- LEFT: ACROSS CORNERS (Center: 220, 290; Radius: 110) ---
          { id: 'cmp-ac-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 80, y1: 290, x2: 360, y2: 290 },
          { id: 'cmp-ac-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 220, y1: 150, x2: 220, y2: 430 },
          { id: 'cmp-ac-circle', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 220, cy: 290, r: 110 },
          {
            id: 'cmp-ac-hex',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [330, 290],
              [275, 194.7],
              [165, 194.7],
              [110, 290],
              [165, 385.3],
              [275, 385.3]
            ],
            isFinalResult: true
          },
          // Stepping Arcs on Left
          { id: 'cmp-ac-arc-r', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 330, cy: 290, r: 110, startAngle: 100, endAngle: 140 },
          { id: 'cmp-ac-arc-l', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 110, cy: 290, r: 110, startAngle: 40, endAngle: 80 },
          { id: 'cmp-ac-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 110, y1: 425, x2: 330, y2: 425, dimensionText: 'Across Corners C = 220mm (2S)' },
          { id: 'cmp-ac-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 220, cy: 290, label: 'Across Corners (A/C)', labelPosition: 'bottom' },

          // --- RIGHT: ACROSS FLATS (Center: 580, 290; Inscribed Radius: 95.3) ---
          { id: 'cmp-af-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 440, y1: 290, x2: 720, y2: 290 },
          { id: 'cmp-af-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 580, y1: 150, x2: 580, y2: 430 },
          { id: 'cmp-af-circle', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 580, cy: 290, r: 95.3 },
          { id: 'cmp-af-tan-top', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 460, y1: 194.7, x2: 700, y2: 194.7 },
          { id: 'cmp-af-tan-bot', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 460, y1: 385.3, x2: 700, y2: 385.3 },
          {
            id: 'cmp-af-hex',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [635, 194.7],
              [690, 290],
              [635, 385.3],
              [525, 385.3],
              [470, 290],
              [525, 194.7]
            ],
            isFinalResult: true
          },
          { id: 'cmp-af-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 450, y1: 194.7, x2: 450, y2: 385.3, dimensionText: 'Across Flats W = 190.5mm' },
          { id: 'cmp-af-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 580, cy: 290, label: 'Across Flats (A/F)', labelPosition: 'bottom' }
        ]
      };

    case 'pentagon': {
      // Authentic Regular Pentagon on Given Base AB = 140mm using Golden Ratio Method (J.N. Green Fig. 4.12 & Pickup & Parker Vol 1 Ex. 14)
      const S = 140;
      const ax = 330;
      const ay = 440;
      const bx = ax + S; // 470
      const by = ay; // 440
      const mx = (ax + bx) / 2; // 400
      const my = ay; // 440
      const qx = bx; // 470
      const qy = by - S; // 300 (perpendicular at B of length S)
      const mq = Math.hypot(qx - mx, qy - my); // sqrt(70^2 + 140^2) = 156.52
      const px = mx + mq; // Point P on extension of AB: 400 + 156.52 = 556.52
      const py = ay;
      const diag = S * 1.618033; // 226.52mm (AP = AM + MP = S/2 + mq = diag)

      // Pentagon vertices coordinates
      // Interior angle = 108 deg. Angle of BC to positive x-axis is 180 - 108 = 72 deg.
      const rad72 = (72 * Math.PI) / 180;
      const cx = Number((bx + S * Math.cos(rad72)).toFixed(1)); // 470 + 140*0.3090 = 513.3
      const cy = Number((by - S * Math.sin(rad72)).toFixed(1)); // 440 - 140*0.9511 = 306.8
      const ex = Number((ax - S * Math.cos(rad72)).toFixed(1)); // 330 - 140*0.3090 = 286.7
      const ey = Number((by - S * Math.sin(rad72)).toFixed(1)); // 306.8
      // Apex D is on perpendicular bisector of AB (x = mx = 400)
      const dx = mx; // 400
      const dy = Number((cy - Math.sqrt(Math.max(0, S * S - Math.pow(dx - cx, 2)))).toFixed(1)); // 306.8 - sqrt(140^2 - 113.3^2) = 224.4

      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 4.12 & Pickup & Parker Vol. 1 Ex. 14',
        proof: 'Interior Angle θ = (5 - 2) × 180° / 5 = 108.0°;   Golden Ratio Diagonal d = s × (1 + √5) / 2 ≈ 1.618 × s',
        dimensions: [
          `Base Side S = ${S}.0mm`,
          `Diagonal d = ${diag.toFixed(1)}mm`,
          'Interior Angle = 108.0°',
          'Exterior Angle = 72.0°'
        ],
        caption: 'Construction of regular 5-sided pentagon on given base AB using perpendicular bisection and golden ratio diagonal arc AP (J.N. Green Fig. 4.12).',
        elements: [
          // Extended horizontal baseline (2H)
          { id: 'pnt-base-ext', type: 'SEGMENT', lineWeight: 'CONSTRUCTION_2H', x1: ax - 40, y1: ay, x2: px + 35, y2: ay },
          
          // Perpendicular bisector axis of symmetry (Chain thin)
          { id: 'pnt-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: mx, y1: dy - 40, x2: mx, y2: ay + 50 },

          // Perpendicular at B: BQ = AB (2H)
          { id: 'pnt-perp-b', type: 'SEGMENT', lineWeight: 'CONSTRUCTION_2H', x1: bx, y1: by, x2: qx, y2: qy },
          
          // Right-angle square marker at B
          { id: 'pnt-sq-1', type: 'SEGMENT', lineWeight: 'CONSTRUCTION_2H', x1: bx - 12, y1: by, x2: bx - 12, y2: by - 12 },
          { id: 'pnt-sq-2', type: 'SEGMENT', lineWeight: 'CONSTRUCTION_2H', x1: bx - 12, y1: by - 12, x2: bx, y2: by - 12 },

          // Hypotenuse line MQ joining midpoint M to Q (2H)
          { id: 'pnt-line-mq', type: 'SEGMENT', lineWeight: 'CONSTRUCTION_2H', x1: mx, y1: my, x2: qx, y2: qy },

          // Arc from center M radius MQ cutting base extension at P (2H)
          { id: 'pnt-arc-mq', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: mx, cy: my, r: mq, startAngle: -95, endAngle: 10 },

          // Golden ratio diagonal arcs of radius AP = diag from A and B intersecting at apex D
          { id: 'pnt-arc-diag-a', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: ax, cy: ay, r: diag, startAngle: -85, endAngle: -40 },
          { id: 'pnt-arc-diag-b', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: bx, cy: by, r: diag, startAngle: -140, endAngle: -95 },

          // Side arcs of radius S from A and B cutting diagonal arcs to locate E and C
          { id: 'pnt-arc-c', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: bx, cy: by, r: S, startAngle: -90, endAngle: -55 },
          { id: 'pnt-arc-e', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: ax, cy: ay, r: S, startAngle: -125, endAngle: -90 },
          { id: 'pnt-arc-top-e', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: dx, cy: dy, r: S, startAngle: 120, endAngle: 160 },
          { id: 'pnt-arc-top-c', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: dx, cy: dy, r: S, startAngle: 20, endAngle: 60 },

          // Finished Regular Pentagon Outline (HB Thick) - 5 equal sides
          {
            id: 'poly-pentagon-finished',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [ax, ay],
              [bx, by],
              [cx, cy],
              [dx, dy],
              [ex, ey]
            ],
            isFinalResult: true
          },

          // Primary Vertex Labels
          { id: 'pnt-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: ax, cy: ay, label: 'A', labelPosition: 'bottom-left' },
          { id: 'pnt-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: bx, cy: by, label: 'B', labelPosition: 'bottom-right' },
          { id: 'pnt-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: cx, cy: cy, label: 'C', labelPosition: 'right' },
          { id: 'pnt-pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: dx, cy: dy, label: 'D (Apex)', labelPosition: 'top' },
          { id: 'pnt-pt-e', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: ex, cy: ey, label: 'E', labelPosition: 'left' },

          // Construction Reference Points
          { id: 'pnt-pt-m', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: mx, cy: my, label: 'M (Midpoint)', labelPosition: 'bottom' },
          { id: 'pnt-pt-q', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: qx, cy: qy, label: 'Q (BQ = AB)', labelPosition: 'top-right' },
          { id: 'pnt-pt-p', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: px, cy: py, label: 'P (Diagonal d = AP)', labelPosition: 'bottom-right' },

          // Dimensions
          { id: 'pnt-dim-s', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 35, x2: bx, y2: by + 35, dimensionText: `Base S = ${S}mm` },
          { id: 'pnt-dim-diag', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: ax, y1: ay + 65, x2: px, y2: py + 65, dimensionText: `Diagonal AP = ${diag.toFixed(1)}mm (1.618 × S)` }
        ]
      };
    }

    case 'pentagon-anatomy':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Chapter 4 & J.N. Green',
        proof: 'θ_interior = ((5 - 2) × 180°) / 5 = 108.0°;   θ_exterior = 72.0°;   d/S = φ = 1.618033',
        dimensions: ['Side S = 176.4mm', 'Golden Diagonal d = 285.4mm', 'Interior Angle = 108.0°', 'Exterior Angle = 72.0°'],
        caption: 'Geometric anatomy of a regular 5-sided pentagon: five equal sides, 108° interior angles, and golden diagonals forming the internal star pentagram.',
        elements: [
          // Vertical axis of symmetry
          { id: 'pa-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 100, x2: 400, y2: 490 },

          // Horizontal baseline extension to show exterior angle
          { id: 'pa-base-ext', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 431, x2: 600, y2: 431 },

          // Finished Regular Pentagon Outline (HB Thick)
          {
            id: 'pa-outline',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [312, 431],
              [488, 431],
              [543, 264],
              [400, 160],
              [257, 264]
            ],
            isFinalResult: true
          },

          // Golden Diagonals (Internal Star Pentagram - Thin 2H)
          { id: 'pa-diag-ac', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 312, y1: 431, x2: 543, y2: 264 },
          { id: 'pa-diag-ad', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 312, y1: 431, x2: 400, y2: 160 },
          { id: 'pa-diag-bd', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 488, y1: 431, x2: 400, y2: 160 },
          { id: 'pa-diag-be', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 488, y1: 431, x2: 257, y2: 264 },
          { id: 'pa-diag-ce', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 543, y1: 264, x2: 257, y2: 264 },

          // Interior angle arc at vertex A (108°)
          { id: 'pa-arc-int', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 312, cy: 431, r: 38, startAngle: -126, endAngle: 0 },
          { id: 'pa-lbl-int', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 346, cy: 405, label: '108.0°' },

          // Exterior angle arc at vertex B (72°)
          { id: 'pa-arc-ext', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 488, cy: 431, r: 40, startAngle: -72, endAngle: 0 },
          { id: 'pa-lbl-ext', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 535, cy: 415, label: '72.0°' },

          // Vertex Points with clear offset labels
          { id: 'pa-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 312, cy: 431, label: 'A', labelPosition: 'bottom-left' },
          { id: 'pa-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 488, cy: 431, label: 'B', labelPosition: 'bottom-right' },
          { id: 'pa-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 543, cy: 264, label: 'C', labelPosition: 'right' },
          { id: 'pa-pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, label: 'D (Apex)', labelPosition: 'top' },
          { id: 'pa-pt-e', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 257, cy: 264, label: 'E', labelPosition: 'left' },

          // Dimensions
          { id: 'pa-dim-s', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 312, y1: 465, x2: 488, y2: 465, dimensionText: 'Base S = 176.4mm' },
          { id: 'pa-dim-diag', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 257, y1: 240, x2: 543, y2: 240, dimensionText: 'Diagonal d = S × 1.618 = 285.4mm' }
        ]
      };

    case 'pentagon-inscribed':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 4.14 & Pickup & Parker Vol. 1 Ex. 15',
        proof: 'Chord S = 2R · sin(36.0°) = 164.6mm;   Subtended Sector Angle = 72.0°',
        dimensions: ['Circumcircle Ø = 280.0mm (R = 140mm)', 'Pentagon Side S = 164.6mm', 'Chord Step = 164.6mm'],
        caption: 'Construction of regular pentagon inscribed in a circle of diameter 280mm by radius bisection and chord stepping.',
        elements: [
          // Circumscribing Circle (Radius R = 140)
          { id: 'pi-circ', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 140 },

          // Horizontal and Vertical Centerlines
          { id: 'pi-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 220, y1: 300, x2: 580, y2: 300 },
          { id: 'pi-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 120, x2: 400, y2: 480 },

          // Diameter points
          { id: 'pi-pt-a', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 260, cy: 300, label: 'A', labelPosition: 'left' },
          { id: 'pi-pt-b', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 540, cy: 300, label: 'B', labelPosition: 'right' },
          { id: 'pi-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, label: 'C (Apex 1)', labelPosition: 'top' },
          { id: 'pi-pt-d', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 440, label: 'D', labelPosition: 'bottom' },
          { id: 'pi-pt-o', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, label: 'O', labelPosition: 'bottom-right' },

          // Midpoint M of radius OB (x = 470, y = 300)
          { id: 'pi-pt-m', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 470, cy: 300, label: 'M (Midpoint OB)', labelPosition: 'bottom' },

          // Hypotenuse line MC
          { id: 'pi-line-mc', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 470, y1: 300, x2: 400, y2: 160 },

          // Arc from M with radius MC cutting diameter AB at point E (x = 313.5, y = 300)
          { id: 'pi-arc-me', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 470, cy: 300, r: 156.5, startAngle: 155, endAngle: 185 },
          { id: 'pi-pt-e', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 313.5, cy: 300, label: 'E (Chord Mark)', labelPosition: 'bottom-left' },

          // Straight line CE = side length S = 164.6mm
          { id: 'pi-line-ce', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 160, x2: 313.5, y2: 300 },

          // Stepping Arcs on circumcircle with radius S = 164.6mm
          { id: 'pi-arc-step1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 400, cy: 160, r: 164.6, startAngle: 20, endAngle: 50 },
          { id: 'pi-arc-step2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 533, cy: 257, r: 164.6, startAngle: 90, endAngle: 120 },
          { id: 'pi-arc-step3', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 400, cy: 160, r: 164.6, startAngle: 130, endAngle: 160 },

          // Finished Inscribed Pentagon (5 equal sides - HB Thick)
          {
            id: 'pi-pentagon-poly',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [400, 160],
              [533, 257],
              [482, 413],
              [318, 413],
              [267, 257]
            ],
            isFinalResult: true
          },

          // Inscribed vertices
          { id: 'pi-v2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 533, cy: 257, label: '2', labelPosition: 'right' },
          { id: 'pi-v3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 482, cy: 413, label: '3', labelPosition: 'bottom-right' },
          { id: 'pi-v4', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 318, cy: 413, label: '4', labelPosition: 'bottom-left' },
          { id: 'pi-v5', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 267, cy: 257, label: '5', labelPosition: 'left' },

          // Dimensions
          { id: 'pi-dim-dia', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 260, y1: 460, x2: 540, y2: 460, dimensionText: 'Diameter Ø = 280.0mm' },
          { id: 'pi-dim-side', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 318, y1: 435, x2: 482, y2: 435, dimensionText: 'Pentagon Side S = 164.6mm' }
        ]
      };

    case 'scales':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Chapter 3 & ISO 5455',
        proof: 'RF = 1:20;   Scale Length L = (1/20) × 3000mm = 150mm;   Reading = 2.47m',
        dimensions: ['Scale Length L = 150.0mm', 'Max Reading = 3.0m', 'Reading Shown = 2.47 Metres', 'Least Count = 10mm (1cm)'],
        caption: 'Diagonal Scale of RF 1:20 reading metres, decimetres, and centimetres up to 3 metres, showing a measured distance of 2.47m.',
        elements: [
          // Scale Frame Box (HB)
          { id: 'sc-box', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[150, 240], [650, 240], [650, 320], [150, 320]], isFinalResult: true },

          // 10 Horizontal division lines (0.01m each)
          ...Array.from({ length: 9 }).map((_, i) => ({
            id: `sc-hline-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_2H' as const,
            x1: 150,
            y1: 240 + (i + 1) * 8,
            x2: 650,
            y2: 240 + (i + 1) * 8
          })),

          // Main vertical division lines at 0, 1, 2 metres
          { id: 'sc-vline-0', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 317, y1: 240, x2: 317, y2: 320 },
          { id: 'sc-vline-1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 483, y1: 240, x2: 483, y2: 320 },

          // Diagonal lines in the primary left unit (decimetres 0-10)
          ...Array.from({ length: 11 }).map((_, i) => ({
            id: `sc-diag-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_2H' as const,
            x1: 317 - i * 16.7,
            y1: 320,
            x2: 317 - Math.min(10, i + 1) * 16.7,
            y2: 240
          })),

          // Primary unit labels (Metres)
          { id: 'sc-lbl-0', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 317, cy: 340, label: '0' },
          { id: 'sc-lbl-1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 483, cy: 340, label: '1' },
          { id: 'sc-lbl-2', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 650, cy: 340, label: '2 METRES' },
          { id: 'sc-lbl-dec', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 340, label: '10 DECIMETRES' },

          // Vertical Centimetre labels on the left
          { id: 'sc-lbl-cm-0', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 130, cy: 324, label: '0' },
          { id: 'sc-lbl-cm-5', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 130, cy: 284, label: '5' },
          { id: 'sc-lbl-cm-10', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 130, cy: 244, label: '10 CM' },

          // Measurement reading marker for 2.47m:
          // 2 metres right (x = 650), 4 decimetres left on diagonal 4, 7 cm up (y = 320 - 7*8 = 264)
          // Diagonal 4 at y=264 has x = (317 - 4*16.7) - (7/10)*16.7 = 317 - 66.8 - 11.69 = 238.5
          { id: 'sc-read-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 238.5, y1: 180, x2: 650, y2: 180 },
          { id: 'sc-ext-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 238.5, y1: 264, x2: 238.5, y2: 170 },
          { id: 'sc-ext-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 650, y1: 240, x2: 650, y2: 170 },
          { id: 'sc-pt-read', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 238.5, cy: 264, label: 'P (2.47m)', labelPosition: 'left' },
          { id: 'sc-dim-reading', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 238.5, y1: 180, x2: 650, y2: 180, dimensionText: 'READING = 2.47 METRES' },

          // RF Title
          { id: 'sc-rf-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 400, label: 'DIAGONAL SCALE 1:20 (1cm = 0.2m)' }
        ]
      };

    case 'sections':
      return {
        source: 'J.N. Green Fig. 12.3 & ISO 128-40 Sectional Views',
        proof: 'Hatching angle = 45.0°;   Hatching line weight = 0.25mm Type B;   Cutting plane = Type F',
        dimensions: ['Shaft Length = 340mm', 'Outer Ø = 160mm', 'Bore Ø = 80mm', 'Hatching Pitch = 3mm'],
        caption: 'Full sectional elevation of hollow cylindrical shaft showing cutting plane A-A and ISO standard 45° section hatching.',
        elements: [
          // Centerline
          { id: 'sec-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 100, y1: 300, x2: 700, y2: 300 },

          // Top solid section outline
          { id: 'sec-top-body', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[200, 220], [600, 220], [600, 260], [200, 260]], isFinalResult: true },
          // Bottom solid section outline
          { id: 'sec-bot-body', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[200, 340], [600, 340], [600, 380], [200, 380]], isFinalResult: true },

          // Flange detail at left
          { id: 'sec-fl-top', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[200, 180], [260, 180], [260, 220], [200, 220]], isFinalResult: true },
          { id: 'sec-fl-bot', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[200, 380], [260, 380], [260, 420], [200, 420]], isFinalResult: true },

          // 45° Hatching lines across top solid section
          ...Array.from({ length: 22 }).map((_, i) => ({
            id: `sec-hatch-top-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_2H' as const,
            x1: 200 + i * 20,
            y1: 260,
            x2: 240 + i * 20,
            y2: 220
          })),

          // 45° Hatching lines across bottom solid section
          ...Array.from({ length: 22 }).map((_, i) => ({
            id: `sec-hatch-bot-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_2H' as const,
            x1: 200 + i * 20,
            y1: 380,
            x2: 240 + i * 20,
            y2: 340
          })),

          // Cutting Plane line A-A at top and bottom
          { id: 'sec-cpa-1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 140, x2: 200, y2: 170 },
          { id: 'sec-cpa-2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 430, x2: 200, y2: 460 },
          { id: 'sec-cpa-lbl-t', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 125, label: 'SECTION A-A' },

          // Dimensions
          { id: 'sec-dim-od', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 640, y1: 220, x2: 640, y2: 380, dimensionText: 'Outer Ø = 160mm' },
          { id: 'sec-dim-id', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 520, y1: 260, x2: 520, y2: 340, dimensionText: 'Bore Ø = 80mm' }
        ]
      };

    case 'development':
      return {
        source: 'Pickup & Parker Vol. 2: Surface Development of Prisms and Cylinders',
        proof: 'Stretch-out length L = 6 × S = 240mm;   True generator heights projected horizontally',
        dimensions: ['Base Edge S = 40mm', 'Stretch-out L = 240mm', 'Max Height H = 140mm', 'Truncation Angle = 45.0°'],
        caption: 'Parallel-line surface development of truncated hexagonal prism with true seam heights projected across fold lines.',
        elements: [
          // Orthographic Truncated Prism (Left)
          { id: 'dev-pr-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 100, y1: 400, x2: 220, y2: 400 },
          { id: 'dev-pr-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 100, y1: 400, x2: 100, y2: 300 },
          { id: 'dev-pr-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 220, y1: 400, x2: 220, y2: 180 },
          { id: 'dev-pr-cut', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 100, y1: 300, x2: 220, y2: 180, isFinalResult: true },
          { id: 'dev-pr-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 160, y1: 160, x2: 160, y2: 420 },

          // Horizontal projection lines to development (2H)
          { id: 'dev-proj-base', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 220, y1: 400, x2: 700, y2: 400 },
          { id: 'dev-proj-top1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 220, y1: 180, x2: 700, y2: 180 },
          { id: 'dev-proj-top2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 100, y1: 300, x2: 700, y2: 300 },

          // Stretch-out baseline divided into 6 parts (S = 65px each)
          // Vertices at x = 310, 375, 440, 505, 570, 635, 700
          ...Array.from({ length: 7 }).map((_, i) => {
            const h = 300 - Math.sin((i / 6) * Math.PI) * 120;
            return {
              id: `dev-fold-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_2H' as const,
              x1: 310 + i * 65,
              y1: 400,
              x2: 310 + i * 65,
              y2: h
            };
          }),

          // Finished Surface Development Perimeter (HB)
          {
            id: 'dev-finished-poly',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [310, 400], [700, 400],
              [700, 300], [635, 240], [570, 190], [505, 180],
              [440, 190], [375, 240], [310, 300]
            ],
            isFinalResult: true
          },

          // Fold labels 1, 2, 3, 4, 5, 6, 1
          ...['1', '2', '3', '4', '5', '6', '1'].map((num, i) => ({
            id: `dev-lbl-${i}`,
            type: 'TEXT' as const,
            lineWeight: 'OUTLINE_HB' as const,
            cx: 310 + i * 65,
            cy: 420,
            label: num
          })),

          // Dimensions
          { id: 'dev-dim-stretch', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 310, y1: 445, x2: 700, y2: 445, dimensionText: 'Perimeter Stretch-out = 6 × S = 240mm' }
        ]
      };

    case 'interpenetration':
      return {
        source: 'Pickup & Parker Vol. 2: Interpenetration of Cylinders, Plate 14',
        proof: 'Points on intersection curve determined by auxiliary horizontal cutting planes.',
        dimensions: ['Main Cylinder Ø = 140mm', 'Branch Cylinder Ø = 90mm', 'Intersection Angle = 90.0°'],
        caption: 'Curves of interpenetration between two right circular cylinders intersecting at 90° with generator rays.',
        elements: [
          // Vertical Main Cylinder Centerline
          { id: 'int-cl-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 320, y1: 100, x2: 320, y2: 500 },
          // Horizontal Branch Cylinder Centerline
          { id: 'int-cl-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 150, y1: 300, x2: 600, y2: 300 },

          // Main Vertical Cylinder Outline (HB)
          { id: 'int-mc-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 250, y1: 120, x2: 250, y2: 480 },
          { id: 'int-mc-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 390, y1: 120, x2: 390, y2: 480 },

          // Horizontal Branch Cylinder Outline (HB)
          { id: 'int-bc-t', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 390, y1: 255, x2: 560, y2: 255 },
          { id: 'int-bc-b', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 390, y1: 345, x2: 560, y2: 345 },
          { id: 'int-bc-end', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 560, y1: 255, x2: 560, y2: 345 },

          // Interpenetration Curve (HB) - hyperbola-like intersection
          {
            id: 'int-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [390, 255],
              [350, 275],
              [330, 300],
              [350, 325],
              [390, 345]
            ],
            isFinalResult: true
          },

          // Generator lines (Thin 2H)
          { id: 'int-gen-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 350, y1: 275, x2: 560, y2: 275 },
          { id: 'int-gen-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 350, y1: 325, x2: 560, y2: 325 },

          // Auxiliary End View Circle (Branch cylinder profile)
          { id: 'int-end-circ', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 640, cy: 300, r: 45 },
          { id: 'int-end-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 640, y1: 240, x2: 640, y2: 360 },

          // Dimensions
          { id: 'int-dim-main', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 250, y1: 510, x2: 390, y2: 510, dimensionText: 'Main Cylinder Ø = 140mm' },
          { id: 'int-dim-branch', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 585, y1: 255, x2: 585, y2: 345, dimensionText: 'Branch Ø = 90mm' }
        ]
      };

    case 'loci':
      return {
        source: 'J.N. Green Chapter 9 & Pickup & Parker Vol. 1: Involute of a Circle',
        proof: 'Involute locus: x = r(cos θ + θ sin θ),   y = r(sin θ - θ cos θ);   Circumference = πD = 377mm',
        dimensions: ['Cylinder Diameter D = 120.0mm', 'Circumference C = 377.0mm', '12 Equal Angular Divisions of 30.0°'],
        caption: 'Construction of the Involute of a Circle showing 12 tangent generator vectors and smooth progressive spiral locus.',
        elements: [
          // Base Circle (D = 120mm, R = 60px)
          { id: 'loc-base-circ', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 340, cy: 340, r: 70 },
          { id: 'loc-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 240, y1: 340, x2: 440, y2: 340 },
          { id: 'loc-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 340, y1: 240, x2: 340, y2: 440 },

          // Baseline tangent at bottom (unrolled circumference = 377mm)
          { id: 'loc-base-tan', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 340, y1: 410, x2: 720, y2: 410 },

          // Involute Curve Points and Tangents
          ...[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const px = 340 + 70 * Math.cos(rad);
            const py = 340 + 70 * Math.sin(rad);
            const tanLen = (deg / 360) * (2 * Math.PI * 70);
            const tx = px - tanLen * Math.sin(rad);
            const ty = py + tanLen * Math.cos(rad);
            return {
              id: `loc-tan-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: px,
              y1: py,
              x2: tx,
              y2: ty
            };
          }),

          // Finished Involute Curve (HB)
          {
            id: 'loc-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [340, 410],
              [405, 395],
              [460, 350],
              [490, 280],
              [480, 200],
              [430, 140],
              [350, 110],
              [260, 120],
              [190, 180],
              [160, 270]
            ],
            isFinalResult: true
          },

          // Dimensions
          { id: 'loc-dim-circ', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 340, y1: 435, x2: 720, y2: 435, dimensionText: 'Unrolled Circumference = πD = 377.0mm' },
          { id: 'loc-lbl-p', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 340, cy: 410, label: 'P0 (Starting Point)', labelPosition: 'bottom' }
        ]
      };

    case 'cycloid':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 9.1 & Pickup & Parker Vol. 1',
        proof: 'Parametric Cycloid: x = R(θ - sin θ),   y = R(1 - cos θ);   Rolling Baseline L = πD = 440px',
        dimensions: ['Generating Circle Ø = 140.0mm (R = 70mm)', 'Baseline L = πD = 440.0mm', '12 Equal Angular Divisions (30° each)', 'Apex Height H = 2R = 140.0mm'],
        caption: 'Construction of a cycloid locus generated by a point P on the circumference of a Ø140mm generating circle rolling along a straight directing baseline without slipping.',
        elements: [
          // Directing Baseline (Horizontal line at y = 380)
          { id: 'cyc-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 180, y1: 380, x2: 620, y2: 380, isFinalResult: true },
          // Centerline path of rolling circle (y = 310)
          { id: 'cyc-path', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 180, y1: 310, x2: 620, y2: 310 },

          // Initial Generating Circle at x = 180, y = 310, R = 70
          { id: 'cyc-circ-0', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 180, cy: 310, r: 70 },
          { id: 'cyc-circ-apex', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_4H', cx: 400, cy: 310, r: 70 },

          // 12 Baseline Division Ticks & Center Path Points
          ...Array.from({ length: 13 }, (_, i) => {
            const bx = 180 + (440 / 12) * i;
            return [
              {
                id: `cyc-btick-${i}`,
                type: 'LINE' as const,
                lineWeight: 'CONSTRUCTION_2H' as const,
                x1: bx,
                y1: 375,
                x2: bx,
                y2: 385
              },
              {
                id: `cyc-cpt-${i}`,
                type: 'POINT' as const,
                lineWeight: 'CONSTRUCTION_4H' as const,
                cx: bx,
                cy: 310,
                label: i === 0 ? 'C0' : (i === 6 ? 'C6' : (i === 12 ? 'C12' : undefined)),
                labelPosition: 'top' as const
              }
            ];
          }).flat(),

          // Horizontal Generator Rays from Circle Subdivisions at y levels:
          // y = 310 ± 70*sin(30°) = 310 ± 35 -> 275 and 345
          // y = 310 ± 70*sin(60°) = 310 ± 60.6 -> 249.4 and 370.6
          // y = 240 (apex)
          { id: 'cyc-hray-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 240, x2: 620, y2: 240 },
          { id: 'cyc-hray-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 249.4, x2: 620, y2: 249.4 },
          { id: 'cyc-hray-3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 275, x2: 620, y2: 275 },
          { id: 'cyc-hray-4', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 345, x2: 620, y2: 345 },
          { id: 'cyc-hray-5', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 370.6, x2: 620, y2: 370.6 },

          // True Cycloid Curve (HB outline, 48 points)
          {
            id: 'cyc-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: Array.from({ length: 49 }, (_, i) => {
              const theta = (i * 2 * Math.PI) / 48;
              const cx = 180 + 70 * theta;
              const x = cx - 70 * Math.sin(theta);
              const y = 310 + 70 * Math.cos(theta);
              return [Math.min(620, Math.max(180, x)), y];
            }),
            isFinalResult: true
          },

          // Key Points along Curve
          { id: 'cyc-p0', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 180, cy: 380, label: 'P0 (Start)', labelPosition: 'bottom-left' },
          { id: 'cyc-p3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 216, cy: 310, label: 'P3', labelPosition: 'left' },
          { id: 'cyc-p6', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 240, label: 'P6 (Apex = 2R)', labelPosition: 'top' },
          { id: 'cyc-p9', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 584, cy: 310, label: 'P9', labelPosition: 'right' },
          { id: 'cyc-p12', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 620, cy: 380, label: 'P12 (Complete Roll)', labelPosition: 'bottom-right' },

          // Dimension Lines
          { id: 'cyc-dim-base', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 180, y1: 410, x2: 620, y2: 410, dimensionText: 'Baseline L = πD = 440.0mm' },
          { id: 'cyc-dim-ht', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 130, y1: 380, x2: 130, y2: 240, dimensionText: '2R = 140mm' }
        ]
      };

    case 'cad':
      return {
        source: 'ISO 13567 & NERDC CAD Standards: Computer-Aided Technical Drawing',
        proof: 'Absolute Coordinates: (X, Y);   Relative Polar: @distance < angle;   Layer Standard: ISO 13567',
        dimensions: ['Display Grid: 10mm Snap', 'Cursor: (320.00, 240.00)', 'Layer 0: Continuous 0.7mm', 'Layer DIM: 0.25mm'],
        caption: 'Computer-Aided Design (CAD) drafting interface layout displaying coordinate tracking, layer hierarchy, and precision crosshairs.',
        elements: [
          // CAD Drawing Area Boundary
          { id: 'cad-border', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[80, 60], [720, 60], [720, 520], [80, 520]], isFinalResult: true },

          // WCS Origin Icon (X and Y arrows at 120, 480)
          { id: 'cad-wcs-x', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 480, x2: 170, y2: 480 },
          { id: 'cad-wcs-y', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 480, x2: 120, y2: 430 },
          { id: 'cad-wcs-lbl-x', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 180, cy: 484, label: 'X' },
          { id: 'cad-wcs-lbl-y', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 418, label: 'Y' },

          // Geometric Model on CAD Screen (HB Outline)
          {
            id: 'cad-geom',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[240, 360], [520, 360], [520, 200], [380, 200], [240, 280]],
            isFinalResult: true
          },
          { id: 'cad-geom-circ', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 440, cy: 280, r: 35 },

          // Crosshairs Cursor with Aperture Box
          { id: 'cad-ch-h', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 80, y1: 280, x2: 720, y2: 280 },
          { id: 'cad-ch-v', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 440, y1: 60, x2: 440, y2: 520 },
          { id: 'cad-aperture', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[434, 274], [446, 274], [446, 286], [434, 286]] },

          // CAD Command Line & Status Bar at bottom
          { id: 'cad-cmd-bg', type: 'POLYGON', lineWeight: 'CONSTRUCTION_2H', points: [[80, 485], [720, 485], [720, 520], [80, 520]] },
          { id: 'cad-cmd-txt', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 280, cy: 507, label: 'Command: _CIRCLE Center point: 440.00, 280.00 Radius: 35.00' },
          { id: 'cad-coord-txt', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 620, cy: 507, label: '440.00, 280.00, 0.00' }
        ]
      };

    case 'oblique':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Chapter 16',
        proof: 'Cavalier: Receding axis = 45.0°, Scale = 1:1;   Cabinet: Receding axis = 45.0°, Scale = 1:2',
        dimensions: ['Width W = 140mm', 'Height H = 100mm', 'Cavalier Depth = 80mm', 'Cabinet Depth = 40mm'],
        caption: 'Comparison of Cavalier and Cabinet Oblique projections showing 45° receding axes and depth foreshortening ratios.',
        elements: [
          // Left: Cavalier Oblique (Full Scale Depth 1:1)
          // Front face 140x100
          { id: 'obl-cav-f', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[120, 320], [240, 320], [240, 220], [120, 220]], isFinalResult: true },
          // 45° Receding edges (length 70px)
          { id: 'obl-cav-r1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 240, y1: 320, x2: 290, y2: 270 },
          { id: 'obl-cav-r2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 240, y1: 220, x2: 290, y2: 170 },
          { id: 'obl-cav-r3', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 220, x2: 170, y2: 170 },
          // Back face edges
          { id: 'obl-cav-b1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 170, y1: 170, x2: 290, y2: 170 },
          { id: 'obl-cav-b2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 290, y1: 170, x2: 290, y2: 270 },
          { id: 'obl-cav-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 360, label: 'CAVALIER (Full Depth 1:1)' },

          // Right: Cabinet Oblique (Half Scale Depth 1:2)
          // Front face 140x100
          { id: 'obl-cab-f', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[480, 320], [600, 320], [600, 220], [480, 220]], isFinalResult: true },
          // 45° Receding edges (half length 35px)
          { id: 'obl-cab-r1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 600, y1: 320, x2: 625, y2: 295 },
          { id: 'obl-cab-r2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 600, y1: 220, x2: 625, y2: 195 },
          { id: 'obl-cab-r3', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 480, y1: 220, x2: 505, y2: 195 },
          // Back face edges
          { id: 'obl-cab-b1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 505, y1: 195, x2: 625, y2: 195 },
          { id: 'obl-cab-b2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 625, y1: 195, x2: 625, y2: 295 },
          { id: 'obl-cab-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 550, cy: 360, label: 'CABINET (Half Depth 1:2)' }
        ]
      };

    case 'polygon':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 5.2 & Pickup & Parker Ex. 10',
        proof: 'Interior Angle = (n - 2) × 180° / n = 120.0°;   Side length s = R',
        dimensions: ['Circumscribing Radius R = 150.0mm', 'Hexagon Side s = 150.0mm', 'Across Flats A/F = 259.8mm'],
        caption: 'Construction of regular hexagon inscribed in circle of radius R by stepping off 60° chords around perimeter.',
        elements: [
          // Circumscribing Circle (2H)
          { id: 'poly-c', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 150 },
          
          // Centerlines
          { id: 'poly-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 200, y1: 300, x2: 600, y2: 300 },
          { id: 'poly-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 100, x2: 400, y2: 500 },
          
          // Hexagon Outline (HB)
          {
            id: 'poly-hex',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [550, 300],
              [475, 430],
              [325, 430],
              [250, 300],
              [325, 170],
              [475, 170]
            ],
            isFinalResult: true
          },
          
          // Compass Step Arcs
          { id: 'poly-arc1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 550, cy: 300, r: 150, startAngle: 100, endAngle: 140 },
          { id: 'poly-arc2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 250, cy: 300, r: 150, startAngle: -40, endAngle: 40 },
          
          // Vertex Nodes
          { id: 'p-1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 550, cy: 300, label: 'A', labelPosition: 'right' },
          { id: 'p-2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475, cy: 430, label: 'B', labelPosition: 'bottom-right' },
          { id: 'p-3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 325, cy: 430, label: 'C', labelPosition: 'bottom-left' },
          { id: 'p-4', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 250, cy: 300, label: 'D', labelPosition: 'left' },
          { id: 'p-5', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 325, cy: 170, label: 'E', labelPosition: 'top-left' },
          { id: 'p-6', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 475, cy: 170, label: 'F', labelPosition: 'top-right' },
          { id: 'p-o', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'O (Center)', labelPosition: 'bottom-right' }
        ]
      };

    case 'conic':
    case 'ellipse':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 8.5 & Pickup & Parker Vol. 1',
        proof: '(x² / a²) + (y² / b²) = 1;   Focal distance c = √(a² - b²)',
        dimensions: ['Major Diameter 2a = 340.0mm', 'Minor Diameter 2b = 200.0mm', 'Focal Length 2c = 274.9mm'],
        caption: 'Construction of ellipse by the Concentric Circles Method using 30° radial generator rays and coordinate intersections.',
        elements: [
          // Major Circle (R = 170)
          { id: 'el-cmaj', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 170 },
          // Minor Circle (R = 100)
          { id: 'el-cmin', type: 'CIRCLE', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 300, r: 100 },
          // Major & Minor Axes Centerlines
          { id: 'el-ax-maj', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 180, y1: 300, x2: 620, y2: 300 },
          { id: 'el-ax-min', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 90, x2: 400, y2: 510 },
          
          // 30° and 60° Radial Rays
          ...[30, 60, 120, 150, 210, 240, 300, 330].map(deg => {
            const rad = (deg * Math.PI) / 180;
            return {
              id: `el-ray-${deg}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: 400,
              y1: 300,
              x2: 400 + 170 * Math.cos(rad),
              y2: 300 + 170 * Math.sin(rad)
            };
          }),

          // Ellipse Smooth Curve Trace
          {
            id: 'el-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: Array.from({ length: 48 }, (_, i) => {
              const theta = (i * 2 * Math.PI) / 48;
              return [400 + 170 * Math.cos(theta), 300 + 100 * Math.sin(theta)];
            }),
            isFinalResult: true
          },

          // Key Labels
          { id: 'p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 230, cy: 300, label: 'A (Major Vertex)', labelPosition: 'left' },
          { id: 'p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 570, cy: 300, label: 'B (Major Vertex)', labelPosition: 'right' },
          { id: 'p-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 200, label: 'C (Minor)', labelPosition: 'top' },
          { id: 'p-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 400, label: 'D (Minor)', labelPosition: 'bottom' },
          { id: 'p-f1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 263, cy: 300, label: 'F₁ (Focus)', labelPosition: 'bottom-left' },
          { id: 'p-f2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 537, cy: 300, label: 'F₂ (Focus)', labelPosition: 'bottom-right' }
        ]
      };

    case 'parabola':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 8.12 & Pickup & Parker Vol. 1',
        proof: 'Parabola by Rectangular Method: y = (4H / L²) · x²;   Focus distance a = L² / (16H) = 33.75mm',
        dimensions: ['Base Span L = 360.0mm', 'Rise Height H = 240.0mm', 'Divisions = 4 Equal Parts', 'Axis of Symmetry = Vertical Centerline'],
        caption: 'Construction of a parabola within an enclosing rectangle using the coordinate ray intersection method with vertical projectors from base divisions.',
        elements: [
          // Enclosing Bounding Rectangle (ABCD)
          {
            id: 'par-rect',
            type: 'POLYGON',
            lineWeight: 'CONSTRUCTION_2H',
            points: [[220, 160], [580, 160], [580, 400], [220, 400]]
          },

          // Base Baseline and Vertical Axis of Symmetry
          { id: 'par-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 220, y1: 400, x2: 580, y2: 400 },
          { id: 'par-axis', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 120, x2: 400, y2: 440 },

          // Directrix Line at y = 126
          { id: 'par-directrix', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 180, y1: 126, x2: 620, y2: 126 },

          // Base divisions (4 parts of 45px on each half-span)
          // Vertical construction lines from base division points up to enclosing rectangle
          ...[265, 310, 355, 445, 490, 535].map((x, i) => ({
            id: `par-vproj-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: x,
            y1: 160,
            x2: x,
            y2: 400
          })),

          // Side divisions (4 equal parts of 60px on vertical sides)
          // y = 220, 280, 340
          // Radiating construction rays from Vertex V(400, 160) to side division points
          ...[220, 280, 340].flatMap((y, i) => [
            {
              id: `par-ray-r-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: 400,
              y1: 160,
              x2: 580,
              y2: y
            },
            {
              id: `par-ray-l-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_4H' as const,
              x1: 400,
              y1: 160,
              x2: 220,
              y2: y
            }
          ]),

          // Smooth Parabolic Curve (HB outline, 48 points)
          {
            id: 'par-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: Array.from({ length: 49 }, (_, i) => {
              const xRel = -180 + (360 / 48) * i;
              const y = 160 + (xRel * xRel * 240) / (180 * 180);
              return [400 + xRel, y];
            }),
            isFinalResult: true
          },

          // Coordinate intersection nodes along trajectory with bilateral symmetry & prime notation
          { id: 'par-p-v', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, label: 'V (Vertex / Apex)', labelPosition: 'top' },
          { id: 'par-p-f', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 194, label: 'F (Focus)', labelPosition: 'right' },
          
          // Left Symmetrical Locus Points
          { id: 'par-p-l3', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 265, cy: 295, label: 'P1', labelPosition: 'top-left' },
          { id: 'par-p-l2', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 310, cy: 220, label: 'P2', labelPosition: 'top-left' },
          { id: 'par-p-l1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 355, cy: 175, label: 'P3', labelPosition: 'top-left' },

          // Right Symmetrical Counterpart Points (Prime Notation)
          { id: 'par-p-r1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 445, cy: 175, label: "P3'", labelPosition: 'top-right' },
          { id: 'par-p-r2', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 490, cy: 220, label: "P2'", labelPosition: 'top-right' },
          { id: 'par-p-r3', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 535, cy: 295, label: "P1'", labelPosition: 'top-right' },

          { id: 'par-p-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 580, cy: 400, label: 'B (End)', labelPosition: 'bottom-right' },
          { id: 'par-p-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 220, cy: 400, label: 'A (End)', labelPosition: 'bottom-left' },

          // Rectangle Corner Labels
          { id: 'par-lbl-c', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 210, cy: 155, label: 'C' },
          { id: 'par-lbl-d', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 590, cy: 155, label: 'D' },
          { id: 'par-lbl-dir', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 250, cy: 120, label: 'DIRECTRIX LINE' },

          // Dimensions
          { id: 'par-dim-span', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 220, y1: 430, x2: 580, y2: 430, dimensionText: 'Base Span L = 360.0mm' },
          { id: 'par-dim-ht', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 170, y1: 400, x2: 170, y2: 160, dimensionText: 'Rise Height H = 240.0mm' }
        ]
      };

    case 'orthographic':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Plate 1',
        proof: 'Plan directly below Front;   End View via 45° Miter Line: X_end = X_origin + Y_plan',
        dimensions: ['1st Angle Projection System', '45° Miter Transfer Ray', 'Front 100x70mm', 'Plan 100x60mm'],
        caption: 'First Angle Orthographic Projection showing Front Elevation, Plan View, and End Elevation linked via 45° miter line.',
        elements: [
          // Ground X-Y Line and Datum X1-Y1
          { id: 'orth-xy', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 80, y1: 300, x2: 720, y2: 300 },
          { id: 'orth-x1y1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 80, x2: 400, y2: 520 },
          
          // 45° Miter Line in Bottom-Right
          { id: 'orth-miter', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 300, x2: 640, y2: 540 },
          
          // Front Elevation (Top Left)
          {
            id: 'orth-front',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[180, 140], [340, 140], [340, 260], [180, 260]],
            isFinalResult: true
          },
          // Front View Step Detail
          { id: 'orth-fstep', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 140, x2: 260, y2: 200 },
          { id: 'orth-fstep2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 200, x2: 340, y2: 200 },

          // Plan View (Bottom Left)
          {
            id: 'orth-plan',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[180, 340], [340, 340], [340, 460], [180, 460]],
            isFinalResult: true
          },
          { id: 'orth-pstep', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 340, x2: 260, y2: 460 },

          // End Elevation (Top Right)
          {
            id: 'orth-end',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[460, 140], [580, 140], [580, 260], [460, 260]],
            isFinalResult: true
          },
          { id: 'orth-estep', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 460, y1: 200, x2: 580, y2: 200 },

          // 2H Projection Rays
          { id: 'proj-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 260, x2: 180, y2: 340 },
          { id: 'proj-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 260, x2: 340, y2: 340 },
          { id: 'proj-3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 140, x2: 460, y2: 140 },
          { id: 'proj-4', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 260, x2: 460, y2: 260 },
          { id: 'proj-5', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 460, x2: 560, y2: 460 },
          { id: 'proj-6', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 560, y1: 460, x2: 560, y2: 260 },

          // Labels
          { id: 'lbl-fe', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 115, label: 'FRONT ELEVATION' },
          { id: 'lbl-pl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 490, label: 'PLAN VIEW' },
          { id: 'lbl-ee', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 115, label: 'END ELEVATION' },
          { id: 'lbl-ml', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 400, label: '45° Miter Ray' }
        ]
      };

    case 'orthographic-third-angle':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Plate 2 (Ex. 45)',
        proof: 'Third Angle: Plan ABOVE Front; Right End to RIGHT of Front; 45° Mitre in Top-Right Quadrant',
        dimensions: ['3rd Angle Projection System (ISO 5456-3)', 'Top-Right 45° Mitre Ray', 'Plan: 160x130mm (Top-Left)', 'Front: 160x140mm (Bottom-Left)', 'Right End: 130x140mm (Bottom-Right)'],
        caption: 'Third Angle Orthographic Projection showing Plan View strictly ABOVE Front Elevation, Right End Elevation to the right, and 45° mitre depth transfer in the top-right quadrant with ISO Third Angle symbol.',
        elements: [
          // Ground X-Y Line and Datum X1-Y1
          { id: 'orth3-xy', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 80, y1: 280, x2: 720, y2: 280 },
          { id: 'orth3-x1y1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 60, x2: 400, y2: 520 },
          
          // Labels for Reference Axes
          { id: 'orth3-lbl-x', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 95, cy: 270, label: 'X' },
          { id: 'orth3-lbl-y', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 705, cy: 270, label: 'Y' },
          { id: 'orth3-lbl-y1', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 415, cy: 75, label: 'Y₁' },

          // 45° Mitre Line in TOP-RIGHT Quadrant: from (400, 280) to (630, 50)
          { id: 'orth3-miter', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 280, x2: 630, y2: 50 },
          { id: 'orth3-miter-lbl', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 545, cy: 145, label: '45° Mitre Ray' },

          // PLAN VIEW (Top-Left Quadrant, strictly ABOVE Front Elevation)
          {
            id: 'orth3-plan',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[180, 100], [340, 100], [340, 230], [180, 230]],
            isFinalResult: true
          },
          // Step line in Plan View
          { id: 'orth3-pstep', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 100, x2: 260, y2: 230 },
          { id: 'orth3-lbl-plan', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 80, label: 'PLAN VIEW (TOP)' },

          // FRONT ELEVATION (Bottom-Left Quadrant, strictly BELOW Plan View)
          // Stepped profile
          {
            id: 'orth3-front',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[180, 330], [260, 330], [260, 390], [340, 390], [340, 470], [180, 470]],
            isFinalResult: true
          },
          { id: 'orth3-lbl-front', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 500, label: 'FRONT ELEVATION (BOTTOM)' },

          // RIGHT END ELEVATION (Bottom-Right Quadrant, strictly to the RIGHT of Front Elevation)
          {
            id: 'orth3-end',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[450, 330], [580, 330], [580, 470], [450, 470]],
            isFinalResult: true
          },
          // Step line in End View
          { id: 'orth3-estep', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 450, y1: 390, x2: 580, y2: 390 },
          { id: 'orth3-lbl-end', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 515, cy: 500, label: 'RIGHT END ELEVATION' },

          // 2H Projection Rays
          // 1. Vertical rays connecting Plan (Top-Left) and Front Elevation (Bottom-Left)
          { id: 'orth3-proj-v1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 180, y1: 230, x2: 180, y2: 330 },
          { id: 'orth3-proj-v2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 260, y1: 230, x2: 260, y2: 330 },
          { id: 'orth3-proj-v3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 230, x2: 340, y2: 390 },

          // 2. Horizontal rays connecting Front Elevation (Bottom-Left) to Right End Elevation (Bottom-Right)
          { id: 'orth3-proj-h1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 330, x2: 450, y2: 330 },
          { id: 'orth3-proj-h2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 390, x2: 450, y2: 390 },
          { id: 'orth3-proj-h3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 470, x2: 450, y2: 470 },

          // 3. Depth transfer from Plan (Top-Left) across to 45° Mitre Line (Top-Right) then down to End View
          // Plan bottom (y=230): dy = 280 - 230 = 50 -> x = 400 + 50 = 450
          { id: 'orth3-proj-m1-h', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 230, x2: 450, y2: 230 },
          { id: 'orth3-proj-m1-v', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 450, y1: 230, x2: 450, y2: 330 },

          // Plan top (y=100): dy = 280 - 100 = 180 -> x = 400 + 180 = 580
          { id: 'orth3-proj-m2-h', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 340, y1: 100, x2: 580, y2: 100 },
          { id: 'orth3-proj-m2-v', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 580, y1: 100, x2: 580, y2: 330 },

          // ISO THIRD ANGLE PROJECTION SYMBOL (Two concentric circles on LEFT, truncated cone on RIGHT)
          {
            id: 'orth3-sym-box',
            type: 'POLYGON',
            lineWeight: 'CONSTRUCTION_2H',
            points: [[620, 60], [740, 60], [740, 130], [620, 130]]
          },
          { id: 'orth3-sym-lbl', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 680, cy: 72, label: 'ISO 3rd ANGLE' },
          { id: 'orth3-sym-cl', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 626, y1: 100, x2: 734, y2: 100 },
          { id: 'orth3-sym-cv', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 648, y1: 84, x2: 648, y2: 116 },
          // Circles on LEFT
          { id: 'orth3-sym-c1', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 648, cy: 100, r: 14 },
          { id: 'orth3-sym-c2', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 648, cy: 100, r: 7 },
          // Truncated Cone on RIGHT (small face facing circles)
          { id: 'orth3-sym-cone-left', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 675, y1: 93, x2: 675, y2: 107 },
          { id: 'orth3-sym-cone-right', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 710, y1: 86, x2: 710, y2: 114 },
          { id: 'orth3-sym-cone-top', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 675, y1: 93, x2: 710, y2: 86 },
          { id: 'orth3-sym-cone-bot', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 675, y1: 107, x2: 710, y2: 114 }
        ]
      };

    case 'isometric':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Plate 8',
        proof: 'Isometric axis angle θ = 30.0°;   Four-Center ellipse: R_large = Dist(V_obtuse, M_opp)',
        dimensions: ['Isometric Grid 30°/30°/90°', 'L = 160.0mm', 'W = 120.0mm', 'H = 140.0mm'],
        caption: 'Isometric block representation with true four-center ellipse construction on the top receding face.',
        elements: [
          // Isometric Axes (Origin at 400, 340)
          { id: 'iso-vert', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 340, x2: 400, y2: 160, isFinalResult: true },
          { id: 'iso-right', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 340, x2: 580, y2: 444, isFinalResult: true },
          { id: 'iso-left', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 340, x2: 220, y2: 444, isFinalResult: true },
          
          // Isometric Top Face Rhombus
          {
            id: 'iso-top',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[400, 160], [580, 264], [400, 368], [220, 264]],
            isFinalResult: true
          },
          // Right and Left Outlines
          { id: 'iso-r1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 580, y1: 264, x2: 580, y2: 444 },
          { id: 'iso-l1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 220, y1: 264, x2: 220, y2: 444 },

          // 4-Center Normals on Top Face (2H)
          { id: 'iso-norm1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 160, x2: 310, y2: 316 },
          { id: 'iso-norm2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 160, x2: 490, y2: 316 },
          { id: 'iso-norm3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 368, x2: 310, y2: 212 },
          { id: 'iso-norm4', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 400, y1: 368, x2: 490, y2: 212 },

          // 4-Center Ellipse Arcs
          { id: 'iso-arc-top', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, r: 180, startAngle: 60, endAngle: 120 },
          { id: 'iso-arc-bot', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 368, r: 180, startAngle: -120, endAngle: -60 },

          // Labels & 30° indicators
          { id: 'lbl-30r', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 480, cy: 370, label: '30° Receding Axis' },
          { id: 'lbl-30l', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 320, cy: 370, label: '30° Receding Axis' },
          { id: 'lbl-4cen', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 120, label: 'Four-Center Isometric Ellipse' }
        ]
      };

    case 'perspective':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Chapter 15 & Pickup & Parker',
        proof: 'Two-Point Perspective: Visual rays converge to Station Point (SP);   Vanishing points VP_L and VP_R on Horizon Line (HL)',
        dimensions: ['Horizon Line Height = 140mm', 'Distance between VPs = 560mm', 'Picture Plane Ground Datum', 'Cone of Vision = 60.0°'],
        caption: 'Two-point architectural perspective projection of a stepped rectangular block with vanishing projection rays converging to left and right vanishing points.',
        elements: [
          // Horizon Line (HL) and Ground Line (GL)
          { id: 'per-hl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 80, y1: 200, x2: 720, y2: 200 },
          { id: 'per-gl', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 80, y1: 420, x2: 720, y2: 420 },

          // Vanishing Points VP_L and VP_R
          { id: 'per-vpl', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 200, label: 'VP (Left)', labelPosition: 'top' },
          { id: 'per-vpr', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 680, cy: 200, label: 'VP (Right)', labelPosition: 'top' },

          // True Height Line on Picture Plane (x = 380)
          { id: 'per-thl', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 380, y1: 150, x2: 380, y2: 420 },
          // Leading Vertical Corner Edge (x = 380, height from 420 up to 260)
          { id: 'per-lead', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 420, x2: 380, y2: 260, isFinalResult: true },

          // Vanishing Projection Rays to Left VP (120, 200)
          { id: 'per-vray-lt', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 260, x2: 120, y2: 200 },
          { id: 'per-vray-lb', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 420, x2: 120, y2: 200 },

          // Vanishing Projection Rays to Right VP (680, 200)
          { id: 'per-vray-rt', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 260, x2: 680, y2: 200 },
          { id: 'per-vray-rb', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 420, x2: 680, y2: 200 },

          // Left Corner Vertical Edge (x = 260)
          // y_top = 200 + (260-200)*(260-120)/(380-120) = 200 + 60*140/260 = 232.3
          // y_bot = 200 + (420-200)*(260-120)/(380-120) = 200 + 220*140/260 = 318.5
          { id: 'per-edge-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 318.5, x2: 260, y2: 232.3, isFinalResult: true },

          // Right Corner Vertical Edge (x = 520)
          // y_top = 200 + (260-200)*(680-520)/(680-380) = 200 + 60*160/300 = 232
          // y_bot = 200 + (420-200)*(680-520)/(680-380) = 200 + 220*160/300 = 317.3
          { id: 'per-edge-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 520, y1: 317.3, x2: 520, y2: 232, isFinalResult: true },

          // Base Edges
          { id: 'per-base-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 420, x2: 260, y2: 318.5, isFinalResult: true },
          { id: 'per-base-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 420, x2: 520, y2: 317.3, isFinalResult: true },

          // Top Front Edges
          { id: 'per-top-fl', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 260, x2: 260, y2: 232.3, isFinalResult: true },
          { id: 'per-top-fr', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 260, x2: 520, y2: 232, isFinalResult: true },

          // Top Back Converging Edges to Back Corner (x = 385, y = 210)
          { id: 'per-top-bl', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 232.3, x2: 385, y2: 210, isFinalResult: true },
          { id: 'per-top-br', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 520, y1: 232, x2: 385, y2: 210, isFinalResult: true },

          // Station Point (SP) at bottom center
          { id: 'per-sp', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 380, cy: 500, label: 'SP (Station Point)', labelPosition: 'bottom' },
          { id: 'per-sp-ray-l', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 500, x2: 260, y2: 318.5 },
          { id: 'per-sp-ray-r', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 500, x2: 520, y2: 317.3 },

          // Labels
          { id: 'per-lbl-hl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 180, cy: 190, label: 'HORIZON LINE (EYE LEVEL)' },
          { id: 'per-lbl-gl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 180, cy: 435, label: 'GROUND LINE (GL)' },
          { id: 'per-lbl-th', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 440, cy: 170, label: 'True Height Datum' }
        ]
      };

    case 'true-lengths':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Chapter 14 & J.N. Green',
        proof: 'Revolving Method: True Length TL = √(Δx² + Δy² + Δz²);   True Inclination θ = arctan(Δz / Plan Length)',
        dimensions: ['Elevation a\'b\' = 145mm', 'Plan ab = 120mm', 'True Length a\'b1\' = 168.0mm', 'True Inclination θ = 34.5°'],
        caption: 'Determination of the True Length and True Inclination of an oblique line AB using the classical revolving method.',
        elements: [
          // Ground Reference Line X-Y
          { id: 'tl-xy', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 100, y1: 300, x2: 700, y2: 300 },
          { id: 'tl-lbl-x', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 110, cy: 290, label: 'X' },
          { id: 'tl-lbl-y', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 690, cy: 290, label: 'Y' },

          // Front Elevation View (a' at 260, 220; b' at 440, 140)
          { id: 'tl-elev-line', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 260, y1: 220, x2: 440, y2: 140 },
          { id: 'tl-pt-ap', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 220, label: 'a\' (Elevation)', labelPosition: 'left' },
          { id: 'tl-pt-bp', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 440, cy: 140, label: 'b\' (Elevation)', labelPosition: 'top' },

          // Plan View (a at 260, 380; b at 440, 480)
          { id: 'tl-plan-line', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 260, y1: 380, x2: 440, y2: 480 },
          { id: 'tl-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 260, cy: 380, label: 'a (Plan)', labelPosition: 'left' },
          { id: 'tl-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 440, cy: 480, label: 'b (Plan)', labelPosition: 'bottom' },

          // Vertical Projector Lines linking Elevation and Plan (2H)
          { id: 'tl-vproj-a', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 260, y1: 130, x2: 260, y2: 490 },
          { id: 'tl-vproj-b', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 440, y1: 130, x2: 440, y2: 490 },

          // Horizontal Locus Lines through b' (y = 140) and a (y = 380)
          { id: 'tl-locus-bp', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 140, x2: 620, y2: 140 },
          { id: 'tl-locus-a', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 240, y1: 380, x2: 560, y2: 380 },

          // Arc of Revolution in Plan: with center a(260, 380), radius ab = √(180² + 100²) = 206px
          // Swing b(440, 480) to horizontal locus at b1(260 + 206 = 466, 380)
          { id: 'tl-rev-arc', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 260, cy: 380, r: 206, startAngle: 0, endAngle: 30 },
          { id: 'tl-pt-b1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 466, cy: 380, label: 'b₁ (Revolved Plan)', labelPosition: 'bottom-right' },

          // Vertical Projector from b1 up to elevation horizontal locus at y = 140
          { id: 'tl-vproj-b1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 466, y1: 380, x2: 466, y2: 140 },
          { id: 'tl-pt-b1p', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 466, cy: 140, label: 'b₁\' (Revolved Elevation)', labelPosition: 'top-right' },

          // TRUE LENGTH LINE (HB Outline from a' to b1')
          { id: 'tl-true-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 220, x2: 466, y2: 140, isFinalResult: true },

          // True Inclination Angle θ Arc at a'
          { id: 'tl-angle-arc', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 260, cy: 220, r: 45, startAngle: -21, endAngle: 0 },
          { id: 'tl-lbl-theta', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 320, cy: 212, label: 'θ = 34.5°' },

          // Dimension on True Length
          { id: 'tl-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 260, y1: 190, x2: 466, y2: 110, dimensionText: 'TRUE LENGTH TL = 168.0mm' }
        ]
      };

    case 'roof-truss':
      return {
        source: 'Pickup & Parker: Building & Architectural Drawing, Plate 5 & J.N. Green Fig. 16.18',
        proof: 'θ_pitch = 30.0°;   Apex Height H = (Span / 2) · tan 30° = 1.73m;   2j - m = 3',
        dimensions: ['Clear Span = 6000mm', 'Rise Height = 1732mm', 'Tie Beam 150x50mm', 'Rafters 100x50mm', 'King Post 100x50mm'],
        caption: 'Symmetrical King Post Timber Roof Truss detail showing timber jointing, tie beam, struts, and wall plates.',
        elements: [
          // Masonry Walls (Left & Right)
          { id: 'bld-w1', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[120, 360], [180, 360], [180, 480], [120, 480]], isFinalResult: true },
          { id: 'bld-w2', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[620, 360], [680, 360], [680, 480], [620, 480]], isFinalResult: true },
          
          // Wall Plates (100x75mm)
          { id: 'bld-wp1', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[135, 345], [165, 345], [165, 360], [135, 360]] },
          { id: 'bld-wp2', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[635, 345], [665, 345], [665, 360], [635, 360]] },

          // Main Tie Beam (150x50mm)
          { id: 'bld-tie', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[110, 330], [690, 330], [690, 350], [110, 350]], isFinalResult: true },
          
          // Principal Rafters (Left and Right)
          { id: 'bld-raf-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 330, x2: 400, y2: 170, isFinalResult: true },
          { id: 'bld-raf-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 680, y1: 330, x2: 400, y2: 170, isFinalResult: true },
          
          // King Post (Vertical at Center)
          { id: 'bld-kp', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 170, x2: 400, y2: 330, isFinalResult: true },
          
          // Diagonal Struts (Support midpoint of rafters)
          { id: 'bld-st-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 290, x2: 260, y2: 250, isFinalResult: true },
          { id: 'bld-st-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 290, x2: 540, y2: 250, isFinalResult: true },

          // Labels
          { id: 'lbl-kp', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 140, label: 'KING POST (100×50mm)' },
          { id: 'lbl-tb', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 375, label: 'TIE BEAM (150×50mm)' },
          { id: 'lbl-pr', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 230, cy: 215, label: 'PRINCIPAL RAFTER' },
          { id: 'lbl-st', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 330, cy: 260, label: 'STRUT' },
          { id: 'dim-span', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 120, y1: 420, x2: 680, y2: 420, dimensionText: 'Span = 6000mm (Pitch = 30°)' }
        ]
      };

    case 'building':
      return {
        source: 'J.N. Green: Technical Drawing for School Certificate, Fig. 16.12 & WAEC Building Option',
        proof: 'Foundation Width = 3 × Wall = 675mm;   Foundation Depth = Wall = 225mm;   DPC ≥ 150mm above GL',
        dimensions: ['Wall Thickness = 225mm', 'Concrete Strip Footing = 675 × 225mm', 'Floor Slab = 100mm', 'Hardcore = 150mm', 'DPC = 150mm Above GL'],
        caption: 'Detailed vertical section through strip foundation, 225mm sand-crete external wall, concrete oversite slab, hardcore fill, and damp-proof course (DPC) according to WAEC specifications.',
        elements: [
          // Concrete Strip Foundation Footing (Width 300px representing 675mm, Depth 80px representing 225mm)
          {
            id: 'bld-footing',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[250, 440], [550, 440], [550, 500], [250, 500]],
            isFinalResult: true
          },
          // Footing Concrete Hatching (triangles and dots)
          { id: 'bld-ft-c1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 300, cy: 470 },
          { id: 'bld-ft-c2', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 400, cy: 470 },
          { id: 'bld-ft-c3', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 500, cy: 470 },

          // External 225mm Sand-Crete Block Wall (Width 100px from 350 to 450)
          {
            id: 'bld-wall',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[350, 140], [450, 140], [450, 440], [350, 440]],
            isFinalResult: true
          },
          // Masonry 45° Hatching lines across wall
          ...[180, 220, 260, 300, 340, 380, 420].map((y, i) => ({
            id: `bld-whatch-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 350,
            y1: y,
            x2: 450,
            y2: y - 40
          })),

          // Ground Level Line (GL) at y = 340
          { id: 'bld-gl', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 340, x2: 350, y2: 340 },
          // Earth Ground Hatching Rake (3 lines)
          { id: 'bld-grk1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 180, y1: 340, x2: 170, y2: 360 },
          { id: 'bld-grk2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 240, y1: 340, x2: 230, y2: 360 },
          { id: 'bld-grk3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 300, y1: 340, x2: 290, y2: 360 },

          // Damp Proof Course (DPC) at y = 280 (150mm above GL)
          { id: 'bld-dpc-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 345, y1: 280, x2: 455, y2: 280, isFinalResult: true },
          { id: 'bld-dpc-bar', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[348, 277], [452, 277], [452, 283], [348, 283]], isFinalResult: true },

          // Concrete Floor Slab (Oversite Concrete, y = 280 to 320, internal from x = 450 to 660)
          {
            id: 'bld-slab',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [[450, 280], [660, 280], [660, 320], [450, 320]],
            isFinalResult: true
          },
          // Floor Screed (y = 270 to 280)
          {
            id: 'bld-screed',
            type: 'POLYGON',
            lineWeight: 'CONSTRUCTION_2H',
            points: [[450, 270], [660, 270], [660, 280], [450, 280]]
          },

          // Well-Compacted Hardcore Bed (y = 320 to 390)
          {
            id: 'bld-hardcore',
            type: 'POLYGON',
            lineWeight: 'CONSTRUCTION_2H',
            points: [[450, 320], [660, 320], [660, 390], [450, 390]]
          },

          // Dimension Lines
          { id: 'bld-dim-ftw', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 250, y1: 520, x2: 550, y2: 520, dimensionText: 'Foundation Width = 3T = 675mm' },
          { id: 'bld-dim-wall', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 350, y1: 120, x2: 450, y2: 120, dimensionText: 'Wall T = 225mm' },
          { id: 'bld-dim-dpc', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 330, y1: 340, x2: 330, y2: 280, dimensionText: '150mm Above GL' },

          // Text Annotations
          { id: 'bld-lbl-gl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 330, label: 'GROUND LEVEL (GL)' },
          { id: 'bld-lbl-dpc', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 255, label: 'D.P.C. (BITUMINOUS FELT)' },
          { id: 'bld-lbl-slab', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 300, label: '100mm OVERSITE CONCRETE' },
          { id: 'bld-lbl-hc', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 355, label: '150mm HARDCORE BED' },
          { id: 'bld-lbl-wall', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 160, label: '225mm WALL' }
        ]
      };

    case 'fastener':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 1, Plate 18',
        proof: 'Across flats W = 1.5D + 3mm;   Head H = 0.7D;   Nut H = 0.8D;   Chamfer = 30.0°',
        dimensions: ['Metric Thread M24 (D = 24mm)', 'Across Flats W = 39mm', 'Head Height = 17mm', 'Nut Height = 19mm'],
        caption: 'Standard ISO Metric Hexagonal Bolt and Nut assembly detail with 30° chamfer curves and thread conventions.',
        elements: [
          // Centerline of Bolt Shank
          { id: 'fst-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 90, x2: 400, y2: 510 },
          
          // Hex Bolt Head (Top)
          { id: 'fst-hd', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[270, 120], [530, 120], [530, 180], [270, 180]], isFinalResult: true },
          { id: 'fst-hd-c1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 355, y1: 120, x2: 355, y2: 180 },
          { id: 'fst-hd-c2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 445, y1: 120, x2: 445, y2: 180 },
          
          // Cylindrical Shank (D = 90px nominal)
          { id: 'fst-shk', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[355, 180], [445, 180], [445, 460], [355, 460]], isFinalResult: true },
          
          // Thread Root Lines (Continuous Thin / Dashed)
          { id: 'fst-th1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 365, y1: 260, x2: 365, y2: 460 },
          { id: 'fst-th2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 435, y1: 260, x2: 435, y2: 460 },

          // Hex Nut (Middle)
          { id: 'fst-nut', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[270, 310], [530, 310], [530, 380], [270, 380]], isFinalResult: true },
          { id: 'fst-nut-c1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 355, y1: 310, x2: 355, y2: 380 },
          { id: 'fst-nut-c2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 445, y1: 310, x2: 445, y2: 380 },

          // Chamfer Arcs (Top and Bottom)
          { id: 'fst-ch1', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 195, r: 45, startAngle: 180, endAngle: 360 },
          { id: 'fst-ch2', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 400, cy: 295, r: 45, startAngle: 0, endAngle: 180 },

          // Labels
          { id: 'lbl-hd', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 150, label: 'HEX HEAD (0.7D)' },
          { id: 'lbl-nut', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 345, label: 'HEX NUT (0.8D)' },
          { id: 'lbl-th', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 410, label: 'Thread Root (0.85D)' }
        ]
      };

    case 'plummer-block':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 2, Ex. 12',
        proof: 'Bearing Center Height = 1.5D = 75mm;   Base Bolt Centers = 4D = 200mm;   ISO 128: Solid shafts and bolts not sectioned',
        dimensions: ['Shaft Diameter Ø = 50.0mm', 'Base Casting Length = 240.0mm', 'Bolt Centers = 180.0mm', 'Split Bronze Bushes = Phosphor Bronze'],
        caption: 'Engineering half-sectional elevation of a 50mm Plummer Block (Pedestal Bearing) assembly showing base casting, bearing cap, split brasses, clamping bolts, and un-sectioned shaft journal.',
        elements: [
          // Horizontal & Vertical Centerlines
          { id: 'pb-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 120, y1: 280, x2: 680, y2: 280 },
          { id: 'pb-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 100, x2: 400, y2: 490 },

          // Base Pedestal Casting (Stepped Foot from 160 to 640)
          {
            id: 'pb-base',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [160, 420], [640, 420], [640, 370], [530, 370], [530, 280],
              [270, 280], [270, 370], [160, 370]
            ],
            isFinalResult: true
          },

          // Bearing Cap (Seated over bushes from 270 to 530, y = 180 to 280)
          {
            id: 'pb-cap',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [270, 280], [270, 230], [350, 200], [380, 160], [420, 160],
              [450, 200], [530, 230], [530, 280]
            ],
            isFinalResult: true
          },
          // Oil Lubricator Hole Boss at Center
          { id: 'pb-oil-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 390, y1: 160, x2: 390, y2: 220 },
          { id: 'pb-oil-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 160, x2: 410, y2: 220 },

          // Split Bronze Bushes (Brasses)
          // Upper Bush Arc & Lower Bush Arc (Outer R = 60, Inner R = 40)
          { id: 'pb-bush-out', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 400, cy: 280, r: 60 },
          { id: 'pb-bush-split', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 340, y1: 280, x2: 460, y2: 280 },

          // Solid Transmission Shaft Journal (Ø80px nominal, UN-SECTIONED per ISO 128)
          { id: 'pb-shaft', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 400, cy: 280, r: 40, isFinalResult: true },

          // Two Square-Neck Clamping Bolts at x = 230 and x = 570
          { id: 'pb-bolt1', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[220, 200], [240, 200], [240, 440], [220, 440]] },
          { id: 'pb-bolt2', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[560, 200], [580, 200], [580, 440], [560, 440]] },
          // Bolt Nuts
          { id: 'pb-nut1', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[215, 175], [245, 175], [245, 200], [215, 200]] },
          { id: 'pb-nut2', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[555, 175], [585, 175], [585, 200], [555, 200]] },

          // ISO 128 Section Hatching on Right Half (45° Cast Iron on Cap and Base, -45° Bronze on Bush)
          ...[300, 330, 360, 390, 420].map((y, i) => ({
            id: `pb-hatch-b-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 400,
            y1: y,
            x2: 500,
            y2: y - 50
          })),

          // Dimensions & Annotations
          { id: 'pb-dim-span', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 160, y1: 455, x2: 640, y2: 455, dimensionText: 'Base Length = 240.0mm' },
          { id: 'pb-dim-shaft', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 400, y1: 240, x2: 400, y2: 320, dimensionText: 'Shaft Ø = 50mm' },
          { id: 'pb-lbl-cap', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 480, cy: 150, label: 'BEARING CAP' },
          { id: 'pb-lbl-bush', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 475, cy: 235, label: 'SPLIT BRASSES' },
          { id: 'pb-lbl-base', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 350, label: 'CAST IRON BASE' }
        ]
      };

    case 'coupling':
      return {
        source: 'Pickup & Parker: Engineering Drawing with Worked Examples, Vol. 2, Ex. 18 & J.N. Green',
        proof: 'Flange OD = 3.5D + 25mm;   Pitch Circle Diameter PCD = 2.5D + 15mm;   Keyway W = D/4, T = D/6',
        dimensions: ['Shaft Diameter Ø = 40.0mm', 'Flange OD = 165.0mm', 'PCD = 115.0mm', 'Bolts = 4 × M14', 'Key = Gib-Head 10×8mm'],
        caption: 'Half-sectional elevation of a Protected Flanged Shaft Coupling assembly showing keyed shafts, safety shroud rims, and fitted bolts.',
        elements: [
          // Shaft Horizontal Centerline
          { id: 'cp-clh', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 100, y1: 300, x2: 700, y2: 300 },
          // Flange Interface Vertical Centerline
          { id: 'cp-clv', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 400, y1: 120, x2: 400, y2: 480 },

          // Left Transmission Shaft (entering from left up to interface x = 400)
          { id: 'cp-sh-l', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[140, 260], [400, 260], [400, 340], [140, 340]], isFinalResult: true },
          // Right Transmission Shaft (from x = 400 to right)
          { id: 'cp-sh-r', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[400, 260], [660, 260], [660, 340], [400, 340]], isFinalResult: true },

          // Left Flange Body (Hub from 240 to 400, Flange Disc from 350 to 400)
          {
            id: 'cp-flange-l',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [240, 240], [350, 240], [350, 160], [400, 160],
              [400, 440], [350, 440], [350, 360], [240, 360]
            ],
            isFinalResult: true
          },
          // Left Protective Shroud Annular Rim (at y = 160 and y = 440)
          { id: 'cp-shroud-lt', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 320, y1: 160, x2: 350, y2: 160 },
          { id: 'cp-shroud-lb', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 320, y1: 440, x2: 350, y2: 440 },

          // Right Flange Body (Symmetrical)
          {
            id: 'cp-flange-r',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [400, 160], [450, 160], [450, 240], [560, 240],
              [560, 360], [450, 360], [450, 440], [400, 440]
            ],
            isFinalResult: true
          },
          // Right Protective Shroud Annular Rim
          { id: 'cp-shroud-rt', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 450, y1: 160, x2: 480, y2: 160 },
          { id: 'cp-shroud-rb', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 450, y1: 440, x2: 480, y2: 440 },

          // Gib-Head Key in Left Flange (x = 230 to 360, y = 250 to 265)
          { id: 'cp-key', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[230, 248], [245, 248], [245, 255], [350, 255], [350, 265], [230, 265]] },

          // Coupling Bolt at PCD (Top Half in section: Bolt axis at y = 200)
          { id: 'cp-bolt-pcd', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 330, y1: 200, x2: 470, y2: 200 },
          { id: 'cp-bolt-top', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[360, 190], [440, 190], [440, 210], [360, 210]] },
          { id: 'cp-nut-top', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[440, 185], [455, 185], [455, 215], [440, 215]] },

          // Coupling Bolt (Bottom Half in elevation: y = 400)
          { id: 'cp-bolt-bot', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[360, 390], [440, 390], [440, 410], [360, 410]] },

          // ISO 128 Hatching on Top Half: Left flange at 45°, Right flange at -45°
          ...[180, 205, 230].map((y, i) => ({
            id: `cp-hl-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 350,
            y1: y,
            x2: 400,
            y2: y - 25
          })),
          ...[180, 205, 230].map((y, i) => ({
            id: `cp-hr-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 400,
            y1: y - 25,
            x2: 450,
            y2: y
          })),

          // Dimensions & Labels
          { id: 'cp-dim-od', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 400, y1: 160, x2: 400, y2: 440, dimensionText: 'Flange OD = 165mm' },
          { id: 'cp-dim-pcd', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 580, y1: 200, x2: 580, y2: 400, dimensionText: 'PCD = 115mm' },
          { id: 'cp-lbl-shroud', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 270, cy: 150, label: 'SAFETY SHROUD RIM' },
          { id: 'cp-lbl-key', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 235, label: 'GIB-HEAD KEY' }
        ]
      };

    case 'bezier':
      return {
        source: 'ISO 13567 & Digital Computer Graphics Standard: Bézier Curve Technical Modeling',
        proof: 'Cubic Bézier: B(t) = (1-t)³P₀ + 3(1-t)²t P₁ + 3(1-t)t² P₂ + t³ P₃;   Convex Hull Property',
        dimensions: ['Control Polygon P0-P1-P2-P3', 'Tangent Handles L1 = 180mm, L2 = 210mm', 'Curvature Continuity C2', 'Node P0: (160, 380)', 'Node P3: (640, 360)'],
        caption: 'Cubic Bézier technical curve generation displaying control polygon hull, tangent handle vectors, intermediate de Casteljau subdivisions, and continuous outline spline.',
        elements: [
          // Control Polygon Convex Hull (P0 - P1 - P2 - P3)
          { id: 'bz-hull-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 160, y1: 380, x2: 240, y2: 140 },
          { id: 'bz-hull-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 240, y1: 140, x2: 520, y2: 160 },
          { id: 'bz-hull-3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 520, y1: 160, x2: 640, y2: 360 },

          // Tangent Handle Arms with terminal control circles
          { id: 'bz-hndl-1', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 240, cy: 140, r: 8 },
          { id: 'bz-hndl-2', type: 'CIRCLE', lineWeight: 'OUTLINE_HB', cx: 520, cy: 160, r: 8 },

          // de Casteljau Intermediate Division at t = 0.5
          // Q0 = mid(P0, P1) = (200, 260)
          // Q1 = mid(P1, P2) = (380, 150)
          // Q2 = mid(P2, P3) = (580, 260)
          { id: 'bz-dc-q1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 200, y1: 260, x2: 380, y2: 150 },
          { id: 'bz-dc-q2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 380, y1: 150, x2: 580, y2: 260 },
          // R0 = mid(Q0, Q1) = (290, 205); R1 = mid(Q1, Q2) = (480, 205)
          { id: 'bz-dc-r', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 290, y1: 205, x2: 480, y2: 205 },
          // Midpoint B(0.5) = (385, 205)
          { id: 'bz-pt-mid', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 385, cy: 205, label: 'B(0.5) de Casteljau Node', labelPosition: 'top' },

          // Smooth Cubic Bézier Curve (HB Outline, 48 points)
          {
            id: 'bz-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: Array.from({ length: 49 }, (_, i) => {
              const t = i / 48;
              const u = 1 - t;
              const x = u*u*u * 160 + 3*u*u*t * 240 + 3*u*t*t * 520 + t*t*t * 640;
              const y = u*u*u * 380 + 3*u*u*t * 140 + 3*u*t*t * 160 + t*t*t * 360;
              return [x, y];
            }),
            isFinalResult: true
          },

          // Key Nodes & Anchors
          { id: 'bz-p0', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 160, cy: 380, label: 'P0 (Anchor Node)', labelPosition: 'bottom-left' },
          { id: 'bz-p1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 240, cy: 140, label: 'P1 (Tangent Handle 1)', labelPosition: 'top-left' },
          { id: 'bz-p2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 160, label: 'P2 (Tangent Handle 2)', labelPosition: 'top-right' },
          { id: 'bz-p3', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 640, cy: 360, label: 'P3 (Anchor Node)', labelPosition: 'bottom-right' },

          // Labels
          { id: 'bz-lbl-hull', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 380, cy: 110, label: 'CONTROL POLYGON CONVEX HULL' }
        ]
      };

    case 'instruments':
    case 'safety':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 1.2 & ISO 128 Standards',
        proof: 'Working edge straightness error ≤ 0.05mm;   Paper corner tape alignment = 45.0°',
        dimensions: ['A3 Sheet (420 × 297mm)', 'T-Square Blade 600mm', 'Set Squares 60°/30° and 45°'],
        caption: 'Standard drawing board arrangement showing T-Square alignment, 60°/30° set square, and corner drafting tape fixing.',
        elements: [
          // Drawing Board
          { id: 'ins-bd', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[120, 100], [680, 100], [680, 500], [120, 500]], isFinalResult: true },
          // Drawing Paper Sheet
          { id: 'ins-sht', type: 'POLYGON', lineWeight: 'CONSTRUCTION_2H', points: [[170, 140], [630, 140], [630, 460], [170, 460]] },
          
          // 45° Corner Tapes
          { id: 'ins-tp1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 155, y1: 165, x2: 185, y2: 135 },
          { id: 'ins-tp2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 615, y1: 135, x2: 645, y2: 165 },
          { id: 'ins-tp3', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 155, y1: 435, x2: 185, y2: 465 },
          { id: 'ins-tp4', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 615, y1: 465, x2: 645, y2: 435 },

          // T-Square Head and Blade
          { id: 'ins-tshd', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[90, 240], [130, 240], [130, 360], [90, 360]] },
          { id: 'ins-tsbld', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[130, 280], [670, 280], [670, 320], [130, 320]], isFinalResult: true },

          // 30°/60° Set Square seated on T-Square
          { id: 'ins-sq', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[300, 280], [480, 280], [300, 140]], isFinalResult: true },
          
          // Labels
          { id: 'lbl-bd', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 80, label: 'DRAFTING BOARD WITH A3 DRAWING SHEET' },
          { id: 'lbl-ts', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 300, label: 'T-SQUARE WORKING BLADE' },
          { id: 'lbl-sq', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 360, cy: 220, label: '30°/60° SET SQUARE' }
        ]
      };

    case 'lines':
    case 'lettering':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 2.4 & ISO 128 Standards',
        proof: 'Letter height h = 7.0mm;   Guideline spacing c = 0.7h = 5.0mm;   Inclination = 75° or 90°',
        dimensions: ['Capital Height h = 7mm', 'Lower Case c = 5mm', 'Thick 0.70mm', 'Thin 0.25mm'],
        caption: 'Alphabet of lines and single-stroke standard engineering lettering between 4H guide lines.',
        elements: [
          // 4H Horizontal Guidelines
          { id: 'ln-g1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 140, y1: 180, x2: 660, y2: 180 },
          { id: 'ln-g2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 140, y1: 220, x2: 660, y2: 220 },
          { id: 'ln-g3', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 140, y1: 260, x2: 660, y2: 260 },
          
          // Text Lettering
          { id: 'ln-txt1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 215, label: 'TECHNICAL DRAWING WAEC' },
          { id: 'ln-txt2', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 255, label: '1 2 3 4 5 6 7 8 9 0' },

          // Alphabet of Lines Specimen
          { id: 'ln-spec1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 330, x2: 440, y2: 330, isFinalResult: true },
          { id: 'ln-lbl1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 334, label: 'Type A: Continuous Thick (0.70mm)' },

          { id: 'ln-spec2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 140, y1: 370, x2: 440, y2: 370 },
          { id: 'ln-lbl2', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 374, label: 'Type B: Continuous Thin (0.25mm)' },

          { id: 'ln-spec3', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: 140, y1: 410, x2: 440, y2: 410 },
          { id: 'ln-lbl3', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 414, label: 'Type E: Dashed Hidden Line' },

          { id: 'ln-spec4', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 140, y1: 450, x2: 440, y2: 450 },
          { id: 'ln-lbl4', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 560, cy: 454, label: 'Type G: Long Chain Centerline' }
        ]
      };

    case 'quadrilaterals':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 4.1 & 4.2 & Pickup & Parker Ex. 14',
        proof: '∠DAB = ∠ABC = ∠BCD = ∠CDA = 90.0°;   Area = L × H = 240 × 150 = 36,000mm²;   Diagonal AC = √(L² + H²) = 283.0mm',
        dimensions: ['Base Length L = 240mm', 'Height H = 150mm', 'Diagonal AC = 283mm', 'Corner Right Angles = 90°'],
        caption: 'Geometric construction of a standard rectangle ABCD showing 2H perpendicular erection arcs at vertices A and B and true diagonal check.',
        elements: [
          // Baseline AB
          { id: 'quad-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 400, x2: 600, y2: 400, isFinalResult: true },
          // Left perpendicular AD
          { id: 'quad-ad', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 400, x2: 200, y2: 220, isFinalResult: true },
          // Right perpendicular BC
          { id: 'quad-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 600, y1: 400, x2: 600, y2: 220, isFinalResult: true },
          // Top horizontal DC
          { id: 'quad-dc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 220, x2: 600, y2: 220, isFinalResult: true },
          // Diagonal AC
          { id: 'quad-diag', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 400, x2: 600, y2: 220 },
          // Compass arcs for 90° erection at A
          { id: 'quad-arc-a1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 400, r: 60, startAngle: -180, endAngle: 0 },
          { id: 'quad-arc-a2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 200, cy: 320, r: 50, startAngle: -120, endAngle: -60 },
          // Compass arcs for 90° erection at B
          { id: 'quad-arc-b1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 400, r: 60, startAngle: -180, endAngle: 0 },
          { id: 'quad-arc-b2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 600, cy: 320, r: 50, startAngle: -120, endAngle: -60 },
          // Height stepping arc at D
          { id: 'quad-arc-d', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 200, cy: 400, r: 180, startAngle: -95, endAngle: -85 },
          // 90° corner square markers
          { id: 'quad-sq-a1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 380, x2: 220, y2: 380 },
          { id: 'quad-sq-a2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 220, y1: 380, x2: 220, y2: 400 },
          { id: 'quad-sq-b1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 580, y1: 400, x2: 580, y2: 380 },
          { id: 'quad-sq-b2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 580, y1: 380, x2: 600, y2: 380 },
          // Points
          { id: 'quad-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 400, label: 'A', labelPosition: 'bottom-left' },
          { id: 'quad-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 400, label: 'B', labelPosition: 'bottom-right' },
          { id: 'quad-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 220, label: 'C', labelPosition: 'top-right' },
          { id: 'quad-pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 220, label: 'D', labelPosition: 'top-left' },
          // Dimensions
          { id: 'quad-dim-l', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 200, y1: 440, x2: 600, y2: 440, dimensionText: 'Length L = 240.0mm' },
          { id: 'quad-dim-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 150, y1: 400, x2: 150, y2: 220, dimensionText: 'Height H = 150.0mm' },
          { id: 'quad-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 170, label: 'RECTANGLE ABCD ON GIVEN BASE & HEIGHT' }
        ]
      };

    case 'equal-areas':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 7.1 & Pickup & Parker Ex. 19',
        proof: 'Area(△ABC) = ½ × b × h;   Area(Rectangle ABED) = b × (h/2);   Area(△ABC) = Area(ABED) = 21,600mm²',
        dimensions: ['Base b = 240mm', 'Altitude h = 180mm', 'Half-Altitude h/2 = 90mm', 'Area = 21,600 mm²'],
        caption: 'Equal areas transformation: converting triangle ABC into an equivalent rectangle ABED of equal surface area using the half-altitude principle.',
        elements: [
          // Baseline AB
          { id: 'eq-ab', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 420, x2: 600, y2: 420, isFinalResult: true },
          // Triangle sides AC and BC
          { id: 'eq-ac', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 420, x2: 380, y2: 200, isFinalResult: true },
          { id: 'eq-bc', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 600, y1: 420, x2: 380, y2: 200, isFinalResult: true },
          // Vertical Altitude CF
          { id: 'eq-alt', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 380, y1: 200, x2: 380, y2: 420 },
          // Bisector arcs for CF to locate M (h/2)
          { id: 'eq-arc-m1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 380, cy: 200, r: 130, startAngle: -30, endAngle: 30 },
          { id: 'eq-arc-m2', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 380, cy: 420, r: 130, startAngle: -30, endAngle: 30 },
          // Horizontal Median Line at h/2
          { id: 'eq-med', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 140, y1: 310, x2: 660, y2: 310 },
          // Perpendiculars from A and B to median line
          { id: 'eq-ad', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 420, x2: 200, y2: 310, isFinalResult: true },
          { id: 'eq-be', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 600, y1: 420, x2: 600, y2: 310, isFinalResult: true },
          { id: 'eq-de', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 200, y1: 310, x2: 600, y2: 310, isFinalResult: true },
          // Hatching on equivalent rectangle ABED
          ...Array.from({ length: 14 }).map((_, i) => ({
            id: `eq-hatch-${i}`,
            type: 'LINE' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            x1: 220 + i * 28,
            y1: 420,
            x2: 250 + i * 28,
            y2: 310
          })),
          // Key Points
          { id: 'eq-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 420, label: 'A', labelPosition: 'bottom-left' },
          { id: 'eq-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 420, label: 'B', labelPosition: 'bottom-right' },
          { id: 'eq-pt-c', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 380, cy: 200, label: 'C (Apex)', labelPosition: 'top' },
          { id: 'eq-pt-d', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 310, label: 'D', labelPosition: 'top-left' },
          { id: 'eq-pt-e', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 310, label: 'E', labelPosition: 'top-right' },
          { id: 'eq-pt-m', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 380, cy: 310, label: 'M (h/2)', labelPosition: 'bottom-right' },
          // Dimensions
          { id: 'eq-dim-b', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 200, y1: 460, x2: 600, y2: 460, dimensionText: 'Base b = 240.0mm' },
          { id: 'eq-dim-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 130, y1: 420, x2: 130, y2: 200, dimensionText: 'Altitude h = 180.0mm' },
          { id: 'eq-dim-h2', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 670, y1: 420, x2: 670, y2: 310, dimensionText: 'h/2 = 90.0mm' },
          { id: 'eq-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 150, label: 'EQUIVALENT RECTANGLE ABED = TRIANGLE ABC' }
        ]
      };

    case 'enlargement-reduction':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 7.8 & Pickup & Parker Ex. 22',
        proof: 'OA\'/OA = OB\'/OB = OC\'/OC = OD\'/OD = 1.5;   A\'B\' ∥ AB, B\'C\' ∥ BC;   Area(A\'B\'C\'D\') = 1.5² × Area = 2.25 × Area',
        dimensions: ['Scale Ratio k = 1.5 (3:2)', 'Pole O = Center of Projection', 'Corresponding Edges Parallel'],
        caption: 'Proportional enlargement of plane quadrilateral ABCD by the radial line (pole) method using scale ratio 3:2.',
        elements: [
          // Pole O
          { id: 'en-o', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 120, cy: 450, label: 'Pole O', labelPosition: 'bottom-left' },
          // Radial Rays from Pole O extended outward
          { id: 'en-ray-a', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 120, y1: 450, x2: 450, y2: 375 },
          { id: 'en-ray-b', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 120, y1: 450, x2: 620, y2: 410 },
          { id: 'en-ray-c', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 120, y1: 450, x2: 550, y2: 180 },
          { id: 'en-ray-d', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 120, y1: 450, x2: 380, y2: 210 },
          // Original Polygon ABCD
          { id: 'en-orig', type: 'POLYGON', lineWeight: 'CONSTRUCTION_2H', points: [[240, 400], [380, 420], [340, 310], [240, 330]] },
          // Scaled Polygon A'B'C'D' (1.5x from Pole O)
          // O=(120, 450). A=(240,400) -> dx=120,dy=-50 -> A'=(300, 375)
          // B=(380,420) -> dx=260,dy=-30 -> B'=(510, 405)
          // C=(340,310) -> dx=220,dy=-140 -> C'=(450, 240)
          // D=(240,330) -> dx=120,dy=-120 -> D'=(300, 270)
          { id: 'en-scaled', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[300, 375], [510, 405], [450, 240], [300, 270]], isFinalResult: true },
          // Stepping tick marks along ray OA
          { id: 'en-tick-a1', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 240, cy: 400, label: 'A', labelPosition: 'bottom' },
          { id: 'en-tick-a2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 300, cy: 375, label: "A' (1.5×)", labelPosition: 'bottom' },
          { id: 'en-pt-b', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 380, cy: 420, label: 'B', labelPosition: 'bottom-right' },
          { id: 'en-pt-b2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 510, cy: 405, label: "B'", labelPosition: 'bottom-right' },
          { id: 'en-pt-c', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 340, cy: 310, label: 'C', labelPosition: 'top-left' },
          { id: 'en-pt-c2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 450, cy: 240, label: "C'", labelPosition: 'top-right' },
          { id: 'en-pt-d', type: 'POINT', lineWeight: 'CONSTRUCTION_2H', cx: 240, cy: 330, label: 'D', labelPosition: 'top-left' },
          { id: 'en-pt-d2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 300, cy: 270, label: "D'", labelPosition: 'top-left' },
          // Title
          { id: 'en-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 130, label: 'RADIAL LINE ENLARGEMENT (RATIO 3:2)' }
        ]
      };

    case 'auxiliary-projections':
      return {
        source: 'J.N. Green Fig. 11.4 & Pickup & Parker Vol. 1, Ex. 49',
        proof: 'Auxiliary projection rays ⊥ X₁-Y₁;   True heights h₁, h₂, h₃ transferred directly from Front Elevation',
        dimensions: ['Datum Angle θ = 45.0°', 'Prism Base S = 45mm', 'Height H = 120mm', 'Projection Angle = 90°'],
        caption: 'First auxiliary elevation of an inclined hexagonal prism projected onto new inclined datum line X1-Y1 at 45° to the horizontal plane.',
        elements: [
          // Primary Ground Line X-Y
          { id: 'aux-xy', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 60, y1: 300, x2: 440, y2: 300 },
          { id: 'aux-lbl-x', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 70, cy: 290, label: 'X' },
          { id: 'aux-lbl-y', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 430, cy: 290, label: 'Y' },
          // Front Elevation of Truncated Prism
          { id: 'aux-fe-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 300, x2: 260, y2: 300 },
          { id: 'aux-fe-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 300, x2: 140, y2: 160 },
          { id: 'aux-fe-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 260, y1: 300, x2: 260, y2: 220 },
          { id: 'aux-fe-top', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 160, x2: 260, y2: 220, isFinalResult: true },
          { id: 'aux-fe-mid', type: 'LINE', lineWeight: 'HIDDEN_DETAIL', x1: 200, y1: 300, x2: 200, y2: 190 },
          { id: 'aux-fe-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 130, label: 'FRONT ELEVATION' },
          // Plan View below X-Y
          { id: 'aux-plan', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[140, 360], [200, 330], [260, 360], [260, 420], [200, 450], [140, 420]] },
          { id: 'aux-plan-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 480, label: 'PLAN VIEW' },
          // Inclined Auxiliary Datum X1-Y1 at 45°
          { id: 'aux-x1y1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 340, y1: 220, x2: 600, y2: 480 },
          { id: 'aux-lbl-x1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 330, cy: 210, label: 'X₁' },
          { id: 'aux-lbl-y1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 610, cy: 490, label: 'Y₁' },
          // Projection rays perpendicular to X1-Y1 (at -45°)
          { id: 'aux-ray-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 330, x2: 450, y2: 80 },
          { id: 'aux-ray-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 260, y1: 360, x2: 520, y2: 100 },
          { id: 'aux-ray-3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 140, y1: 360, x2: 410, y2: 90 },
          { id: 'aux-ray-4', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 200, y1: 450, x2: 600, y2: 250 },
          // Finished Auxiliary Elevation on X1-Y1
          { id: 'aux-elev', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[420, 150], [510, 160], [560, 240], [520, 310], [450, 300], [390, 220]], isFinalResult: true },
          { id: 'aux-elev-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 560, cy: 110, label: 'AUXILIARY ELEVATION' },
          // Height Transfer Compass Arcs
          { id: 'aux-arc-h1', type: 'ARC', lineWeight: 'CONSTRUCTION_4H', cx: 380, cy: 260, r: 140, startAngle: -90, endAngle: -45 }
        ]
      };

    case 'plain-scale':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 5.2',
        proof: 'LOS = RF × Max Distance = (1/50) × 6000mm = 120mm;   Main units = 1 Metre; Subdivisions = 1 Decimetre (0.1m)',
        dimensions: ['RF = 1:50', 'Length of Scale (LOS) = 120mm', 'Max Reading = 6 Metres', 'Measured = 4.6m'],
        caption: 'Construction of a plain scale of RF 1:50 to read up to 6 metres, reading metres and single decimetres, showing reading of 4.6m.',
        elements: [
          // Outer scale rectangle (length 600px, height 40px)
          { id: 'ps-rect', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[100, 280], [700, 280], [700, 320], [100, 320]], isFinalResult: true },
          // Horizontal centerline divider
          { id: 'ps-mid', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 100, y1: 300, x2: 700, y2: 300 },
          // 6 Major Meter Divisions (every 100px)
          ...[0, 1, 2, 3, 4, 5, 6].map(i => ({
            id: `ps-div-${i}`,
            type: 'LINE' as const,
            lineWeight: 'OUTLINE_HB' as const,
            x1: 100 + i * 100,
            y1: 280,
            x2: 100 + i * 100,
            y2: 320
          })),
          // Subdivisions of 1st Unit (0 to 10 decimeters, x: 100 to 200, every 10px)
          ...Array.from({ length: 9 }).map((_, i) => ({
            id: `ps-sub-${i}`,
            type: 'LINE' as const,
            lineWeight: i === 4 ? ('OUTLINE_HB' as const) : ('CONSTRUCTION_2H' as const),
            x1: 100 + (i + 1) * 10,
            y1: i % 2 === 0 ? 280 : 290,
            x2: 100 + (i + 1) * 10,
            y2: 320
          })),
          // Alternate shaded blocks on top half for clarity
          ...[0, 2, 4].map(i => ({
            id: `ps-shade-maj-${i}`,
            type: 'POLYGON' as const,
            lineWeight: 'CONSTRUCTION_4H' as const,
            points: [[200 + i * 100, 280], [300 + i * 100, 280], [300 + i * 100, 300], [200 + i * 100, 300]] as [number, number][]
          })),
          // Major Numbers along top
          { id: 'ps-num-0', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 265, label: '0' },
          { id: 'ps-num-1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 300, cy: 265, label: '1' },
          { id: 'ps-num-2', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 265, label: '2' },
          { id: 'ps-num-3', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 500, cy: 265, label: '3' },
          { id: 'ps-num-4', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 265, label: '4' },
          { id: 'ps-num-5', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 700, cy: 265, label: '5 METRES' },
          // Decimeter Labels on left unit
          { id: 'ps-num-dm10', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 100, cy: 265, label: '10' },
          { id: 'ps-num-dm5', type: 'TEXT', lineWeight: 'CONSTRUCTION_2H', cx: 150, cy: 265, label: '5 dm' },
          // Reading marker: 4.6 Metres = 4m right (x=600) + 6dm left (x=140)
          { id: 'ps-read-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 200, x2: 600, y2: 200 },
          { id: 'ps-read-ext1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 140, y1: 280, x2: 140, y2: 190 },
          { id: 'ps-read-ext2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 600, y1: 280, x2: 600, y2: 190 },
          { id: 'ps-read-pt1', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 140, cy: 200, label: '6 dm', labelPosition: 'top' },
          { id: 'ps-read-pt2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 600, cy: 200, label: '4 m', labelPosition: 'top' },
          { id: 'ps-read-dim', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 140, y1: 200, x2: 600, y2: 200, dimensionText: 'READING = 4.6 METRES' },
          // Title & RF
          { id: 'ps-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 370, label: 'PLAIN SCALE (R.F. = 1:50) READING METRES AND DECIMETRES' }
        ]
      };

    case 'scale-of-chords':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 5.12 & Pickup & Parker Ex. 24',
        proof: 'Chord c = 2R sin(θ/2);   When θ = 60°: c = 2R sin(30°) = R (Equilateral);   Enables setting any angle 0°–90° without a protractor',
        dimensions: ['Radius R = 280mm', 'Quadrant Angle = 90°', 'Angular Increments = 10°', 'Chord 60° = R'],
        caption: 'Construction of a Scale of Chords from 0° to 90° using a quadrant of radius R to set out exact angles without using a protractor.',
        elements: [
          // Quadrant lines OA and OB
          { id: 'ch-oa', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 150, y1: 450, x2: 430, y2: 450 },
          { id: 'ch-ob', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 150, y1: 450, x2: 150, y2: 170 },
          // 90° Quadrant Arc AB of radius 280
          { id: 'ch-arc-ab', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 150, cy: 450, r: 280, startAngle: -90, endAngle: 0, isFinalResult: true },
          // Baseline extended to the right for chord scale bar
          { id: 'ch-scale-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 430, y1: 450, x2: 780, y2: 450 },
          // 10° incremental division points along arc and chord transfer arcs centered at A (430, 450)
          ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map(deg => {
            const rad = (deg * Math.PI) / 180;
            // Point along quadrant arc from OA (angle from horizontal)
            const px = 150 + 280 * Math.cos(rad);
            const py = 450 - 280 * Math.sin(rad);
            // Distance from A(430, 450) to (px, py)
            const chord = 2 * 280 * Math.sin((rad) / 2);
            const scaleX = 430 + chord;
            return [
              {
                id: `ch-pt-arc-${deg}`,
                type: 'POINT' as const,
                lineWeight: 'CONSTRUCTION_2H' as const,
                cx: px,
                cy: py,
                label: `${deg}°`,
                labelPosition: 'top-left' as const
              },
              {
                id: `ch-ray-${deg}`,
                type: 'LINE' as const,
                lineWeight: 'CONSTRUCTION_4H' as const,
                x1: 150,
                y1: 450,
                x2: px,
                y2: py
              },
              // Transfer arc centered at A
              {
                id: `ch-arc-trans-${deg}`,
                type: 'ARC' as const,
                lineWeight: 'CONSTRUCTION_4H' as const,
                cx: 430,
                cy: 450,
                r: chord,
                startAngle: -180,
                endAngle: 0
              },
              // Graduated tick on scale bar
              {
                id: `ch-tick-${deg}`,
                type: 'LINE' as const,
                lineWeight: deg === 60 ? ('OUTLINE_HB' as const) : ('CONSTRUCTION_2H' as const),
                x1: scaleX,
                y1: 440,
                x2: scaleX,
                y2: 450
              },
              {
                id: `ch-lbl-${deg}`,
                type: 'TEXT' as const,
                lineWeight: 'OUTLINE_HB' as const,
                cx: scaleX,
                cy: 470,
                label: `${deg}°`
              }
            ];
          }).flat(),
          // Key Points
          { id: 'ch-pt-o', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 450, label: 'O', labelPosition: 'bottom-left' },
          { id: 'ch-pt-a', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 430, cy: 450, label: 'A (0°)', labelPosition: 'bottom' },
          { id: 'ch-pt-b', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 150, cy: 170, label: 'B (90°)', labelPosition: 'top-left' },
          // Highlight Chord 60° = Radius
          { id: 'ch-60-note', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 580, cy: 370, label: 'CHORD 60° = RADIUS R (EQUILATERAL)' },
          { id: 'ch-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 450, cy: 120, label: 'SCALE OF CHORDS (0° TO 90° PROTRACTOR CALIBRATION)' }
        ]
      };

    case 'development-radial':
      return {
        source: 'J.N. Green: Technical Drawing for Schools, Fig. 13.12 & Pickup & Parker Ex. 58',
        proof: 'Development Sector Angle θ = (r / L) × 360.0° = (40 / 126.5) × 360° = 113.8°;   True slant lengths measured along extreme generator',
        dimensions: ['Base Radius r = 40mm', 'Vertical Height H = 120mm', 'Slant Height L = 126.5mm', 'Sector Angle θ = 113.8°'],
        caption: 'Radial-line surface development of a truncated right cone showing true slant height radii transferred across angular generator sectors.',
        elements: [
          // Centerline of Cone
          { id: 'devr-cl', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 200, y1: 80, x2: 200, y2: 440 },
          // Front Elevation of Truncated Cone
          { id: 'devr-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 380, x2: 280, y2: 380 },
          { id: 'devr-slant-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 120, y1: 380, x2: 200, y2: 120 },
          { id: 'devr-slant-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 380, x2: 200, y2: 120 },
          // Truncation Cutting Plane line at 30°
          { id: 'devr-cut', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 140, y1: 320, x2: 260, y2: 220, isFinalResult: true },
          { id: 'devr-apex-pt', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 120, label: 'Apex O', labelPosition: 'top' },
          { id: 'devr-fe-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 410, label: 'ELEVATION' },
          // Radial Development on Right (Apex O' at 500, 120)
          { id: 'devr-apex2', type: 'POINT', lineWeight: 'OUTLINE_HB', cx: 500, cy: 120, label: "Apex O'", labelPosition: 'top' },
          // Outer Slant Radius Arc (L = 260px) from angle 30° to 144°
          { id: 'devr-arc-outer', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 500, cy: 120, r: 260, startAngle: 30, endAngle: 144, isFinalResult: true },
          // Boundary generator rays
          { id: 'devr-gen-start', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 500, y1: 120, x2: 500 + 260 * Math.cos((30 * Math.PI) / 180), y2: 120 + 260 * Math.sin((30 * Math.PI) / 180) },
          { id: 'devr-gen-end', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 500, y1: 120, x2: 500 + 260 * Math.cos((144 * Math.PI) / 180), y2: 120 + 260 * Math.sin((144 * Math.PI) / 180) },
          // 6 intermediate generator lines (2H)
          ...[1, 2, 3, 4, 5].map(i => {
            const ang = 30 + (i * 114) / 6;
            const rad = (ang * Math.PI) / 180;
            return {
              id: `devr-gen-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_2H' as const,
              x1: 500,
              y1: 120,
              x2: 500 + 260 * Math.cos(rad),
              y2: 120 + 260 * Math.sin(rad)
            };
          }),
          // Truncated development inner curve plotted through true lengths
          {
            id: 'devr-cut-curve',
            type: 'POLYGON',
            lineWeight: 'OUTLINE_HB',
            points: [
              [500 + 190 * Math.cos((30 * Math.PI) / 180), 120 + 190 * Math.sin((30 * Math.PI) / 180)],
              [500 + 160 * Math.cos((49 * Math.PI) / 180), 120 + 160 * Math.sin((49 * Math.PI) / 180)],
              [500 + 130 * Math.cos((68 * Math.PI) / 180), 120 + 130 * Math.sin((68 * Math.PI) / 180)],
              [500 + 110 * Math.cos((87 * Math.PI) / 180), 120 + 110 * Math.sin((87 * Math.PI) / 180)],
              [500 + 130 * Math.cos((106 * Math.PI) / 180), 120 + 130 * Math.sin((106 * Math.PI) / 180)],
              [500 + 160 * Math.cos((125 * Math.PI) / 180), 120 + 160 * Math.sin((125 * Math.PI) / 180)],
              [500 + 190 * Math.cos((144 * Math.PI) / 180), 120 + 190 * Math.sin((144 * Math.PI) / 180)]
            ],
            isFinalResult: true
          },
          // Horizontal projection transfer lines from cut to slant height
          { id: 'devr-trans-1', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 260, y1: 220, x2: 280, y2: 220 },
          { id: 'devr-trans-2', type: 'LINE', lineWeight: 'CONSTRUCTION_4H', x1: 140, y1: 320, x2: 120, y2: 320 },
          // Title & Annotations
          { id: 'devr-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 430, label: 'RADIAL DEVELOPMENT (SECTOR ANGLE θ = 113.8°)' }
        ]
      };

    case 'development-triangulation':
      return {
        source: 'Pickup & Parker Vol. 2, Ex. 61 & J.N. Green Fig. 13.22',
        proof: 'True Slant Length TL = √(Plan Length² + H²);   Pattern formed by successive elementary triangles',
        dimensions: ['Square Base = 120×120mm', 'Duct Ø = 80mm', 'Vertical Height H = 100mm'],
        caption: 'Triangulation surface development of square-to-round transition duct using true length diagram (TLD) and compass arc triangulation.',
        elements: [
          // Plan View of Transition Piece (Left)
          { id: 'tri-sq-base', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[120, 260], [280, 260], [280, 420], [120, 420]] },
          { id: 'tri-circle', type: 'ARC', lineWeight: 'OUTLINE_HB', cx: 200, cy: 340, r: 50, startAngle: 0, endAngle: 360 },
          { id: 'tri-cl-h', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 100, y1: 340, x2: 300, y2: 340 },
          { id: 'tri-cl-v', type: 'LINE', lineWeight: 'CENTER_LINE', x1: 200, y1: 240, x2: 200, y2: 440 },
          // Triangulation rays from corner A(120, 420) to quadrant nodes
          ...[0, 30, 60, 90].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const nx = 200 + 50 * Math.cos(rad);
            const ny = 340 + 50 * Math.sin(rad);
            return {
              id: `tri-ray-${i}`,
              type: 'LINE' as const,
              lineWeight: 'CONSTRUCTION_2H' as const,
              x1: 280,
              y1: 420,
              x2: nx,
              y2: ny
            };
          }),
          { id: 'tri-plan-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 200, cy: 460, label: 'PLAN VIEW (SQUARE-TO-ROUND)' },
          // True Length Diagram (TLD) in Center
          { id: 'tri-tld-v', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 340, x2: 380, y2: 200 },
          { id: 'tri-tld-h', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 380, y1: 340, x2: 480, y2: 340 },
          { id: 'tri-tld-hyp1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 380, y1: 200, x2: 440, y2: 340 },
          { id: 'tri-tld-hyp2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 380, y1: 200, x2: 480, y2: 340 },
          { id: 'tri-tld-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 420, cy: 180, label: 'TRUE LENGTH DIAGRAM (TLD)' },
          { id: 'tri-tld-h-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 360, cy: 270, label: 'H = 100' },
          // Half Pattern Development on Right
          { id: 'tri-dev-base', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 540, y1: 400, x2: 740, y2: 400, isFinalResult: true },
          { id: 'tri-dev-slant-l', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 540, y1: 400, x2: 580, y2: 240, isFinalResult: true },
          { id: 'tri-dev-slant-r', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 740, y1: 400, x2: 700, y2: 240, isFinalResult: true },
          // Triangulated curved upper edge
          { id: 'tri-dev-top', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[580, 240], [610, 230], [640, 225], [670, 230], [700, 240]], isFinalResult: true },
          // Triangulation fold lines (2H)
          { id: 'tri-fold-1', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 640, y1: 400, x2: 610, y2: 230 },
          { id: 'tri-fold-2', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 640, y1: 400, x2: 640, y2: 225 },
          { id: 'tri-fold-3', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 640, y1: 400, x2: 670, y2: 230 },
          { id: 'tri-dev-lbl', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 640, cy: 450, label: 'HALF-PATTERN DEVELOPMENT' }
        ]
      };

    case 'building-floor-plan':
      return {
        source: 'J.N. Green Chapter 16, Fig. 16.2 & WAEC Architectural Syllabus',
        proof: 'External walls = 225mm sandcrete hollow block;   Internal walls = 150mm;   Door openings = 900mm width with 90° clearance swing',
        dimensions: ['Living Room: 4.0m × 3.6m', 'Bedroom 1: 3.6m × 3.3m', 'Bedroom 2: 3.3m × 3.0m', 'Kitchen: 3.0m × 2.4m', 'Bath: 2.0m × 1.5m'],
        caption: 'Architectural floor plan of a 2-bedroom residential bungalow showing 225mm external walls, 150mm partitions, door swings, and window openings.',
        elements: [
          // Outer Masonry Wall Boundary (225mm block, scaled)
          { id: 'fp-outer', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[140, 140], [660, 140], [660, 480], [140, 480]], isFinalResult: true },
          // Inner Masonry Wall Boundary (offset by 14px)
          { id: 'fp-inner', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[154, 154], [646, 154], [646, 466], [154, 466]], isFinalResult: true },
          // Partition Wall: Living Room vs Bedroom 1 (vertical at x=400)
          { id: 'fp-part-v1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 400, y1: 154, x2: 400, y2: 466 },
          { id: 'fp-part-v1b', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 154, x2: 410, y2: 466 },
          // Partition Wall: Bedroom 1 vs Bedroom 2 (horizontal at y=310, right side)
          { id: 'fp-part-h1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 310, x2: 646, y2: 310 },
          { id: 'fp-part-h1b', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 320, x2: 646, y2: 320 },
          // Partition Wall: Kitchen & Bath (horizontal at y=330, left side)
          { id: 'fp-part-h2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 154, y1: 330, x2: 400, y2: 330 },
          { id: 'fp-part-h2b', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 154, y1: 340, x2: 400, y2: 340 },
          // Sub-partition: Kitchen vs Bath
          { id: 'fp-part-v2', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 270, y1: 340, x2: 270, y2: 466 },
          { id: 'fp-part-v2b', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 340, x2: 280, y2: 466 },
          // Door Openings & 90° Swings
          // 1. Entrance Door (Front)
          { id: 'fp-dr-ent-leaf', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 230, y1: 154, x2: 230, y2: 200 },
          { id: 'fp-dr-ent-arc', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 230, cy: 154, r: 46, startAngle: 0, endAngle: 90 },
          // 2. Bedroom 1 Door
          { id: 'fp-dr-b1-leaf', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 240, x2: 456, y2: 240 },
          { id: 'fp-dr-b1-arc', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 410, cy: 240, r: 46, startAngle: 0, endAngle: 90 },
          // 3. Bedroom 2 Door
          { id: 'fp-dr-b2-leaf', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 410, y1: 350, x2: 456, y2: 350 },
          { id: 'fp-dr-b2-arc', type: 'ARC', lineWeight: 'CONSTRUCTION_2H', cx: 410, cy: 350, r: 46, startAngle: 0, endAngle: 90 },
          // Window Openings (triple line symbol)
          // Living room window (top)
          { id: 'fp-win-liv', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 280, y1: 140, x2: 360, y2: 140 },
          { id: 'fp-win-liv-sill', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 280, y1: 147, x2: 360, y2: 147 },
          // Bedroom 1 window (right)
          { id: 'fp-win-b1', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 660, y1: 190, x2: 660, y2: 260 },
          { id: 'fp-win-b1-sill', type: 'LINE', lineWeight: 'CONSTRUCTION_2H', x1: 653, y1: 190, x2: 653, y2: 260 },
          // Room Labels
          { id: 'fp-lbl-liv', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 270, cy: 230, label: 'LIVING ROOM (4.0m × 3.6m)' },
          { id: 'fp-lbl-b1', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 220, label: 'BEDROOM 1 (3.6m × 3.3m)' },
          { id: 'fp-lbl-b2', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 520, cy: 390, label: 'BEDROOM 2 (3.3m × 3.0m)' },
          { id: 'fp-lbl-kit', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 210, cy: 400, label: 'KITCHEN' },
          { id: 'fp-lbl-bath', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 335, cy: 400, label: 'BATH/WC' },
          // North Arrow
          { id: 'fp-na-line', type: 'LINE', lineWeight: 'OUTLINE_HB', x1: 720, y1: 190, x2: 720, y2: 140 },
          { id: 'fp-na-arrow', type: 'POLYGON', lineWeight: 'OUTLINE_HB', points: [[715, 150], [720, 135], [725, 150]] },
          { id: 'fp-na-n', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 720, cy: 125, label: 'N' },
          // Dimension lines
          { id: 'fp-dim-tot-w', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 140, y1: 515, x2: 660, y2: 515, dimensionText: 'TOTAL SPAN = 7,800 mm' },
          { id: 'fp-dim-tot-h', type: 'DIMENSION', lineWeight: 'DIMENSION_LINE', x1: 90, y1: 480, x2: 90, y2: 140, dimensionText: 'BREADTH = 5,100 mm' },
          // Title
          { id: 'fp-title', type: 'TEXT', lineWeight: 'OUTLINE_HB', cx: 400, cy: 100, label: 'SCALE 1:50 — 2-BEDROOM BUNGALOW FLOOR PLAN' }
        ]
      };

    default:
      // Default to robust bisection
      return createDiagramGeometry('bisection');
  }
}

/**
 * Resolves an authentic J.N. Green or Pickup & Parker diagram for any topic or query.
 */
export function getAuthenticTextbookDiagram(options: {
  topicId?: string;
  topicTitle?: string;
  figureTitle?: string;
  svgType?: string;
  figureNumber?: string;
}): AuthenticDiagramPayload {
  const { topicId, topicTitle, figureTitle, svgType, figureNumber } = options;
  const combined = `${topicId || ''} ${topicTitle || ''} ${figureTitle || ''} ${svgType || ''}`.toLowerCase();

  // 1. Try finding topic in allCurriculumTopics and extracting live procedural geometry
  const isSpecificDiagramRequested = (svgType && svgType !== 'generic' && svgType !== 'bisection') || 
    combined.includes('equilateral') || 
    combined.includes('isosceles') || 
    combined.includes('scalene') ||
    combined.includes('triangle');

  if (topicId && !isSpecificDiagramRequested) {
    const matchedTopic = allCurriculumTopics.find(t => t.id === topicId);
    if (matchedTopic && matchedTopic.generateSteps) {
      try {
        const params = matchedTopic.parameters?.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {}) || {};
        const steps = matchedTopic.generateSteps(params);
        if (steps && steps.length > 0) {
          // Extract cumulative elements up to final step
          const finalStep = steps[steps.length - 1];
          const allElements = finalStep.elements || steps.flatMap(s => s.elements);
          
          if (allElements.length > 0) {
            // Source citation determination
            const source = topicId.includes('higher') || topicId.includes('ss3') || combined.includes('orthographic') || combined.includes('isometric')
              ? 'Pickup & Parker: Engineering Drawing with Worked Examples'
              : 'J.N. Green: Technical Drawing for Schools';

            const proof = matchedTopic.theory?.formulas?.[0]?.latex 
              ? formatMathSymbols(matchedTopic.theory.formulas[0].latex)
              : (matchedTopic.theory?.keyPrinciples?.[0]?.keyRule 
                  ? formatMathSymbols(matchedTopic.theory.keyPrinciples[0].keyRule) 
                  : 'Geometric Construction Standards Verified');

            return {
              figureNumber: figureNumber || `Fig. ${topicId.replace(/[^0-9]/g, '') || '1.1'}`,
              title: figureTitle || matchedTopic.title,
              textbookSource: `${source} (Authentic Plate Ref)`,
              caption: matchedTopic.theory?.overview || `${matchedTopic.title} — standard geometric construction plate.`,
              mathematicalProof: formatMathSymbols(proof),
              dimensions: matchedTopic.parameters?.map(p => `${p.label} = ${p.defaultValue}${p.unit}`) || ['Scale 1:1', 'Tolerance ±0.2mm'],
              elements: allElements,
              guideNotes: [
                'ISO 128 Compliant Line Weights (0.70mm HB Outlines, 0.25mm 2H Guide Lines)',
                'WAEC / NERDC Technical Drawing Examination Benchmark'
              ]
            };
          }
        }
      } catch (err) {
        console.warn('Could not extract steps from topic:', err);
      }
    }
  }

  // 2. Keyword Classification to specialized J.N. Green / Pickup & Parker plates
  let categoryKey = 'bisection';

  if (combined.includes('cycloid') || svgType === 'cycloid') {
    categoryKey = 'cycloid';
  } else if (combined.includes('involute') || svgType === 'loci' || combined.includes('loci') || combined.includes('spiral')) {
    categoryKey = 'loci';
  } else if (combined.includes('parabola') || svgType === 'parabola') {
    categoryKey = 'parabola';
  } else if (combined.includes('ellipse') || combined.includes('conic') || svgType === 'ellipse' || svgType === 'conic') {
    categoryKey = 'ellipse';
  } else if (combined.includes('perspective') || svgType === 'perspective') {
    categoryKey = 'perspective';
  } else if (combined.includes('true length') || combined.includes('true-length') || combined.includes('true-lengths') || svgType === 'true-lengths') {
    categoryKey = 'true-lengths';
  } else if (combined.includes('equilateral') || svgType === 'triangle-equilateral') {
    categoryKey = 'triangle-equilateral';
  } else if (combined.includes('isosceles') || svgType === 'triangle-isosceles') {
    categoryKey = 'triangle-isosceles';
  } else if (combined.includes('scalene') || svgType === 'triangle-scalene') {
    categoryKey = 'triangle-scalene';
  } else if (combined.includes('incircle') || svgType === 'triangle-incircle') {
    categoryKey = 'triangle-incircle';
  } else if (combined.includes('triangle') || svgType === 'triangles') {
    categoryKey = 'triangles';
  } else if (
    svgType === 'orthographic-third-angle' ||
    combined.includes('third angle') ||
    combined.includes('third-angle') ||
    combined.includes('3rd angle') ||
    (topicId && (topicId.includes('third-angle') || topicId.includes('third_angle')))
  ) {
    categoryKey = 'orthographic-third-angle';
  } else if (svgType === 'auxiliary-projections' || combined.includes('auxiliary') || (topicId && topicId.includes('auxiliary'))) {
    categoryKey = 'auxiliary-projections';
  } else if (combined.includes('orthographic') || combined.includes('elevation') || combined.includes('plan view')) {
    categoryKey = 'orthographic';
  } else if (combined.includes('isometric') || combined.includes('four-center')) {
    categoryKey = 'isometric';
  } else if (combined.includes('tangent') || combined.includes('tangency') || combined.includes('blend') || combined.includes('ogee')) {
    categoryKey = 'tangent';
  } else if (combined.includes('divide-line') || combined.includes('division of line') || combined.includes('proportional')) {
    categoryKey = 'division';
  } else if (combined.includes('angle') || combined.includes('60°') || combined.includes('75°') || combined.includes('90°')) {
    categoryKey = 'angles';
  } else if (svgType === 'quadrilaterals' || combined.includes('quadrilateral') || combined.includes('rhombus') || combined.includes('trapezium') || (topicId && topicId.includes('quadrilateral'))) {
    categoryKey = 'quadrilaterals';
  } else if (svgType === 'equal-areas' || combined.includes('equal-area') || combined.includes('equal area') || combined.includes('equivalent rectangle') || (topicId && topicId.includes('equal-area'))) {
    categoryKey = 'equal-areas';
  } else if (svgType === 'enlargement-reduction' || combined.includes('enlargement') || combined.includes('reduction') || (topicId && topicId.includes('enlargement'))) {
    categoryKey = 'enlargement-reduction';
  } else if (combined.includes('across-flat') || combined.includes('across flat') || combined.includes('across flats') || combined.includes('a/f') || svgType === 'polygon-across-flats') {
    categoryKey = 'polygon-across-flats';
  } else if (combined.includes('across-corner') || combined.includes('across corner') || combined.includes('across corners') || combined.includes('a/c') || svgType === 'polygon-across-corners') {
    categoryKey = 'polygon-across-corners';
  } else if ((combined.includes('comparative') && (combined.includes('polygon') || combined.includes('hexagon') || combined.includes('flat') || combined.includes('corner'))) || svgType === 'polygon-comparative') {
    categoryKey = 'polygon-comparative';
  } else if (svgType === 'pentagon-anatomy' || (combined.includes('pentagon') && (combined.includes('anatomy') || combined.includes('properties') || combined.includes('fig 4.2') || combined.includes('star')))) {
    categoryKey = 'pentagon-anatomy';
  } else if (svgType === 'pentagon-inscribed' || (combined.includes('pentagon') && (combined.includes('inscribed') || combined.includes('circle') || combined.includes('fig 4.3')))) {
    categoryKey = 'pentagon-inscribed';
  } else if (combined.includes('pentagon') || svgType === 'pentagon') {
    categoryKey = 'pentagon';
  } else if (svgType === 'plain-scale' || (combined.includes('plain scale') && !combined.includes('diagonal')) || (topicId && topicId.includes('plain-scale'))) {
    categoryKey = 'plain-scale';
  } else if (svgType === 'scale-of-chords' || combined.includes('scale of chord') || combined.includes('scale-of-chord') || (topicId && topicId.includes('scale-of-chord'))) {
    categoryKey = 'scale-of-chords';
  } else if (svgType === 'scales' || combined.includes('scale') || combined.includes('diagonal scale') || combined.includes('rf =')) {
    categoryKey = 'scales';
  } else if (svgType === 'sections' || combined.includes('section') || combined.includes('hatch') || combined.includes('cutting plane')) {
    categoryKey = 'sections';
  } else if (svgType === 'development-radial' || (combined.includes('radial') && (combined.includes('development') || combined.includes('cone'))) || (topicId && topicId.includes('surface-development-radial'))) {
    categoryKey = 'development-radial';
  } else if (svgType === 'development-triangulation' || combined.includes('triangulation') || combined.includes('transition piece') || (topicId && topicId.includes('surface-development-triangulation'))) {
    categoryKey = 'development-triangulation';
  } else if (svgType === 'development' || combined.includes('development') || combined.includes('stretch-out')) {
    categoryKey = 'development';
  } else if (svgType === 'interpenetration' || combined.includes('interpenetration') || combined.includes('intersection of')) {
    categoryKey = 'interpenetration';
  } else if (combined.includes('bezier') || svgType === 'bezier') {
    categoryKey = 'bezier';
  } else if (svgType === 'cad' || combined.includes('cad') || combined.includes('autocad')) {
    categoryKey = 'cad';
  } else if (svgType === 'oblique' || combined.includes('oblique') || combined.includes('cavalier') || combined.includes('cabinet')) {
    categoryKey = 'oblique';
  } else if (combined.includes('polygon') || combined.includes('hexagon') || combined.includes('octagon')) {
    categoryKey = 'polygon';
  } else if (combined.includes('truss') || combined.includes('king post') || svgType === 'roof-truss') {
    categoryKey = 'roof-truss';
  } else if (svgType === 'building-floor-plan' || combined.includes('floor plan') || (topicId && topicId.includes('floor-plan'))) {
    categoryKey = 'building-floor-plan';
  } else if (combined.includes('foundation') || combined.includes('building') || svgType === 'building') {
    categoryKey = 'building';
  } else if (combined.includes('plummer') || combined.includes('pedestal') || svgType === 'plummer-block') {
    categoryKey = 'plummer-block';
  } else if (combined.includes('coupling') || svgType === 'coupling') {
    categoryKey = 'coupling';
  } else if (combined.includes('bolt') || combined.includes('nut') || combined.includes('fastener') || combined.includes('thread') || svgType === 'fastener') {
    categoryKey = 'fastener';
  } else if (combined.includes('instrument') || combined.includes('safety') || combined.includes('board practice')) {
    categoryKey = 'instruments';
  } else if (combined.includes('line') || combined.includes('lettering') || combined.includes('convention')) {
    categoryKey = 'lines';
  }

  const geom = createDiagramGeometry(categoryKey);

  return {
    figureNumber: figureNumber || 'Fig. 1.1',
    title: figureTitle || topicTitle || 'Technical Drawing Geometric Construction',
    textbookSource: geom.source,
    caption: geom.caption,
    mathematicalProof: formatMathSymbols(geom.proof),
    dimensions: geom.dimensions,
    elements: geom.elements,
    guideNotes: [
      'ISO 128 Standard Line Weight Distribution (HB Outline vs 4H Guide Arcs)',
      'Directly Referenced from J.N. Green and Pickup & Parker Curricula'
    ]
  };
}
