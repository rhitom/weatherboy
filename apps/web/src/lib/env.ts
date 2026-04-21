export const env = {
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function hasClerkConfig() {
  return Boolean(env.clerkPublishableKey && env.clerkSecretKey);
}

export function hasSupabasePublicConfig() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasSupabaseAdminConfig() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function missingSetupItems() {
  const missing: string[] = [];

  if (!hasClerkConfig()) {
    missing.push("Clerk keys");
  }

  if (!hasSupabasePublicConfig()) {
    missing.push("Supabase public keys");
  }

  if (!hasSupabaseAdminConfig()) {
    missing.push("Supabase service role key");
  }

  return missing;
}
