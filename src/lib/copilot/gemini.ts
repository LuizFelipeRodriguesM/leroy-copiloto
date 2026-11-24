import { ApiError, GoogleGenAI, ThinkingLevel, type Part } from "@google/genai";
import { z } from "zod";

export type ModelTask = "text" | "vision";

const MODEL_CHAINS: Record<ModelTask, string[]> = {
  text: [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
  ],
  vision: [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
  ],
};
const MODEL_ENV: Record<ModelTask, string> = {
  text: "GEMINI_TEXT_MODELS",
  vision: "GEMINI_VISION_MODELS",
};
const KEY_ERROR_STATUS = new Set([401, 403]);
const BUSY_STATUS = new Set([429, 503, 504]);
const DEFAULT_TIMEOUT_MS = 15_000;
const DEADLINE_MS = 54_000;
const MIN_ATTEMPT_MS = 4_000;
const QUOTA_COOLDOWN_MS = 30 * 60_000;
const BUSY_COOLDOWN_MS = 60_000;

const resting = new Map<string, number>();

const isResting = (model: string) => (resting.get(model) ?? 0) > Date.now();

const rest = (model: string, status: number | undefined) => {
  if (status === 429) resting.set(model, Date.now() + QUOTA_COOLDOWN_MS);
  else if (status === undefined || status === 503 || status === 504) resting.set(model, Date.now() + BUSY_COOLDOWN_MS);
};

const describeError = (error: unknown) => {
  if (error instanceof ApiError) return String(error.status);
  if (error instanceof z.ZodError) return "invalid-json";
  if (error instanceof Error) return error.name;
  return "unknown";
};

export class CopilotError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let client: GoogleGenAI | null = null;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new CopilotError("O Charles está sem a chave do Gemini no servidor.", 500);
  client ??= new GoogleGenAI({ apiKey });
  return client;
};

const modelsFor = (task: ModelTask) => {
  const override = process.env[MODEL_ENV[task]]
    ?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  return override?.length ? override : MODEL_CHAINS[task];
};

const toGeminiSchema = (schema: z.ZodType) => {
  const jsonSchema = z.toJSONSchema(schema, { target: "draft-7", io: "output" }) as Record<string, unknown>;
  delete jsonSchema.$schema;
  return jsonSchema;
};

type GenerateJsonOptions<T extends z.ZodType> = {
  schema: T;
  parts: Part[];
  system: string;
  task?: ModelTask;
  thinking?: ThinkingLevel;
  temperature?: number;
  timeoutMs?: number;
};

export async function generateJson<T extends z.ZodType>({
  schema,
  parts,
  system,
  task = "text",
  thinking = ThinkingLevel.LOW,
  temperature = 0.4,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: GenerateJsonOptions<T>): Promise<z.infer<T>> {
  const responseJsonSchema = toGeminiSchema(schema);
  const deadline = Date.now() + DEADLINE_MS;
  const chain = modelsFor(task);
  const available = chain.filter((model) => !isResting(model));
  const attempts: string[] = [];
  let busy = available.length < chain.length;

  for (const model of available.length ? available : chain) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;
    try {
      const response = await getClient().models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: system,
          responseMimeType: "application/json",
          responseJsonSchema,
          temperature,
          thinkingConfig: { thinkingLevel: thinking },
          httpOptions: { timeout: Math.min(timeoutMs, remaining) },
        },
      });
      const parsed = schema.safeParse(JSON.parse(response.text ?? ""));
      if (parsed.success) return parsed.data;
      attempts.push(`${model}: ${describeError(parsed.error)}`);
    } catch (error) {
      if (error instanceof CopilotError) throw error;
      if (error instanceof ApiError && KEY_ERROR_STATUS.has(error.status)) {
        throw new CopilotError("A chave do Gemini no servidor não foi aceita.", 500);
      }
      const status = error instanceof ApiError ? error.status : undefined;
      if (status === undefined || BUSY_STATUS.has(status)) busy = true;
      rest(model, status);
      attempts.push(`${model}: ${describeError(error)}`);
    }
  }

  console.error(`[copilot] gemini failed (${task}): ${attempts.join(", ") || "no model available"}`);
  if (busy) throw new CopilotError("A IA do Charles está no limite de uso agora. Tenta de novo daqui a pouco?", 503);
  throw new CopilotError("O Charles se enrolou aqui. Tenta de novo em alguns segundos?", 502);
}

export const imagePart = (dataUrl: string): Part => {
  const [header, data] = dataUrl.split(",", 2);
  const mimeType = header.slice("data:".length, header.indexOf(";"));
  return { inlineData: { mimeType, data } };
};
