import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'
import {
  sendOrderReceived,
  sendDriverPickingUp,
  sendDeliveryComplete,
} from '@/lib/fonnte-service'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// GET /api/antar-jemput/check-phone?phone=628123456789
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const phone = searchParams.get('phone') || ''

  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 })
  }

  try {
    const customer = await sanity.fetch(
      `*[_type == "customer" && phone == $phone][0] {
        _id, name, phone, address, isVerified
      }`,
      { phone }
    )

    return NextResponse.json({ registered: !!customer, customer })
  } catch (error: any) {
    console.error('Error checking phone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/antar-jemput
// Body: { customerName, customerPhone, pickupAddress, dropoffAddress, pickupTime, isRegistered?, address? }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    customerName,
    customerPhone,
    pickupAddress,
    dropoffAddress,
    pickupTime,
    isRegistered = false,
    address,
  } = body

  if (!customerName || !customerPhone || !pickupAddress || !dropoffAddress || !pickupTime) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  try {
    // Check if customer exists
    let customer = await sanity.fetch(
      `*[_type == "customer" && phone == $phone][0]._id`,
      { phone: customerPhone }
    )

    // Create or update customer
    if (!customer || !isRegistered) {
      const customerData = {
        _type: 'customer' as const,
        name: customerName,
        phone: customerPhone,
        address: address || pickupAddress,
        isVerified: true,
        buyerLevel: 'regular' as const,
      }

      if (customer) {
        // Update existing
        await sanity.patch(customer).set(customerData).commit()
      } else {
        // Create new
        const result = await sanity.create(customerData)
        customer = result._id
      }
    }

    // Generate order number
    const rand = Math.floor(100 + Math.random() * 900)
    const orderNumber = `ANTJ-${Date.now().toString().slice(-6)}${rand}`

    // Create delivery order
    const order = await sanity.create({
      _type: 'deliveryOrder',
      orderNumber,
      customerName,
      customerPhone,
      orderType: body.orderType || 'parcel',
      pickupAddress,
      deliveryAddress: dropoffAddress,
      customerNotes: `Waktu jemput: ${pickupTime}`,
      totalAmount: 0, // Will be set by admin
      shippingFee: 0, // Will be set by admin
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'pending',
    })

    // Send confirmation to user via Fonnte
    await sendOrderReceived(customerPhone, orderNumber)

    // Send notification to admin via Fonnte
    const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || '6281328128315'
    const adminMsg = `🚗 *PESANAN ANTAR JEMPUT BARU* 🚗
----------------------------------
🆔 *No. Pesanan:* ${orderNumber}
👤 *Nama:* ${customerName}
📞 *WhatsApp:* ${customerPhone}
📍 *Lokasi Jemput:* ${pickupAddress}
🏁 *Tujuan:* ${dropoffAddress}
🕐 *Waktu:* ${pickupTime}
----------------------------------

Mohon segera assign driver dan hubungi pemesan.`

    await sendWhatsAppNotification(adminPhone, adminMsg)

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order._id,
    })
  } catch (error: any) {
    console.error('Error creating antar-jemput order:', error)
    return NextResponse.json({ error: error.message || 'Gagal membuat pesanan' }, { status: 500 })
  }
}
