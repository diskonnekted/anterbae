'use server'

import { createClient } from '@sanity/client'
import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'
import { createActivityLog } from '@/app/actions/activity-log'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Fetch all food orders
export async function fetchFoodOrders() {
  try {
    const orders = await sanity.fetch(
      `*[_type == "order" && orderCategory == "food"] | order(_createdAt desc) {
        _id,
        orderNumber,
        _createdAt,
        customerName,
        customerPhone,
        deliveryAddress,
        customerNotes,
        restaurantName,
        totalAmount,
        shippingFee,
        paymentMethod,
        paymentStatus,
        status,
        foodOrderStatus,
        foodItems[],
        paymentFlow,
        customerLocation,
        "courier": courier->{ _id, name, phone }
      }`
    )

    return { success: true, data: orders }
  } catch (error) {
    console.error('Error fetching food orders:', error)
    return { success: false, error: 'Gagal memuat pesanan makanan' }
  }
}

// Update food order status
export async function updateFoodOrderStatus(orderId: string, newStatus: string, paymentStatus?: string) {
  try {
    const updates: any = {
      foodOrderStatus: newStatus,
    }
    
    if (paymentStatus) {
      updates['paymentFlow.paymentStatus'] = paymentStatus
    }

    if (newStatus === 'confirmed') {
      updates['paymentFlow.confirmedAt'] = new Date().toISOString()
    }

    await sanity.patch(orderId).set(updates).commit()

    return { success: true }
  } catch (error) {
    console.error('Error updating food order:', error)
    return { success: false, error: 'Gagal mengupdate status' }
  }
}

// Confirm payment and notify restaurant + courier
export async function confirmPaymentAndNotify(orderId: string, orderNumber: string, restaurantName: string, customerPhone: string, totalAmount: number) {
  try {
    // Get full order data
    const order = await sanity.fetch(
      `*[_type == "order" && _id == $id][0]`,
      { id: orderId }
    )

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan' }
    }

    // Update status
    await sanity.patch(orderId).set({
      foodOrderStatus: 'confirmed_resto_prep',
      status: 'accepted',
      'paymentFlow.paymentStatus': 'confirmed',
      'paymentFlow.confirmedAt': new Date().toISOString(),
    }).commit()

    // Log payment confirmation
    await createActivityLog({
      orderId: orderId,
      actor: 'admin',
      action: 'Konfirmasi Pembayaran',
      notes: `Admin mengonfirmasi pembayaran untuk order ${orderNumber} sebesar Rp ${totalAmount.toLocaleString('id-ID')}.`
    }).catch(err => console.error('Failed to log payment confirmation:', err))

    // Notify Restaurant
    const restoMessage = `*🍔 PESANAN BARU - SIAPKAN ORDER*\n\n` +
      `*Order:* ${orderNumber}\n` +
      `*Pelanggan:* ${order.customerName}\n` +
      `*WA:* ${order.customerPhone}\n\n` +
      `*Menu:*\n${(order.foodItems || []).map((item: any) => 
        `- ${item.name} x${item.quantity}${item.notes ? ` (${item.notes})` : ''}`
      ).join('\n')}\n\n` +
      `*Total:* Rp ${totalAmount.toLocaleString('id-ID')}\n` +
      `*Alamat:* ${order.deliveryAddress}\n\n` +
      `Silakan siapkan pesanan dan kabari kurir saat siap. 🚀`

    // Send to admin (resto will notify via admin WA)
    await sendWhatsAppNotification(
        '6281328128315',
        restoMessage
      ).catch(err => console.error('Failed to notify resto:', err))

    // Find available courier in area
    const couriers = await sanity.fetch(
      `*[_type == "courier" && status == "active" && isActive == true] | order(_createdAt asc) [0...3] {
        _id, name, phone, area, vehicleType
      }`
    )

    if (couriers && couriers.length > 0) {
      const courier = couriers[0]
      
      // Assign courier to order
      await sanity.patch(orderId).set({
        courier: { _type: 'reference', _ref: courier._id },
        foodOrderStatus: 'resto_ready_waiting_courier',
      }).commit()

      // Log courier assignment
      await createActivityLog({
        orderId: orderId,
        courierId: courier._id,
        actor: 'system',
        action: 'Tunjuk Kurir',
        notes: `Sistem secara otomatis menugaskan Kurir ${courier.name} ke pesanan makanan ${orderNumber}.`
      }).catch(err => console.error('Failed to log auto courier assignment:', err))

      // Notify courier
      const courierMessage = `*🛵 PESANAN MAKANAN BARU*\n\n` +
        `*Order:* ${orderNumber}\n` +
        `*Resto:* ${restaurantName}\n` +
        `*Pickup:* ${order.deliveryAddress} (alamat resto bisa dikonfirmasi via WA admin)\n\n` +
        `*Item:*\n${(order.foodItems || []).map((item: any) => 
          `- ${item.name} x${item.quantity}`
        ).join('\n')}\n\n` +
        `*Total COD:* Rp ${totalAmount.toLocaleString('id-ID')}\n\n` +
        `*Alamat Pengiriman:*\n${order.deliveryAddress}\n\n` +
        `Pelanggan: ${order.customerPhone}\n\n` +
        `Klik link berikut untuk update status:\nanterbae.vercel.app/k`

      await sendWhatsAppNotification(
        courier.phone,
        courierMessage
      ).catch(err => console.error('Failed to notify courier:', err))

      return { 
        success: true, 
        assignedCourier: courier,
        message: `Berhasil konfirmasi. Resto & Kurir (${courier.name}) sudah dinotifikasi.`
      }
    }

    return { 
      success: true, 
      message: 'Berhasil dikonfirmasi. Menunggu kurir tersedia.'
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return { success: false, error: 'Gagal konfirmasi pembayaran' }
  }
}
