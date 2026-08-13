import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { cookies } from 'next/headers'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// POST /api/merchant-auth — Login or logout
export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookieStore = await cookies()

  // Logout
  if (body.logout) {
    cookieStore.delete('merchant-session')
    return NextResponse.json({ success: true })
  }

  // Login
  const { merchantCode, pin } = body

  if (!merchantCode || !pin) {
    return NextResponse.json({ error: 'merchantCode and pin required' }, { status: 400 })
  }

  try {
    const merchant = await sanity.fetch(
      `*[_type == "merchant" && merchantCode == $code][0] {
        _id,
        name,
        "slug": slug.current,
        dashboardPin,
        isOpen,
        category,
        area
      }`,
      { code: merchantCode.toUpperCase().trim() }
    )

    if (!merchant) {
      return NextResponse.json({ error: 'Kode merchant tidak ditemukan' }, { status: 404 })
    }

    // If merchant has no PIN set, allow access
    // If merchant has PIN, verify it matches
    if (merchant.dashboardPin && merchant.dashboardPin !== pin) {
      return NextResponse.json({ error: 'PIN salah' }, { status: 401 })
    }

    // Set session cookie with merchant _id
    cookieStore.set('merchant-session', merchant._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({
      success: true,
      merchant: {
        _id: merchant._id,
        name: merchant.name,
        slug: merchant.slug,
        isOpen: merchant.isOpen,
        category: merchant.category,
        area: merchant.area,
      },
    })
  } catch (error: any) {
    console.error('Merchant auth error:', error)
    return NextResponse.json({ error: error.message || 'Auth failed' }, { status: 500 })
  }
}
