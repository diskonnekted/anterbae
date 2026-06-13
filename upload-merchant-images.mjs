import { createClient } from 'next-sanity'
import fs from 'fs'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: 'skWKhdc3R1GD89Vc7y5ohvknZTD00u2DzIGQ2UwcA2GEtD7p2LFsrkduIeUMpLSixMvAF3EynGYsWZlqAgNRtKGfAqvUkwLSaXczszw3nJgTRDqwIFRekm4jOpiYCvdUxvEOj9DsGnO7Z8Zq9gSWdM8sfVwGvbWzthTzBQQeGkjTDYURubpy',
  useCdn: false,
})

const uploads = [
  { 
    slug: 'toko-kelontong-bima', 
    logo: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\logo_kelontong_bima_1781312736349.png`,
    cover: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\banner_kelontong_bima_1781312775905.png`
  },
  { 
    slug: 'dawet-ayu-asli', 
    logo: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\logo_dawet_ayu_1781312747449.png`,
    cover: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\banner_dawet_ayu_1781312786365.png`
  },
  { 
    slug: 'soto-krandegan', 
    logo: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\logo_soto_krandegan_1781312758104.png`,
    cover: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\banner_soto_krandegan_1781312796645.png`
  }
]

async function uploadMerchantImages() {
  for (const item of uploads) {
    console.log(`Mengunggah gambar untuk merchant ${item.slug}...`)
    try {
      // 1. Upload logo
      const logoAsset = await client.assets.upload('image', fs.createReadStream(item.logo), {
        filename: item.slug + '-logo.png'
      })
      console.log(`Berhasil mengunggah logo dengan ID: ${logoAsset._id}`)

      // 2. Upload cover
      const coverAsset = await client.assets.upload('image', fs.createReadStream(item.cover), {
        filename: item.slug + '-cover.png'
      })
      console.log(`Berhasil mengunggah cover dengan ID: ${coverAsset._id}`)

      // 3. Find merchant by slug
      const merchant = await client.fetch(`*[_type == "merchant" && slug.current == $slug][0]`, { slug: item.slug })
      if (!merchant) {
        console.log(`Merchant ${item.slug} tidak ditemukan!`)
        continue
      }

      // 4. Update merchant document with image references
      await client.patch(merchant._id)
        .set({
          logo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: logoAsset._id
            }
          },
          coverImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: coverAsset._id
            }
          }
        })
        .commit()
      
      console.log(`Merchant ${item.slug} berhasil diupdate dengan logo & cover.`)
    } catch (err) {
      console.error(`Gagal memproses merchant ${item.slug}:`, err.message)
    }
  }
}

uploadMerchantImages()
