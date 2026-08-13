'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { fetchCouriers, fetchMerchants } from '@/app/actions/admin'
import { Bike, ArrowLeft, RefreshCw, Map } from 'lucide-react'

const PetaKurir = dynamic(() => import('@/components/PetaKurir'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center text-slate-400 font-bold">
      Memuat Peta Live Kurir Anterbae...
    </div>
  )
})

export default function PetaAnterbaePage() {
  const [couriers, setCouriers] = useState<any[]>([])
  const [merchants, setMerchants] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true)
    else setRefreshing(true)

    try {
      const [couriersRes, merchantsRes] = await Promise.all([
        fetchCouriers(),
        fetchMerchants()
      ])

      if (couriersRes.success && couriersRes.data) {
        setCouriers(couriersRes.data)
      }
      if (merchantsRes.success && merchantsRes.data) {
        setMerchants(merchantsRes.data)
      }
    } catch (err) {
      console.error('Failed to load map data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load locations once
  useEffect(() => {
    const loadLocations = async () => {
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
    }
    
    loadLocations()
    loadData()
  }, [])

  // Auto-refresh every 20 seconds for live tracking
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true)
    }, 20000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin" 
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-all border border-transparent hover:border-slate-200/80"
              title="Kembali ke Dasbor Admin"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Peta Anterbae</h1>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Live Tracking & Lokasi Merchant</p>
            </div>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 hover:border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Memperbarui...' : 'Perbarui'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-bold">Memuat data peta...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <Bike className="w-5 h-5 text-blue-600 animate-bounce" />
                  Live Tracking Posisi Kurir
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">Memantau pergerakan kurir aktif dan lokasi merchant pendukung secara real-time.</p>
              </div>
            </div>

            <div className="flex-1 min-h-[550px] relative w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner">
              <PetaKurir 
                couriers={couriers} 
                merchants={merchants} 
                locations={locations} 
                onRefresh={() => loadData(true)} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
