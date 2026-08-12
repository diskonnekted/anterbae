'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, Clock, Star, Phone, Store } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: { url: string }
  stock: number
  isBestSeller: boolean
}

interface Merchant {
  _id: string
  name: string
  logo: { url: string }
  coverImage: { url: string }
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
  const [showCart, setShowCart] = useState(false)

  // Load merchant & products
  useState(() => {
    fetch(`/api/merchant/${slug}`)
      .then(res => res.json())
      .then(data => {
        setMerchant(data.merchant)
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  })

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
  const deliveryFee = 5000

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Memuat menu...</p>
        </div>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Restoran Tidak Ditemukan</h2>
          <Link href="/m/food" className="text-red-600 font-bold">
            ← Kembali ke Daftar Restoran
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m/food" className="p-2 -ml-2 rounded-xl hover:bg-gray-100" aria-label="Kembali">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-gray-900">{merchant.name}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{merchant.openHours || '08.00 - 22.00'}</span>
            </div>
          </div>
          {merchant.isOpen && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
              Buka
            </span>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-start gap-4">
          {merchant.logo?.url && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={merchant.logo.url}
                alt={merchant.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">{merchant.description}</p>
            <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{merchant.address}</span>
            </div>
            <a
              href={`https://wa.me/${merchant.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors mt-2"
            >
              <Phone className="w-4 h-4" />
              Hubungi Restoran
            </a>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="p-4">
        <h2 className="text-lg font-black text-gray-900 mb-4">Menu</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold">Belum ada menu tersedia</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const cartItem = cart.find(item => item.product._id === product._id)
              const inCart = cartItem?.quantity || 0

              return (
                <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {product.image?.url && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.image.url}
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-black text-gray-900">{product.name}</h3>
                          {product.isBestSeller && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0">
                              Best Seller
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                        )}
                        <p className="text-red-600 font-black text-lg">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    {inCart > 0 ? (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Catatan (misal: tidak pedas)"
                            value={cartItem?.notes || ''}
                            onChange={(e) => updateNotes(product._id, e.target.value)}
                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-2"
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => updateQuantity(product._id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            aria-label="Kurangi"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-black text-gray-900">{inCart}</span>
                          <button
                            onClick={() => updateQuantity(product._id, 1)}
                            className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                            aria-label="Tambah"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-black text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah ke Pesanan
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart Floating Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
          <Link
            href="/checkout/food"
            className="block bg-red-600 text-white py-4 rounded-2xl font-black text-center hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Lanjut Pembayaran ({totalItems} item)</span>
            <span className="ml-2">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
