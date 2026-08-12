'use client'

import { usePathname } from 'next/navigation'

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide the main site Navbar on Sanity Studio and Courier Portal
  if (pathname.startsWith('/studio') || pathname.startsWith('/kurir')) {
    return null
  }

  return <>{children}</>
}
