import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseAdmin()

  const { data: slots, error: e1 } = await sb.from('slots').select('*').order('data', { ascending: true }).order('hora', { ascending: true })
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  const { data: disps } = await sb.from('avaliador_disponibilidade').select('*, avaliadores ( id, nome )')
  const { data: bks } = await sb.from('bookings').select('*, avaliados ( id, nome_completo, telefone, categoria, status )')

  const result = (slots || []).map(s => ({
    ...s,
    avaliador_disponibilidade: (disps || []).filter(d => d.slot_id === s.id),
    bookings: (bks || []).filter(b => b.slot_id === s.id),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  const { data, error } = await sb.from('slots').insert({ data: body.data, hora: body.hora, max_avaliadores: body.max_avaliadores ?? 2, max_avaliados: body.max_avaliados ?? 2, ativo: true, no_formulario: body.no_formulario ?? false, criado_por: body.criado_por || null }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()
  const { data, error } = await sb.from('slots').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('slots').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
