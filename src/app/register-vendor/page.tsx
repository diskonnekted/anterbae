'use client'

import { useState } from 'react'
import { registerVendor } from '@/app/actions/vendor'
import { Store, Loader2, CheckCircle2, ChevronRight, Upload, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterVendorPage() {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-xl border border-slate-100 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Pendaftaran<br/>Berhasil!</h1>
          <p className="text-slate-500 mb-8 font-medium">
            Data usaha Anda telah masuk ke sistem. Silakan tunggu Admin Kalurahan Pondokrejo untuk melakukan verifikasi.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-black hover:text-green-700 transition-colors">
            Kembali ke Beranda <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
            <Store className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Daftar Mitra UMKM</h1>
          <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto">
            Ayo majukan ekonomi Kalurahan Pondokrejo dengan mendaftarkan usaha Anda secara digital.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Logo Upload */}
            <div className="flex flex-col items-center mb-8">
              <label className="text-sm font-black text-slate-900 mb-3 block w-full text-center">Logo Usaha (Opsional)</label>
              <div 
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="w-32 h-32 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:bg-slate-100 transition-all relative"
              >
                {logoPreview ? (
                  <>
                    <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Ubah</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                  </>
                )}
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className="text-sm font-black text-slate-900 mb-3 block">Jenis Usaha</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" name="businessType" value="product" className="peer hidden" defaultChecked />
                  <div className="p-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:border-green-600 peer-checked:bg-green-50 transition-all">
                    <Store className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-green-600" />
                    <span className="font-bold text-slate-700 peer-checked:text-green-700">Jual Produk</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="businessType" value="service" className="peer hidden" />
                  <div className="p-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:border-purple-600 peer-checked:bg-purple-50 transition-all">
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-purple-600" />
                    <span className="font-bold text-slate-700 peer-checked:text-purple-700">Tawarkan Jasa</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-black text-slate-900 mb-3 block">Nama Usaha / Toko</label>
              <input 
                required
                name="name"
                type="text" 
                placeholder="Contoh: Warung Bu Tejo" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-green-600 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
            
            <div>
              <label className="text-sm font-black text-slate-900 mb-3 block">Nomor WhatsApp Aktif</label>
              <input 
                required
                name="phone"
                type="tel" 
                placeholder="081234567890" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-green-600 focus:bg-white outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-sm font-black text-slate-900 mb-3 block">Alamat Lengkap</label>
              <textarea 
                required
                name="address"
                rows={3}
                placeholder="Nama jalan, RT/RW, pedukuhan..." 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-green-600 focus:bg-white outline-none transition-all font-medium resize-none"
              ></textarea>
            </div>

            <div>
              <label className="text-sm font-black text-slate-900 mb-3 block">Deskripsi Singkat (Opsional)</label>
              <textarea 
                name="description"
                rows={2}
                placeholder="Jual makanan ringan, sayuran, dll..." 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-green-600 focus:bg-white outline-none transition-all font-medium resize-none"
              ></textarea>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                {errorMsg}
              </div>
            )}

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Kirim Pendaftaran'}
            </button>
            <p className="text-center text-xs text-slate-400 font-bold mt-6">
              Dengan mendaftar, Anda setuju untuk mematuhi aturan Kalurahan Pondokrejo.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
