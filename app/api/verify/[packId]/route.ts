import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const { packId } = await params;
  if (!packId) {
    return NextResponse.json({ error: "Pack ID required" }, { status: 400 });
  }

  try {
    const { data: pack, error: packErr } = await supabaseAdmin
      .from("packs")
      .select("id, pack_hash, generated_at")
      .eq("id", packId)
      .single();

    if (packErr || !pack) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }

    const { data: items } = await supabaseAdmin
      .from("evidence_items")
      .select("id, sha256, uploaded_at")
      .eq("pack_id", packId)
      .order("uploaded_at", { ascending: true });

    return NextResponse.json({
      packId: pack.id,
      packHash: pack.pack_hash ?? null,
      manifestVersion: 1,
      generatedAtServer: pack.generated_at,
      items: (items ?? []).map((i) => ({
        evidenceId: i.id,
        sha256: i.sha256,
        uploadedAtServer: i.uploaded_at,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
