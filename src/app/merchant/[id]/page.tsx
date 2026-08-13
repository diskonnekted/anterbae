import { sanityFetch } from "@/sanity/lib/live"
import { MERCHANT_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import MerchantDashboard from "./dashboard"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Dashboard Merchant — Anterbae`,
    description: `Kelola produk dan lokasi merchant ${id}`,
  }
}

export async function generateStaticParams() {
  const merchants = await client.fetch(`
    *[_type == "merchant"] {
      _id,
      "slug": slug.current
    }
  `)

  return merchants?.map((m: any) => ({ id: m._id })) || []
}

export default async function MerchantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Check session cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('merchant-session')?.value

  // If no session, redirect to PIN page
  if (!sessionCookie || sessionCookie !== id) {
    redirect(`/merchant/${id}/pin`)
  }

  const { data: merchant } = await sanityFetch({
    query: `*[_type == "merchant" && _id == $id][0] {
      _id,
      name,
      "slug": slug.current,
      logo,
      coverImage,
      category,
      phone,
      address,
      area,
      description,
      isOpen,
      closingMessage,
      openHours,
      minOrder,
      isVerified,
      latitude,
      longitude
    }`,
    params: { id },
  }) as { data: any }

  if (!merchant) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Merchant Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">ID merchant tidak terdaftar di sistem.</p>
        <Link href="/mitra" className="text-red-600 font-black hover:underline">
          Kembali ke Daftar Merchant →
        </Link>
      </div>
    )
  }

  return <MerchantDashboard merchant={merchant} />
}
