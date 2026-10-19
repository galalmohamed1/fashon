'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useShop } from '../../../lib/context/ShopContext';
import heroImg from '../../../assets/images/hero-models.png'; 

const STATS = [
  { value: '200+', label: 'International Brands' },
  { value: '2,000+', label: 'High-Quality Products' },
  { value: '30,000+', label: 'Happy Customers' },
];

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0 Z" />
  </svg>
);

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useShop();
  const router = useRouter();

  const handleShopClick = () => {
    setSelectedCategory('all');
    router.push('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#f2f0f0] pt-28 lg:pt-0">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 p-10 px-4 sm:px-6 lg:min-h-screen lg:grid-cols-2 lg:px-8">
        {/* Left */}
        <div className="pb-10 lg:pb-0">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl font-black uppercase leading-[0.95] tracking-tighter text-black sm:text-6xl lg:text-7xl"
          >
            Find clothes
            <br />
            that matches
            <br />
            your style
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base"
          >
            Browse through our diverse range of meticulously crafted garments, designed to
            bring out your individuality and cater to your sense of style.
          </motion.p>

          <motion.button
            type="button"
            onClick={handleShopClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 w-full cursor-pointer rounded-full bg-black px-14 py-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:w-auto"
          >
            Shop Now
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-stretch gap-y-6"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`pr-6 sm:pr-8 ${i > 0 ? 'border-l border-zinc-300 pl-6 sm:pl-8' : ''}`}
              >
                <p className="text-3xl font-medium text-black sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs text-zinc-600 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <div className="relative flex h-[420px] items-end justify-center sm:h-[560px] lg:h-full lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute right-2 top-16 z-20 sm:right-8 lg:top-24"
          >
            <Star className="h-14 w-14 text-black sm:h-24 sm:w-24" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute left-2 top-[42%] z-20 sm:left-0"
          >
            <Star className="h-8 w-8 text-black sm:h-12 sm:w-12" />
          </motion.div>

          <motion.img
            src={heroImg.src}
            alt="GM Store models"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 h-full w-auto max-w-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
};