"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { listInspections } from "@/lib/inspections-supabase";
import type { Inspection } from "@/lib/types";
import { FileCheck, Plus, Zap, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { HoloBadge } from "@/components/HoloBadge";

export default function DashboardPage() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    listInspections(user.uid)
      .then(setInspections)
      .catch(() => setInspections([]))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-slate-400 text-sm mb-6">
        Your Proof Packs and dispute tools
      </p>

      <Link
        href="/inspection/new"
        className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 mb-3 active:scale-[0.98] transition-transform"
      >
        <div className="rounded-lg bg-cyan-500/30 p-2">
          <Plus className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">New Proof Pack</p>
          <p className="text-slate-400 text-sm">
            Move-in or move-out inspection in 10 min
          </p>
        </div>
      </Link>

      <Link
        href="/dispute"
        className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 mb-6 active:scale-[0.98] transition-transform"
      >
        <div className="rounded-lg bg-amber-500/20 p-2">
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">Dispute Accelerator</p>
          <p className="text-slate-400 text-sm">
            Demand letter, LTB guide, evidence upload
          </p>
        </div>
      </Link>

      <h2 className="text-sm font-medium text-slate-400 mb-3">
        Recent Proof Packs
      </h2>

      {loading ? (
        /* Skeleton shimmer */
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-slate-800/60 border border-slate-700/50 animate-pulse"
            />
          ))}
        </div>
      ) : inspections.length === 0 ? (
        /* Contextual empty state */
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 text-center">
          <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-1">No packs yet</p>
          <p className="text-slate-500 text-sm mb-4">
            Start one the day you get your keys — before anything can be disputed.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/inspection/new"
              className="rounded-xl bg-cyan-500 text-slate-900 py-2.5 text-sm font-semibold hover:bg-cyan-400 transition active:scale-[0.98]"
            >
              + Start move-in pack
            </Link>
            <Link
              href="/verify"
              className="rounded-xl border border-slate-600 text-slate-300 py-2.5 text-sm hover:border-slate-500 transition active:scale-[0.98]"
            >
              Verify a Pack ID
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {inspections.slice(0, 5).map((inv) => (
            <li key={inv.id}>
              <Link
                href={`/inspection/${inv.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all"
              >
                <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{inv.address}</p>
                  <p className="text-slate-500 text-xs">
                    {inv.type === "move-in" ? "Move-in" : "Move-out"} ·{" "}
                    {format(new Date(inv.startedAt), "MMM d, yyyy")}
                    {inv.completedAt ? " · Completed" : " · In progress"}
                  </p>
                </div>
                {/* Show holographic badge only on completed packs */}
                {inv.completedAt && inv.packId && (
                  <HoloBadge packId={inv.packId} size="sm" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
