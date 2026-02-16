import { NextResponse } from "next/server";

function makeId() {
  const a = Math.random().toString(16).slice(2, 6).toUpperCase();
  const b = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `MP-${a}-${b}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const packId = makeId();

  // TODO: persist to DB (Supabase) + store hash manifest + files
  return NextResponse.json({
    ok: true,
    packId,
    note: body?.note ?? null,
    createdAt: new Date().toISOString(),
  });
}
