export interface BehavioralObjectives {
  cognitive: string[];
  psychomotor: string[];
  affective: string[];
}

export interface TeachingStep {
  stepNumber: number;
  durationMins: number;
  title: string;
  teacherActivities: string;
  studentActivities: string;
  instructionalMethod: string;
  whiteboardNotes: string;
  pitfallsToHighlight: string;
}

export interface WAECMarkingCriteria {
  component: string;
  marksAllocated: number;
  toleranceGuide: string;
  commonDeductionErrors: string[];
}

export interface LessonPlanData {
  id: string;
  topicId: string;
  moduleCode: string;
  topicTitle: string;
  subject: string;
  tier: string;
  term: string;
  week: string;
  periodDuration: string; // e.g. "80 Minutes (Double Period)"
  ageGroup: string; // e.g. "15 - 17 Years"
  
  // Curriculum Accreditation
  standards: {
    nerdc: string;
    waec: string;
    iso: string;
  };
  
  entryBehavior: string;
  rationale: string;
  objectives: BehavioralObjectives;
  instructionalMaterials: {
    teacherApparatus: string[];
    studentMaterials: string[];
    digitalAids: string[];
  };
  
  setInduction: {
    durationMins: number;
    activity: string;
    triggerQuestion: string;
  };
  
  deliverySteps: TeachingStep[];
  
  commonMisconceptions: {
    misconception: string;
    correctiveGuidance: string;
    waecPenalty: string;
  }[];
  
  boardSummaryLayout: {
    leftPanel: string[];
    centerCanvas: string[];
    rightPanel: string[];
  };
  
  classExercise: {
    taskDescription: string;
    givenDimensions: Record<string, string>;
    expectedTimeMins: number;
  };
  
  assignment: {
    title: string;
    questions: string[];
    submissionDate: string;
  };
  
  evaluationAndExamScheme: {
    examQuestion: string;
    totalMarks: number;
    criteria: WAECMarkingCriteria[];
  };
  
  teacherReflectionPrompts: string[];
}
