import type { SocialLink, TextLink } from "@/types";

export const footerServiceLinks: TextLink[][] = [
  [
    { label: "Pulsa", href: "/#transaksi" },
    { label: "PLN", href: "/#layanan" },
    { label: "Paket Data", href: "/#layanan" },
    { label: "PDAM", href: "/#layanan" },
  ],
  [
    { label: "BPJS", href: "/#layanan" },
    { label: "Pembayaran Internet", href: "/#layanan" },
    { label: "Uang Elektronik", href: "/#layanan" },
    { label: "Multifinance", href: "/#layanan" },
  ],
];

export const footerHelpLinks: TextLink[] = [
  { label: "Pusat Bantuan", href: "/bantuan" },
  { label: "Cara Transaksi", href: "/#cara-transaksi" },
  { label: "Cek Status", href: "/status" },
  { label: "Hubungi Kami", href: "/bantuan#kontak" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
];

// Ganti dengan akun media sosial Aurevia Digital yang sebenarnya.
// Nilai di sini hanya default; tautan aktif diatur lewat menu Pengaturan admin.
export const socialLinks: SocialLink[] = [
  { label: "Instagram", icon: "ig", href: "#" },
  { label: "YouTube", icon: "yt", href: "#" },
  { label: "TikTok", icon: "tt", href: "#" },
  { label: "Facebook", icon: "fb", href: "#" },
  { label: "X", icon: "x", href: "#" },
];

/**
 * Rapikan data sosmed dari database: platform mengikuti default (urutan + ikon),
 * label & href diambil dari data admin bila valid. Data hilang/rusak -> default.
 */
export function normalizeSocials(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) return socialLinks;

  return socialLinks.map((fallback) => {
    const found = raw.find(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object" &&
        (item as { icon?: unknown }).icon === fallback.icon,
    );
    const href = typeof found?.href === "string" ? found.href.trim().slice(0, 200) : fallback.href;
    const label =
      typeof found?.label === "string" && found.label.trim()
        ? found.label.trim().slice(0, 40)
        : fallback.label;
    return { ...fallback, label, href };
  });
}

/** Sosmed yang layak ditampilkan di footer (sudah diisi URL-nya). */
export function activeSocials(links: SocialLink[]): SocialLink[] {
  return links.filter((link) => link.href && link.href !== "#");
}

export const legalLinks: TextLink[] = [
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
];
