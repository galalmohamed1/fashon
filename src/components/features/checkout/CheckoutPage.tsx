'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../../../lib/context/ShopContext';

import Link from 'next/link';
import { addOrder } from '@/actions/checkout.actions';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    setActivePage,
    appliedCouponCode,
    discountAmount,
    clearCoupon,
    addToast,
    // clearCart,
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: 'Egypt',
    governorate: '',
    city: '',
    area: '',
    street: '',
    building: '',
    apartment: '',
    postalCode: '',
    notes: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
    paymentMethod: 'Instapay' as 'card' | 'apple' | 'Instapay',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [useSavedAddress, setUseSavedAddress] = useState<boolean>(false);

  const handleSelectSavedAddress = (addr: any) => {
    setUseSavedAddress(true);
    setFormData((prev) => ({
      ...prev,
      firstName: addr.recipient?.split(' ')[0] || '',
      lastName: addr.recipient?.split(' ').slice(1).join(' ') || '',
      street: addr.street || '',
      city: addr.city || '',
      governorate: addr.governorate || addr.state || '',
      area: addr.area || '',
      building: addr.building || '',
      apartment: addr.apartment || '',
      postalCode: addr.postalCode || addr.zipCode || '',
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('user_addresses');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) {
        setSavedAddresses(parsed);
        const defaultAddr = parsed.find((a: any) => a.isDefault) || parsed[0];
        handleSelectSavedAddress(defaultAddr);
      }
    }
  }, []);

  const shippingCost = deliveryMethod === 'standard' ? (cartSubtotal >= 150 ? 0 : 12) : 24;
  const estimatedTax = Number((cartSubtotal * 0.08).toFixed(2));
  const finalTotal = Math.max(0, cartSubtotal - discountAmount) + shippingCost + estimatedTax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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

  const inputCls = (name: string) =>
    `w-full px-4 py-3 rounded-xl bg-white border ${
      errors[name] ? 'border-red-500' : 'border-zinc-300'
    } text-xs font-mono text-black focus:outline-none focus:border-black`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';


    if (!/^01[0125]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Valid Egyptian phone required (01xxxxxxxxx)';
    }

    if (!formData.governorate.trim()) newErrors.governorate = 'Governorate is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.building.trim()) newErrors.building = 'Building is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await addOrder({
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phoneNumber: formData.phone.trim(),
          country: formData.country,
          governorate: formData.governorate.trim(),
          city: formData.city.trim(),
          area: formData.area.trim(),
          street: formData.street.trim(),
          building: formData.building.trim(),
          apartment: formData.apartment.trim(),
          postalCode: formData.postalCode.trim(),
          notes: formData.notes.trim() || undefined,
        },
        
        paymentMethod: 'CashOnDelivery',
        couponCode: appliedCouponCode || undefined,
      });

      if (!result.success) {
        addToast({
          title: 'ORDER FAILED',
          message: result.message,
          type: 'warning',
        });
        return;
      }

      const d: any = result.data;
      setOrderNumber(d?.orderNumber || d?.order?._id || d?._id || '');
      setOrderComplete(true);
      clearCoupon();
      // clearCart(); // لو الباك إند مش بيفضي الكارت بنفسه

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
    }
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
            {orderNumber && (
              <p>ORDER REFERENCE: <strong className="text-black font-bold">{orderNumber}</strong></p>
            )}
            <p>WE WILL CONTACT YOU ON: <strong className="text-black">{formData.phone}</strong></p>
            <p className="text-zinc-500 text-[11px]">DISPATCHING FROM ATELIER TOKYO WITHIN 24 HOURS</p>
          </div>

          <p className="text-zinc-600 text-xs font-sans leading-relaxed mb-8">
            Your archive pieces are being prepared in custom climate-sealed luxury garment sleeves. You will receive tracking coordinates via SMS and email.
          </p>

          <Link
            href="/home"
            className="w-full py-4 rounded-xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl cursor-pointer"
          >
            RETURN TO ATELIER
          </Link>
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
    <div className="min-h-screen pt-18 sm:pt-18 pb-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <Link
          href="/shop"
          className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-black mb-8 uppercase font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO SHOPPING
        </Link>

        {/* Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Left: Form Sections */}
          <div className="lg:col-span-7 space-y-8">

            <form onSubmit={handleSubmitOrder} className="space-y-8">

              {/* 1. CONTACT INFORMATION */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span>
                    CONTACT INFORMATION
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01000000000"
                      className={inputCls('phone')}
                    />
                    {errors.phone && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.phone}</p>}
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
                      <option value="Egypt">Egypt (EG)</option>
                    </select>
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
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-3 font-bold">
                        SELECT SAVED ADDRESS
                      </label>
                      <div className="space-y-3">
                        {savedAddresses.map((addr: any) => (
                          <label
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                              useSavedAddress && formData.street === addr.street
                                ? 'border-black bg-white text-black shadow-xs'
                                : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={useSavedAddress && formData.street === addr.street}
                                onChange={() => {}}
                                className="accent-black"
                              />
                              <div>
                                <p className="font-mono text-xs font-bold uppercase text-black">{addr.name}</p>
                                <p className="text-[11px] text-zinc-500">{addr.street}, {addr.city}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                        <label
                          onClick={() => {
                            setUseSavedAddress(false);
                            setFormData((prev) => ({
                              ...prev,
                              firstName: '',
                              lastName: '',
                              governorate: '',
                              city: '',
                              area: '',
                              street: '',
                              building: '',
                              apartment: '',
                              postalCode: '',
                            }));
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            !useSavedAddress
                              ? 'border-black bg-white text-black shadow-xs'
                              : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={!useSavedAddress}
                              onChange={() => {}}
                              className="accent-black"
                            />
                            <p className="font-mono text-xs font-bold uppercase text-black">USE A DIFFERENT ADDRESS</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className={`space-y-4 ${useSavedAddress ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Names */}
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
                          placeholder="Mohammed"
                          className={inputCls('firstName')}
                        />
                        {errors.firstName && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.firstName}</p>}
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
                          placeholder="Sherif"
                          className={inputCls('lastName')}
                        />
                        {errors.lastName && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Governorate / City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          GOVERNORATE *
                        </label>
                        <input
                          type="text"
                          name="governorate"
                          value={formData.governorate}
                          onChange={handleInputChange}
                          placeholder="Cairo"
                          className={inputCls('governorate')}
                        />
                        {errors.governorate && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.governorate}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          CITY *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Nasr City"
                          className={inputCls('city')}
                        />
                        {errors.city && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.city}</p>}
                      </div>
                    </div>

                    {/* Area / Street */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          AREA *
                        </label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          placeholder="District 1"
                          className={inputCls('area')}
                        />
                        {errors.area && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.area}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          STREET *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="Main Street"
                          className={inputCls('street')}
                        />
                        {errors.street && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.street}</p>}
                      </div>
                    </div>

                    {/* Building / Apartment / Postal */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          BUILDING *
                        </label>
                        <input
                          type="text"
                          name="building"
                          value={formData.building}
                          onChange={handleInputChange}
                          placeholder="10"
                          className={inputCls('building')}
                        />
                        {errors.building && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.building}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          APARTMENT
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="5"
                          className={inputCls('apartment')}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                          POSTAL CODE *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="11765"
                          className={inputCls('postalCode')}
                        />
                        {errors.postalCode && <p className="text-[10px] font-mono text-red-600 mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Notes (خارج الـ block المقفول عشان يفضل متاح مع العنوان المحفوظ) */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-700 uppercase mb-1.5 font-bold">
                      DELIVERY NOTES
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Call me before delivery"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-xs font-mono text-black focus:outline-none focus:border-black resize-none"
                    />
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

              {/* 4. PAYMENT METHOD (بدون تغيير) */}
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
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'Instapay' }))}
                    className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      formData.paymentMethod === 'Instapay'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    INSTAPAY
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

                {formData.paymentMethod === 'Instapay' && (
                  <div className="p-6 rounded-xl bg-zinc-100 border border-zinc-200 text-center">
                    <p className="text-xs font-mono text-zinc-700 pb-4">
                      Pay via InstaPay to <strong>01003044257</strong>, then send the payment screenshot on WhatsApp.
                    </p>
                    <button type="button" className="w-full py-4 rounded-2xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer">
                      <a href="https://wa.me/201003044257" target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </button>
                  </div>
                )}

              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer disabled:opacity-60"
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
              {cart.map((item: any, index: number) => (
                <div key={item._id || item.id || index} className="flex items-center gap-3.5">
                  <div className="w-14 h-18 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
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

              {/* Discount Row */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    PROMO ({appliedCouponCode})
                    <button
                      type="button"
                      onClick={clearCoupon}
                      title="Remove coupon"
                      className="text-emerald-600 hover:text-red-500 transition-colors cursor-pointer text-[10px]"
                    >✕</button>
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

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
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary insured air dispatch with signature verification.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};