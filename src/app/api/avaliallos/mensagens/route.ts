import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseAdmin()
  const { data, error } = await sb.from('mensagens_whatsapp').select('*').order('tipo')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  const { data, error } = await sb.from('mensagens_whatsapp').update({ template: body.template, atualizado_em: new Date().toISOString() }).eq('tipo', body.tipo).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
