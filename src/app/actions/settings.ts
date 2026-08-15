"use server";

import { getSettings } from "@/server/repositories/settings-repository";

/**
 * The only sanctioned way for a Client Component to read store settings.
 * Client bundles can't share memory with the server process, so a static
 * import of a constant would freeze a build-time copy that never sees
 * admin edits from /admin/configuracoes — this round-trips to the live
 * server store instead.
 */
export async function getSettingsSnapshotAction() {
  return getSettings();
}
