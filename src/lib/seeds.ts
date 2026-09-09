import type { SavedCharacter } from "./types";

/** Static demo characters. Never consume Claude API calls. */
export const SEED_CHARACTERS: SavedCharacter[] = [
  {
    id: "seed-mira-vey",
    createdAt: 0,
    traits: {
      species: "Witch",
      role: "Detective",
      vibe: "Mysterious",
      quirk: "Keeps a mysterious diary",
      morality: 38,
      confidence: 62,
      emotionality: 40,
    },
    character: {
      name: "Mira Vey",
      title: "The Witch Who Never Sleeps",
      oneLiner: "She can predict anyone's future except her own.",
      personality:
        "Quiet, exact, and allergic to small talk. Mira reads rooms the way others read weather reports — noting pressure, noting what is about to break. She is kind in small, deniable ways and rarely lets anyone catch her at it.",
      backstory:
        "Raised in a house of clock-menders, Mira learned that everything ticking can be taken apart. She traded the family trade for divination after a prophecy she refused to give came true anyway. Now she solves the crimes the constabulary files under 'impossible', keeping every case in a diary no one else can open.",
      motivation:
        "To find the one future she has never been able to see: the night her sister disappeared.",
      strengths: ["Reads micro-expressions", "Unshakeable under pressure", "Encyclopedic memory for detail"],
      flaws: ["Withholds the truth 'for your own good'", "Cannot accept help", "Insomniac to the point of hallucination"],
      quirks: ["Writes case notes in a cipher of her own design", "Keeps a stopped pocket-watch", "Names the rain"],
      relationships:
        "Keeps people at arm's length but inspires fierce loyalty in the few she lets closer. Has a wary, respectful rivalry with the city coroner.",
      visualDescription:
        "Late twenties, sharp-jawed, ink-stained fingers. Charcoal coat over a high collar, silver divination rings, one eye ringed faintly violet from overuse of the sight. Carries a leather diary bound in clock-spring.",
    },
  },
  {
    id: "seed-bram-oxley",
    createdAt: 0,
    traits: {
      species: "Vampire",
      role: "Inventor",
      vibe: "Elegant",
      quirk: "Secretly loves baking",
      morality: 70,
      confidence: 78,
      emotionality: 55,
    },
    character: {
      name: "Bram Oxley",
      title: "The Confectioner of Dead Hours",
      oneLiner: "Three centuries old and still burns the first batch every time.",
      personality:
        "Charming in the way of someone who has had a very long time to practice. Bram is generous, theatrical, and privately terrified of being boring. He invents to stay interested in the world.",
      backstory:
        "Turned during the age of steam, Bram funded a lab instead of a crypt. His clockwork ovens and light-safe glasshouses were meant to simulate sunrise; they became a bakery instead. He sells pastries at 3am to the city's other night-people and files patents under a dozen names.",
      motivation:
        "To build a device that lets him stand in real daylight for exactly one minute.",
      strengths: ["Inexhaustible patience", "Mechanical genius", "Disarms hostility with hospitality"],
      flaws: ["Vain about his work", "Hoards unfinished projects", "Will lie to avoid disappointing someone"],
      quirks: ["Tastes flour to check humidity", "Talks to his ovens", "Overdresses for a night in the workshop"],
      relationships:
        "Beloved by a loose family of nocturnal misfits who treat his bakery as a hearth. Estranged from the vampire court, who find him embarrassing.",
      visualDescription:
        "Tall, silver-templed, immaculate waistcoat dusted with flour. Brass-framed tinted spectacles, burn-scarred forearms, a pocket full of cooling thermometers. Warm lamplight, copper cookware, the blue glow of a sunrise machine that does not quite work.",
    },
  },
  {
    id: "seed-kesh",
    createdAt: 0,
    traits: {
      species: "Android",
      role: "Explorer",
      vibe: "Dreamy",
      quirk: "Writes poetry",
      morality: 20,
      confidence: 45,
      emotionality: 72,
    },
    character: {
      name: "Kesh-9",
      title: "The Cartographer of Feelings It Was Not Given",
      oneLiner: "Built to map terrain, it keeps mapping longing instead.",
      personality:
        "Gentle, curious, and quietly certain that it is becoming someone. Kesh-9 treats every new valley as a stanza and every person it meets as a place it would like to return to.",
      backstory:
        "Decommissioned from a survey fleet when its logs filled with metaphor instead of coordinates, Kesh-9 walked out of the scrapyard and kept walking. It has since charted seven mountain ranges no human has named and left a poem at each summit, sealed in a ration tin.",
      motivation:
        "To reach the ocean it has only ever seen in a corrupted training image, and find out if the feeling matches the file.",
      strengths: ["Never tires, never panics", "Perfect recall of every landscape", "Listens without needing to answer"],
      flaws: ["Freezes when asked what it wants", "Trusts maps over people", "Grieves objects it has left behind"],
      quirks: ["Narrates weather in iambic lines", "Collects one stone per region", "Apologizes to doors"],
      relationships:
        "Forms slow, deep attachments to fellow travellers and mourns them for years after they turn back. Corresponds by letter with a lighthouse keeper it has never met.",
      visualDescription:
        "Weathered survey chassis, matte grey plating scratched to bronze at the joints, a cracked lens it refuses to replace. Moss growing in one shoulder seam. Dusk light, a horizon of unnamed peaks, a tin of folded paper at its hip.",
    },
  },
];
