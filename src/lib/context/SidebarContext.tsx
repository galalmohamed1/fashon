'use client';
import { createContext, ReactNode, useContext, useState } from "react";

type SidebarCtx = {
    open: boolean;
    setOpen: (o: boolean) => void;
}

const SidebarContext = createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}