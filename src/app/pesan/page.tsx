'use client'

import { useState } from 'react'
import { Truck, Package, ShoppingBag, Phone, MapPin, FileText, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const ORDER_TYPES = [
  { value: 'food', icon: '🍔', label: 'Pesan Antar Makanan', desc: 'Antar dari warung/resto ke lokasi Anda' },
  { value: 'parcel', icon: '📦', label: 'Antar Paket & Barang', desc: 'Kirim barang ke tujuan dalam Banjarnegara' },
  { value: 'jastip', icon: '🛒', label: 'Jastip (Titip Beli)', desc: 'Titip beli ke pasar, minimarket, dll' },
]

export default function PesanPage() {
  const [step, setStep] = useState(1)
  const [orderType, setOrderType] = useState('food')
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    merchantName: '',
    items: '',
    pickupAddress: '',
    deliveryAddress: '',
    deliveryArea: '',
    customerNotes: '',
    paymentMethod: 'cod',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmitViaWA = () => {
    setLoading(true)
    const typeLabel = ORDER_TYPES.find(t => t.value === orderType)?.label || orderType
    const message = encodeURIComponent(
      `*PESANAN ANTERBAE*\n\n` +
      `Jenis: ${typeLabel}\n` +
      `Nama: ${formData.customerName}\n` +
      `WA: ${formData.customerPhone}\n` +
      (formData.merchantName ? `Merchant/Toko: ${formData.merchantName}\n` : '') +
      `\nDetail Pesanan:\n${formData.items}\n` +
      `\nPickup: ${formData.pickupAddress}\n` +
      `Tujuan: ${formData.deliveryAddress}` +
      (formData.deliveryArea ? `, ${formData.deliveryArea}` : '') + '\n' +
      (formData.customerNotes ? `\nCatatan: ${formData.customerNotes}\n` : '') +
      `\nPembayaran: ${formData.paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'Transfer/QRIS'}`
    )
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      window.open(`https://wa.me/6281234567890?text=${message}`, '_blank')
    }, 800)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Pesanan Terkirim! 🎉</h2>
          <p className="text-slate-500 font-medium mb-8">
            Pesanan Anda sudah dikirim ke admin Anterbae via WhatsApp. Admin akan segera konfirmasi dan assign kurir.
          </p>
          <div className="space-y-3">
            <Link href="/track" className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 transition-all text-center">
              📍 Lacak Pesanan
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1) }} className="block w-full bg-slate-100 text-slate-700 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-center">
              Pesan Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Pesan <span className="text-red-600">Anterbae</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Isi form atau langsung WA kami</p>
          </div>

          {/* Direct WA Button */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 mb-6 text-lg active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat WhatsApp Langsung (Paling Cepat)
          </a>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">atau isi form</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8">
            {/* Step 1: Order Type */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Jenis Pesanan</label>
              <div className="space-y-2">
                {ORDER_TYPES.map(type => (
                  <label key={type.value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    orderType === type.value ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-slate-200'
                  }`}>
                    <input type="radio" name="orderType" value={type.value} className="hidden"
                      checked={orderType === type.value} onChange={() => setOrderType(type.value)} />
                    <div className="text-2xl">{type.icon}</div>
                    <div>
                      <div className={`font-black text-sm ${orderType === type.value ? 'text-red-700' : 'text-slate-900'}`}>{type.label}</div>
                      <div className="text-xs text-slate-400 font-medium">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Anda *</label>
                <input required name="customerName" type="text" placeholder="Nama lengkap"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={formData.customerName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">WhatsApp Anda *</label>
                <input required name="customerPhone" type="tel" placeholder="08xxxxxxxxxx"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={formData.customerPhone} onChange={handleChange} />
              </div>
            </div>

            {/* Merchant (if food/jastip) */}
            {(orderType === 'food' || orderType === 'jastip') && (
              <div className="mb-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  {orderType === 'food' ? 'Nama Warung/Resto' : 'Toko Tujuan Belanja'}
                </label>
                <input name="merchantName" type="text"
                  placeholder={orderType === 'food' ? 'Warung Bu Sari, Bakso Pak Joko...' : 'Pasar Banjarnegara, Alfamart...'}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={formData.merchantName} onChange={handleChange} />
              </div>
            )}

            {/* Items */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                {orderType === 'food' ? 'Detail Menu yang Dipesan *' : orderType === 'parcel' ? 'Deskripsi Barang *' : 'Daftar Belanjaan *'}
              </label>
              <textarea required name="items" rows={4}
                placeholder={
                  orderType === 'food' ? '1x Nasi Goreng\n1x Es Teh\n...' :
                  orderType === 'parcel' ? 'Paket dokumen, berat ±500gr...' :
                  '2 kg beras\n1 liter minyak\n...'
                }
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 resize-none"
                value={formData.items} onChange={handleChange} />
            </div>

            {/* Pickup Address */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                {orderType === 'parcel' ? 'Alamat Pengirim *' : 'Alamat Pickup (Warung/Toko) *'}
              </label>
              <input required name="pickupAddress" type="text"
                placeholder="Alamat lengkap tempat kurir pickup"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                value={formData.pickupAddress} onChange={handleChange} />
            </div>

            {/* Delivery Address */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Tujuan *</label>
              <input required name="deliveryAddress" type="text"
                placeholder="Alamat lengkap tujuan pengiriman"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                value={formData.deliveryAddress} onChange={handleChange} />
              <select name="deliveryArea"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 mt-2"
                value={formData.deliveryArea} onChange={handleChange}>
                <option value="">Pilih kecamatan tujuan...</option>
                {['Banjarnegara', 'Purwonegoro', 'Bawang', 'Banjarmangu', 'Mandiraja', 'Purworejo Klampok', 'Sigaluh', 'Wanadadi', 'Rakit', 'Susukan', 'Lainnya'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Notes & Payment */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Catatan (opsional)</label>
                <input name="customerNotes" type="text"
                  placeholder="Misal: hubungi dulu sebelum datang, titip ke satpam, dll"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={formData.customerNotes} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Metode Pembayaran</label>
                <div className="flex gap-3">
                  {[{ value: 'cod', label: '💵 COD' }, { value: 'transfer', label: '💳 Transfer' }].map(({ value, label }) => (
                    <label key={value} className={`flex-1 flex items-center justify-center py-3 rounded-2xl border-2 cursor-pointer font-black text-sm transition-all ${
                      formData.paymentMethod === value ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}>
                      <input type="radio" name="paymentMethod" value={value} className="hidden"
                        onChange={handleChange} checked={formData.paymentMethod === value} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitViaWA}
              disabled={loading || !formData.customerName || !formData.customerPhone || !formData.items}
              className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-red-700 text-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <span>Kirim Pesanan via WhatsApp</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
