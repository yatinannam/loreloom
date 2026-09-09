import type { LucideIcon } from "lucide-react";
import {
  User,
  Leaf,
  Bot,
  Wand2,
  Moon,
  Flame,
  Sparkles,
  Orbit,
  Cpu,
  Skull,
  Ghost,
  Shuffle,
  Swords,
  VenetianMask,
  Wand,
  Cog,
  HeartPulse,
  Search,
  Compass,
  Crosshair,
  Crown,
  Coins,
  BookOpen,
  Flag,
  EyeOff,
  Zap,
  Gem,
  Heart,
  Triangle,
  CloudMoon,
  Star,
  Square,
  PartyPopper,
  Cloud,
  Mountain,
  Boxes,
  Bird,
  Croissant,
  ScrollText,
  Feather,
  Lamp,
  Shirt,
  Music,
  NotebookPen,
  Sword,
  Copy,
  Dice5,
} from "lucide-react";
import type { Species, Role, Vibe, Quirk } from "./types";

export interface TraitMeta<T extends string> {
  value: T;
  icon: LucideIcon;
  /** one-word flavour shown under the label */
  hint: string;
}

export const SPECIES: TraitMeta<Species>[] = [
  { value: "Human", icon: User, hint: "Adaptable" },
  { value: "Elf", icon: Leaf, hint: "Ancient" },
  { value: "Android", icon: Bot, hint: "Precise" },
  { value: "Witch", icon: Wand2, hint: "Arcane" },
  { value: "Vampire", icon: Moon, hint: "Eternal" },
  { value: "Dragonborn", icon: Flame, hint: "Proud" },
  { value: "Fae", icon: Sparkles, hint: "Tricksy" },
  { value: "Alien", icon: Orbit, hint: "Other" },
  { value: "Cyborg", icon: Cpu, hint: "Rebuilt" },
  { value: "Demon", icon: Skull, hint: "Bargaining" },
  { value: "Ghost", icon: Ghost, hint: "Lingering" },
  { value: "Shapeshifter", icon: Shuffle, hint: "Uncertain" },
];

export const ROLES: TraitMeta<Role>[] = [
  { value: "Warrior", icon: Swords, hint: "Frontline" },
  { value: "Rogue", icon: VenetianMask, hint: "Shadows" },
  { value: "Mage", icon: Wand, hint: "Study" },
  { value: "Inventor", icon: Cog, hint: "Tinker" },
  { value: "Healer", icon: HeartPulse, hint: "Mercy" },
  { value: "Detective", icon: Search, hint: "Patterns" },
  { value: "Explorer", icon: Compass, hint: "Horizon" },
  { value: "Assassin", icon: Crosshair, hint: "Quiet" },
  { value: "Royal", icon: Crown, hint: "Burden" },
  { value: "Mercenary", icon: Coins, hint: "Coin" },
  { value: "Scholar", icon: BookOpen, hint: "Ink" },
  { value: "Outlaw", icon: Flag, hint: "Wanted" },
];

export const VIBES: TraitMeta<Vibe>[] = [
  { value: "Mysterious", icon: EyeOff, hint: "Veiled" },
  { value: "Chaotic", icon: Zap, hint: "Wild" },
  { value: "Elegant", icon: Gem, hint: "Poised" },
  { value: "Wholesome", icon: Heart, hint: "Warm" },
  { value: "Menacing", icon: Triangle, hint: "Edged" },
  { value: "Melancholic", icon: CloudMoon, hint: "Wistful" },
  { value: "Charismatic", icon: Star, hint: "Magnetic" },
  { value: "Stoic", icon: Square, hint: "Still" },
  { value: "Playful", icon: PartyPopper, hint: "Bright" },
  { value: "Rebellious", icon: Flame, hint: "Defiant" },
  { value: "Dreamy", icon: Cloud, hint: "Drifting" },
  { value: "Intimidating", icon: Mountain, hint: "Looming" },
];

export const QUIRKS: TraitMeta<Quirk>[] = [
  { value: "Collects strange objects", icon: Boxes, hint: "Hoards" },
  { value: "Talks to animals", icon: Bird, hint: "Confides" },
  { value: "Secretly loves baking", icon: Croissant, hint: "Hidden" },
  { value: "Cannot lie", icon: ScrollText, hint: "Cursed" },
  { value: "Writes poetry", icon: Feather, hint: "Secret" },
  { value: "Afraid of the dark", icon: Lamp, hint: "Small fear" },
  { value: "Always overdressed", icon: Shirt, hint: "Armoured" },
  { value: "Hums when nervous", icon: Music, hint: "Tell" },
  { value: "Keeps a mysterious diary", icon: NotebookPen, hint: "Locked" },
  { value: "Names every weapon", icon: Sword, hint: "Sentimental" },
  { value: "Talks to their reflection", icon: Copy, hint: "Doubles" },
  { value: "Has terrible luck", icon: Dice5, hint: "Doomed" },
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

function toIconMap<T extends string>(list: TraitMeta<T>[]): Record<T, LucideIcon> {
  return Object.fromEntries(list.map((i) => [i.value, i.icon])) as Record<
    T,
    LucideIcon
  >;
}

/** value -> icon component lookups (module-scope, safe to index during render) */
export const SPECIES_ICON = toIconMap(SPECIES);
export const ROLE_ICON = toIconMap(ROLES);
export const VIBE_ICON = toIconMap(VIBES);
export const QUIRK_ICON = toIconMap(QUIRKS);
