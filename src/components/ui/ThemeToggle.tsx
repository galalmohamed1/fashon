'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'switch';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
  showLabel = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    if (variant === 'switch') {
      return (
        <div className={`h-8 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse ${className}`} />
      );
    }
    return (
      <div className={`w-9 h-9 rounded-full bg-transparent flex items-center justify-center ${className}`}>
        <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 dark:border-zinc-750 bg-zinc-100 dark:bg-zinc-800 p-1 transition-colors duration-300 focus:outline-none ${className}`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`flex h-6 w-6 items-center justify-center rounded-full shadow-xs transition-colors duration-200 ${
            isDark ? 'translate-x-8 bg-zinc-950 text-amber-400' : 'translate-x-0 bg-white text-zinc-900'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-amber-400/20" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </motion.div>
        {showLabel && (
          <span className="ml-2 font-mono text-[10px] font-bold tracking-widest uppercase">
            {isDark ? 'DARK' : 'LIGHT'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle dark mode"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors text-xs font-mono font-bold tracking-wider cursor-pointer ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ y: -8, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 8, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            )}
          </motion.div>
        </AnimatePresence>
        <span className="uppercase text-[11px]">
          {isDark ? 'DARK MODE' : 'LIGHT MODE'}
        </span>
      </button>
    );
  }

  // Default Icon Button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 sm:p-2.5 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-100" />
          ) : (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-800" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
