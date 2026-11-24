import { ScanSearch } from "lucide-react";
import { Composer } from "@/components/copilot/composer";
import { CharlesEmbed } from "@/components/landing/charles-embed";

type EmptyStateProps = {
  onSubmit: (problem: string, photo: string | null) => void;
  onOpenShelf: () => void;
};

export function EmptyState({ onSubmit, onOpenShelf }: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center px-4 pb-[109px] pt-2 sm:px-6 sm:pb-[112px]">
      <div className="flex flex-col items-center text-center">
        <CharlesEmbed eager mood="happy" fit={1.12} className="size-[min(190px,46vw)]" />
        <h1 className="text-[clamp(1.9rem,4.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.045em]">
          Qual é o problema de hoje?
        </h1>
      </div>

      <Composer onSubmit={onSubmit} className="mt-[52px]" />

      <button
        type="button"
        onClick={onOpenShelf}
        className="mx-auto mt-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-ink-soft transition-colors hover:bg-white hover:text-ink"
      >
        <ScanSearch className="size-4 text-brand-deep" />
        Já tô na frente da prateleira
      </button>
    </div>
  );
}
