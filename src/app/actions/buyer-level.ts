'use server'

import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

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

// Update buyer level based on order count
export async function updateBuyerLevel(customerId: string, newTotalOrders: number, totalSpent: number) {
  try {
    const levelInfo = getBuyerLevel(newTotalOrders)
    
    // Get current customer data
    const currentCustomer = await sanity.fetch(
      `*[_type == "customer" && _id == $id][0]`,
      { id: customerId }
    )

    const currentLevel = currentCustomer?.buyerLevel || 'regular'
    const willLevelUp = currentLevel !== levelInfo.level

    // Update customer
    const updates: any = {
      totalOrders: newTotalOrders,
      buyerLevel: levelInfo.level,
      buyerLevelBadge: levelInfo.badge,
      totalSpent: totalSpent,
    }

    if (willLevelUp) {
      updates.levelUpDate = new Date().toISOString()
    }

    await sanity.patch(customerId).set(updates).commit()

    return {
      success: true,
      level: levelInfo,
      levelUp: willLevelUp,
      previousLevel: currentLevel,
    }
  } catch (error) {
    console.error('Error updating buyer level:', error)
    return { success: false, error: 'Gagal mengupdate level pembeli' }
  }
}

// Get buyer level stats
export async function getBuyerStats(customerPhone: string) {
  try {
    const customer = await sanity.fetch(
      `*[_type == "customer" && phone == $phone][0] {
        _id,
        name,
        phone,
        buyerLevel,
        totalOrders,
        successfulOrders,
        failedOrders,
        totalSpent,
        levelUpDate
      }`,
      { phone: customerPhone }
    )

    if (!customer) {
      return { success: true, customer: null, isNew: true }
    }

    const levelInfo = getBuyerLevel(customer.totalOrders || 0)

    return {
      success: true,
      customer: {
        ...customer,
        ...levelInfo,
      },
      isNew: false,
    }
  } catch (error) {
    console.error('Error getting buyer stats:', error)
    return { success: false, error: 'Gagal mengambil statistik pembeli' }
  }
}

// Create or update customer on new order
export async function upsertCustomer(data: {
  name: string
  phone: string
  address: string
  orderCount?: number
  totalSpent?: number
}) {
  try {
    // Check if customer exists
    let customer = await sanity.fetch(
      `*[_type == "customer" && phone == $phone][0]`,
      { phone: data.phone }
    )

    const orderCount = data.orderCount || 0
    const totalSpent = data.totalSpent || 0
    const levelInfo = getBuyerLevel(orderCount)

    if (!customer) {
      // Create new customer
      customer = await sanity.create({
        _type: 'customer',
        name: data.name,
        phone: data.phone,
        address: data.address,
        totalOrders: orderCount,
        buyerLevel: levelInfo.level,
        buyerLevelBadge: levelInfo.badge,
        totalSpent: totalSpent,
        levelUpDate: orderCount > 0 ? new Date().toISOString() : null,
      })
    } else {
      // Update existing customer
      const updates: any = {
        name: data.name,
        address: data.address,
      }

      if (orderCount > 0) {
        updates.totalOrders = orderCount
        updates.buyerLevel = levelInfo.level
        updates.buyerLevelBadge = levelInfo.badge
        updates.totalSpent = totalSpent
        
        if (customer.buyerLevel !== levelInfo.level) {
          updates.levelUpDate = new Date().toISOString()
        }
      }

      await sanity.patch(customer._id).set(updates).commit()
    }

    return {
      success: true,
      customerId: customer._id,
      level: levelInfo,
      isNew: !customer || customer._createdAt === customer._updatedAt,
    }
  } catch (error) {
    console.error('Error upserting customer:', error)
    return { success: false, error: 'Gagal menyimpan data pembeli' }
  }
}
