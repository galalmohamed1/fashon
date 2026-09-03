'use client';
import React from 'react';

export const Marquee: React.FC = () => {
  const items = [
    'GM ATELIER',
    'PREMIUM ESSENTIALS',
    'DESIGNED TO MOVE',
    'ARCHIVE 2026',
    'HEAVYWEIGHT 280 GSM',
    'ZERO SHRINKAGE',
    'WORLDWIDE DISPATCH',
    'WEAR YOUR IDENTITY'
  ];

  const content = (
    <div className="flex items-center gap-8 px-4">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="font-display font-black text-sm sm:text-base tracking-[0.25em] text-zinc-300 uppercase whitespace-nowrap hover:text-white transition-colors duration-200">
            {item}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="relative w-full py-4 sm:py-5 border-y border-black bg-black overflow-hidden select-none">
      {/* Left/Right Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Infinite scrolling marquee track */}
      <div className="animate-marquee flex items-center">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};
