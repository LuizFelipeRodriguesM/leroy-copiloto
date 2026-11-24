import { ThinkingLevel } from "@google/genai";
import { generateJson, imagePart } from "@/lib/copilot/gemini";
import { handleJson } from "@/lib/copilot/handle-json";
import { normalizeShelf } from "@/lib/copilot/normalize";
import { shelfPrompt, shelfSystem } from "@/lib/copilot/prompts";
import { shelfRequestSchema, shelfResultSchema } from "@/lib/copilot/schemas";

export const maxDuration = 60;

export async function POST(request: Request) {
  return handleJson(request, shelfRequestSchema, async ({ photo, target, problem }) => {
    const result = await generateJson({
      schema: shelfResultSchema,
      parts: [imagePart(photo), { text: shelfPrompt(target, problem) }],
      system: shelfSystem,
      task: "vision",
      thinking: ThinkingLevel.MEDIUM,
      temperature: 0.5,
      timeoutMs: 20_000,
    });
    return normalizeShelf(result);
  });
}
