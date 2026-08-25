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
  useEffect(() => {
    async function load() {
      setIsLoading(true);

      if (isSupabaseConnected) {
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts !== null) {
          setProducts(dbProducts);
          setIsLoading(false);
          return;
        }
      }

      // No Supabase or connection failed — show empty catalog.
      setProducts([]);
      setIsLoading(false);
    }
    load();
  }, [isSupabaseConnected]);

  const addProduct = async (newProduct: Product) => {
    if (isSupabaseConnected) {
      const success = await upsertSupabaseProduct(newProduct);
      if (!success) {
        throw new Error("Failed to save product to Supabase. The image may be too large — please use a smaller image.");
      }
      // Refresh from Supabase so all devices see the same state
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
      }
    }
    // Local-only fallback when Supabase not configured
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (isSupabaseConnected) {
      const success = await upsertSupabaseProduct(updatedProduct);
      if (!success) {
        throw new Error("Failed to update product in Supabase. The image may be too large — please use a smaller image.");
      }
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
      }
    }
    // Local-only fallback
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConnected) {
      const success = await deleteSupabaseProduct(id);
      if (!success) {
        throw new Error("Failed to delete product from Supabase.");
      }
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
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
