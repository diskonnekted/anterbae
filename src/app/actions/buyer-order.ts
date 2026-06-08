'use server'

import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function completeOrder(orderId: string) {
  try {
    await writeClient
      .patch(orderId)
      .set({ status: 'completed' })
      .commit()
      
    return { success: true }
  } catch (error: any) {
    console.error('Failed to complete order:', error)
    return { success: false, error: 'Gagal menyelesaikan pesanan.' }
  }
}
