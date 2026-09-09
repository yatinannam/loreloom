import type { SavedCharacter, CharacterTraits, GeneratedCharacter } from "./types";

const KEY = "loreloom.characters.v1";

function safeParse(raw: string | null): SavedCharacter[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as SavedCharacter[]) : [];
  } catch {
    return [];
  }
}

export function loadSaved(): SavedCharacter[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function persist(list: SavedCharacter[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable / full — fail quietly */
  }
  emit();
}

export function saveCharacter(
  traits: CharacterTraits,
  character: GeneratedCharacter,
): SavedCharacter {
  const entry: SavedCharacter = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
    traits,
    character,
  };
  const list = [entry, ...loadSaved()];
  persist(list);
  return entry;
}

export function deleteCharacter(id: string): SavedCharacter[] {
  const list = loadSaved().filter((c) => c.id !== id);
  persist(list);
  return list;
}

/* ---- reactive subscription (for useSyncExternalStore) ---- */

const listeners = new Set<() => void>();
let cache: SavedCharacter[] | null = null;

function emit() {
  cache = null;
  listeners.forEach((l) => l());
}

export function subscribeSaved(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined")
      window.removeEventListener("storage", listener);
  };
}

export function getSavedSnapshot(): SavedCharacter[] {
  if (cache === null) cache = loadSaved();
  return cache;
}

const EMPTY: SavedCharacter[] = [];
export function getSavedServerSnapshot(): SavedCharacter[] {
  return EMPTY;
}

export function isSaved(character: GeneratedCharacter): boolean {
  return loadSaved().some(
    (c) => c.character.name === character.name && c.character.oneLiner === character.oneLiner,
  );
}
