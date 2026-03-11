import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// GET — lista todas as mensagens
export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('mensagens_whatsapp')
    .select('*')
    .order('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — admin edita uma mensagem
export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const body = await req.json()
  const { tipo, template, titulo } = body

  const updates: Record<string, string> = { atualizado_em: new Date().toISOString() }
  if (template) updates.template = template
  if (titulo) updates.titulo = titulo

  const { data, error } = await supabase
    .from('mensagens_whatsapp')
    .update(updates)
    .eq('tipo', tipo)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
