import { TextbookChapter, LineWeightConvention } from '../types/textbook';
import { curriculumReferenceExtensions } from './curriculumReferenceExtensions';

export const STANDARD_ISO_LINE_TABLE: LineWeightConvention[] = [
  {
    type: 'Continuous Thick Line (Type A)',
    isoCode: 'ISO 128-20 Type A / BS 308',
    thickness: '0.50mm – 0.70mm',
    pencilGrade: 'HB or F (Chisel or conical)',
    ruleDescription: 'Used exclusively for visible outlines, external edges, and finished geometric boundaries.'
  },
  {
    type: 'Continuous Thin Line (Type B)',
    isoCode: 'ISO 128-20 Type B / BS 308',
    thickness: '0.25mm – 0.35mm',
    pencilGrade: '2H or 3H (Sharp conical)',
    ruleDescription: 'Used for construction arcs, bisectors, projection lines, dimension & extension lines, hatching, and leader lines.'
  },
  {
    type: 'Dashed Thin Line (Type E)',
    isoCode: 'ISO 128-20 Type E',
    thickness: '0.25mm – 0.35mm',
    pencilGrade: '2H or H',
    ruleDescription: 'Used for hidden outlines and edges. Dash length 3mm with 1mm uniform spacing.'
  },
  {
    type: 'Long Chain Thin Line (Type G)',
    isoCode: 'ISO 128-20 Type G',
    thickness: '0.25mm',
    pencilGrade: '2H or 3H',
    ruleDescription: 'Used for axes of symmetry, centerlines of circles/cylinders, pitch circles, and paths of loci.'
  },
  {
    type: 'Thin Chain Line with Thick Ends (Type F)',
    isoCode: 'ISO 128-20 Type F',
    thickness: '0.25mm with 0.70mm ends',
    pencilGrade: '2H with HB ends',
    ruleDescription: 'Used for cutting planes and sectional viewing directions with directional arrowheads.'
  }
];

