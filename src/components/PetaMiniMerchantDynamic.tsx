'use client'

import dynamic from 'next/dynamic'

// Dynamic import with no SSR
const PetaMiniMerchant = dynamic(() => import('./PetaMiniMerchant'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 animate-pulse" />
  ),
})

export default PetaMiniMerchant
