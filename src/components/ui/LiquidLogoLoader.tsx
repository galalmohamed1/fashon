'use client';

import React, { useId } from 'react';

interface LiquidLogoLoaderProps {
  progress?: number; // 0 to 100
  size?: number; // pixel size, default 130
  statusText?: string;
  showText?: boolean;
  autoLoop?: boolean;
}

export const LiquidLogoLoader: React.FC<LiquidLogoLoaderProps> = ({
  progress: externalProgress,
  size = 130,
  statusText = 'LOADING ATELIER...',
  showText = true,
  autoLoop = false,
}) => {
  const [internalProgress, setInternalProgress] = React.useState(15);

  React.useEffect(() => {
    if (!autoLoop || externalProgress !== undefined) return;
    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 95) return 15;
        return prev + (prev < 60 ? 4 : 2);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [autoLoop, externalProgress]);

  const progress = externalProgress !== undefined ? externalProgress : (autoLoop ? internalProgress : 50);

  const uniqueId = useId().replace(/:/g, '');
  const shieldClipId = `shield-clip-${uniqueId}`;

  // Clamped progress 0 - 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // In SVG coordinates (viewBox 0 0 100 100):
  // Shield bottom is at 96, top is at 4. Height = 92.
  // When progress = 0: water translateY = 98 (completely below)
  // When progress = 100: water translateY = -8 (completely covers top)
  const waterY = 98 - (clampedProgress / 100) * 106;

  // The crimson pip is illuminated when water reaches top section (> 70%)
  const showPipGlow = clampedProgress >= 70;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* Emblem SVG Container with delicate glow */}
      <div
        className="relative flex items-center justify-center drop-shadow-md"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Shield boundary clip */}
            <clipPath id={shieldClipId}>
              <rect x="4" y="4" width="92" height="92" rx="22" />
            </clipPath>
          </defs>

          {/* ─────────────────────────────────────────────────────────────
              LAYER 1: DRY SHIELD RESERVOIR (DARK OBSIDIAN GLASS)
              ───────────────────────────────────────────────────────────── */}
          {/* Base Shield Background */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill="#121214"
            stroke="#27272a"
            strokeWidth="2.5"
          />

          {/* Inner Accent Rim */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="16"
            stroke="#27272a"
            strokeWidth="1.5"
            fill="none"
          />

          {/* ─────────────────────────────────────────────────────────────
              LAYER 2: THE BLACK WATER LIQUID (CLIPPED TO SHIELD)
              ───────────────────────────────────────────────────────────── */}
          <g clipPath={`url(#${shieldClipId})`}>
            {/* The rising undulating water surface */}
            <g
              style={{
                transform: `translateY(${waterY}px)`,
                transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {/* Back Wave (Deep Charcoal for Fluid Parallax & Depth) */}
              <path
                d="M 0 0 C 25 7, 75 -7, 100 0 C 125 7, 175 -7, 200 0 V 160 H 0 Z"
                fill="#1f1f23"
                className="animate-water-wave-back"
              />

              {/* Front Wave (Pure Pitch Obsidian Black Water) */}
              <path
                d="M 0 0 C 25 -7, 75 7, 100 0 C 125 -7, 175 7, 200 0 V 160 H 0 Z"
                fill="#000000"
                className="animate-water-wave-front"
              />

              {/* Fluid Micro Bubbles Floating inside Black Water */}
              <circle
                cx="32"
                cy="35"
                r="1.8"
                fill="#ffffff"
                className="animate-bubble-1"
                opacity="0.7"
              />
              <circle
                cx="66"
                cy="48"
                r="2.2"
                fill="#ffffff"
                className="animate-bubble-2"
                opacity="0.6"
              />
              <circle
                cx="48"
                cy="65"
                r="1.4"
                fill="#ffffff"
                className="animate-bubble-3"
                opacity="0.8"
              />
            </g>

            {/* Glistening Water Surface Line */}
            <g
              style={{
                transform: `translateY(${waterY}px)`,
                transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              <path
                d="M 0 0 C 25 -7, 75 7, 100 0 C 125 -7, 175 7, 200 0"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
                className="animate-water-wave-front"
              />
            </g>
          </g>

          {/* ─────────────────────────────────────────────────────────────
              LAYER 3: PURE WHITE MONOGRAM "GM" (ALWAYS 100% WHITE THROUGHOUT & AFTER LOADING)
              ───────────────────────────────────────────────────────────── */}
          {/* Monogram "G" - Always Pure Brilliant White */}
          <path
            d="M44 32H28C21.3726 32 16 37.3726 16 44V56C16 62.6274 21.3726 68 28 68H44C47.3137 68 50 65.3137 50 62V48H33"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />

          {/* Monogram "M" - Always Pure Brilliant White */}
          <path
            d="M52 68V32L68 54L84 32V68"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />

          {/* Luxury Atelier Crimson Pip */}
          <circle
            cx="83"
            cy="19"
            r="4.5"
            fill="#dc2626"
            className={showPipGlow ? 'animate-pulse' : 'opacity-85'}
          />

          {/* Shield Outer Precision Border */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill="none"
            stroke="#09090b"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* Luxury Brand Label & Progress Text */}
      {showText && (
        <div className="mt-6 flex flex-col items-center text-center space-y-2">
          <p className="font-display font-black text-xs uppercase tracking-[0.35em] text-black">
            GM ATELIER
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {statusText}
            </span>
            <span className="font-mono text-[10px] text-zinc-700 font-bold ml-1 min-w-[28px] text-right">
              {Math.round(clampedProgress)}%
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-36 h-[2px] bg-zinc-200 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-black transition-all duration-200 ease-out"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
