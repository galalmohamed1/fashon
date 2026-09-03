'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import { MagneticButton } from '../../ui/MagneticButton';
import { useShop } from '../../../lib/context/ShopContext';
import { TShirtPhoto } from '../products/TShirt3D';
import img from '../../../assets/kiikii-tshirt.png';

export const Hero: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();

  const handleShopClick = () => {
    setSelectedCategory('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreClick = () => {
    const featuredElem = document.getElementById('featured-collection');
    if (featuredElem) {
      featuredElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('collections');
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden bg-white">
      {/* Cinematic Background Gradients & Micro Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-zinc-200/40 via-red-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#0000000c_1px,transparent_1px)] [background-size:32px_32px] opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Side: Brand Story & Kinetic Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Archive Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300/80 w-fit mb-6 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-zinc-800 font-bold">
                ARCHIVE DROP 01 // AUTUMN-WINTER 2026
              </span>
            </motion.div>

            {/* Main Headline: Line by line reveal */}
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[80px] tracking-tighter leading-[0.9] text-black uppercase mb-6">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-black font-black"
                >
                  WEAR YOUR
                </motion.span>
              </span>
              <span className="block overflow-hidden mt-1">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-zinc-900 font-black tracking-tighter"
                >
                  IDENTITY.
                </motion.span>
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-600 text-base sm:text-lg max-w-lg leading-relaxed mb-8 font-sans font-normal"
            >
              Premium essentials designed for people who refuse to blend in.
              Engineered with 280 GSM combed organic cotton and futuristic architectural cuts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                variant="primary"
                onClick={handleShopClick}
                className="group shadow-md"
              >
                SHOP COLLECTION
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <MagneticButton
                variant="outline"
                onClick={handleExploreClick}
              >
                EXPLORE
              </MagneticButton>
            </motion.div>

            {/* Key Value Micro Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-zinc-200"
            >
              <div>
                <p className="font-mono text-xl sm:text-2xl font-black text-black tracking-tight">
                  280<span className="text-zinc-500 text-sm font-bold">GSM</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  HEAVYWEIGHT DENSE KNIT
                </p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-black text-black tracking-tight">
                  0%
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  FABRIC SHRINKAGE
                </p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-black text-black tracking-tight">
                  100%
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  ORGANIC CERTIFIED
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Side: 3D Interactive Product Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Glow backdrop behind 3D */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-zinc-200/50 via-transparent to-red-500/[0.06] rounded-3xl blur-2xl pointer-events-none" />

            {/* Three.js Canvas */}
            <TShirtPhoto src={img.src} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
