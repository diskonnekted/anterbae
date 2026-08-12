'use client'

import { useState, useEffect } from 'react'
import { getCourierByPhone, updateOrderStatus, updateCourierLocation } from '@/app/actions/courier-portal'
import { 
  Truck, 
  Phone, 
  Lock, 
  ArrowRight, 
  Loader2, 
  LogOut, 
  Package, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Compass,
  CheckCircle2,
  Map,
  BadgeAlert,
  ChevronRight,
  ShieldCheck,
  CircleDot
} from 'lucide-react'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'accepted', label: 'Terima Tugas', icon: CheckCircle2, bg: 'bg-indigo-600' },
  { value: 'picking_up', label: 'Menuju Resto/Toko', icon: Clock, bg: 'bg-amber-600' },
  { value: 'picked_up', label: 'Bawa Makanan/Barang', icon: Package, bg: 'bg-sky-600' },
  { value: 'delivering', label: 'Mulai Pengantaran', icon: Truck, bg: 'bg-orange-600' },
  { value: 'delivered', label: 'Sampai di Tujuan', icon: MapPin, bg: 'bg-teal-600' },
  { value: 'completed', label: 'Selesai & Lunas', icon: CheckCircle, bg: 'bg-emerald-600' },
  { value: 'problem', label: 'Laporkan Kendala', icon: AlertCircle, bg: 'bg-rose-600' },
]

