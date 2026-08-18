import { NextRequest, NextResponse } from 'next/server'
import { client as sanity } from '@/sanity/lib/client'

// GET /api/promo-products?limit=6
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get('limit') || '6')

  try {
    let products = await sanity.fetch(
      `*[_type == "product" && isPromo == true] | order(_createdAt desc)[0...$limit] {
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
      { limit }
    )

    if (products.length < limit) {
      const remainingLimit = limit - products.length
      const extraProducts = await sanity.fetch(
        `*[_type == "product" && isPromo != true] | order(_createdAt desc)[0...$remainingLimit] {
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
        { remainingLimit }
      )
      products = [...products, ...extraProducts]
    }

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Error fetching promo products:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 })
  }
}
