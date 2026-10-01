import { notFound } from 'next/navigation';
import {
  getProductByIdAdmin,
  getCategoriesAdmin,
  getSubCategoriesAdmin,
} from '@/actions/admin.actions';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [productRes, categories, subCategories] = await Promise.all([
    getProductByIdAdmin(id),
    getCategoriesAdmin(),
    getSubCategoriesAdmin(),
  ]);

  if (!productRes) {
  notFound();
}

  return (
    <ProductForm
      initialProduct={productRes}
      categories={categories ?? []}
      subCategories={subCategories ?? []}
    />
  );
}
