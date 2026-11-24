"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { CharlesEmbed, type CharlesMood } from "@/components/landing/charles-embed";
import { PHONE_HEIGHT, PHONE_WIDTH, PhoneFrame, phoneScreens } from "@/components/landing/phone-screens";
import { cn } from "@/lib/utils";

type Step = {
  title: string;
  text: string;
  line: string;
  mood: CharlesMood;
};

const steps: Step[] = [
  {
    title: "Conta o problema",
    text: "Do jeito que você falaria com um vendedor: “minha torneira tá pingando”. Escreve, manda áudio ou foto da peça.",
    line: "Pois não? Pode contar do seu jeito.",
    mood: "idle",
  },
  {
    title: "Ele pergunta o que importa",
    text: "Duas ou três perguntas, numa tela montada na hora pra aquele problema. Nada de formulário genérico.",
    line: "Só duas perguntinhas, prometo.",
    mood: "idle",
  },
  {
    title: "A lista vem pronta",
    text: "Peça certa, quantidade calculada e aquilo que você ia esquecer, tipo o veda-rosca. Com o estoque daquela loja.",
    line: "Pronto. Não esqueci do veda-rosca.",
    mood: "happy",
  },
  {
    title: "Leva você até a prateleira",
    text: "Rota corredor por corredor. Na frente da prateleira, aponta a câmera e ele circula o item certo.",
    line: "Por aqui, por gentileza.",
    mood: "happy",
  },
];

const HERO_SETTLE_MS = 1800;
const DESKTOP_RESERVED = 140;
const MOBILE_RESERVED = 330;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [phoneScale, setPhoneScale] = useState(1);
  const [embedMounted, setEmbedMounted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
      setProgress(Math.round(next * 1000) / 1000);
      const reserved = window.matchMedia("(min-width: 1024px)").matches ? DESKTOP_RESERVED : MOBILE_RESERVED;
      const scale = Math.min(1, Math.max(0.55, (window.innerHeight - reserved) / PHONE_HEIGHT));
      setPhoneScale(Math.round(scale * 100) / 100);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || embedMounted) return;
    let timer = 0;
    const mount = () => setEmbedMounted(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) mount();
      },
      { rootMargin: "100% 0px" },
    );
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "charles:shown") return;
      window.clearTimeout(timer);
      timer = window.setTimeout(mount, HERO_SETTLE_MS);
    };
    observer.observe(section);
    window.addEventListener("message", handleMessage);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timer);
    };
  }, [embedMounted]);

  const stepFloat = progress * steps.length;
  const activeStep = Math.min(steps.length - 1, Math.floor(stepFloat));
  const step = steps[activeStep];

  const goToStep = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.25) / steps.length) * travel, behavior: "smooth" });
  };

  return (
    <section id="como-funciona" ref={sectionRef} className="relative h-[400svh] bg-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_1fr] gap-5 px-4 pb-4 pt-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:grid-rows-1 lg:items-center lg:gap-16 lg:py-0">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-deep">Como funciona</p>
            <h2 className="mt-3 hidden text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.045em] lg:block">
              Você conta.
              <br />
              <span className="text-ink/35">Ele resolve o resto.</span>
            </h2>

            <ol className="mt-10 hidden max-w-md lg:block">
              {steps.map((item, index) => {
                const isActive = index === activeStep;
                const isDone = index < activeStep;
                const fill = Math.min(1, Math.max(0, stepFloat - index));
                return (
                  <li key={item.title} className="relative pl-14">
                    {index < steps.length - 1 && (
                      <span className="absolute -bottom-2 left-[19px] top-[56px] w-[2px] overflow-hidden rounded-full bg-ink/10">
                        <span className="block w-full rounded-full bg-brand-deep" style={{ height: `${fill * 100}%` }} />
                      </span>
                    )}
                    <button type="button" onClick={() => goToStep(index)} className="block w-full py-3 text-left">
                      <span
                        className={cn(
                          "absolute left-0 top-3 grid size-10 place-items-center rounded-full text-sm font-extrabold tabular-nums transition-all duration-500",
                          isActive && "scale-110 bg-brand text-ink ring-[1.5px] ring-ink",
                          isDone && "bg-brand-soft text-brand-ink",
                          !isActive && !isDone && "bg-white text-ink-soft ring-1 ring-line",
                        )}
                      >
                        {isDone ? <Check className="size-4" strokeWidth={3} /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "block pt-1.5 text-xl font-extrabold tracking-[-0.03em] transition-colors duration-500",
                          isActive ? "text-ink" : "text-ink/35 hover:text-ink/60",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-2 text-base leading-relaxed text-ink-soft">{item.text}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="lg:hidden">
              <div className="relative mt-2 h-[150px]">
                {steps.map((item, index) => (
                  <div
                    key={item.title}
                    aria-hidden={index !== activeStep}
                    className={cn(
                      "absolute inset-0 transition-all duration-500 ease-out",
                      index === activeStep
                        ? "translate-y-0 opacity-100"
                        : index < activeStep
                          ? "-translate-y-3 opacity-0"
                          : "translate-y-3 opacity-0",
                    )}
                  >
                    <p className="text-xs font-bold tabular-nums text-ink-soft">
                      <span className="text-brand-deep">{String(index + 1).padStart(2, "0")}</span> / 04
                    </p>
                    <h3 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-snug text-ink-soft">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                {steps.map((item, index) => (
                  <span key={item.title} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                    <span
                      className="block h-full rounded-full bg-brand-deep"
                      style={{ width: `${Math.min(1, Math.max(0, stepFloat - index)) * 100}%` }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:mr-40">
            <div className="relative" style={{ width: PHONE_WIDTH * phoneScale, height: PHONE_HEIGHT * phoneScale }}>
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(156,209,103,.38),transparent)]"
              />
              <PhoneFrame className="origin-top-left" style={{ transform: `scale(${phoneScale})` }}>
                {phoneScreens.map((Screen, index) => (
                  <div
                    key={index}
                    data-active={index === activeStep}
                    aria-hidden={index !== activeStep}
                    className={cn(
                      "absolute inset-0 transition-all duration-500 ease-out",
                      index === activeStep
                        ? "translate-y-0 opacity-100"
                        : index < activeStep
                          ? "pointer-events-none -translate-y-5 opacity-0"
                          : "pointer-events-none translate-y-5 opacity-0",
                    )}
                  >
                    <Screen />
                  </div>
                ))}
              </PhoneFrame>

              <div className="absolute -right-[74px] top-[2%] size-[150px] lg:-right-[150px] lg:top-[28%] lg:size-[240px]">
                {embedMounted && (
                  <CharlesEmbed eager fit={1.16} mood={step.mood} hopSignal={activeStep + 1} className="size-full" />
                )}
                <p
                  key={activeStep}
                  className="bubble-in absolute bottom-[94%] left-[50%] hidden w-max max-w-[210px] rounded-2xl rounded-bl-[6px] bg-white px-3.5 py-2.5 text-sm font-bold leading-snug text-ink shadow-[0_14px_30px_-14px_rgba(18,23,14,.45)] ring-1 ring-ink/5 lg:block"
                >
                  {step.line}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
