"use client";

import { Reveal } from "./Reveal";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Finally had something I could show the LTB that wasn’t just a folder of random photos. The Pack ID and verify page made it real.",
    attribution: "Renter, Ontario",
  },
  {
    quote: "My landlord tried to charge for “damage” that was there at move-in. The demand letter and evidence deadlines gave me a clear path.",
    attribution: "Renter, Toronto",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-white/5 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            What renters say
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <blockquote className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6">
                <Quote className="w-8 h-8 text-cyan-500/50 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="text-slate-500 text-xs">
                  — {t.attribution}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
