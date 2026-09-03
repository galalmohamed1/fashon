// ============================================================
// config/shipping.ts — Shipping tiers & thresholds
// ============================================================

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 150,
  standardRate: 8.99,
  expressRate: 19.99,
  currency: 'USD',
  estimatedDays: {
    standard: '5-7',
    express: '2-3',
  },
} as const;

export const RETURN_POLICY_DAYS = 30;
export const TAX_RATE = 0.08; // 8%
