"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ListChecks, RotateCcw, ScanSearch, Sparkles } from "lucide-react";
import { QuestionForm, isAnswered, type AnswerMap, type AnswerValue } from "@/components/copilot/question-form";
import { CharlesEmbed, type CharlesMood } from "@/components/landing/charles-embed";
import { cn } from "@/lib/utils";
import type { QuestionsResult } from "@/lib/copilot/schemas";
import { itemsTotal, type ShoppingList } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";

export type WorkspaceTab = "list" | "shelf" | "checkout";

const LINE_MS = 2200;

export function UserMessage({ text, photo }: { text: string; photo?: string | null }) {
  return (
    <div className="message-in flex flex-col items-end gap-2">
      {photo && (
        <Image
          src={photo}
          alt="Foto que você mandou"
          width={160}
          height={160}
          unoptimized
          className="size-40 rounded-[20px] object-cover ring-1 ring-line"
        />
      )}
      <p className="max-w-[85%] rounded-[22px] rounded-br-[8px] bg-[#e9eee0] px-4 py-2.5 text-[15px] leading-snug text-ink">
        {text}
      </p>
    </div>
  );
}

const avatarIndent = "ml-[60px] sm:ml-[68px]";

type CharlesAvatarProps = {
  live?: boolean;
  mood?: CharlesMood;
};

function CharlesAvatar({ live = false, mood = "idle" }: CharlesAvatarProps) {
  const [shown, setShown] = useState(false);
  return (
    <span className="relative block size-12 shrink-0 sm:size-14">
      <Image
        src="/charles/parafuso.png"
        alt=""
        width={56}
        height={56}
        className={cn("size-full object-contain transition-opacity duration-300", live && shown && "opacity-0")}
      />
      {live && (
        <CharlesEmbed
          eager
          fit={1.12}
          mood={mood}
          title="Charles"
          onShown={() => setShown(true)}
          className={cn(
            "absolute -inset-2 size-[calc(100%+16px)] transition-opacity duration-300",
            shown ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}

type CharlesMessageProps = {
  children: ReactNode;
  live?: boolean;
  mood?: CharlesMood;
};

export function CharlesMessage({ children, live = false, mood = "idle" }: CharlesMessageProps) {
  return (
    <div className="message-in flex gap-3">
      <CharlesAvatar live={live} mood={mood} />
      <div className="min-w-0 flex-1 pt-2">
        <p className="text-xs font-bold text-ink-soft">Charles</p>
        <div className="mt-1 text-[15px] leading-relaxed text-ink">{children}</div>
      </div>
    </div>
  );
}

export function ThinkingMessage({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % lines.length), LINE_MS);
    return () => window.clearInterval(interval);
  }, [lines.length]);

  return (
    <div className="message-in flex items-center gap-3" role="status" aria-live="polite">
      <CharlesAvatar live mood="thinking" />
      <p key={index} className="shimmer-text message-in text-[15px] font-semibold">
        {lines[index]}
      </p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className={cn(
        "message-in flex flex-wrap items-center gap-3 rounded-2xl bg-[#fff1e4] px-4 py-3 text-sm font-semibold text-[#8a4300]",
        avatarIndent,
      )}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink ring-1 ring-[#f3d3b4]"
      >
        <RotateCcw className="size-3.5" />
        Tentar de novo
      </button>
    </div>
  );
}

type QuestionsCardProps = {
  result: QuestionsResult;
  answers: AnswerMap;
  onAnswer: (id: string, value: AnswerValue) => void;
  onSubmit: () => void;
};

export function QuestionsCard({ result, answers, onAnswer, onSubmit }: QuestionsCardProps) {
  const ready = result.questions.every((question) => isAnswered(question, answers[question.id]));
  return (
    <form
      className={cn(
        "message-in",
        avatarIndent,
        "overflow-hidden rounded-[24px] bg-white ring-1 ring-line shadow-[0_18px_40px_-28px_rgba(18,23,14,.35)]",
      )}
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) onSubmit();
      }}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Sparkles className="size-4 text-brand-deep" />
        <p className="text-xs font-bold text-ink-soft">
          Tela montada pelo Charles · <span className="text-ink">{result.summary}</span>
        </p>
      </div>
      <div className="p-2 sm:p-3">
        <QuestionForm questions={result.questions} answers={answers} onChange={onAnswer} />
      </div>
      <div className="flex justify-end border-t border-line bg-paper/60 px-3 py-3">
        <button
          type="submit"
          disabled={!ready}
          className="flex items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-2 text-sm font-bold text-white transition-opacity disabled:opacity-35"
        >
          Montar minha lista
          <span className="grid size-7 place-items-center rounded-full bg-brand text-ink">
            <ArrowRight className="size-4" />
          </span>
        </button>
      </div>
    </form>
  );
}

type ListCardProps = {
  list: ShoppingList;
  onOpen: (tab: WorkspaceTab) => void;
};

export function ListCard({ list, onOpen }: ListCardProps) {
  return (
    <div
      className={cn(
        "message-in",
        avatarIndent,
        "overflow-hidden rounded-[24px] bg-white ring-1 ring-line shadow-[0_18px_40px_-28px_rgba(18,23,14,.35)]",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen("list")}
        className="flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-paper/70"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,#e2f2cd,#c6e79c)] text-brand-ink">
          <ListChecks className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold">{list.title}</span>
          <span className="block text-xs font-semibold text-ink-soft">
            {list.items.length} itens · {list.stops.length} {list.stops.length === 1 ? "corredor" : "corredores"} ·{" "}
            <span className="font-extrabold text-ink">{formatPrice(itemsTotal(list.items))}</span>
          </span>
        </span>
        <span className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white">Abrir</span>
      </button>
      <div className="border-t border-line text-sm font-bold">
        <button
          type="button"
          onClick={() => onOpen("shelf")}
          className="flex w-full items-center justify-center gap-2 py-3 transition-colors hover:bg-paper/70"
        >
          <ScanSearch className="size-4 text-brand-deep" />
          Qual desses?
        </button>
      </div>
    </div>
  );
}
