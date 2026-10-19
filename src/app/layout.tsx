import type { Metadata } from 'next';
import { Outfit, Space_Grotesk, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
// import { ShopProvider } from '../lib/context/ShopContext';
import { Suspense } from 'react';
import { ToastContainer } from '../components/ui/ToastContainer';
import { SearchModal } from '../components/layout/SearchModal';
import { SizeGuideModal } from '../components/features/products/SizeGuideModal';
import { CartDrawer } from '../components/features/cart/CartDrawer';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import Providers from './providers/providers';
import { RouteTransitionLoader } from '../components/ui/RouteTransitionLoader';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'GM — Luxury Futuristic Streetwear',
  description: 'Premium modern fashion e-commerce brand featuring interactive 3D apparel, futuristic streetwear collections, and high-end editorial curation.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-smooth ${outfit.variable} ${spaceGrotesk.variable} ${syne.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-white text-zinc-950 antialiased selection:bg-black selection:text-white min-h-screen flex flex-col overflow-x-hidden font-sans"cz-shortcut-listen="true">
        <Providers>
          <ToastContainer position="bottom-left" />
          <SearchModal />
          <SizeGuideModal />
          <CartDrawer />
          <Suspense fallback={null}>
            <RouteTransitionLoader />
          </Suspense>
          
          <Navbar />

          <main className="flex-1 w-full pt-16 sm:pt-20">
            {children}
          </main>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
