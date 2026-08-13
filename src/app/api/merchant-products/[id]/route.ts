import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mri94xpo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// PATCH /api/merchant-products/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { name, slug, price, stock, image, description, isBestSeller, isPromo, promoDiscount } = body

  try {
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = { _type: 'slug', current: slug }
    if (price !== undefined) updateData.price = price
    if (stock !== undefined) updateData.stock = stock
    if (image !== undefined) updateData.image = image
    if (description !== undefined) updateData.description = description
    if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller
    if (isPromo !== undefined) updateData.isPromo = isPromo
    if (promoDiscount !== undefined) updateData.promoDiscount = promoDiscount

    const updated = await sanity.patch(id).set(updateData).execute()

    return NextResponse.json({ product: updated })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/merchant-products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await sanity.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
