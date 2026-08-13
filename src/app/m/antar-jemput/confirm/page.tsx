'use client'

import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order') || ''
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!orderNumber) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/antar-jemput/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber }),
      })

      const data = await response.json()
      if (data.success) {
        setConfirmed(true)
      } else {
        setError(data.error || 'Gagal konfirmasi')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Konfirmasi Berhasil!</h1>
          <p className="text-sm text-gray-500 mb-6">Pengantaran pesanan {orderNumber} sudah dikonfirmasi.</p>
          <p className="text-xs text-gray-400 mb-6">Terima kasih telah menggunakan Anterbae! 🙏</p>
          <Link href="/m" className="inline-block bg-red-600 text-white font-black px-6 py-3 rounded-xl active:scale-95 transition-transform">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-black text-gray-900">Konfirmasi Pengantaran</h1>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-2">Pesanan {orderNumber}</h2>
          <p className="text-sm text-gray-500 mb-6">Apakah Anda sudah sampai di tujuan dengan aman?</p>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-green-600 text-white font-black py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-white/30 rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Ya, Saya Sudah Sampai
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600 font-bold">{error}</p>
            </div>
          )}

          <Link href="/m" className="block mt-4 text-sm text-gray-400 font-bold text-center">
            Batal
          </Link>
        </div>
      </div>
    </div>
  )
}
