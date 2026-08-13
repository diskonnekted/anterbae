'use server'

import { createClient } from 'next-sanity'
import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'
import { createActivityLog } from '@/app/actions/activity-log'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
})

export async function fetchAllOrders() {
  try {
    const query = `*[_type == "order"] | order(_createdAt desc) {
      _id,
      orderNumber,
      _createdAt,
      customerName,
      customerPhone,
      orderType,
      orderCategory,
      restaurantName,
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

export async function toggleCourierStatus(courierId: string, isActive: boolean) {
  try {
    const updated = await writeClient
      .patch(courierId)
      .set({ 
        isActive: isActive,
        status: isActive ? 'active' : 'inactive' 
      })
      .commit()

    // Send WA activation notification if status is set to active
    if (isActive && updated && updated.phone) {
      const msg = `*⚡ AKUN KURIR DIAKTIFKAN*\n\nHalo *${updated.name}*,\nAkun kurir Anda telah diaktifkan oleh Admin Anterbae.\n\nAnda sekarang berstatus AKTIF dan siap menerima order pengantaran.\n\nSilakan cek portal kurir untuk memantau order:\nanterbae.vercel.app/k`
      sendWhatsAppNotification(updated.phone, msg).catch(err => {
        console.error('Failed to send activation WA notification:', err)
      })
    }

    return { success: true, data: updated }
  } catch (error: any) {
    console.error('Error toggling courier status:', error)
    return { success: false, error: error.message || 'Gagal mengubah status aktif kurir.' }
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
      isOpen,
      "logoUrl": logo.asset->url,
      description,
      openHours,
      isVerified,
      ownerName,
      latitude,
      longitude
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

    // Log the status change
    await createActivityLog({
      orderId: orderId,
      actor: 'admin',
      action: 'Update Status Pesanan',
      notes: `Admin memperbarui status pesanan menjadi: ${status.toUpperCase()}.`
    }).catch(err => console.error('Failed to create activity log for updateOrderStatus:', err))

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Gagal memperbarui status pesanan.' }
  }
}

export async function assignCourier(orderId: string, courierId: string) {
  try {
    const patchData: any = {}
    let courierPhone: string | null = null
    let courierName: string = ''
    let courierMsg: string = ''

    if (courierId) {
      patchData.courier = {
        _type: 'reference',
        _ref: courierId,
      }
      patchData.status = 'delivering' // Auto-update to delivering when courier is assigned

      // Fetch courier details
      const courier = await writeClient.fetch(`*[_id == $courierId][0]{ name, phone }`, { courierId })
      if (courier) {
        courierPhone = courier.phone
        courierName = courier.name
      }

      // Fetch order details
      const order = await writeClient.fetch(`*[_id == $orderId][0]{ _type, orderNumber, customerName, customerPhone, deliveryAddress, pickupAddress, items, totalAmount, paymentMethod }`, { orderId })
      
      if (order && order._type === 'order') {
        patchData.foodOrderStatus = 'courier_picking'
      }

      if (order && courierPhone) {
        courierMsg = `*🛵 TUGAS PENGANTARAN BARU*\n\n` +
          `*Order:* ${order.orderNumber || '-'}\n` +
          `*Pelanggan:* ${order.customerName || '-'}\n` +
          `*HP Pelanggan:* ${order.customerPhone || '-'}\n\n` +
          (order.pickupAddress ? `*Lokasi Ambil:* ${order.pickupAddress}\n` : '') +
          `*Alamat Kirim:* ${order.deliveryAddress || '-'}\n\n` +
          `*Item Barang:*\n${order.items || '-'}\n\n` +
          `*Metode Bayar:* ${order.paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'Transfer'}\n` +
          `*Total Tagihan:* Rp ${(order.totalAmount || 0).toLocaleString('id-ID')}\n\n` +
          `Klik link berikut untuk masuk ke Portal Kurir & update status pengantaran:\n` +
          `anterbae.vercel.app/k`
      }
    } else {
      patchData.courier = null
    }

    const updated = await writeClient
      .patch(orderId)
      .set(patchData)
      .commit()

    // Log the assignment
    await createActivityLog({
      orderId: orderId,
      courierId: courierId || undefined,
      actor: 'admin',
      action: courierId ? 'Tunjuk Kurir' : 'Lepas Kurir',
      notes: courierId 
        ? `Admin menunjuk Kurir ${courierName} untuk mengantarkan pesanan.`
        : `Admin membatalkan penugasan kurir pada pesanan.`
    }).catch(err => console.error('Failed to create activity log for assignCourier:', err))

    // Trigger WhatsApp notification asynchronously so it doesn't block completion
    if (courierPhone && courierMsg) {
      sendWhatsAppNotification(courierPhone, courierMsg).catch(err => {
        console.error('Failed to send courier WA notification:', err)
      })
    }

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error assigning courier:', error)
    return { success: false, error: 'Gagal menunjuk kurir.' }
  }
}

export async function sendCourierMessageViaFonnte(phone: string, message: string) {
  try {
    if (!phone) return { success: false, error: 'Nomor telepon tidak valid.' }
    if (!message) return { success: false, error: 'Pesan tidak boleh kosong.' }
    const res = await sendWhatsAppNotification(phone, message)
    return res
  } catch (error: any) {
    console.error('Error sending courier message via Fonnte:', error)
    return { success: false, error: error.message || 'Gagal mengirim pesan.' }
  }
}
