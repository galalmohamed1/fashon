'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { addToast } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ title: 'Please enter a valid email address', type: 'warning' });
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      addToast({ title: 'VIP ACCESS GRANTED', message: 'You will receive private drop alerts 1 hour before public release.', type: 'success' });
    }, 600);
  };

  return (
    <section className="relative py-24 sm:py-32 bg-white border-t border-zinc-200 overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-700 font-bold">
            INNER CIRCLE DROP ACCESS
          </span>
        </div>

        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-black uppercase mb-4">
          GET IN THE LOOP.
        </h2>

        <p className="text-zinc-600 text-base sm:text-lg font-sans max-w-lg mx-auto mb-10">
          New drops. Limited pieces. No noise. Subscribers receive private lookbooks and 60-minute priority checkout access.
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-zinc-50 border border-zinc-300 max-w-md mx-auto shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-display font-black text-lg text-black uppercase">
              YOU ARE ON THE LIST
            </h4>
            <p className="text-xs font-mono text-zinc-600 mt-1 font-bold">
              Check {email} for your welcome archive lookbook code.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-zinc-50 border border-zinc-300 focus-within:border-black transition-all shadow-sm">
              <div className="flex items-center flex-1 px-4 py-2">
                <Mail className="w-4 h-4 text-zinc-400 mr-3 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="w-full bg-transparent text-sm font-mono tracking-wider text-black placeholder:text-zinc-400 focus:outline-none uppercase font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.18em] font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    SUBSCRIBE <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-3 font-medium">
              BY SUBSCRIBING YOU AGREE WITH OUR PRIVACY POLICY. UNSUBSCRIBE ANYTIME.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
