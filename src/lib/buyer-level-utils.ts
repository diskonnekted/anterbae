// Define buyer level based on order count
export function getBuyerLevel(totalOrders: number): {
  level: 'regular' | 'vip' | 'vvip'
  badge: string
  title: string
  color: string
} {
  if (totalOrders >= 51) {
    return {
      level: 'vvip',
      badge: '🥇',
      title: 'Pembelian Setia VVIP',
      color: 'from-yellow-400 to-yellow-600',
    }
  } else if (totalOrders >= 11) {
    return {
      level: 'vip',
      badge: '🥈',
      title: 'Pembeli Rutin VIP',
      color: 'from-gray-300 to-gray-500',
    }
  } else {
    return {
      level: 'regular',
      badge: '🥉',
      title: 'Pembeli Biasa',
      color: 'from-orange-300 to-orange-500',
    }
  }
}
