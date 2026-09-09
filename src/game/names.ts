import type { Species } from "@/lib/types";
import { mulberry32, seededPick, subSeed } from "./random";

const GIVEN: Record<Species, string[]> = {
  Human: ["Della", "Marek", "Sable", "Torrin", "Wren", "Halix", "Corvin", "Mira"],
  Elf: ["Aeloreth", "Ysanne", "Faelen", "Nimriel", "Thaelor", "Sylwen", "Aerith", "Caelum"],
  Android: ["Unit-Six", "Kestrel", "Vero", "Ansel-9", "Lux", "Cypher", "Onyx", "Della-K"],
  Witch: ["Bramble", "Nettle", "Hessa", "Morrow", "Vex", "Ilsa", "Cinder", "Rue"],
  Vampire: ["Veyra", "Lucen", "Ambrose", "Nocta", "Dorian", "Selvane", "Cassian", "Isolde"],
  Dragonborn: ["Voraxis", "Khaine", "Emberlyn", "Sarkoth", "Auric", "Vhalla", "Draven", "Pyra"],
  Fae: ["Thistlewick", "Puck", "Ninefold", "Glimmer", "Ashwren", "Fable", "Mote", "Cobweb"],
  Alien: ["Xhen", "Orrin-Vate", "Silque", "Zevaru", "Nyx", "Aeon", "Quill", "Vanta"],
  Cyborg: ["Rax", "Solene", "Ferro", "Nadia-Steel", "Crane", "Volk", "Ada", "Grist"],
  Demon: ["Malketh", "Azel", "Vorse", "Nihila", "Corrax", "Sable-Vane", "Debtor", "Ruin"],
  Ghost: ["Grey", "Lantern", "Ossa", "Faint", "Marrow", "Echo", "Vesper", "Hollow"],
  Shapeshifter: ["Nought", "Palimpsest", "Vane", "Other", "Shift", "Guise", "Mask", "Nine"],
};

const SURNAME: string[] = [
  "Noct", "Ashdown", "Vell", "Reyn", "Marchgrave", "Underbell", "Voss", "Thorne",
  "Halloway", "Greave", "Blackfen", "Ives", "Corrigan", "Wyndham", "Sarrow", "Kettle",
];

export function characterName(seed: number, species: Species): string {
  const rng = mulberry32(subSeed(seed, 0x1a2b));
  const given = seededPick(rng, GIVEN[species]);
  // some species read better mononymous
  const mononym: Species[] = ["Fae", "Ghost", "Android", "Shapeshifter", "Alien"];
  if (mononym.includes(species) && rng() > 0.45) return given;
  const surname = seededPick(mulberry32(subSeed(seed, 0x3c4d)), SURNAME);
  return `${given} ${surname}`;
}
