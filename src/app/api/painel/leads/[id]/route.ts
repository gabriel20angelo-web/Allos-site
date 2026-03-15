import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

const ALLOWED_STAGES = ['novo', 'em_conversa', 'proposta_enviada', 'pagamento_enviado', 'fechado', 'perdido']

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
  const { name, phone, campaign_id, stage, notes, flow } = body

  if (stage !== undefined && !ALLOWED_STAGES.includes(stage)) {
    return NextResponse.json({ error: `Estágio inválido. Estágios permitidos: ${ALLOWED_STAGES.join(', ')}` }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (name !== undefined) updates.name = name.trim()
  if (phone !== undefined) updates.phone = phone
  if (campaign_id !== undefined) updates.campaign_id = campaign_id
  if (stage !== undefined) updates.stage = stage
  if (notes !== undefined) updates.notes = notes
  if (flow !== undefined) updates.flow = flow

  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 })
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
    .from('leads')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 })
  return NextResponse.json({ success: true })
}
