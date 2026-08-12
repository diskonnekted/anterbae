/**
 * Script untuk insert produk dummy dengan gambar ke Sanity CMS
 * 
 * Cara pakai:
 * 1. Pastikan SANITY_API_WRITE_TOKEN punya permission "create"
 * 2. Jalankan: node scripts/create-products-with-images.js
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Konfigurasi Sanity
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Upload gambar ke Sanity Assets
async function uploadImageToSanity(imageUrl, filename) {
  try {
    const response = await fetch(imageUrl)
    const buffer = Buffer.from(await response.arrayBuffer())
    
    const asset = await sanity.assets.upload('image', buffer, {
      contentType: 'image/jpeg',
      filename: filename
    })
    
    return {
      _type: 'image',
      asset: { _ref: `asset-${asset._id}` }
    }
  } catch (error) {
    console.error(`  ❌ Upload gambar gagal: ${error.message}`)
    return null
  }
}

// Data produk dengan gambar
const productsData = [
  // Dawet Ayu products
  {
    name: 'Dawet Ayu Original',
    slug: 'dawet-ayu-original',
    description: 'Dawet Ayu khas Banjarnegara dengan santan segar dan gula merah asli',
    price: 8000,
    stock: 100,
    category: 'minuman',
    isBestSeller: true,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
  },
  {
    name: 'Dawet Ayu Durian',
    slug: 'dawet-ayu-durian',
    description: 'Dawet Ayu dengan topping durian asli Medan',
    price: 15000,
    stock: 50,
    category: 'minuman',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1618827461240-bab0622dd8a1?w=400&h=300&fit=crop'
  },
  {
    name: 'Dawet Ayu Telur',
    slug: 'dawet-ayu-telur',
    description: 'Dawet Ayu dengan telur ayam kampung',
    price: 12000,
    stock: 60,
    category: 'minuman',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
  },
  {
    name: 'Es Campur Ayu',
    slug: 'es-campur-ayu',
    description: 'Es campur dengan cincau, kolang-kaling, dan sirup',
    price: 10000,
    stock: 40,
    category: 'minuman',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1544146776?w=400&h=300&fit=crop'
  },
  {
    name: 'Nasi Kuning Banjarnegara',
    slug: 'nasi-kuning-banjarnegara',
    description: 'Nasi kuning khas Banjarnegara dengan ayam suwir',
    price: 15000,
    stock: 30,
    category: 'makanan-utama',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop'
  },

  // Soto Krandegan products
  {
    name: 'Soto Ayam Krandegan',
    slug: 'soto-ayam-krandegan',
    description: 'Soto ayam kampung dengan kuah bening khas Krandegan',
    price: 20000,
    stock: 40,
    category: 'makanan-utama',
    isBestSeller: true,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
  },
  {
    name: 'Soto Daging Sapi',
    slug: 'soto-daging-sapi',
    description: 'Soto daging sapi empuk dengan rempah pilihan',
    price: 28000,
    stock: 25,
    category: 'makanan-utama',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1603105037880-880cd4f5b2d6?w=400&h=300&fit=crop'
  },
  {
    name: 'Soto Rangu',
    slug: 'soto-rangu',
    description: 'Soto rangu spesial dengan kuah kental gurih',
    price: 18000,
    stock: 30,
    category: 'makanan-utama',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1583032015879-6a044077723f?w=400&h=300&fit=crop'
  },
  {
    name: 'Nasi Putih Hangat',
    slug: 'nasi-putih-hangat',
    description: 'Nasi putih hangat pulen',
    price: 5000,
    stock: 100,
    category: 'karbohidrat',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-460e424f58e9?w=400&h=300&fit=crop'
  },
  {
    name: 'Tahu Goreng Krispi',
    slug: 'tahu-goreng-krispi',
    description: 'Tahu goreng krispi renyah',
    price: 4000,
    stock: 60,
    category: 'sampingan',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&h=300&fit=crop'
  },
  {
    name: 'Tempe Goreng',
    slug: 'tempe-goreng',
    description: 'Tempe goreng crispy dengan bumbu rempah',
    price: 4000,
    stock: 60,
    category: 'sampingan',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-43c19175210d?w=400&h=300&fit=crop'
  },
  {
    name: 'Es Teh Manis',
    slug: 'es-teh-manis-soto',
    description: 'Es teh manis segar',
    price: 4000,
    stock: 100,
    category: 'minuman',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
  },
  {
    name: 'Es Jeruk Segar',
    slug: 'es-jeruk-segar',
    description: 'Es jeruk murni segar',
    price: 6000,
    stock: 80,
    category: 'minuman',
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop'
  },
]

async function createProducts() {
  console.log('🚀 Memulai create produk dengan gambar...\n')

  // Get merchants
  const merchants = await sanity.fetch(`*[_type == "merchant" && category == "food"] {
    _id,
    name,
    "slug": slug.current
  }`)

  console.log(`📦 Ditemukan ${merchants.length} restoran\n`)

  // Map products to merchants (alternating)
  const merchantProductMap = [
    { merchant: merchants[0], products: productsData.slice(0, 5) },
    { merchant: merchants[1], products: productsData.slice(5) }
  ]

  let totalCreated = 0
  let totalSkipped = 0
  let totalImageErrors = 0

  for (const map of merchantProductMap) {
    if (!map.merchant) continue
    
    console.log(`\n🏪 Memproses: ${map.merchant.name}`)
    
    for (const productData of map.products) {
      console.log(`\n  📝 ${productData.name}`)
      
      // Check if exists
      const existing = await sanity.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: productData.slug }
      )

      if (existing) {
        console.log(`  ⏭️  Skip (sudah ada)`)
        totalSkipped++
        continue
      }

      // Upload image
      let image = null
      try {
        console.log(`  📸 Upload gambar...`)
        image = await uploadImageToSanity(
          productData.imageUrl,
          `${productData.slug}.jpg`
        )
        
        if (!image) {
          console.log(`  ⚠️  Gambar gagal, lanjut tanpa gambar`)
          totalImageErrors++
        }
      } catch (error) {
        console.log(`  ⚠️  Error: ${error.message}`)
        totalImageErrors++
      }

      // Create product
      try {
        const product = await sanity.create({
          _type: 'product',
          name: productData.name,
          slug: { current: productData.slug },
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category: productData.category,
          isBestSeller: productData.isBestSeller,
          isPromo: false,
          merchant: { _type: 'reference', _ref: map.merchant._id },
          ...(image ? { image: image } : {
            image: {
              _type: 'image',
              asset: { _ref: 'placeholder-placeholder' }
            }
          }),
        })

        console.log(`  ✅ Created! - Rp ${productData.price.toLocaleString('id-ID')}`)
        if (productData.isBestSeller) {
          console.log(`  ⭐ Set as Best Seller`)
        }
        totalCreated++
      } catch (error) {
        console.log(`  ❌ Error create: ${error.message}`)
      }
    }
  }

  console.log('\n\n' + '='.repeat(60))
  console.log('📊 SUMMARY:')
  console.log('='.repeat(60))
  console.log(`✅ Total produk dibuat: ${totalCreated}`)
  console.log(`⏭️  Total dilewati: ${totalSkipped}`)
  console.log(`⚠️  Error gambar: ${totalImageErrors}`)
  console.log(`📦 Total restoran: ${merchants.length}`)
  console.log('='.repeat(60) + '\n')
  
  console.log('✨ Selesai! Cek di Sanity Studio → Products\n')
}

createProducts().catch(error => {
  console.error('\n❌ Error:', error)
  process.exit(1)
})
