import type { Question, QuestionsResult, ShelfResult } from "@/lib/copilot/schemas";

const OPTION_KINDS = new Set<Question["kind"]>(["choice", "toggle", "multi"]);

const normalizeNumber = (question: Question): Question => {
  const min = question.min ?? 0;
  const max = question.max !== undefined && question.max > min ? question.max : min + 100;
  const step = question.step && question.step > 0 ? question.step : 1;
  const middle = Math.round((min + max) / 2 / step) * step;
  const defaultValue =
    question.defaultValue !== undefined && question.defaultValue >= min && question.defaultValue <= max
      ? question.defaultValue
      : middle;
  return { ...question, min, max, step, defaultValue };
};

const normalizeQuestion = (question: Question): Question => {
  if (OPTION_KINDS.has(question.kind)) {
    const options = (question.options ?? []).filter(
      (option, index, all) => all.findIndex((other) => other.label === option.label) === index,
    );
    if (options.length >= 2) return { ...question, options };
    return { ...question, kind: "text", options: undefined, placeholder: question.placeholder ?? "Escreve aqui" };
  }
  if (question.kind === "number") return normalizeNumber(question);
  return { ...question, placeholder: question.placeholder ?? "Escreve aqui" };
};

export const normalizeQuestions = (result: QuestionsResult): QuestionsResult => {
  const seen = new Set<string>();
  const questions = result.questions.map(normalizeQuestion).map((question, index) => {
    const id = seen.has(question.id) ? `${question.id}-${index}` : question.id;
    seen.add(id);
    return { ...question, id };
  });
  return { ...result, questions };
};

type Box = [number, number, number, number];

const clamp = (value: number) => Math.max(0, Math.min(1000, Math.round(value)));

export const validBox = (box: number[] | undefined): Box | undefined => {
  if (!box || box.length !== 4) return undefined;
  const [yMin, xMin, yMax, xMax] = box.map(clamp);
  if (yMin >= yMax || xMin >= xMax) return undefined;
  return [yMin, xMin, yMax, xMax];
};

export const normalizeShelf = (result: ShelfResult): ShelfResult => ({
  ...result,
  box: result.found ? validBox(result.box) : undefined,
  lookalikes: result.lookalikes.flatMap((lookalike) => {
    const box = validBox(lookalike.box);
    return box ? [{ ...lookalike, box }] : [];
  }),
});
