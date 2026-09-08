// import { getProducts } from '@/services/products';
// ============================================================
// app/api/products/route.ts — GET /api/products
// Next.js Route Handler (runs on server, no 'use client')
// ============================================================
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const query = searchParams.get('q') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const result = await getProducts({
    category: category as any,
    searchQuery: query,
    minPrice,
    maxPrice,
  });

  if (!result.success) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  return NextResponse.json(result);
}
