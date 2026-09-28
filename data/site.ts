export const siteConfig = {
  name: "Aurevia Digital",
  title: "Aurevia Digital — Bayar Tagihan Lebih Mudah",
  tagline: "Semua Pembayaran, Satu Tempat",
  description:
    "Aurevia Digital memudahkan pembayaran pulsa, paket data, listrik, air, internet, BPJS, e-wallet, hingga multifinance. Transaksi cepat, aman, dan terpercaya.",
  // Fallback ini harus sama dengan SITE_URL di Vercel (produksi = aureviadigital.net),
  // kalau tidak sitemap/robots bisa menunjuk domain yang salah.
  url: process.env.SITE_URL ?? "https://aureviadigital.net",
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
