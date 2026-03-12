import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin()
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  let query = admin.from('cert_submissions').select('*')

  if (from) query = query.gte('criado_em', `${from}T00:00:00`)
  if (to) query = query.lte('criado_em', `${to}T23:59:59`)

  const { data: submissions, error } = await query.order('criado_em', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get all conductors for reference
  const { data: condutores } = await admin
    .from('cert_condutores')
    .select('*')
    .order('nome')

  // Get all activities
  const { data: atividades } = await admin
    .from('cert_atividades')
    .select('*')
    .order('nome')

  // Certificate count
  const { count: certCount } = await admin
    .from('cert_certificados')
    .select('*', { count: 'exact', head: true })

  // Compute conductor stats
  const condutorStats: Record<string, { nome: string; totalNotas: number; somaNotas: number; feedbacks: number }> = {}

  for (const sub of submissions || []) {
    const nomes = sub.condutores_nomes as string[] || []
    const ids = sub.condutores_ids as string[] || []
    for (let i = 0; i < ids.length; i++) {
      const cid = ids[i]
      if (!condutorStats[cid]) {
        condutorStats[cid] = { nome: nomes[i] || 'Desconhecido', totalNotas: 0, somaNotas: 0, feedbacks: 0 }
      }
      condutorStats[cid].feedbacks++
      if (sub.nota_condutor) {
        condutorStats[cid].totalNotas++
        condutorStats[cid].somaNotas += sub.nota_condutor
      }
    }
  }

  // Daily submission counts
  const dailyCounts: Record<string, number> = {}
  for (const sub of submissions || []) {
    const day = sub.criado_em?.split('T')[0]
    if (day) dailyCounts[day] = (dailyCounts[day] || 0) + 1
  }

  return NextResponse.json({
    submissions,
    condutores,
    atividades,
    certCount,
    condutorStats,
    dailyCounts,
    totalSubmissions: submissions?.length || 0,
  })
}
