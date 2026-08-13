'use client'

import { ArrowLeft, MapPin, Clock, Phone, User, CheckCircle, Loader2, X, Navigation } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'

interface Customer {
  _id: string
  name: string
  phone: string
  address: string
}

const pickupLocations = [
  { id: 1, name: 'Pasar Banjarnegara', address: 'Jl. Ahmad Yani', type: 'Pasar', lat: -7.3940, lng: 109.7008 },
  { id: 2, name: 'Polres Banjarnegara', address: 'Jl. Jend. Sudirman', type: 'Keamanan', lat: -7.3962, lng: 109.6943 },
  { id: 3, name: 'RSUD Banjarnegara', address: 'Jl. Dr. Moestopo', type: 'Rumah Sakit', lat: -7.3929, lng: 109.6928 },
  { id: 4, name: 'Stasiun Banjarnegara', address: 'Jl. Stasiun No. 1', type: 'Transportasi', lat: -7.3979, lng: 109.6541 },
  { id: 5, name: 'Mal Pelayanan Publik (MPP)', address: 'Jl. Dipayuda No. 15C', type: 'Pemerintahan', lat: -7.3962, lng: 109.6943 },
  { id: 6, name: 'Kantor Bupati / Setda', address: 'Jl. Dipayuda', type: 'Pemerintahan', lat: -7.3962, lng: 109.6943 },
  { id: 7, name: 'Alun-Alun Banjarnegara', address: 'Jl. Jend. Sudirman', type: 'Pemerintahan', lat: -7.3972, lng: 109.6964 },
  { id: 8, name: 'Taman Rekreasi Margasatwa Serulingmas', address: 'Jl. Letjen Supriyo', type: 'Rekreasi', lat: -7.3884, lng: 109.6910 },
  { id: 9, name: 'Surya Yudha Waterpark', address: 'Jl. Raya Banjarnegara', type: 'Rekreasi', lat: -7.3884, lng: 109.6910 },
  { id: 10, name: 'Masjid Agung An-Nuur Kauman', address: 'Jl. K.H. Ahmad Dahlan No.8', type: 'Ibadah', lat: -7.3963, lng: 109.6943 },
  { id: 11, name: 'BCA KCP Banjarnegara', address: 'Jl. Pemuda No.72', type: 'Perbankan', lat: -7.3971, lng: 109.6965 },
  { id: 12, name: 'SMAN 1 Banjarnegara', address: 'Jl. Dr. Soetomo', type: 'Kampus', lat: -7.3998, lng: 109.6847 },
  { id: 13, name: 'Alfamart Alun Alun', address: 'Jl. Pemuda', type: 'Perbankan', lat: -7.3972, lng: 109.6964 },
  { id: 14, name: 'APOTEK AEESHA FARMA', address: 'Jl. Ps. Manis, Punggelan', type: 'Rumah Sakit', lat: -7.3516, lng: 109.5813 },
  { id: 15, name: 'PUSKESMAS Lengkong', address: 'Depok, Lengkong, Rakit', type: 'Kampus', lat: -7.3949, lng: 109.5735 },
]

