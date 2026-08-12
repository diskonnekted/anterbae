import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { sendWhatsApp } from '@/sanity/lib/whatsapp'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      restaurantName,
      customerName,
      customerPhone,
      deliveryAddress,
      customerNotes,
      location,
      items,
      subtotal,
      deliveryFee,
      total,
    } = data

    // Generate order number
    const orderNumber = `FOOD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`

    // Create order in Sanity
    const order = await sanity.create({
      _type: 'order',
      orderNumber,
      orderCategory: 'food',
      customerName,
      customerPhone,
      deliveryAddress,
      foodItems: items.map((item: any) => ({
        _key: item.productId || Math.random().toString(36).slice(2),
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || '',
      })),
      totalAmount: total,
      shippingFee: deliveryFee,
      paymentMethod: 'transfer',
      paymentStatus: 'unpaid',
      status: 'pending',
      foodOrderStatus: 'waiting_payment',
      paymentFlow: {
        _type: 'paymentFlow',
        accountNumber: '1234567890', // Should be from settings
        accountName: 'Anterbae Banjarnegara',
        paymentStatus: 'waiting_payment',
      },
      customerLocation: location ? {
        _type: 'customerLocation',
        lat: location.lat,
        lng: location.lng,
        markedAt: new Date().toISOString(),
      } : null,
      customerNotes: customerNotes || '',
      restaurantName,
      createdAt: new Date().toISOString(),
    })

    // Format WhatsApp message for customer
    const itemsList = items.map((item: any) =>
      `- ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}${item.notes ? ` (${item.notes})` : ''}`
    ).join('\n')

    const customerMessage = `*🛵 PESANAN MAKANAN ${orderNumber}*\n\n` +
      `Terima kasih telah memesan di *${restaurantName}*\n\n` +
      `*Detail Pesanan:*\n${itemsList}\n\n` +
      `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n` +
      `Ongkir: Rp ${deliveryFee.toLocaleString('id-ID')}\n` +
      `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n\n` +
      `*Cara Pembayaran:*\n` +
      `Transfer ke:\nBCA: 1234567890\na.n. Anterbae Banjarnegara\n\n` +
      `Sudah transfer? Klik link berikut untuk kirim bukti:\n` +
      `https://wa.me/6281234567890?text=${encodeURIComponent(
        `Halo Admin, saya sudah transfer untuk pesanan ${orderNumber} sebesar Rp ${total.toLocaleString('id-ID')}. Berikut buktinya.`
      )}\n\n` +
      `📍 Alamat: ${deliveryAddress}`

    // Send WhatsApp to customer
    await sendWhatsApp({
      target: customerPhone,
      message: customerMessage,
    }).catch(err => console.error('Failed to send WA to customer:', err))

    // Send notification to admin
    const adminMessage = `*🍔 PESANAN MAKANAN BARU*\n\n` +
      `*Order:* ${orderNumber}\n` +
      `*Resto:* ${restaurantName}\n` +
      `*Pelanggan:* ${customerName}\n` +
      `*WA:* ${customerPhone}\n` +
      `*Alamat:* ${deliveryAddress}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Total:* Rp ${total.toLocaleString('id-ID')}\n\n` +
      `Menunggu pembayaran...`

    await sendWhatsApp({
      target: '6281234567890', // Admin phone
      message: adminMessage,
    }).catch(err => console.error('Failed to send WA to admin:', err))

    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber,
    })
  } catch (error) {
    console.error('Food order error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat pesanan' },
      { status: 500 }
    )
  }
}
