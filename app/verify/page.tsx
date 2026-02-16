"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { VerifyScanner } from "@/components/VerifyScanner";

type VerifyStatus = "idle" | "verified" | "error";

// Stub format from /create: MP-XXXX-XXXX
const STUB_FORMAT = /^MP-[A-F0-9]{4}-[A-F0-9]{4}$/i;

export default function VerifyPage() {
  const [packId, setPackId] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    packId?: string;
    packHash?: string | null;
    generatedAtServer?: string;
    createdAt?: string;
    integrity?: string;
    items?: Array<{ evidenceId: string | null; sha256: string | null; uploadedAtServer: string | null }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isVerified = result && (result.ok !== false || (result.packId && !("error" in result)));
  const scannerStatus: VerifyStatus = isVerified ? "verified" : error ? "error" : "idle";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = packId.trim();
    if (!id) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      // Stub format: POST /api/verify
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
      // Real packs (UUID): GET /api/verify/[packId]
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
        <Link href="/" className="text-cyan-400 text-sm mb-6 inline-block hover:underline">
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
              className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-60 hover:opacity-90 flex items-center justify-center gap-2 w-full"
            >
              <Search className="w-5 h-5" />
              {loading ? "Verifying…" : "Verify"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

          {result && result.ok && (
            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm">
              <div className="text-white/90">
                Status: <span className="text-emerald-300 font-semibold">Verified</span>
              </div>
              <div className="mt-2 text-white/70 text-xs">
                {result.createdAt && `Created: ${result.createdAt}`}
                {result.generatedAtServer && `Generated: ${result.generatedAtServer}`}
                {result.integrity && ` • Integrity: ${result.integrity}`}
              </div>
              {result.packHash && (
                <div className="mt-2">
                  <p className="text-white/60 text-xs">Pack hash</p>
                  <p className="text-white font-mono text-xs break-all">{result.packHash}</p>
                </div>
              )}
              {result.items && result.items.length > 0 && (
                <div className="mt-2">
                  <p className="text-white/60 text-xs">Evidence items ({result.items.length})</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-white/70 font-mono">
                    {result.items.map((item, i) => (
                      <li key={i}>
                        {item.evidenceId ?? `Item ${i + 1}`} · {item.sha256?.slice(0, 12)}...
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
