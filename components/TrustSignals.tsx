"use client";

import { Shield, FileCheck, Scale, Lock } from "lucide-react";
import { Reveal } from "./Reveal";

const SIGNALS = [
  {
    icon: Shield,
    title: "Tamper-evident hashing",
    text: "Every photo is hashed. Pack ID and manifest are verifiable by anyone.",
  },
  {
    icon: FileCheck,
    title: "Court-ready formatting",
    text: "Evidence Pack PDF and demand letter aligned with tribunal and small claims procedures.",
  },
  {
    icon: Scale,
    title: "Verified Pack ID",
    text: "Public verification at /verify — no login required. Share with landlord or board.",
  },
  {
    icon: Lock,
    title: "Chain of custody",
    text: "Timestamped capture and server-recorded upload. One source of truth.",
  },
];

export function TrustSignals() {
  return (
    <section className="border-t border-white/5 border-b border-slate-800/60 bg-slate-900/30 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Built for disputes that hold up
          </h2>
          <p className="text-white font-medium mb-8">
            Trust signals that matter to boards, courts, and landlords.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-6">
          {SIGNALS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="flex gap-4 rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
                <s.icon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-slate-400 text-sm">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