export default function AntarJemputPage() {
  // Step 1: Phone input
  const [phone, setPhone] = useState('')
  const [checkingPhone, setCheckingPhone] = useState(false)

  // Step 2: Registration (if new user)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [regName, setRegName] = useState('')
  const [regAddress, setRegAddress] = useState('')
  const [showRegister, setShowRegister] = useState(false)

  // Step 3: Order form
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [time, setTime] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // GPS location state
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showGpsConfirm, setShowGpsConfirm] = useState(false)

  // Check phone on change
  const checkPhone = useCallback(async (value: string) => {
    const phoneOnly = value.replace(/[^0-9]/g, '')
    if (phoneOnly.length < 10) return

    setCheckingPhone(true)
    try {
      const formattedPhone = phoneOnly.startsWith('0') ? '62' + phoneOnly.slice(1) : phoneOnly
      const res = await fetch(`/api/antar-jemput/check-phone?phone=${formattedPhone}`)
      const data = await res.json()

      if (data.registered && data.customer) {
        setIsRegistered(true)
        setCustomer(data.customer)
        setRegName(data.customer.name)
        setRegAddress(data.customer.address)
        setPickup(data.customer.address || '')
        setShowRegister(false)
      } else {
        setIsRegistered(false)
        setShowRegister(true)
      }
    } catch (err) {
      console.error('Error checking phone:', err)
    } finally {
      setCheckingPhone(false)
    }
  }, [])

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    const timeout = setTimeout(() => checkPhone(value), 500)
    return () => clearTimeout(timeout)
  }

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

  const handleSubmit = async () => {
    if (!pickup || !dropoff || !time) return

    setSubmitting(true)
    try {
      const formattedPhone = phone.replace(/[^0-9]/g, '')
      const finalPhone = formattedPhone.startsWith('0') ? '62' + formattedPhone.slice(1) : formattedPhone

      const res = await fetch('/api/antar-jemput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: regName,
          customerPhone: finalPhone,
          pickupAddress: pickup,
          dropoffAddress: dropoff,
          pickupTime: time,
          isRegistered,
          address: regAddress,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setOrderNumber(data.orderNumber)
        setShowSuccess(true)
      }
    } catch (err) {
      console.error('Error submitting order:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimeForDisplay = (isoString: string) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
        {/* Phone Input */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            No. WhatsApp
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {checkingPhone && (
              <Loader2 className="w-4 h-4 text-red-500 absolute right-3 top-3 animate-spin" />
            )}
          </div>
          {isRegistered && customer && (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-bold">
              <CheckCircle className="w-3 h-3" />
              Akun terdaftar: {customer.name}
            </div>
          )}
        </div>

        {/* Registration Form (if new user) */}
        {showRegister && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
              Data Diri
            </label>
            <div className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  placeholder="Alamat lengkap"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pickup Location */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Lokasi Jemput
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-3" />
            <input
              type="text"
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              placeholder="Masukkan lokasi jemput"
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

        {/* Dropoff Location */}
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

        {/* Pickup Time */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Waktu Jemput
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="datetime-local"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                const offset = now.getTimezoneOffset()
                const local = new Date(now.getTime() - offset * 60000)
                setTime(local.toISOString().slice(0, 16))
              }}
              className="absolute right-2 top-1.5 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              Sekarang
            </button>
          </div>
        </div>

        {/* Quick Locations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-black text-gray-900 mb-3">Lokasi Cepat</h3>
          <div className="space-y-2">
            {pickupLocations.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  if (loc.lat != null && loc.lng != null) {
                    setPickup(`${loc.name} - GPS: ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`)
                  } else {
                    setPickup(loc.name)
                  }
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black ${
                  loc.type === 'Kampus' ? 'bg-blue-500' :
                  loc.type === 'Transportasi' ? 'bg-purple-500' :
                  loc.type === 'Rumah Sakit' ? 'bg-red-500' :
                  loc.type === 'Pasar' ? 'bg-orange-500' :
                  loc.type === 'Keamanan' ? 'bg-indigo-500' :
                  loc.type === 'Pemerintahan' ? 'bg-yellow-500' :
                  loc.type === 'Rekreasi' ? 'bg-cyan-500' :
                  loc.type === 'Ibadah' ? 'bg-emerald-500' :
                  loc.type === 'Hiburan' ? 'bg-pink-500' :
                  loc.type === 'Perbankan' ? 'bg-teal-500' :
                  'bg-gray-500'
                }`}>
                  {loc.type.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{loc.name}</p>
                  <p className="text-xs text-gray-400 truncate">{loc.address}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !pickup || !dropoff || !time}
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-2">Pesanan Berhasil!</h2>
              <p className="text-sm text-gray-500 mb-1">Nomor Pesanan:</p>
              <p className="text-xl font-black text-red-600 mb-4">{orderNumber}</p>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Pesanan Anda sudah masuk. Driver akan menghubungi Anda via WhatsApp untuk konfirmasi.
              </p>

              <div className="space-y-2">
                <Link
                  href={`/m/antar-jemput/confirm?order=${orderNumber}`}
                  className="block w-full bg-red-600 text-white font-black py-3 rounded-xl active:scale-95 transition-transform"
                >
                  Konfirmasi Pengantaran
                </Link>
                <Link
                  href="/m"
                  className="block w-full text-gray-400 font-bold py-3 rounded-xl text-center text-sm"
                >
                  Kembali ke Beranda
                </Link>
              </div>
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
