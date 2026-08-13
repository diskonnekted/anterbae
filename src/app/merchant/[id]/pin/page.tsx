import { sanityFetch } from "@/sanity/lib/live"
import Image from "next/image"
import Link from "next/link"
import PinEntry from "./entry"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Masuk Dashboard — ${id}`,
    description: `Masukkan PIN untuk mengakses dashboard merchant`,
  }
}

export default async function PinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: merchant } = await sanityFetch({
    query: `*[_type == "merchant" && _id == $id][0] {
      _id,
      name,
      "slug": slug.current,
      logo,
      dashboardPin,
      isOpen
    }`,
    params: { id },
  }) as { data: any }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Merchant Tidak Ditemukan</h1>
          <Link href="/merchant" className="text-red-600 font-black hover:underline">
            ← Kembali ke Daftar Merchant
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/anterbae.png" alt="Anterbae" width={160} height={60} className="h-10 w-auto mx-auto mb-6" />
          </Link>
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg mx-auto mb-4 border-2 border-slate-100">
            {merchant.logo ? (
              <Image
                src={merchant.logo}
                alt={merchant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-red-100 to-red-200">
                🏪
              </div>
            )}
          </div>
          <h1 className="text-xl font-black text-slate-900">{merchant.name}</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Dashboard Merchant</p>
        </div>

        {/* PIN Entry */}
        <PinEntry merchantId={merchant._id} hasPin={!!merchant.dashboardPin} />

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/merchant" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            ← Kembali
          </Link>
        </div>
      </div>
    </div>
  )
}
