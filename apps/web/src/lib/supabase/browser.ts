"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabasePublicConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabasePublicConfig()) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
}
