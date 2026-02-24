"use client";

import { useRef, useCallback } from "react";
import { ShieldCheck } from "lucide-react";

interface Props {
  packId: string;
  size?: "sm" | "md";
}

/**
 * Holographic Pack ID badge — the product artifact.
 * On desktop: rainbow shimmer + 3-D tilt tracks the cursor.
 * On mobile: subtle prismatic sheen (no gyroscope needed).
 */
export function HoloBadge({ packId, size = "md" }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0→1
      const y = (e.clientY - r.top) / r.height; // 0→1
      el.style.setProperty("--px", `${x * 100}%`);
      el.style.setProperty("--py", `${y * 100}%`);
      el.style.setProperty("--rx", `${(y - 0.5) * -10}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
      el.style.setProperty("--hue", `${Math.round(x * 300)}deg`);
      el.style.setProperty("--shine", "1");
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--px", "50%");
      el.style.setProperty("--py", "50%");
      el.style.setProperty("--shine", "0");
    });
  }, []);

  const isSmall = size === "sm";

  return (
    <div style={{ perspective: "700px" }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          {
            "--px": "50%",
            "--py": "50%",
            "--rx": "0deg",
            "--ry": "0deg",
            "--hue": "180deg",
            "--shine": "0",
            transform:
              "rotateX(var(--rx)) rotateY(var(--ry))",
            transition: "transform 0.15s ease",
            transformStyle: "preserve-3d",
            willChange: "transform",
          } as React.CSSProperties
        }
        className={`group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900 cursor-default select-none overflow-hidden ${
          isSmall
            ? "px-3 py-1.5 text-xs"
            : "px-4 py-2.5 text-sm"
        }`}
      >
        {/* Always-on subtle prismatic base layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(135deg, hsla(220,80%,60%,0.25) 0%, hsla(180,80%,60%,0.05) 50%, hsla(280,80%,60%,0.25) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Mouse-tracking shimmer (desktop hover) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: "calc(var(--shine, 0) * 0.85)",
            background: `
              radial-gradient(circle at var(--px) var(--py),
                hsla(var(--hue), 100%, 75%, 0.55) 0%,
                transparent 55%
              ),
              linear-gradient(
                calc(var(--hue)),
                hsla(0deg,  90%,60%,0.12),
                hsla(60deg, 90%,60%,0.12),
                hsla(120deg,90%,60%,0.12),
                hsla(180deg,90%,60%,0.12),
                hsla(240deg,90%,60%,0.12),
                hsla(300deg,90%,60%,0.12),
                hsla(360deg,90%,60%,0.12)
              )
            `,
            mixBlendMode: "color-dodge",
          }}
        />

        {/* Foil border glow — shows on hover */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow:
              "inset 0 0 0 1px hsla(var(--hue), 80%, 70%, 0.4), 0 0 18px hsla(var(--hue), 80%, 60%, 0.15)",
          }}
        />

        {/* Content */}
        <ShieldCheck
          className={`shrink-0 text-cyan-400 ${isSmall ? "w-3 h-3" : "w-4 h-4"}`}
        />
        <span className="font-mono text-white/90 tracking-widest">{packId}</span>
      </div>
    </div>
  );
}
