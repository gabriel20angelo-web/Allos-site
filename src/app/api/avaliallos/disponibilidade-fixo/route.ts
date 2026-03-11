import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  let avaliadorId = body.avaliador_id
  if (!avaliadorId && body.avaliador_nome) {
    const { data: ex } = await sb.from('avaliadores').select('id').eq('nome', body.avaliador_nome).single()
    if (ex) { avaliadorId = ex.id }
    else { const { data: nv } = await sb.from('avaliadores').insert({ nome: body.avaliador_nome }).select().single(); avaliadorId = nv?.id }
  }
  const { data, error } = await sb.from('avaliador_disp_fixo').insert({ avaliador_id: avaliadorId, slot_fixo_id: body.slot_fixo_id }).select(`*, avaliadores ( id, nome )`).single()
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Já marcado' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('avaliador_disp_fixo').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
