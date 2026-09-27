import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PulsaSection } from "@/components/PulsaSection";
import { Services } from "@/components/Services";
import { Trust } from "@/components/Trust";
import { ValueBand } from "@/components/ValueBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <PulsaSection />
      <ValueBand />
      <HowItWorks />
      <Trust />
    </>
  );
}
