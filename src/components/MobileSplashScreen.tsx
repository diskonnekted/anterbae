'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function MobileSplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      style={{ animation: 'splashFadeIn 0.3s ease-out' }}
    >
      {/* Logo - centered, not cropped */}
      <div className="flex items-center justify-center w-full h-full px-8">
        <div className="relative w-[240px] h-auto">
          <Image
            src="/anterbae.png"
            alt="Anterbae Logo"
            width={240}
            height={152}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Subtle tagline */}
      <p className="absolute bottom-20 text-xs font-bold text-slate-400 tracking-wider uppercase">
        Delivery Service
      </p>

      {/* Loading indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  )
}
