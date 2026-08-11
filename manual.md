# Manual Operasional Anterbae - Kurir Online Banjarnegara 🛵⚡

Dokumen ini berisi panduan lengkap untuk mengelola aplikasi Anterbae melalui dashboard Sanity Studio.

## 1. Manajemen Pesanan & Verifikasi Pembeli (Trust Score)

Untuk mencegah pesanan fiktif (fake order) pada sistem COD, Anterbae menggunakan sistem **Trust Score (Skor Kepercayaan)** untuk setiap pembeli.

### Memeriksa Keaslian Pembeli:
1.  Buka dokumen **Pesanan** yang baru masuk.
2.  Lihat pada kolom **"Profil Pelanggan (Pembeli)"**.
3.  Klik dokumen profil pembeli tersebut untuk melihat rekam jejaknya:
    *   **Total COD Berhasil**: Jumlah transaksi yang sukses diselesaikan.
    *   **Total COD Gagal**: Jumlah transaksi fiktif atau pembatalan di tempat.
    *   **Status Verifikasi**: Tanda centang jika pelanggan tersebut sudah dikenal baik oleh Admin.

### Panduan Pengambilan Keputusan:
*   **Pelanggan Baru (Berhasil: 0)**: Admin **WAJIB** menghubungi nomor WhatsApp pelanggan untuk konfirmasi manual sebelum pesanan diteruskan ke mitra.
*   **Pelanggan Terpercaya (Berhasil > 1)**: Pesanan bisa langsung diproses tanpa ragu.
*   **Pelanggan Bermasalah (Gagal > 1)**: Admin berhak membatalkan pesanan atau meminta pelanggan datang mengambil sendiri ke lokasi.

### Alur Kerja Pesanan:
1.  **Status: Menunggu Konfirmasi**: Admin memverifikasi profil pembeli dan stok mitra.
2.  **Status: Diproses Mitra**: Mitra mulai menyiapkan barang.
3.  **Penunjukan Kurir**: Admin memilih kurir dan mengisi instruksi tambahan.
4.  **Status: Sedang Diantar**: Kurir membawa barang ke alamat.
5.  **Status: Selesai (COD)**: **Admin memperbarui angka "Total COD Berhasil"** di profil pembeli setelah kurir menyetorkan uang.

---

## 2. Manajemen Pengguna (Mitra & Kurir)

### Mendaftarkan Mitra Baru:
*   Mitra mendaftar melalui website di menu **"Daftar Mitra"** (Footer).
*   Data masuk ke menu **"Mitra (Merchant)"** dengan status `isVerified: false`.
*   **Admin:** Melakukan survei lokasi. Jika valid, centang **"Status Verifikasi"**.

### Mendaftarkan Kurir Baru:
*   Warga mendaftar melalui website di menu **"Daftar Jadi Kurir"** (Footer).
*   Data masuk ke menu **"Kurir"** dengan status `Inactive`.
*   **Admin:** Verifikasi identitas, lalu ubah status menjadi **"Aktif"**.

---

## 3. Konten & Promosi

### Banner Promosi (Slider):
*   Gunakan menu **"Banner Promosi"**.
*   Wajib unggah gambar versi Desktop (Landscape) dan Mobile (Portrait).

### Produk Terlaris & Promo:
*   **Terlaris**: Centang "Produk Terlaris" agar muncul di halaman depan.
*   **Promo**: Centang "Produk Promo" dan isi "Diskon (%)" untuk mengaktifkan harga coret.

---

## 4. Informasi & Pengumuman

*   Gunakan menu **"Info & Pengumuman"** untuk memposting berita, promo, panduan resmi bagi mitra dan warga di seluruh Kabupaten Banjarnegara.

---
*© 2026 Anterbae Banjarnegara.*
