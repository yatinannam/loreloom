import { useSyncExternalStore } from "react";
import {
  subscribeSaved,
  getSavedSnapshot,
  getSavedServerSnapshot,
} from "./storage";
import type { SavedCharacter } from "./types";

/** Reactive view of the on-device saved characters. */
export function useSavedCharacters(): SavedCharacter[] {
  return useSyncExternalStore(
    subscribeSaved,
    getSavedSnapshot,
    getSavedServerSnapshot,
  );
}
