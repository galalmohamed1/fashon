'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useShop } from '../../lib/context/ShopContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openProductDetail, setActivePage, products } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTags = ['Tee', 'Hoodie', 'Jacket', 'Pants', 'Black'];

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.subCategory?.name && p.subCategory.name.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q))
    );
  }, [searchTerm, products]);

  const handleSelectProduct = (id: string) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    openProductDetail(id);
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex flex-col justify-start">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12"
        >
          {/* Main Card */}
          <div className="bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Top Bar with Input */}
            <div className="relative flex items-center border-b-2 border-zinc-200 dark:border-zinc-800 focus-within:border-black dark:focus-within:border-white transition-colors pb-3">
              <Search className="w-6 h-6 text-zinc-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH PIECES, COLLECTIONS, TECH WEAR..."
                autoFocus
                className="w-full bg-transparent text-lg sm:text-2xl uppercase tracking-wider text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none font-display font-black"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-zinc-400 hover:text-black dark:hover:text-white mr-2 cursor-pointer"
                  aria-label="Clear search text"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-1.5 text-xs font-mono tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-black dark:hover:border-white transition-all uppercase font-bold cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Quick Trending Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1.5 mr-2 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> TRENDING:
              </span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-400 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results Grid / Recent */}
            <div className="mt-8 max-h-[50vh] overflow-y-auto pr-2">
              {searchTerm.trim() ? (
                results.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono tracking-wider text-zinc-600 uppercase font-bold">
                        FOUND {results.length} RESULTS
                      </span>
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActivePage('shop');
                        }}
                        className="text-xs font-mono text-zinc-600 hover:text-black flex items-center gap-1 font-bold cursor-pointer"
                      >
                        VIEW ALL IN SHOP <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {results.map((product) => {
                        const price = product.discountPrice && product.discountPrice < product.price
                          ? product.discountPrice
                          : product.price;
                        return (
                          <div
                            key={product._id}
                            onClick={() => handleSelectProduct(product._id)}
                            className="group flex items-center gap-3.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                          >
                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                              {product.images?.[0]?.secure_url ? (
                                <img
                                  src={product.images[0].secure_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-200 text-[10px] font-mono">
                                  N/A
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                                {product.subCategory?.name || 'ARCHIVE'}
                              </span>
                              <h4 className="text-sm font-bold text-black group-hover:text-zinc-700 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs font-mono font-bold text-black mt-1">
                                ${price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-black font-mono text-sm tracking-wider uppercase font-bold">
                      NO ARCHIVAL PIECES FOUND FOR "{searchTerm}"
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">
                      Try searching for "Oversized", "Hoodie", "Jacket", or "Pants"
                    </p>
                  </div>
                )
              ) : (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" /> FEATURED ARCHIVE PIECES
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.slice(0, 3).map((product) => {
                      const price = product.discountPrice && product.discountPrice < product.price
                        ? product.discountPrice
                        : product.price;
                      return (
                        <div
                          key={product._id}
                          onClick={() => handleSelectProduct(product._id)}
                          className="group flex items-center gap-3.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                        >
                          <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                            {product.images?.[0]?.secure_url ? (
                              <img
                                src={product.images[0].secure_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-200 text-[10px] font-mono">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                              {product.subCategory?.name || 'ARCHIVE'}
                            </span>
                            <h4 className="text-sm font-bold text-black group-hover:text-zinc-700 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs font-mono font-bold text-black mt-1">
                              ${price}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
