'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu, Flame, ArrowRight } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';
import { GMLogo } from '../../ui/GMLogo';

export const EditorialStory: React.FC = () => {
  const { setActivePage } = useShop();

  const pillars = [
    {
      icon: Cpu,
      title: 'PRECISION PATTERNING',
      desc: '3D algorithmic garment modeling with millimeter-accurate seam tension and weight distribution.'
    },
    {
      icon: Shield,
      title: '280-480 GSM HEAVYWEIGHT',
      desc: 'Custom milled organic ring-spun cotton and Gore-Dyneema technical membranes built to last decades.'
    },
    {
      icon: Flame,
      title: 'ZERO-COMPROMISE AESTHETIC',
      desc: 'A fusion of dystopian luxury, brutalist typography, and modern hyper-functional streetwear.'
    }
  ];

  return (
    <section className="relative py-28 sm:py-36 bg-white overflow-hidden border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Dual Fashion Imagery with Staggered Parallax */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              
              {/* Image 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
                  alt="THREADX Studio Architecture"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Image 2 - Shifted downward */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md mt-8 sm:mt-12"
              >
                <img
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"
                  alt="THREADX Cyber Jacket Details"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

            </div>

            {/* Floating Brand Stamp */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-300 text-center shadow-xl flex items-center justify-center">
              <GMLogo size="md" />
            </div>
          </div>

          {/* Right Editorial Text & Philosophy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                OUR MANIFESTO
              </span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.95] mb-6">
              NOT JUST<br />CLOTHES.
            </h2>

            <p className="text-zinc-800 text-lg sm:text-xl font-medium leading-relaxed mb-6 font-sans">
              “GM was built around one idea — clothing should express who you are before you say a word.”
            </p>

            <p className="text-zinc-600 text-sm sm:text-base font-normal leading-relaxed mb-10">
              We reject fast-fashion disposability in favor of deliberate, sculptured luxury garments. Every piece in our archive is tested across extreme urban conditions, engineered with military-spec durability, and tailored for pure geometric expression.
            </p>

            {/* 3 Pillars */}
            <div className="flex flex-col gap-6 pt-6 border-t border-zinc-200">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 text-black">
                      <Icon className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-zinc-600 font-normal mt-1">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read Full Story Button */}
            <div className="mt-10">
              <button
                onClick={() => {
                  setActivePage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-black uppercase hover:text-red-600 transition-colors group cursor-pointer"
              >
                READ THE FULL ATELIER STORY
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
