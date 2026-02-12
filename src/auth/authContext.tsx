import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type AuthState = {
  loading: boolean;
  isLoggedIn: boolean;
  session: any | null;
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1) restore session on load
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.warn("getSession error", error);
      setSession(data.session ?? null);
      setLoading(false);
    });

    // 2) keep session in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = !!session;

  async function logout() {
    const { error } = await supabase.auth.signOut();
    localStorage.clear();
    if (error) throw error;
  }

  useEffect(() => {
    if (isLoggedIn) {
      setAuthModalOpen(false);
    }
  }, [isLoggedIn]);

  const value: AuthState = {
    loading,
    isLoggedIn,
    session,
    authModalOpen,
    setAuthModalOpen,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
