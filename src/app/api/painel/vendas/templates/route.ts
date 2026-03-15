export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const flow = req.nextUrl.searchParams.get('flow')

  let query = supabase
    .from('sales_templates')
    .select('*')

  if (flow) {
    query = query.eq('flow', flow)
  }

  query = query.order('stage').order('sort_order', { ascending: true })

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  const { flow, stage, template_key, title, body, sort_order, is_objection } = await req.json()

  if (!flow || !stage || !title) {
    return NextResponse.json({ error: 'flow, stage e title são obrigatórios.' }, { status: 400 })
  }

  const key = template_key || `${stage}_${Date.now()}`

  const { data, error } = await supabase
    .from('sales_templates')
    .insert({
      flow,
      stage,
      template_key: key,
      title,
      body: body || '',
      sort_order: sort_order ?? 0,
      is_objection: is_objection ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
