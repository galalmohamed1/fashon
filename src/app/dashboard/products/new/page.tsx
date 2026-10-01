import { getCategoriesAdmin, getSubCategoriesAdmin } from '@/actions/admin.actions';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categories, subCategories] = await Promise.all([
    getCategoriesAdmin(),
    getSubCategoriesAdmin(),
  ]);

  return (
    <ProductForm
      categories={categories ?? []}
      subCategories={subCategories ?? []}
    />
  );
}
