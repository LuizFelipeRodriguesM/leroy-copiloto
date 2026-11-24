"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  Droplets,
  ListChecks,
  Paintbrush,
  Sparkle,
  Sparkles,
  Tv,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

type Translation = {
  icon: LucideIcon;
  said: string;
  understood: string;
  aisle: string;
};

const translations: Translation[] = [
  { icon: Droplets, said: "Minha torneira tá pingando", understood: "Reparo de vedação 1/2\"", aisle: "Corredor 41" },
  { icon: Wrench, said: "Aquele cano dobrado da pia", understood: "Sifão sanfonado universal", aisle: "Corredor 41" },
  { icon: Tv, said: "Quero pendurar a TV no drywall", understood: "Bucha basculante 10 mm", aisle: "Corredor 12" },
  { icon: Paintbrush, said: "Vou pintar a sala de 12 m²", understood: "Tinta acrílica 3,6 L, rolo e fita", aisle: "Corredor 63" },
];

const everydayWords = [
  { said: "cano dobrado", label: "sifão" },
  { said: "borrachinha da torneira", label: "reparo de vedação" },
  { said: "prego pra gesso", label: "bucha basculante" },
  { said: "fita de rosca", label: "veda-rosca" },
  { said: "massinha de parede", label: "massa corrida" },
  { said: "pó do azulejo", label: "rejunte" },
];

const promises = ["Sem nome técnico", "Sem fila", "Sem baixar app"];

const CYCLE_MS = 2800;

const kicker = "text-[11px] font-extrabold uppercase tracking-[0.2em]";
const tile =
  "relative isolate flex h-full flex-col overflow-hidden rounded-[30px] p-6 transition-transform duration-300 ease-[var(--bounce)] sm:p-7";
const tileHover = "hover:-translate-y-1 hover:-rotate-[0.6deg]";
const tileTitle = "text-[clamp(1.5rem,2.2vw,1.85rem)] font-extrabold leading-[1.05] tracking-[-0.035em]";
const tileText = "mt-2 max-w-[28ch] text-[15px] leading-snug text-ink-soft";
const softGreen = "bg-[linear-gradient(140deg,#c6e79c_0%,#def2c3_48%,#f4f9d9_100%)]";

