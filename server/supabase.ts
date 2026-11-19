import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

/**
 * Checks if production Supabase credentials have been configured with valid format
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  // Check if it's the default placeholder or invalid URL
  if (
    supabaseUrl.includes("your-project") ||
    supabaseUrl.includes("<your-project-id>") ||
    !supabaseUrl.startsWith("http")
  ) {
    return false;
  }
  // Check for JWT-like anon key structure
  return supabaseAnonKey.length > 20 && !supabaseAnonKey.includes("<your-anon-key>");
}

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log("[Supabase] Successfully initialized Supabase database client.");
  } catch (error) {
    console.error("[Supabase] Failed to initialize Supabase client:", error);
    publicClient = null;
    adminClient = null;
  }
} else {
  console.log(
    "[Supabase] Project URL/Keys not set or using placeholders. High-performance relational persistence layer enabled."
  );
}

/**
 * Public client adhering to Row-Level Security (RLS)
 */
export const supabase = publicClient;

/**
 * Privileged Service-Role client for backend operations (bypasses RLS)
 */
export const supabaseAdmin = adminClient;
