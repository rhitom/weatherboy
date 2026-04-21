"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { OnboardingSubmission } from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { persistUserPreferences } from "@/lib/preferences-persistence";

export interface OnboardingActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const initialOnboardingState: OnboardingActionState = {
  status: "idle",
  message: "",
};

function parseSubmission(formData: FormData) {
  const raw = formData.get("payload");

  if (typeof raw !== "string") {
    throw new Error("Missing onboarding payload.");
  }

  return JSON.parse(raw) as OnboardingSubmission;
}

export async function submitOnboarding(
  _previousState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        status: "error",
        message: "Please sign in before saving onboarding.",
      };
    }

    const submission = parseSubmission(formData);
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return {
        status: "error",
        message: "Supabase is not configured yet. Add the env vars, then try again.",
      };
    }

    await persistUserPreferences(supabase, userId, submission, true);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return {
      status: "success",
      message: "Onboarding saved. Taking you to your dashboard.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong while saving onboarding.",
    };
  }
}
