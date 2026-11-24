import { z } from "zod";

export const optionIcons = [
  "wall",
  "countertop",
  "bathroom",
  "kitchen",
  "outdoor",
  "ceiling",
  "floor",
  "drywall",
  "masonry",
  "wood",
  "tile",
  "yes",
  "no",
  "unsure",
  "paint",
  "water",
  "power",
  "tool",
  "ruler",
  "tv",
] as const;

export const questionKinds = ["choice", "toggle", "number", "multi", "text"] as const;

const optionSchema = z.object({
  label: z.string().min(1).max(40),
  icon: z.enum(optionIcons).optional(),
});

export const questionSchema = z.object({
  id: z.string().min(1).max(40),
  kind: z.enum(questionKinds),
  title: z.string().min(1).max(120),
  help: z.string().max(160).optional(),
  options: z.array(optionSchema).max(6).optional(),
  unit: z.string().max(12).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.number().optional(),
  placeholder: z.string().max(80).optional(),
});

export const questionsResultSchema = z.object({
  summary: z.string().min(1).max(60),
  reply: z.string().min(1).max(200),
  questions: z.array(questionSchema).min(1).max(3),
});

export type OptionIcon = (typeof optionIcons)[number];
export type Question = z.infer<typeof questionSchema>;
export type QuestionsResult = z.infer<typeof questionsResultSchema>;

export const itemKinds = ["essential", "forgotten", "tool"] as const;

export const listDraftSchema = z.object({
  title: z.string().min(1).max(60),
  reply: z.string().min(1).max(220),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
        reason: z.string().max(200),
        kind: z.enum(itemKinds),
      }),
    )
    .min(1)
    .max(12),
  steps: z.array(z.string().max(160)).max(6),
  needsSeller: z.boolean(),
  sellerNote: z.string().max(240).optional(),
});

export type ListDraft = z.infer<typeof listDraftSchema>;
export type ItemKind = (typeof itemKinds)[number];

const boxSchema = z.array(z.number()).length(4);

export const shelfResultSchema = z.object({
  found: z.boolean(),
  box: boxSchema.optional(),
  product: z.string().max(120),
  reason: z.string().max(300),
  lookalikes: z
    .array(
      z.object({
        box: boxSchema,
        product: z.string().max(120),
        whyNot: z.string().max(200),
      }),
    )
    .max(3),
});

export type ShelfResult = z.infer<typeof shelfResultSchema>;

const photoSchema = z
  .string()
  .max(8_000_000)
  .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/);

export const answerSchema = z.object({
  question: z.string().min(1).max(160),
  answer: z.string().min(1).max(200),
});

export type Answer = z.infer<typeof answerSchema>;

export const questionsRequestSchema = z.object({
  problem: z.string().trim().min(3).max(600),
  photo: photoSchema.optional(),
});

export const listRequestSchema = z.object({
  problem: z.string().trim().min(3).max(600),
  summary: z.string().max(60),
  answers: z.array(answerSchema).max(6),
});

export const shelfRequestSchema = z.object({
  photo: photoSchema,
  target: z.string().trim().min(3).max(300),
  problem: z.string().max(600).optional(),
});

export type QuestionsRequest = z.infer<typeof questionsRequestSchema>;
export type ListRequest = z.infer<typeof listRequestSchema>;
export type ShelfRequest = z.infer<typeof shelfRequestSchema>;
