export type SystemState = "operational" | "degraded" | "outage" | "maintenance";

export type SystemStatus = {
  name: string;
  description: string;
  state: SystemState;
  uptime: string;
  checked: string;
};

export type TransactionState = "success" | "processing" | "pending" | "failed";

export type DemoTransaction = {
  ref: string;
  state: TransactionState;
  service: string;
  target: string;
  amount: string;
  method: string;
  createdAt: string;
  updatedAt: string;
  stepIndex: number;
  note: string;
};

export const transactionSteps = [
  "Pesanan dibuat",
  "Pembayaran diterima",
  "Diteruskan ke penyedia",
  "Selesai",
];

export const systemStatuses: SystemStatus[] = [
  {
    name: "Gateway Pembayaran",
    description: "Virtual account, e-wallet, kartu",
    state: "operational",
    uptime: "99,98%",
    checked: "2 menit lalu",
  },
  {
    name: "Pulsa & Paket Data",
    description: "Semua operator seluler",
    state: "operational",
    uptime: "99,95%",
    checked: "2 menit lalu",
  },
  {
    name: "Token & Tagihan PLN",
    description: "Prabayar dan pascabayar",
    state: "operational",
    uptime: "99,91%",
    checked: "3 menit lalu",
  },
  {
    name: "PDAM, BPJS & Internet",
    description: "Tagihan bulanan mitra resmi",
    state: "degraded",
    uptime: "98,74%",
    checked: "2 menit lalu",
  },
  {
    name: "Top Up E-Wallet",
    description: "GoPay, OVO, DANA, ShopeePay",
    state: "operational",
    uptime: "99,99%",
    checked: "4 menit lalu",
  },
];

export const stateLabels: Record<TransactionState, string> = {
  success: "Selesai",
  processing: "Sedang Diproses",
  pending: "Menunggu Pembayaran",
  failed: "Gagal",
};

export const systemStateLabels: Record<SystemState, string> = {
  operational: "Operasional",
  degraded: "Terbatas",
  outage: "Gangguan",
  maintenance: "Pemeliharaan",
};

export const demoTransactions: DemoTransaction[] = [
  {
    ref: "AD-8F4K2Q",
    state: "success",
    service: "Paket Data Telkomsel 25 GB",
    target: "0812-3456-7890",
    amount: "Rp 62.500",
    method: "BCA Virtual Account",
    createdAt: "27 Sep 2026, 14:32",
    updatedAt: "27 Sep 2026, 14:32",
    stepIndex: 3,
    note: "Paket data sudah aktif di nomor tujuan.",
  },
  {
    ref: "AD-2X9M4T",
    state: "processing",
    service: "Token Listrik PLN 200.000",
    target: "5311-2204-8871",
    amount: "Rp 205.000",
    method: "Mandiri Virtual Account",
    createdAt: "27 Sep 2026, 15:04",
    updatedAt: "27 Sep 2026, 15:05",
    stepIndex: 2,
    note: "Dana sudah diterima dan diteruskan ke PLN. Nomor token muncul maksimal 5 menit lagi.",
  },
  {
    ref: "AD-5R1W7B",
    state: "pending",
    service: "BPJS Kesehatan — September",
    target: "0001-8842-7736",
    amount: "Rp 150.000",
    method: "ShopeePay",
    createdAt: "27 Sep 2026, 15:41",
    updatedAt: "27 Sep 2026, 15:41",
    stepIndex: 1,
    note: "Selesaikan pembayaran dalam 30 menit. Pesanan otomatis batal jika lewat batas waktu.",
  },
  {
    ref: "AD-6C3J9D",
    state: "failed",
    service: "Top Up DANA 100.000",
    target: "0857-9911-2043",
    amount: "Rp 101.000",
    method: "Kartu Kredit Visa",
    createdAt: "26 Sep 2026, 21:18",
    updatedAt: "26 Sep 2026, 21:19",
    stepIndex: 2,
    note: "Dana tidak diteruskan ke penyedia dan otomatis dikembalikan ke kartu dalam 1×24 jam.",
  },
];
