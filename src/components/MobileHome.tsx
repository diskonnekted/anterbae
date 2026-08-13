'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, QrCode, LayoutGrid, ChevronDown, Bell, ShoppingBag, MapPin, Bike, MessageSquare as MessageIcon, ShoppingCart as CartIcon, User, X, Sparkles } from 'lucide-react'
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
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoAlreadyClaimed, setPromoAlreadyClaimed] = useState(false)

  const handleClaimPromo = () => {
    const existingCode = localStorage.getItem('anterbae_promo_code')
    if (existingCode) {
      setPromoCode(existingCode)
      setPromoAlreadyClaimed(true)
    } else {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      const randomCode = `AB-FREE-${randomSuffix}`
      localStorage.setItem('anterbae_promo_code', randomCode)
      setPromoCode(randomCode)
      setPromoAlreadyClaimed(false)
    }
    setShowPromoModal(true)
  }

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
      <div className="md:hidden bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-5">
          {serviceIcons.map((service) => (
            <a
              key={service.label}
              href={service.href}
              className="flex flex-col items-center gap-2 active:opacity-70 w-16"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={service.icon}
                  alt={service.label}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-gray-700 text-center leading-tight">{service.label}</span>
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
              onClick={handleClaimPromo}
              className="bg-white text-red-600 font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-transform cursor-pointer"
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
          <Link
            href="/m/antar-jemput"
            className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400"
          >
            <Bike className="w-5 h-5" />
            <span className="text-[10px] font-bold">Antar</span>
          </Link>
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
      {/* Promo Code Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 space-y-5 text-center relative">
            <button 
              onClick={() => setShowPromoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-100">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Voucher Gratis Ongkir</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                {promoAlreadyClaimed 
                  ? "Anda sudah mengklaim voucher ini sebelumnya. Gunakan kode di bawah untuk klaim ke Admin." 
                  : "Selamat! Anda mendapatkan kode voucher khusus pengguna baru."}
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl">
              <span className="text-2xl font-black text-slate-900 tracking-wider font-mono select-all">
                {promoCode}
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Tap/Klik untuk menyalin kode</p>
            </div>

            <p className="text-xs text-slate-400 font-bold leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-100/50">
              Silakan kirimkan kode voucher di atas ke Admin CS via WhatsApp untuk mengklaim pengiriman gratis Anda.
            </p>

            <a
              href={`https://wa.me/6281328128315?text=${encodeURIComponent(`Halo Admin Anterbae, saya ingin mengklaim Voucher Gratis Ongkir Baru saya: ${promoCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPromoModal(false)}
              className="block w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all active:scale-95 text-center shadow-lg shadow-red-100 flex items-center justify-center gap-2"
            >
              <MessageIcon className="w-4 h-4" /> Kirim Kode ke Admin WA
            </a>
          </div>
        </div>
      )}
    </>
  )
}
