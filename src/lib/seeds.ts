import type { CharacterTraits } from "./types";
import type { SavedRun } from "@/game/types";
import { playPath } from "@/game/engine";

interface SeedDef {
  id: string;
  traits: CharacterTraits;
  seed: number;
  path: string[];
}

/** Deterministic example runs — played entirely in code, no API calls. */
const SEED_DEFS: SeedDef[] = [
  {
    id: "seed-veyra",
    seed: 811,
    traits: {
      species: "Vampire",
      role: "Inventor",
      vibe: "Elegant",
      quirk: "Secretly loves baking",
      morality: 70,
      confidence: 80,
      emotionality: 50,
    },
    path: ["help", "escort", "negotiate", "defend", "calm", "save_people", "take_blame"],
  },
  {
    id: "seed-marek",
    seed: 4021,
    traits: {
      species: "Human",
      role: "Detective",
      vibe: "Stoic",
      quirk: "Keeps a mysterious diary",
      morality: 40,
      confidence: 55,
      emotionality: 30,
    },
    path: ["question", "verify", "turn_on_her", "investigate", "frame", "save_evidence", "burn_it_all"],
  },
  {
    id: "seed-nought",
    seed: 1207,
    traits: {
      species: "Shapeshifter",
      role: "Rogue",
      vibe: "Chaotic",
      quirk: "Talks to their reflection",
      morality: 82,
      confidence: 68,
      emotionality: 45,
    },
    path: ["exploit", "sell", "accept", "abandon", "leave_alone", "save_self", "name_another"],
  },
];

export const SEED_RUNS: SavedRun[] = SEED_DEFS.map((d) => {
  const state = playPath(d.traits, d.seed, d.path);
  return { id: d.id, createdAt: 0, state: { ...state, id: d.id } };
});

export const SEED_RUN_BY_ID: Record<string, SavedRun> = Object.fromEntries(
  SEED_RUNS.map((r) => [r.id, r]),
);
