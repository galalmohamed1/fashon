import { getAllOrdersAdmin } from '@/actions/admin.actions';
import { OrdersTable } from './OrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = (await getAllOrdersAdmin()) ?? [];

  return <OrdersTable initialOrders={orders} />;
}
