import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'
import { upsertCustomer, updateBuyerLevel } from '@/app/actions/buyer-level'
import { getBuyerLevel } from '@/lib/buyer-level-utils'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("POST /api/food-order received payload:", JSON.stringify(data))
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
      paymentMethod = 'cod_transfer', // default to transfer
    } = data

    // Rate limit: max 3 food orders per phone in 5 minutes
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const recentOrders = await sanity.fetch(
      `count(*[_type == "order" && customerPhone == $phone && _createdAt > $cutoff])`,
      { phone: customerPhone, cutoff: cutoffTime }
    )

    if (recentOrders >= 3) {
      return NextResponse.json(
        { error: 'Terlalu banyak pesanan! Maksimal 3 pesanan dalam 5 menit.' },
        { status: 429 }
      )
    }

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
        productId: {
          _type: 'reference',
          _ref: item.productId,
        },
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || '',
      })),
      totalAmount: total,
      shippingFee: deliveryFee,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'cod_on_delivery' ? 'paid' : 'unpaid',
      status: 'pending',
      foodOrderStatus: paymentMethod === 'cod_on_delivery' ? 'confirmed_resto_prep' : 'waiting_payment',
      paymentFlow: {
        _type: 'paymentFlow',
        accountNumber: '1234567890', // Should be from settings
        accountName: 'Anterbae Banjarnegara',
        paymentStatus: paymentMethod === 'cod_on_delivery' ? 'confirmed' : 'waiting_payment',
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

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = `${protocol}://${host}`

    // Format WhatsApp message based on payment method
    const isCOD = paymentMethod === 'cod_on_delivery'
    
    const itemsList = items.map((item: any) =>
      `- ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}${item.notes ? ` (${item.notes})` : ''}`
    ).join('\n')
    
    let customerMessage = `*🛵 PESANAN MAKANAN ${orderNumber}*\n\n` +
      `Terima kasih telah memesan di *${restaurantName}*\n\n` +
      `*Detail Pesanan:*\n${itemsList}\n\n` +
      `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n` +
      `Ongkir: Rp ${deliveryFee.toLocaleString('id-ID')}\n` +
      `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n\n` +
      `*Cara Pembayaran:*\n` +
      (isCOD 
        ? `✅ **Bayar di Tempat (COD)**\n` +
          `Silakan siapkan uang tunai Rp ${total.toLocaleString('id-ID')}\n` +
          `Kurir akan mengambil uang saat pengantaran\n\n` +
          `Pesanan Anda langsung diproses dan kurir akan segera diinformasikan. 🛵`
        : `Transfer ke:\nBCA: 1234567890\na.n. Anterbae Banjarnegara\n\n` +
          `Sudah transfer? Klik link berikut untuk kirim bukti:\n` +
          `https://wa.me/6281328128315?text=${encodeURIComponent(
            `Halo Admin, saya sudah transfer untuk pesanan ${orderNumber} sebesar Rp ${total.toLocaleString('id-ID')}. Berikut buktinya.`
          )}\n\n` +
          `Setelah konfirmasi, pesanan akan diproses.`
      ) + `\n\n` +
      `📍 Alamat: ${deliveryAddress}`

    if (isCOD) {
      customerMessage += `\n\n*Aksi Penerimaan Barang (Klik Link):*\n` +
        `1. Klik jika sudah terima barang:\n` +
        `👉 ${baseUrl}/order-action?orderNumber=${orderNumber}&action=received\n\n` +
        `2. Klik jika barang bermasalah:\n` +
        `👉 ${baseUrl}/order-action?orderNumber=${orderNumber}&action=problem`
    }

    // Send WhatsApp to customer
    await sendWhatsAppNotification(
      customerPhone,
      customerMessage
    ).catch(err => console.error('Failed to send WA to customer:', err))

    // Send notification to admin
    const adminMessage = `*🍔 PESANAN MAKANAN BARU*\n\n` +
      `*Order:* ${orderNumber}\n` +
      `*Resto:* ${restaurantName}\n` +
      `*Pelanggan:* ${customerName}\n` +
      `*WA:* ${customerPhone}\n` +
      `*Alamat:* ${deliveryAddress}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Pembayaran:* ${isCOD ? '✅ COD (Bayar di Tempat)' : '🏦 Transfer'}\n` +
      `*Total:* Rp ${total.toLocaleString('id-ID')}\n\n` +
      (isCOD ? `✅ Langsung diproses - Kurir ambil uang di tempat` : `Menunggu pembayaran...`) +
      `\n\n*Aksi Cepat Admin (Klik Link):*\n` +
      `1. Terima Pesanan:\n` +
      `👉 ${baseUrl}/admin-order-action?orderNumber=${orderNumber}&action=accept\n\n` +
      `2. Hubungi/Tunjuk Kurir Bertugas:\n` +
      `👉 ${baseUrl}/admin-order-action?orderNumber=${orderNumber}&action=courier-wa\n\n` +
      `3. Tolak Pesanan (dengan alasan):\n` +
      `👉 ${baseUrl}/admin-order-action?orderNumber=${orderNumber}&action=reject`

    await sendWhatsAppNotification(
      '6281328128315',
      adminMessage
    ).catch(err => console.error('Failed to send WA to admin:', err))

    // Update buyer level
    try {
      // Get customer order count from Sanity
      const existingOrders = await sanity.fetch(
        `count(*[_type == "order" && customerPhone == $phone])`,
        { phone: customerPhone }
      )
      
      const newTotalOrders = (existingOrders || 0) + 1
      
      // Upsert customer
      await upsertCustomer({
        name: customerName,
        phone: customerPhone,
        address: deliveryAddress,
        orderCount: newTotalOrders,
        totalSpent: total,
      })

      // Send level up notification if applicable
      const levelInfo = getBuyerLevel(newTotalOrders)
      if (newTotalOrders === 10 || newTotalOrders === 11 || newTotalOrders === 51) {
        let levelUpMessage = ''
        if (newTotalOrders === 10) {
          levelUpMessage = `\n\n🎉 Selamat! Anda akan naik ke Level 2 (VIP) setelah 1 pesanan lagi!`
        } else if (newTotalOrders === 11) {
          levelUpMessage = `\n\n🎊 CONGRATULATIONS! Anda naik ke Level 2 - PEMBELI RUTIN VIP! 🥈\nBonus: Gratis ongkir untuk 3 pesanan berikutnya!`
        } else if (newTotalOrders === 51) {
          levelUpMessage = `\n\n🏆 CONGRATULATIONS! Anda naik ke Level 3 - PEMBELIE SETIA VVIP! 🥇\nBonus: Gratis ongkir selamanya + Priority Service!`
        }

        if (levelUpMessage) {
          await sendWhatsAppNotification(customerPhone, levelUpMessage).catch(() => {})
        }
      }
    } catch (err) {
      console.error('Error updating buyer level:', err)
      // Don't fail the order if level update fails
    }

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
