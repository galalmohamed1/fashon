import { Product } from "./product";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  subTotal?: number;
  selectedColor?: { name: string; hex: string; border?: boolean };
  selectedSize?: string;
  customDesign?: "kiikii-cat" | "threadx-logo" | "minimal-logo" | "no-logo";
  customColorHex?: string;
}
 
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}