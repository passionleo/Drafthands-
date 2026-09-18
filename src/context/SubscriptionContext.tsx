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
  isTeacherOrAdmin: boolean;
  userRole: UserRoleType;
  userProfile?: UserProfile;
  currentPlan: SubscriptionPlan;
  isEmailVerified: boolean;
  setUserRole: (role: UserRoleType) => void;
  setUserProfile: (profile: UserProfile) => void;
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
  redeemVoucherCode: (code: string) => { success: boolean; message: string; plan?: SubscriptionPlanType };
  resetSubscription: () => void;
  openPaywall: (topic?: DrawingTopic) => void;
  closePaywall: () => void;
  isPaywallOpen: boolean;
  paywallTargetTopic: DrawingTopic | null;
}

const STORAGE_KEY = 'drafthands_subscription_v1';

const DEFAULT_STATE: UserSubscriptionState = {
  plan: 'FREE',
  isSubscribed: false,
  activeUntil: null,
  userRole: 'STUDENT',
  userProfile: {
    name: 'Tunde Bakare',
    email: 'tunde.b@student.drafthands.edu',
    institution: 'King’s College, Lagos',
    role: 'STUDENT',
    isEmailVerified: true
  },
  unlockedTopicIds: []
};

// Valid promo / school license codes
const VOUCHER_CODES: Record<string, { plan: SubscriptionPlanType; role: UserRoleType; note: string }> = {
  'DRAFTHANDS-VIP': { plan: 'STUDENT_SESSION', role: 'STUDENT', note: 'VIP Full Session Access' },
  'WAEC-SCHOLAR-2025': { plan: 'STUDENT_SESSION', role: 'STUDENT', note: 'WAEC Scholar Academic Grant' },
  'FSTC-TEACHER': { plan: 'TEACHER_PRO', role: 'TEACHER', note: 'Technical College Faculty License' },
  'EDTECH-PRO': { plan: 'INSTITUTION_PASS', role: 'ADMIN', note: 'Institutional Master License' },
  'TEACHER-FREE-PASS': { plan: 'TEACHER_PRO', role: 'TEACHER', note: 'Teacher Lesson Planner Pass' }
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<UserSubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_STATE,
            ...parsed,
            userRole: parsed.userRole || 'STUDENT',
            userProfile: parsed.userProfile || {
              ...DEFAULT_STATE.userProfile!,
              role: parsed.userRole || 'STUDENT'
            }
          };
        }
      }
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

  const userRole = subscription?.userRole || 'STUDENT';
  const userProfile = subscription?.userProfile;
  const isEmailVerified = userProfile ? Boolean(userProfile.isEmailVerified) : true;
  const currentPlan = SUBSCRIPTION_PLANS[subscription?.plan || 'FREE'] || SUBSCRIPTION_PLANS.FREE;

  const isSubscribed = Boolean(subscription?.isSubscribed && subscription?.plan !== 'FREE');
  const isTeacherOrAdmin = userRole === 'TEACHER' || userRole === 'ADMIN' || (isSubscribed && (subscription?.plan === 'TEACHER_PRO' || subscription?.plan === 'INSTITUTION_PASS'));

  const setUserRole = (role: UserRoleType) => {
    setSubscription(prev => ({
      ...prev,
      userRole: role,
      userProfile: prev.userProfile ? { ...prev.userProfile, role } : {
        name: role === 'STUDENT' ? 'Tunde Bakare' : role === 'TEACHER' ? 'Engr. D. Adebayo' : role === 'PARENT' ? 'Mrs. Folashade Bakare' : 'Prof. Kwesi Mensah',
        email: `${role.toLowerCase()}@drafthands.edu`,
        role,
        isEmailVerified: true
      }
    }));
  };

  const setUserProfile = (profile: UserProfile) => {
    setSubscription(prev => ({
      ...prev,
      userRole: profile.role,
      userProfile: profile
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
    setSubscription(DEFAULT_STATE);
  };

  const checkTopicAccess = (topic: DrawingTopic, topicsInTier: DrawingTopic[]) => {
    // If user has an active premium subscription, everything is unlocked
    if (isSubscribed) {
      return { isAllowed: true, isFreeTier: false, tierIndex: 0 };
    }

    if (!topicsInTier || !Array.isArray(topicsInTier) || !topic) {
      return { isAllowed: true, isFreeTier: true, tierIndex: 0 };
    }

    // Find the index of this topic within its class level
    const tierIndex = topicsInTier.findIndex(t => t?.id === topic?.id);
    const isFreeTier = tierIndex >= 0 && tierIndex < FREE_TOPICS_PER_TIER;

    return {
      isAllowed: isFreeTier,
      isFreeTier,
      tierIndex: tierIndex >= 0 ? tierIndex : 0
    };
  };

  const checkFeatureAccess = (featureKey: '3D_VIEWPORT' | 'EXAM_ARCHIVE_DOWNLOAD' | 'PROJECTION_MODE' | 'TEACHER_TOOLS' | 'ADMIN_TOOLS') => {
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

    // Subscription checks
    if (featureKey === 'PROJECTION_MODE') {
      if (userRole === 'STUDENT') {
        return { isAllowed: false, reason: 'Smart board projection mode is reserved for Educators.' };
      }
      if (!isSubscribed) {
        return { isAllowed: false, reason: 'Live Projection Mode requires an active Teacher Pro or Institution subscription.' };
      }
      return { isAllowed: true };
    }

    if (featureKey === '3D_VIEWPORT' || featureKey === 'EXAM_ARCHIVE_DOWNLOAD') {
      if (!isSubscribed) {
        return { isAllowed: false, reason: 'This module requires an active Drafthands Pro subscription.' };
      }
      return { isAllowed: true };
    }

    return { isAllowed: true };
  };

  const subscribeToPlan = (plan: SubscriptionPlanType, reference?: string) => {
    const isTeacher = plan === 'TEACHER_PRO' || plan === 'INSTITUTION_PASS';
    const expiryDate = new Date();
    if (plan === 'STUDENT_TERMLY' || plan === 'TEACHER_PRO') {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const assignedRole: UserRoleType = isTeacher ? 'TEACHER' : userRole;

    const newState: UserSubscriptionState = {
      plan,
      isSubscribed: true,
      activeUntil: expiryDate.toISOString(),
      licenseKey: reference || `REF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      userRole: assignedRole,
      userProfile: subscription.userProfile ? {
        ...subscription.userProfile,
        role: assignedRole,
        isEmailVerified: true
      } : undefined,
      unlockedTopicIds: []
    };

    setSubscription(newState);
    setIsPaywallOpen(false);
    setPaywallTargetTopic(null);
  };

  const redeemVoucherCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const voucher = VOUCHER_CODES[code];

    if (voucher) {
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
    setSubscription(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const openPaywall = (topic?: DrawingTopic) => {
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
        isTeacherOrAdmin,
        userRole,
        userProfile,
        currentPlan,
        isEmailVerified,
        setUserRole,
        setUserProfile,
        verifyEmail,
        logout,
        checkTopicAccess,
        checkFeatureAccess,
        subscribeToPlan,
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
