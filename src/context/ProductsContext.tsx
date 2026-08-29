"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "../data";
import { 
  supabase, 
  fetchSupabaseProducts, 
  upsertMultipleSupabaseProducts, 
  deleteSupabaseProduct 
} from "../supabase";

export function getProductGroupKey(product: { category: string; subcategory?: string }): string {
  if (product.category === "hand-watches") {
    return product.subcategory === "womens" ? "hand-watches:womens" : "hand-watches:mens";
  }
  return product.category;
}

export function getGroupSortedProducts(allProducts: Product[], groupKey: string): Product[] {
  const group = allProducts.filter(p => getProductGroupKey(p) === groupKey);
  return [...group].sort((a, b) => {
    const aOrder = a.sortOrder !== undefined && a.sortOrder > 0 ? a.sortOrder : 999999;
    const bOrder = b.sortOrder !== undefined && b.sortOrder > 0 ? b.sortOrder : 999999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return allProducts.indexOf(a) - allProducts.indexOf(b);
  });
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseConnected = !!supabase;

  const refreshProducts = useCallback(async () => {
    if (isSupabaseConnected) {
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
      }
    }
  }, [isSupabaseConnected]);

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
    const targetGroupKey = getProductGroupKey(newProduct);
    const existingInGroup = getGroupSortedProducts(products, targetGroupKey);
    const maxPos = existingInGroup.length + 1;
    
    // Determine target rank (clamped 1..maxPos)
    const targetPos = (newProduct.sortOrder && newProduct.sortOrder >= 1)
      ? Math.min(Math.max(1, newProduct.sortOrder), maxPos)
      : maxPos;

    // Insert at desired position (targetPos - 1 index)
    const newGroupList = [...existingInGroup];
    newGroupList.splice(targetPos - 1, 0, newProduct);

    // Re-index consecutive positions 1..N
    const updatedGroup = newGroupList.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1
    }));

    // Other products outside this group remain untouched
    const otherProducts = products.filter(p => getProductGroupKey(p) !== targetGroupKey);
    const nextAllProducts = [...otherProducts, ...updatedGroup];

    if (isSupabaseConnected) {
      const success = await upsertMultipleSupabaseProducts(updatedGroup);
      if (!success) {
        throw new Error("Failed to save product to Supabase. The image may be too large — please use a smaller image.");
      }
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
      }
    }

    // Local-only fallback
    setProducts(nextAllProducts);
  };

  const updateProduct = async (updatedProduct: Product) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    const oldGroupKey = oldProduct ? getProductGroupKey(oldProduct) : getProductGroupKey(updatedProduct);
    const newGroupKey = getProductGroupKey(updatedProduct);

    let allAffectedProductsToSave: Product[] = [];
    let nextAllProducts: Product[] = [];

    if (oldGroupKey === newGroupKey) {
      // In same group
      const existingInGroup = getGroupSortedProducts(products, oldGroupKey).filter(p => p.id !== updatedProduct.id);
      const maxPos = existingInGroup.length + 1;
      const targetPos = (updatedProduct.sortOrder && updatedProduct.sortOrder >= 1)
        ? Math.min(Math.max(1, updatedProduct.sortOrder), maxPos)
        : (oldProduct?.sortOrder && oldProduct.sortOrder <= maxPos ? oldProduct.sortOrder : maxPos);

      const newGroupList = [...existingInGroup];
      newGroupList.splice(targetPos - 1, 0, updatedProduct);

      const updatedGroup = newGroupList.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1
      }));

      allAffectedProductsToSave = updatedGroup;
      const otherProducts = products.filter(p => getProductGroupKey(p) !== oldGroupKey);
      nextAllProducts = [...otherProducts, ...updatedGroup];
    } else {
      // Category/Subcategory changed — update both old and new groups
      const oldGroupItems = getGroupSortedProducts(products, oldGroupKey).filter(p => p.id !== updatedProduct.id);
      const updatedOldGroup = oldGroupItems.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1
      }));

      const newGroupItems = getGroupSortedProducts(products, newGroupKey).filter(p => p.id !== updatedProduct.id);
      const maxPos = newGroupItems.length + 1;
      const targetPos = (updatedProduct.sortOrder && updatedProduct.sortOrder >= 1)
        ? Math.min(Math.max(1, updatedProduct.sortOrder), maxPos)
        : maxPos;

      const newGroupList = [...newGroupItems];
      newGroupList.splice(targetPos - 1, 0, updatedProduct);
      const updatedNewGroup = newGroupList.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1
      }));

      allAffectedProductsToSave = [...updatedOldGroup, ...updatedNewGroup];
      const otherProducts = products.filter(
        p => getProductGroupKey(p) !== oldGroupKey && getProductGroupKey(p) !== newGroupKey
      );
      nextAllProducts = [...otherProducts, ...updatedOldGroup, ...updatedNewGroup];
    }

    if (isSupabaseConnected) {
      const success = await upsertMultipleSupabaseProducts(allAffectedProductsToSave);
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
    setProducts(nextAllProducts);
  };

  const deleteProduct = async (id: string) => {
    const toDelete = products.find(p => p.id === id);
    let updatedGroup: Product[] = [];

    if (toDelete) {
      const groupKey = getProductGroupKey(toDelete);
      const remainingInGroup = getGroupSortedProducts(products, groupKey).filter(p => p.id !== id);
      updatedGroup = remainingInGroup.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1
      }));
    }

    if (isSupabaseConnected) {
      const success = await deleteSupabaseProduct(id);
      if (!success) {
        throw new Error("Failed to delete product from Supabase.");
      }
      if (updatedGroup.length > 0) {
        await upsertMultipleSupabaseProducts(updatedGroup);
      }
      const dbProducts = await fetchSupabaseProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts);
        return;
      }
    }

    // Local-only fallback
    if (toDelete) {
      const groupKey = getProductGroupKey(toDelete);
      const otherProducts = products.filter(p => getProductGroupKey(p) !== groupKey && p.id !== id);
      setProducts([...otherProducts, ...updatedGroup]);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      isLoading,
      isSupabaseConnected,
      refreshProducts
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

