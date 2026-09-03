'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useShop } from '../../lib/context/ShopContext';
import { PRODUCTS } from '../../lib/data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openProductDetail, setActivePage, setSelectedCategory } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTags = ['Oversized Tee', 'Tactical Cargo', 'Tech Jacket', 'Heavyweight Hoodie', 'Obsidian'];

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchTerm]);

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
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Top Bar with Input */}
            <div className="relative flex items-center border-b-2 border-zinc-200 focus-within:border-black transition-colors pb-3">
              <Search className="w-6 h-6 text-zinc-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH PIECES, COLLECTIONS, TECH WEAR..."
                autoFocus
                className="w-full bg-transparent text-lg sm:text-2xl uppercase tracking-wider text-black placeholder:text-zinc-400 focus:outline-none font-display font-black"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-zinc-400 hover:text-black mr-2 cursor-pointer"
                  aria-label="Clear search text"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-1.5 text-xs font-mono tracking-widest text-zinc-600 hover:text-black border border-zinc-300 rounded-lg hover:border-black transition-all uppercase font-bold cursor-pointer"
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
                  className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-200 hover:border-zinc-400 transition-all cursor-pointer"
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
                      {results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="group flex items-center gap-3.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                        >
                          <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                              {product.category}
                            </span>
                            <h4 className="text-sm font-bold text-black group-hover:text-zinc-700 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs font-mono font-bold text-black mt-1">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      ))}
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
                    {PRODUCTS.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="group flex items-center gap-3.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                      >
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                            {product.collection}
                          </span>
                          <h4 className="text-sm font-bold text-black group-hover:text-zinc-700 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs font-mono font-bold text-black mt-1">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    ))}
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
