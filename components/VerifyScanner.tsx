"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type VerifyStatus = "idle" | "verified" | "error";

interface VerifyScannerProps {
  status: VerifyStatus;
  className?: string;
}

export function VerifyScanner({ status, className = "" }: VerifyScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    const badge = badgeRef.current;
    const ripple = rippleRef.current;
    const flash = flashRef.current;
    if (!container || !line) return;

    // Reset all animated elements to a clean baseline on every status change
    gsap.set(line, { top: "0%", opacity: 1 });
    if (badge) gsap.set(badge, { scale: 1, opacity: status === "verified" ? 1 : 0 });
    if (ripple) gsap.set(ripple, { scale: 0, opacity: 0 });
    if (flash) gsap.set(flash, { opacity: 0 });

    let idleTween: gsap.core.Tween | null = null;
    let tl: gsap.core.Timeline | null = null;

    // ── IDLE: continuous scan line ────────────────────────────────────────────
    if (status === "idle") {
      idleTween = gsap.to(line, {
        top: "100%",
        duration: 2.2,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }

    // ── VERIFIED: rapid final scan → stamp impact ─────────────────────────────
    if (status === "verified" && badge && ripple) {
      tl = gsap.timeline();
      tl
        // 1. Fast final sweep of the line
        .set(line, { top: "0%", opacity: 1 })
        .to(line, { top: "100%", duration: 0.5, ease: "power2.inOut" })
        .set(line, { opacity: 0 })

        // 2. Stamp impact — overshoots then settles (like a rubber stamp)
        .fromTo(
          badge,
          { scale: 1.55, opacity: 0, y: -8 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(2.8)" },
          "-=0.05"
        )

        // 3. Ripple ring expands from badge centre
        .fromTo(
          ripple,
          { scale: 0.4, opacity: 0.8 },
          { scale: 3.2, opacity: 0, duration: 0.55, ease: "power2.out" },
          "<0.05"
        );
    }

    // ── ERROR: shake container + red flash ───────────────────────────────────
    if (status === "error" && flash) {
      tl = gsap.timeline();
      tl
        .set(flash, { opacity: 0.25 })
        .to(flash, { opacity: 0, duration: 0.5 })
        .to(
          container,
          {
            x: "-=7",
            duration: 0.045,
            repeat: 6,
            yoyo: true,
            ease: "power2.inOut",
          },
          "<"
        );
    }

    return () => {
      idleTween?.kill();
      tl?.kill();
    };
  }, [status]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-800/60 min-h-[120px] ${className}`}
    >
      {/* Scan line */}
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.6)] pointer-events-none"
        style={{ top: "30%" }}
      />

      {/* Red flash overlay for error state */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-red-500 pointer-events-none rounded-xl"
        style={{ opacity: 0 }}
      />

      {/* VERIFIED stamp + ripple */}
      {status === "verified" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Ripple ring */}
          <div
            ref={rippleRef}
            className="absolute w-20 h-20 rounded-full border-2 border-emerald-400/60"
            style={{ opacity: 0 }}
          />

          {/* Stamp badge */}
          <div
            ref={badgeRef}
            className="flex items-center gap-2 rounded-xl border-2 border-emerald-400/60 bg-emerald-400/10 px-4 py-2"
            style={{ opacity: 0 }}
          >
            {/* Checkmark drawn inline so we avoid import overhead */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-emerald-400"
            >
              <path
                d="M3 8l3.5 3.5L13 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-semibold tracking-widest text-emerald-300 uppercase">
              Verified
            </span>
          </div>
        </div>
      )}

      {/* ERROR bottom stripe */}
      {status === "error" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400/80" />
      )}
    </div>
  );
}
