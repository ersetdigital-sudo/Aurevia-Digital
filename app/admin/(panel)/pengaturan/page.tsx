import { SettingsForm } from "@/components/admin/SettingsForm";
import { adminClient } from "@/lib/supabase";
import { normalizeSocials } from "@/data/footer";
import type { QrisSettings, SiteSettings } from "@/types";

export const metadata = { title: "Pengaturan" };

const DEFAULT_QRIS: QrisSettings = {
  image_url: "",
  merchant: "AUREVIA DIGITAL",
  note: "Pindai kode QRIS menggunakan m-Banking atau E-Wallet.",
};

const DEFAULT_SITE: Omit<SiteSettings, "socials"> = {
  announcement: "",
  wa: "",
  email: "",
};

export default async function AdminSettingsPage() {
  const { data } = await adminClient().from("settings").select("key, value");

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;

  const stored = (map.site ?? {}) as Partial<SiteSettings>;
  const site: SiteSettings = {
    ...DEFAULT_SITE,
    ...stored,
    // Platform & ikon tetap mengikuti default; admin hanya mengisi URL-nya.
    socials: normalizeSocials(stored.socials),
  };

  return (
    <SettingsForm
      initialQris={{ ...DEFAULT_QRIS, ...((map.qris as QrisSettings) ?? {}) }}
      initialSite={site}
    />
  );
}
