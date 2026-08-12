'use server'

import { client } from '@/sanity/lib/client'
import { sendWhatsAppNotification, formatOrderMessage } from '@/sanity/lib/whatsapp'
import { APP_SETTINGS_QUERY } from '@/sanity/lib/queries'

// Rate limit: max orders per phone number within the time window (in milliseconds)
const RATE_LIMIT_MAX_ORDERS = 3
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

export async function getAppSettings() {
  try {
    const settings = await client.fetch(APP_SETTINGS_QUERY)
    return { success: true, data: settings }
  } catch {
    return { success: false, error: 'Failed to fetch settings' }
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await client.fetch(
      `*[_type == "deliveryOrder" && orderNumber == $orderNumber][0] {
        _id,
        orderNumber,
        customerName,
        customerPhone,
        orderType,
        items,
        pickupAddress,
        deliveryAddress,
        deliveryArea,
        status,
        totalAmount,
        shippingFee,
        paymentMethod,
        estimatedTime,
        _createdAt,
        "merchant": merchant->{ name, logo, phone },
        "courier": courier->{ name, phone, vehicleType, area }
      }`,
      { orderNumber }
    )

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan. Periksa nomor order Anda.' }
    }

    return { success: true, data: order }
  } catch {
    return { success: false, error: 'Terjadi kesalahan. Coba lagi.' }
  }
}

export async function createDeliveryOrder(data: {
  customerName: string
  customerPhone: string
  orderType: 'food' | 'parcel' | 'jastip'
  merchantName?: string
  items: string
  pickupAddress: string
  deliveryAddress: string
  deliveryArea?: string
  customerNotes?: string
  paymentMethod: 'cod' | 'transfer'
}) {
  try {
    // Rate limit check: count recent orders from same phone
    const cutoffTime = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
    const recentOrders = await client.fetch(
      `count(*[_type == "deliveryOrder" && customerPhone == $phone && _createdAt > $cutoff])`,
      { phone: data.customerPhone, cutoff: cutoffTime }
    )

    if (recentOrders >= RATE_LIMIT_MAX_ORDERS) {
      return {
        success: false,
        error: `Terlalu banyak pesanan! Maksimal ${RATE_LIMIT_MAX_ORDERS} pesanan dalam ${RATE_LIMIT_WINDOW_MS / 60000} menit. Tunggu sebentar atau hubungi admin.`,
      }
    }

    const rand = Math.floor(100 + Math.random() * 900)
    const orderNumber = `ANT-${Date.now().toString().slice(-6)}${rand}`

    const order = await client.create({
      _type: 'deliveryOrder',
      orderNumber,
      ...data,
      status: 'pending',
      paymentStatus: 'unpaid',
      _createdAt: new Date().toISOString(),
    })

    // Fetch Admin Settings for Notification
    const settings = await client.fetch(APP_SETTINGS_QUERY)
    const adminPhone = settings?.adminPhone || '6281328128315'

    // Extract item details for Fonnte API notification (simplified for notification)
    const notificationItems = data.items.split('\n').map(line => ({
      name: line,
      quantity: 1, // Simplified since string already contains quantity
      price: 0
    }))

    // Send Fonnte API Notification to Admin silently
    const msg = formatOrderMessage(
      orderNumber,
      data.customerName,
      data.customerPhone,
      data.deliveryAddress,
      notificationItems,
      0, // Let the WA redirect handle exact prices, this is just a quick alert
      0,
      0
    )
    
    // We don't await this so it doesn't block the UI return
    sendWhatsAppNotification(adminPhone, msg).catch(console.error)

    return { success: true, data: { orderNumber, id: order._id, adminPhone } }
  } catch {
    return { success: false, error: 'Gagal membuat pesanan. Coba lagi.' }
  }
}
