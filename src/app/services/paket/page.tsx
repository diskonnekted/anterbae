'use client'

import Link from 'next/link'
import { ArrowLeft, Package, MapPin, Phone, Clock, Shield, Scale } from 'lucide-react'

const priceInfo = [
  { distance: 'Dalam kota (0-3 km)', price: 'Rp 8.000 - 15.000', eta: '30-60 menit' },
  { distance: 'Antar kecamatan (3-15 km)', price: 'Rp 15.000 - 30.000', eta: '1-2 jam' },
  { distance: 'Antar kabupaten (15-50 km)', price: 'Rp 30.000 - 50.000', eta: '2-4 jam' },
]

const features = [
  { icon: <Shield className="w-5 h-5" />, title: 'Aman & Terjaga', desc: 'Paket dijamin sampai dengan selamat' },
  { icon: <Clock className="w-5 h-5" />, title: 'Cepat', desc: 'Estimasi pengiriman sesuai jarak' },
  { icon: <Scale className="w-5 h-5" />, title: 'Berat Maks 20kg', desc: 'Bisa kirim paket ringan hingga sedang' },
]

export default function PaketPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Antar Paket</h1>
            <p className="text-xs text-gray-400 font-medium">Kirim paket ke seluruh Banjarnegara</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <Package className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-black text-center mb-2">Antar Paket & Barang</h2>
        <p className="text-blue-100 text-sm text-center leading-relaxed">
          Kirim dokumen, barang belanja, atau apapun ke seluruh kecamatan di Banjarnegara. Cepat, aman, dan terjangkau.
        </p>
      </div>

      {/* Features */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
              <div className="text-blue-600 flex justify-center mb-2">{f.icon}</div>
              <p className="text-xs font-black text-gray-900 mb-0.5">{f.title}</p>
              <p className="text-[10px] text-gray-400 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Price Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900">Estimasi Biaya</h3>
          </div>
          {priceInfo.map((p) => (
            <div key={p.distance} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs font-bold text-gray-700">{p.distance}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {p.eta}
                </p>
              </div>
              <span className="text-sm font-black text-blue-600">{p.price}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-center hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Kirim Paket Sekarang
        </a>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-4 border border-blue-100">
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            <strong>Catatan:</strong> Admin akan memberikan biaya pasti setelah mengetahui jarak dan ukuran paket. Tidak ada biaya tersembunyi!
          </p>
        </div>
      </div>
    </div>
  )
}
