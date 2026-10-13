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
  X,
  Menu,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSidebar } from '@/lib/context/SidebarContext';

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
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  },[pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    }
  }, [open]);


  function mySignOut() {
      signOut({ redirect: true, callbackUrl: '/login' });
    }

  const content = (
    <>
      <div className='flex justify-between items-start px-6 py-5 border-b border-zinc-800'>
        <div>
          <p className='font-display font-black text-white text-xl uppercase tracking-widest leading-none'>
            GM
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
      <div className="px-3 py-4 border-t border-zinc-800 space-y-0.5">
        <button
          onClick={mySignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-widest text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          SIGN OUT
        </button>
      </div>
    </>
  )
  return (
    <>
    <aside className="hidden md:flex w-60 shrink-0 bg-zinc-950 flex-col border-r border-zinc-800">
      {content}
      </aside>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 flex flex-col border-r border-zinc-800 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}
