import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// POST — candidato reserva um horário (com lista de espera)
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const body = await req.json()

  // Verificar se o slot existe e está ativo
  const { data: slot } = await supabase
    .from('slots')
    .select(`
      *,
      bookings ( id )
    `)
    .eq('id', body.slot_id)
    .eq('ativo', true)
    .single()

  if (!slot) {
    return NextResponse.json({ error: 'Horário não encontrado ou inativo' }, { status: 404 })
  }

  const bookingsCount = slot.bookings?.length ?? 0
  const isWaitlist = bookingsCount >= slot.max_avaliados

  // Inserir booking (o trigger vai barrar se tiver limite no DB,
  // então removemos o trigger e controlamos aqui com lista de espera)
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      avaliado_id: body.avaliado_id,
      slot_id: body.slot_id,
    })
    .select(`
      *,
      avaliados ( nome_completo, telefone ),
      slots ( data, hora )
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Marcar status como lista de espera se necessário
  if (isWaitlist) {
    await supabase
      .from('avaliados')
      .update({ status: 'lista_espera' })
      .eq('id', body.avaliado_id)
  }

  return NextResponse.json({ ...booking, lista_espera: isWaitlist })
}

// DELETE — admin remove booking
export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  }

  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
