# Aurevia Digital

Landing page Aurevia Digital — hasil konversi dari HTML statis ke Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, dengan animasi Framer Motion dan SEO lengkap.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # opsional, isi SITE_URL dengan domain asli
npm run dev
```

Buka http://localhost:3000

| Script            | Fungsi                        |
| ----------------- | ----------------------------- |
| `npm run dev`     | Development server            |
| `npm run build`   | Build produksi                |
| `npm start`       | Jalankan hasil build          |
| `npm run lint`    | ESLint                        |
| `npm run typecheck` | Cek TypeScript tanpa emit   |

## Struktur

```
app/
  layout.tsx        Root layout: font, metadata, JSON-LD, Header & Footer
  page.tsx          Susunan section halaman utama
  tentang/page.tsx  Halaman Tentang Kami
  bantuan/page.tsx  Halaman Pusat Bantuan
  status/page.tsx   Halaman Cek Status Transaksi
  globals.css       Tema (token warna + dark mode) & komponen dasar
  fonts.ts          Plus Jakarta Sans via next/font/local
  icon.svg          Favicon (monogram Aurevia)
  sitemap.ts        /sitemap.xml
  robots.ts         /robots.txt
components/
  Header, Footer, Logo, ThemeToggle        Kerangka halaman
  Hero, HeroSearchForm                     Section hero + form pencarian
  Services, HowItWorks, Trust, ValueBand   Section konten
  PulsaSection, CheckoutDrawer             Produk pulsa + alur checkout 4 langkah
  StatusChecker, ServiceStatus             Cek status transaksi + status sistem
  HelpCenter, HelpTopics, FaqList          Pusat bantuan
  About, ContactBand                       Halaman tentang + kanal kontak
  Icon, IconSprite                         Sistem ikon (SVG sprite)
  Reveal                                   Wrapper animasi scroll-reveal
  JsonLd                                   Structured data
data/               Semua konten statis (edit di sini, bukan di JSX)
lib/                Helper `cn`, ikon, format, checkout, dsb
types/              Tipe data bersama
public/images/      Aset gambar
app/fonts/          File font lokal
```

## Catatan

- Tema terang/gelap memakai token CSS di `app/globals.css`; `.dark` di `<html>` membalik token, jadi komponen tidak perlu `dark:` berulang.
- Warna ikut `prefers-color-scheme` saat pertama kali dibuka, lalu preferensi user disimpan di `localStorage`.
- Semua konten berulang (layanan, paket pulsa, langkah, statistik, link footer) ada di `data/` supaya penambahan item tidak perlu mengubah komponen.
