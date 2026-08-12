# 🐛 Laporan Temuan Bug & Kerentanan Aplikasi - Anterbae

Dokumen ini mencatat bug, kelemahan arsitektur, dan ketidakkonsistenan data yang ditemukan di aplikasi **Anterbae**. 

---

## 🔴 HIGH PRIORITY — Perlu Tindakan Segera

### 1. Hardcoded Nomor WhatsApp Admin CS (`6281234567890`)
* **Masalah**: Tautan chat WhatsApp CS pada hampir semua halaman client-side (seperti `/m/page.tsx`, `/pesan/page.tsx`, `/services/food/page.tsx`, `/checkout/page.tsx`, dll.) menggunakan nomor hardcoded `6281234567890`.
* **Dampak**: Jika Admin mengubah nomor telepon operasional mereka di Sanity Studio (pada dokumen `appSettings`), perubahan ini **tidak akan berefek** di sebagian besar halaman aplikasi. Pembeli akan tetap diarahkan ke nomor lama yang di-hardcode.
* **Solusi**: Semua halaman tersebut harus dimigrasikan untuk membaca data nomor telepon dinamis dari Sanity `appSettings` melalui `sanityFetch` atau menggunakan context global.

### 2. Ketiadaan Rate Limiting pada API Order & Notifikasi WA
* **Masalah**: Endpoint Server Action `createDeliveryOrder` tidak memiliki limitasi frekuensi panggilan (*rate limiting*) atau verifikasi keamanan (seperti reCAPTCHA).
* **Dampak**: Aktor jahat dapat membuat bot untuk mengirimkan ribuan pesanan sampah secara otomatis. Karena setiap pesanan memicu pengiriman pesan WhatsApp via Fonnte API (`sendWhatsAppNotification`), hal ini dapat **menghabiskan sisa kuota Fonnte dalam hitungan menit** dan membebani server database Sanity.
* **Solusi**: Pasang token rate limit berbasis IP (misalnya menggunakan Redis di Edge Middleware) atau verifikasi captcha pada formulir checkout sebelum memproses data ke server.

---

## 🟡 MEDIUM PRIORITY — Optimasi & Keandalan

### 3. Ketiadaan Penanganan Error Global (No Error Boundaries)
* **Masalah**: Aplikasi tidak memiliki file handler error khusus seperti `error.tsx` atau `global-error.tsx` di tingkat root route.
* **Dampak**: Jika API Sanity mendadak mati, mengalami *rate limit block*, atau token API kedaluwarsa, aplikasi akan menampilkan layar putih (*blank screen*) atau halaman *Next.js default crash logs* kepada pengguna biasa, yang menurunkan tingkat kepercayaan pembeli.
* **Solusi**: Buat file `src/app/error.tsx` untuk menampilkan halaman kesalahan bermerek Anterbae yang ramah dengan tombol "Muat Ulang" (*Try Again*).

### 4. Peta Leaflet Tidak Dimuat Secara Lazy-Load
* **Masalah**: Peta interaktif Leaflet diimpor secara sinkron (*synchronous import*) di beberapa bagian pelacakan kurir.
* **Dampak**: Ukuran bundle JavaScript awal membesar sekitar **~200KB**. Hal ini memperlambat proses memuat halaman (*first contentful paint*) terutama bagi pengguna handphone dengan koneksi internet 3G/4G lambat di area pedesaan.
* **Solusi**: Ubah import Leaflet di komponen peta menjadi Dynamic Import dengan opsi `ssr: false`:
  ```typescript
  import dynamic from 'next/dynamic'
  const Map = dynamic(() => import('@/components/Map'), { ssr: false })
  ```

---

## 🟢 LOW PRIORITY — Kualitas Code & Caching

### 5. Konfigurasi PWA Tidak Lengkap (Incomplete PWA)
* **Masalah**: Dependency `@ducanh2912/next-pwa` terpasang di `package.json` dan manifest terkonfigurasi secara minimal, tetapi tidak memiliki Service Worker yang memadai untuk penanganan aset luring (*offline caching*).
* **Dampak**: Aplikasi tidak dapat berfungsi sama sekali jika pengguna kehilangan sinyal internet sewaktu-waktu saat memilih produk.
* **Solusi**: Aktifkan strategi caching cache-first untuk aset statis dan stale-while-revalidate untuk data merchant dari Sanity di konfigurasi PWA Next.js.
