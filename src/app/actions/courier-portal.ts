'use server'

import { createClient } from 'next-sanity'
import { createActivityLog } from '@/app/actions/activity-log'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function getCourierByPhone(phone: string, pin: string) {
  try {
    const courier = await writeClient.fetch(
      `*[_type == "courier" && phone == $phone][0]`,
      { phone }
    )

    if (!courier) {
      return { success: false, error: 'Nomor tidak terdaftar sebagai kurir Anterbae.' }
    }

    if (courier.pin && courier.pin !== pin) {
      return { success: false, error: 'PIN salah. Silakan coba lagi.' }
    }

    if (!courier.isActive || courier.status === 'inactive') {
      return { success: false, error: `Akun kurir tidak aktif. ${courier.statusMessage || ''}` }
    }

    // Fetch assigned orders (both regular deliveryOrder and food order)
    const rawOrders = await writeClient.fetch(
      `*[_type in ["deliveryOrder", "order"] && courier._ref == $id && status != "completed" && status != "cancelled" && foodOrderStatus != "completed" && foodOrderStatus != "cancelled"] | order(_createdAt desc) {
        _id,
        _type,
        orderNumber,
        customerName,
        customerPhone,
        orderType,
        orderCategory,
        items,
        foodItems[],
        pickupAddress,
        deliveryAddress,
        deliveryArea,
        status,
        foodOrderStatus,
        totalAmount,
        shippingFee,
        paymentMethod,
        courierNotes,
        estimatedTime,
        _createdAt,
        "merchant": merchant->{ name, phone }
      }`,
      { id: courier._id }
    )

    const ordersPromises = rawOrders.map(async (order: any) => {
      let itemsText = order.items || ''
      if (order._type === 'order' && order.foodItems) {
        itemsText = order.foodItems
          .map((item: any) => `${item.name} x${item.quantity}${item.notes ? ` (${item.notes})` : ''}`)
          .join('\n')
      }

      // Fetch logs for this order
      const logs = await writeClient.fetch(
        `*[_type == "activityLog" && order._ref == $orderId] | order(timestamp desc) {
          _id, timestamp, actor, action, notes
        }`,
        { orderId: order._id }
      )

      return {
        ...order,
        items: itemsText,
        orderType: order.orderType || order.orderCategory || 'food',
        status: order.status || order.foodOrderStatus || 'pending',
        logs: logs || []
      }
    })

    const orders = await Promise.all(ordersPromises)

    return { success: true, data: { courier, orders } }
  } catch (e) {
    console.error('Error in getCourierByPhone:', e)
    return { success: false, error: 'Terjadi kesalahan server.' }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const doc = await writeClient.fetch(`*[_id == $orderId][0]{ _type, "courierId": courier._ref }`, { orderId })
    if (!doc) {
      return { success: false, error: 'Pesanan tidak ditemukan.' }
    }

    const updates: any = { status }

    if (doc._type === 'order') {
      let foodStatus = 'accepted'
      if (status === 'accepted') foodStatus = 'confirmed_resto_prep'
      else if (status === 'picking_up' || status === 'picked_up') foodStatus = 'courier_picking'
      else if (status === 'delivering') foodStatus = 'delivering'
      else if (status === 'delivered' || status === 'completed') foodStatus = 'completed'
      else if (status === 'problem') foodStatus = 'problem'

      updates.foodOrderStatus = foodStatus
    }

    await writeClient.patch(orderId).set(updates).commit()

    // Log the status change by courier
    await createActivityLog({
      orderId: orderId,
      courierId: doc.courierId || undefined,
      actor: 'courier',
      action: 'Update Status Pengantaran',
      notes: `Kurir memperbarui status pesanan menjadi: ${status.toUpperCase()}.`
    }).catch(err => console.error('Failed to log status update from portal:', err))

    return { success: true }
  } catch (error) {
    console.error('Error updating order status in portal:', error)
    return { success: false, error: 'Gagal update status.' }
  }
}

export async function updateCourierLocation(courierId: string, latitude: number, longitude: number) {
  try {
    await writeClient
      .patch(courierId)
      .set({
        latitude,
        longitude,
        lastLocationUpdate: new Date().toISOString()
      })
      .commit()
    return { success: true }
  } catch (error) {
    console.error('Error updating location:', error)
    return { success: false, error: 'Gagal memperbarui lokasi kurir.' }
  }
}

export async function submitCourierApplication(data: {
  name: string
  phone: string
  address: string
  area: string
  vehicleType: string
  vehiclePlate: string
  ktpNumber: string
  motivation: string
}) {
  try {
    await writeClient.create({
      _type: 'courierApplication',
      ...data,
      applicationStatus: 'pending',
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menyimpan data.' }
  }
}