export function CharlesBento() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % translations.length);
    }, CYCLE_MS);
    return () => window.clearInterval(interval);
  }, []);

  const active = translations[activeIndex];

  return (
    <section
      id="o-charles"
      className="relative scroll-mt-20 bg-[linear-gradient(180deg,#f3f8ea_0%,#fafbf5_100%)] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
        <Reveal className="sm:col-span-2 lg:col-span-5">
          <article className={cn(tile, softGreen, "group min-h-[420px] justify-between sm:p-8")}>
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_82%_8%,rgba(255,255,255,.65),transparent_70%)]"
            />
            <p className={cn(kicker, "text-brand-ink")}>Conheça o Charles</p>
            <div>
              <h2 className="text-[clamp(3.2rem,5.6vw,5.2rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
                Fala do
                <br />
                seu jeito.
              </h2>
              <p className="mt-5 max-w-[30ch] text-lg font-medium leading-snug text-brand-ink">
                Ele descobre a peça, calcula quanto levar e mostra em que corredor está. Tudo no seu celular, dentro da
                loja.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pr-28 sm:pr-32">
              {promises.map((promise) => (
                <span
                  key={promise}
                  className="rounded-full bg-[#fff4c7] px-2.5 py-1 text-[13px] font-semibold text-ink ring-[1.5px] ring-ink"
                >
                  {promise}
                </span>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-[74px] -right-[30px] w-[clamp(170px,17vw,224px)] rotate-[-14deg] transition-transform duration-500 ease-[var(--bounce)] group-hover:-translate-x-2 group-hover:-translate-y-4 group-hover:rotate-[-5deg]"
            >
              <div className="peek-in">
                <Image src="/charles/parafuso.png" alt="" width={448} height={448} className="h-auto w-full" />
              </div>
              <span className="peek-bubble absolute -top-10 right-[26%] rotate-[8deg] whitespace-nowrap rounded-2xl bg-sun px-3 py-1.5 text-sm font-extrabold text-ink ring-2 ring-ink sm:right-[64%] sm:top-[2px] sm:rotate-[12deg]">
                me pergunta!
                <span className="absolute -bottom-[5px] right-4 size-2.5 rotate-45 bg-sun shadow-[2px_2px_0_0_var(--ink)]" />
              </span>
            </div>
          </article>
        </Reveal>

        <Reveal delay={90} className="sm:col-span-2 lg:col-span-7">
          <article className={cn(tile, "min-h-[420px] bg-white sm:p-8")}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className={cn(kicker, "whitespace-nowrap text-ink")}>Você fala, ele entende</p>
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-mist py-1 pl-1 pr-3 text-xs font-bold text-brand-ink ring-1 ring-brand/40">
                <span className="grid size-6 place-items-center rounded-full bg-brand-soft">
                  <Image src="/charles/parafuso.png" alt="" width={20} height={20} />
                </span>
                traduzindo
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="typing-dot size-1 rounded-full bg-current"
                      style={{ animationDelay: `${dot * 160}ms` }}
                    />
                  ))}
                </span>
              </span>
            </div>

            <div className="flex flex-1 items-center py-7">
              <div className="flex items-end gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper ring-1 ring-line">
                  <UserRound className="size-5 text-ink-soft" />
                </span>
                <p
                  key={activeIndex}
                  className="bubble-in max-w-[24ch] rounded-[26px] rounded-bl-[8px] bg-ink px-5 py-3.5 text-[clamp(1.2rem,2vw,1.7rem)] font-bold leading-snug tracking-[-0.025em] text-white"
                >
                  “{active.said}”
                </p>
              </div>
            </div>

            <div className="grid gap-2.5">
              {translations.map((translation, index) => {
                const Icon = translation.icon;
                const isActive = index === activeIndex;
                return (
                  <div
                    key={translation.said}
                    className={cn(
                      "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-2xl px-3.5 py-3 transition-all duration-500 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-4",
                      isActive ? "bg-brand-mist ring-1 ring-brand/60" : "bg-[#f4f6f0]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-full ring-[1.5px] ring-ink transition-colors duration-500",
                        isActive ? "bg-brand" : "bg-white",
                      )}
                    >
                      <Icon className="size-[18px] text-ink" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug sm:truncate sm:text-base">
                        {translation.said}
                      </span>
                      <span className="block text-xs leading-relaxed text-ink-soft sm:truncate">
                        ele entende: <b className="font-semibold text-ink">{translation.understood}</b>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "col-start-2 justify-self-start whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] transition-colors duration-500 sm:col-start-auto sm:justify-self-auto sm:text-[11px]",
                        isActive ? "bg-sun text-ink ring-[1.5px] ring-ink" : "bg-white text-ink-soft ring-1 ring-line",
                      )}
                    >
                      {translation.aisle}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </Reveal>

        <Reveal className="lg:col-span-3">
          <article className={cn(tile, tileHover, "min-h-[200px] justify-between gap-4 bg-white")}>
            <span className="wobble absolute right-5 top-5 grid size-11 place-items-center rounded-2xl bg-brand-soft ring-[1.5px] ring-ink">
              <Camera className="size-5 text-ink" />
            </span>
            <p className={cn(kicker, "text-ink")}>Não sabe o nome?</p>
            <div>
              <h3 className={tileTitle}>Manda uma foto.</h3>
              <p className={tileText}>Da peça quebrada ou da prateleira. Ele reconhece e diz qual levar.</p>
            </div>
          </article>
        </Reveal>

        <Reveal delay={90} className="lg:col-span-3">
          <article className={cn(tile, tileHover, "min-h-[200px] justify-between gap-4 bg-[#eceee6]")}>
            <span className="wobble absolute right-5 top-5 grid size-11 place-items-center rounded-2xl bg-white ring-[1.5px] ring-ink [animation-delay:-1.2s]">
              <ListChecks className="size-5 text-ink" />
            </span>
            <p className={cn(kicker, "text-ink")}>Lista completa</p>
            <div>
              <h3 className={tileTitle}>Lembra do que falta.</h3>
              <p className={tileText}>Veda-rosca, fita, bucha: o que você ia esquecer já entra na lista.</p>
            </div>
          </article>
        </Reveal>

        <Reveal delay={180} className="lg:col-span-3">
          <a
            href="#como-funciona"
            className={cn(tile, tileHover, softGreen, "group min-h-[200px] justify-between gap-4")}
          >
            <Sparkles className="wobble absolute right-5 top-5 size-9 text-ink [animation-delay:-0.6s]" strokeWidth={1.6} />
            <p className={cn(kicker, "text-brand-ink")}>Passo a passo</p>
            <p className="text-[clamp(1.6rem,2.4vw,2rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Conta. Acha.
              <span className="flex items-center gap-2 font-light">
                Leva.
                <ArrowRight className="size-6 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
              </span>
            </p>
          </a>
        </Reveal>

        <Reveal delay={270} className="lg:col-span-3">
          <article className={cn(tile, "min-h-[200px] justify-between gap-4 bg-[#ffe68f]")}>
            <p className={cn(kicker, "text-ink")}>Fala a sua língua</p>
            <div className="ticker-mask -mx-6 overflow-hidden sm:-mx-7">
              <div className="ticker-track">
                {[0, 1].map((copy) => (
                  <span key={copy} aria-hidden={copy === 1} className="flex">
                    {everydayWords.map((word) => (
                      <span key={word.said} className="flex items-center gap-5 whitespace-nowrap pr-5 text-lg">
                        <span>
                          {word.said} <span className="text-ink/50">→</span> <b className="font-extrabold">{word.label}</b>
                        </span>
                        <Sparkle className="size-4 fill-white text-ink" strokeWidth={1.6} />
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[15px] leading-snug text-ink">
              Você fala como fala em casa. Ele acha pelo nome da <b className="font-bold">etiqueta</b>.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
