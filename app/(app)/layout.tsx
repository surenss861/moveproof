"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import { Home, FileCheck, Zap } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirectSent = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user && !redirectSent.current) {
      redirectSent.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  const showNav =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/inspection") ||
    pathname?.startsWith("/dispute");

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-700/50">
        <Link href="/dashboard" className="text-lg font-bold text-cyan-400">
          MoveProof
        </Link>
        <span className="text-slate-500 text-sm truncate max-w-[140px]">
          {user.email}
        </span>
      </header>
      <main className="flex-1 flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-4 bg-slate-800/95 border-t border-slate-700/50 app-safe">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 hover:text-cyan-400 ${pathname === "/dashboard" ? "text-cyan-400" : "text-slate-400"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/inspection/new"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400"
          >
            <FileCheck className="w-5 h-5" />
            <span className="text-xs">Proof Pack</span>
          </Link>
          <Link
            href="/dispute"
            className={`flex flex-col items-center gap-1 hover:text-cyan-400 ${pathname === "/dispute" ? "text-cyan-400" : "text-slate-400"}`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs">Dispute</span>
          </Link>
        </nav>
      )}
    </div>
  );
}
