/**
 * Seed script: Assign merchant codes to merchants
 *
 * Usage:
 *   node scripts/seed-merchant-codes.mjs
 */

import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_API_WRITE_TOKEN || 'skPDFeCKFVTl2GWYZkHE8hfAyXiJCyp9sQB0JywTTLknk4ENxBV1LVr182jYCc2Doxl8yBT7AJFCeNoP0nomswkY7KWWh9lSdN9AVNRTXfGueZEeIu05M1nIwDbmBlkDzlIAoLcXTgXfFGZvBP0uJKiHCBsU9dTvBURMmZV13mfC0n0fwcct',
  useCdn: false,
})

async function seedMerchantCodes() {
  const merchants = await sanity.fetch(`*[_type == "merchant"] {
    _id,
    name,
    merchantCode
  }`)

  console.log(`Found ${merchants.length} merchants\n`)

  const codes = [
    'BEE01', 'CON01', 'DEC01', 'KOP01', 'MIE01',
    'WAR01', 'ROT01', 'CAK01', 'SOT01', 'NAS01',
    'TEH01', 'JUS01', 'BAK01', 'GUR01', 'TUK01',
  ]

  for (let i = 0; i < merchants.length && i < codes.length; i++) {
    const merchant = merchants[i]
    const code = codes[i]

    try {
      await sanity.patch(merchant._id).set({ merchantCode: code }).commit()
      console.log(`  ${merchant.name} → ${code}`)
    } catch (error) {
      console.error(`  ✗ ${merchant.name}: ${error.message}`)
    }
  }

  console.log('\nDone!')
}

seedMerchantCodes().catch(console.error)
