export type SubscriptionPlanType = 
  | 'FREE'
  | 'STUDENT_TERMLY'
  | 'STUDENT_SESSION'
  | 'TEACHER_PRO'
  | 'INSTITUTION_PASS';

export interface SubscriptionPlan {
  id: SubscriptionPlanType;
  name: string;
  badge: string;
  tagline: string;
  priceNGN: number;
  priceUSD: number;
  billingPeriod: string;
  popular?: boolean;
  features: string[];
  audience: 'Student' | 'Teacher' | 'Institution';
  paystackPlanCode?: string;
}

export type UserRoleType = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

export interface UserProfile {
  name: string;
  email: string;
  institution?: string;
  role: UserRoleType;
  isEmailVerified: boolean;
  isAuthenticated?: boolean;
  registeredAt?: string;
}

export interface UserSubscriptionState {
  plan: SubscriptionPlanType;
  isSubscribed: boolean;
  activeUntil: string | null; // ISO Date string
  licenseKey?: string;
  userRole: UserRoleType;
  userProfile?: UserProfile;
  unlockedTopicIds: string[];
  isDemo?: boolean;
  isMasterAdmin?: boolean;
  isAuthenticated?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanType, SubscriptionPlan> = {
  FREE: {
    id: 'FREE',
    name: 'Free Foundation Tier',
    badge: '3 Topics / Class',
    tagline: 'Always-free access to the first 3 topics of every level (SS1, SS2, SS3, and Higher Institution)',
    priceNGN: 0,
    priceUSD: 0,
    billingPeriod: 'Lifetime Free',
    features: [
      'First 3 topics unlocked in SS1, SS2, SS3, Higher Institution',
      'Step-by-step 2D CAD simulation playback',
      'Interactive compass & set-square animations',
      'Basic multi-input whiteboard & drawing export'
    ],
    audience: 'Student'
  },
  STUDENT_TERMLY: {
    id: 'STUDENT_TERMLY',
    name: 'Student Termly Pass',
    badge: 'Affordable Student',
    tagline: 'Complete syllabus access for 1 academic term (3 months)',
    priceNGN: 2500,
    priceUSD: 3.5,
    billingPeriod: 'per term (3 months)',
    features: [
      'Unlock ALL 30+ topics across SS1, SS2, SS3 & Higher Institution',
      'Building & Architectural Drawing modules (Floor plans, Foundations, Trusses)',
      'Machine Drawing & Assembly modules (Threads, Bolts, Couplings)',
      'AutoCAD & CorelDRAW Technical Illustration modules',
      'Full Multi-Input Digital Whiteboard with Virtual Instruments',
      'Unlimited WAEC & Practice Exam Knowledge Checks'
    ],
    audience: 'Student',
    paystackPlanCode: 'PLN_drafthands_student_term'
  },
  STUDENT_SESSION: {
    id: 'STUDENT_SESSION',
    name: 'Full Academic Session Pass',
    badge: 'Best Value (Save 40%)',
    tagline: 'Complete 1-year unrestricted access covering all secondary & tertiary tiers',
    priceNGN: 6000,
    priceUSD: 8.5,
    billingPeriod: 'per session (1 full year)',
    popular: true,
    features: [
      'Everything in Student Termly Pass',
      'Full 12-month access across SS1, SS2, SS3 & Polytechnic/University',
      'Offline drawing sheet PNG/SVG high-resolution export',
      'Advanced 3D Isometric & Orthographic Sectioning models',
      'Continuous syllabus updates for WAEC / NECO / NABTEB',
      'Priority student support & certificate of completion'
    ],
    audience: 'Student',
    paystackPlanCode: 'PLN_drafthands_student_session'
  },
  TEACHER_PRO: {
    id: 'TEACHER_PRO',
    name: 'Teacher & Educator Pro',
    badge: 'Educator Master',
    tagline: 'Automated lesson note generation, WAEC marking schemes, and classroom projection tools',
    priceNGN: 12500,
    priceUSD: 16.5,
    billingPeriod: 'per term',
    features: [
      'Full Curriculum & Whiteboard Studio access for classroom projection',
      'Automated Lesson Note Generator for all 30+ curriculum modules',
      'Accredited NERDC / WAEC / ISO 128 lesson notes formatting',
      'Export Lesson Notes to Printable PDF, Markdown, and JSON',
      'WAEC 15-Mark Examination Assessment Rubrics with tolerance guides',
      '3-Column Blackboard & Screen Layout Delivery Plans',
      'Teacher School metadata customization'
    ],
    audience: 'Teacher',
    paystackPlanCode: 'PLN_drafthands_teacher_term'
  },
  INSTITUTION_PASS: {
    id: 'INSTITUTION_PASS',
    name: 'School & Departmental License',
    badge: 'Institutional Multi-Seat',
    tagline: 'Multi-seat access for technical colleges, secondary school drawing labs, and engineering faculties',
    priceNGN: 45000,
    priceUSD: 58.0,
    billingPeriod: 'per academic session (1 year)',
    features: [
      'Multi-Seat Access for up to 100 Students + All Technical Teachers',
      'Full Departmental Lesson Plan Generator with official school branding',
      'Customized Syllabus alignment for WAEC, NABTEB, and NBTE accredited ND/HND programs',
      'Digital Whiteboard interactive classroom suite for interactive boards / smart TVs',
      'Departmental Analytics & Student Practice Tracking',
      'Dedicated Teacher Onboarding & Technical Drawing Workshop Materials'
    ],
    audience: 'Institution',
    paystackPlanCode: 'PLN_drafthands_institution_annual'
  }
};

export const FREE_TOPICS_PER_TIER = 3;

/**
 * Checks whether a topic is unlocked for a user based on its position in its tier
 * or active subscription.
 */
export function isTopicFreeTier(topicId: string, topicsInTier: { id: string }[]): boolean {
  const index = topicsInTier.findIndex(t => t.id === topicId);
  return index >= 0 && index < FREE_TOPICS_PER_TIER;
}
