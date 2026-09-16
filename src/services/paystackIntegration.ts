/**
 * DRAFTHANDS ACADEMY - PAYSTACK INTEGRATION SERVICE
 * 
 * Bridges and re-exports the official Paystack utility from `src/utils/paystack.ts`.
 */

export * from '../utils/paystack';

import { SubscriptionPlanType, SubscriptionPlan, SUBSCRIPTION_PLANS } from '../types/subscription';
import { payWithPaystack, PaystackPaymentOptions, PaystackSuccessResponse } from '../utils/paystack';

export interface PaystackCustomerInfo {
  email: string;
  phone?: string;
  fullName?: string;
  schoolName?: string;
  studentId?: string;
}

export type PaystackTransactionResponse = PaystackSuccessResponse;

export interface PaystackCheckoutConfig {
  planType: SubscriptionPlanType;
  customer: PaystackCustomerInfo;
  onSuccess: (response: { reference: string; planType: SubscriptionPlanType }) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

export const loadPaystackInlineScript = async (): Promise<boolean> => {
  const { ensurePaystackScriptLoaded } = await import('../utils/paystack');
  return ensurePaystackScriptLoaded();
};

export const initializePaystackCheckout = async (config: PaystackCheckoutConfig): Promise<void> => {
  const { planType, customer, onSuccess, onClose, onError } = config;
  const plan = SUBSCRIPTION_PLANS[planType];

  if (!plan) {
    const err = new Error(`Invalid plan type specified: ${planType}`);
    onError?.(err);
    throw err;
  }

  await payWithPaystack({
    email: customer.email,
    amount: plan.priceNGN,
    planType,
    planName: plan.name,
    customerName: customer.fullName,
    schoolName: customer.schoolName,
    phone: customer.phone,
    onSuccess: (res) => {
      onSuccess({
        reference: res.reference,
        planType
      });
    },
    onClose,
    onError
  });
};

export const getPlanDetails = (planType: SubscriptionPlanType): SubscriptionPlan => {
  return SUBSCRIPTION_PLANS[planType] || SUBSCRIPTION_PLANS.STUDENT_TERMLY;
};
