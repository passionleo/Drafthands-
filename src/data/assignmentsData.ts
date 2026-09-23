import { TeacherAssignment, StudentSubmission } from '../types/assignments';

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'asg-ss1-tangency-01',
    topicId: 'ss2-tangency-internal-external',
    moduleCode: 'SS2-MOD-01',
    title: 'Practical Construction: Internal & External Tangent Arcs Between Unequal Circles',
    tier: 'SS2',
    targetClass: 'SS2 Technical A & B',
    assignedDate: '2025-09-15',
    dueDate: '2025-09-22',
    instructions: 'Construct two circles of diameters 50mm and 30mm with centers 90mm apart. Construct an external arc of radius R=70mm tangential to both circles. All construction lines (2H) must be visible. Show tangential points T1 and T2 clearly with center lines.',
    maxScore: 100,
    rubric: {
      constructionAccuracy: 40,
      lineWeightDifferentiation: 25,
      dimensioningAndLettering: 20,
      neatnessAndLayout: 15
    }
  },
  {
    id: 'asg-ss1-ellipse-concentric',
    topicId: 'ss3-conic-sections-ellipse-parabola',
    moduleCode: 'SS3-MOD-02',
    title: 'WAEC Standard Practical: Ellipse by Concentric Circle Method',
    tier: 'SS3',
    targetClass: 'SS3 WAEC Technical Prep',
    assignedDate: '2025-09-18',
    dueDate: '2025-09-25',
    instructions: 'Construct an ellipse having a major axis of 120mm and a minor axis of 80mm using the Concentric Circles Method. Divide into 12 equal 30-degree sectors. Plot the locus points accurately and draw the smooth profile using French curves. Dimension the major and minor axes.',
    maxScore: 100,
    rubric: {
      constructionAccuracy: 40,
      lineWeightDifferentiation: 25,
      dimensioningAndLettering: 20,
      neatnessAndLayout: 15
    }
  },
  {
    id: 'asg-ss1-bisection-01',
    topicId: 'ss1-lines-angles-bisection',
    moduleCode: 'SS1-MOD-02',
    title: 'Foundation Practical: Exact Angle Trisection & Perpendicular Bisector',
    tier: 'SS1',
    targetClass: 'SS1 Technical Foundation',
    assignedDate: '2025-09-20',
    dueDate: '2025-09-27',
    instructions: 'Draw a horizontal line AB = 85mm. Construct a perpendicular bisector at its midpoint using a compass. At point A, construct an exact 60-degree angle and bisect it into 30-degree sub-angles using geometric compass arcs only. No protractors for direct drawing.',
    maxScore: 100,
    rubric: {
      constructionAccuracy: 40,
      lineWeightDifferentiation: 25,
      dimensioningAndLettering: 20,
      neatnessAndLayout: 15
    }
  },
  {
    id: 'asg-hi-cam-profile',
    topicId: 'hi-kinematic-cam-profiles',
    moduleCode: 'HI-MOD-01',
    title: 'Kinematic Cam Profile: Simple Harmonic Motion (SHM) Displacement Diagram',
    tier: 'HIGHER_INSTITUTION',
    targetClass: 'HI Mechanical Eng Year 1',
    assignedDate: '2025-09-21',
    dueDate: '2025-09-30',
    instructions: 'Design a disc cam with knife-edge follower: Base circle diameter 60mm, minimum lift 40mm with SHM during 120° outstroke, dwell for 60°, uniform acceleration/retardation during 120° return stroke, and dwell for 60°. Plot displacement diagram and profile.',
    maxScore: 100,
    rubric: {
      constructionAccuracy: 45,
      lineWeightDifferentiation: 20,
      dimensioningAndLettering: 20,
      neatnessAndLayout: 15
    }
  }
];

