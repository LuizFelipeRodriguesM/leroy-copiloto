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
    </>
  );
}
