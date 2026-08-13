import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// POST /api/antar-jemput/confirm
// Body: { orderNumber }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { orderNumber } = body

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number required' }, { status: 400 })
  }

  try {
    // Find the order
    const order = await sanity.fetch(
      `*[_type == "deliveryOrder" && orderNumber == $orderNumber][0] {
        _id, status, customerPhone
      }`,
      { orderNumber }
    )

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
    }

    if (order.status === 'delivered' || order.status === 'completed') {
      return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi' }, { status: 400 })
    }

    // Update order status
    await sanity.patch(order._id).set({
      status: 'delivered',
    })

    // Send notification to admin
    const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || '6281328128315'
    const { sendWhatsAppNotification } = await import('@/sanity/lib/whatsapp')

    const msg = `✅ *KONFIRMASI PENGANTARAN* ✅
Pesanan: ${orderNumber}
Status: Pengantaran dikonfirmasi oleh customer`

    await sendWhatsAppNotification(adminPhone, msg)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error confirming order:', error)
    return NextResponse.json({ error: error.message || 'Gagal konfirmasi' }, { status: 500 })
  }
}
