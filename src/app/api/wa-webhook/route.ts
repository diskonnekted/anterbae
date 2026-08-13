import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('Received WA Webhook Payload:', payload)

    // Supports Fonnte format: payload.sender (phone number) and payload.location (latitude, longitude)
    const senderPhone = payload.sender
    const location = payload.location

    if (senderPhone && location && location.latitude && location.longitude) {
      // Find courier by phone number
      const query = `*[_type == "courier" && phone == $phone || phone == $phoneClean][0]`
      const phoneClean = senderPhone.replace(/[^0-9]/g, '')
      
      const courier = await writeClient.fetch(query, { 
        phone: senderPhone, 
        phoneClean 
      })

      if (courier) {
        // Update courier coordinates
        const updated = await writeClient
          .patch(courier._id)
          .set({
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            lastLocationUpdate: new Date().toISOString()
          })
          .commit()

        console.log(`Updated location for courier ${courier.name}:`, location)
        return NextResponse.json({ success: true, message: `Lokasi ${courier.name} diperbarui.` })
      } else {
        console.log(`Courier not found for phone: ${senderPhone}`)
        return NextResponse.json({ success: false, message: 'Kurir tidak ditemukan.' })
      }
    }

    return NextResponse.json({ success: false, message: 'Payload tidak lengkap.' })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
