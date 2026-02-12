// goldenShells.storage.ts
import { DEFAULT_STORE, type GoldenShellsStore } from "./types";

const LS_KEY = "cosmicTravellers.goldenShells";

export function loadShellsStore(): GoldenShellsStore {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      return DEFAULT_STORE;
    }
    const parsed = JSON.parse(raw) as GoldenShellsStore;

    if (typeof parsed?.version !== "number") {
      return DEFAULT_STORE;
    }
    return {
      ...DEFAULT_STORE,
      ...parsed,
      byBooklet: parsed.byBooklet ?? {},
      sessionEarnedByBooklet: parsed.sessionEarnedByBooklet ?? {},
      totalEarned:
        typeof parsed.totalEarned === "number" ? parsed.totalEarned : 0,
    };
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveShellsStore(store: GoldenShellsStore) {
  localStorage.setItem(LS_KEY, JSON.stringify(store));
}
