/**
 * DRAFTHANDS ACADEMY - PAYSTACK PAYMENT INTEGRATION LAYER
 * 
 * Provides production-ready integration with Paystack Pop Inline SDK & Checkout API.
 * Supports:
 * - Student Termly Pass (₦2,500)
 * - Student Full Session Pass (₦6,000)
 * - Teacher Pro License (₦12,000)
 * - School / Institutional Master Pass (₦45,000)
 * 
 * Configurable via `VITE_PAYSTACK_PUBLIC_KEY` environment variable.
 */

import { SubscriptionPlanType, SubscriptionPlan, SUBSCRIPTION_PLANS } from '../types/subscription';

export interface PaystackCustomerInfo {
  email: string;
  phone?: string;
  fullName?: string;
  schoolName?: string;
  studentId?: string;
}

export interface PaystackTransactionResponse {
  reference: string;
  trans?: string;
  status: 'success' | 'failed' | 'cancelled';
  message: string;
  transaction?: string;
  trxref?: string;
  redirecturl?: string;
}

export interface PaystackCheckoutConfig {
  planType: SubscriptionPlanType;
  customer: PaystackCustomerInfo;
  onSuccess: (response: { reference: string; planType: SubscriptionPlanType }) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, any>) => {
        openIframe: () => void;
      };
    };
  }
}

const PAYSTACK_INLINE_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

// Configured Paystack public key for development/production
export const getPaystackPublicKey = (): string => {
  return (
    (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY ||
    'pk_test_4a03bc45c73206b87f98c784b02296ddd864fd9e'
  );
};

let scriptLoadingPromise: Promise<boolean> | null = null;

/**
 * Dynamically loads the Paystack Inline JavaScript SDK into the DOM
 */
export const loadPaystackInlineScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.PaystackPop) return Promise.resolve(true);

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    // Check if script already exists in document
    const existingScript = document.querySelector(`script[src="${PAYSTACK_INLINE_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_INLINE_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Paystack inline script could not be loaded from CDN. Falling back to built-in secure modal.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
};

/**
 * Initializes a Paystack transaction popup or redirects to checkout
 */
export const initializePaystackCheckout = async (config: PaystackCheckoutConfig): Promise<void> => {
  const { planType, customer, onSuccess, onClose, onError } = config;
  const plan: SubscriptionPlan | undefined = SUBSCRIPTION_PLANS[planType];

  if (!plan) {
    const err = new Error(`Invalid plan type specified: ${planType}`);
    onError?.(err);
    throw err;
  }

  const publicKey = getPaystackPublicKey();
  const amountInKobo = plan.priceNGN * 100; // Paystack requires amount in Kobo (100 Kobo = 1 NGN)
  const txRef = `DH_${planType}_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const isScriptLoaded = await loadPaystackInlineScript();

  // If Paystack inline JS is available and valid public key is present, launch native popup
  if (isScriptLoaded && window.PaystackPop && !publicKey.includes('mock_key')) {
    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: customer.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: txRef,
        metadata: {
          custom_fields: [
            {
              display_name: 'Subscriber Name',
              variable_name: 'subscriber_name',
              value: customer.fullName || 'Drafthands Student'
            },
            {
              display_name: 'Academic Plan',
              variable_name: 'academic_plan',
              value: plan.name
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone_number',
              value: customer.phone || 'N/A'
            },
            {
              display_name: 'School / Institution',
              variable_name: 'school_name',
              value: customer.schoolName || 'Self-Study'
            }
          ]
        },
        callback: (response: PaystackTransactionResponse) => {
          onSuccess({
            reference: response.reference || txRef,
            planType
          });
        },
        onClose: () => {
          onClose?.();
        }
      });

      handler.openIframe();
      return;
    } catch (err) {
      console.warn('Native Paystack iframe invocation failed, routing to built-in checkout', err);
    }
  }

  // Fallback: If running in test sandbox or CDN blocked, the PaystackCheckoutModal handles user interaction
};

/**
 * Formats pricing into standard Nigerian Naira display strings
 */
export const formatNaira = (amountInNaira: number): string => {
  return `₦${amountInNaira.toLocaleString('en-NG')}`;
};

/**
 * Returns complete subscription plan metadata
 */
export const getPlanDetails = (planType: SubscriptionPlanType): SubscriptionPlan => {
  return SUBSCRIPTION_PLANS[planType] || SUBSCRIPTION_PLANS.STUDENT_TERMLY;
};
