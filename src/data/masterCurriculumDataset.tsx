// Drafthands Comprehensive Textbook & Multi-State Vector Curriculum Dataset
import React from 'react';
import { resolveCurriculumDomainKey } from './textbookData';
import { textbookCurriculumDatabase } from './curriculumReferenceTextbook';
import { getActualDiagramImage } from '../components/textbook/TextbookFigurePlate';

export type CurriculumSvgType = 
  | 'bisection' 
  | 'tangent' 
  | 'orthographic' 
  | 'lettering' 
  | 'scale' 
  | 'isometric' 
  | 'polygon' 
  | 'conic' 
  | 'development' 
  | 'section' 
  | 'fastener' 
  | 'building' 
  | 'cad'
  | 'instruments'
  | 'lines'
  | 'angles'
  | 'triangles'
  | 'triangle-equilateral'
  | 'triangle-isosceles'
  | 'triangle-scalene'
  | 'triangle-incircle'
  | 'polygon-across-corners'
  | 'polygon-across-flats'
  | 'polygon-comparative'
  | 'pentagon'
  | 'pentagon-anatomy'
  | 'pentagon-inscribed'
  | 'scales'
  | 'sections'
  | 'machine-assembly'
  | 'roof-truss'
  | 'interpenetration'
  | 'loci'
  | 'oblique';

export interface CurriculumTopicContent {
  id: string;
  level: string;
  title: string;
  introduction: string;
  principles: string[];
  isoStandards: string[];
  procedures: string[];
  diagrams: {
    figureNumber?: string;
    title: string;
    description: string;
    svgType: CurriculumSvgType;
    imageUrl?: string;
    dimensions?: string[];
    technicalNotes?: string[];
  }[];
}

