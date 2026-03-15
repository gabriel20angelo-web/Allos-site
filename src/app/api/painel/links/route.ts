export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const { data, error } = await supabase
    .from('links_with_stats')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const { slug, campaign_id, wa_message, description } = await req.json()

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug inválido. Use apenas letras minúsculas, números e hífen.' }, { status: 400 })
  }
  if (!campaign_id || !wa_message) {
    return NextResponse.json({ error: 'Campanha e mensagem de WhatsApp são obrigatórios.' }, { status: 400 })
  }

  // Check for duplicate slug
  const { data: existing } = await supabase.from('links').select('id').eq('slug', slug).single()
  if (existing) {
    return NextResponse.json({ error: 'Este slug já está em uso.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('links')
    .insert({ slug, campaign_id, wa_message, description: description || '' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
