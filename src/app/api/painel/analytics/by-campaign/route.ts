export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  const { data, error } = await supabase
    .from('campaign_stats')
    .select('*')
    .order('total_clicks', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
