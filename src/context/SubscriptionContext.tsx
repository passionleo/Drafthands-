import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SubscriptionPlanType, 
  UserSubscriptionState, 
  UserRoleType,
  UserProfile,
  SubscriptionPlan,
  SUBSCRIPTION_PLANS, 
  FREE_TOPICS_PER_TIER 
} from '../types/subscription';
import { DrawingTopic, CurriculumTier } from '../types/curriculum';

export interface SubscriptionContextType {
  subscription: UserSubscriptionState;
  isSubscribed: boolean;
  hasActivePaidSubscription: boolean;
  isDemoMode: boolean;
  isTeacherOrAdmin: boolean;
  isMasterAdmin: boolean;
  userRole: UserRoleType;
  userProfile?: UserProfile;
  currentPlan: SubscriptionPlan;
  isEmailVerified: boolean;
  setUserRole: (role: UserRoleType) => void;
  setUserProfile: (profile: UserProfile) => void;
  enableMasterAdminBypass: (ownerEmail?: string) => void;
  disableMasterAdminBypass: () => void;
  verifyEmail: (code: string) => { success: boolean; message: string };
  logout: () => void;
  checkTopicAccess: (topic: DrawingTopic, topicsInTier: DrawingTopic[]) => {
    isAllowed: boolean;
    isFreeTier: boolean;
    tierIndex: number;
  };
  checkFeatureAccess: (featureKey: '3D_VIEWPORT' | 'EXAM_ARCHIVE_DOWNLOAD' | 'PROJECTION_MODE' | 'TEACHER_TOOLS' | 'ADMIN_TOOLS') => {
    isAllowed: boolean;
    reason?: string;
  };
  subscribeToPlan: (plan: SubscriptionPlanType, reference?: string) => void;
  enableDemoMode: () => void;
  redeemVoucherCode: (code: string) => { success: boolean; message: string; plan?: SubscriptionPlanType };
  resetSubscription: () => void;
  openPaywall: (topic?: DrawingTopic) => void;
  closePaywall: () => void;
  isPaywallOpen: boolean;
  paywallTargetTopic: DrawingTopic | null;
}

const STORAGE_KEY = 'drafthands_subscription_v1';
export const MASTER_BYPASS_STORAGE_KEY = 'drafthands_master_admin_bypass';
export const TEACHER_TOKEN_STORAGE_KEY = 'drafthands_teacher_token';
export const PARENT_TOKEN_STORAGE_KEY = 'drafthands_parent_token';

export const MASTER_ADMIN_EMAILS = [
  'passion4dami@gmail.com',
  'admin@drafthands.com.ng',
  'owner@drafthands.com.ng'
];

export const isOwnerOrMasterEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return MASTER_ADMIN_EMAILS.includes(clean) || clean.includes('passion4dami');
};

export const hasExplicitTeacherToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const token = localStorage.getItem(TEACHER_TOKEN_STORAGE_KEY) || sessionStorage.getItem(TEACHER_TOKEN_STORAGE_KEY);
    return Boolean(token && token.trim().length > 0);
  } catch {
    return false;
  }
};

export const hasExplicitParentToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const token = localStorage.getItem(PARENT_TOKEN_STORAGE_KEY) || sessionStorage.getItem(PARENT_TOKEN_STORAGE_KEY);
    return Boolean(token && token.trim().length > 0);
  } catch {
    return false;
  }
};

const DEFAULT_STATE: UserSubscriptionState = {
  plan: 'FREE',
  isSubscribed: false,
  activeUntil: undefined,
  licenseKey: undefined,
  userRole: 'STUDENT',
  isMasterAdmin: false,
  userProfile: {
    name: 'DraftHands Student',
    email: '',
    institution: 'Technical College',
    role: 'STUDENT',
    isEmailVerified: false,
    registeredAt: '2025-01-01T00:00:00.000Z'
  },
  unlockedTopicIds: []
};

