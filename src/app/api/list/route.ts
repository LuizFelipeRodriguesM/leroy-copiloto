import { CopilotError, generateJson } from "@/lib/copilot/gemini";
import { handleJson } from "@/lib/copilot/handle-json";
import { listPrompt, listSystem } from "@/lib/copilot/prompts";
import { listDraftSchema, listRequestSchema } from "@/lib/copilot/schemas";
import { resolveList } from "@/lib/copilot/shopping-list";

export const maxDuration = 60;

export async function POST(request: Request) {
  return handleJson(request, listRequestSchema, async ({ problem, summary, answers }) => {
    const draft = await generateJson({
      schema: listDraftSchema,
      parts: [{ text: listPrompt(problem, summary, answers) }],
      system: listSystem,
    });
    const list = resolveList(draft);
    if (!list.items.length) throw new CopilotError("Não achei nada no catálogo pra esse problema. Melhor falar com um vendedor.", 422);
    return list;
  });
}
