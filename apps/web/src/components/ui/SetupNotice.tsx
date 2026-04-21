import { missingSetupItems } from "@/lib/env";

export default function SetupNotice() {
  const missing = missingSetupItems();

  if (missing.length === 0) {
    return null;
  }

  return (
    <div className="glass-card px-4 py-3 text-sm text-muted">
      <span className="font-medium text-foreground">Setup still needed:</span>{" "}
      {missing.join(", ")}. The route shell is ready, but live auth and database writes need those env vars.
    </div>
  );
}
