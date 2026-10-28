import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes. Copiez .env.example vers .env."
  );
}

const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
