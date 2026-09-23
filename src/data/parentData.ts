import { StudentWardProfile } from '../types/parent';

export const SAMPLE_WARD_PROFILES: Record<string, StudentWardProfile> = {
  'WARD-DH-2025-88': {
    wardCode: 'WARD-DH-2025-88',
    studentName: 'Chukwuma Adebayo',
    admissionNo: 'FSTC-2025-084',
    classTier: 'SS1',
    schoolName: 'Federal Science & Technical College, Yaba',
    term: '1st Term',
    academicYear: '2025/2026',
    overallScore: 84,
    syllabusCompletion: 72,
    canvasPracticeHours: 18.5,
    quizzesCompleted: 9,
    totalQuizzes: 12,
    weakAreas: [
      {
        skill: 'ISO 128 Line Weight Contrast',
        topicId: 'ss1-lines-conventions',
        topicTitle: 'Types of Lines & Line Conventions',
        accuracyScore: 58,
        recommendedAction: 'Needs to maintain sharper distinction between 2H (thin construction) and HB (thick outline) pencils.'
      },
      {
        skill: 'Compass Pivot Point Stability',
        topicId: 'ss1-bisect-line',
        topicTitle: 'Bisection of Straight Lines',
        accuracyScore: 64,
        recommendedAction: 'Ensure compass needle is firmly pressed without slipping during arc strikes.'
      },
      {
        skill: 'Lettering Guideline Uniformity',
        topicId: 'ss1-lettering-numbering',
        topicTitle: 'Single-Stroke Lettering & Numbering',
        accuracyScore: 69,
        recommendedAction: 'Draw faint 3H guidelines and ensure all letters touch top and bottom guidelines evenly.'
      }
    ],
    masteryBreakdown: [
      { category: 'Drawing Room Safety & Instruments', masteryScore: 95, level: 'Excellent' },
      { category: 'Board Practice & Sheet Layout', masteryScore: 88, level: 'Excellent' },
      { category: 'Plane Geometry & Angle Bisection', masteryScore: 82, level: 'Good' },
      { category: 'Types of Lines (ISO 128)', masteryScore: 68, level: 'Needs Practice' },
      { category: 'Lettering & Title Block Formatting', masteryScore: 74, level: 'Good' },
      { category: 'Triangles & Polygon Inscription', masteryScore: 61, level: 'Needs Practice' }
    ],
    recentAssessments: [
      {
        id: 'ass-01',
        topicTitle: 'Introduction & Equipment Maintenance Test',
        date: '14 Oct 2025',
        score: 19,
        maxScore: 20,
        waecGrade: 'A1',
        teacherComment: 'Outstanding grasp of instrument maintenance and T-square alignment.'
      },
      {
        id: 'ass-02',
        topicTitle: 'Board Practice & Title Block Construction',
        date: '21 Oct 2025',
        score: 18,
        maxScore: 20,
        waecGrade: 'A1',
        teacherComment: 'Neat borderlines and correct ISO 5457 A3 sheet squaring.'
      },
      {
        id: 'ass-03',
        topicTitle: 'Line Conventions & Weight Identification (ISO 128)',
        date: '28 Oct 2025',
        score: 13,
        maxScore: 20,
        waecGrade: 'C4',
        teacherComment: 'Needs to darken final object lines. Hidden detail dashes lacked uniform spacing.'
      },
      {
        id: 'ass-04',
        topicTitle: 'Bisection of Straight Lines & Angles Practical',
        date: '04 Nov 2025',
        score: 17,
        maxScore: 20,
        waecGrade: 'B2',
        teacherComment: 'Good geometric accuracy; ensure construction arcs remain faint.'
      }
    ],
    teacherRemarks: {
      teacherName: 'Engr. D. K. Adeleke (Technical Drawing Lead)',
      date: '08 Nov 2025',
      comment: 'Chukwuma displays keen aptitude for technical graphics and spatial reasoning. Practice time on the digital canvas is commendable (18.5 hours). With slight refinement on line weight contrast and lettering guidelines, the student is on track for a distinction (A1).',
      strengths: [
        'Precise geometric bisection accuracy',
        'Consistent 75° and 90° lettering stance',
        'Strong spatial comprehension in 2D layout'
      ],
      focusForNextWeek: 'Complete 3 exercises on tangency arc blending and practice 2H vs HB pencil contrast.'
    }
  },
  'WARD-DH-2025-42': {
    wardCode: 'WARD-DH-2025-42',
    studentName: 'Amina Bello',
    admissionNo: 'KCL-2025-142',
    classTier: 'SS2',
    schoolName: 'Kings College Technical Academy, Lagos',
    term: '1st Term',
    academicYear: '2025/2026',
    overallScore: 91,
    syllabusCompletion: 86,
    canvasPracticeHours: 24.2,
    quizzesCompleted: 11,
    totalQuizzes: 12,
    weakAreas: [
      {
        skill: 'External Tangency Blending Point',
        topicId: 'ss2-tangent-two-circles',
        topicTitle: 'Common External Tangents to Circles',
        accuracyScore: 71,
        recommendedAction: 'Ensure normal radius vectors are drawn to locate exact point of contact before striking tangent.'
      }
    ],
    masteryBreakdown: [
      { category: 'Plane Geometry & Scale Construction', masteryScore: 96, level: 'Excellent' },
      { category: 'Tangency & Curve Blending', masteryScore: 84, level: 'Good' },
      { category: 'Isometric 3D Projections', masteryScore: 92, level: 'Excellent' },
      { category: 'Inscribed/Circumscribed Figures', masteryScore: 89, level: 'Excellent' }
    ],
    recentAssessments: [
      {
        id: 'ass-ss2-01',
        topicTitle: 'Plain & Diagonal Scales Examination',
        date: '20 Oct 2025',
        score: 20,
        maxScore: 20,
        waecGrade: 'A1',
        teacherComment: 'Flawless calculation of Representative Fraction (RF) and Length of Scale.'
      },
      {
        id: 'ass-ss2-02',
        topicTitle: 'Isometric Projection of Stepped Block',
        date: '02 Nov 2025',
        score: 18,
        maxScore: 20,
        waecGrade: 'A1',
        teacherComment: 'Very crisp 30° isometric axes alignment.'
      }
    ],
    teacherRemarks: {
      teacherName: 'Engr. J. O. Okonjo (Senior Graphics Tutor)',
      date: '06 Nov 2025',
      comment: 'Amina is a top-performing drafting candidate. Linework is exceptionally clean and mathematically precise. Demonstrates strong spatial visualization.',
      strengths: ['Superior 3D spatial visualization', 'Perfect diagonal scale reading'],
      focusForNextWeek: 'Revise internal and external tangency locus principles.'
    }
  }
};

