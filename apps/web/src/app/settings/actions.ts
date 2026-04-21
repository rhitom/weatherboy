"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { OnboardingSubmission } from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { persistUserPreferences } from "@/lib/preferences-persistence";

export interface SettingsActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const initialSettingsState: SettingsActionState = {
  status: "idle",
  message: "",
};

function parseSubmission(formData: FormData) {
  const raw = formData.get("payload");

  if (typeof raw !== "string") {
    throw new Error("Missing settings payload.");
  }

  return JSON.parse(raw) as OnboardingSubmission;
}

export async function saveSettings(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        status: "error",
        message: "Please sign in before saving settings.",
      };
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return {
        status: "error",
        message: "Supabase is not configured yet. Add the env vars, then try again.",
      };
    }

    const submission = parseSubmission(formData);
    await persistUserPreferences(supabase, userId, submission, true);

    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return {
      status: "success",
      message: "Settings saved.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong while saving settings.",
    };
  }
}
