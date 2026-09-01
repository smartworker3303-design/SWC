"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Order, 
  Profile, 
  OrderStatus, 
  fetchSupabaseOrders, 
  fetchSupabaseProfiles, 
  insertSupabaseOrder,
  insertSupabaseProfile,
  updateSupabaseOrderStatus,
  supabase
} from "../supabase";

interface OrdersContextType {
  orders: Order[];
  profiles: Profile[];
  addOrder: (order: Order) => Promise<boolean>;
  addProfile: (profile: Profile) => Promise<boolean>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    // 1. Instant hydration from localStorage
    try {
      const localOrdersStr = localStorage.getItem("mock_orders_db_v2");
      const localOrders: Order[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
      const localUsersStr = localStorage.getItem("mock_users_db_v2");
      const localUsers: Profile[] = localUsersStr ? JSON.parse(localUsersStr) : [];

      if (localOrders.length > 0) setOrders(localOrders);
      if (localUsers.length > 0) setProfiles(localUsers);
      if (localOrders.length > 0 || localUsers.length > 0) {
        setIsLoading(false);
      }
    } catch {}

    // 2. Parallel fetch from Supabase
    let dbOrders: Order[] = [];
    let dbProfiles: Profile[] = [];

    if (supabase) {
      try {
        const [ordersRes, profilesRes] = await Promise.all([
          fetchSupabaseOrders(),
          fetchSupabaseProfiles()
        ]);
        dbOrders = ordersRes || [];
        dbProfiles = profilesRes || [];
      } catch (err) {
        console.warn("Supabase orders load warning:", err);
      }
    }

    // 3. Merge with localStorage backups
    try {
      const localOrdersStr = localStorage.getItem("mock_orders_db_v2");
      const localOrders: Order[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
      
      const localUsersStr = localStorage.getItem("mock_users_db_v2");
      const localUsers: Profile[] = localUsersStr ? JSON.parse(localUsersStr) : [];

      // Merge orders (deduplicate by id)
      const orderMap = new Map<string, Order>();
      dbOrders.forEach(o => orderMap.set(o.id, o));
      localOrders.forEach(o => {
        if (!orderMap.has(o.id)) orderMap.set(o.id, o);
      });
      const mergedOrders = Array.from(orderMap.values());
      setOrders(mergedOrders);
      localStorage.setItem("mock_orders_db_v2", JSON.stringify(mergedOrders));

      // Merge profiles (deduplicate by id or email)
      const profileMap = new Map<string, Profile>();
      dbProfiles.forEach(p => profileMap.set(p.id || p.email, p));
      localUsers.forEach(p => {
        const key = p.id || p.email;
        if (!profileMap.has(key)) profileMap.set(key, p);
      });
      const mergedProfiles = Array.from(profileMap.values());
      setProfiles(mergedProfiles);
      localStorage.setItem("mock_users_db_v2", JSON.stringify(mergedProfiles));
    } catch {
      setOrders(dbOrders);
      setProfiles(dbProfiles);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addOrder = async (newOrder: Order): Promise<boolean> => {
    // 1. Save to Supabase
    if (supabase) {
      await insertSupabaseOrder(newOrder);
    }

    // 2. Save to localStorage backup
    try {
      const stored = localStorage.getItem("mock_orders_db_v2");
      const existing: Order[] = stored ? JSON.parse(stored) : [];
      const updated = [newOrder, ...existing.filter(o => o.id !== newOrder.id)];
      localStorage.setItem("mock_orders_db_v2", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save order to localStorage:", e);
    }

    // 3. Update state
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    return true;
  };

  const addProfile = async (newProfile: Profile): Promise<boolean> => {
    // 1. Save to Supabase
    if (supabase) {
      await insertSupabaseProfile(newProfile);
    }

    // 2. Save to localStorage backup
    try {
      const stored = localStorage.getItem("mock_users_db_v2");
      const existing: Profile[] = stored ? JSON.parse(stored) : [];
      const updated = [newProfile, ...existing.filter(p => p.id !== newProfile.id && p.email !== newProfile.email)];
      localStorage.setItem("mock_users_db_v2", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save profile to localStorage:", e);
    }

    // 3. Update state
    setProfiles(prev => [newProfile, ...prev.filter(p => p.id !== newProfile.id && p.email !== newProfile.email)]);
    return true;
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    if (supabase) {
      await updateSupabaseOrderStatus(orderId, status);
    }
    // Update local storage backup
    try {
      const stored = localStorage.getItem("mock_orders_db_v2");
      if (stored) {
        const existing: Order[] = JSON.parse(stored);
        const updated = existing.map(o => o.id === orderId ? { ...o, status } : o);
        localStorage.setItem("mock_orders_db_v2", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      profiles, 
      addOrder,
      addProfile,
      updateStatus,
      isLoading,
      refreshData: load
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
