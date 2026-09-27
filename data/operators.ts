import type { Operator } from "@/types";

// Harga jual di bawah masih contoh untuk keperluan tampilan.
// Ganti dengan tarif asli dari penyedia sebelum dipakai di produksi.
export const operators: Operator[] = [
  {
    id: "telkomsel",
    name: "Telkomsel",
    packages: [
      { nominal: "Rp 5.000", price: "Rp 5.600" },
      { nominal: "Rp 10.000", price: "Rp 10.500", badge: "Terlaris" },
      { nominal: "Rp 20.000", price: "Rp 20.500" },
      { nominal: "Rp 25.000", price: "Rp 25.500" },
      { nominal: "Rp 50.000", price: "Rp 50.500" },
      { nominal: "Rp 100.000", price: "Rp 100.500" },
      { nominal: "Rp 150.000", price: "Rp 150.600" },
      { nominal: "Rp 200.000", price: "Rp 200.500" },
      { nominal: "Rp 300.000", price: "Rp 302.000" },
      { nominal: "Rp 500.000", price: "Rp 502.000" },
    ],
  },
  {
    id: "xl",
    name: "XL",
    packages: [
      { nominal: "Rp 5.000", price: "Rp 5.700" },
      { nominal: "Rp 10.000", price: "Rp 10.600", badge: "Terlaris" },
      { nominal: "Rp 15.000", price: "Rp 15.600" },
      { nominal: "Rp 25.000", price: "Rp 25.600" },
      { nominal: "Rp 50.000", price: "Rp 50.700" },
      { nominal: "Rp 100.000", price: "Rp 100.700" },
      { nominal: "Rp 200.000", price: "Rp 200.700" },
      { nominal: "Rp 500.000", price: "Rp 502.500" },
    ],
  },
  {
    id: "indosat",
    name: "Indosat",
    packages: [
      { nominal: "Rp 5.000", price: "Rp 5.650" },
      { nominal: "Rp 10.000", price: "Rp 10.550" },
      { nominal: "Rp 20.000", price: "Rp 20.550" },
      { nominal: "Rp 50.000", price: "Rp 50.550", badge: "Terlaris" },
      { nominal: "Rp 100.000", price: "Rp 100.550" },
      { nominal: "Rp 200.000", price: "Rp 200.600" },
    ],
  },
  {
    id: "tri",
    name: "Tri",
    packages: [
      { nominal: "Rp 5.000", price: "Rp 5.800" },
      { nominal: "Rp 10.000", price: "Rp 10.700" },
      { nominal: "Rp 25.000", price: "Rp 25.700" },
      { nominal: "Rp 50.000", price: "Rp 50.800", badge: "Terlaris" },
      { nominal: "Rp 100.000", price: "Rp 100.800" },
    ],
  },
  {
    id: "smartfren",
    name: "Smartfren",
    packages: [
      { nominal: "Rp 10.000", price: "Rp 10.900" },
      { nominal: "Rp 20.000", price: "Rp 20.900", badge: "Terlaris" },
      { nominal: "Rp 50.000", price: "Rp 50.900" },
      { nominal: "Rp 100.000", price: "Rp 101.000" },
    ],
  },
];
