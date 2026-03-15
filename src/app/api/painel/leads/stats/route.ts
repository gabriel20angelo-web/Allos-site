export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  // Get all active leads with campaign info
  const { data: leads, error } = await supabase
    .from('leads')
    .select('stage, campaign_id, campaigns(name)')
    .eq('active', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by stage
  const byStage: Record<string, number> = {}
  const byCampaignStage: Record<string, Record<string, number>> = {}

  for (const lead of leads || []) {
    const stage = lead.stage || 'novo'

    // Count by stage
    byStage[stage] = (byStage[stage] || 0) + 1

    // Count by campaign + stage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaigns = lead.campaigns as any
    const campaignName: string = (Array.isArray(campaigns) ? campaigns[0]?.name : campaigns?.name) || 'Sem campanha'
    if (!byCampaignStage[campaignName]) {
      byCampaignStage[campaignName] = {}
    }
    byCampaignStage[campaignName][stage] = (byCampaignStage[campaignName][stage] || 0) + 1
  }

  return NextResponse.json({
    total: leads?.length || 0,
    by_stage: byStage,
    by_campaign_stage: byCampaignStage,
  })
}
