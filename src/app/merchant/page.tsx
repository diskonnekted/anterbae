import { sanityFetch } from "@/sanity/lib/live"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

// Query semua merchant untuk daftar dashboard (tanpa filter isVerified)
const ALL_MERCHANTS_QUERY = `
  *[_type == "merchant"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    coverImage,
    category,
    area,
    isOpen
  }
`

export default async function MerchantListPage() {
  const { data: merchants } = await sanityFetch({ query: ALL_MERCHANTS_QUERY }) as { data: any[] }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          ⚙️ Dashboard Merchant
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Pilih Merchant Anda
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Masuk ke dashboard untuk mengelola produk dan lokasi toko Anda.
        </p>
      </div>

      {merchants && merchants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {merchants.map((merchant: any) => (
            <Link
              key={merchant._id}
              href={`/merchant/${merchant._id}/pin`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-red-200 hover:shadow-xl transition-all group block"
            >
              {/* Cover */}
              <div className="relative h-32 bg-slate-100">
                {merchant.coverImage ? (
                  <Image
                    src={urlFor(merchant.coverImage).width(400).height(200).url()}
                    alt={merchant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200">
                    🏪
                  </div>
                )}
                <div className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full ${
                  merchant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {merchant.isOpen ? '● Buka' : '● Tutup'}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {merchant.logo && (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 -mt-6 border-2 border-white shadow-md">
                      <Image src={urlFor(merchant.logo).width(40).height(40).url()} alt={merchant.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 truncate">{merchant.name}</h3>
                    <p className="text-xs text-slate-400 font-bold">{merchant.area}</p>
                  </div>
                </div>
                <div className="mt-3 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-black py-2.5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all text-sm">
                  Buka Dashboard →
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-4">⚙️</div>
          <p className="text-slate-400 font-bold text-xl mb-2">Belum ada merchant</p>
        </div>
      )}
    </div>
  )
}
