import fs from 'fs'

const raw = fs.readFileSync('public/peta_desa.geojson', 'utf8')
const d = JSON.parse(raw)

const desas = {}
d.features.forEach(f => {
  const k = f.properties['Kecamatan'].replace('Kec.', '')
  if (!desas[k]) desas[k] = []
  desas[k].push(f.properties['Nama_Desa_'])
})

// Save as JSON
fs.writeFileSync('src/data/desa-data.json', JSON.stringify(desas, null, 2), 'utf8')

// Print summary
Object.keys(desas).sort().forEach(k => {
  console.log(`${k}: ${desas[k].length} desa`)
})
