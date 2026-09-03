// ============================================================
// utils/cn.ts — Class name merger (like shadcn's cn util)
// Usage: className={cn("base-class", condition && "extra-class")}
// ============================================================
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
