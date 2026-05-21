'use client'

import { ShoppingCart, Store } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const isVendorClosed = product.vendor?.isOpen === false

  if (isVendorClosed) {
    return (
      <div className="space-y-3 w-full">
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
          <Store className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-red-700 leading-relaxed">
            {product.vendor?.closingMessage || 'Maaf, toko sedang tutup sementara dan tidak dapat menerima pesanan.'}
          </p>
        </div>
        <button 
          disabled
          className="flex items-center justify-center gap-3 bg-slate-200 text-slate-400 font-black py-4 px-8 rounded-3xl w-full cursor-not-allowed"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>Toko Sedang Tutup</span>
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => addItem(product)}
      className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-3xl transition-all active:scale-95 shadow-xl shadow-green-600/30 w-full group"
    >
      <ShoppingCart className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      <span>Tambah ke Keranjang</span>
    </button>
  )
}
