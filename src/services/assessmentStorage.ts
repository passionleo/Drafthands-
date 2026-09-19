import { SelfAssessmentFormat, WAECGrade } from '../types/curriculum';

export interface PracticalSubmissionRecord {
  taskId: string;
  taskTitle: string;
  submittedAt: string;
  elementCount: number;
  notes?: string;
  status: 'COMPLETED' | 'SUBMITTED';
  marksAwarded?: number;
  maxMarks?: number;
}

export interface AssessmentAttempt {
  id: string;
  topicId: string;
  topicTitle: string;
  tier: string;
  format: SelfAssessmentFormat;
  completedAt: string;
  score: number; // e.g. 5 out of 5
  maxScore: number; // 5
  percentage: number; // 0 - 100%
  waecGrade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  mcqScore: number;
  mcqTotal: number;
  practicalCompletedCount: number;
  practicalTotalCount: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  practicalSubmissions: PracticalSubmissionRecord[];
  teacherRemark: string;
}

const STORAGE_KEY = 'drafthands_student_assessments_v1';
const UPDATE_EVENT_NAME = 'drafthands_assessment_synced';

export function calculateWaecGrade(percentage: number): 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9' {
  if (percentage >= 75) return 'A1';
  if (percentage >= 70) return 'B2';
  if (percentage >= 65) return 'B3';
  if (percentage >= 60) return 'C4';
  if (percentage >= 55) return 'C5';
  if (percentage >= 50) return 'C6';
  if (percentage >= 45) return 'D7';
  if (percentage >= 40) return 'E8';
  return 'F9';
}

const INITIAL_SEED_ATTEMPTS: AssessmentAttempt[] = [
  {
    id: 'seed-att-01',
    topicId: 'ss1-intro-technical-drawing',
    topicTitle: 'Introduction to Technical Drawing & Scope',
    tier: 'SS1',
    format: 'THEORY_5_MCQ',
    completedAt: '18 Oct 2025, 10:30 AM',
    score: 5,
    maxScore: 5,
    percentage: 100,
    waecGrade: 'A1',
    mcqScore: 5,
    mcqTotal: 5,
    practicalCompletedCount: 0,
    practicalTotalCount: 0,
    answers: [
      { questionId: 'q1', selectedIndex: 1, isCorrect: true },
      { questionId: 'q2', selectedIndex: 2, isCorrect: true },
      { questionId: 'q3', selectedIndex: 0, isCorrect: true },
      { questionId: 'q4', selectedIndex: 3, isCorrect: true },
      { questionId: 'q5', selectedIndex: 1, isCorrect: true }
    ],
    practicalSubmissions: [],
    teacherRemark: 'Flawless theoretical foundation on universal graphic language and ISO standard sheet sizing.'
  },
  {
    id: 'seed-att-02',
    topicId: 'ss1-bisect-line',
    topicTitle: 'Bisection of Straight Lines & Angles',
    tier: 'SS1',
    format: 'HYBRID_PRACTICAL',
    completedAt: '04 Nov 2025, 02:15 PM',
    score: 4,
    maxScore: 5,
    percentage: 80,
    waecGrade: 'B2',
    mcqScore: 2,
    mcqTotal: 2,
    practicalCompletedCount: 2,
    practicalTotalCount: 3,
    answers: [
      { questionId: 'q1', selectedIndex: 1, isCorrect: true },
      { questionId: 'q2', selectedIndex: 1, isCorrect: true }
    ],
    practicalSubmissions: [
      {
        taskId: 'task-3',
        taskTitle: 'Construct perpendicular bisector of 90mm line AB',
        submittedAt: '04 Nov 2025, 02:05 PM',
        elementCount: 6,
        notes: 'Drawn using compass needle firmly centered at A and B with r = 55mm.',
        status: 'COMPLETED',
        marksAwarded: 18,
        maxMarks: 20
      },
      {
        taskId: 'task-4',
        taskTitle: 'Bisect an acute angle of 60° into two equal 30° sectors',
        submittedAt: '04 Nov 2025, 02:12 PM',
        elementCount: 5,
        notes: 'Clean apex arc stroke with faint 2H construction lines.',
        status: 'COMPLETED',
        marksAwarded: 17,
        maxMarks: 20
      }
    ],
    teacherRemark: 'Good geometric accuracy; completed 2 of 3 studio construction tasks cleanly.'
  }
];

const isStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

