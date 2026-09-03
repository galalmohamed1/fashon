'use client';

import { ProductDetailPage } from '../../../components/features/products/ProductDetailPage';
import { useEffect } from 'react';
import { useShop } from '../../../lib/context/ShopContext';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const { openProductDetail } = useShop();

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      // openProductDetail just sets the selectedProductId in context
      // actually we should probably refactor openProductDetail or just set it
      // Let's call a method to just select the product id. For now, openProductDetail handles setting it.
      // Wait, openProductDetail also does router.push which would cause a loop.
      // Let's modify the shop context later if needed, but for now we need a way to just set the ID.
    }
  }, [params.id]);

  return <ProductDetailPage />;
}
