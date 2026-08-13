'use server'

import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

/**
 * Create a new activity log in Sanity
 */
export async function createActivityLog(data: {
  orderId?: string
  courierId?: string
  merchantId?: string
  actor: 'system' | 'admin' | 'customer' | 'courier' | 'merchant'
  action: string
  notes?: string
}) {
  try {
    const doc: any = {
      _type: 'activityLog',
      timestamp: new Date().toISOString(),
      actor: data.actor,
      action: data.action,
      notes: data.notes,
    }

    if (data.orderId) {
      doc.order = {
        _type: 'reference',
        _ref: data.orderId,
      }
    }

    if (data.courierId) {
      doc.courier = {
        _type: 'reference',
        _ref: data.courierId,
      }
    }

    if (data.merchantId) {
      doc.merchant = {
        _type: 'reference',
        _ref: data.merchantId,
      }
    }

    const created = await sanity.create(doc)
    return { success: true, data: created }
  } catch (error) {
    console.error('Error creating activity log:', error)
    return { success: false, error: 'Gagal membuat log aktivitas.' }
  }
}

/**
 * Fetch activity logs filtered by order, courier, or merchant
 */
export async function fetchActivityLogs(filter: {
  orderId?: string
  courierId?: string
  merchantId?: string
}) {
  try {
    let queryFilters = ['_type == "activityLog"']
    const params: any = {}

    if (filter.orderId) {
      queryFilters.push('order._ref == $orderId')
      params.orderId = filter.orderId
    }

    if (filter.courierId) {
      queryFilters.push('courier._ref == $courierId')
      params.courierId = filter.courierId
    }

    if (filter.merchantId) {
      queryFilters.push('merchant._ref == $merchantId')
      params.merchantId = filter.merchantId
    }

    const query = `*[${queryFilters.join(' && ')}] | order(timestamp desc) {
      _id,
      timestamp,
      actor,
      action,
      notes,
      order->{ _id, orderNumber },
      courier->{ _id, name },
      merchant->{ _id, name }
    }`

    const logs = await sanity.fetch(query, params)
    return { success: true, data: logs }
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return { success: false, error: 'Gagal memuat log aktivitas.' }
  }
}
