"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts, Product } from "../data";
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

  // Load products on mount
  useEffect(() => {
    async function load() {
      if (isSupabaseConnected) {
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts) {
          setProducts(dbProducts);
          localStorage.setItem("swc-products", JSON.stringify(dbProducts));
          setIsLoading(false);
          return;
        }
      }
      
      // Local storage fallback
      const stored = localStorage.getItem("swc-products");
      const isInitialized = localStorage.getItem("swc-products-initialized");
      
      if (stored && isInitialized === "true") {
        try {
          const parsed = JSON.parse(stored);
          setProducts(parsed);
        } catch {
          setProducts(initialProducts);
          localStorage.setItem("swc-products", JSON.stringify(initialProducts));
          localStorage.setItem("swc-products-initialized", "true");
        }
      } else {
        setProducts(initialProducts);
        localStorage.setItem("swc-products", JSON.stringify(initialProducts));
        localStorage.setItem("swc-products-initialized", "true");
      }
      setIsLoading(false);
    }
    load();
  }, [isSupabaseConnected]);

  // Helper to save products state and local storage cache
  const saveProductsLocally = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("swc-products", JSON.stringify(updatedProducts));
  };

  const addProduct = async (newProduct: Product) => {
    const updated = [...products, newProduct];
    saveProductsLocally(updated);
    if (isSupabaseConnected) {
      await upsertSupabaseProduct(newProduct);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProductsLocally(updated);
    if (isSupabaseConnected) {
      await upsertSupabaseProduct(updatedProduct);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveProductsLocally(updated);
    if (isSupabaseConnected) {
      await deleteSupabaseProduct(id);
    }
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
