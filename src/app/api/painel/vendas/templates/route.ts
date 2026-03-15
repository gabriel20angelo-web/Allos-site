export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { validatePainelAuth } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const supabase = getSupabaseAdmin()
  const flow = req.nextUrl.searchParams.get('flow')

  let query = supabase
    .from('sales_templates')
    .select('*')
    .order('stage')
    .order('sort_order', { ascending: true })

  if (flow) {
    query = query.eq('flow', flow)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
