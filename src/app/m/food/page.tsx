import { sanityFetch } from "@/sanity/lib/live"
import { FOOD_MERCHANTS_QUERY, MERCHANTS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Phone, Star, MapPin as MapPinIcon, Clock } from "lucide-react"

export const revalidate = 60

export const metadata = {
  title: 'Pesan Antar Makanan - Anterbae',
  description: 'Pilih restoran dan warung favorit di Banjarnegara',
}

export default async function MobileFoodPage() {
  const [{ data: foodMerchants }, { data: allMerchants }] = await Promise.all([
    sanityFetch({ query: FOOD_MERCHANTS_QUERY }) as Promise<{ data: any[] }>,
    sanityFetch({ query: MERCHANTS_QUERY }) as Promise<{ data: any[] }>,
  ])

  // Use food merchants if available, otherwise fall back to all merchants
  const merchants = (foodMerchants && foodMerchants.length > 0) ? foodMerchants : (allMerchants || [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/m" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-gray-900">Pesan Antar Makanan</h1>
            <p className="text-xs text-gray-400 font-medium">{merchants.length} restoran tersedia</p>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari restoran" className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" defaultValue="" />
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="px-4 py-4 space-y-3">
        {merchants.length > 0 ? (
          merchants.map((merchant: any) => (
            <Link
              key={merchant._id}
              href={`/m/food/${(typeof merchant.slug === 'string' ? merchant.slug : merchant.slug?.current) || merchant.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block bg-white rounded-2xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
            >
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 relative">
                {merchant.coverImage ? (
                  <Image
                    src={urlFor(merchant.coverImage).width(400).height(200).url()}
                    alt={merchant.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full ${
                  merchant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {merchant.isOpen ? '● Buka' : '● Tutup'}
                </div>
                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-gray-700">4.8</span>
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
                      <Clock className="w-3 h-3" />
                      {merchant.openHours}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-600">Min. order Rp {merchant.minOrder ? merchant.minOrder.toLocaleString('id-ID') : '10.000'}</span>
                  <span className="flex items-center gap-1 text-xs font-black text-orange-600">
                    Pesan via WA <Phone className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-500 font-bold mb-2">Restoran sedang disiapkan</p>
            <p className="text-xs text-gray-400">Hubungi admin via WhatsApp untuk daftar menu</p>
            <a
              href="https://wa.me/6281328128315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-orange-600 text-white font-black px-6 py-3 rounded-2xl active:scale-95 transition-transform"
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
