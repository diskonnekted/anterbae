'use client'

import { ArrowLeft, MapPin, Clock, Phone, User, CheckCircle, Loader2, X, Navigation, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import rawLocations from '../../../../banjarnegara_locations.json'

const pickupLocations = (rawLocations as any[]).map((item, index) => {
  const cleanAddr = item.address
    ? item.address.replace(/[^\x20-\x7E]/g, '').replace(/^\s+/, '').trim()
    : ''
  return {
    id: index + 1,
    name: item.name,
    address: cleanAddr,
    lat: item.latitude ? parseFloat(item.latitude) : null,
    lng: item.longitude ? parseFloat(item.longitude) : null,
  }
})

export default function AntarJemputPage() {
  const router = useRouter()
  
  // App state
  const [adminPhone, setAdminPhone] = useState('6281328128315')
  const [isLoaded, setIsLoaded] = useState(false)

  // Form states
  const [phone, setPhone] = useState('')
  const [regName, setRegName] = useState('')
  const [quickPickup, setQuickPickup] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // GPS location state
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showGpsConfirm, setShowGpsConfirm] = useState(false)

  // Load saved details from localStorage on mount and fetch settings
  useEffect(() => {
    const savedName = localStorage.getItem('anterbae_customer_name')
    const savedPhone = localStorage.getItem('anterbae_customer_phone')
    const savedQuickPickup = localStorage.getItem('anterbae_delivery_quick_pickup')
    const savedPickup = localStorage.getItem('anterbae_delivery_pickup')
    const savedDropoff = localStorage.getItem('anterbae_delivery_dropoff')
    
    if (savedName) setRegName(savedName)
    if (savedPhone) setPhone(savedPhone)
    if (savedQuickPickup) setQuickPickup(savedQuickPickup)
    if (savedPickup) setPickup(savedPickup)
    if (savedDropoff) setDropoff(savedDropoff)

    // Fetch settings from Sanity
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings && data.settings.adminPhone) {
          setAdminPhone(data.settings.adminPhone)
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))

    setIsLoaded(true)
  }, [])

  // Auto-save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_customer_name', regName)
    }
  }, [regName, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_customer_phone', phone)
    }
  }, [phone, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_delivery_quick_pickup', quickPickup)
    }
  }, [quickPickup, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_delivery_pickup', pickup)
    }
  }, [pickup, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_delivery_dropoff', dropoff)
    }
  }, [dropoff, isLoaded])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation')
      return
    }

    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setGpsCoords({ lat, lng })
        setGpsLoading(false)
        setShowGpsConfirm(true)
      },
      (error) => {
        setGpsLoading(false)
        const messages = {
          1: 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.',
          2: 'Lokasi tidak ditemukan. Pastikan GPS aktif.',
          3: 'Timeout mendapatkan lokasi. Coba lagi.',
        }
        alert(messages[error.code as keyof typeof messages] || 'Gagal mendapatkan lokasi')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const useGpsLocation = () => {
    if (gpsCoords) {
      const address = `GPS: ${gpsCoords.lat.toFixed(6)}, ${gpsCoords.lng.toFixed(6)}`
      setPickup(address)
      setShowGpsConfirm(false)
      setGpsCoords(null)
    }
  }

  const getCombinedPickup = () => {
    if (quickPickup && pickup.trim()) {
      return `${quickPickup} (Detail: ${pickup})`
    }
    return quickPickup || pickup
  }

  const getWhatsAppLink = (ordNum: string) => {
    const finalPickup = getCombinedPickup()
    const waMessage = `*🛵 PESANAN PENGANTARAN (ANTERBAE)*\n\n` +
      `*Kode Pesanan:* ${ordNum}\n\n` +
      `*Detail Pemesan:*\n` +
      `👤 Nama: ${regName}\n` +
      `📞 WA: ${phone}\n\n` +
      `*Rincian Pengantaran:*\n` +
      `📍 Lokasi Jemput: ${finalPickup}\n` +
      `🏁 Lokasi Tujuan: ${dropoff}\n\n` +
      `Terima kasih! Silakan proses pengantaran saya.`

    const targetAdminPhone = adminPhone.replace(/\D/g, '') || '6281328128315'
    return `https://wa.me/${targetAdminPhone}?text=${encodeURIComponent(waMessage)}`
  }

  const handleSubmit = async () => {
    const finalPickup = getCombinedPickup()
    if (!finalPickup.trim() || !dropoff.trim() || !regName.trim() || !phone.trim()) {
      alert('Silakan lengkapi seluruh data Anda terlebih dahulu.')
      return
    }

    setSubmitting(true)
    
    // Generate order number
    const rand = Math.floor(100 + Math.random() * 900)
    const generatedOrderNumber = `ANTJ-${Date.now().toString().slice(-6)}${rand}`
    setOrderNumber(generatedOrderNumber)

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '')
      const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone

      // Open WhatsApp immediately to avoid browser popup blockers
      const waLink = getWhatsAppLink(generatedOrderNumber)
      window.open(waLink, '_blank')
      setShowSuccess(true)

      // Send POST request to backend API in the background to store the order in Sanity
      fetch('/api/antar-jemput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: regName,
          customerPhone: finalPhone,
          pickupAddress: finalPickup,
          dropoffAddress: dropoff,
          pickupTime: new Date().toISOString(), // Defaulting pickup time to now since date is removed from UI
          isRegistered: false,
          address: dropoff, // using destination as fallback address
        }),
      }).catch(err => {
        console.error('Error saving order to database in background:', err)
      })

    } catch (err) {
      console.error('Error submitting order:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Pengantaran</h1>
            <p className="text-xs text-gray-400 font-medium">Isi form, driver akan menghubungi Anda</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Personal Data Section & Pickup */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              No. WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Locations Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Lokasi Cepat Penjemputan
            </label>
            <div className="relative">
              <select
                value={quickPickup}
                onChange={(e) => {
                  const val = e.target.value
                  if (!val) {
                    setQuickPickup('')
                    return
                  }
                  const loc = pickupLocations.find(l => l.id.toString() === val)
                  if (loc) {
                    if (loc.lat != null && loc.lng != null) {
                      setQuickPickup(`${loc.name} - GPS: ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`)
                    } else {
                      setQuickPickup(loc.name)
                    }
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
              >
                <option value="">-- Pilih Lokasi Cepat Penjemputan --</option>
                {pickupLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.address})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Pickup Location Detail (manual isian) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Detail Penjemputan
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-3" />
              <input
                type="text"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                placeholder="Masukkan detail lokasi jemput secara manual"
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className="absolute right-2 top-1.5 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-1"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                Pin Saya
              </button>
            </div>
          </div>
        </div>

        {/* Dropoff Location Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Tujuan
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-green-500 absolute left-3 top-3" />
            <input
              type="text"
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              placeholder="Masukkan lokasi tujuan"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || (!quickPickup && !pickup) || !dropoff}
          className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl text-center active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Pesan Pengantaran
            </>
          )}
        </button>
      </div>

      {/* Success Modal / Redirect Info */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">Pesanan Dialihkan ke WA</h2>
            <p className="text-sm text-gray-500 mb-1">Nomor Pesanan:</p>
            <p className="text-xl font-black text-red-600 mb-4">{orderNumber}</p>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Detail pesanan Anda sedang dikirimkan melalui WhatsApp. Driver/Admin akan segera menghubungi Anda.
            </p>

            <div className="space-y-2">
              <a
                href={getWhatsAppLink(orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white font-black py-3 rounded-xl active:scale-95 transition-transform text-center"
              >
                Kirim Ulang via WhatsApp
              </a>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.close();
                    router.push('/m');
                  }
                }}
                className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-center text-sm"
              >
                Tutup Halaman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GPS Confirm Modal */}
      {showGpsConfirm && gpsCoords && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-2">Lokasi Terdeteksi</h2>
              <p className="text-sm text-gray-500 mb-1">Koordinat GPS:</p>
              <p className="text-sm font-mono font-bold text-gray-700 mb-1">
                {gpsCoords.lat.toFixed(6)}
              </p>
              <p className="text-sm font-mono font-bold text-gray-700 mb-4">
                {gpsCoords.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Apakah ini lokasi jemput yang benar?
              </p>

              <div className="space-y-2">
                <button
                  onClick={useGpsLocation}
                  className="block w-full bg-blue-600 text-white font-black py-3 rounded-xl active:scale-95 transition-transform"
                >
                  Pakai Lokasi Saya
                </button>
                <button
                  onClick={() => { setShowGpsConfirm(false); setGpsCoords(null) }}
                  className="block w-full text-gray-400 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
