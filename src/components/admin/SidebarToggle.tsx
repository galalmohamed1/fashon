'use client';
import { useSidebar } from '@/lib/context/SidebarContext';
import { Menu } from 'lucide-react';

export default function SidebarToggle() {
  const { setOpen } = useSidebar();

  return (
    <button
      onClick={() => setOpen(true)}
      className="md:hidden p-2 -ml-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}