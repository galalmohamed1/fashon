'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';

export const CollectionsPage: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();

  const collections = [
    {
      id: 'drop-01',
      title: 'DROP 01 // SHADOW TECH',
      season: 'SPRING / SUMMER 2026',
      description: 'Ultra-heavyweight 480 GSM French Terry, Gore-Dyneema weatherproofing, and sculptural oversized fits designed for dystopian urban climates.',
      category: 'hoodies',
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop',
      piecesCount: 6
    },
    {
      id: 'drop-02',
      title: 'DROP 02 // CYBER ORGANIC',
      season: 'CORE ESSENTIALS',
      description: '100% GOTS-certified ring-spun organic cotton milled in Portugal with custom pigment dye washes and millimeter-precise collar ribbing.',
      category: 't-shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
      piecesCount: 8
    },
    {
      id: 'drop-03',
      title: 'DROP 03 // ARCHITECTURAL UTILITY',
      season: 'LIMITED ARCHIVE',
      description: 'Modular articulated tactical cargo pants, titanium hardware buckles, and waterproof zip pockets engineered for extreme mobility.',
      category: 'pants',
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1200&auto=format&fit=crop',
      piecesCount: 5
    }
  ];

  const handleOpenCollection = (cat: string) => {
    setSelectedCategory(cat);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-10 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 pb-8 border-b border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
              EDITORIAL CAMPAIGNS // ARCHIVE RELEASES
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tighter">
            COLLECTIONS & LOOKBOOKS.
          </h1>
        </div>

        {/* Collections Stack */}
        <div className="space-y-16 sm:space-y-24">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Banner */}
              <div className={`lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md group cursor-pointer ${
                idx % 2 === 1 ? 'lg:order-2' : ''
              }`}
              onClick={() => handleOpenCollection(col.category)}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 font-mono text-[11px] text-black font-bold shadow-xs">
                    {col.piecesCount} ARCHIVAL PIECES
                  </span>
                  <span className="p-3 rounded-full bg-black text-white font-bold group-hover:scale-110 transition-transform shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className={`lg:col-span-5 flex flex-col justify-center ${
                idx % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold mb-2">
                  {col.season}
                </span>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-black uppercase leading-tight mb-4 tracking-tight">
                  {col.title}
                </h3>
                <p className="text-zinc-600 text-sm font-normal leading-relaxed mb-8">
                  {col.description}
                </p>
                <button
                  onClick={() => handleOpenCollection(col.category)}
                  className="self-start px-8 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase font-bold tracking-[0.2em] transition-all flex items-center gap-3 shadow-sm cursor-pointer"
                >
                  EXPLORE DROP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
