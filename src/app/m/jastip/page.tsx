'use client'

import { ArrowLeft, MapPin, Clock, Phone, User, CheckCircle, Loader2, X, Navigation, ChevronDown, Gift } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { client } from '@/sanity/lib/client'
import locationsData from '../../../../banjarnegara_locations.json'

interface LocationItem {
  name: string
  address: string
  latitude?: string
  longitude?: string
  category?: string
}

export default function MobileJastipPage() {
  const router = useRouter()
  
  // App state
  const [adminPhone, setAdminPhone] = useState('6281328128315')
  const [isLoaded, setIsLoaded] = useState(false)
  const [verifiedMerchants, setVerifiedMerchants] = useState<LocationItem[]>([])

  // Form states
  const [phone, setPhone] = useState('')
  const [regName, setRegName] = useState('')
  const [regAddress, setRegAddress] = useState('')
  
  // Store Selection states
  const [storeQuery, setStoreQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState<LocationItem | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Jastip list details
  const [jastipList, setJastipList] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Load saved details from localStorage on mount and fetch settings/merchants
  useEffect(() => {
    const savedName = localStorage.getItem('anterbae_customer_name')
    const savedPhone = localStorage.getItem('anterbae_customer_phone')
    const savedAddress = localStorage.getItem('anterbae_customer_address')
    const savedStoreName = localStorage.getItem('anterbae_jastip_store_name')
    const savedStoreAddress = localStorage.getItem('anterbae_jastip_store_address')
    const savedList = localStorage.getItem('anterbae_jastip_list')
    
    if (savedName) setRegName(savedName)
    if (savedPhone) setPhone(savedPhone)
    if (savedAddress) setRegAddress(savedAddress)
    if (savedList) setJastipList(savedList)
    if (savedStoreName && savedStoreAddress) {
      setSelectedStore({ name: savedStoreName, address: savedStoreAddress })
      setStoreQuery(savedStoreName)
    }

    // Fetch settings from Sanity
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings && data.settings.adminPhone) {
          setAdminPhone(data.settings.adminPhone)
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))

    // Fetch verified merchants from Sanity
    client.fetch(`*[_type == "merchant" && isVerified == true]{name, address}`)
      .then((res: any[]) => {
        const items = res.map(m => ({
          name: m.name,
          address: m.address || 'Alamat Toko Terdaftar',
          category: 'merchant'
        }))
        setVerifiedMerchants(items)
      })
      .catch(err => console.error('Failed to load merchants:', err))

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
      localStorage.setItem('anterbae_customer_address', regAddress)
    }
  }, [regAddress, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_jastip_list', jastipList)
    }
  }, [jastipList, isLoaded])

  useEffect(() => {
    if (isLoaded && selectedStore) {
      localStorage.setItem('anterbae_jastip_store_name', selectedStore.name)
      localStorage.setItem('anterbae_jastip_store_address', selectedStore.address)
    }
  }, [selectedStore, isLoaded])

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter locations based on query
  const filteredSuggestions = () => {
    if (!storeQuery.trim()) return []
    const q = storeQuery.toLowerCase()
    
    // 1. Search verified merchants first
    const merchantsMatch = verifiedMerchants.filter(
      m => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q)
    )

    // 2. Search scraped locations (maximum 15 suggestions)
    const scrapedMatch = (locationsData as LocationItem[]).filter(
      l => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q)
    ).slice(0, 15)

    // Combine both
    return [...merchantsMatch, ...scrapedMatch]
  }

  const getWhatsAppLink = (ordNum: string) => {
    const storeInfo = selectedStore 
      ? `${selectedStore.name} (${selectedStore.address})`
      : storeQuery

    const waMessage = `🛒 *PESANAN JASA TITIP (JASTIP - ANTERBAE)*\n\n` +
      `*Kode Pesanan:* ${ordNum}\n\n` +
      `*Detail Pemesan:*\n` +
      `👤 Nama: ${regName}\n` +
      `📞 WA: ${phone}\n` +
      `🏠 Alamat Pemesan: ${regAddress}\n\n` +
      `*Rincian Titipan Jastip:*\n` +
      `🏬 Toko/Tempat Belanja: ${storeInfo}\n` +
      `📝 Barang yang Dititip:\n${jastipList}\n\n` +
      `Terima kasih! Silakan belanjakan jastip saya.`

    const targetAdminPhone = adminPhone.replace(/\D/g, '') || '6281328128315'
    return `https://wa.me/${targetAdminPhone}?text=${encodeURIComponent(waMessage)}`
  }

  const handleSubmit = async () => {
    if (!storeQuery.trim() || !jastipList.trim() || !regName.trim() || !phone.trim() || !regAddress.trim()) {
      alert('Silakan lengkapi seluruh data dan daftar barang jastip Anda terlebih dahulu.')
      return
    }

    setSubmitting(true)
    
    // Generate order number
    const rand = Math.floor(100 + Math.random() * 900)
    const generatedOrderNumber = `JSTP-${Date.now().toString().slice(-6)}${rand}`
    setOrderNumber(generatedOrderNumber)

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '')
      const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone

      // Open WhatsApp immediately to avoid browser popup blockers
      const waLink = getWhatsAppLink(generatedOrderNumber)
      window.open(waLink, '_blank')
      setShowSuccess(true)

      const storeName = selectedStore ? selectedStore.name : storeQuery
      const storeAddress = selectedStore ? selectedStore.address : 'Diisi manual oleh pelanggan'

      // Send POST request to backend API in the background to store the order in Sanity as deliveryOrder
      fetch('/api/antar-jemput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: regName,
          customerPhone: finalPhone,
          pickupAddress: `${storeName} (${storeAddress})`,
          dropoffAddress: regAddress,
          pickupTime: new Date().toISOString(),
          isRegistered: false,
          address: regAddress,
          orderType: 'jastip', // jastip
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

  const suggestions = filteredSuggestions()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Jasa Titip (Jastip)</h1>
            <p className="text-xs text-gray-400 font-medium">Titip beli barang dari toko/lokasi khusus</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Personal Data Section (Name, Phone, Address always visible) */}
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

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Alamat Lengkap Pemesan
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={regAddress}
                onChange={e => setRegAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap Anda"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Store / Location Autocomplete Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 relative" ref={dropdownRef}>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Pilih Toko / Lokasi Jastip
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
            <input
              type="text"
              value={storeQuery}
              onChange={e => {
                setStoreQuery(e.target.value)
                setSelectedStore(null)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Ketik nama toko (Contoh: Alfa, Pasar, Toko A)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Autocomplete Dropdown List */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedStore(item)
                    setStoreQuery(item.name)
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-50 last:border-0 transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    {item.category === 'merchant' ? '⭐ ' : '📍 '}
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate">{item.address}</span>
                </button>
              ))}
            </div>
          )}
          {selectedStore && (
            <p className="text-[10px] text-indigo-600 font-bold mt-2 flex items-center gap-1">
              ✓ Toko terpilih: <span className="underline">{selectedStore.name} ({selectedStore.address})</span>
            </p>
          )}
        </div>

        {/* Jastip Items List Input */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Barang yang Dititip / Dibeli
          </label>
          <textarea
            value={jastipList}
            onChange={e => setJastipList(e.target.value)}
            placeholder="Tulis barang yang ingin Anda titipkan disini secara detail. Contoh:&#10;- Baju anak ukuran L di outlet X&#10;- Martabak manis rasa keju di Jl. A&#10;- Kado ulang tahun di toko Y"
            rows={5}
            className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Order Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !storeQuery || !jastipList}
          className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl text-center active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              Pesan Jastip
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
              Detail jastip Anda sedang dialihkan ke WhatsApp. Driver/Admin akan segera menghubungi Anda.
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
    </div>
  )
}
