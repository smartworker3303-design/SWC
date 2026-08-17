"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  login: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_auth_user_v2");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: any) => {
    localStorage.setItem("mock_auth_user_v2", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    localStorage.removeItem("mock_auth_user_v2");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
