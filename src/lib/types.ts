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

/**
 * The character as the player *appears* — their potential. What they become is
 * determined by the story choices, not this object. Sliders are 0-100.
 */
export interface CharacterTraits {
  species: Species;
  role: Role;
  vibe: Vibe;
  quirk: Quirk;
  morality: number; // 0 = pure/principled, 100 = chaotic/unbound
  confidence: number; // 0 = shy, 100 = fearless
  emotionality: number; // 0 = stoic, 100 = expressive
}