export const masterCurriculumDatabase: Record<string, CurriculumTopicContent> = {
  // 1. SS1: Bisection of Lines and Angles
  "TD-SS1-MOD01": {
    id: "TD-SS1-MOD01",
    level: "SS1",
    title: "Bisection of a Straight Line and Angle",
    introduction: "Geometric construction forms the foundational language of technical drawing. Bisecting lines and angles accurately without relying on protractor measurements ensures absolute mathematical precision mandated by WAEC and NERDC standards.",
    principles: [
      "The perpendicular bisector of a line divides it into two equal parts at exactly 90 degrees (see Fig. 1.1 and Fig. 1.2).",
      "An angle bisector splits an angular opening into two identical adjacent angles using equidistant arcs from the vertex (see Fig. 1.3).",
      "All construction arcs must be drawn with a sharp 2H pencil using thin, faint lines (ISO 128 Type B) before final HB accentuation."
    ],
    isoStandards: [
      "ISO 128-20: Technical drawings — General principles of presentation — Part 20: Basic conventions for lines.",
      "NERDC Curriculum Guideline 3.1: Precision instrument handling in plane geometry."
    ],
    procedures: [
      "Step 1: Given line AB, set compass radius to more than half the estimated length of AB (r > 0.5 * AB).",
      "Step 2: With center A, draw arcs above and below line AB.",
      "Step 3: With center B and the exact same radius, intersect the previous arcs at points C and D.",
      "Step 4: Draw a straight line joining C to D. The intersection point M on AB is the exact perpendicular midpoint."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Perpendicular Bisector of Straight Line AB via Compass Arcs",
        description: "Initial compass setup from endpoints A and B exceeding halfway distance (R > ½ AB) establishing intersection nodes C and D to locate midpoint M.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Line AB = 300mm", "Radius R = 200mm", "Tolerance ±0.5mm"],
        technicalNotes: ["Compass needle placed at datum A and B", "2H faint construction arcs", "Midpoint M at 90°"]
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Bisection of an Acute and Obtuse Angle (∠AOB)",
        description: "Equidistant arc from vertex O intersecting rays OA and OB at points P and Q, followed by intersecting cross-arcs to generate the 50% bisecting ray.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Angle ∠AOB = 60°", "Bisected Angles = 30° each", "Equidistant Arc R = 80mm"],
        technicalNotes: ["Equidistant radius from vertex O", "Bisector ray drawn with continuous HB line", "Uncut arc traces preserved"]
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Geometric Bisection of a Circular Arc or Curve Segment",
        description: "Subdividing a curved circular arc XY into two equal arc segments by striking equal compass chords from endpoints X and Y to find radial center line.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Arc Span XY = 120mm", "Radius of Arc R = 150mm", "Equal Segments XZ = ZY"],
        technicalNotes: ["Bisector line passes through circle center O", "Perpendicular to chord XY", "2H construction arcs"]
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Erecting a Perpendicular from an External Point to a Line",
        description: "Dropping a true normal line from external point P onto datum line AB using intersecting arcs without measuring with a set-square.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Offset Distance = 85mm", "Perpendicular Angle = 90.0°", "Tolerance ±0.25mm"],
        technicalNotes: ["Compass arc from P cuts line AB at two loci", "Equal arcs struck downward to form intersection", "ISO 128 Type B thin lines"]
      }
    ]
  },

  // 2. SS1: Division of Lines into Proportional Segments
  "TD-SS1-MOD02": {
    id: "TD-SS1-MOD02",
    level: "SS1",
    title: "Division of Lines into Proportional Segments",
    introduction: "Dividing a given straight line into equal parts or into given ratios is a fundamental skill in engineering graphics. It eliminates cumulative measurement errors that occur when using a millimetre scale rule.",
    principles: [
      "The acute angle auxiliary ray method uses Thales' intercept theorem to divide any segment into N identical lengths.",
      "Proportional division (e.g. 2:3:4) requires laying out the sum of the ratio parts along the auxiliary line.",
      "All projector lines linking the auxiliary ray to the baseline MUST be strictly parallel (drawn with 30°/60° or 45° set-squares)."
    ],
    isoStandards: [
      "ISO 128-20: Conventions for construction lines.",
      "WAEC TD Syllabus: Section 1.2 — Division of Lines."
    ],
    procedures: [
      "Step 1: Draw given line AB to required length.",
      "Step 2: From endpoint A, draw an auxiliary ray AC at any convenient acute angle (approx. 25°–35°).",
      "Step 3: With dividers or compass set to any convenient step, mark off the required number of equal units along AC.",
      "Step 4: Join the final unit marker to endpoint B with a thin straight line.",
      "Step 5: Using sliding set-squares, draw parallel lines from each division marker back to line AB."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Equal Division of Line AB into 5 Equal Segments",
        description: "Acute auxiliary ray AC divided into 5 equal increments using dividers, with parallel transfer lines dividing AB accurately into 5 equal parts.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Line AB = 135mm", "Divisions = 5 equal parts (27mm each)", "Auxiliary Angle θ ≈ 30°"],
        technicalNotes: ["Step-off divider radius constant", "Parallel lines drawn with sliding set-squares", "Cumulative error = 0.0mm"]
      },
      {
        figureNumber: "Fig. 2.2",
        title: "Proportional Ratio Division of a Line (Ratio 2 : 3 : 4)",
        description: "Laying out sum of parts (2 + 3 + 4 = 9 units) along the inclined ray to divide structural member AB in exact engineering proportions.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Line AB = 180mm", "Ratio = 2 : 3 : 4", "Segment 1 = 40mm", "Segment 2 = 60mm", "Segment 3 = 80mm"],
        technicalNotes: ["9 equal divisions on auxiliary ray", "Projector lines parallel", "HB markers at division points"]
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Division of a Line Using Ruled Paper / Parallel Ladder Method",
        description: "Using standard parallel ruled lines or grid intervals to divide an unmeasured segment by rotating the line across grid intersections.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Line Length = 117mm", "Grid Spacing = 15mm", "Subdivisions = 6 equal parts"],
        technicalNotes: ["Zero mark on datum line 0", "Endpoint on datum line N", "Fast workshop layout method"]
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Finding the Geometric Mean (Mean Proportional) on a Line",
        description: "Euclidean semi-circle construction on diameter (A + B) to determine the exact mean proportional length x where x² = a × b.",
        svgType: "bisection",
        imageUrl: "/assets/bisection_plate.jpg",
        dimensions: ["Segment a = 50mm", "Segment b = 80mm", "Mean Proportional x = 63.25mm"],
        technicalNotes: ["Semi-circle drawn on (a+b) as diameter", "Perpendicular erected at junction point", "Thales right-angle theorem"]
      }
    ]
  },

  // 3. SS1: Regular Polygons
  "TD-SS1-MOD03": {
    id: "TD-SS1-MOD03",
    level: "SS1",
    title: "Construction of Regular Polygons (Pentagon & Hexagon)",
    introduction: "Regular polygons have equal sides and equal interior angles. Methods for constructing pentagons, hexagons, and octagons either inscribe them within a circle or construct them on a given baseline using set-square angles or compass circle subdivisions.",
    principles: [
      "A regular hexagon has interior angles of 120° and external angles of 60°. Its side length equals the radius of its circumscribing circle.",
      "Hexagons can be drawn 'across corners' (distance across opposite vertices) or 'across flats' (distance across opposite parallel faces).",
      "Regular pentagons have interior angles of 108°. They are constructed using the 72° external angle or the auxiliary circle division theorem."
    ],
    isoStandards: [
      "ISO 128-22: Line conventions and geometric figures.",
      "WAEC TD Paper 2: Plane Geometry and Regular Figures."
    ],
    procedures: [
      "Step 1: For a hexagon on given base AB, draw arcs of radius AB from A and B to find center O.",
      "Step 2: With center O and radius AB, draw the complete circumscribing circle passing through A and B.",
      "Step 3: Step off side length AB around the circumference to locate points C, D, E, and F.",
      "Step 4: Join all points with thick continuous HB lines."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 3.1",
        title: "Regular Hexagon Constructed Across Corners (A/C = 2S)",
        description: "Construction showing circumscribing circle of diameter C = 2S (radius R = S) stepped off with 60° compass chords to locate all 6 perimeter vertices.",
        svgType: "polygon-across-corners",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Across Corners C = 300mm", "Side S = 150mm", "Interior Angle = 120°"],
        technicalNotes: ["Step-off with compass radius R = S", "HB finished perimeter", "6 equilateral internal triangles"]
      },
      {
        figureNumber: "Fig. 3.2",
        title: "Regular Hexagon Constructed Across Flats (A/F = W, 30°/60° Tangents)",
        description: "Engineering fastener representation where distance across parallel flats W is given, constructing 6 tangents to inscribed circle with T-square and 30°/60° set-square.",
        svgType: "polygon-across-flats",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Width Across Flats W = 260mm", "Inscribed Radius r = 130mm", "Side S = 150.1mm", "Across Corners C = 300.2mm"],
        technicalNotes: ["Tangents touch inscribed circle", "Drawn with T-square and 30°/60° set-square", "Standard ISO bolt head layout"]
      },
      {
        figureNumber: "Fig. 3.3",
        title: "Master Comparative Plate: Across Flats vs Across Corners",
        description: "Direct comparative plate illustrating difference between distance across opposite vertices (A/C = 2S) and distance across opposite flat edges (A/F = S√3).",
        svgType: "polygon-comparative",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Left A/C = 220mm", "Right A/F = 190.5mm", "Common Side S = 110mm"],
        technicalNotes: ["A/C uses circumscribed circle", "A/F uses inscribed circle", "Mandatory distinction in WAEC examinations"]
      },
      {
        figureNumber: "Fig. 3.4",
        title: "Regular Pentagon on Given Base AB (108° Interior Angles)",
        description: "Compass arc intersections and perpendicular bisector determining 108° interior vertices and top apex on given base AB using golden ratio diagonal method.",
        svgType: "pentagon",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Base AB = 70mm", "Apex Height = 95mm", "Interior Angle = 108°"],
        technicalNotes: ["Auxiliary diagonal construction", "Equal edge verification", "Golden ratio diagonal theorem"]
      },
      {
        figureNumber: "Fig. 3.5",
        title: "Universal General Method for Any Regular N-Sided Polygon",
        description: "Dividing diameter AB of circumscribed circle into N equal parts and projecting through division 2 from auxiliary apex to locate polygon sides.",
        svgType: "polygon",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Diameter = 120mm", "Number of Sides N = 7 (Heptagon)", "Chord Length = 52mm"],
        technicalNotes: ["Equilateral triangle on diameter AB", "Ray through division 2 establishes vertex C", "Universal NERDC syllabus method"]
      }
    ]
  },

  // 3b. SS1: Regular Pentagon (Given Base Length - J.N. Green Fig. 4.12)
  "TD-SS1-MOD07": {
    id: "TD-SS1-MOD07",
    level: "SS1",
    title: "Construction of a Regular Pentagon (Given Base Length)",
    introduction: "A regular pentagon is an equilateral, equiangular 5-sided polygon with interior angles of 108.0°. Its classical geometric construction on a given base AB is based on the Golden Ratio theorem (φ ≈ 1.618033), where the pentagonal diagonal d relates to side length S by d = S × 1.618.",
    principles: [
      "Interior Angle Formula: θ = (5 - 2) × 180° / 5 = 108.0°. The sum of all five interior angles is 540°.",
      "Golden Ratio Diagonal Theorem: The diagonal d of a regular pentagon with side S satisfies d = S × (1 + √5) / 2 ≈ 1.618033 × S.",
      "Perpendicular and Midpoint Locus: Erecting perpendicular BQ = AB at endpoint B and swinging compass arc from midpoint M with radius MQ cuts the extended baseline at P, yielding length AP = diagonal d.",
      "Apex and Side Intersections: Intersecting arcs of radius AP struck from A and B locate apex D on the axis of symmetry. Arcs of radius S from A, B, and D establish vertices E and C."
    ],
    procedures: [
      "Step 1: Using a T-square and 2H pencil, draw horizontal base line AB = S (e.g., 70mm). Extend the line to the right of B.",
      "Step 2: Bisect AB to find midpoint M and erect a perpendicular centerline (axis of symmetry).",
      "Step 3: At endpoint B, erect a perpendicular line BQ equal in length to AB (BQ = S).",
      "Step 4: Draw construction segment MQ. With center M and compass radius MQ, strike an arc cutting the extension of AB at point P.",
      "Step 5: Length AP is the true diagonal length (d = 1.618 × S). With compass set to radius AP and center at A, strike an arc above; with center B and the same radius AP, strike an arc cutting the first at apex D.",
      "Step 6: Reset compass to side length S. With centers A and B, swing arcs of radius S; with center D, swing intersecting arcs of radius S to locate lateral vertices E and C.",
      "Step 7: Using a straightedge and sharp HB pencil (0.7mm), join A-B-C-D-E-A to complete the finished regular pentagon."
    ],
    isoStandards: [
      "Finished pentagon outline A-B-C-D-E-A: Continuous Thick (0.70mm HB pencil)",
      "Baseline extension, perpendicular BQ, and guide arcs: Continuous Thin (0.25mm 2H pencil)",
      "Perpendicular axis of symmetry: Chain Thin (0.25mm 2H pencil)",
      "WAEC Requirement: All construction guide arcs (especially MQ to P and apex arcs) must be left visible."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 7.1",
        title: "Regular Pentagon on Given Base AB (Golden Ratio Diagonal Method)",
        description: "Classical drafting method from J.N. Green Fig. 4.12 using perpendicular BQ = AB, midpoint arc to point P, and diagonal AP to establish apex D and lateral vertices C and E.",
        svgType: "pentagon",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Base Side S = 70.0mm", "Golden Diagonal d = 113.3mm", "Interior Angle = 108.0°", "Apex Height = 107.8mm"],
        technicalNotes: ["Perpendicular BQ = AB", "Midpoint arc MQ cuts extension at P", "Apex D at intersection of radius AP from A and B", "WAEC syllabus mandatory method"]
      },
      {
        figureNumber: "Fig. 7.2",
        title: "Geometric Anatomy: 108° Interior Angles and Golden Ratio Diagonals",
        description: "Schematic analysis demonstrating the 5 equal 108° interior angles, perpendicular axis of symmetry, and the golden ratio proportion d/S = 1.618033.",
        svgType: "pentagon",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["All 5 Sides = S", "All 5 Interior Angles = 108.0°", "Exterior Angle = 72.0°", "Ratio d/S = 1.618"],
        technicalNotes: ["5-fold rotational symmetry", "Diagonals form central golden pentagram", "Axis of symmetry passes through apex D and midpoint M"]
      },
      {
        figureNumber: "Fig. 7.3",
        title: "Regular Pentagon Inscribed in Circle of Diameter D (J.N. Green Fig. 4.14)",
        description: "Circle inscription method: bisecting radius to locate auxiliary center and swinging arc to step off the 5 equal pentagonal chords around the circumference.",
        svgType: "pentagon",
        imageUrl: "/assets/actual_polygon_conic.jpg",
        dimensions: ["Circumcircle Diameter D = 120mm", "Side S = 70.5mm", "Central Angle = 72.0°"],
        technicalNotes: ["Bisect horizontal radius", "Swing arc to vertical radius", "Step off 5 equal chords around perimeter"]
      }
    ]
  },

  // 4. SS1: Plain and Diagonal Scales
  "TD-SS1-MOD04": {
    id: "TD-SS1-MOD04",
    level: "SS1",
    title: "Plain and Diagonal Scales",
    introduction: "Engineering scales allow large civil structures or tiny mechanical parts to be drawn proportionally on paper. Plain scales show two units (e.g. meters and decimeters), while diagonal scales use the principle of similar triangles to read three units (e.g. meters, decimeters, and centimeters).",
    principles: [
      "Representative Fraction (RF) = Dimension of object on drawing / Actual dimension of object.",
      "Length of Scale (LOS) = RF × Maximum length to be measured.",
      "In diagonal scales, a vertical division is subdivided into 10 parts by diagonal lines, reading down to 1/10th of the secondary unit."
    ],
    isoStandards: [
      "ISO 5455: Technical drawings — Scales.",
      "BS 8888: Technical product documentation and scales."
    ],
    procedures: [
      "Step 1: Calculate Representative Fraction (RF) and Length of Scale (LOS).",
      "Step 2: Draw a horizontal rectangle of length LOS and divide it into the required number of major units.",
      "Step 3: Subdivide the first major unit (to the left of zero) into 10 equal secondary units.",
      "Step 4: For diagonal scales, erect 10 equidistant horizontal lines and draw inclined diagonals."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Plain Metric Scale (RF 1:50) Reading Meters and Decimeters",
        description: "Engineering plain scale displaying primary meters to the right of zero datum and subdivided decimeters to the left.",
        svgType: "scale",
        imageUrl: "/assets/scales_plate.jpg",
        dimensions: ["RF = 1:50", "LOS = 160mm", "Max Reading = 8m", "Tolerance ±1mm"],
        technicalNotes: ["Zero datum placed at 1st major division", "Primary units labeled 1, 2, 3, 4", "Subdivisions labeled 10 dm"]
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Diagonal Scale (RF 1:50) Reading Three Units (m, dm, cm)",
        description: "Full diagonal scale utilizing similar triangles across 10 vertical divisions to read down to centimeters with microscopic accuracy.",
        svgType: "scale",
        imageUrl: "/assets/scales_plate.jpg",
        dimensions: ["RF = 1:50", "LOS = 160mm", "Reading = 5.46m", "Least Count = 0.01m (1cm)"],
        technicalNotes: ["10 vertical equidistant divisions", "Diagonals inclined from unit n to n-1", "Precision callout arrows"]
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Scale of Chords for Measuring Angles Without a Protractor",
        description: "Geometric scale constructed on a quadrant of a circle calibrated in chord lengths from 0° to 90° for precision angular drafting.",
        svgType: "scale",
        imageUrl: "/assets/scales_plate.jpg",
        dimensions: ["Radius R = 60mm (Chord 60° = R)", "Angular Range = 0° to 90°", "Interval = 5° steps"],
        technicalNotes: ["Chord of 60° equals base radius R", "Direct transfer using compass", "Traditional navigation & drafting tool"]
      },
      {
        figureNumber: "Fig. 4.4",
        title: "Comparative Scale Layout (Metric and Imperial Dual Calibration)",
        description: "Dual-graduated comparative scale with a single Representative Fraction allowing direct cross-reading between kilometers and miles.",
        svgType: "scale",
        imageUrl: "/assets/scales_plate.jpg",
        dimensions: ["RF = 1:100,000", "Upper Scale = Kilometers", "Lower Scale = Statute Miles"],
        technicalNotes: ["Common zero datum line", "Direct comparative dimensional transfer", "Civil survey and cartography standard"]
      }
    ]
  },

  // 5. SS3: Orthographic Projection (1st and 3rd Angle)
  "TD-ORTHO-01": {
    id: "TD-ORTHO-01",
    level: "SS3",
    title: "First and Third Angle Orthographic Projections",
    introduction: "Orthographic projection is the international language of engineering. It projects 3D objects onto orthogonal 2D planes (Front Elevation, End Elevation, and Plan) using parallel projection rays perpendicular to the viewing planes.",
    principles: [
      "First Angle Projection: The object lies between the observer and the plane. Plan is drawn BELOW the Front Elevation.",
      "Third Angle Projection: The plane lies between the observer and the object. Plan is drawn ABOVE the Front Elevation.",
      "A 45° mitre projection line in the vacant quadrant enables direct projection of dimensions between the Plan and End Elevation."
    ],
    isoStandards: [
      "ISO 128-30: Basic conventions for views.",
      "ISO 5456-2: Orthographic representations."
    ],
    procedures: [
      "Step 1: Establish principal reference planes (horizontal and vertical datum axes intersecting at origin).",
      "Step 2: Project Front Elevation directly from primary dimensions.",
      "Step 3: Project vertical rays downward (1st Angle) or upward (3rd Angle) to locate the Plan.",
      "Step 4: Draw a 45° mitre line from the axes intersection to transfer depths to the End Elevation."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 5.1",
        title: "First Angle Orthographic Layout with 45° Mitre Line & ISO Symbol",
        description: "Standard British/European layout showing Front Elevation, Plan below, Left End Elevation on the right, and ISO truncated cone symbol.",
        svgType: "orthographic",
        imageUrl: "/assets/actual_orthographic_diagram.jpg",
        dimensions: ["Width = 100mm", "Height = 70mm", "Depth = 50mm", "View Spacing = 25mm"],
        technicalNotes: ["ISO 1st Angle Truncated Cone symbol in title block", "45° mitre depth transfer ray", "Thin 2H projection rays"]
      },
      {
        figureNumber: "Fig. 5.2",
        title: "Third Angle Orthographic Layout (American Standard)",
        description: "North American convention where Plan sits directly above Front Elevation and Right End Elevation sits to the right.",
        svgType: "orthographic",
        imageUrl: "/assets/actual_orthographic_diagram.jpg",
        dimensions: ["Spacing = 25mm between views", "Coordinate Datum = WCS (0,0)"],
        technicalNotes: ["ISO 3rd Angle Symbol", "Hidden detail indicated by ISO Type E dashed lines", "Centerlines ISO Type G"]
      },
      {
        figureNumber: "Fig. 5.3",
        title: "Auxiliary Projection: True Shape of an Inclined Oblique Surface",
        description: "Auxiliary viewing plane parallel to inclined cut face projecting true geometric dimensions and true angular slopes.",
        svgType: "orthographic",
        imageUrl: "/assets/actual_orthographic_diagram.jpg",
        dimensions: ["Slope Angle = 45°", "True Length = 70.7mm", "True Width = 40mm"],
        technicalNotes: ["Projectors drawn normal (90°) to inclined face", "Reference datum transferred from Plan", "Determines true hole ellipses"]
      },
      {
        figureNumber: "Fig. 5.4",
        title: "Orthographic Sectional Elevation with Internal Detail & Counter-Bores",
        description: "Full sectional front view on cutting plane line A-A showing 45° cross-hatching across solid web and un-hatched central shaft.",
        svgType: "orthographic",
        imageUrl: "/assets/actual_orthographic_diagram.jpg",
        dimensions: ["Shaft Ø = 30mm", "Counter-bore Ø = 50mm", "Web Thickness = 12mm"],
        technicalNotes: ["Cutting plane marked A-A with thick end arrows", "Uniform 45° ISO 128 hatching", "Hidden detail omitted on section"]
      }
    ]
  },

  // 6. SS2: Internal & External Tangents
  "TD-SS2-MOD02": {
    id: "TD-SS2-MOD02",
    level: "SS2",
    title: "Internal and External Common Tangents to Two Circles",
    introduction: "Tangency problems involving pulleys, belts, gear trains, and mechanical linkages require drawing internal (cross-belt) or external (open-belt) common tangents between rotating shafts.",
    principles: [
      "An internal common tangent crosses the centerline connecting the two circle centers.",
      "The radius of the auxiliary construction circle for an internal tangent equals the SUM of the radii (R₁ + R₂).",
      "The radius of the auxiliary construction circle for an external tangent equals the DIFFERENCE of the radii (R₁ - R₂).",
      "Tangency contact lines are always perpendicular (normal) to the tangent line at the point of contact."
    ],
    isoStandards: [
      "ISO 129-1: Indication of dimensions and tolerances.",
      "WAEC TD Paper 2: Mechanical Linkages and Tangency Conventions."
    ],
    procedures: [
      "Step 1: Draw circles with centers O₁ and O₂ and radii R₁ and R₂. Join centers O₁O₂.",
      "Step 2: Find midpoint M of line O₁O₂ and draw a semi-circle on O₁O₂ as diameter.",
      "Step 3: From center O₁, draw auxiliary circle with radius (R₁ + R₂) intersecting semi-circle at point P.",
      "Step 4: Join O₁P to intersect circle 1 at tangent point T₁. Draw parallel line from O₂ to locate T₂.",
      "Step 5: Join T₁ and T₂ with thick continuous line to produce the required common tangent."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Internal Common Tangent to Two Unequal Circles (Sum Radius R₁ + R₂)",
        description: "Crossing belt construction using auxiliary circle of radius (R₁ + R₂) on semi-circle diameter O₁O₂ to locate tangent points T₁ and T₂.",
        svgType: "tangent",
        imageUrl: "/assets/actual_geometry_tangency.jpg",
        dimensions: ["Circle 1 R₁ = 45mm", "Circle 2 R₂ = 25mm", "Center Distance = 160mm"],
        technicalNotes: ["Auxiliary circle R = 70mm", "Normal lines O₁T₁ and O₂T₂ parallel", "Crosses central axis"]
      },
      {
        figureNumber: "Fig. 2.2",
        title: "External Common Tangent to Two Unequal Circles (Difference Radius R₁ - R₂)",
        description: "Open belt layout utilizing difference circle of radius (R₁ - R₂) at larger center O₁ to establish parallel normal contact lines.",
        svgType: "tangent",
        imageUrl: "/assets/actual_geometry_tangency.jpg",
        dimensions: ["Circle 1 R₁ = 50mm", "Circle 2 R₂ = 20mm", "Auxiliary R = 30mm"],
        technicalNotes: ["Difference circle drawn at O₁", "Tangents do not cross centerline", "Common in automotive timing belt drives"]
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Blending External Tangency Arc Connecting Two Displaced Circles",
        description: "Striking a smooth transitional circular curve of radius R_blend that touches two given circles externally without sharp corners.",
        svgType: "tangent",
        imageUrl: "/assets/actual_geometry_tangency.jpg",
        dimensions: ["Circle 1 R₁ = 35mm", "Circle 2 R₂ = 20mm", "Blend Radius R = 85mm"],
        technicalNotes: ["Center found by compass intersection (R - R₁) and (R - R₂)", "Tangent normal lines mark exact blend joints", "Machine casing outline"]
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Compound Ogee (Reverse S-Curve) Connecting Parallel Centerlines",
        description: "Smooth reverse curve composed of two circular arcs curving in opposite directions connecting parallel lines AB and CD.",
        svgType: "tangent",
        imageUrl: "/assets/actual_geometry_tangency.jpg",
        dimensions: ["Line Offset = 50mm", "Arc Radii R₁ = R₂ = 45mm", "Inflection Point P at Center"],
        technicalNotes: ["Inflection point marks transition between curves", "Both radii normal to parallel lines at tangency", "Used in pipework and civil roadways"]
      }
    ]
  },

  // 7. SS2: 3D Isometric Projection
  "TD-SS2-MOD03": {
    id: "TD-SS2-MOD03",
    level: "SS2",
    title: "Isometric Projection and Isometric Circles (Four-Center Method)",
    introduction: "Isometric projection displays 3D objects pictorially on a single plane with three axes spaced at 120° (one vertical, two at 30° to the horizontal). Circles in isometric projection appear as ellipses and are constructed using the classic four-center approximation.",
    principles: [
      "All horizontal receding lines are drawn at 30° to the horizontal datum using the 30°/60° set square.",
      "Isometric lines are parallel to the isometric axes and are measurable with a scale rule.",
      "Non-isometric lines cannot be measured directly; their endpoints must be located on isometric reference planes.",
      "An isometric circle (ellipse) inside an isometric square (rhombus) has major and minor axes in the ratio of √3:1."
    ],
    isoStandards: [
      "ISO 5456-3: Axonometric representations.",
      "BS 8888: Pictorial projections and isometric circles."
    ],
    procedures: [
      "Step 1: Construct the three isometric axes (vertical axis, and two axes at 30° to horizontal).",
      "Step 2: Draw the isometric bounding box representing maximum height, width, and depth.",
      "Step 3: For isometric circles, draw a rhombus with sides equal to the circle diameter.",
      "Step 4: Join obtuse corners to the midpoints of opposite sides to establish four arc centers."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 3.1",
        title: "30° Isometric Axes Setup and Isometric Bounding Box Layout",
        description: "Primary coordinate axes inclined at 120° to each other (vertical and two 30° axes) enclosing an engineering component bounding box.",
        svgType: "isometric",
        imageUrl: "/assets/actual_isometric_diagram.jpg",
        dimensions: ["Axis Angles = 30° / 90° / 30°", "Bounding Box = 80 × 60 × 50mm"],
        technicalNotes: ["Drawn with 30°/60° set-square on T-square", "Isometric scale ratio = 0.816 (isometric projection)", "Scale 1:1 used in isometric drawing"]
      },
      {
        figureNumber: "Fig. 3.2",
        title: "Four-Center Ellipse Method in 30° Isometric Rhombus",
        description: "Constructing isometric circles on horizontal and vertical planes using obtuse corners and side midpoints to locate 4 compass arc centers.",
        svgType: "isometric",
        imageUrl: "/assets/actual_isometric_diagram.jpg",
        dimensions: ["Diameter D = 70mm", "Rhombus Side = 70mm", "Major Axis = 1.22D", "Minor Axis = 0.71D"],
        technicalNotes: ["Two large radius arcs from 120° obtuse corners", "Two small radius arcs from acute diagonal intersections", "Tangent points at rhombus side midpoints"]
      },
      {
        figureNumber: "Fig. 3.3",
        title: "Isometric Representation of Sloping and Non-Isometric Faces",
        description: "Locating endpoints of inclined surfaces by plotting coordinates along isometric axes and connecting with non-isometric lines.",
        svgType: "isometric",
        imageUrl: "/assets/actual_isometric_diagram.jpg",
        dimensions: ["Base Length = 90mm", "Stepped Height = 45mm", "Chamfer Slope = 35°"],
        technicalNotes: ["Non-isometric lines cannot be measured directly with scale rule", "Coordinate box method applied", "Slopes checked via coordinate offsets"]
      },
      {
        figureNumber: "Fig. 3.4",
        title: "Isometric Half-Sectional Cut Revealing Internal Cylindrical Cavities",
        description: "Cutaway isometric view showing internal counter-bores and shafts with 60°/30° cross-hatching across cut solid sections.",
        svgType: "isometric",
        imageUrl: "/assets/actual_isometric_diagram.jpg",
        dimensions: ["Outer Bore Ø = 60mm", "Inner Bore Ø = 30mm", "Hatching Angle = 60°"],
        technicalNotes: ["Hatching inclined at 60° to match isometric plane", "Reveals wall thickness and internal ribs", "Shafts and bolts left uncut"]
      }
    ]
  },

  // 8. SS2: Conic Sections (Ellipse & Parabola)
  "TD-SS2-MOD04": {
    id: "TD-SS2-MOD04",
    level: "SS2",
    title: "Conic Sections: Ellipse by Concentric Circles and Parabola",
    introduction: "Conic sections are curves formed by the intersection of a plane with a circular cone. An ellipse has eccentricity e < 1, while a parabola has e = 1. Engineering applications include elliptical arch bridges, cams, reflectors, and aerodynamic profiles.",
    principles: [
      "In the concentric circles method for an ellipse, two circles are drawn with diameters equal to the major and minor axes.",
      "Radial lines divide the circles into 12 equal sectors (at 30° using set squares).",
      "Horizontal projectors from the minor circle intersect vertical projectors from the major circle to locate points on the ellipse curve.",
      "For a parabola, points on the curve are equidistant from the focus and the directrix."
    ],
    isoStandards: [
      "ISO 128-20: Technical drawings conventions.",
      "NERDC Unit 5: Conic Sections and Applied Geometry."
    ],
    procedures: [
      "Step 1: Draw major axis AB and minor axis CD intersecting perpendicularly at center O.",
      "Step 2: Describe major auxiliary circle (diameter AB) and minor circle (diameter CD).",
      "Step 3: Divide circles into 12 equal parts using 30° and 60° set squares.",
      "Step 4: Draw verticals from major circle points and horizontals from minor circle points.",
      "Step 5: Connect intersection points using a French curve or flexible curve to form a smooth HB ellipse."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 4.1",
        title: "Concentric Circles Method for Ellipse (12 Radial 30° Sectors)",
        description: "Major and minor auxiliary circles subdivided into 12 equal sectors with horizontal and vertical coordinate projectors mapping the locus of the ellipse.",
        svgType: "conic",
        imageUrl: "/assets/conic_sections_plate.jpg",
        dimensions: ["Major Axis = 140mm", "Minor Axis = 80mm", "Radial Angle = 30° increments"],
        technicalNotes: ["12 radial divisions with 30°/60° set-squares", "Horizontal projector from minor circle", "Smooth French curve trace"]
      },
      {
        figureNumber: "Fig. 4.2",
        title: "Parabola by Rectangular Enclosure / Offset Tangent Method",
        description: "Constructing a parabolic trajectory inside an enclosing rectangle by dividing half-base and height into equal proportional increments.",
        svgType: "conic",
        imageUrl: "/assets/conic_sections_plate.jpg",
        dimensions: ["Base Span = 120mm", "Axis Rise = 70mm", "Divisions = 5 equal parts"],
        technicalNotes: ["Equal fractional divisions on base and sides", "Rays from apex intersect vertical grid", "Symmetrical parabolic arch profile"]
      },
      {
        figureNumber: "Fig. 4.3",
        title: "Construction of an Ellipse using Focal Points (F₁ & F₂) and Trammel",
        description: "Locating foci by striking arc of radius ½ Major Axis from minor vertex C, demonstrating pin-and-string and paper trammel construction.",
        svgType: "conic",
        imageUrl: "/assets/conic_sections_plate.jpg",
        dimensions: ["Focal Distance F₁F₂ = 114.8mm", "Sum of Distances PF₁ + PF₂ = Major Axis = 140mm"],
        technicalNotes: ["Foci F₁ and F₂ on major axis", "Paper trammel method with points A, B, P", "Architectural elliptical masonry arch"]
      },
      {
        figureNumber: "Fig. 4.4",
        title: "Hyperbola Construction by Directrix-Focus and Cutting Plane on Cone",
        description: "Locus of points where ratio of distance from focus to distance from directrix exceeds 1 (e > 1), and true shape of cutting plane parallel to cone axis.",
        svgType: "conic",
        imageUrl: "/assets/conic_sections_plate.jpg",
        dimensions: ["Eccentricity e = 1.4", "Apex Angle of Cone = 60°", "Focal Length = 35mm"],
        technicalNotes: ["Cutting plane steeper than cone generator", "Asymptotes pass through hyperbola center", "Used in cooling towers and supersonic nozzles"]
      }
    ]
  },

  // 9. SS3: Surface Developments
  "TD-SS3-MOD01": {
    id: "TD-SS3-MOD01",
    level: "SS3",
    title: "Surface Development of Prisms, Cylinders, and Cones",
    introduction: "Surface development is the unrolling or unfolding of a 3D hollow object onto a flat 2D plane without stretching or distortion. Essential in sheet metal fabrication, ductwork, packaging, and aerospace skin manufacturing.",
    principles: [
      "Parallel line development is applied to prisms and cylinders where all folding lines or generators are parallel.",
      "Radial line development is applied to pyramids and cones where all elements radiate from a single apex.",
      "True lengths must always be determined before laying out development patterns."
    ],
    isoStandards: [
      "ISO 128-34: Views on mechanical engineering drawings.",
      "WAEC TD Paper 2: Surface Developments and Interpenetration."
    ],
    procedures: [
      "Step 1: Draw elevation and plan of the given truncated cylinder or prism.",
      "Step 2: Divide the plan circumference into 12 equal parts and project generators to the elevation.",
      "Step 3: Lay out the stretch-out baseline equal to circumference (π × D) and divide into 12 equal parts.",
      "Step 4: Project horizontal heights from the truncated elevation cut face to corresponding generators."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Parallel Line Development of a Truncated Cylinder (Stretchout πD)",
        description: "Elevation view linked to unfolded 2D stretchout pattern of length πD with 12 generator heights generating a smooth sinusoidal cut curve.",
        svgType: "development",
        imageUrl: "/assets/surface_development_plate.jpg",
        dimensions: ["Diameter D = 60mm", "Stretchout Length = 188.5mm", "Height = 100mm"],
        technicalNotes: ["12 generator lines spaced at 15.7mm", "Smooth sinusoidal truncated profile", "0.4mm seam allowance added in sheet metal"]
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Parallel Line Development of a Hexagonal Prism with Inclined Face",
        description: "Unfolded flat pattern of 6 rectangular panels with sharp crease lines and true heights projected from the 30° cut elevation.",
        svgType: "development",
        imageUrl: "/assets/surface_development_plate.jpg",
        dimensions: ["Side S = 35mm", "Total Stretchout = 210mm", "Max Height = 95mm"],
        technicalNotes: ["6 equal folding panels", "Crease fold lines shown as thin continuous lines", "True cut shape top lid attached"]
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Radial Line Development of a Truncated Right Circular Cone",
        description: "Sector of a circle of radius equal to slant height L with angular span θ = (r/L) × 360°, with true truncated radii stepped off.",
        svgType: "development",
        imageUrl: "/assets/surface_development_plate.jpg",
        dimensions: ["Base Radius r = 30mm", "Slant Height L = 90mm", "Sector Angle θ = 120°"],
        technicalNotes: ["True lengths taken along outer generator", "Horizontal cut yields concentric circular arc", "Used in sheet metal funnels and duct transitions"]
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Triangulation Development of a Square-to-Round Duct Transition",
        description: "Dividing complex transitional surfaces into series of contiguous triangles whose true lengths are found by auxiliary right triangles.",
        svgType: "development",
        imageUrl: "/assets/surface_development_plate.jpg",
        dimensions: ["Square Base = 80 × 80mm", "Round Top Ø = 50mm", "Vertical Height = 75mm"],
        technicalNotes: ["True length diagram constructed for each seam", "Quarter pattern repeated symmetrically", "HVAC ventilation duct standard"]
      }
    ]
  },

  // 10. SS3: Sectioning & Hatching
  "TD-SS3-MOD02": {
    id: "TD-SS3-MOD02",
    level: "SS3",
    title: "Sectional Views, Cutting Planes, and ISO Hatching Rules",
    introduction: "Sectional views reveal internal cavities, bores, and structural webs of mechanical or architectural components that would otherwise be obscured by hidden detail lines.",
    principles: [
      "Cutting plane lines (ISO 128 Type F) are thin chain lines with thick ends, arrows, and identification letters (e.g., A-A).",
      "Cross-hatching lines are continuous thin lines (0.25mm) drawn at 45° with uniform 1.5mm to 3mm spacing.",
      "Standard parts such as bolts, nuts, rivets, shafts, keys, and web ribs are NEVER sectioned or hatched longitudinally."
    ],
    isoStandards: [
      "ISO 128-40: Basic conventions for cuts and sections.",
      "ISO 128-50: Basic conventions for representing areas on cuts and sections."
    ],
    procedures: [
      "Step 1: Draw the cutting plane line A-A through the centerline of symmetry in the plan or elevation.",
      "Step 2: Orient arrowheads pointing in the direction of view.",
      "Step 3: Project the sectional view showing cut solid material and hollow cavities.",
      "Step 4: Apply uniform 45° hatching lines across cut solid surfaces using a 45° set square."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 2.1",
        title: "Full Sectional Elevation on Cutting Plane A-A with 45° ISO Hatching",
        description: "Hollow stepped bushing cut completely through centerline showing uniform 45° hatching across solid cut walls and clean bore.",
        svgType: "section",
        imageUrl: "/assets/sectioning_plate.jpg",
        dimensions: ["External Ø = 90mm", "Internal Bore Ø = 40mm", "Hatch Angle = 45°"],
        technicalNotes: ["ISO Type F cutting plane line", "0.25mm 2H hatching spacing = 2.5mm", "Visible boundary 0.7mm HB"]
      },
      {
        figureNumber: "Fig. 2.2",
        title: "Half-Sectional Elevation with Centerline of Symmetry",
        description: "Symmetrical component showing outside appearance on one half and internal cavity details on the other half separated by a centerline.",
        svgType: "section",
        imageUrl: "/assets/sectioning_plate.jpg",
        dimensions: ["Component Width = 110mm", "Height = 85mm", "Half Cut at 90°"],
        technicalNotes: ["No solid line separating cut and uncut halves; centerline used", "Hidden detail lines omitted on un-hatched half", "Saves drawing time and space"]
      },
      {
        figureNumber: "Fig. 2.3",
        title: "Revolved and Removed Sections on Machine Structural Arms/Webs",
        description: "Rotating the cross-section of a structural spoke or I-beam 90° directly on the longitudinal view to show exact cross-sectional profile.",
        svgType: "section",
        imageUrl: "/assets/sectioning_plate.jpg",
        dimensions: ["Spoke Thickness = 14mm", "Flange Width = 28mm", "Revolved Angle = 90°"],
        technicalNotes: ["Drawn with thin continuous outline when revolved in-place", "Removed section placed adjacent with reference letters", "Standard pulley and bracket convention"]
      },
      {
        figureNumber: "Fig. 2.4",
        title: "Offset Cutting Plane Section Navigating Displaced Mechanical Bores",
        description: "Stepped cutting plane A-B-C-D bending at 90° to pass through multiple non-collinear holes without showing step lines on the sectional view.",
        svgType: "section",
        imageUrl: "/assets/sectioning_plate.jpg",
        dimensions: ["Hole 1 Ø = 18mm", "Hole 2 Ø = 24mm", "Offset Step = 30mm"],
        technicalNotes: ["Step changes indicated on cutting plane with thick elbows", "No partition lines shown where plane offsets", "Illustrates all features in one view"]
      }
    ]
  },

  // 11. Building Construction: Foundation & Blockwall
  "TD-BLD-01": {
    id: "TD-BLD-01",
    level: "SS3/Building",
    title: "Building Drawing: Strip Foundation & Sandcrete Wall Section",
    introduction: "Architectural and building drawing provides the working blueprints for civil structures. The strip foundation detail illustrates the load-bearing path from the superstructure wall down to the subsoil trench.",
    principles: [
      "Strip foundations are cast in in-situ concrete (nominal 1:3:6 or 1:2:4 mix) with minimum 150mm projection beyond blockwork.",
      "The sub-structure wall is 225mm solid sandcrete blockwork filled with mortar or concrete up to the Damp Proof Course (DPC).",
      "Damp Proof Course (DPC) prevents capillary rise of ground moisture and is laid on top of the foundation mortar bed."
    ],
    isoStandards: [
      "BS 1192: Construction drawing practice.",
      "NERDC Building Construction Curriculum Unit 4."
    ],
    procedures: [
      "Step 1: Draw ground level (GL) datum and excavation trench depth (minimum 900mm below GL).",
      "Step 2: Construct the concrete footing (675mm wide × 225mm thick) with standard concrete aggregate hatching.",
      "Step 3: Erect the 225mm sandcrete block wall centered on the footing.",
      "Step 4: Add hardcore bed (150mm), sand blinding (25mm), DPM membrane, and 100mm reinforced concrete floor slab."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Detailed Vertical Section Through Strip Foundation, Hardcore, DPC, and Block Wall",
        description: "Foundation trench, concrete footing, sandcrete wall, DPC membrane, hardcore bed, sand blinding, and reinforced floor slab.",
        svgType: "building",
        imageUrl: "/assets/actual_building_foundation.jpg",
        dimensions: ["Footing Width = 675mm", "Footing Depth = 225mm", "Wall = 225mm", "Depth below GL = 900mm"],
        technicalNotes: ["Triangular hatching for concrete", "Solid black line for DPC membrane", "Standard Nigerian building code proportions"]
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Foundation Trench Excavation Plan and Setting-Out Profile Boards",
        description: "Trench layout plan showing centerlines, excavation widths, building lines, and timber profile boards with saw-cut guide notches.",
        svgType: "building",
        imageUrl: "/assets/actual_building_foundation.jpg",
        dimensions: ["Trench Width = 675mm", "Corner Angle = 90° (3:4:5 rule)", "Profile Offset = 1200mm"],
        technicalNotes: ["Setting-out line uses 3:4:5 builder triangle", "Trench centerlines marked with chain lines", "Excavation datum levels tied to site benchmark"]
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Lintel and Sill Architectural Detail with Damp Proof Membrane",
        description: "Reinforced concrete lintel beam above window opening (1:2:4 mix with 12mm rebar), plaster reveals, and concrete weathered window sill.",
        svgType: "building",
        imageUrl: "/assets/actual_building_foundation.jpg",
        dimensions: ["Lintel Depth = 225mm", "Bearing on Wall = 150mm", "Sill Projection = 50mm with drip throat"],
        technicalNotes: ["Drip groove prevents water running back onto wall", "Tensile rebar placed 25mm from bottom face", "WAEC building drawing paper requirement"]
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Timber Roof Truss Construction Detail (Rafter, Tie Beam, King Post)",
        description: "Eaves construction detail showing 50×150mm wall plate, 50×100mm common rafters, tie beam, ceiling joist, fascia board, and asbestos/aluminum roofing.",
        svgType: "building",
        imageUrl: "/assets/actual_building_foundation.jpg",
        dimensions: ["Rafter Pitch = 30°", "Fascia Board = 25×250mm", "Wall Plate Anchor = 12mm bolt @ 1200mm c/c"],
        technicalNotes: ["Galvanized hoop iron tie embedded in blockwork", "Birdsmouth joint notched into rafter over wall plate", "Soffit ventilation detail"]
      }
    ]
  },

  // 12. Machine Drawing: Hexagonal Bolt and Nut
  "TD-MCH-01": {
    id: "TD-MCH-01",
    level: "SS3/Machine",
    title: "Machine Drawing: ISO Metric Hexagonal Bolt, Nut, and Washer",
    introduction: "Standard threaded fasteners assemble mechanical assemblies securely. Draftsmen must know empirical proportions based on nominal thread diameter D so fasteners can be drawn quickly without looking up tables.",
    principles: [
      "Across flats width W = 1.5D + 3mm (or 1.73D across corners).",
      "Bolt head thickness = 0.7D to 0.8D; Standard Nut thickness = 0.8D to 0.9D.",
      "Washer outside diameter = 2D + 3mm; thickness = 0.15D.",
      "Chamfer angle on bolt head and nut crowns is 30° to the bearing face."
    ],
    isoStandards: [
      "ISO 4014: Hexagon head bolts.",
      "ISO 4032: Hexagon regular nuts."
    ],
    procedures: [
      "Step 1: Lay out centerline and bolt shank of nominal diameter D (e.g., M24).",
      "Step 2: Draw the bolt head rectangle of height 0.8D and width 2D across corners.",
      "Step 3: Construct the 30° chamfer arcs on the front faces using radius R = 1.5D.",
      "Step 4: Dimension thread length, shank diameter, and thread pitch callout."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "Metric Hexagonal Bolt and Nut Standard Proportions (D, 0.8D, 2D)",
        description: "Front and end elevation of an M24 bolt showing 30° crown chamfers, shank, washer, and nut with exact empirical formulas.",
        svgType: "fastener",
        imageUrl: "/assets/actual_fastener_drawing.jpg",
        dimensions: ["Nominal D = 24mm", "Head Height = 0.8D = 19.2mm", "Nut Height = 0.8D = 19.2mm", "Across Corners = 2D = 48mm"],
        technicalNotes: ["Empirical formula W = 1.5D + 3mm", "30° chamfer radius R = 1.5D", "Nominal diameter D callout"]
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Machine Fasteners: Stud, Countersunk Screw, and Spring Washer Detailing",
        description: "Detailed conventions for blind tapped holes, stud engagement (1.25D into cast iron), countersunk machine screw heads, and lock washers.",
        svgType: "fastener",
        imageUrl: "/assets/actual_fastener_drawing.jpg",
        dimensions: ["Stud Thread = M16 × 2.0", "Tap Drill Depth = 1.5D", "Countersunk Angle = 90°"],
        technicalNotes: ["Runout threads drawn at 30°", "Tap drill core diameter 0.85D", "Blind hole 118° drill point angle"]
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Flanged Shaft Coupling Assembly with Parallel Keys and Bolts",
        description: "Protected type flanged coupling joining two transmission shafts, showing recessed bolt heads, hub bored for keyway, and parallel rectangular key.",
        svgType: "fastener",
        imageUrl: "/assets/actual_fastener_drawing.jpg",
        dimensions: ["Shaft Ø = 40mm", "Flange Outer Ø = 150mm", "4 × M12 fitted bolts on 110mm PCD"],
        technicalNotes: ["Half in elevation, half in section", "Square key: width = D/4, height = D/6", "Shafts left un-hatched"]
      },
      {
        figureNumber: "Fig. 1.4",
        title: "Sectional Assembly of a Plummer Block (Bearing Housing and Brass Bush)",
        description: "Full sectional elevation of split pedestal bearing including cast iron cap and base, split gunmetal brass bushes, square-head bolts, and grease cup.",
        svgType: "fastener",
        imageUrl: "/assets/actual_fastener_drawing.jpg",
        dimensions: ["Journal Ø = 50mm", "Center Height = 65mm", "Holding Down Bolts = 2 × M16"],
        technicalNotes: ["Opposite 45° hatching directions for cap and base", "Brass bush cross-hatched with paired thin lines", "Oil lubricating hole centered"]
      }
    ]
  },

  // 13. CAD & Digital Coordinates
  "CAD-BAS-01": {
    id: "CAD-BAS-01",
    level: "CAD",
    title: "AutoCAD 2D Fundamentals: Absolute & Relative Coordinates",
    introduction: "Computer-Aided Design (CAD) uses absolute Cartesian (X,Y), relative Cartesian (@ΔX,ΔY), and relative polar (@distance<angle) coordinates to draft vector geometry with microscopic numerical accuracy.",
    principles: [
      "Absolute Coordinates (X,Y) are referenced to the World Coordinate System (WCS) origin (0,0).",
      "Relative Coordinates (@X,Y) place a temporary origin at the last picked point.",
      "Polar Coordinates (@dist<deg) specify distance and counter-clockwise angle from positive X-axis (0°)."
    ],
    isoStandards: [
      "ISO 13567: Technical product documentation — Organization and naming of layers for CAD.",
      "ASME Y14.41: Digital product definition data practices."
    ],
    procedures: [
      "Step 1: Set drafting units (Format > Units: Millimeters, Decimal).",
      "Step 2: Enter LINE command and specify start point at (100, 100).",
      "Step 3: Draw next vertex using relative cartesian: @150,0.",
      "Step 4: Draw angled segment using relative polar: @100<45."
    ],
    diagrams: [
      {
        figureNumber: "Fig. 1.1",
        title: "AutoCAD UCS Coordinate Entry Modes and Polar Vectoring",
        description: "Illustration of World Coordinate System axes, relative offset vectors, and angle quadrants used in AutoCAD dynamic input.",
        svgType: "cad",
        imageUrl: "/assets/african_higher_inst_cad_lab.jpg",
        dimensions: ["Origin (0,0)", "Relative vector @150,0", "Polar vector @100<45°"],
        technicalNotes: ["Counter-clockwise angle convention", "Dynamic input tracking", "Ortho Mode (F8) lock"]
      },
      {
        figureNumber: "Fig. 1.2",
        title: "Relative Cartesian Coordinates (@ΔX, ΔY) in Geometric Drafting",
        description: "Mapping incremental horizontal and vertical offsets from the last cursor station without recalculating absolute WCS distances.",
        svgType: "cad",
        imageUrl: "/assets/african_higher_inst_cad_lab.jpg",
        dimensions: ["Segment 1: @120,0", "Segment 2: @0,85", "Segment 3: @-50,30"],
        technicalNotes: ["Prefixed with '@' character", "Negative signs define leftward/downward steps", "Rapid closed-loop drafting"]
      },
      {
        figureNumber: "Fig. 1.3",
        title: "Dynamic Polar Tracking and Relative Angle Navigation (@dist<deg)",
        description: "Specifying true segment lengths along locked angular increments (e.g. 15°, 30°, 45°) with AutoCAD polar tracking vector paths.",
        svgType: "cad",
        imageUrl: "/assets/african_higher_inst_cad_lab.jpg",
        dimensions: ["Vector Length = 125mm", "Polar Angle θ = 60.00°", "Tracking Increments = 15°"],
        technicalNotes: ["Polar angle measured from positive X-axis (East = 0°)", "AutoCAD F10 Polar Snap", "Microscopic vector precision"]
      },
      {
        figureNumber: "Fig. 1.4",
        title: "CAD Layer Management, Line Weights, and Viewport Scaling (ISO 13567)",
        description: "Standard architectural and mechanical CAD layer structure: 0-Outlines (0.70mm), Centerlines (0.25mm), Dimensions (0.35mm), and Hatch (0.18mm).",
        svgType: "cad",
        imageUrl: "/assets/african_higher_inst_cad_lab.jpg",
        dimensions: ["Paper Space A3: 420 × 297mm", "Model Space 1:1 Scale", "Viewport Scale 1:50"],
        technicalNotes: ["ISO 13567 standard naming conventions", "Color-dependent plot styles (CTB)", "Continuous vs hidden vs center linetypes"]
      }
    ]
  }
};

