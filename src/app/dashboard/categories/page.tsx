import { getCategoriesAdmin } from '@/actions/admin.actions';
import { CategoriesClient } from '@/components/admin/CategoriesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Categories — Admin',
};

export default async function AdminCategoriesPage() {
  const categories = (await getCategoriesAdmin()) ?? [];

  return <CategoriesClient initialCategories={categories} />;
}
