// ============================================================
// config/site.ts — Global site-wide constants & settings
// Import this anywhere — never hardcode strings directly
// ============================================================

export const SITE_CONFIG = {
  name: 'GM',
  fullName: 'GM — Luxury Futuristic Streetwear',
  description:
    'Premium modern fashion e-commerce brand featuring interactive 3D apparel, futuristic streetwear collections, and high-end editorial curation.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  locale: 'en-US',
  currency: 'USD',
  twitterHandle: '@gm_streetwear',
} as const;

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/gm_streetwear',
  twitter: 'https://twitter.com/gm_streetwear',
  tiktok: 'https://tiktok.com/@gm_streetwear',
} as const;
