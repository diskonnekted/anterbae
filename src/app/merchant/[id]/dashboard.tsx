'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  ChevronDown,
} from 'lucide-react'

interface Merchant {
  _id: string
  name: string
  slug: string
  category: string
  logo?: any
  coverImage?: any
  phone?: string
  address?: string
  area?: string
  description?: string
  isOpen: boolean
  closingMessage?: string
  openHours?: string
  minOrder?: number
  isVerified: boolean
  latitude?: number
  longitude?: number
}

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  stock: number
  image?: any
  description?: string
  isBestSeller?: boolean
  isPromo?: boolean
  promoDiscount?: number
  _createdAt: string
  _updatedAt: string
}

interface MerchantDashboardProps {
  merchant: Merchant
}

type Tab = 'overview' | 'products' | 'location'
type ProductMode = 'list' | 'create' | 'edit'

export default function MerchantDashboard({ merchant }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [productMode, setProductMode] = useState<ProductMode>('list')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Product form state
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formStock, setFormStock] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formIsBestSeller, setFormIsBestSeller] = useState(false)
  const [formIsPromo, setFormIsPromo] = useState(false)
  const [formPromoDiscount, setFormPromoDiscount] = useState('')

  // Location state
  const [formLat, setFormLat] = useState(merchant.latitude?.toString() || '')
  const [formLng, setFormLng] = useState(merchant.longitude?.toString() || '')
  const [savingLocation, setSavingLocation] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/merchant-products?merchantId=${merchant._id}`)
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (err) {
      showToast('Gagal memuat produk', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Create product
  const handleCreateProduct = async () => {
    try {
      const res = await fetch('/api/merchant-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          price: parseFloat(formPrice),
          stock: parseInt(formStock) || 0,
          description: formDescription,
          isBestSeller: formIsBestSeller,
          isPromo: formIsPromo,
          promoDiscount: formIsPromo ? parseInt(formPromoDiscount) || 0 : undefined,
          merchantId: merchant._id,
        }),
      })
      const data = await res.json()
      if (data.product) {
        showToast('Produk berhasil ditambahkan')
        resetForm()
        setProductMode('list')
        fetchProducts()
      } else {
        showToast(data.error || 'Gagal membuat produk', 'error')
      }
    } catch (err) {
      showToast('Gagal membuat produk', 'error')
    }
  }

  // Update product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return
    try {
      const res = await fetch(`/api/merchant-products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          price: parseFloat(formPrice),
          stock: parseInt(formStock) || 0,
          description: formDescription,
          isBestSeller: formIsBestSeller,
          isPromo: formIsPromo,
          promoDiscount: formIsPromo ? parseInt(formPromoDiscount) || 0 : undefined,
        }),
      })
      const data = await res.json()
      if (data.product) {
        showToast('Produk berhasil diperbarui')
        resetForm()
        setProductMode('list')
        setEditingProduct(null)
        fetchProducts()
      } else {
        showToast(data.error || 'Gagal memperbarui produk', 'error')
      }
    } catch (err) {
      showToast('Gagal memperbarui produk', 'error')
    }
  }

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/merchant-products/${productId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Produk berhasil dihapus')
        setDeleteConfirm(null)
        fetchProducts()
      }
    } catch (err) {
      showToast('Gagal menghapus produk', 'error')
    }
  }

  // Update location
  const handleUpdateLocation = async () => {
    setSavingLocation(true)
    try {
      const res = await fetch(
        `/api/merchant-location?merchantId=${merchant._id}&latitude=${formLat}&longitude=${formLng}`,
        { method: 'PATCH' }
      )
      const data = await res.json()
      if (data.merchant) {
        showToast('Lokasi berhasil diperbarui')
      } else {
        showToast(data.error || 'Gagal memperbarui lokasi', 'error')
      }
    } catch (err) {
      showToast('Gagal memperbarui lokasi', 'error')
    } finally {
      setSavingLocation(false)
    }
  }

  // Open edit form
  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormSlug(product.slug)
    setFormPrice(product.price.toString())
    setFormStock(product.stock.toString())
    setFormDescription(product.description || '')
    setFormIsBestSeller(product.isBestSeller || false)
    setFormIsPromo(product.isPromo || false)
    setFormPromoDiscount(product.promoDiscount?.toString() || '')
    setProductMode('edit')
  }

  // Open create form
  const openCreateForm = () => {
    resetForm()
    setProductMode('create')
  }

  // Reset form
  const resetForm = () => {
    setFormName('')
    setFormSlug('')
    setFormPrice('')
    setFormStock('')
    setFormDescription('')
    setFormIsBestSeller(false)
    setFormIsPromo(false)
    setFormPromoDiscount('')
  }

  // Cancel form
  const cancelForm = () => {
    resetForm()
    setProductMode('list')
    setEditingProduct(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Produk', icon: Package },
    { id: 'location' as Tab, label: 'Lokasi', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/anterbae.png" alt="Anterbae" width={120} height={40} className="h-8 w-auto" />
              </Link>
              <div className="hidden sm:block w-px h-8 bg-slate-200" />
              <div className="hidden sm:flex items-center gap-2">
                {merchant.logo && (
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100">
                    <Image src={urlFor(merchant.logo).width(32).height(32).url()} alt={merchant.name} fill className="object-cover" />
                  </div>
                )}
                <span className="font-black text-slate-900 text-sm">{merchant.name}</span>
              </div>
            </div>
            <Link href="/mitra" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              ← Kembali
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-200 p-2 sticky top-24">
              {/* Merchant info */}
              <div className="px-3 py-4 mb-2 border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Akun Merchant</p>
                <p className="font-black text-slate-900 text-sm truncate">{merchant.name}</p>
                <p className="text-xs text-slate-500 font-medium">{merchant.area || 'Belum diatur'}</p>
                <div className={`inline-flex items-center gap-1 mt-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  merchant.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {merchant.isVerified ? '● Terverifikasi' : '● Belum Terverifikasi'}
                </div>
              </div>

              {/* Nav items */}
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}

              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                <Link
                  href="/studio"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Admin Studio
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/merchant-auth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ logout: true }),
                    })
                    window.location.href = `/merchant/${merchant._id}/pin`
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total Produk</p>
                    <p className="text-3xl font-black text-slate-900">{products.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <p className={`text-3xl font-black ${merchant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {merchant.isOpen ? 'Buka' : 'Tutup'}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Kategori</p>
                    <p className="text-3xl font-black text-slate-900">
                      {merchant.category === 'food' ? 'Makanan' : merchant.category === 'grocery' ? 'Grocery' : merchant.category === 'health' ? 'Kesehatan' : 'Lainnya'}
                    </p>
                  </div>
                </div>

                {/* Merchant Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-black text-slate-900 mb-4">Informasi Merchant</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Alamat</p>
                      <p className="font-semibold text-slate-700">{merchant.address || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Kecamatan</p>
                      <p className="font-semibold text-slate-700">{merchant.area || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="font-semibold text-slate-700">{merchant.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Jam Operasional</p>
                      <p className="font-semibold text-slate-700">{merchant.openHours || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Koordinat</p>
                      <p className="font-semibold text-slate-700">
                        {merchant.latitude != null && merchant.longitude != null
                          ? `${merchant.latitude}, ${merchant.longitude}`
                          : 'Belum diatur'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-900">Produk Terbaru</h2>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">📦</div>
                      <p className="text-slate-400 font-bold mb-2">Belum ada produk</p>
                      <button
                        onClick={() => { setActiveTab('products'); openCreateForm() }}
                        className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 3).map(product => (
                        <div key={product._id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                          {product.image ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                              <Image src={urlFor(product.image).width(48).height(48).url()} alt={product.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center text-lg">📦</div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 text-sm truncate">{product.name}</p>
                            <p className="text-xs text-slate-500 font-bold">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-slate-900">Produk</h1>
                  {productMode === 'list' && (
                    <button
                      onClick={openCreateForm}
                      className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Produk
                    </button>
                  )}
                </div>

                {/* Product Form (Create/Edit) */}
                {(productMode === 'create' || productMode === 'edit') && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="text-lg font-black text-slate-900 mb-4">
                      {productMode === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nama Produk</label>
                        <input
                          type="text"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Nama produk"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Slug (opsional)</label>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={e => setFormSlug(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="auto-generated"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Harga (Rp)</label>
                        <input
                          type="number"
                          value={formPrice}
                          onChange={e => setFormPrice(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Stok</label>
                        <input
                          type="number"
                          value={formStock}
                          onChange={e => setFormStock(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Diskon Promo (%)</label>
                        <input
                          type="number"
                          value={formPromoDiscount}
                          onChange={e => setFormPromoDiscount(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                          min="1"
                          max="99"
                          disabled={!formIsPromo}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Deskripsi</label>
                        <textarea
                          value={formDescription}
                          onChange={e => setFormDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="Deskripsi produk"
                        />
                      </div>
                      <div className="sm:col-span-2 flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsBestSeller}
                            onChange={e => setFormIsBestSeller(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm font-bold text-slate-700">Produk Terlaris</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsPromo}
                            onChange={e => setFormIsPromo(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm font-bold text-slate-700">Ada Promo</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <button
                        onClick={productMode === 'create' ? handleCreateProduct : handleUpdateProduct}
                        className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm"
                      >
                        <Check className="w-4 h-4" />
                        {productMode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'}
                      </button>
                      <button
                        onClick={cancelForm}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-black px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all text-sm"
                      >
                        <X className="w-4 h-4" />
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* Product List */}
                {productMode === 'list' && (
                  <>
                    {loading ? (
                      <div className="text-center py-16">
                        <div className="inline-block w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold mt-4">Memuat produk...</p>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-slate-400 font-bold text-lg mb-2">Belum ada produk</p>
                        <p className="text-slate-400 text-sm mb-6">Tambahkan produk pertama untuk toko Anda</p>
                        <button
                          onClick={openCreateForm}
                          className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Produk
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {products.map(product => (
                          <div key={product._id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-red-200 transition-all">
                            <div className="flex items-center gap-4">
                              {product.image ? (
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                  <Image src={urlFor(product.image).width(64).height(64).url()} alt={product.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-2xl">📦</div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-black text-slate-900 truncate">{product.name}</h3>
                                <p className="text-sm font-bold text-red-600">{formatCurrency(product.price)}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs font-bold text-slate-400">Stok: {product.stock}</span>
                                  {product.isBestSeller && (
                                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Terlaris</span>
                                  )}
                                  {product.isPromo && (
                                    <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Promo {product.promoDiscount}%</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => openEditForm(product)}
                                  className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                {deleteConfirm === product._id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDeleteProduct(product._id)}
                                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                                      title="Konfirmasi"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                                      title="Batal"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(product._id)}
                                    className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Location */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black text-slate-900">Lokasi Merchant</h1>

                {/* Map */}
                <LocationMap
                  merchant={merchant}
                  initialLat={merchant.latitude}
                  initialLng={merchant.longitude}
                />

                {/* Manual Input */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-black text-slate-900 mb-4">Koordinat Manual</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formLat}
                        onChange={e => setFormLat(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="-7.xxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formLng}
                        onChange={e => setFormLng(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="109.xxxxx"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateLocation}
                    disabled={savingLocation}
                    className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white font-black px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm disabled:opacity-50"
                  >
                    {savingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Simpan Lokasi
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// Location Map Component
function LocationMap({
  merchant,
  initialLat,
  initialLng,
}: {
  merchant: Merchant
  initialLat?: number
  initialLng?: number
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [lat, setLat] = useState(initialLat ?? -7.4097)
  const [lng, setLng] = useState(initialLng ?? 109.5250)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const center = [initialLat ?? -7.4097, initialLng ?? 109.5250]
    const map = L.map(mapRef.current).setView(center, initialLat ? 16 : 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 18,
    }).addTo(map)

    // Fix Leaflet default marker icons
    const markerIconUrl = 'node_modules/leaflet/dist/images/marker-icon.png'
    const markerIcon2xUrl = 'node_modules/leaflet/dist/images/marker-icon-2x.png'
    const markerShadowUrl = 'node_modules/leaflet/dist/images/marker-shadow.png'
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2xUrl,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    })

    // Add marker
    const marker = L.marker(center, { draggable: true }).addTo(map)
    markerRef.current = marker

    // Update coordinates on drag
    marker.on('dragend', async (e) => {
      const pos = marker.getLatLng()
      setLat(pos.lat)
      setLng(pos.lng)

      // Update in background
      fetch(`/api/merchant-location?merchantId=${merchant._id}&latitude=${pos.lat}&longitude=${pos.lng}`, {
        method: 'PATCH',
      }).catch(console.error)
    })

    // Click to set marker
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat: newLat, lng: newLng } = e.latLng
      setLat(newLat)
      setLng(newLng)

      marker.setLatLng([newLat, newLng])

      // Update in background
      fetch(`/api/merchant-location?merchantId=${merchant._id}&latitude=${newLat}&longitude=${newLng}`, {
        method: 'PATCH',
      }).catch(console.error)
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-900">Pilih Lokasi di Peta</h2>
        <div className="text-xs font-bold text-slate-400">
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </div>
      </div>
      <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-200">
        <div ref={mapRef} className="h-full w-full" />
      </div>
      <p className="text-xs text-slate-400 font-medium mt-3">
        {initialLat
          ? 'Klik atau seret marker untuk mengubah lokasi'
          : 'Klik pada peta untuk menetapkan lokasi merchant'}
      </p>
    </div>
  )
}
