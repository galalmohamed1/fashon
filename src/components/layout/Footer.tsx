'use client';
import React from 'react';
import { ArrowUpRight, Globe, Shield, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../../lib/context/ShopContext';
import { Category } from '../../types';
import { GMLogo } from '../ui/GMLogo';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory, setIsSizeGuideOpen } = useShop();

  const handleShopCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNav = (page: any) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-50 text-black border-t border-zinc-200 pt-20 pb-12">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 text-black flex-shrink-0 shadow-xs">
              <Truck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                GLOBAL EXPRESS DELIVERY
              </h4>
              <p className="text-xs text-zinc-600 font-normal mt-1">
                Complimentary worldwide shipping on all orders over $150.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 text-black flex-shrink-0 shadow-xs">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                ARCHIVAL QUALITY PROMISE
              </h4>
              <p className="text-xs text-zinc-600 font-normal mt-1">
                280-480 GSM dense organic cotton guaranteed zero shrinkage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 text-black flex-shrink-0 shadow-xs">
              <RefreshCw className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                30-DAY COMPLIMENTARY RETURNS
              </h4>
              <p className="text-xs text-zinc-600 font-normal mt-1">
                Effortless return and exchange portal for all international orders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 text-black flex-shrink-0 shadow-xs">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                CARBON NEUTRAL ATELIER
              </h4>
              <p className="text-xs text-zinc-600 font-normal mt-1">
                100% recycled packaging & solar-powered European manufacturing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <button
              onClick={() => handlePageNav('home')}
              className="flex items-center gap-3 text-left cursor-pointer focus:outline-none group"
            >
              <GMLogo size="md" />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tighter text-black group-hover:text-zinc-700 transition-colors">
                  GM ATELIER
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
                  ARCHIVE // 2026
                </span>
              </div>
            </button>
            <p className="mt-4 text-xs text-zinc-600 font-normal max-w-sm leading-relaxed">
              GM ATELIER is an architectural luxury fashion house bridging avant-garde dystopian silhouettes with ultra-heavyweight sustainable textiles.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-zinc-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>ATELIER ONLINE // DISPATCHING IN 24H</span>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-[0.2em] text-black uppercase mb-4">
              SHOP
            </h5>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-600">
              <li>
                <button
                  onClick={() => handleShopCategory('all')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopCategory('t-shirts')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopCategory('hoodies')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopCategory('jackets')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Jackets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopCategory('pants')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Pants
                </button>
              </li>
            </ul>
          </div>

          {/* ABOUT & HELP Columns */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-[0.2em] text-black uppercase mb-4">
              ABOUT
            </h5>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-600">
              <li>
                <button
                  onClick={() => handlePageNav('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Sustainability
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Atelier Archive
                </button>
              </li>
            </ul>
          </div>

          {/* HELP & SOCIAL Column */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-[0.2em] text-black uppercase mb-4">
              HELP & SOCIAL
            </h5>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-600">
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Instagram <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  TikTok <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Facebook <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <p>© 2026 GM ATELIER. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-black cursor-pointer">PRIVACY POLICY</span>
          <span className="hover:text-black cursor-pointer">TERMS OF SERVICE</span>
          <span className="hover:text-black cursor-pointer">COOKIE PREFERENCES</span>
        </div>
      </div>
    </footer>
  );
};
