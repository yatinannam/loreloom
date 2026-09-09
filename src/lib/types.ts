export type Species =
  | "Human"
  | "Elf"
  | "Android"
  | "Witch"
  | "Vampire"
  | "Dragonborn"
  | "Fae"
  | "Alien"
  | "Cyborg"
  | "Demon"
  | "Ghost"
  | "Shapeshifter";

export type Role =
  | "Warrior"
  | "Rogue"
  | "Mage"
  | "Inventor"
  | "Healer"
  | "Detective"
  | "Explorer"
  | "Assassin"
  | "Royal"
  | "Mercenary"
  | "Scholar"
  | "Outlaw";

export type Vibe =
  | "Mysterious"
  | "Chaotic"
  | "Elegant"
  | "Wholesome"
  | "Menacing"
  | "Melancholic"
  | "Charismatic"
  | "Stoic"
  | "Playful"
  | "Rebellious"
  | "Dreamy"
  | "Intimidating";

export type Quirk =
  | "Collects strange objects"
  | "Talks to animals"
  | "Secretly loves baking"
  | "Cannot lie"
  | "Writes poetry"
  | "Afraid of the dark"
  | "Always overdressed"
  | "Hums when nervous"
  | "Keeps a mysterious diary"
  | "Names every weapon"
  | "Talks to their reflection"
  | "Has terrible luck";

/** 0-100 sliders. */
export interface CharacterTraits {
  species: Species;
  role: Role;
  vibe: Vibe;
  quirk: Quirk;
  morality: number; // 0 = pure, 100 = chaotic
  confidence: number; // 0 = shy, 100 = fearless
  emotionality: number; // 0 = stoic, 100 = expressive
}

export interface GeneratedCharacter {
  name: string;
  title: string;
  oneLiner: string;
  personality: string;
  backstory: string;
  motivation: string;
  strengths: string[];
  flaws: string[];
  quirks: string[];
  relationships: string;
  visualDescription: string;
}

export interface SavedCharacter {
  id: string;
  createdAt: number;
  traits: CharacterTraits;
  character: GeneratedCharacter;
}
