import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getEntitlement, isActive, canCompletePack } from "@/lib/db/entitlements";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await getEntitlement(user.id);

  return NextResponse.json({
    isVaultActive: isActive(row),
    canCompletePack: canCompletePack(row),
    vault: row && row.plan === "vault"
      ? {
          interval: row.interval,
          status: row.status,
          currentPeriodEnd: row.current_period_end,
          cancelAtPeriodEnd: row.cancel_at_period_end,
        }
      : null,
  });
}
