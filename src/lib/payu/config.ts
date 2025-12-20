/**
 * PayU Configuration
 *
 * Central configuration for PayU payment gateway
 * Manages environment-based settings, plan configurations, and URLs
 */

/**
 * Plan Configuration Interface
 */
export interface PlanConfig {
  name: string;
  displayName: string;
  amount: number;
  tier: 'professional' | 'agency' | 'enterprise';
  description: string;
  features: string[];
  currency: string;
}

/**
 * PayU Configuration Interface
 */
export interface PayUConfig {
  merchantKey: string;
  merchantSalt: string;
  mode: 'test' | 'production';
  baseUrl: string;
  successUrl: string;
  failureUrl: string;
  webhookUrl: string;
  plans: Record<string, PlanConfig>;
}

/**
 * Get PayU configuration from environment variables
 */
export function getPayUConfig(): PayUConfig {
  const mode = (process.env.PAYU_MODE as 'test' | 'production') || 'test';
  const merchantKey = process.env.PAYU_MERCHANT_KEY || '';
  const merchantSalt = process.env.PAYU_MERCHANT_SALT || '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Determine PayU base URL based on mode
  const baseUrl =
    mode === 'production'
      ? 'https://secure.payu.in'
      : 'https://test.payu.in';

  return {
    merchantKey,
    merchantSalt,
    mode,
    baseUrl,
    successUrl: `${appUrl}/api/payu/success`,
    failureUrl: `${appUrl}/api/payu/failure`,
    webhookUrl: `${appUrl}/api/payu/webhook`,
    plans: {
      professional: {
        name: 'professional',
        displayName: 'Professional',
        amount: 299,
        tier: 'professional',
        description: 'Professional Plan - 1 Month Subscription',
        currency: 'INR',
        features: [
          '10 client workspaces',
          '150 AI messages per day',
          'Real platform API connections',
          'Priority email support',
          'JSON export',
          'Forever chat history',
        ],
      },
      agency: {
        name: 'agency',
        displayName: 'Agency',
        amount: 999,
        tier: 'agency',
        description: 'Agency Plan - 1 Month Subscription',
        currency: 'INR',
        features: [
          '25 client workspaces',
          '300 AI messages per day',
          '5 team members',
          'Large context support',
          'Support for large AI models',
          'Dedicated account manager',
        ],
      },
      enterprise: {
        name: 'enterprise',
        displayName: 'Enterprise',
        amount: 0, // Custom pricing
        tier: 'enterprise',
        description: 'Enterprise Plan - Custom Pricing',
        currency: 'INR',
        features: [
          'Unlimited clients',
          'Unlimited messages',
          '24/7 priority support (phone)',
          'Custom onboarding & training',
          'SLA guarantees (99.9% uptime)',
          'Annual contract discounts',
        ],
      },
    },
  };
}

/**
 * Validate PayU configuration
 * Throws error if required environment variables are missing
 */
export function validatePayUConfig(): void {
  const config = getPayUConfig();

  const errors: string[] = [];

  if (!config.merchantKey) {
    errors.push('PAYU_MERCHANT_KEY is not set');
  }

  if (!config.merchantSalt) {
    errors.push('PAYU_MERCHANT_SALT is not set');
  }

  if (config.mode !== 'test' && config.mode !== 'production') {
    errors.push('PAYU_MODE must be either "test" or "production"');
  }

  if (errors.length > 0) {
    throw new Error(
      `PayU configuration errors:\n${errors.join('\n')}\n\nPlease check your environment variables.`
    );
  }
}

/**
 * Get plan configuration by plan name
 */
export function getPlanConfig(planName: string): PlanConfig | null {
  const config = getPayUConfig();
  const plan = config.plans[planName.toLowerCase()];

  if (!plan) {
    return null;
  }

  return plan;
}

/**
 * Check if plan is valid
 */
export function isValidPlan(planName: string): boolean {
  const validPlans = ['professional', 'agency'];
  return validPlans.includes(planName.toLowerCase());
}

/**
 * Get payment URL for PayU modal/redirect
 */
export function getPaymentUrl(): string {
  const config = getPayUConfig();
  return `${config.baseUrl}/_payment`;
}

/**
 * Get verification URL for PayU transaction verification
 */
export function getVerificationUrl(): string {
  const config = getPayUConfig();
  return `${config.baseUrl}/merchant/postservice.php?form=2`;
}

/**
 * Default export
 */
export const PAYU_CONFIG = getPayUConfig();
