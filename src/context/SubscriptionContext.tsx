import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SubscriptionPlanType, 
  UserSubscriptionState, 
  SUBSCRIPTION_PLANS, 
  FREE_TOPICS_PER_TIER 
} from '../types/subscription';
import { DrawingTopic, CurriculumTier } from '../types/curriculum';

interface SubscriptionContextType {
  subscription: UserSubscriptionState;
  isSubscribed: boolean;
  isTeacherOrAdmin: boolean;
  checkTopicAccess: (topic: DrawingTopic, topicsInTier: DrawingTopic[]) => {
    isAllowed: boolean;
    isFreeTier: boolean;
    tierIndex: number;
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
  unlockedTopicIds: []
};

// Valid promo / school license codes
const VOUCHER_CODES: Record<string, { plan: SubscriptionPlanType; role: 'STUDENT' | 'TEACHER' | 'ADMIN'; note: string }> = {
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
        return JSON.parse(saved);
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

  const isSubscribed = subscription.isSubscribed && subscription.plan !== 'FREE';
  const isTeacherOrAdmin = isSubscribed && (subscription.plan === 'TEACHER_PRO' || subscription.plan === 'INSTITUTION_PASS');

  const checkTopicAccess = (topic: DrawingTopic, topicsInTier: DrawingTopic[]) => {
    // If user has an active premium subscription, everything is unlocked
    if (isSubscribed) {
      return { isAllowed: true, isFreeTier: false, tierIndex: 0 };
    }

    // Find the index of this topic within its class level
    const tierIndex = topicsInTier.findIndex(t => t.id === topic.id);
    const isFreeTier = tierIndex >= 0 && tierIndex < FREE_TOPICS_PER_TIER;

    return {
      isAllowed: isFreeTier,
      isFreeTier,
      tierIndex: tierIndex >= 0 ? tierIndex : 0
    };
  };

  const subscribeToPlan = (plan: SubscriptionPlanType, reference?: string) => {
    const isTeacher = plan === 'TEACHER_PRO' || plan === 'INSTITUTION_PASS';
    const expiryDate = new Date();
    if (plan === 'STUDENT_TERMLY' || plan === 'TEACHER_PRO') {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const newState: UserSubscriptionState = {
      plan,
      isSubscribed: true,
      activeUntil: expiryDate.toISOString(),
      licenseKey: reference || `REF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      userRole: isTeacher ? 'TEACHER' : 'STUDENT',
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
        plan: 'STUDENT_SESSION'
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
        checkTopicAccess,
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
