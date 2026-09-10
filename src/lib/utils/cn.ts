// ============================================================
// utils/cn.ts — Class name merger (like shadcn's cn util)
// Usage: className={cn("base-class", condition && "extra-class")}
// ============================================================
export function cn(...classes: any[]): any {
  const hasFn = classes.some((c) => typeof c === 'function');
  if (hasFn) {
    return (state: any) =>
      classes
        .map((c) => (typeof c === 'function' ? c(state) : c))
        .filter(Boolean)
        .join(' ');
  }
  return classes.filter(Boolean).join(' ');
}
