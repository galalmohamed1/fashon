export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount?: number;
}