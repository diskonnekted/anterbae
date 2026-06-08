'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function registerVendor(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const description = formData.get('description') as string
    const businessType = formData.get('businessType') as string
    const logoFile = formData.get('logo') as File | null

    if (!name || !phone || !businessType) {
      return { success: false, error: 'Data wajib tidak lengkap.' }
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    
    let logoAssetId = null

    // Upload Logo jika ada
    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: logoFile.name,
        contentType: logoFile.type
      })
      logoAssetId = asset._id
    }

    const doc: any = {
      _type: 'vendor',
      _id: `drafts.${Math.random().toString(36).substr(2, 9)}`, // Create as DRAFT
      name,
      slug: { _type: 'slug', current: slug },
      phone,
      address,
      description,
      businessType,
      isVerified: false, // Default pending
    }

    if (logoAssetId) {
      doc.logo = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: logoAssetId
        }
      }
    }

    const result = await writeClient.create(doc)
    return { success: true, vendorId: result._id }
  } catch (error: any) {
    console.error('Vendor registration failed (FULL ERROR):', error)
    return { success: false, error: `Gagal mengirim pendaftaran. Detail: ${error.message}` }
  }
}
