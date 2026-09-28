import { SettingsForm } from "@/components/admin/SettingsForm";
import { adminClient } from "@/lib/supabase";
import type { QrisSettings, SiteSettings } from "@/types";

export const metadata = { title: "Pengaturan" };

const DEFAULT_QRIS: QrisSettings = {
  image_url: "",
  merchant: "AUREVIA DIGITAL",
  note: "Pindai kode QRIS menggunakan m-Banking atau E-Wallet.",
};

const DEFAULT_SITE: SiteSettings = { announcement: "", wa: "", email: "" };

export default async function AdminSettingsPage() {
  const { data } = await adminClient().from("settings").select("key, value");

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;

  return (
    <SettingsForm
      initialQris={{ ...DEFAULT_QRIS, ...((map.qris as QrisSettings) ?? {}) }}
      initialSite={{ ...DEFAULT_SITE, ...((map.site as SiteSettings) ?? {}) }}
    />
  );
}
