'use server'

import { createClient } from 'next-sanity'
import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
})

export async function getOrderByNumber(orderNumber: string) {
  try {
    // Check in both 'order' (food) and 'deliveryOrder' types
    const query = `*[(_type == "order" || _type == "deliveryOrder") && orderNumber == $orderNumber][0] {
      _id,
      _type,
      orderNumber,
      customerName,
      customerPhone,
      status,
      foodOrderStatus,
      restaurantName,
      merchantName,
      totalAmount,
      rejectionReason,
      courier-> {
        name,
        phone
      }
    }`
    const order = await writeClient.fetch(query, { orderNumber })
    return { success: true, data: order }
  } catch (error) {
    console.error('Error fetching order by number:', error)
    return { success: false, error: 'Gagal memuat detail pesanan.' }
  }
}

export async function processOrderLinkAction(orderNumber: string, action: string, extraData?: any) {
  try {
    // Fetch order first
    const { data: order } = await getOrderByNumber(orderNumber)
    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' }
    }

    const patchData: any = {}
    const isFoodOrder = order._type === 'order'

    if (action === 'received') {
      patchData.status = 'completed'
      if (isFoodOrder) {
        patchData.foodOrderStatus = 'completed'
        patchData.paymentStatus = 'paid'
      }
    } else if (action === 'problem') {
      patchData.status = 'problem'
      if (isFoodOrder) {
        patchData.foodOrderStatus = 'problem'
      }
    } else if (action === 'accept') {
      patchData.status = 'accepted'
      if (isFoodOrder) {
        patchData.foodOrderStatus = 'confirmed_resto_prep'
      }
    } else if (action === 'reject') {
      const reason = extraData?.reason || 'Tidak ada alasan spesifik.'
      patchData.status = 'cancelled'
      patchData.rejectionReason = reason
      if (isFoodOrder) {
        patchData.foodOrderStatus = 'cancelled'
      }

      // Automatically send rejection WA to customer
      const rejectionMsg = `*❌ PESANAN DITOLAK (${orderNumber})*\n\n` +
        `Halo ${order.customerName},\n` +
        `Mohon maaf, pesanan Anda di *${order.restaurantName || order.merchantName || 'Anterbae'}* terpaksa ditolak oleh admin dengan alasan:\n\n` +
        `> _"${reason}"_\n\n` +
        `Silakan hubungi admin jika memiliki pertanyaan. Terima kasih.`
      
      await sendWhatsAppNotification(order.customerPhone, rejectionMsg).catch(err =>
        console.error('Failed to send rejection notification:', err)
      )
    }

    const updated = await writeClient
      .patch(order._id)
      .set(patchData)
      .commit()

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error processing order link action:', error)
    return { success: false, error: 'Gagal memperbarui data pesanan.' }
  }
}
