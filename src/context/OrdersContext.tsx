"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Order, 
  Profile, 
  OrderStatus, 
  fetchSupabaseOrders, 
  fetchSupabaseProfiles, 
  updateSupabaseOrderStatus,
  supabase
} from "../supabase";

interface OrdersContextType {
  orders: Order[];
  profiles: Profile[];
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
    setIsLoading(true);
    if (supabase) {
      const fetchedOrders = await fetchSupabaseOrders();
      const fetchedProfiles = await fetchSupabaseProfiles();
      setOrders(fetchedOrders);
      setProfiles(fetchedProfiles);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const success = await updateSupabaseOrderStatus(orderId, status);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      profiles, 
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
