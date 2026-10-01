import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
}

export function StatCard({ label, value, icon: Icon, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex items-start justify-between gap-4 hover:shadow-sm transition-shadow">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {label}
        </p>
        <p className="font-display font-black text-3xl text-black mt-1 leading-none">
          {value}
        </p>
        {sub && (
          <p className="font-mono text-[11px] text-zinc-400 mt-1.5">{sub}</p>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-zinc-700" />
      </div>
    </div>
  );
}
