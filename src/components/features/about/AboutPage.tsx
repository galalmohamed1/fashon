'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Cpu, Leaf, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useShop();

  return (
    <div className="min-h-screen pt-10 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
              ATELIER ARCHIVE // EST. 2024
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-black uppercase tracking-tighter leading-[0.95] mb-6">
            ENGINEERED FOR THE DISCERNING EYE.
          </h1>
          <p className="text-zinc-600 text-base sm:text-xl font-medium leading-relaxed">
            GM is an architectural luxury streetwear house based in Tokyo and Berlin. We exist at the intersection of algorithmic pattern grading, heavyweight organic textiles, and dystopian minimalism.
          </p>
        </div>

        {/* Large Editorial Hero Visual */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-24 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
            alt="GM Atelier Manufacturing"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                PORTO & TOKYO ATELIERS
              </p>
              <h3 className="font-display font-bold text-2xl text-white uppercase">
                ZERO FAST-FASHION. 100% PERMANENCE.
              </h3>
            </div>
            <span className="font-mono text-xs text-zinc-300">
              SOLAR POWERED PRODUCTION // 100% GOTS ORGANIC
            </span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between shadow-xs">
            <Cpu className="w-8 h-8 text-red-600 mb-6" />
            <div>
              <h3 className="font-display font-black text-2xl text-black uppercase mb-3">
                ALGORITHMIC 3D TAILORING
              </h3>
              <p className="text-zinc-600 text-sm font-normal leading-relaxed">
                Traditional garments stretch and warp. Our seamstress engineers utilize proprietary cloth-tension simulation to create box-fit silhouettes that maintain rigid drape angles over hundreds of wears.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between shadow-xs">
            <Shield className="w-8 h-8 text-red-600 mb-6" />
            <div>
              <h3 className="font-display font-black text-2xl text-black uppercase mb-3">
                280 TO 480 GSM DENSITY
              </h3>
              <p className="text-zinc-600 text-sm font-normal leading-relaxed">
                We refuse commercial lightweight poly-blends. Every GM tee and fleece garment is custom-milled in northern Portugal using ultra-high twist, long-staple organic ring-spun cotton.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between shadow-xs">
            <Leaf className="w-8 h-8 text-red-600 mb-6" />
            <div>
              <h3 className="font-display font-black text-2xl text-black uppercase mb-3">
                CLOSED-LOOP SUSTAINABILITY
              </h3>
              <p className="text-zinc-600 text-sm font-normal leading-relaxed">
                Zero harmful runoff. 100% biodegradable garment packaging, non-toxic pigment dye baths, and certified carbon-neutral air freight to every continent.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between shadow-xs">
            <Globe className="w-8 h-8 text-red-600 mb-6" />
            <div>
              <h3 className="font-display font-black text-2xl text-black uppercase mb-3">
                GLOBAL STREET CULTURE
              </h3>
              <p className="text-zinc-600 text-sm font-normal leading-relaxed">
                From underground Tokyo warehouse sets to Berlin techno clubs, GM is worn by visionary creators, architects, and artists who demand uncompromising aesthetic power.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-12 sm:p-16 rounded-3xl bg-zinc-900 border border-zinc-800 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-xl mx-auto relative z-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase mb-4 tracking-tight">
              EXPERIENCE THE ARCHIVE
            </h2>
            <p className="text-zinc-400 text-sm font-light mb-8">
              Discover our latest drop releases or configure your one-of-a-kind 3D custom piece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setActivePage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                BROWSE ARCHIVE
              </button>
              <button
                onClick={() => {
                  setActivePage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                LAUNCH 3D LAB
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
