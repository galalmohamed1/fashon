'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, RotateCcw, Grid3X3, Grid2X2 } from 'lucide-react';

import { useShop } from '../../../lib/context/ShopContext';
import { SortOption } from '../../../types';
import { ProductCard } from '../../shared/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, filters, setFilters, resetFilters, setSelectedCategory } = useShop();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = [
    { id: 'all', label: 'ALL ARCHIVE' },
    { id: 't-shirts', label: 'T-SHIRTS' },
    { id: 'hoodies', label: 'HOODIES' },
    { id: 'jackets', label: 'JACKETS' },
    { id: 'pants', label: 'PANTS' },
    { id: 'accessories', label: 'ACCESSORIES' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
  const availableColors = [
    { name: 'Black', hex: '#121214' },
    { name: 'White', hex: '#F5F5F7', border: true },
    { name: 'Gray', hex: '#52525B' },
    { name: 'Cream', hex: '#E7E5E4' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Olive', hex: '#374151' }
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'featured', label: 'FEATURED / CURATED' },
    { id: 'newest', label: 'NEW RELEASES' },
    { id: 'price-asc', label: 'PRICE: LOW TO HIGH' },
    { id: 'price-desc', label: 'PRICE: HIGH TO LOW' },
    { id: 'rating', label: 'CUSTOMER RATING' }
  ];

  // Category switch
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setFilters((prev) => ({ ...prev, category: catId as any }));
  };

  // Toggle size filter
  const handleToggleSize = (size: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      const updated = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  // Toggle color filter
  const handleToggleColor = (colorName: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      const updated = exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName];
      return { ...prev, colors: updated };
    });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const prodPrice = product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

        // Category / SubCategory
        if (filters.category && (filters.category as any) !== 'all') {
          const catStr = String(filters.category).toLowerCase();
          const subCatSlug = product.subCategory?.slug?.toLowerCase() || '';
          const subCatName = product.subCategory?.name?.toLowerCase() || '';
          if (!subCatSlug.includes(catStr) && !subCatName.includes(catStr)) {
            return false;
          }
        }

        // Price
        if (prodPrice < filters.minPrice || prodPrice > filters.maxPrice) return false;

        // In Stock
        if (filters.onlyInStock && (!product.isActive || product.isDeleted)) return false;

        // Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            (product.description && product.description.toLowerCase().includes(q)) ||
            (product.subCategory?.name && product.subCategory.name.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;

        switch (filters.sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [products, filters]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Active filter count
  const activeFiltersCount =
    ((filters.category as any) !== 'all' ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.maxPrice < 3000 ? 1 : 0) +
    (filters.onlyInStock ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen pt-10 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="mb-10 pb-8 border-b border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
              COMPLETE ARCHIVE // DROP 01-04
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-black uppercase">
              SHOP COLLECTION.
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold">
              SHOWING {displayedProducts.length} OF {filteredProducts.length} TOTAL PIECES
            </p>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-zinc-200">
          {categories.map((cat) => {
            const isSelected = (filters.category as any) === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white font-bold shadow-md'
                    : 'bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Action Bar: Filters Toggle, Search, Sort, Grid View */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mb-8">
          
          {/* Left Controls: Filter Drawer Toggle & Search */}
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-bold ${
                activeFiltersCount > 0
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-white text-zinc-800 hover:text-black border border-zinc-300 shadow-xs'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* In-Shop Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="FILTER WITHIN SHOP..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-zinc-300 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black shadow-xs"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Sort & Grid View Toggle */}
          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
                className="bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 focus:outline-none focus:border-black cursor-pointer uppercase shadow-xs font-semibold"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-white text-black">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle (Desktop) */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-white border border-zinc-300 shadow-xs">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 3 ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 4 ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                }`}
                title="4 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {isFilterDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-6 shadow-sm">
                
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <Filter className="w-4 h-4 text-red-600" /> REFINE SELECTION
                  </h4>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-mono text-zinc-600 hover:text-red-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> RESET ALL
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Price Slider */}
                  <div>
                    <label className="text-xs font-mono text-zinc-700 uppercase tracking-wider block mb-2 font-semibold">
                      MAX PRICE: <strong className="text-black font-bold">${filters.maxPrice}</strong>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={3000}
                      step={10}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                      <span>$10</span>
                      <span>$3000</span>
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <label className="text-xs font-mono text-zinc-700 uppercase tracking-wider block mb-2 font-semibold">
                      SIZES
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSizes.map((size) => {
                        const isSelected = filters.sizes.includes(size);
                        return (
                          <button
                            key={size}
                            onClick={() => handleToggleSize(size)}
                            className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-black text-white border-black font-bold shadow-xs'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <label className="text-xs font-mono text-zinc-700 uppercase tracking-wider block mb-2 font-semibold">
                      COLOR PALETTE
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => {
                        const isSelected = filters.colors.includes(color.name);
                        return (
                          <button
                            key={color.name}
                            onClick={() => handleToggleColor(color.name)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-200 border-black text-black font-bold'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400'
                            }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full ${color.border ? 'border border-zinc-400' : ''}`}
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* In Stock Checkbox */}
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-zinc-800 font-semibold">
                      <input
                        type="checkbox"
                        checked={filters.onlyInStock}
                        onChange={(e) => setFilters((prev) => ({ ...prev, onlyInStock: e.target.checked }))}
                        className="w-4 h-4 rounded accent-red-600 bg-white border-zinc-300"
                      />
                      <span>IN-STOCK ITEMS ONLY</span>
                    </label>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-[11px] font-mono text-zinc-500 uppercase font-semibold">ACTIVE:</span>
            {(filters.category as any) !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-mono text-zinc-900 font-semibold">
                CATEGORY: {String(filters.category).toUpperCase()}
                <button onClick={() => setFilters((prev) => ({ ...prev, category: 'all' as any }))}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                </button>
              </span>
            )}
            {filters.sizes.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-mono text-zinc-900 font-semibold">
                SIZE: {s}
                <button onClick={() => handleToggleSize(s)}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                </button>
              </span>
            ))}
            {filters.colors.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-mono text-zinc-900 font-semibold">
                COLOR: {c}
                <button onClick={() => handleToggleColor(c)}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                </button>
              </span>
            ))}
            {filters.maxPrice < 3000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-mono text-zinc-900 font-semibold">
                UNDER ${filters.maxPrice}
                <button onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 3000 }))}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-zinc-500 hover:text-black underline ml-2 cursor-pointer font-bold"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            } gap-6 sm:gap-8`}
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-zinc-200 rounded-2xl bg-zinc-50 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-black uppercase">
              NO PIECES MATCH YOUR FILTERS
            </h3>
            <p className="text-zinc-600 text-xs font-mono mt-2 max-w-sm mx-auto">
              Try adjusting your price range, color palettes, or size selection.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-3 rounded-xl bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}

        {/* Pagination / Load More */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer shadow-md"
            >
              LOAD MORE PIECES ({filteredProducts.length - visibleCount} REMAINING)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
