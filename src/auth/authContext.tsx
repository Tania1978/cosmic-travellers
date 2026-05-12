import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthState = {
  loading: boolean;
  isLoggedIn: boolean;
  session: Session | null;
  authUser: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.warn("getSession error", error);

      const currentSession = data.session ?? null;

      setSession(currentSession);
      setAuthUser(currentSession?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setAuthUser(newSession?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = !!authUser;

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setSession(null);
    setAuthUser(null);

    // Avoid localStorage.clear() unless you really want to wipe everything.
    // Supabase handles its own auth storage.
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
    authUser,
    authModalOpen,
    setAuthModalOpen,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }

  return ctx;
}
