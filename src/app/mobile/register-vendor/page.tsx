'use client'

import { useState } from 'react'
import { registerVendor } from '@/app/actions/vendor'
import { Store, Loader2, CheckCircle2, ChevronLeft, Upload, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function MobileRegisterVendorPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    const formData = new FormData(e.currentTarget)
    if (logoFile) {
      formData.set('logo', logoFile)
    }

    const res = await registerVendor(formData)
    
    if (res.success) {
      setSuccess(true)
    } else {
      setErrorMsg(res.error || 'Terjadi kesalahan')
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-green-600 text-white p-6 justify-center text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-900/20">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-black mb-4 leading-tight">Pendaftaran<br/>Berhasil!</h1>
        <p className="text-green-100 mb-10 text-sm font-medium leading-relaxed">
          Data usaha Anda telah masuk ke sistem. Silakan tunggu verifikasi dari Admin Desa melalui WhatsApp.
        </p>
        <Link 
          href="/" 
          className="w-full bg-white text-green-700 font-black py-4 rounded-2xl active:scale-95 transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 p-4 flex items-center gap-4">
        <Link href="/" className="p-2 rounded-xl bg-slate-50 text-slate-900 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-black text-slate-900">Daftar UMKM</h1>
      </header>

      <main className="flex-grow p-6 pb-12">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100/50">
            <Store className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Bergabunglah bersama ratusan UMKM Pondokrejo lainnya.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Logo Upload */}
          <div className="flex flex-col items-center mb-6">
            <label className="text-xs font-black text-slate-900 mb-2 block w-full text-center">Logo Usaha (Opsional)</label>
            <div 
              onClick={() => document.getElementById('logo-upload-mobile')?.click()}
              className="w-24 h-24 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative"
            >
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo" fill className="object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-[10px] font-bold text-slate-400">Upload</span>
                </>
              )}
              <input id="logo-upload-mobile" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="text-xs font-black text-slate-900 mb-2 block">Jenis Usaha</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="businessType" value="product" className="peer hidden" defaultChecked />
                <div className="p-3 border-2 border-slate-100 rounded-2xl text-center peer-checked:border-green-600 peer-checked:bg-green-50 transition-all">
                  <Store className="w-5 h-5 mx-auto mb-1 text-slate-400 peer-checked:text-green-600" />
                  <span className="font-bold text-slate-700 peer-checked:text-green-700 text-xs">Jual Produk</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="businessType" value="service" className="peer hidden" />
                <div className="p-3 border-2 border-slate-100 rounded-2xl text-center peer-checked:border-purple-600 peer-checked:bg-purple-50 transition-all">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-slate-400 peer-checked:text-purple-600" />
                  <span className="font-bold text-slate-700 peer-checked:text-purple-700 text-xs">Jasa & Layanan</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-900 mb-2 block">Nama Usaha / Toko</label>
            <input 
              required
              name="name"
              type="text" 
              placeholder="Contoh: Warung Bu Tejo" 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all font-medium text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs font-black text-slate-900 mb-2 block">Nomor WhatsApp Aktif</label>
            <input 
              required
              name="phone"
              type="tel" 
              placeholder="081234567890" 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all font-medium text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-900 mb-2 block">Alamat Lengkap</label>
            <textarea 
              required
              name="address"
              rows={3}
              placeholder="RT/RW, pedukuhan..." 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all font-medium resize-none text-sm"
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-black text-slate-900 mb-2 block">Deskripsi Singkat (Opsional)</label>
            <textarea 
              name="description"
              rows={2}
              placeholder="Jual makanan ringan, dll..." 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all font-medium resize-none text-sm"
            ></textarea>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
              {errorMsg}
            </div>
          )}

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Pendaftaran'}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 font-bold mt-6 px-4">
            Dengan mendaftar, Anda setuju untuk mematuhi aturan Kalurahan Pondokrejo.
          </p>
        </form>
      </main>
    </div>
  )
}
