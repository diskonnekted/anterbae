'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOrder } from '@/app/actions/buyer-order'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface Props {
  orderId: string
  isService: boolean
}

export default function CompleteOrderButton({ orderId, isService }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    if (!confirm(isService 
      ? "Apakah Anda yakin layanan jasa ini telah selesai dikerjakan dengan baik?" 
      : "Apakah Anda yakin pesanan telah diterima dengan baik?"
    )) {
      return
    }

    setLoading(true)
    const res = await completeOrder(orderId)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <>
          <CheckCircle2 className="w-6 h-6" />
          <span>Konfirmasi {isService ? 'Layanan Selesai' : 'Pesanan Diterima'}</span>
        </>
      )}
    </button>
  )
}
