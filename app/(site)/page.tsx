import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PulsaSection } from "@/components/PulsaSection";
import { Services } from "@/components/Services";
import { Trust } from "@/components/Trust";
import { ValueBand } from "@/components/ValueBand";
import { getCatalog, getQris, toCheckoutCategories, toServices } from "@/lib/catalog";

/** Katalog diisi admin lewat panel — cukup revalidasi berkala, bukan tiap request. */
export const revalidate = 60;

export default async function HomePage() {
  const [catalog, qris] = await Promise.all([getCatalog(), getQris()]);
  const services = toServices(catalog);
  const checkout = toCheckoutCategories(catalog);

  return (
    <>
      <Hero />
      <Services services={services} checkout={checkout} qris={qris} />
      <PulsaSection checkout={checkout} qris={qris} />
      <ValueBand />
      <HowItWorks />
      <Trust />
    </>
  );
}
