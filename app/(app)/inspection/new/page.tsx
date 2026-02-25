"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createInspection } from "@/lib/inspections-supabase";
import { Loader2 } from "lucide-react";

export default function NewInspectionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [type, setType] = useState<"move-in" | "move-out">("move-in");
  const [address, setAddress] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.uid || !address.trim()) return;
    setError("");
    setLoading(true);
    try {
      const id = await createInspection(
        user.uid,
        type,
        address.trim(),
        landlordName.trim() || undefined
      );
      router.push(`/inspection/${id}`);
    } catch {
      setError("Could not start inspection. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <Link
        href="/dashboard"
        className="text-cyan-400 text-sm mb-6 inline-block"
      >
        ← Back
      </Link>
      <h1 className="text-xl font-bold text-white mb-1">New Proof Pack</h1>
      <p className="text-slate-400 text-sm mb-6">
        We&apos;ll guide you room-by-room. Takes about 10 minutes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Is this move-in or move-out?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("move-in")}
              className={`flex-1 py-3 rounded-lg border font-medium active:scale-[0.97] transition-transform ${
                type === "move-in"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "bg-slate-800 border-slate-600 text-slate-400"
              }`}
            >
              Move-in
            </button>
            <button
              type="button"
              onClick={() => setType("move-out")}
              className={`flex-1 py-3 rounded-lg border font-medium active:scale-[0.97] transition-transform ${
                type === "move-out"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "bg-slate-800 border-slate-600 text-slate-400"
              }`}
            >
              Move-out
            </button>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Property address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="123 Main St, City, Province"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Landlord or property manager (optional)
          </label>
          <input
            type="text"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="Name or company"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 disabled:opacity-50 active:scale-[0.97] transition-transform"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting…
            </span>
          ) : (
            "Start inspection"
          )}
        </button>
      </form>
    </div>
  );
}
