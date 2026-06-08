'use client'

import { useState, useEffect } from 'react'
import { getVendorServices, createVendorService, updateVendorService, deleteVendorService } from '@/app/actions/vendor-services'
import { uploadImageToSanity } from '@/app/actions/vendor-products' // Reusing upload function
import { Presentation, Plus, Trash2, Edit, Image as ImageIcon, Loader2, X, CheckCircle2, DollarSign, List, Tags } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { client } from '@/sanity/lib/client'
import { CATEGORIES_QUERY } from '@/sanity/lib/queries'

export default function VendorServiceManager({ vendorId }: { vendorId: string }) {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newPriceType, setNewPriceType] = useState('starting_from')
  const [newDesc, setNewDesc] = useState('')
  const [newCategoryId, setNewCategoryId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const res = await getVendorServices(vendorId)
    if (res.success) setServices(res.data)
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const data = await client.fetch(CATEGORIES_QUERY)
      if (data) setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const openAddForm = () => {
    setEditingServiceId(null)
    setNewName('')
    setNewPrice('')
    setNewPriceType('starting_from')
    setNewDesc('')
    setNewCategoryId('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowForm(true)
  }

  const openEditForm = (service: any) => {
    setEditingServiceId(service._id)
    setNewName(service.name)
    setNewPrice(service.price.toString())
    setNewPriceType(service.priceType || 'starting_from')
    setNewDesc(service.description || '')
    setNewCategoryId(service.categories?.[0] || '')
    setSelectedFile(null)
    setPreviewUrl(service.image ? urlFor(service.image).width(400).url() : null)
    setShowForm(true)
  }

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingServiceId && !selectedFile) return alert('Pilih foto jasa terlebih dahulu.')
    if (!newCategoryId) return alert('Silakan pilih kategori jasa.')

    setSubmitting(true)
    
    let assetId: string | null = null

    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const uploadRes = await uploadImageToSanity(formData)

      if (!uploadRes.success || !uploadRes.assetId) {
        alert(uploadRes.error)
        setSubmitting(false)
        return
      }
      assetId = uploadRes.assetId
    }

    if (editingServiceId) {
      const res = await updateVendorService(editingServiceId, vendorId, {
        name: newName,
        price: Number(newPrice),
        priceType: newPriceType,
        description: newDesc,
        assetId: assetId,
        categoryIds: [newCategoryId]
      })

      if (res.success) {
        setShowForm(false)
        fetchServices()
      } else alert(res.error)
    } else {
      const res = await createVendorService(vendorId, {
        name: newName,
        price: Number(newPrice),
        priceType: newPriceType,
        description: newDesc,
        assetId: assetId!,
        categoryIds: [newCategoryId]
      })

      if (res.success) {
        setShowForm(false)
        fetchServices()
      } else alert(res.error)
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jasa ini?')) return
    const res = await deleteVendorService(id, vendorId)
    if (res.success) fetchServices()
    else alert(res.error)
  }

  const formatPriceType = (type: string) => {
    switch (type) {
      case 'fixed': return 'Harga Pas'
      case 'starting_from': return 'Mulai Dari'
      case 'hourly': return 'Per Jam'
      case 'negotiable': return 'Nego'
      default: return type
    }
  }

  return (
    <div className="space-y-6 pb-32">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Presentation className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-black text-slate-800 text-lg">Jasa Saya</h3>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-purple-600 text-white font-black px-4 py-2.5 rounded-2xl text-sm shadow-lg shadow-purple-200 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-bold text-sm uppercase tracking-widest">Memuat Jasa...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center px-6">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Presentation className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold">Belum ada jasa. Klik tombol tambah di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((s) => (
            <div key={s._id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 group">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                {s.image ? (
                  <Image src={urlFor(s.image).width(200).url()} alt={s.name} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-black text-slate-800 line-clamp-1">{s.name}</h4>
                <p className="text-purple-700 font-bold text-sm mt-0.5">
                  Rp{s.price.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <List className="w-3 h-3" /> {formatPriceType(s.priceType)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => openEditForm(s)}
                  className="p-3 text-slate-300 hover:text-blue-600 transition-colors active:scale-90 bg-slate-50 rounded-xl"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(s._id)}
                  className="p-3 text-slate-300 hover:text-red-600 transition-colors active:scale-90 bg-slate-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-20 duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editingServiceId ? 'Edit Jasa' : 'Tambah Jasa Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Foto / Poster Jasa</label>
                <div 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:bg-slate-100 transition-all"
                >
                  {previewUrl ? (
                    <>
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm">Ubah Foto</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-slate-400">Tekan untuk pilih foto</p>
                    </>
                  )}
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Informasi Jasa</label>
                <div className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder="Nama Jasa (Contoh: Jasa Pijat Panggilan)"
                    className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-bold text-slate-900"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-5 w-5 h-5 text-slate-300" />
                      <input
                        required
                        type="number"
                        placeholder="Harga (Rp)"
                        className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-bold text-slate-900"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        required
                        className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                        value={newPriceType}
                        onChange={(e) => setNewPriceType(e.target.value)}
                      >
                        <option value="starting_from">Mulai Dari</option>
                        <option value="fixed">Harga Pas</option>
                        <option value="hourly">Per Jam</option>
                        <option value="negotiable">Bisa Nego</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Deskripsi jasa (Layanan apa saja yang didapat)"
                    className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-bold text-slate-900 text-sm"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                      <Tags className="w-3 h-3" /> Pilih Kategori
                    </label>
                    <select
                      required
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                disabled={submitting}
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{editingServiceId ? 'Simpan Perubahan' : 'Upload & Publikasi Jasa'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
