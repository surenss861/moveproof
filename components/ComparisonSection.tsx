"use client";

import { X, Check } from "lucide-react";
import { Reveal } from "./Reveal";

const JUST_PHOTOS = [
  "Photos can be edited or disputed.",
  "No proof of when or where they were taken.",
  "No single pack a landlord or court can verify.",
  "You’re left arguing “I sent them” with no paper trail.",
];

const MOVEPROOF = [
  "Hashed evidence — any change breaks verification.",
  "Device + server timestamps; optional GPS.",
  "One Pack ID. Anyone can verify at /verify.",
  "Chain of Custody PDF + demand letter. One path forward.",
];

export function ComparisonSection() {
  return (
    <section className="border-t border-white/5 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Just photos vs. MoveProof
          </h2>
          <p className="text-white font-medium mb-8">
            Regular photos solve 10% of the problem. We solve the full dispute.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <Reveal delay={0.05}>
            <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">
                Just taking photos
              </h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                {JUST_PHOTOS.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <X className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-cyan-700/50 bg-cyan-950/20 p-6">
              <h3 className="text-lg font-semibold text-cyan-100 mb-4">
                MoveProof Evidence Pack
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                {MOVEPROOF.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
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
