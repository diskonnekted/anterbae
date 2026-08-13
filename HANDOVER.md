# Dokumen Handover Pengembangan - Anterbae

Dokumen ini berisi rangkuman kemajuan (*progress*), keputusan arsitektur, pemecahan bug (*bug fixes*), serta panduan langkah selanjutnya untuk pengembang berikutnya pada proyek **Anterbae**.

---

## 📌 Ringkasan Teknologi & Lingkungan Kerja
* **Framework Utama:** Next.js (Version 16.2.6) menggunakan Turbopack.
* **Database & Content Management:** Sanity CMS (Studio terpasang di Vercel/Sanity).
* **Integrasi WhatsApp:** Gateway API Fonnte untuk pesan/notifikasi background otomatis.
* **Layanan Pemetaan:** Leaflet Maps (dengan CSS Leaflet dan Custom Markers).
* **Domain Utama:** `anterbae.vercel.app` (Menggantikan domain lama `anterbae.id`).

---

## 🚀 Rangkuman Progress Pengerjaan

### 1. Integrasi & Notifikasi WhatsApp via Gateway Fonnte
* **Modal Pesan Terpadu:** Mengganti tautan luar WhatsApp (`wa.me`) di popup penanda kurir pada Peta Admin (`PetaKurir.tsx`) dengan modal input form React internal. Admin dapat mengetik dan mengirim pesan langsung di latar belakang via gateway Fonnte API tanpa membuka tab baru/aplikasi WA.
* **Aktivasi Kurir Langsung:** Menambahkan tombol **⚡ Aktifkan Kurir** pada popup peta kurir offline yang memanggil Server Action `toggleCourierStatus(courierId, true)`.
* **Notifikasi WhatsApp Otomatis:** Sistem secara otomatis mengirim pesan WhatsApp ke kurir saat status akunnya diaktifkan oleh admin.

### 2. Penerapan Redirect URL Pendek (Short Links)
* Mengatur aturan pengalihan (*redirects*) Next.js di `next.config.ts`:
  * `/k` -> diarahkan ke `/kurir` (Portal Kurir).
  * `/c/:order` -> diarahkan ke `/m/antar-jemput/confirm?order=:order` (Konfirmasi Selesai Pengantaran).
* Mengubah semua template pesan notifikasi di Server Actions untuk mengirim tautan pendek yang bersih tanpa protokol (seperti `anterbae.vercel.app/k` atau `anterbae.vercel.app/c/ID_PESANAN`).

### 3. Perbaikan Bug Blank Data pada Vercel Production
* **Analisis Masalah:** Halaman mobile di production Vercel (`anterbae.vercel.app`) sebelumnya tidak menampilkan produk dan merchant, padahal berjalan normal di localhost. Penyebabnya adalah API routes read-only (`promo-products`, `top-merchants`, `search-products`) menggunakan inisialisasi client manual dengan `token` rahasia tulis (write-token) yang tidak terdefinisi di server production Vercel.
* **Solusi:** Mengubah pemanggilan database di routes tersebut untuk menggunakan shared read-only `client` dari `@/sanity/lib/client` yang bersifat bebas token sehingga data ter-load sempurna di local maupun production.

### 4. Penyempurnaan Form Pengantaran Mobile
* **Ubah Nama Layanan:** Mengganti nama layanan dari **"Antar Jemput"** menjadi **"Pengantaran"** di seluruh antarmuka mobile demi konsistensi bahasa.
* **Pintasan Pendaftaran Data Diri:** 
  * Kolom pendaftaran **"Nama Lengkap"** kini diletakkan di bagian teratas (sebelum kolom *No. WhatsApp*).
  * Kolom nama dan alamat lengkap **muncul secara default** saat pertama kali halaman dimuat (mengasumsikan pelanggan baru).
  * Begitu nomor WhatsApp yang diketik selesai diverifikasi (debound 500ms) dan terdeteksi **sudah terdaftar**, kolom pendaftaran nama dan alamat otomatis disembunyikan dan sistem langsung menampilkan info user terdaftar.
* **Dropdown Lokasi Cepat Penjemputan:** Mengubah barisan daftar tombol lokasi cepat penjemputan yang panjang menjadi sebuah komponen select **Dropdown** yang ringkas untuk menghemat ruang vertikal layar HP.
* **Perbaikan Placeholder:** Mengubah placeholder input lokasi jemput menjadi lebih ringkas: *"Lokasi jemput"*.

