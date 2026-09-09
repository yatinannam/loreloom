import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * OPTIONAL narrative enhancement. The game is fully playable without this route.
 * It never returns an error to the client — on a missing key, a model failure,
 * a timeout or malformed output it responds `{ enhanced: false }` and the client
 * keeps the deterministic local prose.
 */

export const config = {
  api: { bodyParser: { sizeLimit: "16kb" } },
  maxDuration: 20,
};

const InputSchema = z.object({
  name: z.string().max(80),
  archetypeTitle: z.string().max(80),
  species: z.string().max(40),
  role: z.string().max(40),
  vibe: z.string().max(40),
  openingLine: z.string().max(200),
  becameLine: z.string().max(200),
  endingTitle: z.string().max(80),
  endingNarrative: z.string().max(1200),
  alignment: z.string().max(60),
  decisions: z.array(z.string().max(200)).max(12),
  topStats: z.array(z.string().max(40)).max(4),
});

const OutputSchema = z.object({
  legacy: z.string().min(1),
  epilogue: z.string().min(1),
});

type Data = { enhanced: false } | { enhanced: true; legacy: string; epilogue: string };

const SYSTEM = `You are the narrative voice of Loreloom, a story game. The player has finished a run. You are given the DETERMINISTIC outcome the game already computed — the archetype they earned, the ending they reached, the choices they made. Do not change any of it.

Write two short pieces of second-person prose that make the earned outcome land emotionally:
- "legacy": 2-3 sentences. The through-line of who this character became, grounded in their specific choices. Concrete, restrained, a little haunting. No fantasy cliches, no purple prose, no restating the trait list.
- "epilogue": 1-2 sentences. A final image of where they are now.

Stay consistent with the given ending and archetype. Return only the requested fields.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(200).json({ enhanced: false });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json({ enhanced: false });
  }

  const parsed = InputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(200).json({ enhanced: false });
  const g = parsed.data;

  const userPrompt = [
    `Character: ${g.name}, ${g.archetypeTitle}.`,
    `Appeared as: ${g.vibe} ${g.species} ${g.role}.`,
    `${g.openingLine} ${g.becameLine}`,
    `Ending reached: ${g.endingTitle} — alignment ${g.alignment}.`,
    `Ending context: ${g.endingNarrative}`,
    `Defining stats: ${g.topStats.join(", ")}.`,
    `Choices they made, in order:`,
    ...g.decisions.map((d, i) => `${i + 1}. ${d}`),
  ].join("\n");

  try {
    const client = new Anthropic();
    const message = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 900,
      system: SYSTEM,
      output_config: {
        effort: "low",
        format: zodOutputFormat(OutputSchema),
      },
      messages: [{ role: "user", content: userPrompt }],
    });

    if (message.stop_reason === "refusal" || !message.parsed_output) {
      return res.status(200).json({ enhanced: false });
    }
    const { legacy, epilogue } = message.parsed_output;
    return res.status(200).json({ enhanced: true, legacy, epilogue });
  } catch {
    return res.status(200).json({ enhanced: false });
  }
}
