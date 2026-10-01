import { getAllProductsAdmin } from '@/actions/admin.actions';
import { ProductsTable } from './ProductsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = (await getAllProductsAdmin()) ?? [];

  return <ProductsTable initialProducts={products} />;
}
