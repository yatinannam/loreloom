import type { CharacterTraits } from "@/lib/types";
import type {
  CharacterGameState,
  StoryScene,
  StoryChoice,
  Requirement,
  ChoiceOutcome,
} from "./types";
import { initStats, initHidden, applyStatEffects, applyHiddenEffects } from "./stats";
import { archetypeFromSnapshot, emptyArchetypeProgress } from "./archetypes";
import {
  SCENES,
  SCENE_BY_ID,
  FIRST_SCENE_ID,
  END_SENTINEL,
} from "./scenes";
import { makeSeed } from "./random";
import { calculateEnding } from "./endings";
import { buildFinalCard } from "./card";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `run_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function startGame(
  traits: CharacterTraits,
  seed: number = makeSeed(),
): CharacterGameState {
  const stats = initStats(traits);
  const hidden = initHidden(traits);
  return {
    id: newId(),
    seed,
    createdAt: Date.now(),
    initialTraits: traits,
    expectedArchetypeId: archetypeFromSnapshot(stats, hidden),
    stats,
    hidden,
    archetype: emptyArchetypeProgress(),
    story: {
      currentSceneId: FIRST_SCENE_ID,
      chapter: 1,
      visited: [FIRST_SCENE_ID],
      flags: {},
      finished: false,
    },
    decisions: [],
  };
}

export function currentScene(state: CharacterGameState): StoryScene {
  return SCENE_BY_ID[state.story.currentSceneId] ?? SCENES[0];
}

function meetsRequirement(
  state: CharacterGameState,
  req: Requirement,
): boolean {
  if (req.scope === "flag") {
    return Boolean(state.story.flags[req.key]) === Boolean(req.value);
  }
  const pool =
    req.scope === "stat"
      ? (state.stats as Record<string, number>)
      : (state.hidden as Record<string, number>);
  const actual = pool[req.key];
  if (actual === undefined) return false;
  const target = Number(req.value);
  return req.op === "lte" ? actual <= target : actual >= target;
}

export function choiceIsAvailable(
  state: CharacterGameState,
  choice: StoryChoice,
): boolean {
  return (choice.requirements ?? []).every((r) => meetsRequirement(state, r));
}

export function availableChoices(
  state: CharacterGameState,
  scene: StoryScene = currentScene(state),
): StoryChoice[] {
  return scene.choices.filter((c) => choiceIsAvailable(state, c));
}

export interface ApplyResult {
  state: CharacterGameState;
  outcome: ChoiceOutcome;
}

export function applyChoice(
  state: CharacterGameState,
  choiceId: string,
): ApplyResult {
  if (state.story.finished) {
    return {
      state,
      outcome: { outcomeText: "", consequenceHints: [], finished: true },
    };
  }

  const scene = currentScene(state);
  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice || !choiceIsAvailable(state, choice)) {
    throw new Error(`Invalid choice "${choiceId}" for scene "${scene.id}"`);
  }

  const stats = applyStatEffects(state.stats, choice.effects);
  const hidden = applyHiddenEffects(state.hidden, choice.hiddenEffects);

  const scores = { ...state.archetype.scores };
  for (const hint of choice.archetypeHints ?? []) {
    if (hint.id in scores) scores[hint.id] += hint.weight;
  }

  const flags = { ...state.story.flags };
  for (const f of choice.flags ?? []) flags[f] = true;

  const decisions = [
    ...state.decisions,
    {
      sceneId: scene.id,
      sceneTitle: scene.title,
      choiceId: choice.id,
      choiceLabel: choice.label,
      chapter: scene.chapter,
      timestamp: Date.now(),
    },
  ];

  const isTerminal = scene.terminal || choice.nextScene === END_SENTINEL;
  const nextSceneId = isTerminal ? state.story.currentSceneId : choice.nextScene;
  const nextScene = SCENE_BY_ID[nextSceneId];

  let next: CharacterGameState = {
    ...state,
    stats,
    hidden,
    archetype: { scores },
    decisions,
    story: {
      ...state.story,
      currentSceneId: nextSceneId,
      chapter: isTerminal
        ? state.story.chapter
        : nextScene?.chapter ?? state.story.chapter + 1,
      visited: isTerminal
        ? state.story.visited
        : [...state.story.visited, nextSceneId],
      flags,
      finished: isTerminal,
    },
  };

  if (isTerminal) {
    const ending = calculateEnding(next);
    next = { ...next, ending };
    next = { ...next, finalCard: buildFinalCard(next) };
  }

  return {
    state: next,
    outcome: {
      outcomeText: choice.outcomeText,
      consequenceHints: choice.consequenceHints ?? [],
      finished: isTerminal,
    },
  };
}

export function isFinished(state: CharacterGameState): boolean {
  return state.story.finished;
}

/** Replay the same character: keep initial traits + seed, reset the story. */
export function replayCharacter(state: CharacterGameState): CharacterGameState {
  return startGame(state.initialTraits, state.seed);
}

/**
 * Deterministically play a run. Prefers each requested choice id; if that choice
 * isn't available for the current scene it falls back to the first available
 * choice, and once the requested list is exhausted it keeps taking the first
 * available choice until the run finishes. Always reaches an ending.
 */
export function playPath(
  traits: CharacterTraits,
  seed: number,
  choiceIds: string[],
): CharacterGameState {
  let state = startGame(traits, seed);
  let guard = 0;
  const wanted = [...choiceIds];
  while (!state.story.finished && guard++ < 64) {
    const scene = currentScene(state);
    const options = availableChoices(state, scene);
    if (options.length === 0) break;
    const want = wanted.shift();
    const pick = options.find((c) => c.id === want) ?? options[0];
    state = applyChoice(state, pick.id).state;
  }
  return state;
}
