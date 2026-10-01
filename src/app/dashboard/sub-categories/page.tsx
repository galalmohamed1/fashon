import { getCategoriesAdmin, getSubCategoriesAdmin } from '@/actions/admin.actions';
import { SubCategoriesClient } from '@/components/admin/SubCategoriesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sub-Categories — Admin',
};

export default async function AdminSubCategoriesPage() {
  const [subCategories, categories] = await Promise.all([
    getSubCategoriesAdmin(),
    getCategoriesAdmin(),
  ]);

  return (
    <SubCategoriesClient
      initialSubCategories={subCategories}
      categories={categories}
    />
  );
}
