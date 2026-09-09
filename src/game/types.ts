import type { CharacterTraits } from "@/lib/types";

/* ----------------------------- stats ----------------------------- */

export type StatKey =
  | "courage"
  | "cunning"
  | "empathy"
  | "ambition"
  | "discipline"
  | "chaos"
  | "curiosity"
  | "trust";

export const STAT_KEYS: StatKey[] = [
  "courage",
  "cunning",
  "empathy",
  "ambition",
  "discipline",
  "chaos",
  "curiosity",
  "trust",
];

export const STAT_LABELS: Record<StatKey, string> = {
  courage: "Courage",
  cunning: "Cunning",
  empathy: "Empathy",
  ambition: "Ambition",
  discipline: "Discipline",
  chaos: "Chaos",
  curiosity: "Curiosity",
  trust: "Trust",
};

export type CharacterStats = Record<StatKey, number>;

/* ------------------------ hidden personality --------------------- */

export type HiddenAxisKey =
  | "loyalty"
  | "selflessness"
  | "ruthlessness"
  | "integrity"
  | "attachment"
  | "risk"
  | "sacrifice"
  | "betrayal";

export const HIDDEN_KEYS: HiddenAxisKey[] = [
  "loyalty",
  "selflessness",
  "ruthlessness",
  "integrity",
  "attachment",
  "risk",
  "sacrifice",
  "betrayal",
];

export type HiddenTraits = Record<HiddenAxisKey, number>;

/* --------------------------- scenes ----------------------------- */

export interface StatEffect {
  stat: StatKey;
  delta: number;
}

export interface HiddenEffect {
  axis: HiddenAxisKey;
  delta: number;
}

export interface ArchetypeHint {
  id: string;
  weight: number;
}

export type RequirementScope = "stat" | "hidden" | "flag";
export type RequirementOp = "gte" | "lte";

export interface Requirement {
  scope: RequirementScope;
  key: string;
  op?: RequirementOp;
  value: number | boolean;
}

export interface StoryChoice {
  id: string;
  label: string;
  description?: string;
  effects?: StatEffect[];
  hiddenEffects?: HiddenEffect[];
  archetypeHints?: ArchetypeHint[];
  /** flags set when this choice is taken */
  flags?: string[];
  /** the choice is only offered when every requirement passes */
  requirements?: Requirement[];
  nextScene: string;
  /** shown immediately after the choice, before the next scene */
  outcomeText: string;
  /** short human-readable consequence lines, e.g. "Courage rose" */
  consequenceHints?: string[];
}

export interface StoryScene {
  id: string;
  chapter: number;
  title: string;
  setup: string;
  atmosphere?: string;
  choices: StoryChoice[];
  /** the reckoning: taking a choice here finishes the run */
  terminal?: boolean;
}

/* -------------------------- game state -------------------------- */

export interface DecisionRecord {
  sceneId: string;
  sceneTitle: string;
  choiceId: string;
  choiceLabel: string;
  chapter: number;
  timestamp: number;
}

export interface StoryProgress {
  currentSceneId: string;
  chapter: number;
  visited: string[];
  flags: Record<string, boolean>;
  finished: boolean;
}

export interface ArchetypeProgress {
  /** running per-archetype score accumulated from choices; never shown mid-game */
  scores: Record<string, number>;
}

export interface Ending {
  id: string;
  title: string;
  alignment: string;
  summary: string;
  becameLine: string;
  narrative: string;
  strength: string;
  flaw: string;
  phrase: string;
}

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface FinalCardStat {
  key: StatKey;
  label: string;
  value: number;
}

export interface FinalCharacterCard {
  name: string;
  archetypeId: string;
  archetypeTitle: string;
  openingLine: string;
  becameLine: string;
  coreStats: FinalCardStat[];
  signature: string;
  strength: string;
  flaw: string;
  legacy: string;
  epilogue?: string;
  endingId: string;
  endingTitle: string;
  alignment: string;
  rarity: Rarity;
  source: "local" | "claude";
  palette: { from: string; to: string; accent: string };
}

export interface CharacterGameState {
  id: string;
  seed: number;
  createdAt: number;
  initialTraits: CharacterTraits;
  /** archetype implied by creation choices alone — the "expected" self */
  expectedArchetypeId: string;
  stats: CharacterStats;
  hidden: HiddenTraits;
  archetype: ArchetypeProgress;
  story: StoryProgress;
  decisions: DecisionRecord[];
  ending?: Ending;
  finalCard?: FinalCharacterCard;
}

export interface SavedRun {
  id: string;
  createdAt: number;
  state: CharacterGameState;
}

/* ------------------------- engine output ----------------------- */

export interface ChoiceOutcome {
  outcomeText: string;
  consequenceHints: string[];
  finished: boolean;
}