const STATUS_THEMES: Record<string, { bg: string, text: string, dot: string, border: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500', border: 'border-amber-100' },
  accepted: { bg: 'bg-indigo-50', text: 'text-indigo-800', dot: 'bg-indigo-500', border: 'border-indigo-100' },
  picking_up: { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500', border: 'border-amber-100' },
  picked_up: { bg: 'bg-sky-50', text: 'text-sky-800', dot: 'bg-sky-500', border: 'border-sky-100' },
  delivering: { bg: 'bg-orange-50', text: 'text-orange-800', dot: 'bg-orange-500', border: 'border-orange-100' },
  delivered: { bg: 'bg-teal-50', text: 'text-teal-800', dot: 'bg-teal-500', border: 'border-teal-100' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500', border: 'border-emerald-100' },
  problem: { bg: 'bg-rose-50', text: 'text-rose-800', dot: 'bg-rose-500', border: 'border-rose-100' },
}

const ORDER_ICONS: Record<string, string> = {
  food: '🍕',
  parcel: '📦',
  jastip: '🛍️',
}

export default function KurirPortalPage() {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courierData, setCourierData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'tracking' | 'error' | 'denied' | 'idle'>('idle')

  // Live Geolocation Tracking
  useEffect(() => {
    if (!courierData) return

    if (!('geolocation' in navigator)) {
      console.warn('Geolocation tidak didukung oleh browser ini.')
      setGpsStatus('error')
      return
    }

    setGpsStatus('tracking')
    let lastSentTime = 0
    
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const now = Date.now()
        
        // Throttling: send location update every 30 seconds
        if (now - lastSentTime > 30000) {
          lastSentTime = now
          console.log(`Mengirim lokasi GPS kurir: ${latitude}, ${longitude}`)
          await updateCourierLocation(courierData._id, latitude, longitude)
        }
      },
      (error) => {
        console.error('Error tracking geolocation:', error)
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('denied')
        } else {
          setGpsStatus('error')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [courierData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let formattedPhone = phone.trim()
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1)
    }

    const res = await getCourierByPhone(formattedPhone, pin)
    if (res.success && res.data) {
      setCourierData(res.data.courier)
      setOrders(res.data.orders || [])
    } else {
      setError(res.error || 'Nomor HP atau PIN salah.')
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
    setGpsStatus('idle')
  }

  // === DASHBOARD VIEW ===
  if (courierData) {
    const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))
    const completedOrders = orders.filter(o => o.status === 'completed')

    return (
      <div className="min-h-screen bg-slate-100 pb-32 font-sans selection:bg-red-500 selection:text-white">
        {/* Top Header Card */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[4rem] shadow-2xl relative">
          {/* Subtle design elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto max-w-md">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-red-500/20 border border-white/10 active:scale-95 transition-transform duration-200">
                  🛵
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-tight">{courierData.name}</h1>
                  <p className="text-slate-400 text-sm font-extrabold tracking-wide mt-1 uppercase">
                    {courierData.vehiclePlate || 'PLAT MOTOR N/A'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-2xl active:scale-90 transition-all border border-slate-700/40 shadow-lg"
              >
                <LogOut className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-3 gap-3.5 bg-slate-900/60 p-2.5 rounded-[2.25rem] border border-slate-800/80 shadow-2xl backdrop-blur-md">
              <div className="bg-slate-800/40 rounded-2xl py-3.5 text-center border border-slate-800/30">
                <div className="text-2xl font-black text-white leading-none">{activeOrders.length}</div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">Tugas</div>
              </div>
              <div className="bg-slate-800/40 rounded-2xl py-3.5 text-center border border-slate-800/30">
                <div className="text-2xl font-black text-white leading-none">{completedOrders.length}</div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">Selesai</div>
              </div>
              <div className={`rounded-2xl py-3.5 text-center border transition-all duration-300 flex flex-col items-center justify-center ${
                gpsStatus === 'tracking' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <div className="flex items-center justify-center gap-1.5">
                  <Compass className={`w-4 h-4 ${gpsStatus === 'tracking' ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                  <span className="text-[11px] font-black tracking-widest">LIVE</span>
                </div>
                <div className="text-[9px] font-extrabold uppercase tracking-widest mt-1.5 text-slate-300">
                  {gpsStatus === 'tracking' ? 'GPS AKTIF' : 'GPS MATI'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Cards Section */}
        <div className="container mx-auto px-4 max-w-md -mt-14 relative z-10">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4 px-3 text-slate-900">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <CircleDot className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              Daftar Kiriman Aktif ({activeOrders.length})
            </span>
            <span className="text-xs bg-slate-200 text-slate-800 px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
              Hari Ini
            </span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl border border-slate-200/40 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner border border-slate-100">
                🎉
              </div>
              <h3 className="font-black text-slate-800 text-lg leading-tight">Kerjaan Beres Semua!</h3>
              <p className="text-slate-500 text-sm font-bold mt-2 px-3 leading-relaxed">
                Belum ada tugas pesanan baru untuk Anda. Silakan standby atau hubungi admin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeOrders.map((order) => {
                const theme = STATUS_THEMES[order.status] || STATUS_THEMES.pending
                return (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-[3rem] border border-slate-200/40 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-6 space-y-5 transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Active/Status Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-3 ${theme.dot}`} />

                    {/* Order Number & Status Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-slate-950 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black tracking-widest shadow-md">
                          {order.orderNumber}
                        </span>
                        <span className="text-2xl" title={order.orderType}>
                          {ORDER_ICONS[order.orderType] || '📦'}
                        </span>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${theme.bg} ${theme.text} ${theme.border} shadow-sm`}>
                        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        {order.status}
                      </div>
                    </div>

                    {/* Customer Profile Box (Highlight Readability) */}
                    <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 flex items-center justify-between shadow-inner">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Penerima / Pembeli</span>
                        <h4 className="text-base font-black text-slate-900 leading-snug">{order.customerName}</h4>
                        <p className="text-xs text-slate-500 font-extrabold mt-1 tracking-wider">{order.customerPhone}</p>
                      </div>
                      
                      <a
                        href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl active:scale-90 transition-all shadow-lg shadow-emerald-600/20"
                        title="Hubungi Pembeli"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                    </div>

                    {/* Items List Box (Highlight Readability) */}
                    <div className="bg-slate-50/70 rounded-[2rem] p-5 border border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Item Belanjaan</span>
                      <p className="text-sm font-bold text-slate-800 whitespace-pre-line leading-relaxed pl-1">
                        {order.items}
                      </p>
                    </div>

                    {/* Elegant Pickup & Delivery Timeline */}
                    <div className="relative pl-8 space-y-6 py-2">
                      {/* Dashed separator line */}
                      <div className="absolute left-3 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-slate-200" />

                      {/* Pickup Point */}
                      {order.pickupAddress && (
                        <div className="relative">
                          {/* Dot marker */}
                          <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-md" />
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Titik Ambil (Pickup)</span>
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-emerald-100/60 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50 px-2.5 py-0.5 rounded-lg transition-colors"
                              >
                                <Map className="w-3 h-3" /> Navigasi Map
                              </a>
                            </div>
                            <p className="text-sm font-black text-slate-800 leading-snug">{order.pickupAddress}</p>
                            {order.merchant?.name && (
                              <p className="text-xs text-slate-500 font-bold">🏪 Toko: {order.merchant.name}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Delivery Point */}
                      <div className="relative">
                        {/* Dot marker */}
                        <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md" />
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Alamat Kirim (Tujuan)</span>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-red-100/60 hover:bg-red-100 text-red-800 border border-red-200/50 px-2.5 py-0.5 rounded-lg transition-colors"
                            >
                              <Map className="w-3 h-3" /> Navigasi Map
                            </a>
                          </div>
                          <p className="text-sm font-black text-slate-800 leading-snug">
                            {order.deliveryAddress}
                          </p>
                          {order.deliveryArea && (
                            <span className="inline-block text-[9px] font-black text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider mt-1">
                              Kecamatan: {order.deliveryArea}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Courier Notes */}
                    {order.courierNotes && (
                      <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4 text-xs font-bold text-amber-900 leading-relaxed flex items-start gap-2.5">
                        <span className="text-base">📝</span>
                        <div>
                          <span className="font-black text-amber-950 uppercase tracking-wider block mb-0.5">Catatan Admin</span>
                          {order.courierNotes}
                        </div>
                      </div>
                    )}

                    {/* Pricing info bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs font-bold">
                      <span className="bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl uppercase font-black tracking-widest">
                        {order.paymentMethod === 'cod' ? '💵 COD / Cash' : '💳 Transfer Bank'}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wide">Upah Ongkir</span>
                        <strong className="text-red-600 font-black text-base">Rp{order.shippingFee?.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    {/* Interactive Action Panel */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pl-1">Update Status Tugas</span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {STATUS_OPTIONS.filter(s => {
                          const statusOrder = ['pending', 'accepted', 'picking_up', 'picked_up', 'delivering', 'delivered', 'completed']
                          const currentIdx = statusOrder.indexOf(order.status)
                          const optionIdx = statusOrder.indexOf(s.value)
                          return s.value === 'problem' || optionIdx > currentIdx
                        }).slice(0, 4).map((s) => {
                          const ButtonIcon = s.icon
                          return (
                            <button
                              key={s.value}
                              onClick={() => handleUpdateStatus(order._id, s.value)}
                              disabled={updating === order._id}
                              className={`flex items-center justify-center gap-2 py-3.5 rounded-[1.25rem] font-black text-xs transition-all active:scale-[0.97] uppercase tracking-wider ${
                                s.value === 'problem'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : `${s.bg} text-white hover:opacity-95 shadow-md shadow-slate-900/10`
                              } disabled:opacity-50`}
                            >
                              {updating === order._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <ButtonIcon className="w-4 h-4 flex-shrink-0" />
                                  <span>{s.label}</span>
                                </>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // === LOGIN VIEW ===
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans selection:bg-red-500 selection:text-white">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-slate-200/50 overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-56 h-56 bg-red-500/10 rounded-full blur-[70px] -ml-28 -mt-28 pointer-events-none" />

        {/* Header Block */}
        <div className="bg-slate-950 px-8 pt-14 pb-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-[60px] -mr-16 -mb-16" />
          
          <img 
            src="/anterbae.gif" 
            alt="Logo Anterbae" 
            className="w-24 h-auto mx-auto mb-4 object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
            onError={(e) => {
              e.currentTarget.src = "/anterbae.png"
            }}
          />
          <h1 className="text-2xl font-black text-white tracking-tight leading-none">Portal Mitra Kurir</h1>
          <p className="text-red-500 font-extrabold mt-2 text-[10px] uppercase tracking-[0.25em]">Anterbae Delivery Service</p>
        </div>

        {/* Input Form */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1.5">
                Nomor WhatsApp Kurir
              </label>
              <input
                required 
                type="tel"
                placeholder="Contoh: 08139135749"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none font-bold text-slate-800 text-sm transition-all shadow-inner placeholder-slate-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1.5">
                PIN Akses Portal
              </label>
              <input
                required 
                type="password"
                maxLength={6}
                placeholder="••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none font-black text-slate-800 tracking-[0.5em] text-sm transition-all shadow-inner placeholder-slate-400"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-950 text-white font-black py-4.5 rounded-2xl shadow-xl hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-3 group uppercase tracking-wider text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  <span>Masuk Portal Mitra</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center border-t border-slate-100 pt-6">
            <Link
              href="/register-courier"
              className="text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
            >
              Belum jadi mitra? Daftar Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
