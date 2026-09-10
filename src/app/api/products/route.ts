import { NextResponse } from 'next/server';
import { getAllProdects } from '../services/prodect.services';

export async function GET() {
  const products = await getAllProdects();
  if (!products) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
  return NextResponse.json({ data: products });
}
