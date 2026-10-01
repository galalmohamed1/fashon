'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { deleteProduct } from '@/actions/admin.actions';

interface ProductsTableProps {
  initialProducts: Product[];
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.subCategory?.name && p.subCategory.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const isSuccess = await deleteProduct(id);
      if (isSuccess) {
        toast.success(`Product "${name}" deleted successfully`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            PRODUCTS ({products.length})
          </h1>
        </div>

        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          ADD PRODUCT
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono uppercase tracking-wider bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {search ? 'No products matching your search query.' : 'No products found.'}
            </p>
            {!search && (
              <Link
                href="/dashboard/products/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-widest rounded"
              >
                <Plus className="w-3.5 h-3.5" />
                CREATE FIRST PRODUCT
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3 w-16">IMAGE</th>
                  <th className="px-6 py-3">NAME</th>
                  <th className="px-6 py-3">CATEGORY</th>
                  <th className="px-6 py-3">PRICE</th>
                  <th className="px-6 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {filtered.map((product) => {
                  const imgUrl = product.images?.[0]?.secure_url || '/placeholder.png';
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                  return (
                    <tr key={product._id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-14 bg-zinc-100 rounded border border-zinc-200 overflow-hidden relative shrink-0">
                          {product.images?.[0]?.secure_url ? (
                            <Image
                              src={imgUrl}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-zinc-400">
                              NO IMG
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-black text-sm line-clamp-1">{product.name}</p>
                        <p className="font-mono text-[10px] text-zinc-400 tracking-wider">
                          ID: {product._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                        {product.subCategory?.name || '—'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {hasDiscount ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black">${product.discountPrice}</span>
                            <span className="line-through text-zinc-400">${product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-black">${product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/productDetails/${product._id}`}
                            target="_blank"
                            title="View in store"
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/products/${product._id}/edit`}
                            title="Edit product"
                            className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deletingId === product._id}
                            title="Delete product"
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
