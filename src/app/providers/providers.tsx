"use client";

import React from "react";
import MyProvider from "@/components/MyProvider/MyProvider";
import ShopProvider from "@/lib/context/ShopContext";




export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyProvider>
      <ShopProvider>
        {children}
      </ShopProvider>
    </MyProvider>
  );
}