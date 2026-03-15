export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const stage = req.nextUrl.searchParams.get('stage')
  const campaign_id = req.nextUrl.searchParams.get('campaign_id')

  let query = supabase
    .from('leads')
    .select('*, campaigns(name, channel)')
    .eq('active', true)
    .order('updated_at', { ascending: false })

  if (stage) {
    query = query.eq('stage', stage)
  }
  if (campaign_id) {
    query = query.eq('campaign_id', campaign_id)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const { name, phone, campaign_id, notes, flow } = await req.json()

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: name.trim(),
      phone: phone || null,
      campaign_id: campaign_id || null,
      notes: notes || '',
      flow: flow || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
