import { Product, ProductColor } from './product';

export type CustomDesignOption = 'kiikii-cat' | 'threadx-logo' | 'minimal-logo' | 'no-logo';

export interface CartItem {
  id: string; // unique item id = `${productId}-${color}-${size}-${customDesign}`
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  customDesign?: CustomDesignOption;
  customColorHex?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}
