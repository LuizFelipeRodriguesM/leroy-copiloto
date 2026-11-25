import { Smartphone } from "lucide-react";
import { DevicePreview } from "@/components/copilot/device-preview";
import { CharlesBento } from "@/components/landing/charles-bento";
import { FinalCta } from "@/components/landing/final-cta";
import { ForLeroy } from "@/components/landing/for-leroy";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { WhichOne } from "@/components/landing/which-one";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <CharlesBento />
        <HowItWorks />
        <WhichOne />
        <ForLeroy />
        <FinalCta />
      </main>
      <SiteFooter />
      <DevicePreview
        path="/"
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 rounded-full bg-ink py-2 pl-2 pr-5 text-sm font-bold text-white shadow-[0_18px_40px_-14px_rgba(18,23,14,.6)] transition-transform duration-300 hover:-translate-y-0.5 lg:flex"
      >
        <span className="grid size-9 place-items-center rounded-full bg-brand text-ink">
          <Smartphone className="size-4" />
        </span>
        Ver no celular
      </DevicePreview>
    </>
  );
}
