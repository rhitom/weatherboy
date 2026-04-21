import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasClerkConfig } from "@/lib/env";

export interface ViewerState {
  userId: string | null;
  firstName: string | null;
  onboardingComplete: boolean;
}

export async function getViewerState(): Promise<ViewerState> {
  if (!hasClerkConfig()) {
    return {
      userId: null,
      firstName: null,
      onboardingComplete: false,
    };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      firstName: null,
      onboardingComplete: false,
    };
  }

  const [user, supabase] = await Promise.all([
    currentUser(),
    Promise.resolve(createSupabaseAdminClient()),
  ]);

  if (!supabase) {
    return {
      userId,
      firstName: user?.firstName ?? null,
      onboardingComplete: false,
    };
  }

  const { data } = await supabase
    .from("user_preferences")
    .select("onboarding_complete")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  return {
    userId,
    firstName: user?.firstName ?? null,
    onboardingComplete: data?.onboarding_complete ?? false,
  };
}
