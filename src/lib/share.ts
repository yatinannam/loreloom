import type { GeneratedCharacter, CharacterTraits } from "./types";

export function characterSummary(
  c: GeneratedCharacter,
  t: CharacterTraits,
): string {
  return [
    `${c.name} — ${c.title}`,
    `"${c.oneLiner}"`,
    ``,
    `${t.vibe} ${t.species} ${t.role}`,
    `Strengths: ${c.strengths.join(", ")}`,
    `Flaws: ${c.flaws.join(", ")}`,
    ``,
    `Woven with Loreloom · weave a character, discover their story`,
  ].join("\n");
}

export type ShareResult = "shared" | "copied" | "failed";

export async function shareCharacter(
  c: GeneratedCharacter,
  t: CharacterTraits,
): Promise<ShareResult> {
  const text = characterSummary(c, t);
  const nav = typeof navigator !== "undefined" ? navigator : undefined;

  if (nav?.share) {
    try {
      await nav.share({ title: `${c.name} — ${c.title}`, text });
      return "shared";
    } catch (err) {
      // user cancelled the share sheet — not an error worth surfacing
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
