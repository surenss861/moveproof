import { getSupabaseAdmin } from "@/lib/supabase/server";

export interface EntitlementRow {
  id: string;
  user_id: string;
  plan: string;                       // 'vault' | 'one_time_pack' | 'free'
  status: string;                     // 'active' | 'past_due' | 'canceled'
  interval: string | null;            // 'month' | 'year' | null
  stripe_price_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
}

export async function getEntitlement(userId: string): Promise<EntitlementRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("entitlements")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("getEntitlement error:", error);
    return null;
  }
  return data as EntitlementRow | null;
}

export async function upsertEntitlement(
  userId: string,
  data: Partial<Omit<EntitlementRow, "id" | "user_id" | "created_at">>
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("entitlements")
    .upsert(
      { user_id: userId, ...data, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) {
    console.error("upsertEntitlement error:", error);
    throw error;
  }
}

/** True only when the user has an active Vault subscription. */
export function isActive(row: EntitlementRow | null): boolean {
  if (!row) return false;
  return row.plan === "vault" && row.status === "active";
}

/** True when the user can seal/download at least one pack (Vault or one-time). */
export function canCompletePack(row: EntitlementRow | null): boolean {
  if (!row) return false;
  if (row.plan === "vault" && row.status === "active") return true;
  if (row.plan === "one_time_pack" && row.status === "active") return true;
  return false;
}
