'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, Clock, Star, Phone, Store, Heart } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: any
  stock: number
  isBestSeller: boolean
}

interface Merchant {
  _id: string
  name: string
  logo: any
  coverImage: any
  address: string
  phone: string
  isOpen: boolean
  openHours: string
  description: string
  category: string
}

interface FoodCartItem {
  product: Product
  quantity: number
  notes: string
}

export default function FoodDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<FoodCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  // Load merchant & products
  useEffect(() => {
    if (!slug) return
    fetch(`/api/merchant/${slug}`)
      .then(res => res.json())
      .then(data => {
        setMerchant(data.merchant)
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id)
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, notes: '' }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    )
  }

  const updateNotes = (productId: string, notes: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product._id === productId ? { ...item, notes } : item
      )
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm">Menyiapkan menu lezat...</p>
        </div>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-sm w-full">
          <Store className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Toko Tidak Ditemukan</h2>
          <p className="text-slate-400 font-bold text-xs mb-6">Restoran atau toko ini mungkin sedang dalam perbaikan.</p>
          <Link href="/m/food" className="inline-block bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-xs active:scale-95 transition-transform">
            ← Kembali ke Daftar Food
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header Cover Image */}
      <div className="h-48 bg-gradient-to-br from-red-50 to-orange-100 relative">
        {merchant.coverImage ? (
          <Image
            src={urlFor(merchant.coverImage).width(800).height(400).url()}
            alt={merchant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🍲</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
        
        {/* Top bar back button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Link href="/m/food" className="p-3 bg-slate-900/60 backdrop-blur-md text-white rounded-2xl active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setLiked(!liked)} 
            className="p-3 bg-slate-900/60 backdrop-blur-md text-white rounded-2xl active:scale-90 transition-transform"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Floating Merchant Header info */}
        <div className="absolute bottom-4 left-6 right-6 text-white">
          <h1 className="text-xl font-black tracking-tight drop-shadow-md">{merchant.name}</h1>
          <p className="text-[10px] bg-red-600 px-2.5 py-0.5 rounded-full inline-block font-black uppercase tracking-wider mt-1.5 shadow-md shadow-red-600/20">
            🍕 {merchant.category || 'Makanan'}
          </p>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="bg-white border-b border-slate-100 p-6 shadow-sm">
        <p className="text-slate-600 text-sm font-bold leading-relaxed mb-4">{merchant.description || 'Tidak ada deskripsi tersedia.'}</p>
        
        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Jam Buka</span>
              <span className="text-slate-800">{merchant.openHours || '08.00 - 22.00'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Lokasi Toko</span>
              <span className="text-slate-800 truncate block max-w-[120px]">{merchant.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu / Products Listing */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Daftar Menu Lezat</h2>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{products.length} menu</span>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100">
            <p className="text-slate-500 font-bold text-sm">Belum ada menu tersedia saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const cartItem = cart.find(item => item.product._id === product._id)
              const inCart = cartItem?.quantity || 0

              return (
                <div key={product._id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col p-4 relative">
                  <div className="flex gap-4">
                    {/* Food Photo Container */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100 shadow-inner">
                      {product.image ? (
                        <Image
                          src={urlFor(product.image).width(150).height(150).url()}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-red-50 to-orange-50">🍱</div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <h3 className="font-black text-slate-900 text-sm leading-snug truncate">{product.name}</h3>
                          {product.isBestSeller && (
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex-shrink-0">
                              Terlaris
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-normal line-clamp-2">{product.description}</p>
                        )}
                      </div>
                      
                      <p className="text-red-600 font-black text-base mt-2">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Note Actions */}
                  {inCart > 0 ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-3 pt-3 border-t border-slate-50 gap-2">
                      <input
                        type="text"
                        placeholder="Catatan (pedas, manis, dll.)"
                        value={cartItem?.notes || ''}
                        onChange={(e) => updateNotes(product._id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 outline-none focus:bg-white focus:ring-1 focus:ring-red-600 flex-grow"
                      />
                      <div className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-100 p-1 rounded-xl self-end sm:self-auto">
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center active:scale-90 hover:bg-slate-100 border border-slate-200/40 shadow-sm"
                          aria-label="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <span className="w-6 text-center font-black text-slate-900 text-xs">{inCart}</span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center active:scale-90 hover:bg-red-700 shadow-sm"
                          aria-label="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-4 bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Ke Pesanan
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Panel */}
      {cart.length > 0 && (() => {
        const cartParams = encodeURIComponent(
          JSON.stringify(
            cart.map(item => ({
              productId: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              notes: item.notes
            }))
          )
        );
        const checkoutUrl = `/checkout/food?cart=${cartParams}&restaurant=${encodeURIComponent(merchant.name)}&phone=${encodeURIComponent(merchant.phone || '')}`;
        
        return (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] max-w-md mx-auto rounded-t-[2.5rem]">
            <Link
              href={checkoutUrl}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-center transition-all active:scale-95 flex items-center justify-between px-6 shadow-xl shadow-red-600/15"
            >
              <div className="flex items-center gap-3.5 text-left">
                <ShoppingCart className="w-5 h-5 text-white" />
                <div>
                  <span className="block text-[10px] text-red-200 font-extrabold uppercase tracking-wider">Lanjut Bayar</span>
                  <span className="text-xs font-black">{totalItems} Item Menu</span>
                </div>
              </div>
              <span className="text-sm font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </Link>
          </div>
        );
      })()}
    </div>
  )
}
