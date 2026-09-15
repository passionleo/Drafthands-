// Drafthands Universal Topic-to-Diagram Mapping Registry
import { DetailedDiagram } from './DetailedTextbookModule';
import { resolveCurriculumDomainKey } from '../../data/textbookData';
import { textbookCurriculumDatabase } from '../../data/curriculumReferenceTextbook';

export interface TopicContentPayload {
  title: string;
  category: string;
  diagrams: DetailedDiagram[];
}

export const dynamicTopicRegistry: Record<string, TopicContentPayload> = {
  // 1. Bisection Topic
  "TD-SS1-MOD01": {
    title: "Bisection of a Line and an Angle",
    category: "Plane Geometry",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Perpendicular Bisector of Straight Line AB via Compasses",
        description: "Initial compass setup establishing construction radii exceeding halfway distance (R > ½ AB) to locate perpendicular midpoint M.",
        dimensions: ["AB = 100mm", "Radius > 50mm", "Tolerance ±0.5mm"],
        labels: [{ text: "Point A", x: 100, y: 150 }, { text: "Point B", x: 400, y: 150 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Bisection of an Acute and Obtuse Angle (∠AOB)",
        description: "Striking equidistant arcs from vertex O intersecting rays OA and OB, followed by intersecting cross-arcs to yield 50% bisecting ray.",
        dimensions: ["Angle = 60°", "Bisected = 30° each"],
        labels: [{ text: "Vertex O", x: 100, y: 250 }, { text: "Bisector Ray", x: 350, y: 120 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Geometric Bisection of a Circular Arc or Curve Segment",
        description: "Subdividing curved circular arc XY into two equal arc segments by striking equal compass chords from endpoints X and Y.",
        dimensions: ["Arc Span = 120mm", "Radius = 150mm"],
        labels: [{ text: "Arc Endpoint X", x: 120, y: 120 }, { text: "Arc Endpoint Y", x: 380, y: 120 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Erecting a Perpendicular from an External Point to a Line",
        description: "Dropping a true normal line from external point P onto datum line AB using intersecting arcs without measuring with a set-square.",
        dimensions: ["Offset = 85mm", "Perpendicular Angle = 90.0°"],
        labels: [{ text: "External Point P", x: 250, y: 60 }, { text: "Datum AB", x: 250, y: 220 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      }
    ]
  },

  // 2. Division of Lines
  "TD-SS1-MOD02": {
    title: "Division of Lines into Proportional Segments",
    category: "Plane Geometry",
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Equal Division of Line AB into 5 Equal Segments",
        description: "Acute auxiliary ray AC divided into 5 equal increments using dividers, with parallel transfer lines dividing AB accurately into 5 equal parts.",
        dimensions: ["Line AB = 135mm", "Divisions = 5 equal parts (27mm each)", "Auxiliary Angle θ ≈ 30°"],
        labels: [{ text: "Datum A", x: 80, y: 180 }, { text: "Endpoint B", x: 420, y: 180 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 2.2",
        title: "Proportional Ratio Division of a Line (Ratio 2 : 3 : 4)",
        description: "Laying out sum of parts (2 + 3 + 4 = 9 units) along the inclined ray to divide structural member AB in exact engineering proportions.",
        dimensions: ["Line AB = 180mm", "Ratio = 2 : 3 : 4", "Segments = 40mm, 60mm, 80mm"],
        labels: [{ text: "Ratio 2", x: 160, y: 180 }, { text: "Ratio 3", x: 280, y: 180 }, { text: "Ratio 4", x: 400, y: 180 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Division of a Line Using Ruled Paper / Parallel Ladder Method",
        description: "Using standard parallel ruled lines or grid intervals to divide an unmeasured segment by rotating the line across grid intersections.",
        dimensions: ["Line Length = 117mm", "Grid Spacing = 15mm", "Subdivisions = 6 parts"],
        labels: [{ text: "Grid 0", x: 100, y: 220 }, { text: "Grid 6", x: 380, y: 80 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Finding the Geometric Mean (Mean Proportional) on a Line",
        description: "Euclidean semi-circle construction on diameter (A + B) to determine the exact mean proportional length x where x² = a × b.",
        dimensions: ["Segment a = 50mm", "Segment b = 80mm", "Mean Proportional x = 63.25mm"],
        labels: [{ text: "Semi-circle Diameter (a+b)", x: 250, y: 180 }, { text: "Mean x", x: 200, y: 120 }],
        svgType: "bisection",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 2.1)"
      }
    ]
  },

  // 3. Regular Polygons
  "TD-SS1-MOD03": {
    title: "Construction of Regular Polygons (Hexagon & Pentagon)",
    category: "Plane Geometry & Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 3.1",
        title: "Regular Hexagon Constructed Across Corners (A/C = 2S)",
        description: "Problem Statement: Construct a regular hexagon given distance Across Corners C = 300mm (or side length S = 150mm).\nProcedure: Draw horizontal and vertical centerlines. With center O and radius R = S = 150mm, draw circumscribing circle (diameter C = 300mm). From horizontal centerline endpoints A and D, swing compass arcs of radius R to step off vertices B, C, E, and F. Join all vertices with continuous thick HB lines.",
        dimensions: ["Across Corners C = 300mm", "Side Length S = 150mm", "Radius R = 150mm", "Interior Angle = 120°"],
        labels: [{ text: "Across Corners (A/C)", x: 400, y: 480 }, { text: "Center O", x: 400, y: 315 }, { text: "Circumcircle Ø300mm", x: 400, y: 130 }],
        svgType: "polygon-across-corners",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.3 & Plate 5.1)"
      },
      {
        figureNumber: "Fig. 3.2",
        title: "Regular Hexagon Constructed Across Flats (A/F = W, 30°/60° Tangents)",
        description: "Problem Statement: Construct a regular hexagon given distance Across Flats W = 260mm.\nProcedure: Draw centerlines intersecting at O. Draw inscribed circle with diameter W = 260mm (radius r = 130mm) in 2H line. Draw top and bottom horizontal tangents with T-square. Using a 30°/60° set-square resting on the T-square, draw four tangent lines touching the circle at 60° angles. The 6 intersecting tangents form the hexagon across flats. Outline in HB pencil.",
        dimensions: ["Width Across Flats W = 260mm", "Inscribed Radius r = 130mm", "Side S = 150.1mm", "Across Corners C = 300.2mm"],
        labels: [{ text: "Across Flats W (A/F)", x: 190, y: 300 }, { text: "T-Square Tangent", x: 400, y: 155 }, { text: "30°/60° Set-Square", x: 550, y: 260 }],
        svgType: "polygon-across-flats",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Ex. 11) & J.N. Green Fig. 4.7"
      },
      {
        figureNumber: "Fig. 3.3",
        title: "Master Comparative Plate: Hexagon Across Corners vs Across Flats",
        description: "Comparative Analysis: Left illustrates the Across Corners specification (C = 2S, circumscribing circle method) where vertices lie on the circle. Right illustrates the Across Flats specification (W = S√3, inscribed circle method) where flat edges are tangent to the circle.",
        dimensions: ["Left: Across Corners C = 220mm", "Right: Across Flats W = 190.5mm", "Common Side S = 110mm"],
        labels: [{ text: "Across Corners (A/C)", x: 220, y: 435 }, { text: "Across Flats (A/F)", x: 580, y: 435 }],
        svgType: "polygon-comparative",
        textbookSource: "J.N. Green & Pickup & Parker Curricula (WAEC Syllabus Section A)"
      },
      {
        figureNumber: "Fig. 3.4",
        title: "Universal General Method for Any Regular N-Sided Polygon (Heptagon, N=7)",
        description: "Dividing diameter AB of circumscribed circle into N equal parts and projecting through division 2 from auxiliary apex to locate polygon sides.",
        dimensions: ["Diameter = 120mm", "Sides N = 7 (Heptagon)", "Chord = 52mm"],
        labels: [{ text: "Division 2", x: 210, y: 180 }, { text: "Apex C", x: 250, y: 50 }],
        svgType: "polygon",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 5.1)"
      }
    ]
  },

  // 3b. Regular Pentagon (Dedicated Module)
  "TD-SS1-MOD07": {
    title: "Construction of a Regular Pentagon (Given Base Length)",
    category: "Plane Geometry & Regular Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 7.1",
        title: "Regular Pentagon on Given Base AB = 60mm (Golden Ratio Diagonal Method)",
        description: "Problem Statement: Construct a regular pentagon on a given horizontal base AB = 60mm.\nProcedure: Draw base AB = 60mm. Bisect AB to locate midpoint M and erect perpendicular centerline. At endpoint B, erect perpendicular BQ = AB (60mm). Join M to Q. With center M and radius MQ, swing arc to cut base extension at point P (AP = Golden Diagonal d = 1.618 × 60mm = 97.1mm). With centers A and B and radius AP, swing arcs intersecting at apex D on the centerline. With centers A, B, and D and radius S = 60mm, swing arcs to locate lateral vertices E and C. Join A-B-C-D-E-A with continuous thick HB lines.",
        dimensions: ["Base Side S = 60.0mm", "Golden Diagonal d = 97.1mm", "Interior Angle = 108.0°", "Apex Height = 92.4mm"],
        labels: [
          { text: "Apex D", x: 250, y: 85 },
          { text: "Base AB", x: 250, y: 260 },
          { text: "Point P (Diagonal Locus)", x: 370, y: 260 },
          { text: "Perpendicular BQ = AB", x: 310, y: 150 }
        ],
        svgType: "pentagon",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.12) & Pickup & Parker Vol. 1 Ex. 14"
      },
      {
        figureNumber: "Fig. 7.2",
        title: "Geometric Anatomy: 108° Interior Angles & Golden Diagonals",
        description: "Five-fold rotational symmetry and Golden Ratio proportions: interior angles θ = 108°, exterior angles = 72°, diagonal-to-side ratio d/S = (1+√5)/2 ≈ 1.618033.",
        dimensions: ["5 Equal Sides = S", "5 Equal Interior Angles = 108°", "Ratio d/S = 1.618"],
        labels: [{ text: "Interior Angle 108°", x: 215, y: 235 }, { text: "Axis of Symmetry", x: 255, y: 70 }],
        svgType: "pentagon-anatomy",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Chapter 4)"
      },
      {
        figureNumber: "Fig. 7.3",
        title: "Regular Pentagon Inscribed in Circle of Diameter D = 100mm",
        description: "Circle inscription method: bisecting radius to locate auxiliary center and swinging arc to establish side chord length for stepping off around circumference.",
        dimensions: ["Circumcircle Diameter D = 100mm", "Chord Side S = 58.8mm"],
        labels: [{ text: "Circumscribing Circle", x: 250, y: 120 }, { text: "Inscribed Pentagon ABCDE", x: 250, y: 200 }],
        svgType: "pentagon-inscribed",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Fig. 4.14)"
      }
    ]
  },
  "ss1-regular-pentagon": {
    title: "Construction of a Regular Pentagon (Given Base Length)",
    category: "Plane Geometry & Regular Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 7.1",
        title: "Regular Pentagon on Given Base AB = 60mm (Golden Ratio Diagonal Method)",
        description: "Problem Statement: Construct a regular pentagon on a given horizontal base AB = 60mm.\nProcedure: Draw base AB = 60mm. Bisect AB to locate midpoint M and erect perpendicular centerline. At endpoint B, erect perpendicular BQ = AB (60mm). Join M to Q. With center M and radius MQ, swing arc to cut base extension at point P (AP = Golden Diagonal d = 1.618 × 60mm = 97.1mm). With centers A and B and radius AP, swing arcs intersecting at apex D on the centerline. With centers A, B, and D and radius S = 60mm, swing arcs to locate lateral vertices E and C. Join A-B-C-D-E-A with continuous thick HB lines.",
        dimensions: ["Base Side S = 60.0mm", "Golden Diagonal d = 97.1mm", "Interior Angle = 108.0°", "Apex Height = 92.4mm"],
        labels: [
          { text: "Apex D", x: 250, y: 85 },
          { text: "Base AB", x: 250, y: 260 },
          { text: "Point P (Diagonal Locus)", x: 370, y: 260 },
          { text: "Perpendicular BQ = AB", x: 310, y: 150 }
        ],
        svgType: "pentagon",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.12) & Pickup & Parker Vol. 1 Ex. 14"
      },
      {
        figureNumber: "Fig. 7.2",
        title: "Geometric Anatomy: 108° Interior Angles & Golden Diagonals",
        description: "Five-fold rotational symmetry and Golden Ratio proportions: interior angles θ = 108°, exterior angles = 72°, diagonal-to-side ratio d/S = (1+√5)/2 ≈ 1.618033.",
        dimensions: ["5 Equal Sides = S", "5 Equal Interior Angles = 108°", "Ratio d/S = 1.618"],
        labels: [{ text: "Interior Angle 108°", x: 215, y: 235 }, { text: "Axis of Symmetry", x: 255, y: 70 }],
        svgType: "pentagon-anatomy",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Chapter 4)"
      },
      {
        figureNumber: "Fig. 7.3",
        title: "Regular Pentagon Inscribed in Circle of Diameter D = 100mm",
        description: "Circle inscription method: bisecting radius to locate auxiliary center and swinging arc to establish side chord length for stepping off around circumference.",
        dimensions: ["Circumcircle Diameter D = 100mm", "Chord Side S = 58.8mm"],
        labels: [{ text: "Circumscribing Circle", x: 250, y: 120 }, { text: "Inscribed Pentagon ABCDE", x: 250, y: 200 }],
        svgType: "pentagon-inscribed",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Fig. 4.14)"
      }
    ]
  },

  // TD-SS1-MOD06 & Hexagon Aliases
  "TD-SS1-MOD06": {
    title: "Construction of Regular Hexagon (Across Corners & Across Flats)",
    category: "Plane Geometry & Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Regular Hexagon Across Corners (A/C = 2S, Circumscribed Circle Method)",
        description: "Given distance across corners C = 2S (or side length S), circumscribing circle of diameter C is drawn and stepped off with compass chords of radius R = S to locate all six vertices.",
        dimensions: ["Across Corners C = 300mm", "Side Length S = 150mm", "Radius R = 150mm", "Interior Angle = 120°"],
        labels: [{ text: "Across Corners (A/C)", x: 400, y: 480 }, { text: "Circumcenter O", x: 400, y: 315 }],
        svgType: "polygon-across-corners",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.3)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Regular Hexagon Across Flats (A/F = W, Inscribed Circle & 30°/60° Tangents)",
        description: "Given distance across flats W (fastener bolt head specification), inscribed circle of diameter W is drawn. Tangents drawn with T-square and 30°/60° set-square determine the 6 perimeter edges.",
        dimensions: ["Width Across Flats W = 260mm", "Inscribed Radius r = 130mm", "Side S = 150.1mm", "Across Corners C = 300.2mm"],
        labels: [{ text: "Across Flats W (A/F)", x: 190, y: 300 }, { text: "30°/60° Tangent", x: 550, y: 260 }],
        svgType: "polygon-across-flats",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Ex. 11)"
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Master Comparative Plate: Hexagon Across Corners vs Across Flats",
        description: "Comparative drafting plate: Left displays Hexagon Across Corners (C = 2S) inscribed in circumcircle. Right displays Hexagon Across Flats (W = S√3) circumscribing inscribed circle.",
        dimensions: ["Left: Across Corners C = 220mm", "Right: Across Flats W = 190.5mm", "Side S = 110mm"],
        labels: [{ text: "Across Corners (A/C)", x: 220, y: 435 }, { text: "Across Flats (A/F)", x: 580, y: 435 }],
        svgType: "polygon-comparative",
        textbookSource: "J.N. Green Fig. 4.3 & Pickup & Parker Ex. 11"
      }
    ]
  },

  "ss1-regular-hexagon": {
    title: "Construction of Regular Hexagon (Across Corners & Across Flats)",
    category: "Plane Geometry & Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Regular Hexagon Across Corners (A/C = 2S, Circumscribed Circle Method)",
        description: "Given distance across corners C = 2S (or side length S), circumscribing circle of diameter C is drawn and stepped off with compass chords of radius R = S to locate all six vertices.",
        dimensions: ["Across Corners C = 300mm", "Side Length S = 150mm", "Radius R = 150mm", "Interior Angle = 120°"],
        labels: [{ text: "Across Corners (A/C)", x: 400, y: 480 }, { text: "Circumcenter O", x: 400, y: 315 }],
        svgType: "polygon-across-corners",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.3)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Regular Hexagon Across Flats (A/F = W, Inscribed Circle & 30°/60° Tangents)",
        description: "Given distance across flats W (fastener bolt head specification), inscribed circle of diameter W is drawn. Tangents drawn with T-square and 30°/60° set-square determine the 6 perimeter edges.",
        dimensions: ["Width Across Flats W = 260mm", "Inscribed Radius r = 130mm", "Side S = 150.1mm", "Across Corners C = 300.2mm"],
        labels: [{ text: "Across Flats W (A/F)", x: 190, y: 300 }, { text: "30°/60° Tangent", x: 550, y: 260 }],
        svgType: "polygon-across-flats",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Ex. 11)"
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Master Comparative Plate: Hexagon Across Corners vs Across Flats",
        description: "Comparative drafting plate: Left displays Hexagon Across Corners (C = 2S) inscribed in circumcircle. Right displays Hexagon Across Flats (W = S√3) circumscribing inscribed circle.",
        dimensions: ["Left: Across Corners C = 220mm", "Right: Across Flats W = 190.5mm", "Side S = 110mm"],
        labels: [{ text: "Across Corners (A/C)", x: 220, y: 435 }, { text: "Across Flats (A/F)", x: 580, y: 435 }],
        svgType: "polygon-comparative",
        textbookSource: "J.N. Green Fig. 4.3 & Pickup & Parker Ex. 11"
      }
    ]
  },

  "ss1-hexagon-across-corners": {
    title: "Construction of Regular Hexagon Across Corners (A/C = 2S)",
    category: "Plane Geometry & Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Regular Hexagon Across Corners (A/C = 2S, Circumscribed Circle Method)",
        description: "Given distance across corners C = 2S (or side length S), circumscribing circle of diameter C is drawn and stepped off with compass chords of radius R = S to locate all six vertices.",
        dimensions: ["Across Corners C = 300mm", "Side Length S = 150mm", "Radius R = 150mm", "Interior Angle = 120°"],
        labels: [{ text: "Across Corners (A/C)", x: 400, y: 480 }, { text: "Circumcenter O", x: 400, y: 315 }],
        svgType: "polygon-across-corners",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 4.3)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Master Comparative Plate: Hexagon Across Corners vs Across Flats",
        description: "Comparison plate highlighting difference between distance across opposite vertices (A/C) and distance across opposite parallel edges (A/F).",
        dimensions: ["Across Corners C = 220mm", "Across Flats W = 190.5mm"],
        labels: [{ text: "Across Corners", x: 220, y: 435 }, { text: "Across Flats", x: 580, y: 435 }],
        svgType: "polygon-comparative",
        textbookSource: "J.N. Green Fig. 4.3 & Pickup & Parker Ex. 11"
      }
    ]
  },

  "ss1-hexagon-across-flats": {
    title: "Construction of Regular Hexagon Across Flats (A/F = W)",
    category: "Plane Geometry & Polygons",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Regular Hexagon Across Flats (A/F = W, Inscribed Circle & 30°/60° Tangents)",
        description: "Given distance across flats W (fastener bolt head specification), inscribed circle of diameter W is drawn. Tangents drawn with T-square and 30°/60° set-square determine the 6 perimeter edges.",
        dimensions: ["Width Across Flats W = 260mm", "Inscribed Radius r = 130mm", "Side S = 150.1mm", "Across Corners C = 300.2mm"],
        labels: [{ text: "Across Flats W (A/F)", x: 190, y: 300 }, { text: "30°/60° Tangent", x: 550, y: 260 }],
        svgType: "polygon-across-flats",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Ex. 11)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Master Comparative Plate: Hexagon Across Corners vs Across Flats",
        description: "Comparison plate highlighting difference between distance across opposite vertices (A/C) and distance across opposite parallel edges (A/F).",
        dimensions: ["Across Corners C = 220mm", "Across Flats W = 190.5mm"],
        labels: [{ text: "Across Corners", x: 220, y: 435 }, { text: "Across Flats", x: 580, y: 435 }],
        svgType: "polygon-comparative",
        textbookSource: "J.N. Green Fig. 4.3 & Pickup & Parker Ex. 11"
      }
    ]
  },

  // 4. Scales
  "TD-SS1-MOD04": {
    title: "Plain and Diagonal Scales",
    category: "Engineering Scales",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Plain Metric Scale (RF 1:50) Reading Meters and Decimeters",
        description: "Engineering plain scale displaying primary meters to the right of zero datum and subdivided decimeters to the left.",
        dimensions: ["RF = 1:50", "LOS = 160mm", "Max Reading = 8m"],
        labels: [{ text: "Zero Datum", x: 160, y: 190 }, { text: "Decimeters (Left)", x: 100, y: 190 }, { text: "Meters (Right)", x: 300, y: 190 }],
        svgType: "scale",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 6.1)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Diagonal Scale (RF 1:50) Reading Three Units (m, dm, cm)",
        description: "Full diagonal scale utilizing similar triangles across 10 vertical divisions to read down to centimeters with microscopic accuracy.",
        dimensions: ["RF = 1:50", "LOS = 160mm", "Reading = 5.46m", "Least Count = 1cm"],
        labels: [{ text: "Zero Datum", x: 140, y: 190 }, { text: "Diagonal 10", x: 90, y: 130 }, { text: "Read Mark", x: 310, y: 110 }],
        svgType: "scale",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 6.1)"
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Scale of Chords for Measuring Angles Without a Protractor",
        description: "Geometric scale constructed on a quadrant of a circle calibrated in chord lengths from 0° to 90° for precision angular drafting.",
        dimensions: ["Radius R = 60mm", "Range = 0° to 90°", "Interval = 5°"],
        labels: [{ text: "Chord 60° = R", x: 250, y: 180 }, { text: "90° Quadrant", x: 350, y: 120 }],
        svgType: "scale",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 6.1)"
      },
      {
        figureNumber: "Fig. 4.4",
        title: "Comparative Scale Layout (Metric and Imperial Dual Calibration)",
        description: "Dual-graduated comparative scale with a single Representative Fraction allowing direct cross-reading between kilometers and miles.",
        dimensions: ["RF = 1:100,000", "Upper = Kilometers", "Lower = Statute Miles"],
        labels: [{ text: "Km Scale", x: 250, y: 140 }, { text: "Miles Scale", x: 250, y: 200 }],
        svgType: "scale",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 6.1)"
      }
    ]
  },

  // Aliases for Construction of Triangles
  "ss1-triangles-construction": {
    title: "Construction of Triangles: Equilateral, Isosceles & Scalene",
    category: "Plane Geometry & Triangles",
    diagrams: [
      {
        figureNumber: "Fig. 5.1",
        title: "Construction of an Equilateral Triangle (Base AB = 70mm, 3 × 60°)",
        description: "Problem Statement: Construct an equilateral triangle ABC with base AB = 70mm.\nProcedure: Draw base AB = 70mm. With centers A and B and compass radius equal to base AB (70mm), strike arcs intersecting at apex C. Join AC and BC with firm HB outlines. All three sides are equal (70mm) and all interior angles equal 60°.",
        dimensions: ["Base c = 70.0mm", "Side a = 70.0mm", "Side b = 70.0mm", "All Angles = 60°"],
        labels: [{ text: "Apex C", x: 400, y: 188 }, { text: "Base AB = 70mm", x: 400, y: 450 }, { text: "Compass Arc R=70", x: 300, y: 220 }],
        svgType: "triangle-equilateral",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.1)"
      },
      {
        figureNumber: "Fig. 5.2",
        title: "Construction of an Isosceles Triangle (Base AB = 70mm, Equal Legs = 85mm)",
        description: "Problem Statement: Construct an isosceles triangle ABC with base AB = 70mm and equal sloping legs AC = BC = 85mm.\nProcedure: Draw baseline AB = 70mm. With compass set to 85mm, strike intersecting arcs from A and B to establish apex C. Draw axis of symmetry CM perpendicular to AB. Finish with HB outlines.",
        dimensions: ["Base AB = 70.0mm", "Equal Legs AC = BC = 85.0mm", "Altitude h = 77.5mm", "Base Angle = 65.7°"],
        labels: [{ text: "Apex C", x: 400, y: 165 }, { text: "Axis of Symmetry", x: 410, y: 260 }, { text: "Equal Sides 85mm", x: 310, y: 280 }],
        svgType: "triangle-isosceles",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.3)"
      },
      {
        figureNumber: "Fig. 5.3",
        title: "Construction of a Scalene Triangle (c = 80mm, a = 70mm, b = 55mm)",
        description: "Problem Statement: Construct a scalene triangle ABC given three unequal sides: c = 80mm, a = 70mm, and b = 55mm.\nProcedure: Draw baseline AB = 80mm. Strike arc radius b = 55mm from vertex A, and arc radius a = 70mm from vertex B. Their point of intersection is vertex C. Join AC and BC with HB outlines. All sides and angles are unequal.",
        dimensions: ["Base c = 80.0mm", "Side a = 70.0mm", "Side b = 55.0mm", "Angles: 57.6°, 42.0°, 80.4°"],
        labels: [{ text: "Apex C", x: 360, y: 245 }, { text: "Arc R=55mm", x: 280, y: 260 }, { text: "Arc R=70mm", x: 480, y: 260 }],
        svgType: "triangle-scalene",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.2)"
      },
      {
        figureNumber: "Fig. 5.4",
        title: "Master Comparative Plate: The Three Types of Triangles",
        description: "Problem Statement: Display and compare the three geometric classifications of triangles according to side lengths and interior angle properties.\nProcedure: Plate displays side-by-side constructions of Equilateral (3 equal sides, 60°), Isosceles (2 equal sides, equal base angles), and Scalene (3 unequal sides, 3 unequal angles).",
        dimensions: ["Equilateral 70mm", "Isosceles 70/85mm", "Scalene 80/70/55mm"],
        labels: [{ text: "Equilateral", x: 150, y: 120 }, { text: "Isosceles", x: 400, y: 120 }, { text: "Scalene", x: 650, y: 120 }],
        svgType: "triangles",
        textbookSource: "J.N. Green: Chapter 3 & WAEC Syllabus Specification"
      }
    ]
  },
  "ss1-triangle-equilateral": {
    title: "Construction of an Equilateral Triangle",
    category: "Plane Geometry & Triangles",
    diagrams: [
      {
        figureNumber: "Fig. 3.1",
        title: "Construction of an Equilateral Triangle (Base AB = 70mm, 3 × 60°)",
        description: "Problem Statement: Construct an equilateral triangle ABC with base AB = 70mm.\nProcedure: Draw base AB = 70mm. With centers A and B and compass radius equal to base AB (70mm), strike arcs intersecting at apex C. Join AC and BC with firm HB outlines. All three sides are equal (70mm) and all interior angles equal 60°.",
        dimensions: ["Base c = 70.0mm", "Side a = 70.0mm", "Side b = 70.0mm", "All Angles = 60°"],
        labels: [{ text: "Apex C", x: 400, y: 188 }, { text: "Base AB = 70mm", x: 400, y: 450 }, { text: "Compass Arc R=70", x: 300, y: 220 }],
        svgType: "triangle-equilateral",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.1)"
      }
    ]
  },
  "ss1-triangle-isosceles": {
    title: "Construction of an Isosceles Triangle",
    category: "Plane Geometry & Triangles",
    diagrams: [
      {
        figureNumber: "Fig. 3.2",
        title: "Construction of an Isosceles Triangle (Base AB = 70mm, Equal Legs = 85mm)",
        description: "Problem Statement: Construct an isosceles triangle ABC with base AB = 70mm and equal sloping legs AC = BC = 85mm.\nProcedure: Draw baseline AB = 70mm. With compass set to 85mm, strike intersecting arcs from A and B to establish apex C. Draw axis of symmetry CM perpendicular to AB. Finish with HB outlines.",
        dimensions: ["Base AB = 70.0mm", "Equal Legs AC = BC = 85.0mm", "Altitude h = 77.5mm", "Base Angle = 65.7°"],
        labels: [{ text: "Apex C", x: 400, y: 165 }, { text: "Axis of Symmetry", x: 410, y: 260 }, { text: "Equal Sides 85mm", x: 310, y: 280 }],
        svgType: "triangle-isosceles",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.3)"
      }
    ]
  },
  "ss1-triangle-scalene": {
    title: "Construction of a Scalene Triangle",
    category: "Plane Geometry & Triangles",
    diagrams: [
      {
        figureNumber: "Fig. 3.3",
        title: "Construction of a Scalene Triangle (c = 80mm, a = 70mm, b = 55mm)",
        description: "Problem Statement: Construct a scalene triangle ABC given three unequal sides: c = 80mm, a = 70mm, and b = 55mm.\nProcedure: Draw baseline AB = 80mm. Strike arc radius b = 55mm from vertex A, and arc radius a = 70mm from vertex B. Their point of intersection is vertex C. Join AC and BC with HB outlines. All sides and angles are unequal.",
        dimensions: ["Base c = 80.0mm", "Side a = 70.0mm", "Side b = 55.0mm", "Angles: 57.6°, 42.0°, 80.4°"],
        labels: [{ text: "Apex C", x: 360, y: 245 }, { text: "Arc R=55mm", x: 280, y: 260 }, { text: "Arc R=70mm", x: 480, y: 260 }],
        svgType: "triangle-scalene",
        textbookSource: "J.N. Green: Technical Drawing for School Certificate (Fig. 3.2)"
      }
    ]
  },

  // 5B. Orthographic Projection Topic
  "TD-ORTHO-01": {
    title: "First and Third Angle Orthographic Projection",
    category: "Orthographic Projections",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "First Angle Projection Layout with 45° Mitre Line & ISO Symbol",
        description: "Standard British/European layout showing Front Elevation, Plan directly underneath, Left End Elevation on the right, and ISO truncated cone symbol.",
        dimensions: ["Height = 80mm", "Width = 60mm", "Depth = 50mm"],
        labels: [{ text: "Front Elevation", x: 150, y: 150 }, { text: "Plan (Top View)", x: 150, y: 240 }, { text: "45° Mitre", x: 280, y: 240 }],
        svgType: "orthographic",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 1)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Third Angle Projection Multi-View Layout (American Standard)",
        description: "Arrangement where top view sits above front elevation and right view is on the right.",
        dimensions: ["Projection Gap = 20mm", "45° Mitre Line"],
        labels: [{ text: "Plan (Top View)", x: 150, y: 90 }, { text: "Front Elevation", x: 150, y: 180 }, { text: "Right View", x: 280, y: 180 }],
        svgType: "orthographic",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 1)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Auxiliary Projection: True Shape of an Inclined Oblique Surface",
        description: "Auxiliary viewing plane parallel to inclined cut face projecting true geometric dimensions and true angular slopes.",
        dimensions: ["Slope = 45°", "True Length = 70.7mm", "True Width = 40mm"],
        labels: [{ text: "Auxiliary Plane", x: 300, y: 100 }, { text: "True Shape", x: 320, y: 150 }],
        svgType: "orthographic",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 1)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Orthographic Sectional Elevation with Internal Detail & Counter-Bores",
        description: "Full sectional front view on cutting plane line A-A showing 45° cross-hatching across solid web and un-hatched central shaft.",
        dimensions: ["Shaft Ø = 30mm", "Counter-bore Ø = 50mm", "Web Thickness = 12mm"],
        labels: [{ text: "Cutting Plane A-A", x: 150, y: 70 }, { text: "Hatched Web", x: 220, y: 150 }],
        svgType: "orthographic",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 1)"
      }
    ]
  },

  // 6. Tangency
  "TD-SS2-MOD02": {
    title: "Internal and External Common Tangents to Unequal Circles",
    category: "Tangency & Curves",
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Internal Common Tangent (Sum Radius R₁ + R₂)",
        description: "Auxiliary circle locating internal crossing tangent points T₁ and T₂ across centers.",
        dimensions: ["Circle 1 R₁ = 50mm", "Circle 2 R₂ = 30mm", "Distance = 160mm"],
        labels: [{ text: "Center O₁", x: 170, y: 150 }, { text: "Center O₂", x: 380, y: 150 }, { text: "Tangent T₁", x: 140, y: 110 }],
        svgType: "tangent",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 7.1)"
      },
      {
        figureNumber: "Fig. 2.2",
        title: "External Common Tangent (Difference Radius R₁ - R₂)",
        description: "Open-belt tangent lying on the same side of the circle centers.",
        dimensions: ["Difference Radius = 20mm", "Tangent Length = 158mm"],
        labels: [{ text: "Tangent T₂", x: 370, y: 95 }, { text: "Difference Circle", x: 170, y: 150 }],
        svgType: "tangent",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 7.1)"
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Blending External Tangency Arc Connecting Two Displaced Circles",
        description: "Striking a smooth transitional circular curve of radius R_blend that touches two given circles externally without sharp corners.",
        dimensions: ["Circle 1 R₁ = 35mm", "Circle 2 R₂ = 20mm", "Blend Radius R = 85mm"],
        labels: [{ text: "Blend Arc", x: 280, y: 80 }, { text: "Tangent Joint", x: 230, y: 130 }],
        svgType: "tangent",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 7.1)"
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Compound Ogee (Reverse S-Curve) Connecting Parallel Centerlines",
        description: "Smooth reverse curve composed of two circular arcs curving in opposite directions connecting parallel lines AB and CD.",
        dimensions: ["Line Offset = 50mm", "Arc Radii = 45mm", "Inflection Point P"],
        labels: [{ text: "Inflection Point P", x: 250, y: 150 }, { text: "Upper Arc", x: 180, y: 120 }],
        svgType: "tangent",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 7.1)"
      }
    ]
  },

  // 7. Isometric Projection
  "TD-SS2-MOD03": {
    title: "Isometric Projection and Four-Center Ellipse",
    category: "Pictorial Drawings",
    diagrams: [
      {
        figureNumber: "Fig. 3.1",
        title: "Isometric Axes at 30° and Bounding Box Layout",
        description: "Primary coordinate axes inclined at 120° to each other (vertical and two 30° axes) enclosing an engineering component bounding box.",
        dimensions: ["Isometric Axes = 30°", "Diameter D = 80mm", "Isometric Scale = 0.816"],
        labels: [{ text: "30° Left Axis", x: 140, y: 220 }, { text: "30° Right Axis", x: 360, y: 220 }, { text: "Vertical Axis", x: 250, y: 80 }],
        svgType: "isometric",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 8)"
      },
      {
        figureNumber: "Fig. 3.2",
        title: "Four-Center Ellipse Method in 30° Isometric Rhombus",
        description: "Constructing isometric circles on horizontal and vertical planes using obtuse corners and side midpoints to locate 4 compass arc centers.",
        dimensions: ["Diameter D = 70mm", "Major Axis = 1.22D", "Minor Axis = 0.71D"],
        labels: [{ text: "Obtuse Corner C1", x: 250, y: 80 }, { text: "Acute Intersection", x: 250, y: 150 }],
        svgType: "isometric",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 8)"
      },
      {
        figureNumber: "Fig. 3.3",
        title: "Isometric Representation of Sloping and Non-Isometric Faces",
        description: "Locating endpoints of inclined surfaces by plotting coordinates along isometric axes and connecting with non-isometric lines.",
        dimensions: ["Base Length = 90mm", "Stepped Height = 45mm", "Chamfer = 35°"],
        labels: [{ text: "Non-Isometric Line", x: 290, y: 130 }, { text: "Datum Box", x: 200, y: 200 }],
        svgType: "isometric",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 8)"
      },
      {
        figureNumber: "Fig. 3.4",
        title: "Isometric Half-Sectional Cut Revealing Internal Cylindrical Cavities",
        description: "Cutaway isometric view showing internal counter-bores and shafts with 60°/30° cross-hatching across cut solid sections.",
        dimensions: ["Outer Bore Ø = 60mm", "Inner Bore Ø = 30mm", "Hatching Angle = 60°"],
        labels: [{ text: "Internal Counter-bore", x: 250, y: 130 }, { text: "60° Hatching", x: 220, y: 170 }],
        svgType: "isometric",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 8)"
      }
    ]
  },

  // 8. Conic Sections Topic (Parabola / Ellipse)
  "TD-SS2-MOD04": {
    title: "Construction of an Ellipse by Concentric Circles Method",
    category: "Conic Sections",
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Concentric Circles Construction of an Ellipse (12 Radial Sectors)",
        description: "Laying out intersecting radial lines with major diameter D₁ and minor diameter D₂ to map coordinate loci.",
        dimensions: ["Major Axis = 140mm", "Minor Axis = 80mm", "30° Increments"],
        labels: [{ text: "Major Circle", x: 250, y: 150 }, { text: "Minor Circle", x: 250, y: 190 }, { text: "Curve Locus", x: 310, y: 110 }],
        svgType: "conic",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 8.1)"
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Parabola by Rectangular Enclosure / Offset Tangent Method",
        description: "Constructing a parabolic trajectory inside an enclosing rectangle by dividing half-base and height into equal proportional increments.",
        dimensions: ["Base Span = 120mm", "Axis Rise = 70mm", "5 Equal Steps"],
        labels: [{ text: "Apex Vertex", x: 250, y: 80 }, { text: "Parabolic Boundary", x: 330, y: 180 }],
        svgType: "conic",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 8.1)"
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Construction of an Ellipse using Focal Points (F₁ & F₂) and Trammel",
        description: "Locating foci by striking arc of radius ½ Major Axis from minor vertex C, demonstrating pin-and-string and paper trammel construction.",
        dimensions: ["Focal Distance F₁F₂ = 114.8mm", "PF₁ + PF₂ = Major Axis"],
        labels: [{ text: "Focus F₁", x: 180, y: 180 }, { text: "Focus F₂", x: 320, y: 180 }],
        svgType: "conic",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 8.1)"
      },
      {
        figureNumber: "Fig. 4.4",
        title: "Hyperbola Construction by Directrix-Focus and Cutting Plane on Cone",
        description: "Locus of points where ratio of distance from focus to distance from directrix exceeds 1 (e > 1), and true shape of cutting plane parallel to cone axis.",
        dimensions: ["Eccentricity e = 1.4", "Apex Angle = 60°", "Focal Length = 35mm"],
        labels: [{ text: "Directrix", x: 120, y: 150 }, { text: "Hyperbolic Curve", x: 280, y: 150 }],
        svgType: "conic",
        textbookSource: "J.N. Green: Technical Drawing for Schools (Plate 8.1)"
      }
    ]
  },

  // 9. Surface Developments
  "TD-SS3-MOD01": {
    title: "Surface Development of Truncated Prism and Cylinder",
    category: "Developments & Interpenetration",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Parallel Line Development of a Truncated Cylinder (Stretchout πD)",
        description: "Unfolded stretch-out sheet of length πD linked to truncated elevation with 12 generator heights generating sinusoidal curve.",
        dimensions: ["Diameter D = 60mm", "Stretch-out = 188.5mm", "Height = 100mm"],
        labels: [{ text: "Stretch-out Baseline", x: 250, y: 220 }, { text: "Sinusoidal Cut", x: 250, y: 110 }],
        svgType: "development",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 2, Plate 3)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Parallel Line Development of a Hexagonal Prism with Inclined Face",
        description: "Unfolded flat pattern of 6 rectangular panels with sharp crease lines and true heights projected from the 30° cut elevation.",
        dimensions: ["Side S = 35mm", "Total Stretchout = 210mm", "Max Height = 95mm"],
        labels: [{ text: "Panel 1", x: 120, y: 180 }, { text: "Panel 6", x: 380, y: 180 }],
        svgType: "development",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 2, Plate 3)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Radial Line Development of a Truncated Right Circular Cone",
        description: "Sector of a circle of radius equal to slant height L with angular span θ = (r/L) × 360°, with true truncated radii stepped off.",
        dimensions: ["Base Radius r = 30mm", "Slant Height L = 90mm", "Sector Angle θ = 120°"],
        labels: [{ text: "Apex Center O", x: 250, y: 60 }, { text: "Truncated Arc", x: 250, y: 150 }],
        svgType: "development",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 2, Plate 3)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Triangulation Development of a Square-to-Round Duct Transition",
        description: "Dividing complex transitional surfaces into series of contiguous triangles whose true lengths are found by auxiliary right triangles.",
        dimensions: ["Square Base = 80 × 80mm", "Round Top Ø = 50mm", "Height = 75mm"],
        labels: [{ text: "True Length Triangle", x: 350, y: 140 }, { text: "Quarter Pattern", x: 200, y: 140 }],
        svgType: "development",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 2, Plate 3)"
      }
    ]
  },

  // 10. Sectioning
  "TD-SS3-MOD02": {
    title: "Sectional Views and ISO Hatching Rules",
    category: "Sectional Views",
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Full Sectional Elevation on Cutting Plane A-A with 45° ISO Hatching",
        description: "Hollow stepped bushing cut completely through centerline showing uniform 45° hatching across solid cut walls and clean bore.",
        dimensions: ["Ø Outer = 90mm", "Ø Bore = 40mm", "Hatch Spacing = 2.5mm"],
        labels: [{ text: "Cutting Plane A-A", x: 250, y: 70 }, { text: "Central Bore", x: 250, y: 150 }],
        svgType: "section",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 14)"
      },
      {
        figureNumber: "Fig. 2.2",
        title: "Half-Sectional Elevation with Centerline of Symmetry",
        description: "Symmetrical component showing outside appearance on one half and internal cavity details on the other half separated by a centerline.",
        dimensions: ["Component Width = 110mm", "Height = 85mm", "Half Cut at 90°"],
        labels: [{ text: "External Elevation", x: 180, y: 150 }, { text: "Sectioned Half", x: 320, y: 150 }],
        svgType: "section",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 14)"
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Revolved and Removed Sections on Machine Structural Arms/Webs",
        description: "Rotating the cross-section of a structural spoke or I-beam 90° directly on the longitudinal view to show exact cross-sectional profile.",
        dimensions: ["Spoke Thickness = 14mm", "Flange Width = 28mm", "Revolved Angle = 90°"],
        labels: [{ text: "Revolved Cross-Section", x: 250, y: 150 }, { text: "Pulley Arm", x: 160, y: 150 }],
        svgType: "section",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 14)"
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Offset Cutting Plane Section Navigating Displaced Mechanical Bores",
        description: "Stepped cutting plane A-B-C-D bending at 90° to pass through multiple non-collinear holes without showing step lines on the sectional view.",
        dimensions: ["Hole 1 Ø = 18mm", "Hole 2 Ø = 24mm", "Offset Step = 30mm"],
        labels: [{ text: "Offset Step", x: 230, y: 110 }, { text: "Bore 1", x: 180, y: 150 }, { text: "Bore 2", x: 320, y: 150 }],
        svgType: "section",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 14)"
      }
    ]
  },

  // 11. Building Foundation
  "TD-BLD-01": {
    title: "Building Construction: Strip Foundation & Wall Detail",
    category: "Building Drawing",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Detailed Vertical Section Through Strip Foundation, Hardcore, DPC, and Block Wall",
        description: "Trench excavation, 675x225mm concrete footing, 225mm sandcrete blockwall, DPC membrane, hardcore, and floor slab.",
        dimensions: ["Footing = 675 x 225mm", "Wall = 225mm", "Depth below GL = 900mm"],
        labels: [{ text: "Ground Level (GL)", x: 100, y: 140 }, { text: "D.P.C.", x: 260, y: 130 }, { text: "Footing", x: 250, y: 260 }],
        svgType: "building",
        textbookSource: "Pickup & Parker: Building & Architectural Drawing (Plate 5)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Foundation Trench Excavation Plan and Setting-Out Profile Boards",
        description: "Trench layout plan showing centerlines, excavation widths, building lines, and timber profile boards with saw-cut guide notches.",
        dimensions: ["Trench Width = 675mm", "Corner Angle = 90° (3:4:5 rule)", "Profile Offset = 1200mm"],
        labels: [{ text: "Setting-Out Line", x: 180, y: 140 }, { text: "Profile Board", x: 350, y: 140 }],
        svgType: "building",
        textbookSource: "Pickup & Parker: Building & Architectural Drawing (Plate 5)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Lintel and Sill Architectural Detail with Damp Proof Membrane",
        description: "Reinforced concrete lintel beam above window opening (1:2:4 mix with 12mm rebar), plaster reveals, and concrete weathered window sill.",
        dimensions: ["Lintel Depth = 225mm", "Bearing on Wall = 150mm", "Sill Projection = 50mm"],
        labels: [{ text: "RC Lintel", x: 250, y: 100 }, { text: "Weathered Sill", x: 250, y: 200 }],
        svgType: "building",
        textbookSource: "Pickup & Parker: Building & Architectural Drawing (Plate 5)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Timber Roof Truss Construction Detail (Rafter, Tie Beam, King Post)",
        description: "Eaves construction detail showing 50×150mm wall plate, 50×100mm common rafters, tie beam, ceiling joist, fascia board, and roofing.",
        dimensions: ["Rafter Pitch = 30°", "Fascia Board = 25×250mm", "Wall Plate Anchor = 12mm bolt"],
        labels: [{ text: "Rafter", x: 200, y: 100 }, { text: "Wall Plate", x: 250, y: 180 }, { text: "Fascia", x: 130, y: 160 }],
        svgType: "building",
        textbookSource: "Pickup & Parker: Building & Architectural Drawing (Plate 5)"
      }
    ]
  },

  // 12. Fasteners
  "TD-MCH-01": {
    title: "Standard Fasteners: Metric Hexagonal Bolt & Nut",
    category: "Machine Drawing",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Metric Hexagonal Bolt and Nut Standard Proportions (D, 0.8D, 2D)",
        description: "Head height 0.8D, across flats 1.5D+3, 30° chamfer arcs, shank, washer, and nut with exact empirical formulas.",
        dimensions: ["Nominal D = 24mm", "Head Height = 19.2mm", "Across Flats = 39mm", "Across Corners = 48mm"],
        labels: [{ text: "0.8D Head", x: 120, y: 120 }, { text: "Hex Nut", x: 330, y: 120 }, { text: "Shank D", x: 220, y: 180 }],
        svgType: "fastener",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 18)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Machine Fasteners: Stud, Countersunk Screw, and Spring Washer Detailing",
        description: "Detailed conventions for blind tapped holes, stud engagement (1.25D into cast iron), countersunk machine screw heads, and lock washers.",
        dimensions: ["Stud Thread = M16 × 2.0", "Tap Drill Depth = 1.5D", "Countersunk = 90°"],
        labels: [{ text: "Stud Thread", x: 200, y: 140 }, { text: "Tap Hole", x: 300, y: 140 }],
        svgType: "fastener",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 18)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Flanged Shaft Coupling Assembly with Parallel Keys and Bolts",
        description: "Protected type flanged coupling joining two transmission shafts, showing recessed bolt heads, hub bored for keyway, and parallel rectangular key.",
        dimensions: ["Shaft Ø = 40mm", "Flange Outer Ø = 150mm", "4 × M12 fitted bolts on 110mm PCD"],
        labels: [{ text: "Fitted Bolt", x: 250, y: 90 }, { text: "Parallel Key", x: 250, y: 160 }, { text: "Shaft Hub", x: 180, y: 160 }],
        svgType: "fastener",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 18)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Sectional Assembly of a Plummer Block (Bearing Housing and Brass Bush)",
        description: "Full sectional elevation of split pedestal bearing including cast iron cap and base, split gunmetal brass bushes, square-head bolts, and grease cup.",
        dimensions: ["Journal Ø = 50mm", "Center Height = 65mm", "Holding Down Bolts = 2 × M16"],
        labels: [{ text: "Cast Iron Cap", x: 250, y: 90 }, { text: "Brass Bush", x: 250, y: 150 }, { text: "Base Pedestal", x: 250, y: 220 }],
        svgType: "fastener",
        textbookSource: "Pickup & Parker: Engineering Drawing with Worked Examples (Vol. 1, Plate 18)"
      }
    ]
  },

  // 13. CAD Fundamentals
  "CAD-BAS-01": {
    title: "AutoCAD 2D Fundamentals: Absolute and Relative Coordinates",
    category: "CAD Drafting",
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "AutoCAD UCS Coordinate Entry Modes and Polar Vectoring",
        description: "World Coordinate System axes, relative @dx,dy, and polar @dist<deg vectors used in dynamic input.",
        dimensions: ["Origin (0,0)", "Vector @150,0", "Polar @100<45°"],
        labels: [{ text: "Origin (0,0)", x: 130, y: 220 }, { text: "+X Axis", x: 380, y: 220 }, { text: "+Y Axis", x: 130, y: 80 }],
        svgType: "cad",
        textbookSource: "AutoCAD & ISO 13567 Digital Drafting Standards (J.N. Green CAD Ref)"
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Relative Cartesian Coordinates (@ΔX, ΔY) in Geometric Drafting",
        description: "Mapping incremental horizontal and vertical offsets from the last cursor station without recalculating absolute WCS distances.",
        dimensions: ["Segment 1: @120,0", "Segment 2: @0,85", "Segment 3: @-50,30"],
        labels: [{ text: "Start Pt", x: 150, y: 200 }, { text: "@120,0", x: 270, y: 200 }, { text: "@0,85", x: 270, y: 115 }],
        svgType: "cad",
        textbookSource: "AutoCAD & ISO 13567 Digital Drafting Standards (J.N. Green CAD Ref)"
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Dynamic Polar Tracking and Relative Angle Navigation (@dist<deg)",
        description: "Specifying true segment lengths along locked angular increments (e.g. 15°, 30°, 45°) with AutoCAD polar tracking vector paths.",
        dimensions: ["Vector = 125mm", "Angle θ = 60.00°", "Increments = 15°"],
        labels: [{ text: "Angle θ = 60°", x: 280, y: 160 }, { text: "Polar Ray", x: 320, y: 120 }],
        svgType: "cad",
        textbookSource: "AutoCAD & ISO 13567 Digital Drafting Standards (J.N. Green CAD Ref)"
      },
      {
        figureNumber: "Fig. 1.4",
        title: "CAD Layer Management, Line Weights, and Viewport Scaling (ISO 13567)",
        description: "Standard architectural and mechanical CAD layer structure: 0-Outlines (0.70mm), Centerlines (0.25mm), Dimensions (0.35mm), and Hatch (0.18mm).",
        dimensions: ["Paper Space A3: 420 × 297mm", "Model Space 1:1", "Viewport Scale 1:50"],
        labels: [{ text: "Layer 0: Outlines", x: 180, y: 120 }, { text: "Layer Dim: Dimensions", x: 180, y: 160 }, { text: "Viewport 1:50", x: 320, y: 140 }],
        svgType: "cad",
        textbookSource: "AutoCAD & ISO 13567 Digital Drafting Standards (J.N. Green CAD Ref)"
      }
    ]
  }
};

