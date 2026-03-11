import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// POST — avaliador marca disponibilidade em um slot
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const body = await req.json()

  // Primeiro, verificar ou criar o avaliador pelo nome
  let avaliadorId = body.avaliador_id

  if (!avaliadorId && body.avaliador_nome) {
    // Buscar avaliador existente pelo nome
    const { data: existing } = await supabase
      .from('avaliadores')
      .select('id')
      .eq('nome', body.avaliador_nome)
      .single()

    if (existing) {
      avaliadorId = existing.id
    } else {
      // Criar novo avaliador
      const { data: novo, error: erroNovo } = await supabase
        .from('avaliadores')
        .insert({ nome: body.avaliador_nome })
        .select()
        .single()

      if (erroNovo) {
        return NextResponse.json({ error: erroNovo.message }, { status: 500 })
      }
      avaliadorId = novo.id
    }
  }

  // Marcar disponibilidade
  const { data: disp, error } = await supabase
    .from('avaliador_disponibilidade')
    .insert({
      avaliador_id: avaliadorId,
      slot_id: body.slot_id,
    })
    .select(`
      *,
      avaliadores ( id, nome )
    `)
    .single()

  if (error) {
    if (error.message.includes('Limite de avaliadores')) {
      return NextResponse.json({ error: 'Este horário já tem o máximo de avaliadores' }, { status: 409 })
    }
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Você já marcou disponibilidade neste horário' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(disp)
}

// DELETE — avaliador remove sua disponibilidade
export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  }

  const { error } = await supabase
    .from('avaliador_disponibilidade')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
