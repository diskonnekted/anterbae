# 📝 Cara Insert Produk Dummy ke Sanity

## Opsi 1: Via Sanity Studio Dashboard (RECOMMENDED)

### Langkah:
1. Buka **Sanity Studio**: http://localhost:3000/studio
2. Login dengan akun Sanity Anda
3. Buka menu **"Products"**
4. Klik **"(+) New"** atau **"Create document"**
5. Isi form berikut untuk setiap produk:

### Data Produk yang Harus Di-insert:

#### Untuk Restoran: **Dawet Ayu Asli Banjarnegara**
*(Cari merchant ini di Sanity → copy `_id`-nya → paste di field "Merchant")*

| Nama Produk | Slug | Harga | Stok | Kategori | Best Seller |
|-------------|------|-------|------|----------|-------------|
| Dawet Ayu | `dawet-ayu` | 8000 | 100 | minuman | ✅ Ya |
| Dawet Durian | `dawet-durian` | 12000 | 50 | minuman | ❌ |
| Dawet Telur | `dawet-telur` | 10000 | 60 | minuman | ❌ |
| Es Campur | `es-campur` | 10000 | 40 | minuman | ❌ |
| Nasi Kuning | `nasi-kuning` | 15000 | 30 | makanan-utama | ❌ |
| Sambal | `sambal-dawet` | 3000 | 100 | sampingan | ❌ |

#### Untuk Restoran: **Soto Krandegan**
*(Copy `_id` merchant Soto Krandegan)*

| Nama Produk | Slug | Harga | Stok | Kategori | Best Seller |
|-------------|------|-------|------|----------|-------------|
| Soto Ayam | `soto-ayam-krandegan` | 20000 | 40 | makanan-utama | ✅ Ya |
| Soto Daging | `soto-daging` | 25000 | 25 | makanan-utama | ❌ |
| Soto Rangu | `soto-rangu` | 18000 | 30 | makanan-utama | ❌ |
| Nasi Putih | `nasi-putih-soto` | 5000 | 100 | karbohidrat | ❌ |
| Tahu Goreng | `tahu-goreng-soto` | 4000 | 60 | sampingan | ❌ |
| Tempe Goreng | `tempe-goreng` | 4000 | 60 | sampingan | ❌ |
| Es Teh | `es-teh-soto` | 4000 | 100 | minuman | ❌ |

### Field yang Harus Diisi:
1. **Name**: Nama produk
2. **Slug**: Unique identifier (lowercase, pakai dash)
3. **Description**: Deskripsi singkat
4. **Price**: Harga dalam Rupiah (angka)
5. **Stock**: Jumlah stok (angka)
6. **Merchant**: Reference ke merchant (pilih dari dropdown)
7. **Category**: Kategori produk
8. **Image**: Upload gambar (opsional, bisa pakai placeholder)
9. **isBestSeller**: Centang jika best seller
10. **isPromo**: Centang jika ada promo

---

## Opsi 2: Via Script Node.js

### Syarat:
- Token harus punya permission **"create"** di Sanity dataset
- Cek di: https://www.sanity.io/manage/personal

### Cara:
```bash
# Pastikan .env.local sudah ada
# Jalankan script
node scripts/insert-dummy-products.js
```

### Jika Error Permission:
1. Buka https://www.sanity.io/manage/project
2. Pilih project Anda
3. Pergi ke **API** → **Tokens**
4. Buat token baru dengan permission: `create`, `read`, `update`, `delete`
5. Update di `.env.local`:
   ```
   SANITY_API_TOKEN=<token-baru-dengan-permission-lengkap>
   ```

---

## Opsi 3: Via Sanity CLI

```bash
# Install Sanity CLI jika belum
npm install -g @sanity/cli

# Login
sanity login

# Import data (buat file JSON dulu)
sanity create -d products.json
```

---

## ✅ Checklist Setelah Insert:

- [ ] Semua produk sudah ter-insert
- [ ] Setiap produk sudah di-link ke merchant yang benar
- [ ] Minimal 1 produk per restoran di-set sebagai "Best Seller"
- [ ] Gambar produk sudah di-upload (opsional)
- [ ] Test di aplikasi: buka `/m/food/[slug]` → harus muncul produk

---

## 💡 Tips:

1. **Slug harus unique** di seluruh produk, bukan hanya per merchant
2. **Merchant reference** wajib diisi agar produk muncul di halaman restoran
3. **Stock > 0** agar produk terlihat
4. Gunakan gambar sederhana dari: https://picsum.photos/400/300 untuk testing
