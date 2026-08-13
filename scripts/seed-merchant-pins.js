/**
 * Seed script: Assign PINs to merchants for dashboard access
 *
 * Usage:
 *   node scripts/seed-merchant-pins.js
 *
 * This script assigns example PINs to the first 3 merchants.
 */

const sanity = require('@sanity/client')({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_API_WRITE_TOKEN || 'skPDFeCKFVTl2GWYZkHE8hfAyXiJCyp9sQB0JywTTLknk4ENxBV1LVr182jYCc2Doxl8yBT7AJFCeNoP0nomswkY7KWWh9lSdN9AVNRTXfGueZEeIu05M1nIwDbmBlkDzlIAoLcXTgXfFGZvBP0uJKiHCBsU9dTvBURMmZV13mfC0n0fwcct',
  useCdn: false,
})

async function seedMerchantPins() {
  // Fetch all merchants
  const merchants = await sanity.fetch(`*[_type == "merchant"] {
    _id,
    name,
    dashboardPin
  }`)

  console.log(`Found ${merchants.length} merchants\n`)

  // Assign PINs to first few merchants as examples
  const examples = merchants.slice(0, 3)
  const examplePins = ['1234', '5678', '9012']

  for (let i = 0; i < examples.length; i++) {
    const merchant = examples[i]
    const pin = examplePins[i]

    try {
      await sanity.patch(merchant._id).set({ dashboardPin: pin }).write()
      console.log(`✓ ${merchant.name} (${merchant._id}) → PIN: ${pin}`)
    } catch (error) {
      console.error(`✗ Failed to update ${merchant.name}:`, error.message)
    }
  }

  console.log('\nDone! Access dashboards at:')
  console.log(`  http://localhost:3000/merchant/[id]/pin`)
  console.log('\nExample PINs assigned:')
  examples.forEach((m, i) => {
    console.log(`  ${m.name}: ${examplePins[i]}`)
  })
}

seedMerchantPins().catch(console.error)
