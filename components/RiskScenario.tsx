"use client";

import { X, Check } from "lucide-react";
import { Reveal } from "./Reveal";

const USUAL = [
  "Landlord claims cleaning or damage.",
  "Charges for “normal wear” you didn’t cause.",
  "Ignores or “loses” your move-in photos.",
  "Keeps the deposit with no itemized list.",
];

const WITH_MOVEPROOF = [
  "Timestamped, hashed evidence — nothing can be altered later.",
  "Pack ID + Chain of Custody PDF. Anyone can verify at /verify.",
  "Formal demand letter with a clear deadline.",
  "Tribunal/small-claims checklist and evidence deadlines for your region.",
];

export function RiskScenario() {
  return (
    <section className="border-t border-white/5 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            What usually happens vs. what happens with MoveProof
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-red-200">
                  What usually happens
                </h3>
              </div>
              <ul className="space-y-3 text-slate-400 text-sm">
                {USUAL.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500/80 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-cyan-100">
                  What happens with MoveProof
                </h3>
              </div>
              <ul className="space-y-3 text-slate-300 text-sm">
                {WITH_MOVEPROOF.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-cyan-400 shrink-0">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
