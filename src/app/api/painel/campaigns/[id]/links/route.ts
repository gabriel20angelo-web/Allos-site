export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const { id } = await params
  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  const { data, error } = await supabase
    .from('links_with_stats')
    .select('*')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
