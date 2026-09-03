import { Order, CartItem, PromoValidationResponse, ApiResponse, ShippingMethod } from '../types';

const ACTIVE_PROMO_CODES: Record<string, number> = {
  'GM10': 10,
  'GM15': 15,
  'GM20': 20,
  'GM25': 25,
  'THREADX10': 10,
  'ARCHIVE15': 15,
  'CYBER20': 20,
  'VIP25': 25
};

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'STANDARD COURIER',
    price: 12,
    duration: '3-5 BUSINESS DAYS',
    description: 'Carbon-neutral ground transit in recycled archival packaging'
  },
  {
    id: 'express',
    name: 'GLOBAL EXPRESS DISPATCH',
    price: 28,
    duration: '24-48 HOURS',
    description: 'Priority flight courier with end-to-end tracked signature delivery'
  }
];

export async function validatePromo(code: string, subtotal: number): Promise<ApiResponse<PromoValidationResponse>> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const upper = code.trim().toUpperCase();

  if (ACTIVE_PROMO_CODES[upper]) {
    const discountPercent = ACTIVE_PROMO_CODES[upper];
    return {
      success: true,
      data: {
        valid: true,
        code: upper,
        discountPercent,
        message: `${discountPercent}% VIP ARCHIVE DISCOUNT APPLIED`
      },
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: false,
    data: {
      valid: false,
      code: upper,
      discountPercent: 0,
      message: 'INVALID OR EXPIRED ACCESS CODE'
    },
    timestamp: new Date().toISOString()
  };
}

export async function submitOrder(orderPayload: {
  items: CartItem[];
  email: string;
  shippingAddress: any;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}): Promise<ApiResponse<Order>> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const orderNumber = `GM-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: Order = {
    id: `ord_${Math.random().toString(36).substring(2, 9)}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    status: 'processing',
    items: orderPayload.items,
    shippingAddress: orderPayload.shippingAddress,
    contactEmail: orderPayload.email,
    contactPhone: orderPayload.shippingAddress.phone || '+1 (555) 000-0000',
    subtotal: orderPayload.subtotal,
    discountAmount: orderPayload.discountAmount,
    shippingFee: orderPayload.shippingFee,
    total: orderPayload.total,
    trackingNumber: `TRACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  return {
    success: true,
    data: newOrder,
    message: 'ORDER CONFIRMED & DISPATCH QUEUED',
    timestamp: new Date().toISOString()
  };
}
