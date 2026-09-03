'use client';

import { AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/ui/PageTransition';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pathname} routeKey={pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
