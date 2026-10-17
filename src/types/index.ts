export * from './product';
export type { Category } from './category';
export * from './cart';
export * from './filter';
export * from './navigation';
export * from './order';
export * from './ui';
export * from './wishlist';

// export interface ProductColor {
//   name: string;
//   hex: string;
//   border?: boolean;
// }

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified?: boolean;
  title: string;
  comment: string;
  sizePurchased?: string;
  colorPurchased?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  code: string;
  discountPercent: number;
  message: string;
}
