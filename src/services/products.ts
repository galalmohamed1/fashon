import { Product, Category, FilterState, ApiResponse } from '../types';
import { PRODUCTS } from '../lib/data/products';

/**
 * Client API services for fetching and querying architectural catalog pieces
 */
export async function getProducts(filters?: Partial<FilterState>): Promise<ApiResponse<Product[]>> {
  // Simulate network latency for realistic async API behavior
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...PRODUCTS];

  if (filters) {
    if (filters.category && filters.category !== 'all') {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.collection && filters.collection !== 'all') {
      results = results.filter((p) => p.collection === filters.collection);
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.sizes && filters.sizes.length > 0) {
      results = results.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)));
    }
    if (filters.colors && filters.colors.length > 0) {
      results = results.filter((p) => p.colors.some((c) => filters.colors!.includes(c.name)));
    }
    if (filters.onlyInStock) {
      results = results.filter((p) => p.inStock);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'featured':
        default:
          results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }
  }

  return {
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  };
}

export async function getProductById(id: string): Promise<ApiResponse<Product | null>> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const product = PRODUCTS.find((p) => p.id === id) || null;
  return {
    success: Boolean(product),
    data: product,
    timestamp: new Date().toISOString()
  };
}

export async function getFeaturedProducts(limit = 4): Promise<ApiResponse<Product[]>> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  return {
    success: true,
    data: featured.length ? featured : PRODUCTS.slice(0, limit),
    timestamp: new Date().toISOString()
  };
}

export async function getRelatedProducts(currentId: string, category: Category, limit = 4): Promise<ApiResponse<Product[]>> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const related = PRODUCTS.filter((p) => p.id !== currentId && (p.category === category || p.isFeatured)).slice(0, limit);
  return {
    success: true,
    data: related,
    timestamp: new Date().toISOString()
  };
}

export async function searchArchive(query: string): Promise<ApiResponse<Product[]>> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      success: true,
      data: [],
      timestamp: new Date().toISOString()
    };
  }

  const matches = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.features.some((f) => f.toLowerCase().includes(q))
  );

  return {
    success: true,
    data: matches,
    timestamp: new Date().toISOString()
  };
}
