'use client'

import Link from 'next/link'
import { UtensilsCrossed, Truck, ShoppingBasket, Package, Coins, ShoppingCart, Sparkles, ArrowLeft, Search, ChevronRight } from 'lucide-react'

const services = [
  {
    id: 'food',
    icon: <UtensilsCrossed className="w-8 h-8" />,
    title: 'Food',
    description: 'Pesan antar makanan dari warung & restoran favorit',
    color: 'bg-orange-50 text-orange-600',
    borderColor: 'border-orange-200',
    hoverBg: 'hover:bg-orange-50',
    href: '/services/food',
  },
  {
    id: 'paket',
    icon: <Truck className="w-8 h-8" />,
    title: 'Antar Paket',
    description: 'Antar paket dari satu tempat ke tempat lain',
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-200',
    hoverBg: 'hover:bg-blue-50',
    href: '/services/paket',
  },
  {
    id: 'jastip',
    icon: <ShoppingBasket className="w-8 h-8" />,
    title: 'Jastip',
    description: 'Jasa titip beli ke pasar, minimarket, toko',
    color: 'bg-green-50 text-green-600',
    borderColor: 'border-green-200',
    hoverBg: 'hover:bg-green-50',
    href: '/services/jastip',
  },
  {
    id: 'express',
    icon: <Package className="w-8 h-8" />,
    title: 'Express',
    description: 'Pengiriman kilat cepat ke tujuan Anda',
    color: 'bg-red-50 text-red-600',
    borderColor: 'border-red-200',
    hoverBg: 'hover:bg-red-50',
    href: '/services/express',
  },
  {
    id: 'tagihan',
    icon: <Coins className="w-8 h-8" />,
    title: 'Bayar Tagihan',
    description: 'Segera hadir untuk bayar listrik, PDAM, dll',
    color: 'bg-yellow-50 text-yellow-600',
    borderColor: 'border-yellow-200',
    hoverBg: 'hover:bg-yellow-50',
    href: '#',
    comingSoon: true,
  },
  {
    id: 'belanja',
    icon: <ShoppingCart className="w-8 h-8" />,
    title: 'Belanja',
    description: 'Jasa belanja barang diluar makanan',
    color: 'bg-indigo-50 text-indigo-600',
    borderColor: 'border-indigo-200',
    hoverBg: 'hover:bg-indigo-50',
    href: '/services/belanja',
  },
  {
    id: 'lainnya',
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Layanan Lainnya',
    description: 'Servis listrik, pijat, instalasi CCTV, dll',
    color: 'bg-purple-50 text-purple-600',
    borderColor: 'border-purple-200',
    hoverBg: 'hover:bg-purple-50',
    href: '/services/layanan-lainnya',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Layanan</h1>
            <p className="text-xs text-gray-400 font-medium">Pilih layanan yang Anda butuhkan</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari layanan"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 py-6 space-y-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className={`block bg-white rounded-2xl p-4 border ${service.borderColor} ${service.hoverBg} transition-all active:scale-95 ${service.comingSoon ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center flex-shrink-0`}>
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900">{service.title}</h3>
                  {service.comingSoon && (
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                     coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{service.description}</p>
              </div>
              {!service.comingSoon && <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
