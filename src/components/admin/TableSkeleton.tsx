interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-3">
      {/* Header row skeleton */}
      <div className="h-10 bg-zinc-100 rounded border border-zinc-200" />

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-zinc-50 rounded border border-zinc-100 flex items-center px-4 gap-4"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-zinc-200 rounded flex-1"
              style={{ maxWidth: j === 0 ? '120px' : j === cols - 1 ? '80px' : 'auto' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
