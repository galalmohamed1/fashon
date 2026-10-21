'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../../lib/context/ShopContext';

type ToastPosition =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-center';

const positionClasses: Record<ToastPosition, string> = {
  'bottom-left':   'bottom-6 left-6 items-start',
  'bottom-right':  'bottom-6 right-6 items-end',
  'top-left':      'top-6 left-6 items-start',
  'top-right':     'top-6 right-6 items-end',
  'top-center':    'top-6 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
};

interface ToastContainerProps {
  position?: ToastPosition;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'bottom-right',
}) => {
  const { toasts, removeToast, setIsCartOpen } = useShop();
  const cls = positionClasses[position];

  return (
    <div className={`fixed z-9990 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 ${cls}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl text-black dark:text-white"
          >
            {/* Optional Image */}
            {toast.image ? (
              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <img
                  src={toast.image}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === 'cart'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : toast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {toast.type === 'cart' ? (
                  <ShoppingBag className="w-4 h-4" />
                ) : toast.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wide text-black dark:text-white uppercase">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate mt-0.5 font-mono font-medium">
                  {toast.message}
                </p>
              )}
            </div>

            {/* View Bag Action if cart */}
            {toast.type === 'cart' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[10px] font-mono font-bold tracking-wider text-black hover:bg-zinc-200 uppercase px-2.5 py-1 bg-zinc-100 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
              >
                BAG
              </button>
            )}

            {/* Dismiss */}
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
