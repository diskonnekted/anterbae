import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// POST /api/merchant-auth-lookup — Verify merchant code exists
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { merchantCode } = body

  if (!merchantCode) {
    return NextResponse.json({ error: 'merchantCode required' }, { status: 400 })
  }

  try {
    const merchant = await sanity.fetch(
      `*[_type == "merchant" && merchantCode == $code][0] {
        _id,
        name,
        merchantCode
      }`,
      { code: merchantCode.toUpperCase().trim() }
    )

    if (!merchant) {
      return NextResponse.json({ error: 'Kode merchant tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({
      merchant: {
        _id: merchant._id,
        name: merchant.name,
        merchantCode: merchant.merchantCode,
      },
    })
  } catch (error: any) {
    console.error('Merchant lookup error:', error)
    return NextResponse.json({ error: error.message || 'Lookup failed' }, { status: 500 })
  }
}
