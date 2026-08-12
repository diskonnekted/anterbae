'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Phone, User, ArrowLeft, Plus, Minus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface FoodCartItem {
  productId: string
  name: string
  price: number
  quantity: number
  notes: string
}

export default function FoodCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [cart, setCart] = useState<FoodCartItem[]>([])
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Form fields
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod_transfer' | 'cod_on_delivery'>('cod_on_delivery')
  
  // Location
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState<string | null>(null)

  // Load cart from URL params
  useEffect(() => {
    const cartJson = searchParams.get('cart')
    const restaurant = searchParams.get('restaurant')
    
    if (cartJson) {
      try {
        setCart(JSON.parse(decodeURIComponent(cartJson)))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
    if (restaurant) {
      setRestaurantName(decodeURIComponent(restaurant))
    }
  }, [searchParams])

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 5000
  const total = subtotal + deliveryFee

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation tidak didukung browser ini')
      return
    }

    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocError(null)
        setLocLoading(false)
      },
      (error) => {
        setLocError('Gagal mendapatkan lokasi: ' + error.message)
        setLocLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Submit order
  const handleSubmit = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Mohon lengkapi Nama, Nomor HP, dan Alamat')
      return
    }

    if (cart.length === 0) {
      alert('Keranjang pesanan kosong')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/food-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName,
          customerName,
          customerPhone,
          deliveryAddress,
          customerNotes,
          location,
          items: cart,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        alert('Gagal membuat pesanan: ' + result.error)
      }
    } catch (error) {
      console.error('Order error:', error)
      alert('Terjadi kesalahan saat membuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const isCod = paymentMethod === 'cod_on_delivery'

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            {isCod 
              ? 'Pesanan Anda telah diterima. Silakan tunggu kurir kami mengantarkan pesanan Anda.'
              : 'Nomor pesanan Anda telah dibuat. Silakan lakukan pembayaran transfer sesuai instruksi berikut:'
            }
          </p>

          {isCod ? (
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left border border-gray-100">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Metode Pembayaran</span>
              <p className="text-base font-black text-gray-900 mb-3">💵 Bayar di Tempat (COD)</p>
              
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Total Tunai ke Kurir</span>
              <p className="text-2xl font-black text-orange-600">Rp {total.toLocaleString('id-ID')}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left border border-gray-100">
              <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Transfer ke:</p>
              <p className="text-lg font-black text-gray-900 mb-1">BCA: 1234567890</p>
              <p className="text-xs text-gray-500 font-bold mb-3">a.n. Anterbae Banjarnegara</p>
              
              <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Total yang harus dibayar:</p>
              <p className="text-2xl font-black text-orange-600">Rp {total.toLocaleString('id-ID')}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6">
            {isCod 
              ? 'Siapkan uang tunai pas untuk memudahkan kurir saat penyerahan barang.'
              : 'Setelah transfer, kirim bukti pembayaran via WhatsApp ke nomor admin agar pesanan segera diproses.'
            }
          </p>

          <a
            href="https://wa.me/6281328128315"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-center transition-all active:scale-95 mb-3"
          >
            {isCod ? 'Hubungi WhatsApp Admin' : 'Kirim Bukti Pembayaran'}
          </a>

          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black text-center hover:bg-gray-200 transition-colors"
          >
            Kembali ke Beranda
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
            <h1 className="text-lg font-black text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-500">{restaurantName}</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white border-b border-gray-100 p-4">
        <h2 className="text-sm font-black text-gray-900 mb-3">Ringkasan Pesanan</h2>
        <div className="space-y-2 mb-3">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} x{item.quantity}
                {item.notes && <span className="text-gray-400 text-xs"> ({item.notes})</span>}
              </span>
              <span className="font-bold text-gray-900">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ongkir</span>
            <span className="font-bold text-gray-900">Rp {deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-base border-t border-gray-100 pt-2">
            <span className="font-black text-gray-900">Total</span>
            <span className="font-black text-red-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Customer Form */}
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-black text-gray-900">Informasi Pemesan</h2>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Nomor WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Alamat Pengiriman</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm resize-none"
            />
          </div>
        </div>

        {/* Location Button */}
        <div>
          <button
            onClick={getCurrentLocation}
            disabled={locLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {locLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mendapatkan Lokasi...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Gunakan Lokasi Saya (GPS)
              </>
            )}
          </button>
          {location && (
            <p className="text-xs text-gray-500 mt-2">
              Lokasi: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
          {locError && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {locError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Catatan Tambahan (Opsional)</label>
          <textarea
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Contoh: Antarkan lewat belakang, hubungi jika sudah dekat"
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none"
          />
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-3">Metode Pembayaran</label>
          <div className="space-y-3">
            {/* COD Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cod_on_delivery')}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                paymentMethod === 'cod_on_delivery'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'cod_on_delivery' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cod_on_delivery' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">💵 Bayar di Tempat (COD)</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Siapkan uang tunai Rp {total.toLocaleString('id-ID')}. Kurir akan mengambil uang saat pengantaran.
                  </p>
                  <p className="text-xs text-green-600 font-bold mt-1">✅ Pesanan langsung diproses</p>
                </div>
              </div>
            </button>

            {/* Transfer Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cod_transfer')}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                paymentMethod === 'cod_transfer'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'cod_transfer' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cod_transfer' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">🏦 Transfer Dulu</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Transfer ke BCA 1234567890, kirim bukti pembayaran via WA.
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-1">⏳ Menunggu konfirmasi admin</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-base hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Kirim Pesanan - Rp {total.toLocaleString('id-ID')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