export const textbookCurriculumDatabase: Record<string, Partial<TextbookChapter>> = {
  // 1. BISECTION OF STRAIGHT LINES & ANGLES
  'bisection': {
    title: 'Bisection of Straight Lines and Angles',
    historicalContext: `The bisection of line segments and plane angles represents the cornerstone of Euclidean constructive geometry, first codified in Book I of Euclid's Elements (c. 300 BCE, Propositions 9 and 10). In British and West African technical drafting traditions, as articulated by J.N. Green in Technical Drawing for School Certificate & G.C.E. and F. Pickup & M.A. Parker in Engineering Drawing with Worked Examples (Vol. 1), bisection is established not by numerical measurement with a graduated rule or protractor, but through the intersection of conjugate circular loci.

This guarantees absolute geometric precision independent of instrumental parallax. In mechanical engineering and structural design, the perpendicular bisector provides the true axis of symmetry, vital for balancing rotating assemblies, positioning column centerlines, and establishing pitch circle diameters.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 2: Bisection of Lines and Angles',
        pages: 'pp. 14–23',
        figureRefs: ['Fig. 2.1 (Bisection of Line AB)', 'Fig. 2.4 (Perpendicular from Point)', 'Fig. 2.9 (Angle Bisection)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A (Plane Geometry), NERDC SS1 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 1: Plane Geometry and Construction Theorems',
        pages: 'pp. 1–12',
        figureRefs: ['Worked Example 1 (Perpendicular Bisector)', 'Worked Example 3 (Subdividing Angles)'],
        syllabusRelevance: 'G.C.E. Advanced Level & City and Guilds Mechanical Engineering Craft Studies'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 1)',
        title: 'Construct the Perpendicular Bisector of a Given Line AB = 120mm',
        givenData: 'A horizontal line AB of length 120mm drawn on drawing paper.',
        constructionTheorem: 'Any point equidistant from two fixed points A and B lies on the perpendicular bisector of segment AB. The intersection of two such points uniquely defines the normal.',
        steps: [
          'Step 1: Using a T-square and 2H pencil, draw horizontal line AB of length 120mm. Mark endpoints cleanly.',
          'Step 2: Set compass needle at point A. Open compass to a radius r strictly greater than half AB (take r ≈ 80mm).',
          'Step 3: Strike two arcs, one above line AB and one below line AB.',
          'Step 4: Maintaining the identical compass radius r, transfer the needle to point B. Strike arcs to intersect the previous arcs at points C (above) and D (below).',
          'Step 5: Place a straightedge across intersection nodes C and D. Draw line CD cutting AB at point M.',
          'Step 6: Trace CD with continuous thin line (2H) and accent midpoint marker M with HB pencil. Verify AM = MB = 60mm and ∠AMC = 90°.'
        ],
        waecExaminerTip: 'WAEC marking schemes award 4 marks for visible 2H intersection arcs at C and D. If arcs are erased or drawn with heavy HB graphite, examiners apply an immediate 50% deduction.',
        figureRef: 'Fig. 1.1'
      },
      {
        exampleNumber: 'Worked Example 2 (J.N. Green, Chapter 2, Fig. 2.11)',
        title: 'Bisect an Obtuse Angle ∠AOB = 135° without a Protractor',
        givenData: 'Two straight lines OA and OB meeting at vertex O at an angle of 135°.',
        constructionTheorem: 'The bisector of an angle is the locus of points equidistant from the two arms of the angle.',
        steps: [
          'Step 1: With vertex O as center and any convenient radius (e.g., 45mm), draw an arc cutting arm OA at P and arm OB at Q.',
          'Step 2: With center P and a radius greater than half chord PQ, swing an arc into the interior angle region.',
          'Step 3: With center Q and the identical radius, swing another arc intersecting the previous arc at node R.',
          'Step 4: Draw a straight line from vertex O through intersection point R. Line OR bisects ∠AOB into two equal angles of 67.5°.'
        ],
        waecExaminerTip: 'Ensure vertex O is not pierced into a large hole by compass pressure. The bisecting ray must pass dead-center through intersection R.',
        figureRef: 'Fig. 1.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 1.1',
        title: 'Perpendicular Bisector of Line AB (J.N. Green Fig. 2.1)',
        caption: 'Standard Euclidean compass construction showing intersecting conjugate loci above and below datum line AB. All 2H construction arc traces are intentionally preserved.',
        imageUrl: '/assets/bisection_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 2, p. 15',
          'Pencil grade: 2H for intersecting arcs (0.25mm), HB for line AB (0.50mm)',
          'Radius condition: r >= 0.65 * AB to ensure sharp, unambiguous intersection angles'
        ],
        dimensions: ['Line AB = 120mm', 'Radius r = 80mm', 'Tolerance = ±0.25mm'],
        svgType: 'bisection',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green Fig. 2.1 / Pickup & Parker Ex. 1'
      },
      {
        figureNumber: 'Fig. 1.2',
        title: 'Bisection of an Angle ∠AOB (Pickup & Parker Vol. 1, Ex. 3)',
        caption: 'Equidistant arc struck from vertex O followed by intersecting cross-arcs to generate the true 50% bisector ray OR.',
        imageUrl: '/assets/bisection_plate.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 4',
          'Arc node intersections must meet at approximately 60° to 90° for maximum optical accuracy',
          'Bisector ray OR drawn with continuous HB pencil stroke'
        ],
        dimensions: ['∠AOB = 120°', '∠AOR = ∠ROB = 60°', 'Arc Radius = 50mm'],
        svgType: 'bisection',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 3'
      },
      {
        figureNumber: 'Fig. 1.3',
        title: 'Dropping a Perpendicular from External Point P onto Line AB (J.N. Green Fig. 2.4)',
        caption: 'Arc of circle with center P cutting line AB at points X and Y, with secondary arcs intersecting below to project true normal.',
        imageUrl: '/assets/bisection_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 2, p. 17',
          'Normal line PQ is strictly perpendicular to AB (∠PQA = 90.0°)',
          'Essential for finding shortest offset distance in civil and structural surveying'
        ],
        dimensions: ['Offset Distance = 75mm', 'Angle = 90.0°', 'Tolerance = ±0.2mm'],
        svgType: 'bisection',
        constructionGrade: '2H Construction',
        textbookSource: 'J.N. Green Fig. 2.4'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Equidistant Locus Theorem and Perpendicularity',
        paragraphs: [
          `In technical graphics, bisection is governed by the Equidistant Locus Theorem: the set of all points in a plane that are equidistant from two fixed points A and B forms the perpendicular bisector of segment AB (refer to J.N. Green, Technical Drawing for Schools, Fig. 14).`,
          `When compass arcs of equal radius r > 0.5 * AB are swung from centers A and B, their intersection points C and D satisfy AC = BC and AD = BD. Line CD is therefore perpendicular to AB at its exact mathematical midpoint M. This eliminates measuring errors that inevitably occur when dividing lines with a scale rule.`
        ],
        mathematicalFormulation: 'PA = PB ⟺ P ∈ Perpendicular Bisector of AB;   AM = MB = ½ AB',
        engineeringImportance: 'Guarantees perfect symmetry in mechanical housings, chassis baselines, and aerodynamic airfoil profiles.',
        figureRef: 'Fig. 1.1'
      },
      {
        title: 'Angle Bisection by Conjugate Rhombus Construction',
        paragraphs: [
          `As demonstrated by Pickup & Parker (Vol. 1, p. 4), the standard compass construction for bisecting angle ∠AOB creates an equilateral rhombus OP RQ inside the angle arms.`,
          `Because opposite angles of a rhombus are bisected by its diagonal, line OR must divide ∠AOB into two congruent angles. In WAEC examinations, candidates must maintain equal radius settings when striking arcs from P and Q, otherwise the rhombus is distorted and the bisecting ray is displaced.`
        ],
        mathematicalFormulation: '∠AOR = ∠ROB = ½ ∠AOB',
        engineeringImportance: 'Fundamental for miter joint layout in carpentry, structural roof hip rafters, and hydraulic pipe elbows.',
        figureRef: 'Fig. 1.2'
      }
    ],
    examinerTraps: [
      {
        trap: 'Erasing Construction Arcs after Finding Midpoint',
        penalty: 'Loss of 4 marks out of 10 in WAEC Paper 2 Section A.',
        avoidance: 'Never erase construction arcs. Keep them sharp and faint with a 2H pencil (0.25mm) so the examiner can verify authentic geometric construction.'
      },
      {
        trap: 'Setting Compass Radius Less than Half the Line Length (r < ½ AB)',
        penalty: 'Failure of construction; arcs fail to intersect.',
        avoidance: 'Always visually inspect that the compass lead extends well past the estimated midpoint before striking arcs (r >= 0.65 * AB).'
      }
    ]
  },

  // 2. DIVISION OF LINES INTO EQUAL & PROPORTIONAL PARTS
  'division-of-line': {
    title: 'Division of Straight Lines into Proportional Segments',
    historicalContext: `The division of an unmeasured line segment into equal or proportional parts is derived from Thales of Miletus' Intercept Theorem (c. 600 BCE): if two transversals intersect a set of parallel lines, the corresponding intercepts are directly proportional.

In technical drafting, as established by J.N. Green (Chapter 2) and Pickup & Parker (Vol. 1, Chapter 2), this theorem enables draftsmen to divide any given line AB into any number of parts (e.g. 5 equal divisions or ratios such as 2:3:4) without calculating decimal fractions or introducing rounding errors with a millimeter scale rule. It forms the mathematical foundation of plain and diagonal scales.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 2: Division of Lines',
        pages: 'pp. 20–25',
        figureRefs: ['Fig. 2.15 (Equal Division into 5 Parts)', 'Fig. 2.18 (Ratio Division 2:3:4)', 'Fig. 2.21 (Geometric Mean)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 2: Proportional Division & Scales',
        pages: 'pp. 13–24',
        figureRefs: ['Worked Example 4 (Equal Division)', 'Worked Example 5 (Proportional Ratios)'],
        syllabusRelevance: 'G.C.E. Advanced Level & WAEC Technical Drawing'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 4)',
        title: 'Divide Line AB = 135mm into 7 Equal Parts without Calculation',
        givenData: 'Line AB of length 135mm (135 / 7 = 19.2857mm, impossible to measure accurately with a standard scale).',
        constructionTheorem: 'Parallel lines intersecting transversals intercept proportional segments.',
        steps: [
          'Step 1: Draw horizontal line AB = 135mm using a T-square and 2H pencil.',
          'Step 2: From endpoint A, draw an auxiliary ray AC at an acute angle of approximately 30°.',
          'Step 3: Using a pair of dividers, step off 7 equal increments of any convenient length (e.g. 15mm) along AC, labeling them 1, 2, 3, 4, 5, 6, 7.',
          'Step 4: Using a straightedge and set square, join the last point (7) directly to endpoint B with a thin continuous line (2H).',
          'Step 5: Using sliding set-squares, draw lines parallel to 7-B through points 6, 5, 4, 3, 2, and 1, intersecting line AB.',
          'Step 6: Mark the intersection points on AB. Segment AB is now divided into exactly 7 equal parts.'
        ],
        waecExaminerTip: 'Ensure sliding set-squares do not slip during transfer. The parallel transfer lines must be strictly parallel; non-parallel transfer lines lose 3 marks.',
        figureRef: 'Fig. 2.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 2.1',
        title: 'Equal Division of Line AB into 7 Parts (J.N. Green Fig. 2.15)',
        caption: 'Auxiliary ray AC inclined at 30° stepped with 7 equal divider units. Parallel projection lines transfer equal spacing directly onto segment AB.',
        imageUrl: '/assets/bisection_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 2, p. 21',
          'Auxiliary ray drawn at acute angle (20° to 35° recommended)',
          'Parallel transfer lines drawn with sliding set-square method'
        ],
        dimensions: ['Line AB = 135mm', 'Divisions = 7 equal parts (19.29mm each)', 'Auxiliary Angle ≈ 30°'],
        svgType: 'bisection',
        constructionGrade: '2H Construction',
        textbookSource: 'J.N. Green Fig. 2.15 / Pickup & Parker Ex. 4'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Intercept Theorem and Parallel Projection',
        paragraphs: [
          `When dividing an arbitrary length into N equal parts, attempting to divide the length arithmetically frequently produces recurring decimals (such as 135mm / 7 = 19.2857mm). On a standard millimeter scale rule, tenths of a millimeter cannot be measured reliably (refer to J.N. Green Fig. 2.15).`,
          `By constructing an auxiliary line at any acute angle and stepping off integer increments with dividers, Thales' theorem guarantees that parallel rays projecting from the auxiliary axis onto the given line will divide it into mathematically exact congruent intervals.`
        ],
        mathematicalFormulation: '(A - 1) / (A - 1\') = (1 - 2) / (1\' - 2\') = … = (6 - 7) / (6\' - B) = constant',
        engineeringImportance: 'Essential for constructing custom scale rules, staircase tread layouts, structural truss panel points, and gear teeth pitch divisions.',
        figureRef: 'Fig. 2.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing Auxiliary Ray at too Steep an Angle (> 60°)',
        penalty: 'Transfer lines intersect at an oblique, shallow angle, causing severe positioning error.',
        avoidance: 'Keep auxiliary ray between 25° and 35° to ensure sharp, unambiguous line intersections.'
      }
    ]
  },

  // 3. REGULAR POLYGONS (PENTAGON, HEXAGON, OCTAGON)
  'polygons': {
    title: 'Construction of Regular Polygons',
    historicalContext: `Regular polygons—equilateral, equiangular figures—have formed the bedrock of architectural and mechanical design since ancient Greek and Islamic geometric ornament. In engineering practice, as documented in J.N. Green (Chapter 4) and Pickup & Parker (Vol. 1, Chapter 4), hexagonal and octagonal geometries are ubiquitous in threaded fasteners (ISO metric hexagonal bolts and nuts), fluid control valves, drill chucks, and pipe fittings.

Draftsmen must master two fundamental specifications: constructing polygons given the length of one side (the base method) and constructing polygons within or around a circle of given diameter (across flats or across corners).`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 4: Regular Polygons',
        pages: 'pp. 49–65',
        figureRefs: ['Fig. 4.3 (Hexagon Across Corners)', 'Fig. 4.7 (Hexagon Across Flats)', 'Fig. 4.12 (Regular Pentagon on Given Base)', 'Fig. 4.19 (General Method for Any Polygon)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 4'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 4: Triangles and Polygons',
        pages: 'pp. 35–48',
        figureRefs: ['Worked Example 11 (Hexagon Across Flats)', 'Worked Example 14 (Pentagon on Given Base)'],
        syllabusRelevance: 'WAEC Paper 2 & British Standard BS 308 Machine Drawing'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green, Chapter 4, Fig. 4.3)',
        title: 'Construct a Regular Hexagon Given Distance Across Corners (A/C = 80mm)',
        givenData: 'Distance across opposite vertices (Across Corners) C = 80mm.',
        constructionTheorem: 'In a regular hexagon, the circumscribing radius equals the side length (R = S = C/2 = 40mm). Drawing the circumcircle of diameter C and stepping off chords equal to radius R locates all six perimeter vertices.',
        steps: [
          'Step 1: Using T-square and 2H pencil, draw horizontal centerline. Bisect with vertical centerline to locate circumcenter O.',
          'Step 2: With center O and compass radius R = C / 2 = 40mm, draw the circumscribing circle (0.25mm thin continuous line).',
          'Step 3: From horizontal diameter endpoints A and D, with compass radius kept at R = 40mm, swing arcs above and below the centerline to intersect the circle at vertices B, C, E, and F.',
          'Step 4: Using a straightedge and sharp HB pencil (0.7mm Type A line), join consecutive vertices A-B-C-D-E-F-A to form the finished regular hexagon.',
          'Step 5: Apply dimension line Across Corners (A/C) = 80mm between points A and D, and indicate side length S = 40mm.'
        ],
        waecExaminerTip: 'Ensure compass arcs intersect the circumcircle crisply. In WAEC examinations, leaving visible 4H arc intersections is mandatory to receive full method marks.',
        figureRef: 'Fig. 3.1'
      },
      {
        exampleNumber: 'Worked Example 2 (Pickup & Parker Vol. 1, Ex. 11 & J.N. Green Fig. 4.7)',
        title: 'Construct a Regular Hexagon Given Distance Across Flats (A/F = 70mm)',
        givenData: 'Distance across flats (width across opposite parallel edges) W = 70mm.',
        constructionTheorem: 'A regular hexagon circumscribes an inscribed circle whose diameter equals the distance across flats (D = W). The sides are tangents to this circle inclined at 30° and 60° to the horizontal.',
        steps: [
          'Step 1: Using T-square and 30°/60° set square, draw horizontal and vertical centerlines intersecting at center O.',
          'Step 2: With compass set to radius R = W / 2 = 35mm, draw the inscribed circle with center O using a thin continuous line (2H).',
          'Step 3: Using the T-square, draw horizontal tangent lines at the top and bottom of the circle.',
          'Step 4: Using a 60° set square resting on the T-square, draw four tangents at 60° to the horizontal, touching the circle at the four quadrants.',
          'Step 5: The six intersecting tangent lines form the exact regular hexagon across flats.',
          'Step 6: Outline the six perimeter edges with a firm, sharp HB pencil (0.7mm Type A line).'
        ],
        waecExaminerTip: 'Do not confuse Across Flats (A/F) with Across Corners (A/C). In WAEC exams, drawing an across-corners hexagon when across-flats is specified results in zero marks for dimensions.',
        figureRef: 'Fig. 3.2'
      },
      {
        exampleNumber: 'Worked Example 3 (J.N. Green, Chapter 4, Fig. 4.12)',
        title: 'Construct a Regular Pentagon on a Given Base AB = 50mm',
        givenData: 'Base line AB = 50mm.',
        constructionTheorem: 'Interior angle of regular pentagon is θ = (5-2)×180° / 5 = 108°. Alternatively constructed via perpendicular bisector and auxiliary circle method.',
        steps: [
          'Step 1: Draw horizontal base AB = 50mm with 2H pencil. Bisect AB and erect perpendicular centerline.',
          'Step 2: At endpoint B, erect a perpendicular line BQ equal in length to AB (50mm).',
          'Step 3: With midpoint M of AB as center and radius MQ, strike an arc cutting the extension of line AB at point P.',
          'Step 4: The distance AP represents the diagonal length of the pentagon. With center A and radius AP, strike an arc above.',
          'Step 5: With center B and radius AP, strike an intersecting arc to locate the top vertex D.',
          'Step 6: With radius AB = 50mm and centers A, B, and D, locate the remaining vertices C and E. Join all vertices with HB lines.'
        ],
        waecExaminerTip: 'Preserve the diagonal construction arc AP. WAEC examiners look for this exact construction trace to award full method marks.',
        figureRef: 'Fig. 3.4'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 3.1',
        title: 'Regular Hexagon Constructed Across Corners (J.N. Green Fig. 4.3)',
        caption: 'Circumscribing circle chord stepping construction establishing the 6 vertices across opposite corners (A/C = 2S = 2R).',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 4, p. 50 (Fig. 4.3)',
          'Across Corners: Diameter of circumscribing circle = 2 * S',
          'Stepping arcs swung with compass radius R = S from diameter endpoints'
        ],
        dimensions: ['Across Corners C = 80mm', 'Side S = 40mm', 'Interior Angle = 120°'],
        svgType: 'polygon-across-corners',
        constructionGrade: '2H Circumcircle & HB Outline',
        textbookSource: 'J.N. Green Fig. 4.3'
      },
      {
        figureNumber: 'Fig. 3.2',
        title: 'Regular Hexagon Constructed Across Flats (Pickup & Parker Ex. 11 & J.N. Green Fig. 4.7)',
        caption: '30°/60° set-square tangency construction around inscribed circle of diameter W (Across Flats A/F = W).',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 38 (Ex. 11)',
          'Across Flats: Inscribed circle diameter D = W',
          'Horizontal tangents drawn with T-square; inclined tangents drawn at 60° with set-square',
          'Side S = W / tan(60°) = W / 1.732'
        ],
        dimensions: ['Across Flats W = 70mm', 'Across Corners C = 80.8mm', 'Side S = 40.4mm'],
        svgType: 'polygon-across-flats',
        constructionGrade: '2H Incircle & HB Outline',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 11'
      },
      {
        figureNumber: 'Fig. 3.3',
        title: 'Master Comparative Plate: Across Flats vs Across Corners (WAEC Syllabus Plate)',
        caption: 'Side-by-side engineering comparison between Across Flats (inscribed circle tangency method) and Across Corners (circumcircle chord method).',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Left: Vertices touch circumscribing circle (A/C = 2S)',
          'Right: Flat faces touch inscribed circle (A/F = S√3)',
          'Critical WAEC distinction for bolts, nuts, and shaft couplings'
        ],
        dimensions: ['Left A/C = 80mm', 'Right A/F = 70mm', 'Common Side S = 40mm'],
        svgType: 'polygon-comparative',
        constructionGrade: 'ISO 128 Comparative Standard',
        textbookSource: 'J.N. Green & Pickup & Parker Curricula'
      },
      {
        figureNumber: 'Fig. 3.4',
        title: 'Regular Pentagon on Given Base AB = 50mm (J.N. Green Fig. 4.12)',
        caption: 'Classical Golden Ratio diagonal construction establishing top vertex D and lateral vertices C and E on base AB.',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 4, p. 55',
          'Interior angle: 108°',
          'Golden ratio diagonal: AP = AB * 1.618'
        ],
        dimensions: ['Base AB = 50mm', 'Diagonal AP = 80.9mm', 'Height = 76.9mm'],
        svgType: 'pentagon',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green Fig. 4.12'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Geometric Symmetry and Angular Formulations',
        paragraphs: [
          `The internal angle of any regular N-sided polygon is given by the formula θ = (N - 2) * 180° / N. For a hexagon (N=6), θ = 120°; for an octagon (N=8), θ = 135°; for a pentagon (N=5), θ = 108° (refer to J.N. Green Chapter 4).`,
          `Because the exterior angle of a hexagon is 360° / 6 = 60°, a standard 30°/60° set square in conjunction with a T-square allows instantaneous construction of all six sides without protractor measurement. This efficiency makes the hexagon the preferred engineering standard for fasteners and machine fittings.`
        ],
        mathematicalFormulation: 'θ_interior = ((N - 2) × 180°) / N,   θ_exterior = 360° / N',
        engineeringImportance: 'Standardizes ISO metric bolts, nuts, socket spanners, and hydraulic fittings worldwide.',
        figureRef: 'Fig. 3.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using a 45° Set Square Instead of 30°/60° for a Hexagon',
        penalty: 'Instant disqualification of the polygon geometry (0 marks).',
        avoidance: 'Always verify the angles: hexagons strictly require 30° and 60° slopes; octagons strictly require 45° slopes.'
      }
    ]
  },

  // 3b. REGULAR PENTAGON (5-SIDED POLYGON - BASE & INSCRIBED METHODS)
  'pentagon': {
    title: 'Construction of a Regular Pentagon (Given Base Length & Inscribed Methods)',
    historicalContext: `The regular pentagon—an equilateral, equiangular 5-sided polygon with interior angles of 108.0°—holds a preeminent position in classical geometry and drafting science. As codified in J.N. Green (Chapter 4, pp. 54–56) and Pickup & Parker (Vol. 1, Chapter 4, Ex. 14), the pentagon's geometric structure is inextricably bound to the Golden Ratio (φ = (1 + √5)/2 ≈ 1.618033).

In engineering and industrial design, regular pentagonal geometry governs star-wheel indexing mechanisms, geneva drives, five-spoke automotive wheels, geodesic structural hubs, and architectural ornamental vaulting. In WAEC Technical Drawing examinations, constructing a regular pentagon on a given base AB using the perpendicular normal and golden ratio diagonal arc is a core compulsory topic. Examiners penalize candidates who confuse 5-sided pentagons with 6-sided hexagons.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 4: Regular Polygons',
        pages: 'pp. 54–58',
        figureRefs: ['Fig. 4.12 (Regular Pentagon on Given Base AB)', 'Fig. 4.14 (Regular Pentagon Inscribed in Circle)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 5'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 4: Triangles and Polygons',
        pages: 'pp. 42–46',
        figureRefs: ['Worked Example 14 (Pentagon on Given Base Length)', 'Worked Example 15 (Inscribed Pentagon)'],
        syllabusRelevance: 'WAEC Paper 2 Engineering Geometry'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green, Chapter 4, Fig. 4.12)',
        title: 'Construct a Regular Pentagon on a Given Base AB = 50mm (Golden Ratio Method)',
        givenData: 'Base line segment AB = 50mm.',
        constructionTheorem: 'In a regular pentagon of side S, every diagonal d satisfies d = S × (1 + √5)/2 ≈ 1.618 × S. Erecting perpendicular BQ = AB at B and striking arc from midpoint M with radius MQ cuts extended baseline at P, establishing true diagonal AP = d.',
        steps: [
          'Step 1: Using T-square and 2H pencil, draw horizontal base line AB = 50mm. Extend the line to the right of B.',
          'Step 2: Bisect AB to find midpoint M. Erect a thin vertical centerline through M to serve as the axis of symmetry.',
          'Step 3: At endpoint B, use a 30°/60° or 45° set square to erect a perpendicular line BQ equal in length to AB (BQ = 50mm).',
          'Step 4: Connect midpoint M to Q. With center M and compass radius MQ = 55.9mm, strike an arc cutting the extension of AB at point P.',
          'Step 5: The distance AP = 80.9mm represents the golden diagonal. With compass radius set to AP and center at A, strike an arc above; with center B and the same radius AP, strike an intersecting arc to fix top apex D on the centerline.',
          'Step 6: Reset compass to side length S = 50mm. With center A, strike an arc cutting the diagonal locus from B at vertex E; with center B, strike an arc cutting the diagonal locus from A at vertex C. Verify by checking that DC = DE = 50mm.',
          'Step 7: Using a sharp HB pencil (0.7mm Type A line), join vertices A-B-C-D-E-A to complete the finished regular pentagon.'
        ],
        waecExaminerTip: 'Do NOT erase the construction arc from M through Q to P. In WAEC examinations, 4 out of 10 marks are allocated exclusively to this golden ratio construction trace.',
        figureRef: 'Fig. 4.1'
      },
      {
        exampleNumber: 'Worked Example 2 (Pickup & Parker Vol. 1, Ex. 14)',
        title: 'Construct a Regular Pentagon Inscribed in a Circle of Diameter D = 80mm',
        givenData: 'Circumscribing circle diameter D = 80mm (Radius R = 40mm).',
        constructionTheorem: 'A regular pentagon inscribed in a circle subtends central angles of 360° / 5 = 72.0°. By bisecting the horizontal radius and swinging an arc to the vertical diameter, the chord length for one side S is established.',
        steps: [
          'Step 1: Draw horizontal and vertical centerlines intersecting at center O. Draw circumscribing circle of radius R = 40mm with 2H pencil.',
          'Step 2: Label horizontal diameter AB and vertical diameter CD (with C at the top).',
          'Step 3: Bisect radius OB to find midpoint M.',
          'Step 4: With center M and radius MC, swing an arc to cut diameter AB at point E.',
          'Step 5: The straight line distance CE is the exact chord length of the regular pentagon side S = 47.0mm.',
          'Step 6: With compass set to radius CE and starting from top point C, step off chords around the circumference to locate vertices 1, 2, 3, 4, 5.',
          'Step 7: Join consecutive vertices with sharp HB line work to complete the inscribed pentagon.'
        ],
        waecExaminerTip: 'Verify that the top vertex C is precisely on the vertical centerline. Step off the chords symmetrically on left and right to prevent cumulative compass error.',
        figureRef: 'Fig. 4.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 4.1',
        title: 'Regular Pentagon on Given Base AB = 50mm (J.N. Green Fig. 4.12)',
        caption: 'Classical Golden Ratio diagonal construction: perpendicular BQ = AB, midpoint arc MQ to P, and diagonal AP establishing top apex D and lateral vertices C and E.',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 4, p. 55 (Fig. 4.12)',
          'Base Side S = 50mm, Interior angle = 108.0°',
          'Golden diagonal AP = S × 1.618 = 80.9mm',
          'Apex D on perpendicular bisector of AB'
        ],
        dimensions: ['Base AB = 50mm', 'Diagonal AP = 80.9mm', 'Interior Angle = 108.0°', 'Apex Height = 76.9mm'],
        svgType: 'pentagon',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green Fig. 4.12'
      },
      {
        figureNumber: 'Fig. 4.2',
        title: 'Geometric Anatomy: 108° Interior Angles and Golden Ratio Diagonals',
        caption: 'Detailed geometric breakdown of the 5-sided regular pentagon showing 108° interior angles, 72° exterior angles, and diagonal proportion d/S = 1.618.',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Interior Angle θ = (5 - 2) × 180° / 5 = 108.0°',
          'Exterior Angle = 360° / 5 = 72.0°',
          'All 5 sides equal: AB = BC = CD = DE = EA',
          'Diagonals form an internal golden pentagram'
        ],
        dimensions: ['All Sides S = 50mm', 'All Diagonals d = 80.9mm', 'Interior Angle = 108.0°'],
        svgType: 'pentagon-anatomy',
        constructionGrade: 'ISO 128 Dimensioned Plate',
        textbookSource: 'Pickup & Parker Vol. 1 Ex. 14'
      },
      {
        figureNumber: 'Fig. 4.3',
        title: 'Regular Pentagon Inscribed in Circle of Diameter D = 80mm',
        caption: 'Circle chord stepping construction establishing the 5 vertices of a regular pentagon inscribed within a circle.',
        imageUrl: '/assets/actual_polygon_conic.jpg',
        technicalNotes: [
          'Reference: J.N. Green Fig. 4.14',
          'Circumcircle Diameter D = 80mm',
          'Side S = D × sin(36°) = 47.0mm',
          'Top vertex C aligned with vertical centerline'
        ],
        dimensions: ['Diameter D = 80mm', 'Radius R = 40mm', 'Side S = 47.0mm'],
        svgType: 'pentagon-inscribed',
        constructionGrade: '2H Circumcircle & HB Outline',
        textbookSource: 'J.N. Green Fig. 4.14'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Golden Ratio Diagonal Theorem and 108° Interior Angles',
        paragraphs: [
          `A regular pentagon is a 5-sided polygon with all five sides equal in length and all five interior angles equal to 108.0°. By the fundamental polygon angle formula θ = ((n - 2) × 180°) / n, for n = 5 we obtain θ = (3 × 180°) / 5 = 108.0°. The exterior angle is 360° / 5 = 72.0°.`,
          `The unique property of the regular pentagon is that the ratio of any diagonal d to any side S is the Golden Ratio: φ = (1 + √5) / 2 ≈ 1.618033. When triangle ABQ is constructed with BQ = AB and right angle at B, the distance from midpoint M to Q is MQ = √((S/2)² + S²) = (√5 / 2) × S. Swinging an arc with radius MQ from center M to cut the extension of AB at P gives AP = AM + MP = S/2 + (√5 / 2) × S = S × (1 + √5) / 2 = d. This provides an exact geometric compass-and-straightedge construction for the diagonal.`
        ],
        mathematicalFormulation: 'θ = \\frac{(5 - 2) \\times 180^\\circ}{5} = 108.0^\\circ, \\quad d = S \\times \\frac{1 + \\sqrt{5}}{2} \\approx 1.618 \\times S',
        engineeringImportance: 'Governs star indexing mechanisms, geneva stops, aerodynamic 5-fold hubs, and structural domes.',
        figureRef: 'Fig. 4.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using 60°/120° Hexagonal Angles for a Pentagon',
        penalty: 'Instant disqualification of the polygon (0 marks in WAEC).',
        avoidance: 'A pentagon has strictly 5 sides and 108° interior angles; a hexagon has 6 sides and 120° interior angles. Never use 30°/60° set-squares to construct a pentagon.'
      },
      {
        trap: 'Erasing the Auxiliary Golden Ratio Arc AP',
        penalty: 'Loss of 40% to 50% method marks in WAEC Paper 2.',
        avoidance: 'Leave the perpendicular BQ, hypotenuse MQ, arc from M to P, and intersecting diagonal arcs clearly visible in 2H/4H thin lines.'
      },
      {
        trap: 'Unequal Side Lengths When Stepping Off with Compass',
        penalty: 'Deduction of 3 marks for dimensional inaccuracy (tolerance must be within ±0.5mm).',
        avoidance: 'Check that DC and DE match base AB before drawing the final HB outline.'
      }
    ]
  },

  // 4. CIRCLES & TANGENCY (INTERNAL, EXTERNAL & BLENDING ARCS)
  'tangency': {
    title: 'Circles and Tangency (Blending Arcs & Common Tangents)',
    historicalContext: `Tangency—the smooth transition between a straight line and a curve, or between two circular arcs—is arguably the most critical practical drafting skill in mechanical and aerospace engineering. In J.N. Green's Technical Drawing (Chapter 6) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Chapter 6), tangency is treated with exhaustive rigor.

In mechanical components such as connecting rods, machine castings, turbine blades, and automotive body panels, abrupt angular changes create severe stress concentrations (notch effects) that lead to catastrophic fatigue failure. Blending curves with mathematically determined tangent centers ensures uniform stress distribution and smooth hydrodynamic or aerodynamic flow.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 6: Circles and Tangents',
        pages: 'pp. 86–112',
        figureRefs: ['Fig. 6.8 (External Tangent to Two Circles)', 'Fig. 6.14 (Internal Tangent to Two Circles)', 'Fig. 6.22 (Arc Blending Two Straight Lines)', 'Fig. 6.30 (Arc Blending Two Circles Externally/Internally)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A & B, NERDC SS2 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 6: Tangency and Curves in Engineering',
        pages: 'pp. 55–74',
        figureRefs: ['Worked Example 28 (Spanner Head Tangency)', 'Worked Example 31 (External & Internal Blending Radii)', 'Worked Example 34 (Open and Crossed Belt Pulley Geometry)'],
        syllabusRelevance: 'WAEC Paper 2 Core Question (Compulsory 20-Mark Question)'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 31)',
        title: 'Blend Two Circles (R1 = 30mm, R2 = 20mm, Center Distance L = 90mm) with an External Arc of Radius R = 45mm',
        givenData: 'Circle A (radius R1 = 30mm) and Circle B (radius R2 = 20mm) with centers separated by 90mm. Blending arc radius R = 45mm.',
        constructionTheorem: 'When a blending arc of radius R touches two circles externally, its center O is located at the intersection of two arcs struck from the circle centers with radii (R + R1) and (R + R2).',
        steps: [
          'Step 1: Draw horizontal centerline and locate center A and center B exactly 90mm apart. Draw circles A (R=30mm) and B (R=20mm).',
          'Step 2: Calculate external locus radii: Locus Radius 1 = R + R1 = 45 + 30 = 75mm; Locus Radius 2 = R + R2 = 45 + 20 = 65mm.',
          'Step 3: With center A, strike an arc of radius 75mm with 2H pencil.',
          'Step 4: With center B, strike an arc of radius 65mm intersecting the first arc at center point O.',
          'Step 5: Crucial step: Draw straight lines from center O to center A, and from center O to center B. The points where these lines cross the circle perimeters are the exact points of tangency T1 and T2.',
          'Step 6: Place compass needle at point O, open to radius R = 45mm, and draw the blending arc cleanly from T1 to T2 with an HB pencil.'
        ],
        waecExaminerTip: 'Candidates who fail to mark the tangent points T1 and T2 before drawing the arc lose 3 marks immediately. The arc must terminate precisely at T1 and T2 without overshooting or undershooting.',
        figureRef: 'Fig. 4.1'
      },
      {
        exampleNumber: 'Worked Example 2 (J.N. Green, Chapter 6, Fig. 6.30)',
        title: 'Blend Two Circles Internally (Enclosing Arc of Radius R = 110mm)',
        givenData: 'Circle A (R1 = 25mm) and Circle B (R2 = 20mm), center distance 70mm. Enclosing arc R = 110mm.',
        constructionTheorem: 'When an arc encloses two circles, its center is located by subtracting the circle radii from the blending radius: Locus 1 = R - R1; Locus 2 = R - R2.',
        steps: [
          'Step 1: Locate centers A and B separated by 70mm. Draw both circles.',
          'Step 2: Compute internal locus radii: Locus A = 110 - 25 = 85mm; Locus B = 110 - 20 = 90mm.',
          'Step 3: With center A, swing arc of 85mm; with center B, swing arc of 90mm to intersect at center O.',
          'Step 4: Draw projection lines from O through A and B to the far sides of the circles to mark tangent points T1 and T2.',
          'Step 5: Set compass at O with radius 110mm and draw the smooth enclosing arc from T1 to T2.'
        ],
        waecExaminerTip: 'Remember the rule: External contact = ADD radii (R + r); Internal enclosing contact = SUBTRACT radii (R - r).',
        figureRef: 'Fig. 4.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 4.1',
        title: 'External Blending Arc (R + r Rule) (Pickup & Parker Ex. 31)',
        caption: 'Tangency construction showing center locus determination via (R + R1) and (R + R2), with radial normal lines establishing exact contact nodes T1 and T2.',
        imageUrl: '/assets/actual_geometry_tangency.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 62',
          'Center locus: O is intersection of (R + R1) and (R + R2)',
          'Tangent points T1 and T2 lie strictly along line of centers OA and OB'
        ],
        dimensions: ['R1 = 30mm', 'R2 = 20mm', 'Blending Arc R = 45mm', 'Center Distance = 90mm'],
        svgType: 'tangent',
        constructionGrade: 'HB Final Outline & 2H Loci',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 31'
      },
      {
        figureNumber: 'Fig. 4.2',
        title: 'Internal Enclosing Blending Arc (R - r Rule) (J.N. Green Fig. 6.30)',
        caption: 'Internal tangency construction where radii are subtracted (R - R1) and (R - R2) to locate the common center of the concave contour.',
        imageUrl: '/assets/actual_geometry_tangency.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 6, p. 101',
          'Center locus: O is intersection of (R - R1) and (R - R2)',
          'Smooth joint with zero kink or discontinuity'
        ],
        dimensions: ['R1 = 25mm', 'R2 = 20mm', 'Enclosing Arc R = 110mm', 'Center Distance = 70mm'],
        svgType: 'tangent',
        constructionGrade: 'HB Final Outline',
        textbookSource: 'J.N. Green Fig. 6.30'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Law of Tangency and Normal Alignment',
        paragraphs: [
          `The foundational theorem of tangency states: two circles (or a circle and a line) are tangent to each other if and only if their point of contact T lies directly on the straight line connecting their centers (or on the perpendicular normal to the line) (refer to J.N. Green Chapter 6).`,
          `This geometric principle guarantees continuity of the first derivative (slope). In manufacturing, any deviation from this normal alignment creates a visible "kink" or step, leading to localized stress risers and tool breakage in CNC machining.`
        ],
        mathematicalFormulation: 'T ∈ O₁O₂,   Distance(O₁, O₂) = R₁ ± R₂',
        engineeringImportance: 'Guarantees smooth fluid transitions in turbine scroll casings, automotive camshaft profiles, and aerodynamic wing roots.',
        figureRef: 'Fig. 4.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Eyeballing Tangent Contact Points instead of Projecting Normals',
        penalty: 'Deduction of 2 to 3 marks per tangent joint in WAEC examinations.',
        avoidance: 'Always connect the centers with a thin 2H line to find the exact intersection with the circle boundary before putting down the compass lead.'
      }
    ]
  },

  // 5. SCALES: PLAIN, DIAGONAL & SCALE OF CHORDS
  'scales': {
    title: 'Plain Scales, Diagonal Scales, and Representative Fractions',
    historicalContext: `Scales bridge the gap between physical objects and sheet drawings. In J.N. Green's Technical Drawing (Chapter 5) and Pickup & Parker's Engineering Drawing (Vol. 1, Chapter 5), scales are treated as precision instruments of proportional representation.

Whether designing micro-miniature electronic components requiring enlargement scales (e.g. 5:1 or 10:1) or civil infrastructure and architectural plans requiring reduction scales (e.g. 1:50, 1:100, 1:500), technical draftsmen must construct custom plain and diagonal scales when standard scale rules do not provide the specified Representative Fraction (R.F.). Diagonal scales exploit similar triangles to read three consecutive units of measurement (e.g. meters, decimeters, centimeters) with micrometer precision.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 5: Scales',
        pages: 'pp. 66–85',
        figureRefs: ['Fig. 5.2 (Plain Scale Construction)', 'Fig. 5.7 (Diagonal Scale 3 Units)', 'Fig. 5.14 (Scale of Chords for Angles)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS2 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 5: Plain and Diagonal Scales',
        pages: 'pp. 49–54',
        figureRefs: ['Worked Example 18 (Plain Metric Scale)', 'Worked Example 21 (Diagonal Scale to Read Millimeters)'],
        syllabusRelevance: 'WAEC Paper 2 Section A (Compulsory Question)'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 21)',
        title: 'Construct a Diagonal Scale of 1:40 to Read up to 6 Meters, and Indicate a Distance of 4.37m',
        givenData: 'Representative Fraction R.F. = 1:40; Maximum length to measure = 6m; Reading requirement = meters, decimeters, centimeters.',
        constructionTheorem: 'Length of scale on drawing L = R.F. × Maximum Length = (1 / 40) × 6000mm = 150mm. Diagonal division of vertical grid reads hundredths.',
        steps: [
          'Step 1: Calculate total scale length: L = (1/40) * 6000mm = 150mm.',
          'Step 2: Draw a rectangle 150mm long and 30mm high. Divide length into 6 equal parts of 25mm each (each part = 1 meter).',
          'Step 3: Mark 0 at the first division from the left. Label 1, 2, 3, 4, 5 meters to the right.',
          'Step 4: Divide the first 1-meter compartment (left of 0) into 10 equal parts (each = 1 decimeter = 0.1m).',
          'Step 5: Divide the 30mm vertical height into 10 equal parallel horizontal divisions (each = 1 centimeter = 0.01m).',
          'Step 6: Draw diagonal lines from the sub-divisions at the bottom to the adjacent sub-divisions at the top (0 at bottom to 1 at top).',
          'Step 7: To measure 4.37m: Locate major unit 4m to the right of 0; move 3 decimeters to the left of 0; follow the 3rd diagonal up to the 7th horizontal line. Place indicator arrows and label "4.37m".'
        ],
        waecExaminerTip: 'Ensure zero is placed between the main units and the sub-units! Placing zero at the extreme left edge of the scale is an immediate 4-mark blunder.',
        figureRef: 'Fig. 5.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 5.1',
        title: 'Diagonal Scale Construction (1:40 Reading 4.37m) (J.N. Green Fig. 5.7)',
        caption: 'Full engineering diagonal scale layout showing major meter divisions to the right of zero, decimeters to the left, and centimeters along vertical diagonals.',
        imageUrl: '/assets/scales_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 5, p. 77',
          'Formula: Length of Scale = R.F. * Maximum Length',
          'Zero placed at boundary between main units and subdivisions'
        ],
        dimensions: ['R.F. = 1:40', 'Length of Scale = 150mm', 'Reading = 4.37m', 'Tolerance = ±0.01m'],
        svgType: 'scale',
        constructionGrade: 'ISO Dimensioned & 2H Grid',
        textbookSource: 'J.N. Green Fig. 5.7 / Pickup & Parker Ex. 21'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Representative Fraction and the Principle of Diagonals',
        paragraphs: [
          `The Representative Fraction (R.F.) is defined as the mathematical ratio of the length of an element on the drawing sheet to its true physical length in the real world: R.F. = Drawing Length / Actual Length (both expressed in identical units) (see J.N. Green Chapter 5).`,
          `The diagonal scale exploits the geometric principle of similar right-angled triangles: in a right-angled triangle of base b and height h, a horizontal line drawn at height y/h has a width of (y/h) * b. By dividing the height into 10 equal parts, the base is subdivided into tenths, enabling a readout of 1/100th of the main unit.`
        ],
        mathematicalFormulation: 'R.F. = (Dimension on Drawing) / (Actual Dimension),   Length of Scale = R.F. × L_max',
        engineeringImportance: 'Enables precise dimension scaling on civil topographic maps, architectural floor plans, and mechanical micro-assemblies.',
        figureRef: 'Fig. 5.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Placing Zero at the Far-Left Edge of the Scale',
        penalty: 'Loss of 4 marks for fundamental scale structure error.',
        avoidance: 'Always place zero at the end of the first main unit so sub-units read to the left and main units read to the right.'
      }
    ]
  },

  // 6. ORTHOGRAPHIC PROJECTION (FIRST & THIRD ANGLE)
  'orthographic': {
    title: 'Orthographic Projection (First and Third Angle Systems)',
    historicalContext: `Orthographic projection—the universal graphic language of engineering—was formalized in 1795 by French mathematician Gaspard Monge in his landmark treatise Géométrie Descriptive. In J.N. Green's Technical Drawing (Chapter 10) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Chapters 8 & 9), orthographic projection is established as the primary medium for conveying 3D mechanical components on 2D drawing sheets without perspective distortion.

Two international standards exist: First Angle Projection (traditionally British and European, ISO 128 Type E, widely mandated in WAEC/GCE curricula) and Third Angle Projection (American standard, ISO 128 Type A, dominant in CAD systems and automotive manufacturing). Every engineering drawing must unambiguously declare its system of projection using the ISO truncated cone symbol in the title block.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 10: Orthographic Projection',
        pages: 'pp. 150–194',
        figureRefs: ['Fig. 10.5 (First Angle Dihedral Box)', 'Fig. 10.12 (Third Angle Dihedral Box)', 'Fig. 10.25 (Three-View First Angle Projection of Stepped Block)', 'Fig. 10.38 (ISO Projection Symbols)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B (Compulsory 30-Mark Question)'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 8: First Angle Projection & Chapter 9: Third Angle Projection',
        pages: 'pp. 85–130',
        figureRefs: ['Worked Example 38 (Casting in 1st Angle)', 'Worked Example 45 (Bearing Bracket in 3rd Angle)'],
        syllabusRelevance: 'Core of WAEC Technical Drawing Paper 2 & British Standard BS 308'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 38)',
        title: 'Draw the Three Standard Views of a Slotted Bearing Block in First Angle Projection',
        givenData: 'Isometric pictorial view of cast-iron bearing block (Length 100mm, Width 60mm, Height 50mm, central slot 30mm wide × 20mm deep).',
        constructionTheorem: 'In First Angle Projection, the object is placed in the First Quadrant between the observer and the projection planes: What is seen from the left is drawn on the right; the Plan (view from above) is drawn below the Front Elevation.',
        steps: [
          'Step 1: Draw horizontal datum ground line XY using T-square and 2H pencil. Establish vertical projection boundaries.',
          'Step 2: Draw the Front Elevation (seen in direction of arrow F) as a 100mm × 50mm outline. Draw the 30mm × 20mm slot with visible HB outlines.',
          'Step 3: Project vertical rays downward from all corners and edges of the Front Elevation with a 2H pencil.',
          'Step 4: Draw the Plan View directly underneath the Front Elevation, separated by a uniform spacing of 25mm. Width = 60mm.',
          'Step 5: Erect a 45° mitre projection line from the XY baseline corner. Project depth dimensions from the Plan View across the mitre line and upward to establish the End Elevation.',
          'Step 6: Draw the End Elevation to the right of the Front Elevation (representing the view seen from the left). Draw hidden slot lines with Dashed Thin Lines (ISO Type E, 2H).',
          'Step 7: Draw the standard ISO First Angle truncated cone symbol in the title block.'
        ],
        waecExaminerTip: 'In First Angle Projection, NEVER draw the Plan above the Front Elevation! This is the most common fatal error in WAEC exams and results in an automatic 50% penalty across the entire question.',
        figureRef: 'Fig. 6.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 6.1',
        title: 'First Angle Multi-View Orthographic Layout (J.N. Green Fig. 10.25)',
        caption: 'Three-view layout (Front Elevation, Plan below, End Elevation on right) linked by 2H projection rays and a 45° mitre line with ISO First Angle symbol.',
        imageUrl: '/assets/actual_orthographic_diagram.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 10, p. 162',
          'Plan is strictly located BELOW the Front Elevation',
          'View seen from LEFT is drawn on the RIGHT',
          'Hidden detail drawn with 3mm dashes and 1mm gaps (ISO 128 Type E)'
        ],
        dimensions: ['Overall Length = 100mm', 'Width = 60mm', 'Height = 50mm', 'Inter-view Spacing = 25mm'],
        svgType: 'orthographic',
        constructionGrade: 'ISO First Angle Blueprint',
        textbookSource: 'J.N. Green Fig. 10.25 / Pickup & Parker Ex. 38'
      },
      {
        figureNumber: 'Fig. 6.2',
        title: 'Third Angle Multi-View Layout & Symbol (Pickup & Parker Ex. 45)',
        caption: 'Third Angle projection where Plan is placed ABOVE the Front Elevation, Right End Elevation is on the right, and 45° mitre line sits in the top-right quadrant with the ISO Third Angle symbol.',
        imageUrl: '/assets/actual_orthographic_diagram.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 115',
          'Plan is strictly located ABOVE the Front Elevation',
          'View seen from RIGHT is drawn on the RIGHT',
          '45° mitre line resides in top-right quadrant',
          'ISO 5456-3 symbol: two concentric circles on LEFT, truncated cone on RIGHT'
        ],
        dimensions: ['Overall Length = 160mm', 'Width = 120mm', 'Height = 120mm'],
        svgType: 'orthographic-third-angle',
        constructionGrade: 'ISO Third Angle Blueprint',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 45'
      },
      {
        figureNumber: 'Fig. 6.3',
        title: 'True Length and True Inclination of Oblique Line (J.N. Green Fig. 10.32)',
        caption: 'Determination of true spatial length (TL) and inclination angles (θ to HP, Φ to VP) of an oblique line by revolving elevation/plan views parallel to the XY datum.',
        imageUrl: '/assets/actual_orthographic_diagram.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 10, p. 170',
          'Method: Revolving line into plane parallel to VP/HP',
          'True length L = √(Δx² + Δy² + Δz²)',
          'True angle θ measured directly from revolved projection'
        ],
        dimensions: ['Plan Length = 120mm', 'True Length TL = 145mm', 'True Angle θ = 34.0°'],
        svgType: 'true-lengths',
        constructionGrade: 'Auxiliary Projection Standard',
        textbookSource: 'J.N. Green Fig. 10.32 / Pickup & Parker Ex. 48'
      },
      {
        figureNumber: 'Fig. 6.4',
        title: 'Two-Point Angular Perspective Projection (Pickup & Parker Vol. 1, Ex. 52)',
        caption: 'Pictorial perspective of stepped block with Horizon Line (HL), Ground Line (GL), Station Point (SP), and Left/Right Vanishing Points (VPL, VPR).',
        imageUrl: '/assets/actual_isometric_diagram.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 128',
          '30°/60° vanishing ray construction from Station Point',
          'Measuring line erected at picture plane contact vertex',
          'All receding parallel lines converge to VPL and VPR'
        ],
        dimensions: ['Eye Height = 60mm', 'Object Width = 80mm', 'Station Distance = 160mm'],
        svgType: 'perspective',
        constructionGrade: 'Architectural Perspective Standard',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 52 / J.N. Green Fig. 11.14'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Monge\'s Quadrant Geometry and Spatial Planes',
        paragraphs: [
          `In orthographic projection, three mutually perpendicular planes of projection are established: the Vertical Plane (VP), the Horizontal Plane (HP), and the Auxiliary Vertical Plane (AVP) (refer to J.N. Green Chapter 10).`,
          `In First Angle Projection, the object resides in Quadrant 1 (above HP, in front of VP). When the planes are rotated into a single drawing sheet, the plan view swings down below the ground line XY, and the left view projects through the object onto the right plane. In Third Angle Projection, the object resides in Quadrant 3, reversing the view placement. Understanding this spatial kinematics prevents memorization errors.`
        ],
        mathematicalFormulation: 'First Angle: Plan ⊂ -y, Left View ⊂ +x;   Third Angle: Plan ⊂ +y, Left View ⊂ -x',
        engineeringImportance: 'The definitive universal legal contract for manufacturing parts across global engineering enterprises.',
        figureRef: 'Fig. 6.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Swapping View Positions (Drawing Plan above Front Elevation in 1st Angle)',
        penalty: 'Immediate deduction of 12 to 15 marks out of 30 in WAEC Section B.',
        avoidance: 'Recite the rule before setting out the sheet: First Angle = Plan Down; Third Angle = Plan Up.'
      },
      {
        trap: 'Omitting Hidden Detail Lines or Drawing them as Continuous Solid Lines',
        penalty: 'Loss of 4 marks for failure to represent interior geometry.',
        avoidance: 'Trace every hidden hole, bore, and slot with uniform dashed lines (3mm dash, 1mm gap, 2H pencil).'
      }
    ]
  },

  // 6B. THIRD ANGLE ORTHOGRAPHIC PROJECTION (ANSI / ISO 5456-3)
  'orthographic-third-angle': {
    title: 'Third Angle Orthographic Projection (ANSI / ISO 5456-3)',
    historicalContext: `Third Angle Projection is the internationally standard multi-view projection system defined in ISO 5456-3 and mandated by ANSI/ASME Y14.3 (United States/Canada) and JIS (Japan). In engineering curricula and modern CAD environments, Third Angle is revered for its natural, intuitive spatial kinematics.

As expounded in Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Chapter 9) and J.N. Green's Technical Drawing (Chapter 10, pp. 175–190), the component is imagined to be encased inside a transparent glass box in the Third Quadrant (below the Horizontal Plane and behind the Vertical Plane). 

Because the projection plane lies BETWEEN the observer and the object:
1. Viewing from ABOVE projects onto the top plane: the Plan View is placed strictly ABOVE the Front Elevation.
2. Viewing from the FRONT projects onto the vertical front plane: the Front Elevation is placed strictly BELOW the Plan.
3. Viewing from the RIGHT projects onto the right vertical plane: the Right End Elevation is placed strictly to the RIGHT of the Front Elevation.
4. The 45° mitre projection line is erected in the TOP-RIGHT quadrant (directly above the End Elevation and to the right of the Plan), enabling seamless reflection of depth dimensions from the Plan directly down into the Right End Elevation.
5. The ISO Third Angle Symbol consists of two concentric circles on the LEFT and a truncated cone on the RIGHT with its smaller face directed towards the circles.`,
    textbookReferences: [
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 9: Third Angle Projection',
        pages: 'pp. 110–135',
        figureRefs: ['Worked Example 45 (Stepped Bracket in 3rd Angle)', 'Worked Example 46 (Slotted Baseplate)'],
        syllabusRelevance: 'Core of WAEC Technical Drawing Paper 2 & ANSI/ISO Standards'
      },
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 10: Orthographic Projection (Section 3: Third Angle)',
        pages: 'pp. 175–194',
        figureRefs: ['Fig. 10.12 (Third Angle Dihedral Box)', 'Fig. 10.15 (Third Angle Three-View Layout)', 'Fig. 10.38 (ISO Projection Symbols)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B Multi-View Projections'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 45)',
        title: 'Draw Three Standard Views of a Stepped Bracket in Third Angle Projection',
        givenData: 'Pictorial dimensioned isometric view of cast iron stepped bracket (Length 160mm, Depth 120mm, Height 120mm, step cutout 80mm x 60mm).',
        constructionTheorem: 'In Third Angle Projection, the projection plane lies between the observer and the object: The Plan View is drawn strictly ABOVE the Front Elevation, and the Right End Elevation (view from the right) is drawn strictly to the RIGHT of the Front Elevation, linked by a 45° mitre line in the top-right quadrant.',
        steps: [
          'Step 1: Set out the horizontal ground datum line XY and vertical dividing axis X1Y1. In Third Angle, the Plan occupies the top-left quadrant, Front Elevation occupies the bottom-left, and Right End Elevation occupies the bottom-right.',
          'Step 2: Construct the Plan View in the top-left quadrant (160mm length × 120mm depth) with HB pencil outlines. Draw the 80mm step dividing line.',
          'Step 3: Project vertical 2H projection lines downward from all edges of the Plan View into the bottom-left quadrant.',
          'Step 4: Construct the Front Elevation directly underneath the Plan View (separated by a uniform 50mm clearance). Draw the stepped outline with HB pencil (Length 160mm, Height 120mm, Step 60mm).',
          'Step 5: Erect a 45° mitre line in the top-right quadrant originating from the intersection of the datum axes.',
          'Step 6: Project horizontal rays from the Plan View rightward to intersect the 45° mitre line, then reflect vertically downward to establish the width boundaries (120mm) of the Right End Elevation.',
          'Step 7: Project horizontal alignment rays from the Front Elevation rightward to establish the vertical height levels of the Right End Elevation.',
          'Step 8: Complete the Right End Elevation in the bottom-right quadrant with HB visible outlines and 2H dashed lines for internal hidden features.',
          'Step 9: Draw the ISO Third Angle truncated cone projection symbol in the title block (concentric circles on the left, cone on the right).'
        ],
        waecExaminerTip: 'In Third Angle questions, placing the Plan below the Front Elevation is an automatic failure of the projection system criterion. Always remember: Third Angle = Plan on TOP, Front on BOTTOM, Right view on RIGHT, 45° mitre line in TOP-RIGHT.',
        figureRef: 'Fig. 6.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 6.2',
        title: 'Third Angle Multi-View Layout & Symbol (Pickup & Parker Ex. 45)',
        caption: 'Third Angle projection showing Plan View strictly ABOVE Front Elevation, Right End Elevation to the right, and 45° mitre line in the top-right quadrant with ISO Third Angle symbol.',
        imageUrl: '/assets/actual_orthographic_diagram.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 115 / J.N. Green p. 176',
          'Plan is strictly located ABOVE the Front Elevation',
          'Right End View is strictly located to the RIGHT of Front Elevation',
          '45° mitre line operates in the TOP-RIGHT quadrant',
          'ISO 5456-3 Symbol: Concentric circles on LEFT, truncated cone on RIGHT'
        ],
        dimensions: ['Length = 160mm', 'Depth = 120mm', 'Height = 120mm', '45° Mitre Ray'],
        svgType: 'orthographic-third-angle',
        constructionGrade: 'ISO Third Angle Blueprint',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 45 / J.N. Green Fig. 10.15'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Third Angle Spatial Mechanics (Quadrant III Kinematics)',
        paragraphs: [
          `In Third Angle Projection, the object is placed in the Third Quadrant, meaning it is situated below the Horizontal Plane (HP) and behind the Vertical Plane (VP). The projection planes are conceived as transparent panels situated between the observer and the object.`,
          `When the horizontal plane is revolved 90° upward into coincidence with the vertical plane, the Plan View rotates upward, appearing ABOVE the ground baseline XY. The right side profile plane unfolds directly to the right. Consequently, every view appears on the side from which it is viewed: look from above -> view is on top; look from right -> view is on right.`,
          `The 45° mitre transfer ray is erected in the vacant top-right quadrant. Points on the top view are projected horizontally to the mitre line and then vertically downward, guaranteeing geometric congruence without secondary measurement.`
        ],
        mathematicalFormulation: 'Plan ⊂ +y (Top),   Front ⊂ -y (Bottom),   Right View ⊂ +x (Right),   Mitre Ray ⊂ (+x, +y)',
        engineeringImportance: 'The standard multi-view projection system for North American (ASME Y14.3), Japanese (JIS), and modern 3D CAD/CAM parametric modeling software.',
        figureRef: 'Fig. 6.2'
      },
      {
        title: 'ISO 5456-3 Third Angle Projection Symbol',
        paragraphs: [
          `Every technical drawing conforming to ISO standards must display the projection system symbol in the title block. For Third Angle Projection, the symbol depicts a truncated cone viewed from its smaller base.`,
          `The two concentric circles representing the small and large diameters appear on the LEFT, followed by the trapezoidal elevation of the truncated cone on the RIGHT with its smaller face directed towards the circles. This is the exact spatial inverse of the First Angle symbol.`
        ],
        mathematicalFormulation: '\\text{Left: } \\odot \\text{ (Two Concentric Circles)}, \\quad \\text{Right: } \\square \\text{ (Truncated Cone)}',
        engineeringImportance: 'Prevents catastrophic manufacturing errors when sending fabrication blueprints across international borders.',
        figureRef: 'Fig. 6.2'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing the Plan View Below the Front Elevation (First Angle Layout)',
        penalty: 'Immediate deduction of up to 15 marks out of 30 in WAEC Section B.',
        avoidance: 'Recite the rule before laying out the sheet: In Third Angle, the Plan must always sit directly ABOVE the Front Elevation.'
      },
      {
        trap: 'Drawing the ISO Third Angle Symbol Backwards (Cone on Left, Circles on Right)',
        penalty: 'Loss of 2 to 3 marks in title block presentation.',
        avoidance: 'In Third Angle, CIRCLES COME FIRST (on the left), followed by the cone on the right.'
      },
      {
        trap: 'Placing the 45° Mitre Line in the Bottom-Right Quadrant',
        penalty: 'Loss of 3 marks for distorted depth projection.',
        avoidance: 'In Third Angle, the mitre line sits in the TOP-RIGHT quadrant above the End Elevation to reflect rays from the top Plan downward.'
      }
    ]
  },

  // 7. CONIC SECTIONS (ELLIPSE, PARABOLA & HYPERBOLA)
  'conics': {
    title: 'Conic Sections (Ellipse, Parabola, and Hyperbola)',
    historicalContext: `Conic sections—the plane curves formed by the intersection of a right circular cone with a cutting plane—were first systematically investigated by Apollonius of Perga (c. 200 BCE). In engineering drawing textbooks, most notably J.N. Green (Chapter 8) and Pickup & Parker (Vol. 1, Chapter 7), conic sections are studied for their profound structural and kinematic properties.

The ellipse governs planetary orbits, pipes intersecting at an angle, and isometric circles; the parabola governs suspension bridge cables, aerodynamic nose cones, and solar reflectors; the hyperbola governs cooling tower profiles and supersonic shock waves. Technical examinations demand mastery of precise geometric constructions, including the concentric circles method, the trammel method, and the rectangular tangent method.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 8: Conic Sections',
        pages: 'pp. 125–149',
        figureRefs: ['Fig. 8.4 (Ellipse by Concentric Circles)', 'Fig. 8.10 (Ellipse by Trammel Method)', 'Fig. 8.21 (Parabola by Rectangle Method)', 'Fig. 8.28 (Hyperbola Construction)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS3 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 7: Conic Sections and Involutes',
        pages: 'pp. 75–84',
        figureRefs: ['Worked Example 37a (Concentric Circles Ellipse)', 'Worked Example 37b (Parabolic Arch)'],
        syllabusRelevance: 'WAEC Paper 2 Core Geometric Construction'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 37a)',
        title: 'Construct an Ellipse (Major Axis = 120mm, Minor Axis = 80mm) by the Concentric Circles Method',
        givenData: 'Major axis AB = 120mm (semi-major radius a = 60mm); Minor axis CD = 80mm (semi-minor radius b = 40mm).',
        constructionTheorem: 'Points on an ellipse satisfy parametric equations x = a * cos(θ), y = b * sin(θ). Intersecting horizontal projections from the minor circle with vertical projections from the major circle generates points on the curve.',
        steps: [
          'Step 1: Draw horizontal and vertical centerlines intersecting at center O.',
          'Step 2: With center O, draw the Major Auxiliary Circle (diameter = 120mm, radius = 60mm) and Minor Auxiliary Circle (diameter = 80mm, radius = 40mm) using a thin continuous line (2H).',
          'Step 3: Using a 30°/60° set square and T-square, divide the circles into 12 equal sectors of 30° each (rays radiating from center O).',
          'Step 4: From the points where the 12 radial lines intersect the MAJOR circle, project thin lines parallel to the vertical minor axis.',
          'Step 5: From the points where the radial lines intersect the MINOR circle, project thin lines parallel to the horizontal major axis.',
          'Step 6: The intersection points of corresponding horizontal and vertical projection rays lie on the true ellipse.',
          'Step 7: Using a French curve or flexible curve, draw a smooth, continuous HB curve through the 12 points. Ensure the curve is rounded and perpendicular at the four vertices A, B, C, D.'
        ],
        waecExaminerTip: 'Do NOT draw flat or pointed peaks at the ends of the major and minor axes. The ellipse must be strictly tangential to the circumscribing rectangle at all four vertices.',
        figureRef: 'Fig. 7.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 7.1',
        title: 'Concentric Circles Ellipse Construction (J.N. Green Fig. 8.4)',
        caption: 'Parametric generation of 12 ellipse loci via 30°/60° radial lines linking major and minor auxiliary circles, smoothly joined with a French curve.',
        imageUrl: '/assets/conic_sections_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 8, p. 129',
          'Major axis = 120mm, Minor axis = 80mm',
          'Parametric loci: x = a*cos(θ), y = b*sin(θ)',
          'All 2H projection rays preserved'
        ],
        dimensions: ['Major Axis 2a = 120mm', 'Minor Axis 2b = 80mm', 'Focal Distance 2c = 89.4mm'],
        svgType: 'conic',
        constructionGrade: 'HB Curve & 2H Aux Circles',
        textbookSource: 'J.N. Green Fig. 8.4 / Pickup & Parker Ex. 37a'
      },
      {
        figureNumber: 'Fig. 7.2',
        title: 'Parabola Construction by Rectangle / Tangent Method (J.N. Green Fig. 8.12)',
        caption: 'True parabolic trajectory generated within an enclosing rectangle (Span 120mm, Rise 60mm) with proportional division of base and height rays.',
        imageUrl: '/assets/conic_sections_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 8, p. 135',
          'Span = 120mm, Rise = 60mm, Eccentricity e = 1.0',
          'Directrix-Focus and enclosing rectangle methods',
          'Smooth French curve through all ray intersection nodes'
        ],
        dimensions: ['Span 2w = 120mm', 'Rise h = 60mm', 'Eccentricity e = 1.0'],
        svgType: 'parabola',
        constructionGrade: 'HB Curve & 2H Ray Grid',
        textbookSource: 'J.N. Green Fig. 8.12 / Pickup & Parker Ex. 38'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Eccentricity and the Focus-Directrix Definition',
        paragraphs: [
          `A conic section is formally defined as the locus of a point P moving such that the ratio of its distance from a fixed focus F to its perpendicular distance from a fixed directrix line DD is constant. This ratio is called the eccentricity e (refer to J.N. Green Chapter 8).`,
          `For an Ellipse, e < 1; for a Parabola, e = 1; for a Hyperbola, e > 1. In the ellipse, the sum of focal distances to any point on the perimeter is strictly constant and equals the major axis length: PF1 + PF2 = 2a.`
        ],
        mathematicalFormulation: 'e = Dist(P, F) / Dist(P, Directrix);   Ellipse: e < 1,   Parabola: e = 1,   Hyperbola: e > 1',
        engineeringImportance: 'Applied in Whispering gallery acoustics, elliptical pipe culverts, satellite dish reflectors, and cam timing mechanisms.',
        figureRef: 'Fig. 7.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Pointed Ends (Dimpling) along Major Axis Vertices',
        penalty: 'Deduction of 3 marks for defective curvature and un-smooth freehand blending.',
        avoidance: 'Use a French curve with at least three consecutive points aligned per pen stroke. The curve must cross the major axis at exactly 90°.'
      }
    ]
  },

  // 8. SECTIONAL VIEWS & ISO 128 HATCHING
  'sections': {
    title: 'Sectional Views and ISO 128 Hatching Conventions',
    historicalContext: `When internal mechanical assemblies contain intricate bores, counterbores, keyways, or fluid passages, standard orthographic hidden lines become cluttered and illegible. In J.N. Green's Technical Drawing (Chapter 11) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Chapter 11), sectional views are presented as the primary solution.

An imaginary cutting plane cuts through the component, removing the near portion to expose interior features. Cross-sections are highlighted with uniform hatching lines. British Standard BS 308 and ISO 128-50 dictate strict rules regarding what components are sectioned (solid shafts, bolts, nuts, rivets, and thin webs are never sectioned longitudinally).`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 11: Sectional Views',
        pages: 'pp. 185–194',
        figureRefs: ['Fig. 11.2 (Full Section)', 'Fig. 11.6 (Half Section)', 'Fig. 11.12 (Hatching of Adjacent Parts)', 'Fig. 11.18 (Webs and Shafts in Section)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B, NERDC SS3 Unit 3'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 11: Sectional Views and Conventions',
        pages: 'pp. 145–168',
        figureRefs: ['Worked Example 56 (Full Section of Flanged Coupling)', 'Worked Example 60 (Half Section of Pulley)'],
        syllabusRelevance: 'WAEC Paper 2 Machine Drawing Section B'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 56)',
        title: 'Draw Full Sectional Elevation of a Cast-Iron Flanged Coupling along Cutting Plane A-A',
        givenData: 'Orthographic front and end views of a flanged coupling with central shaft bore (Ø35mm), 4 bolt holes (Ø12mm on 110mm PCD), and 8mm web reinforcement.',
        constructionTheorem: 'In a full section, the cutting plane extends completely across the component. Solid shafts, bolts, and webs sliced longitudinally are shown in full elevation without hatching.',
        steps: [
          'Step 1: On the front elevation, draw the cutting plane line A-A using a thin chain line (ISO Type F) with thick 0.7mm ends and arrows indicating the direction of viewing.',
          'Step 2: Project vertical alignment rays to position the Sectional Elevation.',
          'Step 3: Draw all visible cut boundaries and internal bore edges with bold HB continuous lines (0.7mm).',
          'Step 4: Identify the webs: because the cutting plane passes along the longitudinal axis of the 8mm web, DO NOT HATCH THE WEB.',
          'Step 5: Using a 45° set square and 2H pencil (0.25mm), draw hatching lines across all solid metal regions that were physically severed.',
          'Step 6: Ensure hatching lines are spaced uniformly at 2mm to 3mm intervals. All hatching on the single coupling casting must run in the same direction.'
        ],
        waecExaminerTip: 'Hatching through a web or rib cut longitudinally is a major WAEC error that results in a 4-mark deduction. Always leave webs unhatched.',
        figureRef: 'Fig. 8.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 8.1',
        title: 'Full Sectional Elevation with ISO 128 Hatching (J.N. Green Fig. 11.2)',
        caption: 'Full section along cutting plane A-A showing uniform 45° hatching lines (2H pencil, 2.5mm spacing) on cut solid metal, leaving un-sectioned web and bore clear.',
        imageUrl: '/assets/sectioning_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 11, p. 187',
          'Hatching lines: Continuous Thin (ISO Type B, 0.25mm), 45° slope',
          'Spacing: Uniform 2.5mm across entire component',
          'Cutting plane A-A: Type F line with thick ends and viewing arrows'
        ],
        dimensions: ['Bore Ø = 35mm', 'Flange OD = 150mm', 'PCD = 110mm', 'Hatch Spacing = 2.5mm'],
        svgType: 'section',
        constructionGrade: 'ISO Sectional Blueprint',
        textbookSource: 'J.N. Green Fig. 11.2 / Pickup & Parker Ex. 56'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'ISO 128 Rules for Sectional Hatching and Excluded Components',
        paragraphs: [
          `Hatching indicates the solid material cut by the cutting plane. ISO 128-50 specifies that hatching lines must be continuous thin lines (0.25mm) drawn at a preferred angle of 45° to the principal outlines or axes of symmetry (refer to J.N. Green Chapter 11).`,
          `When two adjacent separate components meet in an assembly, their hatching lines must run in opposite directions (one at +45°, the other at -45°) or at different spacings to maintain visual distinction. Standard machine parts such as bolts, nuts, pins, keys, shafts, gear teeth, and thin webs are never hatched when cut longitudinally.`
        ],
        mathematicalFormulation: 'Hatch Angle = 45° ± axis orientation,   Spacing = 2.0mm - 3.5mm',
        engineeringImportance: 'Prevents misinterpretation of internal bores and voids in foundry castings, pressure vessels, and hydraulic pumps.',
        figureRef: 'Fig. 8.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Hatching through Shafts, Bolts, or Longitudinal Webs',
        penalty: 'Loss of 4 to 6 marks in WAEC Section B Machine Drawing.',
        avoidance: 'Memorize the exclusion list: shafts, keys, cotters, bolts, nuts, and ribs cut longitudinally are NEVER hatched.'
      }
    ]
  },

  // 9. SURFACE DEVELOPMENTS & INTERPENETRATION
  'development': {
    title: 'Surface Developments of Prisms, Cylinders, Pyramids, and Cones',
    historicalContext: `Surface development—the geometric unrolling or unfolding of a three-dimensional hollow solid onto a single flat plane—forms the theoretical core of sheet metal pattern drafting, boiler making, ductwork fabrication, and packaging design. In J.N. Green's Technical Drawing (Chapter 13) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 2, Chapter 2), surface developments are categorized into three primary methodologies:

1. Parallel-Line Development (for prisms and cylinders)
2. Radial-Line Development (for pyramids and right circular cones)
3. Triangulation Development (for transition pieces, hoppers, and oblique cones).

Every sheet metal pattern must incorporate the true length of all edges, accurate perimeter stretch-outs, and seam allowances for riveting, welding, or soldering.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 13: Surface Developments',
        pages: 'pp. 219–245',
        figureRefs: ['Fig. 13.4 (Truncated Cylinder Development)', 'Fig. 13.12 (Truncated Hexagonal Prism)', 'Fig. 13.20 (Right Cone Radial Development)', 'Fig. 13.31 (Square to Round Transition Piece)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A & B, NERDC SS3 Unit 4'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 2)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 2: Developments and Interpenetration',
        pages: 'pp. 25–60',
        figureRefs: ['Worked Example 12 (Truncated Cylinder Parallel Line)', 'Worked Example 16 (Conical Chute Radial Line)'],
        syllabusRelevance: 'WAEC Paper 2 Section A Question 4 / Section B'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 2, Ex. 12)',
        title: 'Develop the Complete Surface of a Truncated Cylinder (Base Ø = 60mm, Height = 90mm, Cut at 45° at mid-height)',
        givenData: 'Cylinder diameter D = 60mm, height H = 90mm, truncated by a cutting plane inclined at 45° passing through the axis at height 45mm.',
        constructionTheorem: 'The circumference of the cylinder unfolds into a straight baseline of length π × D = 3.1416 × 60 = 188.5mm. Vertical generator lines on the cylinder maintain their true lengths in the elevation view.',
        steps: [
          'Step 1: Draw the Elevation and Plan (circle of Ø60mm) of the truncated cylinder in orthographic projection.',
          'Step 2: Divide the plan circle into 12 equal sectors using 30°/60° set squares. Label the points 0, 1, 2, ..., 11.',
          'Step 3: Project these 12 points vertically upward onto the elevation to establish vertical generator lines.',
          'Step 4: Mark where each generator meets the 45° truncated cutting plane.',
          'Step 5: Calculate the stretch-out baseline: L = π × D = 188.5mm. Draw horizontal baseline extending from the base of the cylinder.',
          'Step 6: Divide baseline into 12 equal parts of length (188.5 / 12) = 15.7mm. Label them 0, 1, 2, ..., 11, 0 (seam point).',
          'Step 7: Project horizontal lines from the cut points on the elevation across to intersect the corresponding vertical generators on the stretch-out.',
          'Step 8: Join the resulting points with a smooth, continuous sinusoidal curve using a French curve and HB pencil.'
        ],
        waecExaminerTip: 'The stretchout baseline MUST equal π × D (188.5mm). Stepping off chord distances around the circle causes an cumulative shortening error of nearly 5mm, which loses 3 marks in WAEC grading.',
        figureRef: 'Fig. 9.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 9.1',
        title: 'Parallel-Line Surface Development of Truncated Cylinder (J.N. Green Fig. 13.4)',
        caption: 'Full parallel-line stretch-out of circumference (πD = 188.5mm) with 12 generator lines projected horizontally from the 45° truncated elevation.',
        imageUrl: '/assets/surface_development_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 13, p. 223',
          'Baseline length = π * D = 188.5mm',
          '12 generator divisions linked via horizontal projection rays',
          'Smooth sinusoidal curve traced with French curve'
        ],
        dimensions: ['Cylinder Ø = 60mm', 'Height = 90mm', 'Stretch-out L = 188.5mm', 'Cut Angle = 45°'],
        svgType: 'development',
        constructionGrade: 'HB Pattern Outline & 2H Generators',
        textbookSource: 'J.N. Green Fig. 13.4 / Pickup & Parker Ex. 12'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Stretch-Out Geometry and True Length Generators',
        paragraphs: [
          `In parallel-line development, the perimeter of the right section unfolds into a straight line called the stretch-out line. Because the generator lines of a right cylinder or prism are parallel to the vertical projection plane, their lengths shown in the front elevation are their True Lengths (TL) (refer to J.N. Green Chapter 13).`,
          `In radial-line development (for cones and pyramids), all generator lines radiate from a common apex. The stretch-out boundary forms an arc of radius equal to the True Slant Height S of the cone, subtending an angle θ = (R / S) * 360°, where R is the base radius.`
        ],
        mathematicalFormulation: 'Cylinder: L = π × D;   Cone Stretch-out Angle: θ = (R / S) × 360°',
        engineeringImportance: 'Directly drives automated CNC sheet metal laser cutting, HVAC duct manufacturing, and aerospace fuselage skin forming.',
        figureRef: 'Fig. 9.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using Apparent Length instead of True Slant Height for Cones',
        penalty: 'Completely distorted development pattern (loss of 8 marks).',
        avoidance: 'Always rotate the slant generator into the horizontal plane to obtain its true length before swinging the development arc.'
      }
    ]
  },

  // 10. THREADED FASTENERS & MACHINE DRAWING
  'fasteners': {
    title: 'ISO Metric Threaded Fasteners (Hexagonal Bolts and Nuts)',
    historicalContext: `Before the mid-19th century, screw threads were made by individual craftsmen with no standardization, making parts non-interchangeable. Sir Joseph Whitworth standardized the British Standard Whitworth (BSW) thread in 1841. This was subsequently codified into British Standard BS 308 and the international ISO 261 / ISO 965 metric thread standards.

In J.N. Green's Technical Drawing (Chapter 15) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Chapter 12), the proportions of standard hexagonal bolts and nuts are rigorously formulated in terms of nominal bolt diameter D. Draughtsmen must be able to construct standard bolts and nuts using standard empirical proportions (e.g. Width Across Flats W = 1.5D + 3mm or 1.73D, Nut Thickness T = 0.8D, Chamfer Angle = 30°) without consulting reference tables for every line.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 15: Fasteners and Screw Threads',
        pages: 'pp. 260–279',
        figureRefs: ['Fig. 15.4 (Hexagonal Bolt Proportions)', 'Fig. 15.9 (Nut Construction Across Flats & Corners)', 'Fig. 15.16 (Stud and Clearance Hole)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B (Machine Drawing), NERDC SS3 Unit 5'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 12: Screw Threads, Bolts and Nuts',
        pages: 'pp. 169–185',
        figureRefs: ['Worked Example 63 (Standard M24 Hex Bolt and Nut)', 'Worked Example 66 (Assembled Flange with Bolts)'],
        syllabusRelevance: 'WAEC Paper 2 Machine Drawing Compulsory Assembly'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Ex. 63)',
        title: 'Draw an ISO Metric M24 Hexagonal Bolt and Nut (Length L = 100mm, Threaded Length = 50mm)',
        givenData: 'Nominal diameter D = 24mm. Standard empirical proportions: Across Corners C = 2D = 48mm; Across Flats W = 1.73D ≈ 41.5mm; Nut Thickness T = 0.8D ≈ 19.2mm; Bolt Head Thickness H = 0.7D ≈ 16.8mm; Chamfer = 30°.',
        constructionTheorem: 'A standard bolt head shows 3 visible faces when viewed across corners, and 2 visible faces when viewed across flats. The chamfer arc radii are mathematically constructed to simulate hyperbolic intersections.',
        steps: [
          'Step 1: Draw horizontal axis of symmetry using thin chain line (ISO Type G).',
          'Step 2: Lay out bolt shank of diameter D = 24mm and length L = 100mm. Draw nominal thread crest lines (HB 0.7mm) and thread root lines (2H 0.25mm thin line, diameter = 0.85D = 20.4mm).',
          'Step 3: At the head end, lay out the bolt head of thickness H = 0.7D = 16.8mm and width across corners C = 2D = 48mm.',
          'Step 4: Divide width across corners into three faces: center face width = D = 24mm; two outer faces = 0.5D = 12mm each.',
          'Step 5: Strike the large central chamfer arc with radius R = D = 24mm. Strike the two smaller outer chamfer arcs with radius r = 0.4D ≈ 9.6mm.',
          'Step 6: Draw 30° chamfer lines tangentially from the top and bottom edges.',
          'Step 7: Draw the M24 nut of thickness T = 0.8D = 19.2mm on the threaded shank using identical chamfer radii.'
        ],
        waecExaminerTip: 'In assembly drawings, show the bolt threaded end projecting 2 to 3 thread pitches beyond the nut face. Never leave the bolt flush with or recessed inside the nut.',
        figureRef: 'Fig. 10.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 10.1',
        title: 'Standard M24 Hexagonal Bolt & Nut Proportions (Pickup & Parker Ex. 63)',
        caption: 'Detailed dimensioned layout of standard metric hex bolt and nut showing across-corners 3-face chamfer arcs (R = D, r = 0.4D) and ISO thread conventions.',
        imageUrl: '/assets/actual_fastener_drawing.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 1, p. 172',
          'Nominal Diameter D = 24mm',
          'Bolt head thickness H = 0.7D; Nut thickness T = 0.8D',
          'Thread root line: 2H thin continuous line at 0.85D'
        ],
        dimensions: ['D = 24mm', 'Length = 100mm', 'Nut T = 19.2mm', 'Head H = 16.8mm', 'Chamfer = 30°'],
        svgType: 'fastener',
        constructionGrade: 'ISO Machine Blueprint',
        textbookSource: 'Pickup & Parker Vol. 1, Ex. 63'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Standard Metric Proportions and Chamfer Geometry',
        paragraphs: [
          `In technical drawing examinations and industrial detailing, draughtsmen use standard empirical approximations for hexagonal fasteners to maintain drafting speed without looking up ISO tables (refer to J.N. Green Chapter 15).`,
          `The 30° chamfer machined onto bolt heads and nuts prevents sharp burrs from injuring mechanics. The intersection of this 30° conical chamfer with the flat hexagonal prism faces generates true hyperbolic curves. On technical drawings, these hyperbolas are conventionally approximated by circular arcs of radius R = D (for the center face) and r = 0.4D (for the outer faces).`
        ],
        mathematicalFormulation: 'W ≈ 1.73D,   C = 2D,   H = 0.7D,   T = 0.8D,   R_chamfer = D',
        engineeringImportance: 'Standardizes mechanical fastening across millions of automotive, aerospace, and civil engineering assemblies.',
        figureRef: 'Fig. 10.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing Thread Roots with Thick Lines (HB) instead of Thin Lines (2H)',
        penalty: 'Deduction of 2 marks for non-compliance with ISO 128 thread convention.',
        avoidance: 'Thread crests are thick (0.7mm HB); thread roots are thin (0.25mm 2H) and terminate 2mm before the runout.'
      }
    ]
  },

  // 11. BUILDING DRAWING: STRIP FOUNDATION, WALL & ROOF TRUSS
  'building': {
    title: 'Building Construction Drawing (Foundations, Walls, and Detailing)',
    historicalContext: `Building drawing constitutes one of the two major specialized options in the WAEC Technical Drawing syllabus (Paper 2 Section B: Building Option). In J.N. Green's Technical Drawing (Chapter 16) and standard civil engineering practice, building drawing translates architectural designs into constructible working drawings.

Students must understand tropical building construction conventions widely practiced in West Africa: mass concrete strip foundations (typically 600mm × 225mm), 225mm (9-inch) or 150mm (6-inch) sandcrete blockwalls, bituminous damp-proof courses (D.P.C.), concrete floor slabs on compacted hardcore, reinforced concrete lintels, wall plates, and timber roof trusses (such as King Post or Queen Post trusses).`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 16: Building Drawing',
        pages: 'pp. 280–310',
        figureRefs: ['Fig. 16.4 (Section through Strip Foundation)', 'Fig. 16.12 (Detailed Wall Section from Foundation to Eaves)', 'Fig. 16.22 (King Post Timber Roof Truss)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B (Building Option, 40 Marks)'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 2)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 6: Architectural and Civil Detailing',
        pages: 'pp. 110–135',
        figureRefs: ['Worked Example 42 (Sectional Elevation of Domestic Dwelling)'],
        syllabusRelevance: 'G.C.E. Advanced Level Building Construction & WAEC Paper 2'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green, Chapter 16, Fig. 16.12)',
        title: 'Draw a Detailed Vertical Section through a Strip Foundation and External Wall to Eaves (Scale 1:20)',
        givenData: 'Strip foundation footing 600mm × 225mm at 900mm below ground level. Sandcrete blockwall 225mm thick. D.P.C. at 150mm above ground level. Concrete floor slab 100mm on 150mm hardcore. Wall height 3000mm to ceiling. Timber wall plate 100mm × 75mm. Rafter 100mm × 50mm.',
        constructionTheorem: 'A vertical section through an external building wall reveals the sub-structure (foundation, footing, trench, earth backfill) and super-structure (wall, floor slab, lintel, wall plate, roof truss). Standard architectural hatching symbols represent concrete, earth, sandcrete blocks, and timber.',
        steps: [
          'Step 1: Set out scale 1:20 (each 1000mm in reality = 50mm on drawing sheet).',
          'Step 2: Draw the Ground Line (G.L.) and establish foundation trench depth 900mm below G.L.',
          'Step 3: Draw the concrete strip foundation footing 600mm wide × 225mm thick. Fill with standard concrete symbol (triangles and dots).',
          'Step 4: Erect the 225mm sandcrete blockwall centrally on the footing (projection = (600 - 225)/2 = 187.5mm on each side).',
          'Step 5: At 150mm above G.L., draw the Damp-Proof Course (D.P.C.) as a heavy, thick black line across the wall width.',
          'Step 6: Draw the floor construction: 150mm compacted hardcore, 50mm sand blinding, 100mm concrete floor slab, and 25mm cement-sand screed.',
          'Step 7: Continue the 225mm blockwall up to ceiling level (3000mm). Draw the 100mm × 75mm timber wall plate anchored on top.',
          'Step 8: Draw the 100mm × 50mm timber rafter at 30° pitch with 600mm eaves overhang, fascia board, and corrugated aluminum roofing sheet.'
        ],
        waecExaminerTip: 'Always show the D.P.C. at 150mm above ground level! Omitting the D.P.C. or placing it below ground level is an immediate 3-mark penalty in WAEC Paper 2 Building Option.',
        figureRef: 'Fig. 11.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 11.1',
        title: 'Detailed Section through Foundation and External Wall (J.N. Green Fig. 16.12)',
        caption: 'Standard WAEC architectural section showing 600×225 concrete footing, 225 blockwall, D.P.C., hardcore, floor slab, and timber roof plate with ISO material hatching symbols.',
        imageUrl: '/assets/actual_building_foundation.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 16, p. 292',
          'Scale: 1:20 or 1:10',
          'Footing: 600mm × 225mm (1:3:6 concrete mix)',
          'D.P.C. strictly at 150mm above Ground Level',
          'Wall: 225mm sandcrete blocks with mortar joints'
        ],
        dimensions: ['Footing = 600×225mm', 'Trench Depth = 900mm', 'Wall = 225mm', 'DPC = +150mm G.L.', 'Slab = 100mm'],
        svgType: 'building',
        constructionGrade: 'Architectural Working Drawing',
        textbookSource: 'J.N. Green Fig. 16.12'
      },
      {
        figureNumber: 'Fig. 11.2',
        title: 'King Post Timber Roof Truss Assembly (J.N. Green Fig. 16.22)',
        caption: 'Full triangulated roof truss elevation (6.0m span, 30° pitch) detailing tie beam, principal rafters, king post tension hanger, struts, and wall plate seating.',
        imageUrl: '/assets/actual_building_foundation.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 16, p. 302',
          'Span: 6.0m clear between 225mm blockwalls',
          '30° pitch with 600mm eaves overhang',
          'Tie beam in tension; king post suspends tie beam center'
        ],
        dimensions: ['Span = 6000mm', 'Pitch = 30°', 'Tie Beam = 150×50mm', 'King Post = 100×75mm'],
        svgType: 'roof-truss',
        constructionGrade: 'Structural Timber Detail',
        textbookSource: 'J.N. Green Fig. 16.22 / Pickup & Parker Vol. 2 Ex. 42'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Structural Load Paths and Sub-structure Equilibrium',
        paragraphs: [
          `In civil and architectural drafting, the strip foundation spreads the concentrated vertical dead and live loads of the roof, floor, and masonry walls over an area of subsoil large enough to prevent shear failure or differential settlement (refer to J.N. Green Chapter 16).`,
          `The projection of the concrete footing on either side of the wall must equal at least half the wall thickness to avoid 45° shear cracking. The Damp-Proof Course (D.P.C.) forms an impermeable barrier against capillary action (rising damp) that causes paint peeling and mortar degradation in tropical climates.`
        ],
        mathematicalFormulation: 'Footing Width B ≥ (Total Load W) / (Safe Soil Bearing Capacity q_s);   B_min = 2t + w = 600mm',
        engineeringImportance: 'Guarantees structural longevity, soil load distribution, and moisture protection for residential and commercial buildings.',
        figureRef: 'Fig. 11.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Omitting Architectural Material Hatching (Concrete, Hardcore, Earth)',
        penalty: 'Loss of 5 marks for defective drafting conventions in WAEC Building Option.',
        avoidance: 'Use standard architectural symbols: triangles + stippling for concrete; irregular angular shapes for hardcore; 45° short hatching for earth.'
      }
    ]
  },

  // 12. DRAWING INSTRUMENTS & BOARD SETUP
  'instruments': {
    title: 'Technical Drawing Instruments, Equipment, and Sheet Layout',
    historicalContext: `Every successful technical drawing begins with meticulous instrument preparation and sheet layout. In J.N. Green's Technical Drawing (Chapter 1) and Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1, Introduction), drawing office practice is presented as an exact discipline.

A professional draftsman treats instruments with surgical care. The drawing board working edge must be checked for straightness; the T-square stock must remain firmly pressed against the left board edge; compass points must be set to equal needle and lead lengths; and pencils must be sharpened to appropriate points (conical for HB outlines, chisel for 2H straight lines). Sheet layout conforms to ISO 216 paper sizes (A4, A3, A2, A1) with standard 10mm borders and 70mm × 30mm title blocks.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 1: Equipment and Drawing Office Practice',
        pages: 'pp. 1–13',
        figureRefs: ['Fig. 1.2 (Board & T-Square Setup)', 'Fig. 1.6 (Sharpening Pencils)', 'Fig. 1.10 (Standard Sheet Layout & Title Block)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Foundation, NERDC SS1 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Introduction: Drawing Equipment and Techniques',
        pages: 'pp. i–viii',
        figureRefs: ['Fig. 1 (Drafting Instruments Set)', 'Fig. 2 (BS 308 Line Thickness Hierarchy)'],
        syllabusRelevance: 'Foundation of all Technical Drawing & Engineering Graphics'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green, Chapter 1, Fig. 1.10)',
        title: 'Mount an A3 Drawing Sheet and Construct an ISO Compliant Border and Title Block',
        givenData: 'A3 cartridge paper (420mm × 297mm). Margins: 10mm top, right, bottom; 20mm left margin for binding. Title block: 70mm × 30mm.',
        constructionTheorem: 'Proper mounting ensures all horizontal lines drawn with the T-square are strictly parallel to the sheet edges. The title block provides legally binding metadata.',
        steps: [
          'Step 1: Place drawing sheet 20mm in from the left working edge of the board. Align top edge of paper with the working edge of the T-square blade.',
          'Step 2: Hold paper taut and secure all four corners with drafting tape placed diagonally across corners.',
          'Step 3: Measure 20mm from left edge (filing margin) and 10mm from top, right, and bottom edges. Draw border line with firm HB pencil (0.7mm).',
          'Step 4: At the bottom right corner, lay out the 70mm × 30mm title block.',
          'Step 5: Divide title block into rows: Name, School/Class, Date, Scale, Title, and Projection Symbol.',
          'Step 6: Using 2H guide lines spaced 3.5mm apart, print all text in single-stroke uppercase Gothic lettering.'
        ],
        waecExaminerTip: 'Title block lettering must be strictly uppercase Gothic between 2H guidelines. Lowercase or freehand slurred script loses 3 marks.',
        figureRef: 'Fig. 12.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 12.1',
        title: 'Drawing Board Setup & Standard Title Block (J.N. Green Fig. 1.10)',
        caption: 'A3 sheet alignment using T-square against left hardwood guide edge, with 20mm filing margin, 10mm border, and standard 70x30mm title block.',
        imageUrl: '/assets/actual_drafting_instruments.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 1, p. 8',
          'A3 dimensions: 420mm × 297mm',
          'Filing margin = 20mm, standard borders = 10mm',
          'Single-stroke uppercase Gothic lettering complying with ISO 3098'
        ],
        dimensions: ['Sheet: 420×297mm', 'Border: 10mm/20mm', 'Title Block: 70×30mm'],
        svgType: 'instruments',
        constructionGrade: 'Drafting Office Standard',
        textbookSource: 'J.N. Green Fig. 1.10'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Ergonomics of Precision Line Construction',
        paragraphs: [
          `Accurate technical drawing is impossible without disciplined instrument maintenance. The T-square head must never be used along the top, bottom, or right edges of the board—it is designed exclusively for the left working edge (for right-handed draftsmen) (refer to J.N. Green Chapter 1).`,
          `All vertical lines must be drawn using a set square resting firmly on the top edge of the T-square blade. Rotating the pencil slightly while drawing straight lines maintains a uniform conical point, preventing line width variation.`
        ],
        mathematicalFormulation: 'Contrast Ratio = Thickness(HB) / Thickness(2H) ≥ 2.0;   0.70mm : 0.35mm',
        engineeringImportance: 'Guarantees dimensional repeatability and microfilming legibility across engineering and architectural drawings.',
        figureRef: 'Fig. 12.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using the T-Square as a Straightedge to Draw Vertical or Slanted Lines',
        penalty: 'Loss of 2 marks for improper drafting technique.',
        avoidance: 'The T-square is ONLY for horizontal lines. All vertical and slanted lines must be drawn with set-squares resting on the T-square.'
      }
    ]
  }
};

// Merge extended curriculum domains for comprehensive coverage across all classes
Object.entries(curriculumReferenceExtensions).forEach(([key, ext]) => {
  if (textbookCurriculumDatabase[key]) {
    Object.assign(textbookCurriculumDatabase[key], ext);
  } else {
    textbookCurriculumDatabase[key] = ext as TextbookChapter;
  }
});

