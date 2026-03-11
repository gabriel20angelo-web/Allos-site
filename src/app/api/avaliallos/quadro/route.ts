import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// GET — quadro da semana (por semana_inicio ou semana atual)
export async function GET(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const semana = new URL(req.url).searchParams.get('semana')

  // Calculate week range
  let monday: Date
  if (semana) {
    monday = new Date(semana + 'T00:00:00')
  } else {
    const now = new Date()
    const day = now.getDay()
    monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  }
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const startStr = monday.toISOString().slice(0, 10)
  const endStr = sunday.toISOString().slice(0, 10)

  const { data: slots, error: e1 } = await sb.from('quadro_slots').select('*').gte('data', startStr).lte('data', endStr).order('data').order('hora')
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  const { data: parts } = await sb.from('quadro_participantes').select('*')

  const result = (slots || []).map(s => ({
    ...s,
    participantes: (parts || []).filter(p => p.quadro_slot_id === s.id),
  }))

  return NextResponse.json({ semana_inicio: startStr, semana_fim: endStr, slots: result })
}

// POST — criar slot no quadro (ou add participante)
export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()

  if (body.action === 'add_slot') {
    // Upsert: se já existe esse data+hora, retorna o existente
    const { data: existing } = await sb.from('quadro_slots').select('*').eq('data', body.data).eq('hora', body.hora).single()
    if (existing) return NextResponse.json(existing)
    const { data, error } = await sb.from('quadro_slots').insert({ data: body.data, hora: body.hora }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (body.action === 'add_participante') {
    const { data, error } = await sb.from('quadro_participantes').insert({
      quadro_slot_id: body.quadro_slot_id,
      tipo: body.tipo,
      nome: body.nome,
      telefone: body.telefone || null,
      confirmado: body.confirmado ?? false,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 })
}

// PATCH — toggle confirmado ou editar participante
export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()
  const { data, error } = await sb.from('quadro_participantes').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — remover slot ou participante
export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const tipo = new URL(req.url).searchParams.get('tipo')
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })

  if (tipo === 'slot') {
    const { error } = await sb.from('quadro_slots').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await sb.from('quadro_participantes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
