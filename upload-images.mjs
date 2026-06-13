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
  { slug: 'es-dawet-ayu-spesial-durian', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\dawet_ayu_1781307471933.png` },
  { slug: 'soto-sapi-krandegan', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\soto_krandegan_1781307483321.png` },
  { slug: 'beras-mentik-wangi-5kg', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\beras_mentik_1781307494246.png` },
  { slug: 'minyak-goreng-2l', file: String.raw`C:\Users\diskonekted\.gemini\antigravity-ide\brain\e397f3a0-fc0a-4d96-be27-df448ff56723\minyak_goreng_1781307502981.png` }
]

async function uploadImages() {
  for (const item of uploads) {
    console.log(`Mengunggah gambar untuk ${item.slug}...`)
    try {
      // 1. Upload image asset
      const asset = await client.assets.upload('image', fs.createReadStream(item.file), {
        filename: item.slug + '.png'
      })
      console.log(`Berhasil mengunggah gambar dengan ID: ${asset._id}`)

      // 2. Find product by slug
      const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: item.slug })
      if (!product) {
        console.log(`Product ${item.slug} tidak ditemukan!`)
        continue
      }

      // 3. Update product document with image reference
      await client.patch(product._id)
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
      
      console.log(`Produk ${item.slug} berhasil diupdate dengan gambar.`)
    } catch (err) {
      console.error(`Gagal mengunggah untuk ${item.slug}:`, err.message)
    }
  }
}

uploadImages().then(() => console.log('Proses selesai.'))
