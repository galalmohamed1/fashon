'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
  Mail,
  Shield,
  LogOut,
  Edit3,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'motion/react';

const navItems = [
  {
    label: 'My Profile',
    href: '/profile',
    icon: User,
    description: 'Personal info & details',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: Heart,
    description: 'Saved items',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  {
    label: 'Addresses',
    href: '/profile/addresses',
    icon: MapPin,
    description: 'Manage delivery addresses',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    label: 'Settings',
    href: '/profile/settings',
    icon: Settings,
    description: 'Account & preferences',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
];

function getInitials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const role = (user as any)?.role;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-zinc-100 border border-zinc-100"
        >
          {/* Decorative gradient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-linear-to-br from-green-200/40 to-emerald-300/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-linear-to-tr from-green-100/30 to-teal-200/20 blur-2xl" />
          </div>

          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {getInitials(user?.name)}
                </span>
              </div>
              {role === 'admin' && (
                <div className="absolute -top-2 -right-2 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-md">
                  <Shield className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Admin</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                {user?.name || 'User'}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 text-zinc-500">
                <Mail className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active Account
                </span>
                {role === 'admin' && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <Shield className="w-3 h-3" />
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* Edit button */}
            <Link
              href="/profile/settings"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* ── Navigation Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 px-1">
            Account Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-5 h-5 ${item.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-800 text-sm group-hover:text-zinc-900 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Sign Out ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            className="group cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-red-50 text-red-500 font-medium text-sm border border-red-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </motion.div>

      </div>
    </div>
  );
}
