import type { CharacterGameState, Ending } from "./types";

export const ENDINGS: Record<string, Ending> = {
  guardian: {
    id: "guardian",
    title: "The Guardian",
    alignment: "Principled · Steadfast",
    summary: "You stood where the wall was thinnest and did not move.",
    becameLine: "You became the person other people stood behind.",
    narrative:
      "Vantry remembers you as the one who kept their head while the roof came down. You did not save everything. You saved enough, and you saved it on purpose, and afterward you stayed to help rebuild the part you couldn't.",
    strength: "Unshakeable when it counts.",
    flaw: "Mistakes every problem for your problem.",
    phrase: "Someone had to hold the line. It was going to be me.",
  },
  tyrant: {
    id: "tyrant",
    title: "The Tyrant",
    alignment: "Pragmatic · Ruthless",
    summary: "You ended the chaos by becoming the thing no one could argue with.",
    becameLine: "You became the answer the city was too tired to refuse.",
    narrative:
      "Order returned to Vantry under your hand, and it stayed. People stopped asking who lit the fires because they were busy asking your permission for smaller things. It works. That was always the horror of it — that it works.",
    strength: "Gets results while others debate.",
    flaw: "Confuses being obeyed with being right.",
    phrase: "They wanted it to stop. I stopped it.",
  },
  wanderer: {
    id: "wanderer",
    title: "The Wanderer",
    alignment: "Unbound · Detached",
    summary: "You left before the city could decide what you were.",
    becameLine: "You became a story other people tell, in a place you'll never revisit.",
    narrative:
      "The road took you out through the west gate and kept taking you. Vantry sorted its own fire, its own blame, its own recovery. You think about it sometimes, the way you think about a book you didn't finish.",
    strength: "Owes nothing, owned by nothing.",
    flaw: "Leaves before anything can matter.",
    phrase: "It was never my city. I just passed through the fire.",
  },
  redeemer: {
    id: "redeemer",
    title: "The Redeemer",
    alignment: "Principled · Selfless",
    summary: "You took the weight of it so that someone else wouldn't have to.",
    becameLine: "You became proof that a person can choose to be better than they started.",
    narrative:
      "You began as someone with a false name and a private agenda. You ended standing in front of the city, telling the truth about your own failures so that Della could go home. It cost you everything you came here protecting. You would do it again.",
    strength: "Turns guilt into action.",
    flaw: "Can't forgive yourself for the things you fixed.",
    phrase: "I couldn't undo it. I could answer for it.",
  },
  betrayer: {
    id: "betrayer",
    title: "The Betrayer",
    alignment: "Pragmatic · Faithless",
    summary: "You bought your way out with a name that wasn't yours to sell.",
    becameLine: "You became free, and the price had someone else's face on it.",
    narrative:
      "You walked away clean. The person you named did not. Vantry moved on, satisfied with its villain, and you moved on too, carrying the one piece of the story that never made it into the record.",
    strength: "Survives what should have caught you.",
    flaw: "Every exit is through a door you locked behind you.",
    phrase: "It was them or me. I made sure it was them.",
  },
  strategist: {
    id: "strategist",
    title: "The Strategist",
    alignment: "Pragmatic · Composed",
    summary: "You read the whole board and moved only when it was won.",
    becameLine: "You became the person who was three moves ahead the entire time.",
    narrative:
      "The fire, the patron, the arrest — you fitted every piece into a plan and let it close. Vantry got a resolution it could believe, the right people fell, and almost no one realised how carefully it had been arranged. That was the point.",
    strength: "Never plays the hand you're shown.",
    flaw: "Treats people as positions.",
    phrase: "I didn't win the argument. I arranged for there not to be one.",
  },
  martyr: {
    id: "martyr",
    title: "The Martyr",
    alignment: "Principled · Sacrificial",
    summary: "You spent yourself down to nothing and called it a fair trade.",
    becameLine: "You became the name carved into the thing that got rebuilt.",
    narrative:
      "You went into the fire twice. You took the blame in full. Whatever you were protecting when you arrived in Vantry, you gave it up piece by piece, and the city is standing because of choices that left you with almost nothing.",
    strength: "Will pay any price for someone else.",
    flaw: "Never once considers paying less.",
    phrase: "I had it to give. So I gave it.",
  },
  catalyst: {
    id: "catalyst",
    title: "The Catalyst",
    alignment: "Unbound · Radical",
    summary: "You read every name aloud and let the old order fall.",
    becameLine: "You became the match, and refused to apologise for the light.",
    narrative:
      "The council collapsed. The courts followed. What rose in Vantry afterward was messy, unfinished, and genuinely nobody's property — which is either what the city needed or what you talked yourself into. History is still arguing about it.",
    strength: "Not afraid of the wreckage.",
    flaw: "Rarely stays to help clear it.",
    phrase: "It was rotten all the way down. So I pulled it down.",
  },
  survivor: {
    id: "survivor",
    title: "The Survivor",
    alignment: "Pragmatic · Guarded",
    summary: "You came through it whole, which was the only goal you admitted to.",
    becameLine: "You became very good at not being where the roof falls.",
    narrative:
      "Others burned, testified, ruled, or fled. You calculated, hedged, and endured. Vantry never quite worked out what you wanted, and that suited you. You are still here. That was the plan, and the plan held.",
    strength: "Always has an exit.",
    flaw: "Never fully arrives anywhere.",
    phrase: "Everyone else had a cause. I had a pulse, and I kept it.",
  },
  visionary: {
    id: "visionary",
    title: "The Visionary",
    alignment: "Unbound · Driven",
    summary: "You used the ashes to sketch the city that should exist.",
    becameLine: "You became the person describing the next thing while everyone else counted losses.",
    narrative:
      "Where Vantry saw a disaster, you saw a foundation. You turned the aftermath into a proposal, then a movement, then something with your fingerprints all over its charter. Not everyone trusts where you're leading. Everyone is following.",
    strength: "Sees the version that doesn't exist yet.",
    flaw: "Impatient with the people living in the current one.",
    phrase: "The fire cleared the ground. I already had the drawings.",
  },
  shadow: {
    id: "shadow",
    title: "The Shadow",
    alignment: "Pragmatic · Amoral",
    summary: "You kept the leverage, the letters, and the last word.",
    becameLine: "You became the person the powerful are quietly afraid of.",
    narrative:
      "You walked out of the granary with a scorched ledger and out of the reckoning with your options open. You don't hold an office in Vantry. You hold something better: the ability to end several people who do, whenever you choose.",
    strength: "Always knows where the bodies are.",
    flaw: "Trusts leverage more than any person.",
    phrase: "Power is just knowing what someone can't afford to have said.",
  },
  diplomat: {
    id: "diplomat",
    title: "The Diplomat",
    alignment: "Principled · Measured",
    summary: "You found the version of the truth that everyone could survive.",
    becameLine: "You became the room where the shouting finally stopped.",
    narrative:
      "You talked a mob into a petition, a patron into limits, a city into a process. Nothing about the ending was dramatic, which is the highest compliment your work can receive. Vantry held together along the seams you sewed.",
    strength: "Finds the sentence everyone can sign.",
    flaw: "Sometimes the compromise is just a slower wound.",
    phrase: "Nobody got what they wanted. Everybody got to go home.",
  },
  exile: {
    id: "exile",
    title: "The Exile",
    alignment: "Detached · Unresolved",
    summary: "You said nothing, and the silence followed you out.",
    becameLine: "You became a person with a city-shaped hole where a home should be.",
    narrative:
      "You left without a word, and unlike the Wanderer you feel every mile of it. Vantry didn't cast you out. You just couldn't find the version of yourself that got to stay. The road isn't freedom for you. It's the long way around a door you closed.",
    strength: "Carries no one's expectations.",
    flaw: "Carries the regret instead.",
    phrase: "I could have stayed. I couldn't have lived with staying.",
  },
  keeper: {
    id: "keeper",
    title: "The Keeper",
    alignment: "Principled · Devoted",
    summary: "You held onto the people, and let the rest of it go.",
    becameLine: "You became the one who remembered the names when the city wanted to move on.",
    narrative:
      "You didn't win Vantry. You kept Della, and Corin's memory, and a stubborn little circle of people who'd have been abandoned by anyone with bigger plans. The city rebuilt around you without noticing you were the reason a few of its threads never snapped.",
    strength: "Loyal past the point of sense.",
    flaw: "Guards small things while large things fall.",
    phrase: "The city can burn. I know where my people are.",
  },
  reckoner: {
    id: "reckoner",
    title: "The Reckoner",
    alignment: "Balanced · Unblinking",
    summary: "You weighed it honestly and made the call no one thanked you for.",
    becameLine: "You became the person who did the arithmetic out loud.",
    narrative:
      "You didn't take the blame or dodge it. You didn't burn it down or walk away. You stood in the middle of an impossible ledger and settled it as fairly as a rigged situation allows, and Vantry has never quite decided whether to be grateful.",
    strength: "Sees the trade clearly and names it.",
    flaw: "Clarity isn't the same as comfort, and you offer little of the second.",
    phrase: "There was no clean answer. I gave them the true one.",
  },
};

