import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, MapPin, Phone, Clock, Tag, Store } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import { defineQuery } from 'next-sanity'

const APP_SETTINGS_QUERY = defineQuery(`
  *[_type == "appSettings"][0] {
    adminPhone
  }
`)

const GROCERY_MERCHANTS_QUERY = defineQuery(`
  *[_type == "merchant" && isVerified == true && category == "grocery"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    coverImage,
    area,
    address,
    isOpen,
    closingMessage,
    openHours
  }
`)

const staticCategories = [
  { icon: '🏗️', title: 'Toko Bangunan', items: ['Semen', 'Cat', 'Besi', 'Peralatan'] },
  { icon: '🌾', title: 'Toko Pertanian', items: ['Pupuk', 'Benih', 'Alat Taman'] },
  { icon: '👕', title: 'Toko Pakaian', items: ['Baju', 'Celana', 'Sepatu'] },
  { icon: '📱', title: 'Toko Elektronik', items: ['Handphone', 'Aksesoris', 'Kabel'] },
  { icon: '🎁', title: 'Toko Kado', items: ['Kemasan', 'Pita', 'Card'] },
  { icon: '🏠', title: 'Perlengkapan Rumah', items: ['Alat Dapur', 'Sapu', 'Ember'] },
]

export default async function BelanjaPage() {
  const [
    { data: settings },
    { data: merchants },
  ] = await Promise.all([
    sanityFetch({ query: APP_SETTINGS_QUERY }) as Promise<{ data: any }>,
    sanityFetch({ query: GROCERY_MERCHANTS_QUERY }) as Promise<{ data: any[] }>,
  ])

  const adminPhone = settings?.adminPhone || '6281328128315'
  const waLink = `https://wa.me/${adminPhone.replace(/\D/g, '')}`

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Jasa Belanja</h1>
            <p className="text-xs text-gray-400 font-medium">Titip beli ke toko mana saja</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <ShoppingCart className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-black text-center mb-2">Jasa Belanja & Titip Beli</h2>
        <p className="text-indigo-100 text-sm text-center leading-relaxed max-w-md mx-auto">
          Tidak sempat keluar rumah? Kirim list belanjaan Anda, atau pilih langsung dari mitra toko kelontong terdaftar kami!
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Dynamic Mitra Belanja Section */}
        {merchants && merchants.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              Mitra Toko Kelontong & Sembako
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {merchants.map((merchant) => (
                <Link
                  key={merchant._id}
                  href={`/mitra/${merchant.slug}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-indigo-200 transition-all flex gap-4"
                >
                  <div className="relative w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                    {merchant.logo ? (
                      <Image
                        src={urlFor(merchant.logo).width(120).height(120).url()}
                        alt={merchant.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏪</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900 text-sm truncate">{merchant.name}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${merchant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {merchant.isOpen ? 'Buka' : 'Tutup'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {merchant.area || 'Banjarnegara'}
                      </p>
                    </div>
                    {merchant.openHours && (
                      <p className="text-[10px] text-gray-400 font-medium">🕐 Jam: {merchant.openHours}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 text-base">Kategori Toko Lainnya</h3>
          <div className="grid grid-cols-2 gap-3">
            {staticCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-2">{cat.title}</h3>
                <div className="space-y-1">
                  {cat.items.map((item) => (
                    <p key={item} className="text-[10px] text-gray-400 font-medium">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-black text-gray-900 mb-4">Cara Kerja Jasa Belanja:</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Pilih Toko / List Barang', desc: 'Pilih mitra toko di atas atau list belanjaan bebas Anda.' },
              { step: '2', title: 'Kurir Kami Belanjakan', desc: 'Kurir Anterbae akan membelikan pesanan sesuai daftar.' },
              { step: '3', title: 'Barang Diantar & COD', desc: 'Barang diantar langsung ke rumah Anda. Pembayaran praktis di tempat.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-gray-900">Biaya Jasa Belanja</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Dalam kota</span>
              <span className="font-black text-indigo-600">Mulai Rp 10.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Antar kecamatan</span>
              <span className="font-black text-indigo-600">Mulai Rp 15.000</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-50">
              * Harga barang dibayar terpisah sesuai nota riil dari toko.
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-center hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Belanja Sekarang
        </a>
      </div>
    </div>
  )
}
