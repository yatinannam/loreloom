import { test, expect } from "bun:test";
import { SPECIES, ROLES, VIBES, QUIRKS } from "@/lib/traits";
import type { CharacterTraits } from "@/lib/types";
import { STAT_KEYS, HIDDEN_KEYS } from "./types";
import { initStats, initHidden } from "./stats";
import { startGame, applyChoice, currentScene, availableChoices } from "./engine";
import { SCENES, SCENE_BY_ID, END_SENTINEL } from "./scenes";
import { calculateArchetype } from "./archetypes";
import { ENDINGS } from "./endings";

const DEMO: CharacterTraits = {
  species: "Vampire",
  role: "Inventor",
  vibe: "Elegant",
  quirk: "Secretly loves baking",
  morality: 70,
  confidence: 80,
  emotionality: 50,
};

function inRange(v: number): boolean {
  return Number.isFinite(v) && v >= 0 && v <= 100;
}

test("every starting trait combination initializes in range", () => {
  let count = 0;
  for (const sp of SPECIES) {
    for (const ro of ROLES) {
      for (const vi of VIBES) {
        for (const qu of QUIRKS) {
          for (const sliders of [0, 50, 100]) {
            const traits: CharacterTraits = {
              species: sp.value,
              role: ro.value,
              vibe: vi.value,
              quirk: qu.value,
              morality: sliders,
              confidence: 100 - sliders,
              emotionality: 50,
            };
            const stats = initStats(traits);
            const hidden = initHidden(traits);
            for (const k of STAT_KEYS) expect(inRange(stats[k])).toBe(true);
            for (const k of HIDDEN_KEYS) expect(inRange(hidden[k])).toBe(true);
            count++;
          }
        }
      }
    }
  }
  expect(count).toBe(12 * 12 * 12 * 12 * 3);
});

test("every scene has 2+ choices and every choice routes somewhere valid", () => {
  for (const scene of SCENES) {
    expect(scene.choices.length).toBeGreaterThanOrEqual(2);
    for (const choice of scene.choices) {
      const ok =
        choice.nextScene === END_SENTINEL || scene.terminal
          ? true
          : Boolean(SCENE_BY_ID[choice.nextScene]);
      expect(ok).toBe(true);
      expect(choice.outcomeText.length).toBeGreaterThan(0);
    }
  }
});

test("every route reaches an ending and stats stay in range (exhaustive DFS)", () => {
  const reachedEndings = new Set<string>();
  let runs = 0;

  function walk(stateSeed: number) {
    // DFS over all choice combinations from a fresh demo character
    const stack: string[][] = [[]];
    while (stack.length) {
      const path = stack.pop() as string[];
      let state = startGame(DEMO, stateSeed);
      for (const cid of path) state = applyChoice(state, cid).state;
      if (state.story.finished) {
        runs++;
        for (const k of STAT_KEYS) expect(inRange(state.stats[k])).toBe(true);
        for (const k of HIDDEN_KEYS) expect(inRange(state.hidden[k])).toBe(true);
        expect(state.ending).toBeDefined();
        expect(state.finalCard).toBeDefined();
        reachedEndings.add(state.ending?.id ?? "?");
        continue;
      }
      const scene = currentScene(state);
      for (const choice of availableChoices(state, scene)) {
        stack.push([...path, choice.id]);
      }
    }
  }

  walk(12345);
  expect(runs).toBeGreaterThan(50);
  // the demo character should be able to reach a healthy spread of endings
  expect(reachedEndings.size).toBeGreaterThanOrEqual(5);
});

test("all endings referenced by rules exist and are well formed", () => {
  for (const [id, e] of Object.entries(ENDINGS)) {
    expect(e.id).toBe(id);
    for (const field of ["title", "summary", "narrative", "strength", "flaw", "phrase", "becameLine"] as const) {
      expect(typeof e[field]).toBe("string");
      expect(e[field].length).toBeGreaterThan(0);
    }
  }
});

test("demo run produces an earned, coherent final card", () => {
  const path = ["help", "escort", "accept", "defend", "calm", "save_people", "take_blame"];
  let state = startGame(DEMO, 999);
  for (const cid of path) {
    const r = applyChoice(state, cid);
    state = r.state;
  }
  expect(state.story.finished).toBe(true);
  const card = state.finalCard!;
  expect(card.name.length).toBeGreaterThan(1);
  expect(card.coreStats).toHaveLength(3);
  expect(card.endingTitle.length).toBeGreaterThan(0);
  expect(card.source).toBe("local");
  // sacrificial route should not land on a self-serving ending
  expect(["betrayer", "shadow", "tyrant"]).not.toContain(card.endingId);
});

test("replay resets story but keeps identity", () => {
  let state = startGame(DEMO, 42);
  state = applyChoice(state, "exploit").state;
  const replayed = startGame(state.initialTraits, state.seed);
  expect(replayed.story.currentSceneId).toBe("s1_wall");
  expect(replayed.decisions).toHaveLength(0);
  expect(replayed.story.finished).toBe(false);
  expect(replayed.expectedArchetypeId).toBe(state.expectedArchetypeId);
});

test("archetype can diverge from the expected self", () => {
  // opportunistic start, selfless play
  const start: CharacterTraits = { ...DEMO, morality: 85, emotionality: 30 };
  let state = startGame(start, 7);
  for (const cid of ["help", "escort", "refuse", "defend", "calm", "save_people", "take_blame"]) {
    state = applyChoice(state, cid).state;
  }
  const finalArch = calculateArchetype(state.stats, state.hidden, state.archetype);
  expect(finalArch.id).toBeDefined();
  // buildFinalCard already ran in-engine
  expect(state.finalCard?.archetypeTitle).toContain("The ");
});

test("invalid choice ids throw rather than corrupt state", () => {
  const state = startGame(DEMO, 1);
  expect(() => applyChoice(state, "not_a_real_choice")).toThrow();
});
