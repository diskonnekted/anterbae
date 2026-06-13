'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Truck, MapPin, Phone, Menu, X, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import CartIconBadge from './Cart/CartIconBadge'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 print:hidden shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4 py-2">
        <Link href="/" className="flex items-center gap-3 group min-w-fit">
          <Image
            src="/anterbae.png"
            alt="Logo Anterbae"
            width={180}
            height={85}
            className="w-[140px] h-auto md:w-[200px] group-hover:scale-105 transition-transform object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-red-600 transition-colors">Beranda</Link>
          <Link href="/products" className="hover:text-red-600 transition-colors">Produk</Link>
          <Link href="/layanan" className="hover:text-red-600 transition-colors">Layanan</Link>
          <Link href="/mitra" className="hover:text-red-600 transition-colors">Mitra</Link>
          <Link href="/track" className="hover:text-red-600 transition-colors">Lacak</Link>
          <Link href="/info" className="hover:text-red-600 transition-colors">Info</Link>
        </div>

        {/* CTA + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (Desktop) */}
          <div className="hidden sm:block">
            <CartIconBadge />
          </div>
          {/* Area badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold">
            <MapPin className="w-3 h-3" />
            Banjarnegara
          </div>

          {/* Pesan Sekarang CTA */}
          <Link
            href="/pesan"
            className="hidden sm:flex items-center gap-2 bg-red-600 text-white font-black px-5 py-2.5 rounded-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/25 text-sm"
          >
            <Truck className="w-4 h-4" />
            Pesan Antar
          </Link>

          {/* Portal Kurir */}
          <Link
            href="/kurir"
            className="hidden md:flex items-center gap-2 border-2 border-slate-200 text-slate-600 font-black px-4 py-2.5 rounded-2xl hover:border-red-600 hover:text-red-600 transition-all text-sm"
          >
            Portal Kurir
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            🏠 Beranda
          </Link>
          <Link href="/layanan" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            📋 Layanan Kami
          </Link>
          <Link href="/mitra" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            🏪 Mitra Merchant
          </Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            🛍️ Semua Produk
          </Link>
          <Link href="/track" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            📍 Lacak Pesanan
          </Link>
          <Link href="/info" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-700 py-2 border-b border-slate-100">
            📢 Info & Promo
          </Link>
          <Link href="/kurir" onClick={() => setMenuOpen(false)} className="block font-bold text-slate-500 py-2 border-b border-slate-100 text-sm">
            🛵 Portal Kurir
          </Link>
          <Link
            href="/pesan"
            onClick={() => setMenuOpen(false)}
            className="block w-full bg-red-600 text-white font-black px-6 py-4 rounded-2xl text-center hover:bg-red-700 transition-all mt-4"
          >
            🛵 Pesan Antar Sekarang
          </Link>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-700 font-black px-6 py-3 rounded-2xl hover:bg-green-50 transition-all"
          >
            <Phone className="w-4 h-4" />
            Hubungi Admin
          </a>
        </div>
      )}
    </nav>
  )
}
