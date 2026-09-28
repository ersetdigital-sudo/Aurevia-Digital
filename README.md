# Aurevia Digital

Landing page Aurevia Digital — hasil konversi dari HTML statis ke Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, dengan animasi Framer Motion dan SEO lengkap.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi seluruh variabel di bawah
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
| `npm run seed`    | Pratinjau seed katalog dari `data/` |

## Environment

| Variabel | Dipakai untuk |
| -------- | ------------- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Baca katalog & pengaturan (RLS: hanya baris aktif) |
| `SUPABASE_SERVICE_ROLE_KEY` | Tulis pesanan/pesan + seluruh API admin (server-only) |
| `ADMIN_PASSWORD` | Login panel admin (juga jadi kunci tanda tangan cookie sesi) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET` | Upload gambar produk & QRIS (signed upload dari server) |

Base URL situs tidak perlu diisi: `data/site.ts` menghitungnya otomatis dari `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` (disediakan Vercel) dan `http://localhost:3000` di lokal, jadi domain kustom yang baru dipasang langsung ikut terpakai di sitemap, robots, dan JSON-LD.

Isi tabel `categories`, `products`, `orders`, `messages`, `settings` dengan menjalankan `supabase/schema.sql` di SQL Editor Supabase.

## Panel Admin & Data Dinamis

- Panel admin ada di `/admin` (login `/admin/login`, satu password dari `ADMIN_PASSWORD`). Menu: Ringkasan, Produk & kategori, Pesanan, Pesan, Pengaturan (foto QRIS + info kontak).
- Semua API admin dijaga cookie sesi bertanda tangan HMAC (`lib/adminAuth.ts`); upload gambar lewat `/api/cloudinary/sign` sehingga API secret Cloudinary tidak pernah sampai ke browser.
- Halaman depan mengambil kategori/produk dari Supabase (`lib/catalog.ts`). Kalau tabel masih kosong atau gagal diambil, situs otomatis memakai data statis di `data/` supaya tidak pernah blank.
- Pesanan dari checkout disimpan ke Supabase lewat `POST /api/orders`; halaman `/status` membaca ulang lewat `GET /api/orders/[ref]`.

## Checklist deploy Vercel

1. Isi 8 variabel env di Project → Settings → Environment Variables untuk **Production** dan **Preview** (daftar lengkap di tabel environment di atas). Tanpa `SUPABASE_SERVICE_ROLE_KEY` panel admin tidak bisa login, tanpa kredensial Cloudinary upload gambar mati, dan tanpa `ADMIN_PASSWORD` sesi admin tidak bisa dibuat.
2. Pasang domain produksi di Project → Settings → Domains lalu arahkan DNS ke Vercel. URL di sitemap, robots, dan JSON-LD ikut menyesuaikan otomatis, tidak ada env yang perlu diubah.
3. Jalankan `supabase/schema.sql` di SQL Editor Supabase sekali, lalu `npm run seed -- --apply` untuk mengisi katalog awal.
4. Mengubah env var hanya berpengaruh setelah deployment berikutnya — picu redeploy (push commit atau Redeploy dari dashboard) setelah menambah/mengubah env.
5. Setelah deploy, cek cepat: `/admin/login` harus 200, login admin berhasil, dan upload gambar di menu Produk berjalan.

### Mengisi katalog awal

```bash
npm run seed              # pratinjau: berapa kategori/produk yang akan dibuat
npm run seed -- --apply   # tulis ke Supabase
npm run seed -- --apply --reset   # hapus katalog lama lalu tulis ulang
```

Setelah tersimpan, semua isi katalog bisa diedit dari panel admin tanpa deploy ulang.

### Pesanan demo untuk uji tampilan admin

```bash
npm run seed:orders                    # pratinjau 12 pesanan demo
npm run seed:orders -- --apply         # tulis ke Supabase
npm run seed:orders -- --apply --reset-only   # hapus lagi pesanan demo
```

Semua baris demo ditandai `note = "Data demo"`, jadi bisa dibersihkan kapan saja tanpa menyentuh pesanan asli. Pesanan asli dari checkout punya nomor referensi acak (`AD-XXXXXX`), sedangkan yang demo memakai pola `AD-DEMO01`…`AD-DEMO12` dan bisa dicoba langsung di halaman `/status`.

## Struktur

```
app/
  layout.tsx        Root layout: font & metadata
  (site)/           Halaman publik (Header, Footer, JSON-LD) — page, tentang, bantuan, status, legal
  admin/            Panel admin: login + (panel) berisi ringkasan, produk, pesanan, pesan, pengaturan
  api/              API admin, checkout pesanan, form pesan, tanda tangan upload Cloudinary
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
  content.ts        Daftar layanan di halaman depan
  checkout.ts       Kategori & produk checkout + fallback katalog
  status.ts         Contoh transaksi & status sistem
lib/                Helper `cn`, ikon, format, checkout, supabase, cloudinary, adminAuth
types/              Tipe data bersama
public/images/      Aset gambar
app/fonts/          File font lokal
supabase/schema.sql Skema tabel + RLS
scripts/            Seed katalog untuk pengisian awal
```

## Catatan

- Tema terang/gelap memakai token CSS di `app/globals.css`; `.dark` di `<html>` membalik token, jadi komponen tidak perlu `dark:` berulang.
- Warna ikut `prefers-color-scheme` saat pertama kali dibuka, lalu preferensi user disimpan di `localStorage`.
- Semua konten berulang (layanan, paket pulsa, langkah, statistik, link footer) ada di `data/` supaya penambahan item tidak perlu mengubah komponen.
