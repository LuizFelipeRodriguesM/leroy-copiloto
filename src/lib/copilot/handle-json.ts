import type { z } from "zod";
import { CopilotError } from "@/lib/copilot/gemini";

export async function handleJson<T extends z.ZodType>(
  request: Request,
  schema: T,
  run: (body: z.infer<T>) => Promise<unknown>,
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Não consegui ler o pedido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Faltou alguma informação no pedido. Confere e tenta de novo." }, { status: 400 });
  }

  try {
    return Response.json(await run(parsed.data));
  } catch (error) {
    if (error instanceof CopilotError) return Response.json({ error: error.message }, { status: error.status });
    console.error("[copilot] unexpected", error);
    return Response.json({ error: "Algo saiu do lugar por aqui. Tenta de novo?" }, { status: 500 });
  }
}
