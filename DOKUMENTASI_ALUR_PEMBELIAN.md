# 📖 Dokumentasi Alur Pembelian - Anterbae Banjarnegara

## 🛵 Cara Pesan Makanan via Anterbae

Anterbae adalah layanan kurir online untuk pesan antar makanan, paket, dan jastip di seluruh wilayah Kabupaten Banjarnegara.

---

## 📋 Alur Pembelian Makanan

### 1️⃣ Pilih Restoran / Warung

1. Buka aplikasi Anterbae di browser HP atau komputer
2. Klik menu **"Pesan"** atau **"Makanan"**
3. Pilih daftar restoran / warung yang tersedia
4. Klik card restoran untuk melihat menu

![Pilih Restoran](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mobile app screen showing restaurant list with food cards, clean UI, red and white theme&image_size=portrait_16_9)

---

### 2️⃣ Pilih Menu Makanan

1. Lihat daftar menu yang tersedia di restoran
2. Klik tombol **"Tambah ke Pesanan"** untuk setiap menu yang diinginkan
3. Atur jumlah (qty) dengan tombol **+** dan **-**
4. Isi catatan khusus per item (opsional):
   - Contoh: "Tidak pedas", "Nasi goreng aja", "Jangan sayur"
5. Lihat ringkasan pesanan di floating button bawah layar

![Pilih Menu](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mobile app screen showing food menu with add to cart buttons, quantity controls, and floating cart button at bottom&image_size=portrait_16_9)

---

### 3️⃣ Checkout & Isi Data Pemesan

1. Klik tombol **"Lanjut Pembayaran"** di floating cart button
2. Isi form data pemesan:
   - **Nama Lengkap**: Nama penerima pesanan
   - **Nomor WhatsApp**: Nomor aktif untuk konfirmasi
   - **Alamat Pengiriman**: Alamat lengkap (Jl., RT/RW, Kelurahan, Kecamatan)
   - **Catatan Tambahan** (opsional): Instruksi khusus untuk kurir
3. Klik tombol **"Gunakan Lokasi Saya (GPS)"** untuk otomatis mengisi koordinat
4. Verifikasi semua data sudah benar

![Checkout Form](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mobile app checkout form with name, phone, address fields and GPS button, clean UI&image_size=portrait_16_9)

---

### 4️⃣ Pilih Metode Pembayaran

Pilih salah satu metode pembayaran:

#### 💵 Opsi A: Bayar di Tempat (COD) - *Disarankan*
- **Keunggulan**: 
  - Tidak perlu transfer dulu
  - Pesanan langsung diproses
  - Kurir ambil uang tunai saat pengantaran
- **Cara**: Siapkan uang tunai sesuai total pesanan
- **Cocok untuk**: Pesanan cepat, tidak mau ribet transfer

#### 🏦 Opsi B: Transfer Dulu
- **Cara**: 
  - Transfer ke BCA 1234567890 a.n. Anterbae Banjarnegara
  - Kirim bukti pembayaran via WhatsApp
  - Tunggu konfirmasi admin (1-5 menit)
- **Cocok untuk**: Yang sudah transfer atau mau bukti pembayaran

Klik salah satu opsi, lalu klik **"Kirim Pesanan"**

![Pilih Pembayaran](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mobile app screen showing two payment options COD and bank transfer with radio buttons&image_size=portrait_16_9)

---

### 5️⃣ Konfirmasi via WhatsApp

Setelah klik "Kirim Pesanan", Anda akan otomatis diarahkan ke WhatsApp dengan pesan yang sudah terisi:

