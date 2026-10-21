'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'next/navigation';

import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';
import { REVIEWS_DATA } from '../../../lib/data/products';
import { Product, ProductColor, ProductSize } from '../../../types';
import { getSingelProdect } from '@/app/api/services/prodect.services';
import img from '../../../assets/kiikii-tshirt.png';

import { ProductCard } from '../../shared/ProductCard';
import { TShirtPhoto } from './TShirt3D';
import Link from 'next/link';
import { LiquidLogoLoader } from '../../ui/LiquidLogoLoader';

// ── Utility: color name → hex mapping ───────────────────────────────────────
const COLOR_HEX_MAP: Record<string, string> = {
  black: '#121214', white: '#F5F5F7', offwhite: '#F5F5F7', purewhite: '#F5F5F7',
  gray: '#71717A', grey: '#71717A', mineralgray: '#52525B', mineralgrey: '#52525B',
  red: '#EF4444', darkred: '#991B1B', burgundy: '#7F1D1D', wine: '#7F1D1D',
  blue: '#3B82F6', navyblue: '#1E3A5F', navy: '#1E3A5F', skyblue: '#38BDF8',
  green: '#22C55E', darkgreen: '#166534', olive: '#84834B', khaki: '#C3B091',
  yellow: '#FBBF24', mustard: '#D4A017', orange: '#F97316', coral: '#F87171',
  pink: '#F472B6', hotpink: '#EC4899', purple: '#A855F7', lavender: '#DDD6FE',
  brown: '#92400E', caramel: '#D4900A', beige: '#F5F0E8', cream: '#FFFBF0',
  gold: '#D4AF37', silver: '#C0C0C0', bronze: '#CD7F32',
};

export const nameToHex = (name: string): string => {
  const lower = name.toLowerCase().replace(/\s+/g, '');
  return COLOR_HEX_MAP[lower] ?? '#A1A1AA';
};

export const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
};