/**
 * Intelligent resolver: retrieves curated content or synthesizes curriculum content for any topic ID
 */
export function getCurriculumTopicContent(
  topicId: string, 
  title: string, 
  category: string
): CurriculumTopicContent {
  // 1. Exact match in masterCurriculumDatabase
  if (masterCurriculumDatabase[topicId]) {
    return masterCurriculumDatabase[topicId];
  }

  // 2. Partial key matches in masterCurriculumDatabase
  const keys = Object.keys(masterCurriculumDatabase);
  const foundKey = keys.find(k => topicId.toUpperCase().includes(k.replace('TD-', '')) || topicId.includes(k));
  if (foundKey) {
    return masterCurriculumDatabase[foundKey];
  }

  // 3. Resolve using universal curriculum domain key and textbookCurriculumDatabase
  const domainKey = resolveCurriculumDomainKey({ id: topicId, title, category } as any);
  const refChapter = textbookCurriculumDatabase[domainKey];

  if (refChapter) {
    // Map figures from refChapter
    const diagrams = (refChapter.figures || []).map((fig, idx) => ({
      figureNumber: fig.figureNumber || `Fig. ${(idx + 1)}.1`,
      title: fig.title,
      description: fig.caption || `${fig.title} — standard engineering drawing plate.`,
      svgType: (fig.svgType as CurriculumSvgType) || 'bisection',
      imageUrl: fig.imageUrl || getActualDiagramImage(title, fig.title, fig.svgType),
      dimensions: fig.dimensions || ['Scale 1:1', 'Tolerance ±0.5mm'],
      technicalNotes: fig.technicalNotes || ['ISO 128 compliant', '2H fine construction', 'HB finished outline']
    }));

    // Map principles from refChapter
    const principles = (refChapter.theoreticalPrinciples || []).map(p => 
      `${p.title}: ${p.paragraphs[0] || ''}`
    );

    // Map procedures from refChapter
    const numberedMethod = refChapter.proceduralMethodology?.numberedMethod || [];
    const procedures = numberedMethod.map(m => 
      `Step ${m.stepNumber} [${m.heading}]: ${m.detailedDescription} (${m.instrumentAction})`
    );

    const isoStandards = refChapter.standardConventions ? [
      refChapter.standardConventions.isoStandardNumber || 'ISO 128: Technical drawings — General principles of presentation',
      refChapter.standardConventions.nerdcCurriculumClause || 'BS 8888: Technical product documentation and specification',
      refChapter.standardConventions.waecMarkingKey || 'WAEC Technical Drawing Syllabus Standard'
    ] : [
      'ISO 128: Technical drawings — General principles of presentation',
      'BS 8888: Technical product documentation and specification'
    ];

    return {
      id: topicId,
      level: refChapter.tier || 'Curriculum Reference',
      title: refChapter.title || title,
      introduction: refChapter.historicalContext || `Comprehensive pedagogical study of ${title} according to J.N. Green and Pickup & Parker.`,
      principles: principles.length > 0 ? principles : [
        'Maintain sharp 2H pencil points for all construction lines and HB for final visible outlines.',
        'Ensure absolute geometric precision according to ISO 128 conventions.'
      ],
      isoStandards,
      procedures: procedures.length > 0 ? procedures : [
        'Step 1: Set up drawing sheet and establish horizontal baseline with T-Square.',
        'Step 2: Construct geometric layout using 2H construction lines.',
        'Step 3: Accentuate finished outlines with continuous HB lines.'
      ],
      diagrams: diagrams.length > 0 ? diagrams : [
        {
          figureNumber: 'Fig. 1.1',
          title: `${title} — Standard Geometric Plate`,
          description: `ISO 128 construction layout based on J.N. Green and Pickup & Parker.`,
          svgType: 'bisection',
          imageUrl: getActualDiagramImage(title),
          dimensions: ['Scale 1:1', 'Tolerance ±0.5mm'],
          technicalNotes: ['2H fine lines', 'HB finished outline']
        }
      ]
    };
  }

  // 4. Fallback by category / title keywords
  const lowerTitle = title.toLowerCase();
  const lowerId = topicId.toLowerCase();

  if (lowerTitle.includes('pentagon') || lowerId.includes('pentagon')) {
    return masterCurriculumDatabase["TD-SS1-MOD07"];
  } else if (lowerTitle.includes('orthographic') || lowerId.includes('orthographic') || lowerTitle.includes('angle projection')) {
    return masterCurriculumDatabase["TD-ORTHO-01"];
  } else if (lowerTitle.includes('division') || lowerTitle.includes('divide') || lowerTitle.includes('segment') || lowerTitle.includes('proportional')) {
    return masterCurriculumDatabase["TD-SS1-MOD02"];
  } else if (lowerTitle.includes('tangent') || lowerTitle.includes('arc') || lowerTitle.includes('circle') || lowerTitle.includes('ogee')) {
    return masterCurriculumDatabase["TD-SS2-MOD02"];
  } else if (lowerTitle.includes('polygon') || lowerTitle.includes('hexagon') || lowerTitle.includes('pentagon') || lowerTitle.includes('octagon')) {
    return masterCurriculumDatabase["TD-SS1-MOD03"];
  } else if (lowerTitle.includes('scale') || lowerTitle.includes('diagonal') || lowerTitle.includes('representative')) {
    return masterCurriculumDatabase["TD-SS1-MOD04"];
  } else if (lowerTitle.includes('isometric') || lowerTitle.includes('axonometric') || lowerTitle.includes('3d') || lowerTitle.includes('oblique')) {
    return masterCurriculumDatabase["TD-SS2-MOD03"];
  } else if (lowerTitle.includes('ellipse') || lowerTitle.includes('parabola') || lowerTitle.includes('hyperbola') || lowerTitle.includes('conic')) {
    return masterCurriculumDatabase["TD-SS2-MOD04"];
  } else if (lowerTitle.includes('development') || lowerTitle.includes('cylinder') || lowerTitle.includes('interpenetration') || lowerTitle.includes('unfolding') || lowerTitle.includes('stretchout')) {
    return masterCurriculumDatabase["TD-SS3-MOD01"];
  } else if (lowerTitle.includes('section') || lowerTitle.includes('hatch') || lowerTitle.includes('cutting plane')) {
    return masterCurriculumDatabase["TD-SS3-MOD02"];
  } else if (lowerTitle.includes('foundation') || lowerTitle.includes('wall') || lowerTitle.includes('building') || lowerTitle.includes('roof') || lowerTitle.includes('lintel') || lowerTitle.includes('brick') || lowerTitle.includes('masonry')) {
    return masterCurriculumDatabase["TD-BLD-01"];
  } else if (lowerTitle.includes('bolt') || lowerTitle.includes('nut') || lowerTitle.includes('thread') || lowerTitle.includes('fastener') || lowerTitle.includes('machine') || lowerTitle.includes('coupling') || lowerTitle.includes('bearing')) {
    return masterCurriculumDatabase["TD-MCH-01"];
  } else if (lowerTitle.includes('cad') || lowerTitle.includes('coordinate') || lowerTitle.includes('autocad') || lowerTitle.includes('layer')) {
    return masterCurriculumDatabase["CAD-BAS-01"];
  }

  // Default fallback
  return masterCurriculumDatabase["TD-SS1-MOD01"];
}

