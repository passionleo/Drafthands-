/**
 * DRAFTHANDS ACADEMY - OFFICIAL PAYSTACK PAYMENT UTILITY
 * 
 * Production-ready Paystack Pop Inline Checkout Trigger
 * Configured with `import.meta.env.VITE_PAYSTACK_PUBLIC_KEY`
 * Live Public Key: pk_live_471bce6179279093b5f31fcc7e0a099210aa72c1
 * Serves all user roles: Students, Teachers, Parents, and Schools/Institutions.
 */

import { SubscriptionPlanType, SUBSCRIPTION_PLANS } from '../types/subscription';

export const PAYSTACK_LIVE_PUBLIC_KEY = 'pk_live_471bce6179279093b5f31fcc7e0a099210aa72c1';

export interface PaystackSuccessResponse {
  reference: string;
  status?: string;
  trans?: string;
  transaction?: string;
  message?: string;
  trxref?: string;
  redirecturl?: string;
  [key: string]: any;
}

export interface PaystackPaymentOptions {
  email: string;
  amount: number; // Amount in Nigerian Naira (NGN)
  currency?: string; // Default: 'NGN'
  reference?: string; // Optional custom reference, auto-generated if omitted
  planType?: SubscriptionPlanType;
  planName?: string;
  userRole?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'SCHOOL' | 'ADMIN';
  customerName?: string;
  phone?: string;
  schoolName?: string;
  metadata?: Record<string, any>;
  channels?: ('card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer')[];
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number; // in Kobo
        currency?: string;
        ref?: string;
        metadata?: {
          custom_fields?: Array<{
            display_name: string;
            variable_name: string;
            value: string;
          }>;
          [key: string]: any;
        };
        channels?: string[];
        callback?: (response: PaystackSuccessResponse) => void;
        onClose?: () => void;
        [key: string]: any;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const PAYSTACK_INLINE_CDN = 'https://js.paystack.co/v1/inline.js';

/**
 * Safe notification helper that handles iframe sandbox restrictions without crashing.
 */
const safeNotify = (message: string) => {
  console.warn('[Paystack]', message);
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    try {
      window.alert(message);
    } catch {
      // Ignored if window.alert is disallowed in sandboxed iframes
    }
  }
};

/**
 * Retrieves the configured Paystack public key from environment variables.
 * Explicitly references `import.meta.env.VITE_PAYSTACK_PUBLIC_KEY`.
 * Wrapped safely in quotation marks as a string.
 */
export const getPaystackPublicKey = (): string => {
  // 1. Check process.env (for Webpack, Next.js, CRA, or Node server environments)
  try {
    if (typeof process !== 'undefined' && process?.env?.VITE_PAYSTACK_PUBLIC_KEY) {
      const key = String(process.env.VITE_PAYSTACK_PUBLIC_KEY).trim();
      if (key.startsWith('pk_')) {
        return key;
      }
    }
  } catch {
    // Ignore errors in environments where process is undefined
  }

  // 2. Check window runtime config (if injected in index.html via window.__ENV__)
  try {
    if (typeof window !== 'undefined') {
      const winKey = (window as any)?.__ENV__?.VITE_PAYSTACK_PUBLIC_KEY || (window as any)?.VITE_PAYSTACK_PUBLIC_KEY;
      if (typeof winKey === 'string' && winKey.trim().startsWith('pk_')) {
        return winKey.trim();
      }
    }
  } catch {
    // Ignore
  }

  // 3. Check Vite static replacement (import.meta.env)
  try {
    const metaKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (typeof metaKey === 'string') {
      const trimmed = metaKey.trim();
      if (trimmed.startsWith('pk_')) {
        return trimmed;
      }
    }
  } catch {
    // Ignore errors if import.meta is unavailable
  }

  // 4. Default to verified official production live key
  return PAYSTACK_LIVE_PUBLIC_KEY;
};

/**
 * Ensures the Paystack inline script is loaded and (window as any)?.PaystackPop is available.
 */
