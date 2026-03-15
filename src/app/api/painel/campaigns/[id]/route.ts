import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { validatePainelAuth } from '@/lib/painel-auth'

const ALLOWED_CHANNELS = ['Instagram', 'Facebook', 'Google Ads', 'Panfleto', 'Indicação', 'Email', 'LinkedIn', 'Outro']

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const { id } = await params
  const supabase = getSupabaseAdmin()
  const body = await req.json()
  const { name, channel, active } = body

  if (channel !== undefined && !ALLOWED_CHANNELS.includes(channel)) {
    return NextResponse.json({ error: `Canal inválido. Canais permitidos: ${ALLOWED_CHANNELS.join(', ')}` }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name.trim()
  if (channel !== undefined) updates.channel = channel
  if (active !== undefined) updates.active = active

  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Campanha não encontrada.' }, { status: 404 })
  return NextResponse.json(data)
}
