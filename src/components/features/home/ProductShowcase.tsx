'use client';
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

import { PRODUCTS } from '../../../lib/data/products';
import { useShop } from '../../../lib/context/ShopContext';
import { ProductCard } from '../../shared/ProductCard';

export const ProductShowcase: React.FC = () => {
  const { setActivePage } = useShop();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Showcase key flagship products
  const showcaseProducts = PRODUCTS.slice(0, 8);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative py-24 sm:py-32 bg-white border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                ARCHIVE VAULT // 2026
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-black uppercase">
              ICONIC SILHOUETTES.
            </h2>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            <button
              onClick={() => handleScroll('left')}
              className="p-3 rounded-full bg-zinc-100 hover:bg-black hover:text-white border border-zinc-300 text-black transition-colors duration-200 cursor-pointer shadow-xs"
              aria-label="Previous products"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3 rounded-full bg-zinc-100 hover:bg-black hover:text-white border border-zinc-300 text-black transition-colors duration-200 cursor-pointer shadow-xs"
              aria-label="Next products"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {showcaseProducts.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] md:w-[340px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom Explorer Action */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-zinc-200 text-xs font-mono text-zinc-500">
          <span className="tracking-widest uppercase font-semibold">
            SWIPE TO EXPLORE 8 PIECES
          </span>
          <button
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-zinc-900 hover:text-red-600 font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            VIEW FULL SHOP CATALOG <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
