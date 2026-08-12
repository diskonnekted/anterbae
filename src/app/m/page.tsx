'use client'

import React from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Truck, ShoppingBasket, Package, Coins, ShoppingCart, Sparkles, Search, Bell, ChevronDown, LayoutGrid, ShoppingBag, MapPin, Bike, MessageSquare, ShoppingCart as CartIcon, User, Home as HomeIcon, ChevronRight, Phone, Star, Clock, MapPin as MapPinIcon, Zap, Shield, Tag, Gift, Lightbulb, Wrench, Camera, Scissors, Hammer, ArrowLeft, Soup, DrumstickIcon, Store, Pill, Timer, Footprints, File, Sprout, Shirt, Smile, PackageCheck } from 'lucide-react'
import { useState } from 'react'

const services = [
  { id: 'food', icon: <UtensilsCrossed className="w-7 h-7" />, label: 'Food', href: '/m/food' },
  { id: 'paket', icon: <Truck className="w-7 h-7" />, label: 'Antar Paket', href: '/m/paket' },
  { id: 'jastip', icon: <ShoppingBasket className="w-7 h-7" />, label: 'Jastip', href: '/m/jastip' },
  { id: 'promo', icon: <Gift className="w-7 h-7" />, label: 'Promo', href: '#' },
  { id: 'express', icon: <Package className="w-7 h-7" />, label: 'Express', href: '/m/express' },
  { id: 'tagihan', icon: <Coins className="w-7 h-7" />, label: 'Bayar Tagihan', href: '#' },
  { id: 'belanja', icon: <ShoppingCart className="w-7 h-7" />, label: 'Belanja', href: '/m/belanja' },
  { id: 'lainnya', icon: <Sparkles className="w-7 h-7" />, label: 'Lainnya', href: '/m/layanan-lainnya' },
]

const restaurants = [
  { slug: 'warung-nasi-bu-sri', name: 'Warung Nasi Bu Sri', cuisine: 'Nasi, Mie, Bakso', rating: 4.8, distance: '0.5 km', eta: '20 menit', icon: <Soup className="w-12 h-12" />, price: 'Rp 10.000 - 25.000' },
  { slug: 'soto-pak-ahmad', name: 'Soto Pak Ahmad', cuisine: 'Soto, Ayam, Sayur', rating: 4.9, distance: '1.2 km', eta: '25 menit', icon: <Soup className="w-12 h-12" />, price: 'Rp 12.000 - 30.000' },
  { slug: 'bakso-jantur', name: 'Bakso Jantur', cuisine: 'Bakso, Bakso Goreng', rating: 4.9, distance: '2.0 km', eta: '30 menit', icon: <UtensilsCrossed className="w-12 h-12" />, price: 'Rp 15.000 - 35.000' },
  { slug: 'ayam-geprek-sambal-bawang', name: 'Ayam Geprek Sambal Bawang', cuisine: 'Ayam Geprek, Nasi', rating: 4.7, distance: '0.7 km', eta: '20 menit', icon: <DrumstickIcon className="w-12 h-12" />, price: 'Rp 12.000 - 25.000' },
]

const servicePages: Record<string, { title: string; desc: string; icon: React.ReactNode; gradient: string; features: { icon: React.ReactNode; title: string; desc: string }[]; cta?: string }> = {
  paket: {
    title: 'Antar Paket', desc: 'Kirim paket ke seluruh Banjarnegara', icon: <PackageCheck className="w-16 h-16" />, gradient: 'from-blue-500 to-blue-600',
    features: [
      { icon: <Shield className="w-6 h-6" />, title: 'Aman', desc: 'Dijamin sampai selamat' },
      { icon: <Zap className="w-6 h-6" />, title: 'Cepat', desc: 'Estimasi sesuai jarak' },
      { icon: <Package className="w-6 h-6" />, title: 'Maks 20kg', desc: 'Ringan hingga sedang' },
    ],
  },
  jastip: {
    title: 'Jastip', desc: 'Titip beli ke mana saja', icon: <ShoppingBasket className="w-16 h-16" />, gradient: 'from-green-500 to-green-600',
    features: [
      { icon: <Store className="w-6 h-6" />, title: 'Pasar', desc: 'Sayur, bumbu, daging' },
      { icon: <ShoppingBag className="w-6 h-6" />, title: 'Minimarket', desc: 'Alfamart, Indomaret' },
      { icon: <Pill className="w-6 h-6" />, title: 'Apotek', desc: 'Obat & vitamin' },
    ],
  },
  express: {
    title: 'Express', desc: 'Pengiriman kilat super cepat', icon: <Zap className="w-16 h-16" />, gradient: 'from-red-500 to-red-600',
    features: [
      { icon: <Timer className="w-6 h-6" />, title: '15-30 min', desc: 'Dalam kota' },
      { icon: <Footprints className="w-6 h-6" />, title: '1-2 jam', desc: 'Antar kecamatan' },
      { icon: <File className="w-6 h-6" />, title: 'Dokumen', desc: 'Surat & barang mendesak' },
    ],
  },
  belanja: {
    title: 'Belanja', desc: 'Jasa belanja ke toko pilihan', icon: <ShoppingCart className="w-16 h-16" />, gradient: 'from-indigo-500 to-indigo-600',
    features: [
      { icon: <Hammer className="w-6 h-6" />, title: 'Bangunan', desc: 'Semen, cat, besi' },
      { icon: <Sprout className="w-6 h-6" />, title: 'Pertanian', desc: 'Pupuk, benih' },
      { icon: <Shirt className="w-6 h-6" />, title: 'Pakaian', desc: 'Baju, sepatu' },
    ],
  },
  'layanan-lainnya': {
    title: 'Layanan Lainnya', desc: 'Servis & kebutuhan rumah tangga', icon: <Sparkles className="w-16 h-16" />, gradient: 'from-purple-500 to-purple-600',
    features: [
      { icon: <Lightbulb className="w-6 h-6" />, title: 'Servis Listrik', desc: 'Instalasi & perbaikan' },
      { icon: <Smile className="w-6 h-6" />, title: 'Pijat', desc: 'Tradisional & reflexology' },
      { icon: <Camera className="w-6 h-6" />, title: 'CCTV', desc: 'Pasang & setup' },
    ],
  },
}

