"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../data";
import { 
  supabase, 
  fetchSupabaseProducts, 
  upsertSupabaseProduct, 
  deleteSupabaseProduct 
} from "../supabase";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isLoading: boolean;
  isSupabaseConnected: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseConnected = !!supabase;

  // Load products on mount — Supabase is the ONLY source of truth.
  // localStorage is used as a short-lived display cache ONLY (never as a fallback source).
  useEffect(() => {
    async function load() {
      setIsLoading(true);

      if (isSupabaseConnected) {
        // Always fetch fresh from Supabase — this ensures all devices see the same data.
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts !== null) {
          // Supabase responded (even if empty). Use exactly what it returns.
          setProducts(dbProducts);
          setIsLoading(false);
          return;
        }
      }

      // Supabase is not configured or failed completely — show empty catalog.
      // We do NOT fall back to hardcoded data; admin must add products via the panel.
      setProducts([]);
      setIsLoading(false);
    }
    load();
  }, [isSupabaseConnected]);

  const addProduct = async (newProduct: Product) => {
    if (isSupabaseConnected) {
      const success = await upsertSupabaseProduct(newProduct);
      if (success) {
        // Refresh from Supabase to ensure all devices get the same state
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts !== null) {
          setProducts(dbProducts);
          return;
        }
      }
    }
    // Local-only fallback (no Supabase)
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (isSupabaseConnected) {
      const success = await upsertSupabaseProduct(updatedProduct);
      if (success) {
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts !== null) {
          setProducts(dbProducts);
          return;
        }
      }
    }
    // Local-only fallback
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConnected) {
      const success = await deleteSupabaseProduct(id);
      if (success) {
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts !== null) {
          setProducts(dbProducts);
          return;
        }
      }
    }
    // Local-only fallback
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      isLoading,
      isSupabaseConnected
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
