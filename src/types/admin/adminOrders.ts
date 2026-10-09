export interface AdminOrderItem {
  _id?: string;
  product?: { _id?: string; name?: string; images?: string[] } | string;
  name?: string;
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
}

export interface AdminOrder {
  _id: string;
  orderNumber?: string;
  user?: { _id: string; name: string; email: string };
  contactEmail?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total?: number;
  totalPrice?: number;
  createdAt: string;
  items?: AdminOrderItem[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}