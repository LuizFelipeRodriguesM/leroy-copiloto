import { QrCode, ScanLine } from "lucide-react";
import { AppQrCode } from "@/components/landing/app-qr-code";
import { BenefitBento } from "@/components/landing/benefit-bento";
import { Reveal } from "@/components/landing/reveal";

export function ForLeroy() {
  return (
    <section id="pra-leroy" className="relative scroll-mt-20 bg-white py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-deep">Pra Leroy Merlin</p>
          <h2 className="mt-4 text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Bom pro cliente.
            <br />
            <span className="text-ink/35">Melhor pra loja.</span>
          </h2>
        </Reveal>

        <BenefitBento />

        <Reveal className="mt-5">
          <article className="relative grid items-center gap-10 overflow-hidden rounded-[36px] bg-ink p-8 text-white sm:p-12 md:grid-cols-[1fr_auto]">
            <span
              aria-hidden="true"
              className="absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgba(156,209,103,.3),transparent)]"
            />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-brand">
                <QrCode className="size-6" />
              </span>
              <h3 className="mt-6 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">
                Zero download.
              </h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/70">
                Na loja, o QR fica na entrada e o Charles abre no celular do próprio cliente. Quer ver? Aponta a câmera.
              </p>
            </div>
            <div className="relative mx-auto -rotate-2 rounded-[32px] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(156,209,103,.55)] transition-transform duration-500 hover:rotate-0">
              <AppQrCode size={196} />
              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-extrabold text-ink">
                <ScanLine className="size-4 text-brand-deep" />
                Escaneia e fala com o Charles
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
