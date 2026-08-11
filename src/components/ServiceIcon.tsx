'use client'

import { useRouter } from 'next/navigation'

interface ServiceIconProps {
  icon: React.ReactNode
  label: string
  href: string
}

export default function ServiceIcon({ icon, label, href }: ServiceIconProps) {
  const router = useRouter()
  const isExternal = href.startsWith('http')

  const handleClick = () => {
    if (isExternal) {
      window.open(href, '_blank')
    } else {
      router.push(href)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-2 cursor-pointer w-auto"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 text-gray-600">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-700 text-center leading-tight whitespace-nowrap">{label}</span>
    </button>
  )
}
