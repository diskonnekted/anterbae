# Analisis Performa & Kapasitas Anterbae

> Analisis mendalam untuk optimasi performa dan evaluasi kapasitas 1000+ transaksi/hari

---

## Ringkasan Eksekutif

**Aplikasi Anterbae** adalah marketplace delivery service yang dibangun dengan **Next.js 16 + Sanity.io** dengan arsitektur solid untuk bisnis skala lokal (Kabupaten Banjarnegara).

### Kapasitas 1000+ Transaksi/Hari?

**YA, bisa.** Dengan asumsi:
- Sanity.io Pro plan (rate limit ~100 req/min read, ~20 req/min write)
- Vercel Pro plan atau lebih
- Fonnte API unlimited atau plan tinggi

1000 transaksi/hari = ~42 transaksi/jam = ~0.7 transaksi/menit — beban ringan untuk stack yang digunakan.

### Rating Keseluruhan

| Kategori | Skor | Status |
|----------|------|--------|
| Performa | 7/10 | Perlu optimasi query |
| Skalabilitas | 8/10 | Bisa handle 1000+/hari |
| Keamanan | 6/10 | Ada token hardcoded |
| SEO | 5/10 | Perlu structured data |
| UX | 7/10 | Sudah mobile responsive |

---

## 1. Database Queries & Caching Strategy

### ✅ Sudah Baik
- **`revalidate = 60`** di halaman utama — ISR aktif
- **`sanityFetch`** dari `next-sanity/live` — integrasi ISR + live edits
- **`useCdn: true`** pada read client — caching optimal
- **`Promise.all`** paralelisasi query di halaman home

### ⚠️ Masalah Ditemukan

**1. N+1 Query Problem di `CATEGORIES_QUERY`**
```typescript
// Query memanggil count() dan subcategories untuk SETIAP kategori
// Jika ada 20 kategori = ~40+ hit ke Sanity
"subcategories": *[_type == "category" && parentCategory._ref == ^._id]
"productCount": count(*[_type == "product" && references(^._id)])
```

**2. Query fetch ALL produk tanpa limit**
```typescript
// Products_QUERY fetch semua produk
// Untuk 1000+ produk, ini akan memuat semua sekaligus
*[_type == "product"] | order(_createdAt desc) { ... }
```

**3. Query sama dipanggil berulang di banyak halaman**
- `/`, `/products`, `/mitra`, `/m/food` memanggil query yang sama

### 📌 Rekomendasi

```typescript
// 1. Tambahkan limit pada PRODUCTS_QUERY
*[_type == "product"] | order(_createdAt desc) [0...50] { ... }

// 2. Gunakan precomputed counts atau GraphQL
// 3. Cache di CDN level dengan Sanity query keys
```

---

## 2. API Endpoints & Server Actions

### ✅ Sudah Baik
- Server actions terstruktur dengan `{ success, data/error }`
- Error handling try/catch di setiap action
- Revalidate webhook tersedia di `/api/revalidate`

### ⚠️ Masalah Ditemukan

**1. Order number bisa collision**
```typescript
// ANT-${Date.now().slice(-6)} — 6 digit hanya 1 detik
// 2 order dalam 1 detik = nomor sama
const orderNumber = `ANT-${Date.now().slice(-6)}`
```

**2. WhatsApp notification tanpa timeout**
```typescript
// fetch() tanpa AbortController — bisa hanging
await fetch(`https://api.fonnte.com/send`, { ... })
```

**3. `/api/debug-couriers` tanpa auth**
- Data courier terlihat publik

### 📌 Rekomendasi

```typescript
// 1. Order number dengan UUID
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
const orderNumber = `ANT-${nanoid()}`

