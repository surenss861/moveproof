import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.warn("Supabase server: URL or service role key missing.");
}

/** Server-only: use in API routes for admin/verify. Never expose to client. */
export const supabaseAdmin = createClient(url ?? "", serviceRole ?? "", {
  auth: { persistSession: false },
});
