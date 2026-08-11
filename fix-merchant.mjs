import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  token: 'skWKhdc3R1GD89Vc7y5ohvknZTD00u2DzIGQ2UwcA2GEtD7p2LFsrkduIeUMpLSixMvAF3EynGYsWZlqAgNRtKGfAqvUkwLSaXczszw3nJgTRDqwIFRekm4jOpiYCvdUxvEOj9DsGnO7Z8Zq9gSWdM8sfVwGvbWzthTzBQQeGkjTDYURubpy',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Update Bima to add minOrder if missing
const bima = await client.fetch(`*[_type == "merchant" && name == "Toko Kelontong Bima"][0] {
  _id, name, minOrder
}`)

console.log('Toko Kelontong Bima minOrder:', bima.minOrder)

if (!bima.minOrder) {
  const updated = await client.patch(bima._id).set({ minOrder: 10000 }).commit()
  console.log('Updated Bima with minOrder: 10000')
}

// Verify the merchant appears in queries
const groceryMerchants = await client.fetch(`*[_type == "merchant" && isVerified == true && category == "grocery"] {
  name, category, isOpen
}`)
console.log('\nGrocery merchants yang akan muncul di halaman belanja:')
groceryMerchants.forEach(m => console.log(`  - ${m.name} (isOpen: ${m.isOpen})`))
