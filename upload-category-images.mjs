import { createClient } from 'next-sanity'
import fs from 'fs'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: 'skWKhdc3R1GD89Vc7y5ohvknZTD00u2DzIGQ2UwcA2GEtD7p2LFsrkduIeUMpLSixMvAF3EynGYsWZlqAgNRtKGfAqvUkwLSaXczszw3nJgTRDqwIFRekm4jOpiYCvdUxvEOj9DsGnO7Z8Zq9gSWdM8sfVwGvbWzthTzBQQeGkjTDYURubpy',
  useCdn: false,
})

// Update these paths to the exact generated image paths
const uploads = [
  { slug: 'kebutuhan-pokok', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\kebutuhan_pokok_cover_1781312521490.png` },
  { slug: 'kesehatan-apotek', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\kesehatan_apotek_cover_1781312538226.png` },
  { slug: 'makanan-minuman', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\makanan_minuman_cover_1781312552268.png` }
]

async function uploadCategoryImages() {
  for (const item of uploads) {
    console.log(`Mengunggah gambar untuk kategori ${item.slug}...`)
    try {
      // 1. Upload image asset
      const asset = await client.assets.upload('image', fs.createReadStream(item.file), {
        filename: item.slug + '.png'
      })
      console.log(`Berhasil mengunggah gambar dengan ID: ${asset._id}`)

      // 2. Find category by slug
      const category = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: item.slug })
      if (!category) {
        console.log(`Kategori ${item.slug} tidak ditemukan!`)
        continue
      }

      // 3. Update category document with image reference
      await client.patch(category._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            }
          }
        })
        .commit()
      
      console.log(`Kategori ${item.slug} berhasil diupdate dengan gambar.`)
    } catch (err) {
      console.error(`Gagal memproses kategori ${item.slug}:`, err.message)
    }
  }
}

uploadCategoryImages()
