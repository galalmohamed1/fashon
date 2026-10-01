import { getAllOrdersAdmin } from '@/actions/admin.actions';
import { OrdersTable } from './OrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const res = await getAllOrdersAdmin();
  const orders = res.success ? res.data : [];

  return <OrdersTable initialOrders={orders} />;
}
