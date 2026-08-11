/**
 * Seed script untuk membuat kategori dan sub-kategori baku
 * 
 * Cara pakai:
 *   npx ts-node scripts/seed-categories.ts
 * 
 * Atau jalankan via Sanity CLI:
 *   npx sanity import seed-categories.json --dataset production
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

interface CategoryData {
  _type: string
  name: string
  slug: { _type: string; current: string }
  description?: string
  parentCategory?: { _type: string; _ref: string }
}

// ===== DATA KATEGORI & SUB-KATEGORI BAKU =====
const categories: CategoryData[] = [
  // ===== BELANJA =====
  {
    _type: 'category',
    name: 'Belanja',
    slug: { _type: 'slug', current: 'belanja' },
    description: 'Kategori belanja kebutuhan sehari-hari',
  },
  // Sub-kategori Belanja
  {
    _type: 'category',
    name: 'Kelontong',
    slug: { _type: 'slug', current: 'kelontong' },
    description: 'Sembako, beras, gula, minyak, dan kebutuhan pokok lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Bangunan',
    slug: { _type: 'slug', current: 'bangunan' },
    description: 'Alat bangunan, semen, bata, cat, dan perlengkapan konstruksi',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Elektronik',
    slug: { _type: 'slug', current: 'elektronik' },
    description: 'Alat elektronik, kabel, lampu, dan perlengkapan listrik',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Fashion',
    slug: { _type: 'slug', current: 'fashion' },
    description: 'Pakaian, sepatu, tas, dan aksesoris',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Kesehatan',
    slug: { _type: 'slug', current: 'kesehatan' },
    description: 'Obat-obatan, vitamin, dan perlengkapan medis',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Makanan & Minuman',
    slug: { _type: 'slug', current: 'makanan-minuman' },
    description: 'Snack, minuman, makanan siap saji',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Kebersihan',
    slug: { _type: 'slug', current: 'kebersihan' },
    description: 'Sabun, deterjen, pembersih rumah dan alat mandi',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Peralatan Dapur',
    slug: { _type: 'slug', current: 'peralatan-dapur' },
    description: 'Peralatan masak, piring, gelas, dan perlengkapan dapur',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },
  {
    _type: 'category',
    name: 'Pensil & Alat Tulis',
    slug: { _type: 'slug', current: 'pensil-alat-tulis' },
    description: 'Buku, pensil, pena, dan perlengkapan sekolah',
    parentCategory: { _type: 'reference', _ref: 'PENDING.belanja' },
  },

  // ===== JASA =====
  {
    _type: 'category',
    name: 'Jasa',
    slug: { _type: 'slug', current: 'jasa' },
    description: 'Kategori jasa dan servis',
  },
  // Sub-kategori Jasa
  {
    _type: 'category',
    name: 'Servis Elektronik',
    slug: { _type: 'slug', current: 'servis-elektronik' },
    description: 'Servis HP, laptop, TV, dan alat elektronik lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Servis Kendaraan',
    slug: { _type: 'slug', current: 'servis-kendaraan' },
    description: 'Servis motor, mobil, dan tambal ban',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Servis Rumah',
    slug: { _type: 'slug', current: 'servis-rumah' },
    description: 'Servis AC, listrik, pipa, dan renovasi rumah',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Fotografi & Video',
    slug: { _type: 'slug', current: 'fotografi-video' },
    description: 'Jasa foto dan video shooting',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Instalasi Elektronik',
    slug: { _type: 'slug', current: 'instalasi-elektronik' },
    description: 'Instalasi listrik, alarm, dan peralatan elektronik bangunan',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Instalasi CCTV',
    slug: { _type: 'slug', current: 'instalasi-cctv' },
    description: 'Pemasangan dan instalasi CCTV untuk rumah dan kantor',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Pijat Kesehatan',
    slug: { _type: 'slug', current: 'pijat-kesehatan' },
    description: 'Jasa pijat refleksi dan terapi tubuh untuk kesehatan',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },
  {
    _type: 'category',
    name: 'Jasa Lainnya',
    slug: { _type: 'slug', current: 'jasa-lainnya' },
    description: 'Jasa lain yang belum tercantum',
    parentCategory: { _type: 'reference', _ref: 'PENDING.jasa' },
  },

  // ===== MAKANAN =====
  {
    _type: 'category',
    name: 'Makanan',
    slug: { _type: 'slug', current: 'makanan' },
    description: 'Kategori makanan dan minuman siap saji',
  },
  // Sub-kategori Makanan
  {
    _type: 'category',
    name: 'Makanan Berat',
    slug: { _type: 'slug', current: 'makanan-berat' },
    description: 'Nasi, mie, soto, gado-gado, dan makanan berat lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.makanan' },
  },
  {
    _type: 'category',
    name: 'Minuman',
    slug: { _type: 'slug', current: 'minuman' },
    description: 'Es teh, jus, kopi, susu, dan minuman lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.makanan' },
  },
  {
    _type: 'category',
    name: 'Snack & Cemilan',
    slug: { _type: 'slug', current: 'snack-cemilan' },
    description: 'Kue, kerupuk, chip, dan cemilan lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.makanan' },
  },
  {
    _type: 'category',
    name: 'Dessert',
    slug: { _type: 'slug', current: 'dessert' },
    description: 'Kue kering, brownies, es krim, dan dessert lainnya',
    parentCategory: { _type: 'reference', _ref: 'PENDING.makanan' },
  },

  // ===== PAKET & LOGISTIK =====
  {
    _type: 'category',
    name: 'Paket',
    slug: { _type: 'slug', current: 'paket' },
    description: 'Kategori pengiriman paket dan logistik',
  },
  // Sub-kategori Paket
  {
    _type: 'category',
    name: 'Paket Kecil',
    slug: { _type: 'slug', current: 'paket-kecil' },
    description: 'Paket bawah 1 kg',
    parentCategory: { _type: 'reference', _ref: 'PENDING.paket' },
  },
  {
    _type: 'category',
    name: 'Paket Sedang',
    slug: { _type: 'slug', current: 'paket-sedang' },
    description: 'Paket 1-5 kg',
    parentCategory: { _type: 'reference', _ref: 'PENDING.paket' },
  },
  {
    _type: 'category',
    name: 'Paket Besar',
    slug: { _type: 'slug', current: 'paket-besar' },
    description: 'Paket di atas 5 kg',
    parentCategory: { _type: 'reference', _ref: 'PENDING.paket' },
  },

  // ===== LAINNYA =====
  {
    _type: 'category',
    name: 'Lainnya',
    slug: { _type: 'slug', current: 'lainnya' },
    description: 'Kategori lainnya yang belum tercantum',
  },
]

async function seedCategories() {
  console.log('🌱 Memulai seeding kategori...')

  // Step 1: Create parent categories first
  const parentMap: Record<string, string> = {}
  const parentCategories = categories.filter(c => !c.parentCategory)

  for (const category of parentCategories) {
    try {
      const doc = await sanityClient.create({
        _type: 'category',
        name: category.name,
        slug: category.slug,
        description: category.description,
      })
      parentMap[`PENDING.${category.slug.current}`] = doc._id
      console.log(`✅ Created parent category: ${category.name} (${doc._id})`)
    } catch (error) {
      console.error(`❌ Failed to create ${category.name}:`, error)
    }
  }

  // Step 2: Create sub-categories with resolved parent refs
  const subCategories = categories.filter(c => c.parentCategory)

  for (const category of subCategories) {
    try {
      const parentRef = category.parentCategory!._ref.replace('PENDING.', '')
      const parentId = parentMap[parentRef]

      if (!parentId) {
        console.warn(`⚠️  Parent not found for ${category.name}, skipping`)
        continue
      }

      const doc = await sanityClient.create({
        _type: 'category',
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentCategory: {
          _type: 'reference',
          _ref: parentId,
        },
      })
      console.log(`✅ Created sub-category: ${category.name} (parent: ${parentRef})`)
    } catch (error) {
      console.error(`❌ Failed to create ${category.name}:`, error)
    }
  }

  console.log('\n✅ Seeding kategori selesai!')
  console.log('\nDaftar kategori utama dan sub-kategori:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  // Print summary
  for (const parent of parentCategories) {
    const subs = subCategories.filter(c => c.parentCategory?._ref.includes(`PENDING.${parent.slug.current}`))
    console.log(`\n📁 ${parent.name}`)
    for (const sub of subs) {
      console.log(`   └── ${sub.name}`)
    }
  }
}

seedCategories().catch(console.error)
