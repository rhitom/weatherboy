import { syncWeatherboyData } from "./sync.js";

async function main() {
  const timestamp = new Date().toISOString();
  console.log(`[worker] weatherboy sync starting at ${timestamp}`);
  const result = await syncWeatherboyData();
  console.log("[worker] weatherboy sync finished", result);
}

main().catch((error) => {
  console.error("[worker] fatal error", error);
  process.exitCode = 1;
});
