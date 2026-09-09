import type { CharacterTraits } from "@/lib/types";
import type {
  CharacterStats,
  HiddenTraits,
  StatEffect,
  HiddenEffect,
  StatKey,
  HiddenAxisKey,
} from "./types";
import { STAT_KEYS, HIDDEN_KEYS } from "./types";
import {
  SPECIES_STATS,
  SPECIES_HIDDEN,
  ROLE_STATS,
  ROLE_HIDDEN,
  VIBE_STATS,
  VIBE_HIDDEN,
  QUIRK_STATS,
  QUIRK_HIDDEN,
  MORALITY_INFLUENCE,
  CONFIDENCE_INFLUENCE,
  EMOTIONALITY_INFLUENCE,
  STAT_BASELINE,
  HIDDEN_BASELINE,
  type StatMod,
  type HiddenMod,
  type SliderInfluence,
} from "./rules";

export function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function applyStatMod(stats: CharacterStats, mod: StatMod | undefined): void {
  if (!mod) return;
  for (const k of Object.keys(mod) as StatKey[]) {
    stats[k] += mod[k] ?? 0;
  }
}

function applyHiddenMod(hidden: HiddenTraits, mod: HiddenMod | undefined): void {
  if (!mod) return;
  for (const k of Object.keys(mod) as HiddenAxisKey[]) {
    hidden[k] += mod[k] ?? 0;
  }
}

function applySliders(
  stats: CharacterStats,
  hidden: HiddenTraits,
  value: number,
  influences: SliderInfluence[],
): void {
  const delta = value - 50;
  for (const inf of influences) {
    if (inf.stat) stats[inf.stat] += delta * inf.factor;
    if (inf.hidden) hidden[inf.hidden] += delta * inf.factor;
  }
}

export function initStats(traits: CharacterTraits): CharacterStats {
  const stats = Object.fromEntries(
    STAT_KEYS.map((k) => [k, STAT_BASELINE]),
  ) as CharacterStats;

  applyStatMod(stats, SPECIES_STATS[traits.species]);
  applyStatMod(stats, ROLE_STATS[traits.role]);
  applyStatMod(stats, VIBE_STATS[traits.vibe]);
  applyStatMod(stats, QUIRK_STATS[traits.quirk]);

  const hiddenScratch = initHidden(traits); // sliders touch both; use a scratch we discard
  applySliders(stats, hiddenScratch, traits.morality, MORALITY_INFLUENCE);
  applySliders(stats, hiddenScratch, traits.confidence, CONFIDENCE_INFLUENCE);
  applySliders(stats, hiddenScratch, traits.emotionality, EMOTIONALITY_INFLUENCE);

  for (const k of STAT_KEYS) stats[k] = clamp(stats[k]);
  return stats;
}

export function initHidden(traits: CharacterTraits): HiddenTraits {
  const hidden = Object.fromEntries(
    HIDDEN_KEYS.map((k) => [k, HIDDEN_BASELINE]),
  ) as HiddenTraits;

  applyHiddenMod(hidden, SPECIES_HIDDEN[traits.species]);
  applyHiddenMod(hidden, ROLE_HIDDEN[traits.role]);
  applyHiddenMod(hidden, VIBE_HIDDEN[traits.vibe]);
  applyHiddenMod(hidden, QUIRK_HIDDEN[traits.quirk]);

  const statScratch = Object.fromEntries(
    STAT_KEYS.map((k) => [k, STAT_BASELINE]),
  ) as CharacterStats;
  applySliders(statScratch, hidden, traits.morality, MORALITY_INFLUENCE);
  applySliders(statScratch, hidden, traits.confidence, CONFIDENCE_INFLUENCE);
  applySliders(statScratch, hidden, traits.emotionality, EMOTIONALITY_INFLUENCE);

  for (const k of HIDDEN_KEYS) hidden[k] = clamp(hidden[k]);
  return hidden;
}

export function applyStatEffects(
  stats: CharacterStats,
  effects: StatEffect[] | undefined,
): CharacterStats {
  const next = { ...stats };
  for (const e of effects ?? []) next[e.stat] = clamp(next[e.stat] + e.delta);
  return next;
}

export function applyHiddenEffects(
  hidden: HiddenTraits,
  effects: HiddenEffect[] | undefined,
): HiddenTraits {
  const next = { ...hidden };
  for (const e of effects ?? []) next[e.axis] = clamp(next[e.axis] + e.delta);
  return next;
}

export function topStats(
  stats: CharacterStats,
  n: number,
): { key: StatKey; value: number }[] {
  return STAT_KEYS.map((key) => ({ key, value: stats[key] }))
    .sort((a, b) => b.value - a.value || a.key.localeCompare(b.key))
    .slice(0, n);
}

export function topHidden(hidden: HiddenTraits): HiddenAxisKey {
  return HIDDEN_KEYS.map((key) => ({ key, value: hidden[key] })).sort(
    (a, b) => b.value - a.value || a.key.localeCompare(b.key),
  )[0].key;
}
