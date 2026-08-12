'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  fetchAllOrders, 
  fetchCouriers, 
  fetchMerchants, 
  updateOrderStatus, 
  assignCourier 
} from '@/app/actions/admin'
import { fetchFoodOrders, confirmPaymentAndNotify } from '@/app/actions/food-admin'
import { 
  Loader2, 
  RefreshCw, 
  LogOut, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Printer, 
  Store, 
  BarChart3, 
  Users, 
  Search, 
  Bike, 
  CheckCircle2, 
  PlusCircle, 
  XCircle,
  HelpCircle,
  Phone,
  UtensilsCrossed
} from 'lucide-react'

// Define Order type
type Order = {
  _id: string
  orderNumber: string
  _createdAt: string
  customerName: string
  customerPhone: string
  orderType: 'food' | 'parcel' | 'jastip'
  items: string
  pickupAddress: string
  deliveryAddress: string
  deliveryArea?: string
  customerNotes?: string
  totalAmount: number
  shippingFee: number
  paymentMethod: 'cod' | 'transfer'
  paymentStatus: 'unpaid' | 'paid'
  status: 'pending' | 'accepted' | 'delivering' | 'delivered' | 'completed' | 'cancelled' | 'problem'
  courier?: { _id: string; name: string; phone: string }
}

type FoodOrder = {
  _id: string
  orderNumber: string
  _createdAt: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  customerNotes?: string
  restaurantName: string
  totalAmount: number
  shippingFee: number
  paymentMethod: string
  paymentStatus: string
  status: string
  foodOrderStatus: string
  foodItems: Array<{
    name: string
    price: number
    quantity: number
    notes?: string
  }>
  paymentFlow?: {
    paymentStatus: string
    confirmedAt?: string
    accountNumber?: string
    accountName?: string
  }
  customerLocation?: { lat: number; lng: number }
}

type Courier = {
  _id: string
  name: string
  phone: string
  area?: string
  vehicleType: 'motor' | 'mobil'
  isActive: boolean
  status: 'active' | 'inactive'
}

type Merchant = {
  _id: string
  name: string
  category: string
  phone?: string
  area?: string
  address?: string
  isOpen: boolean
}

