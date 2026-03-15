import { NextRequest, NextResponse } from 'next/server'
import { SEED_TEMPLATES } from '@/lib/seed-templates'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError

  // Delete all existing templates
  const { error: deleteError } = await supabase
    .from('sales_templates')
    .delete()
    .neq('id', 0) // Supabase requires a filter for delete; this matches all rows

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  // Insert seed templates
  const { data, error: insertError } = await supabase
    .from('sales_templates')
    .insert(SEED_TEMPLATES)
    .select()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json({ success: true, count: data.length })
}
