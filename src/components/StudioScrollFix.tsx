'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function StudioScrollFix() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/studio')) {
      // Remove outer page scrollbar when in Sanity Studio
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.height = '100%'
      document.body.style.height = '100%'
    } else {
      // Restore standard scroll behavior for all other pages
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.documentElement.style.height = ''
      document.body.style.height = ''
    }
  }, [pathname])

  return null
}
