'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, QrCode, LayoutGrid, ChevronDown, Bell, ShoppingBag, MapPin, Bike, MessageSquare as MessageIcon, ShoppingCart as CartIcon, User } from 'lucide-react'
import Image from 'next/image'

interface MobileHomeProps {
  waLink: string
  servicesLink: string
}

const serviceIcons = [
  { icon: '/icon/food.jpg', label: 'Food', href: '/m/food', color: 'red' },
  { icon: '/icon/jasa-antar.jpg', label: 'Antar Jemput', href: '/m/antar-jemput', color: 'blue' },
  { icon: '/icon/antar-paket.jpg', label: 'Antar Paket', href: '/m/paket', color: 'blue' },
  { icon: '/icon/jastip.jpg', label: 'Jastip', href: '/m/jastip', color: 'green' },
  { icon: '/icon/express.jpg', label: 'Express', href: '/m/express', color: 'orange' },
  { icon: '/icon/belanja.jpg', label: 'Belanja', href: '/m/belanja', color: 'emerald' },
  { icon: '/icon/jasa-khusus.jpg', label: 'Lainnya', href: '/m/layanan-lainnya', color: 'purple' },
]

const iconColors: Record<string, string> = {
  red: 'from-red-50 to-red-100',
  blue: 'from-blue-50 to-blue-100',
  green: 'from-green-50 to-green-100',
  orange: 'from-orange-50 to-orange-100',
  emerald: 'from-emerald-50 to-emerald-100',
  purple: 'from-purple-50 to-purple-100',
}

export default function MobileHome({ waLink, servicesLink }: MobileHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ===== MOBILE NATIVE APP HEADER ===== */}
      <div className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <LayoutGrid className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-red-600">Anterbae</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 -mr-2 rounded-xl hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari layanan atau produk"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
            <QrCode className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* ===== MOBILE SERVICE ICONS ===== */}
      <div className="md:hidden bg-white px-4 py-6 border-b border-gray-50">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {serviceIcons.map((service) => (
            <a key={service.label} href={service.href} className="flex flex-col items-center gap-2 active:opacity-70">
              <div className={`w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br ${iconColors[service.color] || 'from-gray-50 to-gray-100'} flex items-center justify-center shadow-sm`}>
                <Image
                  src={service.icon}
                  alt={service.label}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap">{service.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ===== MOBILE PROMO BANNER ===== */}
      <div className="md:hidden px-4 py-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-red-100 uppercase tracking-wider mb-1">Promo Spesial</p>
            <p className="text-lg font-black mb-1">Gratis Ongkir!</p>
            <p className="text-xs text-red-100 mb-3">Untuk pengguna baru di Banjarnegara</p>
            <button
              onClick={() => window.open(waLink, '_blank')}
              className="bg-white text-red-600 font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-transform"
            >
              Klaim Sekarang
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* ===== MOBILE QUICK ACTIONS ===== */}
      <div className="md:hidden px-4 py-2">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <Link href="/products" className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 active:scale-95 transition-transform">
            <ShoppingBag className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-gray-700">Belanja Produk</span>
          </Link>
          <Link href="/track" className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 active:scale-95 transition-transform">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-gray-700">Lacak Pesanan</span>
          </Link>
          <a
            href="/register-courier"
            className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Bike className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-gray-700">Jadi Kurir</span>
          </a>
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1 text-red-600">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-black">Beranda</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold">Produk</span>
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400"
          >
            <MessageIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Chat</span>
          </a>
          <Link href="/cart" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400 relative">
            <CartIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Keranjang</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Akun</span>
          </Link>
        </div>
      </div>
    </>
  )
}
