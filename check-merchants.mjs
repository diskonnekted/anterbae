import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  token: 'skWKhdc3R1GD89Vc7y5ohvknZTD00u2DzIGQ2UwcA2GEtD7p2LFsrkduIeUMpLSixMvAF3EynGYsWZlqAgNRtKGfAqvUkwLSaXczszw3nJgTRDqwIFRekm4jOpiYCvdUxvEOj9DsGnO7Z8Zq9gSWdM8sfVwGvbWzthTzBQQeGkjTDYURubpy',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const merchants = await client.fetch(`*[_type == "merchant"] {
  _id,
  name,
  category,
  isVerified,
  slug,
  isOpen,
  area,
  address,
  logo,
  coverImage,
  minOrder
}`)

console.log('=== SEMUA MERCHANT ===')
merchants.forEach(m => {
  console.log(`${m.name} | cat: ${m.category} | verified: ${m.isVerified} | isOpen: ${m.isOpen} | slug: ${m.slug?.current}`)
})

console.log('\n=== Detail Toko Kelontong Bima ===')
const bima = merchants.find(m => m.name.toLowerCase().includes('bima'))
if (bima) {
  console.log(JSON.stringify(bima, null, 2))
} else {
  console.log('TIDAK DITEMUKAN')
}

console.log('\n=== Query MERCHANTS_QUERY (isVerified==true) ===')
const verified = await client.fetch(`*[_type == "merchant" && isVerified == true] {
  _id, name, category, slug, isOpen
}`)
verified.forEach(m => console.log(`${m.name} | cat: ${m.category} | isOpen: ${m.isOpen}`))

console.log('\n=== Query GROCERY (category=="grocery") ===')
const grocery = await client.fetch(`*[_type == "merchant" && isVerified == true && category == "grocery"] {
  _id, name, category, slug, isOpen
}`)
grocery.forEach(m => console.log(`${m.name} | cat: ${m.category} | isOpen: ${m.isOpen}`))
