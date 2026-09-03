'use client';
import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, RefreshCw, Palette, Ruler, Stamp, ArrowUpRight } from 'lucide-react';

import { useShop } from '../../../lib/context/ShopContext';
import { PRODUCTS } from '../../../lib/data/products';

import { TShirtPhoto } from '../products/TShirt3D';
import img from '../../../assets/kiikii-tshirt.png';

export const CustomizerSection: React.FC = () => {
  const { addToCart, setIsCartOpen } = useShop();

  // Customizer state
  const colors: { name: string; hex: string; border?: boolean }[] = [
    { name: 'Oatmeal Sand', hex: '#DED4C5' },
    { name: 'Obsidian Black', hex: '#121214' },
    { name: 'Pure White', hex: '#F5F5F7', border: true },
    { name: 'Cobalt Royal', hex: '#0B3EBC' },
    { name: 'Mineral Gray', hex: '#52525B' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const designs: { id: 'kiikii-cat' | 'threadx-logo' | 'minimal-logo' | 'no-logo'; label: string; desc: string }[] = [
    { id: 'kiikii-cat', label: 'Lucky Cat Original (Tokyo)', desc: 'Maneki-neko silkscreen graphic in Royal Blue & "ORIGINAL" block' },
    { id: 'threadx-logo', label: 'GM Archive Spec', desc: 'High-density luxury chest insignia graphic & atelier coordinates' },
    { id: 'minimal-logo', label: 'GM Minimal Monogram', desc: 'Subtle micro GM chest badge & precision accent dot' },
    { id: 'no-logo', label: 'Blank / Purist', desc: 'Zero external branding for raw sculptural focus' }
  ];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedDesign, setSelectedDesign] = useState<'kiikii-cat' | 'threadx-logo' | 'minimal-logo' | 'no-logo'>('kiikii-cat');
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const baseProduct = PRODUCTS.find((p) => p.id === 'tx-tee-01') || PRODUCTS[0];
  const customPrice = 59;

  const handleAddToCart = () => {
    setIsAdding(true);

    // Call store
    addToCart(
      baseProduct,
      { name: selectedColor.name, hex: selectedColor.hex, border: selectedColor.border },
      selectedSize,
      1,
      selectedDesign,
      selectedColor.hex
    );

    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
    }, 300);

    setTimeout(() => {
      setIsSuccess(false);
    }, 2400);
  };

  return (
    <section className="relative py-24 sm:py-32 bg-zinc-50 overflow-hidden border-b border-zinc-200">
      {/* Background radial highlight */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-red-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-800 font-bold">
              3D BESPOKE LAB // INTERACTIVE CONFIGURATOR
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-black uppercase">
            MAKE IT YOURS.
          </h2>
          <p className="mt-3 text-zinc-600 text-sm sm:text-base font-normal">
            Configure your custom 280 GSM heavyweight tee in real-time. Choose your pigment, archival graphic, and tailored fit.
          </p>
        </div>

        {/* Studio Layout: 3D Visualizer on Left + Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: 3D Interactive Canvas */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-zinc-200 via-zinc-100 to-transparent shadow-lg border border-zinc-200">
              <TShirtPhoto src={img.src} />
            </div>
            {/* Live Spec Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white border border-zinc-200 text-[11px] font-mono text-zinc-600 shadow-xs">
              <div className="flex items-center gap-4">
                <span>COLOR: <strong className="text-black font-bold">{selectedColor.name.toUpperCase()}</strong></span>
                <span>SIZE: <strong className="text-black font-bold">{selectedSize}</strong></span>
              </div>
              <div>
                <span>GRAPHIC: <strong className="text-black font-bold">{selectedDesign.toUpperCase().replace('-', ' ')}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xl">
            
            {/* 1. COLOR SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-red-600" />
                  COLOR SELECTION
                </label>
                <span className="text-xs font-mono text-zinc-600 font-semibold">
                  {selectedColor.name}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {colors.map((color) => {
                  const isSelected = selectedColor.hex === color.hex;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-zinc-100 shadow-sm'
                          : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full shadow-inner transition-transform group-hover:scale-110 ${
                          color.border ? 'border border-zinc-400' : ''
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[9px] font-mono text-zinc-700 font-bold truncate w-full text-center">
                        {color.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. GRAPHIC DESIGN SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                  <Stamp className="w-3.5 h-3.5 text-red-600" />
                  ARCHIVAL GRAPHIC
                </label>
              </div>
              <div className="flex flex-col gap-2">
                {designs.map((d) => {
                  const isSelected = selectedDesign === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDesign(d.id)}
                      className={`flex items-start justify-between p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-zinc-100 text-black shadow-xs'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-mono font-bold tracking-wide text-zinc-900">
                          {d.label}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 font-normal">
                          {d.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SIZE SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-red-600" />
                  SELECT SIZE
                </label>
                <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                  OVERSIZED BOX FIT
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. PRICING & ADD TO CART CTA */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
                    CUSTOM CONFIGURATION
                  </span>
                  <span className="font-mono text-2xl font-black text-black">
                    ${customPrice}.00
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  IN STOCK (MADE TO ORDER)
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-4 px-6 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-md cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> ADDED TO BAG — OPENING BAG…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD TO CART — ${customPrice}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
