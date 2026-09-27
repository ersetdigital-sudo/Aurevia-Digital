import type { Feature, Service, Step, Stat, IconLabel } from "@/types";

export const services: Service[] = [
  {
    id: "pulsa",
    title: "Pulsa",
    description: "Pulsa semua operator",
    icon: "phone",
    tileClassName: "bg-[#EFF6FF] text-[#2563EB]",
    items: ["Telkomsel", "XL", "Indosat", "Tri", "Smartfren"],
  },
  {
    id: "pln",
    title: "PLN",
    description: "Token & Tagihan",
    icon: "bolt",
    tileClassName: "bg-[#FEF9C3] text-[#CA8A04]",
    items: ["Token prabayar", "Tagihan pascabayar", "Riwayat token", "Catat meteran"],
  },
  {
    id: "paket-data",
    title: "Paket Data",
    description: "Internet lebih hemat",
    icon: "globe",
    tileClassName: "bg-[#EDE9FE] text-[#7C3AED]",
    items: ["Paket harian", "Paket bulanan", "Roaming internasional", "Add-on sosial media"],
  },
  {
    id: "pdam",
    title: "PDAM",
    description: "Cek & bayar tagihan",
    icon: "droplet",
    tileClassName: "bg-[#DBEAFE] text-[#2563EB]",
    items: ["Jakarta (PAM Jaya)", "Bandung", "Surabaya", "+ 100 kota lainnya"],
  },
  {
    id: "bpjs",
    title: "BPJS",
    description: "Kesehatan & Ketenagakerjaan",
    icon: "shield",
    tileClassName: "bg-[#DCFCE7] text-[#16A34A]",
    items: ["BPJS Kesehatan", "BPJS Ketenagakerjaan", "Penerima upah", "Bukan penerima upah"],
  },
  {
    id: "internet",
    title: "Pembayaran Internet",
    description: "IndiHome, XL, dll",
    icon: "wifi",
    tileClassName: "bg-[#FCE7F3] text-[#DB2777]",
    items: ["IndiHome", "XL Home", "MyRepublic", "Biznet"],
  },
  {
    id: "e-wallet",
    title: "Uang Elektronik",
    description: "Top up e-wallet",
    icon: "card",
    tileClassName: "bg-[#FEE2E2] text-[#DC2626]",
    items: ["GoPay", "OVO", "DANA", "ShopeePay"],
  },
  {
    id: "multifinance",
    title: "Multifinance",
    description: "Cicilan kendaraan & lainnya",
    icon: "car",
    tileClassName: "bg-[#F3F4F6] text-[#4B5563]",
    items: ["Adira Finance", "WOM Finance", "FIF Group", "Mandiri Utama Finance"],
  },
];

export const heroFeatures: Feature[] = [
  { icon: "bolt", title: "Proses Instan", description: "Dalam hitungan detik" },
  { icon: "shield", title: "Transaksi Aman", description: "Data terenkripsi" },
  { icon: "percent", title: "Harga Terjangkau", description: "Lebih hemat" },
  { icon: "clock", title: "Layanan 24/7", description: "Selalu siap untuk kamu" },
];

export const bandFeatures: IconLabel[] = [
  { icon: "tag", label: "Harga terbaik setiap hari" },
  { icon: "card", label: "Banyak pilihan metode pembayaran" },
  { icon: "bell", label: "Notifikasi transaksi real-time" },
  { icon: "lock", label: "Data dan transaksi aman" },
];

export const steps: Step[] = [
  { icon: "phone", title: "Pilih Layanan", description: "Pilih produk yang ingin kamu bayar." },
  { icon: "doc", title: "Masukkan Nomor", description: "Isi nomor HP / ID pelanggan." },
  {
    icon: "check",
    title: "Lakukan Pembayaran",
    description: "Pilih metode pembayaran dan selesai.",
  },
];

export const stats: Stat[] = [
  { icon: "users", value: "10K+", label: "Pengguna Aktif" },
  { icon: "chart", value: "99%", label: "Transaksi Berhasil" },
  { icon: "clock", value: "24/7", label: "Layanan Online" },
];
