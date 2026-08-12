'use client'

import { getBuyerLevel } from '@/lib/buyer-level-utils'

interface BuyerLevelBadgeProps {
  totalOrders: number
  showTitle?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function BuyerLevelBadge({ 
  totalOrders, 
  showTitle = true,
  size = 'md'
}: BuyerLevelBadgeProps) {
  const levelInfo = getBuyerLevel(totalOrders)
  
  const sizeClasses = {
    sm: {
      badge: 'text-lg',
      container: 'px-3 py-1.5',
      title: 'text-xs',
    },
    md: {
      badge: 'text-2xl',
      container: 'px-4 py-2',
      title: 'text-sm',
    },
    lg: {
      badge: 'text-3xl',
      container: 'px-6 py-3',
      title: 'text-base',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${levelInfo.color} text-white rounded-full ${sizes.container} shadow-lg`}>
      <span className={sizes.badge}>{levelInfo.badge}</span>
      {showTitle && (
        <span className={`font-black ${sizes.title}`}>{levelInfo.title}</span>
      )}
    </div>
  )
}

// Progress bar to next level
export function BuyerLevelProgress({ totalOrders }: { totalOrders: number }) {
  let nextLevel: number
  let currentLevelName: string
  let nextLevelName: string
  
  if (totalOrders < 10) {
    nextLevel = 10
    currentLevelName = 'Pembeli Biasa'
    nextLevelName = 'VIP'
  } else if (totalOrders < 50) {
    nextLevel = 50
    currentLevelName = 'VIP'
    nextLevelName = 'VVIP'
  } else {
    return (
      <div className="text-center p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-2xl shadow-lg">
        <span className="text-3xl mb-2 block">🥇</span>
        <p className="font-black text-lg">VVIP - Maximum Level!</p>
        <p className="text-sm opacity-90 mt-1">Total: {totalOrders} pesanan</p>
      </div>
    )
  }

  const progress = Math.min((totalOrders / nextLevel) * 100, 100)
  const ordersLeft = nextLevel - totalOrders

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase">Level Saat Ini</p>
          <p className="text-sm font-black text-gray-900">{currentLevelName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-bold uppercase">Menuju {nextLevelName}</p>
          <p className="text-sm font-black text-gray-900">{ordersLeft} pesanan lagi</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold">
        <span>{totalOrders} pesanan</span>
        <span>{nextLevel} pesanan</span>
      </div>
    </div>
  )
}
