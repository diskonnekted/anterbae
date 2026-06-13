'use client'

import { useState } from 'react'
import { getCourierByPhone, updateOrderStatus } from '@/app/actions/courier-portal'
import { Truck, Phone, Lock, ArrowRight, Loader2, LogOut, Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'accepted', label: '✅ Konfirmasi Pesanan' },
  { value: 'picking_up', label: '🛵 Berangkat Pickup' },
  { value: 'picked_up', label: '📦 Barang Dijemput' },
  { value: 'delivering', label: '🚀 Dalam Pengiriman' },
  { value: 'delivered', label: '🏠 Telah Sampai' },
  { value: 'completed', label: '✔️ Selesai' },
  { value: 'problem', label: '⚠️ Laporkan Masalah' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  picking_up: 'bg-purple-100 text-purple-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  delivering: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-200 text-green-900',
  problem: 'bg-red-100 text-red-800',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  food: '🍔 Makanan',
  parcel: '📦 Paket',
  jastip: '🛒 Jastip',
}

export default function KurirPortalPage() {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courierData, setCourierData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await getCourierByPhone(phone, pin)
    if (res.success && res.data) {
      setCourierData(res.data.courier)
      setOrders(res.data.orders || [])
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    const res = await updateOrderStatus(orderId, status)
    if (res.success) {
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status } : o)
      )
    }
    setUpdating(null)
  }

  const handleLogout = () => {
    setCourierData(null)
    setOrders([])
    setPhone('')
    setPin('')
  }

  // === DASHBOARD VIEW ===
  if (courierData) {
    const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))
    const completedOrders = orders.filter(o => o.status === 'completed')

    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 pt-8 pb-16">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🛵
                </div>
                <div>
                  <h1 className="text-xl font-black">{courierData.name}</h1>
                  <p className="text-slate-400 text-sm font-bold">{courierData.area || 'Banjarnegara'} • {courierData.vehiclePlate || courierData.vehicleType}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black">{activeOrders.length}</div>
                <div className="text-xs text-slate-400 font-bold">Aktif</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black">{completedOrders.length}</div>
                <div className="text-xs text-slate-400 font-bold">Selesai</div>
              </div>
              <div className="bg-red-600/30 rounded-2xl p-4 text-center">
                <div className="text-2xl">🟢</div>
                <div className="text-xs text-green-400 font-black">Aktif</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="container mx-auto px-4 max-w-3xl -mt-8">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            Pesanan Aktif ({activeOrders.length})
          </h2>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-slate-600">Tidak ada pesanan aktif</p>
              <p className="text-slate-400 text-sm font-medium mt-1">Tunggu penugasan dari admin Anterbae</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-black">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-black ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-slate-900">{order.customerName}</div>
                        <div className="text-xs text-slate-400 font-bold">{order.customerPhone}</div>
                      </div>
                      <a
                        href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Detail Pesanan</div>
                    <div className="text-sm font-bold text-slate-700 bg-slate-50 rounded-xl p-3 whitespace-pre-line">{order.items}</div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-2 mb-4">
                    {order.pickupAddress && (
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 font-black">📍</span>
                        <div>
                          <span className="text-green-600 font-black text-xs uppercase">Pickup: </span>
                          <span className="font-bold text-slate-700">{order.pickupAddress}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 font-black">🎯</span>
                      <div>
                        <span className="text-red-600 font-black text-xs uppercase">Tujuan: </span>
                        <span className="font-bold text-slate-700">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Courier Notes */}
                  {order.courierNotes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm">
                      <span className="font-black text-amber-800">📝 Catatan: </span>
                      <span className="text-amber-700">{order.courierNotes}</span>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="font-bold text-slate-500">
                      {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Transfer'}
                    </span>
                    {order.shippingFee > 0 && (
                      <span className="font-black text-red-600">
                        Ongkir: Rp{order.shippingFee?.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {/* Status Update */}
                  <div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">Update Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.filter(s => {
                        const statusOrder = ['pending', 'accepted', 'picking_up', 'picked_up', 'delivering', 'delivered', 'completed']
                        const currentIdx = statusOrder.indexOf(order.status)
                        const optionIdx = statusOrder.indexOf(s.value)
                        return s.value === 'problem' || optionIdx > currentIdx
                      }).slice(0, 4).map((s) => (
                        <button
                          key={s.value}
                          onClick={() => handleUpdateStatus(order._id, s.value)}
                          disabled={updating === order._id}
                          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                            s.value === 'problem'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          } disabled:opacity-50`}
                        >
                          {updating === order._id ? <Loader2 className="w-3 h-3 animate-spin" /> : s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // === LOGIN VIEW ===
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 pt-10 pb-8 text-center">
          <div className="inline-flex w-16 h-16 bg-red-600 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg shadow-red-900/50">
            🛵
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Portal Mitra</h1>
          <p className="text-slate-400 font-bold mt-1 text-sm">Anterbae Delivery Service</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <input
                  required type="tel"
                  placeholder="08123456789"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                PIN Kurir
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <input
                  required type="password"
                  maxLength={6}
                  placeholder="••••••"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 tracking-[0.5em]"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-red-700"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Masuk Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/register-courier"
              className="text-sm font-black text-red-600 hover:text-red-700 transition-colors"
            >
              Belum jadi mitra? Daftar sekarang →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
