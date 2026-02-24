"use client";

import { useEffect, useRef, useState } from "react";

const HEX = "0123456789abcdef";
const rand = () => HEX[Math.floor(Math.random() * HEX.length)];

interface Props {
  hash: string;
  /** Total scramble-to-resolve duration in ms */
  duration?: number;
  className?: string;
}

/**
 * Renders a hex hash that scrambles then resolves left-to-right,
 * like a serial number locking into place.
 * Locked chars = white. Scrambling chars = dim cyan (visually resolving).
 */
export function HashReveal({ hash, duration = 700, className = "" }: Props) {
  const [locked, setLocked] = useState(0);
  const [suffix, setSuffix] = useState(() =>
    Array.from({ length: hash.length }, rand).join("")
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const len = hash.length;
    let startTs: number | null = null;

    function tick(ts: number) {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const newLocked = Math.round(progress * len);
      setLocked(newLocked);
      setSuffix(Array.from({ length: len - newLocked }, rand).join(""));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hash, duration]);

  return (
    <span className={`font-mono break-all ${className}`}>
      <span className="text-white">{hash.slice(0, locked)}</span>
      <span className="text-cyan-400/50">{suffix}</span>
    </span>
  );
}
