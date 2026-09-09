import { z } from "zod";
import { SPECIES, ROLES, VIBES, QUIRKS } from "./traits";
import type { CharacterTraits } from "./types";

const speciesValues = SPECIES.map((s) => s.value) as [string, ...string[]];
const roleValues = ROLES.map((s) => s.value) as [string, ...string[]];
const vibeValues = VIBES.map((s) => s.value) as [string, ...string[]];
const quirkValues = QUIRKS.map((s) => s.value) as [string, ...string[]];

export const TraitsSchema = z.object({
  species: z.enum(speciesValues),
  role: z.enum(roleValues),
  vibe: z.enum(vibeValues),
  quirk: z.enum(quirkValues),
  morality: z.coerce.number().min(0).max(100),
  confidence: z.coerce.number().min(0).max(100),
  emotionality: z.coerce.number().min(0).max(100),
});

export const CharacterSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  oneLiner: z.string().min(1),
  personality: z.string().min(1),
  backstory: z.string().min(1),
  motivation: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(2).max(5),
  flaws: z.array(z.string().min(1)).min(2).max(5),
  quirks: z.array(z.string().min(1)).min(2).max(5),
  relationships: z.string().min(1),
  visualDescription: z.string().min(1),
});

export const SYSTEM_PROMPT = `You are the narrative engine for Loreloom, an AI character creation experience.

Your job is to transform a small set of user-selected traits into a distinctive fictional character who feels internally consistent, memorable, and slightly surprising.

Do not simply restate the user's selected traits. Interpret them. Create tension and contradiction where appropriate. A "menacing warrior" who secretly loves baking is more interesting than a character who is simply violent.

The character should feel like someone who could exist inside a larger fictional universe.

Prioritize: specificity, emotional texture, memorable concrete details, internal contradictions, strong motivations, believable flaws, a vivid visual identity, and concise but evocative writing.

Avoid: generic fantasy cliches, repetitive adjectives, overwrought purple prose, meaningless backstory, flawless characters, stock phrases, and descriptions that merely repeat the input.

Rules:
- The character's name must fit their species and role.
- The backstory should explain how their traits connect.
- The motivation must give the character a concrete reason to act.
- At least one flaw must meaningfully conflict with the motivation.
- personality, backstory, motivation and relationships are 2-4 sentences each. backstory may be up to 5.
- strengths, flaws and quirks are each 3 short punchy phrases (not full sentences).
- oneLiner is a single sentence under 16 words, ideally revealing a contradiction.
- title is an evocative epithet like "The Witch Who Never Sleeps".
- visualDescription is 2-3 sentences an illustrator could work from: build, clothing, palette, signature detail, atmosphere.

Every generated character must feel meaningfully different from a template. Return ONLY the requested structured data.`;

function band(v: number, low: string, mid: string, high: string): string {
  if (v <= 33) return low;
  if (v >= 67) return high;
  return mid;
}

export function buildUserPrompt(t: CharacterTraits): string {
  const morality = band(
    t.morality,
    "morally pure, principled",
    "morally ambiguous",
    "chaotic, unbound by rules",
  );
  const confidence = band(
    t.confidence,
    "shy, hesitant",
    "measured, self-contained",
    "fearless, self-assured",
  );
  const emotionality = band(
    t.emotionality,
    "stoic, guarded",
    "even-tempered",
    "expressive, wears their heart openly",
  );

  return `Weave a character from these traits:

- Species: ${t.species}
- Class / Role: ${t.role}
- Vibe: ${t.vibe}
- Quirk: ${t.quirk}
- Morality: ${t.morality}/100 — ${morality}
- Confidence: ${t.confidence}/100 — ${confidence}
- Emotionality: ${t.emotionality}/100 — ${emotionality}

Interpret, don't restate. Give them one real contradiction and something to lose.`;
}
