'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function getVendorServices(vendorId: string) {
  try {
    const query = `*[_type == "service" && vendor._ref == $vendorId] | order(_createdAt desc) {
      _id,
      name,
      price,
      priceType,
      description,
      image,
      "categories": categories[]._ref,
      "slug": slug.current
    }`
    const services = await writeClient.fetch(query, { vendorId })
    return { success: true, data: services }
  } catch (error) {
    console.error('Fetch vendor services failed:', error)
    return { success: false, error: 'Gagal mengambil daftar jasa.' }
  }
}

export async function createVendorService(vendorId: string, data: {
  name: string,
  price: number,
  priceType: string,
  description?: string,
  assetId: string,
  categoryIds?: string[]
}) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 200) + '-' + Math.random().toString(36).substr(2, 5)
    
    const doc: any = {
      _type: 'service',
      name: data.name,
      slug: { _type: 'slug', current: slug },
      price: data.price,
      priceType: data.priceType,
      description: data.description,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.assetId,
        },
      },
      vendor: {
        _type: 'reference',
        _ref: vendorId,
      },
    }

    if (data.categoryIds && data.categoryIds.length > 0) {
      doc.categories = data.categoryIds.map(id => ({
        _type: 'reference',
        _ref: id,
        _key: Math.random().toString(36).substr(2, 9)
      }))
    }

    const result = await writeClient.create(doc)
    return { success: true, serviceId: result._id }
  } catch (error) {
    console.error('Create service failed:', error)
    return { success: false, error: 'Gagal menambah jasa.' }
  }
}

export async function updateVendorService(serviceId: string, vendorId: string, data: {
  name?: string,
  price?: number,
  priceType?: string,
  description?: string,
  assetId?: string | null,
  categoryIds?: string[]
}) {
  try {
    const service = await writeClient.fetch(`*[_type == "service" && _id == $serviceId][0]{"vId": vendor._ref}`, { serviceId })
    
    if (!service || service.vId !== vendorId) {
      return { success: false, error: 'Akses ditolak.' }
    }

    const updates: any = {}
    if (data.name !== undefined) updates.name = data.name
    if (data.price !== undefined) updates.price = data.price
    if (data.priceType !== undefined) updates.priceType = data.priceType
    if (data.description !== undefined) updates.description = data.description

    if (data.assetId) {
      updates.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.assetId,
        },
      }
    }

    if (data.categoryIds) {
      updates.categories = data.categoryIds.map(id => ({
        _type: 'reference',
        _ref: id,
        _key: Math.random().toString(36).substr(2, 9)
      }))
    }

    await writeClient.patch(serviceId).set(updates).commit()
    return { success: true }
  } catch (error) {
    console.error('Update service failed:', error)
    return { success: false, error: 'Gagal memperbarui jasa.' }
  }
}

export async function deleteVendorService(serviceId: string, vendorId: string) {
  try {
    const service = await writeClient.fetch(`*[_type == "service" && _id == $serviceId][0]{"vId": vendor._ref}`, { serviceId })
    
    if (!service || service.vId !== vendorId) {
      return { success: false, error: 'Akses ditolak.' }
    }

    await writeClient.delete(serviceId)
    return { success: true }
  } catch (error) {
    console.error('Delete service failed:', error)
    return { success: false, error: 'Gagal menghapus jasa.' }
  }
}