/**
 * Intelligent helper to resolve topic payload for any topic ID
 */
export function getDynamicTopicContent(
  topicId?: string, 
  title?: string, 
  category?: string
): TopicContentPayload {
  // 1. Direct key match in dynamicTopicRegistry
  if (topicId && dynamicTopicRegistry[topicId]) {
    return dynamicTopicRegistry[topicId];
  }

  // 2. Partial key match
  if (topicId) {
    const keys = Object.keys(dynamicTopicRegistry);
    const match = keys.find(k => topicId.toUpperCase().includes(k.replace('TD-', '')) || topicId.includes(k));
    if (match) {
      return dynamicTopicRegistry[match];
    }
  }

  // 3. Resolve using universal curriculum domain key and textbookCurriculumDatabase
  const domainKey = resolveCurriculumDomainKey({ id: topicId || '', title: title || '', category: category || '' } as any);
  const refChapter = textbookCurriculumDatabase[domainKey];

  if (refChapter && refChapter.figures && refChapter.figures.length > 0) {
    const diagrams: DetailedDiagram[] = refChapter.figures.map((fig, idx) => ({
      figureNumber: fig.figureNumber || `Fig. ${(idx + 1)}.1`,
      title: fig.title,
      description: fig.caption || `${fig.title} — standard construction plate.`,
      dimensions: fig.dimensions || ['Scale 1:1', 'Tolerance ±0.5mm'],
      labels: [
        { text: 'Reference Datum', x: 120, y: 180 },
        { text: 'Final Outline', x: 380, y: 180 }
      ],
      svgType: fig.svgType || 'bisection',
      textbookSource: fig.textbookSource || (topicId?.includes('higher') || topicId?.includes('ss3') ? 'Pickup & Parker: Engineering Drawing with Worked Examples' : 'J.N. Green: Technical Drawing for Schools')
    }));

    return {
      title: refChapter.title || title || 'Engineering Drawing Reference',
      category: refChapter.tier || category || 'Curriculum Domain',
      diagrams
    };
  }

  // 4. Keyword fallbacks
  const lowerTitle = (title || '').toLowerCase();
  const lowerId = (topicId || '').toLowerCase();
  if (lowerTitle.includes('pentagon') || lowerId.includes('pentagon')) {
    return dynamicTopicRegistry["ss1-regular-pentagon"];
  } else if (lowerTitle.includes('triangle') || lowerTitle.includes('equilateral') || lowerTitle.includes('isosceles') || lowerTitle.includes('scalene')) {
    return dynamicTopicRegistry["ss1-triangles-construction"];
  } else if (lowerTitle.includes('orthographic') || lowerTitle.includes('angle projection')) {
    return dynamicTopicRegistry["TD-ORTHO-01"];
  } else if (lowerTitle.includes('tangent') || lowerTitle.includes('circle')) {
    return dynamicTopicRegistry["TD-SS2-MOD02"];
  } else if (lowerTitle.includes('polygon') || lowerTitle.includes('hexagon')) {
    return dynamicTopicRegistry["TD-SS1-MOD03"];
  } else if (lowerTitle.includes('scale') || lowerTitle.includes('diagonal')) {
    return dynamicTopicRegistry["TD-SS1-MOD04"];
  } else if (lowerTitle.includes('isometric') || lowerTitle.includes('axonometric') || lowerTitle.includes('3d')) {
    return dynamicTopicRegistry["TD-SS2-MOD03"];
  } else if (lowerTitle.includes('ellipse') || lowerTitle.includes('parabola') || lowerTitle.includes('conic')) {
    return dynamicTopicRegistry["TD-SS2-MOD04"];
  } else if (lowerTitle.includes('development') || lowerTitle.includes('interpenetration')) {
    return dynamicTopicRegistry["TD-SS3-MOD01"];
  } else if (lowerTitle.includes('section') || lowerTitle.includes('hatch')) {
    return dynamicTopicRegistry["TD-SS3-MOD02"];
  } else if (lowerTitle.includes('building') || lowerTitle.includes('foundation') || lowerTitle.includes('wall')) {
    return dynamicTopicRegistry["TD-BLD-01"];
  } else if (lowerTitle.includes('bolt') || lowerTitle.includes('nut') || lowerTitle.includes('fastener')) {
    return dynamicTopicRegistry["TD-MCH-01"];
  } else if (lowerTitle.includes('cad') || lowerTitle.includes('coordinate')) {
    return dynamicTopicRegistry["CAD-BAS-01"];
  }

  // Fallback default
  return dynamicTopicRegistry["TD-SS1-MOD01"];
}