### 5. Fitur Klaim Promo Spesial Dinamis
* Mengaktifkan tombol **"Klaim Sekarang"** pada banner Promo Spesial di landing page mobile dengan popup dialog interaktif.
* Memanfaatkan penyimpanan browser (`localStorage`) untuk memastikan klaim kode gratis ongkir unik (`AB-FREE-XXXX`) hanya berlaku satu kali per pengguna baru.
* Menyediakan instruksi dan tombol kirim langsung via WhatsApp bagi pelanggan baru untuk mengirim kode vouchernya ke admin.

### 6. Perubahan Bottom Navbar Mobile
* Menghapus menu **"Pesan" / "Chat"** (yang sebelumnya mengarah ke WA eksternal) dan menggantinya dengan menu **"Antar"** yang langsung menautkan navigasi internal secara mulus ke halaman form pengantaran `/m/antar-jemput`.

### 7. Perbaikan Landing Page Desktop & Profil Driver
* **Kategori Rata Tengah:** Mengubah struktur grid kategori produk di desktop landing page (`src/app/page.tsx`) menjadi layout wrap flexbox yang rata tengah (`justify-center`) secara simetris.
* **Pemuatan Semua Kategori:** Mengubah query `CATEGORIES_QUERY` di Sanity queries (`src/sanity/lib/queries.ts`) dengan menghapus batasan parentless, sehingga semua kategori utama dan sub-kategori dimuat lengkap di desktop.
* **Peta Fokus Lokasi Merchant:** Form pemesanan makanan desktop (`/pesan`) kini menyertakan peta interaktif yang otomatis bergeser (*flyTo*) memusatkan posisi tepat ke koordinat latitude & longitude milik merchant/resto yang sedang dipilih di dropdown.
* **Profil Tim Kurir:** Mengubah bentuk foto profil driver pada landing page desktop menjadi lingkaran sempurna (`rounded-full`) dan menambahkan avatar inisial nama berwarna merah sebagai cadangan jika file foto belum diunggah di database.

### 8. Perbaikan Bug Crash Peta Leaflet (Unmount Exception)
* Memecahkan TypeError `Cannot read properties of undefined (reading 'appendChild')` pada `src/components/PetaInteraktif.tsx` dengan menerapkan variabel pelacak status mount (`isMounted = true`) dalam `useEffect`. Kode `.addTo(map)` GeoJSON tidak akan dieksekusi jika peta sudah di-unmount/dihapus oleh React untuk menghindari crash.

---

## 🛠️ Perbaikan Teknis & Validasi Kompilasi
Semua file kode yang dimodifikasi telah divalidasi dan diuji menggunakan compiler TypeScript.
* **Command Validasi:** `npx tsc --noEmit`
* **Status Terakhir:** **Lolos Bersih Tanpa Error (Exit code 0)**.
* **Git Status:** Seluruh file kode telah di-commit dan didorong (*pushed*) ke repositori GitHub utama Anda.

---

## ➡️ Panduan Pengembangan Selanjutnya

### 1. Uji Coba Lacak Webhook WhatsApp
* Jika Anda mengaktifkan penerimaan pesan balasan dari kurir, periksa endpoint webhook di `/api/wa-webhook` untuk memastikan Fonnte berhasil meneruskan koordinat GPS kurir dan memperbarui database Sanity secara real-time.

### 2. Mengaktifkan Layanan yang Sedang Dikembangkan
* Saat ini, layanan **Antar Paket**, **Jastip**, **Express**, dan **Layanan Lainnya** di halaman mobile dibatasi dengan banner *"Layanan ini sedang dalam proses pengembangan"* dan tombol pemesanannya dinonaktifkan sebagai *"Belum Tersedia"*.
* Ketika siap diluncurkan, silakan hapus pemeriksaan kondisi tersebut di `src/app/m/page.tsx` dan aktifkan kembali tombol kirim ke tautan WhatsApp.

### 3. Pengisian Foto Profil Kurir
* Berikan akses bagi tim kurir atau melalui panel Sanity Studio untuk mengunggah berkas gambar pada kolom `photo` dokumen tipe `courier` agar avatar inisial nama secara bertahap digantikan dengan foto riil para kurir.
