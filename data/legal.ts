import type { LegalDoc, LegalSection } from "@/types";

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

export const privacyMeta: LegalDoc["meta"] = {
  effectiveDate: "28 September 2026",
  lastUpdated: "2026-09-28",
  version: "1.0",
};

export const privacyIntro =
  "Kebijakan ini menjelaskan data apa saja yang kami kumpulkan saat kamu memakai Aurevia Digital, " +
  "cara kami menggunakannya, dan pilihan yang kamu miliki atas data tersebut.";

export const privacySections: LegalSection[] = [
  {
    id: "ruang-lingkup",
    title: "Ruang Lingkup",
    paragraphs: [
      "Kebijakan Privasi ini berlaku untuk penggunaan situs dan layanan Aurevia Digital, termasuk halaman Cek Status, Pusat Bantuan, dan seluruh transaksi yang diproses melalui platform kami.",
      "Dengan melanjutkan penggunaan situs, kamu memahami cara kami menangani informasi sebagaimana dijelaskan di sini.",
    ],
  },
  {
    id: "data",
    title: "Data yang Kami Kumpulkan",
    paragraphs: [
      "Kami hanya mengumpulkan informasi yang dibutuhkan untuk memproses dan memverifikasi transaksi:",
    ],
    items: [
      "Data transaksi: nomor HP atau ID pelanggan, kategori layanan, produk/nominal, dan nilai transaksi.",
      "Nomor invoice (format AD-XXXXXX) beserta waktu pembuatan dan status transaksi.",
      "Data kontak yang kamu sampaikan sendiri saat mengajukan komplain lewat WhatsApp atau email.",
      "Preferensi tampilan (terang/gelap) yang disimpan di peramban kamu.",
    ],
  },
  {
    id: "cara",
    title: "Cara Pengumpulan",
    paragraphs: [
      "Data transaksi dikumpulkan secara otomatis saat kamu mengisi form checkout dan melakukan pembayaran.",
      "Kami tidak pernah meminta PIN kartu, kata sandi rekening, maupun kode OTP — informasi tersebut menjadi tanggung jawab kamu sepenuhnya.",
    ],
  },
  {
    id: "tujuan",
    title: "Tujuan Penggunaan",
    paragraphs: ["Data yang terkumpul dipakai untuk:"],
    items: [
      "Memproses transaksi dan menerbitkan nomor invoice.",
      "Memverifikasi pembayaran serta menampilkan status lewat halaman Cek Status.",
      "Menangani komplain, refund, dan penelusuran transaksi bermasalah.",
      "Memenuhi kewajiban hukum serta mencegah penyalahgunaan layanan.",
      "Meningkatkan kualitas layanan dan keamanan platform.",
    ],
  },
  {
    id: "perangkat",
    title: "Penyimpanan di Perangkatmu",
    paragraphs: [
      "Sebagian data hanya tersimpan di peramban kamu lewat localStorage, bukan di server kami:",
    ],
    items: [
      "aurevia-theme — preferensi tema terang/gelap.",
      "aurevia.invoices — riwayat invoice contoh untuk keperluan demo transaksi.",
      "Keduanya bisa kamu hapus kapan saja lewat pengaturan privasi peramban tanpa memengaruhi transaksi yang sudah tercatat di sistem kami.",
    ],
  },
  {
    id: "berbagi",
    title: "Berbagi Data dengan Pihak Ketiga",
    paragraphs: [
      "Kami membagikan data secukupnya hanya kepada pihak yang diperlukan untuk menyelesaikan transaksi, yaitu penyedia layanan (principal), penyedia QRIS, serta mitra bank atau e-wallet.",
      "Data tidak pernah dijual, disewakan, atau dipertukarkan untuk kepentingan promosi pihak lain.",
    ],
  },
  {
    id: "keamanan",
    title: "Keamanan Data",
    paragraphs: [
      "Seluruh komunikasi antara peramban dan situs kami terenkripsi lewat HTTPS.",
      "Akses terhadap data transaksi dibatasi hanya untuk tim yang menangani operasional dan penanganan komplain.",
    ],
  },
  {
    id: "retensi",
    title: "Berapa Lama Data Disimpan",
    paragraphs: [
      "Data transaksi disimpan selama masih diperlukan untuk keperluan verifikasi, riwayat pelanggan, dan penyelesaian sengketa.",
      "Setelah masa tersebut berakhir, data dihapus atau dianonimkan sesuai ketentuan hukum yang berlaku.",
    ],
  },
  {
    id: "hak",
    title: "Hak Kamu atas Data",
    paragraphs: ["Kamu berhak untuk:"],
    items: [
      "Mengetahui data apa yang kami simpan tentang transaksi kamu.",
      "Meminta koreksi data yang keliru.",
      "Meminta penghapusan data, sepanjang tidak bertentangan dengan kewajiban hukum kami.",
      "Menghapus data yang tersimpan di peramban secara mandiri.",
    ],
  },
  {
    id: "anak",
    title: "Data Anak",
    paragraphs: [
      "Layanan Aurevia Digital ditujukan untuk pengguna berusia 17 tahun ke atas. Kami tidak sengaja mengumpulkan data dari anak di bawah usia tersebut.",
    ],
  },
  {
    id: "tautan",
    title: "Tautan ke Pihak Ketiga",
    paragraphs: [
      "Situs ini dapat memuat tautan ke kanal media sosial kami. Ketentuan privasi di situs tersebut berada di luar tanggung jawab Aurevia Digital.",
    ],
  },
  {
    id: "perubahan-privasi",
    title: "Perubahan Kebijakan",
    paragraphs: [
      "Kebijakan ini dapat diperbarui sewaktu-waktu. Versi terbaru beserta tanggal berlakunya selalu dipublikasikan di halaman ini.",
    ],
  },
  {
    id: "kontak-privasi",
    title: "Kontak",
    paragraphs: [
      "Pertanyaan, permintaan data, atau keluhan mengenai privasi dapat disampaikan lewat Pusat Bantuan Aurevia Digital setiap hari 07.00–23.00 WIB.",
    ],
  },
];

export const termsDoc: LegalDoc = {
  title: "Syarat & Ketentuan",
  intro: termsIntro,
  outro:
    "Dengan menggunakan Aurevia Digital, kamu menyetujui seluruh ketentuan di atas. " +
    "Terima kasih sudah mempercayakan pembayaran harianmu kepada kami.",
  meta: termsMeta,
  sections: termsSections,
};

export const privacyDoc: LegalDoc = {
  title: "Kebijakan Privasi",
  intro: privacyIntro,
  outro:
    "Data kamu bukan milik kami untuk dibagikan. Jika ada hal yang ingin diketahui soal " +
    "penanganan datamu, tim kami siap menjelaskan lewat Pusat Bantuan.",
  meta: privacyMeta,
  sections: privacySections,
};
