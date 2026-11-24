import Image from "next/image";
import { photoCredits } from "@/lib/shelf-demos";

const team = ["Luiz Felipe Rodrigues Machado", "Vitor Gomes", "Pedro Sato", "Felipe Wunder"];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-brand-soft">
              <Image src="/charles/parafuso.png" alt="" width={32} height={32} />
            </span>
            <span className="text-lg font-extrabold tracking-[-0.03em]">
              Leroy <span className="text-brand-deep">Copiloto</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Do problema à prateleira. Um assistente de IA pra jornada do cliente dentro da loja física.
          </p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink">Projeto</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>Challenge Leroy Merlin 2026</li>
            <li>FIAP · Engenharia de Software</li>
            <li>Grupo 115</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink">Time</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {team.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink">Créditos</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {photoCredits.map((credit) => (
              <li key={credit.href}>
                <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  {credit.label}
                </a>
                , {credit.author} ({credit.license})
              </li>
            ))}
            <li>
              Charles em 3D com{" "}
              <a
                href="https://github.com/DominikScholz/open-bot-avatar"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                open-bot-avatar
              </a>{" "}
              (MIT) e three.js
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-ink-soft/70 sm:px-6">
        Projeto acadêmico, sem vínculo comercial com a Leroy Merlin.
      </div>
    </footer>
  );
}
