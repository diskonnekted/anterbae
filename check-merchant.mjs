import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
})

client.fetch('*[_type == "merchant" && name == "Toko Kelontong Bima"][0]', {}).then(m => console.log(JSON.stringify(m, null, 2)));
