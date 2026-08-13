import { NextRequest, NextResponse } from 'next/server'
import { client as sanity } from '@/sanity/lib/client'

// GET /api/search-products?q=jeruk
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') || ''

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], merchants: [] })
  }

  try {
    const [products, merchants] = await Promise.all([
      sanity.fetch(
        `*[_type == "product" && name match "*${q}*" ] | order(_createdAt desc)[0...20] {
          _id,
          name,
          "slug": slug.current,
          price,
          image,
          isPromo,
          promoDiscount,
          "merchant": merchant->{
            _id,
            name,
            "slug": slug.current
          }
        }`,
      ),
      sanity.fetch(
        `*[_type == "merchant" && name match "*${q}*" ] | order(_createdAt desc)[0...10] {
          _id,
          name,
          "slug": slug.current,
          category,
          logo,
          isOpen
        }`,
      ),
    ])

    return NextResponse.json({ products, merchants })
  } catch (error: any) {
    console.error('Error searching:', error)
    return NextResponse.json({ error: error.message || 'Failed to search' }, { status: 500 })
  }
}
