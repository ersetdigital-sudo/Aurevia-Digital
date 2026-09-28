/**
 * URL publik situs — dihitung otomatis, tidak perlu env manual.
 *
 * Vercel menyuntikkan VERCEL_PROJECT_PRODUCTION_URL (domain produksi project,
 * ikut berubah sendiri begitu domain kustom dipasang) dan VERCEL_URL untuk
 * deployment yang sedang jalan (preview). Di lokal jatuh ke localhost.
 */
function resolveSiteUrl(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (!host) return "http://localhost:3000";

  const scheme = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https";
  return `${scheme}://${host.replace(/\/+$/, "")}`;
}

export const siteConfig = {
  name: "Aurevia Digital",
  title: "Aurevia Digital — Bayar Tagihan Lebih Mudah",
  tagline: "Semua Pembayaran, Satu Tempat",
  description:
    "Aurevia Digital memudahkan pembayaran pulsa, paket data, listrik, air, internet, BPJS, e-wallet, hingga multifinance. Transaksi cepat, aman, dan terpercaya.",
  url: resolveSiteUrl(),
  locale: "id_ID",
};

export const heroImage = {
  src: "/images/hero-bg.webp",
  width: 1800,
  height: 1501,
  alt: "Meja kerja dengan tanaman dan tumpukan buku sebagai latar halaman utama Aurevia Digital",
};

export const bandImage = {
  src: "/images/value-band-workspace.png",
  width: 1376,
  height: 768,
  alt: "Meja kerja dengan laptop, buku catatan, dan lampu saat menyelesaikan pembayaran lewat Aurevia Digital",
};
