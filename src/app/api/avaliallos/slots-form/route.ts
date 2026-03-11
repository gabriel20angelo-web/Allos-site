import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseAdmin()
  const { data, error } = await sb.from('slots_formulario').select('*').order('data').order('hora')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  const { data, error } = await sb.from('slots_formulario').insert({ data: body.data, hora: body.hora, ativo: true }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await sb.from('slots_formulario').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('slots_formulario').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
