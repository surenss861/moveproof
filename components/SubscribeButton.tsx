"use client";

import { useState } from "react";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard?sub=success`,
          cancelUrl: `${window.location.origin}/`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Checkout unavailable");
    } catch (e) {
      // When Stripe isn't configured, show a fallback message
      if (
        typeof window !== "undefined" &&
        !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ) {
        window.alert(
          "Subscriptions coming soon. You can still use Proof Pack and Dispute Accelerator."
        );
      } else {
        window.alert("Could not start checkout. Try again.");
      }
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
      {loading ? "Loading…" : "Start your Proof Pack — $5.99/mo"}
    </button>
  );
}
