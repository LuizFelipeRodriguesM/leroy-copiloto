"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ListChecks, PanelRightOpen, Plus, ScanSearch } from "lucide-react";
import { Composer } from "@/components/copilot/composer";
import { EmptyState } from "@/components/copilot/empty-state";
import {
  CharlesMessage,
  ErrorMessage,
  ListCard,
  QuestionsCard,
  ThinkingMessage,
  UserMessage,
  type WorkspaceTab,
} from "@/components/copilot/messages";
import { formatAnswers, initialAnswers, type AnswerMap, type AnswerValue } from "@/components/copilot/question-form";
import { Sidebar, type JourneyStep } from "@/components/copilot/sidebar";
import { Workspace } from "@/components/copilot/workspace";
import { postJson } from "@/lib/copilot/client";
import type { ListRequest, QuestionsRequest, QuestionsResult } from "@/lib/copilot/schemas";
import type { ShoppingList } from "@/lib/copilot/shopping-list";

type Pending = "questions" | "list" | null;

const DESKTOP_QUERY = "(min-width: 1024px)";

const questionLines = ["Entendendo o problema…", "Pensando no que um vendedor perguntaria…", "Montando a tela pra você…"];
const listLines = [
  "Conferindo o estoque desta loja…",
  "Calculando quanto levar…",
  "Lembrando do que você ia esquecer…",
  "Achando o corredor de cada item…",
];

const subscribeToDesktop = (onChange: () => void) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const quickActions: { tab: WorkspaceTab; label: string; icon: typeof ListChecks }[] = [
  { tab: "list", label: "Lista e rota", icon: ListChecks },
  { tab: "shelf", label: "Qual desses?", icon: ScanSearch },
];

