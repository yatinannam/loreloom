import type { Species, Role, Vibe, Quirk } from "@/lib/types";
import type { StatKey, HiddenAxisKey } from "./types";

export type StatMod = Partial<Record<StatKey, number>>;
export type HiddenMod = Partial<Record<HiddenAxisKey, number>>;

/**
 * Centralised trait ruleset. Every trait contributes curated stat and hidden-axis
 * modifiers so new traits can be slotted in without touching the engine.
 */

export const SPECIES_STATS: Record<Species, StatMod> = {
  Human: { curiosity: 4, trust: 4, empathy: 3, discipline: 2 },
  Elf: { discipline: 6, cunning: 4, curiosity: 3, chaos: -4 },
  Android: { discipline: 10, cunning: 5, empathy: -8, chaos: -6 },
  Witch: { cunning: 8, curiosity: 7, chaos: 3, trust: -4 },
  Vampire: { cunning: 9, ambition: 6, discipline: 4, trust: -8, empathy: -3 },
  Dragonborn: { courage: 10, ambition: 7, discipline: 3, empathy: -3 },
  Fae: { chaos: 9, curiosity: 7, cunning: 5, trust: -5, discipline: -4 },
  Alien: { curiosity: 10, cunning: 3, chaos: 2, empathy: -5 },
  Cyborg: { discipline: 8, courage: 5, ambition: 3, empathy: -6 },
  Demon: { ambition: 10, cunning: 8, courage: 4, empathy: -7, trust: -6 },
  Ghost: { curiosity: 5, empathy: 4, chaos: 2, courage: -4, ambition: -5 },
  Shapeshifter: { cunning: 8, curiosity: 5, chaos: 4, trust: -6, discipline: -3 },
};

export const SPECIES_HIDDEN: Record<Species, HiddenMod> = {
  Human: {},
  Elf: { integrity: 5, loyalty: 4 },
  Android: { integrity: 8, ruthlessness: 4, attachment: -8 },
  Witch: { risk: 4 },
  Vampire: { ruthlessness: 9, loyalty: -6, attachment: -3 },
  Dragonborn: { loyalty: 6, risk: 6 },
  Fae: { integrity: -6, risk: 6 },
  Alien: { attachment: -6 },
  Cyborg: { loyalty: 5, attachment: -4 },
  Demon: { ruthlessness: 15, integrity: -10, loyalty: -8, betrayal: 6 },
  Ghost: { attachment: 8, risk: -6 },
  Shapeshifter: { integrity: -5, betrayal: 5, loyalty: -3 },
};

export const ROLE_STATS: Record<Role, StatMod> = {
  Warrior: { courage: 10, discipline: 6, cunning: -2 },
  Rogue: { cunning: 9, chaos: 4, discipline: -2, trust: -3 },
  Mage: { curiosity: 9, discipline: 5, courage: -2 },
  Inventor: { curiosity: 10, cunning: 5, discipline: 3 },
  Healer: { empathy: 11, trust: 6, ambition: -3 },
  Detective: { cunning: 8, curiosity: 7, trust: -2 },
  Explorer: { curiosity: 9, courage: 7, chaos: 3, discipline: -2 },
  Assassin: { cunning: 9, discipline: 7, empathy: -8, trust: -4 },
  Royal: { ambition: 10, discipline: 5, empathy: -2, trust: -2 },
  Mercenary: { ambition: 7, courage: 6, trust: -5, empathy: -4 },
  Scholar: { curiosity: 10, discipline: 6, courage: -3 },
  Outlaw: { chaos: 9, courage: 5, discipline: -4, trust: -4 },
};

export const ROLE_HIDDEN: Record<Role, HiddenMod> = {
  Warrior: { loyalty: 8, sacrifice: 4 },
  Rogue: { integrity: -4, risk: 5 },
  Mage: { integrity: 3 },
  Inventor: { attachment: 4 },
  Healer: { selflessness: 12, integrity: 6, sacrifice: 5 },
  Detective: { integrity: 5, risk: -3 },
  Explorer: { risk: 8, attachment: -4 },
  Assassin: { ruthlessness: 12, loyalty: -4, betrayal: 4 },
  Royal: { loyalty: 5, ruthlessness: 5 },
  Mercenary: { loyalty: -12, ruthlessness: 8, betrayal: 6 },
  Scholar: { integrity: 4, risk: -4 },
  Outlaw: { integrity: -6, loyalty: -4, risk: 6 },
};

