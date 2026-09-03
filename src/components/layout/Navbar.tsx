'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, User } from 'lucide-react';
import { useShop } from '../../lib/context/ShopContext';
import { PageView } from '../../types';
import { GMLogo } from '../ui/GMLogo';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setSelectedCategory,
    setFilters
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for dynamic navbar glass styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: string;}[] = [
    { label: 'HOME', page: '/' },
    { label: 'SHOP', page: '/shop' },
    { label: 'COLLECTIONS', page: '/collections' },
    { label: 'SALE', page: '/sale' },
  ];


  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-sm border-b border-zinc-200/80 bg-white/90 backdrop-blur-md'
            : 'bg-white/80 backdrop-blur-xs py-5 sm:py-6 border-b border-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
  {/* Left: Desktop Navigation Links */}
  <nav className="hidden lg:flex items-center gap-3">
    {navLinks.map((link) => {
  const isActive = activePage === link.page;
  return (
    <Link
      key={link.label}
      href={link.page}
      className={`relative text-xs font-mono tracking-[0.2em] uppercase py-1 ${
        isActive
          ? 'text-black font-extrabold'
          : 'text-zinc-500 font-semibold transition-colors duration-200 hover:text-black'
      }`}
    >
      {link.label}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
})}
  </nav>

  {/* Center: Brand Logo */}
  <div className="flex justify-center">
    <Link
      href="/"
      className="flex px-4 md:px-0 items-center cursor-pointer focus:outline-none"
      aria-label="GM Atelier Homepage"
            >
              <GMLogo size="md"  />
      <span className="hidden md:flex text-[15px] font-semibold tracking-[0.42em] text-foreground pl-2">STORE</span>
    </Link>
  </div>

  {/* Right: Action Icons */}
  <div className="flex items-center gap-1.5 sm:gap-3">
    {/* Search Trigger */}
    <button
      onClick={() => setIsSearchOpen(true)}
      className="p-2 sm:p-2.5 text-zinc-700 hover:text-black cursor-pointer rounded-full hover:bg-zinc-100 transition-colors"
      aria-label="Search collection"
      title="Search (⌘K)"
    >
      <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>

    {/* Wishlist Button */}
    <Link
      href="/wishlist"
      className="relative p-2 sm:p-2.5 text-zinc-700 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
      aria-label="View Wishlist"
      title="Wishlist"
    >
      <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${wishlist.length > 0 ? 'text-red-600 fill-red-600' : ''}`} />
      {wishlist.length > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center">
          {wishlist.length}
        </span>
      )}
    </Link>

    {/* Shopping Bag Button */}
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative flex gap-2 p-2 rounded-full cursor-pointer bg-black hover:bg-zinc-800 text-white transition-all duration-200 shadow-sm"
      aria-label="Open Shopping Bag"
    >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center">
          {cartCount}
        </span>
      )}
      {/* <span className="font-mono text-xs font-bold tracking-wider">
        {cartCount}
      </span> */}
    </button>
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Button variant="ghost" size="icon" className="cursor-pointer rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 cursor-pointer">
        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer hover:bg-gray-600 hover:text-white'>Profile</DropdownMenuItem>
          <Link href="/about">
            <DropdownMenuItem className='cursor-pointer hover:bg-gray-600 hover:text-white'>About</DropdownMenuItem>
          </Link>
          <DropdownMenuItem className='cursor-pointer hover:bg-gray-600 hover:text-white'>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" className='cursor-pointer hover:bg-red-600 hover:text-white'>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="lg:hidden p-2 text-zinc-700 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
      aria-label="Open mobile menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  </div>
</div>

      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
              <Link
                href='/'
                className="text-left"
              >
                <GMLogo size="lg" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-black hover:bg-zinc-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Staggered Links */}
            <div className="flex flex-col gap-5 my-auto py-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.page}
                    className="group flex items-center justify-between w-full text-left"
                  >
                    <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-800 group-hover:text-black group-hover:translate-x-2 transition-all duration-200">
                      {link.label}
                    </span>
                    <ArrowRight className="w-6 h-6 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer details in mobile menu */}
            <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
              <div>
                <p className="text-zinc-900 font-bold">GM WORLDWIDE ATELIER</p>
                <p>GLOBAL EXPRESS SHIPPING // TAX INCLUDED</p>
              </div>
              <div className="flex items-center gap-4 text-zinc-600">
                <span>CURRENCY: USD ($)</span>
                <span>•</span>
                <span>EDITION: 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
