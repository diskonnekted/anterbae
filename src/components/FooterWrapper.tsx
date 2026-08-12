'use client'

import { usePathname } from 'next/navigation'

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide footer on Sanity Studio and Courier Portal
  if (pathname.startsWith('/studio') || pathname.startsWith('/kurir')) {
    return null
  }

  return <>{children}</>
}
