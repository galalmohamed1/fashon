import { Product } from "./product";

export interface CartItem {
  _id: string;
  product: string | Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
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