'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

/* ─── types ─── */
type Tab = 'profile' | 'password';
type Status = 'idle' | 'loading' | 'success' | 'error';

/* ─── small helpers ─── */
function getInitials(name?: string | null) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled,
  rightElement,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200
            ${error
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-zinc-200 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-zinc-50' : ''}
            ${rightElement ? 'pr-12' : ''}
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function Toast({
  status,
  message,
}: {
  status: 'success' | 'error';
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-6 border
        ${status === 'success'
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-600'
        }`}
    >
      {status === 'success'
        ? <Check className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />
      }
      {message}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════════════════════════ */
function ProfileTab({ user, routeToken }: { user: any; routeToken?: string }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${routeToken}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setStatus('success');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AnimatePresence>
        {(status === 'success' || status === 'error') && (
          <Toast status={status as 'success' | 'error'} message={message} />
        )}
      </AnimatePresence>

      <InputField
        label="Full Name"
        id="name"
        value={name}
        onChange={setName}
        placeholder="Your full name"
        error={errors.name}
        disabled={status === 'loading'}
      />
      <InputField
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        error={errors.email}
        disabled={status === 'loading'}
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
      >
        {status === 'loading' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
        ) : (
          <><Check className="w-4 h-4" /> Save Changes</>
        )}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   PASSWORD TAB
══════════════════════════════════════════════════════════ */
function PasswordTab({ routeToken }: { routeToken?: string }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!current) e.current = 'Current password is required';
    if (!newPass) e.newPass = 'New password is required';
    else if (newPass.length < 8) e.newPass = 'Password must be at least 8 characters';
    if (!confirm) e.confirm = 'Please confirm your new password';
    else if (confirm !== newPass) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/changeMyPassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${routeToken}`,
        },
        body: JSON.stringify({
          currentPassword: current,
          password: newPass,
          rePassword: confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');
      setStatus('success');
      setMessage('Password changed successfully!');
      setCurrent(''); setNewPass(''); setConfirm('');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-zinc-400 hover:text-zinc-600 transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AnimatePresence>
        {(status === 'success' || status === 'error') && (
          <Toast status={status as 'success' | 'error'} message={message} />
        )}
      </AnimatePresence>

      <InputField
        label="Current Password"
        id="current"
        type={showCurrent ? 'text' : 'password'}
        value={current}
        onChange={setCurrent}
        placeholder="Enter current password"
        error={errors.current}
        disabled={status === 'loading'}
        rightElement={eyeBtn(showCurrent, () => setShowCurrent((v) => !v))}
      />
      <InputField
        label="New Password"
        id="newPass"
        type={showNew ? 'text' : 'password'}
        value={newPass}
        onChange={setNewPass}
        placeholder="At least 8 characters"
        error={errors.newPass}
        disabled={status === 'loading'}
        rightElement={eyeBtn(showNew, () => setShowNew((v) => !v))}
      />

      {/* Strength indicator */}
      {newPass.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => {
              const strength =
                (newPass.length >= 8 ? 1 : 0) +
                (/[A-Z]/.test(newPass) ? 1 : 0) +
                (/[0-9]/.test(newPass) ? 1 : 0) +
                (/[^A-Za-z0-9]/.test(newPass) ? 1 : 0);
              const active = i <= strength;
              const color =
                strength <= 1 ? 'bg-red-400' :
                strength === 2 ? 'bg-amber-400' :
                strength === 3 ? 'bg-blue-400' : 'bg-green-500';
              return (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${active ? color : 'bg-zinc-200'}`}
                />
              );
            })}
          </div>
          <p className="text-xs text-zinc-400">
            {(() => {
              const s =
                (newPass.length >= 8 ? 1 : 0) +
                (/[A-Z]/.test(newPass) ? 1 : 0) +
                (/[0-9]/.test(newPass) ? 1 : 0) +
                (/[^A-Za-z0-9]/.test(newPass) ? 1 : 0);
              return s <= 1 ? 'Weak' : s === 2 ? 'Fair' : s === 3 ? 'Good' : 'Strong';
            })()}  password
          </p>
        </div>
      )}

      <InputField
        label="Confirm New Password"
        id="confirm"
        type={showConfirm ? 'text' : 'password'}
        value={confirm}
        onChange={setConfirm}
        placeholder="Re-enter new password"
        error={errors.confirm}
        disabled={status === 'loading'}
        rightElement={eyeBtn(showConfirm, () => setShowConfirm((v) => !v))}
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
      >
        {status === 'loading' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
        ) : (
          <><Lock className="w-4 h-4" /> Update Password</>
        )}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
];

export function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Loading settings…</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const routeToken = (session as any)?.routeToken;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-green-50/30 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Profile
          </Link>
        </motion.div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-white border border-zinc-100 shadow-lg shadow-zinc-100 p-6 sm:p-8"
        >
          {/* decorative blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-green-200/30 to-emerald-300/10 blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 flex-shrink-0">
              <span className="text-xl font-bold text-white">{getInitials(user?.name)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">{user?.name || 'User'}</h1>
              <p className="text-sm text-zinc-400 mt-0.5">{user?.email}</p>
              {(user as any)?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Tabs + Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-100 overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex border-b border-zinc-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors duration-200
                    ${active ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }}
                >
                  <ProfileTab user={user} routeToken={routeToken} />
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  <PasswordTab routeToken={routeToken} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
