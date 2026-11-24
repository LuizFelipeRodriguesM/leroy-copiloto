"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, ScanSearch, Timer, X } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { boxStyle, labelInside } from "@/lib/shelf-box";
import { shelfDemos } from "@/lib/shelf-demos";
import { cn } from "@/lib/utils";

type ScanPhase = "scanning" | "lookalikes" | "found";


const stats = [
  { value: "12/12", label: "acertos em fotos reais de prateleira" },
  { value: "5W-30", label: "contra 10W-40: as pegadinhas também passaram" },
  { value: "3", label: "países, com rótulos em italiano, alemão e chinês" },
];

export function WhichOne() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [phase, setPhase] = useState<ScanPhase>("scanning");
  const [visible, setVisible] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        setVisible(isVisible);
        if (isVisible) setPhase("scanning");
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timers = [setTimeout(() => setPhase("lookalikes"), 1700), setTimeout(() => setPhase("found"), 2700)];
    if (!userPicked) {
      timers.push(
        setTimeout(() => {
          setPhase("scanning");
          setDemoIndex((index) => (index + 1) % shelfDemos.length);
        }, 9000),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [demoIndex, visible, userPicked]);

  const pickDemo = (index: number) => {
    setUserPicked(true);
    setPhase("scanning");
    setDemoIndex(index);
  };

  const demo = shelfDemos[demoIndex];
  const portrait = demo.height > demo.width;

  return (
    <section
      id="qual-desses"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#f1f8e8_0%,#fafbf5_100%)] py-28 sm:py-40"
    >
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-deep">O pulo do gato</p>
            <h2 className="mt-4 text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
              Qual desses?
            </h2>
            <p className="mt-3 text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-brand-deep">
              O Charles circula o certo.
            </p>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Na frente de 40 itens quase iguais, essa é a pergunta que hoje só o vendedor responde. Aponta a câmera: o
              Charles lê rótulo, medida e etiqueta, marca o produto certo e explica por que os vizinhos não servem.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-8 flex flex-wrap gap-2">
            {shelfDemos.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pickDemo(index)}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300",
                  index === demoIndex
                    ? "bg-ink text-white shadow-[0_10px_20px_-10px_rgba(18,23,14,.6)]"
                    : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink",
                )}
              >
                {item.tab}
              </button>
            ))}
          </Reveal>

          <Reveal delay={200} className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.value}>
                <p className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold tracking-[-0.04em] text-ink">{stat.value}</p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{stat.label}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-xs leading-relaxed text-ink-soft/70">
            Teste feito em 2026-11-22 com o Gemini 3.5 Flash e fotos públicas do Wikimedia Commons, conferido caixa por
            caixa.
          </p>
        </div>

        <Reveal delay={150}>
          <div className="relative mx-auto" style={{ maxWidth: portrait ? "min(460px, 100%)" : "100%" }}>
            <div
              key={demo.id}
              className="bubble-in relative mb-4 ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-[6px] bg-ink px-4 py-3 text-[15px] font-semibold leading-snug text-white"
            >
              {demo.question}
            </div>

            <div
              className="relative overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgba(18,23,14,.55)]"
              style={{ aspectRatio: `${demo.width} / ${demo.height}` }}
            >
              <Image
                key={demo.photo}
                src={demo.photo}
                alt={`Prateleira de loja: ${demo.tab}`}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-ink/35 transition-opacity duration-700",
                  phase === "found" ? "opacity-100" : "opacity-0",
                )}
              />

              {phase === "scanning" && (
                <>
                  <div className="scan-line absolute inset-x-0 h-[18%] bg-[linear-gradient(to_bottom,transparent,rgba(156,209,103,.55)_85%,#9cd167)]" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
                    <ScanSearch className="size-4 text-brand-deep" />
                    Charles lendo a prateleira
                  </div>
                </>
              )}

              {phase !== "scanning" &&
                demo.lookalikes.map((lookalike, index) => (
                  <div
                    key={`${demo.id}-${index}`}
                    className="pop-in absolute rounded-xl border-2 border-dashed border-signal bg-signal/10"
                    style={{ ...boxStyle(lookalike.box), animationDelay: `${index * 160}ms` }}
                  >
                    <span
                      className={cn(
                        "absolute left-1 flex items-center gap-1 whitespace-nowrap rounded-full bg-signal px-2 py-0.5 text-[11px] font-extrabold text-ink",
                        labelInside(lookalike.box) ? "top-1" : "-top-7",
                      )}
                    >
                      <X className="size-3" strokeWidth={3.5} />
                      não
                    </span>
                  </div>
                ))}

              {phase === "found" && (
                <div className="pop-in box-pulse absolute rounded-xl border-[3px] border-brand" style={boxStyle(demo.box)}>
                  <span
                    className={cn(
                      "absolute left-1 flex items-center gap-1 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-xs font-extrabold text-ink",
                      labelInside(demo.box) ? "top-1" : "-top-8",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3.5} />
                    ESTE
                  </span>
                </div>
              )}
            </div>

            <div
              className={cn(
                "relative -mt-10 mx-4 rounded-3xl bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(18,23,14,.45)] ring-1 ring-ink/5 transition-all duration-500 sm:mx-8",
                phase === "found" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-deep">Charles achou</p>
                  <p className="mt-1 text-lg font-extrabold leading-tight tracking-[-0.02em]">{demo.answer}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-ink">
                  <Timer className="size-3.5" />
                  {demo.seconds.toLocaleString("pt-BR")} s
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{demo.reason}</p>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                {demo.lookalikes.map((lookalike) => (
                  <li key={lookalike.name} className="flex gap-2 text-sm leading-snug">
                    <X className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={3} />
                    <span>
                      <strong className="font-bold">{lookalike.name}:</strong>{" "}
                      <span className="text-ink-soft">{lookalike.whyNot}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
