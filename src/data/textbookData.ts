import { DrawingTopic } from '../types/curriculum';
import { 
  TextbookChapter, 
  ExaminerTrap, 
  PracticeProblem,
  ProceduralMethodStep,
  TextbookFigure
} from '../types/textbook';
import { 
  textbookCurriculumDatabase, 
  STANDARD_ISO_LINE_TABLE 
} from './curriculumReferenceTextbook';

export function resolveCurriculumDomainKey(topic: DrawingTopic): string {
  const id = (topic.id || '').toLowerCase();
  const title = (topic.title || '').toLowerCase();
  const cat = (topic.category || '').toLowerCase();

  // 1. Technical Foundations
  if (id === 'ss1-intro-technical-drawing' || id.includes('intro-technical')) return 'intro-drawing';
  if (id === 'ss1-safety-instruments' || id.includes('safety') || id.includes('equipment')) return 'instruments';
  if (id === 'ss1-board-practice' || id.includes('board-practice') || id.includes('paper-fixing') || id.includes('title-block')) return 'board-practice';
  if (id === 'ss1-lines-conventions' || id.includes('lines-convention') || (id.includes('line') && id.includes('convention'))) return 'lines';
  if (id === 'ss1-lettering-numbering' || id.includes('lettering') || id.includes('numbering')) return 'lettering';

  // 2. SS1 Geometric Construction
  if (id === 'ss1-bisect-line') return 'bisection';
  if (id === 'ss1-bisect-angle' || id.includes('bisect-angle') || title.includes('bisect angle') || title.includes('bisection of an angle') || title.includes('bisecting an angle')) return 'angles';
  if (id === 'ss1-divide-line-proportional' || id.includes('divide-line') || id.includes('proportional')) return 'division-of-line';
  if (id === 'ss1-angles-construction' || id.includes('angles-construction') || title.includes('standard angles')) return 'angles';
  if (id === 'ss1-triangles-construction' || id === 'ss2-inscribed-circumscribed-circles' || id.includes('triangle')) return 'triangles';
  if (id.includes('pentagon') || title.includes('pentagon')) return 'pentagon';
  if (id.includes('hexagon') || id.includes('polygon') || id.includes('octagon')) return 'polygons';
  if (id.includes('quadrilateral') || id.includes('rectangle') || id.includes('rhombus') || id.includes('trapezium') || title.includes('quadrilateral')) return 'quadrilaterals';
  if (id.includes('equal-area') || id.includes('equivalent-rectangle') || title.includes('equal area')) return 'equal-areas';
  if (id.includes('enlargement') || id.includes('reduction') || title.includes('enlargement')) return 'enlargement-reduction';
  if (id.includes('plain-scale') || id.includes('diagonal-scale') || id.includes('scale')) return 'scales';

  // 3. SS2 Tangency, Curves & Loci
  if (id === 'ss2-tangency-external' || id === 'ss2-tangency-internal' || id === 'ss2-tangent-blend-ogee' || id.includes('tangent') || id.includes('ogee')) return 'tangency';
  if (id.includes('ellipse') || id.includes('parabola') || id.includes('conic')) return 'conics';
  if (id.includes('involute') || id.includes('spiral') || id.includes('cycloid') || id.includes('loci')) return 'loci';
  if (id.includes('auxiliary') || title.includes('auxiliary')) return 'auxiliary-projections';

  // 4. SS3 & Higher Projections
  if (id.includes('third-angle') || id === 'ss3-third-angle-orthographic') return 'orthographic-third-angle';
  if (id === 'ss3-orthographic-projection' || id.includes('orthographic')) return 'orthographic';
  if (id.includes('isometric')) return 'isometric';
  if (id.includes('oblique') || id.includes('cavalier') || id.includes('cabinet')) return 'oblique';
  if (id.includes('sectional') || id.includes('true-shape') || id.includes('section')) return 'sections';
  if (id.includes('true-length') || id.includes('revolving') || id.includes('perspective')) return 'orthographic';

  // 5. Developments & Interpenetration
  if (id.includes('surface-dev') || id.includes('development')) return 'development';
  if (id.includes('interpenetration') || id.includes('intersection')) return 'interpenetration';

  // 6. Fasteners, Machine & Assembly
  if (id === 'higher-machine-threads-fasteners' || id.includes('fastener') || id.includes('thread') || id.includes('bolt')) return 'fasteners';
  if (id === 'higher-machine-plummer-block' || id === 'higher-machine-flanged-coupling' || id.includes('plummer') || id.includes('coupling') || cat.includes('machine')) return 'machine-assembly';

  // 7. Building & Architecture
  if (id === 'ss3-building-roof-truss' || id.includes('roof-truss') || id.includes('truss')) return 'roof-truss';
  if (id === 'ss3-building-floor-plan' || id.includes('floor-plan') || id.includes('foundation') || cat.includes('building')) return 'building';

  // 8. CAD & Digital Graphics
  if (id.includes('autocad') || id.includes('cad-precision') || id.includes('cad') || cat.includes('computer_aided_design')) return 'cad';
  if (id.includes('coreldraw') || id.includes('bezier') || id.includes('digital-isometric') || cat.includes('digital_graphics')) return 'digital-graphics';

  return 'bisection';
}

