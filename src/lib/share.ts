import type { CharacterGameState } from "@/game/types";

export function runSummary(state: CharacterGameState): string {
  const c = state.finalCard;
  const t = state.initialTraits;
  if (!c) return "An unfinished Loreloom character.";
  return [
    `${c.name} — ${c.archetypeTitle}`,
    `${t.vibe} ${t.species} ${t.role}`,
    "",
    c.openingLine,
    c.becameLine,
    "",
    `Ending: ${c.endingTitle} (${c.rarity})`,
    `${c.coreStats.map((s) => `${s.label} ${s.value}`).join(" · ")}`,
    "",
    "Played on Loreloom — choose who you appear to be, discover who you become.",
  ].join("\n");
}

export type ShareResult = "shared" | "copied" | "failed";

export async function shareRun(state: CharacterGameState): Promise<ShareResult> {
  const text = runSummary(state);
  const title = state.finalCard
    ? `${state.finalCard.name} — ${state.finalCard.archetypeTitle}`
    : "Loreloom";
  const nav = typeof navigator !== "undefined" ? navigator : undefined;

  if (nav?.share) {
    try {
      await nav.share({ title, text });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "shared";
    }
  }

  try {
    await nav?.clipboard?.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
