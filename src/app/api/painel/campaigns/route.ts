export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { validatePainelAuth } from '@/lib/painel-auth'

const ALLOWED_CHANNELS = ['Instagram', 'Facebook', 'Google Ads', 'Panfleto', 'Indicação', 'Email', 'LinkedIn', 'Outro']

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('campaign_stats')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const supabase = getSupabaseAdmin()
  const { name, channel } = await req.json()

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Nome da campanha é obrigatório.' }, { status: 400 })
  }
  if (!channel || !ALLOWED_CHANNELS.includes(channel)) {
    return NextResponse.json({ error: `Canal inválido. Canais permitidos: ${ALLOWED_CHANNELS.join(', ')}` }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({ name: name.trim(), channel })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
