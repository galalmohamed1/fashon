'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    setActivePage,
    addToast
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === 'GM10' || code === 'VIP2026' || code === 'THREADX10') {
      setDiscountPercent(10);
      setAppliedCode(code);
      setPromoCode('');
      addToast({
        title: 'PROMO CODE APPLIED: 10% OFF',
        type: 'success'
      });
    } else {
      addToast({
        title: 'INVALID PROMO CODE',
        message: 'Try code "GM10"',
        type: 'warning'
      });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[9997] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h3 className="font-display font-black text-lg text-black uppercase tracking-wide">
                  SHOPPING BAG ({cartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-5 sm:px-6 py-3.5 bg-zinc-50 border-b border-zinc-200">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 font-bold">
                {remainingForFreeShipping > 0 ? (
                  <span className="text-zinc-600">
                    ADD <strong className="text-black font-bold">${remainingForFreeShipping.toFixed(0)}</strong> FOR FREE WORLDWIDE SHIPPING
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> FREE WORLDWIDE SHIPPING UNLOCKED
                  </span>
                )}
                <span className="text-zinc-700 font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-xs">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4 className="font-display font-black text-base text-black uppercase">
                    YOUR BAG IS EMPTY
                  </h4>
                  <p className="text-xs font-mono text-zinc-600 mt-1 max-w-xs">
                    Explore our latest drops and architectural essentials.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActivePage('shop');
                    }}
                    className="mt-6 px-6 py-3 rounded-xl bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    EXPLORE SHOP
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors shadow-xs"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                      <img
                        src={item.product.images?.[0]?.secure_url || ''}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-sans font-bold text-xs text-black truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-600">
                          <span>SIZE: <strong className="text-black font-bold">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            COLOR:
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <strong className="text-black font-bold">{item.selectedColor.name}</strong>
                          </span>
                        </div>

                        {item.customDesign && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[9px] font-mono uppercase font-bold">
                            CUSTOM 3D SPEC: {item.customDesign.replace('-', ' ')}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-zinc-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="p-1 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-xs font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="p-1 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-black">
                          ${((item.product.discountPrice && item.product.discountPrice < item.product.price ? item.product.discountPrice : item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 sm:p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
                
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="PROMO CODE (e.g. GM10)"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-mono uppercase text-black placeholder:text-zinc-400 focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-black hover:bg-zinc-800 font-mono text-xs uppercase font-bold text-white transition-colors cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>SUBTOTAL</span>
                    <span className="text-black font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>PROMO ({appliedCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>ESTIMATED SHIPPING</span>
                    <span className="text-black font-bold">
                      {remainingForFreeShipping === 0 ? 'FREE' : '$12.00'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm sm:text-base font-bold text-black">
                    <span>TOTAL</span>
                    <span>
                      ${(finalTotal + (remainingForFreeShipping === 0 ? 0 : 12)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 rounded-xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
