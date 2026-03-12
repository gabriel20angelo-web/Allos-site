import { NextRequest, NextResponse } from 'next/server'
import { supabase, getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('cert_condutores')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const admin = getSupabaseAdmin()

  if (body.action === 'create') {
    const { data, error } = await admin
      .from('cert_condutores')
      .insert({ nome: body.nome })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (body.action === 'update') {
    const { data, error } = await admin
      .from('cert_condutores')
      .update({ nome: body.nome, ativo: body.ativo })
      .eq('id', body.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (body.action === 'delete') {
    const { error } = await admin
      .from('cert_condutores')
      .update({ ativo: false })
      .eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
}
