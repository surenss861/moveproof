"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useAnimation } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const controls = useAnimation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
      controls.start({
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        transition: { duration: 0.45 },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-sm mx-auto">
      <Link href="/" className="text-cyan-400 text-sm mb-8 inline-block">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
      <p className="text-slate-400 text-sm mb-6">
        Start your first Proof Pack in 10 minutes
      </p>
      <motion.form animate={controls} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="At least 6 characters"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 disabled:opacity-50 active:scale-[0.97] transition-transform"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </motion.form>
      <p className="text-slate-500 text-sm mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
