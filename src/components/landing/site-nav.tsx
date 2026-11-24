import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = [
  { href: "#o-charles", label: "O Charles" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#qual-desses", label: "Qual desses?" },
  { href: "#pra-leroy", label: "Pra Leroy" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full bg-white/75 py-2.5 pl-3 pr-2.5 shadow-[0_10px_30px_-14px_rgba(18,23,14,.25)] ring-1 ring-ink/5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 rounded-full pr-2" aria-label="Leroy Copiloto, início">
          <span className="grid size-11 place-items-center rounded-full bg-brand-soft">
            <Image src="/charles/parafuso.png" alt="" width={36} height={36} />
          </span>
          <span className="text-[15px] font-extrabold tracking-[-0.03em]">
            Leroy <span className="text-brand-deep">Copiloto</span>
          </span>
        </Link>

        <div className="hidden items-center lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/app"
          className="group flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-px"
        >
          <span className="hidden sm:inline">Falar com o Charles</span>
          <span className="sm:hidden">Começar</span>
          <span className="grid size-7 place-items-center rounded-full bg-brand text-ink transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </span>
        </Link>
      </nav>
    </header>
  );
}
