function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const workerEnv = {
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  weatherApiKey: process.env.WEATHERAPI_KEY || null,
  googlePollenApiKey: process.env.GOOGLE_POLLEN_API_KEY || null,
};
