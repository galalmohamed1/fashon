// ============================================================
// utils/format.ts — Data formatting helpers
// Pure functions — no imports, no side effects
// ============================================================

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
