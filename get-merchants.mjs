import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'mri94xpo',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
})

client.fetch('*[_type == "merchant"]').then(m => console.log(JSON.stringify(m.map(x => ({slug: x.slug.current, name: x.name})), null, 2)));
