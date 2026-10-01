import { getAllCustomers } from '@/actions/admin.actions';
import { CustomersTable } from './CustomersTable';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers= (await getAllCustomers())??[];
   

  return <CustomersTable initialCustomers={customers} />;
}