export const ensurePaystackScriptLoaded = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any)?.PaystackPop) return Promise.resolve(true);

  return new Promise((resolve) => {
    try {
      if ((window as any)?.PaystackPop) {
        resolve(true);
        return;
      }

      const existing = document.querySelector(`script[src="${PAYSTACK_INLINE_CDN}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(!!(window as any)?.PaystackPop));
        existing.addEventListener('error', () => resolve(false));
        // In case it already loaded
        if ((window as any)?.PaystackPop) resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = PAYSTACK_INLINE_CDN;
      script.async = true;
      script.onload = () => resolve(!!(window as any)?.PaystackPop);
      script.onerror = () => {
        console.warn('Official Paystack checkout script could not be loaded from CDN.');
        resolve(false);
      };

      const targetParent = document.head || document.body || document.documentElement;
      if (targetParent) {
        targetParent.appendChild(script);
      } else {
        resolve(false);
      }
    } catch (e) {
      console.warn('Safe catch during Paystack script initialization:', e);
      resolve(false);
    }
  });
};

/**
 * Reusable Paystack checkout trigger function.
 * Initializes the official Paystack popup iframe via `(window as any)?.PaystackPop?.setup`.
 */
export const payWithPaystack = async (options: PaystackPaymentOptions): Promise<void> => {
  const {
    email,
    amount,
    currency = 'NGN',
    reference,
    planType,
    planName,
    userRole = 'STUDENT',
    customerName,
    phone,
    schoolName,
    metadata = {},
    channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    onSuccess,
    onClose,
    onError
  } = options;

  if (!email || !email.includes('@')) {
    const err = new Error('A valid email address is required for Paystack receipt issuance.');
    onError?.(err);
    safeNotify(err.message);
    return;
  }

  if (!amount || amount <= 0) {
    const err = new Error('Invalid payment amount specified.');
    onError?.(err);
    safeNotify(err.message);
    return;
  }

  // Ensure script is ready
  const isLoaded = await ensurePaystackScriptLoaded();
  const paystackInstance = (window as any)?.PaystackPop;
  if (!isLoaded || !paystackInstance || typeof paystackInstance.setup !== 'function') {
    const err = new Error('Paystack inline checkout script could not be initialized. Please check your internet connection.');
    onError?.(err);
    safeNotify(err.message);
    return;
  }

  const publicKey = getPaystackPublicKey();
  const amountInKobo = Math.round(amount * 100);
  const txRef = reference || `DH_${userRole}_${planType || 'PASS'}_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const customFields = [
    {
      display_name: 'Customer Name',
      variable_name: 'customer_name',
      value: customerName || 'Drafthands User'
    },
    {
      display_name: 'User Role',
      variable_name: 'user_role',
      value: userRole
    },
    {
      display_name: 'Access Plan',
      variable_name: 'access_plan',
      value: planName || planType || 'Technical Drawing Curriculum'
    },
    {
      display_name: 'School / Institution',
      variable_name: 'school_name',
      value: schoolName || 'Drafthands Academy'
    }
  ];

  if (phone) {
    customFields.push({
      display_name: 'Phone Number',
      variable_name: 'phone_number',
      value: phone
    });
  }

  try {
    const handler = (window as any)?.PaystackPop?.setup({
      key: publicKey,
      email: email.trim().toLowerCase(),
      amount: amountInKobo,
      currency,
      ref: txRef,
      channels,
      metadata: {
        ...metadata,
        custom_fields: customFields
      },
      callback: (response: PaystackSuccessResponse) => {
        onSuccess({
          ...response,
          reference: response.reference || txRef
        });
      },
      onClose: () => {
        onClose?.();
      }
    });

    if (handler && typeof handler.openIframe === 'function') {
      handler.openIframe();
    } else {
      throw new Error('Paystack Pop checkout iframe could not be initialized.');
    }
  } catch (err: any) {
    console.error('Error invoking official Paystack checkout:', err);
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
};

/**
 * Role-specific helper for Student Subscriptions
 */
export const payForStudentSubscription = async (params: {
  email: string;
  planType: SubscriptionPlanType;
  studentName?: string;
  schoolName?: string;
  phone?: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}) => {
  const plan = SUBSCRIPTION_PLANS[params.planType];
  return payWithPaystack({
    email: params.email,
    amount: plan?.priceNGN ?? 2500,
    planType: params.planType,
    planName: plan?.name ?? 'Student Termly Pass',
    userRole: 'STUDENT',
    customerName: params.studentName,
    schoolName: params.schoolName,
    phone: params.phone,
    onSuccess: params.onSuccess,
    onClose: params.onClose,
    onError: params.onError
  });
};

/**
 * Role-specific helper for Parent Ward Sponsorship & Renewal
 */
export const payForParentWardSponsorship = async (params: {
  parentEmail: string;
  parentName?: string;
  wardName: string;
  wardCode: string;
  planType: 'STUDENT_TERMLY' | 'STUDENT_SESSION';
  phone?: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}) => {
  const plan = SUBSCRIPTION_PLANS[params.planType];
  return payWithPaystack({
    email: params.parentEmail,
    amount: plan?.priceNGN ?? 2500,
    planType: params.planType,
    planName: `Ward Sponsorship: ${plan?.name ?? 'Student Pass'} (${params.wardName})`,
    userRole: 'PARENT',
    customerName: params.parentName || 'Parent / Guardian',
    phone: params.phone,
    metadata: {
      ward_name: params.wardName,
      ward_code: params.wardCode,
      sponsorship_type: 'WARD_ACADEMIC_PASS'
    },
    onSuccess: params.onSuccess,
    onClose: params.onClose,
    onError: params.onError
  });
};

/**
 * Role-specific helper for Teacher Pro License
 */
export const payForTeacherPro = async (params: {
  teacherEmail: string;
  teacherName?: string;
  schoolName?: string;
  phone?: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}) => {
  const plan = SUBSCRIPTION_PLANS.TEACHER_PRO;
  return payWithPaystack({
    email: params.teacherEmail,
    amount: plan?.priceNGN ?? 5000,
    planType: 'TEACHER_PRO',
    planName: plan?.name ?? 'Teacher Pro License',
    userRole: 'TEACHER',
    customerName: params.teacherName,
    schoolName: params.schoolName,
    phone: params.phone,
    onSuccess: params.onSuccess,
    onClose: params.onClose,
    onError: params.onError
  });
};

/**
 * Role-specific helper for School / Institution Multi-Seat Pass
 */
export const payForInstitutionPass = async (params: {
  adminEmail: string;
  adminName?: string;
  schoolName: string;
  department?: string;
  phone?: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}) => {
  const plan = SUBSCRIPTION_PLANS.INSTITUTION_PASS;
  return payWithPaystack({
    email: params.adminEmail,
    amount: plan?.priceNGN ?? 35000,
    planType: 'INSTITUTION_PASS',
    planName: plan?.name ?? 'Institution Annual Pass',
    userRole: 'SCHOOL',
    customerName: params.adminName || 'School Administrator',
    schoolName: params.schoolName,
    phone: params.phone,
    metadata: {
      department: params.department || 'Technical Drawing / Engineering',
      seats: '100_STUDENTS_PLUS_TEACHERS'
    },
    onSuccess: params.onSuccess,
    onClose: params.onClose,
    onError: params.onError
  });
};

/**
 * Formats pricing into standard Nigerian Naira display string.
 * Guarded against undefined or null to prevent blank white screen render crashes.
 */
export const formatNaira = (amountInNaira?: number | null): string => {
  if (typeof amountInNaira !== 'number' || isNaN(amountInNaira)) {
    return '₦0';
  }
  return `₦${amountInNaira.toLocaleString('en-NG')}`;
};
