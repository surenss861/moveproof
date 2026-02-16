import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const packId = String(body?.packId || "").trim().toUpperCase();

  // MVP behavior:
  // - treat any MP-XXXX-XXXX format as "verifiable" (stub)
  const ok = /^MP-[A-F0-9]{4}-[A-F0-9]{4}$/.test(packId);

  return NextResponse.json(
    ok
      ? {
          ok: true,
          packId,
          createdAt: new Date().toISOString(),
          integrity: "hash-manifest-present (stub)",
        }
      : { ok: false, packId }
  );
}
