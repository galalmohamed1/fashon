'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Truck,
  Sparkles,
  ShoppingBag,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../../../lib/context/ShopContext';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, setActivePage } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    zip: '',
    phone: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
    paymentMethod: 'card' as 'card' | 'apple' | 'klarna'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCost = deliveryMethod === 'standard' ? (cartSubtotal >= 150 ? 0 : 12) : 24;
  const estimatedTax = Number((cartSubtotal * 0.08).toFixed(2));
  const finalTotal = cartSubtotal + shippingCost + estimatedTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'Postal code is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 15) {
        newErrors.cardNumber = 'Valid 16-digit card required';
      }
      if (!formData.cardExp) newErrors.cardExp = 'MM/YY required';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrder = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setOrderComplete(true);
      clearCart();

      // Fire victory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-8 pb-24 bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-zinc-50 border border-zinc-200 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="font-mono text-xs text-red-600 uppercase tracking-widest font-bold block mb-1">
            ACQUISITION CONFIRMED
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase mb-4">
            THANK YOU FOR YOUR ORDER.
          </h2>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 font-mono text-xs text-zinc-700 space-y-2 mb-6 shadow-xs">
            <p>ORDER REFERENCE: <strong className="text-black font-bold">{orderNumber}</strong></p>
            <p>CONFIRMATION SENT TO: <strong className="text-black">{formData.email}</strong></p>
            <p className="text-zinc-500 text-[11px]">DISPATCHING FROM ATELIER TOKYO WITHIN 24 HOURS</p>
          </div>

          <p className="text-zinc-600 text-xs font-sans leading-relaxed mb-8">
            Your archive pieces are being prepared in custom climate-sealed luxury garment sleeves. You will receive tracking coordinates via SMS and email.
          </p>

          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-4 rounded-xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl cursor-pointer"
          >
            RETURN TO ATELIER
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="font-display font-black text-2xl text-black uppercase">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-xs font-mono text-zinc-600 mt-2 mb-6">
            Add items to your bag before proceeding to checkout.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="px-8 py-3.5 rounded-xl bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            DISCOVER SHOP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => setActivePage('shop')}
          className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-black mb-8 uppercase font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO SHOPPING
        </button>

        {/* Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Form Sections */}
          <div className="lg:col-span-7 space-y-8">
            
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* 1. CUSTOMER INFORMATION */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span>
                    CONTACT INFORMATION
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500 font-bold">EXPRESS CHECKOUT</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex.vance@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white border ${
                        errors.email ? 'border-red-500' : 'border-zinc-300'
                      } text-xs font-mono text-black focus:outline-none focus:border-black`}
                    />
                    {errors.email && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-xs font-mono text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        COUNTRY / REGION
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-xs font-mono text-black focus:outline-none focus:border-black uppercase font-medium"
                      >
                        <option value="United States">United States (USD)</option>
                        <option value="United Kingdom">United Kingdom (GBP)</option>
                        <option value="Japan">Japan (JPY)</option>
                        <option value="Germany">Germany (EUR)</option>
                        <option value="France">France (EUR)</option>
                        <option value="Canada">Canada (CAD)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING ADDRESS */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">2</span>
                    SHIPPING DESTINATION
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        FIRST NAME *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Alex"
                        className={`w-full px-4 py-3 rounded-xl bg-white border ${
                          errors.firstName ? 'border-red-500' : 'border-zinc-300'
                        } text-xs font-mono text-black focus:outline-none focus:border-black`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        LAST NAME *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Vance"
                        className={`w-full px-4 py-3 rounded-xl bg-white border ${
                          errors.lastName ? 'border-red-500' : 'border-zinc-300'
                        } text-xs font-mono text-black focus:outline-none focus:border-black`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                      STREET ADDRESS *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="742 Evergreen Terrace"
                      className={`w-full px-4 py-3 rounded-xl bg-white border ${
                        errors.address ? 'border-red-500' : 'border-zinc-300'
                      } text-xs font-mono text-black focus:outline-none focus:border-black`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        CITY *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className={`w-full px-4 py-3 rounded-xl bg-white border ${
                          errors.city ? 'border-red-500' : 'border-zinc-300'
                        } text-xs font-mono text-black focus:outline-none focus:border-black`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        STATE / PROVINCE
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-xs font-mono text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        POSTAL CODE *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className={`w-full px-4 py-3 rounded-xl bg-white border ${
                          errors.zip ? 'border-red-500' : 'border-zinc-300'
                        } text-xs font-mono text-black focus:outline-none focus:border-black`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. DELIVERY METHOD */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">3</span>
                    DELIVERY METHOD
                  </h3>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === 'standard'
                        ? 'border-black bg-white text-black shadow-xs'
                        : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => {}}
                        className="accent-black"
                      />
                      <div>
                        <p className="font-mono text-xs font-bold uppercase text-black">STANDARD WORLDWIDE EXPRESS</p>
                        <p className="text-[11px] text-zinc-500">3-5 business days via DHL Express Tracked</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-black">
                      {cartSubtotal >= 150 ? 'FREE' : '$12.00'}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === 'express'
                        ? 'border-black bg-white text-black shadow-xs'
                        : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === 'express'}
                        onChange={() => {}}
                        className="accent-black"
                      />
                      <div>
                        <p className="font-mono text-xs font-bold uppercase text-black">PRIORITY AIR CHARTER</p>
                        <p className="text-[11px] text-zinc-500">Next-day priority flight dispatch with signature delivery</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-black">$24.00</span>
                  </label>
                </div>
              </div>

              {/* 4. PAYMENT METHOD */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">4</span>
                    PAYMENT SECURITY
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold">
                    <Lock className="w-3 h-3" /> 256-BIT SSL ENCRYPTED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'card' }))}
                    className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      formData.paymentMethod === 'card'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    CREDIT CARD
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'apple' }))}
                    className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      formData.paymentMethod === 'apple'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    APPLE PAY
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'klarna' }))}
                    className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      formData.paymentMethod === 'klarna'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    KLARNA
                  </button>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                        CARD NUMBER *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="4242 •••• •••• 4242"
                          maxLength={19}
                          className={`w-full px-4 py-3 rounded-xl bg-white border ${
                            errors.cardNumber ? 'border-red-500' : 'border-zinc-300'
                          } text-xs font-mono text-black focus:outline-none focus:border-black`}
                        />
                        <CreditCard className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          EXPIRY (MM/YY) *
                        </label>
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          placeholder="12/28"
                          maxLength={5}
                          className={`w-full px-4 py-3 rounded-xl bg-white border ${
                            errors.cardExp ? 'border-red-500' : 'border-zinc-300'
                          } text-xs font-mono text-black focus:outline-none focus:border-black`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          SECURITY CVC *
                        </label>
                        <input
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="•••"
                          maxLength={4}
                          className={`w-full px-4 py-3 rounded-xl bg-white border ${
                            errors.cardCvc ? 'border-red-500' : 'border-zinc-300'
                          } text-xs font-mono text-black focus:outline-none focus:border-black`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'apple' && (
                  <div className="p-6 rounded-xl bg-zinc-100 border border-zinc-200 text-center">
                    <p className="text-xs font-mono text-zinc-700">
                      You will be prompted to authenticate with Face ID / Touch ID upon placing order.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'klarna' && (
                  <div className="p-6 rounded-xl bg-zinc-100 border border-zinc-200 text-center">
                    <p className="text-xs font-mono text-zinc-700">
                      Pay in 4 interest-free payments of <strong className="text-black font-bold">${(finalTotal / 4).toFixed(2)}</strong> every 2 weeks.
                    </p>
                  </div>
                )}

              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> AUTHORIZE PAYMENT — ${finalTotal.toFixed(2)}
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-xl sticky top-28">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black pb-4 mb-6 border-b border-zinc-200">
              ORDER OVERVIEW ({cart.length} ITEMS)
            </h3>

            {/* Items */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 pb-4 mb-6 border-b border-zinc-200">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3.5">
                  <div className="w-14 h-18 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                    <img
                      src={item.product.images?.[0]?.secure_url || ''}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-xs text-black truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      QTY: {item.quantity} • {item.selectedSize} {item.selectedColor?.name ? `• ${item.selectedColor.name}` : ''}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs font-mono text-zinc-600">
              <div className="flex justify-between">
                <span>ITEMS SUBTOTAL</span>
                <span className="text-black font-bold">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SHIPPING</span>
                <span className="text-black font-bold">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ESTIMATED SALES TAX</span>
                <span className="text-black font-bold">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-zinc-200 flex justify-between text-base font-bold text-black">
                <span>TOTAL DUE</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2 text-[11px] font-mono text-zinc-600 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Complimentary insured air dispatch with signature verification.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
