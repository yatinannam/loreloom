import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  TraitsSchema,
  CharacterSchema,
  SYSTEM_PROMPT,
  buildUserPrompt,
} from "@/lib/character";
import type { GeneratedCharacter, CharacterTraits } from "@/lib/types";

type ResponseData =
  | { character: GeneratedCharacter }
  | { error: string; code: string };

export const config = {
  api: { bodyParser: { sizeLimit: "8kb" } },
  maxDuration: 30,
};

const FRIENDLY = "Something went sideways in the loom. Try weaving again.";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed", code: "method" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error:
        "The loom has no thread — ANTHROPIC_API_KEY is not configured on the server.",
      code: "no_key",
    });
  }

  const parsedTraits = TraitsSchema.safeParse(req.body);
  if (!parsedTraits.success) {
    return res.status(400).json({
      error: "Those trait selections don't look complete. Pick one of each.",
      code: "bad_input",
    });
  }
  const traits = parsedTraits.data as CharacterTraits;

  const client = new Anthropic();

  try {
    const message = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      output_config: {
        effort: "low",
        format: zodOutputFormat(CharacterSchema),
      },
      messages: [{ role: "user", content: buildUserPrompt(traits) }],
    });

    if (message.stop_reason === "refusal") {
      return res
        .status(422)
        .json({ error: "The loom refused this pattern. Try different traits.", code: "refusal" });
    }

    const character = message.parsed_output;
    if (!character) {
      return res.status(502).json({ error: FRIENDLY, code: "malformed" });
    }

    return res.status(200).json({ character: character as GeneratedCharacter });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res
        .status(500)
        .json({ error: "The loom's key was rejected. Check the server config.", code: "auth" });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res
        .status(429)
        .json({ error: "The loom is overworked right now. Give it a moment, then retry.", code: "rate_limit" });
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(502).json({ error: FRIENDLY, code: "api" });
    }
    return res.status(500).json({ error: FRIENDLY, code: "unknown" });
  }
}
