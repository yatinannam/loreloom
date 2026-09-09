import { useSyncExternalStore } from "react";
import {
  subscribeRuns,
  getRunsSnapshot,
  getRunsServerSnapshot,
} from "./storage";
import type { SavedRun } from "@/game/types";

/** Reactive view of the on-device saved runs. */
export function useSavedRuns(): SavedRun[] {
  return useSyncExternalStore(
    subscribeRuns,
    getRunsSnapshot,
    getRunsServerSnapshot,
  );
}
