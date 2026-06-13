# Anterbae Delivery 🛵⚡

**Anterbae Delivery** adalah platform layanan pesan antar makanan, paket, dan jasa titip (jastip) lokal terpercaya untuk seluruh wilayah Kabupaten Banjarnegara. Dirancang dengan antarmuka yang modern, cepat, dan responsif.

Aplikasi ini menghubungkan pelanggan dengan mitra merchant lokal (warung, restoran, apotek, toko kelontong) secara langsung melalui sistem pemesanan via WhatsApp yang terintegrasi.

## 🚀 Fitur Utama

### 🛒 Katalog Mitra & Produk
*   **Mitra Terverifikasi**: Menampilkan daftar mitra merchant yang beroperasi di sekitar Banjarnegara.
*   **Pencarian Cerdas**: Temukan produk, makanan, atau kebutuhan sehari-hari dengan mudah.
*   **Profil Mitra Dinamis**: Halaman detail merchant lengkap dengan banner (*cover*), logo, status operasional, dan katalog produk.

### ⚡ Performa Tinggi & Optimal
*   **Optimasi LCP**: Penggunaan `next/image` dengan prioritas tinggi pada aset utama untuk pemuatan halaman yang instan.
*   **Sanity Edge CDN**: Seluruh data dinamis dari CMS dikirim langsung dari ujung server terdekat (*edge*) untuk respons yang secepat kilat (TTFB rendah).
*   **Incremental Static Regeneration (ISR)**: Halaman-halaman utama telah di- *cache* statis di sisi *server* (`revalidate = 60`) sehingga meminimalisasi waktu tunggu pengguna hingga 0 milidetik saat halaman dimuat.

### 📱 Desain Responsif & Modern
*   **UI/UX Bersih**: Dirancang dengan Tailwind CSS yang rapi, *micro-animations*, serta tata letak bergaya modern-minimalis.
*   **Ikon Konsisten**: Menggunakan `lucide-react` untuk memastikan semua ikon (*flat icon*) terlihat seragam dan profesional.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **CMS**: [Sanity.io](https://www.sanity.io/) (Headless CMS for Content & Products)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database**: Terintegrasi langsung dengan Next-Sanity Live API

## 📦 Instalasi Lokal

1.  **Clone Repository**:
    ```bash
    git clone https://github.com/diskonnekted/anterbae.git
    cd anterbae
    ```

2.  **Instal Dependensi**:
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**:
    Buat file `.env.local` dan isi dengan kredensial Sanity Anda:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_SANITY_DATASET="production"
    SANITY_API_WRITE_TOKEN="your_write_token"
    ```

4.  **Jalankan Mode Pengembangan**:
    ```bash
    npm run dev
    ```
    Buka `http://localhost:3000` di browser Anda.

## 🌐 Kontribusi & Dukungan

Platform ini dikembangkan untuk memajukan ekosistem pesan antar dan memberdayakan pelaku usaha lokal di Banjarnegara. Segala bentuk dukungan, pelaporan *bug*, maupun usulan fitur dapat dikirimkan melalui *Issues* di repositori ini.

---
**Anterbae Delivery** - *Cepat, Aman, dan Lokal.*
© 2026 Anterbae Banjarnegara.
