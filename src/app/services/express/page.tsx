'use client'

import Link from 'next/link'
import { ArrowLeft, Package, Zap, MapPin, Phone, Clock } from 'lucide-react'

const expressZones = [
  { zone: 'Dalam kota Banjarnegara', distance: '0-3 km', eta: '15-30 menit', price: 'Rp 15.000 - 25.000' },
  { zone: 'Kecamatan sekitar', distance: '3-10 km', eta: '30-60 menit', price: 'Rp 20.000 - 35.000' },
  { zone: 'Antar kecamatan', distance: '10-30 km', eta: '1-2 jam', price: 'Rp 30.000 - 50.000' },
]

export default function ExpressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Express Delivery</h1>
            <p className="text-xs text-gray-400 font-medium">Pengiriman kilat super cepat</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <Zap className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-black text-center mb-2">Express Delivery</h2>
        <p className="text-red-100 text-sm text-center leading-relaxed">
          Butuh pengiriman cepat? Layanan express kami antar paket Anda secepat mungkin dengan kurir terdekat!
        </p>
      </div>

      {/* Info */}
      <div className="px-4 py-6 space-y-3">
        {/* ETA Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              Estimasi Waktu & Biaya
            </h3>
          </div>
          {expressZones.map((zone) => (
            <div key={zone.zone} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs font-bold text-gray-700">{zone.zone}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {zone.distance}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-red-600">{zone.price}</p>
                <p className="text-[10px] text-gray-400 font-medium">{zone.eta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What can send */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-black text-gray-900 mb-3">Cocok Untuk:</h3>
          <div className="space-y-2">
            {[
              'Dokumen penting & surat',
              'Kado ulang tahun mendesak',
              'Obat-obatan darurat',
              'Keys & barang kecil mendesak',
              'Sample & barang bisnis',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-xs font-bold text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/6281328128315"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl text-center hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Kirim Express Sekarang
        </a>
      </div>
    </div>
  )
}
