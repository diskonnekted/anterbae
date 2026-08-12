'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-01',
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

    // Fetch assigned orders
    const orders = await writeClient.fetch(
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
    await writeClient.patch(orderId).set({ status }).commit()
    return { success: true }
  } catch {
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
