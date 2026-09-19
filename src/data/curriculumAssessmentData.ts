import { DrawingTopic, TopicSelfAssessment, AssessmentMCQ, PracticalDrawingTask } from '../types/curriculum';

// Helper to determine whether a topic is purely theoretical vs practical/construction
export function isTheoreticalTopic(topic?: DrawingTopic | null): boolean {
  if (!topic) return true;
  if (topic.category === 'TECHNICAL_FOUNDATIONS') return true;
  const tId = (topic.id || '').toLowerCase();
  const tTitle = (topic.title || '').toLowerCase();
  if (
    tId.includes('intro') ||
    tId.includes('safety') ||
    tId.includes('instrument') ||
    tId.includes('lines-conventions') ||
    tId.includes('lettering') ||
    tId.includes('scales-dimension') ||
    tTitle.includes('introduction') ||
    tTitle.includes('safety') ||
    tTitle.includes('instruments') ||
    tTitle.includes('line conventions') ||
    tTitle.includes('lettering and numbering') ||
    tTitle.includes('scales and dimensioning')
  ) {
    return true;
  }
  return false;
}

// CURATED ASSESSMENTS FOR CORE TOPICS
export const CURATED_TOPIC_ASSESSMENTS: Record<string, TopicSelfAssessment> = {
  // 1. INTRODUCTION TO TECHNICAL DRAWING (THEORY: 5 MCQs)
  'ss1-intro-technical-drawing': {
    topicId: 'ss1-intro-technical-drawing',
    format: 'THEORY_5_MCQ',
    passScorePercentage: 70,
    mcqs: [
      {
        id: 'intro-q1',
        question: 'Why is Technical Drawing universally defined as the "universal language of engineering"?',
        options: [
          'Because it relies strictly on spoken instructions and written essays',
          'Because it uses standardized graphic symbols, line conventions, and mathematical scales understood across all international engineering disciplines without linguistic ambiguity',
          'Because it is exclusively designed for artistic oil paintings and aesthetic expression',
          'Because it avoids all geometric dimensions and projection rules'
        ],
        correctIndex: 1,
        explanation: 'Technical drawing provides an unambiguous graphic syntax governed by international standards (ISO / BS / NERDC) so that fabricators worldwide produce parts to exact specifications.',
        waecReference: 'WAEC Syllabus Section 1.1 / NERDC SS1 Wk 1'
      },
      {
        id: 'intro-q2',
        question: 'According to ISO 5457 standards, what are the exact millimeter dimensions of an A3 drawing sheet commonly used in Nigerian secondary schools?',
        options: [
          '210 mm × 297 mm',
          '594 mm × 841 mm',
          '297 mm × 420 mm',
          '420 mm × 594 mm'
        ],
        correctIndex: 2,
        explanation: 'ISO 216 / ISO 5457 designates A3 sheet dimensions as 297 mm × 420 mm (ratio 1:√2). A4 is 210 × 297 mm, and A2 is 420 × 594 mm.',
        waecReference: 'WAEC TD Paper 1 (Objective) 2021 Q3'
      },
      {
        id: 'intro-q3',
        question: 'What is the primary function of the Title Block positioned in the bottom right corner of a technical drawing sheet?',
        options: [
          'To state the project title, student name, admission number, scale, date, projection symbol, and institutional approval',
          'To provide scratch space for testing pencil lead sharpness',
          'To serve as an ornamental border for decorative embellishment',
          'To list personal diary entries and unrelated calculations'
        ],
        correctIndex: 0,
        explanation: 'Under ISO 7200, the Title Block contains all legal and administrative metadata identifying the drawing, scale, designer, projection angle, and drawing number.',
        waecReference: 'NERDC SS1 Module 1 / ISO 7200'
      },
      {
        id: 'intro-q4',
        question: 'Which pencil grade is mathematically optimized for drawing faint initial construction lines (0.25mm line weight) that can be easily erased or overlooked?',
        options: [
          '6B soft lead pencil',
          'HB medium outline pencil',
          '2B sketch artist pencil',
          '2H or 3H hard lead pencil'
        ],
        correctIndex: 3,
        explanation: 'Hard pencils (2H, 3H, 4H) contain higher clay content, producing sharp, faint, clean lines that will not smudge during drafting.',
        waecReference: 'WAEC Syllabus Instrument Care & Grading'
      },
      {
        id: 'intro-q5',
        question: 'When fastening a drawing sheet to the drafting board using drafting tape, what is the mandatory alignment procedure with the T-square?',
        options: [
          'Align sheet diagonally at 45° to the board edge',
          'Hold the T-square stock firmly against the left working edge of the board, rest the top edge of the sheet on the blade, and tape the four corners tautly',
          'Fasten tape first and then adjust the board legs to match',
          'Use thumb tacks driven straight through the center of the sheet'
        ],
        correctIndex: 1,
        explanation: 'The T-square stock must be firmly seated against the true left working edge to ensure all drawn horizontal baselines remain strictly parallel across the paper.',
        waecReference: 'NERDC SS1 Week 2 / WAEC Practical Manual'
      }
    ]
  },

  // 2. TYPES OF LINES & LINE CONVENTIONS (THEORY: 5 MCQs)
  'ss1-lines-conventions': {
    topicId: 'ss1-lines-conventions',
    format: 'THEORY_5_MCQ',
    passScorePercentage: 70,
    mcqs: [
      {
        id: 'lines-q1',
        question: 'According to ISO 128 / BS 8888, which line type and nominal thickness must be used for visible outlines and finished object contours?',
        options: [
          'Continuous Thin line (0.25 mm)',
          'Continuous Thick line (0.5 mm - 0.7 mm)',
          'Thin Dashed line (0.25 mm)',
          'Long Chain line (0.25 mm)'
        ],
        correctIndex: 1,
        explanation: 'Visible outlines are drawn with Continuous Thick lines (0.5mm - 0.7mm, Type A) using an HB pencil so the finished product immediately stands out from construction lines.',
        waecReference: 'WAEC TD Paper 1 (2022 Q5) / ISO 128-20'
      },
      {
        id: 'lines-q2',
        question: 'What is the correct representation and application of a "Thin Chain Line" (Type G: long dash, dot, long dash)?',
        options: [
          'Used for hidden interior bores and holes',
          'Used for visible outlines and edges',
          'Used for centerlines, axes of symmetry, and pitch circles of gears',
          'Used exclusively for dimension extension lines'
        ],
        correctIndex: 2,
        explanation: 'Thin Chain lines (Type G) represent symmetrical centerlines and pitch circles, drawn with a 2H pencil with approximately 10-15mm long dashes separated by 1mm gaps and dots.',
        waecReference: 'NERDC SS1 Curriculum / ISO 128-24'
      },
      {
        id: 'lines-q3',
        question: 'How should hidden edges and concealed outlines be drafted according to technical drawing standards?',
        options: [
          'Continuous Thick wavy lines',
          'Thin Dashed lines (0.25 mm) with uniform dashes of 3 mm length and 1 mm gaps',
          'Double parallel lines drawn in red ink',
          'Dotted lines with irregular spacing'
        ],
        correctIndex: 1,
        explanation: 'Hidden features (Type F) use short, closely spaced dashes of uniform length (approx 3mm) and 1mm gap, starting and terminating crisply against solid outlines.',
        waecReference: 'WAEC TD Paper 1 2020 Q8'
      },
      {
        id: 'lines-q4',
        question: 'Where two hidden detail dashed lines meet at a corner, what is the mandatory convention?',
        options: [
          'They must leave an open gap at the intersection',
          'They must cross over each other and extend by 10mm',
          'The dashes must meet cleanly at the corner without leaving a gap',
          'A solid circle must be drawn at the intersection'
        ],
        correctIndex: 2,
        explanation: 'ISO 128 dictates that dashes must join solidly at corners and intersections to define the true geometric vertex of the hidden edge.',
        waecReference: 'BS 8888 / WAEC Examiner Report'
      },
      {
        id: 'lines-q5',
        question: 'Which line type is used to indicate a Cutting Plane when producing sectional elevations?',
        options: [
          'Thin chain line throughout without modifications',
          'Continuous wavy freehand line',
          'Thin chain line with THICK ends and arrows indicating direction of viewing',
          'Double continuous thick lines'
        ],
        correctIndex: 2,
        explanation: 'Cutting planes (Type H) are thin chain lines thickened at the ends and bends, accompanied by directional arrows and identification letters (e.g. Section A-A).',
        waecReference: 'WAEC Sectional Views Syllabus SS3'
      }
    ]
  },

  // 3. BISECTION OF STRAIGHT LINES & ANGLES (HYBRID: 2 MCQs + 3 PRACTICAL TASKS)
  'ss1-bisect-line': {
    topicId: 'ss1-bisect-line',
    format: 'HYBRID_PRACTICAL',
    passScorePercentage: 70,
    mcqs: [
      {
        id: 'bisect-mcq1',
        question: 'What is the mandatory geometric requirement for the compass radius "r" when bisecting a line segment AB of length 100mm?',
        options: [
          'Radius r must be smaller than 25mm (r < AB / 4)',
          'Radius r must be strictly greater than half the length of AB (r > 50mm)',
          'Radius r must be exactly equal to AB / 3',
          'Radius r must be zero'
        ],
        correctIndex: 1,
        explanation: 'If the radius is equal to or less than half of AB, the circular loci from A and B will either touch at a single point or not intersect at all, failing to create the two bisection points.',
        waecReference: 'WAEC TD Paper 2 (Practical) Geometric Bisection'
      },
      {
        id: 'bisect-mcq2',
        question: 'What is the angle formed between the original line segment AB and its perpendicular bisector CD?',
        options: [
          '45 degrees',
          '60 degrees',
          'Strictly 90 degrees (right angle)',
          '180 degrees'
        ],
        correctIndex: 2,
        explanation: 'A perpendicular bisector simultaneously divides the line segment into two equal halves (AM = MB) and forms four congruent 90° right angles at the midpoint M.',
        waecReference: 'NERDC SS1 Plane Geometry / Theorem 1'
      }
    ],
    practicalTasks: [
      {
        id: 'bisect-task1',
        taskNumber: 3,
        taskTitle: 'Perpendicular Bisection of a 100mm Horizontal Line',
        taskPrompt: 'On the Interactive Drawing Board, construct the perpendicular bisector of a horizontal line AB of length 100mm using a compass and straightedge.',
        specifications: [
          'Draw horizontal baseline AB = 100mm with 2H pencil (Continuous Thin).',
          'Set compass radius to r = 65mm (> AB/2). Center at A, strike arcs above and below AB.',
          'With the same compass radius, center at B, strike intersecting arcs to locate points C and D.',
          'Join C and D with a sharp HB line to produce the true perpendicular bisector passing through midpoint M.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Midpoint M located at exactly 50mm from A and B; perpendicular bisector CD intersecting at 90°.'
      },
      {
        id: 'bisect-task2',
        taskNumber: 4,
        taskTitle: 'Bisection of an Acute Angle of 60° into Two 30° Sectors',
        taskPrompt: 'Construct an angle of 60° at apex O and bisect it accurately into two equal 30° angles using compass arcs.',
        specifications: [
          'Draw baseline OA = 80mm with 2H pencil.',
          'From O, strike an arc of convenient radius intersecting OA at P. From P with same radius, cut arc at Q to establish the 60° line OB.',
          'From points P and Q as centers, strike equal radius intersecting arcs to establish bisector point R.',
          'Draw ray OR from apex O passing through point R. Verify angle AOR = 30° and ROB = 30°.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'True 30° angle bisection verified with clean, faint 2H construction arcs.'
      },
      {
        id: 'bisect-task3',
        taskNumber: 5,
        taskTitle: 'Divide a Line Segment PQ = 120mm into 5 Equal Segments',
        taskPrompt: 'Use the parallel line projection method to divide a line segment PQ = 120mm into exactly 5 equal parts without measuring with a ruler.',
        specifications: [
          'Draw line PQ = 120mm horizontally with 2H pencil.',
          'From P, draw an acute line PR inclined at approximately 30° to PQ.',
          'Using a pair of dividers set to any convenient step, step off 5 equal intervals along PR (1, 2, 3, 4, 5).',
          'Join point 5 to Q with a 2H line.',
          'Using set squares, slide parallel lines from points 4, 3, 2, and 1 to intersect PQ, dividing PQ into 5 equal 24mm segments.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'SET_SQUARE_30_60',
        expectedOutcome: '5 congruent segments of 24.0mm along PQ with accurate parallel projection lines.'
      }
    ]
  },

  // 4. CONSTRUCTION OF SPECIAL ANGLES (HYBRID: 2 MCQs + 3 PRACTICAL TASKS)
  'ss1-angles-construction': {
    topicId: 'ss1-angles-construction',
    format: 'HYBRID_PRACTICAL',
    passScorePercentage: 70,
    mcqs: [
      {
        id: 'ang-mcq1',
        question: 'Which of the following angles CANNOT be constructed using only a pair of compasses and a straightedge without a protractor?',
        options: [
          '45 degrees (half of 90°)',
          '75 degrees (bisect 60° to 90° interval)',
          '50 degrees',
          '105 degrees (90° + 15°)'
        ],
        correctIndex: 2,
        explanation: 'Using compass and straightedge, only angles that are multiples of 15° (15°, 30°, 45°, 60°, 75°, 90°, 105°, 120°, 135°, 150°) can be constructed directly.',
        waecReference: 'WAEC TD 2021 Question 1(a)'
      },
      {
        id: 'ang-mcq2',
        question: 'In the construction of a 75° angle at point A on baseline AB, which two established rays are bisected?',
        options: [
          'The 0° baseline and the 60° ray',
          'The 60° ray and the 90° perpendicular ray',
          'The 90° ray and the 120° ray',
          'The 45° ray and the 60° ray'
        ],
        correctIndex: 1,
        explanation: '75° is exactly halfway between 60° and 90° (60° + 15° = 75°). Bisecting the 30° interval between the 60° and 90° rays produces the required 75° ray.',
        waecReference: 'NERDC SS1 Week 4 Angle Theorems'
      }
    ],
    practicalTasks: [
      {
        id: 'ang-task1',
        taskNumber: 3,
        taskTitle: 'Construct Angles 60° and 30° at Origin Point A',
        taskPrompt: 'Construct a 60° angle at vertex A on a 90mm baseline AB using only a compass, and bisect it to generate a 30° angle.',
        specifications: [
          'Draw baseline AB = 90mm with 2H pencil.',
          'With center A and radius 50mm, draw arc cutting AB at point 1.',
          'With center 1 and the same radius, cut the arc at point 2. Line joining A through 2 gives 60°.',
          'Bisect the 0°-60° sector from points 1 and 2 to draw the 30° ray with HB pencil.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Distinct 30° and 60° rays with clear construction arcs and angle labels.'
      },
      {
        id: 'ang-task2',
        taskNumber: 4,
        taskTitle: 'Construct a 90° Perpendicular and Bisect to 45°',
        taskPrompt: 'Construct a strict 90° perpendicular at end point A of baseline AB, and bisect it to produce a 45° angle.',
        specifications: [
          'Draw baseline AB = 80mm with 2H pencil.',
          'From A, strike a semi-circle cutting baseline extension at X and Y.',
          'With compass radius > AX, strike intersecting arcs from X and Y to find perpendicular point P.',
          'Bisect the 90° right angle to produce the 45° ray with HB pencil.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Perfect 90° perpendicular and 45° bisector.'
      },
      {
        id: 'ang-task3',
        taskNumber: 5,
        taskTitle: 'Construct an Angle of 105° on Baseline XY',
        taskPrompt: 'Construct an angle of 105° at vertex X on baseline XY = 85mm using the 90° and 120° bisecting sequence.',
        specifications: [
          'Draw baseline XY = 85mm with 2H pencil.',
          'Construct 90° perpendicular ray and 120° arc ray at point X.',
          'Bisect the 30° sector between 90° and 120° (90° + 15° = 105°).',
          'Draw the 105° ray with bold HB line and label the angle arc.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Accurate 105° angle with intact construction arc records.'
      }
    ]
  },

  // 5. EXTERNAL TANGENTS TO UNEQUAL CIRCLES (HYBRID: 2 MCQs + 3 PRACTICAL TASKS)
  'ss2-tangency-external': {
    topicId: 'ss2-tangency-external',
    format: 'HYBRID_PRACTICAL',
    passScorePercentage: 70,
    mcqs: [
      {
        id: 'tan-mcq1',
        question: 'In the construction of an external common tangent to two unequal circles of radii R1 and R2 (where R1 > R2), what is the radius of the auxiliary concentric circle?',
        options: [
          'R1 + R2 (Sum circle)',
          'R1 - R2 (Difference circle)',
          'sqrt(R1 * R2)',
          '(R1 + R2) / 2'
        ],
        correctIndex: 1,
        explanation: 'For external tangents (open belt drives), the auxiliary circle radius is the difference (R1 - R2). For internal cross tangents, the sum (R1 + R2) is used.',
        waecReference: 'WAEC TD Paper 2 SS2 Tangency Constructions'
      },
      {
        id: 'tan-mcq2',
        question: 'What is the spatial relationship between the common tangent line and the radii drawn to contact points T1 and T2?',
        options: [
          'They intersect at 45°',
          'They are strictly perpendicular (90°) to the tangent line at T1 and T2',
          'They are parallel to the tangent line',
          'They cross through the circle centers at 60°'
        ],
        correctIndex: 1,
        explanation: 'A fundamental geometric theorem states that a tangent line is always strictly perpendicular to the radial vector at the point of tangency.',
        waecReference: 'ISO 128 / Geometric Loci'
      }
    ],
    practicalTasks: [
      {
        id: 'tan-task1',
        taskNumber: 3,
        taskTitle: 'Construct Common External Tangent to Two Circles',
        taskPrompt: 'Construct a common external tangent to two circles of radii R1 = 40mm and R2 = 25mm whose centers O1 and O2 are separated by 120mm.',
        specifications: [
          'Draw centerline O1-O2 = 120mm. Draw circle 1 (R = 40mm) and circle 2 (R = 25mm).',
          'Draw auxiliary circle with center O1 and radius r = R1 - R2 = 15mm.',
          'Bisect O1-O2 to find midpoint M. Draw semi-circle on diameter O1-O2 to cut auxiliary circle at point P.',
          'Extend O1-P to meet outer circle circumference at contact point T1.',
          'Draw parallel radius from O2 to locate T2. Connect T1-T2 with HB outline.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'True external tangent line touching both circles smoothly at T1 and T2.'
      },
      {
        id: 'tan-task2',
        taskNumber: 4,
        taskTitle: 'Connect Two Perpendicular Lines with a 30mm Tangent Arc',
        taskPrompt: 'Draw two straight lines intersecting at 90° and blend them seamlessly with a fillet tangent arc of radius R = 30mm.',
        specifications: [
          'Draw vertical and horizontal lines intersecting at point O with 2H pencil.',
          'Draw parallel offset lines at distance 30mm from both lines to find arc center C.',
          'From center C, drop perpendiculars to both lines to locate tangency contact points T1 and T2.',
          'With center C and radius 30mm, strike the blending arc from T1 to T2 with HB pencil.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Fillet corner with smooth curvature transition and no kinks or overlap.'
      },
      {
        id: 'tan-task3',
        taskNumber: 5,
        taskTitle: 'Draw an Internal Cross Tangent to Circles (Open vs Crossed Belt)',
        taskPrompt: 'Construct an internal common tangent (cross tangent) to two circles R1 = 35mm and R2 = 20mm with center distance D = 110mm.',
        specifications: [
          'Draw center distance O1-O2 = 110mm.',
          'Construct auxiliary circle with radius R1 + R2 = 55mm centered at O1.',
          'Find tangent from O2 to the auxiliary circle using semi-circle bisection.',
          'Project radial normal lines to locate internal contact points T1 and T2.',
          'Draw internal tangent line T1-T2 crossing the centerline.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Crossed tangent line passing between both circles with exact contact points.'
      }
    ]
  }
};

// DYNAMIC FALLBACK ASSESSMENT GENERATOR FOR ANY TOPIC
export function getTopicSelfAssessment(topic?: DrawingTopic | null): TopicSelfAssessment {
  const safeId = topic?.id || 'general-technical-drawing';
  const safeTitle = topic?.title || 'Technical & Engineering Drawing';
  const safeNerdc = topic?.standards?.nerdcRef || 'NERDC Technical Drawing Standards';
  const safeWaec = topic?.standards?.waecRef || 'WAEC TD Syllabus';
  const safeIso = topic?.standards?.isoRef || 'ISO 128 / ISO 5457 Standards';

  if (safeId && CURATED_TOPIC_ASSESSMENTS[safeId]) {
    const curated = CURATED_TOPIC_ASSESSMENTS[safeId];
    return {
      ...curated,
      mcqs: curated.mcqs || [],
      practicalTasks: curated.practicalTasks || []
    };
  }

  const isTheory = isTheoreticalTopic(topic);

  if (isTheory) {
    // 5 Dynamic MCQs for Theoretical Topics
    return {
      topicId: safeId,
      format: 'THEORY_5_MCQ',
      passScorePercentage: 70,
      mcqs: [
        {
          id: `${safeId}-q1`,
          question: `According to Nigerian NERDC & WAEC standards, what is the primary objective of studying "${safeTitle}"?`,
          options: [
            `To master the fundamental technical conventions, safety rules, and graphic standards required for ${safeTitle}`,
            'To replace all engineering drawings with freehand abstract artistic paintings',
            'To memorize formulas without ever practicing technical drawing instruments',
            'To ignore ISO line thickness conventions and sheet layout rules'
          ],
          correctIndex: 0,
          explanation: `In the NERDC curriculum, ${safeTitle} establishes core procedural fluency and theoretical principles codified under ${safeNerdc} and ${safeIso}.`,
          waecReference: `${safeWaec} / ${safeNerdc}`
        },
        {
          id: `${safeId}-q2`,
          question: `Which pencil hardness grade is specified by ISO 128 for drawing faint construction lines in this module?`,
          options: [
            '6B soft sketch pencil',
            '4B dark shadow pencil',
            '2H or 3H hard pencil (0.25mm line weight)',
            'Colored marker pen'
          ],
          correctIndex: 2,
          explanation: 'Construction lines must remain thin, sharp, and faint (0.25mm) using 2H or 3H pencils so they do not overpower finished outlines.',
          waecReference: 'ISO 128 Line Conventions / WAEC Section 1'
        },
        {
          id: `${safeId}-q3`,
          question: `What is the standard ISO line weight for the final finished outlines of an engineering drawing?`,
          options: [
            '0.25 mm continuous thin line',
            '0.5 mm to 0.7 mm continuous thick line (HB pencil)',
            '1.5 mm paint brush stroke',
            '0.1 mm dotted line'
          ],
          correctIndex: 1,
          explanation: 'Finished outlines are drafted with continuous thick lines (0.5mm - 0.7mm) using an HB pencil for maximum optical contrast.',
          waecReference: 'ISO 128-20 Outline Definition'
        },
        {
          id: `${safeId}-q4`,
          question: `What is the role of dimensional and geometric accuracy in technical drafting exercises?`,
          options: [
            'Dimensions are purely decorative and can vary by ±20mm without consequence',
            'Precise scale and geometric adherence ensure components fit together during workshop assembly without machining errors',
            'Drawings should never include numerical measurements',
            'Only colors matter; geometric measurements are unnecessary'
          ],
          correctIndex: 1,
          explanation: 'Engineering drawings serve as legal contracts for manufacturing; accurate geometry and dimensioning guarantee zero tolerance failures.',
          waecReference: 'NERDC Technical Drawing Objectives'
        },
        {
          id: `${safeId}-q5`,
          question: `When completing an examination drawing for WAEC, where must the candidate identification and title block be located?`,
          options: [
            'In the center of the drawing area overlapping the object',
            'On the back of the drafting board in pencil',
            'In the bottom-right corner of the sheet bordered by standard 10mm margins',
            'Scattered randomly along the perimeter'
          ],
          correctIndex: 2,
          explanation: 'ISO 5457 and WAEC examination guidelines dictate a standard 10mm border with the Title Block firmly grounded in the bottom right.',
          waecReference: 'WAEC Examination Paper Instructions'
        }
      ],
      practicalTasks: []
    };
  }

  // 2 MCQs + 3 Practical Drawing Tasks for Practical / Construction Topics
  return {
    topicId: safeId,
    format: 'HYBRID_PRACTICAL',
    passScorePercentage: 70,
    mcqs: [
      {
        id: `${safeId}-mcq1`,
        question: `In the construction of "${safeTitle}", what is the key geometric principle governing accuracy?`,
        options: [
          'Drawing without any reference lines or geometric constraints',
          'Strict adherence to geometric loci, compass intersection points, and ISO line weight differentiation',
          'Estimating distances visually without using dividers or compass needles',
          'Using soft 4B pencils for all preliminary construction arcs'
        ],
        correctIndex: 1,
        explanation: `Under ${safeWaec}, candidates lose marks if construction arcs are erased or if line weights lack proper 2H/HB contrast.`,
        waecReference: `${safeWaec} Marking Scheme`
      },
      {
        id: `${safeId}-mcq2`,
        question: `Which drawing instrument combination is mandatory for establishing accurate alignment in this construction?`,
        options: [
          'T-square firmly seated against board edge paired with 30°-60° or 45° set-squares and precision compass',
          'A broken ruler placed freehand across the paper',
          'A ballpoint pen with no straightedge',
          'A protractor used for every simple angle instead of compass bisection'
        ],
        correctIndex: 0,
        explanation: 'The T-square and set-square combination guarantees true parallel and perpendicular projections across the drawing sheet.',
        waecReference: 'NERDC Practical Drafting Standards'
      }
    ],
    practicalTasks: [
      {
        id: `${safeId}-task1`,
        taskNumber: 3,
        taskTitle: `Core Construction Step: ${safeTitle}`,
        taskPrompt: `In the Interactive Drawing Studio, construct the foundational geometry for ${safeTitle} following WAEC procedural specifications.`,
        specifications: [
          'Establish the horizontal baseline and primary centerlines using faint 2H construction lines (0.25mm).',
          'Set compass accurately to specified radius parameters without parallax error.',
          'Strike intersecting arcs cleanly and mark vertex points.',
          'Darken the final finished outline with HB pencil (0.5mm - 0.7mm).'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'COMPASS',
        expectedOutcome: 'Accurate geometric construction showing visible, faint 2H construction lines and bold HB outlines.'
      },
      {
        id: `${safeId}-task2`,
        taskNumber: 4,
        taskTitle: `Intermediate Variation & Dimensioning for ${safeTitle}`,
        taskPrompt: `Apply the principles of ${safeTitle} with modified parameters and add complete ISO 129 dimensions.`,
        specifications: [
          'Construct the geometry with 25% increased scale or altered parameters.',
          'Add dimension extension lines leaving a 1mm gap from the object outline.',
          'Draw thin continuous dimension lines with neat, solid arrowheads (3:1 length-to-width ratio).',
          'Insert dimension figures centered above the dimension line according to the aligned method.'
        ],
        rubricMarks: 20,
        suggestedMode: 'TRADITIONAL_BOARD',
        targetTool: 'RULER',
        expectedOutcome: 'Correctly dimensioned technical drawing meeting ISO 129 standards.'
      },
      {
        id: `${safeId}-task3`,
        taskNumber: 5,
        taskTitle: `Advanced WAEC Exam Question Application for ${safeTitle}`,
        taskPrompt: `Complete an authentic WAEC/NECO examination problem based on ${safeTitle} and submit your drawing for portfolio grading.`,
        specifications: [
          'Draw the complete composite figure combining multiple geometric features.',
          'Maintain clean sheet layout and uniform lettering in the title block.',
          'Verify all points of contact, intersections, and centers are clearly indicated.',
          'Submit the digital canvas drawing for instant synchronization with the Parent Portal.'
        ],
        rubricMarks: 20,
        suggestedMode: 'CAD_WORKSTATION',
        targetTool: 'COMPASS',
        expectedOutcome: 'Comprehensive examination-grade submission stored in the student\'s verified continuous assessment record.'
      }
    ]
  };
}
