export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const period = req.nextUrl.searchParams.get('period') || 'all'

  // Build period filter
  let periodFilter: string | null = null
  if (period === 'today') {
    periodFilter = new Date().toISOString().split('T')[0]
  } else if (period === '7d') {
    periodFilter = new Date(Date.now() - 7 * 86400000).toISOString()
  } else if (period === '30d') {
    periodFilter = new Date(Date.now() - 30 * 86400000).toISOString()
  }

  // Total clicks with period filter
  let totalClicksQuery = supabase.from('clicks').select('id', { count: 'exact', head: true })
  if (periodFilter) {
    totalClicksQuery = totalClicksQuery.gte('clicked_at', periodFilter)
  }
  const { count: total_clicks } = await totalClicksQuery

  // Clicks today
  const today = new Date().toISOString().split('T')[0]
  const { count: clicks_today } = await supabase
    .from('clicks')
    .select('id', { count: 'exact', head: true })
    .gte('clicked_at', today)

  // Clicks this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const { count: clicks_week } = await supabase
    .from('clicks')
    .select('id', { count: 'exact', head: true })
    .gte('clicked_at', weekStart.toISOString().split('T')[0])

  // Top link - from links_with_stats view
  const { data: topLinks } = await supabase
    .from('links_with_stats')
    .select('slug, description, total_clicks')
    .eq('active', true)
    .order('total_clicks', { ascending: false })
    .limit(1)

  const top_link = topLinks && topLinks.length > 0 ? topLinks[0] : null

  // Active links count
  const { count: active_links } = await supabase
    .from('links')
    .select('id', { count: 'exact', head: true })
    .eq('active', true)

  return NextResponse.json({
    total_clicks: total_clicks || 0,
    clicks_today: clicks_today || 0,
    clicks_week: clicks_week || 0,
    top_link,
    active_links: active_links || 0,
  })
}
