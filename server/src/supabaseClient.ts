import "dotenv/config";
import "dotenv/config";   
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase env vars");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
