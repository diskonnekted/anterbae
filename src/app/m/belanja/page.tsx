import { sanityFetch } from "@/sanity/lib/live"
import { MERCHANTS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Phone, Star, MapPin as MapPinIcon, Hammer, Sprout, Shirt, Package } from "lucide-react"

export const revalidate = 60

export const metadata = {
  title: 'Jasa Belanja - Anterbae',
  description: 'Titip belanja ke toko kelontong, bangunan, pertanian, dan lainnya',
}

export default async function MobileBelanjaPage() {
  const result = await sanityFetch({ query: MERCHANTS_QUERY }) as { data: any[] }
  const { data: allMerchants } = result

  // Filter merchants that are grocery/kelontong type (category == 'grocery' or 'other' with relevant items)
  const merchants = (allMerchants || []).filter((m: any) => m.category === 'grocery' || m.category === 'other').filter((m: any) => m.isVerified)

  const categories = [
    { icon: <Package className="w-8 h-8" />, title: 'Kelontong', filter: 'grocery', desc: 'Sembako, kebutuhan harian' },
    { icon: <Hammer className="w-8 h-8" />, title: 'Bangunan', filter: 'other', desc: 'Semen, cat, besi' },
    { icon: <Sprout className="w-8 h-8" />, title: 'Pertanian', filter: 'other', desc: 'Pupuk, benih' },
    { icon: <Shirt className="w-8 h-8" />, title: 'Pakaian', filter: 'other', desc: 'Baju, sepatu' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Jasa Belanja</h1>
            <p className="text-xs text-gray-400 font-medium">Titip belanja ke toko pilihan</p>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari toko" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" defaultValue="" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="text-indigo-600 flex justify-center mb-3">{cat.icon}</div>
              <p className="text-sm font-black text-gray-900 text-center mb-1">{cat.title}</p>
              <p className="text-[10px] text-gray-400 text-center">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stores List */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-black text-gray-900 mb-3 px-1">Toko Tersedia</h2>
        {merchants.length > 0 ? (
          <div className="space-y-3">
            {merchants.map((merchant: any) => (
              <a
                key={merchant._id}
                href="https://wa.me/6281328128315"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
              >
                {/* Cover Image */}
                <div className="h-28 bg-gradient-to-br from-indigo-50 to-indigo-100 relative">
                  {merchant.coverImage ? (
                    <Image
                      src={urlFor(merchant.coverImage).width(400).height(200).url()}
                      alt={merchant.name}
                      fill
                      className="object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full ${
                    merchant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {merchant.isOpen ? '● Buka' : '● Tutup'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-black text-gray-900 mb-1">{merchant.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{merchant.area || 'Banjarnegara'}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-3">
                    {merchant.address && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {merchant.address}
                      </span>
                    )}
                    {merchant.openHours && (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 inline-block">🕐</span>
                        {merchant.openHours}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-600">Min. order Rp {merchant.minOrder ? merchant.minOrder.toLocaleString('id-ID') : '10.000'}</span>
                    <span className="flex items-center gap-1 text-xs font-black text-indigo-600">
                      Titip Belanja <Phone className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-gray-500 font-bold mb-2">Toko sedang disiapkan</p>
            <p className="text-xs text-gray-400">Hubungi admin via WhatsApp untuk daftar toko</p>
            <a
              href="https://wa.me/6281328128315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" />
              Hubungi Admin
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
