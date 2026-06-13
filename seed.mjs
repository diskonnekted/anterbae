import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: 'skWKhdc3R1GD89Vc7y5ohvknZTD00u2DzIGQ2UwcA2GEtD7p2LFsrkduIeUMpLSixMvAF3EynGYsWZlqAgNRtKGfAqvUkwLSaXczszw3nJgTRDqwIFRekm4jOpiYCvdUxvEOj9DsGnO7Z8Zq9gSWdM8sfVwGvbWzthTzBQQeGkjTDYURubpy',
  useCdn: false,
})

const categories = [
  { _id: 'cat-makanan', _type: 'category', name: 'Makanan & Minuman', slug: { _type: 'slug', current: 'makanan-minuman' } },
  { _id: 'cat-kebutuhan', _type: 'category', name: 'Kebutuhan Pokok', slug: { _type: 'slug', current: 'kebutuhan-pokok' } },
  { _id: 'cat-kesehatan', _type: 'category', name: 'Kesehatan & Apotek', slug: { _type: 'slug', current: 'kesehatan-apotek' } },
]

const merchants = [
  {
    _id: 'merchant-dawet',
    _type: 'merchant',
    name: 'Dawet Ayu Asli Banjarnegara',
    slug: { _type: 'slug', current: 'dawet-ayu-asli' },
    phone: '62811111111',
    address: 'Jl. Pemuda No. 12, Banjarnegara',
    area: 'Banjarnegara',
    isOpen: true,
    isVerified: true
  },
  {
    _id: 'merchant-soto',
    _type: 'merchant',
    name: 'Soto Krandegan',
    slug: { _type: 'slug', current: 'soto-krandegan' },
    phone: '62822222222',
    address: 'Krandegan, Banjarnegara',
    area: 'Banjarnegara',
    isOpen: true,
    isVerified: true
  },
  {
    _id: 'merchant-bima',
    _type: 'merchant',
    name: 'Toko Kelontong Bima',
    slug: { _type: 'slug', current: 'toko-kelontong-bima' },
    phone: '62833333333',
    address: 'Pasar Kota Banjarnegara',
    area: 'Banjarnegara',
    isOpen: true,
    isVerified: true
  }
]

const products = [
  {
    _type: 'product',
    name: 'Es Dawet Ayu Spesial Durian',
    slug: { _type: 'slug', current: 'es-dawet-ayu-spesial-durian' },
    merchant: { _type: 'reference', _ref: 'merchant-dawet' },
    categories: [{ _type: 'reference', _ref: 'cat-makanan' }],
    price: 15000,
    stock: 50,
    description: 'Es dawet ayu khas Banjarnegara dengan tambahan topping durian asli.',
    isBestSeller: true,
    isPromo: true,
    promoDiscount: 10
  },
  {
    _type: 'product',
    name: 'Soto Sapi Krandegan',
    slug: { _type: 'slug', current: 'soto-sapi-krandegan' },
    merchant: { _type: 'reference', _ref: 'merchant-soto' },
    categories: [{ _type: 'reference', _ref: 'cat-makanan' }],
    price: 25000,
    stock: 100,
    description: 'Soto legendaris Krandegan kuah santan kuning khas Banjarnegara.',
    isBestSeller: true
  },
  {
    _type: 'product',
    name: 'Beras Mentik Wangi 5kg',
    slug: { _type: 'slug', current: 'beras-mentik-wangi-5kg' },
    merchant: { _type: 'reference', _ref: 'merchant-bima' },
    categories: [{ _type: 'reference', _ref: 'cat-kebutuhan' }],
    price: 75000,
    stock: 20,
    description: 'Beras kualitas premium asli panenan lokal Banjarnegara.'
  },
  {
    _type: 'product',
    name: 'Minyak Goreng 2L',
    slug: { _type: 'slug', current: 'minyak-goreng-2l' },
    merchant: { _type: 'reference', _ref: 'merchant-bima' },
    categories: [{ _type: 'reference', _ref: 'cat-kebutuhan' }],
    price: 34000,
    stock: 15,
    description: 'Minyak goreng kemasan 2 liter.'
  }
]

async function seed() {
  console.log('Menambahkan Categories...')
  for (const cat of categories) {
    await client.createIfNotExists(cat)
  }
  
  console.log('Menambahkan Merchants...')
  for (const merch of merchants) {
    await client.createIfNotExists(merch)
  }

  console.log('Menambahkan Products...')
  for (const prod of products) {
    // Generate random ID for product to prevent conflict, or just create it
    await client.create(prod)
  }

  console.log('Selesai!')
}

seed().catch(console.error)
