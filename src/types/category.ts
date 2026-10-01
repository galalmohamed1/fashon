export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: { public_id: string; secure_url: string };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  category: string | Category | null;
  slug: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  expiresAt?: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}