#### Jika COD:
```
🛵 PESANAN MAKANAN FOOD-123456

Terima kasih telah memesan di Warung Nasi Bu Sri

Detail Pesanan:
- Nasi Goreng x2 = Rp 30.000
- Es Teh Manis x2 = Rp 10.000

Subtotal: Rp 30.000
Ongkir: Rp 5.000
TOTAL: Rp 35.000

Cara Pembayaran:
✅ Bayar di Tempat (COD)
Silakan siapkan uang tunai Rp 35.000
Kurir akan mengambil uang saat pengantaran

Pesanan Anda langsung diproses dan kurir akan segera diinformasikan. 🛵

📍 Alamat: Jl. Contoh No. 123, Banjarnegara
```

**Yang harus Anda lakukan:**
1. ✅ **Siapkan uang tunai** sesuai total
2. ✅ **Tunggu konfirmasi** dari admin/kurir via WA
3. ✅ **Jangan ubah nomor HP** yang sudah diisi

#### Jika Transfer:
```
🛵 PESANAN MAKANAN FOOD-123456

... (detail pesanan sama) ...

Cara Pembayaran:
Transfer ke:
BCA: 1234567890
a.n. Anterbae Banjarnegara

Sudah transfer? Klik link berikut untuk kirim bukti:
[Link ke WhatsApp Admin]

Setelah konfirmasi, pesanan akan diproses.
```

**Yang harus Anda lakukan:**
1. 🏦 **Transfer** sesuai total ke rekening BCA
2. 📸 **Screenshot** bukti transfer
3. 💬 **Klik link** di pesan WA untuk kirim bukti ke admin
4. ⏳ **Tunggu konfirmasi** admin (1-5 menit)

---

### 6️⃣ Proses Pesanan

#### Untuk COD:
1. ✅ Pesanan **langsung diproses** (tidak perlu tunggu konfirmasi)
2. 📱 Admin menerima notifikasi WA
3. 🍳 Restoran mulai menyiapkan pesanan
4. 🛵 Kurir terdekat ditunjuk dan dinotifikasi
5. 📞 Kurir menghubungi Anda untuk konfirmasi lokasi
6. 🚀 Kurir mengambil pesanan dari resto
7. 📦 Kurir mengantar ke alamat Anda
8. 💵 **Bayar tunai ke kurir** + terima pesanan
9. ✅ Pesanan selesai

#### Untuk Transfer:
1. ⏳ Pesanan dalam status "Menunggu Pembayaran"
2. 📱 Admin menerima notifikasi WA
3. ✅ Admin konfirmasi pembayaran (1-5 menit)
4. 📱 Resto dan Kurir dinotifikasi
5. 🍳 Resto mulai menyiapkan pesanan
6. 🛵 Kurir mengambil pesanan
7. 📦 Kurir mengantar ke alamat Anda
8. 💵 **Bayar tunai ke kurir** (jika COD) atau sudah lunas (jika transfer)
9. ✅ Pesanan selesai

---

### 7️⃣ Lacak Pesanan (Opsional)

Anda bisa melacak status pesanan kapan saja:

1. Buka menu **"Lacak Pesanan"** di aplikasi
2. Masukkan **nomor pesanan** (contoh: FOOD-123456)
3. Lihat status real-time:
   - ⏳ Menunggu Pembayaran
   - ✅ Dikonfirmasi - Resto Disiapkan
   - 📦 Siap - Menunggu Kurir
   - 🛵 Kurir Mengambil
   - 🚀 Dalam Pengiriman
   - ✔️ Selesai

Atau klik link tracking di WhatsApp untuk langsung ke halaman lacak.

---

## 💡 Tips Penting

### ✅ Agar Pesanan Lebih Cepat:
1. **Gunakan COD** - Langsung diproses, tidak perlu tunggu transfer
2. **Isi alamat lengkap** - Termasuk RT/RW dan landmark
3. **Aktifkan GPS** - Membantu kurir menemukan lokasi Anda
4. **Siapkan uang pas** - Mempercepat proses pembayaran
5. **Angkat telepon** - Kurir mungkin menghubungi untuk konfirmasi

