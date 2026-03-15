import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const { id } = await params
  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const body = await req.json()
  const { slug, campaign_id, wa_message, description, active } = body

  // Validate slug if provided
  if (slug !== undefined) {
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug inválido. Use apenas letras minúsculas, números e hífen.' }, { status: 400 })
    }

    // Check for duplicate slug (excluding current link)
    const { data: existing } = await supabase
      .from('links')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()
    if (existing) {
      return NextResponse.json({ error: 'Este slug já está em uso.' }, { status: 409 })
    }
  }

  const updates: Record<string, unknown> = {}
  if (slug !== undefined) updates.slug = slug
  if (campaign_id !== undefined) updates.campaign_id = campaign_id
  if (wa_message !== undefined) updates.wa_message = wa_message
  if (description !== undefined) updates.description = description
  if (active !== undefined) updates.active = active

  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const { id } = await params
  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  const { data, error } = await supabase
    .from('links')
    .update({ active: false })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  return NextResponse.json({ success: true })
}