export const INITIAL_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-001',
    assignmentId: 'asg-ss1-tangency-01',
    studentId: 'STU-FSTC-084',
    studentName: 'Chukwuma Adebayo',
    studentEmail: 'c.adebayo@fstc.edu.ng',
    studentClass: 'SS2 Technical A',
    submittedAt: '2025-09-19 14:32',
    status: 'SUBMITTED',
    drawingElements: [
      {
        id: 'c1',
        type: 'CIRCLE',
        layer: 'OUTLINE_HB',
        lineWeight: 'THICK_CONTINUOUS',
        color: '#f8fafc',
        cx: 300,
        cy: 300,
        r: 25
      },
      {
        id: 'c2',
        type: 'CIRCLE',
        layer: 'OUTLINE_HB',
        lineWeight: 'THICK_CONTINUOUS',
        color: '#f8fafc',
        cx: 480,
        cy: 300,
        r: 15
      },
      {
        id: 'center-line',
        type: 'LINE',
        layer: 'CENTERLINE_CHAIN',
        lineWeight: 'THIN_CHAIN',
        color: '#f59e0b',
        x1: 250,
        y1: 300,
        x2: 530,
        y2: 300
      },
      {
        id: 'arc-r70',
        type: 'ARC',
        layer: 'OUTLINE_HB',
        lineWeight: 'THICK_CONTINUOUS',
        color: '#f8fafc',
        cx: 390,
        cy: 210,
        r: 70,
        startAngle: 120,
        endAngle: 240
      },
      {
        id: 'const-arc-1',
        type: 'ARC',
        layer: 'CONSTRUCTION_2H',
        lineWeight: 'THIN_CONTINUOUS',
        color: '#22d3ee',
        cx: 300,
        cy: 300,
        r: 95,
        startAngle: 30,
        endAngle: 75
      },
      {
        id: 'const-arc-2',
        type: 'ARC',
        layer: 'CONSTRUCTION_2H',
        lineWeight: 'THIN_CONTINUOUS',
        color: '#22d3ee',
        cx: 480,
        cy: 300,
        r: 85,
        startAngle: 100,
        endAngle: 150
      }
    ],
    studentNotes: 'I used 2H construction lines for finding the intersection point O (R - r1 = 70 - 25 = 45 and R - r2 = 70 - 15 = 55). Then struck the final R=70mm tangential arc in HB.'
  },
  {
    id: 'sub-002',
    assignmentId: 'asg-ss1-ellipse-concentric',
    studentId: 'DEMO-STU-02',
    studentName: 'Demo Student 2',
    studentEmail: 'student2.demo@test-academy.edu.ng',
    studentClass: 'SS3 WAEC Technical Prep',
    submittedAt: '2025-09-19 18:05',
    status: 'GRADED',
    drawingElements: [
      {
        id: 'major-circle',
        type: 'CIRCLE',
        layer: 'CONSTRUCTION_2H',
        lineWeight: 'THIN_CONTINUOUS',
        color: '#22d3ee',
        cx: 400,
        cy: 300,
        r: 60
      },
      {
        id: 'minor-circle',
        type: 'CIRCLE',
        layer: 'CONSTRUCTION_2H',
        lineWeight: 'THIN_CONTINUOUS',
        color: '#22d3ee',
        cx: 400,
        cy: 300,
        r: 40
      },
      {
        id: 'axis-horiz',
        type: 'LINE',
        layer: 'CENTERLINE_CHAIN',
        lineWeight: 'THIN_CHAIN',
        color: '#f59e0b',
        x1: 300,
        y1: 300,
        x2: 500,
        y2: 300
      },
      {
        id: 'axis-vert',
        type: 'LINE',
        layer: 'CENTERLINE_CHAIN',
        lineWeight: 'THIN_CHAIN',
        color: '#f59e0b',
        x1: 400,
        y1: 220,
        x2: 400,
        y2: 380
      },
      {
        id: 'ellipse-curve',
        type: 'ELLIPSE',
        layer: 'OUTLINE_HB',
        lineWeight: 'THICK_CONTINUOUS',
        color: '#f8fafc',
        cx: 400,
        cy: 300,
        rx: 60,
        ry: 40
      }
    ],
    studentNotes: 'Divided both concentric circles into 12 equal 30-degree sectors using the 30/60 set square. Projected vertically from major circle and horizontally from minor circle.',
    grade: {
      totalScore: 92,
      waecGrade: 'A1',
      constructionScore: 38,
      lineWeightScore: 23,
      dimensioningScore: 18,
      neatnessScore: 13,
      teacherFeedback: 'Outstanding precision and smooth curve blending with the French curve. Ensure arrowhead proportions on the major axis dimensions follow the 3:1 length-to-width ratio strictly.',
      gradedBy: 'Engr. J. O. Okonjo',
      gradedAt: '2025-09-20 09:15'
    }
  },
  {
    id: 'sub-003',
    assignmentId: 'asg-ss1-bisection-01',
    studentId: 'STU-KCL-142',
    studentName: 'Amina Bello',
    studentEmail: 'a.bello@kingscollege.edu.ng',
    studentClass: 'SS1 Technical Foundation',
    submittedAt: '2025-09-21 11:20',
    status: 'SUBMITTED',
    drawingElements: [
      {
        id: 'line-ab',
        type: 'LINE',
        layer: 'OUTLINE_HB',
        lineWeight: 'THICK_CONTINUOUS',
        color: '#f8fafc',
        x1: 200,
        y1: 350,
        x2: 500,
        y2: 350
      },
      {
        id: 'bisector',
        type: 'LINE',
        layer: 'CONSTRUCTION_2H',
        lineWeight: 'THIN_CONTINUOUS',
        color: '#22d3ee',
        x1: 350,
        y1: 200,
        x2: 350,
        y2: 500
      }
    ],
    studentNotes: 'Constructed the perpendicular bisector using equal compass arcs above and below the line.'
  }
];
