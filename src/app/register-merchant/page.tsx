'use client'

import { useState } from 'react'
import { User, Phone, MapPin, ChevronRight, CheckCircle, Loader2, Clock, Globe } from 'lucide-react'

export default function RegisterMerchantPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
    category: 'food',
    openHours: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const message = encodeURIComponent(
      `*PENDAFTARAN MERCHANT ANTERBAE*\n\n` +
      `Nama Toko: ${formData.name}\n` +
      `No. WA: ${formData.phone}\n` +
      `Alamat: ${formData.address}\n` +
      `Kecamatan: ${formData.area}\n` +
      `Kategori: ${formData.category}\n` +
      `Jam Buka: ${formData.openHours}\n` +
      `Deskripsi: ${formData.description}`
    )

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      window.open(`https://wa.me/6281234567890?text=${message}`, '_blank')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-xl border border-green-100 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Pendaftaran Terkirim! 🎉</h2>
          <p className="text-slate-500 font-medium mb-8">
            Data toko Anda sudah dikirim ke admin Anterbae via WhatsApp. Tim kami akan menghubungi dalam 1x24 jam.
          </p>
          <a href="/" className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 transition-all text-center">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 bg-green-600 rounded-3xl items-center justify-center text-4xl mb-5 shadow-xl shadow-green-200">
              🏪
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Daftar Jadi Mitra Merchant
            </h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Jangkau lebih banyak pelanggan dengan bergabung sebagai mitra merchant Anterbae. Gratis!
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '👥', label: 'Lebih Banyak Pelanggan' },
              { icon: '🆓', label: 'Gratis Daftar' },
              { icon: '📱', label: 'Promosi Digital' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-black text-slate-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Toko / Warung *</label>
                <div className="relative">
                  <Globe className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="name" type="text"
                    placeholder="Warung Bu Sari, Bakso Pak Joko, dll"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nomor WhatsApp Toko *</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="phone" type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Toko *</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="address" type="text"
                    placeholder="Jl. ... No. ..., Desa/Kel."
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Area & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kecamatan *</label>
                  <select
                    required name="area"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.area}
                    onChange={handleChange}
                  >
                    <option value="">Pilih...</option>
                    {['Banjarnegara', 'Purwonegoro', 'Bawang', 'Banjarmangu', 'Mandiraja', 'Purworejo Klampok', 'Sigaluh', 'Wanadadi', 'Lainnya'].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kategori *</label>
                  <select
                    name="category"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="food">🍔 Makanan & Minuman</option>
                    <option value="grocery">🛒 Grocery / Sembako</option>
                    <option value="health">💊 Apotek / Kesehatan</option>
                    <option value="other">🏪 Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Open Hours */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Jam Operasional</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    name="openHours" type="text"
                    placeholder="Misal: 07.00 - 21.00 WIB"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900"
                    value={formData.openHours}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi Toko</label>
                <textarea
                  name="description" rows={3}
                  placeholder="Ceritakan menu unggulan, keistimewaan toko Anda..."
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-900 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-green-700 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Kirim via WhatsApp</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 font-medium">
                Pendaftaran 100% gratis. Kami akan verifikasi toko Anda terlebih dahulu.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
