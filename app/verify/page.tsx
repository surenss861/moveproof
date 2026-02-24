"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Copy, Check } from "lucide-react";
import { VerifyScanner } from "@/components/VerifyScanner";
import { HoloBadge } from "@/components/HoloBadge";
import { HashReveal } from "@/components/HashReveal";

type VerifyStatus = "idle" | "verified" | "error";

const STUB_FORMAT = /^MP-[A-F0-9]{4}-[A-F0-9]{4}$/i;

/** Small inline copy button that swaps to a checkmark on success */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="rounded-lg border border-white/15 p-1.5 text-white/50 hover:text-white/80 hover:border-white/30 transition active:scale-90"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

/** Shimmer skeleton for loading state */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded bg-white/5 animate-pulse ${className}`} />
  );
}

export default function VerifyPage() {
  const [packId, setPackId] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    packId?: string;
    packHash?: string | null;
    generatedAtServer?: string;
    createdAt?: string;
    integrity?: string;
    items?: Array<{
      evidenceId: string | null;
      sha256: string | null;
      uploadedAtServer: string | null;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isVerified =
    result && (result.ok !== false || (result.packId && !("error" in result)));
  const scannerStatus: VerifyStatus = isVerified
    ? "verified"
    : error
    ? "error"
    : "idle";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = packId.trim();
    if (!id) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      if (STUB_FORMAT.test(id.toUpperCase())) {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packId: id }),
        });
        const data = await res.json();
        setResult(data);
        if (!data.ok) setError("Pack not found");
        return;
      }
      const res = await fetch(`/api/verify/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        setResult({ ok: false });
        return;
      }
      setResult({ ...data, ok: true });
    } catch {
      setError("Could not verify. Try again.");
      setResult({ ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080705] text-[#FFFFFA] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="text-cyan-400 text-sm mb-6 inline-block hover:underline"
        >
          ← MoveProof
        </Link>
        <h1 className="text-3xl font-semibold mb-2">Verify a Pack ID</h1>
        <p className="text-white/70 text-sm mb-6">
          Anyone can verify. This is your trust engine.
        </p>

        <VerifyScanner status={scannerStatus} className="mb-6" />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="text-sm text-white/70">Pack ID</label>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={packId}
              onChange={(e) => setPackId(e.target.value)}
              placeholder="MP-ABCD-1234 or UUID"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-60 hover:opacity-90 flex items-center justify-center gap-2 w-full active:scale-[0.97] transition-transform"
            >
              <Search className="w-5 h-5" />
              {loading ? "Verifying…" : "Verify"}
            </button>
          </form>

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full mt-3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          )}

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

          {result && result.ok && (
            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm space-y-4">
              {/* Holographic Pack ID + copy */}
              {result.packId && (
                <div className="flex items-center gap-2 flex-wrap">
                  <HoloBadge packId={result.packId} size="sm" />
                  <CopyButton text={result.packId} />
                  <span className="text-white/40 text-xs">Share with landlord or tribunal</span>
                </div>
              )}

              <div className="text-white/90">
                Status:{" "}
                <span className="text-emerald-300 font-semibold">Verified</span>
              </div>

              <div className="text-white/60 text-xs space-y-0.5">
                {result.createdAt && <div>Created: {result.createdAt}</div>}
                {result.generatedAtServer && (
                  <div>Generated: {result.generatedAtServer}</div>
                )}
                {result.integrity && <div>Integrity: {result.integrity}</div>}
              </div>

              {/* Pack hash — scramble animation */}
              {result.packHash && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white/60 text-xs">Pack hash</p>
                    <CopyButton text={result.packHash} />
                  </div>
                  <HashReveal
                    hash={result.packHash}
                    className="text-xs"
                    duration={650}
                  />
                </div>
              )}

              {/* Evidence item hashes */}
              {result.items && result.items.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs mb-1">
                    Evidence items ({result.items.length})
                  </p>
                  <ul className="space-y-1">
                    {result.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/60 font-mono flex items-center gap-2"
                      >
                        <span className="text-white/30 shrink-0">
                          {item.evidenceId ?? `#${i + 1}`}
                        </span>
                        {item.sha256 ? (
                          <HashReveal
                            hash={item.sha256.slice(0, 16) + "…"}
                            duration={500 + i * 60}
                          />
                        ) : (
                          <span>—</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result && !result.ok && result.packId && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm">
              <span className="text-red-300">Not found</span>
            </div>
          )}
        </div>

        <p className="text-white/50 text-xs mt-8 text-center">
          Information only, not legal advice.
        </p>
      </div>
    </div>
  );
}
