'use client'

import dynamic from 'next/dynamic'

// Dynamic import with no SSR
const PetaMerchant = dynamic(() => import('./PetaMerchant'), {
  ssr: false,
  loading: () => (
    <div className="mb-12">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  ),
})

export default PetaMerchant
