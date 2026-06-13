'use client'

import { useState } from 'react'
import { Package, MapPin, Phone, Clock, Truck, ChevronRight, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { getOrderByNumber } from '@/app/actions/delivery-order'

const STATUS_MAP: Record<string, { label: string; color: string; icon: string; step: number }> = {
  pending: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-100 text-yellow-800', icon: '⏳', step: 1 },
  accepted: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800', icon: '✅', step: 2 },
  picking_up: { label: 'Kurir Menuju Pickup', color: 'bg-purple-100 text-purple-800', icon: '🛵', step: 3 },
  picked_up: { label: 'Barang Dijemput', color: 'bg-indigo-100 text-indigo-800', icon: '📦', step: 4 },
  delivering: { label: 'Dalam Pengiriman', color: 'bg-orange-100 text-orange-800', icon: '🚀', step: 5 },
  delivered: { label: 'Telah Sampai', color: 'bg-green-100 text-green-800', icon: '🏠', step: 6 },
  completed: { label: 'Selesai', color: 'bg-green-200 text-green-900', icon: '✔️', step: 7 },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: '❌', step: 0 },
  problem: { label: 'Ada Masalah', color: 'bg-red-100 text-red-800', icon: '⚠️', step: 0 },
}

const ORDER_TYPES: Record<string, string> = {
  food: '🍔 Pesan Antar Makanan',
  parcel: '📦 Antar Paket',
  jastip: '🛒 Jastip',
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)

    const res = await getOrderByNumber(orderNumber.trim().toUpperCase())
    if (res.success && res.data) {
      setOrder(res.data)
    } else {
      setError(res.error || 'Pesanan tidak ditemukan.')
    }
    setLoading(false)
  }

  const statusInfo = order ? (STATUS_MAP[order.status] || STATUS_MAP.pending) : null

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-red-600 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg shadow-red-200">
              📍
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Lacak Pesanan
            </h1>
            <p className="text-slate-500 font-medium">
              Masukkan nomor pesanan Anda (diawali ANT-) untuk melihat status pengiriman.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 mb-6">
            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ANT-123456"
                className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-black text-slate-900 text-lg uppercase placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-200"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Order Result */}
          {order && statusInfo && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`rounded-3xl p-6 ${statusInfo.color} text-center`}>
                <div className="text-4xl mb-2">{statusInfo.icon}</div>
                <div className="text-2xl font-black">{statusInfo.label}</div>
                {order.estimatedTime && (
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-bold opacity-80">
                    <Clock className="w-4 h-4" />
                    Estimasi: {order.estimatedTime}
                  </div>
                )}
              </div>

              {/* Progress Steps */}
              {order.status !== 'cancelled' && order.status !== 'problem' && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center">
                    {[
                      { step: 1, icon: '✅', label: 'Konfirmasi' },
                      { step: 3, icon: '🛵', label: 'Pickup' },
                      { step: 5, icon: '🚀', label: 'Kirim' },
                      { step: 7, icon: '✔️', label: 'Selesai' },
                    ].map(({ step, icon, label }, i) => {
                      const currentStep = statusInfo.step
                      const isActive = currentStep >= step
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black transition-all ${
                            isActive ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-300'
                          }`}>
                            {isActive ? icon : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                          </div>
                          <div className={`text-[10px] font-black mt-2 uppercase tracking-wider ${isActive ? 'text-red-600' : 'text-slate-400'}`}>
                            {label}
                          </div>
                          {i < 3 && (
                            <div className={`absolute top-5 w-full h-px ${isActive ? 'bg-red-200' : 'bg-slate-100'}`}></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Nomor Order</div>
                    <div className="font-black text-slate-900 text-lg">{order.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Jenis</div>
                    <div className="font-bold text-sm">{ORDER_TYPES[order.orderType] || order.orderType}</div>
                  </div>
                </div>

                {/* Merchant */}
                {order.merchant && (
                  <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                    <div className="text-2xl">🏪</div>
                    <div>
                      <div className="font-black text-sm text-slate-900">{order.merchant.name}</div>
                      <div className="text-xs text-slate-400 font-bold">Merchant</div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div>
                  <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">Detail Pesanan</div>
                  <div className="text-sm font-bold text-slate-700 bg-slate-50 rounded-2xl p-3 whitespace-pre-line">{order.items}</div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 gap-3">
                  {order.pickupAddress && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">Pickup</div>
                        <div className="text-sm font-bold text-slate-700">{order.pickupAddress}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">Tujuan</div>
                      <div className="text-sm font-bold text-slate-700">{order.deliveryAddress}</div>
                      {order.deliveryArea && <div className="text-xs text-slate-400 font-bold">{order.deliveryArea}</div>}
                    </div>
                  </div>
                </div>

                {/* Courier */}
                {order.courier && (
                  <div className="bg-red-50 rounded-2xl p-4">
                    <div className="text-xs text-red-600 font-black uppercase tracking-widest mb-2">Kurir Anda</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🛵</div>
                        <div>
                          <div className="font-black text-slate-900">{order.courier.name}</div>
                          <div className="text-xs text-slate-500 font-bold">{order.courier.vehicleType || 'Motor'}</div>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${order.courier.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600 text-white font-black px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition-all active:scale-95"
                      >
                        <Phone className="w-3 h-3" />
                        WA Kurir
                      </a>
                    </div>
                  </div>
                )}

                {/* Payment */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Pembayaran</div>
                    <div className="font-bold text-sm text-slate-700">
                      {order.paymentMethod === 'cod' ? '💵 COD (Bayar di Tempat)' : '💳 Transfer / QRIS'}
                    </div>
                  </div>
                  {order.shippingFee > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Ongkir</div>
                      <div className="font-black text-red-600">Rp{order.shippingFee?.toLocaleString('id-ID')}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help */}
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium mb-3">Ada masalah dengan pesanan?</p>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-green-700 transition-all text-sm active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  Hubungi Admin Anterbae
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