// Aliases for compatibility
SAMPLE_WARD_PROFILES['WARD-DEMO-001'] = SAMPLE_WARD_PROFILES['WARD-DH-2025-88'];
SAMPLE_WARD_PROFILES['WARD-DEMO-002'] = SAMPLE_WARD_PROFILES['WARD-DH-2025-42'];

export function getWardProfile(code: string): StudentWardProfile {
  const trimmed = code.trim().toUpperCase();
  const baseProfile: StudentWardProfile = SAMPLE_WARD_PROFILES[trimmed] || {
    wardCode: trimmed || 'WARD-DH-LIVE',
    studentName: 'Candidate Scholar',
    admissionNo: 'REG-' + Math.floor(1000 + Math.random() * 9000),
    classTier: 'SS1',
    schoolName: 'Accredited Technical College',
    term: '1st Term',
    academicYear: '2025/2026',
    overallScore: 78,
    syllabusCompletion: 65,
    canvasPracticeHours: 12.0,
    quizzesCompleted: 6,
    totalQuizzes: 10,
    weakAreas: [
      {
        skill: 'Line Weight Contrast',
        topicId: 'ss1-lines-conventions',
        topicTitle: 'Line Conventions & Standards',
        accuracyScore: 62,
        recommendedAction: 'Practice separating 2H construction lines from HB outlines.'
      }
    ],
    masteryBreakdown: [
      { category: 'Foundations & Safety', masteryScore: 88, level: 'Excellent' },
      { category: 'Board Practice & Borderlines', masteryScore: 78, level: 'Good' },
      { category: 'Plane Geometry', masteryScore: 68, level: 'Needs Practice' }
    ],
    recentAssessments: [
      {
        id: 'ass-dyn-01',
        topicTitle: 'Technical Foundations Test',
        date: '01 Nov 2025',
        score: 16,
        maxScore: 20,
        waecGrade: 'B2',
        teacherComment: 'Good effort, continue practicing on digital canvas.'
      }
    ],
    teacherRemarks: {
      teacherName: 'Technical Drawing Department',
      date: '05 Nov 2025',
      comment: 'Student is making steady progress. Regular practice on the digital drafting board is strongly encouraged.',
      strengths: ['Regular attendance', 'Enthusiastic participation'],
      focusForNextWeek: 'Focus on lines and lettering exercises.'
    }
  };

  return baseProfile;
}
