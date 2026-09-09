import type { Species, Role, Vibe, Quirk } from "./types";

export interface TraitMeta<T extends string> {
  value: T;
  /** single evocative glyph used in the option chip */
  glyph: string;
  /** one-word flavour shown under the label */
  hint: string;
}

export const SPECIES: TraitMeta<Species>[] = [
  { value: "Human", glyph: "◇", hint: "Adaptable" },
  { value: "Elf", glyph: "❦", hint: "Ancient" },
  { value: "Android", glyph: "◈", hint: "Precise" },
  { value: "Witch", glyph: "✷", hint: "Arcane" },
  { value: "Vampire", glyph: "☾", hint: "Eternal" },
  { value: "Dragonborn", glyph: "▲", hint: "Proud" },
  { value: "Fae", glyph: "✦", hint: "Tricksy" },
  { value: "Alien", glyph: "⬡", hint: "Other" },
  { value: "Cyborg", glyph: "⛓", hint: "Rebuilt" },
  { value: "Demon", glyph: "✚", hint: "Bargaining" },
  { value: "Ghost", glyph: "❂", hint: "Lingering" },
  { value: "Shapeshifter", glyph: "◐", hint: "Uncertain" },
];

export const ROLES: TraitMeta<Role>[] = [
  { value: "Warrior", glyph: "⚔", hint: "Frontline" },
  { value: "Rogue", glyph: "⚵", hint: "Shadows" },
  { value: "Mage", glyph: "✶", hint: "Study" },
  { value: "Inventor", glyph: "⚙", hint: "Tinker" },
  { value: "Healer", glyph: "✤", hint: "Mercy" },
  { value: "Detective", glyph: "☌", hint: "Patterns" },
  { value: "Explorer", glyph: "✧", hint: "Horizon" },
  { value: "Assassin", glyph: "†", hint: "Quiet" },
  { value: "Royal", glyph: "♛", hint: "Burden" },
  { value: "Mercenary", glyph: "⛨", hint: "Coin" },
  { value: "Scholar", glyph: "❧", hint: "Ink" },
  { value: "Outlaw", glyph: "⚑", hint: "Wanted" },
];

export const VIBES: TraitMeta<Vibe>[] = [
  { value: "Mysterious", glyph: "◔", hint: "Veiled" },
  { value: "Chaotic", glyph: "✺", hint: "Wild" },
  { value: "Elegant", glyph: "❈", hint: "Poised" },
  { value: "Wholesome", glyph: "♡", hint: "Warm" },
  { value: "Menacing", glyph: "◤", hint: "Edged" },
  { value: "Melancholic", glyph: "☾", hint: "Wistful" },
  { value: "Charismatic", glyph: "✸", hint: "Magnetic" },
  { value: "Stoic", glyph: "▮", hint: "Still" },
  { value: "Playful", glyph: "✲", hint: "Bright" },
  { value: "Rebellious", glyph: "⚡", hint: "Defiant" },
  { value: "Dreamy", glyph: "☁", hint: "Drifting" },
  { value: "Intimidating", glyph: "⏥", hint: "Looming" },
];

export const QUIRKS: TraitMeta<Quirk>[] = [
  { value: "Collects strange objects", glyph: "❖", hint: "Hoards" },
  { value: "Talks to animals", glyph: "❥", hint: "Confides" },
  { value: "Secretly loves baking", glyph: "✿", hint: "Hidden" },
  { value: "Cannot lie", glyph: "⊘", hint: "Cursed" },
  { value: "Writes poetry", glyph: "✒", hint: "Secret" },
  { value: "Afraid of the dark", glyph: "☽", hint: "Small fear" },
  { value: "Always overdressed", glyph: "❁", hint: "Armoured" },
  { value: "Hums when nervous", glyph: "♪", hint: "Tell" },
  { value: "Keeps a mysterious diary", glyph: "▤", hint: "Locked" },
  { value: "Names every weapon", glyph: "❦", hint: "Sentimental" },
  { value: "Talks to their reflection", glyph: "◑", hint: "Doubles" },
  { value: "Has terrible luck", glyph: "✦", hint: "Doomed" },
];

export interface SliderMeta {
  key: "morality" | "confidence" | "emotionality";
  label: string;
  left: string;
  right: string;
}

export const SLIDERS: SliderMeta[] = [
  { key: "morality", label: "Morality", left: "Pure", right: "Chaotic" },
  { key: "confidence", label: "Confidence", left: "Shy", right: "Fearless" },
  { key: "emotionality", label: "Emotionality", left: "Stoic", right: "Expressive" },
];
