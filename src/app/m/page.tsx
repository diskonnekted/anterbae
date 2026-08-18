'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UtensilsCrossed, Truck, ShoppingBasket, Package, Coins, ShoppingCart, Sparkles, Search, Bell, ChevronDown, LayoutGrid, ShoppingBag, MapPin, Bike, MessageSquare, ShoppingCart as CartIcon, User, Home as HomeIcon, ChevronRight, Phone, Star, Clock, MapPin as MapPinIcon, Zap, Shield, Tag, Gift, Lightbulb, Wrench, Camera, Scissors, Hammer, ArrowLeft, Soup, DrumstickIcon, Store, Pill, Timer, Footprints, File, Sprout, Shirt, Smile, PackageCheck, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface PromoProduct {
  _id: string
  name: string
  slug: string
  price: number
  image?: any
  isPromo?: boolean
  promoDiscount?: number
  merchant?: { name: string; slug: string }
}

interface Merchant {
  _id: string
  name: string
  slug: string
  category: string
  logo?: any
  isOpen: boolean
}

const services = [
  { id: 'food', icon: '/icon/food.jpg', label: 'Food', href: '/m/food', color: 'red' },
  { id: 'antar-jemput', icon: '/icon/jasa-antar.jpg', label: 'Pengantaran', href: '/m/antar-jemput', color: 'blue' },
  { id: 'paket', icon: '/icon/antar-paket.jpg', label: 'Antar Paket', href: '/m/paket', color: 'blue' },
  { id: 'jastip', icon: '/icon/jastip.jpg', label: 'Jastip', href: '/m/jastip', color: 'green' },
  { id: 'express', icon: '/icon/express.jpg', label: 'Express', href: '/m/express', color: 'orange' },
  { id: 'belanja', icon: '/icon/belanja.jpg', label: 'Belanja', href: '/m/belanja', color: 'emerald' },
  { id: 'lainnya', icon: '/icon/jasa-khusus.jpg', label: 'Lainnya', href: '/m/layanan-lainnya', color: 'purple' },
]

const serviceColors: Record<string, { bg: string; text: string; border: string; gradient: string; badge: string }> = {
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', gradient: 'from-red-500 to-red-600', badge: 'bg-red-100 text-red-700' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600', badge: 'bg-orange-100 text-orange-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600', badge: 'bg-purple-100 text-purple-700' },
}

const restaurants = [
  { slug: 'warung-nasi-bu-sri', name: 'Warung Nasi Bu Sri', cuisine: 'Nasi, Mie, Bakso', rating: 4.8, distance: '0.5 km', eta: '20 menit', icon: <Soup className="w-12 h-12" />, price: 'Rp 10.000 - 25.000' },
  { slug: 'soto-pak-ahmad', name: 'Soto Pak Ahmad', cuisine: 'Soto, Ayam, Sayur', rating: 4.9, distance: '1.2 km', eta: '25 menit', icon: <Soup className="w-12 h-12" />, price: 'Rp 12.000 - 30.000' },
  { slug: 'bakso-jantur', name: 'Bakso Jantur', cuisine: 'Bakso, Bakso Goreng', rating: 4.9, distance: '2.0 km', eta: '30 menit', icon: <UtensilsCrossed className="w-12 h-12" />, price: 'Rp 15.000 - 35.000' },
  { slug: 'ayam-geprek-sambal-bawang', name: 'Ayam Geprek Sambal Bawang', cuisine: 'Ayam Geprek, Nasi', rating: 4.7, distance: '0.7 km', eta: '20 menit', icon: <DrumstickIcon className="w-12 h-12" />, price: 'Rp 12.000 - 25.000' },
]

