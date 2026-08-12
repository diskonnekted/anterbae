'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function fetchAllOrders() {
  try {
    const query = `*[_type == "deliveryOrder"] | order(_createdAt desc) {
      _id,
      orderNumber,
      _createdAt,
      customerName,
      customerPhone,
      orderType,
      items,
      pickupAddress,
      deliveryAddress,
      deliveryArea,
      customerNotes,
      totalAmount,
      shippingFee,
      paymentMethod,
      paymentStatus,
      status,
      courier->{
        _id,
        name,
        phone
      }
    }`

    const orders = await writeClient.fetch(query)
    return { success: true, data: orders }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { success: false, error: 'Gagal memuat daftar pesanan.' }
  }
}

export async function fetchCouriers() {
  try {
    const query = `*[_type == "courier"] | order(name asc) {
      _id,
      name,
      phone,
      area,
      vehicleType,
      isActive,
      status,
      latitude,
      longitude,
      lastLocationUpdate
    }`
    const couriers = await writeClient.fetch(query)
    return { success: true, data: couriers }
  } catch (error) {
    console.error('Error fetching couriers:', error)
    return { success: false, error: 'Gagal memuat daftar kurir.' }
  }
}

export async function fetchMerchants() {
  try {
    const query = `*[_type == "merchant"] | order(name asc) {
      _id,
      name,
      category,
      phone,
      area,
      address,
      isOpen
    }`
    const merchants = await writeClient.fetch(query)
    return { success: true, data: merchants }
  } catch (error) {
    console.error('Error fetching merchants:', error)
    return { success: false, error: 'Gagal memuat daftar merchant.' }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const updated = await writeClient
      .patch(orderId)
      .set({ status })
      .commit()
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Gagal memperbarui status pesanan.' }
  }
}

export async function assignCourier(orderId: string, courierId: string) {
  try {
    const patchData: any = {}
    if (courierId) {
      patchData.courier = {
        _type: 'reference',
        _ref: courierId,
      }
      patchData.status = 'delivering' // Auto-update to delivering when courier is assigned
    } else {
      patchData.courier = null
    }

    const updated = await writeClient
      .patch(orderId)
      .set(patchData)
      .commit()
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error assigning courier:', error)
    return { success: false, error: 'Gagal menunjuk kurir.' }
  }
}
