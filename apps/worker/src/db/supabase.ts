import { createClient } from "@supabase/supabase-js";
import { workerEnv } from "../env.js";

export function createWorkerSupabaseClient() {
  return createClient(workerEnv.supabaseUrl, workerEnv.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