export const VIBE_STATS: Record<Vibe, StatMod> = {
  Mysterious: { cunning: 7, curiosity: 4, trust: -4 },
  Chaotic: { chaos: 11, curiosity: 4, discipline: -7 },
  Elegant: { discipline: 7, ambition: 4, chaos: -4 },
  Wholesome: { empathy: 9, trust: 7, chaos: -3 },
  Menacing: { courage: 5, ambition: 3, empathy: -6, trust: -4 },
  Melancholic: { empathy: 5, curiosity: 3, courage: -4, ambition: -3 },
  Charismatic: { ambition: 6, trust: 5, courage: 3 },
  Stoic: { discipline: 9, chaos: -5, empathy: -3 },
  Playful: { chaos: 7, curiosity: 5, trust: 2, discipline: -4 },
  Rebellious: { chaos: 8, courage: 6, discipline: -5, trust: -3 },
  Dreamy: { curiosity: 7, empathy: 4, courage: -2, discipline: -4 },
  Intimidating: { courage: 7, ambition: 5, empathy: -5, trust: -5 },
};

export const VIBE_HIDDEN: Record<Vibe, HiddenMod> = {
  Mysterious: {},
  Chaotic: { risk: 8, integrity: -3 },
  Elegant: { integrity: 3 },
  Wholesome: { selflessness: 8, loyalty: 5 },
  Menacing: { ruthlessness: 8, betrayal: 3 },
  Melancholic: { attachment: 7 },
  Charismatic: { loyalty: 3 },
  Stoic: { attachment: -5, risk: -3 },
  Playful: { risk: 4 },
  Rebellious: { integrity: 4, loyalty: -3, risk: 6 },
  Dreamy: { attachment: 5, risk: -3 },
  Intimidating: { ruthlessness: 7 },
};

export const QUIRK_STATS: Record<Quirk, StatMod> = {
  "Collects strange objects": { curiosity: 4, discipline: -1 },
  "Talks to animals": { empathy: 4, trust: 2 },
  "Secretly loves baking": { empathy: 3, discipline: 2, chaos: -1 },
  "Cannot lie": { trust: 3, cunning: -2 },
  "Writes poetry": { curiosity: 3, empathy: 3 },
  "Afraid of the dark": { courage: -4, curiosity: 2 },
  "Always overdressed": { ambition: 3, discipline: 2 },
  "Hums when nervous": { courage: -2, empathy: 1 },
  "Keeps a mysterious diary": { cunning: 3, curiosity: 3 },
  "Names every weapon": { courage: 3, discipline: 2 },
  "Talks to their reflection": { curiosity: 3, cunning: 2, trust: -2 },
  "Has terrible luck": { chaos: 4 },
};

export const QUIRK_HIDDEN: Record<Quirk, HiddenMod> = {
  "Collects strange objects": { attachment: 5 },
  "Talks to animals": { selflessness: 4, integrity: 2 },
  "Secretly loves baking": { attachment: 4, integrity: 3, selflessness: 2 },
  "Cannot lie": { integrity: 12 },
  "Writes poetry": { attachment: 4 },
  "Afraid of the dark": { risk: -6 },
  "Always overdressed": {},
  "Hums when nervous": { risk: -3, attachment: 2 },
  "Keeps a mysterious diary": { integrity: 3, attachment: 3 },
  "Names every weapon": { attachment: 6, ruthlessness: 2 },
  "Talks to their reflection": { attachment: 3 },
  "Has terrible luck": { risk: 4 },
};

/* -------- slider influence (0-100 each) -------- */

export interface SliderInfluence {
  stat: StatKey | null;
  hidden: HiddenAxisKey | null;
  /** multiplier applied to (value - 50) */
  factor: number;
}

/** morality: 0 = pure/principled, 100 = chaotic/unbound */
export const MORALITY_INFLUENCE: SliderInfluence[] = [
  { stat: "empathy", hidden: null, factor: -0.16 },
  { stat: "trust", hidden: null, factor: -0.12 },
  { stat: "discipline", hidden: null, factor: -0.08 },
  { stat: "chaos", hidden: null, factor: 0.18 },
  { stat: "cunning", hidden: null, factor: 0.06 },
  { stat: null, hidden: "integrity", factor: -0.2 },
  { stat: null, hidden: "ruthlessness", factor: 0.18 },
  { stat: null, hidden: "selflessness", factor: -0.14 },
];

/** confidence: 0 = shy, 100 = fearless */
export const CONFIDENCE_INFLUENCE: SliderInfluence[] = [
  { stat: "courage", hidden: null, factor: 0.24 },
  { stat: "ambition", hidden: null, factor: 0.12 },
  { stat: "cunning", hidden: null, factor: 0.04 },
  { stat: null, hidden: "risk", factor: 0.2 },
];

/** emotionality: 0 = stoic, 100 = expressive */
export const EMOTIONALITY_INFLUENCE: SliderInfluence[] = [
  { stat: "empathy", hidden: null, factor: 0.16 },
  { stat: "discipline", hidden: null, factor: -0.1 },
  { stat: "chaos", hidden: null, factor: 0.04 },
  { stat: null, hidden: "attachment", factor: 0.18 },
];

export const STAT_BASELINE = 46;
export const HIDDEN_BASELINE = 32;
