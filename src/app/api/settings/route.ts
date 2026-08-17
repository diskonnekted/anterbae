import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { APP_SETTINGS_QUERY } from '@/sanity/lib/queries'

export async function GET() {
  try {
    const settings = await client.fetch(APP_SETTINGS_QUERY)
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Failed to fetch settings from Sanity:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil pengaturan aplikasi' },
      { status: 500 }
    )
  }
}
