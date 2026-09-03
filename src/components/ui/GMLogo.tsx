'use client';
import React from 'react';

interface GMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emblem' | 'icon' | 'badge';
  colorMode?: 'dark' | 'light' | 'auto';
}

export const GMLogo: React.FC<GMLogoProps> = ({
  className = '',
  size = 'md',
  colorMode = 'auto'
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const isLightMode = colorMode === 'light';

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none group ${iconSizes[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Background Rounded Geometric Shield */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          className={isLightMode ? 'fill-white stroke-white/30' : 'fill-black stroke-zinc-800'}
          strokeWidth="3"
        />

        {/* Subtle Inner Accent Rim */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="16"
          className={isLightMode ? 'stroke-black/10' : 'stroke-zinc-800/80'}
          strokeWidth="1.5"
        />

        {/* Monogram "G" - Precision Architectural Arch & Crossbar */}
        <path
          d="M44 32H28C21.3726 32 16 37.3726 16 44V56C16 62.6274 21.3726 68 28 68H44C47.3137 68 50 65.3137 50 62V48H33"
          className={isLightMode ? 'stroke-black' : 'stroke-white'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Monogram "M" - Interlocking Architectural Sharp Peaks */}
        <path
          d="M52 68V32L68 54L84 32V68"
          className={isLightMode ? 'stroke-black' : 'stroke-white'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Luxury Atelier Precision Crimson Pip */}
        <circle cx="83" cy="19" r="4.5" className="fill-red-600" />
      </svg>
    </div>
  );
};

