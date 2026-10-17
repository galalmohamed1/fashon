'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useShop } from '../../lib/context/ShopContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  showCategory = true
}) => {
  const { openProductDetail, addToCart, toggleWishlist, isWishlisted } = useShop();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.color?.[0] ? { name: product.color[0].name, hex: product.color[0].hex } : { name: 'Default', hex: '#121214' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.size?.[0]?.name ?? 'M'
  );
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  const productId = product._id;
  const wishlisted = isWishlisted(productId);

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const originalPrice = hasDiscount ? product.price : undefined;
  const imageUrl = product.images?.[0]?.secure_url || '';
  const inStock = product.isActive && !product.isDeleted;
  const availableSizes = (product.size ?? []).map((s) => s.name).length > 0
    ? (product.size ?? []).map((s) => s.name)
    : ['S', 'M', 'L', 'XL'];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showSizeSelector) {
      setShowSizeSelector(true);
      return;
    }

    setIsQuickAdding(true);
    addToCart(product, selectedColor, selectedSize, 1);
    setAddedRecently(true);

    setTimeout(() => {
      setIsQuickAdding(false);
      setShowSizeSelector(false);
    }, 400);

    setTimeout(() => {
      setAddedRecently(false);
    }, 2000);
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, selectedColor, size, 1);
    setAddedRecently(true);
    setShowSizeSelector(false);

    setTimeout(() => {
      setAddedRecently(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={() => {
        setShowSizeSelector(false);
      }}
      onClick={() => openProductDetail(productId)}
      className={`group relative flex flex-col cursor-pointer ${className}`}
      data-cursor="view"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 group-hover:border-zinc-400 transition-all duration-500">
        
        {/* Main Product Image with Zoom */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-100 text-zinc-400 font-mono text-xs">
            NO IMAGE
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges: Tag / Featured */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isFeatured && (
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded bg-red-600 text-white shadow-xs">
              FEATURED
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded bg-black text-white shadow-xs">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(productId);
          }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            wishlisted
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white/90 text-zinc-700 hover:text-black hover:bg-white shadow-xs'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Quick Size Selector Dropdown Overlay */}
        <AnimatePresence>
          {showSizeSelector && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-3 bottom-3 z-30 p-3 rounded-xl bg-white/95 backdrop-blur-xl border border-zinc-300 shadow-2xl"
            >
              <p className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest mb-2 text-center">
                SELECT SIZE
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSelectSizeAndAdd(size, e)}
                    className="py-1.5 text-xs font-mono font-bold rounded bg-zinc-100 hover:bg-black hover:text-white text-black transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Button / View CTA (Reveals on Hover) */}
        {!showSizeSelector && (
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              disabled={!inStock || isQuickAdding}
              className={`w-full py-2.5 px-3 text-xs font-mono font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                addedRecently
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {addedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" /> ADDED TO BAG
                </>
              ) : !inStock ? (
                'SOLD OUT'
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD — ${currentPrice}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details info */}
      <div className="mt-3.5 flex flex-col">
        {/* Category & Collection */}
        {showCategory && (
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            <span>{product.subCategory?.name || 'ARCHIVE'}</span>
            <span>{product.isFeatured ? 'CURATED' : 'ESSENTIAL'}</span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-sans font-bold text-sm sm:text-base text-zinc-900 group-hover:text-black transition-colors truncate">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-black text-black">
              ${currentPrice}
            </span>
            {originalPrice && (
              <span className="font-mono text-xs text-zinc-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
