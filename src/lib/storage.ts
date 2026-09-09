import type { CharacterGameState, SavedRun } from "@/game/types";

const KEY = "loreloom.runs.v1";

function safeParse(raw: string | null): SavedRun[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return (data as SavedRun[]).filter(
      (r) => r && r.state && r.state.finalCard && r.state.ending,
    );
  } catch {
    return [];
  }
}

export function loadRuns(): SavedRun[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function persist(list: SavedRun[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable / full — fail quietly */
  }
  emit();
}

export function saveRun(state: CharacterGameState): SavedRun {
  const entry: SavedRun = {
    id: state.id,
    createdAt: Date.now(),
    state,
  };
  const list = [entry, ...loadRuns().filter((r) => r.id !== state.id)];
  persist(list);
  return entry;
}

export function deleteRun(id: string): SavedRun[] {
  const list = loadRuns().filter((r) => r.id !== id);
  persist(list);
  return list;
}

export function isRunSaved(id: string): boolean {
  return loadRuns().some((r) => r.id === id);
}

/* ---- reactive subscription (for useSyncExternalStore) ---- */

const listeners = new Set<() => void>();
let cache: SavedRun[] | null = null;

function emit() {
  cache = null;
  listeners.forEach((l) => l());
}

export function subscribeRuns(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined")
      window.removeEventListener("storage", listener);
  };
}

export function getRunsSnapshot(): SavedRun[] {
  if (cache === null) cache = loadRuns();
  return cache;
}

const EMPTY: SavedRun[] = [];
export function getRunsServerSnapshot(): SavedRun[] {
  return EMPTY;
}
