import type {
  CharacterStats,
  HiddenTraits,
  StatKey,
  HiddenAxisKey,
  ArchetypeProgress,
} from "./types";

export interface Archetype {
  id: string;
  title: string;
  /** signature line used on the final card */
  signature: string;
  /** weighted contribution of each stat / hidden axis (expected-high => positive) */
  weights: Partial<Record<StatKey | HiddenAxisKey, number>>;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "protector",
    title: "The Protector",
    signature: "Protective to a fault.",
    weights: { courage: 1, empathy: 1, selflessness: 1.2, loyalty: 0.8, ruthlessness: -0.8 },
  },
  {
    id: "strategist",
    title: "The Strategist",
    signature: "Always three moves ahead.",
    weights: { cunning: 1.2, discipline: 1, ambition: 0.8, chaos: -0.8 },
  },
  {
    id: "rebel",
    title: "The Rebel",
    signature: "Refuses the shape they were handed.",
    weights: { chaos: 1, courage: 1, integrity: 0.7, discipline: -0.9 },
  },
  {
    id: "idealist",
    title: "The Idealist",
    signature: "Believes the world can still be better.",
    weights: { empathy: 1.1, integrity: 1.1, trust: 0.8, cunning: -0.7 },
  },
  {
    id: "opportunist",
    title: "The Opportunist",
    signature: "Never wastes an opening.",
    weights: { cunning: 1, ambition: 1.1, integrity: -1, loyalty: -0.6 },
  },
  {
    id: "wanderer",
    title: "The Wanderer",
    signature: "Belongs to the road, not the destination.",
    weights: { curiosity: 1.2, chaos: 0.7, attachment: -1, ambition: -0.8 },
  },
  {
    id: "manipulator",
    title: "The Manipulator",
    signature: "Reads people like open ledgers.",
    weights: { cunning: 1.2, ambition: 0.9, betrayal: 1, empathy: -1 },
  },
  {
    id: "guardian",
    title: "The Guardian",
    signature: "Stands where the wall is thinnest.",
    weights: { discipline: 1, loyalty: 1.2, courage: 0.9, risk: -0.7 },
  },
  {
    id: "visionary",
    title: "The Visionary",
    signature: "Sees the version that doesn't exist yet.",
    weights: { curiosity: 1.1, ambition: 1, courage: 0.7, discipline: -0.6 },
  },
  {
    id: "survivor",
    title: "The Survivor",
    signature: "Still here. That was the plan.",
    weights: { cunning: 1, discipline: 0.8, risk: -1, trust: -0.7 },
  },
  {
    id: "diplomat",
    title: "The Diplomat",
    signature: "Finds the sentence everyone can sign.",
    weights: { empathy: 1, cunning: 0.8, trust: 0.9, courage: -0.5 },
  },
  {
    id: "trickster",
    title: "The Trickster",
    signature: "The rules are a suggestion, and a punchline.",
    weights: { chaos: 1.1, cunning: 1, curiosity: 0.8, discipline: -0.8 },
  },
  {
    id: "ruler",
    title: "The Ruler",
    signature: "Carries the room whether it wants carrying.",
    weights: { ambition: 1.2, discipline: 1, courage: 0.7, empathy: -0.7 },
  },
  {
    id: "scholar",
    title: "The Scholar",
    signature: "Would rather understand it than win it.",
    weights: { curiosity: 1.2, discipline: 1, courage: -0.6, chaos: -0.7 },
  },
  {
    id: "outsider",
    title: "The Outsider",
    signature: "Watches the fire from just past its light.",
    weights: { curiosity: 0.9, empathy: 0.7, trust: -1, attachment: -0.9 },
  },
  {
    id: "martyr",
    title: "The Martyr",
    signature: "Would pay any price but the one that spares them.",
    weights: { selflessness: 1.2, sacrifice: 1.3, empathy: 0.8, ambition: -1 },
  },
  {
    id: "catalyst",
    title: "The Catalyst",
    signature: "Leaves every room changed.",
    weights: { chaos: 1.1, curiosity: 1, courage: 0.8, discipline: -0.8 },
  },
  {
    id: "renegade",
    title: "The Renegade",
    signature: "Loyal to a cause, not a crown.",
    weights: { ruthlessness: 1, courage: 1, integrity: -0.7, loyalty: -0.8 },
  },
];

export const ARCHETYPE_BY_ID: Record<string, Archetype> = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a]),
);

export function emptyArchetypeProgress(): ArchetypeProgress {
  return { scores: Object.fromEntries(ARCHETYPES.map((a) => [a.id, 0])) };
}

function stateScore(
  arch: Archetype,
  stats: CharacterStats,
  hidden: HiddenTraits,
): number {
  let score = 0;
  for (const [key, weight] of Object.entries(arch.weights)) {
    const raw =
      (stats as Record<string, number | undefined>)[key] ??
      (hidden as Record<string, number | undefined>)[key];
    if (raw === undefined) continue;
    score += (weight ?? 0) * ((raw - 50) / 50);
  }
  return score;
}

/** archetype implied purely by a stat/hidden snapshot (used for the "expected self") */
export function archetypeFromSnapshot(
  stats: CharacterStats,
  hidden: HiddenTraits,
): string {
  let best = ARCHETYPES[0];
  let bestScore = -Infinity;
  for (const arch of ARCHETYPES) {
    const s = stateScore(arch, stats, hidden);
    if (s > bestScore) {
      bestScore = s;
      best = arch;
    }
  }
  return best.id;
}

/** final archetype: blends the evolving choice-driven progress with end state */
export function calculateArchetype(
  stats: CharacterStats,
  hidden: HiddenTraits,
  progress: ArchetypeProgress,
): Archetype {
  let best = ARCHETYPES[0];
  let bestScore = -Infinity;
  for (const arch of ARCHETYPES) {
    const combined =
      stateScore(arch, stats, hidden) + (progress.scores[arch.id] ?? 0) * 0.6;
    if (combined > bestScore) {
      bestScore = combined;
      best = arch;
    }
  }
  return best;
}

export function archetypeNoun(id: string): string {
  return (ARCHETYPE_BY_ID[id]?.title ?? "The Wanderer")
    .replace(/^The\s+/, "")
    .toLowerCase();
}
