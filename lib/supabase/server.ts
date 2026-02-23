import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

/** Server-only: use in API routes for admin/verify. Never expose to client. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRole) {
      throw new Error("Supabase server: URL or service role key missing.");
    }
    _admin = createClient(url, serviceRole, { auth: { persistSession: false } });
  }
  return _admin;
}
