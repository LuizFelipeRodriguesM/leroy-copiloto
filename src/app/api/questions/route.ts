import type { Part } from "@google/genai";
import { generateJson, imagePart } from "@/lib/copilot/gemini";
import { handleJson } from "@/lib/copilot/handle-json";
import { normalizeQuestions } from "@/lib/copilot/normalize";
import { questionsSystem } from "@/lib/copilot/prompts";
import { questionsRequestSchema, questionsResultSchema } from "@/lib/copilot/schemas";

export const maxDuration = 60;

export async function POST(request: Request) {
  return handleJson(request, questionsRequestSchema, async ({ problem, photo }) => {
    const parts: Part[] = [{ text: `Problema do cliente: "${problem}"` }];
    if (photo) parts.unshift(imagePart(photo));
    const result = await generateJson({ schema: questionsResultSchema, parts, system: questionsSystem });
    return normalizeQuestions(result);
  });
}
