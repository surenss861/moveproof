"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  interval: "month" | "year";
}

const LABELS: Record<Props["interval"], string> = {
  month: "Start Vault — $9.99/mo",
  year: "Start Vault — $79/yr",
};

export function SubscribeButton({ interval }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!user) {
      window.location.href = "/signup?intent=vault";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interval,
          userId: user.uid,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout unavailable");
      }
    } catch {
      window.alert("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="block w-full py-4 rounded-xl bg-cyan-500 text-slate-900 font-semibold text-center hover:bg-cyan-400 transition disabled:opacity-50"
    >
      {loading ? "Loading…" : LABELS[interval]}
    </button>
  );
}
