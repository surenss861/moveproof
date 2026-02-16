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
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    const pulse = pulseRef.current;
    if (!container || !line) return;

    let idleTween: gsap.core.Tween | null = null;
    let successTl: gsap.core.Timeline | null = null;
    let errorTl: gsap.core.Timeline | null = null;

    if (status === "idle") {
      idleTween = gsap.to(line, {
        top: "100%",
        duration: 2.2,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }

    if (status === "verified") {
      idleTween?.kill();
      successTl = gsap.timeline();
      successTl
        .set(line, { top: "0%", opacity: 1 })
        .to(line, {
          top: "100%",
          duration: 0.6,
          ease: "power2.inOut",
        })
        .set(line, { opacity: 0 }, "-=0.1");
      if (pulse) {
        successTl.to(
          pulse,
          {
            scale: 1.08,
            opacity: 0.9,
            duration: 0.25,
            repeat: 1,
            yoyo: true,
            ease: "power2.out",
          },
          0.2
        );
      }
    }

    if (status === "error") {
      idleTween?.kill();
      errorTl = gsap.timeline();
      errorTl.to(container, {
        x: "-=6",
        duration: 0.04,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    return () => {
      idleTween?.kill();
      successTl?.kill();
      errorTl?.kill();
    };
  }, [status]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-800/60 min-h-[120px] ${className}`}
    >
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.6)] pointer-events-none"
        style={{ top: "30%" }}
      />
      {status === "verified" && (
        <div
          ref={pulseRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="rounded-lg bg-proof-green/20 px-3 py-1.5 text-sm font-medium text-proof-green border border-proof-green/40">
            Verified
          </span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400/80" />
      )}
    </div>
  );
}
