"use client";

import { MapPin } from "lucide-react";

export function NABanner() {
  return (
    <div className="border-y border-slate-800/80 bg-slate-900/50 py-2.5">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
        <MapPin className="w-4 h-4 text-cyan-500/80" />
        <span>
          Works for renters in <strong className="text-slate-300">all 50 states + Canada</strong>. Jurisdiction-specific deadlines and letters coming by region.
        </span>
      </div>
    </div>
  );
}