const servicePages: Record<string, { title: string; desc: string; color: string; features: { icon: React.ReactNode; title: string; desc: string }[]; cta?: string }> = {
  paket: {
    title: 'Antar Paket', desc: 'Kirim paket ke seluruh Banjarnegara', color: 'blue',
    features: [
      { icon: <Shield className="w-6 h-6" />, title: 'Aman', desc: 'Dijamin sampai selamat' },
      { icon: <Zap className="w-6 h-6" />, title: 'Cepat', desc: 'Estimasi sesuai jarak' },
      { icon: <Package className="w-6 h-6" />, title: 'Maks 20kg', desc: 'Ringan hingga sedang' },
    ],
  },
  jastip: {
    title: 'Jastip', desc: 'Titip beli ke mana saja', color: 'green',
    features: [
      { icon: <Store className="w-6 h-6" />, title: 'Pasar', desc: 'Sayur, bumbu, daging' },
      { icon: <ShoppingBag className="w-6 h-6" />, title: 'Minimarket', desc: 'Alfamart, Indomaret' },
      { icon: <Pill className="w-6 h-6" />, title: 'Apotek', desc: 'Obat & vitamin' },
    ],
  },
  express: {
    title: 'Express', desc: 'Pengiriman kilat super cepat', color: 'orange',
    features: [
      { icon: <Timer className="w-6 h-6" />, title: '15-30 min', desc: 'Dalam kota' },
      { icon: <Footprints className="w-6 h-6" />, title: '1-2 jam', desc: 'Antar kecamatan' },
      { icon: <File className="w-6 h-6" />, title: 'Dokumen', desc: 'Surat & barang mendesak' },
    ],
  },
  belanja: {
    title: 'Belanja', desc: 'Jasa belanja ke toko pilihan', color: 'emerald',
    features: [
      { icon: <Hammer className="w-6 h-6" />, title: 'Bangunan', desc: 'Semen, cat, besi' },
      { icon: <Sprout className="w-6 h-6" />, title: 'Pertanian', desc: 'Pupuk, benih' },
      { icon: <Shirt className="w-6 h-6" />, title: 'Pakaian', desc: 'Baju, sepatu' },
    ],
  },
  'layanan-lainnya': {
    title: 'Layanan Lainnya', desc: 'Servis & kebutuhan rumah tangga', color: 'purple',
    features: [
      { icon: <Lightbulb className="w-6 h-6" />, title: 'Servis Listrik', desc: 'Instalasi & perbaikan' },
      { icon: <Smile className="w-6 h-6" />, title: 'Pijat', desc: 'Tradisional & reflexology' },
      { icon: <Camera className="w-6 h-6" />, title: 'CCTV', desc: 'Pasang & setup' },
    ],
  },
}