function sanitizeAttempt(item: any): AssessmentAttempt {
  const percentage = typeof item?.percentage === 'number' ? item.percentage : 0;
  return {
    id: item?.id || 'att-' + Math.random().toString(36).substring(2, 9),
    topicId: item?.topicId || 'general-td',
    topicTitle: item?.topicTitle || 'Technical Drawing Assessment',
    tier: item?.tier || 'SS1',
    format: item?.format === 'THEORY_5_MCQ' ? 'THEORY_5_MCQ' : 'HYBRID_PRACTICAL',
    completedAt: item?.completedAt || new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    score: typeof item?.score === 'number' ? item.score : 0,
    maxScore: typeof item?.maxScore === 'number' ? item.maxScore : 5,
    percentage,
    waecGrade: item?.waecGrade || calculateWaecGrade(percentage),
    mcqScore: typeof item?.mcqScore === 'number' ? item.mcqScore : 0,
    mcqTotal: typeof item?.mcqTotal === 'number' ? item.mcqTotal : 0,
    practicalCompletedCount: typeof item?.practicalCompletedCount === 'number' ? item.practicalCompletedCount : 0,
    practicalTotalCount: typeof item?.practicalTotalCount === 'number' ? item.practicalTotalCount : 0,
    answers: Array.isArray(item?.answers) ? item.answers : [],
    practicalSubmissions: Array.isArray(item?.practicalSubmissions) ? item.practicalSubmissions : [],
    teacherRemark: item?.teacherRemark || 'Continuous assessment progress recorded.'
  };
}

export function getAssessmentAttempts(): AssessmentAttempt[] {
  try {
    if (!isStorageAvailable()) {
      return INITIAL_SEED_ATTEMPTS.map(sanitizeAttempt);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ATTEMPTS));
      return INITIAL_SEED_ATTEMPTS.map(sanitizeAttempt);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_SEED_ATTEMPTS.map(sanitizeAttempt);
    }
    return parsed.map(sanitizeAttempt);
  } catch (err) {
    console.error('Failed to load assessment attempts from localStorage', err);
    return INITIAL_SEED_ATTEMPTS.map(sanitizeAttempt);
  }
}

export function saveAssessmentAttempt(attempt: AssessmentAttempt): void {
  try {
    if (!attempt) return;
    const sanitized = sanitizeAttempt(attempt);
    const current = getAssessmentAttempts() || [];
    const existingIndex = current.findIndex(a => a?.topicId === sanitized.topicId);
    let updated: AssessmentAttempt[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = sanitized;
    } else {
      updated = [sanitized, ...current];
    }
    if (isStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: sanitized }));
    }
  } catch (err) {
    console.error('Failed to save assessment attempt to localStorage', err);
  }
}

export function getAttemptByTopicId(topicId?: string): AssessmentAttempt | undefined {
  if (!topicId) return undefined;
  const all = getAssessmentAttempts() || [];
  return all.find(a => a?.topicId === topicId);
}

export function recordPracticalSubmission(
  topicId: string,
  topicTitle: string,
  tier: string,
  submission: PracticalSubmissionRecord
): AssessmentAttempt {
  const current = getAssessmentAttempts() || [];
  const existing = current.find(a => a?.topicId === topicId);

  let attempt: AssessmentAttempt;
  if (existing) {
    const safeSubs = Array.isArray(existing.practicalSubmissions) ? existing.practicalSubmissions : [];
    const subIndex = safeSubs.findIndex(s => s?.taskId === submission?.taskId);
    let updatedSubs = [...safeSubs];
    if (subIndex >= 0) {
      updatedSubs[subIndex] = submission;
    } else {
      updatedSubs.push(submission);
    }
    const completedCount = updatedSubs.length;
    const practicalPts = Math.min(3, completedCount);
    const mcqScore = typeof existing.mcqScore === 'number' ? existing.mcqScore : 0;
    const newScore = mcqScore + practicalPts;
    const percentage = Math.round((newScore / 5) * 100);

    attempt = sanitizeAttempt({
      ...existing,
      completedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      practicalSubmissions: updatedSubs,
      practicalCompletedCount: completedCount,
      score: newScore,
      percentage,
      waecGrade: calculateWaecGrade(percentage),
      teacherRemark: `Practical construction task (${submission?.taskTitle || 'Studio Task'}) rendered and verified in Interactive Drawing Studio.`
    });
  } else {
    // New attempt
    const percentage = 20; // 1 practical task done out of 5
    attempt = sanitizeAttempt({
      id: 'att-' + Date.now(),
      topicId: topicId || 'general-td',
      topicTitle: topicTitle || 'Technical Drawing',
      tier: tier || 'SS1',
      format: 'HYBRID_PRACTICAL',
      completedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      score: 1,
      maxScore: 5,
      percentage,
      waecGrade: calculateWaecGrade(percentage),
      mcqScore: 0,
      mcqTotal: 2,
      practicalCompletedCount: 1,
      practicalTotalCount: 3,
      answers: [],
      practicalSubmissions: submission ? [submission] : [],
      teacherRemark: `Practical construction task (${submission?.taskTitle || 'Studio Task'}) rendered in Interactive Drawing Studio.`
    });
  }

  saveAssessmentAttempt(attempt);
  return attempt;
}

export function subscribeAssessmentUpdates(callback: () => void): () => void {
  const handler = () => {
    try {
      callback();
    } catch (err) {
      console.error('Error in assessment update listener', err);
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener(UPDATE_EVENT_NAME, handler);
    window.addEventListener('storage', handler);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(UPDATE_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    }
  };
}