const PIN = '12341'

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [errorPin, setErrorPin] = useState('')
  
  const [orders, setOrders] = useState<Order[]>([])
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  
  const [activeTab, setActiveTab] = useState<'orders' | 'food' | 'merchants' | 'couriers' | 'stats'>('orders')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Check auth state on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('pawon_admin_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    } else {
      setLoading(false)
    }
  }, [])

  // Fetch all data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadAllData(true)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const loadAllData = async (isBackground = false) => {
    if (!isBackground) setLoading(true)
    else setRefreshing(true)

    try {
      const [ordersRes, foodOrdersRes, couriersRes, merchantsRes] = await Promise.all([
        fetchAllOrders(),
        fetchFoodOrders(),
        fetchCouriers(),
        fetchMerchants()
      ])

      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data)
      if (foodOrdersRes.success && foodOrdersRes.data) setFoodOrders(foodOrdersRes.data)
      if (couriersRes.success && couriersRes.data) setCouriers(couriersRes.data)
      if (merchantsRes.success && merchantsRes.data) setMerchants(merchantsRes.data)
    } catch (err) {
      console.error('Error loading admin dashboard data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput === PIN) {
      sessionStorage.setItem('pawon_admin_auth', 'true')
      setIsAuthenticated(true)
      setErrorPin('')
    } else {
      setErrorPin('PIN salah!')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('pawon_admin_auth')
    setIsAuthenticated(false)
    setPinInput('')
    setOrders([])
    setCouriers([])
    setMerchants([])
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setRefreshing(true)
    const res = await updateOrderStatus(orderId, newStatus)
    if (res.success) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o))
    } else {
      alert('Gagal mengubah status: ' + res.error)
    }
    setRefreshing(false)
  }

  const handleCourierAssign = async (orderId: string, courierId: string) => {
    setRefreshing(true)
    const res = await assignCourier(orderId, courierId)
    if (res.success) {
      const assignedCourierObj = couriers.find(c => c._id === courierId)
      setOrders(prev => prev.map(o => o._id === orderId ? { 
        ...o, 
        status: courierId ? 'delivering' : o.status,
        courier: courierId ? { _id: courierId, name: assignedCourierObj?.name || 'Kurir', phone: assignedCourierObj?.phone || '' } : undefined
      } : o))
    } else {
      alert('Gagal menunjuk kurir: ' + res.error)
    }
    setRefreshing(false)
  }

  const handleFoodPaymentConfirm = async (orderId: string, orderNumber: string, restaurantName: string, customerPhone: string, totalAmount: number) => {
    setRefreshing(true)
    const res = await confirmPaymentAndNotify(orderId, orderNumber, restaurantName, customerPhone, totalAmount)
    if (res.success) {
      setFoodOrders(prev => prev.map(o => 
        o._id === orderId 
          ? { ...o, foodOrderStatus: 'confirmed_resto_prep', paymentFlow: { ...o.paymentFlow, paymentStatus: 'confirmed', confirmedAt: new Date().toISOString() } }
          : o
      ))
      alert(res.message || 'Pembayaran dikonfirmasi!')
    } else {
      alert('Gagal konfirmasi: ' + res.error)
    }
    setRefreshing(false)
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-xl max-w-sm w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Dasbor Admin</h1>
          <p className="text-slate-500 font-bold mb-4">Masukkan PIN untuk masuk</p>
          <Link href="/manual/admin" className="inline-block text-xs font-black text-slate-600 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors mb-8">
            📖 Baca Buku Panduan Admin
          </Link>
          
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="****"
            className="w-full text-center text-3xl tracking-[0.5em] font-black p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition-all mb-4"
          />
          
          {errorPin && <p className="text-red-500 text-sm font-bold mb-4">{errorPin}</p>}
          
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-slate-200">
            Masuk
          </button>
        </form>
      </div>
    )
  }

  if (loading && !orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto" />
          <p className="text-slate-500 font-bold text-sm">Memuat modul dasbor admin...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: Order['status']) => {
    if (status === 'completed') return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'cancelled' || status === 'problem') return 'bg-red-100 text-red-700 border-red-200'
    if (status === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'
    if (status === 'delivering') return 'bg-blue-100 text-blue-700 border-blue-200'
    if (status === 'delivered') return 'bg-purple-100 text-purple-700 border-purple-200'
    return 'bg-orange-100 text-orange-700 border-orange-200'
  }

  const getStatusText = (status: Order['status']) => {
    if (status === 'completed') return 'Selesai'
    if (status === 'cancelled') return 'Dibatalkan'
    if (status === 'problem') return 'Bermasalah'
    if (status === 'pending') return 'Menunggu Konfirmasi'
    if (status === 'accepted') return 'Diterima & Disiapkan'
    if (status === 'delivering') return 'Sedang Diantar'
    if (status === 'delivered') return 'Tiba di Tujuan'
    return status
  }

  const getStatusIcon = (status: Order['status']) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5" />
    if (status === 'cancelled' || status === 'problem') return <AlertTriangle className="w-5 h-5" />
    if (status === 'delivering') return <Truck className="w-5 h-5" />
    if (status === 'delivered') return <User className="w-5 h-5" />
    if (status === 'pending') return <Clock className="w-5 h-5" />
    return <Package className="w-5 h-5" />
  }

  // Filter food orders first
  const foodOrders = orders.filter(o => o.orderType === 'food')
  
  // Filtering logic
  const filteredOrders = foodOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      (order.deliveryArea && order.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.area && m.area.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredCouriers = couriers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.area && c.area.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Stats computation
  const totalRevenue = foodOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0)
  
  const totalPending = foodOrders.filter(o => o.status === 'pending').length
  const totalActive = foodOrders.filter(o => ['accepted', 'delivering', 'delivered'].includes(o.status)).length
  const totalCompleted = foodOrders.filter(o => o.status === 'completed').length

  // Group by Area
  const areaDistribution: Record<string, number> = {}
  foodOrders.forEach(o => {
    const area = o.deliveryArea || 'Lainnya'
    areaDistribution[area] = (areaDistribution[area] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white print:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 leading-none text-lg">Dasbor Admin Anterbae</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sistem Pemesanan Makanan & Mitra</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all"
              title="Cetak Laporan / PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={() => loadAllData(false)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
              title="Muat Ulang"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8 print:hidden">
        {/* Navigation Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm max-w-md mb-8 gap-1">
          <button 
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Package className="w-4 h-4" />
            Pesanan
          </button>
          <button 
            onClick={() => { setActiveTab('food'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'food' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Makanan
          </button>
          <button 
            onClick={() => { setActiveTab('merchants'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'merchants' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Store className="w-4 h-4" />
            Merchant
          </button>
          <button 
            onClick={() => { setActiveTab('couriers'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'couriers' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="w-4 h-4" />
            Kurir
          </button>
          <button 
            onClick={() => { setActiveTab('stats'); setSearchQuery(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistik
          </button>
        </div>

        {/* Search & Filter Bar */}
        {activeTab !== 'stats' && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeTab === 'orders' ? 'Cari nomor order, nama pembeli, area...' :
                  activeTab === 'merchants' ? 'Cari nama merchant, area...' : 'Cari nama kurir, wilayah aktif...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-slate-800 outline-none flex-1 font-medium"
              />
            </div>
            
            {activeTab === 'orders' && (
              <div className="flex gap-2">
                {['all', 'pending', 'accepted', 'delivering', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${statusFilter === st ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-100' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    {st === 'all' ? 'Semua' : getStatusText(st as any)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Quick summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pemesanan Makanan</p>
                <p className="text-2xl font-black text-slate-900">{foodOrders.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Butuh Tindakan</p>
                <p className="text-2xl font-black text-yellow-600">{totalPending}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Proses Kirim</p>
                <p className="text-2xl font-black text-blue-600">{totalActive}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Total Omset COD/Transfer</p>
                <p className="text-2xl font-black text-green-600">Rp{totalRevenue.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
                {/* Left Info */}
                <div className="flex-grow space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">
                      {new Date(order._createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      🍕 Makanan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><User className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                        <p className="text-xs font-bold text-slate-500">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><MapPin className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          {order.deliveryAddress}
                          {order.deliveryArea && <span className="block text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">📍 Area: {order.deliveryArea}</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items list parser */}
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Item yang Dipesan</p>
                    <div className="space-y-1 text-sm font-medium text-slate-700 whitespace-pre-line">
                      {order.items}
                    </div>
                    {order.customerNotes && (
                      <p className="text-xs text-red-500 font-bold mt-2 pt-2 border-t border-slate-200">
                        💬 Catatan: {order.customerNotes}
                      </p>
                    )}
                    <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500">Total Pembayaran (+Ongkir)</span>
                      <span className="text-lg font-black text-slate-900">Rp{order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="lg:w-80 flex-shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status Pesanan</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 bg-slate-50 text-xs font-black">
                        <CreditCard className="w-3.5 h-3.5" />
                        {order.paymentMethod === 'cod' ? 'COD' : 'Transfer'}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atur Status</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(order._id, 'accepted')}
                          className="flex items-center justify-center gap-1 bg-green-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terima
                        </button>
                      )}
                      {['pending', 'accepted', 'delivering'].includes(order.status) && (
                        <button 
                          onClick={() => handleStatusChange(order._id, 'completed')}
                          className="flex items-center justify-center gap-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleStatusChange(order._id, 'cancelled')}
                          className="flex items-center justify-center gap-1 bg-red-50 text-red-600 font-bold py-2 rounded-xl text-xs hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Batal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Courier Assignment */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tunjuk Mitra Kurir</p>
                    <select
                      value={order.courier?._id || ''}
                      onChange={(e) => handleCourierAssign(order._id, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">-- Belum Ditunjuk --</option>
                      {couriers.filter(c => c.isActive).map(c => (
                        <option key={c._id} value={c._id}>🛵 {c.name} ({c.area || 'Banjarnegara'})</option>
                      ))}
                    </select>
                    {order.courier && (
                      <p className="text-[10px] text-slate-500 font-bold">
                        Aktif: {order.courier.name} ({order.courier.phone})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800">Belum Ada Pesanan Makanan</h3>
                <p className="text-slate-500 font-bold mt-2">Daftar pesanan dengan kategori food akan muncul di sini.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MERCHANTS */}
        {activeTab === 'merchants' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <div key={merchant._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 text-red-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <Store className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${merchant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {merchant.isOpen ? '● Buka' : '● Tutup'}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 mb-1">{merchant.name}</h3>
                  <p className="text-xs font-black uppercase text-red-600 tracking-wider mb-4">{merchant.category || 'Kategori N/A'}</p>
                  
                  <div className="space-y-2 text-xs font-bold text-slate-500">
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {merchant.phone || '-'}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {merchant.area || 'Banjarnegara'}</p>
                    <p className="text-[10px] leading-relaxed mt-2 text-slate-400">{merchant.address || 'Alamat belum disetel.'}</p>
                  </div>
                </div>
                
                <a 
                  href={`/studio/intent/edit/id=${merchant._id};type=merchant`} 
                  target="_blank"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-xs"
                >
                  Edit Profil Toko <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}

            {filteredMerchants.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <Store className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800">Merchant Tidak Ditemukan</h3>
                <p className="text-slate-500 font-bold mt-2">Pastikan nama toko atau daerah yang dicari benar.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FOOD ORDERS */}
        {activeTab === 'food' && (
          <div className="space-y-4">
            {/* Food Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-2xl text-white shadow-lg shadow-red-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-100 mb-1">Total Pesanan</p>
                <p className="text-2xl font-black">{foodOrders.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Menunggu Bayar</p>
                <p className="text-2xl font-black text-yellow-600">{foodOrders.filter(o => o.foodOrderStatus === 'waiting_payment').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Dikonfirmasi</p>
                <p className="text-2xl font-black text-blue-600">{foodOrders.filter(o => o.foodOrderStatus === 'confirmed_resto_prep' || o.foodOrderStatus === 'resto_ready_waiting_courier').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Omset Hari Ini</p>
                <p className="text-2xl font-black text-green-600">Rp{foodOrders.filter(o => {
                  const today = new Date().toDateString()
                  return new Date(o._createdAt).toDateString() === today
                }).reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {foodOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <UtensilsCrossed className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800">Belum Ada Pesanan Makanan</h3>
                <p className="text-slate-500 font-bold mt-2">Pesanan makanan akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {foodOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        {new Date(order._createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${
                        order.foodOrderStatus === 'waiting_payment' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        order.foodOrderStatus === 'confirmed_resto_prep' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        order.foodOrderStatus === 'resto_ready_waiting_courier' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        order.foodOrderStatus === 'delivering' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {order.foodOrderStatus === 'waiting_payment' && '⏳ Menunggu Pembayaran'}
                        {order.foodOrderStatus === 'waiting_admin_confirm' && '✅ Menunggu Konfirmasi'}
                        {order.foodOrderStatus === 'confirmed_resto_prep' && '🍳 Resto Disiapkan'}
                        {order.foodOrderStatus === 'resto_ready_waiting_courier' && '📦 Siap - Tunggu Kurir'}
                        {order.foodOrderStatus === 'courier_picking' && '🛵 Kurir Mengambil'}
                        {order.foodOrderStatus === 'delivering' && '🚀 Dalam Pengiriman'}
                        {order.foodOrderStatus === 'completed' && '✔️ Selesai'}
                        {order.foodOrderStatus === 'cancelled' && '❌ Dibatalkan'}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 rounded-xl text-red-600"><Store className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase">Restoran</p>
                          <p className="text-sm font-black text-slate-900">{order.restaurantName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><User className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase">Pelanggan</p>
                          <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                          <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-600 hover:underline">
                            {order.customerPhone} →
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><MapPin className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase">Alamat</p>
                          <p className="text-sm font-bold text-slate-700">{order.deliveryAddress}</p>
                          {order.customerLocation && (
                            <a 
                              href={`https://www.openstreetmap.org/?mlat=${order.customerLocation.lat}&mlon=${order.customerLocation.lng}#map=18/${order.customerLocation.lat}/${order.customerLocation.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                            >
                              📍 Lihat di Peta →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Food Items */}
                    <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Menu Dipesan</p>
                      <div className="space-y-2">
                        {order.foodItems?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-700">
                              {item.name} x{item.quantity}
                              {item.notes && <span className="text-slate-400 text-xs"> ({item.notes})</span>}
                            </span>
                            <span className="font-bold text-slate-900">
                              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-500">Total</span>
                        <span className="text-xl font-black text-red-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {order.paymentFlow && (
                      <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Info Pembayaran</p>
                        <p className="text-sm font-bold text-blue-900 mb-1">
                          {order.paymentFlow.accountNumber} a.n. {order.paymentFlow.accountName}
                        </p>
                        <p className="text-xs text-blue-600">
                          Status: {order.paymentFlow.paymentStatus === 'confirmed' ? '✅ Dikonfirmasi' : order.paymentFlow.paymentStatus === 'paid_pending_confirm' ? '⏳ Menunggu Konfirmasi' : '⏳ Menunggu Pembayaran'}
                        </p>
                        {order.paymentFlow.confirmedAt && (
                          <p className="text-xs text-blue-500 mt-1">
                            Dikonfirmasi: {new Date(order.paymentFlow.confirmedAt).toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {order.foodOrderStatus === 'waiting_payment' && (
                        <button
                          onClick={() => {
                            const confirm = window.confirm(
                              `Konfirmasi pembayaran untuk ${order.orderNumber}?\n\nResto dan kurir akan dinotifikasi.`
                            )
                            if (confirm) {
                              handleFoodPaymentConfirm(
                                order._id,
                                order.orderNumber,
                                order.restaurantName,
                                order.customerPhone,
                                order.totalAmount
                              )
                            }
                          }}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Konfirmasi Pembayaran
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-green-100 text-green-700 rounded-xl font-bold text-sm hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        WA Pelanggan
                      </a>
                      <a
                        href={`/studio/intent/edit/id=${order._id};type=order`}
                        target="_blank"
                        className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                      >
                        Edit di Sanity
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COURIERS */}
        {activeTab === 'couriers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCouriers.map((courier) => (
              <div key={courier._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <Bike className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${courier.status === 'active' && courier.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {courier.status === 'active' && courier.isActive ? '● Aktif' : '● Libur'}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 mb-1">{courier.name}</h3>
                  <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-4">🛵 {courier.vehicleType === 'motor' ? 'Sepeda Motor' : 'Mobil'}</p>
                  
                  <div className="space-y-2 text-xs font-bold text-slate-500">
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {courier.phone}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Jangkauan: {courier.area || 'Banjarnegara'}</p>
                  </div>
                </div>
                
                <a 
                  href={`/studio/intent/edit/id=${courier._id};type=courier`} 
                  target="_blank"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-xs"
                >
                  Edit Profil Kurir <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}

            {filteredCouriers.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800">Kurir Tidak Ditemukan</h3>
                <p className="text-slate-500 font-bold mt-2">Cari nama kurir atau cakupan area kerja yang lain.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STATISTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Visual Progress Bar Chart for Area Distribution */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-600" />
                Distribusi Transaksi per Area Pengiriman
              </h3>
              
              <div className="space-y-4">
                {Object.entries(areaDistribution).map(([area, count]) => {
                  const percentage = Math.round((count / foodOrders.length) * 100)
                  return (
                    <div key={area} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{area}</span>
                        <span>{count} Order ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {Object.keys(areaDistribution).length === 0 && (
                  <p className="text-sm font-bold text-slate-400 text-center py-6">Tidak ada data distribusi area.</p>
                )}
              </div>
            </div>

            {/* General metrics summary table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Status Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-800 text-sm mb-4">Breakdown Status Transaksi</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Pending', count: totalPending, color: 'bg-yellow-500' },
                    { label: 'Proses Kirim/Antar', count: totalActive, color: 'bg-blue-500' },
                    { label: 'Selesai', count: totalCompleted, color: 'bg-green-500' },
                    { label: 'Dibatalkan/Gagal', count: foodOrders.filter(o => o.status === 'cancelled' || o.status === 'problem').length, color: 'bg-red-500' }
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${row.color}`} />
                        <span className="text-slate-600">{row.label}</span>
                      </div>
                      <span className="text-slate-900 text-sm font-black">{row.count} Transaksi</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General App Capacity Metrics */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-800 text-sm mb-4">Kapasitas & Kesehatan Sistem</h4>
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span>Mitra Toko Terintegrasi</span>
                    <span className="text-slate-900 font-black">{merchants.length} Toko</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span>Mitra Kurir Terdaftar</span>
                    <span className="text-slate-900 font-black">{couriers.length} Kurir</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span>Kurir Pembawa Tugas Aktif</span>
                    <span className="text-green-600 font-black">{couriers.filter(c => c.status === 'active' && c.isActive).length} Siap Antar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Integrasi WhatsApp</span>
                    <span className="text-green-600 font-black">Connected (Fonnte)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Print Table (Hidden in UI, Shown in Print) */}
      <div className="hidden print:block p-8 bg-white font-sans text-slate-900">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest">Laporan Pemesanan Anterbae</h1>
          <p className="text-slate-500 font-bold mt-2">Dicetak pada {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>

        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-slate-800 text-sm">
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50">No.</th>
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50">Waktu</th>
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50">Pelanggan</th>
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50">Pesanan</th>
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50">Kurir</th>
              <th className="py-4 px-3 font-black uppercase tracking-wider bg-slate-50 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm align-top">
            {foodOrders.map((order) => (
              <tr key={order._id} className="border-b border-slate-200">
                <td className="py-4 px-3 font-black">{order.orderNumber}</td>
                <td className="py-4 px-3">{new Date(order._createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="py-4 px-3">
                  <div className="font-bold">{order.customerName}</div>
                  <div className="text-xs text-slate-500">{order.customerPhone}</div>
                </td>
                <td className="py-4 px-3">
                  <p className="text-xs whitespace-pre-line font-bold text-slate-700">{order.items}</p>
                </td>
                <td className="py-4 px-3 font-bold text-xs">{order.courier?.name || '-'}</td>
                <td className="py-4 px-3 text-right font-black">Rp{order.totalAmount.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-[3px] border-slate-900 bg-slate-50">
              <td colSpan={5} className="py-5 px-3 text-right font-black uppercase tracking-widest">Total Nilai Transaksi Food</td>
              <td className="py-5 px-3 text-right font-black text-xl">Rp{totalRevenue.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
