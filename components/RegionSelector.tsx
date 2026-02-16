"use client";

import Link from "next/link";
import { REGIONS } from "@/lib/jurisdictions";

export function RegionSelector() {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((r) => {
        const base =
          "rounded-full border px-3 py-1 text-sm transition";
        const live =
          "border-white/15 bg-white/5 hover:bg-white/8";
        const soon =
          "border-white/10 bg-white/3 text-white/60 cursor-not-allowed";
        const chip = r.status === "live" ? live : soon;

        return r.status === "live" ? (
          <Link key={r.id} href={r.route} className={`${base} ${chip}`}>
            {r.label} <span className="ml-1 text-xs text-emerald-300">Live</span>
          </Link>
        ) : (
          <div key={r.id} className={`${base} ${chip}`} title="Coming soon">
            {r.label} <span className="ml-1 text-xs">Soon</span>
          </div>
        );
      })}
    </div>
  );
}
