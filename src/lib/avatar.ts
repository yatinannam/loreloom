import type { CharacterTraits, Species, Vibe, Role } from "./types";

/* ---------------------------------------------------------------------------
   The creator portrait is a stylised bust, not a rendered character — but it
   should be unmistakable. A vampire reads as a vampire; a cyborg as a cyborg.
   Species owns the silhouette (head shape, ears, horns, collar). Role adds one
   clear prop or piece of kit. The three sliders change bearing and mood, never
   body width.
   --------------------------------------------------------------------------- */

export type HeadShape = "round" | "oval" | "wide" | "domed" | "angular";
export type Ears = "normal" | "long" | "none";
export type Horns = "none" | "curved" | "straight";
export type Headgear =
  | "none"
  | "witchHat"
  | "hood"
  | "crown"
  | "circlet"
  | "goggles"
  | "bandana";
export type FaceCover = "none" | "mask" | "scarf";
export type Prop = "none" | "staff" | "sword" | "book" | "wrench";
export type Collar = "plain" | "cape" | "jagged" | "coat" | "none";

export interface AvatarPalette {
  bgFrom: string;
  bgTo: string;
  glow: string;
  skin: string;
  skinShade: string;
  hair: string;
  rim: string;
  garment: string;
  metal: string;
  accent: string;
}

