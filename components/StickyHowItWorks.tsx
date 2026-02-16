"use client";

import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const steps = [
  {
    title: "Capture room-by-room",
    body: "Guided checklist. Photos with timestamp + optional GPS. Hashed and stored so nothing can be altered later.",
  },
  {
    title: "Get your Evidence Pack PDF",
    body: "One PDF with Chain of Custody, Pack ID, and photo log. LTB-friendly format. Download and keep it.",
  },
  {
    title: "Dispute? Demand letter + LTB path",
    body: "If they withhold or deduct: we give you a demand letter, evidence deadlines (7 days / 5 days), T1 form guidance, and serving checklist.",
  },
];

export function StickyHowItWorks() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-[1fr,1.6fr] gap-10 md:gap-14 items-start">
          {/* Sticky left column */}
          <div className="md:sticky md:top-24">
            <Reveal>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                How it works
              </h2>
              <p className="text-white font-medium text-lg">
                Evidence Pack includes everything you need to prove condition and timelines.
              </p>
            </Reveal>
          </div>
          {/* Scrolling right column with staggered step reveals */}
          <RevealStagger className="space-y-10">
            {steps.map((step, i) => (
              <RevealItem key={i}>
                <li className="flex gap-4 list-none">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
