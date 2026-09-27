import { parseRupiah } from "@/lib/format";
import { operators } from "@/data/operators";
import type { CheckoutCategory, CheckoutGroup } from "@/types";

const activePeriodByNominal: Record<string, string> = {
  "Rp 5.000": "+7 hari",
  "Rp 10.000": "+14 hari",
  "Rp 15.000": "+14 hari",
  "Rp 20.000": "+30 hari",
  "Rp 25.000": "+30 hari",
  "Rp 50.000": "+45 hari",
  "Rp 100.000": "+60 hari",
  "Rp 150.000": "+90 hari",
  "Rp 200.000": "+90 hari",
  "Rp 300.000": "+120 hari",
  "Rp 500.000": "+150 hari",
};

const pulsaGroups: CheckoutGroup[] = operators.map((operator) => ({
  name: operator.name,
  items: operator.packages.map((pkg) => ({
    label: `Pulsa ${pkg.nominal.replace(/^Rp\s*/, "")}`,
    detail: `Masa aktif ${activePeriodByNominal[pkg.nominal] ?? "+30 hari"}`,
    price: parseRupiah(pkg.price),
  })),
}));

export const checkoutCategories: CheckoutCategory[] = [
  {
    id: "pulsa",
    nominalTitle: "Pilih Nominal Pulsa",
    field: {
      label: "Nomor Handphone",
      placeholder: "08xxxxxxxxxx",
      hint: "Operator terdeteksi otomatis (Telkomsel, Indosat, XL, Tri, Smartfren).",
    },
    admin: 0,
    groups: pulsaGroups,
  },
  {
    id: "pln",
    nominalTitle: "Pilih Token Listrik",
    field: {
      label: "Nomor Meter / ID Pelanggan",
      placeholder: "14123456789",
      hint: "11–12 digit angka pada meteran atau kartu pelanggan.",
    },
    admin: 2500,
    groups: [
      {
        name: "Token Prabayar",
        items: [
          { label: "Token 20.000", detail: "± 14,3 kWh", price: 22500 },
          { label: "Token 50.000", detail: "± 35,8 kWh", price: 52500 },
          { label: "Token 100.000", detail: "± 71,6 kWh", price: 102500 },
          { label: "Token 200.000", detail: "± 143 kWh", price: 202500 },
          { label: "Token 500.000", detail: "± 358 kWh", price: 502500 },
          { label: "Token 1.000.000", detail: "± 716 kWh", price: 1002500 },
        ],
      },
      {
        name: "Pascabayar",
        items: [
          { label: "Tagihan Bulan Ini", detail: "Nominal sesuai tagihan berjalan", price: 0, variable: true },
        ],
      },
    ],
  },
  {
    id: "paket-data",
    nominalTitle: "Pilih Paket Data",
    field: {
      label: "Nomor Handphone",
      placeholder: "08xxxxxxxxxx",
      hint: "Paket aktif maksimal 5 menit setelah pembayaran terverifikasi.",
    },
    admin: 0,
    groups: [
      {
        name: "Kuota Harian",
        items: [
          { label: "1 GB / 3 Hari", detail: "Kuota utama 24 jam", price: 12000 },
          { label: "2 GB / 7 Hari", detail: "Kuota utama 24 jam", price: 19000 },
        ],
      },
      {
        name: "Kuota Bulanan",
        items: [
          { label: "5 GB / 30 Hari", detail: "Kuota utama 24 jam", price: 40000 },
          { label: "10 GB / 30 Hari", detail: "Kuota utama 24 jam", price: 65000 },
          { label: "15 GB / 30 Hari", detail: "Kuota utama + aplikasi", price: 80000 },
          { label: "25 GB / 30 Hari", detail: "Kuota utama 24 jam", price: 95000 },
          { label: "50 GB / 30 Hari", detail: "Kuota utama 24 jam", price: 135000 },
          { label: "Unlimited 30 Hari", detail: "FUP 2 GB/hari", price: 120000 },
        ],
      },
    ],
  },
  {
    id: "pdam",
    nominalTitle: "Pilih Tagihan / Estimasi PDAM",
    field: {
      label: "ID Pelanggan PDAM",
      placeholder: "1102003456",
      hint: "Nomor tertera pada struk atau kartu pelanggan PDAM.",
    },
    admin: 2500,
    groups: [
      {
        name: "Tagihan Air",
        items: [
          { label: "Tagihan Bulan Ini", detail: "Nominal sesuai tagihan", price: 0, variable: true },
          { label: "Estimasi RT A1", detail: "± 10 m³ pemakaian", price: 67500 },
          { label: "Estimasi RT A2", detail: "± 15 m³ pemakaian", price: 98500 },
          { label: "Estimasi RT B", detail: "± 20 m³ pemakaian", price: 142500 },
        ],
      },
    ],
  },
  {
    id: "bpjs",
    nominalTitle: "Pilih Nominal BPJS",
    field: {
      label: "Nomor Kartu BPJS",
      placeholder: "0001234567890",
      hint: "13 digit nomor peserta BPJS Kesehatan / Ketenagakerjaan.",
    },
    admin: 2500,
    groups: [
      {
        name: "BPJS Kesehatan",
        items: [
          { label: "Kelas I - 1 Bulan", detail: "Rp150.000 / jiwa", price: 152500 },
          { label: "Kelas II - 1 Bulan", detail: "Rp100.000 / jiwa", price: 102500 },
          { label: "Kelas III - 1 Bulan", detail: "Rp35.000 / jiwa", price: 37500 },
          { label: "Kelas I - 3 Bulan", detail: "Rp450.000 / jiwa", price: 452500 },
          { label: "Kelas II - 3 Bulan", detail: "Rp300.000 / jiwa", price: 302500 },
          { label: "Kelas III - 3 Bulan", detail: "Rp105.000 / jiwa", price: 107500 },
        ],
      },
      {
        name: "BPJS Ketenagakerjaan",
        items: [
          { label: "BPU - 1 Bulan", detail: "Bukan Penerima Upah", price: 39300 },
          { label: "Tagihan Berjalan", detail: "Sesuai tagihan berjalan", price: 0, variable: true },
        ],
      },
    ],
  },
  {
    id: "internet",
    nominalTitle: "Pilih Nominal Pembayaran Internet",
    field: {
      label: "Nomor Pelanggan Internet",
      placeholder: "1234567890",
      hint: "Nomor ID pelanggan tertera pada tagihan bulanan.",
    },
    admin: 2500,
    groups: [
      {
        name: "Paket Langganan",
        items: [
          { label: "IndiHome 30 Mbps", detail: "Internet + TV interaktif", price: 302500 },
          { label: "IndiHome 50 Mbps", detail: "Internet + TV + Telepon", price: 387500 },
          { label: "Biznet 100 Mbps", detail: "Internet broadband super cepat", price: 375500 },
          { label: "First Media 50 Mbps", detail: "Internet + TV kabel HD", price: 291500 },
          { label: "MyRepublic 100 Mbps", detail: "Internet gaming low latency", price: 332500 },
        ],
      },
      {
        name: "Lainnya",
        items: [
          { label: "Tagihan Bulan Ini", detail: "Sesuai nominal tagihan provider", price: 0, variable: true },
        ],
      },
    ],
  },
  {
    id: "e-wallet",
    nominalTitle: "Pilih Nominal E-Wallet",
    field: {
      label: "Nomor HP / ID E-Wallet",
      placeholder: "08xxxxxxxxxx",
      hint: "Gunakan nomor HP terdaftar di aplikasi e-wallet; untuk e-Toll isi 16 digit nomor kartu.",
    },
    admin: 1000,
    groups: ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"].map((wallet) => ({
      name: wallet,
      items: [20000, 50000, 100000, 200000, 500000].map((amount) => ({
        label: `Top Up ${amount.toLocaleString("id-ID")}`,
        detail: wallet,
        price: amount + 1000,
      })),
    })).concat([
      {
        name: "e-Toll",
        items: [50000, 100000, 200000].map((amount) => ({
          label: `e-Toll ${amount.toLocaleString("id-ID")}`,
          detail: "e-Money / TapCash / Flazz",
          price: amount + 1000,
        })),
      },
    ]),
  },
  {
    id: "multifinance",
    nominalTitle: "Pilih Nominal Multifinance",
    field: {
      label: "Nomor Kontrak Perjanjian",
      placeholder: "001234567890",
      hint: "Nomor kontrak tertera pada buku angsuran nasabah.",
    },
    admin: 3500,
    groups: [
      {
        name: "Angsuran Kendaraan",
        items: [
          { label: "FIF Group", detail: "Angsuran motor Honda", price: 853500 },
          { label: "Adira Finance", detail: "Angsuran motor / mobil", price: 1253500 },
          { label: "BAF", detail: "Angsuran motor Yamaha", price: 753500 },
          { label: "WOM Finance", detail: "Angsuran pembiayaan motor", price: 703500 },
        ],
      },
      {
        name: "Pembiayaan & Paylater",
        items: [
          { label: "Home Credit", detail: "Cicilan gadget & elektronik", price: 453500 },
          { label: "Kredivo", detail: "Tagihan cicilan paylater", price: 353500 },
          { label: "Akulaku", detail: "Tagihan belanja kredit", price: 303500 },
          { label: "Tagihan Berjalan", detail: "Sesuai kontrak perjanjian", price: 0, variable: true },
        ],
      },
    ],
  },
];

export function getCheckoutCategory(id: string): CheckoutCategory {
  return checkoutCategories.find((category) => category.id === id) ?? checkoutCategories[0];
}
