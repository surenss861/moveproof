"use client";

import Link from "next/link";
import { HoloBadge } from "@/components/HoloBadge";
import { HashReveal } from "@/components/HashReveal";
import { SealedStamp } from "@/components/SealedStamp";
import { ShieldCheck, Image as ImageIcon, FileText, Lock } from "lucide-react";

const DEMO_ROOMS = [
  { name: "Living Room", count: 4 },
  { name: "Kitchen", count: 3 },
  { name: "Bathroom", count: 2 },
  { name: "Bedroom", count: 5 },
];

const DEMO_HASH =
  "a3f8e2c91b047d65f0e3a1c8d4b5e6f7a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7";

const DEMO_ITEMS = [
  { label: "Living Room · Photo 1", hash: "a3f8e2c91b047d65" },
  { label: "Kitchen · Photo 1", hash: "f0e3a1c8d4b5e6f7" },
  { label: "Bathroom · Photo 1", hash: "a2b3c4d5e6f7a8b9" },
  { label: "Bedroom · Photo 1", hash: "c0d1e2f3a4b5c6d7" },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#080705] text-[#FFFFFA] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-cyan-400 text-sm mb-6 inline-block hover:underline">
          ← MoveProof
        </Link>

        {/* Demo banner */}
        <div className="mb-6 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-2.5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs">
            Demo Evidence Pack — watermarked and read-only. Real packs require an account.
          </p>
        </div>

        {/* Success card */}
        <div className="relative overflow-hidden rounded-2xl bg-emerald-400/10 border border-emerald-400/30 p-6 text-center mb-6">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-white mb-1">Demo Evidence Pack</h1>
          <p className="text-slate-400 text-sm">
            This is what your sealed pack looks like — tamper-evident hashes,
            chain of custody, and a shareable Pack ID.
          </p>
          <SealedStamp />
        </div>

        {/* Pack ID */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <HoloBadge packId="MP-DEMO-7A3B" />
          <span className="text-slate-500 text-xs">Shareable with landlord or tribunal</span>
        </div>

        {/* Room summary */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4">
          <p className="text-sm text-white/60 mb-3">Evidence by room</p>
          <div className="space-y-2.5">
            {DEMO_ROOMS.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-white">{r.name}</span>
                </div>
                <span className="text-xs text-slate-500">{r.count} photos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hash manifest */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-white/40" />
            <p className="text-sm text-white/60">Tamper-evident hash manifest</p>
          </div>

          <div className="mb-3">
            <p className="text-xs text-white/40 mb-1">Pack hash (SHA-256 of all evidence)</p>
            <HashReveal hash={DEMO_HASH} className="text-xs" duration={900} />
          </div>

          <div>
            <p className="text-xs text-white/40 mb-2">Evidence item hashes</p>
            <ul className="space-y-1.5">
              {DEMO_ITEMS.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-white/30 shrink-0 w-32 truncate not-italic"
                    style={{ fontFamily: "inherit" }}>
                    {item.label}
                  </span>
                  <HashReveal hash={item.hash + "…"} duration={500 + i * 80} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Locked features notice */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 text-center">
          <p className="text-white/40 text-xs">
            DEMO — PDF download, Chain of Custody, and demand letter are locked.
          </p>
          <p className="text-white/30 text-xs mt-0.5">
            Create a real Evidence Pack to unlock all features.
          </p>
        </div>

        {/* CTAs */}
        <Link
          href="/signup"
          className="block w-full text-center rounded-xl bg-white text-black px-5 py-4 text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-transform mb-3"
        >
          Create my real Evidence Pack →
        </Link>
        <Link
          href="/verify"
          className="block w-full text-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70 hover:bg-white/5 active:scale-[0.97] transition-transform"
        >
          Verify a real Pack ID
        </Link>

        <p className="text-white/30 text-xs mt-8 text-center">
          Information only, not legal advice.
        </p>
      </div>
    </div>
  );
}
