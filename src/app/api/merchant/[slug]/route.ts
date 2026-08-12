import { NextRequest, NextResponse } from 'next/server'
import { sanityFetch } from '@/sanity/lib/live'
import { defineQuery } from 'next-sanity'

const MERCHANT_WITH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "merchant" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    coverImage,
    phone,
    address,
    area,
    description,
    isOpen,
    openHours,
    category,
    isVerified,
    "products": *[_type == "product" && references(^._id) && _id =~ "food-"] | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      price,
      stock,
      image,
      isBestSeller,
      isPromo,
      promoDiscount
    }
  }
`)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const data = await sanityFetch({
      query: MERCHANT_WITH_PRODUCTS_QUERY,
      params: { slug },
    })

    if (!data) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      merchant: data,
      products: data.products || [],
    })
  } catch (error) {
    console.error('Error fetching merchant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch merchant' },
      { status: 500 }
    )
  }
}
