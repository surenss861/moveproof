"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

/** App-facing user: uid for compatibility with existing code (uid = id) */
export type AppUser = User & { uid: string };

interface AuthContextValue {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isVaultActive: boolean;
  refreshEntitlements: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAppUser(u: User): AppUser {
  return { ...u, uid: u.id };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVaultActive, setIsVaultActive] = useState(false);

  const fetchEntitlements = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch("/api/me/entitlements", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsVaultActive(data.isVaultActive ?? false);
      }
    } catch {
      // Non-fatal: entitlements unavailable
    }
  }, []);

  const refreshEntitlements = useCallback(async () => {
    const s = (await getSupabase().auth.getSession()).data.session;
    if (s?.access_token) await fetchEntitlements(s.access_token);
  }, [fetchEntitlements]);

  useEffect(() => {
    let mounted = true;

    getSupabase().auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ? toAppUser(s.user) : null);
      setLoading(false);
      if (s?.access_token) fetchEntitlements(s.access_token);
    });

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ? toAppUser(s.user) : null);
      if (s?.access_token) {
        fetchEntitlements(s.access_token);
      } else {
        setIsVaultActive(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchEntitlements]);

  const signIn = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    setIsVaultActive(false);
    await getSupabase().auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isVaultActive, refreshEntitlements, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
