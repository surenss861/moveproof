"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProofCardScrollReveal() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current!,
          start: "top 75%",
          end: "top 35%",
          scrub: true,
        },
      });

      tl.fromTo(
        cardRef.current!,
        { y: 24, opacity: 0.75, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out" }
      );

      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0.92, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wrapRef.current!,
              start: "top 55%",
              once: true,
            },
          }
        );
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 text-white/70 text-sm">This is what you&apos;ll have in hand</div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div
            ref={cardRef}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">MoveProof Evidence Pack</div>
              <div
                ref={badgeRef}
                className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200"
              >
                Verified Pack ID
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                Pack ID: <span className="text-white/90">MP-XXXX-XXXX</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                Media manifest + hashes (tamper-evident)
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                Chain-of-custody PDF + evidence index
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <div className="text-white font-semibold">Inside the pack</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• Photo/video log with timestamps</li>
              <li>• Evidence index (what / where / when)</li>
              <li>• Demand letter template (jurisdiction module)</li>
              <li>• Filing checklist (tribunal / small claims)</li>
              <li>• Public verification page for Pack ID</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
