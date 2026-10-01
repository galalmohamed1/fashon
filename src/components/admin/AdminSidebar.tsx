'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Store,
  Tag,
  FolderOpen,
  FolderTree,
} from 'lucide-react';

const navItems = [
  { label: 'OVERVIEW',       href: '/dashboard',            icon: LayoutDashboard, exact: true  },
  { label: 'PRODUCTS',       href: '/dashboard/products',       icon: Package,         exact: false },
  { label: 'CATEGORIES',     href: '/dashboard/categories',     icon: FolderOpen,      exact: false },
  { label: 'SUB-CATEGORIES', href: '/dashboard/sub-categories', icon: FolderTree,      exact: false },
  { label: 'COUPONS',        href: '/dashboard/coupons',        icon: Tag,             exact: false },
  { label: 'ORDERS',         href: '/dashboard/orders',         icon: ShoppingCart,    exact: false },
  { label: 'CUSTOMERS',      href: '/dashboard/customers',      icon: Users,           exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  function mySignOut() {
      signOut({ redirect: true, callbackUrl: '/login' });
    }
  return (
    <aside className="w-60 shrink-0 bg-zinc-950 flex flex-col border-r border-zinc-800">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <p className="font-display font-black text-white text-xl uppercase tracking-widest leading-none">
          GM
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-widest transition-all duration-150 ${
                isActive
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-0.5">
        <button
          onClick={mySignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-widest text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}