// Valid promo / school license codes
const VOUCHER_CODES: Record<string, { plan: SubscriptionPlanType; role: UserRoleType; note: string }> = {
  'PASSION4DAMI': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Master Owner Permanent Bypass' },
  'OWNER-BYPASS': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Master Owner Full Bypass' },
  'ADMIN-BYPASS': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Administrative Master Pass' },
  'MASTER-ADMIN': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Institutional Master License' },
  'DRAFTHANDS-VIP': { plan: 'STUDENT_SESSION', role: 'STUDENT', note: 'VIP Full Session Access' },
  'WAEC-SCHOLAR-2025': { plan: 'STUDENT_SESSION', role: 'STUDENT', note: 'WAEC Scholar Academic Grant' },
  'TEST-FACULTY-PASS': { plan: 'TEACHER_PRO', role: 'TEACHER', note: 'Technical College Faculty License' },
  'FSTC-TEACHER': { plan: 'TEACHER_PRO', role: 'TEACHER', note: 'Technical College Faculty License' },
  'EDTECH-PRO': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Institutional Master License' },
  'TEACHER-FREE-PASS': { plan: 'TEACHER_PRO', role: 'TEACHER', note: 'Teacher Lesson Planner Pass' }
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<UserSubscriptionState>(() => {
    try {
      const storedBypass = typeof window !== 'undefined' ? localStorage.getItem(MASTER_BYPASS_STORAGE_KEY) : null;
      // Master admin bypass strictly when set to 'true'
      const isMasterSaved = storedBypass === 'true';
      const hasTeacherToken = hasExplicitTeacherToken();
      const hasParentToken = hasExplicitParentToken();
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const isMaster = isMasterSaved || (Boolean(parsed.isMasterAdmin) && isOwnerOrMasterEmail(parsed.userProfile?.email));

          // Role separation:
          const effectiveRole: UserRoleType = isMaster
            ? 'ADMIN'
            : (parsed.userRole === 'TEACHER' || parsed.userRole === 'PARENT' || parsed.userRole === 'ADMIN' || parsed.userRole === 'STUDENT')
              ? parsed.userRole
              : 'STUDENT';

          return {
            ...DEFAULT_STATE,
            ...parsed,
            isMasterAdmin: isMaster,
            isSubscribed: isMaster ? true : Boolean(parsed.isSubscribed),
            plan: isMaster ? 'INSTITUTION_PASS' : (parsed.plan || 'FREE'),
            userRole: effectiveRole,
            userProfile: parsed.userProfile ? {
              ...parsed.userProfile,
              role: effectiveRole
            } : {
              ...DEFAULT_STATE.userProfile!,
              role: effectiveRole
            }
          };
        }
      }

      if (isMasterSaved) {
        return {
          ...DEFAULT_STATE,
          plan: 'INSTITUTION_PASS',
          isSubscribed: true,
          isMasterAdmin: true,
          userRole: 'ADMIN',
          userProfile: {
            name: 'Engr. Dami (Platform Owner)',
            email: 'passion4dami@gmail.com',
            institution: 'DraftHands Technical College',
            role: 'ADMIN',
            isEmailVerified: true,
            registeredAt: '2025-01-01T00:00:00.000Z'
          }
        };
      }

      if (hasTeacherToken) {
        return {
          ...DEFAULT_STATE,
          userRole: 'TEACHER',
          userProfile: {
            name: 'Technical Instructor',
            email: 'teacher@drafthands.edu.ng',
            institution: 'DraftHands Technical College',
            role: 'TEACHER',
            isEmailVerified: true,
            registeredAt: '2025-01-01T00:00:00.000Z'
          }
        };
      }

      if (hasParentToken) {
        return {
          ...DEFAULT_STATE,
          userRole: 'PARENT',
          userProfile: {
            name: 'Demo Parent Guardian',
            email: 'parent@drafthands.edu.ng',
            institution: 'Guardian of Demo Student 1',
            role: 'PARENT',
            isEmailVerified: true,
            registeredAt: '2025-01-01T00:00:00.000Z'
          }
        };
      }

      return DEFAULT_STATE;
    } catch (e) {
      console.warn('Failed to load subscription from localStorage', e);
    }
    return DEFAULT_STATE;
  });

  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallTargetTopic, setPaywallTargetTopic] = useState<DrawingTopic | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    } catch (e) {
      console.warn('Failed to save subscription state', e);
    }
  }, [subscription]);

  const userProfile = subscription?.userProfile;
  const isEmailVerified = userProfile ? Boolean(userProfile.isEmailVerified) : true;
  const currentPlan = SUBSCRIPTION_PLANS[subscription?.plan || 'FREE'] || SUBSCRIPTION_PLANS.FREE;

  const isMasterAdmin = Boolean(
    (subscription?.isMasterAdmin && isOwnerOrMasterEmail(subscription?.userProfile?.email)) ||
    isOwnerOrMasterEmail(subscription?.userProfile?.email) ||
    (typeof window !== 'undefined' && localStorage.getItem(MASTER_BYPASS_STORAGE_KEY) === 'true')
  );

  const hasTeacherToken = hasExplicitTeacherToken();
  const rawRole = subscription?.userRole || 'STUDENT';
  const userRole: UserRoleType = isMasterAdmin ? 'ADMIN' : rawRole;

  const isDemoMode = !isMasterAdmin && Boolean(
    subscription?.isDemo || 
    (subscription?.licenseKey && subscription.licenseKey.startsWith('DEMO-'))
  );

  // Strictly check for an active, paid non-demo subscription (or Master Admin bypass)
  const hasActivePaidSubscription = Boolean(
    isMasterAdmin ||
    (subscription?.isSubscribed && 
    subscription?.plan !== 'FREE' && 
    !isDemoMode)
  );

  // isSubscribed reflects strict active paid status or master bypass
  const isSubscribed = Boolean(isMasterAdmin || hasActivePaidSubscription);
  const isTeacherOrAdmin = Boolean(
    isMasterAdmin ||
    (hasTeacherToken && (userRole === 'TEACHER' || userRole === 'ADMIN')) || 
    (hasActivePaidSubscription && (subscription?.plan === 'TEACHER_PRO' || subscription?.plan === 'INSTITUTION_PASS'))
  );

  const setUserRole = (role: UserRoleType) => {
    try {
      if (typeof window !== 'undefined') {
        if (role === 'TEACHER' || role === 'ADMIN') {
          const teacherToken = `TCH_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem(TEACHER_TOKEN_STORAGE_KEY, teacherToken);
          localStorage.removeItem(PARENT_TOKEN_STORAGE_KEY);
        } else if (role === 'PARENT') {
          const parentToken = `PRNT_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem(PARENT_TOKEN_STORAGE_KEY, parentToken);
          localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY);
        } else {
          localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY);
          localStorage.removeItem(PARENT_TOKEN_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    setSubscription(prev => ({
      ...prev,
      userRole: role,
      userProfile: prev.userProfile ? { ...prev.userProfile, role } : {
        name: role === 'STUDENT' ? 'Demo Student 1' : role === 'TEACHER' ? 'Demo Technical Instructor' : role === 'PARENT' ? 'Demo Parent Guardian' : 'Demo Academic Dean',
        email: `${role.toLowerCase()}@test-academy.edu.ng`,
        role,
        isEmailVerified: true
      }
    }));
  };

  const setUserProfile = (profile: UserProfile) => {
    const isOwner = isOwnerOrMasterEmail(profile.email);
    if (isOwner && typeof window !== 'undefined') {
      try {
        localStorage.setItem(MASTER_BYPASS_STORAGE_KEY, 'true');
        localStorage.setItem(TEACHER_TOKEN_STORAGE_KEY, `MASTER_TOKEN_${Date.now()}`);
      } catch (e) {
        console.warn(e);
      }
    }
    setSubscription(prev => ({
      ...prev,
      isMasterAdmin: isOwner ? true : prev.isMasterAdmin,
      isSubscribed: isOwner ? true : prev.isSubscribed,
      plan: isOwner ? 'INSTITUTION_PASS' : prev.plan,
      userRole: profile.role,
      userProfile: profile
    }));
  };

  const enableMasterAdminBypass = (ownerEmail: string = 'passion4dami@gmail.com') => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(MASTER_BYPASS_STORAGE_KEY, 'true');
        localStorage.setItem(TEACHER_TOKEN_STORAGE_KEY, `MASTER_TOKEN_${Date.now()}`);
      }
    } catch (e) {
      console.warn(e);
    }
    setSubscription(prev => ({
      ...prev,
      plan: 'INSTITUTION_PASS',
      isSubscribed: true,
      isMasterAdmin: true,
      activeUntil: '2099-12-31T23:59:59.999Z',
      licenseKey: 'MASTER-OWNER-PASS-PERMANENT',
      userRole: 'ADMIN',
      userProfile: {
        name: 'Engr. Dami (Platform Owner)',
        email: ownerEmail,
        institution: 'DraftHands Technical College',
        role: 'ADMIN',
        isEmailVerified: true,
        registeredAt: prev.userProfile?.registeredAt || new Date().toISOString()
      },
      unlockedTopicIds: []
    }));
    setIsPaywallOpen(false);
    setPaywallTargetTopic(null);
  };

  const disableMasterAdminBypass = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(MASTER_BYPASS_STORAGE_KEY, 'false');
        localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY);
      }
    } catch (e) {
      console.warn(e);
    }
    setSubscription(prev => ({
      ...prev,
      isMasterAdmin: false,
      plan: 'FREE',
      isSubscribed: false,
      userRole: 'STUDENT',
      userProfile: {
        name: 'Demo Student 1',
        email: 'demo.student1@test-academy.edu.ng',
        institution: 'Test Technical Academy',
        role: 'STUDENT',
        isEmailVerified: true
      },
      unlockedTopicIds: []
    }));
  };

  const verifyEmail = (code: string) => {
    const trimmed = code.trim();
    if (trimmed.length >= 4) {
      setSubscription(prev => {
        if (!prev.userProfile) return prev;
        return {
          ...prev,
          userProfile: {
            ...prev.userProfile,
            isEmailVerified: true
          }
        };
      });
      return { success: true, message: 'Email successfully verified! Welcome to Drafthands Academy.' };
    }
    return { success: false, message: 'Invalid verification code. Please enter the code sent to your email.' };
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY);
        localStorage.removeItem(PARENT_TOKEN_STORAGE_KEY);
        localStorage.removeItem(MASTER_BYPASS_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn(e);
    }
    setSubscription(DEFAULT_STATE);
  };

  const checkTopicAccess = (topic: DrawingTopic, topicsInTier: DrawingTopic[]) => {
    // If master admin or active paid subscription, all syllabus modules are fully unlocked
    if (isMasterAdmin || hasActivePaidSubscription) {
      return { isAllowed: true, isFreeTier: false, tierIndex: 0 };
    }

    if (!topicsInTier || !Array.isArray(topicsInTier) || !topic) {
      return { isAllowed: true, isFreeTier: true, tierIndex: 0 };
    }

    // Find the index of this topic within its class level
    const tierIndex = (topicsInTier || []).findIndex(t => t?.id === topic?.id);
    const isFreeTier = tierIndex >= 0 && tierIndex < FREE_TOPICS_PER_TIER;

    // Demo Mode & Free Tier strictly unlock ONLY introductory topics (first 3)
    return {
      isAllowed: isFreeTier,
      isFreeTier,
      tierIndex: tierIndex >= 0 ? tierIndex : 0
    };
  };

  const checkFeatureAccess = (featureKey: '3D_VIEWPORT' | 'EXAM_ARCHIVE_DOWNLOAD' | 'PROJECTION_MODE' | 'TEACHER_TOOLS' | 'ADMIN_TOOLS') => {
    // Master admin bypass allows all features unconditionally
    if (isMasterAdmin) {
      return { isAllowed: true };
    }

    // RBAC check
    if (featureKey === 'TEACHER_TOOLS') {
      if (userRole === 'STUDENT') {
        return { isAllowed: false, reason: 'Educator credentials required. This tool is restricted to Teachers and Administrators.' };
      }
      return { isAllowed: true };
    }

    if (featureKey === 'ADMIN_TOOLS') {
      if (userRole !== 'ADMIN') {
        return { isAllowed: false, reason: 'Institutional Administrator privileges required.' };
      }
      return { isAllowed: true };
    }

    // Subscription checks strictly require active paid subscription
    if (featureKey === 'PROJECTION_MODE') {
      if (userRole === 'STUDENT') {
        return { isAllowed: false, reason: 'Smart board projection mode is reserved for Educators.' };
      }
      if (!hasActivePaidSubscription) {
        return { isAllowed: false, reason: 'Live Projection Mode requires an active Teacher Pro or Institution Paystack subscription.' };
      }
      return { isAllowed: true };
    }

    if (featureKey === '3D_VIEWPORT' || featureKey === 'EXAM_ARCHIVE_DOWNLOAD') {
      if (!hasActivePaidSubscription) {
        return { isAllowed: false, reason: 'This module requires an active Drafthands Paystack subscription.' };
      }
      return { isAllowed: true };
    }

    return { isAllowed: true };
  };

  const subscribeToPlan = (plan: SubscriptionPlanType, reference?: string) => {
    const isTeacher = plan === 'TEACHER_PRO' || plan === 'INSTITUTION_PASS';
    if (isTeacher) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TEACHER_TOKEN_STORAGE_KEY, `TCH_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    const expiryDate = new Date();
    if (plan === 'STUDENT_TERMLY' || plan === 'TEACHER_PRO') {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const assignedRole: UserRoleType = isTeacher ? 'TEACHER' : userRole;
    const isDemo = reference?.startsWith('DEMO-') || false;

    const newState: UserSubscriptionState = {
      plan,
      isSubscribed: !isDemo && plan !== 'FREE',
      activeUntil: isDemo ? null : expiryDate.toISOString(),
      licenseKey: reference || `PAYSTACK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      userRole: assignedRole,
      userProfile: subscription.userProfile ? {
        ...subscription.userProfile,
        role: assignedRole,
        isEmailVerified: true
      } : undefined,
      unlockedTopicIds: [],
      isDemo,
      isMasterAdmin: subscription.isMasterAdmin
    };

    setSubscription(newState);
    setIsPaywallOpen(false);
    setPaywallTargetTopic(null);
  };

  const enableDemoMode = () => {
    setSubscription(prev => ({
      ...prev,
      plan: 'FREE',
      isSubscribed: false,
      isDemo: true,
      licenseKey: `DEMO-${Date.now()}`,
      activeUntil: null
    }));
    setIsPaywallOpen(false);
    setPaywallTargetTopic(null);
  };

  const redeemVoucherCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const voucher = VOUCHER_CODES[code];

    if (voucher) {
      if (voucher.note.includes('Master') || code.includes('PASSION4DAMI') || code.includes('OWNER')) {
        enableMasterAdminBypass('passion4dami@gmail.com');
        return {
          success: true,
          message: 'Master Owner Permanent Bypass Activated! Full access granted across all modules.',
          plan: 'INSTITUTION_PASS' as SubscriptionPlanType
        };
      }

      subscribeToPlan(voucher.plan, `VOUCHER-${code}`);
      return {
        success: true,
        message: `Successfully redeemed! "${voucher.note}" activated.`,
        plan: voucher.plan
      };
    }

    // Custom format check (e.g. school code pattern SCH-XXXX-2025)
    if (code.startsWith('SCH-') || code.startsWith('WAEC-')) {
      subscribeToPlan('STUDENT_SESSION', `CUSTOM-${code}`);
      return {
        success: true,
        message: 'School Institutional Access Code verified! Full session unlocked.',
        plan: 'STUDENT_SESSION' as SubscriptionPlanType
      };
    }

    return {
      success: false,
      message: 'Invalid access code. Please check your voucher or purchase a student pass.'
    };
  };

  const resetSubscription = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY);
        localStorage.removeItem(MASTER_BYPASS_STORAGE_KEY);
      }
    } catch (e) {
      console.warn(e);
    }
    setSubscription(DEFAULT_STATE);
  };

  const openPaywall = (topic?: DrawingTopic) => {
    if (isMasterAdmin) {
      console.info('[DraftHands] Master Owner Admin Bypass active. Paywall modal blocked.');
      return;
    }
    if (topic) {
      setPaywallTargetTopic(topic);
    }
    setIsPaywallOpen(true);
  };

  const closePaywall = () => {
    setIsPaywallOpen(false);
    setPaywallTargetTopic(null);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isSubscribed,
        hasActivePaidSubscription,
        isDemoMode,
        isTeacherOrAdmin,
        isMasterAdmin,
        userRole,
        userProfile,
        currentPlan,
        isEmailVerified,
        setUserRole,
        setUserProfile,
        enableMasterAdminBypass,
        disableMasterAdminBypass,
        verifyEmail,
        logout,
        checkTopicAccess,
        checkFeatureAccess,
        subscribeToPlan,
        enableDemoMode,
        redeemVoucherCode,
        resetSubscription,
        openPaywall,
        closePaywall,
        isPaywallOpen,
        paywallTargetTopic
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