export function CopilotApp() {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionsResult | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [answered, setAnswered] = useState(false);
  const [list, setList] = useState<ShoppingList | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [tab, setTab] = useState<WorkspaceTab>("list");
  const [shelfItemId, setShelfItemId] = useState<string | null>(null);
  const [checkoutSeen, setCheckoutSeen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const started = Boolean(problem);
  const liveCharles = pending ? "thinking" : list ? "guide" : questions ? "questions" : null;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !started) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [started, questions, answered, list, pending, error]);

  const reset = () => {
    setPending(null);
    setError(null);
    setProblem("");
    setPhoto(null);
    setQuestions(null);
    setAnswers({});
    setAnswered(false);
    setList(null);
    setPicked([]);
    setWorkspaceOpen(false);
    setTab("list");
    setShelfItemId(null);
    setCheckoutSeen(false);
  };

  const askQuestions = async (nextProblem: string, nextPhoto: string | null) => {
    reset();
    setProblem(nextProblem);
    setPhoto(nextPhoto);
    setPending("questions");
    try {
      const body: QuestionsRequest = { problem: nextProblem, photo: nextPhoto ?? undefined };
      const result = await postJson<QuestionsResult>("/api/questions", body);
      setQuestions(result);
      setAnswers(initialAnswers(result.questions));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não consegui falar com o Charles.");
    } finally {
      setPending(null);
    }
  };

  const buildList = async () => {
    if (!questions) return;
    setAnswered(true);
    setError(null);
    setPending("list");
    try {
      const body: ListRequest = {
        problem,
        summary: questions.summary,
        answers: formatAnswers(questions.questions, answers),
      };
      const result = await postJson<ShoppingList>("/api/list", body);
      setList(result);
      setPicked([]);
      setTab("list");
      if (window.matchMedia(DESKTOP_QUERY).matches) setWorkspaceOpen(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não consegui montar a lista.");
    } finally {
      setPending(null);
    }
  };

  const retry = () => {
    if (!questions) void askQuestions(problem, photo);
    else void buildList();
  };

  const openWorkspace = (nextTab: WorkspaceTab) => {
    setTab(nextTab);
    if (nextTab === "checkout") setCheckoutSeen(true);
    setWorkspaceOpen(true);
  };

  const openShelf = () => {
    setShelfItemId(null);
    openWorkspace("shelf");
  };

  const togglePicked = (productId: string) =>
    setPicked((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );

  const pickedCount = list ? list.items.filter((item) => picked.includes(item.product.id)).length : 0;
  const answerSummary = questions
    ? formatAnswers(questions.questions, answers)
        .map((item) => item.answer)
        .join(" · ")
    : "";

  const steps: JourneyStep[] = [
    { label: "Conta o problema", hint: "Escreve do seu jeito ou manda uma foto.", done: started },
    { label: "Responde o Charles", hint: "Duas ou três perguntas montadas pra você.", done: answered },
    { label: "Recebe a lista", hint: "Quantidade, corredor e o que você ia esquecer.", done: Boolean(list) },
    {
      label: "Segue a rota",
      hint: "Corredor por corredor. Na prateleira, usa o Qual desses?",
      done: Boolean(list) && pickedCount === list?.items.length,
    },
    { label: "Passa no caixa", hint: "Confere o que pegou e o que faltou.", done: checkoutSeen },
  ];

  const workspace = (
    <Workspace
      list={list}
      tab={tab}
      onTab={openWorkspace}
      picked={picked}
      onTogglePicked={togglePicked}
      shelfItemId={shelfItemId}
      onShelfItem={setShelfItemId}
      problem={problem}
      onClose={() => setWorkspaceOpen(false)}
      onRestart={reset}
    />
  );

  return (
    <div className="flex h-svh overflow-hidden bg-paper">
      {isDesktop && <Sidebar steps={steps} title={questions?.summary ?? null} onNewProblem={reset} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-paper/90 px-4 backdrop-blur-xl sm:px-6">
          {isDesktop ? (
            <p className="truncate text-sm font-bold text-ink-soft">
              {questions?.summary ?? "Nova conversa"}
            </p>
          ) : (
            <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Página do Leroy Copiloto">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft">
                <Image src="/charles/parafuso.png" alt="" width={26} height={26} />
              </span>
              <span className="truncate text-sm font-extrabold tracking-[-0.02em]">
                {questions?.summary ?? "Charles"}
              </span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            {isDesktop && list && !workspaceOpen && (
              <button
                type="button"
                onClick={() => openWorkspace(tab)}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold ring-1 ring-line"
              >
                <PanelRightOpen className="size-4 text-brand-deep" />
                Abrir painel
              </button>
            )}
            {started && !isDesktop && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold ring-1 ring-line"
              >
                <Plus className="size-3.5" strokeWidth={3} />
                Novo
              </button>
            )}
          </div>
        </header>

        <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto">
          {!started ? (
            <EmptyState onSubmit={(nextProblem, nextPhoto) => void askQuestions(nextProblem, nextPhoto)} onOpenShelf={openShelf} />
          ) : (
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-10 pt-8 sm:px-6">
              <UserMessage text={problem} photo={photo} />
              {questions && <CharlesMessage live={liveCharles === "questions"}>{questions.reply}</CharlesMessage>}
              {questions && !answered && (
                <QuestionsCard
                  result={questions}
                  answers={answers}
                  onAnswer={(id: string, value: AnswerValue) => setAnswers((current) => ({ ...current, [id]: value }))}
                  onSubmit={() => void buildList()}
                />
              )}
              {answered && <UserMessage text={answerSummary} />}
              {list && (
                <>
                  <CharlesMessage>{list.reply}</CharlesMessage>
                  <ListCard list={list} onOpen={openWorkspace} />
                  <CharlesMessage live={liveCharles === "guide"}>
                    Na loja, segue a rota. Quando estiver na frente da prateleira, aperta <strong>Qual desses?</strong> e
                    tira uma foto: eu circulo o certo.
                  </CharlesMessage>
                </>
              )}
              {pending && <ThinkingMessage lines={pending === "questions" ? questionLines : listLines} />}
              {error && !pending && <ErrorMessage message={error} onRetry={retry} />}
            </div>
          )}
        </div>

        {started && (
          <div className="shrink-0 border-t border-line/70 bg-paper/90 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-[720px] flex-col gap-2.5">
              {list && !isDesktop && (
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.tab}
                        type="button"
                        onClick={() => openWorkspace(action.tab)}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-[13px] font-bold ring-1 ring-line"
                      >
                        <Icon className="size-4 text-brand-deep" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <Composer
                compact
                onSubmit={(nextProblem, nextPhoto) => void askQuestions(nextProblem, nextPhoto)}
                placeholder="Outro problema? Conta aqui…"
              />
            </div>
          </div>
        )}
      </div>

      {isDesktop && workspaceOpen && (
        <div className="panel-in w-[min(540px,40vw)] shrink-0 border-l border-line">{workspace}</div>
      )}

      {!isDesktop && workspaceOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/30" onClick={() => setWorkspaceOpen(false)}>
          <div
            className="sheet-up h-[92svh] overflow-hidden rounded-t-[28px] shadow-[0_-20px_60px_-30px_rgba(18,23,14,.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            {workspace}
          </div>
        </div>
      )}
    </div>
  );
}
