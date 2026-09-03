'use client';
import React, { useEffect } from 'react';
import { motion, Variants } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey: string;
  className?: string;
}

// Cinematic cubic bezier easing for luxury fashion editorial pacing
const cinematicEase = [0.16, 1, 0.3, 1] as const;

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.995,
    filter: 'blur(3px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: cinematicEase,
      staggerChildren: 0.08,
      when: 'beforeChildren'
    }
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.995,
    filter: 'blur(3px)',
    transition: {
      duration: 0.28,
      ease: cinematicEase
    }
  }
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  routeKey,
  className = ''
}) => {
  // Ensure the view resets to the top seamlessly on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [routeKey]);

  return (
    <motion.div
      key={routeKey}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-[calc(100vh-80px)] ${className}`}
    >
      {/* Cinematic Top Shimmer Line on Page Entry */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0.8 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.6, ease: cinematicEase }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-black z-[60] origin-left pointer-events-none"
      />
      {children}
    </motion.div>
  );
};
