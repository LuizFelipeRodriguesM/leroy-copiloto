import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="beam chunky relative mx-auto max-w-7xl overflow-hidden rounded-[48px] bg-brand px-6 py-14 text-center sm:py-20">
          <div className="dot-grid absolute inset-0 opacity-50" />
          <Image
            src="/charles/parafuso.png"
            alt=""
            width={120}
            height={120}
            className="float-slow relative mx-auto [--float-rot:-4deg]"
          />
          <h2 className="relative mx-auto mt-6 max-w-5xl text-balance text-[clamp(2.2rem,4.6vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Do problema à prateleira, sem se perder.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-brand-ink">
            Escaneia o QR da entrada, conta o que você precisa e deixa o Charles fazer o resto.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="chunky press inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-6 pr-3 text-base font-bold text-white"
            >
              Falar com o Charles
              <span className="grid size-9 place-items-center rounded-full bg-brand text-ink">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full px-5 py-4 text-base font-bold text-ink transition-colors hover:bg-white/50"
            >
              Rever como funciona
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