export default function MobileHome() {
  const [currentView, setCurrentView] = useState('home')

  const handleServiceClick = (href: string) => {
    if (href === '#') return
    // Navigate to separate pages
    if (href === '/m/food' || href === '/m/belanja') {
      window.location.href = href
      return
    }
    const pageId = href.replace('/m/', '')
    if (pageId && servicePages[pageId]) {
      setCurrentView(pageId)
    }
  }

  const goBack = () => setCurrentView('home')

  if (currentView === 'food') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={goBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100" aria-label="Kembali ke halaman sebelumnya">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900">Pesan Antar Makanan</h1>
              <p className="text-xs text-gray-400 font-medium">{restaurants.length} restoran tersedia</p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari restoran" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" defaultValue="" />
            </div>
          </div>
        </div>
        <div className="px-4 py-4 space-y-3">
          {restaurants.map((rest) => (
            <a key={rest.name} href={`/m/food/${rest.slug || rest.name.toLowerCase().replace(/\s+/g, '-')}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform">
              <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center relative">
                <div className="text-orange-600">{rest.icon}</div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-gray-700">{rest.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 mb-1">{rest.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{rest.cuisine}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-3">
                  <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{rest.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rest.eta}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-600">{rest.price}</span>
                  <span className="flex items-center gap-1 text-xs font-black text-orange-600">Pesan <Phone className="w-3 h-3" /></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }

  const servicePage = servicePages[currentView]
  if (servicePage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={goBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100" aria-label="Kembali ke halaman sebelumnya">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900">{servicePage.title}</h1>
              <p className="text-xs text-gray-400 font-medium">{servicePage.desc}</p>
            </div>
          </div>
        </div>
        <div className={`bg-gradient-to-br ${servicePage.gradient} text-white px-4 py-8`}>
          <div className="text-center mb-4">{React.cloneElement(servicePage.icon as React.ReactElement<any>, { className: 'w-16 h-16 mx-auto' } as React.SVGProps<SVGSVGElement>)}</div>
          <h2 className="text-xl font-black text-center mb-2">{servicePage.title}</h2>
          <p className="text-white/80 text-sm text-center">{servicePage.desc}</p>
        </div>
        <div className="px-4 py-6 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {servicePage.features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                <div className="flex justify-center text-blue-600 mb-2">{f.icon}</div>
                <p className="text-xs font-black text-gray-900 mb-0.5">{f.title}</p>
                <p className="text-[10px] text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="block w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-center active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />Pesan Sekarang
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <LayoutGrid className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-red-600">Anterbae</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 -mr-2 rounded-xl hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari layanan atau produk" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" defaultValue="" />
          </div>
        </div>
      </div>

      {/* Service Icons */}
      <div className="bg-white px-4 py-6 border-b border-gray-50">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.href)}
              type="button"
              className="flex flex-col items-center gap-2 active:opacity-70"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">
                {service.icon}
              </div>
              <span className="text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider mb-1">Promo Spesial</p>
          <p className="text-lg font-black mb-1">Gratis Ongkir!</p>
          <p className="text-xs text-red-100 mb-3">Untuk pengguna baru di Banjarnegara</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="bg-white text-red-600 font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-transform inline-block">Klaim Sekarang</a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Link href="/products" className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-red-600" /><span className="text-xs font-bold text-gray-700">Belanja Produk</span>
          </Link>
          <Link href="/track" className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /><span className="text-xs font-bold text-gray-700">Lacak Pesanan</span>
          </Link>
          <a href="/register-courier" className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <Bike className="w-4 h-4 text-green-600" /><span className="text-xs font-bold text-gray-700">Jadi Kurir</span>
          </a>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/m" className="flex flex-col items-center gap-1 px-3 py-1 text-red-600">
            <HomeIcon className="w-5 h-5" /><span className="text-[10px] font-black">Beranda</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <ShoppingBag className="w-5 h-5" /><span className="text-[10px] font-bold">Produk</span>
          </Link>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 px-3 py-1 text-red-600">
            <MessageSquare className="w-5 h-5" /><span className="text-[10px] font-black">Pesan</span>
          </a>
          <Link href="/cart" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400 relative">
            <CartIcon className="w-5 h-5" /><span className="text-[10px] font-bold">Keranjang</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <User className="w-5 h-5" /><span className="text-[10px] font-bold">Akun</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
