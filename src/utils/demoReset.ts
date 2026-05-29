/**
 * Global demo reset utility.
 * Clears all persisted demo state + console preferences.
 * Can be called from anywhere (inspector, toolbar, keyboard, etc.).
 */
export function resetEverything() {
  try {
    // Demo state
    localStorage.removeItem('gody-demo-state'); // if we ever persist it

    // Console preferences
    localStorage.removeItem('gody-console-favorites');
    localStorage.removeItem('gody-console-recent');
    localStorage.removeItem('gody-console-flow');
    localStorage.removeItem('gody-console-frame');
    localStorage.removeItem('gody-console-zoom');

    // Force full reload to get clean state (simplest reliable way)
    window.location.reload();
  } catch {
    console.warn('Reset encountered an issue, forcing reload anyway');
    window.location.reload();
  }
}
