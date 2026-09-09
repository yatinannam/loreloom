import type { CharacterTraits, Species, Vibe, Role } from "./types";

export interface AvatarPalette {
  /** background gradient stops */
  bgFrom: string;
  bgTo: string;
  /** ambient glow / halo */
  glow: string;
  /** silhouette fill */
  figure: string;
  /** rim light on the silhouette */
  rim: string;
  /** garment / accent */
  accent: string;
}

const SPECIES_FIGURE: Record<Species, { figure: string; rim: string }> = {
  Human: { figure: "#3a3550", rim: "#e7c8a0" },
  Elf: { figure: "#2f4a44", rim: "#bff3d6" },
  Android: { figure: "#31404f", rim: "#9fdcff" },
  Witch: { figure: "#3a2b52", rim: "#d9b3ff" },
  Vampire: { figure: "#3a2230", rim: "#ff9fb5" },
  Dragonborn: { figure: "#4a2f28", rim: "#ffcf9a" },
  Fae: { figure: "#334a2f", rim: "#e6ffab" },
  Alien: { figure: "#26424a", rim: "#7ff5e4" },
  Cyborg: { figure: "#37383f", rim: "#c9d2e0" },
  Demon: { figure: "#45202a", rim: "#ff8a6b" },
  Ghost: { figure: "#33414d", rim: "#bfeaff" },
  Shapeshifter: { figure: "#3d3348", rim: "#e9c7f2" },
};

const VIBE_BG: Record<Vibe, { from: string; to: string; glow: string }> = {
  Mysterious: { from: "#141024", to: "#241b3d", glow: "#7c5cff" },
  Chaotic: { from: "#2a1220", to: "#3a1c2e", glow: "#ff5c8a" },
  Elegant: { from: "#12131f", to: "#232338", glow: "#c9a24a" },
  Wholesome: { from: "#1a1626", to: "#2c2340", glow: "#ffb26b" },
  Menacing: { from: "#101014", to: "#20141a", glow: "#ff4d4d" },
  Melancholic: { from: "#101622", to: "#1c2740", glow: "#5c8bff" },
  Charismatic: { from: "#1c1330", to: "#31204a", glow: "#ffd15c" },
  Stoic: { from: "#12141a", to: "#1f232e", glow: "#8fa0b8" },
  Playful: { from: "#181334", to: "#2e1f52", glow: "#5cf0ff" },
  Rebellious: { from: "#1e1220", to: "#331624", glow: "#ff7a3c" },
  Dreamy: { from: "#161329", to: "#282148", glow: "#a98bff" },
  Intimidating: { from: "#0d0d12", to: "#1a151f", glow: "#b04dff" },
};

const ROLE_ACCENT: Record<Role, string> = {
  Warrior: "#c94b3b",
  Rogue: "#5b6b8c",
  Mage: "#8a63d2",
  Inventor: "#c98a3b",
  Healer: "#3bc98f",
  Detective: "#a8863b",
  Explorer: "#3ba6c9",
  Assassin: "#7a3b52",
  Royal: "#d0b04a",
  Mercenary: "#8c7a5b",
  Scholar: "#6b8c5b",
  Outlaw: "#c9603b",
};

export function avatarPalette(t: CharacterTraits): AvatarPalette {
  const fig = SPECIES_FIGURE[t.species];
  const bg = VIBE_BG[t.vibe];
  return {
    bgFrom: bg.from,
    bgTo: bg.to,
    glow: bg.glow,
    figure: fig.figure,
    rim: fig.rim,
    accent: ROLE_ACCENT[t.role],
  };
}

/** deterministic 0..1 from a string, for tiny stable variations */
export function hashUnit(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export interface AvatarShape {
  /** headwear: 0 none, 1 hood, 2 crown, 3 horns, 4 antennae, 5 halo */
  head: number;
  /** shoulder silhouette width factor */
  shoulders: number;
  /** does the figure carry a glow orb */
  orb: boolean;
}

export function avatarShape(t: CharacterTraits): AvatarShape {
  let head = 0;
  if (t.species === "Witch" || t.role === "Rogue" || t.role === "Assassin") head = 1;
  if (t.species === "Dragonborn" || t.species === "Demon") head = 3;
  if (t.role === "Royal") head = 2;
  if (t.species === "Alien") head = 4;
  if (t.species === "Ghost" || t.species === "Fae") head = 5;

  const shoulders =
    0.9 + (t.confidence / 100) * 0.35 + (t.role === "Warrior" ? 0.15 : 0);

  const orb =
    t.role === "Mage" ||
    t.role === "Healer" ||
    t.species === "Witch" ||
    t.species === "Fae" ||
    t.species === "Android";

  return { head, shoulders, orb };
}
