import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  // Revalidate belanja pages
  revalidatePath('/m/belanja')
  revalidatePath('/services/belanja')
  revalidatePath('/mitra')
  
  return NextResponse.json({ 
    revalidated: true, 
    now: Date.now(),
    message: 'Belanja pages revalidated'
  })
}
