'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Phone, ArrowLeft, Loader2, UserCheck, ShieldAlert, ExternalLink } from 'lucide-react'
import { processOrderLinkAction, getOrderByNumber } from '@/app/actions/link-actions'
import Link from 'next/link'

export default function AdminOrderActionPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const action = searchParams.get('action')
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    if (!orderNumber || !action) {
      setError('Parameter tautan tidak valid.')
      setLoading(false)
      return
    }

    async function handleLoad() {
      // 1. Fetch order details first
      const res = await getOrderByNumber(orderNumber!)
      if (res.success && res.data) {
        setOrder(res.data)
      } else {
        setError(res.error || 'Gagal mengambil data pesanan.')
        setLoading(false)
        return
      }

      // 2. Perform actions on mount except for 'reject' (needs input)
      if (action === 'accept') {
        const updateRes = await processOrderLinkAction(orderNumber!, 'accept')
        if (updateRes.success) {
          setSuccess(true)
        } else {
          setError(updateRes.error || 'Gagal memproses terima pesanan.')
        }
        setLoading(false)
      } else if (action === 'courier-wa') {
        setLoading(false)
      } else if (action === 'reject') {
        setLoading(false)
      }
    }

    handleLoad()
  }, [orderNumber, action])

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectionReason.trim()) {
      alert('Mohon masukkan alasan penolakan pesanan.')
      return
    }

    setRejecting(true)
    const updateRes = await processOrderLinkAction(orderNumber!, 'reject', { reason: rejectionReason.trim() })
    if (updateRes.success) {
      setSuccess(true)
    } else {
      setError(updateRes.error || 'Gagal memproses penolakan pesanan.')
    }
    setRejecting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto" />
          <h2 className="text-lg font-black text-slate-800">Menghubungkan ke Database...</h2>
          <p className="text-xs text-slate-400 font-bold">Mengautentikasi tindakan admin Anterbae.</p>
        </div>
      </div>
    )
  }

  // === RENDER ERROR ===
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 mb-6">
            <ShieldAlert className="w-10 h-10 text-rose-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Tindakan Gagal</h2>
          <p className="text-sm text-rose-600 font-bold mb-6">{error}</p>
          <Link href="/admin" className="block w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider active:scale-95 transition-transform">
            Buka Dasbor Admin
          </Link>
        </div>
      </div>
    )
  }

  // === COURIER WA LINK ACTION ===
  if (action === 'courier-wa' && order) {
    const courier = order.courier
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center relative overflow-hidden">
          {courier ? (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto border border-orange-100 shadow-inner">
                <UserCheck className="w-10 h-10 text-orange-600" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kurir Bertugas</span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{courier.name}</h2>
                <p className="text-xs text-slate-500 font-bold">{courier.phone}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p><strong>Order ID:</strong> {order.orderNumber}</p>
                {order.restaurantName && <p><strong>Restoran:</strong> {order.restaurantName}</p>}
                <p><strong>Total Kirim:</strong> Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
              </div>

              <a
                href={`https://wa.me/${courier.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider active:scale-95 transition-transform shadow-lg shadow-emerald-600/10"
              >
                <Phone className="w-4 h-4" /> Hubungi Kurir via WA <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link href="/admin" className="block w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform">
                Buka Dasbor Admin
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-inner">
                <ShieldAlert className="w-10 h-10 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">Kurir Belum Ditunjuk</h2>
                <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
                  Pesanan <span className="font-extrabold text-slate-700">{orderNumber}</span> saat ini belum ditunjuk kurir pengantar oleh admin.
                </p>
              </div>

              <Link href={`/admin`} className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform shadow-md shadow-orange-600/15">
                Tunjuk Kurir Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // === REJECT ORDER VIEW ===
  if (action === 'reject' && !success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-md w-full relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 mb-4">
              <XCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Tolak Pesanan {orderNumber}</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Alasan penolakan akan dikirimkan langsung ke WhatsApp pembeli.</p>
          </div>

          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1.5">Alasan Penolakan</label>
              <textarea
                required
                rows={3}
                placeholder="Contoh: Stok menu habis / Toko sudah tutup / Jarak di luar jangkauan"
                className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-bold text-slate-800 text-sm transition-all shadow-inner placeholder-slate-400 resize-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={rejecting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4.5 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
            >
              {rejecting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                'Tolak & Kirim Notifikasi WA'
              )}
            </button>
            
            <Link href="/admin" className="block w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform">
              Batalkan
            </Link>
          </form>
        </div>
      </div>
    )
  }

  // === GENERAL SUCCESS VIEW ===
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">Tindakan Berhasil</h2>
        <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed mb-6">
          Pesanan <span className="font-extrabold text-slate-700">{orderNumber}</span> telah berhasil **{
            action === 'accept' ? 'Diterima & Disetujui' : 'Dibatalkan/Ditolak'
          }** di database Anterbae.
        </p>

        <Link href="/admin" className="block w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform shadow-lg">
          Buka Dasbor Admin
        </Link>
      </div>
    </div>
  )
}
