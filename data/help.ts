import type { IconName } from "@/lib/icons";

export type HelpTopic = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  count: number;
};

export type FaqItem = {
  id: string;
  topic: string;
  question: string;
  answer: string;
};

export type ContactChannel = {
  id: string;
  icon: IconName;
  title: string;
  value: string;
  description: string;
  action: string;
  href: string;
};

export const helpTopics: HelpTopic[] = [
  {
    id: "akun",
    title: "Akun & Pendaftaran",
    description: "Daftar, login, verifikasi email, ganti nomor HP",
    icon: "user",
    count: 5,
  },
  {
    id: "transaksi",
    title: "Cara Transaksi",
    description: "Pilih layanan, masukkan nomor, konfirmasi pembayaran",
    icon: "bolt",
    count: 6,
  },
  {
    id: "pembayaran",
    title: "Metode Pembayaran",
    description: "Virtual account, e-wallet, kartu, minimarket",
    icon: "card",
    count: 4,
  },
  {
    id: "status",
    title: "Status & Transaksi Bermasalah",
    description: "Transaksi belum masuk, gagal, atau tertahan",
    icon: "search",
    count: 7,
  },
  {
    id: "keamanan",
    title: "Keamanan Akun",
    description: "PIN, OTP, dan cara mengenali penipuan",
    icon: "lock",
    count: 4,
  },
  {
    id: "refund",
    title: "Refund & Komplain",
    description: "Pengembalian dana, eskalasi, dan ketentuan waktu",
    icon: "doc",
    count: 3,
  },
];

export const popularSearches = [
  "Transaksi belum masuk",
  "Refund dana",
  "Lupa PIN",
  "Biaya admin",
  "Gagal bayar",
];

