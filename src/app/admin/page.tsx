'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  fetchAllOrders, 
  fetchCouriers, 
  fetchMerchants, 
  updateOrderStatus, 
  assignCourier,
  toggleCourierStatus 
} from '@/app/actions/admin'
import { fetchFoodOrders, confirmPaymentAndNotify } from '@/app/actions/food-admin'
import { fetchActivityLogs } from '@/app/actions/activity-log'
import { 
  Loader2, 
  RefreshCw, 
  LogOut, 
  Package, 
  User, 
  MapPin, 
  Map,
  CreditCard, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
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

import dynamic from 'next/dynamic'
import StatistikAdmin from '@/components/StatistikAdmin'

const PetaKurir = dynamic(() => import('@/components/PetaKurir'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center text-slate-400 font-bold">Memuat peta live kurir...</div>
})

const PetaMiniMerchant = dynamic(() => import('@/components/PetaMiniMerchant'), {
  ssr: false,
  loading: () => <div className="h-[180px] w-full bg-slate-100 animate-pulse rounded-2xl" />
})

// Define Order type
type Order = {
  _id: string
  orderNumber: string
  _createdAt: string
  customerName: string
  customerPhone: string
  orderType: 'food' | 'parcel' | 'jastip' | null
  orderCategory?: string
  restaurantName?: string
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
  courier?: { _id: string; name: string; phone: string }
}

type Courier = {
  _id: string
  name: string
  phone: string
  area?: string
  vehicleType: 'motor' | 'mobil'
  isActive: boolean
  status: 'active' | 'inactive'
  latitude?: number
  longitude?: number
  lastLocationUpdate?: string
}

type Merchant = {
  _id: string
  name: string
  category: string
  phone?: string
  area?: string
  address?: string
  isOpen: boolean
  logoUrl?: string
  description?: string
  openHours?: string
  isVerified?: boolean
  ownerName?: string
  latitude?: number
  longitude?: number
}

const PIN = '12341'

const getCourierProfilePic = (name: string): string => {
  const normalized = name.toLowerCase()
  if (normalized.includes('dummy 1') || normalized === 'adi') return '/kurir/adi.JPG'
  if (normalized.includes('dummy 2') || normalized.includes('budiarto') || normalized === 'budi') return '/kurir/budi.JPG'
  if (normalized.includes('dummy 3') || normalized === 'candra') return '/kurir/candra.JPG'
  if (normalized.includes('dummy 4') || normalized === 'deni') return '/kurir/deni.JPG'
  if (normalized.includes('dummy 5') || normalized === 'edi') return '/kurir/edi.JPG'
  if (normalized.includes('dummy 6') || normalized === 'farid') return '/kurir/farid.JPG'
  if (normalized.includes('dummy 7') || normalized === 'gozi') return '/kurir/gozi.JPG'
  if (normalized.includes('dummy 8') || normalized === 'heri') return '/kurir/heri.JPG'
  if (normalized.includes('dummy 9') || normalized === 'imam') return '/kurir/imam.JPG'
  if (normalized.includes('dummy 10') || normalized === 'joni') return '/kurir/joni.JPG'
  if (normalized.includes('kardi')) return '/kurir/kardi.JPG'

  const names = ['adi', 'budi', 'candra', 'deni', 'edi', 'farid', 'gozi', 'heri', 'imam', 'joni', 'kardi']
  for (const n of names) {
    if (normalized.includes(n)) {
      return `/kurir/${n}.JPG`
    }
  }
  return '/kurir/adi.JPG'
}

const getCourierMetadata = (name: string) => {
  const normalized = name.toLowerCase()
  if (normalized.includes('adi')) {
    return {
      address: 'Jl. Pemuda No. 12, Kutabanjarnegara, Banjarnegara',
      shift: 'Pagi (07:00 - 12:00)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }
  if (normalized.includes('budi')) {
    return {
      address: 'Jl. Diponegoro No. 45, Krandegan, Banjarnegara',
      shift: 'Siang (10:00 - 17:00)',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }
  if (normalized.includes('candra')) {
    return {
      address: 'Jl. Gatot Subroto No. 89, Semarang, Banjarnegara',
      shift: 'Malam (16:00 - Pagi)',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  }
  if (normalized.includes('deni')) {
    return {
      address: 'Jl. Ahmad Yani No. 56, Karangtengah, Banjarnegara',
      shift: 'Pagi (07:00 - 12:00)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }
  if (normalized.includes('edi')) {
    return {
      address: 'Jl. S. Parman No. 23, Rejasa, Banjarnegara',
      shift: 'Siang (10:00 - 17:00)',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }
  if (normalized.includes('farid')) {
    return {
      address: 'Jl. Jend. Sudirman No. 78, Kutabanjar, Banjarnegara',
      shift: 'Malam (16:00 - Pagi)',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  }
  if (normalized.includes('gozi')) {
    return {
      address: 'Jl. Veteran No. 34, Parakancanggah, Banjarnegara',
      shift: 'Pagi (07:00 - 12:00)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }
  if (normalized.includes('heri')) {
    return {
      address: 'Jl. Mayor Kasnadi No. 12, Wangon, Banjarnegara',
      shift: 'Siang (10:00 - 17:00)',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }
  if (normalized.includes('imam')) {
    return {
      address: 'Jl. Kartini No. 9, Gumiwang, Banjarnegara',
      shift: 'Malam (16:00 - Pagi)',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  }
  if (normalized.includes('joni')) {
    return {
      address: 'Jl. Wahid Hasyim No. 101, Selamanik, Banjarnegara',
      shift: 'Pagi (07:00 - 12:00)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }
  const index = name.length % 3
  if (index === 0) {
    return {
      address: 'Jl. Banjarnegara Raya No. 17, Banjarnegara',
      shift: 'Pagi (07:00 - 12:00)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  } else if (index === 1) {
    return {
      address: 'Jl. Ki Hajar Dewantara No. 44, Banjarnegara',
      shift: 'Siang (10:00 - 17:00)',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  } else {
    return {
      address: 'Jl. Serayu Indah No. 5, Banjarnegara',
      shift: 'Malam (16:00 - Pagi)',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  }
}


export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [errorPin, setErrorPin] = useState('')
  
  const [orders, setOrders] = useState<Order[]>([])
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [locations, setLocations] = useState<any[]>([])
  
  const [activeTab, setActiveTab] = useState<'orders' | 'food' | 'merchants' | 'couriers' | 'stats' | 'map'>('orders')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courierStatusFilter, setCourierStatusFilter] = useState<string>('all')
  const [courierShiftFilter, setCourierShiftFilter] = useState<string>('all')
  const [courierVehicleFilter, setCourierVehicleFilter] = useState<string>('all')

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [orderLogs, setOrderLogs] = useState<Record<string, any[]>>({})
  const [loadingLogs, setLoadingLogs] = useState<Record<string, boolean>>({})

  const [expandedCouriers, setExpandedCouriers] = useState<Record<string, boolean>>({})
  const [courierLogs, setCourierLogs] = useState<Record<string, any[]>>({})
  const [loadingCourierLogs, setLoadingCourierLogs] = useState<Record<string, boolean>>({})

  const [expandedMerchants, setExpandedMerchants] = useState<Record<string, boolean>>({})
  const [merchantLogs, setMerchantLogs] = useState<Record<string, any[]>>({})
  const [loadingMerchantLogs, setLoadingMerchantLogs] = useState<Record<string, boolean>>({})

  const toggleOrderExpand = async (orderId: string) => {
    const nextState = !expandedOrders[orderId]
    setExpandedOrders(prev => ({ ...prev, [orderId]: nextState }))

    if (nextState && !orderLogs[orderId]) {
      setLoadingLogs(prev => ({ ...prev, [orderId]: true }))
      try {
        const logsRes = await fetchActivityLogs({ orderId })
        if (logsRes.success && logsRes.data) {
          setOrderLogs(prev => ({ ...prev, [orderId]: logsRes.data }))
        }
      } catch (err) {
        console.error('Error fetching logs:', err)
      } finally {
        setLoadingLogs(prev => ({ ...prev, [orderId]: false }))
      }
    }
  }

  const refreshOrderLogs = async (orderId: string) => {
    try {
      const logsRes = await fetchActivityLogs({ orderId })
      if (logsRes.success && logsRes.data) {
        setOrderLogs(prev => ({ ...prev, [orderId]: logsRes.data }))
      }
    } catch (err) {
      console.error('Error refreshing logs:', err)
    }
  }

  const toggleCourierExpand = async (courierId: string) => {
    const nextState = !expandedCouriers[courierId]
    setExpandedCouriers(prev => ({ ...prev, [courierId]: nextState }))

    if (nextState && !courierLogs[courierId]) {
      setLoadingCourierLogs(prev => ({ ...prev, [courierId]: true }))
      try {
        const logsRes = await fetchActivityLogs({ courierId })
        if (logsRes.success && logsRes.data) {
          setCourierLogs(prev => ({ ...prev, [courierId]: logsRes.data }))
        }
      } catch (err) {
        console.error('Error fetching courier logs:', err)
      } finally {
        setLoadingCourierLogs(prev => ({ ...prev, [courierId]: false }))
      }
    }
  }

  const toggleMerchantExpand = async (merchantId: string) => {
    const nextState = !expandedMerchants[merchantId]
    setExpandedMerchants(prev => ({ ...prev, [merchantId]: nextState }))

    if (nextState && !merchantLogs[merchantId]) {
      setLoadingMerchantLogs(prev => ({ ...prev, [merchantId]: true }))
      try {
        const logsRes = await fetchActivityLogs({ merchantId })
        if (logsRes.success && logsRes.data) {
          setMerchantLogs(prev => ({ ...prev, [merchantId]: logsRes.data }))
        }
      } catch (err) {
        console.error('Error fetching merchant logs:', err)
      } finally {
        setLoadingMerchantLogs(prev => ({ ...prev, [merchantId]: false }))
      }
    }
  }

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

  const shouldBeActiveByShift = (name: string): boolean => {
    const currentHour = new Date().getHours()
    const metadata = getCourierMetadata(name)
    if (metadata.shift.startsWith('Pagi')) {
      return currentHour >= 7 && currentHour < 12
    } else if (metadata.shift.startsWith('Siang')) {
      return currentHour >= 10 && currentHour < 17
    } else if (metadata.shift.startsWith('Malam')) {
      return currentHour >= 16 || currentHour < 4
    }
    return false
  }

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
      if (merchantsRes.success && merchantsRes.data) setMerchants(merchantsRes.data)

      // Load Banjarnegara locations
      try {
        const locRes = await fetch('/banjarnegara_locations.json')
        const locData = await locRes.json()
        if (Array.isArray(locData)) {
          setLocations(locData.map((loc: any, i: number) => ({
            _id: `loc-${i}`,
            name: loc.name,
            address: loc.address.replace(/\u{000f}/gu, '').trim(),
            type: loc.category.charAt(0).toUpperCase() + loc.category.slice(1),
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
          })))
        }
      } catch (err) {
        console.error('Failed to load locations:', err)
      }
      
      if (couriersRes.success && couriersRes.data) {
        const syncedCouriers = couriersRes.data.map((courier: any) => {
          const autoActive = shouldBeActiveByShift(courier.name)
          const isOverridden = sessionStorage.getItem(`manual_override_${courier._id}`) === 'true'
          
          if (!isOverridden && courier.isActive !== autoActive) {
            toggleCourierStatus(courier._id, autoActive).catch(err => console.error("Sync error:", err))
            return { ...courier, isActive: autoActive, status: autoActive ? 'active' : 'inactive' }
          }
          return courier
        })
        setCouriers(syncedCouriers)
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCourierStatusToggle = async (courierId: string, currentActiveState: boolean) => {
    setRefreshing(true)
    sessionStorage.setItem(`manual_override_${courierId}`, 'true')
    const nextState = !currentActiveState
    const res = await toggleCourierStatus(courierId, nextState)
    if (res.success) {
      setCouriers(prev => prev.map(c => c._id === courierId ? { ...c, isActive: nextState, status: nextState ? 'active' : 'inactive' } : c))
      try {
        const logsRes = await fetchActivityLogs({ courierId })
        if (logsRes.success && logsRes.data) {
          setCourierLogs(prev => ({ ...prev, [courierId]: logsRes.data }))
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      alert('Gagal mengubah status kurir: ' + res.error)
    }
    setRefreshing(false)
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
      refreshOrderLogs(orderId)
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
      refreshOrderLogs(orderId)
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
      refreshOrderLogs(orderId)
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

  // Filter food orders — supports both orderCategory (new) and orderType (legacy)
  const regularFoodOrders = orders.filter(o => o.orderCategory === 'food' || o.orderType === 'food')
  
  // Filtering logic
  const filteredOrders = regularFoodOrders.filter(order => {
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

  const filteredCouriers = couriers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.area && c.area.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (!matchesSearch) return false

    const isCourierActive = c.status === 'active' && c.isActive
    if (courierStatusFilter === 'active' && !isCourierActive) return false
    if (courierStatusFilter === 'inactive' && isCourierActive) return false

    if (courierShiftFilter !== 'all') {
      const metadata = getCourierMetadata(c.name)
      const shiftType = metadata.shift.startsWith('Pagi') 
        ? 'pagi' 
        : metadata.shift.startsWith('Siang') 
        ? 'siang' 
        : 'malam'
      if (courierShiftFilter !== shiftType) return false
    }

    if (courierVehicleFilter !== 'all') {
      const vehicle = c.vehicleType || 'motor'
      if (courierVehicleFilter !== vehicle) return false
    }

    return true
  })

  // Stats computation
  const totalRevenue = regularFoodOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0)
    + orders
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0)

  // All-orders combined for breakdown stats (use only `orders` to avoid double-counting
  // since regularFoodOrders is already a subset of orders)
  const allOrderStatuses = orders.map(o => o.status)

  const totalPending   = allOrderStatuses.filter(s => s === 'pending').length
  const totalActive    = allOrderStatuses.filter(s => ['accepted', 'delivering', 'delivered'].includes(s)).length
  const totalCompleted = allOrderStatuses.filter(s => s === 'completed').length
  const totalCancelled = allOrderStatuses.filter(s => ['cancelled', 'problem'].includes(s)).length

  // Group by Area
  const areaDistribution: Record<string, number> = {}
  regularFoodOrders.forEach(o => {
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
            <Link
              href="/peta-anterbae"
              className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all flex items-center gap-1.5 font-bold text-xs"
              title="Buka Halaman Peta Anterbae"
            >
              <Map className="w-5 h-5" />
              <span className="hidden sm:inline">Peta Anterbae</span>
            </Link>
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
        <div className="w-full overflow-x-auto mb-8 no-scrollbar">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm gap-1 min-w-max max-w-3xl">
            <button 
              onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Package className="w-4 h-4" />
              Pesanan
            </button>
            <button 
              onClick={() => { setActiveTab('food'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'food' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Makanan
            </button>
            <button 
              onClick={() => { setActiveTab('merchants'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'merchants' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Store className="w-4 h-4" />
              Merchant
            </button>
            <button 
              onClick={() => { setActiveTab('couriers'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'couriers' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Users className="w-4 h-4" />
              Kurir
            </button>
            <button 
              onClick={() => { setActiveTab('stats'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistik
            </button>
            <button 
              onClick={() => { setActiveTab('map'); setSearchQuery(''); }}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <MapPin className="w-4 h-4" />
              Peta
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        {activeTab !== 'stats' && activeTab !== 'map' && (
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
                <p className="text-2xl font-black text-slate-900">{regularFoodOrders.length}</p>
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

            {filteredOrders.map((order) => {
              const isExpanded = !!expandedOrders[order._id]
              
              return (
                <div key={order._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Collapsed Header / Row */}
                  <div 
                    onClick={() => toggleOrderExpand(order._id)}
                    className="flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-xs font-black tracking-widest">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-400 text-xs font-bold hidden sm:inline">
                        {new Date(order._createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {order.customerName}
                      </span>
                      {order.courier?.name && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-200">
                          🛵 {order.courier.name} ({order.courier.phone})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>

                      {/* Total Amount Clickable Details Link */}
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 block uppercase leading-none">Total Pesanan</span>
                        <span className="text-sm font-black text-slate-900 hover:text-red-600 transition-colors inline-flex items-center gap-1">
                          Rp{order.totalAmount.toLocaleString('id-ID')}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-100/80 flex flex-col lg:flex-row gap-6 animate-fadeIn">
                      {/* Left Info Column */}
                      <div className="flex-grow space-y-5 min-w-0">
                        {/* Time & Category Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-slate-400 text-xs font-bold bg-slate-50 border border-slate-200/50 px-3 py-1 rounded-xl">
                            Dibuat: {new Date(order._createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-xl">
                            📦 Pesanan Reguler
                          </span>
                        </div>

                        {/* Customer & Address Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Customer Profile Card */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start justify-between">
                            <div className="space-y-3">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Pelanggan</span>
                                <h4 className="text-sm font-black text-slate-900 leading-tight">{order.customerName}</h4>
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">WhatsApp</span>
                                <a 
                                  href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl transition-all"
                                >
                                  {order.customerPhone} →
                                </a>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                              <User className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Logistics / Address Card */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start justify-between">
                            <div className="space-y-3 flex-grow">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Tujuan Pengantaran</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed pr-2">{order.deliveryAddress}</p>
                              </div>
                              {order.deliveryArea && (
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-0.5">Area Operasional</span>
                                  <span className="inline-block text-[10px] font-black bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-lg">
                                    📍 {order.deliveryArea}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 align-self-end">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 text-[9px] font-black bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
                              >
                                Peta
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Items Purchased Card */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Rincian Barang</span>
                          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                            <div className="text-sm font-bold text-slate-800 whitespace-pre-line leading-relaxed">
                              {order.items}
                            </div>
                            {order.customerNotes && (
                              <div className="text-xs text-red-600 font-bold mt-3 pt-3 border-t border-dashed border-slate-200">
                                💬 Catatan: {order.customerNotes}
                              </div>
                            )}
                          </div>
                          
                          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-500">Total Pembayaran (+Ongkir)</span>
                            <span className="text-lg font-black text-slate-900">Rp{order.totalAmount.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* History & Activity Logs Card */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Riwayat Alur Transaksi</span>
                          
                          {loadingLogs[order._id] ? (
                            <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-slate-400">
                              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                              Mengambil riwayat transaksi...
                            </div>
                          ) : orderLogs[order._id] && orderLogs[order._id].length > 0 ? (
                            <div className="relative pl-6 border-l border-slate-100 space-y-5 py-1">
                              {orderLogs[order._id].map((log: any, idx: number) => (
                                <div key={log._id || idx} className="relative text-xs space-y-1">
                                  <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-100" />
                                  <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{log.action}</span>
                                    <span className="text-slate-400">{log.actor} • {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="font-bold text-slate-600 leading-normal">{log.notes}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-slate-400 py-2">Belum ada riwayat tercatat.</p>
                          )}
                        </div>
                      </div>

                      {/* Right Actions & Logistics Column */}
                      <div className="lg:w-80 flex-shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-5">
                        <div className="space-y-5">
                          {/* Order Status Badge Details */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Status Saat Ini</span>
                            <div className="flex flex-wrap gap-2">
                              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {getStatusText(order.status)}
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 bg-slate-50 text-xs font-black uppercase tracking-wider">
                                <CreditCard className="w-3.5 h-3.5" />
                                {order.paymentMethod === 'cod' ? 'COD' : 'Transfer'}
                              </div>
                            </div>
                          </div>

                          {/* Actions buttons */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Atur Status</span>
                            <div className="grid grid-cols-2 gap-2">
                              {order.status === 'pending' && (
                                <button 
                                  onClick={() => handleStatusChange(order._id, 'accepted')}
                                  className="flex items-center justify-center gap-1 bg-green-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-green-700 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Terima
                                </button>
                              )}
                              {['pending', 'accepted', 'delivering'].includes(order.status) && (
                                <button 
                                  onClick={() => handleStatusChange(order._id, 'completed')}
                                  className="flex items-center justify-center gap-1 bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                                </button>
                              )}
                              {order.status !== 'cancelled' && (
                                <button 
                                  onClick={() => handleStatusChange(order._id, 'cancelled')}
                                  className="flex items-center justify-center gap-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Batal
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Courier Assignment */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Tunjuk Mitra Kurir</span>
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
                              <p className="text-[10px] text-red-600 font-black uppercase tracking-wider animate-pulse">
                                🚨 Kurir: {order.courier.name} ({order.courier.phone})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

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
          <div className="space-y-4">
            {filteredMerchants.map((merchant) => {
              const isExpanded = !!expandedMerchants[merchant._id]
              
              // Calculate level stats dynamically
              const merchantOrders = foodOrders.filter(o => o.restaurantName?.toLowerCase().trim() === merchant.name.toLowerCase().trim())
              const ordersCount = merchantOrders.length
              
              let level = 'Standar'
              let levelColor = 'bg-slate-50 text-slate-700 border-slate-200'
              if (ordersCount >= 11 && ordersCount <= 50) {
                level = 'Istimewa'
                levelColor = 'bg-amber-50 text-amber-700 border-amber-200'
              } else if (ordersCount >= 51 && ordersCount <= 1000) {
                level = 'Luar Biasa'
                levelColor = 'bg-red-50 text-red-700 border-red-200'
              }

              return (
                <div key={merchant._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Collapsed Header */}
                  <div 
                    onClick={() => toggleMerchantExpand(merchant._id)}
                    className="flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo thumbnail */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-red-50/30 flex items-center justify-center flex-shrink-0">
                        {merchant.logoUrl ? (
                          <img src={merchant.logoUrl} alt={merchant.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight flex items-center gap-1.5">
                          {merchant.name}
                          {merchant.isVerified && (
                            <span className="text-[10px] text-blue-600" title="Terverifikasi">🛡️</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {merchant.category === 'food' ? '🍔 Makanan' : merchant.category === 'grocery' ? '🛒 Sembako' : merchant.category === 'health' ? '💊 Apotek' : '📦 Lainnya'}
                          </p>
                          <span className="text-[9px] text-slate-300">•</span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${levelColor}`}>
                            🏆 {level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${merchant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {merchant.isOpen ? '● Buka' : '● Tutup'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 animate-fadeIn">
                      {/* Large Merchant Logo */}
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 mx-auto md:mx-0 shadow-inner flex items-center justify-center">
                        {merchant.logoUrl ? (
                          <img src={merchant.logoUrl} alt={merchant.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-12 h-12 text-red-500/80" />
                        )}
                      </div>

                      {/* Merchant Metadata & Info */}
                      <div className="flex-grow space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Address, Hours & Owner */}
                          <div className="space-y-2.5">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Nama Pemilik Toko</span>
                              <p className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                <span>👤</span> {merchant.ownerName || 'Belum diatur (Edit profil di Sanity)'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Alamat Lengkap</span>
                              <p className="text-xs font-bold text-slate-700 leading-normal flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                {merchant.address || 'Belum set alamat.'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Jam Operasional</span>
                              <p className="text-xs font-bold text-slate-700">🕒 {merchant.openHours || 'Tidak ditentukan.'}</p>
                            </div>
                          </div>

                          {/* Contact, Category, and Level Info */}
                          <div className="space-y-2.5">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Level Kemitraan (Total Transaksi: {ordersCount})</span>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${levelColor}`}>
                                  🏆 {level}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  {ordersCount <= 10 ? `(Butuh ${11 - ordersCount} lagi untuk naik ke Istimewa)` : ordersCount <= 50 ? `(Butuh ${51 - ordersCount} lagi untuk naik ke Luar Biasa)` : '(Level Tertinggi 🎉)'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Kontak WhatsApp Merchant</span>
                              {merchant.phone ? (
                                <a 
                                  href={`https://wa.me/${merchant.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  {merchant.phone} →
                                </a>
                              ) : (
                                <p className="text-xs text-slate-400 font-bold">-</p>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Deskripsi Singkat Toko</span>
                              <p className="text-xs font-bold text-slate-600 leading-normal italic">
                                "{merchant.description || 'Tidak ada deskripsi.'}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Merchant logs / Activity timeline */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/70">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Riwayat Kegiatan Merchant</span>
                          {loadingMerchantLogs[merchant._id] ? (
                            <div className="flex items-center justify-center py-4 gap-2 text-xs font-bold text-slate-400">
                              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                              Memuat riwayat kegiatan...
                            </div>
                          ) : merchantLogs[merchant._id] && merchantLogs[merchant._id].length > 0 ? (
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                              {merchantLogs[merchant._id].map((log: any, idx: number) => (
                                <div key={log._id || idx} className="text-xs border-l-2 border-slate-200 pl-2.5 py-0.5">
                                  <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                                    <span>{log.action}</span>
                                    <span>{new Date(log.timestamp).toLocaleDateString('id-ID')} {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="font-bold text-slate-600 mt-0.5">{log.notes}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] font-bold text-slate-400 py-1">Belum ada riwayat kegiatan merchant terekam.</p>
                          )}
                        </div>

                        {/* Mini Map Lokasi Merchant */}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">📍 Lokasi di Peta</span>
                          <PetaMiniMerchant
                            latitude={merchant.latitude}
                            longitude={merchant.longitude}
                            merchantName={merchant.name}
                            category={merchant.category}
                            isOpen={merchant.isOpen}
                          />
                        </div>

                        {/* Edit profile link */}
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <a 
                            href={`/studio/intent/edit/id=${merchant._id};type=merchant`} 
                            target="_blank"
                            className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors text-xs shadow-sm"
                          >
                            Edit Profil Toko <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

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
                {foodOrders.map((order) => {
                  const isExpanded = !!expandedOrders[order._id]
                  
                  return (
                    <div key={order._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                      {/* Collapsed Header / Row */}
                      <div 
                        onClick={() => toggleOrderExpand(order._id)}
                        className="flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-widest ${
                            order.foodOrderStatus === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : (order.foodOrderStatus === 'confirmed_resto_prep' ||
                                 order.foodOrderStatus === 'resto_ready_waiting_courier' ||
                                 order.foodOrderStatus === 'courier_picking' ||
                                 order.foodOrderStatus === 'delivering')
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-red-600 text-white'
                          }`}>
                            {order.orderNumber}
                          </span>
                          <span className="text-slate-400 text-xs font-bold hidden sm:inline">
                            {new Date(order._createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            {order.restaurantName} (Resto)
                          </span>
                          {order.courier?.name && (
                            <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-200">
                              🛵 {order.courier.name} ({order.courier.phone})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black ${
                            order.foodOrderStatus === 'waiting_payment' || order.foodOrderStatus === 'waiting_admin_confirm' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            order.foodOrderStatus === 'confirmed_resto_prep' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            order.foodOrderStatus === 'resto_ready_waiting_courier' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            order.foodOrderStatus === 'courier_picking' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            order.foodOrderStatus === 'delivering' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                            order.foodOrderStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
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

                          {/* Total Amount Clickable Details Link */}
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 block uppercase leading-none">Total Pesanan</span>
                            <span className="text-sm font-black text-slate-900 hover:text-red-600 transition-colors inline-flex items-center gap-1">
                              Rp{order.totalAmount.toLocaleString('id-ID')}
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content Details */}
                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t border-slate-100/80 space-y-5 animate-fadeIn">
                          {/* Info Card Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Merchant & Customer Profiles */}
                            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Restoran</span>
                                <h4 className="text-sm font-black text-slate-900 leading-tight inline-flex items-center gap-1.5">
                                  <Store className="w-4 h-4 text-red-500" />
                                  {order.restaurantName}
                                </h4>
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Pelanggan</span>
                                <h4 className="text-sm font-black text-slate-900 leading-tight">{order.customerName}</h4>
                                <a 
                                  href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] font-black text-green-600 hover:text-green-700 hover:underline mt-1 inline-block"
                                >
                                  💬 Chat WA →
                                </a>
                              </div>
                            </div>

                            {/* Delivery Location Profile */}
                            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start justify-between">
                              <div className="space-y-2 flex-grow">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Alamat Penerima</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed pr-2">{order.deliveryAddress}</p>
                              </div>
                              {order.customerLocation && (
                                <a 
                                  href={`https://www.openstreetmap.org/?mlat=${order.customerLocation.lat}&mlon=${order.customerLocation.lng}#map=18/${order.customerLocation.lat}/${order.customerLocation.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1 text-[9px] font-black bg-slate-950 hover:bg-slate-800 text-white px-3 py-2 rounded-xl transition-all shadow-sm self-start"
                                >
                                  📍 Navigasi
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Menu / Order Items Invoice style */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Menu Yang Dipesan</span>
                            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/70 space-y-2">
                              {order.foodItems?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                                  <span className="text-slate-700 font-bold">
                                    {item.name} <span className="text-red-500 font-black">x{item.quantity}</span>
                                    {item.notes && <span className="text-slate-400 font-medium block text-[10px] mt-0.5">💬 Catatan: {item.notes}</span>}
                                  </span>
                                  <span className="font-black text-slate-900">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                              <span className="text-xs font-black text-slate-500">Total Pembayaran (+Ongkir)</span>
                              <span className="text-xl font-black text-red-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                          </div>

                          {/* Payment Flow Info (if any) */}
                          {order.paymentFlow && (
                            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Aliran Pembayaran Digital</span>
                              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                  <p className="text-xs text-slate-500">Metode Pengiriman Pembayaran</p>
                                  <p className="text-sm font-black text-blue-900">{order.paymentFlow.accountNumber} a.n. {order.paymentFlow.accountName}</p>
                                </div>
                                <div className="text-left md:text-right">
                                  <p className="text-xs text-slate-500">Status Lunas</p>
                                  <span className={`inline-block text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                                    order.paymentFlow.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                  }`}>
                                    {order.paymentFlow.paymentStatus === 'confirmed' ? 'Lunas / Terverifikasi' : 'Menunggu Konfirmasi'}
                                  </span>
                                  {order.paymentFlow.confirmedAt && (
                                    <p className="text-[10px] text-slate-400 mt-1">Diverifikasi: {new Date(order.paymentFlow.confirmedAt).toLocaleString('id-ID')}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* History & Activity Logs Card */}
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Linimasa Aktivitas Pesanan Makanan</span>
                            
                            {loadingLogs[order._id] ? (
                              <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                Mengambil riwayat transaksi...
                              </div>
                            ) : orderLogs[order._id] && orderLogs[order._id].length > 0 ? (
                              <div className="relative pl-6 border-l border-slate-100 space-y-5 py-1">
                                {orderLogs[order._id].map((log: any, idx: number) => (
                                  <div key={log._id || idx} className="relative text-xs space-y-1">
                                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-100" />
                                    <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                                      <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{log.action}</span>
                                      <span className="text-slate-400">{log.actor} • {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="font-bold text-slate-600 leading-normal">{log.notes}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs font-bold text-slate-400 py-2">Belum ada riwayat log tercatat.</p>
                            )}
                          </div>

                          {/* Quick Admin Actions & Courier Select Panel */}
                          <div className="bg-slate-50/60 rounded-3xl p-5 border border-slate-100 flex flex-col md:flex-row items-stretch justify-between gap-6">
                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2.5 flex-1">
                              {order.foodOrderStatus === 'waiting_payment' && (
                                <button
                                  onClick={() => {
                                    const confirm = window.confirm(`Konfirmasi pembayaran untuk ${order.orderNumber}?\n\nResto dan kurir akan dinotifikasi.`)
                                    if (confirm) {
                                      handleFoodPaymentConfirm(order._id, order.orderNumber, order.restaurantName, order.customerPhone, order.totalAmount)
                                    }
                                  }}
                                  className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-black text-xs hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" /> Konfirmasi Pembayaran
                                </button>
                              )}
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 bg-green-50 border border-green-100 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors flex items-center gap-2"
                              >
                                <Phone className="w-4 h-4" /> WA Pelanggan
                              </a>
                              <a
                                href={`/studio/intent/edit/id=${order._id};type=order`}
                                target="_blank"
                                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors flex items-center gap-2"
                              >
                                Edit di Sanity Studio
                              </a>
                            </div>

                            {/* Courier assignment dropdown */}
                            <div className="w-full md:w-80 space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Tunjuk Driver / Kurir</span>
                              <div className="flex gap-2">
                                <select
                                  value={order.courier?._id || ''}
                                  onChange={(e) => handleCourierAssign(order._id, e.target.value)}
                                  className={`flex-1 bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-600 ${
                                    order.courier ? 'border-red-200 bg-red-50/20' : 'border-slate-200'
                                  }`}
                                >
                                  <option value="">-- Pilih Kurir --</option>
                                  {couriers.filter(c => c.isActive).map(c => (
                                    <option key={c._id} value={c._id}>
                                      {c.name} ({c.phone})
                                    </option>
                                  ))}
                                </select>
                                {order.courier && (
                                  <a 
                                    href={`https://wa.me/${order.courier.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Halo ${order.courier.name}, ada tugas pengantaran makanan!\n\nNomor Order: ${order.orderNumber}\nRestoran: ${order.restaurantName}\nTotal Tagihan: Rp ${order.totalAmount.toLocaleString('id-ID')}\nAlamat Pengantaran: ${order.deliveryAddress}\n\nSilakan buka Portal Kurir untuk menerima tugas ini.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                                  >
                                    Kirim Perintah
                                  </a>
                                )}
                              </div>
                              {order.courier && (
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-wider animate-pulse">
                                  🚨 Driver Bertugas: {order.courier.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COURIERS */}
        {activeTab === 'couriers' && (
          <div className="space-y-6">
            {/* Filters Toolbar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
              {/* Courier Status Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Status Aktif</label>
                <select
                  value={courierStatusFilter}
                  onChange={(e) => setCourierStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">🟢 Aktif</option>
                  <option value="inactive">⚪ Libur / Non-Aktif</option>
                </select>
              </div>

              {/* Courier Shift Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Shift Kerja</label>
                <select
                  value={courierShiftFilter}
                  onChange={(e) => setCourierShiftFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                >
                  <option value="all">Semua Shift</option>
                  <option value="pagi">🌅 Shift Pagi (07:00 - 12:00)</option>
                  <option value="siang">☀️ Shift Siang (10:00 - 17:00)</option>
                  <option value="malam">🌙 Shift Malam (16:00 - Pagi)</option>
                </select>
              </div>

              {/* Courier Vehicle Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Jenis Kendaraan</label>
                <select
                  value={courierVehicleFilter}
                  onChange={(e) => setCourierVehicleFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                >
                  <option value="all">Semua Kendaraan</option>
                  <option value="motor">🛵 Sepeda Motor</option>
                  <option value="mobil">🚗 Mobil</option>
                </select>
              </div>
            </div>

            {/* Couriers List */}
            <div className="space-y-4">
              {filteredCouriers.map((courier) => {
                const isExpanded = !!expandedCouriers[courier._id]
                const metadata = getCourierMetadata(courier.name)
                
                return (
                  <div key={courier._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    {/* Collapsed Header / Row */}
                    <div 
                      onClick={() => toggleCourierExpand(courier._id)}
                      className="flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                          <img 
                            src={getCourierProfilePic(courier.name)} 
                            alt={courier.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{courier.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">🛵 {courier.vehicleType === 'motor' ? 'Motor' : 'Mobil'}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${metadata.color}`}>
                          Shift: {metadata.shift}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${courier.status === 'active' && courier.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {courier.status === 'active' && courier.isActive ? '● Aktif' : '● Libur'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>

                    {/* Expanded Content Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 animate-fadeIn">
                        {/* Large Profile Photo */}
                        <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 mx-auto md:mx-0 shadow-inner">
                          <img 
                            src={getCourierProfilePic(courier.name)} 
                            alt={courier.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Driver Metadata & Info */}
                        <div className="flex-grow space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Alamat Tempat Tinggal</span>
                                <p className="text-xs font-bold text-slate-700 leading-normal flex items-start gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                  {metadata.address}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Jadwal Tugas (Shift)</span>
                                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${metadata.color}`}>
                                  {metadata.shift}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Kontak Driver</span>
                                <a 
                                  href={`https://wa.me/${courier.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  {courier.phone} →
                                </a>
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Cakupan Area Kerja</span>
                                <p className="text-xs font-bold text-slate-700">📍 {courier.area || 'Banjarnegara'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Courier logs / Activity timeline */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/70">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Riwayat Tugas Driver</span>
                            {loadingCourierLogs[courier._id] ? (
                              <div className="flex items-center justify-center py-4 gap-2 text-xs font-bold text-slate-400">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                Memuat riwayat tugas...
                              </div>
                            ) : courierLogs[courier._id] && courierLogs[courier._id].length > 0 ? (
                              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                {courierLogs[courier._id].map((log: any, idx: number) => (
                                  <div key={log._id || idx} className="text-xs border-l-2 border-slate-200 pl-2.5 py-0.5">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                                      <span>{log.action}</span>
                                      <span>{new Date(log.timestamp).toLocaleDateString('id-ID')} {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="font-bold text-slate-600 mt-0.5">{log.notes}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] font-bold text-slate-400 py-1">Belum ada riwayat pengantaran atau tugas terekam.</p>
                            )}
                          </div>

                          {/* Action buttons (Manual toggle & Edit button) */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleCourierStatusToggle(courier._id, courier.status === 'active' && courier.isActive)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border ${
                                  courier.status === 'active' && courier.isActive
                                    ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {courier.status === 'active' && courier.isActive ? (
                                  <>🛑 Istirahatkan Manual</>
                                ) : (
                                  <>⚡ Aktifkan Manual (Bantu Overload)</>
                                )}
                              </button>
                              {sessionStorage.getItem(`manual_override_${courier._id}`) === 'true' && (
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                                  ⚙️ Status Di-override Admin
                                </span>
                              )}
                            </div>
                            <a 
                              href={`/studio/intent/edit/id=${courier._id};type=courier`} 
                              target="_blank"
                              className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors text-xs shadow-sm"
                            >
                              Edit Profil di Sanity Studio <ChevronRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredCouriers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                  <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-800">Kurir Tidak Ditemukan</h3>
                  <p className="text-slate-500 font-bold mt-2">Cari nama kurir, shift, atau jenis kendaraan yang lain.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STATISTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Analytics Dashboard */}
            <StatistikAdmin orders={orders} merchants={merchants} couriers={couriers} />
          </div>
        )}

        {/* TAB 5: PETA ANTERBAE */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Live Courier Tracking Map */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-red-600 animate-bounce" />
                Live Tracking Posisi Kurir
              </h3>
              <PetaKurir 
                couriers={couriers} 
                merchants={merchants} 
                locations={locations} 
                onRefresh={() => loadAllData(true)} 
              />
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
            {regularFoodOrders.map((order) => (
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
