import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Store } from "lucide-react";
import { DevicePreview } from "@/components/copilot/device-preview";
import { catalog } from "@/lib/store/catalog";
import { aisleBlocks } from "@/lib/store/layout";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  label: string;
  hint: string;
  done: boolean;
};

type SidebarProps = {
  steps: JourneyStep[];
  title: string | null;
  onNewProblem: () => void;
};

export function Sidebar({ steps, title, onNewProblem }: SidebarProps) {
  const activeIndex = steps.findIndex((step) => !step.done);

  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-line bg-[#f3f6ee]">
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
        <span className="grid size-9 place-items-center rounded-full bg-brand-soft ring-1 ring-brand/30">
          <Image src="/charles/parafuso.png" alt="" width={30} height={30} />
        </span>
        <span className="text-[15px] font-extrabold tracking-[-0.03em]">
          Leroy <span className="text-brand-deep">Copiloto</span>
        </span>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onNewProblem}
          className="flex w-full items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 text-sm font-bold text-ink ring-1 ring-line transition-shadow hover:shadow-[0_10px_24px_-16px_rgba(18,23,14,.4)]"
        >
          <span className="grid size-6 place-items-center rounded-full bg-ink text-white">
            <Plus className="size-3.5" strokeWidth={3} />
          </span>
          Novo problema
        </button>
      </div>

      <div className="mt-6 px-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">
          {title ? "Projeto" : "Como funciona"}
        </p>
        {title && <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">{title}</p>}
        <ol className="mt-4 flex flex-col">
          {steps.map((step, index) => {
            const active = index === activeIndex;
            return (
              <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[11px] top-7 h-[calc(100%-26px)] w-0.5 rounded-full",
                      step.done ? "bg-brand-deep" : "bg-ink/10",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold transition-colors",
                    step.done && "bg-brand-deep text-white",
                    active && "bg-ink text-brand ring-4 ring-brand/30",
                    !step.done && !active && "bg-white text-ink-soft ring-1 ring-line",
                  )}
                >
                  {step.done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className={cn("block text-sm font-bold", !step.done && !active && "text-ink-soft")}>
                    {step.label}
                  </span>
                  {active && <span className="mt-0.5 block text-xs leading-snug text-ink-soft">{step.hint}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-auto flex flex-col gap-3 p-3">
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-line">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Store className="size-4 text-brand-deep" />
            Leroy Merlin
          </p>
          <p className="mt-1 text-xs leading-snug text-ink-soft">
            Loja de exemplo: {catalog.length} produtos em {aisleBlocks.length} corredores, com estoque.
          </p>
        </div>
        <DevicePreview path="/app" />
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-ink-soft transition-colors hover:bg-white hover:text-ink"
        >
          Sobre o projeto
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
