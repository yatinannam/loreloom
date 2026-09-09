import type {
  CharacterGameState,
  FinalCharacterCard,
  Rarity,
  HiddenAxisKey,
} from "./types";
import { STAT_KEYS, HIDDEN_KEYS, STAT_LABELS } from "./types";
import { topStats, topHidden } from "./stats";
import {
  ARCHETYPE_BY_ID,
  archetypeNoun,
  calculateArchetype,
} from "./archetypes";
import { characterName } from "./names";
import { mulberry32, seededPick, subSeed } from "./random";

const HIDDEN_SIGNATURE: Record<HiddenAxisKey, string> = {
  loyalty: "Loyal past the point of sense.",
  selflessness: "Puts themselves last, every time.",
  ruthlessness: "Does the necessary thing without flinching.",
  integrity: "Cannot be bought, and it has cost them.",
  attachment: "Holds on to what everyone else lets go of.",
  risk: "Never met a ledge they didn't lean over.",
  sacrifice: "Measures their worth by what they'll give up.",
  betrayal: "Always keeps one exit no one else can see.",
};

const DRIFT_MODIFIERS = ["Reluctant", "Unlikely", "Accidental", "Quiet", "Unwilling"];
const TRUE_MODIFIERS = ["True", "Born", "Relentless", "Unrepentant"];

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function paletteFor(alignment: string): FinalCharacterCard["palette"] {
  if (alignment.includes("Principled"))
    return { from: "#1a1608", to: "#2a2210", accent: "#e8b64c" };
  if (alignment.includes("Pragmatic"))
    return { from: "#0e1116", to: "#1b2230", accent: "#5fd3c4" };
  if (alignment.includes("Unbound"))
    return { from: "#1c0f0c", to: "#301813", accent: "#ff7a4d" };
  return { from: "#141225", to: "#241d3d", accent: "#9a7bff" };
}

function localLegacy(state: CharacterGameState, name: string): string {
  const { flags } = state.story;
  const ending = state.ending;
  const parts: string[] = [];

  if (flags.helped_stranger || flags.escorted_corin)
    parts.push("You stopped for a bleeding stranger when stopping was the expensive choice.");
  else if (flags.exploited_stranger)
    parts.push("You turned someone else's worst night into your cover, and never fully put that down.");
  else if (flags.left_stranger)
    parts.push("You walked past the first test, and the city found you anyway.");

  if (flags.defended_ally || flags.traded_leverage_for_ally)
    parts.push("When Della was in a cell, you spent what you had to get her out.");
  else if (flags.abandoned_ally)
    parts.push("When Della was in a cell, you chose the river and a new room.");

  if (flags.saved_crew) parts.push("You went into the granary fire for people you'd never met.");
  else if (flags.saved_grain) parts.push("You saved the winter stores and counted the cost in sacks, not names.");
  else if (flags.saved_evidence) parts.push("You came out of the fire holding proof and not much else.");
  else if (flags.saved_self) parts.push("You did the math on the fire and stepped back while others ran in.");

  const closer =
    flags.took_blame
      ? "At the reckoning you put yourself at the centre of it."
      : flags.named_another
        ? "At the reckoning you handed them someone else's name."
        : flags.burned_it_all
          ? "At the reckoning you read every name aloud."
          : "At the reckoning you were already on the west road.";
  parts.push(closer);

  const phrase = ending ? ` ${name}, when it was written down, was remembered like this: "${ending.phrase}"` : "";
  return parts.join(" ") + phrase;
}

function calcRarity(state: CharacterGameState): Rarity {
  const { stats, hidden } = state;
  const expected = state.expectedArchetypeId;
  const finalArch = calculateArchetype(stats, hidden, state.archetype).id;
  const moved = expected !== finalArch;
  const peakStat = Math.max(...STAT_KEYS.map((k) => stats[k]));
  const peakHidden = Math.max(...HIDDEN_KEYS.map((k) => hidden[k]));
  const spread = peakStat - Math.min(...STAT_KEYS.map((k) => stats[k]));
  const dramaticEnding = ["martyr", "redeemer", "catalyst", "tyrant", "shadow", "visionary"];
  const endingId = state.ending?.id ?? "reckoner";

  if (
    moved &&
    peakHidden >= 78 &&
    (hidden.sacrifice >= 72 || hidden.betrayal >= 72) &&
    peakStat >= 82
  )
    return "Legendary";
  if (moved && dramaticEnding.includes(endingId)) return "Epic";
  if (peakHidden >= 70 || spread <= 20) return "Rare";
  if (peakStat >= 74) return "Uncommon";
  return "Common";
}

export interface BuildCardOptions {
  legacy?: string;
  epilogue?: string;
  source?: "local" | "claude";
}

export function buildFinalCard(
  state: CharacterGameState,
  opts: BuildCardOptions = {},
): FinalCharacterCard {
  const ending =
    state.ending ??
    ({
      id: "reckoner",
      title: "The Reckoner",
      alignment: "Balanced · Unblinking",
      becameLine: "You became the person who did the arithmetic out loud.",
      strength: "Sees the trade clearly and names it.",
      flaw: "Clarity is not the same as comfort.",
      phrase: "There was no clean answer. I gave them the true one.",
    } as CharacterGameState["ending"])!;

  const arch = calculateArchetype(state.stats, state.hidden, state.archetype);
  const expected = ARCHETYPE_BY_ID[state.expectedArchetypeId] ?? arch;
  const moved = expected.id !== arch.id;

  const rng = mulberry32(subSeed(state.seed, 0x7f11));
  const modifier = moved
    ? seededPick(rng, DRIFT_MODIFIERS)
    : seededPick(rng, TRUE_MODIFIERS);
  const baseNoun = arch.title.replace(/^The\s+/, "");
  const archetypeTitle = `The ${modifier} ${baseNoun}`;

  const expectedNoun = archetypeNoun(expected.id);
  const openingLine = moved
    ? `You began as ${article(expectedNoun)} ${expectedNoun}.`
    : `You were always ${article(expectedNoun)} ${expectedNoun}.`;

  const name = characterName(state.seed, state.initialTraits.species);

  return {
    name,
    archetypeId: arch.id,
    archetypeTitle,
    openingLine,
    becameLine: ending.becameLine,
    coreStats: topStats(state.stats, 3).map((s) => ({
      key: s.key,
      label: STAT_LABELS[s.key],
      value: s.value,
    })),
    signature: HIDDEN_SIGNATURE[topHidden(state.hidden)],
    strength: ending.strength,
    flaw: ending.flaw,
    legacy: opts.legacy ?? localLegacy(state, name),
    epilogue: opts.epilogue,
    endingId: ending.id,
    endingTitle: ending.title,
    alignment: ending.alignment,
    rarity: calcRarity(state),
    source: opts.source ?? "local",
    palette: paletteFor(ending.alignment),
  };
}

/** Re-derive the card with Claude-provided prose layered on top of local logic. */
export function withEnhancement(
  state: CharacterGameState,
  enhancement: { legacy: string; epilogue?: string },
): FinalCharacterCard {
  return buildFinalCard(state, {
    legacy: enhancement.legacy,
    epilogue: enhancement.epilogue,
    source: "claude",
  });
}
