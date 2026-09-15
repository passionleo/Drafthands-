import { CurriculumTier, LineWeightType } from './curriculum';
import { WhiteboardElement } from './whiteboard';

export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'REVISION_REQUESTED';

export type WAECGrade = 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';

export interface AssignmentRubricCriteria {
  id: string;
  name: string;
  description: string;
  maxMarks: number;
  awardedMarks: number;
  feedback?: string;
}

export interface TeacherAssignment {
  id: string;
  topicId: string;
  moduleCode: string;
  title: string;
  tier: CurriculumTier;
  targetClass: string; // e.g., 'SS1 Technical A', 'SS2 Mechanical', 'SS3 WAEC Intensive', 'HI Eng 101'
  assignedDate: string;
  dueDate: string;
  instructions: string;
  maxScore: number;
  starterElements?: WhiteboardElement[];
  rubric: {
    constructionAccuracy: number; // e.g., 40 marks
    lineWeightDifferentiation: number; // e.g., 25 marks
    dimensioningAndLettering: number; // e.g., 20 marks
    neatnessAndLayout: number; // e.g., 15 marks
  };
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentClass: string;
  submittedAt: string;
  status: AssignmentStatus;
  drawingElements: WhiteboardElement[];
  drawingThumbnailSvg?: string;
  studentNotes?: string;
  // Grading & Evaluation
  grade?: {
    totalScore: number; // out of 100
    waecGrade: WAECGrade;
    constructionScore: number;
    lineWeightScore: number;
    dimensioningScore: number;
    neatnessScore: number;
    teacherFeedback: string;
    gradedBy: string;
    gradedAt: string;
    redlineAnnotations?: WhiteboardElement[];
  };
}
