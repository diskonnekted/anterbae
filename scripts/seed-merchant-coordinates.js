/**
 * Script untuk menambahkan dummy koordinat ke merchant
 * Menggunakan Sanity GraphQL API
 */

const projectId = 'mri94xpo';
const dataset = 'production';
const token = 'skPDFeCKFVTl2GWYZkHE8hfAyXiJCyp9sQB0JywTTLknk4ENxBV1LVr182jYCc2Doxl8yBT7AJFCeNoP0nomswkY7KWWh9lSdN9AVNRTXfGueZEeIu05M1nIwDbmBlkDzlIAoLcXTgXfFGZvBP0uJKiHCBsU9dTvBURMmZV13mfC0n0fwcct';

// Koordinat dummy berdasarkan kecamatan di Banjarnegara
const areaCoordinates = {
  'Banjarnegara': { lat: -7.4097, lng: 109.5250 },
  'Purwanegara': { lat: -7.3950, lng: 109.5400 },
  'Bawang': { lat: -7.4200, lng: 109.5600 },
  'Banjarmangu': { lat: -7.4400, lng: 109.5100 },
  'Madukara': { lat: -7.3800, lng: 109.6100 },
  'Sigaluh': { lat: -7.4600, lng: 109.5500 },
  'Wanadadi': { lat: -7.3850, lng: 109.6500 },
  'Rakit': { lat: -7.4500, lng: 109.6200 },
  'Susukan': { lat: -7.3600, lng: 109.5300 },
  'Punggelan': { lat: -7.3500, lng: 109.5700 },
  'Batur': { lat: -7.4300, lng: 109.4900 },
  'Pagentan': { lat: -7.3700, lng: 109.5000 },
  'Karangkobar': { lat: -7.4800, lng: 109.5700 },
  'Pandanarum': { lat: -7.3400, lng: 109.5600 },
  'Pejawaran': { lat: -7.5000, lng: 109.5800 },
  'Purwarejaklampok': { lat: -7.3600, lng: 109.5500 },
  'Kalibening': { lat: -7.4100, lng: 109.5800 },
  'Wanayasa': { lat: -7.3300, lng: 109.5100 },
};

async function fetchMerchants() {
  const query = `
    *[_type == "merchant"] {
      _id,
      name,
      area,
      latitude,
      longitude
    }
  `;

  const response = await fetch(`https://api.sanity.io/v1/${projectId}/data/query/${dataset}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch merchants: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.result;
}

async function updateMerchant(merchantId, latitude, longitude) {
  // Menggunakan Sanity Document Patch API
  const response = await fetch(`https://api.sanity.io/v1/${projectId}/data/patch/${dataset}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `_id == "${merchantId}"`,
      set: {
        latitude: latitude,
        longitude: longitude
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

async function seedMerchantCoordinates() {
  try {
    console.log('🔄 Mengambil data merchant...');
    
    const merchants = await fetchMerchants();
    
    console.log(`✅ Ditemukan ${merchants.length} merchant\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const merchant of merchants) {
      console.log(`Processing: ${merchant.name} (${merchant.area})`);
      
      // Skip jika sudah punya koordinat
      if (merchant.latitude && merchant.longitude) {
        skippedCount++;
        console.log(`  ⏭️  Skip - sudah punya koordinat\n`);
        continue;
      }

      // Dapatkan koordinat berdasarkan area
      const areaKey = Object.keys(areaCoordinates).find(key => 
        merchant.area?.toLowerCase().includes(key.toLowerCase())
      );

      if (!areaKey) {
        console.log(`  ⚠️  Warning: Area "${merchant.area}" tidak ditemukan\n`);
        skippedCount++;
        continue;
      }

      const coords = areaCoordinates[areaKey];
      
      // Tambahkan variasi kecil agar marker tidak terlalu berdekatan
      const randomLat = coords.lat + (Math.random() - 0.5) * 0.01;
      const randomLng = coords.lng + (Math.random() - 0.5) * 0.01;

      console.log(`  📍 Updating with coords: ${randomLat.toFixed(6)}, ${randomLng.toFixed(6)}...`);
      
      try {
        await updateMerchant(merchant._id, randomLat, randomLng);
        updatedCount++;
        console.log(`  ✅ Updated successfully!\n`);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    console.log('\n🎉 Selesai!');
    console.log(`   Updated: ${updatedCount} merchant`);
    console.log(`   Skipped: ${skippedCount} merchant`);
    console.log(`   Total: ${merchants.length} merchant`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedMerchantCoordinates();
