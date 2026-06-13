'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Truck, User, Phone, MapPin, Car, CreditCard, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'

export default function RegisterCourierPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
    vehicleType: 'motor',
    vehiclePlate: '',
    ktpNumber: '',
    motivation: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // WhatsApp message approach
    const message = encodeURIComponent(
      `*PENDAFTARAN KURIR ANTERBAE*\n\n` +
      `Nama: ${formData.name}\n` +
      `No. WA: ${formData.phone}\n` +
      `Alamat: ${formData.address}\n` +
      `Area: ${formData.area}\n` +
      `Kendaraan: ${formData.vehicleType}\n` +
      `Plat: ${formData.vehiclePlate}\n` +
      `KTP: ${formData.ktpNumber}\n` +
      `Motivasi: ${formData.motivation}`
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
            Data Anda sudah dikirim ke admin Anterbae via WhatsApp. Tim kami akan menghubungi Anda dalam 1x24 jam.
          </p>
          <a
            href="/"
            className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 transition-all active:scale-95 text-center"
          >
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
            <div className="inline-flex w-20 h-20 bg-red-600 rounded-3xl items-center justify-center text-4xl mb-5 shadow-xl shadow-red-200">
              🛵
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Daftar Jadi Mitra Kurir
            </h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Bergabung dengan tim kurir Anterbae. Penghasilan tambahan, jam kerja fleksibel!
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '💰', label: 'Penghasilan Menarik' },
              { icon: '⏰', label: 'Jam Fleksibel' },
              { icon: '🤝', label: 'Tim Solid' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-black text-slate-600">{label}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="name" type="text"
                    placeholder="Nama sesuai KTP"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Nomor WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="phone" type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Alamat Domisili *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="address" type="text"
                    placeholder="Desa/Kelurahan, Kecamatan"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Area preference */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Area yang Diminati
                </label>
                <select
                  name="area"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                  value={formData.area}
                  onChange={handleChange}
                >
                  <option value="">Pilih kecamatan...</option>
                  {['Banjarnegara', 'Purwonegoro', 'Bawang', 'Banjarmangu', 'Mandiraja', 'Purworejo Klampok', 'Sigaluh', 'Wanadadi', 'Rakit', 'Susukan', 'Lainnya'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Jenis Kendaraan *
                  </label>
                  <div className="flex gap-3">
                    {[{ value: 'motor', label: '🏍️ Motor' }, { value: 'mobil', label: '🚗 Mobil' }].map(({ value, label }) => (
                      <label key={value} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 cursor-pointer font-bold text-sm transition-all ${
                        formData.vehicleType === value ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}>
                        <input type="radio" name="vehicleType" value={value} className="hidden" onChange={handleChange} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Nomor Plat *
                  </label>
                  <input
                    required name="vehiclePlate" type="text"
                    placeholder="AB 1234 CD"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                    value={formData.vehiclePlate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* KTP */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Nomor KTP *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <input
                    required name="ktpNumber" type="text"
                    placeholder="16 digit NIK"
                    maxLength={16}
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900"
                    value={formData.ktpNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Motivasi Bergabung
                </label>
                <textarea
                  name="motivation" rows={3}
                  placeholder="Ceritakan mengapa Anda ingin bergabung sebagai kurir Anterbae..."
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 resize-none"
                  value={formData.motivation}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-red-700 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Kirim Pendaftaran via WhatsApp</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 font-medium">
                Dengan mendaftar, Anda setuju dengan syarat & ketentuan mitra kurir Anterbae
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
