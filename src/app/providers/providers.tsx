"use client";

import React from "react";
import MyProvider from "@/components/MyProvider/MyProvider";
import ShopProvider from "@/lib/context/ShopContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MyProvider>
        <ShopProvider>
          {children}
        </ShopProvider>
      </MyProvider>
    </ThemeProvider>
  );
}