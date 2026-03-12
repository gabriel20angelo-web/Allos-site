import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin()
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const condutorId = url.searchParams.get('condutor_id')

  let query = admin
    .from('cert_submissions')
    .select('*, cert_certificados(id, codigo_verificacao)')
    .order('criado_em', { ascending: false })
    .range(offset, offset + limit - 1)

  if (condutorId) {
    query = query.contains('condutores_ids', [condutorId])
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count })
}
