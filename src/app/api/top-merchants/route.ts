import { NextRequest, NextResponse } from 'next/server'
import { client as sanity } from '@/sanity/lib/client'

// GET /api/top-merchants?limit=4
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get('limit') || '4')

  try {
    const merchants = await sanity.fetch(
      `*[_type == "merchant" && isVerified == true] | order(_createdAt desc)[0...$limit] {
        _id,
        name,
        "slug": slug.current,
        category,
        logo,
        isOpen
      }`,
      { limit }
    )

    return NextResponse.json({ merchants })
  } catch (error: any) {
    console.error('Error fetching top merchants:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 })
  }
}