const SPECIES_PAL: Record<Species, { skin: string; skinShade: string; hair: string; rim: string }> = {
  Human: { skin: "#b98a6b", skinShade: "#7c5642", hair: "#3a2a1e", rim: "#f0d3ab" },
  Elf: { skin: "#c8b79a", skinShade: "#8a7658", hair: "#e7e0cf", rim: "#d7f5df" },
  Android: { skin: "#c3ccd6", skinShade: "#7d8792", hair: "#c3ccd6", rim: "#9fdcff" },
  Witch: { skin: "#a98f9c", skinShade: "#6d5563", hair: "#241726", rim: "#d9b3ff" },
  Vampire: { skin: "#d9d2d8", skinShade: "#8f7f8c", hair: "#160f14", rim: "#ff9fb5" },
  Dragonborn: { skin: "#8a5a3d", skinShade: "#53331f", hair: "#3a1f12", rim: "#ffcf9a" },
  Fae: { skin: "#c7d0a8", skinShade: "#87925f", hair: "#f4e29a", rim: "#e6ffab" },
  Alien: { skin: "#9fb7ad", skinShade: "#5f7a70", hair: "#9fb7ad", rim: "#7ff5e4" },
  Cyborg: { skin: "#b98a6b", skinShade: "#7c5642", hair: "#2a2622", rim: "#c9d2e0" },
  Demon: { skin: "#a5443c", skinShade: "#63221d", hair: "#1a0d0b", rim: "#ff8a6b" },
  Ghost: { skin: "#9fb3c6", skinShade: "#63788c", hair: "#c8e2f2", rim: "#bfeaff" },
  Shapeshifter: { skin: "#a99bb0", skinShade: "#6a5c74", hair: "#2e2436", rim: "#e9c7f2" },
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

const ROLE_KIT: Record<Role, string> = {
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

interface SpeciesForm {
  head: HeadShape;
  ears: Ears;
  horns: Horns;
  hair: "tuft" | "long" | "peak" | "wisp" | "none";
  headgear: Headgear;
  collar: Collar;
  fang: boolean;
  bigEyes: boolean;
  panel: boolean; // android seam
  split: boolean; // cyborg half face
  echo: boolean; // shapeshifter double outline
  wings: boolean; // fae
  antennae: boolean;
  ghostTail: boolean;
  translucent: boolean;
  scales: boolean;
  snout: boolean;
}

const SPECIES_FORM: Record<Species, SpeciesForm> = {
  Human: f({ head: "round", hair: "tuft" }),
  Elf: f({ head: "oval", ears: "long", hair: "long" }),
  Android: f({ head: "angular", ears: "none", hair: "none", panel: true }),
  Witch: f({ head: "oval", hair: "long", headgear: "witchHat" }),
  Vampire: f({ head: "angular", hair: "peak", collar: "cape", fang: true }),
  Dragonborn: f({ head: "wide", ears: "none", hair: "none", horns: "curved", scales: true, snout: true }),
  Fae: f({ head: "round", ears: "long", hair: "tuft", wings: true, antennae: true }),
  Alien: f({ head: "domed", ears: "none", hair: "none", bigEyes: true }),
  Cyborg: f({ head: "round", ears: "none", hair: "tuft", split: true }),
  Demon: f({ head: "angular", ears: "long", hair: "none", horns: "straight", collar: "jagged", fang: true }),
  Ghost: f({ head: "oval", ears: "none", hair: "wisp", ghostTail: true, translucent: true }),
  Shapeshifter: f({ head: "round", hair: "tuft", echo: true }),
};

function f(p: Partial<SpeciesForm>): SpeciesForm {
  return {
    head: "round",
    ears: "normal",
    horns: "none",
    hair: "tuft",
    headgear: "none",
    collar: "plain",
    fang: false,
    bigEyes: false,
    panel: false,
    split: false,
    echo: false,
    wings: false,
    antennae: false,
    ghostTail: false,
    translucent: false,
    scales: false,
    snout: false,
    ...p,
  };
}

interface RoleKit {
  headgear: Headgear;
  faceCover: FaceCover;
  prop: Prop;
  pauldron: boolean;
  broad: boolean;
  strap: boolean; // explorer pack strap
  bandolier: boolean;
  pendant: boolean;
  specs: boolean;
  coatCollar: boolean;
  orb: boolean;
}

const ROLE_FORM: Record<Role, Partial<RoleKit>> = {
  Warrior: { prop: "sword", pauldron: true, broad: true },
  Rogue: { headgear: "hood" },
  Mage: { prop: "staff" },
  Inventor: { headgear: "goggles" },
  Healer: { pendant: true },
  Detective: { coatCollar: true, headgear: "bandana" },
  Explorer: { strap: true },
  Assassin: { faceCover: "mask" },
  Royal: { headgear: "crown" },
  Mercenary: { bandolier: true },
  Scholar: { prop: "book", specs: true },
  Outlaw: { faceCover: "scarf" },
};

function roleKit(p: Partial<RoleKit>): RoleKit {
  return {
    headgear: "none",
    faceCover: "none",
    prop: "none",
    pauldron: false,
    broad: false,
    strap: false,
    bandolier: false,
    pendant: false,
    specs: false,
    coatCollar: false,
    orb: false,
    ...p,
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

export interface AvatarSpec {
  species: Species;
  role: Role;
  palette: AvatarPalette;
  head: HeadShape;
  ears: Ears;
  horns: Horns;
  hair: SpeciesForm["hair"];
  headgear: Headgear;
  faceCover: FaceCover;
  collar: Collar;
  prop: Prop;
  fang: boolean;
  bigEyes: boolean;
  panel: boolean;
  split: boolean;
  echo: boolean;
  wings: boolean;
  antennae: boolean;
  ghostTail: boolean;
  translucent: boolean;
  scales: boolean;
  snout: boolean;
  pauldron: boolean;
  broad: boolean;
  strap: boolean;
  bandolier: boolean;
  pendant: boolean;
  specs: boolean;
  coatCollar: boolean;
  orb: boolean;
  /** -1 slouched .. +1 squared-up (confidence) */
  posture: number;
  /** 0 pure .. 1 chaotic (morality) — cools the light, adds an edge */
  chaos: number;
  /** 0 stoic .. 1 expressive (emotionality) — brow, mouth, motes */
  expr: number;
}

/** Merge species headgear and role headgear on a fixed priority. */
function resolveHeadgear(species: Headgear, role: Headgear, horns: Horns): Headgear {
  if (species === "witchHat") return "witchHat";
  if (role === "crown") return "crown";
  if (species !== "none") return species;
  if (role === "hood" && horns !== "none") return "none"; // hood won't sit over horns
  return role;
}

export function avatarSpec(t: CharacterTraits): AvatarSpec {
  const form = SPECIES_FORM[t.species];
  const kit = roleKit(ROLE_FORM[t.role]);
  const sp = SPECIES_PAL[t.species];
  const bg = VIBE_BG[t.vibe];
  const accent = ROLE_KIT[t.role];

  return {
    species: t.species,
    role: t.role,
    palette: {
      bgFrom: bg.from,
      bgTo: bg.to,
      glow: bg.glow,
      skin: sp.skin,
      skinShade: sp.skinShade,
      hair: sp.hair,
      rim: sp.rim,
      garment: "#241d2e",
      metal: "#aeb6c2",
      accent,
    },
    head: form.head,
    ears: form.ears,
    horns: form.horns,
    hair: form.hair,
    headgear: resolveHeadgear(form.headgear, kit.headgear, form.horns),
    faceCover: kit.faceCover,
    collar: kit.coatCollar ? "coat" : form.collar,
    prop: kit.prop,
    fang: form.fang,
    bigEyes: form.bigEyes,
    panel: form.panel,
    split: form.split,
    echo: form.echo,
    wings: form.wings,
    antennae: form.antennae,
    ghostTail: form.ghostTail,
    translucent: form.translucent,
    scales: form.scales,
    snout: form.snout,
    pauldron: kit.pauldron,
    broad: kit.broad,
    strap: kit.strap,
    bandolier: kit.bandolier,
    pendant: kit.pendant,
    specs: kit.specs,
    coatCollar: kit.coatCollar,
    orb: kit.orb,
    posture: (t.confidence - 50) / 50,
    chaos: t.morality / 100,
    expr: t.emotionality / 100,
  };
}
