import { sanityFetch } from "@/sanity/lib/live"
import Image from "next/image"
import Link from "next/link"
import MerchantLoginForm from "./form"

export const metadata = {
  title: 'Login Dashboard Merchant — Anterbae',
  description: 'Masuk ke dashboard merchant untuk mengelola produk dan lokasi toko.',
}

export default async function MerchantLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/anterbae.png" alt="Anterbae" width={160} height={60} className="h-10 w-auto mx-auto mb-6" />
          </Link>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Dashboard Merchant
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Masuk ke Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">
            Masukkan kode merchant dan PIN untuk mengakses dashboard toko Anda.
          </p>
        </div>

        <MerchantLoginForm />

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
