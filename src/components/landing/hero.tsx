"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Hand } from "lucide-react";
import { CharlesEmbed, type CharlesMood, type CharlesPoke } from "@/components/landing/charles-embed";
import { cn } from "@/lib/utils";

type CharlesLine = { text: string; mood: CharlesMood };

const idleLines: CharlesLine[] = [
  { text: "Charles. Ao seu dispor.", mood: "happy" },
  { text: "Torneira pingando? Já vi piores.", mood: "idle" },
  { text: "Um instante, procurando o seu corredor…", mood: "thinking" },
  { text: "Corredor 41, à sua esquerda.", mood: "happy" },
  { text: "Bucha comum no drywall? Jamais.", mood: "idle" },
  { text: "Sem pressa. Eu sei onde fica tudo.", mood: "happy" },
];

const pokeLines: Record<CharlesPoke, string[]> = {
  tap: ["Pois não?", "Às ordens.", "Cócegas, não, por gentileza."],
  spin: ["Opa! A cartola, por favor.", "Devagar. Sou um parafuso de respeito."],
};

const LINE_INTERVAL = 4200;
const SHOW_FALLBACK = 3500;
const LANDING_DELAY = 620;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [landed, setLanded] = useState(false);
  const [hopSignal, setHopSignal] = useState(0);
  const [line, setLine] = useState({ ...idleLines[0], index: 0, key: 0 });
  const pokeCount = useRef(0);

  const handleShown = useCallback(() => setShown(true), []);

  const handlePoke = useCallback((kind: CharlesPoke) => {
    pokeCount.current += 1;
    const options = pokeLines[kind];
    const text = options[pokeCount.current % options.length];
    setLine((current) => ({ ...current, text, key: current.key + 1 }));
  }, []);

  useEffect(() => {
    const fallback = window.setTimeout(() => setShown(true), SHOW_FALLBACK);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!shown) return;
    const timer = window.setTimeout(() => {
      setLanded(true);
      setHopSignal((count) => count + 1);
    }, LANDING_DELAY);
    return () => window.clearTimeout(timer);
  }, [shown]);

  useEffect(() => {
    if (!landed) return;
    const timer = window.setInterval(() => {
      setLine((current) => {
        const index = (current.index + 1) % idleLines.length;
        return { ...idleLines[index], index, key: current.key + 1 };
      });
    }, LINE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [landed]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      section.style.setProperty("--scroll", progress.toFixed(3));
      section.style.setProperty("--mx", pointerX.toFixed(3));
      section.style.setProperty("--my", pointerY.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      schedule();
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", handlePointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pb-12 pt-20 sm:px-6"
      style={{
        background:
          "radial-gradient(55% 45% at 50% 42%, #e6f4d4 0%, rgba(230,244,212,0) 70%), linear-gradient(180deg, #fafbf5 0%, #f3f8ea 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[26%] -z-10 flex select-none justify-center sm:top-[24%]"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -18px - var(--scroll, 0) * 14vw), calc(var(--my, 0) * -10px + var(--scroll, 0) * 10vh), 0)",
        }}
      >
        <span className="outline-word rise text-[clamp(5.4rem,22vw,22rem)] font-extrabold leading-none tracking-[-0.06em]">
          Charles
        </span>
      </div>

      <div
        className="relative aspect-square w-[min(100vw,62svh,680px)]"
        style={{
          transform: "translate3d(0, calc(var(--scroll, 0) * -14vh), 0) scale(calc(1 - var(--scroll, 0) * 0.18))",
        }}
      >
        <div
          className={cn(
            "absolute bottom-[3%] left-1/2 h-[7%] w-[34%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(36,64,12,.32),transparent)] transition-all duration-700",
            landed ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
        <div className={cn("absolute inset-0 origin-bottom", shown ? "charles-drop" : "opacity-0")}>
          <CharlesEmbed
            eager
            fit={1.16}
            mood={landed ? line.mood : "idle"}
            hopSignal={hopSignal}
            onShown={handleShown}
            onPoke={handlePoke}
            className="size-full"
          />
        </div>

        <div className="pointer-events-none absolute left-[57%] top-[2%] w-max max-w-[38vw] sm:left-[71%] sm:top-[12%] sm:max-w-[250px]">
          {landed && (
            <div
              key={line.key}
              className="bubble-in rounded-2xl rounded-bl-[6px] bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(18,23,14,.35)] ring-1 ring-ink/5"
            >
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-deep">
                Charles
              </span>
              <span className="mt-0.5 block text-sm font-semibold leading-snug text-ink sm:text-[15px]">{line.text}</span>
            </div>
          )}
          <span
            className={cn(
              "mt-3 flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-opacity delay-700 duration-700 max-sm:hidden",
              landed ? "opacity-100" : "opacity-0",
            )}
          >
            <Hand className="size-3.5" />
            Clica ou gira ele
          </span>
        </div>
      </div>

      <div className="relative -mt-2 flex max-w-6xl flex-col items-center text-center sm:-mt-4">
        <h1 className="rise text-[clamp(2.3rem,4.7vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-ink [--rise-delay:120ms]">
          Do problema à <span className="text-brand-deep">prateleira</span>.
        </h1>
        <p className="rise mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg [--rise-delay:220ms]">
          Conta o que quebrou do seu jeito. O Charles monta a lista, leva você até o corredor e circula o produto certo
          na prateleira.
        </p>
        <div className="rise mt-7 flex flex-wrap items-center justify-center gap-3 [--rise-delay:320ms]">
          <Link
            href="/app"
            className="group flex items-center gap-2.5 rounded-full bg-brand py-3 pl-6 pr-3 text-base font-bold text-ink shadow-[0_14px_30px_-12px_rgba(79,138,28,.75)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Falar com o Charles
            <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </span>
          </Link>
          <a
            href="#como-funciona"
            className="flex items-center gap-2 rounded-full px-5 py-3.5 text-base font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            Como funciona
            <ArrowDown className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
