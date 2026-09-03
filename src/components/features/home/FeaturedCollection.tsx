'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../../shared/ProductCard';
import { PRODUCTS } from '../../../lib/data/products';
import { useShop } from '../../../lib/context/ShopContext';

export const FeaturedCollection: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();

  // Get 4 key flagship pieces across T-Shirts, Hoodies, Jackets, Pants
  const featuredPieces = [
    PRODUCTS.find((p) => p.id === 'tx-tee-01')!,
    PRODUCTS.find((p) => p.id === 'tx-hoodie-01')!,
    PRODUCTS.find((p) => p.id === 'tx-jacket-01')!,
    PRODUCTS.find((p) => p.id === 'tx-pants-01')!
  ].filter(Boolean);

  const handleExploreCollection = (category?: string) => {
    if (category) setSelectedCategory(category as any);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="featured-collection" className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Background Decorative Ambient */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-8 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                CURATED EDITORIAL // DROP 01
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-black uppercase">
              THE NEW STANDARD.
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-zinc-600 max-w-md text-sm sm:text-base font-normal leading-relaxed">
            Architectural tailoring meets hyper-dense organic cotton. Every seam is engineered for permanent drape retention and zero compromise.
          </p>
        </div>

        {/* Editorial Big Hero Banner + Overlapping Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Large Editorial Banner with Clip-Path Reveal */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-full min-h-[480px] rounded-2xl overflow-hidden group border border-zinc-200 shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
              alt="THREADX Editorial Runway"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Editorial Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[10px] uppercase tracking-widest text-white font-bold">
                  LOOKBOOK 01
                </span>
                <span className="font-mono text-xs text-zinc-300 font-medium">
                  SHANGHAI / TOKYO
                </span>
              </div>

              <div>
                <span className="font-mono text-xs text-red-500 font-bold tracking-widest uppercase mb-1 block">
                  TECHNICAL FLEECE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight mb-3">
                  SHADOW TECH CAPSULE
                </h3>
                <p className="text-zinc-200 text-xs sm:text-sm font-normal line-clamp-2 mb-4">
                  480 GSM French Terry and Gore-Dyneema membrane construction.
                </p>
                <button
                  onClick={() => handleExploreCollection('hoodies')}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-white uppercase hover:text-red-400 transition-colors"
                >
                  DISCOVER HOODIES <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: 4 Editorial Product Cards (Tee, Hoodie, Jacket, Cargo) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredPieces.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>

        {/* View Entire Collection Link */}
        <div className="text-center pt-8">
          <button
            onClick={() => handleExploreCollection()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 group cursor-pointer shadow-md"
          >
            VIEW ALL 18 ARCHIVAL RELEASES
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
