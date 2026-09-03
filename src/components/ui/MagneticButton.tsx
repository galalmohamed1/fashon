'use client';
import React, { useRef, useState } from 'react';
import { HTMLMotionProps, motion } from 'motion/react';

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.28,
  className = '',
  variant = 'primary',
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-black text-white hover:bg-zinc-800 font-extrabold border border-black shadow-sm';
      case 'secondary':
        return 'bg-zinc-100 text-black hover:bg-zinc-200 border border-zinc-300 font-bold';
      case 'outline':
        return 'bg-transparent text-black border border-black/30 hover:border-black hover:bg-black/5 font-bold';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 border border-red-600 font-bold';
      case 'ghost':
        return 'bg-transparent text-zinc-600 hover:text-black hover:bg-zinc-100 font-semibold';
      default:
        return 'bg-black text-white hover:bg-zinc-800 font-bold';
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 15, stiffness: 200, mass: 0.1 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-7 py-3.5 text-xs uppercase tracking-[0.18em] rounded-none transition-colors duration-200 select-none overflow-hidden group cursor-pointer ${getVariantStyles()} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
      {/* Subtle shine line micro-interaction */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
    </motion.button>
  );
};
