'use client'

import { ArrowLeft, MapPin, Phone, User, CheckCircle, Loader2, X, Settings, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function MobileLayananLainnyaPage() {
  const router = useRouter()
  
  // App state
  const [adminPhone, setAdminPhone] = useState('6281328128315')
  const [isLoaded, setIsLoaded] = useState(false)

  // Form states
  const [phone, setPhone] = useState('')
  const [regName, setRegName] = useState('')
  const [regAddress, setRegAddress] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [requestDetail, setRequestDetail] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Load saved details from localStorage on mount and fetch settings
  useEffect(() => {
    const savedName = localStorage.getItem('anterbae_customer_name')
    const savedPhone = localStorage.getItem('anterbae_customer_phone')
    const savedAddress = localStorage.getItem('anterbae_customer_address')
    const savedServiceType = localStorage.getItem('anterbae_lainnya_service_type')
    const savedDetail = localStorage.getItem('anterbae_lainnya_detail')
    
    if (savedName) setRegName(savedName)
    if (savedPhone) setPhone(savedPhone)
    if (savedAddress) setRegAddress(savedAddress)
    if (savedServiceType) setServiceType(savedServiceType)
    if (savedDetail) setRequestDetail(savedDetail)

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
      localStorage.setItem('anterbae_customer_address', regAddress)
    }
  }, [regAddress, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_lainnya_service_type', serviceType)
    }
  }, [serviceType, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anterbae_lainnya_detail', requestDetail)
    }
  }, [requestDetail, isLoaded])

  const getWhatsAppLink = (ordNum: string) => {
    const waMessage = `🛠️ *PESANAN LAYANAN LAINNYA (ANTERBAE)*\n\n` +
      `*Kode Pesanan:* ${ordNum}\n\n` +
      `*Detail Pemesan:*\n` +
      `👤 Nama: ${regName}\n` +
      `📞 WA: ${phone}\n` +
      `🏠 Alamat Pemesan: ${regAddress}\n\n` +
      `*Rincian Permintaan Layanan:*\n` +
      `📌 Jenis Layanan: ${serviceType || 'Kustom/Lainnya'}\n` +
      `📝 Deskripsi Permintaan:\n${requestDetail}\n\n` +
      `Terima kasih! Silakan proses permintaan jasa saya.`

    const targetAdminPhone = adminPhone.replace(/\D/g, '') || '6281328128315'
    return `https://wa.me/${targetAdminPhone}?text=${encodeURIComponent(waMessage)}`
  }

  const handleSubmit = async () => {
    if (!serviceType.trim() || !requestDetail.trim() || !regName.trim() || !phone.trim() || !regAddress.trim()) {
      alert('Silakan lengkapi seluruh data dan rincian permintaan Anda terlebih dahulu.')
      return
    }

    setSubmitting(true)
    
    // Generate order number
    const rand = Math.floor(100 + Math.random() * 900)
    const generatedOrderNumber = `ANTL-${Date.now().toString().slice(-6)}${rand}`
    setOrderNumber(generatedOrderNumber)

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '')
      const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone

      // Open WhatsApp immediately to avoid browser popup blockers
      const waLink = getWhatsAppLink(generatedOrderNumber)
      window.open(waLink, '_blank')
      setShowSuccess(true)

      // Send POST request to backend API in the background to store the order in Sanity as deliveryOrder
      fetch('/api/antar-jemput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: regName,
          customerPhone: finalPhone,
          pickupAddress: `[KUSTOM] ${serviceType}`,
          dropoffAddress: regAddress,
          pickupTime: new Date().toISOString(),
          isRegistered: false,
          address: `${regAddress} (Layanan Lainnya: ${requestDetail})`,
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
            <h1 className="text-lg font-black text-gray-900">Layanan Lainnya</h1>
            <p className="text-xs text-gray-400 font-medium">Kirim permintaan jasa atau layanan kustom Anda</p>
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

        {/* Service Type */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Jenis Jasa / Layanan Kustom
          </label>
          <div className="relative">
            <Settings className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={serviceType}
              onChange={e => setServiceType(e.target.value)}
              placeholder="Contoh: Jasa bersih-bersih, Angkat barang pindahan, dll."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Detailed Request Input */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
            Rincian Permintaan / Keperluan
          </label>
          <textarea
            value={requestDetail}
            onChange={e => setRequestDetail(e.target.value)}
            placeholder="Tulis detail bantuan yang Anda perlukan. Contoh:&#10;- Membantu memindahkan lemari pakaian dari kamar A ke mobil&#10;- Membeli dan mengantarkan gas LPG 3kg&#10;- Jasa mencuci motor di rumah"
            rows={5}
            className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Order Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !serviceType || !requestDetail}
          className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl text-center active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <HelpCircle className="w-5 h-5" />
              Kirim Permintaan Layanan
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
              Detail permintaan kustom Anda sedang dialihkan ke WhatsApp. Admin akan segera menanggapi.
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
