import { getCouponsAdmin } from '@/actions/admin.actions';
import { CouponsClient } from '@/components/admin/CouponsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Coupons — Admin',
};

export default async function AdminCouponsPage() {
  const coupons = (await getCouponsAdmin()) ?? [];

  return <CouponsClient initialCoupons={coupons} />;
}
