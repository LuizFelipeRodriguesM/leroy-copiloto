"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Check, RotateCcw, ShoppingCart } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

const translations = [
  { said: "cano dobrado da pia", label: "Sifão" },
  { said: "borrachinha da torneira", label: "Reparo" },
  { said: "prego pra gesso", label: "Bucha basculante" },
  { said: "fita de rosca", label: "Veda-rosca" },
];

const projectItems = ["Tinta acrílica 3,6 L", "Rolo de lã 23 cm", "Bandeja de pintura", "Fita crepe 48 mm", "Lixa 150"];

const SWAP_MS = 2600;

type BenefitCardProps = {
  who: string;
  title: string;
  text: string;
  tone: string;
  delay?: number;
  className?: string;
  children: ReactNode;
};

function BenefitCard({ who, title, text, tone, delay = 0, className, children }: BenefitCardProps) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <article
        className={cn(
          "relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-[28px] p-5 transition-transform duration-500 ease-[var(--bounce)] hover:-translate-y-1 sm:p-6",
          tone,
        )}
      >
        <div className="relative">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-60">{who}</p>
          <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.035em] lg:text-2xl">{title}</h3>
          <p className="mt-1.5 max-w-xs text-sm leading-snug opacity-75">{text}</p>
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
    <p
      key={index}
      className="bubble-in relative flex flex-wrap items-center gap-1.5 text-xs font-bold lg:gap-2.5 lg:text-lg"
      aria-live="polite"
    >
      <span className="rounded-full rounded-bl-[6px] bg-white px-2.5 py-1.5 text-ink lg:px-4 lg:py-2">“{pair.said}”</span>
      <ArrowRight className="size-3.5 shrink-0 lg:size-5" />
      <span className="rounded-full bg-ink px-2.5 py-1.5 text-white lg:px-4 lg:py-2">{pair.label}</span>
    </p>
  );
}

export function BenefitBento() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Reveal className="sm:col-span-2 lg:row-span-2">
        <article className="grid h-full gap-6 overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#b4dd8a_0%,#9cd167_55%,#8cc456_100%)] p-6 sm:p-8 md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-1 lg:content-between lg:gap-8">
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-white/60 text-brand-ink">
              <ShoppingCart className="size-5" />
            </span>
            <h3 className="mt-4 text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">
              Carrinho mais cheio.
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-brand-ink">
              O Charles pensa no projeto inteiro, não num produto. Quem vai pintar a sala sai com tudo o que a pintura
              pede, e não volta amanhã atrás da fita crepe.
            </p>
          </div>
          <div className="rounded-3xl bg-white px-5 py-4 shadow-[0_30px_60px_-30px_rgba(36,64,12,.6)] lg:-rotate-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-deep">Projeto: pintar a sala</p>
            <div className="mt-2 divide-y divide-line">
              {projectItems.map((item, index) => (
                <Reveal
                  key={item}
                  delay={200 + index * 110}
                  className="flex items-center justify-between py-2 text-[15px] font-semibold"
                >
                  {item}
                  <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-brand-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </article>
      </Reveal>

      <BenefitCard
        who="Pro cliente"
        title="Fala a língua dele."
        text="Do jeito que o cliente fala pro nome da etiqueta."
        tone="bg-[linear-gradient(150deg,#b4dd8a,#9cd167)] text-ink lg:rounded-[40px] lg:rounded-bl-[8px]"
        delay={90}
        className="sm:col-span-2"
      >
        <LanguageScene />
      </BenefitCard>

      <BenefitCard
        who="Pra loja"
        title="Menos devolução."
        text="Produto certo já na primeira ida."
        tone="bg-[linear-gradient(150deg,#e2f2cd,#c9e8a4)] text-ink"
        delay={180}
      >
        <p className="relative flex flex-wrap items-center gap-1.5 text-xs font-bold">
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
        who="Pro estoque"
        title="Ligado no estoque."
        text="Acabou? Ele já sugere o substituto e o corredor."
        tone="bg-[#fff4c7] text-ink"
        delay={270}
        className="lg:row-span-2"
      >
        <div className="flex flex-col items-start gap-1.5 text-xs font-bold">
          <span className="rounded-full bg-white/55 px-2.5 py-1.5 text-ink/45 line-through">Basculante</span>
          <ArrowDown className="ml-3 size-3.5 shrink-0" />
          <span className="rounded-full bg-white px-2.5 py-1.5">Metálica · corredor 12</span>
          <span className="mt-5 hidden rotate-3 flex-col items-center self-center rounded-2xl bg-ink px-7 pb-3 pt-2 text-white shadow-[0_18px_30px_-18px_rgba(18,23,14,.7)] lg:flex">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand">Corredor</span>
            <span className="text-6xl font-extrabold leading-none tracking-[-0.06em]">12</span>
          </span>
        </div>
      </BenefitCard>

      <BenefitCard
        who="Pra equipe"
        title="Vendedor livre."
        text="O Charles tira a dúvida do dia a dia; o especialista cuida da reforma."
        tone="bg-white text-ink ring-1 ring-line lg:flex-row lg:items-end"
        delay={360}
        className="sm:col-span-2 lg:col-span-3"
      >
        <p className="relative flex w-fit shrink-0 items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-bold ring-1 ring-line lg:mb-1 lg:mr-36">
          <span className="size-2 rounded-full bg-brand-deep" />
          Vendedor livre pra reforma
        </p>
        <Image
          src="/charles/parafuso.png"
          alt=""
          width={150}
          height={150}
          className="pointer-events-none absolute -bottom-7 right-6 hidden rotate-[18deg] lg:block"
        />
      </BenefitCard>
    </div>
  );
}
