// ============================================================
// lib/metadata.ts — Next.js metadata helpers
// Use in app/*/page.tsx for per-page SEO
// ============================================================
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const SITE_NAME = 'GM — Luxury Futuristic Streetwear';

export function buildMetadata(overrides: Partial<Metadata> & { title?: string }): Metadata {
  const title = overrides.title ? `${overrides.title} | GM` : SITE_NAME;
  return {
    metadataBase: new URL(BASE_URL),
    title,
    description:
      'Premium modern fashion e-commerce brand featuring interactive 3D apparel and futuristic streetwear.',
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
    },
    twitter: { card: 'summary_large_image', title },
    ...overrides,
  };
}
