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
export const socialLinks: SocialLink[] = [
  { label: "Instagram", icon: "ig", href: "#" },
  { label: "YouTube", icon: "yt", href: "#" },
  { label: "TikTok", icon: "tt", href: "#" },
  { label: "Facebook", icon: "fb", href: "#" },
  { label: "X", icon: "x", href: "#" },
];

export const legalLinks: TextLink[] = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
];
