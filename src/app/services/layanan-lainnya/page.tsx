'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Wrench, Lightbulb, Brush, Camera, Scissors, Hammer, Phone, Check } from 'lucide-react'

const services = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Servis Listrik',
    desc: 'Perbaikan instalasi, relay hidup, pasang lampu, dll',
    examples: ['Pasang lampu/kipas', 'Perbaikan relay', 'Instalasi baru', 'Korsleting listrik'],
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Pijat & Kesehatan',
    desc: 'Pijat tradisional, reflexology, terapi tulang',
    examples: ['Pijat tradisional', 'Reflexology kaki', 'Terapi tulang', 'Pijat bayi'],
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: 'Instalasi CCTV',
    desc: 'Pasang & setup CCTV untuk rumah & toko',
    examples: ['Pasang 2-4 camera', 'Setup DVR/NVR', 'Maintenance CCTV', 'Konsultasi'],
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: 'Servis AC',
    desc: 'Bongkar pasang, cleaning, isi freon',
    examples: ['Cleaning AC', 'Bongkar pasang', 'Isi freon', 'Perbaikan'],
  },
  {
    icon: <Brush className="w-6 h-6" />,
    title: 'Servis Cat Rumah',
    desc: 'Cat interior & eksterior rumah & gedung',
    examples: ['Cat interior', 'Cat eksterior', 'Cat kayu & besi', 'Decorative'],
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: 'Tukang Umum',
    desc: 'Dinding, atap, renovasi kecil & besar',
    examples: ['Dinding baru', 'Perbaikan atap', 'Lantai keramik', 'Pintu & jendela'],
  },
]

export default function LayananLainnyaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Layanan Lainnya</h1>
            <p className="text-xs text-gray-400 font-medium">Servis & kebutuhan rumah tangga</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-black text-center mb-2">Layanan Lainnya</h2>
        <p className="text-purple-100 text-sm text-center leading-relaxed">
          Selain antar barang, kami juga punya mitra untuk berbagai kebutuhan servis & jasa di Banjarnegara!
        </p>
      </div>

      {/* Services List */}
      <div className="px-4 py-6 space-y-3">
        {services.map((service) => (
          <div key={service.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">{service.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {service.examples.map((ex) => (
                      <div key={ex} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-purple-500 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-gray-500">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <a
          href="https://wa.me/6281328128315"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-purple-600 text-white font-black py-4 rounded-2xl text-center hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Tanya Layanan via WhatsApp
        </a>

        <p className="text-xs text-gray-400 text-center font-medium pb-4">
          Tidak nemu layanan yang Anda cari? Chat kami langsung!
        </p>
      </div>
    </div>
  )
}
