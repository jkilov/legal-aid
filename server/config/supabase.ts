import { createClient } from "@supabase/supabase-js";

// Server-side client. Uses the service role key, which bypasses Row Level
// Security — the server authenticates the user itself in requireAuth, so it
// is trusted to act on their behalf. This key must NEVER reach the frontend.
export const supabase = createClient(
    process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)