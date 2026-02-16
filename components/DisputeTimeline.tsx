"use client";

import { Camera, Hash, FileText, Send, Scale } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  { icon: Camera, label: "Capture", sub: "Room-by-room, timestamped" },
  { icon: Hash, label: "Hash", sub: "Tamper-evident manifest" },
  { icon: FileText, label: "PDF", sub: "Chain of Custody + Pack ID" },
  { icon: Send, label: "Demand letter", sub: "Clear deadline, attach pack" },
  { icon: Scale, label: "File & serve", sub: "Tribunal/small claims path" },
];

export function DisputeTimeline() {
  return (
    <section className="border-t border-white/5 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Your dispute path
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex flex-wrap justify-between gap-4 md:gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3 min-w-[140px]"
              >
                <s.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">{s.label}</p>
                  <p className="text-slate-500 text-xs">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
