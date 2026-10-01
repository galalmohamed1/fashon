'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { LiquidLogoLoader } from './LiquidLogoLoader';

export function triggerRouteLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('start-route-loading'));
  }
}

export function stopRouteLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('stop-route-loading'));
  }
}

export const RouteTransitionLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const prevPathRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start filling animation
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(12);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Simulate natural liquid filling progression up to 88% while waiting for page
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 12;
        if (prev < 70) return prev + 7;
        if (prev < 88) return prev + 3;
        return prev;
      });
    }, 120);

    // Safety fallback: auto-close after 6 seconds in case of stalled navigation
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      finishLoading();
    }, 6000);
  }, []);

  // Complete fill to 100% and fade out
  const finishLoading = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Top off to 100%
    setProgress(100);

    // Brief dwell at 100% so the user enjoys the fully filled emblem, then fade out
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
      }, 350);
    }, 380);
  }, []);

  // Listen for route link clicks across the entire document
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        anchor.target === '_blank' ||
        anchor.getAttribute('rel')?.includes('external') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Only trigger if internal navigation to a different path or search
        const isSameOrigin = targetUrl.origin === currentUrl.origin;
        const isDifferentPath =
          targetUrl.pathname !== currentUrl.pathname ||
          targetUrl.search !== currentUrl.search;

        if (isSameOrigin && isDifferentPath) {
          startLoading();
        }
      } catch {
        // Ignore invalid URL
      }
    };

    // Listen for custom events and browser back/forward
    const handleCustomStart = () => {
      setTimeout(() => startLoading(), 0);
    };
    const handleCustomStop = () => finishLoading();
    const handlePopState = () => {
      setTimeout(() => startLoading(), 0);
    };

    // Intercept router.push / history.pushState
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      const targetUrl = args[2];
      if (targetUrl) {
        try {
          const url = new URL(targetUrl.toString(), window.location.href);
          if (
            url.origin === window.location.origin &&
            (url.pathname !== window.location.pathname || url.search !== window.location.search)
          ) {
            setTimeout(() => {
              startLoading();
            }, 0);
          }
        } catch {
          // ignore
        }
      }
      return originalPushState.apply(window.history, args);
    };

    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('start-route-loading', handleCustomStart);
    window.addEventListener('stop-route-loading', handleCustomStop);
    window.addEventListener('popstate', handlePopState);

    return () => {
      history.pushState = originalPushState;
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('start-route-loading', handleCustomStart);
      window.removeEventListener('stop-route-loading', handleCustomStop);
      window.removeEventListener('popstate', handlePopState);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [startLoading, finishLoading]);

  // When pathname or searchParams changes, mark route transition as arrived
  useEffect(() => {
    const searchStr = searchParams ? searchParams.toString() : '';
    const currentFull = searchStr ? `${pathname}?${searchStr}` : (pathname || '');

    if (prevPathRef.current !== null && prevPathRef.current !== currentFull) {
      // Route has successfully changed
      finishLoading();
    }

    prevPathRef.current = currentFull;
  }, [pathname, searchParams, finishLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="liquid-route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
        >
          {/* Subtle Top Luxury Brand Trim */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-30" />

          {/* Liquid Logo Centerpiece */}
          <LiquidLogoLoader
            progress={progress}
            size={135}
            statusText="TRANSITIONING..."
            showText={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
