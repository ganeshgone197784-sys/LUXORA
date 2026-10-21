import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Public values only (safe for browsers). If they are missing, the site
// automatically runs in demo mode with the built-in sample products.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
