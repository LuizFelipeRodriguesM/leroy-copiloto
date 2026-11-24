"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

const translations = [
  { said: "cano dobrado da pia", label: "Sifão" },
  { said: "borrachinha da torneira", label: "Reparo" },
  { said: "prego pra gesso", label: "Bucha basculante" },
  { said: "fita de rosca", label: "Veda-rosca" },
];

const SWAP_MS = 2600;

type BenefitCardProps = {
  who: string;
  title: string;
  text: string;
  tone: string;
  delay?: number;
  children: ReactNode;
};

function BenefitCard({ who, title, text, tone, delay = 0, children }: BenefitCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={cn(
          "flex h-full flex-col justify-between gap-5 rounded-[28px] p-5 transition-transform duration-500 ease-[var(--bounce)] hover:-translate-y-1 sm:p-6",
          tone,
        )}
      >
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-60">{who}</p>
          <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.035em]">{title}</h3>
          <p className="mt-1.5 text-sm leading-snug opacity-75">{text}</p>
        </div>
        {children}
      </article>
    </Reveal>
  );
}

function LanguageScene() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % translations.length), SWAP_MS);
    return () => window.clearInterval(interval);
  }, []);

  const pair = translations[index];

  return (
    <p key={index} className="bubble-in flex flex-wrap items-center gap-1.5 text-xs font-bold" aria-live="polite">
      <span className="rounded-full bg-white px-2.5 py-1.5 text-ink">“{pair.said}”</span>
      <ArrowRight className="size-3.5 shrink-0" />
      <span className="rounded-full bg-ink px-2.5 py-1.5 text-white">{pair.label}</span>
    </p>
  );
}

export function BenefitBento() {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BenefitCard
        who="Pra loja"
        title="Menos devolução."
        text="Produto certo já na primeira ida."
        tone="bg-[linear-gradient(150deg,#e2f2cd,#c9e8a4)] text-ink"
      >
        <p className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
            <Check className="size-3.5 text-brand-deep" strokeWidth={3} />
            1ª ida resolve
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/45 px-2.5 py-1.5 text-ink/45 line-through">
            <RotateCcw className="size-3.5" />
            2ª ida
          </span>
        </p>
      </BenefitCard>
      <BenefitCard
        who="Pra equipe"
        title="Vendedor livre."
        text="O Charles tira a dúvida do dia a dia; o especialista cuida da reforma."
        tone="bg-white text-ink ring-1 ring-line"
        delay={90}
      >
        <p className="flex w-fit items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-bold ring-1 ring-line">
          <span className="size-2 rounded-full bg-brand-deep" />
          Vendedor livre pra reforma
        </p>
      </BenefitCard>
      <BenefitCard
        who="Pro estoque"
        title="Ligado no estoque."
        text="Acabou? Ele já sugere o substituto e o corredor."
        tone="bg-[#fff4c7] text-ink"
        delay={180}
      >
        <p className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="rounded-full bg-white/55 px-2.5 py-1.5 text-ink/45 line-through">Basculante</span>
          <ArrowRight className="size-3.5 shrink-0" />
          <span className="rounded-full bg-white px-2.5 py-1.5">Metálica · corredor 12</span>
        </p>
      </BenefitCard>
      <BenefitCard
        who="Pro cliente"
        title="Fala a língua dele."
        text="Do jeito que o cliente fala pro nome da etiqueta."
        tone="bg-[linear-gradient(150deg,#b4dd8a,#9cd167)] text-ink"
        delay={270}
      >
        <LanguageScene />
      </BenefitCard>
    </div>
  );
}
