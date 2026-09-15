import { TextbookChapter } from '../types/textbook';

export const curriculumReferenceExtensions: Record<string, Partial<TextbookChapter>> = {
  // 1. INTRODUCTION TO TECHNICAL DRAWING & BRANCHES
  'intro-drawing': {
    title: 'Introduction to Technical Drawing, Branches & Studio Environment',
    historicalContext: `Technical drawing is the universal graphic language used by engineers, architects, and industrial designers to convey physical ideas with mathematical precision. Unlike artistic sketching, which expresses emotion and subjective perception, technical drawing is governed by international standards (ISO, BS, NERDC, WAEC) to ensure that a drawing prepared in Lagos, London, or Tokyo can be interpreted and manufactured without ambiguity.

As codified by J.N. Green (Technical Drawing for School Certificate & G.C.E., Chapter 1) and F. Pickup & M.A. Parker (Engineering Drawing with Worked Examples, Introduction), the four primary branches of technical drawing are:
1. Mechanical Engineering Drawing (machine elements, fasteners, assemblies, kinematics)
2. Civil & Structural Engineering Drawing (bridges, dams, structural steelwork, reinforced concrete)
3. Architectural & Building Drawing (floor plans, building sections, roof trusses, plumbing)
4. Electrical & Electronics Graphics (circuit schematics, wiring layouts, PCB artwork).`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 1: Equipment and Drawing Office Practice',
        pages: 'pp. 1–13',
        figureRefs: ['Fig. 1.1 (The Scope of Technical Graphics)', 'Fig. 1.2 (Drawing Studio Layout)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Foundation, NERDC SS1 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Introduction: The Language of Engineering',
        pages: 'pp. i–viii',
        figureRefs: ['Plate 1 (Engineering Disciplines & Standards)', 'Plate 2 (BS 308 / ISO Conventions)'],
        syllabusRelevance: 'National Technical Certificate & City and Guilds Engineering Graphics'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Chapter 1)',
        title: 'Establish a Professional Drawing Workstation and Classify Drawing Types',
        givenData: 'Standard drawing board, A3 drawing sheet, T-square, 30°/60° and 45° set squares, drafting tape, 2H and HB pencils.',
        constructionTheorem: 'Technical drawings must follow strict orthogonal projection and line contrast rules to ensure unambiguous manufacturing.',
        steps: [
          'Step 1: Inspect the drawing board. Ensure the left working edge (ebony edge) is perfectly straight and free of nicks.',
          'Step 2: Position the drawing sheet 20mm from the left edge and bottom edge to allow unrestricted T-square movement.',
          'Step 3: Secure the sheet using drafting tape strips placed diagonally across all four corners.',
          'Step 4: Categorize the project requirements into Mechanical, Civil, Architectural, or Electrical drawing types.'
        ],
        waecExaminerTip: 'Always cite standard ISO/NERDC conventions when explaining the difference between pictorial sketches and orthographic projections.',
        figureRef: 'Fig. 0.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 0.1',
        title: 'The Four Main Branches of Technical Drawing (J.N. Green Fig. 1.1)',
        caption: 'Classification of technical graphics into Mechanical, Building, Civil, and Electrical disciplines with standardized drawing sheet hierarchy.',
        imageUrl: '/assets/african_students_technical_drawing.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 1, p. 2',
          'Standard paper sizes: ISO 216 series (A0 = 1m², A1, A2, A3 = 420x297mm, A4 = 297x210mm)',
          'All drawings must include a standardized title block (ISO 7200)'
        ],
        dimensions: ['Sheet: A3 (420×297mm)', 'Filing Margin: 20mm', 'Border: 10mm'],
        svgType: 'instruments',
        constructionGrade: 'Foundational Knowledge',
        textbookSource: 'J.N. Green Fig. 1.1'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Universal Graphic Language of Engineering',
        paragraphs: [
          'Technical drawing operates as a precise graphic grammar. A single line type, whether continuous thick, dashed thin, or long chain, conveys universally understood physical attributes: visible edges, hidden contours, or symmetrical axes.',
          'Under the Nigerian NERDC curriculum and West African WAEC specifications, students must develop proficiency in both manual drafting instrument techniques and computer-aided drafting (CAD) concepts.'
        ],
        mathematicalFormulation: 'Aspect Ratio (ISO 216) = 1 : √2 ≈ 1 : 1.4142;   Length / Width = √2',
        engineeringImportance: 'Guarantees that drawings scaled between A4, A3, and A2 retain exact geometric proportions without distortion.',
        figureRef: 'Fig. 0.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Confusing Freehand Artistic Sketching with Engineering Technical Drawing',
        penalty: 'Heavy deductions (up to 70%) for freehand drawings where instrument construction is required.',
        avoidance: 'Always use the T-square, set squares, and compasses for all lines and arcs unless freehand sketching is explicitly requested.'
      }
    ]
  },

  // 2. BOARD PRACTICE: PAPER FIXING, BORDERLINES & TITLE BLOCK
  'board-practice': {
    title: 'Board Practice: Sheet Mounting, Borderlines & Title Block Layout',
    historicalContext: `A drawing cannot be accurate if the paper moves, buckles, or is mounted out of square with the drawing board. As described by J.N. Green (Chapter 1, pp. 6–11), board practice encompasses the physical rituals of sheet preparation: squaring the paper against the T-square blade, securing corners with drafting tape, establishing borderlines, and constructing the legal metadata container known as the title block.

The title block (standardized by ISO 7200 and BS 308) contains indispensable legal and technical information: the drawing title, scale, projection angle symbol (First Angle or Third Angle), draftsman name, date, drawing number, and revision index.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 1: Equipment and Drawing Office Practice',
        pages: 'pp. 6–11',
        figureRefs: ['Fig. 1.5 (T-Square and Board Practice)', 'Fig. 1.10 (Standard Title Block)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Foundation, NERDC SS1 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Introduction: Drawing Equipment and Techniques',
        pages: 'pp. iii–vi',
        figureRefs: ['Plate 1 (Board Setup and Tape Fixing)'],
        syllabusRelevance: 'General Engineering Drawing Practice'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 1.10)',
        title: 'Mount an A3 Cartridge Sheet and Construct an ISO 7200 Title Block',
        givenData: 'A3 sheet (420mm × 297mm). Left margin 20mm (binding), top/bottom/right margins 10mm. Title block: 70mm × 30mm.',
        constructionTheorem: 'All horizontal lines must be drawn solely with the T-square pressed against the true working edge of the board.',
        steps: [
          'Step 1: Place the A3 sheet roughly centered, 20mm from the left edge. Rest the T-square on the left edge and slide it up until the blade aligns with the top paper edge.',
          'Step 2: Holding the paper flat and aligned with the T-square, apply drafting tape across the top-left and top-right corners at 45° angles.',
          'Step 3: Smooth the paper downward and tape the bottom two corners.',
          'Step 4: Using a 2H pencil and scale rule, measure 20mm from the left edge and 10mm from the other three edges.',
          'Step 5: Draw the border line firmly with an HB pencil (0.7mm line weight).',
          'Step 6: In the bottom right corner, construct a 70mm × 30mm title block divided into rows for Name, Title, Date, Scale, and Projection Symbol.'
        ],
        waecExaminerTip: 'In WAEC examinations, 4 marks are allotted specifically for neat borderlines and an accurately laid out title block.',
        figureRef: 'Fig. 1.10'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 1.10',
        title: 'Drawing Sheet Mounting & Standard Title Block (J.N. Green Fig. 1.10)',
        caption: 'Proper sheet orientation, corner taping, 20mm binding margin, 10mm border, and standard 70x30mm title block layout.',
        imageUrl: '/assets/lines_lettering_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 1, p. 8',
          'Border thickness: 0.70mm continuous thick (HB)',
          'Title block guidelines: 2H faint lines spaced 3.5mm apart',
          'All text uppercase single-stroke Gothic'
        ],
        dimensions: ['Sheet: 420×297mm', 'Border: 10mm/20mm', 'Title Block: 70×30mm'],
        svgType: 'instruments',
        constructionGrade: 'Studio Setup Standard',
        textbookSource: 'J.N. Green Fig. 1.10'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Kinematics of the T-Square and Drawing Board',
        paragraphs: [
          'The drawing board provides a rigid datum surface. The left edge, usually made of inlaid ebony or seasoned hardwood, forms the primary guide rail.',
          'The T-square stock must be firmly held against this guide edge with the left hand while the right hand draws lines along the top edge of the blade from left to right. Never draw lines along the lower edge of the T-square blade.'
        ],
        mathematicalFormulation: 'Parallelism Error = L · sin(θ) ≤ 0.2mm for L = 420mm',
        engineeringImportance: 'Prevents angular skew across large sheets and ensures perpendicularity when set squares are seated on the T-square.',
        figureRef: 'Fig. 1.10'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using Drawing Pins Instead of Drafting Tape',
        penalty: 'Loss of neatness marks; damaged board surface and perforated sheet.',
        avoidance: 'Always use drafting tape or masking tape cut into 30mm strips placed diagonally across the paper corners.'
      }
    ]
  },

  // 3. TYPES OF LINES & LINE CONVENTIONS (ISO 128)
  'lines': {
    title: 'Types of Lines & Line Conventions (ISO Standards)',
    historicalContext: `In technical drafting, every line carries a distinct meaning based on its thickness, pattern, and density. As articulated by J.N. Green (Chapter 1) and Pickup & Parker (Vol. 1, Plate 2), the British Standard BS 308 and International Standard ISO 128 classify lines into standardized types to eliminate misinterpretation.

The fundamental contrast ratio in manual drafting is 2:1. Thick lines (0.7mm or 0.5mm, drawn with an HB or F pencil) are reserved for visible outlines. Thin lines (0.35mm or 0.25mm, drawn with a sharp 2H pencil) are used for all construction arcs, projection rays, dimension lines, and hatching.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 1: Equipment and Drawing Office Practice',
        pages: 'pp. 8–10',
        figureRefs: ['Fig. 1.7 (Standard Line Conventions)', 'Fig. 1.8 (Application of Line Types)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Introduction: Drawing Equipment',
        pages: 'pp. vi–viii',
        figureRefs: ['Plate 2 (BS 308 Hierarchy of Line Thicknesses)'],
        syllabusRelevance: 'Mandatory Technical Drawing Standard'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 1, Plate 2)',
        title: 'Draw the Standard Line Weight Hierarchy Specimen Sheet',
        givenData: 'A3 sheet, 2H pencil, HB pencil, technical drafting pens (0.25mm, 0.50mm, 0.70mm).',
        constructionTheorem: 'Line contrast must be stark and uniform. Thin lines must be approximately half the thickness of thick lines.',
        steps: [
          'Step 1: Type A — Continuous Thick (0.7mm, HB): Draw visible outlines and boundary borders.',
          'Step 2: Type B — Continuous Thin (0.25mm, 2H): Draw dimension lines, extension lines, and construction arcs.',
          'Step 3: Type E — Dashed Thin (0.25mm, 2H): Draw hidden edges with 3mm dashes and 1mm spaces.',
          'Step 4: Type G — Chain Thin (0.25mm, 2H): Draw centerlines with long dashes (15mm), a 1mm space, a short dot/dash (2mm), and a 1mm space.',
          'Step 5: Type F — Thin Chain with Thick Ends (0.25mm with 0.7mm ends): Draw cutting planes for section views.'
        ],
        waecExaminerTip: 'Examiners deduct 1 mark for every hidden detail line where dashes do not meet a solid line at an intersection.',
        figureRef: 'Fig. 1.7'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 1.7',
        title: 'Standard Line Conventions Table (ISO 128 / BS 308)',
        caption: 'Specimen lines demonstrating continuous thick, continuous thin, hidden dashed, centerline chain, and cutting plane lines with specific pencil grades.',
        imageUrl: '/assets/lines_lettering_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 1, p. 9',
          'Thick: 0.50–0.70mm (HB pencil, conical point)',
          'Thin: 0.25–0.35mm (2H pencil, sharp chisel point)',
          'Dash length: 3mm uniform with 1mm spacing'
        ],
        dimensions: ['Thick = 0.7mm', 'Thin = 0.25mm', 'Dash = 3mm', 'Space = 1mm'],
        svgType: 'lines',
        constructionGrade: 'ISO 128 Standard',
        textbookSource: 'J.N. Green Fig. 1.7 / Pickup & Parker Plate 2'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Optical Density and Thickness Contrast Principle',
        paragraphs: [
          'Microfilming and digital scanning standards require all graphite lines to possess high optical opacity. A thin line must NOT be a faint, grey smudge; it must be a dense, crisp, black line of narrow width (0.25mm).',
          'This is achieved by maintaining a finely sharpened conical or chisel point with a 2H pencil, applying moderate, uniform pressure, and rotating the pencil slightly as it traverses the straightedge.'
        ],
        mathematicalFormulation: 'ISO 128 Thickness Progression: 0.18, 0.25, 0.35, 0.50, 0.70, 1.0, 1.4 mm  (r = √2)',
        engineeringImportance: 'Ensures legibility when drawings are reduced by 50% from A3 to A4 for workshop distribution.',
        figureRef: 'Fig. 1.7'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing Centerlines that Terminate Exactly at the Circle Circumference',
        penalty: 'Loss of 1 mark for incorrect centerline drafting convention.',
        avoidance: 'Centerlines must always extend 3mm to 5mm beyond the outline of the feature or circle they define.'
      }
    ]
  },

  // 4. LETTERING & ENGINEERING NUMBERING (ISO 3098)
  'lettering': {
    title: 'Single-Stroke Lettering & Engineering Numbering (ISO Standards)',
    historicalContext: `Lettering on a technical drawing provides dimensions, specifications, material notes, and title block data. In engineering graphics, all freehand writing is strictly replaced by single-stroke uppercase Gothic lettering, standardized under ISO 3098 and BS 308.

As emphasized by J.N. Green (Chapter 1, pp. 10–12), poor lettering can ruin an otherwise brilliant drawing. A 6 that looks like a 0 or a 3 that looks like an 8 can cause catastrophic manufacturing errors in the machine shop. Single-stroke lettering is executed between 2H guidelines without serifs or flourishes, maintaining consistent stroke thickness and proportional character widths.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 1: Equipment and Drawing Office Practice',
        pages: 'pp. 10–12',
        figureRefs: ['Fig. 1.9 (Single-Stroke Uppercase Letters and Numerals)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Introduction: Drawing Equipment',
        pages: 'pp. v–vii',
        figureRefs: ['Plate 1 (Gothic Lettering Grid)'],
        syllabusRelevance: 'Engineering Office Lettering Practice'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 1.9)',
        title: 'Inscribe Single-Stroke Uppercase Gothic Alphabet and Numerals (3.5mm and 5mm Height)',
        givenData: 'A3 sheet, 2H pencil for guidelines, H or HB pencil for characters, scale rule.',
        constructionTheorem: 'All characters must touch the top and bottom guidelines exactly, maintaining uniform 75° inclination or 90° verticality.',
        steps: [
          'Step 1: Using a 2H pencil, draw parallel horizontal guidelines spaced exactly 5mm apart for major headings, and 3.5mm apart for sub-headings and dimensions.',
          'Step 2: Print letters A through Z using single, unhesitating strokes. Ensure circular letters (O, Q, C, G) are true ellipses or circles.',
          'Step 3: Print numerals 0 through 9. Distinguish clearly between 1 and 7, 3 and 8, 5 and 6.',
          'Step 4: Maintain uniform word spacing equal to the width of the letter M.'
        ],
        waecExaminerTip: 'Never use lowercase or cursive script anywhere on a technical drawing unless required by standard mathematical symbols.',
        figureRef: 'Fig. 1.9'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 1.9',
        title: 'Single-Stroke Uppercase Gothic Lettering & Numerals (ISO 3098)',
        caption: 'Full alphabet A to Z and numbers 0 to 9 inscribed between 2H guidelines demonstrating stroke order, character spacing, and aspect ratios.',
        imageUrl: '/assets/lines_lettering_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 1, p. 11',
          'Standard character heights: 2.5mm, 3.5mm, 5.0mm, 7.0mm',
          'Stroke weight: 0.35mm (H pencil with conical point)',
          'Guideline pencil grade: 2H strictly'
        ],
        dimensions: ['Height h = 3.5mm / 5.0mm', 'Character Spacing = 2/10 h', 'Word Spacing = 6/10 h'],
        svgType: 'lettering',
        constructionGrade: 'ISO 3098 Standard',
        textbookSource: 'J.N. Green Fig. 1.9'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Character Aspect Ratios and Stroke Order Dynamics',
        paragraphs: [
          'Under ISO 3098, letters are grouped into narrow (I, J, L), normal (A, B, C, D, E, F, H, K, N, P, R, S, T, U, V, X, Y, Z), and wide characters (M, W).',
          'Vertical strokes are drawn downwards; horizontal strokes are drawn from left to right. Curved strokes are split into two symmetric sweeps meeting at the lowest point.'
        ],
        mathematicalFormulation: 'Stroke Thickness d = 0.1h;   Space between characters a = 0.2h;   Space between words e = 0.6h',
        engineeringImportance: 'Ensures automated optical character recognition (OCR) and high legibility on scanned engineering drawings.',
        figureRef: 'Fig. 1.9'
      }
    ],
    examinerTraps: [
      {
        trap: 'Freehand Lettering without Drawing Guidelines',
        penalty: 'Loss of 3 marks for wavy, irregular lettering in WAEC Paper 2.',
        avoidance: 'Always draw faint 2H guidelines before inscribing any text or title block content.'
      }
    ]
  },

  // 5. CONSTRUCTION OF STANDARD ANGLES (60, 90, 45, 75, 105, 120, 135, 150)
  'angles': {
    title: 'Construction of Standard Angles (60°, 90°, 45°, 75°, 105°, 120°, 135°, 150°)',
    historicalContext: `In Euclidean geometric drafting, angles of 60°, 90°, 120° and their bisections and combinations (30°, 45°, 75°, 105°, 135°, 150°) are constructed purely using a straightedge and a pair of compasses without reference to a protractor. As codified by J.N. Green (Chapter 2, pp. 18–22) and Pickup & Parker (Vol. 1, Ex. 2 & 3), these constructions form the absolute bedrock of plane geometry.

The 60° angle is naturally generated by the chord of an arc equal to its radius (since an equilateral triangle has three 60° internal angles). The 90° angle is erected by constructing two consecutive 60° arcs (total 120°) and bisecting the second 60° interval. Combining and bisecting these base angles yields any multiple of 15°.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 2: Construction of Angles',
        pages: 'pp. 18–22',
        figureRefs: ['Fig. 2.9 (Angle of 60° and 120°)', 'Fig. 2.11 (Erecting a 90° Angle)', 'Fig. 2.14 (Angle of 75° and 105°)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 1: Plane Geometry',
        pages: 'pp. 4–8',
        figureRefs: ['Worked Example 2 (Constructing 60° and 30°)', 'Worked Example 3 (Constructing 75° and 105°)'],
        syllabusRelevance: 'Essential Plane Geometry Foundations'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 2.14)',
        title: 'Construct an Angle of 75° at Point A on Line AB without a Protractor',
        givenData: 'A straight line AB with designated vertex point A.',
        constructionTheorem: '75° is constructed as 60° + 15° (the bisection of the 30° interval between 60° and 90°).',
        steps: [
          'Step 1: With vertex A as center and any convenient radius (e.g. 50mm), swing a large semi-circular arc cutting line AB at point C.',
          'Step 2: With center C and the same radius, step off arc D (60°).',
          'Step 3: With center D and the same radius, step off arc E (120°).',
          'Step 4: With centers D and E, strike intersecting arcs to locate point F. Draw ray AF. Angle FAB = 90° and cuts the main arc at G.',
          'Step 5: The arc segment DG represents the 30° difference between 60° and 90°.',
          'Step 6: Bisect arc DG by swinging equal arcs from D and G to intersect at H. Draw ray AH. Angle HAB = 60° + 15° = 75°.',
          'Step 7: Trace ray AH with an HB pencil to complete the finished outline.'
        ],
        waecExaminerTip: 'Never use a protractor in WAEC Section A! Examiners check for visible 2H compass intersection arcs at D, E, F, and H. Using a protractor results in zero marks.',
        figureRef: 'Fig. 2.14'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 2.14',
        title: 'Compass Construction of Standard Angles (60°, 90°, 75°, 105°) (J.N. Green Fig. 2.14)',
        caption: 'Geometric compass chord progression establishing 60°, 90°, and the 15° bisection interval yielding a true 75° angle with all 2H construction arcs intact.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 2, p. 21',
          'Compass radius maintained constant for base 60° stepping',
          '90° perpendicular erected via conjugate arcs from 60° and 120° nodes',
          'All arc intersections marked with sharp, unblurred nodes'
        ],
        dimensions: ['Arc Radius = 50mm', 'Angle = 75.0°', 'Tolerance = ±0.25°'],
        svgType: 'angles',
        constructionGrade: '2H Construction & HB Ray',
        textbookSource: 'J.N. Green Fig. 2.14 / Pickup & Parker Ex. 3'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Chord Geometry and Subtended Angle Arithmetic',
        paragraphs: [
          'In any circle, equal chords subtend equal angles at the center. Because an arc of radius r has a chord of length r subtending an angle of 2*arcsin(r/(2r)) = 2*arcsin(0.5) = 60°, the first compass step on an arc from the baseline produces a 60° angle with zero mathematical error.',
          'Subsequent bisections halve the angular intervals: 60° / 2 = 30°; 30° / 2 = 15°. Any angle expressible as 15° * k (where k is an integer: 15°, 30°, 45°, 60°, 75°, 90°, 105°, 120°, 135°, 150°, 165°) can thus be constructed with absolute geometric purity.'
        ],
        mathematicalFormulation: '∠ = 60° + ½(90° - 60°) = 75°;   General Form: θ = 15° · k  (k ∈ ℤ)',
        engineeringImportance: 'Standard angles govern structural roof trusses (30°, 45°, 60°), pipe bends, and machine chamfers.',
        figureRef: 'Fig. 2.14'
      }
    ],
    examinerTraps: [
      {
        trap: 'Changing Compass Radius When Stepping 60° and 120° Arcs',
        penalty: 'Distorted angle construction resulting in loss of all 8 marks.',
        avoidance: 'Lock the compass screw firmly after drawing the primary baseline arc, ensuring the radius remains strictly identical for arcs D and E.'
      }
    ]
  },

  // 6. CONSTRUCTION OF TRIANGLES (EQUILATERAL, ISOSCELES, SCALENE)
  'triangles': {
    title: 'Construction of Triangles & Inscribed/Circumscribed Circles',
    historicalContext: `The triangle is the only rigid geometric polygon—a property fundamental to all structural engineering trusses and frames. In J.N. Green (Chapter 3: Construction of Triangles) and Pickup & Parker (Vol. 1, Ex. 6–10), triangle construction is classified systematically by given data:
1. Three sides (SSS)
2. Two sides and included angle (SAS)
3. One side and two angles (ASA)
4. Base, altitude, and vertical angle.

Furthermore, every triangle possesses an Inscribed Circle (Incircle, centered at the incenter I where internal angle bisectors intersect) and a Circumscribed Circle (Circumcircle, centered at the circumcenter C where perpendicular bisectors of the sides intersect).`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 3: Construction of Triangles',
        pages: 'pp. 24–38',
        figureRefs: ['Fig. 3.2 (Triangle given 3 sides)', 'Fig. 3.8 (Inscribed Circle)', 'Fig. 3.12 (Circumscribed Circle)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS1 Unit 2'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 1: Plane Geometry Theorems',
        pages: 'pp. 8–14',
        figureRefs: ['Worked Example 6 (Triangle Construction)', 'Worked Example 8 (Incircle and Circumcircle)'],
        syllabusRelevance: 'Rigid Structural Geometry'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 3.1)',
        title: 'Construction of an Equilateral Triangle (Given Side Length s = 70mm)',
        givenData: 'Side length AB = BC = CA = 70mm.',
        constructionTheorem: 'All three sides of an equilateral triangle are equal in length (a = b = c), and all three interior angles are equal to 60° (Σ = 180°). Striking compass arcs of radius equal to the baseline from each endpoint defines the unique apex vertex C.',
        steps: [
          'Step 1: Draw horizontal baseline AB = 70mm using a T-square and 2H pencil. Mark vertices A and B accurately.',
          'Step 2: Set the compass needle to vertex A and open the pencil point exactly to vertex B (radius R = 70mm).',
          'Step 3: Strike a light 4H guide arc above the midpoint of the baseline.',
          'Step 4: Without altering the compass radius (R = 70mm), transfer the needle to vertex B and strike an intersecting arc cutting the first arc at apex point C.',
          'Step 5: Using a straight ruler and HB pencil, draw firm continuous thick outlines joining A to C and B to C.',
          'Step 6: Finish the baseline AB with an HB pencil to complete the triangle, mark equality tick marks on all three sides, and add angle annotations (60° at each corner).'
        ],
        waecExaminerTip: 'Ensure compass radius is exactly equal to base AB. Arcs must be thin 4H lines that clearly intersect at vertex C. Do not erase construction arcs; WAEC marks them for method.',
        figureRef: 'Fig. 3.1'
      },
      {
        exampleNumber: 'Worked Example 2 (J.N. Green Fig. 3.3 / Pickup & Parker Ex. 6)',
        title: 'Construction of an Isosceles Triangle (Given Base AB = 70mm and Equal Legs AC = BC = 85mm)',
        givenData: 'Base c = AB = 70mm; equal sloping sides a = b = AC = BC = 85mm.',
        constructionTheorem: 'An isosceles triangle has two equal sides and two equal base angles (∠CAB = ∠CBA). The perpendicular bisector of the base is also the axis of symmetry passing through apex C, with altitude h = √(b² - (c/2)²) = √(85² - 35²) = 77.5mm.',
        steps: [
          'Step 1: Draw horizontal baseline AB = 70mm using a 2H pencil along the T-square.',
          'Step 2: Set compass to the given leg length of 85mm. Place the compass needle at vertex A and strike a generous 4H guide arc above the base.',
          'Step 3: Keeping the compass radius at 85mm, place needle at vertex B and strike an intersecting 4H arc cutting the first arc at apex point C.',
          'Step 4: Draw a thin chain centerline (ISO Type G) from apex C perpendicular to the midpoint M of AB to show the vertical axis of symmetry.',
          'Step 5: Using an HB pencil, draw bold continuous thick outlines joining A to C and B to C.',
          'Step 6: Mark double equality tick marks on sides AC and BC, indicate base angles α = β = 65.7°, and dimension baseline AB = 70mm and sides = 85mm.'
        ],
        waecExaminerTip: 'The vertical axis of symmetry must pass exactly through the midpoint of AB and vertex C. Candidates who fail to show intersecting compass arcs will lose method marks.',
        figureRef: 'Fig. 3.2'
      },
      {
        exampleNumber: 'Worked Example 3 (J.N. Green Fig. 3.2 / Pickup & Parker Ex. 7)',
        title: 'Construction of a Scalene Triangle (Given Base c = 80mm, Side a = 70mm, Side b = 55mm)',
        givenData: 'Base c = AB = 80mm; side a = BC = 70mm; side b = AC = 55mm.',
        constructionTheorem: 'A scalene triangle has three unequal sides (a ≠ b ≠ c) and three unequal interior angles. By the Triangle Inequality Theorem, construction is valid since a + b = 70 + 55 = 125mm > 80mm. The apex C is located at the intersection of circular locus r = 55mm from A and circular locus r = 70mm from B.',
        steps: [
          'Step 1: Check triangle inequality: 55mm + 70mm = 125mm > 80mm (construction is geometrically sound).',
          'Step 2: Draw horizontal baseline AB = 80mm with a 2H pencil. Mark endpoints A and B.',
          'Step 3: Set compass radius to side b = 55mm using the metric rule. With needle at A, strike a 4H guide arc above AB.',
          'Step 4: Set compass radius to side a = 70mm. With needle at B, strike an intersecting 4H arc cutting the first arc at apex point C.',
          'Step 5: Using a sharp HB pencil, draw continuous thick finished lines joining A to C and B to C.',
          'Step 6: Darken base AB in HB to maintain uniform outline thickness, and add dimension lines for all three sides: c = 80mm, a = 70mm, and b = 55mm.'
        ],
        waecExaminerTip: 'Do not confuse which arc is struck from which vertex: side AC = 55mm MUST be struck from center A, and side BC = 70mm MUST be struck from center B.',
        figureRef: 'Fig. 3.3'
      },
      {
        exampleNumber: 'Worked Example 4 (J.N. Green Fig. 3.8)',
        title: 'Construct Triangle ABC (AB=90mm, BC=75mm, AC=65mm) and Inscribe a Circle',
        givenData: 'Sides AB = 90mm, BC = 75mm, AC = 65mm.',
        constructionTheorem: 'The incenter is the intersection of the angle bisectors. The radius is the perpendicular distance from the incenter to any side.',
        steps: [
          'Step 1: Draw horizontal baseline AB = 90mm using a 2H pencil.',
          'Step 2: Set compass to 65mm, place needle at A, and swing an arc above AB.',
          'Step 3: Set compass to 75mm, place needle at B, and swing an arc intersecting the first arc at vertex C.',
          'Step 4: Join AC and BC with continuous HB lines to complete triangle ABC.',
          'Step 5: Bisect angle ∠CAB and angle ∠ABC using standard compass bisection technique.',
          'Step 6: The intersection of the two angle bisectors locates incenter I.',
          'Step 7: From incenter I, drop a perpendicular to baseline AB cutting at point P. Segment IP is the true radius r.',
          'Step 8: With center I and radius IP, describe the incircle. It touches all three sides AB, BC, and AC tangentially.'
        ],
        waecExaminerTip: 'Do not guess the radius of the incircle! You MUST drop a perpendicular from incenter I to AB to find the exact tangency point. Omitting this step loses 2 marks.',
        figureRef: 'Fig. 3.8'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 3.1',
        title: 'Construction of an Equilateral Triangle (J.N. Green Fig. 3.1)',
        caption: 'Equilateral triangle ABC constructed with base AB = 70mm, side AC = 70mm, and side BC = 70mm. All three interior angles are 60°.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 3, p. 25',
          'Compass radius equal to base AB',
          'Equal side tick marks on all 3 edges',
          'Interior angles 60° verified'
        ],
        dimensions: ['AB = 70.0mm', 'BC = 70.0mm', 'CA = 70.0mm', 'Angles = 60°'],
        svgType: 'triangle-equilateral',
        constructionGrade: '4H Arcs & HB Outlines',
        textbookSource: 'J.N. Green: Technical Drawing for School Certificate Fig. 3.1'
      },
      {
        figureNumber: 'Fig. 3.2',
        title: 'Construction of an Isosceles Triangle (J.N. Green Fig. 3.3)',
        caption: 'Isosceles triangle ABC constructed with base AB = 70mm and equal sloping sides AC = BC = 85mm. Shows axis of symmetry and base angles α = β.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 3, p. 27 & Pickup & Parker Ex. 6',
          'Centerline CM represents perpendicular axis of symmetry',
          'Equal sloping legs AC = BC with double tick marks',
          'Base angles α = β = 65.7°'
        ],
        dimensions: ['Base AB = 70.0mm', 'Legs AC = BC = 85.0mm', 'Altitude h = 77.5mm', 'Base Angle = 65.7°'],
        svgType: 'triangle-isosceles',
        constructionGrade: '4H Guide Arcs, ISO Type G Centerline, HB Outline',
        textbookSource: 'J.N. Green Fig. 3.3 / Pickup & Parker Ex. 6'
      },
      {
        figureNumber: 'Fig. 3.3',
        title: 'Construction of a Scalene Triangle (J.N. Green Fig. 3.2)',
        caption: 'Scalene triangle ABC constructed given three unequal sides: base c = 80mm, side a = 70mm, side b = 55mm.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 3, p. 26 & Pickup & Parker Ex. 7',
          'SSS (Three Sides Given) method',
          'Triangle Inequality satisfied: 55 + 70 = 125 > 80mm',
          'Unequal interior angles: 57.6°, 42.0°, 80.4°'
        ],
        dimensions: ['Base c = 80.0mm', 'Side a = 70.0mm', 'Side b = 55.0mm'],
        svgType: 'triangle-scalene',
        constructionGrade: '4H Arcs & HB Outlines',
        textbookSource: 'J.N. Green Fig. 3.2 / Pickup & Parker Ex. 7'
      },
      {
        figureNumber: 'Fig. 3.4',
        title: 'The Three Types of Triangles Comparison Plate (J.N. Green Chapter 3)',
        caption: 'Side-by-side technical comparison of Equilateral, Isosceles, and Scalene triangles displaying geometric properties and ISO line hierarchy.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Equilateral: 3 equal sides, 3 × 60° angles',
          'Isosceles: 2 equal sides, 2 equal base angles, axis of symmetry',
          'Scalene: all sides and angles unequal'
        ],
        dimensions: ['Equilateral 70mm', 'Isosceles 70/85mm', 'Scalene 80/70/55mm'],
        svgType: 'triangles',
        constructionGrade: 'Standard Technical Plate',
        textbookSource: 'J.N. Green: Technical Drawing for Schools, Chapter 3'
      },
      {
        figureNumber: 'Fig. 3.8',
        title: 'Construction of Triangle and Inscribed Circle (J.N. Green Fig. 3.8)',
        caption: 'Triangle ABC with angle bisectors intersecting at incenter I, normal dropped to locate exact tangency radius r, and finished tangential incircle.',
        imageUrl: '/assets/angles_triangles_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 3, p. 30',
          'Angle bisectors drawn with 2H continuous thin lines',
          'Incircle touches all 3 sides without intersecting or leaving gaps',
          'Tolerance: tangency contact within ±0.25mm'
        ],
        dimensions: ['AB = 90mm', 'BC = 75mm', 'AC = 65mm', 'Incircle Radius r ≈ 21.5mm'],
        svgType: 'triangle-incircle',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green Fig. 3.8 / Pickup & Parker Ex. 8'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Centres of a Triangle: Incenter and Circumcenter',
        paragraphs: [
          'The incenter I is equidistant from all three sides of a triangle because any point on an angle bisector is equidistant from the arms of that angle. The incircle is therefore tangential to all three edges simultaneously.',
          'The circumcenter C is equidistant from all three vertices because it lies on the perpendicular bisectors of the sides. The circumcircle passes through vertices A, B, and C.'
        ],
        mathematicalFormulation: 'r = Δ / s = √(s(s - a)(s - b)(s - c)) / s;   s = (a + b + c) / 2;   R = (a · b · c) / (4Δ)',
        engineeringImportance: 'Used to determine maximum shaft diameters inside triangular casings and center of mass for structural gusset plates.',
        figureRef: 'Fig. 3.8'
      }
    ],
    examinerTraps: [
      {
        trap: 'Eyeballing the Incircle Radius instead of Dropping a Normal',
        penalty: 'Loss of 2 marks for missing perpendicular construction in WAEC Paper 2.',
        avoidance: 'Always swing an arc from incenter I cutting AB at two points, then construct the perpendicular bisector to find the exact tangent contact point.'
      }
    ]
  },

  // 7. LOCI: INVOLUTE OF A CIRCLE, ARCHIMEDEAN SPIRAL & CYCLOID
  'loci': {
    title: 'Loci: Involute of a Circle, Archimedean Spiral & Cycloid Curve',
    historicalContext: `A locus (plural: loci) is the geometric path traced by a point moving in accordance with defined mathematical laws. In technical drawing and machine kinematics, as detailed by J.N. Green (Chapter 8: Loci, pp. 110–128) and Pickup & Parker (Vol. 1, Chapter 5), three loci curves possess immense industrial importance:

1. Involute of a Circle: The path traced by the end of a taut, uncrossing cord unrolled from a circular cylinder. Over 95% of industrial gear teeth are manufactured with involute profiles because they maintain a constant pressure angle and uniform angular velocity ratio even if shaft center distances vary slightly.
2. Archimedean Spiral: The path of a point moving with uniform linear velocity along a ray that rotates with uniform angular velocity. Used in lathe chuck scroll plates and spring design.
3. Cycloid: The locus traced by a point on the circumference of a circle rolling along a straight line without slipping. Used in pump impellers and epicyclic gear drives.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 8: Loci',
        pages: 'pp. 110–128',
        figureRefs: ['Fig. 8.4 (Involute of a Circle)', 'Fig. 8.8 (Archimedean Spiral)', 'Fig. 8.14 (The Cycloid)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A, NERDC SS2 Unit 3'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 5: Curves of Loci',
        pages: 'pp. 62–74',
        figureRefs: ['Worked Example 15 (Gear Involute)', 'Worked Example 17 (Cycloidal Mechanisms)'],
        syllabusRelevance: 'Mechanical Engineering Kinematics'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 8.4)',
        title: 'Construct the Involute of a Circle of Diameter D = 50mm for One Complete Convolution',
        givenData: 'Base circle diameter D = 50mm. Circumference C = π * D = 3.1416 * 50 = 157.08mm.',
        constructionTheorem: 'At every point on the base circle, the tangent line represents the unwound cord length proportional to the angular rotation.',
        steps: [
          'Step 1: Draw the base circle of diameter 50mm (radius 25mm) with center O using a 2H pencil.',
          'Step 2: Divide the circle into 12 equal sectors of 30° each using 30°/60° set squares. Label points 0, 1, 2, ..., 12.',
          'Step 3: From point 0, draw a horizontal tangent line equal in length to the true circumference: C = π * 50 = 157mm.',
          'Step 4: Divide the tangent line into 12 equal divisions (each = 157 / 12 = 13.08mm), labeled 1\', 2\', ..., 12\'.',
          'Step 5: At each division point on the circle (1, 2, 3, etc.), erect tangents perpendicular to the radii (at 90° to O1, O2, etc.).',
          'Step 6: Along tangent 1, measure distance 0-1\'; along tangent 2, measure distance 0-2\'; repeat up to point 12.',
          'Step 7: Connect the locus points with a smooth curve using a French curve and HB pencil.'
        ],
        waecExaminerTip: 'Ensure each tangent is strictly perpendicular (90°) to the radial line! Tangents drawn at sloppy angles will cause the involute to distort, losing 5 marks.',
        figureRef: 'Fig. 8.4'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 8.4',
        title: 'Construction of the Involute of a Circle (J.N. Green Fig. 8.4)',
        caption: '50mm base circle divided into 12 equal sectors with progressive perpendicular tangents measuring unwound cord lengths, forming the standard gear tooth profile.',
        imageUrl: '/assets/loci_cycloid_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 8, p. 114',
          'True circumference C = πD = 157.08mm',
          'Radial tangents drawn at strictly 90° using set-squares',
          'Finished curve traced smoothly with French curve'
        ],
        dimensions: ['Diameter D = 50mm', 'Circumference = 157mm', '12 Sectors = 30° each'],
        svgType: 'loci',
        constructionGrade: '2H Construction & HB Curve',
        textbookSource: 'J.N. Green Fig. 8.4 / Pickup & Parker Ex. 15'
      },
      {
        figureNumber: 'Fig. 8.5',
        title: 'Normal Cycloid Generated by Rolling Circle (J.N. Green Fig. 8.9)',
        caption: 'Locus of a point on the rim of a Ø50mm circle rolling along a straight datum line for one complete revolution (L = πD = 157.1mm).',
        imageUrl: '/assets/loci_cycloid_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 8, p. 118',
          'Circle diameter = 50mm, Baseline length = 157.1mm',
          'Centerline loci C1 to C12 with 12 generating arc strikes',
          'Smooth French curve through all 12 points P0 to P12'
        ],
        dimensions: ['Generating Ø = 50mm', 'Base Length = 157.1mm', '12 Sectors = 30°'],
        svgType: 'cycloid',
        constructionGrade: '2H Construction & HB Curve',
        textbookSource: 'J.N. Green Fig. 8.9 / Pickup & Parker Ex. 18'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Fundamental Theorem of Involute Gear Meshing',
        paragraphs: [
          'The normal to an involute curve at any point is always tangent to the base circle. When two involute gear teeth mesh, their common normal passes through a fixed pitch point on the line of centers.',
          'This satisfies the Fundamental Law of Gearing: a constant angular velocity ratio is maintained throughout engagement, preventing vibration and tooth pitting.'
        ],
        mathematicalFormulation: 'x(t) = r(cos t + t·sin t);   y(t) = r(sin t - t·cos t);   C = π · D',
        engineeringImportance: 'Standard profile for spur gears, helical gears, and scroll compressor spirals.',
        figureRef: 'Fig. 8.4'
      }
    ],
    examinerTraps: [
      {
        trap: 'Connecting Involute Points with Short Straight Line Segments',
        penalty: 'Loss of 3 marks for jerky, faceted curve work in WAEC Paper 2.',
        avoidance: 'Always blend locus points using a French curve or flexible curve. The finished line must be a single, smooth, continuous HB stroke.'
      }
    ]
  },

  // 8. ISOMETRIC PROJECTION & 4-CENTER METHOD
  'isometric': {
    title: 'Isometric Projection & 4-Center Method for Isometric Circles',
    historicalContext: `Isometric projection is the most widely utilized form of pictorial axonometric drawing in engineering. As articulated by J.N. Green (Chapter 10, pp. 142–168) and Pickup & Parker (Vol. 1, Chapter 7), the object is tilted such that the three mutually perpendicular coordinate axes (X, Y, Z) appear equally foreshortened and spaced 120° apart on the paper.

In isometric drawing, all horizontal edges are drawn at 30° to the horizontal baseline using a 30°/60° set square resting on the T-square; vertical edges remain strictly vertical (90°). Because circles in isometric view project as ellipses, draftsmen utilize the classical Four-Center Approximate Method, which constructs the isometric circle using four circular arcs struck from conjugate obtuse angle vertices.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 10: Isometric Projection',
        pages: 'pp. 142–168',
        figureRefs: ['Fig. 10.4 (Isometric Axes and Scale)', 'Fig. 10.12 (Four-Center Method for Circles)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A & B, NERDC SS3 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 7: Pictorial Projections',
        pages: 'pp. 88–104',
        figureRefs: ['Worked Example 21 (Isometric Block)', 'Worked Example 23 (Cylindrical Features in Isometric)'],
        syllabusRelevance: 'Pictorial Representation Standards'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 10.12)',
        title: 'Construct an Isometric Circle of Diameter D = 60mm in Top Horizontal Plane using 4-Center Method',
        givenData: 'Circular hole of diameter 60mm on top face of an isometric block.',
        constructionTheorem: 'An isometric circle is inscribed within an isometric rhombus of side equal to the circle diameter. The centers of the arcs lie at the obtuse vertices and midpoints of opposite sides.',
        steps: [
          'Step 1: Using a T-square and 30°/60° set square with a 2H pencil, construct a 30° isometric rhombus ABCD of side length 60mm.',
          'Step 2: Note the two obtuse angle vertices (A and C, each measuring 120°) and two acute angle vertices (B and D, each measuring 60°).',
          'Step 3: Locate midpoints 1, 2, 3, and 4 on the four sides of the rhombus (at 30mm from each corner).',
          'Step 4: Draw straight lines from obtuse vertex A to midpoints 2 and 3 on the opposite sides.',
          'Step 5: Draw straight lines from obtuse vertex C to midpoints 1 and 4 on the opposite sides.',
          'Step 6: The intersection points of these lines locate centers E and F for the two sharp end arcs.',
          'Step 7: With center A and radius A-2, swing large arc 2-3.',
          'Step 8: With center C and radius C-1, swing large arc 1-4.',
          'Step 9: With center E and radius E-1, swing small arc 1-2.',
          'Step 10: With center F and radius F-3, swing small arc 3-4, completing the seamless four-center isometric ellipse.'
        ],
        waecExaminerTip: 'Arcs must blend smoothly at tangency points 1, 2, 3, and 4 without visible steps or double lines. 2 marks are awarded solely for tangency smoothness.',
        figureRef: 'Fig. 10.12'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 10.12',
        title: 'The Four-Center Method for Isometric Circles (J.N. Green Fig. 10.12)',
        caption: 'Isometric rhombus showing lines projected from 120° obtuse vertices intersecting opposite side midpoints to locate 4 compass centers for elliptical blend.',
        imageUrl: '/assets/actual_isometric_diagram.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 10, p. 154',
          'Rhombus side = true diameter D of circle',
          'Two large radius arcs struck from obtuse corners A and C',
          'Two small radius arcs struck from internal intersection nodes E and F'
        ],
        dimensions: ['Diameter D = 60mm', 'Axis Angle = 30°/30°', 'Obtuse Angle = 120°'],
        svgType: 'isometric',
        constructionGrade: 'Isometric Standard',
        textbookSource: 'J.N. Green Fig. 10.12 / Pickup & Parker Ex. 23'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Isometric Scale vs Isometric Drawing (True Scale)',
        paragraphs: [
          'In true isometric projection, foreshortening reduces edge lengths by a factor of \\cos(30°)/\\cos(45°) = \\sqrt{2/3} ≈ 0.816 (isometric scale).',
          'In standard engineering drafting practice and WAEC examinations, an Isometric Drawing is prepared using true full-scale measurements along the 30° axes. This eliminates time-consuming mathematical conversions while preserving pictorial realism.'
        ],
        mathematicalFormulation: 'Isometric Length = √(2/3) · True Length ≈ 0.8165 · L;   Drawing Ratio 1:1',
        engineeringImportance: 'Standard presentation method for assembly manuals, spare parts catalogs, and architectural 3D visualizations.',
        figureRef: 'Fig. 10.12'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing Receding Axes at 45° Instead of 30°',
        penalty: 'Misinterpreting Isometric as Oblique projection; loss of 6 marks.',
        avoidance: 'Always check that you are using the 30° angle of the 30°/60° set square for isometric drawings. 45° set squares are used strictly for oblique projections.'
      }
    ]
  },

  // 9. OBLIQUE PROJECTIONS: CAVALIER & CABINET
  'oblique': {
    title: 'Oblique Projections (Cavalier & Cabinet at 45°)',
    historicalContext: `Oblique projection is a pictorial method where the principal front face of the object is oriented parallel to the projection plane, showing its true shape and true dimensions without distortion. The receding third dimension (depth) is projected along oblique axes typically inclined at 45° (or 30°/60°) to the horizontal.

As established by J.N. Green (Chapter 11: Oblique Projection, pp. 170–184), two major standard variations exist:
1. Cavalier Oblique: Receding depth is drawn at full scale (1:1). While simple to construct, Cavalier projection produces noticeable optical distortion, making objects appear unnaturally elongated.
2. Cabinet Oblique: Receding depth is foreshortened by exactly half (1:2 scale). This reduction compensates for optical perspective illusion, yielding a balanced, aesthetically realistic presentation.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 11: Oblique Projection',
        pages: 'pp. 170–184',
        figureRefs: ['Fig. 11.2 (Cavalier vs Cabinet Comparison)', 'Fig. 11.6 (Circular Features on Front Face)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B, NERDC SS3 Unit 1'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 7: Pictorial Projections',
        pages: 'pp. 104–112',
        figureRefs: ['Worked Example 25 (Oblique Bracket Construction)'],
        syllabusRelevance: 'Cabinet Furniture & Architectural Joinery Drafting'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 11.2)',
        title: 'Construct a Stepped Bearing Bracket in Cabinet Oblique Projection at 45°',
        givenData: 'Front face: 80mm wide × 60mm high with Ø30mm hole. Total depth: 50mm.',
        constructionTheorem: 'Frontal features are drawn at true shape; receding lines are projected at 45° and foreshortened to 50% depth (25mm).',
        steps: [
          'Step 1: Using T-square and set squares, draw the front face of the bracket at true scale (80mm × 60mm).',
          'Step 2: Draw the Ø30mm circular hole directly with a compass set to radius R = 15mm. Because it lies on the front plane, it is a TRUE circle, not an ellipse!',
          'Step 3: From all front vertices, project receding lines at 45° using a 45° set square resting on the T-square.',
          'Step 4: Along each 45° receding line, measure the cabinet depth: 50mm * 0.5 = 25mm.',
          'Step 5: Connect the rear endpoints with lines parallel to the front face.',
          'Step 6: Trace visible outlines with an HB pencil, leaving 2H construction lines intact.'
        ],
        waecExaminerTip: 'Always position the face with complex circular features parallel to the front plane! Circles on the front plane are drawn easily with a compass, avoiding elliptical 4-center constructions.',
        figureRef: 'Fig. 11.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 11.2',
        title: 'Cavalier vs Cabinet Oblique Projections (J.N. Green Fig. 11.2)',
        caption: 'Comparison of 45° Cavalier projection (1:1 depth, showing optical elongation) and Cabinet projection (1:2 depth, showing realistic perspective compensation).',
        imageUrl: '/assets/actual_isometric_diagram.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 11, p. 172',
          'Front face: 1:1 true scale and true geometry',
          'Receding axis: strictly 45° to horizontal datum',
          'Cabinet depth: strictly 0.5 * true depth'
        ],
        dimensions: ['Width = 80mm', 'Height = 60mm', 'Cavalier Depth = 50mm', 'Cabinet Depth = 25mm'],
        svgType: 'oblique',
        constructionGrade: 'Cabinet Oblique Standard',
        textbookSource: 'J.N. Green Fig. 11.2 / Pickup & Parker Ex. 25'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Projective Distortion and Foreshortening Dynamics',
        paragraphs: [
          'In oblique projection, projector rays are parallel to each other but strike the projection plane at an oblique angle α. When cot(α) = 1, the projection is Cavalier (full depth). When cot(α) = 0.5, the projection is Cabinet (half depth).',
          'The primary advantage of oblique projection over isometric projection is that circular arcs and irregular contours situated on the front plane require no elliptical approximation.'
        ],
        mathematicalFormulation: 'Cavalier: L_rec = L;   Cabinet: L_rec = ½ L;   θ = 45°',
        engineeringImportance: 'Standard pictorial drafting method for wood joinery, timber framing, and piping isometric schematics.',
        figureRef: 'Fig. 11.2'
      }
    ],
    examinerTraps: [
      {
        trap: 'Failing to Halve the Depth in a Question Explicitly Specifying "Cabinet Projection"',
        penalty: 'Loss of 4 marks for drawing Cavalier instead of Cabinet depth.',
        avoidance: 'Read the question carefully. If "Cabinet" is specified, divide all receding dimensions along the 45° axis by 2.'
      }
    ]
  },

  // 10. INTERPENETRATION & INTERSECTION OF SOLIDS
  'interpenetration': {
    title: 'Interpenetration of Dissimilar Solids (Cylinders & Prisms)',
    historicalContext: `When two geometric solids intersect—such as pipes, boiler drums, machine casings, or ventilation ducts—the boundary of their junction forms a three-dimensional spatial curve known as the curve of interpenetration or line of intersection. As demonstrated by J.N. Green (Chapter 14: Intersection of Solids, pp. 234–256) and Pickup & Parker (Vol. 1, Chapter 10), plotting this curve with precision is vital for template making and sheet metal cutting.

The curve of intersection is plotted using either:
1. The Generator Line Method: Drawing elements along the surface of one solid and projecting their pierce points onto the other.
2. The Cutting Plane Method: Passing imaginary horizontal or vertical cutting planes through both solids, identifying common cross-sectional boundaries, and finding their intersection nodes.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 14: Intersection of Solids',
        pages: 'pp. 234–256',
        figureRefs: ['Fig. 14.2 (Two Cylinders Meeting at 90°)', 'Fig. 14.8 (Cylinder Intersecting Hexagonal Prism)'],
        syllabusRelevance: 'WAEC Technical Drawing Section B, Higher Technical Diploma'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 10: Interpenetration of Solids',
        pages: 'pp. 142–160',
        figureRefs: ['Worked Example 32 (Perpendicular Cylinders)', 'Worked Example 35 (Oblique Branch Pipes)'],
        syllabusRelevance: 'City & Guilds Fabrication & Welding Engineering'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 14.2)',
        title: 'Plot the Curve of Interpenetration between Two Unequal Cylinders Intersecting at 90°',
        givenData: 'Main vertical cylinder Ø70mm, horizontal intersecting branch cylinder Ø45mm, axes intersecting at right angles.',
        constructionTheorem: 'Horizontal cutting planes slice both cylinders into parallel circles and straight generator lines. The intersections of these elements locate the true spatial curve.',
        steps: [
          'Step 1: Draw the front elevation and plan view of the vertical cylinder (Ø70mm) and horizontal cylinder (Ø45mm) using 2H lines.',
          'Step 2: Draw the end elevation of the branch cylinder as a true circle of Ø45mm.',
          'Step 3: Divide the circular end elevation into 12 equal 30° sectors, labeled 0 to 12.',
          'Step 4: Project horizontal generator lines from these 12 points into the front elevation and plan view.',
          'Step 5: In the plan view, observe where each generator intersects the circular boundary of the Ø70mm vertical cylinder.',
          'Step 6: Project these intersection points vertically upward into the front elevation to meet their corresponding horizontal generators.',
          'Step 7: Connect the resulting intersection nodes using a French curve to form the smooth hyperbolic curve of interpenetration.'
        ],
        waecExaminerTip: 'Ensure all 12 generator lines are projected accurately. Connecting nodes with straight chords instead of a French curve results in a 4-mark penalty.',
        figureRef: 'Fig. 14.2'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 14.2',
        title: 'Curve of Interpenetration between Two Cylinders at 90° (J.N. Green Fig. 14.2)',
        caption: 'Multi-view projection showing circular end division, horizontal surface generators, and vertical pierce projection generating the true hyperbolic intersection curve.',
        imageUrl: '/assets/interpenetration_plate.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 14, p. 238',
          'Main cylinder: Ø70mm; Branch: Ø45mm',
          '12 radial generators spaced at 30° increments',
          'Curve of intersection is concave toward the branch cylinder'
        ],
        dimensions: ['Main Ø = 70mm', 'Branch Ø = 45mm', 'Angle = 90.0°'],
        svgType: 'development',
        constructionGrade: 'Advanced Orthographic Standard',
        textbookSource: 'J.N. Green Fig. 14.2 / Pickup & Parker Ex. 32'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Auxiliary Sphere and Cutting Plane Methods',
        paragraphs: [
          'When two solids of revolution share a common intersecting sphere, their lines of intersection appear as straight lines in any view perpendicular to their plane of axes. This allows rapid verification of equal-diameter cylinder junctions (which form planar 45° ellipses).',
          'For unequal diameters, the curve is a true spatial quadric curve, essential for robotic plasma cutting, welding bevel prep, and pipe manifold manufacturing.'
        ],
        mathematicalFormulation: 'x² + y² = R²   ∩   y² + z² = r² ⟹ z = ±√(r² - R² + x²)',
        engineeringImportance: 'Fundamental in pressure vessel nozzles, petrochemical pipelines, and HVAC ventilation ductwork.',
        figureRef: 'Fig. 14.2'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing the Curve of Interpenetration as a Straight 45° Line for Unequal Cylinders',
        penalty: 'Loss of 6 marks; straight intersection lines only occur when both cylinders have IDENTICAL diameters.',
        avoidance: 'Only draw a straight 45° miter line when D1 = D2. If D1 ≠ D2, the curve MUST be plotted using generators and a French curve.'
      }
    ]
  },

  // 11. TIMBER ROOF TRUSS DETAILS (KING POST & QUEEN POST)
  'roof-truss': {
    title: 'Timber Roof Truss Details: King Post & Queen Post Construction',
    historicalContext: `In architectural and building drawing, roof trusses are triangulated structural timber or steel frameworks designed to span open interior spaces while supporting roof coverings (corrugated aluminum, clay tiles) against wind and gravity loads. As detailed by J.N. Green (Chapter 16: Building Drawing, pp. 296–312), the West African building curriculum emphasizes:

1. King Post Roof Truss: Spans up to 8.0 meters. Comprises a central vertical tension member (King Post), two inclined Principal Rafters in compression, a bottom horizontal Tie Beam in tension, and inclined Struts in compression.
2. Queen Post Roof Truss: Spans from 8.0 to 12.0 meters. Features two vertical tension posts (Queen Posts) connected by a horizontal Straining Beam at top and a Straining Sill at bottom.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 16: Building Drawing',
        pages: 'pp. 296–312',
        figureRefs: ['Fig. 16.18 (Elevation of King Post Roof Truss)', 'Fig. 16.22 (Joint Details at Eaves and Ridge)'],
        syllabusRelevance: 'WAEC Technical Drawing Building Option, NERDC SS3 Building Drawing'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 2)',
        author: 'F. Pickup & M.A. Parker',
        edition: '2nd Edition, Nelson Thornes',
        chapter: 'Chapter 8: Structural Timber and Steel Details',
        pages: 'pp. 112–130',
        figureRefs: ['Worked Example 42 (Timber Roof Truss Elevation and Joinery)'],
        syllabusRelevance: 'Architectural Working Drawings'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 16.18)',
        title: 'Draw the Detailed Elevation of a 6.0m Span King Post Roof Truss at Scale 1:20',
        givenData: 'Clear span: 6000mm. Pitch: 30°. Wall thickness: 225mm. Tie beam: 150x50mm. Principal rafters: 100x50mm. King post: 100x75mm. Struts: 75x50mm.',
        constructionTheorem: 'A triangulated framework experiences only axial tension or compression, transferring vertical loads safely onto the load-bearing blockwalls.',
        steps: [
          'Step 1: Set out scale 1:20 (each 1000mm = 50mm on paper).',
          'Step 2: Draw the two 225mm sandcrete blockwalls spaced 6000mm clear span apart.',
          'Step 3: Position the 100mm × 75mm timber wall plates bedded in mortar on top of each wall.',
          'Step 4: Draw the 150mm × 50mm horizontal tie beam resting on the wall plates, with 300mm overhang.',
          'Step 5: From the center of the span, erect the vertical centerline and draw the 100mm × 75mm King Post.',
          'Step 6: Draw the two 100mm × 50mm principal rafters inclined at 30° from the eaves to the king post head.',
          'Step 7: Draw the 75mm × 50mm inclined struts from the foot of the king post to the midpoints of the principal rafters.',
          'Step 8: Detail the joints: mortise and tenon at ridge and king post foot, birdsmouth joint at eaves with mild steel strap.'
        ],
        waecExaminerTip: 'Always label member names and dimensions! In WAEC Building Option, 5 marks are reserved exclusively for correct member annotations and timber joinery details.',
        figureRef: 'Fig. 16.18'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 16.18',
        title: 'King Post Timber Roof Truss Elevation (J.N. Green Fig. 16.18)',
        caption: 'Structural elevation of a 6.0m span King Post truss showing tie beam, principal rafters at 30° pitch, central king post, struts, wall plates, and eaves overhang.',
        imageUrl: '/assets/actual_building_foundation.jpg',
        technicalNotes: [
          'Reference: J.N. Green Chapter 16, p. 302',
          'Scale: 1:20 or 1:25',
          'Tie beam: 150 × 50mm; Rafters: 100 × 50mm; King post: 100 × 75mm',
          'Pitch: 30° standard for corrugated tropical roofing'
        ],
        dimensions: ['Span = 6000mm', 'Pitch = 30°', 'Tie Beam = 150×50mm', 'King Post = 100×75mm'],
        svgType: 'building',
        constructionGrade: 'Architectural Working Drawing',
        textbookSource: 'J.N. Green Fig. 16.18'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Axial Force Resolution in Triangulated Timber Trusses',
        paragraphs: [
          'The external roof load (dead load of roofing sheets plus live wind load) acts downward on the purlins and principal rafters, inducing compressive stress.',
          'The bottom ends of the rafters attempt to spread outward; this lateral thrust is resisted by the horizontal Tie Beam, which is placed under pure tensile stress. The central King Post acts as a vertical hanger in tension, preventing the tie beam from sagging under its own dead weight.'
        ],
        mathematicalFormulation: 'T_tie = (W · L) / (8 · h);   h = (L / 2) · tan(θ) = 3000 · tan(30°) ≈ 1732mm',
        engineeringImportance: 'Guarantees structural stability for residential roofs and large commercial halls in heavy tropical rain zones.',
        figureRef: 'Fig. 16.18'
      }
    ],
    examinerTraps: [
      {
        trap: 'Labeling the King Post as a Compression Column',
        penalty: 'Loss of 2 marks in structural theory questions.',
        avoidance: 'The King Post is a TENSION member (hanger). It suspends the tie beam from the ridge apex to prevent sagging; it does NOT support the ridge.'
      }
    ]
  },

  // 12. MACHINE DRAWING & ASSEMBLY: PLUMMER BLOCK & FLANGED COUPLING
  'machine-assembly': {
    title: 'Machine Assembly Drawing: Plummer Block & Protected Flanged Coupling',
    historicalContext: `Assembly drawing represents the highest level of mechanical engineering graphics. As articulated by Pickup & Parker in Engineering Drawing with Worked Examples (Vol. 2, pp. 45–78), an assembly drawing portrays how individual manufactured machine components—castings, bushings, shafts, bolts, keys, and washers—fit together to perform mechanical functions.

Two classical mechanical assemblies prescribed by WAEC and higher technical institutions are:
1. Plummer Block (Pedestal Bearing): Supports a rotating transmission shaft. Comprises a cast-iron base, split gunmetal or phosphor-bronze bearing bushes (brasses), a cast-iron bearing cap, mild steel square-neck clamping bolts, and grease cup lubricators.
2. Protected Flanged Shaft Coupling: Connects two collinear rotating shafts. Features cast-iron flanges keyed to shafts via gib-head taper keys, bolted together with shrouded safety rims to prevent worker clothing entanglement.`,
    textbookReferences: [
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 2)',
        author: 'F. Pickup & M.A. Parker',
        edition: '2nd Edition, Nelson Thornes',
        chapter: 'Chapter 3: Bearings and Couplings Assembly',
        pages: 'pp. 45–78',
        figureRefs: ['Worked Example 12 (Plummer Block Assembly)', 'Worked Example 15 (Protected Flanged Coupling)'],
        syllabusRelevance: 'WAEC Technical Drawing Mechanical Option, NCE & ND Engineering'
      },
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E.',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 15: Mechanical Engineering Drawing',
        pages: 'pp. 260–288',
        figureRefs: ['Fig. 15.14 (Plummer Block Details)', 'Fig. 15.20 (Shaft Coupling Details)'],
        syllabusRelevance: 'WAEC Mechanical Working Drawings'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Pickup & Parker Vol. 2, Ex. 12)',
        title: 'Draw the Half-Sectional Front Elevation and Plan View of a 50mm Plummer Block Assembly',
        givenData: 'Detailed orthographic views of Base Casting (Part 1), Bearing Cap (Part 2), Split Brasses (Part 3), M16 Bolts (Part 4), Shaft (Ø50mm).',
        constructionTheorem: 'Assembly drawing requires resolving clearances, seating split brasses with snug locators, and adhering to ISO 128 sectioning exemptions (shafts and bolts are NOT sectioned longitudinally).',
        steps: [
          'Step 1: Lay out the horizontal and vertical centerlines for the Ø50mm shaft journal using 2H chain lines.',
          'Step 2: Draw the cast-iron base casting with its bolt mounting slots and recessed semicircular housing.',
          'Step 3: Assemble the lower and upper split brasses (bearing bushes), showing the anti-rotation snug locator pin.',
          'Step 4: Draw the Ø50mm solid transmission shaft running through the bearing bushes.',
          'Step 5: Place the bearing cap on top of the upper bush.',
          'Step 6: Insert the two M16 square-head holding-down bolts through the cap and base casting.',
          'Step 7: For the half-sectional elevation, apply 45° ISO hatching to the cut portions of the base and cap. Follow ISO 128 rules: DO NOT hatch the solid steel shaft or the bolts!',
          'Step 8: Compile the complete Bill of Materials (Parts List) with part numbers, quantities, and material specifications.'
        ],
        waecExaminerTip: 'Hatching solid shafts, keys, or bolts in a sectional assembly drawing is an immediate 5-mark deduction! ISO 128 explicitly exempts solid shafts and fasteners from longitudinal hatching.',
        figureRef: 'Fig. 15.14'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 15.14',
        title: 'Plummer Block (Pedestal Bearing) Assembly & Sectional Elevation (Pickup & Parker Vol. 2, Ex. 12)',
        caption: 'Complete engineering assembly showing cast-iron base, bearing cap, split bronze bushes, clamping bolts, and un-sectioned shaft journal with ISO parts list.',
        imageUrl: '/assets/actual_fastener_drawing.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 2, p. 52',
          'Shaft diameter: Ø50mm journal',
          'Solid shafts, keys, bolts, and nuts are NEVER sectioned longitudinally (ISO 128)',
          'Hatching lines angled at 45° with alternating directions for adjacent components'
        ],
        dimensions: ['Shaft Ø = 50mm', 'Base Length = 220mm', 'Bolts = 2 × M16', 'Bushes = Phosphor Bronze'],
        svgType: 'plummer-block',
        constructionGrade: 'Mechanical Assembly Standard',
        textbookSource: 'Pickup & Parker Vol. 2, Ex. 12 / J.N. Green Fig. 15.14'
      },
      {
        figureNumber: 'Fig. 15.20',
        title: 'Protected Flanged Shaft Coupling Assembly (Pickup & Parker Vol. 2, Ex. 15)',
        caption: 'Detailed sectional elevation of cast-iron protective shrouded flanged coupling connecting collinear shafts with gib-head keys and fitted bolts.',
        imageUrl: '/assets/actual_fastener_drawing.jpg',
        technicalNotes: [
          'Reference: Pickup & Parker Vol. 2, p. 58',
          'Shaft diameter: Ø40mm; Flange diameter: Ø160mm',
          'Protective annular shroud prevents bolt heads catching clothing',
          'Gib-head taper keys (1:100 taper) secure flanges to shafts'
        ],
        dimensions: ['Shaft Ø = 40mm', 'Flange OD = 160mm', 'PCD = 115mm', '4 × M12 Bolts'],
        svgType: 'coupling',
        constructionGrade: 'Mechanical Assembly Standard',
        textbookSource: 'Pickup & Parker Vol. 2, Ex. 15 / J.N. Green Fig. 15.20'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Tribology and Thermal Expansion Allowances in Hydrodynamic Bearings',
        paragraphs: [
          'Plummer blocks support rotating line shafts in factories and marine drivetrains. The split bronze bushes provide a sacrificial low-friction bearing surface that can be easily replaced when worn without replacing the entire cast-iron housing.',
          'The small clearance (0.05mm to 0.10mm) between shaft and bush forms a converging hydrodynamic oil wedge when the shaft rotates, creating oil pressure that lifts the shaft off metal-to-metal contact.'
        ],
        mathematicalFormulation: 'Diametral Clearance c = 0.001 · D ≈ 0.05mm;   Bearing Pressure P = W / (L · D) ≤ 2.5 N/mm²',
        engineeringImportance: 'Guarantees reliable operation of heavy industrial conveyors, agricultural processing mills, and marine propulsion shafts.',
        figureRef: 'Fig. 15.14'
      }
    ],
    examinerTraps: [
      {
        trap: 'Hatching the Solid Transmission Shaft or Bolts in a Longitudinal Section',
        penalty: 'Loss of 5 marks for violating ISO 128 / BS 308 sectioning conventions.',
        avoidance: 'Never hatch solid round bars, shafts, pins, bolts, nuts, keys, or ball bearings in longitudinal sections. Only hatch hollow sleeves and outer castings.'
      }
    ]
  },

  // 13. COMPUTER-AIDED DESIGN (AUTOCAD 2D FUNDAMENTALS)
  'cad': {
    title: 'Computer-Aided Design (AutoCAD): Precision Coordinates & Editing Suites',
    historicalContext: `Computer-Aided Design (CAD) revolutionized technical graphics by replacing manual drawing boards with digital vector precision. Under the revised Nigerian NERDC curriculum and international engineering standards, technical drawing students must master 2D CAD coordinate entry systems, drawing entity generation, and precision modification suites.

In software such as Autodesk AutoCAD, geometry is constructed in real-world 1:1 units within an infinite 3D virtual workspace. Draftsmen navigate two coordinate reference systems:
1. World Coordinate System (WCS): Fixed global Cartesian reference origin (0, 0, 0).
2. User Coordinate System (UCS): Movable, reorientable local coordinate system aligned with specific workpiece faces.

Precision drafting relies on three entry modes: Absolute Cartesian (X, Y), Relative Cartesian (@ΔX, ΔY), and Relative Polar (@Distance<Angle), supported by Object Snaps (OSNAP).`,
    textbookReferences: [
      {
        bookTitle: 'NERDC Senior Secondary School Technical Drawing Curriculum (CAD Module)',
        author: 'NERDC Curriculum Directorate',
        edition: 'Revised Metric Edition',
        chapter: 'SS2 & SS3 Unit: Computer-Aided Design and Drafting',
        pages: 'pp. 42–58',
        figureRefs: ['CAD Fig. 1 (AutoCAD Interface and Coordinate Systems)', 'CAD Fig. 2 (Draw and Modify Commands)'],
        syllabusRelevance: 'WAEC Technical Drawing Modern Syllabus, NERDC Curriculum'
      },
      {
        bookTitle: 'Engineering Drawing with AutoCAD Applications',
        author: 'F. Pickup & M.A. Parker Principles (Modern Digital Addendum)',
        edition: 'Digital Engineering Graphics Edition',
        chapter: 'Chapter 1: 2D Geometric Construction in CAD',
        pages: 'pp. 1–28',
        figureRefs: ['Fig. CAD.4 (Precision Modification Suite: TRIM, OFFSET, FILLET)'],
        syllabusRelevance: 'Professional Engineering CAD Practice'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (AutoCAD 2D Precision Layout)',
        title: 'Construct a Stepped Shaft Flange Profile using Absolute and Relative Polar Coordinates',
        givenData: 'Start point (100, 100), baseline 120mm horizontal, 45mm vertical, chamfer 15mm at 45°, circular hole Ø30mm.',
        constructionTheorem: 'In CAD, coordinates can be entered directly at the command prompt to guarantee zero human parallax error.',
        steps: [
          'Step 1: Set up drawing units: Command UNITS -> Type: Decimal, Precision: 0.00, Angles: Decimal Degrees.',
          'Step 2: Initialize layers according to ISO 13567: OUTLINE (continuous 0.5mm, white), HIDDEN (dashed 0.25mm, cyan), CENTER (centerline 0.25mm, red), DIM (continuous 0.25mm, green).',
          'Step 3: Command: LINE -> Specify first point: 100,100 (Absolute Cartesian).',
          'Step 4: Specify next point: @120,0 (Relative Cartesian: 120mm right along X axis).',
          'Step 5: Specify next point: @0,45 (Relative Cartesian: 45mm up along Y axis).',
          'Step 6: Specify next point: @15<135 (Relative Polar: 15mm chamfer at 135° angle).',
          'Step 7: Command: CIRCLE -> Center point: @-40,-20 -> Radius: 15 (Ø30mm hole).',
          'Step 8: Command: OFFSET -> Distance: 10 -> Select entities to create parallel wall offsets.',
          'Step 9: Command: FILLET -> Radius: 5 -> Blend internal corners.'
        ],
        waecExaminerTip: 'Always activate Object Snap (F3) with ENDPOINT, MIDPOINT, CENTER, and INTERSECTION checked. Drawing without OSNAP creates microscopic gaps that fail CNC machining exports.',
        figureRef: 'Fig. CAD.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. CAD.1',
        title: 'AutoCAD 2D Coordinate Systems & Precision Command Suite',
        caption: 'AutoCAD graphics screen showing UCS icon at origin (0,0), absolute coordinate entry, relative polar vector navigation (@Dist<Angle), and status bar OSNAP tracking.',
        imageUrl: '/assets/african_higher_inst_cad_lab.jpg',
        technicalNotes: [
          'Reference: NERDC CAD Technical Drawing Guidelines',
          'Absolute Cartesian: X, Y measured from (0,0)',
          'Relative Polar: @Distance<Angle measured from last entered point',
          'Standard CAD layers: ISO 13567 compliance'
        ],
        dimensions: ['Origin: (0,0)', 'Vector: @160<35°', 'Units: Millimeters'],
        svgType: 'cad',
        constructionGrade: 'Digital CAD Standard',
        textbookSource: 'AutoCAD Engineering Graphics Guide'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Vector Math and Floating-Point Precision in Modern CAD Engines',
        paragraphs: [
          'Unlike raster images composed of discrete pixels, CAD databases store geometric entities as mathematical vector equations (endpoints, center coordinates, radius, slope). This allows infinite zoom without pixelation or loss of precision.',
          'In engineering workflows, 2D CAD models serve as the direct input for Computer-Aided Manufacturing (CAM), CNC milling G-code generation, and 3D additive manufacturing (3D printing).'
        ],
        mathematicalFormulation: 'X_new = X_prev + r · cos(θ);   Y_new = Y_prev + r · sin(θ)',
        engineeringImportance: 'Eliminates drafting errors, enables parametric parametric revisions in seconds, and powers digital factory workflows.',
        figureRef: 'Fig. CAD.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Drawing All Entities on Default Layer "0"',
        penalty: 'Loss of 4 marks for failing to utilize layer management standards.',
        avoidance: 'Always create dedicated layers for Outlines, Hidden Lines, Centerlines, and Dimensions with appropriate ISO line weights and colors.'
      }
    ]
  },

  // 14. DIGITAL TECHNICAL ILLUSTRATION & BEZIER CURVES
  'digital-graphics': {
    title: 'Digital Technical Illustration: Vector Bezier Curves & Exploded Views',
    historicalContext: `In modern technical communication, technical illustrators translate engineering CAD blueprints into clear, consumer-friendly illustrations for service manuals, patent drawings, and assembly instructions. As taught in Higher Technical Institutions, software like CorelDRAW and Adobe Illustrator utilizes cubic Bézier curves (developed independently by Pierre Bézier at Renault and Paul de Casteljau at Citroën) to model complex organic surfaces and automotive aerodynamic profiles.

A cubic Bézier curve is defined by four points: two anchor nodes that terminate the curve segment and two directional control handles that determine the tangent direction and curvature radius. Combining Bézier curves with 30° digital isometric grids enables the creation of complex exploded assembly illustrations showing how machinery components dismantle in space.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Graphics and Digital Media Engineering',
        author: 'Higher Institution Curriculum Board',
        edition: 'Advanced Diploma Edition',
        chapter: 'Chapter 4: Vector Graphics and Bézier Modeling in Technical Media',
        pages: 'pp. 82–108',
        figureRefs: ['Fig. DIG.2 (Cubic Bézier Tangent Node Dynamics)', 'Fig. DIG.5 (Exploded Isometric Assembly)'],
        syllabusRelevance: 'Higher National Diploma & University Engineering Graphics'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Modern Digital Addendum)',
        author: 'F. Pickup & M.A. Parker Technical Communication Principles',
        edition: 'Nelson Thornes Technical Series',
        chapter: 'Chapter 12: Digital Technical Illustration and Exploded Views',
        pages: 'pp. 165–188',
        figureRefs: ['Worked Example 48 (Exploded Mechanical Component)'],
        syllabusRelevance: 'Technical Documentation Standards'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (Higher Institution Graphics Module)',
        title: 'Model a Smooth Aerodynamic Machine Cowling using Cubic Bézier Splines',
        givenData: 'Anchor points P0 (50, 150) and P3 (350, 150), control points P1 (120, 50) and P2 (280, 50).',
        constructionTheorem: 'The Bézier curve is completely contained within the convex hull of its control points. Smooth curvature (C1 continuity) requires collinear tangent handles.',
        steps: [
          'Step 1: Set up a digital vector canvas with snapping enabled on a 5mm grid.',
          'Step 2: Place start anchor point P0 at (50, 150). Drag the tangent handle to control point P1 (120, 50).',
          'Step 3: Place end anchor point P3 at (350, 150). Drag the incoming tangent handle to control point P2 (280, 50).',
          'Step 4: The cubic equation evaluates points along parameter t from 0 to 1, producing a perfectly smooth parabolic aerodynamic arch.',
          'Step 5: To join a second curve with seamless smoothness (C1 continuity), ensure the exit handle of P3 is collinear (180° opposite) and proportional to the entry handle.',
          'Step 6: Apply technical line weighting: 0.70mm outer profile edge, 0.35mm internal surface reflection highlight.'
        ],
        waecExaminerTip: 'Ensure tangent handles across shared nodes remain strictly straight (collinear). A kink in the control handles creates an unsightly sharp cusp (crease) on the modeled surface.',
        figureRef: 'Fig. DIG.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. DIG.1',
        title: 'Cubic Bézier Curve Geometry & Tangent Control Handles',
        caption: 'Mathematical curve generation showing start node P0, end node P3, directional tangent vectors P1 and P2, and the resulting smooth parametric curve used in digital vector graphics.',
        imageUrl: '/assets/african_higher_inst_cad_lab.jpg',
        technicalNotes: [
          'Reference: Technical Graphics & Digital Media Engineering',
          'Cubic Bernstein polynomials: degree n = 3',
          'C1 continuity: collinear tangent handles at node junctions',
          'C2 continuity: equal curvature radius across junction'
        ],
        dimensions: ['Span = 300mm', 'Max Lift = 75mm', 'Order = Cubic (4 points)'],
        svgType: 'bezier',
        constructionGrade: 'Digital Vector Standard',
        textbookSource: 'Digital Technical Illustration Manual'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Parametric Bernstein Polynomials and Convex Hull Property',
        paragraphs: [
          'Bézier curves evaluate coordinates via parametric equations B(t) = (1-t)³·P0 + 3(1-t)²·t·P1 + 3(1-t)·t²·P2 + t³·P3 for t ∈ [0, 1].',
          'Because the coefficients sum to exactly 1, the curve never strays outside the convex polygon formed by its four control points. This allows CAD and graphics software to compute bounding boxes, collision detections, and laser-cutting toolpaths with lightning speed.'
        ],
        mathematicalFormulation: 'B(t) = Σ [n! / (i!(n - i)!)] · (1 - t)^(n - i) · t^i · P_i;   t ∈ [0, 1]',
        engineeringImportance: 'Underpins all digital typography (PostScript, TrueType), automotive body styling, and CNC airfoil machining.',
        figureRef: 'Fig. DIG.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Using Too Many Anchor Nodes to Approximate a Smooth Curve',
        penalty: 'Loss of marks for inefficient, bumpy vector pathing in digital illustration.',
        avoidance: 'Always use the minimum number of nodes possible. Place nodes strictly at extrema (peaks, valleys, inflection points) and control curvature using the tangent handles.'
      }
    ]
  },

  // 15. QUADRILATERALS (RECTANGLES, SQUARES, RHOMBUSES, TRAPEZIA)
  'quadrilaterals': {
    title: 'Construction of Quadrilaterals: Rectangles, Squares, Rhombuses, and Trapezia',
    historicalContext: `The geometric construction of four-sided plane figures (quadrilaterals) forms an indispensable bridge between basic triangle construction and architectural/mechanical drafting. Codified comprehensively in Chapter 4 of J.N. Green's Technical Drawing for School Certificate and Chapter 3 of Pickup & Parker's Engineering Drawing with Worked Examples (Vol. 1), quadrilaterals are classified by their angular relationships and side parallelisms.
    
In West African technical education (WAEC Technical Drawing Paper 2), mastery of quadrilaterals requires students to construct shapes from diverse combinations of given data (e.g., base and altitude, diagonal and angle, or perimeter and aspect ratio) using strictly Euclidean compass arcs rather than protractor readings.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 4: Quadrilaterals and Polygons',
        pages: 'pp. 36–47',
        figureRefs: ['Fig. 4.1 (Rectangle ABCD)', 'Fig. 4.3 (Square on Given Diagonal)', 'Fig. 4.6 (Rhombus Construction)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A (Plane Geometry), NERDC SS1 Unit 7'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 3: Plane Geometry and Polygons',
        pages: 'pp. 22–31',
        figureRefs: ['Exercise 14 (Quadrilateral on Given Diagonal & Sides)', 'Exercise 16 (Trapezium with Given Angles)'],
        syllabusRelevance: 'City & Guilds and GCE Technical Drawing Examination Practice'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 4.1)',
        title: 'Construct a Rectangle ABCD given Base Length AB = 75mm and Altitude AD = 45mm',
        givenData: 'Base AB = 75mm, Altitude AD = 45mm, Corner angles = 90°.',
        constructionTheorem: 'In any Euclidean rectangle, opposite sides are equal and parallel, and adjacent sides meet at true perpendiculars (90°). Diagonals bisect each other and are of equal length.',
        steps: [
          'Step 1: Draw horizontal baseline AB = 75mm using T-Square with a fine 2H pencil.',
          'Step 2: At vertex A, erect a true 90° perpendicular using compass arcs (60° and 120° bisection).',
          'Step 3: From vertex A, step off altitude AD = 45mm along the perpendicular line using a precision divider or compass.',
          'Step 4: With center D and radius 75mm, swing an arc to the right. With center B and radius 45mm, swing an arc to intersect at vertex C.',
          'Step 5: Join BC and CD using a sharpened HB pencil to delineate the finished rectangle outline. Verify diagonal AC = √(75² + 45²) = 87.46mm.'
        ],
        waecExaminerTip: 'Do not use a protractor to erect the perpendicular at A; WAEC examiners award zero marks for the perpendicular if compass construction arcs are not visible.',
        figureRef: 'Fig. 4.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 4.1',
        title: 'Geometric Construction of Rectangle ABCD (J.N. Green Fig. 4.1)',
        caption: 'Accurate construction of rectangle ABCD on baseline AB showing 2H perpendicular construction arcs at A and diagonal check.',
        technicalNotes: [
          'Reference: J.N. Green Chapter 4, Fig. 4.1',
          'Base AB = 75.0mm, Height AD = 45.0mm',
          'Check diagonal AC = 87.5mm (within ±0.5mm)',
          'All corner right angles verified by 3-4-5 theorem or 60°/120° compass arc bisection'
        ],
        svgType: 'quadrilaterals',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green: Technical Drawing for School Certificate, Chapter 4'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Geometric Invariants and Symmetry of Quadrilaterals',
        paragraphs: [
          'The interior angle sum of any plane quadrilateral equals strictly (4 - 2) × 180° = 360°. In a parallelogram, consecutive angles are supplementary (θ + φ = 180°), and diagonals bisect one another.',
          'In engineering design, rectangles and squares serve as primary modular frames, datum reference boxes, and stock boundaries for sheet metal fabrication and structural components.'
        ],
        mathematicalFormulation: 'Σ ∠ = (n - 2) × 180° = 360°;   AC = √(AB² + BC²);   Area = L × H',
        engineeringImportance: 'Guarantees structural squareness, orthogonal fitment of structural members, and modular interchangeability.',
        figureRef: 'Fig. 4.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Failing to leave perpendicular construction arcs visible at vertex A',
        penalty: 'Loss of 3 to 4 marks in WAEC Paper 2.',
        avoidance: 'Always retain 2H compass arcs showing how the 90° angle was generated geometrically without a protractor.'
      }
    ]
  },

  // 16. EQUAL AREAS (TRANSFORMATION OF PLANE FIGURES)
  'equal-areas': {
    title: 'Equal Areas: Conversion of Plane Figures to Equivalent Rectangles and Triangles',
    historicalContext: `The mathematical discipline of converting irregular or triangular plane boundaries into equivalent squares and rectangles of equal area dates back to Euclid's Elements, Book II (Proposition 14, Quadrature of Rectilinear Figures). In practical technical drawing, as presented by J.N. Green in Chapter 7 and Pickup & Parker in Chapter 4, this concept is central to land surveying, architectural space distribution, and material estimation.
    
Engineers frequently convert irregular land plots, roof slopes, or structural plates into simple rectangular or triangular equivalents to calculate surface areas, volume of concrete pours, and aerodynamic skin drag without complex calculus.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 7: Equal Areas and Proportional Enlargement',
        pages: 'pp. 68–79',
        figureRefs: ['Fig. 7.1 (Triangle to Equivalent Rectangle)', 'Fig. 7.3 (Polygon to Equivalent Triangle)', 'Fig. 7.6 (Square Equal to Given Rectangle)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A (Plane Geometry), NERDC SS1 Unit 8'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 4: Areas of Plane Figures and Transformations',
        pages: 'pp. 38–49',
        figureRefs: ['Exercise 19 (Conversion of Triangle to Rectangle)', 'Exercise 21 (Polygon Reduction to Single Triangle)'],
        syllabusRelevance: 'GCE Advanced Level & WAEC Paper 2 Technical Drawing Standard'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 7.1)',
        title: 'Convert Triangle ABC into an Equivalent Rectangle ABED of Equal Area on the Same Base',
        givenData: 'Triangle ABC with base AB = 70mm, altitude h = 50mm.',
        constructionTheorem: 'Area(△ABC) = ½ × base × altitude. A rectangle on the same base AB has Area = base × height. For equal area, the rectangle height must equal half the triangle altitude (h/2).',
        steps: [
          'Step 1: Construct triangle ABC with base AB = 70mm and apex C at perpendicular height h = 50mm.',
          'Step 2: From apex C, drop a perpendicular to baseline AB meeting at F.',
          'Step 3: Bisect vertical altitude CF using compass arcs to establish midpoint M at height h/2 = 25mm.',
          'Step 4: Through M, draw a horizontal line parallel to base AB extending across both sides.',
          'Step 5: Erect perpendiculars at vertices A and B to intersect the horizontal line at D and E respectively.',
          'Step 6: Outline rectangle ABED in HB pencil. The surface area of rectangle ABED exactly equals the area of triangle ABC (1,750 mm²).'
        ],
        waecExaminerTip: 'Clearly label the half-altitude line M and ensure the altitude bisection arcs are distinct and un-erased.',
        figureRef: 'Fig. 7.1'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 7.1',
        title: 'Conversion of Triangle ABC to Equivalent Rectangle ABED (J.N. Green Fig. 7.1)',
        caption: 'Geometric construction demonstrating equal area transformation using the half-altitude principle on common base AB.',
        technicalNotes: [
          'Reference: J.N. Green Chapter 7, Fig. 7.1',
          'Triangle Base AB = 70mm, Altitude h = 50mm, Area = 1,750mm²',
          'Rectangle ABED: Base = 70mm, Height = 25mm, Area = 1,750mm²',
          '2H bisection arcs at altitude CF to locate midpoint M'
        ],
        svgType: 'equal-areas',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green: Technical Drawing for School Certificate, Chapter 7'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'The Cavalieri and Half-Altitude Equivalence Theorems',
        paragraphs: [
          'Triangles on the same base and between the same parallels are equal in area (Euclid I.37). Furthermore, a triangle with base b and altitude h has Area = ½·b·h, whereas a rectangle on the same base b has Area = b·H. Equating the two yields H = h/2.',
          'This allows any multi-sided polygon to be successively transformed into an equivalent triangle by drawing parallel diagonals, and subsequently into an equivalent rectangle or square for instant mechanical surface calculations.'
        ],
        mathematicalFormulation: 'Area(△) = ½ × b × h = b × (h/2) = Area(Rectangle);   H_{rect} = ½ h_{tri}',
        engineeringImportance: 'Essential in civil earthwork calculations, sheet-metal blank unfolding, and hydraulic cross-section equivalence.',
        figureRef: 'Fig. 7.1'
      }
    ],
    examinerTraps: [
      {
        trap: 'Erecting rectangle height equal to full triangle altitude h instead of h/2',
        penalty: 'Instant forfeiture of 8 marks for fundamental mathematical flaw in WAEC Paper 2.',
        avoidance: 'Remember that a triangle is half a rectangle; the equivalent rectangle must have height h/2.'
      }
    ]
  },

  // 17. ENLARGEMENT & REDUCTION OF PLANE FIGURES
  'enlargement-reduction': {
    title: 'Proportional Enlargement and Reduction of Plane Figures (Radial Line & Grid Methods)',
    historicalContext: `The scaling of technical drawings and architectural profiles is one of the oldest practical operations in descriptive geometry, formalized by J.N. Green (Chapter 7, Section B) and Pickup & Parker (Chapter 4). Before digital CAD zoom tools existed, draughtsmen relied on two primary geometric methods:
1. The Radial Line (Pole) Method, where lines radiate from a chosen pole through all vertices of the polygon.
2. The Method of Coordinates (Grid/Ordinate Method), used for irregular non-rectilinear shapes like ship hulls or cam profiles.
    
This principle guarantees strict geometric similarity: corresponding angles remain identical, while all linear dimensions scale by ratio k, and areas scale quadratically by k².`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 7: Equal Areas and Proportional Enlargement',
        pages: 'pp. 80–91',
        figureRefs: ['Fig. 7.8 (Radial Line Enlargement 3:2)', 'Fig. 7.11 (Reduction by Grid Method)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section A (Plane Geometry), NERDC SS1 Unit 9'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 4: Similarity and Proportional Scaling',
        pages: 'pp. 44–53',
        figureRefs: ['Exercise 22 (Radial Enlargement of Hexagon)', 'Exercise 24 (Reduction in Linear Ratio 5:3)'],
        syllabusRelevance: 'GCE / WAEC Technical Drawing Examination Standard'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 7.8)',
        title: 'Enlarge Quadrilateral ABCD in the Linear Ratio 3:2 using the Radial Line (Pole) Method',
        givenData: 'Quadrilateral ABCD with vertices A(20,20), B(50,15), C(45,40), D(15,35). Scale ratio = 3:2.',
        constructionTheorem: 'From an external or internal pole O, radial lines are projected through each vertex. By setting the linear ratio OA\'/OA = OB\'/OB = 3/2, new vertices A\', B\', C\', D\' are generated with corresponding sides strictly parallel to original sides.',
        steps: [
          'Step 1: Select a convenient pole O to the left or within quadrilateral ABCD.',
          'Step 2: Draw continuous thin 2H projection lines from pole O radiating through vertices A, B, C, and D and extend them outward.',
          'Step 3: Along ray OA, divide segment OA into 2 equal parts using the line division method. Step off a 3rd equal segment beyond A to locate vertex A\' (such that OA\'/OA = 3/2).',
          'Step 4: Through A\', draw a line parallel to AB (using sliding set squares) to intersect ray OB at vertex B\'.',
          'Step 5: Through B\', draw a line parallel to BC to intersect ray OC at vertex C\'. Through C\', draw parallel to CD to find D\'. Join D\'A\'.',
          'Step 6: Outline the enlarged figure A\'B\'C\'D\' in HB pencil. Verify that D\'A\' is parallel to DA.'
        ],
        waecExaminerTip: 'Ensure that sliding set square parallel lines are exact; examiners test whether corresponding edges A\'B\' and AB are parallel within ±0.5°.',
        figureRef: 'Fig. 7.8'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 7.8',
        title: 'Proportional Enlargement by Radial Line Method (J.N. Green Fig. 7.8)',
        caption: 'Enlargement of quadrilateral ABCD in ratio 3:2 from pole O showing radiating rays and parallel edge verification.',
        technicalNotes: [
          'Reference: J.N. Green Chapter 7, Fig. 7.8',
          'Linear Scale Factor k = 1.5 (3:2)',
          'Area Scale Factor = k² = 2.25 (Area enlarged 225%)',
          'Corresponding sides strictly parallel: A\'B\' ∥ AB, B\'C\' ∥ BC'
        ],
        svgType: 'enlargement-reduction',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green: Technical Drawing for School Certificate, Chapter 7'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Homothety, Similarity Axioms, and Quadratic Area Scaling',
        paragraphs: [
          'Under a homothety (central dilation) of scale factor k with respect to center O, any point P transforms to P\' such that OP\' = k·OP. Angles between intersecting line segments are strictly invariant, preserving the shape perfectly.',
          'While linear dimensions expand by factor k, the enclosed surface area expands by k²: Area(A\'B\'C\'D\') = k²·Area(ABCD). This distinction is critical in material stress calculations, fluid flow passages, and scale model wind-tunnel aerodynamics.'
        ],
        mathematicalFormulation: 'OP\' / OP = k;   Length\' = k × Length;   Area\' = k² × Area',
        engineeringImportance: 'Crucial for architectural blueprints, pantograph drafting instruments, and scaling casting patterns with shrinkage allowances.',
        figureRef: 'Fig. 7.8'
      }
    ],
    examinerTraps: [
      {
        trap: 'Confusing linear ratio (3:2) with area ratio in exam problem statements',
        penalty: 'Loss of up to 10 marks in WAEC Section A.',
        avoidance: 'Read carefully whether the question requests "linear ratio 3:2" (k = 1.5) or "area ratio 3:2" (k = √(1.5) ≈ 1.225).'
      }
    ]
  },

  // 18. AUXILIARY PROJECTIONS (ELEVATIONS AND PLANS)
  'auxiliary-projections': {
    title: 'Auxiliary Views: First and Second Auxiliary Elevations and Plans',
    historicalContext: `In standard first and third angle orthographic projection, principal planes of projection (vertical and horizontal) are parallel to the main faces of an object. However, when an engineering component features an inclined or oblique face, conventional orthographic views show that face foreshortened, disguising true angles, true lengths, and true shapes of holes or slots.
    
As codified by J.N. Green in Chapter 11 and Pickup & Parker in Chapter 7 of Engineering Drawing with Worked Examples (Vol. 1), the auxiliary projection method introduces a new auxiliary datum line (X1-Y1) parallel or perpendicular to the inclined face, allowing true dimensions and geometry to be projected cleanly for manufacturing.`,
    textbookReferences: [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Chapter 11: Auxiliary Projections',
        pages: 'pp. 132–145',
        figureRefs: ['Fig. 11.1 (Principle of Auxiliary Plane)', 'Fig. 11.4 (Auxiliary Elevation of Hexagonal Prism)', 'Fig. 11.7 (True Shape of Cut Face)'],
        syllabusRelevance: 'WAEC Technical Drawing Syllabus Section B (Solid Geometry), NERDC SS2 Unit 6'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples (Volume 1)',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Chapter 7: Auxiliary Views and True Shapes',
        pages: 'pp. 82–97',
        figureRefs: ['Exercise 49 (First Auxiliary Elevation)', 'Exercise 52 (Auxiliary Plan of Inclined Pyramid)'],
        syllabusRelevance: 'GCE Advanced / City and Guilds Engineering Drawing Standard'
      }
    ],
    workedExamples: [
      {
        exampleNumber: 'Worked Example 1 (J.N. Green Fig. 11.4)',
        title: 'Project the First Auxiliary Elevation of an Inclined Solid onto Datum X1-Y1 at 45°',
        givenData: 'Front elevation and plan of a regular hexagonal prism inclined at 30° to horizontal. Auxiliary datum line X1-Y1 set at 45°.',
        constructionTheorem: 'In any auxiliary elevation projected from a plan view, projection rays are drawn perpendicular (90°) to the new datum line X1-Y1. Vertical heights are transferred directly from the original front elevation datum X-Y.',
        steps: [
          'Step 1: Draw the given front elevation and plan of the hexagonal prism with reference to ground line X-Y.',
          'Step 2: Position the new ground line X1-Y1 at the specified angle (45°) to the horizontal plane near the plan view.',
          'Step 3: From every vertex of the plan view, draw fine continuous 2H projection lines perpendicular (90°) to X1-Y1 and extend them beyond.',
          'Step 4: Using a precision compass or divider, measure the vertical heights of all points in the front elevation above datum X-Y.',
          'Step 5: Transfer these measured heights along the corresponding projection lines above the new datum line X1-Y1 to plot the auxiliary vertices.',
          'Step 6: Connect corresponding points to form the visible and hidden edges of the auxiliary elevation. Outline in HB pencil.'
        ],
        waecExaminerTip: 'Always verify that projection lines intersect datum line X1-Y1 at exactly 90°. A set square placed against a straightedge along X1-Y1 ensures zero angular error.',
        figureRef: 'Fig. 11.4'
      }
    ],
    figures: [
      {
        figureNumber: 'Fig. 11.4',
        title: 'First Auxiliary Elevation of Inclined Solid (J.N. Green Fig. 11.4)',
        caption: 'First auxiliary elevation projected perpendicular to new inclined datum line X1-Y1 showing true vertical heights transferred from front elevation.',
        technicalNotes: [
          'Reference: J.N. Green Chapter 11, Fig. 11.4',
          'Projection rays ⊥ X1-Y1 (at 90°)',
          'True vertical heights h1, h2, h3 transferred directly from front elevation above X-Y',
          'Visible edges in HB; hidden edges in 0.35mm dashed Type E'
        ],
        svgType: 'auxiliary-projections',
        constructionGrade: '2H Construction & HB Outline',
        textbookSource: 'J.N. Green: Technical Drawing for School Certificate, Chapter 11'
      }
    ],
    theoreticalPrinciples: [
      {
        title: 'Mongean Descriptive Projection onto Non-Principal Planes',
        paragraphs: [
          'According to Gaspard Monge\'s descriptive geometry, an auxiliary plane is a plane perpendicular to one of the principal projection planes and inclined to the other. When projecting an auxiliary elevation, the line of sight is horizontal but oblique to the frontal plane.',
          'Consequently, all plan view positions remain identical, projection rays are orthogonal to the new datum X1-Y1, and all vertical distances above the datum are strictly preserved.'
        ],
        mathematicalFormulation: 'h_{aux} = h_{elevation};   Ray ⊥ X_1-Y_1;   True Angle = \\arctan(\\Delta h / \\Delta d)',
        engineeringImportance: 'Indispensable for drafting pipe bends, turbine stator blades, aircraft fuselage bulkheads, and sheet-metal hopper transitions.',
        figureRef: 'Fig. 11.4'
      }
    ],
    examinerTraps: [
      {
        trap: 'Measuring heights from the plan view instead of the front elevation',
        penalty: 'Complete inversion of projection; total loss of marks for the auxiliary view in WAEC Paper 2.',
        avoidance: 'Rule of thumb: "Project from the Plan, measure heights from the Elevation".'
      }
    ]
  }
};

