import type { CharacterGameState } from "@/game/types";

export interface Enhancement {
  legacy: string;
  epilogue: string;
}

function buildInput(state: CharacterGameState) {
  const card = state.finalCard;
  const ending = state.ending;
  const t = state.initialTraits;
  return {
    name: card?.name ?? "Unknown",
    archetypeTitle: card?.archetypeTitle ?? "The Wanderer",
    species: t.species,
    role: t.role,
    vibe: t.vibe,
    openingLine: card?.openingLine ?? "",
    becameLine: card?.becameLine ?? "",
    endingTitle: ending?.title ?? "The Reckoner",
    endingNarrative: ending?.narrative ?? "",
    alignment: ending?.alignment ?? "",
    decisions: state.decisions.map((d) => `${d.sceneTitle}: ${d.choiceLabel}`),
    topStats: (card?.coreStats ?? []).map((s) => `${s.label} ${s.value}`),
  };
}

/**
 * Ask the optional server route to enrich the run's prose. Returns null on any
 * failure — the caller keeps the deterministic local text.
 */
export async function requestEnhancement(
  state: CharacterGameState,
  timeoutMs = 9000,
): Promise<Enhancement | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildInput(state)),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (
      data &&
      typeof data === "object" &&
      (data as { enhanced?: unknown }).enhanced === true &&
      typeof (data as { legacy?: unknown }).legacy === "string" &&
      typeof (data as { epilogue?: unknown }).epilogue === "string"
    ) {
      const d = data as { legacy: string; epilogue: string };
      return { legacy: d.legacy, epilogue: d.epilogue };
    }
    return null;
  } catch {
    return null;
  }
}
