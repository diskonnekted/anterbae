'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, AlertTriangle, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { processOrderLinkAction, getOrderByNumber } from '@/app/actions/link-actions'
import Link from 'next/link'

export default function OrderActionPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || searchParams.get('o')
  const action = searchParams.get('action') || searchParams.get('a')

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderNumber || !action) {
      setError('Parameter tautan tidak valid.')
      setLoading(false)
      return
    }

    async function triggerAction() {
      // 1. Fetch order details
      const fetchRes = await getOrderByNumber(orderNumber!)
      if (fetchRes.success && fetchRes.data) {
        setOrder(fetchRes.data)
      }

      // 2. Process status update
      const res = await processOrderLinkAction(orderNumber!, action!)
      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || 'Gagal memproses aksi.')
      }
      setLoading(false)
    }

    triggerAction()
  }, [orderNumber, action])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto" />
          <h2 className="text-lg font-black text-slate-800">Memproses Aksi Pesanan...</h2>
          <p className="text-xs text-slate-400 font-bold">Mohon tunggu sebentar selagi kami mengamankan status pesanan Anda.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Decorative Blur Accent */}
        <div className={`absolute top-0 left-0 w-44 h-44 rounded-full blur-[60px] -ml-20 -mt-20 pointer-events-none ${
          action === 'received' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`} />

        {success ? (
          <div className="space-y-6">
            {action === 'received' ? (
              <>
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Konfirmasi Diterima</h2>
                  <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
                    Terima kasih! Pesanan <span className="font-extrabold text-slate-700">{orderNumber}</span> telah ditandai sebagai **Selesai & Diterima** dengan sukses.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-inner">
                  <AlertTriangle className="w-10 h-10 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Kendala Dilaporkan</h2>
                  <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
                    Pesanan <span className="font-extrabold text-slate-700">{orderNumber}</span> telah ditandai dengan status **Kendala/Bermasalah**.
                  </p>
                  <p className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-100 rounded-xl p-3 mx-2 mt-3">
                    ⚠️ Admin Anterbae akan segera menghubungi Anda melalui nomor WhatsApp untuk membantu menyelesaikan kendala ini.
                  </p>
                </div>
              </>
            )}

            <div className="border-t border-slate-100 pt-6 mt-6 space-y-3">
              <a
                href="https://wa.me/6281328128315"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform shadow-md shadow-slate-900/10"
              >
                Tanya Admin di WhatsApp
              </a>
              <Link
                href="/"
                className="block w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Aksi Gagal</h2>
              <p className="text-sm text-rose-600 font-bold">{error || 'Terjadi kesalahan sistem.'}</p>
              <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">
                Pastikan nomor pesanan benar dan perangkat Anda terhubung dengan internet.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <Link
                href="/"
                className="block w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-center active:scale-95 transition-transform"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
