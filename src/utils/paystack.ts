/**
 * DRAFTHANDS ACADEMY - OFFICIAL PAYSTACK PAYMENT UTILITY
 * 
 * Production-ready Paystack Pop Inline Checkout Trigger
 * Configured with `import.meta.env.VITE_PAYSTACK_PUBLIC_KEY`
 * Serves all user roles: Students, Teachers, Parents, and Schools/Institutions.
 */

import { SubscriptionPlanType, SUBSCRIPTION_PLANS } from '../types/subscription';

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
 * Retrieves the configured Paystack public key from environment variables.
 * Explicitly references `import.meta.env.VITE_PAYSTACK_PUBLIC_KEY`.
 */
export const getPaystackPublicKey = (): string => {
  try {
    const envKey = (import.meta as any)?.env?.VITE_PAYSTACK_PUBLIC_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
  } catch (err) {
    console.warn('Could not read VITE_PAYSTACK_PUBLIC_KEY:', err);
  }
  // Safe test fallback if environment variable is not yet injected
  return 'pk_test_4a03bc45c73206b87f98c784b02296ddd864fd9e';
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
      document.head.appendChild(script);
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
    alert(err.message);
    return;
  }

  if (!amount || amount <= 0) {
    const err = new Error('Invalid payment amount specified.');
    onError?.(err);
    alert(err.message);
    return;
  }

  // Ensure script is ready
  const isLoaded = await ensurePaystackScriptLoaded();
  const paystackInstance = (window as any)?.PaystackPop;
  if (!isLoaded || !paystackInstance || typeof paystackInstance.setup !== 'function') {
    const err = new Error('Paystack inline checkout script could not be initialized. Please check your internet connection.');
    onError?.(err);
    alert(err.message);
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
    amount: plan.priceNGN,
    planType: params.planType,
    planName: plan.name,
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
    amount: plan.priceNGN,
    planType: params.planType,
    planName: `Ward Sponsorship: ${plan.name} (${params.wardName})`,
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
    amount: plan.priceNGN,
    planType: 'TEACHER_PRO',
    planName: plan.name,
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
    amount: plan.priceNGN,
    planType: 'INSTITUTION_PASS',
    planName: plan.name,
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
 * Formats pricing into standard Nigerian Naira display string
 */
export const formatNaira = (amountInNaira: number): string => {
  return `₦${amountInNaira.toLocaleString('en-NG')}`;
};