export default function MobileHome() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState('home')
  const [showNotifications, setShowNotifications] = useState(false)
  const [promoProducts, setPromoProducts] = useState<PromoProduct[]>([])
  const [topMerchants, setTopMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [homeSearchQuery, setHomeSearchQuery] = useState('')
  const [foodSearchQuery, setFoodSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PromoProduct[]>([])
  const [searchMerchants, setSearchMerchants] = useState<Merchant[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
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

  // Hide splash screen when data loading is finished or after 800ms max
  useEffect(() => {
    if (!loading) {
      setShowSplash(false)
    }
  }, [loading])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [promoRes, merchantRes] = await Promise.all([
          fetch('/api/promo-products?limit=6'),
          fetch('/api/top-merchants?limit=4'),
        ])
        const promoData = await promoRes.json()
        const merchantData = await merchantRes.json()
        if (promoData.products) setPromoProducts(promoData.products)
        if (merchantData.merchants) setTopMerchants(merchantData.merchants)
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Debounced search API call
  useEffect(() => {
    if (!homeSearchQuery || homeSearchQuery.length < 2) {
      setSearchResults([])
      setSearchMerchants([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/search-products?q=${encodeURIComponent(homeSearchQuery)}`)
        const data = await res.json()
        setSearchResults(data.products || [])
        setSearchMerchants(data.merchants || [])
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setSearchLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [homeSearchQuery])

  const handleServiceClick = (href: string) => {
    if (href === '#') return
    // Navigate to separate pages
    if (href === '/m/food' || href === '/m/belanja' || href === '/m/antar-jemput' || href === '/m/paket' || href === '/m/express' || href === '/m/jastip') {
      window.location.href = href
      return
    }
    const pageId = href.replace('/m/', '')
    if (pageId && servicePages[pageId]) {
      setCurrentView(pageId)
    }
  }

  const goBack = () => setCurrentView('home')

  const filteredRestaurants = restaurants.filter(rest =>
    rest.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
    rest.cuisine.toLowerCase().includes(foodSearchQuery.toLowerCase())
  )

  const filteredPromoProducts = promoProducts.filter(product =>
    product.name.toLowerCase().includes(homeSearchQuery.toLowerCase())
  )

  const filteredTopMerchants = topMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
    merchant.category.toLowerCase().includes(homeSearchQuery.toLowerCase())
  )

  const filteredServices = services.filter(service =>
    service.label.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
    service.id.toLowerCase().includes(homeSearchQuery.toLowerCase())
  )

  // Close notifications when clicking outside
  useEffect(() => {
    if (!showNotifications) return
    const handler = () => setShowNotifications(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showNotifications])

  if (currentView === 'food') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={goBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100" aria-label="Kembali ke halaman sebelumnya">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-black text-red-600">Pesan Antar Makanan</h1>
              <p className="text-xs text-gray-400 font-medium">{filteredRestaurants.length} restoran tersedia</p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Cari restoran" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" value={foodSearchQuery} onChange={(e) => setFoodSearchQuery(e.target.value)} />
              {foodSearchQuery && (
                <button type="button" onClick={() => setFoodSearchQuery('')} className="p-1 hover:bg-gray-200 rounded-full flex-shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button type="button" onClick={() => setFoodSearchQuery(foodSearchQuery)} className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-lg flex-shrink-0 active:scale-95 transition-transform">
                Cari
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 space-y-3">
          {filteredRestaurants.map((rest) => (
            <a key={rest.name} href={`/m/food/${rest.slug || rest.name.toLowerCase().replace(/\s+/g, '-')}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform">
              <div className="h-32 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center relative">
                <div className="text-red-600">{rest.icon}</div>
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
                  <span className="flex items-center gap-1 text-xs font-black text-red-600">Pesan <Phone className="w-3 h-3" /></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }

  const servicePage = servicePages[currentView]
  const colors = servicePage ? serviceColors[servicePage.color] : null
  if (servicePage && colors) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={goBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100" aria-label="Kembali ke halaman sebelumnya">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className={`text-lg font-black ${colors.text}`}>{servicePage.title}</h1>
              <p className="text-xs text-gray-400 font-medium">{servicePage.desc}</p>
            </div>
          </div>
        </div>
        <div className={`bg-gradient-to-br ${colors.gradient} text-white px-4 py-8`}>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text}`}>
              <img 
                src={`/icon/${currentView === 'layanan-lainnya' ? 'jasa-khusus' : currentView === 'paket' ? 'antar-paket' : currentView}.jpg`} 
                alt={servicePage.title} 
                className="w-12 h-12 rounded-xl object-cover" 
              />
            </div>
          </div>
          <h2 className="text-xl font-black text-center mb-2">{servicePage.title}</h2>
          <p className="text-white/80 text-sm text-center">{servicePage.desc}</p>
        </div>
        <div className="px-4 py-6 space-y-4">
          {['paket', 'jastip', 'express', 'layanan-lainnya'].includes(currentView) && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-black text-center leading-relaxed">
              ⚠️ Layanan ini sedang dalam proses pengembangan.
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {servicePage.features.map((f) => (
              <div key={f.title} className={`bg-white rounded-2xl p-3 text-center border ${colors.border}`}>
                <div className={`flex justify-center ${colors.text} mb-2`}>{f.icon}</div>
                <p className="text-xs font-black text-gray-900 mb-0.5">{f.title}</p>
                <p className="text-[10px] text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>

          {['paket', 'jastip', 'express', 'layanan-lainnya'].includes(currentView) ? (
            <div className="block w-full bg-slate-100 text-slate-400 border border-slate-200 font-black py-4 rounded-2xl text-center cursor-not-allowed flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Belum Tersedia
            </div>
          ) : (
            <a href="https://wa.me/6281328128315" target="_blank" rel="noopener noreferrer" className={`block w-full ${colors.gradient} text-white font-black py-4 rounded-2xl text-center active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg`}>
              <Phone className="w-5 h-5" />Pesan Sekarang
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          {/* Logo - centered, full fit, not cropped */}
          <div className="flex items-center justify-center w-full h-full px-8">
            <div className="relative w-[220px] h-auto">
              <img
                src="/logo-anterbae-fix.png"
                alt="Anterbae Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          {/* Tagline */}
          <p className="absolute bottom-20 text-xs font-bold text-slate-400 tracking-widest uppercase">
            Delivery Service
          </p>
          {/* Loading spinner */}
          <div className="absolute bottom-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <LayoutGrid className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/logo-anterbae-fix.png"
              alt="Logo Anterbae"
              width={32}
              height={32}
              className="h-[32px] w-auto object-contain"
            />
            <span className="text-lg font-black text-orange-600 tracking-tight">Anterbae</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 -mr-2 rounded-xl hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-black text-gray-900">Notifikasi</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { title: 'Promo Spesial!', desc: 'Gratis ongkir untuk pengguna baru', time: '2 jam lalu', color: 'bg-red-100 text-red-600' },
                    { title: 'Merchant Baru', desc: 'Deca Dessent Banjarnegara sudah bergabung', time: '1 hari lalu', color: 'bg-green-100 text-green-600' },
                    { title: 'Layanan Jastip', desc: 'Titip beli ke pasar, minimarket & apotek', time: '3 hari lalu', color: 'bg-blue-100 text-blue-600' },
                  ].map((notif, i) => (
                    <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 active:scale-[0.98] transition-transform cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl ${notif.color} flex items-center justify-center flex-shrink-0`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-900 mb-0.5">{notif.title}</p>
                          <p className="text-[11px] text-gray-500 leading-snug">{notif.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button onClick={() => setShowNotifications(false)} className="w-full text-center text-xs font-bold text-red-600 py-2 hover:bg-red-50 rounded-xl transition-colors">
                    Tandai Semua Dibaca
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Cari layanan atau produk" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" value={homeSearchQuery} onChange={(e) => setHomeSearchQuery(e.target.value)} />
            {homeSearchQuery && (
              <button type="button" onClick={() => setHomeSearchQuery('')} className="p-1 hover:bg-gray-200 rounded-full flex-shrink-0">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button type="button" onClick={() => setHomeSearchQuery(homeSearchQuery)} className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-lg flex-shrink-0 active:scale-95 transition-transform">
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* Service Icons */}
      <div className="bg-white px-4 py-6 border-b border-gray-50">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.href)}
              type="button"
              className="flex flex-col items-center gap-2 active:opacity-70"
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
              <span className="text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {homeSearchQuery && homeSearchQuery.length >= 2 && (
        <div className="px-4 py-4">
          <h2 className="text-base font-black text-gray-900 mb-4">
            Hasil Pencarian "{homeSearchQuery}"
          </h2>
          {searchLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
              <p className="text-xs text-gray-400 font-medium mt-2">Mencari...</p>
            </div>
          ) : (searchResults.length > 0 || searchMerchants.length > 0) ? (
            <>
              {searchMerchants.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4" />Merchant
                  </h3>
                  <div className="space-y-2">
                    {searchMerchants.map((merchant) => (
                      <a
                        key={merchant._id}
                        href={`/mitra/${merchant.slug}`}
                        className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100 active:scale-[0.98] transition-transform"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {merchant.logo ? (
                            <Image
                              src={urlFor(merchant.logo).width(100).height(100).url()}
                              alt={merchant.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-2xl">🏪</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-gray-900 truncate">{merchant.name}</h4>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {merchant.category === 'food' ? 'Makanan' : merchant.category === 'grocery' ? 'Grocery' : 'Lainnya'}
                          </p>
                        </div>
                        <div className={`text-[10px] font-black px-2 py-1 rounded-full ${
                          merchant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {merchant.isOpen ? 'Buka' : 'Tutup'}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />Produk
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {searchResults.map((product) => (
                      <a
                        key={product._id}
                        href={`/product/${product.slug}`}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
                      >
                        <div className="relative h-28 bg-gray-100">
                          {product.image ? (
                            <Image
                              src={urlFor(product.image).width(300).height(200).url()}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                          )}
                          {product.promoDiscount && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                              -{product.promoDiscount}%
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                          <p className="text-sm font-black text-red-600">Rp {product.price.toLocaleString('id-ID')}</p>
                          {product.merchant && (
                            <p className="text-[10px] text-gray-400 font-medium mt-1">{product.merchant.name}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-sm font-bold text-gray-500">Tidak ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      )}

      {/* Promo Banner */}
      {!homeSearchQuery && (
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs font-bold text-orange-100 uppercase tracking-wider mb-1">Promo Spesial</p>
          <p className="text-xl font-black mb-1">Gratis Ongkir!</p>
          <p className="text-sm text-orange-50 mb-4">Untuk pengguna baru di Banjarnegara</p>
          <button 
            onClick={handleClaimPromo} 
            className="bg-white text-orange-600 font-black text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform inline-block shadow-md cursor-pointer"
          >
            Klaim Sekarang
          </button>
        </div>
      </div>
      )}

      {/* Promo Products */}
      {filteredPromoProducts.length > 0 && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-900">Promo Hari Ini</h2>
            <Link href="/products" className="text-xs font-bold text-red-600">Lihat Semua →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredPromoProducts.slice(0, 6).map((product) => (
              <a
                key={product._id}
                href={`/product/${product.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="relative h-28 bg-gray-100">
                  {product.image ? (
                    <Image
                      src={urlFor(product.image).width(300).height(200).url()}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                  )}
                  {product.promoDiscount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                      -{product.promoDiscount}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                  <p className="text-sm font-black text-red-600">Rp {product.price.toLocaleString('id-ID')}</p>
                  {product.merchant && (
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{product.merchant.name}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Jastip Promo Banner */}
      {!homeSearchQuery && (
      <div className="px-4 py-3">
        <a href="/m/jastip" className="block rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform">
          <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src="/media/jastip2.JPG"
              alt="Jastip — Titip Beli ke Mana Saja"
              className="w-full h-full object-cover"
            />
          </div>
        </a>
      </div>
      )}

      {/* Top Merchants */}
      {filteredTopMerchants.length > 0 && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-900">Merchant Populer</h2>
            <Link href="/mitra" className="text-xs font-bold text-red-600">Lihat Semua →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredTopMerchants.slice(0, 4).map((merchant) => (
              <a
                key={merchant._id}
                href={`/mitra/${merchant.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="relative h-20 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                  {merchant.logo ? (
                    <Image
                      src={urlFor(merchant.logo).width(100).height(100).url()}
                      alt={merchant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-3xl">🏪</div>
                  )}
                  <div className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    merchant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {merchant.isOpen ? 'Buka' : 'Tutup'}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-gray-900 truncate">{merchant.name}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{merchant.category === 'food' ? 'Makanan' : merchant.category === 'grocery' ? 'Grocery' : 'Lainnya'}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="px-4 py-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-medium mt-2">Memuat...</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => window.location.href = '/m'} className="flex flex-col items-center gap-1 px-3 py-1 text-red-600">
            <HomeIcon className="w-5 h-5" /><span className="text-[10px] font-black">Beranda</span>
          </button>
          <Link href="/products" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <ShoppingBag className="w-5 h-5" /><span className="text-[10px] font-bold">Produk</span>
          </Link>
          <Link href="/m/antar-jemput" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <Bike className="w-5 h-5" /><span className="text-[10px] font-bold">Antar</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400 relative">
            <CartIcon className="w-5 h-5" /><span className="text-[10px] font-bold">Keranjang</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400">
            <User className="w-5 h-5" /><span className="text-[10px] font-bold">Akun</span>
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

            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-orange-100">
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

            <p className="text-xs text-slate-400 font-bold leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
              Silakan kirimkan kode voucher di atas ke Admin CS via WhatsApp untuk mengklaim pengiriman gratis Anda.
            </p>

            <a
              href={`https://wa.me/6281328128315?text=${encodeURIComponent(`Halo Admin Anterbae, saya ingin mengklaim Voucher Gratis Ongkir Baru saya: ${promoCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPromoModal(false)}
              className="block w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all active:scale-95 text-center shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Kirim Kode ke Admin WA
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
