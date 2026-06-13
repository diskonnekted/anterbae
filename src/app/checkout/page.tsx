'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { createDeliveryOrder } from '@/app/actions/delivery-order'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, MessageCircle } from 'lucide-react'
import { OrderFormData } from '@/types'

export default function CheckoutPage() {
  const { items, totalPrice, shippingFee, grandTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderInfo, setOrderInfo] = useState<{ orderNumber: string } | null>(null)
  
  // Settings untuk link wa
  const [adminPhone, setAdminPhone] = useState('6281234567890') // Default

  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  })

  useEffect(() => {
    // Load existing profile from localStorage
    const savedName = localStorage.getItem('anterbae-customer-name')
    const savedPhone = localStorage.getItem('anterbae-customer-phone')
    const savedAddress = localStorage.getItem('anterbae-customer-address')
    
    if (savedName) setFormData(prev => ({ ...prev, name: savedName }))
    if (savedPhone) setFormData(prev => ({ ...prev, phone: savedPhone }))
    if (savedAddress) setFormData(prev => ({ ...prev, address: savedAddress }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Save profile
    localStorage.setItem('anterbae-customer-name', formData.name)
    localStorage.setItem('anterbae-customer-phone', formData.phone)
    localStorage.setItem('anterbae-customer-address', formData.address)

    const itemsString = items.map(i => `${i.quantity}x ${i.name} (Rp ${i.price.toLocaleString('id-ID')})`).join('\n')
    const merchantNames = Array.from(new Set(items.map(i => i.vendorName || 'Toko'))).join(', ')

    // 1. Create Anterbae Delivery Order
    const result = await createDeliveryOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      orderType: 'food',
      merchantName: merchantNames,
      items: itemsString,
      pickupAddress: merchantNames,
      deliveryAddress: formData.address,
      paymentMethod: formData.paymentMethod === 'cod' ? 'cod' : 'transfer'
    })

    if (result.success && result.data?.orderNumber) {
      setOrderInfo({ orderNumber: result.data.orderNumber })
      setSuccess(true)
      
      const adminTargetPhone = result.data.adminPhone || adminPhone
      
      // 2. Redirect to WA
      let text = `Halo Admin *Anterbae* 🛵,\n\n`
      text += `Saya ingin memesan dari marketplace:\n\n`
      text += `*Kode Pesanan:* ${result.data.orderNumber}\n`
      text += `*Nama:* ${formData.name}\n`
      text += `*No. WA:* ${formData.phone}\n`
      text += `*Alamat Pengiriman:* ${formData.address}\n\n`
      text += `*Detail Pesanan:*\n${itemsString}\n\n`
      text += `*Subtotal:* Rp ${totalPrice.toLocaleString('id-ID')}\n`
      text += `*Estimasi Ongkir:* Rp ${shippingFee.toLocaleString('id-ID')}\n`
      text += `*Total Pembayaran:* Rp ${grandTotal.toLocaleString('id-ID')}\n`
      text += `*Metode Pembayaran:* ${formData.paymentMethod === 'cod' ? 'Bayar di Tempat (COD)' : 'Transfer/QRIS'}\n\n`
      text += `Mohon segera diproses dan dicarikan kurir. Terima kasih!`

      const waLink = `https://wa.me/${adminTargetPhone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
      
      // Buka tab WA
      window.open(waLink, '_blank')
      clearCart()
    } else {
      alert(result.error || 'Terjadi kesalahan.')
    }
    setLoading(false)
  }

  if (items.length === 0 && !success) {
    router.push('/cart')
    return null
  }

  if (success && orderInfo) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm inline-block max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Dibuat!</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih, <strong>{formData.name}</strong>. Pesanan <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderInfo.orderNumber}</span> telah direkam ke sistem.
          </p>
          
          <div className="bg-green-50 p-6 rounded-2xl mb-8 text-left text-sm text-green-800">
            <p className="font-bold mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Lanjutkan di WhatsApp
            </p>
            <p className="mb-0 text-xs leading-relaxed">
              Pesanan Anda akan segera diproses setelah Anda mengirimkan pesan ke WhatsApp Admin Anterbae.
            </p>
          </div>

          <button 
            onClick={() => router.push('/track')}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors"
          >
            Lacak Pesanan Saya
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Informasi Pengiriman</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                required
                type="text"
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="Contoh: Pak Slamet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
              <input
                required
                type="tel"
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea
                required
                rows={3}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="Alamat pengiriman di area Banjarnegara"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-bold text-gray-700 mb-3">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.paymentMethod === 'cod' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}
                >
                  <span className="font-bold text-center">Bayar di Tempat</span>
                  <span className="text-xs opacity-70">Tunai ke Kurir (COD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'qris' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.paymentMethod === 'qris' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}
                >
                  <span className="font-bold text-center">Transfer / QRIS</span>
                  <span className="text-xs opacity-70 text-center">Instruksi via WA</span>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pesan via WhatsApp'}
            </button>
          </form>
        </div>

        {/* Order Review */}
        <div>
          <h2 className="text-xl font-bold mb-6">Tinjau Pesanan</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-gray-800">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Subtotal Produk</span>
                <span className="font-bold text-gray-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Estimasi Ongkos Kirim</span>
                <span className="font-bold text-gray-900">Rp {shippingFee.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total Pembayaran</span>
              <span className="text-2xl font-black text-green-700">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-yellow-50 p-4 rounded-2xl text-xs text-yellow-800 flex items-start gap-2">
              <span className="font-bold text-lg leading-none">!</span>
              <p>
                Admin Anterbae akan mengonfirmasi total biaya termasuk ongkos kirim pasti melalui pesan WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
