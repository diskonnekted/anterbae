'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

/**
 * Mencari vendor berdasarkan nomor WhatsApp dan PIN untuk keperluan login portal.
 */
export async function getVendorByPhone(phone: string, pin: string) {
  try {
    const query = `*[_type == "vendor" && phone == $phone][0]{
      _id,
      name,
      phone,
      pin,
      description,
      isOpen,
      closingMessage,
      "slug": slug.current
    }`
    const vendor = await writeClient.fetch(query, { phone })
    
    if (!vendor) {
      return { success: false, error: 'Nomor WhatsApp tidak terdaftar sebagai penjual.' }
    }

    if (vendor.pin !== pin) {
      return { success: false, error: 'PIN yang Anda masukkan salah.' }
    }

    // Jangan kirim PIN balik ke client untuk keamanan
    delete vendor.pin

    return { success: true, data: vendor }
  } catch (error) {
    console.error('Fetch vendor failed:', error)
    return { success: false, error: 'Terjadi kesalahan sistem.' }
  }
}

/**
 * Update profil operasional vendor (Buka/Tutup & Deskripsi)
 */
export async function updateVendorProfile(vendorId: string, data: { isOpen: boolean, closingMessage?: string, description?: string }) {
  try {
    await writeClient
      .patch(vendorId)
      .set({
        isOpen: data.isOpen,
        closingMessage: data.closingMessage || '',
        description: data.description || ''
      })
      .commit()

    return { success: true }
  } catch (error) {
    console.error('Update vendor failed:', error)
    return { success: false, error: 'Gagal memperbarui profil toko.' }
  }
}
