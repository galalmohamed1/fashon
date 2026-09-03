'use client';
// ============================================================
// hooks/useDebounce.ts — Debounce rapidly-firing values
// Usage: const debouncedQuery = useDebounce(searchQuery, 300)
// ============================================================
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
