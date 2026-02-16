"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [packId, setPackId] = useState<string | null>(null);

  async function createPack() {
    setLoading(true);
    setPackId(null);
    const res = await fetch("/api/pack/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: topic || "move-out pack" }),
    });
    const data = await res.json();
    setPackId(data.packId);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080705] text-[#FFFFFA]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080705]/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <Link href="/" className="text-lg font-semibold">MoveProof</Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Create your Evidence Pack</h1>
        <p className="mt-2 text-white/70 text-sm">
          This is a working MVP stub. Next step is wiring media upload + PDF generation.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="text-sm text-white/70">Optional note</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40"
            placeholder="e.g. Move-out photos for 12 King St"
          />

          <button
            onClick={createPack}
            disabled={loading}
            className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-60 hover:opacity-90"
          >
            {loading ? "Creating..." : "Create Pack ID"}
          </button>

          {packId && (
            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm">
              Pack created: <span className="font-semibold">{packId}</span>
              <div className="mt-2 text-white/70 text-xs">
                You can verify it at{" "}
                <Link href="/verify" className="underline text-cyan-300">
                  /verify
                </Link>
                .
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-white/50 text-sm">
          Want the full flow? <Link href="/signup" className="text-cyan-400 underline">Sign up</Link> for room-by-room capture + PDF generation.
        </p>
      </div>
    </main>
  );
}
