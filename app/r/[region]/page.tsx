import Link from "next/link";
import { MODULES, REGIONS } from "@/lib/jurisdictions";

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionId } = await params;
  const region = REGIONS.find((r) => r.id === regionId);
  const mod = MODULES[regionId];

  if (!region || !mod) {
    return (
      <main className="min-h-screen bg-[#080705] text-[#FFFFFA] p-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold">Region not found</h1>
          <Link href="/" className="mt-4 inline-block underline text-white/70">Back home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080705] text-[#FFFFFA]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080705]/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link href="/" className="text-lg font-semibold">MoveProof</Link>
        </div>
      </header>

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-sm text-white/60">{region.country} • {region.label}</div>
          <h1 className="mt-2 text-4xl font-semibold">
            Security deposit proof for {region.label}
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">{region.shortBlurb}</p>

          <div className="mt-6 flex gap-3">
            <Link href="/create" className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold">
              Create my Evidence Pack
            </Link>
            <Link href="/verify" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5">
              Verify Pack ID
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-14">
        <div className="mx-auto max-w-5xl px-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="font-semibold">Jurisdiction module</div>
            <div className="mt-2 text-white/70 text-sm">{mod.tribunalOrCourt}</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {mod.deadlinesBullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <div className="font-semibold">What you get</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {mod.includes.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-white/50">{mod.disclaimer}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
