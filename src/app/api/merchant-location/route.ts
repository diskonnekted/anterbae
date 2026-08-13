import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// PATCH /api/merchant-location?merchantId=xxx&latitude=xx&longitude=xx
export async function PATCH(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const merchantId = searchParams.get('merchantId')
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')

  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId is required' }, { status: 400 })
  }

  try {
    const updateData: Record<string, number> = {}

    if (latitude !== null) {
      const lat = parseFloat(latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 })
      }
      updateData.latitude = lat
    }

    if (longitude !== null) {
      const lng = parseFloat(longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 })
      }
      updateData.longitude = lng
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least latitude or longitude is required' }, { status: 400 })
    }

    const updated = await sanity.patch(merchantId).set(updateData).commit()

    return NextResponse.json({ merchant: updated })
  } catch (error: any) {
    console.error('Error updating merchant location:', error)
    return NextResponse.json({ error: error.message || 'Failed to update location' }, { status: 500 })
  }
}
