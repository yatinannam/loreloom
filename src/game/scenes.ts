import type { StoryScene } from "./types";

/**
 * The Ashfall run — seven chapters, branching in the middle, converging toward a
 * single reckoning. Content, effects, requirements and routing are kept separate.
 */

export const INTRO = {
  title: "Ashfall",
  body: [
    "The city of Vantry has burned once already this year. Nobody agrees on who lit it.",
    "You arrived a week ago with a name that isn't quite yours and a reason you keep to yourself. Tonight the bells are ringing again — not for fire, not yet, but for something moving toward one.",
    "What you do in the next few hours will decide less about the city than about you.",
  ].join("\n\n"),
};

export const SCENES: StoryScene[] = [
  /* ---------------------------- Chapter I ---------------------------- */
  {
    id: "s1_wall",
    chapter: 1,
    title: "The Stranger at the Wall",
    setup:
      "Outside the east gate you find someone slumped against the stones, bleeding from a wound that was meant to kill. They are still breathing. Down the road, torchlight — a patrol, moving fast, checking the ditches.",
    atmosphere: "Cold air, wet ash, the smell of pitch from the gate lamps.",
    choices: [
      {
        id: "help",
        label: "Help them immediately",
        description: "Get an arm under them and move before the torches arrive.",
        effects: [
          { stat: "empathy", delta: 4 },
          { stat: "courage", delta: 3 },
          { stat: "cunning", delta: -2 },
        ],
        hiddenEffects: [{ axis: "selflessness", delta: 6 }, { axis: "risk", delta: 4 }],
        archetypeHints: [
          { id: "protector", weight: 2 },
          { id: "idealist", weight: 1 },
        ],
        flags: ["helped_stranger"],
        nextScene: "s2_help",
        outcomeText:
          "You take their weight without asking questions. They gasp a name — not theirs, a warning — as you haul them into the dark between two houses.",
        consequenceHints: ["Empathy rose", "You were seen helping"],
      },
      {
        id: "question",
        label: "Question them before helping",
        description: "Kneel close. Find out what you're carrying before you carry it.",
        effects: [
          { stat: "cunning", delta: 4 },
          { stat: "curiosity", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 2 }],
        archetypeHints: [
          { id: "strategist", weight: 2 },
          { id: "diplomat", weight: 1 },
        ],
        flags: ["questioned_stranger"],
        nextScene: "s2_question",
        outcomeText:
          "They answer in fragments: a ledger, a name in the council, a fire that was ordered. Then the torches round the bend and you are both out of time.",
        consequenceHints: ["Cunning rose", "You learned something dangerous"],
      },
      {
        id: "hide",
        label: "Hide them, then watch the patrol",
        description: "Stash them out of sight and see who's really hunting.",
        effects: [
          { stat: "cunning", delta: 5 },
          { stat: "discipline", delta: 3 },
          { stat: "empathy", delta: -1 },
        ],
        hiddenEffects: [{ axis: "risk", delta: 2 }],
        archetypeHints: [
          { id: "survivor", weight: 2 },
          { id: "strategist", weight: 1 },
        ],
        flags: ["hid_stranger"],
        nextScene: "s2_hide",
        outcomeText:
          "You roll them under a cart and crouch in the dark. The patrol isn't city watch. Their badges are wrong. You memorise faces.",
        consequenceHints: ["Cunning rose", "You know the hunters now"],
      },
      {
        id: "leave",
        label: "Walk away",
        description: "This is not your fight, and you have a reason to stay unseen.",
        effects: [
          { stat: "discipline", delta: 3 },
          { stat: "empathy", delta: -4 },
          { stat: "trust", delta: -2 },
        ],
        hiddenEffects: [
          { axis: "selflessness", delta: -6 },
          { axis: "attachment", delta: -3 },
        ],
        archetypeHints: [
          { id: "wanderer", weight: 2 },
          { id: "outsider", weight: 2 },
        ],
        flags: ["left_stranger"],
        nextScene: "s2_leave",
        outcomeText:
          "You keep your pace even and your hood up. Behind you the torchlight stops moving. You don't look back to learn why.",
        consequenceHints: ["Empathy fell", "You stayed invisible"],
      },
      {
        id: "exploit",
        label: "Use them to draw the patrol off",
        description: "Their trouble can be your cover.",
        effects: [
          { stat: "cunning", delta: 6 },
          { stat: "empathy", delta: -5 },
          { stat: "ambition", delta: 3 },
        ],
        hiddenEffects: [
          { axis: "ruthlessness", delta: 8 },
          { axis: "integrity", delta: -6 },
        ],
        archetypeHints: [
          { id: "opportunist", weight: 3 },
          { id: "manipulator", weight: 2 },
        ],
        flags: ["exploited_stranger"],
        nextScene: "s2_exploit",
        outcomeText:
          "You tip a lamp toward them and slip the other way while the torches converge. Whatever happens back there, it happens without you.",
        consequenceHints: ["Ruthlessness rose", "Integrity fell"],
      },
    ],
  },

  /* --------------------------- Chapter II --------------------------- */
  {
    id: "s2_help",
    chapter: 2,
    title: "A Debt You Didn't Ask For",
    setup:
      "The stranger — Corin, they say now — will live. They also say the fire wasn't an accident and they can prove it, if they reach a printer they trust before dawn. They are looking at you like you've already agreed.",
    atmosphere: "A borrowed cellar, one candle, the drip of a cracked cistern.",
    choices: [
      {
        id: "escort",
        label: "Walk them to the printer yourself",
        effects: [
          { stat: "courage", delta: 4 },
          { stat: "empathy", delta: 2 },
        ],
        hiddenEffects: [{ axis: "loyalty", delta: 6 }, { axis: "sacrifice", delta: 3 }],
        archetypeHints: [{ id: "protector", weight: 2 }, { id: "guardian", weight: 1 }],
        flags: ["escorted_corin"],
        nextScene: "s3_offer",
        outcomeText:
          "You get them there through back lots and dog-legs. At the door Corin grips your wrist. 'Whoever you're pretending to be,' they say, 'you're bad at it. You keep helping people.'",
        consequenceHints: ["Loyalty rose"],
      },
      {
        id: "money",
        label: "Point them to help, take a fee",
        effects: [
          { stat: "cunning", delta: 3 },
          { stat: "ambition", delta: 4 },
          { stat: "empathy", delta: -2 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: -3 }],
        archetypeHints: [{ id: "opportunist", weight: 2 }],
        flags: ["charged_corin"],
        nextScene: "s3_offer",
        outcomeText:
          "You give them a name and a route and let them press coins into your hand. Help is help. It can also be a transaction.",
        consequenceHints: ["Ambition rose"],
      },
      {
        id: "copy",
        label: "Read the proof and memorise it first",
        effects: [
          { stat: "cunning", delta: 4 },
          { stat: "curiosity", delta: 4 },
        ],
        hiddenEffects: [{ axis: "risk", delta: 3 }],
        archetypeHints: [{ id: "strategist", weight: 2 }, { id: "scholar", weight: 1 }],
        flags: ["knows_the_proof"],
        nextScene: "s3_offer",
        outcomeText:
          "You take an hour and the candle and learn every name in the ledger by heart. Knowledge you can't lose in a scuffle.",
        consequenceHints: ["Cunning rose", "You carry the proof in your head now"],
      },
    ],
  },
  {
    id: "s2_question",
    chapter: 2,
    title: "What the Ledger Says",
    setup:
      "Corin recovers enough to talk straight. The ledger names a councillor, Aldous Reyn, paying for the first fire. Corin wants it public. But going public means Corin is a target, and so is anyone standing near them.",
    atmosphere: "Grey pre-dawn, printworks ink, the hum of a press being warmed.",
    choices: [
      {
        id: "publish",
        label: "Push them to publish it now",
        effects: [
          { stat: "courage", delta: 5 },
          { stat: "chaos", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 5 }, { axis: "risk", delta: 5 }],
        archetypeHints: [{ id: "idealist", weight: 2 }, { id: "rebel", weight: 1 }],
        flags: ["proof_published"],
        nextScene: "s3_offer",
        outcomeText:
          "The press runs before sunrise. By the time the city wakes, Reyn's name is on three hundred doorsteps and the whole board is overturned.",
        consequenceHints: ["Integrity rose", "The city is now unstable"],
      },
      {
        id: "leverage",
        label: "Hold the ledger back as leverage",
        effects: [
          { stat: "cunning", delta: 6 },
          { stat: "ambition", delta: 4 },
        ],
        hiddenEffects: [{ axis: "ruthlessness", delta: 4 }],
        archetypeHints: [{ id: "strategist", weight: 2 }, { id: "manipulator", weight: 2 }],
        flags: ["holds_leverage"],
        nextScene: "s3_offer",
        outcomeText:
          "You convince Corin to wait. A secret this size is worth more folded in a pocket than shouted from a roof. Corin agrees, and likes you a little less for how easily you said it.",
        consequenceHints: ["Cunning rose", "You hold power over a councillor"],
      },
      {
        id: "verify",
        label: "Slow down — verify it first",
        effects: [
          { stat: "discipline", delta: 5 },
          { stat: "curiosity", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 4 }],
        archetypeHints: [{ id: "scholar", weight: 2 }],
        flags: ["verified_proof"],
        nextScene: "s3_offer",
        outcomeText:
          "You spend the morning matching the ledger against harbour records. It holds. Now when you move, you move on solid ground.",
        consequenceHints: ["Discipline rose"],
      },
    ],
  },
  {
    id: "s2_hide",
    chapter: 2,
    title: "The Wrong Badges",
    setup:
      "The patrol that hunted Corin wore council livery over mercenary leathers. You followed them to a warehouse on the Ropewalk. Corin is safe for now. You could learn a great deal here, or you could be the next body in the ditch.",
    atmosphere: "Rope, tar, the creak of a crane arm swinging in wind off the water.",
    choices: [
      {
        id: "infiltrate",
        label: "Get inside and listen",
        effects: [
          { stat: "courage", delta: 4 },
          { stat: "cunning", delta: 4 },
        ],
        hiddenEffects: [{ axis: "risk", delta: 6 }],
        archetypeHints: [{ id: "survivor", weight: 1 }, { id: "strategist", weight: 2 }],
        flags: ["infiltrated_warehouse"],
        nextScene: "s3_offer",
        outcomeText:
          "Through a gap in the boards you hear the next fire being scheduled — the granary, in two nights. You have a date now. You also have a reason to be very afraid.",
        consequenceHints: ["Cunning rose", "You know when the next fire is"],
      },
      {
        id: "photo",
        label: "Mark the building and bring Corin proof",
        effects: [
          { stat: "discipline", delta: 4 },
          { stat: "cunning", delta: 2 },
        ],
        hiddenEffects: [{ axis: "loyalty", delta: 4 }],
        archetypeHints: [{ id: "guardian", weight: 2 }],
        flags: ["shared_intel"],
        nextScene: "s3_offer",
        outcomeText:
          "You note the crane's number, the door's lock, the faces going in. Corin's eyes go wide when you list them. 'You're building a case,' they say. 'Good. I was just building a grudge.'",
        consequenceHints: ["Loyalty rose"],
      },
      {
        id: "walk_hide",
        label: "You've seen enough — disappear",
        effects: [
          { stat: "discipline", delta: 3 },
          { stat: "empathy", delta: -2 },
        ],
        hiddenEffects: [{ axis: "risk", delta: -4 }, { axis: "attachment", delta: -2 }],
        archetypeHints: [{ id: "outsider", weight: 2 }, { id: "survivor", weight: 2 }],
        flags: ["kept_distance"],
        nextScene: "s3_offer",
        outcomeText:
          "You back away from the boards and let the night close over what you saw. Some knowledge is only a way to get killed faster.",
        consequenceHints: ["You stayed safe", "Attachment fell"],
      },
    ],
  },
  {
    id: "s2_leave",
    chapter: 2,
    title: "The Name You Chose",
    setup:
      "You spend a clean, quiet day. No one bleeds near you. By evening the city is talking anyway: a body found at the east gate, a councillor's guards asking who was seen on the wall road last night. Someone describes your hood.",
    atmosphere: "A rented room, thin walls, a landlady who has started watching your door.",
    choices: [
      {
        id: "runaway",
        label: "Pack and leave the city tonight",
        effects: [
          { stat: "discipline", delta: 3 },
          { stat: "courage", delta: -3 },
        ],
        hiddenEffects: [{ axis: "attachment", delta: -5 }, { axis: "risk", delta: -3 }],
        archetypeHints: [{ id: "wanderer", weight: 3 }],
        flags: ["tried_to_flee"],
        nextScene: "s3_offer",
        outcomeText:
          "You get as far as the west toll before the gate closes for a 'security matter.' You are not leaving. Not tonight, and not without being noticed.",
        consequenceHints: ["The city won't let you go quietly"],
      },
      {
        id: "getahead",
        label: "Find out what the dead stranger knew",
        effects: [
          { stat: "curiosity", delta: 5 },
          { stat: "cunning", delta: 3 },
        ],
        hiddenEffects: [{ axis: "risk", delta: 3 }],
        archetypeHints: [{ id: "strategist", weight: 2 }, { id: "scholar", weight: 1 }],
        flags: ["chasing_the_dead"],
        nextScene: "s3_offer",
        outcomeText:
          "You retrace the stranger's last night and find their contact — a printer, terrified, holding a ledger they can't publish alone. Now you're in it after all, just later and colder.",
        consequenceHints: ["Curiosity rose", "You found the proof anyway"],
      },
      {
        id: "alibi",
        label: "Build an alibi and wait it out",
        effects: [
          { stat: "cunning", delta: 4 },
          { stat: "discipline", delta: 3 },
          { stat: "trust", delta: -2 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: -3 }],
        archetypeHints: [{ id: "survivor", weight: 3 }],
        flags: ["built_alibi"],
        nextScene: "s3_offer",
        outcomeText:
          "You spend money on witnesses who'll swear you were elsewhere. It works. It also teaches you exactly how this city is bought.",
        consequenceHints: ["Cunning rose"],
      },
    ],
  },
  {
    id: "s2_exploit",
    chapter: 2,
    title: "What It Bought You",
    setup:
      "The diversion worked. In the confusion you got into the records house and out again with a councillor's correspondence. The stranger did not survive the patrol. Their name was Corin. You know that now because it's on a list of the dead, and because you can't stop reading it.",
    atmosphere: "Your room, the stolen letters spread on the bed, one lamp turned low.",
    choices: [
      {
        id: "sell",
        label: "Sell the letters to the highest bidder",
        effects: [
          { stat: "ambition", delta: 6 },
          { stat: "cunning", delta: 3 },
          { stat: "empathy", delta: -3 },
        ],
        hiddenEffects: [{ axis: "ruthlessness", delta: 6 }, { axis: "betrayal", delta: 4 }],
        archetypeHints: [{ id: "opportunist", weight: 3 }, { id: "manipulator", weight: 2 }],
        flags: ["sold_secrets"],
        nextScene: "s3_offer",
        outcomeText:
          "Two buyers, one price, paid twice. You are suddenly a person with resources and a very specific reputation.",
        consequenceHints: ["Ambition rose", "Ruthlessness rose"],
      },
      {
        id: "guilt",
        label: "Use them to expose the arson — for Corin",
        effects: [
          { stat: "courage", delta: 4 },
          { stat: "empathy", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 6 }, { axis: "sacrifice", delta: 4 }],
        archetypeHints: [{ id: "idealist", weight: 2 }, { id: "protector", weight: 1 }],
        flags: ["atoned_for_corin"],
        nextScene: "s3_offer",
        outcomeText:
          "You can't give Corin their life back. You can give their death a use. You start copying the letters for a press you don't yet trust.",
        consequenceHints: ["Integrity rose", "You carry a debt now"],
      },
      {
        id: "keep",
        label: "Keep them. Say nothing. Watch.",
        effects: [
          { stat: "cunning", delta: 5 },
          { stat: "discipline", delta: 4 },
        ],
        hiddenEffects: [{ axis: "attachment", delta: -3 }],
        archetypeHints: [{ id: "survivor", weight: 2 }, { id: "outsider", weight: 2 }],
        flags: ["hoarded_letters"],
        nextScene: "s3_offer",
        outcomeText:
          "You slide the letters under a floorboard and become, outwardly, no one. Inwardly you are keeping score.",
        consequenceHints: ["Cunning rose"],
      },
    ],
  },

  /* --------------------------- Chapter III -------------------------- */
  {
    id: "s3_offer",
    chapter: 3,
    title: "The Patron",
    setup:
      "A woman finds you — Iren Vosk, who funds half the printers and blackmails the other half. She knows what you've been doing. She offers a partnership: her network, her money, her protection. In return, when she asks for something, you don't ask why.",
    atmosphere: "A greenhouse above the fog line, orchids, the smell of warm glass.",
    choices: [
      {
        id: "accept",
        label: "Accept the partnership",
        effects: [
          { stat: "ambition", delta: 6 },
          { stat: "trust", delta: 3 },
          { stat: "discipline", delta: -2 },
        ],
        hiddenEffects: [{ axis: "loyalty", delta: 4 }, { axis: "integrity", delta: -4 }],
        archetypeHints: [{ id: "ruler", weight: 2 }, { id: "opportunist", weight: 1 }],
        flags: ["took_patron_power"],
        nextScene: "s4_ally",
        outcomeText:
          "You shake her hand. Doors open the same afternoon. So does a ledger of things you now owe.",
        consequenceHints: ["Ambition rose", "You are in Vosk's debt"],
      },
      {
        id: "refuse",
        label: "Refuse and keep your hands free",
        effects: [
          { stat: "courage", delta: 4 },
          { stat: "discipline", delta: 3 },
          { stat: "ambition", delta: -2 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 6 }, { axis: "risk", delta: 4 }],
        archetypeHints: [{ id: "idealist", weight: 2 }, { id: "rebel", weight: 2 }],
        flags: ["refused_patron"],
        nextScene: "s4_ally",
        outcomeText:
          "'A pity,' Vosk says, not unkindly. 'You'll do the right things and lose anyway.' You leave with nothing but yourself, which was the point.",
        consequenceHints: ["Integrity rose", "You have no protection now"],
      },
      {
        id: "negotiate",
        label: "Negotiate narrower terms",
        description: "Take the help. Refuse the blank cheque.",
        effects: [
          { stat: "cunning", delta: 5 },
          { stat: "ambition", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 1 }],
        archetypeHints: [{ id: "diplomat", weight: 3 }, { id: "strategist", weight: 1 }],
        flags: ["partial_deal"],
        nextScene: "s4_ally",
        outcomeText:
          "You give her three specific favours in writing and nothing open-ended. She signs, amused. 'You'll be harder to kill than the last one,' she says. 'Good.'",
        consequenceHints: ["Cunning rose"],
      },
      {
        id: "turn_on_her",
        label: "See through her — and say so out loud",
        description: "Name what she's really building. Watch her recalculate.",
        requirements: [{ scope: "stat", key: "cunning", op: "gte", value: 58 }],
        effects: [
          { stat: "cunning", delta: 4 },
          { stat: "courage", delta: 4 },
          { stat: "ambition", delta: 4 },
        ],
        hiddenEffects: [
          { axis: "ruthlessness", delta: 4 },
          { axis: "integrity", delta: 2 },
        ],
        archetypeHints: [
          { id: "manipulator", weight: 2 },
          { id: "ruler", weight: 2 },
          { id: "renegade", weight: 1 },
        ],
        flags: ["challenged_patron"],
        nextScene: "s4_ally",
        outcomeText:
          "You lay out her plan for the granary, the succession she's engineering, the war she needs. She goes very still, then pours you a drink. 'Partners, then,' she says. 'Real ones.' You've made a powerful friend and a worse enemy in the same breath.",
        consequenceHints: ["You out-read the patron", "Ambition rose"],
      },
    ],
  },

  /* --------------------------- Chapter IV --------------------------- */
  {
    id: "s4_ally",
    chapter: 4,
    title: "The Accusation",
    setup:
      "The printer who helped you — Della, who has fed you and hidden you and never once asked your real name — is arrested at dawn. The charge is the east gate killing. Someone gave the watch her name, with details only a handful of people knew. One of them is you. The others are in Vosk's circle.",
    atmosphere: "The square outside the watch-house, frost, a small crowd already gathering.",
    choices: [
      {
        id: "defend",
        label: "Stand up publicly and vouch for her",
        effects: [
          { stat: "courage", delta: 6 },
          { stat: "empathy", delta: 3 },
          { stat: "cunning", delta: -2 },
        ],
        hiddenEffects: [
          { axis: "loyalty", delta: 8 },
          { axis: "sacrifice", delta: 5 },
        ],
        archetypeHints: [
          { id: "protector", weight: 3 },
          { id: "guardian", weight: 2 },
        ],
        flags: ["defended_ally"],
        nextScene: "s5_square",
        outcomeText:
          "You put your face and your voice on the record in front of forty witnesses. The watch now has your description too. Della meets your eyes through the bars and mouths: why.",
        consequenceHints: ["Loyalty rose", "You are exposed now"],
      },
      {
        id: "investigate",
        label: "Say nothing — find who really named her",
        effects: [
          { stat: "cunning", delta: 6 },
          { stat: "discipline", delta: 4 },
        ],
        hiddenEffects: [{ axis: "loyalty", delta: 2 }, { axis: "risk", delta: 3 }],
        archetypeHints: [
          { id: "strategist", weight: 2 },
          { id: "survivor", weight: 1 },
        ],
        flags: ["investigating_leak"],
        nextScene: "s5_alone",
        outcomeText:
          "You let the crowd disperse and start pulling threads. By nightfall you have it: the name came from Vosk's own secretary, on Vosk's instruction. Della is bait, and you are the fish.",
        consequenceHints: ["Cunning rose", "You know who betrayed her"],
      },
      {
        id: "abandon",
        label: "Cut contact and protect yourself",
        effects: [
          { stat: "discipline", delta: 4 },
          { stat: "empathy", delta: -6 },
          { stat: "trust", delta: -3 },
        ],
        hiddenEffects: [
          { axis: "loyalty", delta: -10 },
          { axis: "betrayal", delta: 6 },
          { axis: "attachment", delta: -5 },
        ],
        archetypeHints: [
          { id: "survivor", weight: 3 },
          { id: "outsider", weight: 2 },
        ],
        flags: ["abandoned_ally"],
        nextScene: "s5_alone",
        outcomeText:
          "You burn the letters that connect you to Della and move to a new room across the river. She has a lawyer. She does not have you. You tell yourself that's the same as safe.",
        consequenceHints: ["Loyalty collapsed", "You are alone now"],
      },
      {
        id: "trade",
        label: "Offer the watch a bigger name for her freedom",
        description: "Give them the granary plot. Spend your leverage on her.",
        requirements: [
          { scope: "flag", key: "knows_the_proof", value: true },
        ],
        effects: [
          { stat: "courage", delta: 4 },
          { stat: "cunning", delta: 3 },
          { stat: "ambition", delta: -2 },
        ],
        hiddenEffects: [
          { axis: "sacrifice", delta: 6 },
          { axis: "loyalty", delta: 6 },
          { axis: "integrity", delta: 3 },
        ],
        archetypeHints: [
          { id: "protector", weight: 2 },
          { id: "martyr", weight: 2 },
        ],
        flags: ["traded_leverage_for_ally", "granary_plot_exposed"],
        nextScene: "s5_square",
        outcomeText:
          "You hand a sceptical watch-captain enough to arrest three mercenaries and a shipping clerk. Della walks free by afternoon. Your leverage is gone, and everyone who had plans for it knows exactly who spent it.",
        consequenceHints: ["Sacrifice rose", "You spent your protection on a friend"],
      },
    ],
  },

  /* --------------------------- Chapter V ---------------------------- */
  {
    id: "s5_square",
    chapter: 5,
    title: "The Crowd Turns",
    setup:
      "Your public stand has consequences. By dusk a crowd has formed outside the watch-house — hundreds now, angry, half of them shouting Reyn's name, half shouting yours. It could become a rescue. It could become a riot. They are looking to someone to tell them which.",
    atmosphere: "Torches, breath fog, the low roar of too many people in one street.",
    choices: [
      {
        id: "calm",
        label: "Climb up and calm them down",
        effects: [
          { stat: "empathy", delta: 5 },
          { stat: "discipline", delta: 4 },
          { stat: "courage", delta: 3 },
        ],
        hiddenEffects: [{ axis: "selflessness", delta: 4 }],
        archetypeHints: [
          { id: "diplomat", weight: 3 },
          { id: "protector", weight: 1 },
        ],
        flags: ["calmed_crowd"],
        nextScene: "s6_fire",
        outcomeText:
          "You find a cart and a voice you didn't know you had. You give them a plan instead of a fight — witnesses, a petition, a dawn deadline. The crowd holds. Barely.",
        consequenceHints: ["Empathy rose", "The city did not burn tonight"],
      },
      {
        id: "incite",
        label: "Point them at Reyn's house",
        effects: [
          { stat: "chaos", delta: 7 },
          { stat: "courage", delta: 4 },
          { stat: "empathy", delta: -3 },
        ],
        hiddenEffects: [
          { axis: "ruthlessness", delta: 5 },
          { axis: "risk", delta: 6 },
        ],
        archetypeHints: [
          { id: "catalyst", weight: 3 },
          { id: "rebel", weight: 2 },
        ],
        flags: ["incited_crowd"],
        nextScene: "s6_fire",
        outcomeText:
          "You name the address. The crowd moves like weather. Reyn's household flees out the back; his study is aflame within the hour. It works. It also cannot be taken back.",
        consequenceHints: ["Chaos rose", "You started something"],
      },
      {
        id: "redirect",
        label: "Redirect them to guard the granary",
        description: "Turn the mob into a watch. Put the fear to use.",
        effects: [
          { stat: "cunning", delta: 5 },
          { stat: "discipline", delta: 4 },
          { stat: "courage", delta: 2 },
        ],
        hiddenEffects: [{ axis: "loyalty", delta: 3 }],
        archetypeHints: [
          { id: "strategist", weight: 3 },
          { id: "guardian", weight: 2 },
        ],
        flags: ["crowd_guards_granary"],
        nextScene: "s6_fire",
        outcomeText:
          "You tell them the real target and march four hundred furious people to the granary district. Whoever planned the next fire is now watching a wall of witnesses.",
        consequenceHints: ["Cunning rose"],
      },
      {
        id: "vanish_square",
        label: "Slip away and let it resolve itself",
        effects: [
          { stat: "discipline", delta: 3 },
          { stat: "empathy", delta: -4 },
        ],
        hiddenEffects: [
          { axis: "attachment", delta: -4 },
          { axis: "selflessness", delta: -5 },
        ],
        archetypeHints: [
          { id: "outsider", weight: 3 },
          { id: "wanderer", weight: 2 },
        ],
        flags: ["abandoned_crowd"],
        nextScene: "s6_fire",
        outcomeText:
          "You ease out through a side lane. Behind you the noise peaks, then breaks into scattered running. You never learn how many were hurt because you decided not to.",
        consequenceHints: ["You kept clear", "Selflessness fell"],
      },
    ],
  },
  {
    id: "s5_alone",
    chapter: 5,
    title: "The Quiet Version",
    setup:
      "You kept your head down, and now you're working in the dark with what you know: Vosk engineered Della's arrest to flush you out, and the granary burns in one night unless someone stops it. No crowd. No patron. Just you and a short list of people who might help.",
    atmosphere: "A cold attic, a map of the granary district, a single candle guttering.",
    choices: [
      {
        id: "warn",
        label: "Warn the granary keepers directly",
        effects: [
          { stat: "courage", delta: 5 },
          { stat: "empathy", delta: 3 },
        ],
        hiddenEffects: [{ axis: "selflessness", delta: 5 }, { axis: "risk", delta: 4 }],
        archetypeHints: [
          { id: "protector", weight: 3 },
          { id: "guardian", weight: 1 },
        ],
        flags: ["warned_granary"],
        nextScene: "s6_fire",
        outcomeText:
          "You spend the night convincing skeptical foremen with nothing but a stolen date and your own conviction. Three of five believe you enough to post guards.",
        consequenceHints: ["Selflessness rose"],
      },
      {
        id: "confront_vosk",
        label: "Confront Vosk alone",
        effects: [
          { stat: "courage", delta: 6 },
          { stat: "cunning", delta: 3 },
          { stat: "ambition", delta: 3 },
        ],
        hiddenEffects: [
          { axis: "risk", delta: 7 },
          { axis: "ruthlessness", delta: 3 },
        ],
        archetypeHints: [
          { id: "renegade", weight: 3 },
          { id: "ruler", weight: 1 },
        ],
        flags: ["confronted_vosk"],
        nextScene: "s6_fire",
        outcomeText:
          "You walk into the greenhouse unarmed and tell her you know. She doesn't deny it. 'Then you understand,' she says, 'that stopping me is the same as choosing a side in the war I'm preventing.' You leave less certain than you came.",
        consequenceHints: ["Risk rose", "Vosk knows you'll move against her"],
      },
      {
        id: "frame",
        label: "Leak the plot to the watch anonymously",
        effects: [
          { stat: "cunning", delta: 6 },
          { stat: "discipline", delta: 3 },
        ],
        hiddenEffects: [{ axis: "integrity", delta: 2 }],
        archetypeHints: [
          { id: "strategist", weight: 3 },
          { id: "survivor", weight: 1 },
        ],
        flags: ["leaked_plot"],
        nextScene: "s6_fire",
        outcomeText:
          "You write it all down in a hand that isn't yours and slide it under the watch-house door. It might work. It might vanish into the same pockets that lit the first fire.",
        consequenceHints: ["Cunning rose"],
      },
      {
        id: "leave_alone",
        label: "Accept you can't stop it and get clear",
        effects: [
          { stat: "discipline", delta: 4 },
          { stat: "courage", delta: -4 },
          { stat: "empathy", delta: -3 },
        ],
        hiddenEffects: [
          { axis: "selflessness", delta: -6 },
          { axis: "risk", delta: -5 },
        ],
        archetypeHints: [
          { id: "wanderer", weight: 3 },
          { id: "outsider", weight: 2 },
        ],
        flags: ["gave_up_granary"],
        nextScene: "s6_fire",
        outcomeText:
          "You find a bolt-hole two districts away and wait. Around midnight the sky to the north goes orange. You watch it through a dirty window and feel exactly what you expected to feel.",
        consequenceHints: ["You saved yourself", "Selflessness fell"],
      },
    ],
  },

  /* --------------------------- Chapter VI --------------------------- */
  {
    id: "s6_fire",
    chapter: 6,
    title: "The Granary",
    setup:
      "It happens the way these things do — fast, and then all at once. Fire on the granary roof, a bucket line that isn't enough, and inside: sacks of grain that feed the poor quarter through winter, a night crew who didn't get out, and, if the rumours are right, the ledger evidence Vosk stored where no one would look for it.",
    atmosphere: "Heat you can feel across the street, sparks like a second sky, someone screaming a name.",
    choices: [
      {
        id: "save_people",
        label: "Go in for the trapped crew",
        effects: [
          { stat: "courage", delta: 8 },
          { stat: "empathy", delta: 4 },
        ],
        hiddenEffects: [
          { axis: "sacrifice", delta: 10 },
          { axis: "selflessness", delta: 8 },
          { axis: "risk", delta: 8 },
        ],
        archetypeHints: [
          { id: "protector", weight: 3 },
          { id: "martyr", weight: 2 },
        ],
        flags: ["saved_crew"],
        nextScene: "s7_reckoning",
        outcomeText:
          "You go in twice. The second time the beam comes down where you were standing. You drag out two people and a lifetime of smoke in your lungs. The grain is gone. The crew is not.",
        consequenceHints: ["Sacrifice rose sharply", "Courage rose"],
      },
      {
        id: "save_grain",
        label: "Organise the line to save the grain",
        effects: [
          { stat: "discipline", delta: 6 },
          { stat: "empathy", delta: 3 },
          { stat: "courage", delta: 2 },
        ],
        hiddenEffects: [{ axis: "selflessness", delta: 5 }, { axis: "loyalty", delta: 3 }],
        archetypeHints: [
          { id: "guardian", weight: 3 },
          { id: "diplomat", weight: 1 },
        ],
        flags: ["saved_grain"],
        nextScene: "s7_reckoning",
        outcomeText:
          "You take command of the chaos and turn a panicking mob into a machine. You save two-thirds of the winter stores. The night crew and the evidence both burn while you're counting sacks.",
        consequenceHints: ["Discipline rose", "The poor quarter will eat this winter"],
      },
      {
        id: "save_evidence",
        label: "Get the ledger before it burns",
        effects: [
          { stat: "cunning", delta: 6 },
          { stat: "ambition", delta: 5 },
          { stat: "empathy", delta: -3 },
        ],
        hiddenEffects: [
          { axis: "ruthlessness", delta: 6 },
          { axis: "risk", delta: 6 },
        ],
        archetypeHints: [
          { id: "strategist", weight: 2 },
          { id: "opportunist", weight: 2 },
          { id: "renegade", weight: 1 },
        ],
        flags: ["saved_evidence"],
        nextScene: "s7_reckoning",
        outcomeText:
          "You know where Vosk would hide it and you're right. You come out coughing, eyebrows gone, with a scorched ledger that can end three careers. People died in the room you didn't check.",
        consequenceHints: ["You hold the proof", "Ruthlessness rose"],
      },
      {
        id: "save_self",
        label: "Pull back — it's already lost",
        effects: [
          { stat: "discipline", delta: 3 },
          { stat: "courage", delta: -5 },
          { stat: "empathy", delta: -4 },
        ],
        hiddenEffects: [
          { axis: "selflessness", delta: -8 },
          { axis: "risk", delta: -6 },
          { axis: "attachment", delta: -3 },
        ],
        archetypeHints: [
          { id: "survivor", weight: 3 },
          { id: "outsider", weight: 2 },
        ],
        flags: ["saved_self"],
        nextScene: "s7_reckoning",
        outcomeText:
          "You read the fire, do the math, and step back to a safe distance while others run forward. You are unhurt. You will be unhurt for a long time, in the specific way that costs something.",
        consequenceHints: ["You are unharmed", "Selflessness fell hard"],
      },
    ],
  },

  /* --------------------------- Chapter VII -------------------------- */
  {
    id: "s7_reckoning",
    chapter: 7,
    title: "The Reckoning",
    terminal: true,
    setup:
      "Morning. The granary is a black ribcage against the sky. The city wants an answer and it wants it today — a name to hang the fire on, a story it can live with. Vosk offers you a version where Reyn takes everything and she keeps building. The watch offers you a version where Della does, and you walk. And you are holding, in your head or your hands, enough truth to write a third version that spares no one, including you.",
    atmosphere: "Grey light, the taste of ash, a room full of people waiting for you to speak.",
    choices: [
      {
        id: "take_blame",
        label: "Take responsibility yourself",
        description: "Stand up. Say it was you who could have stopped it and didn't, soon enough.",
        effects: [
          { stat: "courage", delta: 6 },
          { stat: "empathy", delta: 4 },
          { stat: "ambition", delta: -4 },
        ],
        hiddenEffects: [
          { axis: "integrity", delta: 10 },
          { axis: "sacrifice", delta: 10 },
          { axis: "selflessness", delta: 8 },
        ],
        archetypeHints: [
          { id: "martyr", weight: 3 },
          { id: "protector", weight: 2 },
          { id: "idealist", weight: 1 },
        ],
        flags: ["took_blame"],
        nextScene: "__end__",
        outcomeText:
          "You give them the whole truth and put yourself at the centre of it. It is not the version anyone wanted. It is the one they believe.",
      },
      {
        id: "name_another",
        label: "Give them the name they're asking for",
        description: "Reyn, or Della, or whoever ends this quickest for you.",
        effects: [
          { stat: "cunning", delta: 5 },
          { stat: "ambition", delta: 5 },
          { stat: "empathy", delta: -5 },
        ],
        hiddenEffects: [
          { axis: "betrayal", delta: 10 },
          { axis: "ruthlessness", delta: 8 },
          { axis: "integrity", delta: -8 },
        ],
        archetypeHints: [
          { id: "manipulator", weight: 3 },
          { id: "opportunist", weight: 2 },
          { id: "survivor", weight: 1 },
        ],
        flags: ["named_another"],
        nextScene: "__end__",
        outcomeText:
          "You say the name clearly and let the room exhale. Someone else's life folds shut. Yours opens back up. You will think about the trade more than you expect to.",
      },
      {
        id: "burn_it_all",
        label: "Expose everyone — Vosk, Reyn, the watch, all of it",
        description: "No clean story. Just the ledger, read aloud, until there's nothing left standing.",
        effects: [
          { stat: "courage", delta: 5 },
          { stat: "chaos", delta: 8 },
          { stat: "cunning", delta: 2 },
        ],
        hiddenEffects: [
          { axis: "integrity", delta: 8 },
          { axis: "risk", delta: 10 },
          { axis: "loyalty", delta: -4 },
        ],
        archetypeHints: [
          { id: "catalyst", weight: 3 },
          { id: "rebel", weight: 2 },
          { id: "renegade", weight: 1 },
        ],
        flags: ["burned_it_all"],
        nextScene: "__end__",
        outcomeText:
          "You read every name. The council falls in a week, the courts in a month. What comes next is anyone's guess, and it is genuinely anyone's — which is either the point or the disaster, depending on who's telling it.",
      },
      {
        id: "walk_away_final",
        label: "Say nothing and leave the city for good",
        description: "Let them sort their own fire. You were never really here.",
        effects: [
          { stat: "discipline", delta: 4 },
          { stat: "empathy", delta: -3 },
          { stat: "ambition", delta: -3 },
        ],
        hiddenEffects: [
          { axis: "attachment", delta: -8 },
          { axis: "selflessness", delta: -4 },
          { axis: "risk", delta: -4 },
        ],
        archetypeHints: [
          { id: "wanderer", weight: 3 },
          { id: "outsider", weight: 3 },
        ],
        flags: ["walked_away"],
        nextScene: "__end__",
        outcomeText:
          "You are through the west gate before the meeting ends. The road takes you the way roads do. Behind you a city decides its own story, and your name is not in it.",
      },
    ],
  },
];

export const SCENE_BY_ID: Record<string, StoryScene> = Object.fromEntries(
  SCENES.map((s) => [s.id, s]),
);

export const FIRST_SCENE_ID = "s1_wall";
export const END_SENTINEL = "__end__";
export const TOTAL_CHAPTERS = 7;
