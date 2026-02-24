"use client";

import { useState } from "react";
import Link from "next/link";
import { SubscribeButton } from "@/components/SubscribeButton";

type Interval = "month" | "year";

export function VaultPricingToggle() {
  const [interval, setInterval] = useState<Interval>("month");

  return (
    <div>
      {/* Interval toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-white/15 p-1 text-sm">
          <button
            type="button"
            onClick={() => setInterval("month")}
            className={`px-5 py-2 rounded-full transition font-medium ${
              interval === "month"
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("year")}
            className={`px-5 py-2 rounded-full transition font-medium flex items-center gap-2 ${
              interval === "year"
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Annual
            <span className="rounded-full bg-cyan-400/20 text-cyan-300 text-xs px-2 py-0.5">
              2 months free
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* Vault card */}
        <div className="relative rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-slate-800/80 to-slate-800/40 p-8 hover:shadow-[0_0_32px_rgba(6,182,212,0.12)] transition">
          <div className="absolute right-4 top-4 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
            Best for renters
          </div>

          <div className="text-sm text-white/70">MoveProof Vault</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-semibold">
              {interval === "month" ? "$9.99" : "$79"}
            </span>
            <span className="text-white/60 mb-1">
              {interval === "month" ? "/mo" : "/yr"}
            </span>
          </div>
          {interval === "year" && (
            <div className="mt-1 text-sm text-cyan-300">Save $40 vs monthly</div>
          )}
          <div className="mt-2 text-sm text-white/70">
            Unlimited Evidence Packs. Cancel anytime.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/80">
            <li>✓ Unlimited packs (move-in + move-out)</li>
            <li>✓ Tamper-evident hashes + Pack ID</li>
            <li>✓ Chain-of-Custody PDF</li>
            <li>✓ Demand letter + tribunal checklist</li>
            <li>✓ All region modules as they ship</li>
          </ul>

          <div className="mt-6">
            <SubscribeButton interval={interval} />
          </div>
        </div>

        {/* One-time card */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-8">
          <div className="text-sm text-white/70">Single Evidence Pack</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-semibold">$39</span>
            <span className="text-white/60 mb-1">one-time</span>
          </div>
          <div className="mt-2 text-sm text-white/70">
            For one move. No subscription required.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/70">
            <li>✓ One completed Evidence Pack</li>
            <li>✓ Tamper-evident hashes + Pack ID</li>
            <li>✓ Chain-of-Custody PDF</li>
            <li>✓ Demand letter for your region</li>
            <li className="text-white/40">✗ Future packs require new purchase</li>
          </ul>

          <Link
            href="/signup?intent=pack"
            className="mt-6 block w-full py-4 rounded-xl border border-white/20 text-white text-center text-sm font-semibold hover:bg-white/5 transition"
          >
            Buy one pack — $39
          </Link>

          {/* FAQ */}
          <div className="mt-8 border-t border-white/10 pt-6 space-y-4 text-sm text-white/70">
            <div>
              <div className="text-white/85 font-medium">Do you support my state/province?</div>
              <div className="mt-1">
                Evidence packs work everywhere. Ontario has the full LTB module live. More regions rolling out.
              </div>
            </div>
            <div>
              <div className="text-white/85 font-medium">Is this legal advice?</div>
              <div className="mt-1">No — structured evidence packaging + checklists. Not a law firm.</div>
            </div>
            <div>
              <div className="text-white/85 font-medium">Can I cancel Vault anytime?</div>
              <div className="mt-1">Yes. Cancel from your account settings — your packs remain accessible.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
