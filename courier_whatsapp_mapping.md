# 🗺️ Panduan Integrasi WhatsApp Business API Berbayar & Pemetaan Kurir

Dokumen ini memandu Anda secara teknis langkah demi langkah untuk menghubungkan **WhatsApp Business API** (WABA Meta / Fonnte) dengan modul **Pemetaan Kurir secara Real-Time** pada Dasbor Admin Anterbae menggunakan peta **Leaflet**.

---

## 1. Tambahkan Bidang Lokasi pada Skema Kurir (`courier`)
Ubah file skema kurir di `src/sanity/schemaTypes/courierType.ts` untuk menambahkan bidang koordinat:

```typescript
// Tambahkan di dalam array fields pada courierType.ts
defineField({
  name: 'latitude',
  title: 'Latitude Terakhir',
  type: 'number',
  readOnly: true,
}),
defineField({
  name: 'longitude',
  title: 'Longitude Terakhir',
  type: 'number',
  readOnly: true,
}),
defineField({
  name: 'lastLocationUpdate',
  title: 'Waktu Pembaruan Lokasi',
  type: 'datetime',
  readOnly: true,
}),
```

---

## 2. Buat Endpoint Webhook WhatsApp (`/api/wa-webhook`)
Penyedia API WhatsApp Berbayar (seperti Fonnte atau Meta Cloud API) akan mengirimkan muatan data (payload) JSON ke aplikasi kita setiap kali kurir mengirimkan lokasi (*share location* / *live location*).

Buat file baru di `src/app/api/wa-webhook/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Pastikan token ini memiliki hak akses Write
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    
    // Pola payload lokasi dari Fonnte API:
    // {
    //   "sender": "628139135749",
    //   "message": "location",
    //   "location": {
    //     "latitude": -7.4097,
    //     "longitude": 109.5250
    //   }
    // }
    
    const senderPhone = payload.sender // Nomor WA Kurir
    const location = payload.location

    if (location && location.latitude && location.longitude) {
      // 1. Cari kurir berdasarkan nomor telepon di database Sanity
      const courier = await writeClient.fetch(
        `*[_type == "courier" && phone == $phone][0]`,
        { phone: senderPhone }
      )

      if (courier) {
        // 2. Perbarui koordinat kurir di Sanity
        await writeClient
          .patch(courier._id)
          .set({
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            lastLocationUpdate: new Date().toISOString()
          })
          .commit()

        return NextResponse.json({ success: true, message: 'Lokasi kurir berhasil diperbarui!' })
      }
    }

    return NextResponse.json({ success: false, message: 'Bukan pesan lokasi atau kurir tidak terdaftar.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
```

---

## 3. Hubungkan Webhook di Dasbor Layanan WhatsApp
* **Fonnte**: Masuk ke menu **Webhooks** pada dasbor Fonnte Anda, lalu masukkan URL:
  `https://domain-anda.com/api/wa-webhook`
* **Meta WABA**: Konfigurasikan pada **Meta Developer Dashboard** di bagian Webhook produk WhatsApp, arahkan ke URL yang sama.

---

## 4. Tampilkan Peta Kurir di Dasbor Admin
Di halaman admin (`src/app/admin/page.tsx`), muat data kurir yang aktif dan memiliki koordinat, lalu tampilkan pada peta Leaflet.

### Komponen Peta Kurir (`src/components/PetaKurir.tsx`)
```tsx
'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CourierMarker {
  name: string
  phone: string
  latitude: number
  longitude: number
}

export default function PetaKurir({ couriers }: { couriers: CourierMarker[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapRef.current) return

    // Inisialisasi peta berpusat di Banjarnegara
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-7.4, 109.58], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
      mapInstanceRef.current = map
    }

    const map = mapInstanceRef.current

    // Sinkronisasi marker kurir
    couriers.forEach((courier) => {
      const pos: [number, number] = [courier.latitude, courier.longitude]
      
      if (markersRef.current[courier.phone]) {
        // Jika kurir sudah ada di peta, geser ke posisi baru
        markersRef.current[courier.phone].setLatLng(pos)
      } else {
        // Jika kurir baru terdeteksi, tambahkan marker dengan ikon motor/kurir
        const customIcon = L.divIcon({
          html: `<div style="font-size:24px;">🛵</div>`,
          iconSize: [30, 30],
          className: 'custom-courier-icon'
        })

        const marker = L.marker(pos, { icon: customIcon })
          .addTo(map)
          .bindPopup(`<strong>🛵 ${courier.name}</strong><br/>Phone: ${courier.phone}`)
        
        markersRef.current[courier.phone] = marker
      }
    })

  }, [couriers])

  return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '1rem' }} />
}
```
Panduan ini siap digunakan untuk pengembangan modul pemetaan pelacakan kurir terpadu!
