/**
 * Script untuk insert produk dummy ke Sanity CMS
 * 
 * Cara pakai:
 * 1. Set environment variables di .env.local
 * 2. Jalankan: node scripts/insert-dummy-products.js
 */

const { createClient } = require('@sanity/client')

// Konfigurasi Sanity
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Data produk dummy untuk setiap restoran (key = merchant slug)
const dummyProducts = {
  'dawet-ayu-asli': [
    {
      name: 'Dawet Ayu Asli',
      slug: { current: 'dawet-ayu-asli' },
      description: 'Dawet Ayu Asli khas Banjarnegara dengan gula merah asli',
      price: 8000,
      stock: 100,
      category: 'makanan-minuman',
      isBestSeller: true,
    },
    {
      name: 'Dawet Ayu Varian Cendol',
      slug: { current: 'dawet-ayu-cendol' },
      description: 'Dawet Ayu dengan cendol hijau',
      price: 8000,
      stock: 100,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Es Teler',
      slug: { current: 'es-teler-dawet' },
      description: 'Es teler dengan alpukat, kelapa, dan nangka',
      price: 12000,
      stock: 50,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Klepon',
      slug: { current: 'klepon-dawet' },
      description: 'Klepon pandan dengan gula merah',
      price: 5000,
      stock: 80,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Pisang Goreng',
      slug: { current: 'pisang-goreng-dawet' },
      description: 'Pisang goreng crispy',
      price: 5000,
      stock: 60,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
  ],
  'soto-krandegan': [
    {
      name: 'Soto Krandegan Spesial',
      slug: { current: 'soto-krandegan-spesial' },
      description: 'Soto Krandegan spesial dengan ayam dan telur',
      price: 18000,
      stock: 40,
      category: 'makanan-minuman',
      isBestSeller: true,
    },
    {
      name: 'Soto Krandegan Regular',
      slug: { current: 'soto-krandegan-regular' },
      description: 'Soto Krandegan regular dengan ayam',
      price: 15000,
      stock: 50,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Soto Tulang',
      slug: { current: 'soto-tulang-krandegan' },
      description: 'Soto Krandegan dengan tulang empuk',
      price: 20000,
      stock: 25,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Nasi Pecel',
      slug: { current: 'nasi-pecel-krandegan' },
      description: 'Nasi pecel dengan bumbu kacang',
      price: 13000,
      stock: 40,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Tahu Tempe Goreng',
      slug: { current: 'tahu-tempe-krandegan' },
      description: 'Tahu dan tempe goreng kering',
      price: 4000,
      stock: 80,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Es Teh Manis',
      slug: { current: 'es-teh-krandegan' },
      description: 'Es teh manis segar',
      price: 4000,
      stock: 100,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
    {
      name: 'Es Jeruk',
      slug: { current: 'es-jeruk-krandegan' },
      description: 'Es jeruk segar',
      price: 5000,
      stock: 80,
      category: 'makanan-minuman',
      isBestSeller: false,
    },
  ],
}

async function getCategoryReferences(categorySlugs) {
  // Fetch category documents by their slugs
  const slugs = [...new Set(categorySlugs)]
  const categories = await sanity.fetch(
    `*[_type == "category" && slug.current in $slugs] {
      _id,
      "slug": slug.current
    }`,
    { slugs }
  )
  
  // Build a map of slug -> _id
  const slugToId = {}
  for (const cat of categories) {
    slugToId[cat.slug] = cat._id
  }
  
  // Convert category slugs to references
  const references = []
  for (const slug of categorySlugs) {
    const categoryId = slugToId[slug]
    if (categoryId) {
      references.push({ _key: slug, _type: 'reference', _ref: categoryId })
    } else {
      console.warn(`  ⚠️  Category not found: ${slug}`)
    }
  }
  return references
}

async function insertDummyProducts() {
  console.log('🚀 Memulai insert produk dummy...\n')

  // Load categories first (to resolve references)
  console.log('📂 Memuat kategori...')
  const catDocs = await sanity.fetch(
    `*[_type == "category"] { "slug": slug.current, _id }`
  )
  console.log(`✅ Dimuat ${catDocs.length} kategori\n`)

  // Get merchants first
  const merchants = await sanity.fetch(`*[_type == "merchant" && category == "food"] {
    _id,
    name,
    "slug": slug.current
  }`)

  console.log(`📦 Ditemukan ${merchants.length} restoran\n`)

  let totalProductsCreated = 0
  let totalProductsSkipped = 0

  for (const merchant of merchants) {
    console.log(`\n🏪 Memproses: ${merchant.name} (${merchant.slug})`)
    
    // Use merchant-specific products, fallback to default
    const productsForMerchant = dummyProducts[merchant.slug] || dummyProducts['default']
    
    for (const productData of productsForMerchant) {
      // Check if product already exists
      const existing = await sanity.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: productData.slug.current }
      )

      if (existing) {
        console.log(`  ⏭️  Skip: ${productData.name} (sudah ada)`)
        totalProductsSkipped++
        continue
      }

      // Resolve category references
      const resolvedCategories = await getCategoryReferences([productData.category])

      // Create product
      try {
        const product = await sanity.create({
          _type: 'product',
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          categories: resolvedCategories,
          isBestSeller: productData.isBestSeller || false,
          isPromo: false,
          merchant: { _type: 'reference', _ref: merchant._id },
        })

        console.log(`  ✅ Created: ${productData.name} - Rp ${productData.price.toLocaleString('id-ID')}`)
        totalProductsCreated++
      } catch (error) {
        console.log(`  ❌ Error: ${productData.name} - ${error.message}`)
      }
    }
  }

  console.log('\n\n' + '='.repeat(50))
  console.log('📊 SUMMARY:')
  console.log('='.repeat(50))
  console.log(`✅ Total produk dibuat: ${totalProductsCreated}`)
  console.log(`⏭️  Total produk dilewati: ${totalProductsSkipped}`)
  console.log(`📦 Total restoran: ${merchants.length}`)
  console.log('='.repeat(50) + '\n')
}

// Run the script
insertDummyProducts().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
