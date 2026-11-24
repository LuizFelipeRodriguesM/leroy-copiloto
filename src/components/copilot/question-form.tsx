"use client";

import {
  ArrowUpToLine,
  Bath,
  BrickWall,
  Check,
  CircleHelp,
  CookingPot,
  Droplets,
  Grid2x2,
  Grid3x3,
  Minus,
  PaintRoller,
  PanelTop,
  PanelsTopLeft,
  Plus,
  Ruler,
  TreeDeciduous,
  Trees,
  Tv,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Answer, OptionIcon, Question } from "@/lib/copilot/schemas";
import { cn } from "@/lib/utils";

export type AnswerValue = string | number | string[];
export type AnswerMap = Record<string, AnswerValue>;

const optionIcons: Record<OptionIcon, LucideIcon> = {
  wall: BrickWall,
  countertop: PanelTop,
  bathroom: Bath,
  kitchen: CookingPot,
  outdoor: Trees,
  ceiling: ArrowUpToLine,
  floor: Grid2x2,
  drywall: PanelsTopLeft,
  masonry: BrickWall,
  wood: TreeDeciduous,
  tile: Grid3x3,
  yes: Check,
  no: X,
  unsure: CircleHelp,
  paint: PaintRoller,
  water: Droplets,
  power: Zap,
  tool: Wrench,
  ruler: Ruler,
  tv: Tv,
};

export const initialAnswers = (questions: Question[]): AnswerMap =>
  Object.fromEntries(
    questions.flatMap((question): [string, AnswerValue][] => {
      if (question.kind === "number") return [[question.id, question.defaultValue ?? question.min ?? 0]];
      if (question.kind === "multi") return [[question.id, []]];
      return [];
    }),
  );

export const isAnswered = (question: Question, value: AnswerValue | undefined) => {
  if (question.kind === "choice" || question.kind === "toggle") return typeof value === "string" && value.length > 0;
  return true;
};

export const formatAnswers = (questions: Question[], answers: AnswerMap): Answer[] =>
  questions.map((question) => {
    const value = answers[question.id];
    if (question.kind === "number") return { question: question.title, answer: `${value} ${question.unit ?? ""}`.trim() };
    if (question.kind === "multi") {
      const picked = Array.isArray(value) ? value : [];
      return { question: question.title, answer: picked.length ? picked.join(", ") : "nenhuma das opções" };
    }
    const text = typeof value === "string" ? value.trim() : "";
    return { question: question.title, answer: text || "não informado" };
  });

type FieldProps = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

function ChoiceField({ question, value, onChange }: FieldProps) {
  const options = question.options ?? [];
  return (
    <div className={cn("grid gap-2", options.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {options.map((option) => {
        const Icon = option.icon ? optionIcons[option.icon] : CircleHelp;
        const selected = value === option.label;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.label)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center text-[13px] font-bold leading-tight transition-all",
              selected ? "bg-brand-mist text-ink ring-2 ring-brand-deep" : "bg-[#f4f6f0] text-ink-soft hover:text-ink",
            )}
          >
            {selected && (
              <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-brand-deep text-white">
                <Check className="size-3" strokeWidth={3.5} />
              </span>
            )}
            <span className={cn("grid size-11 place-items-center rounded-xl", selected ? "bg-brand" : "bg-white")}>
              <Icon className="size-5 text-ink" />
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ToggleField({ question, value, onChange }: FieldProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(question.options ?? []).map((option) => {
        const selected = value === option.label;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.label)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition-colors",
              selected ? "bg-ink text-white" : "bg-[#f4f6f0] text-ink-soft hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({ question, value, onChange }: FieldProps) {
  const min = question.min ?? 0;
  const max = question.max ?? 100;
  const step = question.step ?? 1;
  const current = typeof value === "number" ? value : (question.defaultValue ?? min);
  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next / step) * step)));
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => set(current - step)}
          aria-label="Diminuir"
          className="grid size-10 place-items-center rounded-full bg-[#f4f6f0] text-ink"
        >
          <Minus className="size-4" />
        </button>
        <p className="text-3xl font-extrabold tabular-nums tracking-[-0.04em]">
          {current.toLocaleString("pt-BR")}
          {question.unit && <span className="ml-1.5 text-base font-bold text-ink-soft">{question.unit}</span>}
        </p>
        <button
          type="button"
          onClick={() => set(current + step)}
          aria-label="Aumentar"
          className="grid size-10 place-items-center rounded-full bg-[#f4f6f0] text-ink"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => set(Number(event.target.value))}
        aria-label={question.title}
        className="mt-4 w-full accent-[var(--brand-deep)]"
      />
    </div>
  );
}

function MultiField({ question, value, onChange }: FieldProps) {
  const picked = Array.isArray(value) ? value : [];
  const toggle = (label: string) =>
    onChange(picked.includes(label) ? picked.filter((item) => item !== label) : [...picked, label]);
  return (
    <div className="flex flex-wrap gap-2">
      {(question.options ?? []).map((option) => {
        const selected = picked.includes(option.label);
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option.label)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-colors",
              selected ? "bg-brand-mist text-ink ring-2 ring-brand-deep" : "bg-[#f4f6f0] text-ink-soft hover:text-ink",
            )}
          >
            {selected && <Check className="size-3.5" strokeWidth={3} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function TextField({ question, value, onChange }: FieldProps) {
  return (
    <input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      maxLength={200}
      placeholder={question.placeholder}
      aria-label={question.title}
      className="w-full rounded-2xl bg-[#f4f6f0] px-4 py-3 text-base outline-none placeholder:text-ink-soft/60 focus:ring-2 focus:ring-brand-deep"
    />
  );
}

const fields: Record<Question["kind"], (props: FieldProps) => React.JSX.Element> = {
  choice: ChoiceField,
  toggle: ToggleField,
  number: NumberField,
  multi: MultiField,
  text: TextField,
};

type QuestionFormProps = {
  questions: Question[];
  answers: AnswerMap;
  onChange: (id: string, value: AnswerValue) => void;
};

export function QuestionForm({ questions, answers, onChange }: QuestionFormProps) {
  return (
    <div className="flex flex-col divide-y divide-line">
      {questions.map((question, index) => {
        const Field = fields[question.kind];
        return (
          <fieldset
            key={question.id}
            className="pop-in px-2 py-4 first:pt-2 last:pb-2 sm:px-3"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <legend className="sr-only">{question.title}</legend>
            <p className="text-base font-extrabold leading-snug tracking-[-0.02em]">{question.title}</p>
            {question.help && <p className="mt-1 text-sm text-ink-soft">{question.help}</p>}
            <div className="mt-3">
              <Field question={question} value={answers[question.id]} onChange={(value) => onChange(question.id, value)} />
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
