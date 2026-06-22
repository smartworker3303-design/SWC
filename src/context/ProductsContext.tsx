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
  resetProducts: () => Promise<void>;
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
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch (e) {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
        localStorage.setItem("swc-products", JSON.stringify(initialProducts));
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

  const resetProducts = async () => {
    saveProductsLocally(initialProducts);
    if (isSupabaseConnected) {
      // Upsert all initial products to Supabase
      for (const p of initialProducts) {
        await upsertSupabaseProduct(p);
      }
      // Also delete any other products from database that aren't in initial list
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts) {
        const initialIds = new Set(initialProducts.map(p => p.id));
        for (const dbP of dbProducts) {
          if (!initialIds.has(dbP.id)) {
            await deleteSupabaseProduct(dbP.id);
          }
        }
      }
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      resetProducts, 
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