export const faqs: FaqItem[] = [
  {
    id: "f1",
    topic: "akun",
    question: "Bagaimana cara mendaftar akun Aurevia Digital?",
    answer:
      "Buka halaman utama dan mulai proses pendaftaran, lalu isi nomor HP aktif. Kami mengirim kode OTP lewat SMS — masukkan kode tersebut dalam 5 menit. Setelah itu lengkapi email dan buat PIN transaksi. Pendaftaran gratis dan tidak membutuhkan kartu identitas.",
  },
  {
    id: "f2",
    topic: "akun",
    question: "Nomor HP saya berganti, bagaimana cara mengubahnya?",
    answer:
      "Masuk ke Akun → Profil → Nomor HP. Sistem akan meminta OTP ke nomor lama lebih dulu. Jika nomor lama sudah tidak aktif, kirim email ke bantuan@aureviadigital.id dari email terdaftar disertai foto KTP dan nomor referensi transaksi terakhir.",
  },
  {
    id: "f3",
    topic: "transaksi",
    question: "Berapa lama proses transaksi di Aurevia Digital?",
    answer:
      "Sebagian besar transaksi selesai di bawah 30 detik. Token listrik PLN dan paket data rata-rata instan, sedangkan pembayaran multifinance bisa memakan waktu hingga 15 menit menunggu konfirmasi dari penyedia. Status selalu bisa dipantau di halaman Cek Status.",
  },
  {
    id: "f4",
    topic: "transaksi",
    question: "Apakah transaksi bisa dibatalkan?",
    answer:
      "Pembayaran yang sudah dikonfirmasi tidak bisa dibatalkan karena dana langsung diteruskan ke penyedia. Untuk pesanan yang masih berstatus Menunggu Pembayaran, cukup jangan bayar — pesanan otomatis batal setelah 30 menit.",
  },
  {
    id: "f5",
    topic: "pembayaran",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Virtual account BCA, Mandiri, BNI, dan BRI; e-wallet (GoPay, OVO, DANA, ShopeePay); kartu debit/kredit Visa dan Mastercard; serta tunai di gerai Alfamart dan Indomaret. Tidak ada biaya tambahan untuk virtual account.",
  },
  {
    id: "f6",
    topic: "pembayaran",
    question: "Kenapa biaya admin berbeda antar metode?",
    answer:
      "Tiap penyedia pembayaran menetapkan biaya sendiri. Virtual account umumnya tanpa biaya, kartu kredit dikenakan 2,9%, dan gerai minimarket Rp 2.500 per transaksi. Biaya selalu ditampilkan sebelum kamu menekan Bayar.",
  },
  {
    id: "f7",
    topic: "status",
    question: "Transaksi sudah dibayar tapi saldo belum masuk, apa yang harus dilakukan?",
    answer:
      "Tunggu maksimal 10 menit karena sebagian bank memproses notifikasi lebih lambat. Jika lewat 10 menit, buka halaman Cek Status dan masukkan nomor referensi AD-XXXXXX. Status yang berarti dana diterima tetapi gagal diteruskan otomatis diproses ulang oleh sistem.",
  },
  {
    id: "f8",
    topic: "status",
    question: "Di mana saya menemukan nomor referensi transaksi?",
    answer:
      "Nomor referensi berformat AD-XXXXXX, tercantum di struk digital setelah pembayaran, di email konfirmasi, dan di menu Riwayat. Simpan nomor ini — diperlukan untuk komplain dan penelusuran ke penyedia.",
  },
  {
    id: "f9",
    topic: "status",
    question: "Apa arti status Gagal di halaman Cek Status?",
    answer:
      "Status Gagal berarti dana kamu tidak diteruskan ke penyedia. Saldo atau dana otomatis dikembalikan ke sumber pembayaran dalam 1×24 jam (virtual account dan e-wallet) atau 3–5 hari kerja (kartu kredit). Tidak perlu mengajukan refund manual.",
  },
  {
    id: "f10",
    topic: "keamanan",
    question: "Apakah Aurevia Digital meminta PIN atau OTP lewat chat?",
    answer:
      "Tidak. Aurevia Digital tidak pernah meminta PIN, OTP, atau kode QR melalui telepon, WhatsApp, maupun media sosial. Jangan pernah memberikan kode tersebut kepada siapa pun, termasuk yang mengaku sebagai petugas Aurevia Digital.",
  },
  {
    id: "f11",
    topic: "keamanan",
    question: "Saya lupa PIN transaksi, bagaimana cara reset?",
    answer:
      "Di layar pembayaran pilih Lupa PIN, lalu verifikasi dengan kode OTP ke nomor terdaftar. Setelah 5 kali salah PIN, akun dikunci selama 30 menit sebagai perlindungan.",
  },
  {
    id: "f12",
    topic: "refund",
    question: "Berapa lama proses pengembalian dana?",
    answer:
      "Virtual account dan e-wallet: maksimal 1×24 jam. Kartu kredit: 3–5 hari kerja tergantung penerbit kartu. Tunai minimarket dikembalikan lewat transfer bank dalam 3 hari kerja — konfirmasikan nomor rekening lewat bantuan@aureviadigital.id.",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    id: "chat",
    icon: "chat",
    title: "Live Chat WhatsApp",
    value: "0811-8899-1200",
    description: "Rata-rata balasan di bawah 5 menit, setiap hari 07.00–23.00 WIB.",
    action: "Chat sekarang",
    href: "#kontak",
  },
  {
    id: "email",
    icon: "mail",
    title: "Email",
    value: "bantuan@aureviadigital.id",
    description: "Cocok untuk laporan dengan lampiran bukti transfer. Dibalas kurang dari 12 jam kerja.",
    action: "Kirim email",
    href: "mailto:bantuan@aureviadigital.id",
  },
  {
    id: "status",
    icon: "search",
    title: "Lacak Transaksi Sendiri",
    value: "Halaman Cek Status",
    description: "Pakai nomor referensi AD-XXXXXX untuk melihat tahapan transaksi tanpa menunggu CS.",
    action: "Buka Cek Status",
    href: "/status",
  },
];