### ⚠️ Catatan Penting:
- **Ongkir**: Rp 5.000 (flat rate seluruh Banjarnegara)
- **Estimasi waktu**: 30-60 menit (tergantung jarak)
- **Jam operasional**: 07.00 - 22.00 WIB
- **Min. pesanan**: Tidak ada minimum
- **Area**: Seluruh kecamatan di Kabupaten Banjarnegara

### 📞 Hubungi Kami:
- **WhatsApp Admin**: [6281234567890](https://wa.me/6281234567890)
- **Jam CS**: 07.00 - 22.00 WIB
- **Lokasi**: Pusat Banjarnegara Kota

---

## 🔄 Contoh Skenario Lengkap

### Skenario 1: Pesan Makan Siang (COD)

**Pukul 11.30**: 
- Buka Anterbae → Pilih "Warung Nasi Bu Sri"
- Pilih: Nasi Goreng x2, Es Teh x2
- Checkout → Isi nama, WA, alamat
- Pilih **COD** → Klik "Kirim Pesanan"

**Pukul 11.31**:
- Terima WA konfirmasi dengan detail pesanan
- Siapkan uang tunai Rp 35.000

**Pukul 11.35**:
- Terima WA dari admin: "Resto sedang menyiapkan pesanan"

**Pukul 11.45**:
- Terima WA dari kurir: "Saya ambil pesanan dari resto, estimasi 10 menit lagi"

**Pukul 11.55**:
- Kurir menghubungi: "Saya sudah di depan resto, 5 menit lagi sampai"

**Pukul 12.00**:
- Kurir sampai di rumah
- Terima pesanan makanan
- Bayar tunai Rp 35.000 ke kurir
- ✅ Selesai!

---

### Skenario 2: Pesan Malam (Transfer)

**Pukul 19.00**:
- Buka Anterbae → Pilih "Soto Pak Ahmad"
- Pilih: Soto Ayam x1, Nasi Putih x1
- Checkout → Isi data
- Pilih **Transfer** → Klik "Kirim Pesanan"

**Pukul 19.01**:
- Terima WA dengan info rekening BCA
- Transfer Rp 30.000 via mobile banking

**Pukul 19.02**:
- Klik link di WA untuk kirim bukti transfer
- Kirim screenshot bukti transfer

**Pukul 19.04**:
- Terima WA dari admin: "Pembayaran dikonfirmasi, pesanan sedang disiapkan"

**Pukul 19.20**:
- Kurir menghubungi: "Sedang mengambil pesanan"

**Pukul 19.35**:
- Kurir sampai, terima pesanan
- ✅ Selesai (sudah transfer sebelumnya)

---

## ❓ FAQ (Pertanyaan Umum)

### Q: Apakah bisa batal setelah pesan?
A: Bisa, hubungi admin via WA secepatnya. Jika resto sudah menyiapkan, mungkin ada biaya administrasi.

### Q: Bagaimana jika pesanan salah/selalu?
A: Foto bukti dan hubungi admin via WA. Kami akan proses komplain.

### Q: Apakah ada min. pesanan?
A: Tidak ada minimum pesanan. Pesan 1 item pun bisa.

### Q: Apakah bisa pesan untuk orang lain?
A: Bisa! Isi nama dan alamat penerima di form checkout.

### Q: Bagaimana jika alamat tidak ditemukan kurir?
A: Pastikan alamat lengkap dengan landmark. Kurir akan menghubungi Anda via WA/telepon.

### Q: Apakah bisa request menu khusus?
A: Bisa isi catatan saat order (misal: "Nasi goreng tidak pedas, extra pedas di samping").

### Q: Bagaimana jika uang saya kurang/lebih saat bayar ke kurir?
A: Disiapkan uang pas ya. Jika kurang/lebih kurir akan menyesuaikan.

---

*Dokumen ini berlaku untuk seluruh wilayah Kabupaten Banjarnegara*
*© 2026 Anterbae Banjarnegara - Cepat, Aman, dan Lokal*
