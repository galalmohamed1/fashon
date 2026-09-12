'use client';
import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';
import { ProductCard } from '../../shared/ProductCard';
import Link from 'next/link';

export const WishlistPage: React.FC = () => {
  // const { wishlist, products, setActivePage } = useShop();

  const { wishlist, products, isWishlistLoading, isProductsLoading } = useShop();
  
  const wishlistedProducts = products.filter((p) => wishlist.includes(p._id));
  const isLoading = isWishlistLoading || isProductsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-10 pb-24 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                CURATED ARCHIVE
              </span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-black uppercase tracking-tight">
              YOUR SAVED PIECES ({wishlist.length})
            </h1>
          </div>

          <Link
            href={'/shop'}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-600 hover:text-black font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> CONTINUE BROWSING
          </Link>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-24 text-center border border-zinc-200 rounded-2xl bg-zinc-50 shadow-xs">
            <Heart className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="font-display font-black text-xl text-black uppercase">
              NO SAVED ITEMS IN YOUR VAULT
            </h3>
            <p className="text-zinc-600 text-xs font-mono mt-2 mb-8 max-w-sm mx-auto">
              Click the heart icon on any garment to curate your private wishlist.
            </p>
            <Link
              href={'/shop'}
              className="mt-6 px-8 py-3.5 rounded-xl bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
