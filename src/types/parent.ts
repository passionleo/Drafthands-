export interface StudentWardProfile {
  wardCode: string;
  studentName: string;
  admissionNo: string;
  classTier: 'SS1' | 'SS2' | 'SS3' | 'HIGHER_INSTITUTION';
  schoolName: string;
  term: string;
  academicYear: string;
  avatarUrl?: string;
  overallScore: number;
  syllabusCompletion: number; // 0 - 100%
  canvasPracticeHours: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  weakAreas: {
    skill: string;
    topicId: string;
    topicTitle: string;
    accuracyScore: number;
    recommendedAction: string;
  }[];
  masteryBreakdown: {
    category: string;
    masteryScore: number; // 0 - 100
    level: 'Excellent' | 'Good' | 'Needs Practice' | 'Critical';
  }[];
  recentAssessments: {
    id: string;
    topicTitle: string;
    date: string;
    score: number;
    maxScore: number;
    waecGrade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
    teacherComment: string;
  }[];
  teacherRemarks: {
    teacherName: string;
    date: string;
    comment: string;
    strengths: string[];
    focusForNextWeek: string;
  };
}
