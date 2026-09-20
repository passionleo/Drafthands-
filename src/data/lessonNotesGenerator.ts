import { DrawingTopic } from '../types/curriculum';
import { LessonPlanData, TeachingStep, WAECMarkingCriteria } from '../types/lessonPlan';

export function generateLessonPlanForTopic(
  topic: DrawingTopic,
  customParams?: {
    schoolName?: string;
    teacherName?: string;
    term?: string;
    week?: string;
    date?: string;
  }
): LessonPlanData {
  const school = customParams?.schoolName || 'Test Technical Academy';
  const teacher = customParams?.teacherName || 'Demo Technical Instructor';
  const term = customParams?.term || topic.termLabel || (topic.term === 'TERM_2' ? 'Second Term' : topic.term === 'TERM_3' ? 'Third Term' : 'First Term');
  const week = customParams?.week || (topic.week ? `Week ${topic.week}` : 'Week 4');

  const steps = topic.generateSteps({});

  // Generate pedagogical delivery steps mapped from procedural steps
  const deliverySteps: TeachingStep[] = steps.map((step, idx) => {
    let method = 'Teacher Demonstration on Technical Whiteboard followed by Student Guided Practice';
    if (idx === 0) method = 'Interactive Set Induction & Baseline Datum Establishment';
    if (idx === steps.length - 1) method = 'Individual Summative Drawing Assessment & Dimension Check';

    return {
      stepNumber: idx + 1,
      durationMins: Math.round(70 / Math.max(steps.length, 1)),
      title: step.title,
      teacherActivities: `1. Teacher illustrates the geometric construction principle: "${step.technicalPrinciple || step.title}".\n2. Demonstrates exact placement and manipulation of the drafting instrument (${step.activeInstrument?.toolType || 'T-Square / Compass'}).\n3. Guides students on line weight control (Continuous Thin 2H for construction vs Continuous Thick HB for finished outline).`,
      studentActivities: `1. Students observe the teacher's board demonstration and reference textbook illustrations.\n2. Students set up their T-square and drawing sheet.\n3. Execute "${step.instruction}" on their individual drawing sheets.\n4. Verify tangent points, intersections, and radius dimensions.`,
      instructionalMethod: method,
      whiteboardNotes: `Board Note Step ${idx + 1}: ${step.detailedNotes || step.instruction}`,
      pitfallsToHighlight: `Avoid heavy pencil pressure. Construction lines must be faint 2H (0.25mm). Ensure compass needle point does not slip from center.`
    };
  });

  const waecRubrics: WAECMarkingCriteria[] = [
    {
      component: 'Border Line, Title Block, & Sheet Layout',
      marksAllocated: 2,
      toleranceGuide: '10mm margin from sheet edge; neat 70x30mm title block',
      commonDeductionErrors: ['Omitted title block (-1 mark)', 'Uneven border margins (-0.5 mark)']
    },
    {
      component: 'Pencil Line Quality & Grade Differentiation (ISO 128)',
      marksAllocated: 4,
      toleranceGuide: 'Visible contrast between 0.25mm thin construction (2H) and 0.6mm thick outlines (HB)',
      commonDeductionErrors: ['Construction lines drawn too dark (-2 marks)', 'Smudged or feathered outlines (-1 mark)']
    },
    {
      component: 'Geometric Construction Accuracy & Tangency',
      marksAllocated: 6,
      toleranceGuide: 'Dimensional tolerance within ±0.5mm; smooth tangency with no visible flat spots',
      commonDeductionErrors: ['Kinks or gaps at tangent points (-2 marks)', 'Inaccurate arc radius (-1.5 marks)']
    },
    {
      component: 'Standard Technical Dimensioning & Lettering',
      marksAllocated: 3,
      toleranceGuide: 'Single-stroke uppercase gothic lettering (3mm / 5mm height); projection extension lines',
      commonDeductionErrors: ['Dimension figures resting upside down (-1 mark)', 'Arrows without solid filled heads (-1 mark)']
    }
  ];

  return {
    id: `lesson-${topic.id}`,
    topicId: topic.id,
    moduleCode: topic.moduleCode,
    topicTitle: topic.title,
    subject: 'Technical Drawing / Engineering Graphics',
    tier: topic.tier,
    term: term,
    week: week,
    periodDuration: '80 Minutes (Double Period)',
    ageGroup: topic.tier === 'SS1' ? '14 - 16 Years' : topic.tier === 'SS2' ? '15 - 17 Years' : topic.tier === 'SS3' ? '16 - 18 Years' : '18+ Years (Undergraduate / Polytechnic)',
    standards: {
      nerdc: topic.standards.nerdcRef,
      waec: topic.standards.waecRef,
      iso: topic.standards.isoRef
    },
    entryBehavior: `Students have foundational proficiency in handling basic drafting tools (T-Square, Set Squares, Drawing Board) and can construct straight lines and identify basic geometric angles (30°, 45°, 60°, 90°).`,
    rationale: `Mastery of ${topic.title} is essential for engineering and architectural communication, enabling students to accurately interpret technical working drawings in compliance with WAEC, NERDC, and ISO 128 standards.`,
    objectives: {
      cognitive: [
        `Explain the fundamental theoretical principles governing ${topic.title}.`,
        `Identify the ISO line weights and pencil grades (2H vs HB) required for each construction phase.`,
        `Calculate relevant geometric parameters and coordinate dimensions with zero mathematical error.`
      ],
      psychomotor: [
        `Accurately align the T-Square and Set Squares on the drawing board to construct datum lines.`,
        `Manipulate the drafting compass with precision to strike construction arcs within ±0.5mm tolerance.`,
        `Produce clean, finished technical outlines adhering strictly to ISO line conventions.`
      ],
      affective: [
        `Demonstrate meticulous attention to neatness, preventing graphite smudges on the drawing sheet.`,
        `Appreciate the importance of precision engineering graphics in industrial design and public safety.`
      ]
    },
    instructionalMaterials: {
      teacherApparatus: [
        'Large Blackboard / Whiteboard Drafting T-Square and 30°/60° & 45° Set Squares',
        'Large Whiteboard Drawing Compass and Divider',
        'Interactive Digital Drafthands Academy Canvas Screen',
        'ISO 128 Standard Wall Chart on Technical Line Types and Dimensioning'
      ],
      studentMaterials: [
        'Standard Technical Drawing Board and T-Square',
        'Set Squares (30°/60° and 45°)',
        'Drafting Mathematical Set (Compass, Divider, Protractor, 300mm Scale Ruler)',
        'Pencils: 2H or 3H (Construction) and HB or B (Outlines & Lettering)',
        'A3 / A4 Technical Drawing Cartridge Paper, Drafting Masking Tape, Vinyl Eraser'
      ],
      digitalAids: [
        'Drafthands Interactive Procedural Simulation Engine',
        'Vector CAD coordinate visualizer with real-time parametric feedback'
      ]
    },
    setInduction: {
      durationMins: 5,
      activity: `Teacher displays a real-world engineering artifact or blueprint (e.g. machine bracket, architectural floor plan, or roof truss) and asks students how an engineer communicates exact dimensional shapes to a factory fabricator without verbal ambiguity.`,
      triggerQuestion: `Why must construction arcs remain visible as faint 2H lines on your technical drawing sheet rather than being completely erased?`
    },
    deliverySteps: deliverySteps,
    commonMisconceptions: [
      {
        misconception: 'Erasing all construction lines after drawing the finished outline.',
        correctiveGuidance: 'Instruct students that WAEC/NERDC examiners award up to 40% of total marks specifically for visible, neat 2H construction lines.',
        waecPenalty: 'Loss of 4 to 6 marks for unverified geometric construction procedure.'
      },
      {
        misconception: 'Drawing thick construction lines with an HB or 2B pencil.',
        correctiveGuidance: 'Emphasize that 2H pencils produce 0.25mm thin lines that do not compete visually with the 0.6mm finished HB outline.',
        waecPenalty: 'Deduction of 2 marks for poor line weight contrast.'
      },
      {
        misconception: 'Inaccurate compass center placement causing tangent kinks.',
        correctiveGuidance: 'Always mark the exact center point with a fine cross (+) before placing the steel compass needle.',
        waecPenalty: 'Deduction of 1.5 marks for defective tangency.'
      }
    ],
    boardSummaryLayout: {
      leftPanel: [
        `TOPIC: ${topic.title}`,
        `MODULE CODE: ${topic.moduleCode}`,
        `CLASS: ${topic.tier}`,
        `DATE: ____________________`,
        `STANDARDS: ${topic.standards.waecRef}`,
        `KEY FORMULAS / PARAMETERS:`,
        `• Line Weight: 2H (0.25mm) / HB (0.6mm)`,
        `• Tolerance: ±0.5mm`
      ],
      centerCanvas: [
        `[CENTRAL WHITEBOARD DRAWING AREA]`,
        `1. Datum Axis / Baseline Centerlines`,
        `2. Step-by-Step Construction Arcs (Faint 2H)`,
        `3. Finished Geometric Outline (Solid Thick HB)`,
        `4. Standard ISO 128 Dimensioning Lines & Arrowheads`
      ],
      rightPanel: [
        `SUMMARY RULES:`,
        `1. Align T-square firmly against the working edge of the board.`,
        `2. Keep pencil sharp at a conical point.`,
        `3. Do not erase construction marks.`,
        `4. Dimension figures must be oriented upwards or to the left.`
      ]
    },
    classExercise: {
      taskDescription: `Using your drawing board, T-square, and drafting set, construct the full technical drawing of ${topic.title} following the exact procedural steps demonstrated.`,
      givenDimensions: topic.parameters.reduce((acc, p) => {
        acc[p.label] = `${p.defaultValue} ${p.unit}`;
        return acc;
      }, {} as Record<string, string>),
      expectedTimeMins: 30
    },
    assignment: {
      title: `Take-Home Drawing Worksheet: ${topic.title}`,
      questions: [
        `Re-draw ${topic.title} on a fresh A3 cartridge paper with standard border lines and title block.`,
        `List three practical industrial applications of this geometric construction technique in modern engineering.`,
        `State two primary differences between ISO 128 First Angle and Third Angle orthographic projections.`
      ],
      submissionDate: 'Next Technical Drawing Period'
    },
    evaluationAndExamScheme: {
      examQuestion: `WAEC Past Question (Modified): With the aid of standard drawing instruments, construct ${topic.title}. All construction lines must be clearly shown. Show all dimensions in millimeters.`,
      totalMarks: 15,
      criteria: waecRubrics
    },
    teacherReflectionPrompts: [
      `Did at least 85% of the students successfully achieve neat line weight differentiation between 2H and HB?`,
      `Which students required one-on-one intervention during compass manipulation?`,
      `How effectively did the Drafthands digital simulation accelerate student conceptual comprehension?`
    ]
  };
}
