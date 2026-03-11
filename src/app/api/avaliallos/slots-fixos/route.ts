import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseAdmin()

  // Buscar fixos
  const { data: fixos, error: e1 } = await sb.from('slots_fixos').select('*').order('dia_semana').order('hora')
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  // Buscar disponibilidades com avaliadores
  const { data: disps, error: e2 } = await sb.from('avaliador_disp_fixo').select('*, avaliadores ( id, nome )')
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })

  // Juntar manualmente
  const result = (fixos || []).map(f => ({
    ...f,
    avaliador_disp_fixo: (disps || []).filter(d => d.slot_fixo_id === f.id),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  const { data, error } = await sb.from('slots_fixos').insert({ dia_semana: body.dia_semana, hora: body.hora, ativo: true }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()
  const { data, error } = await sb.from('slots_fixos').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('slots_fixos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
