'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBasket, MapPin, Phone, Clock, Tag } from 'lucide-react'

const jastipOptions = [
  {
    icon: '🏪',
    title: 'Belanja ke Pasar',
    desc: 'Sayur, bumbu, daging, ikan segar',
    examples: ['Sayuran segar', 'Bumbu dapur', 'Daging & ikan', 'Buah-buahan'],
  },
  {
    icon: '🏬',
    title: 'Minimarket',
    desc: 'Alfamart, Indomaret, dan lainnya',
    examples: ['Makanan & minuman', 'Perlengkapan rumah', 'Snack & minuman', 'Perlengkapan mandi'],
  },
  {
    icon: '💊',
    title: 'Apotek',
    desc: 'Obat tanpa & dengan resep',
    examples: ['Obat sakit kepala', 'Obat resep dokter', 'Vitamin & suplemen', 'Alat kesehatan'],
  },
  {
    icon: '🔧',
    title: 'Toko & Bangunan',
    desc: 'Sembako, cat, tools, pertanian',
    examples: ['Sembako', 'Cat & kuas', 'Peralatan rumah', 'Benih & pupuk'],
  },
]

export default function JastipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Jastip (Titip Beli)</h1>
            <p className="text-xs text-gray-400 font-medium">Titip beli ke mana saja</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <ShoppingBasket className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-black text-center mb-2">Jasa Titip Beli</h2>
        <p className="text-green-100 text-sm text-center leading-relaxed">
          Tidak sempat keluar? Titip beli ke pasar, minimarket, apotek, atau toko favorit Anda. Kurir kami yang belanjakan!
        </p>
      </div>

      {/* Jastip Options */}
      <div className="px-4 py-6 space-y-3">
        {jastipOptions.map((opt) => (
          <div key={opt.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{opt.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 mb-1">{opt.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">{opt.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {opt.examples.map((ex) => (
                      <span key={ex} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-green-600" />
            <h3 className="font-black text-gray-900">Biaya Jastip</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Jastip dalam kota</span>
              <span className="font-black text-green-600">Mulai Rp 10.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Jastip antar kecamatan</span>
              <span className="font-black text-green-600">Mulai Rp 15.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Harga barang</span>
              <span className="font-black text-gray-700">Sesuai实际</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/6281328128315"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 text-white font-black py-4 rounded-2xl text-center hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Titip Beli Sekarang
        </a>

        <p className="text-xs text-gray-400 text-center font-medium pb-4">
          Kirim daftar belanja via WhatsApp, kurir kami yang belanjakan!
        </p>
      </div>
    </div>
  )
}