type EndingRule = (s: CharacterGameState) => string | null;

const f = (s: CharacterGameState, flag: string) => Boolean(s.story.flags[flag]);

const RULES: EndingRule[] = [
  // final-decision anchored
  (s) =>
    f(s, "took_blame") && s.hidden.sacrifice >= 68 && s.hidden.selflessness >= 58
      ? "martyr"
      : null,
  (s) =>
    f(s, "took_blame") && s.stats.empathy >= 52 && s.hidden.integrity >= 55
      ? "redeemer"
      : null,
  (s) =>
    f(s, "took_blame") && s.stats.courage >= 55 && s.stats.discipline >= 52
      ? "guardian"
      : null,
  (s) => (f(s, "took_blame") ? "reckoner" : null),

  (s) =>
    f(s, "named_another") && s.hidden.betrayal >= 55 ? "betrayer" : null,
  (s) =>
    f(s, "named_another") && s.hidden.ruthlessness >= 55 ? "shadow" : null,
  (s) => (f(s, "named_another") ? "survivor" : null),

  (s) =>
    f(s, "burned_it_all") && s.stats.chaos >= 58 ? "catalyst" : null,
  (s) =>
    f(s, "burned_it_all") && s.stats.curiosity >= 58 && s.stats.ambition >= 52
      ? "visionary"
      : null,
  (s) => (f(s, "burned_it_all") ? "reckoner" : null),

  (s) =>
    f(s, "walked_away") && s.stats.curiosity >= 55 && s.hidden.attachment <= 40
      ? "wanderer"
      : null,
  (s) => (f(s, "walked_away") ? "exile" : null),

  // state anchored fallbacks
  (s) =>
    s.stats.ambition >= 66 && s.hidden.ruthlessness >= 58 ? "tyrant" : null,
  (s) =>
    s.stats.empathy >= 60 && s.stats.trust >= 55 && s.stats.discipline >= 50
      ? "diplomat"
      : null,
  (s) =>
    s.hidden.loyalty >= 60 && s.hidden.attachment >= 55 ? "keeper" : null,
  (s) =>
    s.stats.cunning >= 62 && s.stats.discipline >= 56 ? "strategist" : null,
  (s) =>
    s.stats.courage >= 60 && s.hidden.selflessness >= 55 ? "guardian" : null,
  (s) => (s.hidden.risk <= 34 ? "survivor" : null),
];

export function calculateEnding(state: CharacterGameState): Ending {
  for (const rule of RULES) {
    const id = rule(state);
    if (id && ENDINGS[id]) return ENDINGS[id];
  }
  return ENDINGS.reckoner;
}
