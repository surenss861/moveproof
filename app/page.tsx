import Link from "next/link";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { ProofCardScrollReveal } from "@/components/ProofCardScrollReveal";
import { RegionSelector } from "@/components/RegionSelector";
import { VaultPricingToggle } from "@/components/VaultPricingToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080705] text-[#FFFFFA]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080705]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            MoveProof
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/verify" className="text-sm text-white/70 hover:text-white transition">
              Verify pack
            </Link>
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <div className="text-sm text-white/60">Security deposit protection for renters</div>
              <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight">
                Don&apos;t let your landlord keep your money.
              </h1>
              <p className="mt-5 max-w-2xl text-white/70">
                Prove your move-out condition. One Evidence Pack — tamper-evident hashes, Chain of Custody PDF,
                demand letter + tribunal/small-claims checklist for your region.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/create"
                  className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
                >
                  Create my Evidence Pack
                </Link>
                <Link
                  href="/verify"
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  Verify a Pack ID
                </Link>
                <div className="text-xs text-white/60">
                  Pack ID + tamper-evident hash. Anyone can verify.
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 text-xs text-white/60">
                  Works across the US & Canada — jurisdiction modules rolling out
                </div>
                <RegionSelector />
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROOF (GSAP scrub only) */}
        <ProofCardScrollReveal />

        {/* HOW IT WORKS */}
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2">
            <div className="md:sticky md:top-24 self-start">
              <Reveal>
                <div className="text-sm text-white/60">How it works</div>
                <h2 className="mt-2 text-3xl font-semibold">A calm path from photos → proof.</h2>
                <p className="mt-3 text-white/70">
                  Capture, hash, package, and send. You&apos;ll have a single pack you can print, file, and reference.
                </p>
              </Reveal>
            </div>

            <RevealStagger className="space-y-4">
              {[
                ["Capture", "Take move-out photos/videos and basic notes."],
                ["Hash + Index", "We generate a tamper-evident manifest and evidence index."],
                ["Pack + Letter", "Download the PDF pack + demand letter + filing checklist."],
              ].map(([t, d]) => (
                <RevealItem key={t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold">{t}</div>
                  <div className="mt-2 text-sm text-white/70">{d}</div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        {/* RISK SCENARIO */}
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-3xl font-semibold">What usually happens vs. what happens with MoveProof</h2>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Reveal className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="font-semibold text-red-200">What usually happens</div>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>• Landlord claims damage after you leave.</li>
                  <li>• You have photos, but no structure or chain-of-custody.</li>
                  <li>• Deadlines + steps are unclear, so you stall.</li>
                </ul>
              </Reveal>

              <Reveal className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
                <div className="font-semibold text-cyan-200">With MoveProof</div>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>• Timestamped evidence index + Pack ID.</li>
                  <li>• Tamper-evident hashes anyone can verify.</li>
                  <li>• Demand letter + tribunal/small-claims checklist for your region.</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS */}
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-3xl font-semibold">Built for disputes, not vibes</h2>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Tamper-evident hashing", "Shows if anything was changed."],
                ["Court-ready formatting", "Clean PDFs you can file or print."],
                ["Verified Pack ID", "Public verify page for trust."],
                ["Chain of custody", "Simple timeline of capture → pack."],
              ].map(([t, d]) => (
                <Reveal key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="font-semibold">{t}</div>
                  <div className="mt-2 text-sm text-white/70">{d}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-3xl font-semibold">Photos alone solve ~10% of the problem</h2>
              <p className="mt-3 text-white/70 max-w-2xl">
                The rest is structure, integrity, and &quot;what do I do next?&quot; This is where landlords win.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Reveal className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="font-semibold">Just taking photos</div>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  <li>• No evidence index</li>
                  <li>• No integrity verification</li>
                  <li>• No demand letter</li>
                  <li>• No filing checklist</li>
                </ul>
              </Reveal>

              <Reveal className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6">
                <div className="font-semibold">MoveProof Evidence Pack</div>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  <li>• Pack ID + public verification</li>
                  <li>• Hash manifest + chain of custody</li>
                  <li>• Demand letter template</li>
                  <li>• Tribunal / small-claims checklist</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-3xl font-semibold">What renters say</h2>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Toronto, ON", "\"Landlord tried to claim wall damage. The pack made it obvious what was real.\""],
                ["Mississauga, ON", "\"Having a single PDF with a checklist made the dispute way less stressful.\""],
              ].map(([loc, quote]) => (
                <Reveal key={loc} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm text-white/60">{loc}</div>
                  <div className="mt-2 text-white/85">{quote}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING + CTA */}
        <section id="pricing" className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-3xl font-semibold text-center">Simple pricing</h2>
              <p className="mt-3 text-center text-white/70">
                Subscribe for ongoing protection, or buy one pack for a single move.
              </p>
            </Reveal>

            <div className="mt-10">
              <VaultPricingToggle />
            </div>

            <Reveal className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-10">
              <h3 className="text-4xl font-semibold">Get your deposit back — with proof.</h3>
              <p className="mt-3 max-w-2xl text-white/70">
                LTB-ready evidence for Ontario. Court-ready evidence everywhere.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/signup" className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
                  Get started
                </Link>
                <span className="text-xs text-white/60">Works across the US & Canada</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-white/50 text-xs">
          Information only, not legal advice. Outcome not guaranteed.
        </div>
      </footer>
    </div>
  );
}
