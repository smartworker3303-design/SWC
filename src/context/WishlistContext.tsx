"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load wishlist from localStorage on client side mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("swc-wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist from storage", e);
      }
    }
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("swc-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