export const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const {
    selectedProductId,
    products,
    setActivePage,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsSizeGuideOpen
  } = useShop();

  const currentId = (params?.id as string) || selectedProductId || (products[0]?._id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Component State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: ' ', hex: '#121214' });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('materials');
  const [view3DMode, setView3DMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (currentId) {
      // First check if already in products list
      const cached = products.find((p) => p._id === currentId);
      if (cached) {
        setProduct(cached);
        setLoading(false);
      }

      // Fetch fresh details from API
      getSingelProdect(currentId)
        .then((data) => {
          if (isMounted && data) {
            setProduct(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [currentId, products]);

  // Initialize selectedSize and selectedColor once product loads
  useEffect(() => {
  if (!product) return;
  if (product.sizes?.length) setSelectedSize(product.sizes[0]);
  if (product.colors?.length) {
    const name = product.colors[0];
    const hex = nameToHex(name);
    setSelectedColor({ name, hex, border: isLightColor(hex) });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [product?._id]);
  
  if (loading && !product) {
    return (
      <div className="min-h-screen pt-28 pb-24 bg-white flex items-center justify-center">
        <LiquidLogoLoader
          autoLoop={true}
          size={135}
          statusText="LOADING ARCHIVE SPECIFICATION..."
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-24 bg-white flex flex-col items-center justify-center">
        <h2 className="font-display font-black text-2xl uppercase text-black mb-4">PRODUCT NOT FOUND</h2>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-3 bg-black text-white font-mono text-xs uppercase font-bold tracking-widest rounded-xl"
        >
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const gallery = product.images && product.images.length > 0
    ? product.images.map((img) => img.secure_url)
    : [];
  const reviews = REVIEWS_DATA[product._id] || REVIEWS_DATA.default;

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const originalPrice = hasDiscount ? product.price : undefined;

  // ── Map color name strings → ProductColor objects ──────────────────────────
  const availableColors: ProductColor[] = (product.colors ?? []).map((name) => {
  const hex = nameToHex(name);
  return { name, hex, border: isLightColor(hex) };
});

const availableSizes: string[] = product.sizes ?? [];

  // Related products from API products
  const relatedProducts = products.filter((p) => p._id !== product._id).slice(0, 3);

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedColor, selectedSize, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
    }, 250);
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
    
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-10 sm:pt-28 pb-24 bg-white dark:bg-[#09090b] text-black dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 mb-8 font-medium">
          <Link
            href="/shop"
            className="hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> SHOP ARCHIVE
          </Link>
          <span>/</span>
          <span className="text-zinc-500">{product.subCategory?.name || 'ARCHIVE'}</span>
          <span>/</span>
          <span className="text-black font-bold truncate max-w-50">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery / 3D Canvas Switcher */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* 3D Mode Toggle Button */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200 shadow-xs max-w-md mx-auto w-full">
              <span className="text-xs font-mono text-zinc-600 font-semibold flex items-center gap-1.5 pl-2">
                <Sparkles className="w-3.5 h-3.5 text-red-600" /> INTERACTIVE 3D PREVIEW
              </span>
              <div className="flex items-center p-1 rounded-lg bg-zinc-200 border border-zinc-300">
                <button
                  onClick={() => setView3DMode(false)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                    !view3DMode ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  EDITORIAL
                </button>
                <button
                  onClick={() => setView3DMode(true)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                    view3DMode ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  3D VIEW
                </button>
              </div>
            </div>

            {/* Viewport: Either 3D Canvas or High-Res Photography */}
            {view3DMode ? (
              <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-lg">
                <TShirtPhoto src={img.src} />
              </div>
            ) : (
              <div className="relative aspect-3/4 w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-lg group">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[activeImageIndex] || gallery[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 font-mono text-sm">
                    NO IMAGE
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.isFeatured && (
                    <span className="px-3 py-1 rounded bg-black font-mono text-[10px] font-bold tracking-widest uppercase text-white shadow-md">
                      FEATURED
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="px-3 py-1 rounded bg-red-600 font-mono text-[10px] font-bold tracking-widest uppercase text-white shadow-md">
                      SALE
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                    wishlisted
                      ? 'bg-red-600 text-white'
                      : 'bg-white/80 text-black hover:text-white hover:bg-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>
            )}

            {/* Thumbnails Row */}
            {!view3DMode && gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto w-full">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-black ring-2 ring-black/20 scale-[1.02]'
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Specifications, Selectors & Checkout Actions */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Collection & SubCategory */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
              <span className="flex items-center gap-1.5 font-bold text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {product.subCategory?.name || 'ARCHIVE'}
              </span>
              {product.isActive && product.stock > 0 ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  IN STOCK
                </span>
              ) : (
                <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-200">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.averageRating || 5)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-black font-bold">
                {product.averageRating || 5.0} / 5.0
              </span>
              <span className="text-zinc-500 font-mono text-xs font-medium">
                ({product.numReviews || 0} VERIFIED REVIEWS)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-black tracking-tight">
                ${currentPrice}.00
              </span>
              {originalPrice && (
                <span className="font-mono text-lg text-zinc-400 line-through">
                  ${originalPrice}.00
                </span>
              )}
              <span className="text-[11px] font-mono uppercase text-zinc-500 ml-2 font-medium">
                TAX INCLUDED // WORLDWIDE EXPRESS
              </span>
            </div>

            {/* Short Editorial Description */}
            <p className="text-zinc-600 text-sm font-normal leading-relaxed mb-8 whitespace-pre-line wrap-break-word">
              {product.description}
            </p>

            {/* COLOR SELECTOR */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-3">
                  <span className="text-zinc-500 font-medium">
                    COLOR: <strong className="text-black font-bold">{selectedColor.name}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-black bg-zinc-100 shadow-xs'
                            : 'border-zinc-200 bg-white hover:border-zinc-400'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full ${color.border ? 'border border-zinc-400' : ''}`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="dark-text-color text-xs font-mono text-zinc-800 font-medium">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZE SELECTOR + SIZE GUIDE TRIGGER */}
            {availableSizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-3">
                  <span className="text-zinc-500 font-medium">
                    SELECT SIZE: <strong className="text-black font-bold">{selectedSize || availableSizes[0]}</strong>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-mono text-zinc-600 hover:text-black flex items-center gap-1 underline font-bold cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" /> SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = (selectedSize || availableSizes[0]) === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY & ACTIONS */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 px-2 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-zinc-600 hover:text-black font-mono text-base font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 font-mono text-sm font-bold text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 text-zinc-600 hover:text-black font-mono text-base font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Primary */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-4 px-6 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-white hover:bg-zinc-800'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> ADD TO BAG — ${(currentPrice * quantity).toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <Link
                href="/checkout"
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                EXPRESS CHECKOUT
              </Link>
            </div>

            {/* Value Props & Shipping info */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-xs font-mono text-zinc-600 mb-8 shadow-xs">
              <div className="flex items-center gap-2 text-zinc-700">
                <Truck className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Complimentary express shipping on orders over $150</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <RefreshCw className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>30-day global returns & size exchanges</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Guaranteed archival heavyweight fabric grade</span>
              </div>
            </div>

            {/* ACCORDION DETAILS */}
            <div className="border-t border-zinc-200 divide-y divide-zinc-200">
              
              {/* Materials & Fabric Specs */}
              <div>
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  <span>MATERIALS & FABRIC SPECS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'materials' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'materials' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4"
                    >
                      <ul className="space-y-2 text-xs font-normal text-zinc-600">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>100% Heavyweight Organic Combed Cotton</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>Custom bio-wash enzyme finish for tailored drape</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>Reinforced double-needle stitched sleeves and hem</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Design Features */}
              <div>
                <button
                  onClick={() => toggleAccordion('features')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  <span>ARCHITECTURAL FEATURES</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'features' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'features' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4"
                    >
                      <ul className="space-y-2 text-xs font-normal text-zinc-600">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <span>Relaxed drop-shoulder silhouette</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <span>Pre-shrunk architectural collar retention</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  <span>SHIPPING & RETURNS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'shipping' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-xs font-normal text-zinc-600 space-y-2"
                    >
                      <p>All orders are dispatched from our European fulfillment atelier within 24-48 hours.</p>
                      <p>Standard Global Delivery: 3-5 business days via DHL Express.</p>
                      <p>Free returns are accepted within 30 days of arrival in unwashed condition with original tags intact.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <div className="mt-24 pt-16 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 block mb-2 font-bold">
                COMMUNITY FEEDBACK
              </span>
              <h3 className="font-display font-black text-3xl text-black uppercase">
                VERIFIED COLLECTOR REVIEWS ({reviews.length})
              </h3>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-black">{product.averageRating || 5.0} / 5.0</p>
                <p className="font-mono text-[10px] text-zinc-500 uppercase font-bold">100% WOULD RECOMMEND</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 font-medium">{rev.date}</span>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-black mb-2">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-zinc-600 font-normal leading-relaxed mb-4">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="text-black font-bold">{rev.author}</span>
                  <span>{rev.sizePurchased} / {rev.colorPurchased}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-black uppercase">
                COMPLETE THE LOOK
              </h3>
              <Link
              href='/shop'
                onClick={() => {
                  // setActivePage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-mono text-xs text-zinc-600 hover:text-black uppercase tracking-wider font-bold cursor-pointer"
              >
                EXPLORE ALL PIECES →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