export { STANDARD_ISO_LINE_TABLE };

export function getTextbookChapterForTopic(topic: DrawingTopic): TextbookChapter {
  const domainKey = resolveCurriculumDomainKey(topic);
  const refData = textbookCurriculumDatabase[domainKey] || textbookCurriculumDatabase['bisection'];

  // 1. Determine vector diagram category
  let vectorType: TextbookChapter['vectorDiagramType'] = 'GENERIC_ENGINEERING';
  if (topic.id.includes('border') || topic.id.includes('title-block') || topic.id.includes('intro')) {
    vectorType = 'BORDER_AND_TITLE_BLOCK';
  } else if (topic.id.includes('line') && (topic.id.includes('type') || topic.id.includes('intro'))) {
    vectorType = 'LINE_TYPES_SPECIMEN';
  } else if (topic.id.includes('bisect-line') || topic.id.includes('divide-line')) {
    vectorType = 'BISECTION_LINE';
  } else if (topic.id.includes('bisect-angle') || topic.id.includes('angle')) {
    vectorType = 'BISECTION_ANGLE';
  } else if (topic.id.includes('polygon') || topic.id.includes('pentagon') || topic.id.includes('hexagon') || topic.id.includes('octagon')) {
    vectorType = 'REGULAR_POLYGON';
  } else if (topic.id.includes('tangent') || topic.id.includes('arc') || topic.id.includes('inscribe') || topic.id.includes('circumscribe')) {
    vectorType = 'TANGENCY_EXTERNAL_INTERNAL';
  } else if (topic.id.includes('ellipse')) {
    vectorType = 'CONIC_ELLIPSE_CONCENTRIC';
  } else if (topic.id.includes('parabola') || topic.id.includes('hyperbola')) {
    vectorType = 'CONIC_PARABOLA';
  } else if (topic.id.includes('third-angle')) {
    vectorType = 'ORTHOGRAPHIC_THIRD_ANGLE';
  } else if (topic.id.includes('orthographic') || topic.id.includes('first-angle')) {
    vectorType = 'ORTHOGRAPHIC_FIRST_ANGLE';
  } else if (topic.id.includes('isometric') || topic.id.includes('oblique') || topic.id.includes('axonometric')) {
    vectorType = 'ISOMETRIC_BOX_AND_CIRCLE';
  } else if (topic.id.includes('development') || topic.id.includes('interpenetration')) {
    vectorType = 'SURFACE_DEVELOPMENT';
  } else if (topic.id.includes('section') || topic.id.includes('hatch')) {
    vectorType = 'SECTIONING_AND_HATCH';
  } else if (topic.id.includes('bolt') || topic.id.includes('nut') || topic.id.includes('fastener') || topic.id.includes('thread')) {
    vectorType = 'FASTENERS_HEX_BOLT';
  } else if (topic.id.includes('building') || topic.id.includes('wall') || topic.id.includes('foundation') || topic.id.includes('roof')) {
    vectorType = 'BUILDING_FOUNDATION_WALL';
  } else if (topic.id.includes('cad') || topic.id.includes('command') || topic.id.includes('coordinate')) {
    vectorType = 'CAD_COORDINATE_SYSTEM';
  } else if (topic.id.includes('bezier') || topic.id.includes('vector') || topic.id.includes('spline')) {
    vectorType = 'DIGITAL_BEZIER_CURVE';
  }

  // 2. Build Figures from Curriculum Reference Data with fallbacks
  const figures: TextbookFigure[] = [];
  const defaultSource = (topic.id.includes('higher') || topic.id.includes('ss3') || topic.title.toLowerCase().includes('orthographic') || topic.title.toLowerCase().includes('isometric'))
    ? 'Pickup & Parker: Engineering Drawing with Worked Examples'
    : 'J.N. Green: Technical Drawing for Schools';

  if (refData.figures && refData.figures.length > 0) {
    refData.figures.forEach((fig) => {
      figures.push({
        ...fig,
        textbookSource: fig.textbookSource || defaultSource
      });
    });
  } else {
    figures.push({
      figureNumber: 'Fig. 1.1',
      title: `${topic.title} — Technical Drawing Plate`,
      caption: `Standard geometric construction plate illustrating fundamental layout according to ${defaultSource}.`,
      dimensions: ['Scale 1:1', 'Tolerance ±0.5mm'],
      technicalNotes: ['2H fine construction arcs', 'HB finished outline', 'ISO 128 compliant'],
      svgType: 'bisection',
      constructionGrade: '2H Construction & HB Outline',
      textbookSource: defaultSource
    });
  }

  // 3. Procedural steps from topic with default parameters passed
  const defaultParams = topic.parameters?.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {}) || {};
  const steps = topic.generateSteps(defaultParams);
  const numberedMethod: ProceduralMethodStep[] = steps.map((s, idx) => {
    let toolAction = 'Align T-Square firmly against the left working edge of the drafting board and draw continuous 2H baseline.';
    let pencilGrade: ProceduralMethodStep['pencilGrade'] = '2H';
    let lineSpec = 'Continuous Thin Line (0.25mm, ISO 128 Type B)';

    if (idx === 0) {
      toolAction = 'Position the drawing sheet 20mm from left and bottom board edges. Secure corners with drafting tape. Align T-square to draw datum axis.';
      pencilGrade = '2H';
    } else if (idx === steps.length - 1) {
      toolAction = 'Using a sharpened HB pencil or technical drawing pen (0.5mm), trace over the final geometric outline with a single continuous stroke.';
      pencilGrade = 'HB';
      lineSpec = 'Continuous Thick Line (0.50mm - 0.70mm, ISO 128 Type A)';
    } else if (s.activeInstrument?.toolType === 'COMPASS') {
      toolAction = `Set steel needle of compass precisely at designated center point. Adjust lead to radius R = ${s.activeInstrument.radius || 50}mm and swing arc lightly.`;
      pencilGrade = '2H';
    } else if (s.activeInstrument?.toolType === 'SET_SQUARE_30_60' || s.activeInstrument?.toolType === 'SET_SQUARE_45') {
      toolAction = 'Place set square firmly on top of the T-Square blade. Slide horizontally to target coordinate and draw projection line.';
      pencilGrade = '2H';
    }

    const stepFigureNumber = figures[idx % figures.length]?.figureNumber || `Fig. 1.${idx + 1}`;

    return {
      stepNumber: idx + 1,
      heading: s.title,
      detailedDescription: s.instruction + (s.detailedNotes ? ` ${s.detailedNotes}` : '') + ` (Refer to ${stepFigureNumber}).`,
      instrumentAction: toolAction,
      lineSpecification: lineSpec,
      pencilGrade: pencilGrade,
      qualityCheck: `Ensure point of intersection is sharp and distinct with no graphite double-tracing. Tolerance must remain within ±0.5mm.`,
      figureRef: stepFigureNumber,
      figure: {
        figureNumber: `Step ${idx + 1} Fig.`,
        title: s.title,
        caption: `Vector state for Step ${idx + 1}: ${s.instruction}`,
        technicalNotes: [
          `Active Instrument: ${s.activeInstrument?.toolType || 'T-SQUARE / STRAIGHTEDGE'}`,
          `Line Spec: ${lineSpec}`,
          `Pencil: ${pencilGrade}`
        ],
        elements: s.elements,
        constructionGrade: pencilGrade === 'HB' ? 'HB Final Outline' : '2H Construction'
      }
    };
  });

  // 4. Practice Problems
  const practiceProblems: PracticeProblem[] = [
    {
      questionNumber: 1,
      problemText: `Using standard drawing instruments, construct the complete geometric layout for "${topic.title}" adhering strictly to J.N. Green and Pickup & Parker methodologies and ISO 128 conventions.`,
      specifications: 'Sheet size: A3 cartridge paper; Margin: 10mm border all round (20mm binding edge); Pencil: 2H for construction, HB for finished outline.',
      marks: 15
    },
    {
      questionNumber: 2,
      problemText: `Given a primary baseline parameter of ${topic.parameters?.[0]?.defaultValue || 100}${topic.parameters?.[0]?.unit || 'mm'}, execute the step-by-step construction. Show all construction arcs and dimension the final geometry fully according to ISO 129.`,
      specifications: 'Include complete 70x30mm title block containing Name, Class/Grade, Date, Scale 1:1, and Drawing Number TD-EXAM-01.',
      marks: 20
    },
    {
      questionNumber: 3,
      problemText: `State three practical industrial applications of ${topic.title} in mechanical, civil, or architectural engineering, and explain why construction line visibility is mandatory in WAEC technical examinations.`,
      specifications: 'Written response on reverse side of drawing sheet or in theory logbook (max 250 words).',
      marks: 10
    }
  ];

  return {
    topicId: topic.id,
    moduleCode: topic.moduleCode,
    title: topic.title,
    tier: topic.tier,
    historicalContext: refData.historicalContext || `Technical drawing principles for ${topic.title} derived from foundational geometry and British Standard BS 308 / ISO 128 conventions as codified by J.N. Green and F. Pickup & M.A. Parker.`,
    textbookReferences: refData.textbookReferences || [
      {
        bookTitle: 'Technical Drawing for School Certificate & G.C.E. (Metric Edition)',
        author: 'J.N. Green',
        edition: '3rd Metric Edition, Evans Brothers Ltd',
        chapter: 'Core Geometric Constructions',
        pages: 'Standard Curriculum Reference',
        syllabusRelevance: 'WAEC / NERDC Syllabus'
      },
      {
        bookTitle: 'Engineering Drawing with Worked Examples',
        author: 'F. Pickup & M.A. Parker',
        edition: '3rd Edition, Nelson Thornes',
        chapter: 'Plane and Solid Geometry',
        pages: 'Standard Engineering Practice',
        syllabusRelevance: 'G.C.E. / WAEC Technical Drawing'
      }
    ],
    workedExamples: refData.workedExamples || [],
    figures: figures,
    theoreticalPrinciples: (refData.theoreticalPrinciples as any) || [
      {
        title: 'Geometric Theory and Construction Axioms',
        paragraphs: [
          `In technical graphics, "${topic.title}" relies upon strict Euclidean and Cartesian relationships as articulated in J.N. Green and Pickup & Parker. Every line, curve, and tangent point is mathematically determined rather than artistically approximated.`,
          `All geometric entities are referenced to an established baseline or centerline datum to ensure dimensional repeatability across manufacturing and construction.`
        ],
        mathematicalFormulation: topic.theory?.formulas?.[0]?.latex || '\\Delta L \\le \\pm 0.5\\text{ mm}',
        engineeringImportance: 'Guarantees seamless dimensional compatibility in engineering components.',
        figureRef: figures[0]?.figureNumber || 'Fig. 1.1',
        figure: figures[0]
      }
    ],
    proceduralMethodology: {
      prerequisites: [
        'Proficiency in mounting drawing paper square with the board using a T-Square',
        'Familiarity with ISO 128 standard line types (Continuous Thick, Thin, Dashed, Chain)',
        'Ability to sharpen 2H/3H pencils to a clean conical/chisel point'
      ],
      instrumentSetup: [
        'Technical Drawing Board (Imperial or A3 format) with smooth hardwood working edge',
        'T-Square with blade securely fastened to stock at exact 90°',
        'Pair of Acrylic Set Squares (30°/60° and 45° with beveled inking edge)',
        'Precision Engineering Compass with micrometer screw adjustment and Divider',
        '300mm Triangular Scale Rule (Scales 1:1, 1:2, 1:5, 1:10, 1:20, 1:50, 1:100)'
      ],
      numberedMethod: numberedMethod,
      examinerTraps: (refData.examinerTraps as any) || [
        {
          trap: 'Erasing Geometric Construction Lines',
          penalty: 'Loss of 40% to 50% of allocated question marks in WAEC Paper 2.',
          avoidance: 'Never erase construction arcs, bisectors, or projection rays. Keep them faint (2H pencil, 0.25mm) so they do not compete with the HB outline.'
        },
        {
          trap: 'Inconsistent Line Weights and Double-Tracking',
          penalty: 'Deduction of 2 marks for defective line work and poor craftsmanship.',
          avoidance: 'Keep pencil lead sharp. Draw each line in a single confident, continuous stroke.'
        }
      ]
    },
    standardConventions: {
      isoStandardNumber: topic.standards.isoRef || 'ISO 128-20 / ISO 129-1',
      nerdcCurriculumClause: topic.standards.nerdcRef || 'NERDC Technical Drawing Curriculum Standard',
      waecMarkingKey: topic.standards.waecRef || 'WAEC Technical Drawing Paper 2 Mark Scheme',
      lineWeightTable: STANDARD_ISO_LINE_TABLE,
      dimensioningRules: [
        'Dimension lines must be continuous thin lines (0.25mm) placed at least 10mm away from object outlines.',
        'Extension lines must project 2mm to 3mm beyond the arrowhead of the dimension line.',
        'Arrowheads must have a length-to-width ratio of 3:1 and be neatly filled with dark graphite.',
        'Dimension numbers must never touch or cross any drawing line; leave a 1mm clearance gap.',
        'All linear dimensions on engineering drawings are assumed to be in millimeters (mm) unless explicitly noted.'
      ],
      sheetLayoutRules: [
        'Standard Margin: 10mm border on top, right, and bottom; 20mm margin on left edge for binding / filing.',
        'Title Block Location: Bottom right-hand corner of the drawing sheet (Standard ISO size: 70mm x 30mm or 170mm x 65mm).',
        'Projection Symbol: The truncated cone symbol for 1st Angle or 3rd Angle projection must be clearly drawn inside the title block.',
        'Lettering Standard: Single-stroke uppercase Gothic lettering complying with ISO 3098 (Titles: 5mm/7mm; Dimensions & notes: 3.5mm).'
      ]
    },
    vectorDiagramType: vectorType,
    caption: `ISO 128 Technical Vector Blueprint: ${topic.title} (${topic.moduleCode}) — Ref: J.N. Green & Pickup & Parker`,
    technicalNotes: [
      `Reference Standard: ${topic.standards.isoRef}`,
      `Examiner Ref: ${topic.standards.waecRef}`,
      `Dimensional Tolerance: ±0.5mm`,
      `Grid Coordinate System: Absolute Cartesian (Origin at sheet lower-left datum)`
    ],
    practiceProblems: practiceProblems
  };
}
