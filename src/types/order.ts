import { CartItem } from "./cart";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  phone: string;
  shippingMethod: string;
  paymentMethod: "card" | "apple_pay" | "crypto";
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  saveInformation?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}
export type ShippingAddress = {
  fullName: string;
  phoneNumber: string;
  country: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  building: string;
  apartment: string;
  postalCode: string;
  notes?: string;
};