import type { LegalSection } from "@/types";

export const termsMeta = {
  effectiveDate: "28 September 2026",
  lastUpdated: "2026-09-28",
  version: "1.0",
};

export const termsIntro =
  "Ketentuan ini mengatur hak dan kewajiban kamu saat menggunakan layanan Aurevia Digital. " +
  "Silakan baca seluruh isinya — dengan menggunakan situs ini, kamu dianggap telah membaca dan menyetujuinya.";

export const termsSections: LegalSection[] = [
  {
    id: "penerimaan",
    title: "Penerimaan Ketentuan",
    paragraphs: [
      "Syarat & Ketentuan ini merupakan perjanjian yang mengikat antara kamu selaku pengguna dan Aurevia Digital selaku penyedia layanan pembayaran digital.",
      "Jika kamu tidak setuju dengan seluruh atau sebagian ketentuan ini, mohon untuk tidak menggunakan situs maupun layanan kami.",
    ],
  },
  {
    id: "akun",
    title: "Akun & Pendaftaran",
    paragraphs: [
      "Sebagian layanan dapat digunakan tanpa pendaftaran, namun untuk riwayat transaksi dan penyimpanan invoice kamu diminta menyimpan nomor referensi yang diberikan.",
      "Kamu bertanggung jawab menjaga kerahasiaan data akun dan nomor referensi transaksi yang kamu miliki.",
    ],
    items: [
      "Informasi yang kamu berikan wajib benar dan dapat dipertanggungjawabkan.",
      "Satu nomor HP hanya boleh digunakan untuk satu akun pengguna.",
      "Kami berhak menangguhkan akses jika ditemukan indikasi penyalahgunaan akun.",
    ],
  },
  {
    id: "layanan",
    title: "Layanan yang Tersedia",
    paragraphs: [
      "Aurevia Digital menyediakan pembayaran dan pengisian ulang untuk kebutuhan harian, antara lain:",
    ],
    items: [
      "Pulsa semua operator dan paket data.",
      "Token serta tagihan listrik PLN.",
      "Tagihan air (PDAM), internet, dan BPJS.",
      "Top up e-wallet serta pembayaran multifinance (cicilan kendaraan dan sejenisnya).",
      "Layanan lain yang dapat ditambahkan sewaktu-waktu tanpa pemberitahuan sebelumnya.",
    ],
  },
  {
    id: "harga",
    title: "Harga, Biaya & Promo",
    paragraphs: [
      "Harga yang tertera di halaman layanan sudah mencakup harga pokok produk beserta biaya layanan (admin) yang berlaku pada saat transaksi diproses.",
      "Harga dapat berubah sewaktu-waktu mengikuti kebijakan penyedia dan perubahan tarif dari masing-masing principal.",
      "Promo, diskon, atau cashback hanya berlaku untuk periode, nominal, dan pengguna yang memenuhi syarat yang kami tentukan.",
    ],
  },
  {
    id: "pembayaran",
    title: "Pembayaran",
    paragraphs: [
      "Pembayaran dilakukan lewat QRIS menggunakan m-Banking atau e-wallet pilihan kamu. Instruksi pembayaran berlaku terbatas sesuai waktu yang tertera pada halaman checkout.",
      "Transaksi baru diproses setelah pembayaran kami terima dan terverifikasi otomatis. Pembayaran yang terlambat atau tidak sesuai nominal akan dianggap tidak sah.",
    ],
  },
  {
    id: "transaksi",
    title: "Proses Transaksi & Status",
    paragraphs: [
      "Setiap transaksi yang berhasil dibuat mendapat nomor invoice sendiri berformat AD-XXXXXX, yang dapat digunakan untuk memantau proses lewat halaman Cek Status.",
      "Status transaksi dapat berubah dari Menunggu Pembayaran, Diproses, hingga Berhasil. Kamu tidak perlu melakukan pembayaran ulang selama invoice masih aktif.",
      "Kami berhak menunda transaksi yang terindikasi tidak wajar untuk dilakukan pengecekan lebih lanjut.",
    ],
  },
  {
    id: "refund",
    title: "Pembatalan, Kegagalan & Refund",
    paragraphs: [
      "Karena sifat produk digital, transaksi yang sudah berhasil diproses ke penyedia pada umumnya tidak dapat dibatalkan.",
      "Jika transaksi gagal atau nominal tidak masuk setelah pembayaran terverifikasi, dana dikembalikan sesuai metode pembayaran awal.",
    ],
    items: [
      "Transaksi gagal penuh: pengembalian dana 100% dari harga pokok.",
      "Transaksi terkonfirmasi penyedia namun gagal di sisi pelanggan: kami bantu penelusuran sampai ada keputusan dari penyedia terkait.",
      "Pengajuan pengembalian dana maksimal 3×24 jam sejak transaksi bermasalah.",
    ],
  },
  {
    id: "komplain",
    title: "Komplain & Sengketa",
    paragraphs: [
      "Komplain dapat diajukan lewat Pusat Bantuan dengan menyertakan nomor invoice, waktu transaksi, dan bukti pembayaran.",
      "Tim kami melayani setiap hari 07.00–23.00 WIB dan berusaha menyelesaikan maksimal 2×24 jam kerja sejak kelengkapan data diterima.",
      "Apabila terjadi perselisihan, kedua pihak sepakat mencari penyelesaian secara musyawarah sebelum menempuh jalur hukum.",
    ],
  },
  {
    id: "larangan",
    title: "Penggunaan yang Dilarang",
    paragraphs: ["Kamu tidak boleh menggunakan layanan Aurevia Digital untuk hal berikut:"],
    items: [
      "Aktivitas yang melanggar hukum atau peraturan yang berlaku di Indonesia.",
      "Transaksi yang berasal dari hasil penipuan, pencucian uang, atau peretasan.",
      "Mengganggu keamanan situs, mencoba memasuki sistem tanpa izin, atau memanfaatkan celah teknis.",
      "Menyalahgunakan promo, termasuk pembuatan akun ganda untuk mengklaim bonus berulang.",
    ],
  },
  {
    id: "keamanan",
    title: "Keamanan & Data Pribadi",
    paragraphs: [
      "Kami hanya mengumpulkan data yang diperlukan untuk memproses transaksi dan melayani komplain, serta tidak menjualnya kepada pihak ketiga.",
      "Data transaksi disimpan sebatas kebutuhan operasional, penagihan, dan pemenuhan kewajiban hukum.",
    ],
  },
  {
    id: "tanggung-jawab",
    title: "Pembatasan Tanggung Jawab",
    paragraphs: [
      "Keterlambatan proses yang disebabkan gangguan dari penyedia jasa, perbankan, maupun jaringan internet berada di luar kendali kami.",
      "Kerusakan akibat penyalahgunaan akun oleh pihak ketiga karena kelalaian pengguna dalam menjaga kerahasiaan data menjadi tanggung jawab pengguna.",
      "Layanan diberikan apa adanya tanpa jaminan tertentu, sepanjang diizinkan oleh ketentuan hukum yang berlaku.",
    ],
  },
  {
    id: "perubahan",
    title: "Perubahan Ketentuan",
    paragraphs: [
      "Ketentuan ini dapat diperbarui sewaktu-waktu untuk menyesuaikan layanan, kebijakan penyedia, atau peraturan perundang-undangan.",
      "Versi terbaru selalu dipublikasikan di halaman ini beserta tanggal berlakunya. Penggunaan lanjutan setelah perubahan berarti kamu menyetujui versi terbaru.",
    ],
  },
  {
    id: "kontak",
    title: "Hukum yang Berlaku & Kontak",
    paragraphs: [
      "Ketentuan ini tunduk pada hukum Negara Republik Indonesia. Pertanyaan mengenai Syarat & Ketentuan dapat disampaikan lewat Pusat Bantuan Aurevia Digital.",
    ],
  },
];
