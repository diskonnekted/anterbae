'use server'

import { client } from '@/sanity/lib/client'

export async function getCourierByPhone(phone: string, pin: string) {
  try {
    const courier = await client.fetch(
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

    // Fetch assigned orders
    const orders = await client.fetch(
      `*[_type == "deliveryOrder" && courier._ref == $id && status != "completed" && status != "cancelled"] | order(_createdAt desc) {
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
        courierNotes,
        estimatedTime,
        _createdAt,
        "merchant": merchant->{ name, phone }
      }`,
      { id: courier._id }
    )

    return { success: true, data: { courier, orders } }
  } catch (e) {
    return { success: false, error: 'Terjadi kesalahan server.' }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await client.patch(orderId).set({ status }).commit()
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal update status.' }
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
    await client.create({
      _type: 'courierApplication',
      ...data,
      applicationStatus: 'pending',
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menyimpan data.' }
  }
}
