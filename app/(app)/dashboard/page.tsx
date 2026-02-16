"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { listInspections } from "@/lib/inspections-supabase";
import type { Inspection } from "@/lib/types";
import { FileCheck, Plus, Zap } from "lucide-react";
import { format } from "date-fns";

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
        className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 mb-6"
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
        className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 mb-6"
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
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : inspections.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No inspections yet. Start a Proof Pack when you move in or out.
        </p>
      ) : (
        <ul className="space-y-2">
          {inspections.slice(0, 5).map((inv) => (
            <li key={inv.id}>
              <Link
                href={`/inspection/${inv.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-slate-600"
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