// 2. WhatsApp dengan timeout
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5000)
await fetch(url, { signal: controller.signal })
```

---

## 3. Image Optimization

### ✅ Sudah Baik
- Next.js Image component di seluruh tempat
- AVIF & WebP formats dikonfigurasi
- Hero image menggunakan `priority` — LCP optimized

### ⚠️ Masalah Ditemukan

**1. Image tidak responsive**
```typescript
// Mobile user download gambar 600x750 tetap
<Image src={urlFor(image).width(600).height(750).url()} />
// Tidak ada sizes attribute — browser tidak tahu ukuran render
```

**2. PWA dikomentari tapi dependency ada**
- `@ducanh2912/next-pwa` di package.json
- `sw.js` hanya import PushAlert CDN
- Tidak ada caching strategy, offline support

### 📌 Rekomendasi

```typescript
// Tambahkan sizes attribute
<Image
  src={...}
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  loading="lazy"
/>
```

---

## 4. Static vs Dynamic Rendering

### ✅ Sudah Baik
- Server components dominan — rendering efisien
- `use: params` pattern — Next.js 16 correct
- `use: searchParams` pattern — benar

### ⚠️ Masalah Ditemukan

**1. Tidak ada `dynamic` declaration**
- Next.js tidak auto-detect static page optimal
- Build time lebih lama

**2. Mobile pages (`/m/*`) full client render**
- Tidak ada SSR
- Loading lebih lambat

### 📌 Rekomendasi

```typescript
// Tambahkan di halaman statis
export const dynamic = 'force-static'
export const dynamicParams = false
```

---

## 5. Bundle Size & Dependencies

### 📦 Production Dependencies
| Package | Size | Status |
|---------|------|--------|
| next, react, react-dom | core | OK |
| leaflet + @types/leaflet | ~200KB | Bisa lazy-load |
| lucide-react | tree-shakeable | OK |
| next-sanity | ~50KB | OK |
| @ducanh2912/next-pwa | ~30KB | Jika tidak dipakai, hapus |
| sanity (studio) | ~100-200MB | Pertimbangkan pindahkan ke dev deps |

### 📌 Rekomendasi
1. **Lazy-load Leaflet** — dynamic import di `PetaInteraktif.tsx`
2. **Hapus `@ducanh2912/next-pwa`** jika PWA tidak aktif
3. **Tambah `@next/bundle-analyzer`** untuk monitoring

---

## 6. State Management (CartContext)

### ✅ Sudah Baik
- localStorage persistence — cart bertahan setelah refresh
- `isLoaded` useRef pattern — mencegah hydration mismatch

### ⚠️ Masalah Ditemukan

**1. Inconsistency localStorage key**
```typescript
// CartContext: 'pondokrejo-cart'
// Checkout: 'anterbae-customer-name'
// Tidak konsisten!
```

**2. Tidak ada max quantity limit**
- User bisa add 1000x produk yang sama

**3. Cart hilang di device lain**
- Pure client-side, tidak ter-indexed

### 📌 Rekomendasi
1. **Standardize key naming** — semua pakai `anterbae-*`
2. **Tambah max quantity validation**
3. **Pertimbangkan server-side cart persistence**

---

## 7. Error Handling

### ✅ Sudah Baik
- Server actions return `{ success, data/error }` pattern
- `notFound()` di product page

### ⚠️ Masalah Ditemukan

**1. Tidak ada ErrorBoundary**
- Jika component throw error, seluruh halaman crash

**2. Tidak ada error.tsx atau global-error.tsx**
- Error ditampilkan sebagai blank atau default Next.js error

**3. `alert()` di checkout — blocking**
```typescript
// Lebih baik gunakan toast notification
alert('Format alamat belum lengkap')
```

### 📌 Rekomendasi

```typescript
// Tambahkan error.tsx di setiap route
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Terjadi Kesalahan</h2>
      <button onClick={() => reset()}>Coba Lagi</button>
    </div>
  )
}
```

---

## 8. Security

### ✅ Sudah Baik
- PIN-based authentication untuk courier portal
- `rel="noopener noreferrer"` di external links

### ⚠️ Masalah Ditemukan

| Item | Lokasi | Risiko |
|------|--------|--------|
| Fonnte API token | `whatsapp.ts` | Token terlihat publik |
| Admin phone | `layout.tsx`,多处 | Hardcoded |
| Sanity projectId | `client.ts` | Hardcoded (OK untuk NEXT_PUBLIC) |
| Order number | `delivery-order.ts` | Bisa di-guess |

### 📌 Rekomendasi

```typescript
// 1. Pindahkan Fonnte token ke env
const fonnteToken = process.env.FONNTE_TOKEN

// 2. Tambahkan rate limiting
// 3. Gunakan UUID untuk order number
```

---

## 9. SEO & Metadata

### ✅ Sudah Baik
- Metadata API di `layout.tsx`
- Open Graph tags ada
- PWA manifest ada
- Semantic HTML

### ⚠️ Masalah Ditemukan

| Issue | Impact |
|-------|--------|
| Metadata statis di layout | Tidak unik per halaman |
| Tidak ada sitemap.xml | Poor SEO |
| Tidak ada JSON-LD | Tidak ada rich snippets di Google |
| Tidak ada canonical URL | Duplicate content risk |
| Tidak ada `og:image` | Share di WA/social media default |

### 📌 Rekomendasi

```typescript
// generateMetadata di setiap halaman
export function generateMetadata({ params }): Metadata {
  return {
    title: `${productName} - Anterbae`,
    description: `Beli ${productName} di Anterbae`,
    openGraph: {
      images: [urlFor(product.image).width(1200).height(630).url()],
    },
  }
}
```

---

## 10. PWA Capabilities

### Status: **INCOMPLETE**

| Feature | Status |
|---------|--------|
| manifest.json | Minimal (2 icon sizes) |
| Service Worker | Hanya PushAlert, bukan native PWA |
| Offline Support | Tidak ada |
| Install Prompt | Tidak ada |

### 📌 Rekomendasi
1. **Aktifkan `@ducanh2912/next-pwa`** atau hapus
2. **Perbaiki manifest.json** — tambah icon sizes, screenshots
3. **Implement cache-first strategy** untuk produk/merchant data

---

## Analisis Kapasitas: 1000+ Transaksi/Hari

### Beban yang Dihitung

```
1000 transaksi/hari
= 42 transaksi/jam
= 0.7 transaksi/menit
= 1 transaksi setiap ~85 detik
```

### Komponen Sistem vs Kapasitas

| Komponen | Kapasitas | 1000 Transaksi | Status |
|----------|-----------|----------------|--------|
| Sanity.io Reads | ~100 req/min | ~5 req/min | ✅ OK |
| Sanity.io Writes | ~20 req/min | ~0.02 req/min | ✅ OK |
| Vercel Serverless | ~1000 concurrent | ~0.001 concurrent | ✅ OK |
| Fonnte API | ~1000/day (free) | ~1000/day | ⚠️ Borderline |
| CDN Cache | Unlimited | ✅ | ✅ OK |

### Bottleneck Potensial

1. **Sanity rate limits** — jika setiap page view hit 2-3 query, total reads bisa 10x+ writes
2. **Fonnte API free plan** — limit 1000 notifikasi/hari, pas dengan target
3. **Vercel cold starts** — pada Hobby plan, cold start 1-3 detik
4. **localStorage cart** — tidak ada masalah untuk 1000 users/hari

### Verdict: ✅ BISA HANDLE 1000+ TRANSAKSI/HARI

Dengan catatan:
- Sanity.io Pro plan minimal
- Fonnte API Pro plan (limit lebih tinggi)
- Vercel Pro plan minimal
- Optimasi query Sanity (N+1 fix)

---

## Prioritas Perbaikan

### 🔴 HIGH — Blocking

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | N+1 Query di `CATEGORIES_QUERY` | Slow page load, rate limit | 2 jam |
| 2 | Fonnte token hardcoded | Security risk | 30 menit |
| 3 | Tidak ada rate limiting order | Spam orders | 3 jam |
| 4 | Order number collision risk | Tracking error | 1 jam |
| 5 | Tidak ada ErrorBoundary | Full page crash | 2 jam |

### 🟡 MEDIUM — Penting

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 6 | Tidak ada sitemap.xml | Poor SEO | 1 jam |
| 7 | Tidak ada JSON-LD | Poor rich snippets | 2 jam |
| 8 | PWA incomplete | No offline support | 4 jam |
| 9 | Leaflet tidak lazy-load | Larger bundle | 30 menit |
| 10 | Image tanpa sizes attribute | Suboptimal loading | 2 jam |

### 🟢 LOW — Nice to Have

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 11 | Cart hanya client-side | Lost cart on new device | 4 jam |
| 12 | Tidak ada admin dashboard | Manual management | 8 jam |
| 13 | Tidak ada analytics | No user data | 2 jam |
| 14 | Metadata statis | Generic SEO | 2 jam |
| 15 | localStorage key inconsistency | Cart issues | 30 menit |

---

## Estimasi Total Effort

| Priority | Total Hours | Timeline |
|----------|-------------|----------|
| HIGH | ~9 jam | 1-2 hari kerja |
| MEDIUM | ~10 jam | 2 hari kerja |
| LOW | ~17 jam | 3 hari kerja |
| **TOTAL** | **~36 jam** | **~1 minggu kerja** |

---

## Kesimpulan

Aplikasi Anterbae sudah memiliki fondasi yang **solid dan production-ready** untuk skala lokal (100-500 transaksi/hari).

Untuk scale ke **1000+ transaksi/hari**, diperlukan:
1. Fix N+1 query problem (HIGH)
2. Tambah rate limiting (HIGH)
3. Upgrade Sanity.io ke Pro plan
4. Upgrade Fonnte API ke Pro plan
5. Optimasi image loading (MEDIUM)

**Dengan perbaikan di atas, aplikasi bisa handle 1000+ transaksi/hari dengan nyaman.**

Untuk scale lebih lanjut (5000-10000 transaksi/hari), pertimbangkan:
- Redis caching layer
- CDN edge computing
- Database read replicas
- Queue system untuk WhatsApp notifications

---

*Dibuat: 11 Agustus 2026*
*Next.js 16.2.6 | Sanity.io | Vercel*
