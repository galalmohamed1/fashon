interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const safeStatus = status || 'pending';
  const s = safeStatus.toLowerCase();

  const getStyle = () => {
    switch (s) {
      case 'delivered':
      case 'completed':
        return 'bg-zinc-900 text-white border-zinc-900';
      case 'shipped':
      case 'processing':
        return 'bg-zinc-100 text-zinc-900 border-zinc-300';
      case 'pending':
        return 'bg-white text-zinc-700 border-zinc-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through';
      default:
        return 'bg-white text-zinc-700 border-zinc-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest border rounded ${getStyle()} ${className}`}
    >
      {safeStatus}
    </span>
  );
}
