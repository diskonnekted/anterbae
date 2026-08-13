import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// GET /api/merchant-products?merchantId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const merchantId = searchParams.get('merchantId')

  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId required' }, { status: 400 })
  }

  try {
    const products = await sanity.fetch(
      `*[_type == "product" && merchant._ref == $merchantId] | order(_createdAt desc) {
        _id,
        name,
        "slug": slug.current,
        price,
        stock,
        image,
        description,
        isBestSeller,
        isPromo,
        promoDiscount,
        _createdAt,
        _updatedAt
      }`,
      { merchantId }
    )

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/merchant-products
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, slug, price, stock, image, description, isBestSeller, isPromo, promoDiscount, merchantId } = body

  if (!name || price == null || stock == null || !merchantId) {
    return NextResponse.json(
      { error: 'name, price, stock, and merchantId are required' },
      { status: 400 }
    )
  }

  try {
    const productData: Record<string, unknown> = {
      _type: 'product',
      name,
      price,
      stock,
      merchant: { _type: 'reference', _ref: merchantId },
      isBestSeller: isBestSeller || false,
      isPromo: isPromo || false,
    }

    if (slug) {
      productData.slug = { _type: 'slug', current: slug }
    }
    if (description) {
      productData.description = description
    }
    if (image) {
      productData.image = image
    }
    if (isPromo && promoDiscount != null) {
      productData.promoDiscount = promoDiscount
    }

    const created = await sanity.create(productData)

    return NextResponse.json({ product: created }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}