/**
 * Render multi-state vector diagrams for curriculum topics
 * Supports all technical drawing domain diagrams with authentic ISO line weights
 */
export function renderCurriculumDiagram(
  svgType: CurriculumSvgType, 
  title: string,
  isLightMode: boolean = false
) {
  const c = isLightMode ? {
    bg: '#f8fafc',
    border: '#cbd5e1',
    thick: '#0f172a',
    thin: '#64748b',
    center: '#b45309',
    dim: '#0284c7',
    dimText: '#0369a1',
    hatch: '#94a3b8',
    accent: '#7c3aed',
    highlight: '#2563eb'
  } : {
    bg: '#070f1e',
    border: '#1e3a5f',
    thick: '#ffffff',
    thin: '#38bdf8',
    center: '#f59e0b',
    dim: '#22d3ee',
    dimText: '#a5f3fc',
    hatch: '#64748b',
    accent: '#c084fc',
    highlight: '#38bdf8'
  };

  // 1. BISECTION (Line and Angle)
  if (svgType === 'bisection') {
    return (
      <g>
        {/* Baseline AB */}
        <line x1="100" y1="180" x2="460" y2="180" stroke={c.thick} strokeWidth="3" />
        <circle cx="100" cy="180" r="4.5" fill={c.dim} />
        <circle cx="460" cy="180" r="4.5" fill={c.dim} />
        <text x="85" y="185" fill={c.thick} fontFamily="monospace" fontSize="14" fontWeight="bold">A</text>
        <text x="475" y="185" fill={c.thick} fontFamily="monospace" fontSize="14" fontWeight="bold">B</text>

        {/* Construction Arcs from A */}
        <path d="M 260 70 A 200 200 0 0 1 300 120" fill="none" stroke={c.thin} strokeWidth="1.6" strokeDasharray="5,4" />
        <path d="M 260 290 A 200 200 0 0 0 300 240" fill="none" stroke={c.thin} strokeWidth="1.6" strokeDasharray="5,4" />

        {/* Construction Arcs from B */}
        <path d="M 300 70 A 200 200 0 0 0 260 120" fill="none" stroke={c.dim} strokeWidth="1.6" strokeDasharray="5,4" />
        <path d="M 300 290 A 200 200 0 0 1 260 240" fill="none" stroke={c.dim} strokeWidth="1.6" strokeDasharray="5,4" />

        {/* Perpendicular Bisector CD */}
        <line x1="280" y1="50" x2="280" y2="310" stroke={c.center} strokeWidth="2.2" strokeDasharray="10,4,2,4" />
        <circle cx="280" cy="95" r="4" fill={c.accent} />
        <circle cx="280" cy="265" r="4" fill={c.accent} />
        <circle cx="280" cy="180" r="4.5" fill="#22c55e" />
        
        <text x="290" y="85" fill={c.accent} fontFamily="monospace" fontSize="12" fontWeight="bold">C (Arc Int.)</text>
        <text x="290" y="280" fill={c.accent} fontFamily="monospace" fontSize="12" fontWeight="bold">D (Arc Int.)</text>
        <text x="290" y="172" fill="#22c55e" fontFamily="monospace" fontSize="13" fontWeight="bold">M (Midpoint)</text>

        {/* Right-angle square indicator */}
        <polyline points="280,165 295,165 295,180" fill="none" stroke={c.dim} strokeWidth="1.5" />
        <text x="300" y="175" fill={c.dim} fontFamily="monospace" fontSize="10">90°</text>

        {/* Dimension Line AB */}
        <line x1="100" y1="215" x2="460" y2="215" stroke={c.dim} strokeWidth="1.2" />
        <line x1="100" y1="205" x2="100" y2="225" stroke={c.dim} strokeWidth="1.2" />
        <line x1="460" y1="205" x2="460" y2="225" stroke={c.dim} strokeWidth="1.2" />
        <text x="280" y="232" fill={c.dimText} fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">L = 360 mm (GIVEN BASELINE)</text>
      </g>
    );
  }

  // 2. TANGENTS (Internal & External)
  if (svgType === 'tangent') {
    return (
      <g>
        {/* Circle 1 (Center O1) */}
        <circle cx="170" cy="180" r="65" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <circle cx="170" cy="180" r="3.5" fill={c.dim} />
        <text x="155" y="185" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">O₁</text>

        {/* Circle 2 (Center O2) */}
        <circle cx="430" cy="140" r="40" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <circle cx="430" cy="140" r="3.5" fill={c.dim} />
        <text x="440" y="145" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">O₂</text>

        {/* Centerline O1-O2 */}
        <line x1="170" y1="180" x2="430" y2="140" stroke={c.center} strokeWidth="1.5" strokeDasharray="10,4,2,4" />

        {/* Semi-circle on O1O2 diameter */}
        <path d="M 170 180 A 133 133 0 0 1 430 140" fill="none" stroke={c.thin} strokeWidth="1.4" strokeDasharray="4,4" />

        {/* Auxiliary Sum Radius Circle at O1 (R1 + R2 = 105) */}
        <circle cx="170" cy="180" r="105" fill="none" stroke={c.accent} strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="180" y="90" fill={c.accent} fontFamily="monospace" fontSize="10">Aux. Circle (R₁+R₂)</text>

        {/* Internal Common Tangent Line T1-T2 */}
        <line x1="120" y1="135" x2="465" y2="105" stroke={c.thick} strokeWidth="2.8" />
        <circle cx="120" cy="135" r="4" fill="#22c55e" />
        <circle cx="465" cy="105" r="4" fill="#22c55e" />
        <text x="95" y="130" fill="#22c55e" fontFamily="monospace" fontSize="12" fontWeight="bold">T₁</text>
        <text x="475" y="105" fill="#22c55e" fontFamily="monospace" fontSize="12" fontWeight="bold">T₂</text>

        {/* Normal Radii */}
        <line x1="170" y1="180" x2="120" y2="135" stroke={c.dim} strokeWidth="1.4" strokeDasharray="3,3" />
        <line x1="430" y1="140" x2="465" y2="105" stroke={c.dim} strokeWidth="1.4" strokeDasharray="3,3" />
        <text x="260" y="115" fill={c.dimText} fontFamily="monospace" fontSize="11" fontWeight="bold">Internal Common Tangent</text>
      </g>
    );
  }

  // 3. ORTHOGRAPHIC PROJECTION (1st & 3rd Angle)
  if (svgType === 'orthographic') {
    return (
      <g>
        {/* Principal Coordinate Fold Axes */}
        <line x1="260" y1="40" x2="260" y2="280" stroke={c.center} strokeWidth="1.5" strokeDasharray="8,4,2,4" />
        <line x1="40" y1="160" x2="480" y2="160" stroke={c.center} strokeWidth="1.5" strokeDasharray="8,4,2,4" />
        <text x="265" y="55" fill={c.thin} fontFamily="monospace" fontSize="10">VERTICAL PLANE (VP)</text>
        <text x="360" y="153" fill={c.thin} fontFamily="monospace" fontSize="10">GROUND LINE (XY)</text>

        {/* FRONT ELEVATION (Top Left in 1st Angle) */}
        <rect x="110" y="65" width="110" height="75" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <line x1="110" y1="105" x2="220" y2="105" stroke={c.dim} strokeWidth="1.4" strokeDasharray="4,3" />
        <text x="165" y="100" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">FRONT ELEVATION</text>

        {/* PLAN VIEW (Bottom Left, directly below Front) */}
        <rect x="110" y="180" width="110" height="70" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <circle cx="165" cy="215" r="18" fill="none" stroke={c.thick} strokeWidth="2" />
        <text x="165" y="240" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">PLAN</text>

        {/* END ELEVATION (Top Right) */}
        <rect x="290" y="65" width="70" height="75" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <text x="325" y="100" fill={c.thick} fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">END ELEV.</text>

        {/* 45 Degree Mitre Projection Line */}
        <line x1="260" y1="160" x2="380" y2="280" stroke={c.accent} strokeWidth="1.8" strokeDasharray="5,3" />
        <text x="315" y="235" fill={c.accent} fontFamily="monospace" fontSize="11" fontWeight="bold">45° Mitre</text>

        {/* Projection Rays (Thin 2H lines) */}
        <line x1="110" y1="140" x2="110" y2="180" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="220" y1="140" x2="220" y2="180" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="220" y1="105" x2="290" y2="105" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="220" y1="215" x2="315" y2="215" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="315" y1="215" x2="315" y2="140" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />
      </g>
    );
  }

  // 4. REGULAR POLYGONS (Hexagon)
  if (svgType === 'polygon') {
    return (
      <g>
        {/* Circumscribing Circle (Radius R = 85mm) */}
        <circle cx="260" cy="180" r="85" fill="none" stroke={c.thin} strokeWidth="1.5" strokeDasharray="5,4" />
        <circle cx="260" cy="180" r="4" fill={c.dim} />
        <text x="268" y="175" fill={c.dim} fontFamily="monospace" fontSize="12">O (Center)</text>

        {/* Regular Hexagon Vertices (60° increments) */}
        <polygon 
          points="345,180 302,253.6 217.5,253.6 175,180 217.5,106.4 302,106.4" 
          fill={isLightMode ? 'rgba(2, 132, 199, 0.06)' : 'rgba(56, 189, 248, 0.1)'} 
          stroke={c.thick} 
          strokeWidth="3" 
        />

        {/* Stepping Arcs along the circumference */}
        <circle cx="345" cy="180" r="4.5" fill="#22c55e" />
        <circle cx="302" cy="253.6" r="4.5" fill="#22c55e" />
        <circle cx="217.5" cy="253.6" r="4.5" fill="#22c55e" />
        <circle cx="175" cy="180" r="4.5" fill="#22c55e" />
        <circle cx="217.5" cy="106.4" r="4.5" fill="#22c55e" />
        <circle cx="302" cy="106.4" r="4.5" fill="#22c55e" />

        <text x="355" y="185" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">A</text>
        <text x="310" y="270" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">B</text>
        <text x="200" y="270" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">C</text>
        <text x="155" y="185" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">D</text>
        <text x="200" y="98" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">E</text>
        <text x="310" y="98" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">F</text>

        {/* 60 Degree Radial Triangle */}
        <line x1="260" y1="180" x2="345" y2="180" stroke={c.dim} strokeWidth="1.5" />
        <line x1="260" y1="180" x2="302" y2="106.4" stroke={c.dim} strokeWidth="1.5" />
        <text x="300" y="150" fill={c.dimText} fontFamily="monospace" fontSize="10">R = Side AB</text>
      </g>
    );
  }

  // 4b. REGULAR PENTAGON (5-Sided Polygon with 108° Interior Angles)
  if (svgType === 'pentagon' || svgType === 'pentagon-inscribed') {
    // Exact geometric coordinates for 5-sided regular pentagon with horizontal base AB at bottom
    // Base AB: A=(200, 250), B=(300, 250), S=100. Midpoint M=(250, 250)
    // Vertices: A=(200, 250), B=(300, 250), C=(330.9, 154.9), D=(250, 96.1) [Apex], E=(169.1, 154.9)
    // Construction: BQ = 100 perpendicular at B (300, 150). MQ = sqrt(50^2 + 100^2) = 111.8
    // P = (250 + 111.8 = 361.8, 250). AP = diagonal = 161.8
    return (
      <g>
        {/* Baseline extension past B */}
        <line x1="160" y1="250" x2="390" y2="250" stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" />

        {/* Perpendicular axis of symmetry passing through apex D and midpoint M */}
        <line x1="250" y1="65" x2="250" y2="280" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="6,3,1,3" />
        <text x="256" y="78" fill="#f59e0b" fontFamily="monospace" fontSize="10">Axis of Symmetry</text>

        {/* Perpendicular at B: BQ = AB */}
        <line x1="300" y1="250" x2="300" y2="150" stroke={c.dim} strokeWidth="1.2" strokeDasharray="4,3" />
        {/* Right angle symbol at B */}
        <polyline points="290,250 290,240 300,240" fill="none" stroke={c.dim} strokeWidth="1" />

        {/* Hypotenuse MQ */}
        <line x1="250" y1="250" x2="300" y2="150" stroke={c.thin} strokeWidth="1" strokeDasharray="2,2" />

        {/* Arc MQ to P on baseline */}
        <path d="M 300 150 A 111.8 111.8 0 0 1 361.8 250" fill="none" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,3" />

        {/* Diagonal intersecting arcs from A and B locating Apex D */}
        <path d="M 235 85 A 161.8 161.8 0 0 1 265 110" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
        <path d="M 265 85 A 161.8 161.8 0 0 0 235 110" fill="none" stroke="#06b6d4" strokeWidth="1.2" />

        {/* Side arcs locating C and E */}
        <path d="M 320 170 A 100 100 0 0 0 340 140" fill="none" stroke={c.thin} strokeWidth="1" />
        <path d="M 180 170 A 100 100 0 0 1 160 140" fill="none" stroke={c.thin} strokeWidth="1" />

        {/* Finished Regular 5-Sided Pentagon Outline (HB Thick) */}
        <polygon 
          points="200,250 300,250 330.9,154.9 250,96.1 169.1,154.9" 
          fill={isLightMode ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.12)'} 
          stroke={c.thick} 
          strokeWidth="3" 
        />

        {/* Highlight Pentagon Vertices (5 nodes) */}
        <circle cx="200" cy="250" r="4.5" fill="#06b6d4" />
        <circle cx="300" cy="250" r="4.5" fill="#06b6d4" />
        <circle cx="330.9" cy="154.9" r="4.5" fill="#06b6d4" />
        <circle cx="250" cy="96.1" r="5" fill="#10b981" />
        <circle cx="169.1" cy="154.9" r="4.5" fill="#06b6d4" />

        {/* Construction Points */}
        <circle cx="250" cy="250" r="3" fill="#f59e0b" />
        <circle cx="300" cy="150" r="3" fill={c.dim} />
        <circle cx="361.8" cy="250" r="3.5" fill="#06b6d4" />

        {/* Vertex Labels */}
        <text x="182" y="265" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">A</text>
        <text x="305" y="265" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">B</text>
        <text x="340" y="158" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">C</text>
        <text x="245" y="84" fill="#10b981" fontFamily="monospace" fontSize="13" fontWeight="bold">D (Apex)</text>
        <text x="145" y="158" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">E</text>
        
        {/* Construction Labels */}
        <text x="244" y="268" fill="#f59e0b" fontFamily="monospace" fontSize="10">M</text>
        <text x="306" y="148" fill={c.dim} fontFamily="monospace" fontSize="10">Q (BQ = AB)</text>
        <text x="365" y="265" fill="#06b6d4" fontFamily="monospace" fontSize="10" fontWeight="bold">P (AP = d)</text>

        {/* Interior Angle Callout: 108° */}
        <path d="M 220 250 A 20 20 0 0 0 206 231" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <text x="215" y="240" fill="#10b981" fontFamily="monospace" fontSize="10" fontWeight="bold">108°</text>

        {/* Dimension: Base AB = S */}
        <line x1="200" y1="285" x2="300" y2="285" stroke={c.dim} strokeWidth="1" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <text x="225" y="298" fill={c.dimText} fontFamily="monospace" fontSize="10">Base Side S</text>

        {/* Dimension: Golden Diagonal AP */}
        <line x1="200" y1="315" x2="361.8" y2="315" stroke="#06b6d4" strokeWidth="1" />
        <text x="225" y="328" fill="#06b6d4" fontFamily="monospace" fontSize="10">Golden Diagonal AP = 1.618 × S</text>
      </g>
    );
  }

  // 5. CONIC SECTIONS (Ellipse & Parabola)
  if (svgType === 'conic') {
    return (
      <g>
        {/* Major & Minor Axes */}
        <line x1="90" y1="180" x2="430" y2="180" stroke={c.center} strokeWidth="1.8" strokeDasharray="10,4,2,4" />
        <line x1="260" y1="60" x2="260" y2="300" stroke={c.center} strokeWidth="1.8" strokeDasharray="10,4,2,4" />
        
        {/* Major Circle (Radius 140) & Minor Circle (Radius 80) */}
        <circle cx="260" cy="180" r="140" fill="none" stroke={c.thin} strokeWidth="1.5" strokeDasharray="6,4" />
        <circle cx="260" cy="180" r="80" fill="none" stroke={c.thin} strokeWidth="1.5" strokeDasharray="6,4" />

        {/* Radial Rays at 30° intervals */}
        {[30, 60, 120, 150, 210, 240, 300, 330].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const xMaj = 260 + 140 * Math.cos(rad);
          const yMaj = 180 + 140 * Math.sin(rad);
          const xMin = 260 + 80 * Math.cos(rad);
          const yMin = 180 + 80 * Math.sin(rad);
          return (
            <g key={deg}>
              <line x1="260" y1="180" x2={xMaj} y2={yMaj} stroke={c.thin} strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
              {/* Intersection coordinates for ellipse point */}
              <line x1={xMaj} y1={yMaj} x2={xMaj} y2={yMin} stroke={c.dim} strokeWidth="1.2" strokeDasharray="2,2" />
              <line x1={xMin} y1={yMin} x2={xMaj} y2={yMin} stroke={c.dim} strokeWidth="1.2" strokeDasharray="2,2" />
              <circle cx={xMaj} cy={yMin} r="3" fill="#22c55e" />
            </g>
          );
        })}

        {/* Finished Ellipse Curve */}
        <ellipse 
          cx="260" 
          cy="180" 
          rx="140" 
          ry="80" 
          fill={isLightMode ? 'rgba(2, 132, 199, 0.05)' : 'rgba(56, 189, 248, 0.08)'} 
          stroke={c.thick} 
          strokeWidth="3" 
        />

        <text x="435" y="185" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">A (Major)</text>
        <text x="80" y="185" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">B</text>
        <text x="265" y="55" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">C (Minor)</text>
        <text x="265" y="315" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">D</text>
      </g>
    );
  }

  // 6. ISOMETRIC PROJECTION
  if (svgType === 'isometric') {
    return (
      <g>
        {/* Isometric 30° Axes */}
        <line x1="260" y1="200" x2="260" y2="70" stroke={c.center} strokeWidth="1.8" strokeDasharray="8,4,2,4" />
        <line x1="260" y1="200" x2="420" y2="280" stroke={c.center} strokeWidth="1.8" strokeDasharray="8,4,2,4" />
        <line x1="260" y1="200" x2="100" y2="280" stroke={c.center} strokeWidth="1.8" strokeDasharray="8,4,2,4" />
        <text x="265" y="80" fill={c.dim} fontFamily="monospace" fontSize="10">90° Vertical</text>
        <text x="400" y="270" fill={c.dim} fontFamily="monospace" fontSize="10">30° Right</text>
        <text x="105" y="270" fill={c.dim} fontFamily="monospace" fontSize="10">30° Left</text>

        {/* 3D Isometric Bounding Box */}
        <polygon points="260,80 380,140 380,240 260,180" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <polygon points="260,80 140,140 140,240 260,180" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <polygon points="260,80 380,140 260,200 140,140" fill="none" stroke={c.thick} strokeWidth="2.5" />

        {/* Four-Center Isometric Ellipse on Top Face */}
        <ellipse cx="260" cy="140" rx="90" ry="38" fill={isLightMode ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)'} stroke={c.thick} strokeWidth="2.8" />
        <line x1="260" y1="102" x2="260" y2="178" stroke={c.accent} strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="170" y1="140" x2="350" y2="140" stroke={c.accent} strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="260" y="145" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">Four-Center Circle</text>
      </g>
    );
  }

  // 7. SECTIONING & HATCHING
  if (svgType === 'section') {
    return (
      <g>
        {/* Bushing Outline */}
        <path d="M 140 80 L 380 80 L 380 130 L 340 130 L 340 230 L 380 230 L 380 280 L 140 280 L 140 230 L 180 230 L 180 130 L 140 130 Z" fill="none" stroke={c.thick} strokeWidth="2.8" />
        
        {/* 45° Hatching Lines for Cut Surfaces */}
        <g stroke={c.hatch} strokeWidth="1.2">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={140 + i * 15} y1="80" x2={100 + i * 15} y2="120" />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`b-${i}`} x1={140 + i * 15} y1="240" x2={100 + i * 15} y2="280" />
          ))}
        </g>

        {/* Central Un-Hatched Hollow Bore */}
        <rect x="220" y="80" width="80" height="200" fill={c.bg} stroke={c.thick} strokeWidth="2.5" />
        <line x1="260" y1="50" x2="260" y2="310" stroke={c.center} strokeWidth="1.8" strokeDasharray="10,4,2,4" />
        <text x="260" y="185" fill={c.dim} fontFamily="monospace" fontSize="12" textAnchor="middle" fontWeight="bold">CENTRAL HOLLOW BORE</text>
        <text x="260" y="70" fill={c.dimText} fontFamily="monospace" fontSize="11" textAnchor="middle">45° ISO 128 Uniform Hatching</text>
      </g>
    );
  }

  // 8. BUILDING DETAIL
  if (svgType === 'building') {
    return (
      <g>
        {/* Ground Level line */}
        <line x1="60" y1="160" x2="460" y2="160" stroke={c.thick} strokeWidth="2" />
        <text x="70" y="150" fill={c.dim} fontFamily="monospace" fontSize="11" fontWeight="bold">GROUND LEVEL (GL)</text>

        {/* Concrete Footing Foundation */}
        <rect x="170" y="240" width="180" height="60" fill="none" stroke={c.thick} strokeWidth="2.5" />
        {/* Aggregate hatching dots & triangles */}
        <g fill={c.hatch} stroke="none">
          <circle cx="200" cy="265" r="4" /><circle cx="240" cy="275" r="5" /><circle cx="310" cy="260" r="4" />
          <polygon points="260,255 270,270 250,270" /><polygon points="280,270 290,285 270,285" />
        </g>
        <text x="260" y="275" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">CONCRETE FOOTING (1:3:6)</text>

        {/* Sandcrete Blockwall (225mm) */}
        <rect x="220" y="90" width="80" height="150" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <line x1="220" y1="130" x2="300" y2="130" stroke={c.thick} strokeWidth="2" />
        <line x1="220" y1="170" x2="300" y2="170" stroke={c.thick} strokeWidth="2" />
        <line x1="220" y1="210" x2="300" y2="210" stroke={c.thick} strokeWidth="2" />

        {/* Damp Proof Course (DPC) */}
        <line x1="210" y1="140" x2="310" y2="140" stroke="#ef4444" strokeWidth="4" />
        <text x="320" y="145" fill="#ef4444" fontFamily="monospace" fontSize="10" fontWeight="bold">D.P.C. Membrane</text>

        {/* Floor Slab */}
        <rect x="300" y="125" width="140" height="25" fill="none" stroke={c.thick} strokeWidth="2" />
        <text x="370" y="140" fill={c.dimText} fontFamily="monospace" fontSize="9" textAnchor="middle">100mm RC SLAB</text>
      </g>
    );
  }

  // 9. FASTENERS (Bolt & Nut)
  if (svgType === 'fastener') {
    return (
      <g>
        {/* Centerline */}
        <line x1="60" y1="180" x2="460" y2="180" stroke={c.center} strokeWidth="1.8" strokeDasharray="10,4,2,4" />

        {/* Bolt Head */}
        <rect x="100" y="130" width="40" height="100" fill="none" stroke={c.thick} strokeWidth="2.5" rx="3" />
        <path d="M 100 145 Q 115 155 100 165" fill="none" stroke={c.dim} strokeWidth="1.5" />
        <text x="120" y="120" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">0.8D Head</text>

        {/* Bolt Shank (Diameter D = 24mm) */}
        <rect x="140" y="155" width="220" height="50" fill="none" stroke={c.thick} strokeWidth="2.5" />

        {/* Threaded region */}
        <g stroke={c.thin} strokeWidth="1.2">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={240 + i * 10} y1="155" x2={240 + i * 10} y2="205" />
          ))}
        </g>

        {/* Washer */}
        <rect x="290" y="140" width="12" height="80" fill="none" stroke={c.thick} strokeWidth="2" />

        {/* Hex Nut */}
        <rect x="302" y="130" width="45" height="100" fill="none" stroke={c.thick} strokeWidth="2.5" rx="3" />
        <line x1="302" y1="160" x2="347" y2="160" stroke={c.thick} strokeWidth="1.5" />
        <line x1="302" y1="200" x2="347" y2="200" stroke={c.thick} strokeWidth="1.5" />
        <text x="325" y="120" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">0.8D Nut</text>
      </g>
    );
  }

  // 10. CAD COORDINATES
  if (svgType === 'cad') {
    return (
      <g>
        {/* World Coordinate Origin (0,0) */}
        <line x1="120" y1="250" x2="440" y2="250" stroke={c.thick} strokeWidth="2.5" />
        <line x1="120" y1="250" x2="120" y2="70" stroke={c.thick} strokeWidth="2.5" />
        <circle cx="120" cy="250" r="5" fill={c.dim} />
        <text x="105" y="270" fill={c.dim} fontFamily="monospace" fontSize="13" fontWeight="bold">UCS (0,0)</text>
        <text x="445" y="255" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">+X (0°)</text>
        <text x="110" y="60" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold">+Y (90°)</text>

        {/* Point 1: Absolute coordinate (160, 180) */}
        <circle cx="240" cy="170" r="4.5" fill="#22c55e" />
        <text x="248" y="165" fill="#22c55e" fontFamily="monospace" fontSize="12" fontWeight="bold">Pt 1: (120, 80)</text>

        {/* Vector Line Pt1 -> Pt2: Polar @160<35° */}
        <line x1="240" y1="170" x2="380" y2="90" stroke={c.thick} strokeWidth="2.8" />
        <circle cx="380" cy="90" r="4.5" fill={c.accent} />
        <text x="388" y="90" fill={c.accent} fontFamily="monospace" fontSize="12" fontWeight="bold">Pt 2: @160&lt;35°</text>

        {/* Angle Arc */}
        <path d="M 290 170 A 50 50 0 0 0 281 142" fill="none" stroke={c.dim} strokeWidth="1.5" />
        <text x="300" y="160" fill={c.dimText} fontFamily="monospace" fontSize="11">θ = 35°</text>
        <line x1="240" y1="170" x2="320" y2="170" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,3" />
      </g>
    );
  }

  // 11. INSTRUMENTS & BOARD PRACTICE
  if (svgType === 'instruments') {
    return (
      <g>
        {/* Drafting Board Outline */}
        <rect x="50" y="40" width="460" height="280" fill={isLightMode ? '#e2e8f0' : '#111e33'} stroke={c.thick} strokeWidth="3" rx="6" />
        {/* Ebony Working Edge (Left) */}
        <rect x="50" y="40" width="22" height="280" fill={isLightMode ? '#475569' : '#0a1120'} stroke={c.thick} strokeWidth="2" />
        <text x="40" y="180" fill={c.dim} fontFamily="monospace" fontSize="9" transform="rotate(-90 40 180)" textAnchor="middle">EBONY WORKING EDGE</text>

        {/* Drawing Sheet (Mounted with 20mm margins) */}
        <rect x="95" y="65" width="390" height="230" fill={c.bg} stroke={c.border} strokeWidth="1.8" />
        {/* 10mm Standard Margin Borderline */}
        <rect x="110" y="80" width="360" height="200" fill="none" stroke={c.thick} strokeWidth="2" />
        
        {/* Standard Title Block (Bottom Right) */}
        <rect x="310" y="240" width="160" height="40" fill={isLightMode ? '#f1f5f9' : '#0b192e'} stroke={c.thick} strokeWidth="2" />
        <line x1="310" y1="260" x2="470" y2="260" stroke={c.thick} strokeWidth="1.2" />
        <line x1="390" y1="240" x2="390" y2="280" stroke={c.thick} strokeWidth="1.2" />
        <text x="315" y="253" fill={c.dimText} fontFamily="monospace" fontSize="8" fontWeight="bold">TITLE: TECH DRAWING</text>
        <text x="395" y="253" fill={c.dimText} fontFamily="monospace" fontSize="8">SCALE: 1:1</text>
        <text x="315" y="273" fill={c.dimText} fontFamily="monospace" fontSize="8">DATE: 2026</text>
        <text x="395" y="273" fill={c.dimText} fontFamily="monospace" fontSize="8">DRG NO: 01</text>

        {/* T-Square Blade (Clamped to Left Edge) */}
        <rect x="42" y="145" width="26" height="70" fill={isLightMode ? '#94a3b8' : '#1e3a5f'} stroke={c.thick} strokeWidth="2" rx="2" />
        <rect x="68" y="165" width="410" height="28" fill={isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(15,35,63,0.8)'} stroke={c.thick} strokeWidth="2" />
        <line x1="68" y1="167" x2="478" y2="167" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="240" y="183" fill={c.thick} fontFamily="monospace" fontSize="9" fontWeight="bold">T-SQUARE WORKING BLADE</text>

        {/* 30°/60° Set-Square seated on T-Square */}
        <polygon points="170,165 290,165 170,60" fill={isLightMode ? 'rgba(2,132,199,0.1)' : 'rgba(56,189,248,0.12)'} stroke={c.thick} strokeWidth="2" />
        <polygon points="185,155 265,155 185,85" fill={c.bg} stroke={c.thin} strokeWidth="1" strokeDasharray="3,2" />
        <text x="210" y="145" fill={c.dimText} fontFamily="monospace" fontSize="9" fontWeight="bold">30°/60° SET SQUARE</text>
      </g>
    );
  }

  // 12. LINE TYPES & CONVENTIONS (ISO 128)
  if (svgType === 'lines') {
    return (
      <g>
        <text x="260" y="45" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">ISO 128 / BS 308 STANDARD LINE CONVENTIONS</text>
        
        {/* Type A: Continuous Thick (0.70mm) */}
        <g transform="translate(60, 65)">
          <line x1="0" y1="15" x2="280" y2="15" stroke={c.thick} strokeWidth="4" />
          <text x="295" y="12" fill={c.thick} fontFamily="monospace" fontSize="10" fontWeight="bold">Type A (0.70mm) Continuous Thick</text>
          <text x="295" y="24" fill={c.thin} fontFamily="monospace" fontSize="8.5">Visible outlines, prominent edges, borders</text>
        </g>

        {/* Type B: Continuous Thin (0.25mm) */}
        <g transform="translate(60, 115)">
          <line x1="0" y1="15" x2="280" y2="15" stroke={c.thin} strokeWidth="1.2" />
          <text x="295" y="12" fill={c.thick} fontFamily="monospace" fontSize="10" fontWeight="bold">Type B (0.25mm) Continuous Thin</text>
          <text x="295" y="24" fill={c.thin} fontFamily="monospace" fontSize="8.5">Construction arcs, projection lines, dimensions</text>
        </g>

        {/* Type E: Dashed Thin (0.25mm) */}
        <g transform="translate(60, 165)">
          <line x1="0" y1="15" x2="280" y2="15" stroke={c.thick} strokeWidth="1.6" strokeDasharray="8,4" />
          <text x="295" y="12" fill={c.thick} fontFamily="monospace" fontSize="10" fontWeight="bold">Type E (0.35mm) Dashed Thin</text>
          <text x="295" y="24" fill={c.thin} fontFamily="monospace" fontSize="8.5">Hidden outlines, unseen internal features</text>
        </g>

        {/* Type G: Long Chain Thin (0.25mm) */}
        <g transform="translate(60, 215)">
          <line x1="0" y1="15" x2="280" y2="15" stroke={c.center} strokeWidth="1.4" strokeDasharray="18,4,3,4" />
          <text x="295" y="12" fill={c.center} fontFamily="monospace" fontSize="10" fontWeight="bold">Type G (0.25mm) Chain Thin</text>
          <text x="295" y="24" fill={c.thin} fontFamily="monospace" fontSize="8.5">Centerlines, pitch circles, axes of symmetry</text>
        </g>

        {/* Type F: Chain Thin with Thick Ends (Cutting Plane) */}
        <g transform="translate(60, 265)">
          <line x1="0" y1="15" x2="40" y2="15" stroke={c.thick} strokeWidth="3.5" />
          <line x1="40" y1="15" x2="240" y2="15" stroke={c.thin} strokeWidth="1.2" strokeDasharray="16,4,3,4" />
          <line x1="240" y1="15" x2="280" y2="15" stroke={c.thick} strokeWidth="3.5" />
          <polyline points="0,5 0,15 8,15" stroke={c.thick} strokeWidth="2.5" fill="none" />
          <polyline points="280,5 280,15 272,15" stroke={c.thick} strokeWidth="2.5" fill="none" />
          <text x="295" y="12" fill={c.thick} fontFamily="monospace" fontSize="10" fontWeight="bold">Type F Section Cutting Plane A-A</text>
          <text x="295" y="24" fill={c.thin} fontFamily="monospace" fontSize="8.5">Thick ends with directional sight arrows</text>
        </g>
      </g>
    );
  }

  // 13. ANGLES (Standard Angles 60°, 90°, 45°, 75°)
  if (svgType === 'angles') {
    return (
      <g>
        {/* Baseline OA */}
        <line x1="80" y1="240" x2="440" y2="240" stroke={c.thick} strokeWidth="3" />
        <circle cx="160" cy="240" r="4.5" fill={c.dim} />
        <text x="145" y="260" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">O (Vertex)</text>
        <text x="445" y="245" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">A</text>

        {/* Semicircle Arc from O with Radius R = 120 */}
        <path d="M 280 240 A 120 120 0 0 0 40 240" fill="none" stroke={c.thin} strokeWidth="1.6" strokeDasharray="5,4" />
        <circle cx="280" cy="240" r="3.5" fill="#22c55e" />
        <text x="285" y="255" fill="#22c55e" fontFamily="monospace" fontSize="10">P</text>

        {/* 60° Arc step from P (Intersects at Q) */}
        <line x1="160" y1="240" x2="220" y2="136" stroke={c.dim} strokeWidth="1.8" />
        <circle cx="220" cy="136" r="3.5" fill="#22c55e" />
        <text x="228" y="135" fill={c.dimText} fontFamily="monospace" fontSize="11" fontWeight="bold">60° (Q)</text>

        {/* 120° Arc step from Q (Intersects at R) */}
        <line x1="160" y1="240" x2="100" y2="136" stroke={c.dim} strokeWidth="1.8" />
        <circle cx="100" cy="136" r="3.5" fill="#22c55e" />
        <text x="75" y="135" fill={c.dimText} fontFamily="monospace" fontSize="11" fontWeight="bold">120° (R)</text>

        {/* 90° Perpendicular Bisector of 60°-120° */}
        <line x1="160" y1="240" x2="160" y2="60" stroke={c.center} strokeWidth="2" strokeDasharray="6,3" />
        <circle cx="160" cy="120" r="3.5" fill={c.accent} />
        <text x="168" y="70" fill={c.center} fontFamily="monospace" fontSize="12" fontWeight="bold">90° Ray</text>

        {/* 75° Bisector Ray (Bisecting 60° and 90°) */}
        <line x1="160" y1="240" x2="201" y2="86" stroke={c.thick} strokeWidth="3" />
        <circle cx="201" cy="86" r="4.5" fill="#ef4444" />
        <text x="210" y="85" fill="#ef4444" fontFamily="monospace" fontSize="13" fontWeight="bold">75° Finished Ray</text>

        {/* Angle Arc Indicator for 75° */}
        <path d="M 230 240 A 70 70 0 0 0 178 172" fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x="215" y="215" fill="#ef4444" fontFamily="monospace" fontSize="11" fontWeight="bold">75°</text>
        <text x="260" y="55" fill={c.dimText} fontFamily="monospace" fontSize="10">60° + 15° (Bisection of [60°-90°])</text>
      </g>
    );
  }

  // 14. TRIANGLES (Inscribed and Circumscribed Circles)
  if (svgType === 'triangles') {
    return (
      <g>
        {/* Triangle ABC */}
        <polygon 
          points="130,250 410,250 250,90" 
          fill={isLightMode ? 'rgba(2,132,199,0.06)' : 'rgba(56,189,248,0.08)'} 
          stroke={c.thick} 
          strokeWidth="3" 
        />
        <text x="110" y="260" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">A</text>
        <text x="420" y="260" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">B</text>
        <text x="250" y="75" fill={c.thick} fontFamily="monospace" fontSize="13" fontWeight="bold">C</text>

        {/* Angle Bisectors meeting at Incenter I (approx (257, 197)) */}
        <line x1="130" y1="250" x2="310" y2="175" stroke={c.dim} strokeWidth="1.4" strokeDasharray="5,3" />
        <line x1="410" y1="250" x2="200" y2="175" stroke={c.dim} strokeWidth="1.4" strokeDasharray="5,3" />
        <line x1="250" y1="90" x2="257" y2="250" stroke={c.dim} strokeWidth="1.4" strokeDasharray="5,3" />

        {/* Incenter I */}
        <circle cx="257" cy="197" r="4.5" fill="#22c55e" />
        <text x="268" y="195" fill="#22c55e" fontFamily="monospace" fontSize="12" fontWeight="bold">I (Incenter)</text>

        {/* Normal dropped to base AB */}
        <line x1="257" y1="197" x2="257" y2="250" stroke={c.accent} strokeWidth="1.5" strokeDasharray="3,2" />
        <rect x="257" y="240" width="10" height="10" fill="none" stroke={c.accent} strokeWidth="1" />
        <text x="265" y="235" fill={c.accent} fontFamily="monospace" fontSize="9">r = Radius</text>

        {/* Inscribed Circle (Radius r = 53) */}
        <circle cx="257" cy="197" r="53" fill="none" stroke={c.thick} strokeWidth="2.8" />
        <text x="257" y="280" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">INSCRIBED CIRCLE (Touching AB, BC, CA)</text>
      </g>
    );
  }

  // 15. LOCI (Involute of Circle & Archimedean Spiral)
  if (svgType === 'loci') {
    return (
      <g>
        {/* Base Circle (Center O, Radius R = 50) */}
        <circle cx="200" cy="180" r="50" fill="none" stroke={c.thick} strokeWidth="2.5" />
        <circle cx="200" cy="180" r="4" fill={c.dim} />
        <text x="185" y="175" fill={c.dim} fontFamily="monospace" fontSize="12" fontWeight="bold">O</text>
        <text x="200" y="195" fill={c.dimText} fontFamily="monospace" fontSize="9" textAnchor="middle">Base Circle Ø100</text>

        {/* Tangents stepped off at 30° intervals with progressively longer unwound cord lengths */}
        <line x1="200" y1="130" x2="250" y2="130" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,2" />
        <circle cx="250" cy="130" r="3" fill="#22c55e" />
        
        <line x1="243" y1="155" x2="310" y2="116" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,2" />
        <circle cx="310" cy="116" r="3" fill="#22c55e" />

        <line x1="250" y1="180" x2="350" y2="180" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,2" />
        <circle cx="350" cy="180" r="3" fill="#22c55e" />

        <line x1="243" y1="205" x2="370" y2="280" stroke={c.thin} strokeWidth="1.2" strokeDasharray="3,2" />
        <circle cx="370" cy="280" r="3" fill="#22c55e" />

        {/* Involute Curve */}
        <path 
          d="M 200 130 C 230 130, 270 120, 310 116 C 340 112, 350 150, 350 180 C 350 220, 360 250, 370 280" 
          fill="none" 
          stroke={c.thick} 
          strokeWidth="3.2" 
        />
        <text x="355" y="105" fill={c.accent} fontFamily="monospace" fontSize="11" fontWeight="bold">Involute Curve Locus</text>
        <text x="260" y="305" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">Unwound Cord Length = π × D × (θ / 360°)</text>
      </g>
    );
  }

  // 16. OBLIQUE PROJECTIONS (Cavalier vs Cabinet)
  if (svgType === 'oblique') {
    return (
      <g>
        {/* Cavalier Projection (Left - Full 1:1 Scale Receding Axis) */}
        <g transform="translate(40, 60)">
          <text x="80" y="20" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CAVALIER (1:1 Depth)</text>
          {/* Front Face (True Shape) */}
          <rect x="20" y="50" width="100" height="90" fill="none" stroke={c.thick} strokeWidth="2.5" />
          <circle cx="70" cy="95" r="24" fill="none" stroke={c.thick} strokeWidth="2" />
          <text x="70" y="99" fill={c.dimText} fontFamily="monospace" fontSize="8" textAnchor="middle">True Ø</text>
          {/* 45° Receding Lines (Full 70mm Depth) */}
          <line x1="20" y1="50" x2="70" y2="0" stroke={c.thick} strokeWidth="2.2" />
          <line x1="120" y1="50" x2="170" y2="0" stroke={c.thick} strokeWidth="2.2" />
          <line x1="120" y1="140" x2="170" y2="90" stroke={c.thick} strokeWidth="2.2" />
          <line x1="70" y1="0" x2="170" y2="0" stroke={c.thick} strokeWidth="2.2" />
          <line x1="170" y1="0" x2="170" y2="90" stroke={c.thick} strokeWidth="2.2" />
          <text x="140" y="35" fill={c.accent} fontFamily="monospace" fontSize="9">45° @ 1:1</text>
        </g>

        {/* Cabinet Projection (Right - Foreshortened 1:2 Scale Depth) */}
        <g transform="translate(280, 60)">
          <text x="80" y="20" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CABINET (1:2 Depth)</text>
          {/* Front Face (True Shape) */}
          <rect x="20" y="50" width="100" height="90" fill="none" stroke={c.thick} strokeWidth="2.5" />
          <circle cx="70" cy="95" r="24" fill="none" stroke={c.thick} strokeWidth="2" />
          <text x="70" y="99" fill={c.dimText} fontFamily="monospace" fontSize="8" textAnchor="middle">True Ø</text>
          {/* 45° Receding Lines (50% Foreshortened 35mm Depth) */}
          <line x1="20" y1="50" x2="45" y2="25" stroke={c.thick} strokeWidth="2.2" />
          <line x1="120" y1="50" x2="145" y2="25" stroke={c.thick} strokeWidth="2.2" />
          <line x1="120" y1="140" x2="145" y2="115" stroke={c.thick} strokeWidth="2.2" />
          <line x1="45" y1="25" x2="145" y2="25" stroke={c.thick} strokeWidth="2.2" />
          <line x1="145" y1="25" x2="145" y2="115" stroke={c.thick} strokeWidth="2.2" />
          <text x="110" y="35" fill="#22c55e" fontFamily="monospace" fontSize="9" fontWeight="bold">45° @ 50%</text>
        </g>
        <text x="260" y="280" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">Cabinet eliminates visual distortion by halving receding dimensions</text>
      </g>
    );
  }

  // 17. SURFACE DEVELOPMENTS & INTERPENETRATION
  if (svgType === 'development') {
    return (
      <g>
        {/* Orthographic Elevation of Truncated Cylinder */}
        <g transform="translate(60, 60)">
          <text x="60" y="20" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">ELEVATION</text>
          <line x1="0" y1="180" x2="120" y2="180" stroke={c.thick} strokeWidth="2.5" />
          <line x1="0" y1="180" x2="0" y2="80" stroke={c.thick} strokeWidth="2.5" />
          <line x1="120" y1="180" x2="120" y2="40" stroke={c.thick} strokeWidth="2.5" />
          {/* Truncating 30° Plane */}
          <line x1="0" y1="80" x2="120" y2="40" stroke={c.thick} strokeWidth="3" />
          <line x1="60" y1="20" x2="60" y2="190" stroke={c.center} strokeWidth="1.4" strokeDasharray="8,3,2,3" />
          {/* Generator Lines */}
          <line x1="30" y1="70" x2="30" y2="180" stroke={c.thin} strokeWidth="1" strokeDasharray="3,2" />
          <line x1="60" y1="60" x2="60" y2="180" stroke={c.thin} strokeWidth="1" strokeDasharray="3,2" />
          <line x1="90" y1="50" x2="90" y2="180" stroke={c.thin} strokeWidth="1" strokeDasharray="3,2" />
        </g>

        {/* Stretchout Pattern (Development) */}
        <g transform="translate(210, 60)">
          <text x="140" y="20" fill={c.thick} fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">DEVELOPMENT PATTERN (STRETCHOUT = π × D)</text>
          {/* Stretchout Base Line */}
          <line x1="0" y1="180" x2="280" y2="180" stroke={c.thick} strokeWidth="2.5" />
          {/* Seam Lines */}
          <line x1="0" y1="180" x2="0" y2="80" stroke={c.thick} strokeWidth="2.5" />
          <line x1="280" y1="180" x2="280" y2="80" stroke={c.thick} strokeWidth="2.5" />
          {/* Truncated Sinusoidal Cut Boundary */}
          <path 
            d="M 0 80 Q 70 40, 140 40 T 280 80" 
            fill={isLightMode ? 'rgba(2,132,199,0.08)' : 'rgba(56,189,248,0.1)'} 
            stroke={c.thick} 
            strokeWidth="3" 
          />
          {/* Division Generator Lines 1 to 12 */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <line key={i} x1={i * 35} y1="180" x2={i * 35} y2="50" stroke={c.thin} strokeWidth="1" strokeDasharray="3,2" />
          ))}
          <text x="140" y="200" fill={c.dimText} fontFamily="monospace" fontSize="10" textAnchor="middle">Circumference = 3.1416 × 90mm = 282.7mm</text>
        </g>
      </g>
    );
  }

  // 18. SCALES (Plain & Diagonal)
  return (
    <g>
      {/* Scale Frame */}
      <rect x="80" y="140" width="380" height="50" fill="none" stroke={c.thick} strokeWidth="2.5" />
      
      {/* Primary meter units */}
      {[0, 1, 2, 3, 4].map(unit => (
        <line key={unit} x1={160 + unit * 75} y1="140" x2={160 + unit * 75} y2="190" stroke={c.thick} strokeWidth="2" />
      ))}

      {/* Subdivisions of first unit (decimeters) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={80 + i * 8} y1="140" x2={80 + i * 8} y2="170" stroke={c.thin} strokeWidth="1.2" />
      ))}

      {/* Unit numbering */}
      <text x="160" y="210" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
      <text x="235" y="210" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
      <text x="310" y="210" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
      <text x="385" y="210" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
      <text x="460" y="210" fill={c.thick} fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">4 METRES</text>
      <text x="80" y="210" fill={c.thick} fontFamily="monospace" fontSize="11" textAnchor="middle">10 dm</text>

      {/* Reading indicator: 2.6 metres */}
      <line x1="112" y1="110" x2="310" y2="110" stroke={c.dim} strokeWidth="2" />
      <polyline points="118,105 112,110 118,115" fill="none" stroke={c.dim} strokeWidth="1.8" />
      <polyline points="304,105 310,110 304,115" fill="none" stroke={c.dim} strokeWidth="1.8" />
      <text x="210" y="100" fill={c.dimText} fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">READING = 2.6 METRES (RF 1:50)</text>
    </g>
  );
}
