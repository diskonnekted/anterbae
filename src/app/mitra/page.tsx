import { sanityFetch } from "@/sanity/lib/live"
import { MERCHANTS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

export const revalidate = 60

export const metadata = {
  title: "Mitra Merchant Anterbae — Warung & Restoran Banjarnegara",
  description: "Daftar mitra merchant Anterbae di Banjarnegara. Makanan, minuman, grocery, dan lebih banyak lagi.",
}

export default async function MitraPage() {
  const { data: merchants } = await sanityFetch({ query: MERCHANTS_QUERY }) as { data: any[] }

  const foodMerchants = merchants?.filter(m => m.category === 'food') || []
  const groceryMerchants = merchants?.filter(m => m.category === 'grocery') || []
  const otherMerchants = merchants?.filter(m => m.category !== 'food' && m.category !== 'grocery') || []

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          🏪 Mitra Merchant
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Restoran & Warung <span className="text-red-600">Partner Kami</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Pesan dari merchant favorit Anda. Kurir Anterbae siap mengambil dan mengantarkan ke lokasi Anda.
        </p>
      </div>

      {merchants && merchants.length > 0 ? (
        <>
          {/* Food & Beverage */}
          {foodMerchants.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                🍔 Makanan & Minuman
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {foodMerchants.length} merchant
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foodMerchants.map((merchant: any) => (
                  <MerchantCard key={merchant._id} merchant={merchant} />
                ))}
              </div>
            </section>
          )}

          {/* Grocery */}
          {groceryMerchants.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                🛒 Grocery & Sembako
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {groceryMerchants.length} merchant
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groceryMerchants.map((merchant: any) => (
                  <MerchantCard key={merchant._id} merchant={merchant} />
                ))}
              </div>
            </section>
          )}

          {/* Others */}
          {otherMerchants.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                🏪 Merchant Lainnya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherMerchants.map((merchant: any) => (
                  <MerchantCard key={merchant._id} merchant={merchant} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-slate-400 font-bold text-xl mb-2">Merchant sedang disiapkan</p>
          <p className="text-slate-400 text-sm">Data merchant akan segera tersedia. Hubungi kami via WhatsApp untuk info merchant!</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-green-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-green-700 transition-all"
          >
            <Phone className="w-4 h-4" />
            Tanya via WhatsApp
          </a>
        </div>
      )}

      {/* Daftar Jadi Merchant CTA */}
      <div className="bg-slate-900 text-white rounded-[3rem] p-12 text-center mt-12">
        <div className="text-5xl mb-4">🤝</div>
        <h2 className="text-3xl font-black mb-3">Punya Warung atau Restoran?</h2>
        <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
          Daftarkan usaha Anda sebagai mitra merchant Anterbae. Jangkau lebih banyak pelanggan tanpa biaya pendaftaran!
        </p>
        <Link
          href="/register-merchant"
          className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 transition-all shadow-xl active:scale-95"
        >
          Daftar Jadi Merchant →
        </Link>
      </div>
    </div>
  )
}

function MerchantCard({ merchant }: { merchant: any }) {
  return (
    <Link href={`/mitra/${merchant.slug || ''}`} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-red-200 hover:shadow-xl transition-all group block">
      {/* Cover */}
      <div className="relative h-36 bg-slate-100">
        {merchant.coverImage ? (
          <Image
            src={urlFor(merchant.coverImage).width(400).height(200).url()}
            alt={merchant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-slate-100 to-slate-200">
            🏪
          </div>
        )}
        {/* Status badge */}
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
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 -mt-8 border-2 border-white shadow-md">
              <Image src={urlFor(merchant.logo).width(40).height(40).url()} alt={merchant.name} fill className="object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 truncate">{merchant.name}</h3>
            <p className="text-xs text-slate-400 font-bold">{merchant.area}</p>
          </div>
        </div>
        {merchant.openHours && (
          <p className="text-xs text-slate-400 font-medium mt-2">🕐 {merchant.openHours}</p>
        )}
        <div
          className="mt-3 w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-600 font-black py-2.5 rounded-xl group-hover:bg-red-50 group-hover:text-red-600 transition-all text-sm"
        >
          Kunjungi Toko &rarr;
        </div>
      </div>
    </Link>
  )
}
